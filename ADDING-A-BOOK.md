<!-- Updated 2026-10-06 17:14 PDT — the narration lives on Backblaze B2, not in the repo, and
     its upload must set Content-Disposition; counts refreshed to 104 books. -->
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

1. Add `pdfs/NN.pdf`, `covers/NN.jpg` and `library/covers/NN.webp`
2. Add the book's block to `stories.js`
2b. Run `python3 optimize-art.py --write` → writes `covers/NN.webp`
3. Run `node build-feeds.js` → `feed.xml`, `sitemap.xml`, the counts
   in `index.html`
4. Run `node build-share-pages.js` → updates the `share/` folder
5. Run `python3 build-reader.py NN` → writes `read/NN.json`
6. **Run `node check-book.js NN` and fix whatever it reports**
5b. *If it has a narration:* `python3 build-audio-sync.py NN rec.mp3`,
   upload the mp3 to the B2 bucket, then add `audio:` to the book's block
6. Raise the `?v=` number in `index.html` — all five at the foot
7. Upload: `stories.js`, `index.html`, `feed.xml`, `sitemap.xml`,
   the `share/` folder, `read/NN.json`, the new PDF, all the covers

**The count looks after itself.** Nowhere on the site do you type how
many stories there are — step 3 rewrites the six places a crawler
reads, and everything else counts `STORIES` as the page runs. See "The
shelf count" in [README.md](README.md).

Everything after this is the same steps, explained. There are 104 books
as this is written; the two lettered steps are the ones most often
skipped.

---

## 0. Before you commit: `node check-book.js NN`

**Run this last, every time, and read what it says.** It is the only step
that fails loudly.

```
node check-book.js 105      # one book
node check-book.js          # the whole catalogue
```

Every other step on this page fails *silently*. A forgotten
`node build-share-pages.js` does not error — it leaves `share/<slug>.html`
absent, and nothing on the site links to that file, so the shelf, the
Library and the reader all look perfect while every Share button for that
book hands out a 404. That is how No. 105 shipped, and the fault only
surfaced when somebody pasted the link into a message.

The check knows about every failure that has actually happened here:

| it checks | because |
|---|---|
| `share/<slug>.html` exists, and its `og:image` resolves | the 404 above |
| `feed.xml` and `sitemap.xml` carry the book | same forgotten script |
| `index.html` says the right number in words | same forgotten script |
| every `audio:` is a whole B2 address | a `stories.js` edited from a pre-B2 copy silently restored `assets/audio/NN.mp3` paths and killed all nineteen narrations |
| the displayed reading time matches the book's own text | a card once showed a series' six hours on a two-hour book |
| `read/NN.json` opens on the title | `build-reader.py` takes the title from `stories.js`, so running it first leaves the reader with no title |
| door is one of the four, room and key carry their em dash | a typo here shows on the page |
| the pair render's two files agree | the shelf wants the `.jpg`, the Library wants the `.webp` |

It exits non-zero on a failure, so it can gate a commit:

```
node check-book.js 105 && git add -A && git commit -m "Book 105"
```

A **WARN** never fails the run — those are things worth knowing that break
nothing. A **FAIL** is something a reader would hit.

---

## 1. The files

All named by the book's number, padded to two digits. The site finds
them on its own — nothing points at them by name.

```
pdfs/41.pdf              the novella itself
covers/41.jpg            its cover, as the shelf shows it
library/covers/41.webp   the flat front, as the Roya Library shows it
```

**For books 1–9, the padding is not optional — it's `01.jpg`, not
`1.jpg`.** The site's own lookup builds the path as
`"covers/" + String(num).padStart(2, "0") + ".jpg"`, which always asks
for the zero-padded name for a single-digit book; `padStart` is a no-op
once the number already has two digits, so
10 and up look the same padded or not, and it's easy to assume padding
doesn't matter anywhere. It caused a real outage once: a full cover
refresh wrote `1.jpg` through `9.jpg`, and those nine books silently
kept their old covers for a while since the site was never asking for
those filenames. Worth an `ls covers/` check after touching any
single-digit book, specifically looking for a stray unpadded `1.jpg`–
`9.jpg` that shouldn't be there.

