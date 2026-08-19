# Adding a book

Everything that has to happen when a new novella joins the site, in
order. Nothing here is optional — a step skipped shows up as a blank
cover, a broken link, or a share preview with the wrong picture.

If you'd rather not do it by hand: send Claude the book's details and
the cover, and ask for the full set of files. Claude will hand back
everything below, named and ready to upload.

For anything that isn't a book — backdrops, series banners, the door
filter, the dials, the newsletter — see [CUSTOMISING.md](CUSTOMISING.md).

---

## The short version

1. Add `pdfs/NN.pdf` and `covers/NN.jpg`
2. Add the book's block to `stories.js`
3. Run `node build-feeds.js` → updates `feed.xml` + `sitemap.xml`
4. Run `node build-share-pages.js` → updates the `share/` folder
5. Run `python3 build-reader.py NN` → writes `read/NN.json`
6. Raise the `?v=` number in `index.html`
7. Upload: `stories.js`, `index.html`, `feed.xml`, `sitemap.xml`,
   the `share/` folder, `read/NN.json`, the new PDF, the new cover

Everything after this is the same seven steps, explained.

---

## 1. The two files

Both are named by the book's number, padded to two digits. The site
finds them on its own — nothing points at them by name.

```
pdfs/41.pdf        the novella itself
covers/41.jpg      its cover
```

**The cover must be `.jpg`.** Not `.png`, not `.jpeg`. The site builds
the path as `covers/41.jpg` and nothing else will be found. If your
artwork is a PNG, convert it first.

**Keep the PDF under about 1.5 MB.** Covers embedded at full size push
a novella past 10 MB, which is a slow download on a phone. Claude has
a script (`slimpdf.py`) that re-encodes the embedded images and
usually brings a file down by 80–90% with no visible loss.

---

## 2. The entry in `stories.js`

Copy the last `{ ... }` block, paste it at the end of the list, and
fill it in. Mind the comma between blocks.

```js
{
  num: 41,
  title: "The Book's Title",
  words: "19,000 words",
  hook: "The one line a reader decides on",
  door: "Withholding",
  room: "Name — what is on the other side",
  key: "Name — the instrument itself",
  notes: [2, 2, 3],
  synopsis: "Three or four sentences. This is what stands on the stage."
},
```

**`num`** — the next number in the series. It sets the PDF and cover
filenames, and the order on the shelf.

**`words`** — written as `"19,000 words"`. The reading time shown on
the site is worked out from this, so it has to be there.

**`hook`** — one line, no full stop. It sits under the title in the
list and is the first thing a reader actually reads. It's also what a
shared link shows as its description.

**`door`** — one of exactly four, spelled as here:

| Door | Meaning |
|---|---|
| `Dose` | You took something |
| `Rite` | You practiced it |
| `Ordeal` | You went past what hurt |
| `Withholding` | You went without |

These feed the Door filter above the list. A new spelling creates a
new filter entry, so match one of the four unless you mean to add a
fifth — in which case add it to `GLOSSARY.doors` at the bottom of
`stories.js` too.

**`room`** and **`key`** — both written as `Name — description`, split
at an em dash (`—`, not a hyphen). The site breaks them at that dash
and shows the name above the description. Key is the instrument
itself; Room is what's on the other side of it. Both are specific to
the book — they aren't shared categories, so no glossary entry is
needed.

**`notes`** — three numbers, `1` to `3`, in this fixed order: Noir,
Transgressive, Speculative. They draw the three dials under the
synopsis.

| | 1 | 2 | 3 |
|---|---|---|---|
| **Noir** | Warmth survives it | Cold, but bearable | No rescue at all |
| **Transgressive** | You'll be fine | It will cost you | Genuinely harrowing |
| **Speculative** | The real world | One invented thing | An invented world |

**`synopsis`** — three or four sentences, no line breaks.

### If the book joins a series

Series live in the `TRILOGIES` block near the bottom of `stories.js`.
Add the number to the right group's `books` list, in reading order:

```js
{
  title: "The Borrowed Sun Cycle",
  label: "",
  books: [41, 42, 43, 44, 45, 46, 47],
  banner: "assets/borrowed-sun.jpg",
  synopsis: "Seven worlds, one street corner, ..."
}
```

That is the only place a series is written down. The book will label
itself on its own row — "THE BORROWED SUN CYCLE · 4 OF 7" — from its
position in that list, and the count updates on its own as the series
grows. Nothing goes in the book's own block.

Leave `label` empty for a plain heading; a group of three uses
`"A Triptych"`. Leave it out altogether and a group of three is
labelled a triptych automatically, which is wrong for a longer cycle
that only has three books so far.

A book that stands alone belongs in no group — **The Weight of Her**
(35) and **Service Life** (48) are deliberately outside every series,
and must stay that way.

For banners, and for starting a new series from scratch, see
[CUSTOMISING.md](CUSTOMISING.md). One thing to know before you paint
one: a banner replaces the written series heading, on the assumption
its artwork carries the name. A panorama with no lettering in it needs
the heading put back by hand — CUSTOMISING has the rule.

