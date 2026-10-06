<!-- Updated 2026-10-05 — 104 books; the narrations moved off the repo to Backblaze B2 -->
# Chew Z — Short Fiction

A single dark screen: the novellas listed on the left, a candlelit stage
in the middle. Hovering a title shows its synopsis on the stage; the PDF
icon opens the novella; the share icon hands someone a link straight to
it. On phones, tapping the eye unfolds the synopsis under the title
instead. There are two themes — dark by default, light behind the moon
in the header.

Each book can be read in the browser — the **Read** button opens it as
flowing text that sets its own size and remembers where you stopped —
or downloaded as the typeset PDF. A small magnifying-glass button on
every cover — on the shelf and in the Roya Library — opens that
cover full-size without leaving the page, showing a paired front-and-back
render for books that have one.

Live at <https://www.chewzfiction.com>.

## The three guides

**[ADDING-A-BOOK.md](ADDING-A-BOOK.md)** — seven steps, in order, with
the field-by-field format for `stories.js` and what to check afterwards.
Follow it whenever the catalogue grows.

**[ADDING-AUDIO.md](ADDING-AUDIO.md)** — narration: the download link,
the synced read-along that highlights the sentence being spoken, and the
script that builds it. Independent of adding the book itself; a book can
gain a recording years later.

**[CUSTOMISING.md](CUSTOMISING.md)** — everything else: the backdrops
and their sizes, series and their painted banners, bilingual titles,
the cover zoom button, the door filter and the three dials, Pick a
Door on the About panel and the crop/synopsis-length trap it taught,
the recommended series below it, wiring up a newsletter, the two
themes, and how publishing works.

## What's in the folder

```
stories.js            THE CATALOGUE — the file edited most
index.html            the page itself: header, About, Author's Notes, footer
style.css             all styling; the light theme is one block at the end
script.js             behaviour — rarely needs touching
build-feeds.js        rebuilds feed.xml + sitemap.xml from stories.js
build-share-pages.js  rebuilds the share/ folder from stories.js
build-reader.py       pulls the reading text out of the PDFs
build-audio-sync.py   aligns a recording to that text; see ADDING-AUDIO.md
optimize-art.py       makes the .webp twin of every picture (needs --write)
share/                one small page per book, so shared links show covers
read/                 each novella as text, for reading on the site;
                      NN.sync.json beside it when the book has narration
.nojekyll             tells GitHub Pages to serve the files as they are
pdfs/                 the novellas, numbered: 01.pdf, 02.pdf ...
covers/               a cover per novella, numbered to match: 01.jpg ...
                      plus its .webp twin, which the page asks for first
covers/pairs/         optional: a front-and-back zoom render per novella,
                      same numbering — falls back to covers/ when absent
assets/               backdrops, series banners, the Roya mark, icons
assets/audio/         empty, and gitignored. The narrations are NOT in this
                      repository — they are on Backblaze B2; see ADDING-AUDIO.md.
                      build-audio-sync.py stages its output here before upload
library/              the Roya Library — the section that replaced All Covers.
                      Two built files and its own pictures; see CUSTOMISING.md
library/covers/       the flat front art, 560x840 webp, numbered to match
feed.xml              generated — don't edit by hand
sitemap.xml           generated — don't edit by hand
CNAME                 the custom domain. NEVER DELETE THIS FILE
404.html              shown for an address that doesn't exist
```

## The generated things

None is written by hand:

```
node build-feeds.js         → feed.xml, sitemap.xml, index.html's counts
node build-share-pages.js   → share/                      (reads stories.js)
python3 build-reader.py     → read/NN.json             (reads pdfs/)
python3 optimize-art.py     → the .webp twin of every picture  (--write)
python3 build-audio-sync.py → read/NN.sync.json + a staged mp3 to upload
```

Run the first three whenever a book is added or changed, and commit what
they produce. `optimize-art.py` only when a picture was added or replaced;
`build-audio-sync.py` only when a recording arrives — and of its two
outputs, commit the sync file and upload the mp3 rather than committing
it.

Two of them do more than their names suggest. `build-feeds.js` also
rewrites the six count phrases inside `index.html` — see *The shelf
count* below — so `index.html` is a build output as well as a file you
hand-edit. And `optimize-art.py` **skips any picture whose `.webp`
already exists**, which makes it safe to re-run but also means a replaced
`.jpg` keeps serving its old `.webp` until you delete that twin first.

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
- **Pick a Door** on the About panel — nine books recommended, three
  under each door (Noir, Transgressive, Plausible) — the `data-book="12"`
  attributes; each also wants an `assets/start-NN.jpg` scene image. See
  CUSTOMISING.md for the full picture and markup rules
- the footer

## Series

Fourteen of them, declared in the `TRILOGIES` block at the bottom of
`stories.js`. Each names its books by number; every book in one then
labels itself on its own row — "LES FOLIES · 2 of 3" — with nothing
written per book. A series that sets `numbered: false` shows its name
alone, without the position; six of the fourteen do, because their books
share a world rather than an order.