**Name the cover `.jpg`.** Not `.png`, not `.jpeg` — `covers/41.jpg`
is the path the site builds. It will in fact ask for `covers/41.webp`
first and fall back to the `.jpg` if that isn't there, so both work and
both should exist; but the `.jpg` is the one that must be present, and
the `.webp` is made from it by `optimize-art.py` (see step 2b). If your
artwork is a PNG, convert it first.

**800 × 1200, JPEG.** All 98 covers are that size, and they run 175–360
KB with the median at 260 KB. Anything much heavier is worth re-saving.

**Keep the PDF under about 1.5 MB** where you can. Covers embedded at
full size push a novella past 10 MB, which is a slow download on a
phone. This is guidance rather than a rule and the catalogue does not
fully obey it — eighteen of the 98 PDFs are over 1.5 MB, the largest at
2.4 MB — but the 130 MB the folder now occupies is worth keeping an eye
on. (An earlier version of this page pointed at a `slimpdf.py` for
re-encoding embedded images. **There is no such script in the
repository**; if a PDF needs slimming, ask for it and it gets written.)

**`library/covers/41.webp` — the flat front.** The Roya Library lays
the covers out as book faces inside a printed board frame, so it wants
the artwork flat and on its own: 560 × 840, webp, about 70 KB. It is
the same picture as `covers/41.jpg`, without the shelf render around
it. If it is missing the section falls back to `covers/41.jpg` rather
than showing a hole, so a forgotten file is a book that looks slightly
out of place rather than a broken page — but the flat art is what the
frame was drawn for, and it is worth having.

**A third file, optional: `covers/pairs/NN.jpg`,** and its `.webp`
twin. Same zero-padded naming — a wider render pairing the front and
back cover side by side, shown only when someone opens the magnifying-
glass zoom. 3:2 landscape; older ones are 2496 × 1664 and newer ones
1536 × 1024, and either is fine.

**Make the `.webp` for this one by hand.** `optimize-art.py` does not
reach into `covers/pairs/`, and the Roya Library asks for
`covers/pairs/NN.webp` *first* — so without it, every Library view of
that book spends a failed request before falling back to the `.jpg`.
Only 27 of the 104 books have the webp today, which is why the other
seventy-seven each cost one 404 on that panel.

Skipping the pair render altogether isn't a mistake the way skipping the
plain cover is: the shelf's zoom falls back to `covers/NN.jpg`, and the
Library falls back to `library/covers/NN.webp`, with no broken image and
nothing to configure. Add it when a 3D pair render was made for the
book; leave it out otherwise. See "Cover zoom" in
[CUSTOMISING.md](CUSTOMISING.md) for how the fallback works.

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
  synopsis: "Four sentences or so. This is what stands on the stage.",

  // optional, only when the book has a recording — see step 5b
  audio: "https://f005.backblazeb2.com/file/roya-audio/41.mp3",
  synced: false
},
```

Ten fields, two of them optional. `audio` and `synced` are covered in
step 5b and in [ADDING-AUDIO.md](ADDING-AUDIO.md); everything else is
required.

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
Transgressive, Plausible. They draw the three dials under the
synopsis.

| | 1 | 2 | 3 |
|---|---|---|---|
| **Noir** | Warmth survives it | Cold, but bearable | No rescue at all |
| **Transgressive** | You'll be fine | It will cost you | Genuinely harrowing |
| **Plausible** | Not possible | Almost possible | Entirely possible |

**Watch the direction of the third one.** It runs the opposite way
round from the other two: a `3` means the book could happen tomorrow,
not that it is the strangest. Les Folies is a three straight through;
the Gnostic books at the start of the catalogue are mostly ones. An
earlier version of this page called the dial "Speculative" and had the
scale backwards, which is how Nos. 66 and 67 ended up marked "Not
possible" on the site — a mistake worth remembering, because it is the
one dial where a slip inverts the meaning rather than softening it.

Across the catalogue the third dial runs 1 for 29 books, 2 for 24 and 3
for 45, so none of the three values is unusual and none should be
reached for by default.

**`synopsis`** — the stage copy. **House practice has drifted and you
should know in which direction**: the median is four sentences and 84
words, but the last ten books run from 85 to 248 words and up to
thirteen sentences. `stories.js`'s own header comment still says "about
sixty words", which now describes only the earliest books. Write what
the book needs; four sentences is a floor rather than a ceiling, and
anything past about 150 words should be a deliberate choice. No line
breaks — one book (35) has one, and it is not a model.

**`audio`** — optional, and only when a recording exists. **A full
`https://` address, not a path**: the recordings live on Backblaze B2,
not in this repository, so it reads
`"https://f005.backblazeb2.com/file/roya-audio/41.mp3"`. One field, three
effects — the Audio control on the shelf row, the play bar in the Read
view, and the *Narrated* panel in the Roya Library. A relative path still
works if a file is ever served from the repo again. See step 5b.

