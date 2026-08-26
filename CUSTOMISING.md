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

Five of the nine carry one at the moment — Daughters of Anahita, Les
Folies, The Borrowed Sun Cycle, The Water Ordeals, The Ghariban. The
Unwitnessed Wars, The Unguarded Hours, The Sovereign Rooms and The
Unheard House show spines.

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

## The recommended books on the About panel

Each recommendation is one card: a book number, a short note, and a
picture behind the words. In `index.html`, search for `data-book`:

```html
<button class="start-row start-row--samba" type="button" data-book="52">
```

Two things are named there. **`data-book`** is which novella the card
opens — change the number to feature a different one. **`start-row--x`**
is that card's own hook for CSS, used only to tune how its picture is
cropped; pick a short word from the title.

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

---

## The recommended series on the About panel

Below the six recommended books sits one series, given a whole block of
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
