<!-- Updated 2026-09-11 — new "cover zoom" entry for the pair render -->
# Customising the site

Everything that isn't adding a book. Adding one is its own document —
see [ADDING-A-BOOK.md](ADDING-A-BOOK.md).

Nothing here needs a build step unless it says so. Raise the `?v=`
number in `index.html` after any change to `style.css`, `script.js` or
`stories.js`, or returning readers keep seeing the old version.

---

## The backdrop

Two photographs, one per theme, in `assets/bg/`:

```
bg-path.jpg  + .webp     the dark theme
bg-paper.jpg + .webp     the light theme
```

Both formats are needed. Browsers take the webp and fall back to the
jpg; deleting either costs you something.

**To replace one,** keep the filename and drop the new pair in. The CSS
darkens and vignettes whichever image is there, so a picture that looks
too bright on its own is usually right once it's in place.

**Sizes.** A backdrop fills the window, so its shape matters more than
its resolution:

| | Dimensions | Weight to aim for |
|---|---|---|
| Landscape (laptop) | 2560 × 1440 | 200–350 KB webp |
| Portrait (phone) | 1290 × 2400 | 150–250 KB webp |
| One image for both | 2400 × 1600, subject centred | under 400 KB |

Don't go to 4K. The backdrop is heavily darkened by design, so fine
detail is invisible and you'd be paying for pixels nobody sees. For the
same reason it compresses hard — try webp quality 65–70.

Both crops take from the middle of the frame: a phone loses the sides,
a laptop loses the top and bottom.

**A second scene.** `bg-tearoom` is fully built but switched off. Near
the top of `index.html`:

```js
var SCENES = 1;      // raise to 2
```

At `2` the backdrop alternates between the path and the tearoom, never
the same one twice running. The ambient track is named for the tearoom,
so the two were designed as a pair.

---

## Series, and their banners

Series live in the `TRILOGIES` block at the bottom of `stories.js`:

```js
{
  title: "The Borrowed Sun Cycle",
  label: "",
  books: [41, 42, 43, 44, 45, 46, 47],
  banner: "assets/borrowed-sun.jpg",
  synopsis: "Seven worlds, one street corner, ..."
}
```

**`books`** — the numbers in it, in order. Each book then names its
series and place on its own row ("THE BORROWED SUN CYCLE · 3 OF 7"),
built automatically from this list. Nothing to write per book.

**`label`** — the small line above the title. `"A Triptych"` for a
group of three; an empty string shows nothing. Leave it out entirely
and a group of three is labelled a triptych by default, which is wrong
for a cycle that is only three books in so far.

**`banner`** — a painted panorama shown instead of a row of covers. The
written heading sits above it.

Banner images want to be **wide** — between 2:1 and 3:1 — around
1900–2200px across, saved as jpg at quality 88, 180–600 KB. Put them in
`assets/` named for the series. Leave `banner` out and the series shows
its books' spines instead, which suits a small group.

Two of the thirteen carry one at the moment — Daughters of Anahita and
The Borrowed Sun Cycle. The other eleven show spines.

Which to choose is not really a picture question. A panorama says the
books share one world; spines say they share a subject. Les Folies, The
Water Ordeals and The Ghariban all had paintings and gave them up for
exactly that reason — they are thematic groups, and a single panorama
was claiming a continuity the books do not have. Their paintings are
still in `assets/` if that judgement is ever reversed.

**A `banner` naming a file that is not there loses the picture
entirely** — it does not fall back to spines. The code takes the banner
branch on the strength of the line alone, and when the image fails it
removes the frame with it, leaving the row with nothing but its words.
So if a row has gone bare, look for a `banner` line pointing at a file
that was never uploaded, and either upload it or take the line out.

### A banner that already has the name painted on it

A painting that carries the series name in its own lettering makes the
heading beside it say the same thing twice. One rule in `style.css`
takes the words out of sight while leaving them in the page for search
and for a screen reader.

**No series uses it at present.** The three that did — The Unwitnessed
Wars, The Unguarded Hours, The Sovereign Rooms — have since dropped
their banners for spines, so the rule is parked on a placeholder slug,
`series-none-at-present`, which matches nothing. Their paintings are
still sitting in `assets/`, unused. Replace the placeholder with a real
slug when a lettered banner comes back:

```css
.trilogy.has-banner[data-slug="series-the-unwitnessed-wars-i-v"] .t-words,
.trilogy.has-banner[data-slug="series-the-unguarded-hours"] .t-words,
.trilogy.has-banner[data-slug="series-the-sovereign-rooms"] .t-words {
  position: absolute;
  width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%);
  white-space: nowrap; border: 0;
}
```

