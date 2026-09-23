#!/usr/bin/env python3
"""
build-audio-sync.py — turn a book's narration into synced reading data.
Version 3 · last updated 2026-09-22 22:18 PDT

    python3 build-audio-sync.py 01 /path/to/source-audio.mp3

Reads read/NN.json (the paragraphs build-reader.py already pulled from the
PDF) and a source recording, and produces two files:

    assets/audio/NN.mp3   — the recording, recompressed for the web
    read/NN.sync.json     — sentence-by-sentence start/end times

The site never needs true word-level timing (see the note in
ADDING-AUDIO.md for why that was tried and dropped) — sentences are the
unit forced-alignment can place reliably, and the reader highlights one
at a time as the recording plays.

Alignment is done with aeneas (github.com/readbeyond/aeneas), which uses
eSpeak to synthesize the given text and DTW/MFCC to match it against the
real recording — no internet-dependent speech model, no transcription
step, and it doesn't care whether the reading deviates a little from the
page. Requires: aeneas, espeak-ng, ffmpeg (all already set up on this
machine — see ADDING-AUDIO.md if starting fresh elsewhere).

A recording that opens with music or silence before the first word is
handled with --intro: the front is trimmed off before aligning and the same
number of seconds is added back to every timestamp, so the sync file matches
the file that ships, intro and all.

Usage:
    python3 build-audio-sync.py NN /path/to/recording.mp3 [--bitrate 48k]
    python3 build-audio-sync.py 35 35.mp3 --intro 11
"""
import argparse
import html
import json
import math
import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.abspath(__file__))