### If the book is to be recommended on the About panel

That's a separate edit and not part of adding a book — the panel holds
a fixed number of cards, so featuring a new one means dropping another.
It needs a wide scene image at `assets/start-NN.jpg`, which is not the
cover but a repainting of it: 3:2, subject in the right third, left
half dark and empty for the words, no type anywhere. See CUSTOMISING.

---

## 3. Rebuild the feeds

```
node build-feeds.js
```

Rewrites `feed.xml` and `sitemap.xml`. Search engines and feed readers
can't run the site's JavaScript, so without this the new book is
invisible to them.

---

## 4. Rebuild the share pages

```
node build-share-pages.js
```

Rewrites the `share/` folder — one small page per book.

This is what makes a shared link show the *book's own cover* instead
of the site's forest picture. The reason it's needed at all: everything
after a `#` in a web address never reaches a server, so a link like
`chewzfiction.com/#41-the-title` tells Facebook or iMessage nothing
about which book it is. `share/41-the-title.html` is a real page carrying
that book's cover in its meta tags, and it forwards a reader straight
on to the book. The Share button on each row links here.

Skip this step and the new book's Share button leads to a page that
doesn't exist.

---

## 5. Build the reading text

```
python3 build-reader.py 41       # one book
python3 build-reader.py          # all of them
```

Writes `read/41.json` — the novella pulled out of the PDF as flowing
text, which is what the **Read** button opens. Without it, Read tells
the visitor the book isn't set for reading here yet and offers the PDF
instead. Nothing breaks; the book simply can't be read on the site.

Needs Python and one library: `pip install pdfplumber`.

The script measures each PDF before reading it — the body is whatever
size most of the words are set in — so it copes with the fact that
these books are not all typeset alike. It keeps italics, chapter
headings, and the line breaks in any verse, and drops the title page,
copyright, and contents list.

**Check the number it prints.** A book of 19,000 words should report
somewhere near 18,000 — the difference is the front matter it skips. A
figure far below that means the typesetting did something the script
hasn't seen before. Send it to Claude rather than shipping it: every
book in the catalogue was checked this way, and four of them needed the
script taught something new.

---

## 6. Raise the cache-buster

In `index.html`, near the top, three lines end in `?v=` and a number:

```html
<link rel="stylesheet" href="style.css?v=140">
<script src="stories.js?v=140"></script>
<script src="script.js?v=140"></script>
```

Add one to all three, keeping them identical. Browsers hold these
files hard; changing the number makes each one a new address, so a
returning reader gets the new book instead of yesterday's list.

---

## 7. Upload

To the repository root, replacing what's there:

```
stories.js          the new book
index.html          the raised ?v= number
feed.xml            rebuilt in step 3
sitemap.xml         rebuilt in step 3
share/              the whole folder, rebuilt in step 4
read/41.json        the reading text, built in step 5
pdfs/41.pdf         the new file only
covers/41.jpg       the new file only
```

**Never delete `CNAME`.** It's a one-line file at the root holding the
custom domain. If it goes, the site silently reverts to
`alsamii.github.io` and chewzfiction.com stops working.

**Dragging a folder:** to upload `share/`, drag **the folder itself** into
GitHub's upload area — not the files inside it. Dragging the contents
scatters 55 loose pages across the repository root. If that happens,
press `.` on the repository page to open the browser editor, delete
the strays, and drag the folder in there instead.

GitHub Pages republishes within a minute or two of the commit landing.

---

## Check it worked

- The book appears at the bottom of the list, with its reading time
- If it joined a series, its row names the series and its place in it,
  and the count is right for every other book in that series too
- Its cover shows when the row is opened — a blank frame means the
  cover is missing or is a `.png`
- **PDF** opens the novella
- **Read** opens the novella in the browser, and the type looks right
- **Share** copies a link; pasting it into a message shows *that
  book's cover*
- Opening the shared link lands on the book, already open
- The Door filter still lists four doors, not five

---

## When it goes wrong

**The whole list vanishes.** A missing comma or an unclosed quote in
`stories.js` — one broken block takes the file with it. Compare your
new block against the one above it.

**A blank cover.** The file is missing, named `.png`, or numbered
wrong. It must be `covers/NN.jpg`, two digits.

**The old list keeps showing.** The `?v=` number didn't change, or
only one of the three lines was changed. Check all three match.

**Read says the book isn't set for reading here yet.** `read/NN.json`
was never built, or never uploaded. Everything else about the book
works; only the in-browser reading is missing.

**Share shows the forest picture, not the cover.** The `share/` folder
wasn't rebuilt or wasn't uploaded. Visit
`chewzfiction.com/share/41-the-title.html` — if it 404s, that's the cause.
Note that Facebook and LinkedIn cache previews for days; their
respective debug tools will force a re-read.

**Everything looks right but nothing changed.** Check GitHub itself
rather than the site: open `index.html` in the repository and look at
the `?v=` line. If it's the old number, the upload didn't land — most
often because the file was saved as `index (1).html` and uploaded
under that name, which adds a file instead of replacing one.
