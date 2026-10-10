# About note + sideways cover zoom

Version 3 · last updated 2026-10-10 09:26 PDT

    site/script.js      ->  script.js      ← UPLOAD THIS ONE FIRST
    site/style.css      ->  style.css
    site/index.html     ->  index.html     (already live — unchanged)

---

## Read this first: the site is half-applied right now

`main` is carrying **this build's `style.css` with the PREVIOUS
`script.js`**. That is why the signpost line is sitting unstyled and
hard against the left margin.

The new `style.css` dropped the `.ab-go` paragraph rule, because the
line is no longer a paragraph of its own. The old `script.js` still
builds `<p class="ab-go">`, so that paragraph now renders with nothing
set on it — left-aligned, unspaced dot, wrong size.

**Uploading `script.js` clears it.** `index.html` is already at 596 and
needs nothing; re-upload `style.css` too so all three match this build.

---

## What the note says now

> 109 stories, about people who finally say it out loud. Every book
> works the same way — a door out of the mind, a room on the other
> side, and the key that opened it. **Most run an hour or two. None of
> them takes longer than an evening. Every cover in the Library · 19
> read aloud in Listen**

Your line, word for word, with its middle dot — now the note's fourth
sentence instead of a separate meta line underneath. The dot's spacing
came down from .9em/.7em to .36em/.3em: those figures were set for
tracked caps at .625rem and at 1.375rem they pushed the two halves
apart far enough to read as separate lines. .36em/.3em is the same
optical gap at the larger size.

Nothing in the new code declares a face or a size. The added span, the
dot and both link buttons all inherit from the note, so they cannot
drift from it. Measured:

| | note | added text | dot | Library | Listen |
|---|---|---|---|---|---|
| 1440px | EB Garamond 22px / 34.76px | same | same | same | same |
| 390px | EB Garamond 17.6px / 27.81px | same | same | same | same |

Family, size, line-height, style, weight, letter-spacing and
text-transform are identical across all five. Only the colour differs —
**Library** and **Listen** stay gold with the rule under them, so they
still read as pressable. The count of narrated books is read from
`STORIES` as the page runs, so it cannot go stale.

---

## The rest of this build (unchanged from version 1)

**The About note is set in the same face as the paragraph above it.**
It was Spectral, a deliberate second voice; it is now EB Garamond, the
same face as the statement above it. Two figures travel with the face
so the line keeps the size and line length it had: 1.25 → 1.375rem
(Spectral's lowercase is 11% taller, so the same rem reads smaller in
the new face), and the measure from 86ch to a flat 54rem (a `ch` is the
width of a zero, which differs by face). Colour, centring and the oval
109 untouched. The Author's Notes page uses the same class and was left
alone.

**The reading-length sentence** is checked, not estimated: the
catalogue runs 0.3 to 4.2 hours, the median is 1.6, and 101 of the 109
come in under three. "Most" and "an evening" stay true as books land; a
figure would not.

**The sideways cover view** has both arrows at the top and bottom of
the shelf column on the right, pointing up and down, and the close mark
at the top left. The gutters they were standing in go back to the
picture, along with the figure's vertical padding and the caption's
leading.

On a handset held sideways the cover is **height-bound**, not
width-bound — a pair render is 3:2 inside a frame nearer 2.2:1, so it
is letterboxed left and right and every pixel it gains has to come off
the vertical. Measured, same book, same frame:

| | live (595) | this build |
|---|---|---|
| cover | 398 × 597 | **414 × 621** |
| share of the frame | 52.3% | **56.5%** |

+4% in each dimension, +8% by area — the whole of what is available
while the title stays underneath. The one lever that would buy more is
the caption: set over the cover's lower edge or beside it instead of
under it, it frees another 43px and puts the cover at about 441 × 661.
Say the word and I'll draw it.

Desktop zoom untouched — arrows still left and right of the cover,
close top right, shelf along the foot.

---

## Checked before handing over

- `check-book.js` — **15 failures / 73 warnings**, the standing
  baseline, unchanged by this build.
- Reading times: each book's figure is its own. No. 109 reads
  "2.5 hours read" against its own 28,093 words.
- The note's text comes out character-for-character as written above,
  at 1440px and 390px.
- One copy of the added text and **no orphaned `.ab-go` paragraph**
  after eight switches between About / Library / Listen / Notes, at
  both widths.
- **Library** still opens 109 cards and **Listen** still opens 19 rows
  from inside the sentence. No console errors at either width.
- Sideways zoom measured at 390×844 (phone turned) and 844×390 (phone
  held sideways) — identical geometry, so it is still one view either
  way.
