#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════
   build-song-shares.js
   Version 1 · 2026-10-31

   Writes a share page for every album and every song, the same shape
   build-share-pages.js writes for the books: a page that exists to be
   read by link previews and sends a person who opens it straight on.

       share/album-AA-slug.html      →  SITE/#album-AA
       share/song-AA-TT-slug.html    →  SITE/#song-AA-TT

   Run from the repository root, after songs.js is in place:
       node build-song-shares.js

   ── one difference from the book pages ──
   The og:image URL carries the cache stamp, read out of index.html.
   The book pages point at an unstamped cover, and that is a known
   defect: when a cover is replaced the platforms keep serving whatever
   they scraped first, with no way to force a refresh short of each
   one's own debugger. Because the stamp is in the URL here, these
   pages must be regenerated whenever the stamp moves — which is
   whenever anything is added, so it costs nothing extra.
   ══════════════════════════════════════════════════════════════════ */

const fs = require("fs");
const path = require("path");

const SITE = "https://www.chewzfiction.com";
const OUT = "share";

/* ── the catalogue ─────────────────────────────────────────────── */
const src = fs.readFileSync("songs.js", "utf8");
const sandbox = {};
new Function("exports", src + "\nexports.ALBUMS=ALBUMS;exports.SONGS=SONGS;")(sandbox);
const { ALBUMS, SONGS } = sandbox;

/* ── the stamp, read where the browser reads it ─────────────────── */
const stamp = (function () {
  const idx = fs.readFileSync("index.html", "utf8");
  const m = idx.match(/script\.js\?v=(\d+)/);
  if (!m) throw new Error("no cache stamp found in index.html");
  return m[1];
})();

/* ── the image, measured from the file itself ───────────────────
   Several scrapers — Slack, LinkedIn, Facebook — will skip an image
   rather than fetch it to find out how big it is. Same reader as
   build-share-pages.js uses. */
function jpegSize(file) {
  let buf;
  try { buf = fs.readFileSync(file); } catch (e) { return null; }
  if (buf.readUInt16BE(0) !== 0xffd8) return null;
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

const esc = s => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const pad2 = n => ("0" + n).slice(-2);

/* Latin slug. A Persian title has no usable one, so its transliteration
   is used — which is why every Persian entry carries one. */
const slug = s => String(s).toLowerCase()
  .replace(/[‘’']/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "") || "x";

function page(o) {
  /* The LANDSCAPE card, not the square front. twitter:card is
     summary_large_image and og renders the same way: a wide picture with
     the title and the domain drawn underneath it by the platform. A
     square image in that slot gets cropped or pillarboxed by whoever is
     rendering it, and the record ends up trimmed. 1200 x 630 is the
     shape every platform actually wants. */
  const img = `${SITE}/albums/card/${pad2(o.albumNum)}.jpg?v=${stamp}`;
  const size = jpegSize(path.join("albums", "card", pad2(o.albumNum) + ".jpg"));
  const sizeTags = size
    ? `<meta property="og:image:width" content="${size.width}">\n` +
      `<meta property="og:image:height" content="${size.height}">\n`
    : "";

  return `<!DOCTYPE html>
<html lang="${o.fa ? "fa" : "en"}"${o.fa ? ' dir="rtl"' : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>

<!-- This page exists to be read by link previews. A person who opens
     it is sent straight on to the recording — see the redirect below. -->
<link rel="canonical" href="${esc(o.target)}">

<meta name="description" content="${esc(o.desc)}">

<meta property="og:type" content="music.${o.kind === "album" ? "album" : "song"}">
<meta property="og:site_name" content="Chew Z">
<meta property="og:url" content="${esc(o.target)}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:image:secure_url" content="${esc(img)}">
<meta property="og:image:type" content="image/jpeg">
${sizeTags}<meta property="og:image:alt" content="${esc(o.albumTitle)} — album cover">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${esc(img)}">

<!-- Two ways on, because one of them can fail. The refresh works with
     JavaScript turned off; the script runs first when it isn't, and
     replaces this page in history so Back returns to wherever the
     reader came from rather than trapping them here. -->
<meta http-equiv="refresh" content="0; url=${esc(o.target)}">
<script>location.replace(${JSON.stringify(o.target)});</script>

<style>
  body {
    margin: 0; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #0b0907; color: #9c9280;
    font-family: "Jost", "Century Gothic", sans-serif;
    letter-spacing: 0.18em; text-transform: uppercase; font-size: 0.7rem;
    text-align: center; padding: 2rem;
  }
  a { color: #d8a65f; }
</style>
</head>
<body>
  <p>Taking you to <a href="${esc(o.target)}">${esc(o.title)}</a>&hellip;</p>
</body>
</html>
`;
}

/* ── write them ────────────────────────────────────────────────── */
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);
let n = 0;
const written = [];

ALBUMS.forEach(a => {
  const name = `album-${pad2(a.num)}-${slug(a.translit || a.title)}.html`;
  fs.writeFileSync(path.join(OUT, name), page({
    kind: "album",
    albumNum: a.num,
    albumTitle: a.title,
    fa: !!a.fa,
    title: `${a.title} — Chew Z`,
    desc: a.syn,
    target: `${SITE}/#album-${pad2(a.num)}`
  }));
  written.push(name); n++;
});

SONGS.forEach(s => {
  const a = ALBUMS.filter(x => x.num === s.album)[0];
  const name = `song-${s.cat}-${slug(s.translit || s.title)}.html`;
  /* The description leads with where the song lives, then what it is,
     so a preview card reads as a record rather than a loose track. */
  const where = s.book ? `From ${a.title}, out of Roya Publication No. ${s.book}.`
                       : `From ${a.title}.`;
  fs.writeFileSync(path.join(OUT, name), page({
    kind: "song",
    albumNum: a.num,
    albumTitle: a.title,
    fa: !!s.fa,
    title: `${s.title} — Chew Z`,
    desc: `${where} ${s.note}`,
    target: `${SITE}/#song-${s.cat}`
  }));
  written.push(name); n++;
});

console.log(`${n} share pages written to ${OUT}/ (stamp ${stamp})`);
written.sort().forEach(f => console.log("  " + f));