**`synced`** — optional, and only alongside `audio`. Leave it out and
the Library promises the highlighted read-along, which is right whenever
`read/NN.sync.json` exists. Set `synced: false` for a recording that
plays without a sync file, so the panel promises only that the book
opens with the recording running.

Everything else you may see in `script.js` — `cover`, `pdf` — is a
per-book path override that no book currently uses. Ignore them unless
a book genuinely needs to sit somewhere else.

⚠ **Do not touch `library/stories.js`.** There is a second, older copy
of this catalogue inside `library/`, along with a `library/index.html`.
Neither is published and neither is read by anything — `library/` is a
layout lab, and the live Roya Library section reads the real `STORIES`
straight from the root `stories.js`. Editing the copy does nothing and
will waste an afternoon.

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
itself on its own row — "The Borrowed Sun Cycle · 4 of 7" — from its
position in that list, and the count updates on its own as the series
grows. Nothing goes in the book's own block.

**Unless the series sets `numbered: false`,** in which case the row
shows the series name alone and no position. Six of the fourteen do:
The Ghariban, From the Delgoshā, Thursday Nights, From the Old Book,
Come In the Water Is Lovely, and From the Unsaid. Use it whenever the
books share a world rather than an order, so that nobody reads "3 of 7"
as an instruction to find the other six first.

Leave `label` empty for a plain heading; a group of three uses
`"A Triptych"`. Leave it out altogether and a group of three is
labelled a triptych automatically, which is wrong for a longer cycle
that only has three books so far.

A book that stands alone belongs in no group, and **31 of the 98 are
standalones** — the rail lists them together under *Stand alone*. This
is the ordinary case, not the exception: don't reach for a series
because a new book rhymes with an old one.

(An earlier version of this page named *The Weight of Her* (35) as a
permanent standalone that "must stay that way". It has since joined The
Ghariban. Nothing here is load-bearing enough to freeze — if a book
later belongs in a group, move it.)

For banners, and for starting a new series from scratch, see
[CUSTOMISING.md](CUSTOMISING.md). One thing to know before you paint
one: the written heading shows above the banner by default. Only a
painting with the series name lettered into it needs the heading
suppressed, and that is one line in `style.css` — CUSTOMISING has it.

### If the book is to be recommended on the About panel

That's a separate edit and not part of adding a book — the panel is
**Pick a Door**: nine cards fixed in three groups of three (Noir,
Transgressive, Plausible), so featuring a new one means dropping
another from the same door. It needs a wide scene image at
`assets/start-NN.jpg`, which is not the cover but a repainting of it:
Subject in the right third, left half dark and empty for the words, no
type anywhere. **Shape: the house has moved to 3:1** — ten of the twelve
scenes are now 2400 × 800 or 3072 × 1024, and only books 8 and 89 are
still the old 3:2 1536 × 1024. Paint 3:1 unless you have a reason; the
card crops the sides away on a narrow screen, and the wider original
survives that far better.

Two markup details are easy to miss when copying an existing card:
the number and title spans must be joined with `&nbsp;`, not a plain
space or line break, or they can split onto two lines at some widths;
and a book with its own Persian title can carry it as a
`.start-title-fa` span right after the English title. See CUSTOMISING
for the full markup, the image-cropping rules, and why a card's
synopsis length matters for how well the artwork crops on a phone.

---

## 2b. Make the webp twins

