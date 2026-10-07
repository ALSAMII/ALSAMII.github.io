<!-- Updated 2026-10-06 17:38 PDT — audited against the code. 105 books, 15 series;
     the Roya Library's own theme and tokens documented; several files
     this page described as present are recorded as missing. -->
# Customising the site

Everything that isn't adding a book. Adding one is its own document —
see [ADDING-A-BOOK.md](ADDING-A-BOOK.md).

Nothing here needs a build step unless it says so. Raise the `?v=`
number in `index.html` after any change to `style.css`, `script.js`,
`stories.js`, `library/roya-library.css` or `library/roya-library.js` —
all five are stamped, and they are kept on one shared number, so raise
them together. Every picture on the site is stamped with that same
number too, so **a replaced image also needs it**. Returning readers
keep seeing the old version otherwise.

**When this page and the code disagree, the code wins.** The stylesheets
and `library/roya-library.js` carry their own dated changelogs in
comments, and those are maintained as the work happens; this page is
written afterwards. Items below marked ⚠ are places where the site as
built does not match what this page used to promise.

---

## The backdrop

One photograph, in `assets/bg/`:

```
bg-path.jpg  + .webp     the dark theme
```

Both formats are needed. Browsers take the webp and fall back to the
jpg; deleting either costs you something.

⚠ **The light theme's backdrop is missing.** `style.css` still points
`html[data-theme="light"] .atmosphere` at `assets/bg/bg-paper.jpg` and
`.webp`, and neither file is in the folder — the light theme currently
draws no backdrop at all. It does not break anything; a background image
that 404s is simply not painted, and the theme's own colours carry the
page. But if the light theme looks flatter than you remember, this is
why. Dropping a `bg-paper` pair into `assets/bg/` is the whole fix.

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

**What actually shipped is smaller than any of those rows.** `bg-path`
is a single **1400 × 2103 portrait** image — 71 KB as webp, 196 KB as
jpg — serving both orientations. So the table is a specification the one
real backdrop does not meet, and the site looks fine regardless, which
is the more useful fact: a backdrop this darkened does not need the
resolution the table asks for.

Don't go to 4K. The backdrop is heavily darkened by design, so fine
detail is invisible and you'd be paying for pixels nobody sees. For the
same reason it compresses hard — try webp quality 65–70.

The crop is **not** centred, though the phone and laptop crops of the
other two layers are: `background-position` is
`center center, center center, center 42%`, so the backdrop itself sits
a little above centre.

⚠ **The second scene no longer exists.** `bg-tearoom` was fully built
once and the switch is still there, near the top of `index.html`:

```js
var SCENES = 1;      // raising this to 2 will NOT work
```

`style.css` still carries the `html[data-scene="1"] .atmosphere` rule,
but `assets/bg/bg-tearoom.jpg` and `.webp` are not in the folder, so
raising `SCENES` to `2` alternates between the path and a blank. Worse,
the ambient track is mapped to **scene 0**, not to the tearoom it is
named after — `TRACK_FOR_SCENE = { "0": "assets/ambient-tearoom.mp3" }`
in `script.js` — so on a tearoom visit the speaker would go quiet and
hide itself. Restoring the second scene means restoring the two image
files *and* adding a `"1"` entry to that map.

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
series and place on its own row ("The Borrowed Sun Cycle · 3 of 7"),
built automatically from this list. Nothing to write per book.

**`numbered`** — set `numbered: false` and the row shows the series name
alone, with no position. Six of the fourteen do: The Ghariban, From the
Delgoshā, Thursday Nights, From the Old Book, Come In the Water Is
Lovely, and From the Unsaid. Use it whenever the books share a world
rather than an order, so a reader doesn't take "3 of 7" as an
instruction to find the other six first.

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

Two of the fourteen carry one at the moment — Daughters of Anahita and
The Borrowed Sun Cycle. The other twelve show spines.

Which to choose is not really a picture question. A panorama says the
books share one world; spines say they share a subject. Les Folies and
The Ghariban both had paintings and gave them up for exactly that
reason — they are thematic groups, and a single panorama was claiming a
continuity the books do not have. **Those two paintings are still in
`assets/`** — `les-folies.jpg` and `ghariban.jpg` — if that judgement is
ever reversed. (An earlier version of this page named The Water Ordeals
alongside them. There is no Water Ordeals painting in `assets/` under
any name, and there may never have been one.)

