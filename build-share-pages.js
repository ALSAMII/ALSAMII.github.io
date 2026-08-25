/* ============================================================
   BUILDS ONE SHARE PAGE PER BOOK, INTO /share/

   Why this exists
   ---------------
   A link like  chewzfiction.com/#02-bright-mercy  opens the right
   book in a reader's browser, but everything after the # is never
   sent to a server. Facebook, iMessage, WhatsApp and the rest only
   ever receive  chewzfiction.com  — so every book shared the site's
   own forest picture, whichever book it was.

   The fix is a real page per book at  /share/<slug>.html , carrying that
   book's cover, title and hook in its meta tags. A crawler reads
   those and shows the cover. A person is sent on to the book itself
   before they can read a word of it.

   Run this whenever you add or change a book:

       node build-share-pages.js

   Then commit the /share folder. (build-feeds.js still handles feed.xml
   and sitemap.xml — this is a separate step.)
   ============================================================ */

const fs = require("fs");
const path = require("path");

const SITE = "https://www.chewzfiction.com";
const OUT = "share";

/* stories.js declares plain consts, so evaluate it and take them out. */
const src = fs.readFileSync("stories.js", "utf8");
const { STORIES } = new Function(src + "; return { STORIES };")();

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* The same slug script.js writes into the address bar, so a shared
   page and a pinned book always agree on the name. */
const slugFor = (s) =>
  String(s.num).padStart(2, "0") + "-" +
  s.title.toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const pad = (n) => String(n).padStart(2, "0");

/* What the preview says under the cover. The hook is written to be
   read cold, which is exactly what a link needs; the synopsis is the
   fallback, trimmed to something a preview card will actually show. */
function blurb(s) {
  if (s.hook) return s.hook;
  const syn = String(s.synopsis || "");
  if (syn.length <= 200) return syn;
  const cut = syn.slice(0, 200);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

/* The size of a cover, read from the file rather than assumed.

   Scrapers that trust og:image:width will also be misled by it, and a
   wrong number is worse than no number: the catalogue is not uniform —
   No. 64 is 1000x1499 where No. 65 is 1000x1500 — so stating a
   constant would have been wrong for some books and quietly wrong at
   that. This walks the JPEG's segment markers to the frame header and
   reads the two numbers actually in the file. No dependency: it is
   twenty lines of byte-counting against a format that has not changed
   since 1992.

   Returns null when the cover is missing or unreadable, and the tags
   are then left out entirely, which every scraper handles. */
function coverSize(file) {
  let buf;
  try { buf = fs.readFileSync(file); } catch { return null; }
  if (buf.length < 4 || buf[0] !== 0xFF || buf[1] !== 0xD8) return null;  /* not a JPEG */

  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xFF) { i++; continue; }                 /* resync */
    const marker = buf[i + 1];
    if (marker === 0xD8 || marker === 0x01 ||
        (marker >= 0xD0 && marker <= 0xD7)) { i += 2; continue; }  /* no payload */
    const len = buf.readUInt16BE(i + 2);

    /* SOF0/1/2/3/5/6/7/9/10/11/13/14/15 — every frame header carries
       height then width at the same offset. DHT/DAC/DNL are excluded. */
    const isSOF = (marker >= 0xC0 && marker <= 0xCF) &&
                  marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC;
    if (isSOF) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function page(s) {
  const slug = slugFor(s);
  const coverFile = path.join("covers", pad(s.num) + ".jpg");
  const cover = `${SITE}/covers/${pad(s.num)}.jpg`;
  const size = coverSize(coverFile);
  const sizeTags = size
    ? `<meta property="og:image:width" content="${size.width}">\n` +
      `<meta property="og:image:height" content="${size.height}">\n`
    : "";
  const target = `${SITE}/#${slug}`;
  const title = `${s.title} — Chew Z`;
  const desc = blurb(s);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>

<!-- This page exists to be read by link previews. A person who opens
     it is sent straight on to the book — see the redirect below. -->
<link rel="canonical" href="${esc(target)}">

<meta name="description" content="${esc(desc)}">

<meta property="og:type" content="book">
<meta property="og:site_name" content="Chew Z">
<meta property="og:url" content="${esc(target)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(cover)}">
<meta property="og:image:secure_url" content="${esc(cover)}">
<meta property="og:image:type" content="image/jpeg">
<!-- Dimensions, read from the file itself. Several scrapers — Slack,
     LinkedIn, Facebook — will skip an image rather than fetch it to
     find out how big it is. Omitted when the cover cannot be read. -->
${sizeTags}<meta property="og:image:alt" content="${esc(s.title)} — cover">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(cover)}">

<!-- Two ways on, because one of them can fail. The refresh works with
     JavaScript turned off; the script runs first when it isn't, and
     replaces this page in history so Back returns to wherever the
     reader came from rather than trapping them here. -->
<meta http-equiv="refresh" content="0; url=${esc(target)}">
<script>location.replace(${JSON.stringify(target)});</script>

<style>
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b0907;
    color: #9c9280;
    font-family: "Jost", "Century Gothic", sans-serif;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-size: 0.7rem;
  }
  a { color: #d8a65f; }
</style>
</head>
<body>
  <!-- Seen only if both ways on fail. -->
  <p>Opening <a href="${esc(target)}">${esc(s.title)}</a>…</p>
</body>
</html>
`;
}

fs.mkdirSync(OUT, { recursive: true });

let written = 0;
for (const s of STORIES) {
  const file = path.join(OUT, slugFor(s) + ".html");
  fs.writeFileSync(file, page(s));
  written++;
}

console.log(`Wrote ${written} share pages into /${OUT}`);
