/* ============================================================
   BUILDS ONE SHARE PAGE PER BOOK, INTO /b/

   Why this exists
   ---------------
   A link like  chewzfiction.com/#02-bright-mercy  opens the right
   book in a reader's browser, but everything after the # is never
   sent to a server. Facebook, iMessage, WhatsApp and the rest only
   ever receive  chewzfiction.com  — so every book shared the site's
   own forest picture, whichever book it was.

   The fix is a real page per book at  /b/<slug>.html , carrying that
   book's cover, title and hook in its meta tags. A crawler reads
   those and shows the cover. A person is sent on to the book itself
   before they can read a word of it.

   Run this whenever you add or change a book:

       node build-share-pages.js

   Then commit the /b folder. (build-feeds.js still handles feed.xml
   and sitemap.xml — this is a separate step.)
   ============================================================ */

const fs = require("fs");
const path = require("path");

const SITE = "https://www.chewzfiction.com";
const OUT = "b";

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

function page(s) {
  const slug = slugFor(s);
  const cover = `${SITE}/covers/${pad(s.num)}.jpg`;
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
<meta property="og:image:alt" content="${esc(s.title)} — cover">

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