**A `banner` naming a file that is not there loses the picture
entirely** — it does not fall back to spines. The code takes the banner
branch on the strength of the line alone, and when the image fails it
removes the frame with it, leaving the row with nothing but its words.
So if a row has gone bare, look for a `banner` line pointing at a file
that was never uploaded, and either upload it or take the line out.

⚠ **Three commented-out `banner` lines in `stories.js` are traps of
exactly this kind.** The Unwitnessed Wars, The Unguarded Hours and The
Sovereign Rooms each carry a commented line inviting you to "put the
banner back" — and all three name files that are **not in `assets/`**:
`unwitnessed-wars.jpg`, `unguarded-hours.jpg`, `sovereign-rooms.jpg`.
Uncommenting any one of them does not restore a painting; it silently
strips that row's spines and leaves it bare. Paint the picture first,
then uncomment.

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
"Pick a Door" **below** for the exact markup and the `&nbsp;` rule that
goes with it. Books **78 and 94** do this. (Book 89 carries Persian too,
but in a `series-start-card`, beside `.series-start-title-en` rather
than `.start-title` — a different element with its own rules.)

Both conventions share the same instinct — `dir="rtl"` on the Persian
span controls the order of its own glyphs, not which side of the row it
sits on, and `width: fit-content` keeps a short Persian run from
claiming the full row and pushing everything else to one side.

---

## Cover zoom

Every cover on the site — the small thumbnail on each shelf row, and
the full-size ones in the Roya Library — carries a small circular
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
zero-padded, two digits, `.jpg`.

**The Roya Library asks for the `.webp` instead.** Its own `pair()`
builds `covers/pairs/NN.webp`, falling back to the `.jpg` and then to
`library/covers/NN.webp`. So the pair render wants **both** files: the
shelf's lightbox uses the `.jpg`, the Library uses the `.webp`, and a
book with only the `.jpg` costs a failed request on every Library view.
Only nine of the 98 have the webp today.

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
  <span class="start-cat-name">Noir</span>
  <span class="start-cat-about">How cold it gets.</span>
</p>

<button class="start-row start-row--samba" type="button" data-book="52">
  <img class="start-scene" alt="" aria-hidden="true">
  <span class="start-body">
    <span class="start-head">
      <span class="start-num">52</span>&nbsp;<span class="start-title">Samba</span><span class="start-gloss">a dance name for drowning</span>
      <span class="start-time caps"></span>
    </span>
    <span class="start-note">Surfers call it the samba: ...</span>
  </span>
</button>
```

That block is copied from the live page. ⚠ An earlier version of this
document showed a `tabindex` / `role` / `aria-label` trio on
`.start-cat-name` and a `data-scene` on the book-52 card. **Neither is
there**, and nothing in `script.js` adds them.

Each `.start-cat` block is a door heading. ⚠ **Its wording deliberately
differs from the dial glossary** — the heading reads "How cold it gets."
where `GLOSSARY.notes` in `stories.js` says "How cold it gets, and
whether anyone is rescued." The card wants the shorter line, and a
comment in `library/roya-library.js` records that the difference is
intended, so don't "fix" one to match the other. Three `.start-row`
cards follow each heading before the next; featuring a different book
under a door means swapping its card for another, not adding a tenth.

**Five things are named on a card.** **`data-book`** is which novella it
opens — change the number to feature a different one. **`start-row--x`**
is that card's own hook for CSS, used only to tune how its picture is
cropped; pick a short word from the title. **`.start-gloss`** is the
four-or-five-word phrase after the title, which every one of the nine
now carries; the separating dot before it is drawn by CSS, so don't type
one. **`data-scene`** is optional — a card with none falls back to
`assets/start-NN.jpg` from the book's own number, and then to the book's
own cover if that is missing too, so a card never loses its background
entirely. **`.start-title-fa`** is optional too — a book with its own
Persian title can add
`<span class="start-title-fa" lang="fa" dir="rtl">…</span>` right after
`.start-title`, as books **78 and 94** do.

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
.start-row--exam      .start-scene { object-position: 87% 50%; }
.start-row--roundtrip .start-scene { object-position: 84% 50%; }
.start-row--samba     .start-scene { object-position: 97% 50%; }
```

(⚠ This page used to illustrate the rule with `--whirl` and `--alarm`.
Both are dead: `--alarm` was retired and its bespoke crop deleted, and
no element in `index.html` carries `--whirl` — though `style.css` still
holds a rule for it, which is why it looks alive. The nine classes
actually in use are `--blackout`, `--dreams`, `--exam`, `--glow`,
`--roundtrip`, `--samba`, `--stool`, `--swimmer` and `--undertow`; the
stylesheet also carries orphan rules for `--alarm`, `--blend`,
`--weight` and `--whirl`. Check `index.html` before tuning a class.)

