#!/usr/bin/env python3
"""
build-audio-sync.py — turn a book's narration into synced reading data.

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

Usage:
    python3 build-audio-sync.py NN /path/to/recording.mp3 [--bitrate 48k]
"""
import argparse
import html
import json
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
SENT_SPLIT = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9“‘])")

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
    that lands mid-italic still parses as HTML on its own."""
    open_tag = "<%s>" % INLINE_TAG
    close_tag = "</%s>" % INLINE_TAG
    open_before = raw.count(open_tag, 0, start) > raw.count(close_tag, 0, start)
    body = raw[start:end]
    open_within = body.count(open_tag) > body.count(close_tag)
    if open_before:
        body = open_tag + body
    if open_within:
        body = body + close_tag
    return body.strip()


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


def run_aeneas(wav_path, frag_ids, clean_texts, workdir):
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

    ExecuteTask(task).execute()
    task.output_sync_map_file()

    with open(task.sync_map_file_path_absolute, encoding="utf-8") as f:
        return json.load(f)["fragments"]


def to_wav(src, workdir):
    wav_path = os.path.join(workdir, "audio.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-i", src, "-ac", "1", "-ar", "16000",
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
    ap.add_argument("--keep-workdir", action="store_true")
    args = ap.parse_args()

    nn = args.book.zfill(2)
    read_path = os.path.join(ROOT, "read", nn + ".json")
    if not os.path.exists(read_path):
        sys.exit("No read/%s.json — run build-reader.py %s first." % (nn, nn))

    with open(read_path, encoding="utf-8") as f:
        blocks = json.load(f)["blocks"]

    _patch_aeneas_numpy2()

    frag_ids, clean_texts, orig_texts, block_idx = build_fragments(blocks)
    print("%d sentence-level fragments across %d blocks" % (len(frag_ids), len(blocks)))

    workdir = tempfile.mkdtemp(prefix="audiosync-")
    try:
        print("Converting source audio for alignment...")
        wav_path = to_wav(args.audio, workdir)

        print("Aligning (aeneas)...")
        fragments = run_aeneas(wav_path, frag_ids, clean_texts, workdir)

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
            start, end = by_id[fid]
            blocks_out.setdefault(bi, []).append(
                {"html": orig, "start": round(start, 2), "end": round(end, 2)}
            )

        duration = max((e for _, e in by_id.values()), default=0)
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
