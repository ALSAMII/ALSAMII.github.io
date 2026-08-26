# Chew Z — Short Fiction

A single dark screen: the novellas listed on the left, a candlelit stage
in the middle. Hovering a title shows its synopsis on the stage; the PDF
icon opens the novella; the share icon hands someone a link straight to
it. On phones, tapping the eye unfolds the synopsis under the title
instead. There are two themes — dark by default, light behind the moon
in the header.

Each book can be read in the browser — the **Read** button opens it as
flowing text that sets its own size and remembers where you stopped —
or downloaded as the typeset PDF.

Live at <https://www.chewzfiction.com>.

## The two guides

**[ADDING-A-BOOK.md](ADDING-A-BOOK.md)** — seven steps, in order, with
the field-by-field format for `stories.js` and what to check afterwards.
Follow it whenever the catalogue grows.

**[CUSTOMISING.md](CUSTOMISING.md)** — everything else: the backdrops
and their sizes, series and their painted banners, the door filter and
the three dials, the books featured on the About panel, wiring up a
newsletter, the two themes, and how publishing works.

## What's in the folder

```
stories.js            THE CATALOGUE — the file edited most
index.html            the page itself: header, About, Author's Notes, footer
style.css             all styling; the light theme is one block at the end
script.js             behaviour — rarely needs touching
build-feeds.js        rebuilds feed.xml + sitemap.xml from stories.js
build-share-pages.js  rebuilds the share/ folder from stories.js
build-reader.py       pulls the reading text out of the PDFs
share/                one small page per book, so shared links show covers
read/                 each novella as text, for reading on the site
.nojekyll             tells GitHub Pages to serve the files as they are
pdfs/                 the novellas, numbered: 01.pdf, 02.pdf ...
covers/               a cover per novella, numbered to match: 01.jpg ...
assets/               backdrops, series banners, the Roya mark, icons, audio
feed.xml              generated — don't edit by hand
sitemap.xml           generated — don't edit by hand
CNAME                 the custom domain. NEVER DELETE THIS FILE
404.html              shown for an address that doesn't exist
```

## The three generated things

None is written by hand:

```
node build-feeds.js         → feed.xml, sitemap.xml   (reads stories.js)
node build-share-pages.js   → share/                      (reads stories.js)
python3 build-reader.py     → read/                   (reads pdfs/)
```

Run all three whenever a book is added or changed, and commit what they
produce.

`feed.xml` and `sitemap.xml` are how search engines and feed readers see
a site whose list is built in JavaScript. The `share/` folder is how a shared
link shows the right cover — see ADDING-A-BOOK.md for why that can't be
done with a `#` address. The `read/` folder is the novellas themselves,
lifted out of the PDFs so they can be read on the site.

`build-reader.py` needs Python and `pip install pdfplumber`; the other
two need Node. Only `build-reader.py` reads the PDFs, so it is the one
to re-run when a PDF is replaced — as when five books had their ISBN
check digits corrected.

## Editing the page text

In `index.html`:

- the opening line on the stage, and the italic question under it
- the **About** and **Author's Notes** panels
- the three books recommended on the About panel — the `data-book="12"`
  attributes; each also wants an `assets/start-NN.jpg` scene image
- the footer

## Series

Nine of them, declared in the `TRILOGIES` block at the bottom of
`stories.js`. Each names its books by number; every book in one then
labels itself on its own row — "LES FOLIES · 2 OF 3" — with nothing
written per book.

Five of them carry a painted panorama, shown in place of a row of
spines, with the written heading above it: Daughters of Anahita, Les
Folies, The Borrowed Sun Cycle, The Water Ordeals and The Ghariban. The
other four — The Unwitnessed Wars, The Unguarded Hours, The Sovereign
Rooms and The Unheard House — have no `banner` line and show their
books' spines instead, which is the default. See CUSTOMISING.md for
sizes.

## The backdrop and the ambient sound

Two photographs, one per theme: `assets/bg/bg-path` for the dark room
and `assets/bg/bg-paper` for the light one, each as jpg and webp. A
third scene, `bg-tearoom`, is built but switched off — `SCENES = 1` in
the head of `index.html`; raise it to `2` to alternate.

`assets/ambient-tearoom.mp3` is off until the speaker in the header is
pressed, then held at a low fixed level. Any audio hosted here needs a
licence that permits it — a track lifted from YouTube does not.

## The reader

The **Read** button opens `read/NN.json` in a full-screen view: one
column, the reader's choice of type size, and their place kept per book
so they can come back to it. The PDF stays on offer beside it for anyone
who wants the typeset object.

The text is extracted, not hand-typed, which means it is only as good as
the extraction. `build-reader.py` measures each PDF first — these books
are not all typeset alike, and the body size runs from 9 to 11.3 across
the catalogue — then keeps italics, headings, and the line breaks in
verse. If a book is ever re-typeset, re-run it and check the word count
it reports.

A book with no `read/NN.json` is not broken: Read tells the visitor it
isn't set for reading here yet and points at the PDF.

## The shelf count

The label above the order menu — "All 67 stories · order" — is written
by `script.js` from the length of `STORIES`, so it counts itself and
never needs editing. The number typed into `index.html` is only what
shows for the half-second before the script runs; it is worth keeping
roughly right, but nothing depends on it.

## Cache-busting

Six lines in `index.html` end in `?v=` and a number — the stylesheet,
the two scripts, the preloaded first painting and the two share images.
Raise them all together after any change to `style.css`, `script.js`
or `stories.js`, or returning readers keep seeing the old version.

**`index.html` itself has no `?v=`, and cannot have one** — it is the
entry point, so nothing can ask for it by version. That is the trap:
raising the number only takes effect once the browser fetches the new
`index.html`. Until it does, the old copy goes on asking for the old
`style.css?v=`, which the browser also still holds, and an upload looks
as though it did nothing at all. GitHub Pages can hold HTML for several
minutes on top of that. Check with a hard reload (⌘⇧R) or a private
window before believing a change failed.

## Hosting

**GitHub Pages**, serving the `alsamii/alsamii.github.io` repository
straight from `main`. There is no build step and nothing to pay for:
committing publishes.

The domain is managed at Porkbun — chewzfiction.com is canonical,
chewzroya.com redirects to it. Two files at the repository root matter
here and should never be deleted: **`CNAME`**, which holds the custom
domain, and **`.nojekyll`**, which stops GitHub processing the files
through Jekyll.

(The site ran on Netlify for a while, deploying from the same
repository. That was removed because every commit spent build credit
on a site that needs no building.)

## If something breaks

Nine times in ten it's `stories.js`: a missing comma between blocks or
an unclosed quote, which takes the whole list down. Undo, save, refresh.

The other one time is caching, and it wears two faces. Either the `?v=`
number was not raised — or it was raised, uploaded, and the browser is
still serving its own cached `index.html`, which asks for the old files
by their old numbers. **Before investigating anything, open the site in
a private window.** If the fault is not there, it was never in the
files. See Cache-busting above.