```
python3 optimize-art.py            # dry run — shows what it would do
python3 optimize-art.py --write
```

Every picture on the site is asked for as `.webp` first and falls back
to the file actually named, so a missing twin costs one failed request
per picture per visit. This script makes them: `covers/`, `assets/` and
the scene paintings, at the widths and qualities set in its `TARGETS`
list at the top.

Two things to know. **It skips any picture whose `.webp` already
exists** — which makes it safe to re-run, but also means that
*replacing* a cover leaves the old twin in place and still being served.
Delete `covers/NN.webp` first, then run it. And **it does not reach
`covers/pairs/` or `library/covers/`** — those two you make by hand.

Skipping this step isn't fatal; it just quietly costs every visitor a
404 per picture. Books 93 to 97 are missing their twins right now for
exactly this reason.

---

## 3. Rebuild the feeds

```
node build-feeds.js
```

Rewrites `feed.xml` and `sitemap.xml`. Search engines and feed readers
can't run the site's JavaScript, so without this the new book is
invisible to them.

**It also rewrites `index.html`** — the six places the book count is
spelled out for a crawler: the `<title>` and the five
`description` / `og:` / `twitter:` tags. It prints how many it changed.
So `index.html` is a build output as well as the file you hand-edit in
step 6, and the two edits have to survive each other: **run this before
raising the `?v=` numbers, not after**, or the count rewrite will be
sitting on top of an `index.html` you then edit again for no reason.

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

⚠ **It writes, but it never deletes.** The script only ever adds pages,
so **retitling a book leaves its old share page behind**, live and
pointing at a `#` address that no longer resolves. `share/` currently
holds a dead `01-the-memory-liturgy.html` from exactly that — book 1 is
now *Quiet Street to the Long Evening*. After any retitle, compare the
folder against the slugs the script just wrote and delete by hand.

A second thing worth an eye: two loose share pages,
`65-the-room-is-quiet.html` and `66-the-illuminated-face.html`, are
sitting in the **repository root** rather than in `share/`. They are
harmless but they are duplicates, and they are the residue of dragging
a folder's contents rather than the folder.

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
book in the catalogue was checked this way, and five of them needed the
script taught something new.

The count is not the only thing worth a look. Open the book with
**Read** and scroll a little: the fault the number cannot show is
prose broken into short lines. The script keeps line breaks where
they are the writing — verse, a prayer under a chapter head — and it
tells verse from prose by the shape of the run: a paragraph fills
every line it has and can only fall short on its last, while verse
sits among short lines. No. 69 was the book that taught it that. Its
italic captions under FROM THE BOOK were being read as verse, so each
one broke mid-sentence at the right margin.

---

## 5b. If the book has a narration — optional

Only when a recording exists. A book can gain one years later, and
nothing else about it changes.

```
python3 build-audio-sync.py NN /path/to/recording.mp3
```

That writes both `assets/audio/NN.mp3` (recompressed for the web) and
`read/NN.sync.json` (the sentence-by-sentence alignment).

The mp3 is a **staging copy — do not commit it.** `assets/audio/*.mp3` is
gitignored. Upload it to the bucket instead, with the content type set
explicitly:

```
b2 file upload --content-type audio/mpeg \
  --info b2-content-disposition='attachment; filename="NN.mp3"' \
  roya-audio assets/audio/NN.mp3 NN.mp3
```

The sync file *does* belong in the repo. Then add one field to the book's
block in `stories.js`:

```js
audio: "https://f005.backblazeb2.com/file/roya-audio/NN.mp3"
```

That single field lights three things at once: an Audio control on the
shelf row, the play bar with sentence highlighting in the Read view, and
a *Narrated* panel in the Roya Library offering **Listen here** or a
download.

Run step 5 first — the aligner needs `read/NN.json` to exist.
**[ADDING-AUDIO.md](ADDING-AUDIO.md)** covers the options, why the
alignment works in sentences rather than words, and the hosting
arithmetic, which is closer to the limit than it looks.

## 6. Raise the cache-buster

In `index.html`, **nine** lines end in `?v=` and a number — four near
the top for the share and preloaded images, five at the foot for the two
stylesheets and the three scripts:

```html
<meta property="og:image"   content=".../assets/og-roya.png?v=374">
<meta name="twitter:image"  content=".../assets/og-roya.png?v=374">
<link rel="preload" as="image" href="assets/bg/bg-path.webp?v=500" ...>
<link rel="preload" as="image" href="assets/start-06.webp?v=517" ...>
<link rel="stylesheet" href="style.css?v=517">
<link rel="stylesheet" href="library/roya-library.css?v=517">
<script src="stories.js?v=517"></script>
<script src="script.js?v=517"></script>
<script src="library/roya-library.js?v=517"></script>
```

**The five at the foot move together, on one shared number.** They were
designed as independent counters and technically still are, but every
change now raises all five at once — it costs nothing, and it removes a
whole class of mistake. Adding a book always changes `stories.js`, so
the number always has to move; raise all five and stop thinking about it.

**That same number is what feeds every picture on the site.**
`script.js` reads the version off its own `src` — see `ASSET_V` at the
top of the file — and appends it to every image URL it builds. So the
shelf covers, the pair renders, the Pick-a-Door scenes and the Roya
Library's flat art all come through this one number. **The consequence
worth memorising: replace a cover at a path that already shipped and
the old cover goes on being served** out of the reader's own cache until
this number moves. That is the single most common way a cover update
appears to do nothing.

**The four near the top lag, deliberately.** They only move when the
Roya promo image or one of the two preloaded paintings is itself
replaced, which is rare — `og:image` currently sits a hundred and forty
behind the rest, and that is correct, not an oversight.

Raising a number that didn't need it isn't a mistake, just wasted work;
leaving one alone that did need it is the one that actually bites.

**`index.html` itself must never carry a `?v=`.** It is the page the
browser asks for by name, and there is nothing upstream of it to
rewrite the address — a version on it is a request for a file that
does not exist, and the site goes blank.

**`read/NN.json` and `read/NN.sync.json` *are* covered** — the reader
fetches both through the same stamp. That was not always true, and the
day it mattered was the re-typesetting of No. 85: readers who had opened
it before went on being served the old text out of their own cache, with
nothing to tell either side. If you replace a book's text, raise the
number.

**`pdfs/NN.pdf` and the narration are NOT covered.** The PDF is linked at
its bare path, and `stamped()` returns the narration's absolute address
untouched by design. For a new book that is fine — there is no cached
version to displace — but **replacing a published PDF or recording will
not reach anyone who has already opened it.** For a PDF that is usually
tolerable; for a recording, upload it under a new filename. See
[ADDING-AUDIO.md](ADDING-AUDIO.md).

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
covers/pairs/41.jpg the new file only, if a pair render exists
library/covers/41.webp   the flat front, the new file only
```

**Never delete `CNAME`.** It's a one-line file at the root holding the
custom domain. If it goes, the site silently reverts to
`alsamii.github.io` and chewzfiction.com stops working.

**Dragging a folder:** to upload `share/`, drag **the folder itself** into
GitHub's upload area — not the files inside it. Dragging the contents
scatters 98 loose pages across the repository root. If that happens,
press `.` on the repository page to open the browser editor, delete
the strays, and drag the folder in there instead.

GitHub Pages republishes within a minute or two of the commit landing.

---

## Check it worked

- **In the Roya Library** (the nav item that replaced All Covers): the
  book is in the grid with its flat cover, the rail says one more
  story than it did, the heading says "the complete collection / N
  stories", and opening the card shows the record with its synopsis,
  its three dials and Door / Room / Key
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
- If a pair render was uploaded, the zoom button shows it, not the
  plain cover — check both the shelf and the Roya Library

---

## When it goes wrong

**The whole list vanishes.** A missing comma or an unclosed quote in
`stories.js` — one broken block takes the file with it. Compare your
new block against the one above it.

**A blank cover.** The file is missing, named `.png`, or numbered
wrong. It must be `covers/NN.jpg`, two digits.

**The old list keeps showing.** `stories.js?v=` didn't get raised — that's
the one that gates the catalogue itself, so it's the one that matters here.

**The page is blank.** Something put a `?v=` on `index.html` itself.
Take it off; nothing else will fix it.

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
