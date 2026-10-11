<!-- Updated 2026-10-11 06:47 PDT — 110 books; the Roya Library is the landing view; narrations on Backblaze B2 -->
# Chew Z — Short Fiction

**110 dark noir novellas, free to read, under the Roya Publication
imprint. Live at <https://www.chewzfiction.com>.**

Every book works the same way — a door out of the mind, a room on the
other side, and the key that opened it — and the whole site is built
around those three words.

## What a visitor sees

The site opens on the **Roya Library**, which has four views:

| | |
|---|---|
| **About** | the imprint's own page: the lede, the Door/Room/Key glossary, **Pick a mood** (nine books under Noir, Transgressive and Plausible), **Start here** (six series as full-bleed rows), and every series listed |
| **Library** | the shelf — all 110 covers, filterable by series and by door, sortable, searchable |
| **Listen** | the 19 books that have a narration |
| **Notes** | the author's notes behind the stories |

Opening a book gives its cover, synopsis, door, room, key and three
dials, with three ways in: **Read** (the text, in the browser, which
keeps your place), **PDF** (the typeset object) and **Share** (a link
that shows the right cover when pasted). A magnifying glass on any
cover opens the **cover window**: the front-and-back render full size,
with a shelf of every other cover beside it, and the picture zooms —
wheel, pinch, drag, double-click, or the buttons — without leaving.

Two themes: dark by default, light behind the moon in the header. The
light theme is dormant and not currently reachable from the page.

> **The older page is still in `index.html` and nobody sees it.** One
> line — `window.ROYA_LIBRARY_HOME = true` — puts the Library in front
> of it, and `body.rl-on` sets `overflow: hidden` so it cannot be
> scrolled to. Delete that line and the old page comes back with the
> Library one click away. It is the fallback and it is what anything
> reading the raw HTML sees, so keep its wording current — but note
> that today it still says "Recommended Series" and lists only three.

---

## What is fed into the site

**One file is the catalogue: `stories.js`.** It is the file edited most,
and nothing else holds a copy of what is in it. Everything on the page —
counts, filters, series rows, the door menu, the reading times — is read
from it as the page runs.

### A book

```js
{
  num: 110,
  title: "Cruel Sun, the Water Said",
  words: "40,500 words",
  hook: "A swim coach who has taught a thousand children to float, …",
  door: "Ordeal",
  room: "The Seawall — nine hours in the water off Front Street, …",
  key: "Ears Under — the float he teaches every beginner: …",
  notes: [2, 3, 3],
  synopsis: "Lahaina sits on the dry side of Maui, …"
}
```

| field | what it is |
|---|---|
| `num` | the publication number. Strictly ascending, no gaps, no duplicates |
| `title` | used for the heading, the slug and the share page |
| `words` | drives the reading time (200 wpm). **Must be that book's own figure** |
| `hook` | one line under the title on the shelf — the thing that stops a stranger scrolling |
| `door` | **one of exactly four.** See below |
| `room` | where they land. Written `Name — what it is`, split at the em dash |
| `key` | the exact thing that opened it. Same `Name — what it is` shape |
| `notes` | the three dials, each 1–3: **how dark, how hard, how strange** |
| `synopsis` | the full description |
| `audio` | optional. A **whole** Backblaze address, not a path in this repo |
| `runtime` | optional. Whole minutes, floored — only with `audio` |

### The four doors — how the person got out

The one shared vocabulary in the catalogue. Every book is filed under
exactly one, and the About panel defines them in these words:

| door | meaning | books |
|---|---|---|
| **Rite** | they practised something | 36 |
| **Withholding** | they went without something | 33 |
| **Dose** | they took something | 21 |
| **Ordeal** | they endured something | 20 |

`room` and `key` belong to one book each — there is no list to reuse
from, write whatever is true of that story. `door` is the menu.

### Series

**15 of them**, in the `TRILOGIES` block at the foot of `stories.js`.
Each names its books by number; a book in one then labels itself on its
own row — "LES FOLIES · 2 of 3" — with nothing written per book. **36
books are standalone.**

