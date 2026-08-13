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

## Adding a book

**See [ADDING-A-BOOK.md](ADDING-A-BOOK.md).** Seven steps, in order, with
the field-by-field format for `stories.js` and what to check afterwards.
It's the one document to follow when the catalogue grows.

## What's in the folder

```
stories.js            THE CATALOGUE — the file edited most
index.html            the page itself: header, About, Author's Notes, footer
style.css             all styling; the light theme is one block at the end
script.js             behaviour — rarely needs touching
build-feeds.js        rebuilds feed.xml + sitemap.xml from stories.js
build-share-pages.js  rebuilds the b/ folder from stories.js
build-reader.py       pulls the reading text out of the PDFs
b/                    one small page per book, so shared links show covers
read/                 each novella as text, for reading on the site
pdfs/                 the novellas, numbered: 01.pdf, 02.pdf ...
covers/               a cover per novella, numbered to match: 01.jpg ...
assets/               backdrop artwork, the Roya mark, icons, ambient audio
feed.xml              generated — don't edit by hand
sitemap.xml           generated — don't edit by hand
CNAME                 the custom domain. NEVER DELETE THIS FILE
404.html              shown for an address that doesn't exist
```

## The three generated things

None is written by hand:

```
node build-feeds.js         → feed.xml, sitemap.xml   (reads stories.js)
node build-share-pages.js   → b/                      (reads stories.js)
python3 build-reader.py     → read/                   (reads pdfs/)
```

Run all three whenever a book is added or changed, and commit what they
produce.

`feed.xml` and `sitemap.xml` are how search engines and feed readers see
a site whose list is built in JavaScript. The `b/` folder is how a shared
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

## The backdrop and the ambient sound

**Backdrop.** `assets/bg/bg-path.jpg` + `.webp`, darkened and vignetted
in CSS so text stays readable. Both formats are needed: browsers take
the webp and fall back to the jpg.

A second scene, `bg-tearoom`, is fully built but switched off — the head
of `index.html` sets `SCENES = 1`, so only scene 0 is ever chosen.
Raising it to `2` makes the backdrop alternate between the two, never
the same one twice running.

**Ambient sound.** `assets/ambient-tearoom.mp3`, off until the speaker
in the header is pressed, then held at a low fixed level. Any audio
hosted here needs a licence that permits it — a track lifted from
YouTube does not.

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

## Cache-busting

Three lines near the top of `index.html` end in `?v=` and a number.
Raise all three together after any change to `style.css`, `script.js`,
or `stories.js`, or returning readers keep seeing the old version.

## Hosting

GitHub repository `alsamii/alsamii.github.io` → Netlify, which
republishes on every commit. The domain is managed at Porkbun:
chewzfiction.com is canonical, chewzroya.com redirects to it. `CNAME`
at the repository root is what holds the custom domain — deleting it
silently reverts the site to `alsamii.github.io`.

## If something breaks

Nine times in ten it's `stories.js`: a missing comma between blocks or
an unclosed quote, which takes the whole list down. Undo, save, refresh.
The other one time is the `?v=` number not being raised, so the browser
is still showing yesterday's file.