Most of these rules live inside a media query rather than at the top
level, because the crop that is right on a wide card is wrong on a
narrow one. Some use `calc(100% - 4rem)` horizontally to hold a subject
a fixed distance in from the right edge rather than at a percentage.

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
   boxes are never that short to begin with. **Most of the set is now
   built this way** — `--undertow`, `--blackout`, `--samba`, `--glow`,
   `--dreams`, `--exam`, `--swimmer` and `--roundtrip`, at 2400 × 800
   or 3072 × 1024. Only books 8 and 89 are still on the old 3:2
   1536 × 1024, so treat 3:1 as the house shape and 3:2 as the
   exception.
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

Below the nine Pick-a-Door books sit **three** series, each given a
block of its own. ⚠ This section used to describe one, in a markup
family that no longer exists — there is no `series-card` anywhere in
`index.html`. What is actually there:

**Two blocks in the newer shape** — From the Delgoshā and From the
Unsaid. Search `index.html` for `series-feature`; each carries
`data-series="delgosha"` or `"unsaid"`, a `.series-name-en`, a
`.series-title-fa`, a `.series-feature-blurb` and a
`.series-feature-note`. The Unsaid's blurb is written as six sibling
paragraphs rather than one.

**One block in the older shape** — The Unheard House. This is the one
`series-intro` finds, and it is the only one with a portrait and a
dedication: `.series-portrait`, `.series-blurb`, `.blurb-cut`,
`.series-dedication`.

Under each sits a promoted book as a `series-start-card` — naming the
book with `data-book` and its 3D cover render with `data-art` — followed
by a `series-cycle-list` of `series-cycle-book` buttons for the rest.

To feature a different series, change all of that by hand. Nothing here
is generated, and the three blocks do not share a template, so copying
one means copying the right one.

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
past her chin — run the full measure.

⚠ **They are switched off by default**, which is the opposite of what
this page used to say. `.blurb-cut { display: none; }` is the base
rule — on the wide panel the paragraph is only seven lines and the
faces stand beside all of them, so there is nothing to cut around. The
floats are turned on only inside the narrow-block media queries, and
switched off again below them. Their heights there are
`calc(29cqw - 4rem)` and `calc(31cqw - 2.5rem)` — the container-width
figure less the heading above it, which is why both carry a subtraction
rather than a plain value.

So: deleting them breaks the narrow layout, not the wide one, and
testing the change at desktop width will show you nothing.

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

The palette is a set of CSS variables at the top of `style.css` — the
page base, the hairlines, and a warm gold that runs through everything.
Change a value there and it changes everywhere it's used.

**The gold is called `--ember`, not `--gold`.** There is no `--gold` in
`style.css` at all; searching for one is a common few minutes wasted.
The family is:

```
--ember:      #d8a65f     the gold itself
--ember-lit:  #f0c47e     the lit edge
--ember-dim:  #b8964f     the receded state
--ember-soft:             the wash
--parchment:  #e4dcc9     the warm off-white type colour
--night:      #0b0907     the page base
--raised:     #14100c     a surface lifted off the page
--hairline:   rgba(216, 208, 192, 0.13)
```

(`--gold` *does* exist, but it belongs to the Roya Library's own
separate token block and is a different colour, `#c7943d`. See that
section below.)

**The light theme is scoped to `html[data-theme="light"]`,** and there
are 93 such rules. ⚠ **They are no longer at the end of the file.** They
run from about line 7675 to 8345, and roughly **900 lines of dark-theme
rules follow them** — a single-column treatment for the recommended
series, and the whole Where-To-Start block, which runs to the end. So
the old rule of thumb, *light comes last*, no longer holds and should
not be relied on when adding a rule.

Two things to hold to when editing:

- **A `data-theme` rule must come after the dark rule it overrides** —
  which is what the old "put it at the end" advice was really for. With
  dark rules now living past the light block, check the line numbers
  rather than assuming.
- **Anything that means "darker" needs its opposite written by hand** —
  shadows, scrims, text halos, the treatment of artwork. Fading a dark
  image into a dark page hides its edge; doing the same on white leaves
  a grey halo, so the covers and banners take a different approach on
  paper: no fade, a clean edge and a soft shadow.

**The Roya Library does not follow this theme at all.** It has its own
switch, its own token block and its own light palette, and it does not
read `data-theme`. See *The Roya Library* below — this catches people.