A new banner with the name painted into it needs its slug added to that
list. A new banner **without** lettering needs nothing — the heading is
the default, and showing a name twice is a visible mistake you will
catch, where showing it not at all is a quiet one you might not.

The slug is built from the title: `series-` plus the title lowercased
with everything but letters and numbers turned into hyphens — a group
of exactly three gets `triptych-` instead. **Renaming a series breaks
the match**, so if a series in that list is renamed, update its slug
there too, or its name will start appearing twice.

---

## Bilingual (Persian) titles

Two separate places on the site can carry a title in both scripts, and
they use two different mechanisms — worth knowing which one applies
before touching either.

**A series title**, like "From the Delgoshā · از دلگشا", is written as
one string in `stories.js` and split automatically. `splitScripts()` in
`script.js` cuts the string at the first Arabic-range codepoint and
builds `<span class="t-en">`/`<span class="t-fa" dir="rtl" lang="fa">`
from the two halves, giving each script its own line — the English and
the Persian used to fight over one line's worth of room and broke
differently at almost every width, including once through the middle
of the Persian itself. Nothing needs writing by hand; just include both
scripts in the title string, separated the same way the existing series
are.

**A single book's title** on a Pick-a-Door card is different: there's
no automatic split, because the card's English title is its own
separate field (`.start-title`), not a combined string. Add the Persian
by hand as its own span, `.start-title-fa`, right after it — see
"Pick a Door" above for the exact markup and the `&nbsp;` rule that
goes with it. Books 78 and 89 do this.

Both conventions share the same instinct — `dir="rtl"` on the Persian
span controls the order of its own glyphs, not which side of the row it
sits on, and `width: fit-content` keeps a short Persian run from
claiming the full row and pushing everything else to one side.

---

## Cover zoom

Every cover on the site — the small thumbnail on each shelf row, and
the full-size ones in the All Covers grid — carries a small circular
magnifying-glass button that opens the site's one shared lightbox
(`openCover()` in `script.js`) without navigating anywhere: `.gcard-zoom`
in the grid, `.row-zoom` on the shelf. It appears on hover for a mouse,
and is always visible for touch or keyboard, so the grid still reads as
covers first for anyone scanning it with a pointer.

Clicking the cover art itself (not the zoom button) still does what it
always did — opens the book. The two controls are siblings, not nested
— a `<button>` can't contain another interactive `<button>`, so each
lives in its own element with `e.stopPropagation()` keeping the zoom
button from also triggering the card's navigate-to-book handler.
Nothing to configure per book; a new cover picks this up automatically
by virtue of using the existing `.gcard`/`.story-mark` structure.

**The zoomed image can be a different file than the thumbnail.** If
`covers/pairs/NN.jpg` exists, the lightbox opens that instead of the
plain front cover — a wider, landscape render pairing the front and
back covers side by side, built for the zoom view only. The shelf
thumbnail and the grid thumbnail keep using the ordinary `covers/NN.jpg`
either way; only the lightbox reaches for the pair. `pairCoverFor(n)`
in `script.js` builds the path the same way `coverFor(n)` does —
zero-padded, two digits, `.jpg` only.

**Not every book needs one.** `openCover()` takes a fallback: if
`covers/pairs/NN.jpg` 404s, it swaps the lightbox straight to the plain
cover with no visible flash or broken-image icon. So a book with no
pair render just zooms to its ordinary cover, the same as before this
feature existed — nothing to configure, nothing that breaks by omission.

---

## Filters, doors and the dials

All of it lives in the `GLOSSARY` block at the bottom of `stories.js`.

**The four doors** are the filter menu above the list:

```js
doors: {
  "Dose": "You took something",
  "Rite": "You practiced it",
  "Ordeal": "You went past what hurt",
  "Withholding": "You went without"
}
```

Add a fifth and it appears in the filter by itself — but every book
using it must spell it identically, because the spelling *is* the
filter. A typo makes a new door with one book in it.

**The three dials** are the `notes` list:

```js
notes: [
  { name: "Noir",
    about: "How cold it gets, and whether anyone is rescued.",
    levels: ["Warmth survives it", "Cold, but bearable", "No rescue at all"] },
  ...
]
```

`about` is what appears when a reader taps the dial's name. `levels`
are the three readings, in order — a book's `notes: [2, 3, 3]` picks
the second, third and third of them. Keep three levels; the meter is
drawn to that shape.

