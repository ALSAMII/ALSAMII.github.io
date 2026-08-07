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

console.log(
  `feed.xml: ${STORIES.length} items\n` +
  `sitemap.xml: ${STORIES.length * 2 + TRILOGIES.length + 1} urls`
);