---

## Times: four numbers, three quantities

A narrated book shows four figures, and they have confused a reader more than
once because two of them are the same number wearing different clothes and a
third is measuring something else entirely.

| where | example | what it is | computed by |
|---|---|---|---|
| the card, beside the title | `3.5 hours read` | how long the **text** takes | `readingTime()` in `script.js`, from `words`, at **200 wpm** |
| the reader's bar, top | `3h 17m left` | the **text** remaining | `fmtTimeLeft()`, from the words below the scroll, at **200 wpm** |
| the reader's bar, while playing | `4h 6m left` | the **recording** remaining | `fmtTimeLeft()`, from `duration — currentTime` |
| the player's counter | `0:19 / 4:06:18` | the recording's true length | `fmtTime()`, from the mp3 |
| Listening Room, under the cover | `4H 06M` | the recording's length | `runtime` in `stories.js` |

**The two reading figures must agree, and they are kept in step by one
constant.** `readingTime()` uses 200 words a minute and `fmtTimeLeft()` has
its own `WPM`. **They have to stay equal.** `WPM` was 235 until 2026-10-06,
so No. 102's card said *3.5 hours read* while the bar inside that same book
said *2h 48m left* at the very top of the text — one quantity, two
answers, half an hour apart, because of two constants. If you change the
pace, change both.

**The two recording figures must also agree**, and they come from different
places: `runtime` is typed by hand into `stories.js`, the player reads the
file. Floor `runtime` to whole minutes and they match. See
[ADDING-AUDIO.md](ADDING-AUDIO.md).

**The reading figure and the recording figure are expected to differ.** A
book is not read at the pace it is spoken: No. 102 reads in about 3 h 16 m
and plays in 4 h 06 m. That is not a fault, and the bar now shows whichever
one the reader is actually doing — the reading estimate until playback
starts, the recording once it has.

⚠ **`fmtTime()` rolls into hours.** It did not until 2026-10-06, so a
four-hour novella ended its bar with `246:18` — a true figure that looks
nothing like the `4H 06M` on its own card. Every narration in the catalogue
is over an hour, so anything that formats a duration here needs the hour.

## The ambient sound

`assets/ambient-tearoom.mp3` — a seamless loop, off until the speaker
in the header is pressed, then held at a low fixed level set in
`script.js` (`var LEVEL`). There's no volume slider by design.

Anything hosted here needs a licence that permits it. A track lifted
from YouTube does not.

---

## The Roya Library

The section behind the middle nav item, where **All Covers** used to be.
It is the whole catalogue as a shelf: every cover, a search, the series
filter, a record for each book with its synopsis, its dials and Door /
Room / Key, an enlarged view of the 3D pair, and the About and Author's
Notes panels alongside. It reads `STORIES`, `TRILOGIES` and `GLOSSARY`
and carries no copy of them, so a book added to `stories.js` is in the
Library the moment the file is uploaded.

### The two built files

```
library/roya-library.css
library/roya-library.js
```

Both carry a header comment saying they are cut from a source page by
`build-integration.py` and must not be hand-edited. ⚠ **That build
script is not in the repository**, and both files have in practice been
edited in place for some time — their version stamps (css v111,
js v106) are raised by hand as the work happens. Treat the header as
history: **edit them directly, raise the version line at the top, and
raise the `?v=` in `index.html`.**

Every rule in the stylesheet is scoped under `#royaLibrary` — with two
deliberate exceptions, `body.rl-on` and `body.rl-on #toTop`, which are
how the section takes over the page's own back-to-top button while it
is open.

**The section has its own theme, its own tokens, and its own gold.**
This is the thing most likely to surprise you:

- The switch is a `data-themeswap` button drawn in both the desktop
  header and the phone band. It sets `data-lt="light"` or `"dark"` on
  the document, and the CSS reads `:root[data-lt="light"] #royaLibrary`.
- **It does not read the site's `data-theme`, does not write it, and
  starts dark whatever the rest of the page is doing.** Put the site in
  light, open the Library, and the Library is still dark until you press
  its own moon.
