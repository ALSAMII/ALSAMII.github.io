<!-- Updated 2026-09-25 -->
# Adding a narration

Two things a book can have, independently of each other:

1. **A download link.** Set `audio: "assets/audio/NN.mp3"` on the book in
   `stories.js`. That alone puts an Audio icon under Read/PDF in its row,
   linking to the file. Nothing else changes.

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

**6**, **7** and **35** carry `audio` today.

⚠ **Book 1's recording is orphaned.** `assets/audio/01.mp3` (24 MB) and
`read/01.sync.json` are both published and both fetchable by URL, but
book 1 has no `audio` field, so nothing on the site links to either.
Almost certainly fallout from the retitle from *The Memory Liturgy* to
*Quiet Street to the Long Evening*. One line in `stories.js` fixes it, if
the recording is still wanted.

## ⚠ Audio is NOT cache-busted

Every other asset on the site goes through `stamped()` in `script.js` and
picks up the `?v=` number. **The audio does not** — `script.js` sets both
the download link and the player's `src` to the bare `s.audio` path. So
**replacing a recording at a path that already shipped will not reach
anyone who has played it once.** If a narration has to be re-cut, give it
a new filename rather than overwriting, or accept that returning
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
| `--bitrate` | `48k` | the compression target; see hosting below |
| `--no-compress` | off | keep the source encoding, write the mp3 as-is |
| `--align-audio` | — | align against a different file than the one shipped, for a recording whose clean take and final mix differ |
| `--duration` | — | state the length rather than letting ffmpeg probe it |
| `--dtw-margin`, `--mfcc-shift` | — | aeneas tuning, for a recording the aligner struggles with |
| `--keep-workdir` | off | leave the intermediate files for inspection when something has gone wrong |

This does three things:

- Aligns the recording against `read/NN.json` (the text `build-reader.py`
  already pulled from the PDF) sentence by sentence, and writes
  `read/NN.sync.json`.
- Recompresses the recording for the web — mono, 48kbps, clean for
  spoken word — and writes it to `assets/audio/NN.mp3`. That path is
  what belongs in the `audio:` field.
- Prints the size before and after, so you can see what it did.

Run `build-reader.py NN` first if `read/NN.json` doesn't exist yet.

Then in `stories.js`, add to that book's entry:

```js
audio: "assets/audio/NN.mp3"
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

## A note on hosting

A recording compressed at 48kbps mono runs roughly a quarter the size of
the source file — Book 1's 100MB source became about 25MB.

**Do the multiplication now, because it is closer than it looks.** Four
recordings occupy 159 MB. The repository as a whole is **525 MB** —
130 MB of PDFs, 195 MB of covers, and the audio — against the 1 GB soft
limit GitHub Pages puts on a published site. That leaves roughly 500 MB,
and at the current average of 40 MB a recording, **about twelve more
narrations would put the site against the limit** — and that is before
the next dozen books bring their own PDFs and cover art.

That is not a reason to stop, but it is a reason to decide the hosting
question before the twelfth rather than after it. The two honest
options are dropping the bitrate (32kbps mono is still clean for a single
unaccompanied voice, and would buy a third more room) or moving the audio
off the repository altogether and pointing `audio:` at a full URL, which
the field already supports — nothing in `script.js` requires it to be a
relative path.