# ---- aeneas's vendored wavfile.py calls numpy.fromstring() in binary
# mode, which numpy >= 2.0 removed outright. Patch the one function that
# uses it, in-process, rather than requiring a hand-edited site-packages
# file on every machine this ever runs on. ------------------------------
def _patch_aeneas_numpy2():
    import numpy as np
    import aeneas.wavfile as wavfile

    def _read_data_chunk(fid, comp, noc, bits, mmap=False):
        size = struct.unpack("<i", fid.read(4))[0]
        nbytes = bits // 8
        if bits == 8:
            dtype = "u1"
        else:
            dtype = "<" + ("i%d" % nbytes if comp == 1 else "f%d" % nbytes)
        if not mmap:
            data = np.frombuffer(fid.read(size), dtype=dtype)
        else:
            start = fid.tell()
            data = np.memmap(fid, dtype=dtype, mode="c", offset=start,
                              shape=(size // nbytes,))
            fid.seek(start + size)
        if noc > 1:
            data = data.reshape(-1, noc)
        return data

    wavfile._read_data_chunk = _read_data_chunk


TAG_RE = re.compile(r"<[^>]+>")
# An abbreviation's full stop is not the end of a sentence. Only one of these
# actually occurs in the catalogue — every reader file now opens "Roya
# Publication No. NN", and without the guard the number is split off as a
# fragment of its own, so the highlight sits alone on "35" for a second and a
# half before the byline. The rest are here because they cost nothing and a
# book will eventually carry one.
ABBREV = r"(?<!\bNo\.)(?<!\bMr\.)(?<!\bMrs\.)(?<!\bMs\.)(?<!\bDr\.)(?<!\bSt\.)(?<!\bvs\.)"
SENT_SPLIT = re.compile(ABBREV + r"(?<=[.!?])\s+(?=[A-Z0-9“‘])")

# The only inline tag build-reader.py ever emits into read/NN.json. If a
# new one is ever added, extend this rather than the regex below.
INLINE_TAG = "em"


def _strip_with_map(raw):
    """Removes tags and returns (clean_text, offsets), where offsets[i]
    is raw's character index that clean_text[i] came from — so a span
    picked out of clean_text can be mapped back onto raw exactly."""
    clean_chars = []
    offsets = []
    i = 0
    n = len(raw)
    while i < n:
        if raw[i] == "<":
            j = raw.find(">", i)
            if j == -1:
                clean_chars.append(raw[i])
                offsets.append(i)
                i += 1
            else:
                i = j + 1
        else:
            clean_chars.append(raw[i])
            offsets.append(i)
            i += 1
    return "".join(clean_chars), offsets


def _normalise_for_speech(text):
    """Punctuation aeneas's TTS reads oddly — applied only to the text
    handed to the aligner, never to what's shown to a reader. Character
    count and positions are preserved so the offset map upstream still
    lines up (each run is replaced with a same-length run of commas/
    spaces, never inserted or deleted)."""
    t = html.unescape(text)
    out = []
    for ch in t:
        out.append("," if ch in "—–" else ch)
    return "".join(out)


def _slice_with_tags(raw, start, end):
    """raw[start:end], with any <em> left open at `start` reopened at the
    front and any left unclosed at `end` closed at the back — so a slice
    that lands mid-italic still parses as HTML on its own.

    Bug fixed here: the old check for "does this slice need a closing
    tag" looked only inside body (raw[start:end]) for an unmatched
    <em> — so a slice like "<em>foo" (body has zero tags in it at all,
    because start already sits just past the opening tag) never
    triggered it. The italic stayed open, and every block rendered
    after it in the page inherited it: a browser reconstructs an
    unclosed inline tag through however many block-level elements
    follow until some later </em> happens to close it. One `<em>` with
    no matching close in read/NN.json could italicise the rest of the
    book. What actually matters is whether the tag is still open at
    `end` — counted against the whole of `raw`, not just body — so
    that's what decides whether to append the close now."""
    open_tag = "<%s>" % INLINE_TAG
    close_tag = "</%s>" % INLINE_TAG
    open_before = raw.count(open_tag, 0, start) > raw.count(close_tag, 0, start)
    open_at_end = raw.count(open_tag, 0, end) > raw.count(close_tag, 0, end)
    body = raw[start:end]
    if open_before:
        body = open_tag + body
    if open_at_end:
        body = body + close_tag
    return body.strip()


# build-reader.py puts this line in front of a book's glossary, and
# make_narration_pdf.py stops there: the glossary is NOT read aloud. So it must
# not be aligned either. Left in, its words have no audio to match and the
# aligner pays for them by stretching everything else — on No. 7 that is 2,492
# words, an eighth of the book, and it made the whole alignment unstable:
# four runs at different settings disagreed by up to two and a half minutes.
# Cut here and the same four runs agree. Only trailing blocks are dropped, so
# every block index the sync file quotes still means what it meant.
GLOSSARY_NOTE = "For the glossary, see the PDF edition of this book."


def spoken_blocks(blocks):
    """The part of the reader file the recording actually contains."""
    for i, b in enumerate(blocks):
        plain = re.sub("<[^>]+>", "", b["h"]).strip()
        if plain == GLOSSARY_NOTE or plain.upper() == "GLOSSARY":
            return blocks[:i], len(blocks) - i
    return blocks, 0


def build_fragments(blocks):
    """Returns (fragment_ids, clean_texts, orig_html_per_fragment,
    block_index_per_fragment). One fragment per sentence (or per whole
    heading); order matches read/NN.json. Sentence boundaries are found
    in the tag-stripped text (where the punctuation regex behaves) and
    then mapped back onto the original HTML, so an <em> that spans a
    sentence break no longer drops the whole block."""
    frag_ids, clean_texts, orig_texts, block_idx = [], [], [], []
    for bi, b in enumerate(blocks):
        raw = b["h"]
        if not raw.strip():
            continue

        # Sentence boundaries are found on this tag-stripped copy; offsets
        # maps each of its characters back to raw's index. Left un-
        # unescaped on purpose — html.unescape can change length (e.g.
        # "&amp;" -> "&"), which would break that mapping. Entities are
        # rare in this data (only ever "'" and the like inside dialogue,
        # never spanning a sentence boundary), so it costs nothing here.
        stripped, offsets = _strip_with_map(raw)

        if b["t"] == "h":
            spans = [(0, len(stripped))]
        else:
            spans = []
            pos = 0
            for m in SENT_SPLIT.finditer(stripped):
                spans.append((pos, m.start()))
                pos = m.end()
            spans.append((pos, len(stripped)))
            spans = [(s, e) for s, e in spans if stripped[s:e].strip()]

        for si, (s, e) in enumerate(spans):
            orig_start = offsets[s] if s < len(offsets) else len(raw)
            orig_end = (offsets[e - 1] + 1) if e > s and e - 1 < len(offsets) else orig_start
            orig_slice = _slice_with_tags(raw, orig_start, orig_end)
            clean_slice = _normalise_for_speech(stripped[s:e]).strip()
            if not clean_slice or not orig_slice:
                continue
            frag_ids.append("b%04ds%03d" % (bi, si))
            clean_texts.append(clean_slice)
            orig_texts.append(orig_slice)
            block_idx.append(bi)
    return frag_ids, clean_texts, orig_texts, block_idx


def run_aeneas(wav_path, frag_ids, clean_texts, workdir, mfcc_shift=None, dtw_margin=None):
    frag_txt = os.path.join(workdir, "fragments.txt")
    with open(frag_txt, "w", encoding="utf-8") as f:
        f.write("\n".join("%s|%s" % (i, t) for i, t in zip(frag_ids, clean_texts)))

    from aeneas.task import Task
    from aeneas.executetask import ExecuteTask

    config = "task_language=eng|is_text_type=plain|os_task_file_format=json"
    task = Task(config_string=config)
    task.audio_file_path_absolute = wav_path
    task.text_file_path_absolute = frag_txt
    task.sync_map_file_path_absolute = os.path.join(workdir, "sync.json")

    rconf = None
    if mfcc_shift or dtw_margin:
        from aeneas.runtimeconfiguration import RuntimeConfiguration
        rconf = RuntimeConfiguration()
        if mfcc_shift:
            rconf[RuntimeConfiguration.MFCC_WINDOW_SHIFT] = mfcc_shift
            rconf[RuntimeConfiguration.MFCC_WINDOW_LENGTH] = max(0.100, mfcc_shift * 2)
        if dtw_margin:
            rconf[RuntimeConfiguration.DTW_MARGIN] = dtw_margin

    ExecuteTask(task, rconf=rconf).execute()
    task.output_sync_map_file()

    with open(task.sync_map_file_path_absolute, encoding="utf-8") as f:
        return json.load(f)["fragments"]


def audio_duration(path):
    """Seconds, via ffprobe. Used to pick the aligner's frame size and to
    stamp the sync file with the delivered recording's real length."""
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", path],
        capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def mfcc_shift_for(duration, margin=60.0, budget_bytes=2.2e9):
    """aeneas aligns with a striped DTW: it holds a cost matrix of
    (audio frames) x (2 x margin in frames), float64. At the default 40ms
    frame that is 16 * duration * margin / shift**2 bytes — which for a
    one-hour book is 2.2 GB and fine, and for No. 35 (2h50m) is 6.1 GB,
    which is exactly where it was killed on an 8 GB machine.

    Memory falls with the SQUARE of the frame shift, so a coarser frame
    is the cheap fix: 65ms instead of 40ms brings the same book under
    2.2 GB. What that costs is time resolution — boundaries land on a
    65ms grid instead of a 40ms one — and this file syncs whole
    sentences, which are seconds long. Nothing else changes: the margin
    stays the full 60 seconds, and the alignment is still one pass over
    the whole recording rather than a chain of windows, each of which
    would pin its last sentence to its own cut.

    Returns None for anything short enough to leave alone."""
    need = math.sqrt(16.0 * duration * margin / budget_bytes)
    if need <= 0.040:
        return None
    return math.ceil(need * 1000.0) / 1000.0


def to_wav(src, workdir, skip=0.0):
    """16k mono PCM for the aligner. `skip` drops that many seconds off the
    front in the same pass — an intro is cut here rather than by copying the
    mp3 first, because a stream copy can only cut on a frame boundary and
    this decode is sample-accurate."""
    wav_path = os.path.join(workdir, "audio.wav")
    cut = ["-ss", "%.3f" % skip] if skip > 0 else []
    subprocess.run(
        ["ffmpeg", "-y"] + cut + ["-i", src, "-ac", "1", "-ar", "16000",
         "-sample_fmt", "s16", wav_path, "-hide_banner", "-loglevel", "error"],
        check=True,
    )
    return wav_path


def compress_for_web(src, dest, bitrate):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-y", "-i", src, "-ac", "1", "-b:a", bitrate,
         "-c:a", "libmp3lame", dest, "-hide_banner", "-loglevel", "error"],
        check=True,
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("book", help="two-digit book number, e.g. 01")
    ap.add_argument("audio", help="path to the source recording")
    ap.add_argument("--bitrate", default="48k",
                     help="delivered mp3 bitrate (default 48k — clean for speech, mono, "
                          "and keeps the per-book size down as more recordings are added)")
    ap.add_argument("--intro", type=float, default=0.0,
                     help="seconds of music/silence before the text begins in the "
                          "delivered recording. Trimmed before aligning and added "
                          "back to every timestamp afterwards.")
    ap.add_argument("--align-audio", default=None,
                     help="optional pre-trimmed copy to align against (skips the "
                          "internal trim; --intro is still added to the results)")
    ap.add_argument("--no-compress", action="store_true",
                     help="skip writing assets/audio/NN.mp3 (the delivered file "
                          "already exists)")
    ap.add_argument("--duration", type=float, default=None,
                     help="override the delivered recording's length in seconds "
                          "(when --align-audio points at a trimmed copy and the "
                          "full file isn't on this machine)")
    ap.add_argument("--dtw-margin", type=float, default=None,
                     help="how far, in seconds, the aligner may wander from a straight "
                          "reading pace (aeneas default 60). A recording whose pace "
                          "drifts further than this gets clipped to the band and the "
                          "result stops being trustworthy.")
    ap.add_argument("--mfcc-shift", type=float, default=None,
                     help="force the aligner's frame shift in seconds (default: "
                          "chosen from the recording's length, see mfcc_shift_for)")
    ap.add_argument("--keep-workdir", action="store_true")
    args = ap.parse_args()

    nn = args.book.zfill(2)
    read_path = os.path.join(ROOT, "read", nn + ".json")
    if not os.path.exists(read_path):
        sys.exit("No read/%s.json — run build-reader.py %s first." % (nn, nn))

    with open(read_path, encoding="utf-8") as f:
        blocks = json.load(f)["blocks"]

    _patch_aeneas_numpy2()

    blocks, dropped = spoken_blocks(blocks)
    if dropped:
        print("Stopping at the glossary: %d block(s) at the end are not narrated "
              "and are left out of the alignment." % dropped)
    frag_ids, clean_texts, orig_texts, block_idx = build_fragments(blocks)
    print("%d sentence-level fragments across %d blocks" % (len(frag_ids), len(blocks)))

    workdir = tempfile.mkdtemp(prefix="audiosync-")
    try:
        print("Converting source audio for alignment...")
        # --align-audio is a copy that has ALREADY had the intro cut off it;
        # without one the intro comes off here, in the same pass.
        skip = 0.0 if args.align_audio else args.intro
        if skip:
            print("Dropping %.1fs of intro before aligning." % skip)
        wav_path = to_wav(args.align_audio or args.audio, workdir, skip)

        align_dur = audio_duration(wav_path)
        shift = args.mfcc_shift or mfcc_shift_for(align_dur)
        if shift:
            print("Aligning (aeneas) — %.0f min of audio, %dms frame to stay "
                  "inside memory..." % (align_dur / 60.0, round(shift * 1000)))
        else:
            print("Aligning (aeneas)...")
        fragments = run_aeneas(wav_path, frag_ids, clean_texts, workdir, shift, args.dtw_margin)

        by_id = {}
        for f in fragments:
            fid = f["lines"][0].split("|", 1)[0]
            by_id[fid] = (float(f["begin"]), float(f["end"]))

        collapsed = sum(1 for b, e in by_id.values() if e - b < 0.05)
        if collapsed:
            print("WARNING: %d of %d fragments collapsed to near-zero duration — "
                  "check the source recording matches the text closely."
                  % (collapsed, len(by_id)))

        blocks_out = {}
        for fid, orig, bi in zip(frag_ids, orig_texts, block_idx):
            if fid not in by_id:
                continue
            start, end = by_id[fid]
            start += args.intro
            end += args.intro
            blocks_out.setdefault(bi, []).append(
                {"html": orig, "start": round(start, 2), "end": round(end, 2)}
            )

        # Every sentence's own html has to be independently well-formed —
        # one with an <em> left open bleeds italic through every block
        # the page renders after it (see the note on _slice_with_tags).
        # Cheap to catch here, expensive to catch by eye in the reader.
        unbalanced = [orig for orig in orig_texts
                      if orig.count("<em>") != orig.count("</em>")]
        if unbalanced:
            print("WARNING: %d sentence(s) have an unmatched <em>/</em> — "
                  "italics would leak into everything rendered after them. "
                  "First one: %r" % (len(unbalanced), unbalanced[0][:80]))

        missing = [f for f in frag_ids if f not in by_id]
        if missing:
            print("WARNING: %d of %d fragments were not placed by the aligner "
                  "and are left out of the sync file." % (len(missing), len(frag_ids)))

        # The delivered recording's own length, intro included — not the
        # last sentence's end time, which stops short of any outro.
        try:
            duration = args.duration or audio_duration(args.audio)
        except Exception:
            duration = max((e for _, e in by_id.values()), default=0) + args.intro
        out = {
            "duration": round(duration, 2),
            "blocks": [{"i": bi, "sentences": blocks_out[bi]}
                       for bi in sorted(blocks_out)],
        }

        sync_path = os.path.join(ROOT, "read", nn + ".sync.json")
        with open(sync_path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
        print("Wrote", sync_path)

        mp3_dest = os.path.join(ROOT, "assets", "audio", nn + ".mp3")
        if args.no_compress:
            print("Skipping compression (--no-compress).")
            return
        print("Compressing delivered audio at %s..." % args.bitrate)
        compress_for_web(args.audio, mp3_dest, args.bitrate)
        before = os.path.getsize(args.audio)
        after = os.path.getsize(mp3_dest)
        print("Wrote %s  (%.1f MB -> %.1f MB, %.0f%% of source)" %
              (mp3_dest, before / 1e6, after / 1e6, 100 * after / before))
    finally:
        if args.keep_workdir:
            print("Workdir kept at", workdir)
        else:
            shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    main()
