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

## Building the sync file

```
python3 build-audio-sync.py NN /path/to/recording.mp3
```

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
the source file — Book 1's 100MB source became about 25MB. That's fine
for a handful of books. GitHub Pages has a soft 1GB limit on total
published site size, so it's worth doing the multiplication again once
several more books have recordings, and deciding then whether all of
them belong in the repo or whether some should be hosted elsewhere and
linked.
