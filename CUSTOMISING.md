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

**`banner`** — a painted panorama shown instead of a row of covers. It
replaces the written heading too, since the artwork carries the series
name; the words stay in the page for search and screen readers.

Banner images want to be **wide** — between 2:1 and 3:1 — around
1900–2200px across, saved as jpg at quality 88, 300–600 KB. Put them in
`assets/` named for the series. Leave `banner` out and the series shows
its books' spines instead, which suits a small group.

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

## The three books on the About panel

In `index.html`, search for `data-book`:

```html
<button class="start-row start-row--whirl" type="button" data-book="12">
```

Change the number to feature a different book. Each one also wants a
scene image at `assets/start-NN.jpg` matching its number — without it
the panel still works, but that card loses its picture.

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
