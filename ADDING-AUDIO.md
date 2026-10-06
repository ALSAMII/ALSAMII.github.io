<!-- Updated 2026-10-05 — the audio moved off the repository to Backblaze B2 -->
# Adding a narration

Two things a book can have, independently of each other:

1. **A download link.** Set `audio: "https://f005.backblazeb2.com/file/roya-audio/NN.mp3"` on the book
   in `stories.js`. That alone puts an Audio icon under Read/PDF in its
   row, linking to the file. Nothing else changes.

   **The recordings do not live in this repository.** They are on
   Backblaze B2, in the public bucket `roya-audio`, and the `audio` field
   carries a whole address rather than a path. `script.js` uses the field
   raw, and `roya-library.js` tests for an absolute address by name and
   leaves it alone, so nothing in the code had to change for this.

2. **The synced, highlighted read-along** inside the Read view — a play
   bar, and the sentence being read lights up as it plays. This needs one
   more file, `read/NN.sync.json`, built from the recording by the script
   below. Without it, `audio` still works as a plain download; the reader
   just doesn't get the in-page player.

Neither is tied to publishing the book. A novella that went up two years
ago can gain a recording tomorrow, and nothing else about it changes.

## Where it shows up

`audio` is read in three places, and adding the one field lights all
three at once:

- **The shelf row** — an Audio control beside Read and PDF, linking
  straight at the file.
- **The Read view** — the play bar, if the sync file is there.
- **The Roya Library** — a small panel headed *Narrated*, offering
  **Listen here** (which opens the book and starts playing) or **Download
  the recording**. Its wording changes on the book's `synced` field: set
  `synced: false` and it promises only that the recording plays while you
  read at your own pace, rather than that the sentence lights up. Leave
  `synced` off and it assumes the highlighted read-along, which is right
  whenever `read/NN.sync.json` exists.

## Which books are narrated

**2**, **5**, **6**, **7**, **8**, **9**, **11**, **12**, **13**, **19**,
**22**, **26**, **31**, **35**, **40**, **52**, **78**, **89** and **102**
carry `audio` today — nineteen books, **43 h 55 m**.

Book 1 is the odd one out: `read/01.sync.json` is still published, but
its recording was never wired up — the `audio` field went missing in the
retitle from *The Memory Liturgy* to *Quiet Street to the Long Evening* —
and the orphaned mp3 was deleted on 2026-10-05. If that narration is
still wanted, upload it to the bucket and add the one line.

### Every recording so far opens with music

Every recording begins with an intro cue of roughly eleven seconds, and
**it is not the same length in any two books** — across the thirteen
measured so far the gap between the music ending and the first word runs
from 10.4s to 14.8s, and **not one of them is actually 11.0**. Measure it
per book rather than assuming eleven; the value used for each:

| book | `--intro` | | book | `--intro` |
|---|---|---|---|---|
| 2 | 12.9 | | 19 | 11.7 |
| 5 | 14.2 | | 22 | 13.4 |
| 8 | 12.8 | | 26 | 14.0 |
| 9 | 13.7 | | 31 | 12.6 |
| 11 | 11.9 | | 40 | 11.7 |
| 12 | 11.5 | | 52 | 12.2 |
| 13 | 14.8 | | 78 | 11.2 |
| 19 | 11.7 | | 89 | 13.2 |
|  |  | | 102 | 11.3 |

To measure a new one, find where the music stops and the voice starts:

```
ffmpeg -hide_banner -ss 0 -t 32 -i recording.mp3 \
       -af "silencedetect=noise=-38dB:d=0.3" -f null -
```

The first `silence_start` is the music ending, the first `silence_end`
is the voice beginning. Use the midpoint. Cutting slightly early is
harmless — the aligner absorbs a little silence — but cutting into the
first word is not.

## ⚠ Audio is NOT cache-busted

Every other asset on the site goes through `stamped()` in `script.js` and
picks up the `?v=` number. **The audio does not** — `stamped()` returns an
absolute address untouched, by design, and `script.js` sets both the
download link and the player's `src` to the bare `s.audio` value. So
**replacing a recording at an address that already shipped will not reach
anyone who has played it once.** If a narration has to be re-cut, upload
it under a new filename rather than overwriting, or accept that returning
listeners keep the old one.

## Building the sync file

```
python3 build-audio-sync.py NN /path/to/recording.mp3
```

The two arguments are the book number and the source file. The options
worth knowing:

| option | default | what it's for |
|---|---|---|
| `--intro N` | `0.0` | seconds of music or announcement before the text starts, so the aligner doesn't try to fit words to it |
| `--bitrate` | `48k` | the compression target. Every shipped recording is **32k** — pass `--bitrate 32k` to match them, or see *A note on hosting* for why 48k is now affordable |
| `--no-compress` | off | keep the source encoding, write the mp3 as-is |
| `--align-audio` | — | align against a different file than the one shipped, for a recording whose clean take and final mix differ |
| `--duration` | — | state the length rather than letting ffmpeg probe it |
| `--dtw-margin`, `--mfcc-shift` | — | aeneas tuning, for a recording the aligner struggles with |
| `--keep-workdir` | off | leave the intermediate files for inspection when something has gone wrong |

This does three things:

- Aligns the recording against `read/NN.json` (the text `build-reader.py`
  already pulled from the PDF) sentence by sentence, and writes
  `read/NN.sync.json`.
- Recompresses the recording for the web — mono, clean for spoken word —
  and writes it to `assets/audio/NN.mp3`. **That file is a staging copy
  and must not be committed.** `assets/audio/*.mp3` is in `.gitignore`
  for exactly this reason. Upload it to the bucket; the address, not the
  path, is what belongs in the `audio:` field.
- Prints the size before and after, so you can see what it did.

Run `build-reader.py NN` first if `read/NN.json` doesn't exist yet.

Then upload it, with the content type set explicitly:

```
b2 file upload --content-type audio/mpeg roya-audio assets/audio/NN.mp3 NN.mp3
```

and add to that book's entry in `stories.js`:

```js
audio: "https://f005.backblazeb2.com/file/roya-audio/NN.mp3"
```

That's it — the reader picks up the sync file automatically for any book
whose `audio` field points at a file it can find a matching sync file for.

## Why sentences, not words

The first version of this synced word by word — a recording run through
[aeneas](https://github.com/readbeyond/aeneas) (which synthesizes the
given text with eSpeak and lines it up against the real audio) split into
one fragment per word. On a test paragraph, roughly half the words
collapsed onto the exact same timestamp as their neighbors: short, common
words — "to," "a," "we," "the" — don't carry enough distinct sound for
the aligner to place a boundary between them, so it gives up and stamps a
run of five or six of them at once. The highlight would have frozen,
then jumped, over and over, through every book.

Aligning in whole sentences instead never failed this way — not once,
across a full 69-minute book, 355 sentences, zero collapses. That's the
unit `build-audio-sync.py` uses. (A middle ground — 3-word phrases,
mechanically aligned then interpolated to the word — also came out clean
in testing, if word-level highlighting is wanted badly enough later to
be worth the extra fragility. Sentence level is the one actually
shipped.)

## What the sync file looks like

```json
{
  "duration": 4152.6,
  "blocks": [
    { "i": 1, "sentences": [
      { "html": "None of us chose the memories we started out with.", "start": 3.04, "end": 8.0 },
      { "html": "A name, a language, a grief...", "start": 8.0, "end": 31.96 }
    ]}
  ]
}
```

`i` is the block's index in `read/NN.json` — headings included, so a
block can be skipped (see below) without shifting anything else out of
place. `html` is the original text for that sentence, italics and all;
`start`/`end` are seconds into the recording.

A block is occasionally left out of the sync file entirely — usually one
where an `<em>` run crosses what looks like a sentence boundary in a way
the script couldn't cleanly separate. That block still reads fine, it
just won't highlight; everything else in the book is unaffected.

**A bug this caught, worth knowing about if a future book's reading
type ever looks wrong out of nowhere:** an earlier version of the
script could hand back a sentence with an `<em>` that opened but never
closed — well-formed on its own inside the JSON, but the moment the
page concatenates every block into one string, an unclosed `<em>`
doesn't stay local. A browser reconstructs it through every block that
follows until some later `</em>` happens to close it, so one bad
sentence could italicise the rest of the book from that point on. Book
1 had sixteen of these. Fixed now — `build-audio-sync.py` checks its
own output for exactly this before it writes the file, and warns if it
ever finds one again.

## What this needs installed

Already set up in this environment:

- **aeneas** (`pip install aeneas`) — the alignment engine. Needs
  **espeak-ng** and **espeak** (`apt-get install espeak-ng espeak
  libespeak-dev`) and **ffmpeg**.
- A one-line patch is applied automatically, in-process, every time
  `build-audio-sync.py` runs — no need to touch the installed aeneas
  files yourself. (aeneas's vendored WAV reader calls a numpy function
  that numpy 2.x removed; the script patches around it at import time.)

