// Version 1 · last updated 2026-10-06 17:06 PDT
/*
   CHECKS THAT A BOOK IS ACTUALLY FINISHED — every file on disk, every
   generated page rebuilt, every field filled.

       node check-book.js 105      # one book
       node check-book.js          # every book in stories.js

   Run it as the last step of ADDING-A-BOOK.md, before committing, and
   again after the Pages build if you want to be sure.

   Why this exists. Adding a book is six steps across three scripts, and
   every one of them fails silently. A forgotten `node build-share-pages.js`
   does not error — it simply leaves share/<slug>.html absent, and nothing
   on the site links to that file, so the shelf, the Library and the reader
   all look perfect while every Share button for that book hands out a 404.
   No. 105 shipped that way: stories.js was uploaded, the two generators
   were not run, and the fault only surfaced when a link was pasted into a
   message. Everything below is a thing that has actually gone wrong once.

   Exit code is 1 if any CHECK fails, so it can gate a commit. WARN never
   fails the run.
*/

const fs = require("fs");
const path = require("path");

const src = fs.readFileSync("stories.js", "utf8");
const { STORIES, GLOSSARY } = new Function(src + "; return { STORIES, GLOSSARY };")();

const pad = (n) => String(n).padStart(2, "0");
const slugFor = (s) =>
  pad(s.num) + "-" +
  s.title.toLowerCase().replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine",
  "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen",
  "eighteen","nineteen"];
const TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function spell(n) {                       // 105 -> "one hundred and five"
  if (n < 20) return WORDS[n];
  if (n < 100) return TENS[Math.floor(n/10)] + (n%10 ? "-" + WORDS[n%10] : "");
  const h = WORDS[Math.floor(n/100)] + " hundred";
  return n%100 ? h + " and " + spell(n%100) : h;
}

/* The site's own arithmetic, copied from readingTime() in script.js. If
   that ever changes, change it here too — a check that computes the time
   a different way is worse than no check, because it fails on books that
   are fine. */
function readingTime(words) {
  if (!words) return "";
  let n = parseInt(String(words).replace(/[^0-9]/g, ""), 10);
  if (!n) return "";
  if (/page/i.test(words)) n *= 275;
  const mins = Math.round(n / 200);
  if (mins < 60) return mins + " min read";
  const r = Math.round((mins / 60) * 2) / 2;
  return (r % 1 ? r.toFixed(1) : r) + (r === 1 ? " hour read" : " hours read");
}

let failures = 0, warnings = 0;
function check(ok, msg)  { if (!ok) { failures++; console.log("  ✗ FAIL  " + msg); }
                           else      { console.log("  ✓ " + msg); } }
function warn(ok, msg)   { if (!ok) { warnings++; console.log("  ! WARN  " + msg); }
                           else      { console.log("  ✓ " + msg); } }
const exists = (p) => fs.existsSync(p);
const sizeKB = (p) => Math.round(fs.statSync(p).size / 1024);