Seven set `numbered: false` and show the name without the position,
because their books share a world rather than an order. Two carry a
painted panorama (`banner`) in place of a row of spines; the other
thirteen show spines, which is right for a thematic group where a single
panorama would claim more continuity than there is.

### Everything else fed in

- **`pdfs/NN.pdf`** — the novella itself, and the source the reading
  text and the flat cover are both lifted from
- **the cover art** — four flat sizes and one pair render per book (see
  *What's in the folder*)
- **`index.html`** — the page's own prose: the About and Author's Notes
  panels, and the metadata a crawler reads

---

## The guides

**[ADDING-A-BOOK.md](ADDING-A-BOOK.md)** — seven steps in order, the
field-by-field format for `stories.js`, and what to check afterwards.
Follow it whenever the catalogue grows.

**[ADDING-AUDIO.md](ADDING-AUDIO.md)** — narration: the download link,
the synced read-along that highlights the sentence being spoken, and the
script that builds it. Independent of adding the book; a book can gain a
recording years later.

**[CUSTOMISING.md](CUSTOMISING.md)** — everything else: backdrops and
their sizes, series and their banners, bilingual titles, the cover
window, the door filter and the three dials, the About panel's sections,
the two themes, and how publishing works.

### And the gate

```
node check-book.js 110      one book
node check-book.js          the whole catalogue
```

**Run it before committing.** It is the only thing that checks a book
against the files it actually needs, and it is where one real error was
caught and must never recur: **that the reading time shown is that
book's own figure.** It compares the stated `words` against the real
word count of `read/NN.json`, because a card once showed a whole
series' six hours over a two-hour book.

It also checks the PDF, all the cover sizes, the reader file, the share
page, the feed, the sitemap, every required field, that `door` is one
of the four, that `room` and `key` carry their em dash, and that the
numbers still run in order.

A clean new book reports **0 failures, 0 warnings**. The catalogue as a
whole currently sits at **15 failures / 73 warnings** — a long-standing
backlog, not a regression. Compare against that figure rather than
against zero, and make sure your change does not add to it.

---

## What's in the folder

```
stories.js            THE CATALOGUE — the file edited most
index.html            the page itself, plus the older fallback page
style.css             all styling; hand-edited and safe
script.js             behaviour, and every fix layered over the Library
check-book.js         THE GATE — run before committing
build-feeds.js        rebuilds feed.xml + sitemap.xml from stories.js
build-share-pages.js  rebuilds the share/ folder from stories.js
build-reader.py       pulls the reading text out of the PDFs
build-audio-sync.py   aligns a recording to that text; see ADDING-AUDIO.md
optimize-art.py       makes the .webp twin of every picture (needs --write)

pdfs/                 the novellas: 01.pdf … 110.pdf
covers/NN.jpg         800x1200 flat front — large views, and the share image
covers/NN.webp        its twin, asked for first. Made by optimize-art.py
covers/thumb/NN.webp  360x540 flat front — the shelf rows and the cover shelf
library/covers/NN.webp 560x840 flat front — THE BOOK CARD
covers/pairs/NN.{jpg,webp}  1536x1024 front-and-back render — the cover window
assets/               backdrops, series plates, the Roya mark, icons
assets/audio/         empty and gitignored — the narrations are NOT here
library/              the Roya Library: two GENERATED files and its pictures
read/NN.json          the novella as text, for reading on the site
read/NN.sync.json     beside it when the book has a narration
share/                one small page per book, so shared links show covers
feed.xml              generated — don't edit by hand
sitemap.xml           generated — don't edit by hand
CNAME                 the custom domain. NEVER DELETE THIS FILE
.nojekyll             tells GitHub Pages to serve the files as they are
404.html              shown for an address that doesn't exist
```

**All four flat sizes are the same picture** — page 1 of the PDF, which
is the cover art clean, with no spine and no 3D render. A standing or
paired render belongs only in `covers/pairs/`. `covers/thumb/` is
required in practice and is generated by no script: make it by hand.

Two strays, both harmless and both long-standing: `covers/1.jpg` and
`covers/1.webp` (unpadded, nothing asks for them), and
`share/01-the-memory-liturgy.html` (orphaned when book 1 was retitled —
`build-share-pages.js` writes but never deletes).

---

## ⚠ The two files you must not hand-edit

```
library/roya-library.js
library/roya-library.css
```

Both are **generated**, cut from a sandbox by `build-integration.py` —
**and that script is not in this repository.** So they cannot be rebuilt
here, and any edit made to them survives only until the next build
elsewhere, which will overwrite it silently.

Everything the Library needs changing therefore goes in **`script.js`**
and **`style.css`**, which are hand-edited and safe. The Library redraws
its whole stage with `innerHTML` on every view change, so work layered
on top is written as a small idempotent function behind a
`MutationObserver`, re-applied after each redraw. There are several of
these already; copy the shape of one.

Two things make that practical:

- **Specificity.** The generated sheet carries rules at one id and four
  classes. `html #royaLibrary` is one id and one element and loses to
  them. Writing the id twice — `html #royaLibrary#royaLibrary` — is
  worth two ids and beats any one-id rule however many classes it
  carries, without reaching for `!important`.
- **Attribute order.** The Library's delegated click handler tests
  `data-serex` **before** `data-series`, so swapping one attribute for
  the other changes a row's behaviour with nothing new wired up.

---

## The generated things

None is written by hand:

```
node build-feeds.js         → feed.xml, sitemap.xml      (reads stories.js)
node build-share-pages.js   → share/                     (reads stories.js)
python3 build-reader.py NN  → read/NN.json               (reads pdfs/)
python3 optimize-art.py     → the .webp twin of every picture  (--write)
python3 build-audio-sync.py → read/NN.sync.json + a staged mp3 to upload
```

Run the first three whenever a book is added or changed, and commit what
they produce. `optimize-art.py` only when a picture was added or
replaced; `build-audio-sync.py` only when a recording arrives — and of
its two outputs, commit the sync file and upload the mp3 rather than
committing it.

**Order matters once.** `build-reader.py` takes the title from
`stories.js`, so the entry must exist before it runs; run it first and
the reader opens with no title. `build-share-pages.js` reads
`covers/NN.jpg` for the share image's dimensions, so that file has to be
in place first too.

Two traps worth knowing:

- **`optimize-art.py` skips any picture whose `.webp` already exists.**
  Safe to re-run, but a replaced `.jpg` keeps serving its old `.webp`
  until you delete the twin first. This has bitten once: a cover's
  `.webp` was a copy of the wrong size for weeks and re-running the
  script could not fix it.
- **`build-feeds.js` no longer writes anything into `index.html`.** It
  only checks that the metadata's scale phrase is still true. See *The
  shelf count*.

`build-reader.py` needs Python and `pip install pdfplumber`; the two
`.js` ones need Node.

---

## Editing the page text

In `index.html`: the About and Author's Notes panels, the footer, and
the metadata. The Library's own prose — its lede, the glossary, the
About note — lives in the generated `library/roya-library.js` and is
changed from `script.js` instead, for the reason above.

## The reader

**Read** opens `read/NN.json` full-screen: one column, the reader's
choice of type size, and their place kept per book.

The text is extracted, not hand-typed, so it is only as good as the
extraction. `build-reader.py` measures each PDF first — these books are
not all typeset alike, the body size runs 9 to 11.3 across the catalogue
— then keeps italics, headings and the line breaks in verse.

One heuristic to know: **a short line in capitals is promoted to a
section heading**, because several books mark their sections that way at
ordinary size. In a book containing shouted dialogue or an all-caps
notice, that misfires. Check a new book's headings before publishing.

A book with no `read/NN.json` is not broken — Read says so and points at
the PDF.

## Narration

Independent of everything else: a book published two years ago can gain
a recording tomorrow with no other file changing. Set
`audio: "https://f005.backblazeb2.com/file/roya-audio/NN.mp3"` on its
entry and an Audio control appears. Add `read/NN.sync.json`, built by
`build-audio-sync.py`, and it becomes a read-along that highlights the
sentence being spoken.

**The mp3s are not in this repository.** They are on Backblaze B2, in
the public `roya-audio` bucket, and must be served as `audio/mpeg` —
GitHub Releases was tried and serves everything as
`application/octet-stream`, which Safari refuses. See
[ADDING-AUDIO.md](ADDING-AUDIO.md). 19 books are narrated.
`read/01.sync.json` is still published for a book 1 narration that was
never wired up.

---

## The shelf count

**Nothing on the site needs the count typed in.** Add a book and every
figure follows, in one of two ways:

*Counted as the page runs* — from the length of `STORIES`, so they can
never disagree with the catalogue: the shelf's "showing N of N", the
order menu's gloss, and in the Library the rail's `110 STORIES`, the
collection heading, the footer and the About note.

*Not counted at all, on purpose* — the three `description` / `og:` /
`twitter:` tags a crawler reads without running JavaScript.
`build-feeds.js` used to write the exact number into them, and the
number was right in the file and wrong everywhere it was read: Google
recrawls a site this size every few weeks, so each new book left the
title stale until the next crawl.

They now say **"Over a hundred"**, which is true of any catalogue from
100 to 199 and never needs rewriting. Both `build-feeds.js` and
`check-book.js` check that the phrase is still there and still true.
Past 199, `build-feeds.js` stops with a non-zero exit and tells you to
reword them by hand and update `SCALE` in both scripts.

## Cache-busting

**Ten** lines in `index.html` end in `?v=` and a number — five near the
top for the share and preloaded images, five at the foot for the two
stylesheets and the three scripts:

```
near the top                      (these lag deliberately)
  og:image                    assets/og-roya.png?v=
  og:image:secure_url         assets/og-roya.png?v=
  twitter:image               assets/og-roya.png?v=
  preload                     assets/bg/bg-path.webp?v=
  preload                     assets/start-06.webp?v=
at the foot                       (these move together, always)
  style.css?v=
  library/roya-library.css?v=
  stories.js?v=
  script.js?v=
  library/roya-library.js?v=
```

**The five at the foot are kept on one shared number.** Raise it
whenever any of those five files changes — including a pure
version-stamp edit, which is cheaper to raise than to think about. Never
move it backwards.

**That shared number also governs every picture on the site.**
`script.js` reads the version off its own `src` and appends it to every
image URL it builds (`ASSET_V`, near the top). So a replaced cover, a
new pair render or a new painting all reach the reader through that one
number. **Replace a cover without raising the stamp and the old cover
goes on being served**, out of the reader's own cache, with nothing to
tell either of you.

The five near the top only move when those specific images are replaced,
which is rare — don't be surprised to see `og:image` sitting two hundred
behind the rest. That is normal.

It is always safe to raise a number that didn't need it. The only real
mistake is forgetting one that did.

**`index.html` itself has no `?v=`, and cannot have one** — it is the
entry point, so nothing can ask for it by version. That is the trap:
raising the number only takes effect once the browser fetches the new
`index.html`. Until then the old copy goes on asking for the old files
by their old numbers, and an upload looks as though it did nothing.
GitHub Pages can hold HTML for several minutes on top of that. Check
with a hard reload (⌘⇧R) or a private window before believing a change
failed.

## Hosting

**GitHub Pages**, serving `alsamii/alsamii.github.io` straight from
`main`. No build step, nothing to pay for: **committing publishes.**

The domain is managed at Porkbun — chewzfiction.com is canonical,
chewzroya.com redirects to it. Two files at the root must never be
deleted: **`CNAME`**, which holds the custom domain, and
**`.nojekyll`**, which stops GitHub processing the files through Jekyll.

The site ran on Netlify for a while from the same repository. That was
removed because every commit spent build credit on a site that needs no
building — so a Netlify billing email is about the account, not about
this site.

## If something breaks

Nine times in ten it's **`stories.js`**: a missing comma between blocks
or an unclosed quote, which takes the whole list down. The last record
in the array has no trailing comma — adding a book means putting one
back on the one above it. Undo, save, refresh.

The other one time is **caching**, and it wears two faces. Either the
`?v=` was not raised — or it was raised, uploaded, and the browser is
still serving its own cached `index.html`, which asks for the old files
by their old numbers. **Before investigating anything, open the site in
a private window.** If the fault is not there, it was never in the
files.

And if a change to the Library vanished: check it was not made in
`library/roya-library.js` or `library/roya-library.css`.