If running this on a different machine for the first time, install
those three packages first; everything else `build-audio-sync.py` does
is check the pip/apt packages are present and this document explains
what they're for.

## Where the recordings live

**Backblaze B2, public bucket `roya-audio`.** Not this repository.

| | |
|---|---|
| address | `https://f005.backblazeb2.com/file/roya-audio/NN.mp3` |
| moved | 2026-10-05, nineteen recordings, 605 MiB |
| repository after | **390 MiB — 38% of the 1 GB Pages limit** |
| cost | pennies a month; 10 GB of storage is free |

### How it got here

The audio was in `assets/audio/` until the repository reached 995 MiB
against the 1 GB hard limit GitHub Pages puts on a published site. Two
options were on the table: re-encode everything smaller, or move the files
off the repository.

Re-encoding was measured and rejected. Dropping the nineteen from 32k to
Opus 16k — the most aggressive setting that is still listenable — would
have taken the repository to 720 MiB, which is roughly ten more books
before the same conversation. At 104 books all narrated it would be about
3.5 GB of audio, three and a half times the entire allowance. No encoder
setting survives that. Moving the files off was the only option that
scales, and it also takes the audio off the Pages bandwidth meter, which
has a soft 100 GB/month limit.

### ⚠ GitHub Releases was tried first, and does not work

Release assets look ideal: they do not count toward the published site
size, GitHub documents no bandwidth cap on them, and the range requests a
scrub bar needs are honoured. The nineteen files were uploaded to a
release tagged `narrations` and the site was pointed at them.

**It plays in Chrome and fails in Safari.** GitHub serves every release
asset as `Content-Type: application/octet-stream` and gives no way to
change that. Chrome treats the content type as a hint and sniffs the bytes;
Safari treats it as the answer and refuses. Half the readers of a book site
are on Safari and every iPhone is.

The release still exists and is worth keeping — it costs nothing, is not
part of the published site, and is a second copy of all nineteen
recordings somewhere other than B2.

### ⚠ The rule this leaves behind

**Any host for these files must send `Content-Type: audio/mpeg`, and the
test for it must be run in Safari.** That is the whole requirement. B2
sends whatever you set at upload, which is why every upload command on
this page passes `--content-type audio/mpeg` explicitly rather than
trusting detection.

Testing in Chrome proves nothing about this. It was tested in Chrome
first, passed everything including seeking, and was declared sound — and
was wrong.

The other half of the test is **seeking**: a host that will not answer a
range request leaves the scrub bar dead and the read-along drifting. Both
checks live in the *Audio Host Check* page; run it against one uploaded
file before moving the rest.

### Bitrate

Every shipped recording is **32kbps mono, 22.05kHz**, which is clean for a
single unaccompanied voice. The script's default is `48k`, so pass
`--bitrate 32k` to match the existing catalogue. Encoding by hand:

```
ffmpeg -i source.mp3 -ac 1 -ar 22050 -b:a 32k -map_metadata -1 assets/audio/NN.mp3
```

Worth knowing: the size pressure that forced 32k is gone. B2 charges
roughly nothing for this much audio, so 48k is affordable again for new
recordings if the quality is worth it. The only cost of mixing the two is
that the catalogue stops being uniform.

## Uploading to the bucket

One file, from anywhere:

```
b2 file upload --content-type audio/mpeg roya-audio assets/audio/NN.mp3 NN.mp3
```

Authorise first with `b2 account authorize` and an application key scoped
to the bucket (B2 → **Application Keys**). The key is shown once. Delete it
when you are done — it ends up in shell history.

Older versions of the CLI spell this `b2 upload-file --contentType ...`.

Browser upload through the B2 console works too and sets `audio/mpeg` from
the extension; it is fine for one file and tedious for nineteen.

## ⚠ numpy 2.x breaks the aligner

`build-audio-sync.py` needs **numpy 1.x**. aeneas ships a compiled C
extension (`aeneas.cmfcc.cmfcc`) built against numpy 1.x; under numpy 2
it fails to import, and aeneas silently falls back to its pure-Python
MFCC, which does not crash — it just runs so slowly a two-hour book will
not finish. If an alignment seems to hang, this is why. Check with:

```
python3 -c "from aeneas.globalfunctions import can_run_c_extension as c; print(c())"
```

`False` means the fallback. Fix with `pip install "numpy==1.26.4"`. With
the C extension working, a four-hour book aligns in about ninety seconds.
