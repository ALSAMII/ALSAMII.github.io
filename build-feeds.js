/* ============================================================
   REBUILDS feed.xml AND sitemap.xml FROM stories.js

   Search engines and feed readers can't run your JavaScript, so
   they never see the books — the page is one <div> to them.
   These two static files tell them what's here.

   Run this whenever you add or change a book:

       node build-feeds.js

   Then commit feed.xml and sitemap.xml along with stories.js.
   If you'd rather not run it, tell Claude and it'll regenerate
   the two files for you.
   ============================================================ */

const fs = require("fs");

const SITE = "https://www.chewzfiction.com";
const AUTHOR = "Chew Z";

/* stories.js declares plain consts, so evaluate it and take them out. */
const src = fs.readFileSync("stories.js", "utf8");
const { STORIES, TRILOGIES } = new Function(
  src + "; return { STORIES, TRILOGIES };"
)();

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const slug = (s) =>
  String(s.num).padStart(2, "0") + "-" +
  s.title.toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const trioSlug = (t) =>
  (t.books.length === 3 ? "triptych-" : "series-") +
  t.title.toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* ---- feed.xml -------------------------------------------------
   Newest book first, which for a numbered series means highest
   number first. Dates are stable per book so readers don't
   re-flag everything as new on each rebuild. */

const EPOCH = Date.UTC(2024, 0, 1);
const dateFor = (n) =>
  new Date(EPOCH + n * 7 * 86400000).toUTCString();

const items = [...STORIES]
  .sort((a, b) => b.num - a.num)
  .map((s) => {
    const n = String(s.num).padStart(2, "0");
    return `    <item>
      <title>${esc(n + ". " + s.title)}</title>
      <link>${SITE}/#${slug(s)}</link>
      <guid isPermaLink="false">chewz-${n}</guid>
      <pubDate>${dateFor(s.num)}</pubDate>
      ${s.door ? `<category>${esc(s.door)}</category>` : ""}
      <description>${esc(s.synopsis)}</description>
    </item>`;
  })
  .join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${AUTHOR} — Short Fiction</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Short noir novellas about people who find out something true about themselves and can't put it back.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

fs.writeFileSync("feed.xml", feed);

/* ---- sitemap.xml ---------------------------------------------- */

const today = new Date().toISOString().slice(0, 10);

const urls = [
  `  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>`,
  ...STORIES.map(
    (s) =>
      `  <url><loc>${SITE}/#${slug(s)}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>`
  ),
  ...TRILOGIES.map(
    (t) =>
      `  <url><loc>${SITE}/#${trioSlug(t)}</loc><lastmod>${today}</lastmod><priority>0.6</priority></url>`
  ),
  ...STORIES.map(
    (s) =>
      `  <url><loc>${SITE}/pdfs/${String(s.num).padStart(2, "0")}.pdf</loc><lastmod>${today}</lastmod><priority>0.7</priority></url>`
  ),
].join("\n");

fs.writeFileSync(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
);

/* ------------------------------------------------------------
   THE SCALE PHRASE IN index.html's METADATA

   This used to write the exact count into the <title> and the three
   descriptions on every run, from STORIES.length, so the number could
   never go stale in the file.

   It was stale everywhere that mattered anyway. Google recrawls a site
   this size every few weeks, so every book published left ITS copy of
   the title wrong until the next crawl — and the title is the first
   thing a stranger sees. A search result reading "One hundred and two
   Short Noir Novellas" over a shelf holding a hundred and nine is what
   finally retired it.

   The metadata now says "Over a hundred", which is true of every
   catalogue from 100 to 199 and needs no rewriting at all. What is
   left here is the other half of that job: making sure it stays true,
   and saying so loudly when it stops.

   Nothing in index.html is written by this script any more. Reword the
   title and the descriptions freely — only the phrase named in SCALE
   below is anybody's business but yours.
   ------------------------------------------------------------ */

const SCALE = "Over a hundred short noir novellas";
const html = fs.readFileSync("index.html", "utf8");
let scaleNote;

if (!html.includes(SCALE)) {
  scaleNote = `index.html: the phrase "${SCALE}" is not there any more.\n` +
              "            Nothing was changed — but if you reworded the metadata,\n" +
              "            update SCALE in build-feeds.js so this keeps watching\n" +
              "            the right words.";
  console.warn(scaleNote);
  scaleNote = "index.html: scale phrase not found (see above)";
} else if (STORIES.length < 100 || STORIES.length > 199) {
  console.error(
    `\nindex.html SAYS "${SCALE}" AND THE SHELF NOW HOLDS ${STORIES.length}.\n` +
    "That sentence is in the <title>, the meta description, the Open Graph\n" +
    "description and the Twitter description, and it is the first thing a\n" +
    "stranger reads. Reword all four by hand, then update SCALE in\n" +
    "build-feeds.js to match. feed.xml and sitemap.xml were written fine."
  );
  process.exitCode = 1;
  scaleNote = `index.html: SCALE PHRASE NOW WRONG at ${STORIES.length} books`;
} else {
  scaleNote = `index.html: untouched — "${SCALE}" still true at ${STORIES.length}`;
}

console.log(
  `feed.xml: ${STORIES.length} items\n` +
  `sitemap.xml: ${STORIES.length * 2 + TRILOGIES.length + 1} urls\n` +
  scaleNote
);