**Room and Key** are not filters and need no glossary entry. They're
written per book as `Name — description`, split at an em dash.

---

## Pick a Door — the recommended books on the About panel

Nine cards, fixed in three groups of three under a door each — Noir,
Transgressive, Plausible. Each card is a book number, a short note, and
a picture behind the words. In `index.html`, search for `start-cat` to
find the three door headings, and `data-book` for the cards themselves:

```html
<p class="start-cat caps">
  <span class="start-cat-name" tabindex="0" role="button"
        aria-label="Noir — How cold it gets, and whether anyone is rescued.">Noir</span>
  <span class="start-cat-about">How cold it gets, and whether anyone is rescued.</span>
</p>

<button class="start-row start-row--samba" type="button" data-book="52"
        data-scene="assets/start-52.jpg">
  <img class="start-scene" alt="" aria-hidden="true">
  <span class="start-body">
    <span class="start-head">
      <span class="start-num">52</span>&nbsp;<span class="start-title">Samba</span>
      <span class="start-time caps"></span>
    </span>
    <span class="start-note">Surfers call it the samba: ...</span>
  </span>
</button>
```

Each `.start-cat` block is a door heading — its wording (used both as
the visible label and the dial's own `about` text) should match the
same door's description in `GLOSSARY.notes` in `stories.js`, since it's
saying the same thing in the same words twice. Three `.start-row` cards
follow it before the next `.start-cat`; featuring a different book
under a door means swapping its card for another, not adding a tenth.

Four things are named on a card. **`data-book`** is which novella it
opens — change the number to feature a different one. **`start-row--x`**
is that card's own hook for CSS, used only to tune how its picture is
cropped; pick a short word from the title. **`data-scene`** is optional
— a card with none falls back to `assets/start-NN.jpg` from the book's
own number (confirmed straight from `script.js`'s `coverFor`-style
lookup), which is what books 55 and 52 rely on; give it explicitly only
when the image needs a different name. **`.start-title-fa`** is
optional too — a book with its own Persian title can add
`<span class="start-title-fa" lang="fa" dir="rtl">…</span>` right after
`.start-title`, as books 78 and 89 do.

**One markup detail that's easy to get wrong when copying a card:** the
number and title spans must be joined with `&nbsp;`
(`<span class="start-num">52</span>&nbsp;<span class="start-title">Samba</span>`),
not a plain space, newline, or nothing at all. `.start-head` wraps
normally so a Persian title can drop to its own line rather than
splitting mid-phrase, and that same looseness turns a bare space or
newline between the number and the title into a legal break point too
— without the `&nbsp;`, the number can separate from its title onto two
lines at some widths, which is exactly the bug that taught this rule.

### The picture

The card looks for `assets/start-NN.jpg`, numbered to match the book.
Without it the card still works and still opens the book — it just
loses its background.

These are **not the cover**. A cover is upright and full of type; this
slot is wide, and the words of the card lie across it. What works is
the cover's scene, repainted:

| | |
|---|---|
| Shape | 3:2 landscape, 1536 × 1024 is ideal |
| Subject | pushed into the **right third** |
| Left half | dark and empty — this is where the words go |
| Type | none at all, anywhere in the image |
| Exposure | darker than looks right on its own |

That last one matters. The card lays a mask over the picture that
fades it out to the left and softens all four edges, so anything
mid-toned turns to mud once it is in place. A picture that looks too
dark by itself is usually correct on the card.

If you're generating one, describing the empty left half explicitly —
"the entire left half of the frame is deep shadow, no subject, no
detail" — does more work than any other line in the prompt.

### Where the picture sits in its card

`object-fit: cover` fills the card by scaling the picture up and
cropping whatever doesn't fit, so a wide picture in a tall card loses
its sides and a tall subject in a wide card loses its head. Each card
therefore gets an `object-position` in `style.css`:

```css
.start-row--whirl  .start-scene { object-position: 50% 44%; }
.start-row--alarm  .start-scene { object-position: 50% 56%; }
```

The first number is horizontal, the second vertical; both are which
part of the *picture* to keep, not where to move it. Raise the second
number to hold on to something near the bottom of the frame, lower it
for something near the top.

Add one only when the default centre crop cuts the subject. Check the
card at a phone width and at a laptop width before deciding — the card
is a different shape at each, and a value that saves the subject on one
can lose it on the other. Where the two disagree, give the card a value
inside each of the two media queries that already exist for exactly
this, rather than compromising on one number:

```css
@media (max-width: 56rem) and (min-height: 30.01rem) { ... }   /* tall card  */
@media (min-width: 56.01rem), (orientation: landscape) and (max-height: 30rem) { ... }   /* wide card */
```

**One known trap.** On a narrow upright screen the cards grow tall, and
the shared bottom fade — measured for a short card — lands part-way up
the picture instead of on its edge, cutting the subject off in mid-air.
`--cut` and `--samba` both hit this and both carry a replacement mask
inside the tall-card query. If a new scene looks like it has been
sliced across the bottom on a phone but is fine on a laptop, that is
what has happened; copy their block.

Nothing here needs a light-theme counterpart — the scene already has
its own rules in the light block at the end of `style.css`, and they
apply to every card.

### The synopsis length actually controls the crop — read this before lengthening one

This is the trap the panel fell into for several rounds running, so
it's worth understanding rather than rediscovering. A card's box is
sized by its content, and `object-fit: cover`'s scale factor is
`max(boxWidth/imageWidth, boxHeight/imageHeight)` — whichever ratio is
larger wins, and that's the direction the image gets scaled and
therefore cropped along the other axis. Synopsis length changes the
box's height, and **desktop and mobile pull that lever in opposite
directions:**

- **On desktop**, a short synopsis makes a wide, short box — often
  close to 3:1 with a standard 3:2 image, which forces scaling by
  *width* and crops the image's *height*, cutting a tall figure off top
  and bottom.
- **On mobile**, columns are narrow, so text wraps onto more lines and
  the box is already tall relative to its width. A *longer* synopsis
  makes it taller still, which forces scaling by *height* and crops the
  image's *width* — the taller the box, the narrower the sliver of the
  image's width that survives. Lengthening a synopsis to fix the
  desktop problem directly worsens this one, in direct proportion to
  how much taller the box got.

Two independent levers exist, and reaching for the wrong one just
trades one viewport's crop for the other's:

1. **The image itself**, for the desktop problem specifically. Widening
   a source image from the standard 3:2 (1536×1024) out to 3:1
   (2400×800) — by extending its own background colour and grain out to
   the sides, not stretching the picture — lets `object-fit: cover`
   scale by width even when the desktop box gets very short, so the
   full height (and the figure in it) survives regardless of synopsis
   length. This doesn't touch the mobile crop at all, since mobile
   boxes are never that short to begin with. `--undertow`, `--blackout`,
   `--samba`, `--glow`, and `--dreams` are all built this way.
2. **The synopsis length**, for the mobile problem. Since box height is
   what drives the mobile crop and nothing else does, the safest
   default for a new or edited card is to keep it close to the
   shortest card on the panel rather than the longest — in practice,
   around 60 words reads clean and keeps the mobile crop comfortable
   (roughly 35–40% of the image's width stays visible, versus 20–25%
   for a card twice that length). All nine Pick-a-Door synopses were
   brought down to this length for exactly this reason after a
   lengthening pass (done to help the desktop crop, before the 3:1
   image fix existed) had quietly broken every mobile card it touched.

Check both a phone width and a laptop width — not just the one that
prompted the edit — before shipping any change to a card's image or its
synopsis. Whichever one you didn't look at is the one that regresses.

---

## The recommended series on the About panel

Below the nine Pick-a-Door books sits one series, given a whole block of
its own: a name, a paragraph, a dedication, and a card for each book.
It is written out in `index.html` — search for `series-intro` — and the
cards below it are `series-card`, one per book, each naming the book it
opens with `data-book` and its painting with `data-art`.

To feature a different series, change those by hand: the name, the
paragraph, the dedication, and one card per book. Nothing here is
generated.

### The dedication

One line, in Persian, under the name it honours. **Keep it to one
line.** The paragraph above it is cut to the shape of the painting
behind it and the dedication is not, so a dedication that grows past
two lines starts reaching down toward the first card.

The current one rhymes رفتن with گفتن and carries گناه بود behind it as
a radif — the shape a Persian ear expects, which is what makes it land
as a line rather than a sentence.

### The portrait behind it — read this before repainting it

`assets/forough.jpg` is **not an ordinary background**. It is a wreath:
two faces at the far ends of a very wide canvas with a painted void
between them, and the CSS is pinned to measurements taken off that
exact file. Replace it with a picture of different proportions and the
block does not degrade gracefully — it comes apart.

Measured on the current canvas, 1904 × 1254:

| | |
|---|---|
| Lit skin | 10.4–20.8% and 81.6–89.8% across, 28.7–50.5% down |
| Whole figure, with hair and collar | 9.3–21.0% and 81.5–94.0% across |
| Void between them | 60.5% of the width |

Everything else is derived from those three rows:

- **`aspect-ratio: 1904 / 1254`** on `.series-portrait`, so the box is
  the same shape as the canvas and nothing is ever cropped. Crop it and
  the faces move, and every figure below stops matching.
- **The box width — 112%** on the panel. Set by the least generous
  measurement: the right-hand figure reaches 94.0%, so any box wider
  than 113.6% pushes her past the block's edge.
- **The mask stops** — opaque from 7% to 21%, gone by 31%, clear
  through to 69%, mirrored. The outer number clears the panel's edge,
  the inner one starts where her collar ends.
- **The paragraph's measure — `min(34rem, 48%)`** — sits in the clear
  middle with about 80px of daylight to her collar at a laptop width.
- **The float heights — `29cqw` and `31cqw`**, less the heading. These
  are the depth of her *face*, not of the canvas: `(0.505 − 0.11) ×
  0.738` of the block's width. Below her chin the words run full width.

If the artwork is repainted, re-measure those three rows first and work
the rest through again. The figures are written into the comments in
`style.css` beside every rule that uses them.

### The two empty spans in the paragraph

```html
<p class="series-blurb"><span class="blurb-cut blurb-cut--l"…></span><span class="blurb-cut blurb-cut--r"…></span>The House is…
```

**Do not delete these.** They are the shape of the picture, not
content: floated left and right, they hold the paragraph's opening
lines inside the gap between the two faces, and the lines below them —
past her chin — run the full measure. Without them the paragraph is
either a narrow column all the way down or it runs straight across her
face.

They must stay at the very start of the paragraph. A float only pushes
the lines that come after it, so one moved to the end does nothing.

### On paper

The light theme does not simply fade this picture — a near-black
painting cannot be laid on white at any strength without greying it.
Instead the mask is replaced by two soft ellipses over the two heads,
and everything else is masked out completely, so there is no field left
to go grey and the faces can run at six times the strength. Two dead
ends are recorded in the comments there: brightening it until the
ground reaches paper clips her skin to white first, and inverting it
into the page turns both women into photographic negatives.

---

## The newsletter

The footer currently reads "Newsletter coming soon" — plain text in
`index.html`, no form behind it.

To make it real, pick a service that gives you an embeddable form and
owns nothing of yours: **Buttondown** and **Substack** both work, and
both hand you a snippet of HTML. Replace the footer text with the
snippet, then style it to match — the form field should reuse the same
variables as the order box (`--raised`, `--hairline`, `--ember`) rather
than arriving with a service's default styling.

Worth doing before more books ship: a reader who finishes one has no
way to hear about the next.

---

## Colours and the two themes

The palette is a set of CSS variables at the very top of `style.css`
— gold, parchment, the page base, the hairlines. Change a value there
and it changes everywhere it's used.

**The light theme is one isolated block at the very end of the file**,
every rule scoped to `html[data-theme="light"]`. That block redefines
the same variables in paper terms, which is why most of the site needs
no light-specific rules at all.

Two things to hold to when editing:

- **Never put a `data-theme` rule above that block.** The whole design
  depends on the light rules coming last.
- **Anything that means "darker" needs its opposite written by hand** —
  shadows, scrims, text halos, the treatment of artwork. Fading a dark
  image into a dark page hides its edge; doing the same on white leaves
  a grey halo, so the covers and banners take a different approach on
  paper: no fade, a clean edge and a soft shadow.

---

## The ambient sound

`assets/ambient-tearoom.mp3` — a seamless loop, off until the speaker
in the header is pressed, then held at a low fixed level set in
`script.js` (`var LEVEL`). There's no volume slider by design.

Anything hosted here needs a licence that permits it. A track lifted
from YouTube does not.

---

## Publishing

The site is served by **GitHub Pages** from the `alsamii/alsamii.github.io`
repository. Committing to `main` publishes it; there is no build step
and nothing to pay for.

- **`CNAME`** at the repository root holds the custom domain. Deleting
  it silently reverts the site to `alsamii.github.io`.
- **`.nojekyll`** stops GitHub running Jekyll over the files, which
  otherwise ignores anything beginning with an underscore.
- DNS lives at Porkbun: an ALIAS on the apex and a CNAME on `www`, both
  pointing at `alsamii.github.io`. Leave the MX, SPF and
  `_acme-challenge` records alone — they are email and certificates.

Batch several changes into one commit where you can. Nothing breaks if
you don't, but it keeps the history readable.