function readWords(n) {
  const f = `read/${pad(n)}.json`;
  if (!exists(f)) return null;
  const blocks = JSON.parse(fs.readFileSync(f, "utf8")).blocks || [];
  const text = blocks.map(b => typeof b.h === "string" ? b.h : "").join(" ");
  return (text.replace(/<[^>]+>/g, " ").match(/[A-Za-z’'\-]+/g) || []).length;
}

function checkBook(s) {
  const n = s.num, p = pad(n), slug = slugFor(s);
  console.log(`\n── No. ${n} · ${s.title}`);

  /* 1. the files on disk */
  check(exists(`pdfs/${p}.pdf`),           `pdfs/${p}.pdf`);
  check(exists(`covers/${p}.jpg`),         `covers/${p}.jpg`);
  warn (exists(`covers/${p}.webp`),        `covers/${p}.webp`);
  check(exists(`library/covers/${p}.webp`),`library/covers/${p}.webp`);
  check(exists(`read/${p}.json`),          `read/${p}.json`);

  /* The pair render is optional, but the two files go together: the shelf
     asks for the .jpg and falls back quietly, while the Library asks for
     the .webp and has NO fallback — a missing .webp is a broken image on
     the page, not a graceful degrade. So having one without the other is
     always a mistake. */
  const pj = exists(`covers/pairs/${p}.jpg`), pw = exists(`covers/pairs/${p}.webp`);
  if (pj || pw) {
    check(pj, `covers/pairs/${p}.jpg — the shelf asks for this one`);
    warn (pw, `covers/pairs/${p}.webp — the Library asks for this first; without it ` +
              `every zoom of this book spends a 404 before the fallback chain in ` +
              `roya-library.js serves the .jpg. Costs a request, breaks nothing.`);
  } else {
    warn(false, `no pair render — the zoom falls back to the flat cover`);
  }

  /* 2. the generated pages. These are what fails silently. */
  check(exists(`share/${slug}.html`),
        `share/${slug}.html — the Share button's target`);
  if (exists(`share/${slug}.html`)) {
    const h = fs.readFileSync(`share/${slug}.html`, "utf8");
    const og = (h.match(/og:image"\s+content="([^"]+)"/) || [])[1];
    const local = og && og.replace(/^https?:\/\/[^/]+\//, "");
    check(!!local && exists(local), `its og:image points at a file that exists (${local || "none"})`);
  }
  const feed = exists("feed.xml") ? fs.readFileSync("feed.xml", "utf8") : "";
  const map  = exists("sitemap.xml") ? fs.readFileSync("sitemap.xml", "utf8") : "";
  check(feed.includes(slug) || feed.includes(s.title), `feed.xml carries it — rerun build-feeds.js`);
  check(map.includes(slug),  `sitemap.xml carries it — rerun build-feeds.js`);

  /* 3. the entry itself */
  for (const f of ["title", "words", "hook", "door", "room", "key", "synopsis"])
    check(!!s[f], `stories.js has ${f}`);
  check(Array.isArray(s.notes) && s.notes.length === 3 &&
        s.notes.every(x => x >= 1 && x <= 3), `notes is three dials, each 1–3`);
  check(!!(GLOSSARY && GLOSSARY.doors && GLOSSARY.doors[s.door]),
        `door "${s.door}" is one of the four in GLOSSARY`);
  for (const f of ["room", "key"])
    check(/—/.test(String(s[f] || "")), `${f} is written "Name — what it is"`);

  /* 3b. the narration address. The mp3s left this repository on 2026-10-06
     and live on Backblaze B2, so every audio field is a whole address. A
     relative path is the signature of a stories.js edited from a copy that
     predates the move: it overwrites the addresses with assets/audio/NN.mp3,
     those files are gone, and every narration stops playing with no error in
     the console, nothing broken on the page and nothing in any build output.
     It took a reader to notice. This check is the whole reason that cannot
     happen twice. */
  if (s.audio) {
    check(/^https?:\/\//.test(s.audio),
          `audio is a whole address, not a repo path (${s.audio})`);
    warn(/f005\.backblazeb2\.com\/file\/roya-audio\//.test(s.audio),
         `audio points at the roya-audio bucket`);
  }

  /* 4. the reading time, against the book's own text. The stored count is
     rounded to the nearest hundred by hand, so it will never match exactly;
     what matters is that it does not round to a DIFFERENT displayed time
     than the real text would. That is the error that put a series' six
     hours on a two-hour book. */
  const actual = readWords(n);
  if (actual) {
    const stored = parseInt(String(s.words).replace(/[^0-9]/g, ""), 10);
    const drift = Math.abs(stored - actual) / actual;
    warn(drift < 0.05,
         `stored ${stored.toLocaleString()} words vs ${actual.toLocaleString()} in read/${p}.json ` +
         `(${(drift*100).toFixed(1)}% out)`);
    check(readingTime(s.words) === readingTime(actual + " words"),
          `reading time is the book's own: "${readingTime(s.words)}"`);
  }

  /* 5. the reading text itself. build-reader.py takes the title from
     stories.js, so a reading file built BEFORE the book's entry existed opens
     on the imprint line with no title — which is what happened to No. 105.
     A warning rather than a failure, because 73 older books are also missing
     it for an unrelated reason: they were built before tidy() learned to keep
     the title page at all, and rebuilding them would add it. For a book you
     are adding today, treat it as a failure and rerun build-reader.py. */
  if (exists(`read/${p}.json`)) {
    const blocks = JSON.parse(fs.readFileSync(`read/${p}.json`, "utf8")).blocks || [];
    const heads = blocks.filter(b => b.t === "h").map(b => String(b.h).replace(/<[^>]+>/g, ""));
    const want = s.title.toUpperCase().replace(/[^A-Z0-9]/g, "");
    warn(heads.some(h => h.toUpperCase().replace(/[^A-Z0-9]/g, "") === want),
         `read/${p}.json opens on the book's title — if this is a new book, ` +
         `rerun build-reader.py AFTER adding it to stories.js`);
  }
}

/* ── run ─────────────────────────────────────────────────────────────── */
const arg = process.argv[2];
const list = arg ? STORIES.filter(s => String(s.num) === String(+arg)) : STORIES;
if (arg && !list.length) { console.error(`No. ${arg} is not in stories.js.`); process.exit(1); }

list.forEach(checkBook);

/* Whole-catalogue facts, checked once. */
console.log(`\n── the catalogue`);
const idx = exists("index.html") ? fs.readFileSync("index.html", "utf8") : "";
const want = spell(STORIES.length);
const found = (idx.match(/[Oo]ne hundred and [a-z-]+|[Nn]inety[a-z-]*|[Ee]ighty[a-z-]*/g) || [])[0];
check(idx.toLowerCase().includes(want),
      `index.html says "${want}" (found "${found || "nothing"}") — rerun build-feeds.js`);
const nums = STORIES.map(s => s.num);
check(new Set(nums).size === nums.length, `no duplicate numbers`);
check(nums.every((v, i) => i === 0 || v > nums[i-1]), `numbers run in order`);

console.log(`\n${failures ? "✗" : "✓"} ${list.length} book(s): ` +
            `${failures} failure(s), ${warnings} warning(s).`);
if (failures) {
  console.log(`\nNothing here is cosmetic — every failure above is a thing a reader
would hit. Fix them, then run this again before committing.`);
}
process.exit(failures ? 1 : 0);