- Its palette lives in a `:root #royaLibrary` block at the top of
  `library/roya-library.css` — `--paper`, `--paper-2`, `--paper-edge`,
  `--board`, `--ink`, `--cream`, `--blood`, `--gold` (`#c7943d`, a
  different gold from the page's `--ember`), `--bone`, `--dust`,
  `--over-ground`, and the type roles `--identity` (Bebas Neue),
  `--slab` (Rokkitt), `--cond` (Jost), `--book` (EB Garamond),
  `--essay` (Spectral), `--nast` (Noto Naskh Arabic) and `--nastaliq`
  (Gulzar). Recolouring the Library means editing that block, not
  `style.css`.
- It also holds **the only `prefers-color-scheme` rule in the project**.
  Everywhere else the device's own preference is deliberately not
  consulted — there is a note to that effect in `index.html`'s head.

### What it shows, and where each picture comes from

Almost everything is a file the repository already has:

| What the section shows | Where it comes from |
|---|---|
| the flat cover in the grid | `library/covers/NN.webp` |
| the 3D pair, in the record and the enlarged view | `covers/pairs/NN.webp`, falling back to `.jpg` |
| the nine About scene paintings | `assets/start-NN.webp` — eight of them |
| the three series features | `assets/series-delgosha-cover.webp`, `assets/series-unsaid-wide-5.webp` (with `series-unsaid-tall-3.webp` for narrow), `assets/forough.webp` |
| the imprint, top of the rail and the phone bar | `assets/roya.png`, cropped in CSS — no second copy ships |
| PDF, Read and Share | `pdfs/NN.pdf`, `read/NN.json`, `share/NN-slug.html` |
| the narration, where a book has one | `https://f005.backblazeb2.com/file/roya-audio/NN.mp3` — hosted off the repo; a *Narrated* panel offering Listen here or a download |
| back to the top | the page's own `#toTop`, raised above the section while it is open |

⚠ **The pair render is asked for as `.webp` first**, and only 28 of
the 105 books have one — so seventy-seven of them spend a failed request on
every Library view before falling back to the `.jpg`. Making
`covers/pairs/NN.webp` is a hand step; `optimize-art.py` does not reach
that folder.

Its own pictures are the ground plates (`library/bg-desk.webp`,
`library/bg-mob.webp`), the two 9-slice frames (`library/frame.png` for
each cover, `library/edge.png` for the panel), the **98** flat covers,
and **one** scene painting:

- `library/art/start-35.webp` — `assets/start-35.webp` is a later, much
  wider rendering of the same scene, and at the row's proportions the
  wings all but vanish into black.

⚠ An earlier version of this page also listed `library/art/start-94.webp`.
**It does not exist**, and no longer needs to: book 94 was swapped out
of the Pick-a-Door trio in favour of book 26, so the Library never asks
for it. `library/art/` holds `start-35.webp` and `marg.webp`, and the
latter is referenced by nothing.

Each picture has a fallback — `COVER_FALLBACK` at the foot of
`library/roya-library.js` catches the error and rewrites the path.
**It only ever tries once**, guarded by a `data-rlTried` flag, so a book
with neither `covers/pairs/NN.webp` nor `covers/pairs/NN.jpg` stops
after a single hop rather than walking the whole chain.

### The fonts it needs

The section is set in **Bebas Neue**, **Rokkitt**, **EB Garamond**,
**Noto Naskh Arabic** and **Gulzar**, and Jost at 600. All are in the
Google Fonts link in `index.html`. If that link is ever rewritten, keep
them: without them the section silently falls back to Georgia and Arial
and looks wrong everywhere at once.

### Changing what it features

The three categories under **Pick a Door** and the three recommended
series are literals near the top of `library/roya-library.js` —
`PICKS`, `PICKNOTE`, `PICKFA`, `PICKGLOSS`, `PICKABOUT`, `RECOMMENDED`
and `SERIESFEAT`. Edit them there.

⚠ **They are meant to match the same rows on the About panel in
`index.html`, and one no longer does.** The Transgressive trio is
**8 / 50 / 94** on the About panel and **8 / 26 / 50** in the Library —
book 94 was swapped out for book 26 in the Library at the author's
request and `index.html` was never brought into line. Change one and
change the other, or decide deliberately that they differ.

The door headings are a case where they differ **on purpose**: the
About panel's Noir heading reads "How cold it gets." where the dial
glossary in `stories.js` says "How cold it gets, and whether anyone is
rescued." The shorter line is the card's; a comment in
`library/roya-library.js` records that this is intended.

### The count

Nothing in the section states the size of the catalogue from a literal.
The rail, the collection heading, the footer, the "showing N of N" line
and the About sentence all count `STORIES`. The script warns in the
console if a figure is typed into the copy instead — though the check
only scans the About panel's `note` and `lede`, so it will not catch a
number hard-coded elsewhere in the section.

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