Two of them carry a painted panorama, shown in place of a row of
spines, with the written heading above it: Daughters of Anahita and The
Borrowed Sun Cycle. The other twelve have no `banner` line and show
their books' spines instead, which is the default — right for a
thematic group, where the books share a subject rather than a story and
a single panorama would claim more continuity than there is. See
CUSTOMISING.md for sizes.

## The backdrop and the ambient sound

One photograph, `assets/bg/bg-path`, as jpg and webp.

⚠ **Two backdrops the CSS still asks for are not in the folder.**
`style.css` points the light theme at `assets/bg/bg-paper.jpg` / `.webp`,
and neither exists — the light theme currently loads no backdrop at all.
The same is true of `bg-tearoom`, the second scene: `style.css` has the
rule, `index.html` has `SCENES = 1` in its head, and raising it to `2`
would ask for a file that isn't there. Neither is a new fault and neither
breaks the page — a missing background image is simply not drawn — but
both are worth knowing before you go looking for the switch.

Note too that the ambient track is mapped to **scene 0**, not to the
tearoom it is named after, so a second scene would also play nothing.

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

## Narration

A book can carry a recording, and this is independent of everything
above — a book published two years ago can gain one tomorrow without any
other file changing. Set `audio: "https://f005.backblazeb2.com/file/roya-audio/NN.mp3"`
on its entry in `stories.js` and an Audio control appears beside Read and
PDF; in the Roya Library the same field opens a small panel offering
*Listen here* or a download.

**The recordings are not in this repository.** They live on Backblaze B2
and the field carries a whole address. Forty-five hours of audio against a
1 GB limit on the published site is not a fight worth having, and the code
already supported an absolute address without any change.

Build `read/NN.sync.json` as well and the Read view gains a play bar
that lights up the sentence being spoken as it goes. Without the sync
file the recording is still a plain download; the reader simply doesn't
get the in-page player. **[ADDING-AUDIO.md](ADDING-AUDIO.md)** has the
whole of it.

Nineteen books are narrated — **2**, **5**, **6**, **7**, **8**, **9**,
**11**, **12**, **13**, **19**, **22**, **26**, **31**, **35**, **40**,
**52**, **78**, **89** and **102** — about forty-five hours.

⚠ **Whatever hosts these files must send `Content-Type: audio/mpeg`, and
the test for it must be run in Safari.** GitHub Releases was tried and
fails: it labels every asset `application/octet-stream`, which Chrome
sniffs past and Safari refuses. `read/01.sync.json` is still published for
a book 1 narration that was never wired up; its mp3 was deleted on
2026-10-05.

## The shelf count

**Nothing on the site needs the count typed in.** Add a book and every
figure follows, in one of two ways:

*Counted as the page runs* — from the length of `STORIES`, so they can
never disagree with the catalogue: the label above the order menu ("All
98 stories · order"), the hero's "98 Short Novellas", the shelf's
"showing N of N", the order menu's own gloss, and in the Roya Library
the rail's `98 STORIES`, the collection heading, the footer and the
About line.

*Rewritten by `node build-feeds.js`* — the six places a crawler has to
be able to read without running JavaScript: the `<title>` and the five
`description` / `og:` / `twitter:` tags in `index.html`. The script
spells the number out ("Ninety-eight") and matches on the phrase around
it rather than on the previous number, so it keeps working whatever the
count was last time, including when it goes down. It prints how many
places it changed; if that ever says 0, the phrases were reworded and
`PATTERNS` at the foot of `build-feeds.js` needs adjusting.

So the whole of it is: add the book, run the three build commands, and
every count on the site is right.

## Cache-busting

**Nine** lines in `index.html` end in `?v=` and a number — four near
the top for the share and preloaded images, five at the foot for the two
stylesheets and the three scripts:

```
near the top
  og:image                    assets/og-roya.png?v=
  twitter:image               assets/og-roya.png?v=
  preload                     assets/bg/bg-path.webp?v=
  preload                     assets/start-06.webp?v=
at the foot
  style.css?v=
  library/roya-library.css?v=
  stories.js?v=
  script.js?v=
  library/roya-library.js?v=
```

**The five at the foot are kept on one shared number.** They were once
independent counters and in principle still are, but in practice every
change raises all five together, and doing it that way costs nothing and
removes a whole class of mistake. Raise it whenever any of those five
files changes — including a pure version-stamp edit, which is cheaper to
raise than to think about.

**That shared number also governs every picture on the site.** `script.js`
reads the version off its own `src` and appends it to every image URL it
builds — see `ASSET_V` near the top of the file — so a replaced
`covers/NN.jpg`, a new pair render or a new scene painting all reach the
reader through that one number and nothing else. This is the part most
easily forgotten: **replace a cover without raising the stamp and the
old cover goes on being served**, out of the reader's own cache, with
nothing to tell either of you.

The four near the top are the exception and do lag, deliberately. They
only need to move when the Roya promo image or one of the two preloaded
paintings is itself replaced, which is rare — so don't be surprised to
see `og:image` sitting a hundred and forty behind the rest. That is
normal, not a sign anything was missed.

It is always safe to raise a number that didn't strictly need it, just
wasted work — the only real mistake is forgetting to raise one that did.

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
