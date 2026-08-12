# Adding a book

Everything that has to happen when a new novella joins the site, in
order. Nothing here is optional — a step skipped shows up as a blank
cover, a broken link, or a share preview with the wrong picture.

If you'd rather not do it by hand: send Claude the book's details and
the cover, and ask for the full set of files. Claude will hand back
everything below, named and ready to upload.

---

## The short version

1. Add `pdfs/NN.pdf` and `covers/NN.jpg`
2. Add the book's block to `stories.js`
3. Run `node build-feeds.js` → updates `feed.xml` + `sitemap.xml`
4. Run `node build-share-pages.js` → updates the `b/` folder
5. Raise the `?v=` number in `index.html`
6. Upload: `stories.js`, `index.html`, `feed.xml`, `sitemap.xml`,
   the `b/` folder, the new PDF, the new cover

Everything after this is the same six steps, explained.

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

Series groups live in the `TRILOGIES` block near the bottom of
`stories.js`. Add the number to the right group's `books` list:

```js
{ title: "The Sovereign Rooms", label: "", books: [36, 37, 38, 39, 40, 41] },
```

Leave `label` empty for a plain series heading; a group of three uses
`"A Triptych"`. A book that stands alone belongs in no group at all —
**The Weight of Her** (35) is deliberately outside every group, and
must stay that way.

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

Rewrites the `b/` folder — one small page per book.

This is what makes a shared link show the *book's own cover* instead
of the site's forest picture. The reason it's needed at all: everything
after a `#` in a web address never reaches a server, so a link like
`chewzfiction.com/#41-the-title` tells Facebook or iMessage nothing
about which book it is. `b/41-the-title.html` is a real page carrying
that book's cover in its meta tags, and it forwards a reader straight
on to the book. The Share button on each row links here.

Skip this step and the new book's Share button leads to a page that
doesn't exist.

---

## 5. Raise the cache-buster

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

## 6. Upload

To the repository root, replacing what's there:

```
stories.js          the new book
index.html          the raised ?v= number
feed.xml            rebuilt in step 3
sitemap.xml         rebuilt in step 3
b/                  the whole folder, rebuilt in step 4
pdfs/41.pdf         the new file only
covers/41.jpg       the new file only
```

**Never delete `CNAME`.** It's a one-line file at the root holding the
custom domain. If it goes, the site silently reverts to
`alsamii.github.io` and chewzfiction.com stops working.

**Dragging a folder:** to upload `b/`, drag **the folder itself** into
GitHub's upload area — not the files inside it. Dragging the contents
scatters 40 loose pages across the repository root. If that happens,
press `.` on the repository page to open the browser editor, delete
the strays, and drag the folder in there instead.

Netlify picks up the commit and republishes within a minute or two.

---

## Check it worked

- The book appears at the bottom of the list, with its reading time
- Its cover shows when the row is opened — a blank frame means the
  cover is missing or is a `.png`
- **PDF** opens the novella
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

**Share shows the forest picture, not the cover.** The `b/` folder
wasn't rebuilt or wasn't uploaded. Visit
`chewzfiction.com/b/41-the-title.html` — if it 404s, that's the cause.
Note that Facebook and LinkedIn cache previews for days; their
respective debug tools will force a re-read.

**Everything looks right but nothing changed.** Check GitHub itself
rather than the site: open `index.html` in the repository and look at
the `?v=` line. If it's the old number, the upload didn't land — most
often because the file was saved as `index (1).html` and uploaded
under that name, which adds a file instead of replacing one.
