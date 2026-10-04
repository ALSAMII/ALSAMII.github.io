/* Roya Library — the section that replaces All Covers.
   Version 133 · last updated 2026-10-03 14:02 PDT
   Cut from the sandbox by build-integration.py. Do not hand-edit:
   the next build overwrites it, and the sandbox is the source. */

/* ═══════════════════════════════════════════════════════════════════════
   ROYA LIBRARY — the section that replaces All Covers.

   Everything is inside one function so nothing of its own reaches the page:
   the section names about seventy things (draw, select, filter, light, pad,
   step …) and several of those exist in script.js too.

   It reads STORIES, TRILOGIES and GLOSSARY — it does not carry a copy — and
   every picture, PDF, reader file and share page it points at is one the
   repo already has.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  if (typeof STORIES === "undefined" || !Array.isArray(STORIES)) return;
  const ROOT = document.getElementById("royaLibrary");
  if (!ROOT) return;

  /* draw() rebuilds the whole frame every time, so anything that has to
     survive a redraw cannot live in the markup it writes: the drawn page goes
     into a stage of its own and the way out is a sibling of it. Both are taken
     from the page when index.html already carries them and made here when it
     does not — built unconditionally, the section ended up with two close
     buttons sitting exactly on top of each other. */
  const STAGE = ROOT.querySelector(".rl-stage") || (function () {
    const d = document.createElement("div");
    d.className = "rl-stage";
    ROOT.appendChild(d);
    return d;
  }());

  if (!ROOT.querySelector("[data-rlclose]")) {
    const x = document.createElement("button");
    x.type = "button";
    x.className = "rl-close";
    x.setAttribute("data-rlclose", "1");
    x.setAttribute("aria-label", "Close the library");
    x.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18"/></svg>';
    ROOT.insertBefore(x, STAGE);
  }

  const basePath = () => location.pathname.replace(/[^/]*$/, "");
  const PHONE = window.matchMedia("(max-width: 46rem)");

  /* readingTime(), to the character as script.js writes it — 200 wpm, a page
     counted as 275 words. The Library must say what the list says. */
  function readingTime(words) {
    if (!words) return "";
    var n = parseInt(String(words).replace(/[^0-9]/g, ""), 10);
    if (!n) return "";
    if (/page/i.test(words)) n = n * 275;
    var mins = Math.round(n / 200);
    if (mins < 60) return mins + " min read";
    var hrs = mins / 60;
    var rounded = Math.round(hrs * 2) / 2;
    return (rounded % 1 ? rounded.toFixed(1) : rounded) +
      (rounded === 1 ? " hour read" : " hours read");
  }

  /* The shape the section was built against, assembled from the site's own
     data. Room and Key are written "Name — what it is like" and are split on
     that em dash exactly as script.js splits them; Door's meaning comes from
     GLOSSARY.doors; a book's series is the trilogy that lists it. */
  function buildData() {
    const G = (typeof GLOSSARY !== "undefined" && GLOSSARY) ? GLOSSARY : {};
    const T = (typeof TRILOGIES !== "undefined" && TRILOGIES) ? TRILOGIES : [];
    const doors = G.doors || {};
    const seriesOf = {};
    T.forEach(t => (t.books || []).forEach(n => { seriesOf[n] = t.title; }));
    const split = v => {
      const s = String(v || ""), i = s.indexOf(" — ");
      return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i + 3)];
    };
    const books = STORIES.map(s => {
      const room = split(s.room), key = split(s.key);
      return {
        n: s.num, t: s.title, hook: s.hook || "", w: s.words || "",
        rt: readingTime(s.words).toUpperCase(),
        door: s.door || "", doorG: doors[s.door] || "",
        room: room[0], roomG: room[1],
        key: key[0],  keyG: key[1],
        gloss: "", series: seriesOf[s.num] || "",
        syn: s.synopsis || "", notes: s.notes || [],
        audio: s.audio || "", synced: s.synced, runtime: s.runtime
      };
    }).sort((a, b) => a.n - b.n);
    return {
      books: books,
      series: T.map(t => ({ title: t.title, books: t.books || [], syn: t.synopsis || "" })),
      gloss: { doors: doors, notes: G.notes || [] }
    };
  }


const DATA = buildData();
const GLOSS = DATA.gloss;
const BOOKS = DATA.books.slice().sort((a,b)=>a.n-b.n);
const SERIES = DATA.series;
const byNum = Object.fromEntries(BOOKS.map(b=>[b.n,b]));
const pad = n => String(n).padStart(3,"0");
const pad2 = n => String(n).padStart(2,"0");
const cov  = n => basePath() + "library/covers/" + pad2(n) + ".webp";
/* the 3D standing render, as the shelf draws it. cov() is the flat front;
   the Listening Room wants the object, not the artwork. */
const cov3d = n => basePath() + "covers/" + pad2(n) + ".jpg";
/* the second render: front-and-spine beside the back cover, one landscape
   image. Same numbering as the covers themselves. */
const pair = n => basePath() + "covers/pairs/" + pad2(n) + ".webp";
const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sName = b => b.series ? b.series.split(" · ")[0].split(" ناگفته")[0] : "Standalone";
/* the rail reads in English; a trailing Persian phrase belongs on the page,
   not in a 216px column where it pushes the English name out of view */
const railName = n => n.replace(/[\u0600-\u06FF\u200C\u200F][\u0600-\u06FF\u200C\u200F\s]*/g, "").trim();
/* What the column is showing, in words. A search wins, then a chosen series,
   and only an unfiltered shelf is the complete collection. It said "The
   complete collection" whatever was picked, so a reader who chose a series in
   the rail and was brought here had no line on screen confirming where they
   had landed — just a shorter grid. */
const shownName = () => railName(filter) === "Standalone" ? "Stand-alone stories" : railName(filter);
const columnHead = () =>
  query.trim() ? `Titles containing \u201c${query.trim()}\u201d`
  : filter !== "all" ? shownName()
  : "The complete collection";

/* The line a series row carries. The full first paragraph is the panel's; a
   row gets one sentence of it, and where that sentence introduces a list with
   a colon — "Five atrocities the world declined to witness: poison gas…" — the
   row stops at the colon. A row is a table of contents entry, and every entry
   has to be the same size for the eye to run down the column. */
/* A row line written for the row, where the synopsis's own first sentence is
   not one. The Anahita synopsis opens "They don't buy men." — the right first
   line for the panel, and on a row it is nineteen characters that name neither
   the books nor the method, in a column whose other entries do both. Overridden
   here rather than by rewriting the synopsis, because that prose is also the
   panel's, the share page's and the feed's, and it is right where it stands. */
const SERLINE_OWN = {
  "Daughters of Anahita": "Three novellas about an order that plants into bloodlines and waits for the season."
};
const SERLINE = g => {
  if (SERLINE_OWN[g.name]) return SERLINE_OWN[g.name];
  const first = ((g.syn||"").split("\n\n")[0] || "").trim();
  if(!first) return "Books that stand together.";
  const sentence = first.split(/(?<=\.)\s/)[0];
  const colon = sentence.indexOf(":");
  if(colon > 0 && sentence.length > 74) return sentence.slice(0, colon) + ".";
  return sentence;
};

/* Series groups, newest first, standalones last.
   Sorted on the HIGHEST book number in each series, not the lowest. A series
   is as new as its most recent story: The Ghariban opens at 13 but ran to 62,
   so sorting on the first book would file it last, below series whose whole
   run finished before it did. One list order, used by the rail, the phone's
   series picker and the All series block, so the three never disagree. */
const GROUPS = (()=>{
  const g = SERIES.map(s=>({name:s.title.split(" · ")[0], books:s.books.slice().sort((a,b)=>a-b), syn:s.syn}));
  const held = new Set(g.flatMap(x=>x.books));
  const solo = BOOKS.filter(b=>!held.has(b.n)).map(b=>b.n);
  const newest = x => x.books[x.books.length-1];
  g.sort((a,b)=>newest(b)-newest(a));
  if (solo.length) g.push({name:"Standalone", books:solo, syn:""});
  return g;
})();
const shelfOf = n => Math.max(0, GROUPS.findIndex(g=>g.books.includes(n)));

let dev = PHONE.matches ? "phone" : "desk", view="library", cur=94, shelf=shelfOf(94);
let filter="all", query="", mode="grid", sortBy="newest", zoomN=null, readN=null;
let lsort="newest";   /* the Listening Room's own order */
/* the sort menu standing open. It was a two-state toggle wearing a caret,
   which promised a menu and gave you a coin flip; with a third order to
   offer, the caret has to mean what it says. */
let sortOpen=false;
let light=false, soundOn=false, searchHot=false, caret=0, sheetN=null, pickOpen=false, recN=null;
/* the book whose Listen control was pressed — the two-way choice panel is
   open for it, and nothing has been played or downloaded yet */
let listenN=null;
/* the All Series row standing open, by series name, or null. One at a time:
   the list is a table of contents and two open rows stop it reading as one. */
let serOpen = null;
/* the book the shelf was last scrolled to, so a redraw can tell a new
   selection from a re-render of the same one */
let scrolledTo = null;
/* where the page was before a record opened, so closing it returns there
   rather than to the top of whichever section is behind */
let deskY = 0;
function restoreY(){
  const y = deskY;
  requestAnimationFrame(()=>{ scroller().scrollTop=y; setTimeout(()=>{ scroller().scrollTop=y; }, 160); });
}

const ICON = {
  search:'<svg viewBox="0 0 24 24" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  menu:'<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  right:'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  chevL:'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  chevR:'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  index:'<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  series:'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5v14h7V5zM13 5v14h7V5z"/></svg>',
  random:'<svg viewBox="0 0 24 24" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="1.1" fill="currentColor"/><circle cx="15" cy="15" r="1.1" fill="currentColor"/></svg>',
  about:'<svg viewBox="0 0 24 24" stroke-linecap="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c1.4-3.6 4-5.4 7-5.4s5.6 1.8 7 5.4"/></svg>'
};

/* ─────────── DESKTOP · Roya Library + About ───────────
   The Library replaces the old All Covers overlay. Every card carries what
   the ordered shelf used to carry: number, series, title, hook, reading
   time, and the three things you could do with a book — read it in the
   reader, open the PDF, share it. About keeps only the recommended books
   and the series; the ordered list of all 94 lives here now. */
const DICON = {
  caret:'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  /* the magnifier-plus the shelf puts on a cover, so the Listening Room's
     expand button is the same control a reader already knows. */
  zoom:'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.3" cy="10.3" r="6.3"/><path d="M10.3 7.6v5.4M7.6 10.3h5.4"/><path d="M19.4 19.4l-4.3-4.3"/></svg>',
  search:'<svg viewBox="0 0 24 24" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>',
  list:'<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  arrow:'<svg viewBox="0 0 24 14" stroke-linecap="round" stroke-linejoin="round"><path d="M0 7h20M15 2l5 5-5 5"/></svg>',
  pdf:'<svg viewBox="0 0 24 24" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  read:'<svg viewBox="0 0 24 24" stroke-linejoin="round"><path d="M3 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z"/></svg>',
  share:'<svg viewBox="0 0 24 24" stroke-linecap="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.4 10.8l7.2-4.2M8.4 13.2l7.2 4.2"/></svg>',
  /* two corner brackets with arrows running out of them — the mark a reader
     already knows for "open this bigger", and quieter on a cover than a
     magnifying glass, which reads as "search" everywhere else on the page */
  expand:'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M13.6 5.6h4.8v4.8"/><path d="M10.4 18.4H5.6v-4.8"/><path d="M18.4 5.6l-6 6"/><path d="M5.6 18.4l6-6"/></svg>',
  listen:'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M3.1 13.2a8.9 8.9 0 0 1 17.8 0"/><path d="M5.6 13.2a6.4 6.4 0 0 1 12.8 0"/><path d="M6.2 14.2H4.6a2.2 2.2 0 0 0-2.2 2.2v1.9a2.2 2.2 0 0 0 2.2 2.2h1.6"/><rect x="6.2" y="13.3" width="3" height="7.5" rx="1.5"/><path d="M17.8 14.2h1.6a2.2 2.2 0 0 1 2.2 2.2v1.9a2.2 2.2 0 0 1-2.2 2.2h-1.6"/><rect x="14.8" y="13.3" width="3" height="7.5" rx="1.5"/></svg>',
  close:'<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4"/></svg>'
};
const RANGES = [[1,25],[26,50],[51,75],[76,94]];

/* How many books each rail entry stands for. The figure is counted, never
   typed — the same rule every other count on the page follows. */
const countOf = n => (GROUPS.find(g=>g.name===n)||{books:[]}).books.length;
const soloCount = () => countOf("Standalone");
/* One row of the rail: the name, and the count beside it. The count sits in
   its own element rather than in the label so the two can be laid out as a
   pair — name left, figure right — and so a long series name can shrink
   without taking the number with it. */
const railRow = (val, label, n, cls) => `
      <button type="button"${cls?` class="${cls}"`:""} data-filter="${esc(val)}"
              aria-pressed="${filter===val}" title="${esc(label)}">
        <span class="side-nm">${esc(label)}</span><span class="side-ct">${n}</span>
      </button>`;

function sidebar(){
  /* THEME OFF — the rail drew nothing from this once the Theme button went.
     const light = document.documentElement.getAttribute('data-lt') === 'light'; */
  const sound = soundOn;
  const names = GROUPS.filter(g=>g.name!=="Standalone").map(g=>g.name);
  return `
  <aside class="side"><div class="side-in">
    <span class="side-head">
      <button class="side-emblem" type="button" data-home="1" aria-label="Roya Publication · Fiction — back to About"></button>
      ${soundTog()}
    </span>
    <p class="side-who">Chew&#8239;Z</p>
    <p class="side-count"><b>${BOOKS.length}</b>${BOOKS.length===1 ? "Story" : "Stories"}</p>
    <hr>
    <span class="side-lab">Browse by series</span>
    <div class="side-list">
      ${railRow("all", "All stories", BOOKS.length)}
      ${railRow("Standalone", "Stand alone", soloCount(), "solo")}
      ${names.map(n=>railRow(n, railName(n), countOf(n))).join("")}
    </div>
    <hr>
    <span class="side-lab">Search titles</span>
    <span class="side-search">
      <input id="libSearch" type="search" placeholder="Search titles…" value="${esc(query)}"
             autocomplete="off" spellcheck="false">
      ${query ? `<button class="side-clear" type="button" data-clear="1" aria-label="Clear search">✕</button>` : DICON.search}
    </span>
    <hr class="side-foot-rule">
    <p class="side-rights">All stories &copy; Chew&#8239;Z.<br>All rights reserved.</p>
  </div></aside>`;
}

/* A search shows every title that CONTAINS what is typed — "be" finds
   Bright Mercy and The Riverbed alike — and it looks across the whole
   catalogue rather than inside whichever series happens to be open, so a
   search never comes back empty because of a filter the reader forgot. */
/* ── the series synopsis panel ──
   One entry per series, found by railName() of whatever the rail is filtering
   on, so the Persian a title carries does not have to be repeated here. The
   count and the hours are NOT in this table: they are computed from the books
   themselves further down, which is the only way they stay true when a book
   is added to a series.

   `dev` is the mark that sits on the rule between the two paragraphs — the one
   thing only that series could put there. Its colours are CSS variables so the
   light theme can restate them rather than having a second copy of the markup. */
const SERIES_SYN = {
  "Here Be Delos": {
    lede: "On the oldest maps the edge of the known world carried a warning: where the mapmakers had not been, they wrote hic sunt dracones — here are dragons. These books keep the warning and change the creature. Delos is Greek for clear, visible, plain to see; it is also the second half of psychedelic, the word a psychiatrist built in 1956 out of psyche, the mind, and delos, made visible. And Delos is an island that drifted, unfixed and too hard to see for anyone to find, until four pillars rose out of the sea floor and held it still — and the sailors named it the one that can be seen. Each book follows one person and one substance, and the substance drifts through the life unnamed:",
    cap:  "a coastline that wanders, and the one place where it stops",
    body: "The way out is always something taken — a leaf, a seed, a root, a mushroom, a molecule, from somewhere in the world. What opens it is that the thing is not named: it does its work in the dark, and the person it is working on has taken care not to learn what it is. The room is whatever the mind turns out to have been hiding behind. Then, when the story has earned it, the substance is named, and the book turns and tells you everything — where it grows, who found it, what its names mean, what it does to the brain, what it has been used for and what it costs. Hidden first; then fixed, and seen. Inside each book is a map of the world that begins as scribble, and every book fixes one more place on it.",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><path d=\"M0 12.83 L4 13.43 L8 13.97 L12 14.46 L16 14.86 L20 15.18 L24 15.41 L28 15.54 L32 15.57 L36 15.5 L40 15.35 L44 15.1 L48 14.78 L52 14.4 L56 13.96 L60 13.48 L64 12.98 L68 12.46 L72 11.95 L76 11.45 L80 10.98 L84 10.55 L88 10.17 L92 9.84 L96 9.57 L100 9.36 L104 9.22 L108 9.14 L112 9.12 L116 9.16 L120 9.25 L124 9.38 L128 9.54 L132 9.73 L136 9.94 L140 10.16 L144 10.38 L148 10.6 L152 10.79 L156 10.97 L160 11.13 L164 11.25 L168 11.35 L172 11.41 L176 11.44 L180 11.44 L184 11.41 L188 11.35 L192 11.27 L196 11.18 L200 11.07 L204 10.96 L208 10.85 L212 10.73 L216 10.63 L220 10.53 L224 10.45 L228 10.39 L232 10.34 L236 10.32 L240 10.31 L244 10.32 L248 10.34 L252 10.39 L256 10.44 L260 10.51 L264 10.58 L268 10.66 L272 10.73 L276 10.81 L280 10.89 L284 10.96 L288 11.02 L292 11.07 L296 11.11 L300 11.14 L304 11.17 L308 11.18 L312 11.18 L316 11.18 L320 11.17 L324 11.15 L328 11.13 L332 11.11 L336 11.09 L340 11.07 L344 11.05 L348 11.04 L352 11.02 L356 11.01 L360 11.01 L364 11.0 L368 11.0 L372 11.0 L376 11.0 L380 11.0 L384 11.0 L388 11.0 L392 11.0 L396 11.0 L400 11.0 L404 11.0 L408 11.0 L412 11.0 L416 11.0 L420 11.0 L424 11.0 L428 11.0 L432 11.0 L436 11.0 L440 11.0 L444 11.0 L448 11.0 L452 11.0 L456 11.0 L460 11.0 L464 11.0 L468 11.0 L472 11.0 L476 11.0 L480 11.0 L484 11.0 L488 11.0 L492 11.0 L496 11.0 L500 11.0 L504 11.0 L508 11.0 L512 11.0 L516 11.0 L520 11.0 L524 11.0 L528 11.0 L532 11.0 L536 11.0 L540 11.0 L544 11.0 L548 11.0 L552 11.0 L556 11.0 L560 11.0 L564 11.0 L568 11.0 L572 11.0 L576 11.0 L580 11.0 L584 11.0 L588 11.0 L592 11.0 L596 11.0 L600 11.0\" fill=\"none\" stroke=\"var(--sv-soft)\" stroke-width=\"1.05\" stroke-linecap=\"round\"/><line x1=\"372\" y1=\"11.0\" x2=\"600\" y2=\"11.0\" stroke=\"var(--sv-mark)\" stroke-width=\"1.35\"/><circle cx=\"372\" cy=\"11.0\" r=\"3.4\" fill=\"none\" stroke=\"var(--sv-mark)\" stroke-width=\"1.1\"/><circle cx=\"372\" cy=\"11.0\" r=\"1.35\" fill=\"var(--sv-mark)\"/></svg>"
  },
  "Daughters of Anahita": {
    lede: "Anāhitā is the old Iranian goddess of the waters — of what rises on its own schedule and cannot be hurried. Put plainly: she is the goddess of things that get their way by outlasting whatever is standing in front of them. Her daughters kept the name and the method. They do not buy men and they do not threaten them. They plant, into bloodlines, and they wait for the season:",
    cap:  "three thousand years, and the third generation is the one that blooms",
    body: "Three novellas, and in each the way out is a practice kept so long it has become a discipline. What opens it is a want — read off a stranger on sight, then grown so slowly he believes he arrived at it himself. Where it leaves him is the room: a kingdom on fire, or a man who works out exactly what is being done to him and stays. In the order they run: the patient century first, then the ungoverned night that made patience necessary, then the instrument three thousand years of it finally produced. Nobody in these books is forced into anything, which is the part that stays with you afterwards.",
    dev:  "<div class=\"sv-row\" style=\"height:22px\"><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:5px;height:5px;background:var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:9px;height:9px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:14px;height:14px;background:var(--sv-hi)\"></i><i class=\"sv-gap\"></i></div>"
  },
  "Les Folies": {
    lede: "Les Folies — the madnesses. French medicine used the word for the kind you catch from other people, and the three here are named the way the old clinicians named them: douce, générale, imposée. Mild, general, imposed. In plain terms, a madness you catch by agreement — which is why nobody in these books ever has to be talked into anything. One city, three books, and not one rule broken anywhere in them:",
    cap:  "properly authorised, four million cheaper, and nobody who read the memo disagreed",
    body: "The way out is always something withheld — four minutes a claimant, forty seconds of extra hold on an emergency line. What opens it is the small correct decision no one could be blamed for. The room is the city afterwards, burning quietly, with nobody to charge. Douce is one clerk having one bad day; générale is a whole city having it at once; imposée is what turns up when somebody finally does answer. It is not a rescue, and that is the argument the three of them are making together.",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><defs><pattern id=\"svf\" width=\"46\" height=\"22\" patternUnits=\"userSpaceOnUse\"><path d=\"M14 11.5l4 4 7.5-9\" fill=\"none\" stroke=\"var(--sv-mark)\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></pattern></defs><line x1=\"0\" y1=\"19\" x2=\"600\" y2=\"19\" stroke=\"var(--sv-rule)\" stroke-width=\"1\"/><rect width=\"600\" height=\"22\" fill=\"url(#svf)\"/></svg>"
  },
  "The Unwitnessed Wars I–V": {
    lede: "Five wars the world declined to watch, and five clerks who kept counting anyway — gas over the marshes of Iran and Iraq, a famine written as policy, a hundred machete days, wards of unheld infants, a ghetto dressed up and certified as almost normal. Unwitnessed is the whole of the argument: none of this was hidden, it was simply not looked at. Each has an official number, and none has the number:",
    cap:  "the count the ledgers were built to erase",
    body: "The way out is whatever a cornered body can still reach: a dose, a hunger, a stillness, a rocking, a drawn page. What opens it is small, physical and free. The room is the far side — the dead with questions, a ward that has stopped crying, ten motionless hours among the floating. One question under all five: shelter from the century, or the century, inside? Five countries, five decades, and nothing connecting them but the shape. Read one and you have the pattern; read all five and you will not be able to stop seeing it.",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><defs><pattern id=\"svt\" width=\"44\" height=\"22\" patternUnits=\"userSpaceOnUse\"><g stroke=\"var(--sv-mark)\" stroke-width=\"1.6\" stroke-linecap=\"round\"><line x1=\"4\" y1=\"3\" x2=\"4\" y2=\"19\"/><line x1=\"10\" y1=\"3\" x2=\"10\" y2=\"19\"/><line x1=\"16\" y1=\"3\" x2=\"16\" y2=\"19\"/><line x1=\"22\" y1=\"3\" x2=\"22\" y2=\"19\"/><line x1=\"1\" y1=\"18\" x2=\"25\" y2=\"4\"/></g></pattern></defs><rect width=\"512\" height=\"22\" fill=\"url(#svt)\"/><g stroke=\"var(--sv-hi)\" stroke-width=\"1.6\" stroke-linecap=\"round\"><line x1=\"532\" y1=\"3\" x2=\"532\" y2=\"19\"/><line x1=\"538\" y1=\"3\" x2=\"538\" y2=\"19\"/></g></svg>"
  },
  "The Unguarded Hours": {
    lede: "Every day has hours nobody is minding — the wheel held by something not quite you, the grief that wears through at four in the morning, the body awake on the table and unable to say so. They happen constantly and almost none are reported, An unguarded hour is exactly what it sounds like — time your own mind was not standing watch over. They are almost never reported, because whatever opens them also erases the record:",
    cap:  "forty-one minutes the truck drove itself, and the fuel curve was the cleanest on file",
    body: "The way out is a practice, a dose, or something simply gone without. What opens it is ordinary to the point of invisibility: highway hypnosis, three drugs, forty minutes of a stranger kneeling in the aisle. The room is where you come back to, unable to prove you were ever gone. Someone has noticed. Someone has worked out what it is worth. Four books, four such hours, and in every one the person it happened to is the least reliable witness available to describe it. The unsettling part is never that something else took the wheel — it is how well it drove.",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><line x1=\"0\" y1=\"18\" x2=\"600\" y2=\"18\" stroke=\"var(--sv-rule)\" stroke-width=\"1\"/><line x1=\"10\" y1=\"4\" x2=\"10\" y2=\"18\" stroke=\"var(--sv-mark)\" stroke-width=\"1.4\"/><line x1=\"30\" y1=\"8\" x2=\"30\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"50\" y1=\"8\" x2=\"50\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"70\" y1=\"8\" x2=\"70\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"90\" y1=\"8\" x2=\"90\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"110\" y1=\"8\" x2=\"110\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"130\" y1=\"4\" x2=\"130\" y2=\"18\" stroke=\"var(--sv-mark)\" stroke-width=\"1.4\"/><line x1=\"150\" y1=\"8\" x2=\"150\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"170\" y1=\"8\" x2=\"170\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"190\" y1=\"8\" x2=\"190\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"210\" y1=\"8\" x2=\"210\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"310\" y1=\"8\" x2=\"310\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"330\" y1=\"8\" x2=\"330\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"350\" y1=\"8\" x2=\"350\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"370\" y1=\"4\" x2=\"370\" y2=\"18\" stroke=\"var(--sv-mark)\" stroke-width=\"1.4\"/><line x1=\"390\" y1=\"8\" x2=\"390\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"410\" y1=\"8\" x2=\"410\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"430\" y1=\"8\" x2=\"430\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"450\" y1=\"8\" x2=\"450\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"470\" y1=\"8\" x2=\"470\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"490\" y1=\"4\" x2=\"490\" y2=\"18\" stroke=\"var(--sv-mark)\" stroke-width=\"1.4\"/><line x1=\"510\" y1=\"8\" x2=\"510\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"530\" y1=\"8\" x2=\"530\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"550\" y1=\"8\" x2=\"550\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"570\" y1=\"8\" x2=\"570\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/><line x1=\"590\" y1=\"8\" x2=\"590\" y2=\"18\" stroke=\"var(--sv-faint)\" stroke-width=\"1.4\"/></svg>"
  },
  "The Sovereign Rooms": {
    lede: "A room is sovereign when it does not answer to the person who owns it. Sovereign means self-governing, and that is the whole of the unease: the room is governing itself, and you are the one living in it. Five novellas about a self carrying on without permission — a hand that keeps writing after the stroke takes it, a guard lowered by six doses that was never once lowered by choice, an alphabet board spelling twenty-two words an hour:",
    cap:  "the hand sets down what thirty years of mercy left out, and is never wrong about any of it",
    body: "The way out is mostly refusal: the thing you cannot do is the thing that takes you through. What opens it is the small mechanism that lifts the decision off you. The room is what follows, and none of these can be left — agreeing to everything, reading a room correctly for the first time, frightened with no word for it. Two of the five are about a body that will not stop reporting; three are about one that cannot report at all. Together they put a question with no comfortable answer: if the part of you that speaks is outvoted, who is left to appeal to?",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><path d=\"M0 13 L300 13 C318 13 322 5 334 5 C346 5 348 20 360 20 C372 20 374 6 386 6 C398 6 400 19 412 19 C424 19 427 7 439 7 C451 7 453 18 465 18 C477 18 480 8 492 8 C504 8 506 17 518 17 C530 17 534 10 546 11\" fill=\"none\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg>"
  },
  "The Borrowed Sun Cycle": {
    lede: "A borrowed sun is one you did not earn and will not get to keep. One street corner, seven worlds, and a tall man walking through all of them with everything he owns in a single bag. Each world made a different choice — cancelled its terror, kept its fire, sold its sleep — and in every one of them something patient has begun leaving notes in the margin:",
    cap:  "a verse written across realities, one installment per world",
    body: "The way out changes each time: a sacrament taken in public, a signal checked one bit at a time, three forged nights centuries deep. What opens it is whatever that world agreed to believe. The room is the life left standing around it. There is no true world, and the bill is coming due in all of them. Seven books, seven versions of the same afternoon, and the man walking through is the only thing that carries across. Read in order, the notes in the margins start answering one another.",
    dev:  "<div class=\"sv-row\" style=\"height:22px\"><i class=\"sv-ring\" style=\"width:15px;height:15px;border:1.3px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-ring\" style=\"width:15px;height:15px;border:1.3px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-ring\" style=\"width:15px;height:15px;border:1.3px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-ring\" style=\"width:15px;height:15px;background:var(--sv-hi);border:0\"></i><i class=\"sv-gap\"></i><i class=\"sv-ring\" style=\"width:15px;height:15px;border:1.3px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-ring\" style=\"width:15px;height:15px;border:1.3px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-ring\" style=\"width:15px;height:15px;border:1.3px solid var(--sv-soft)\"></i></div>"
  },
  "The Water Ordeals": {
    lede: "An ordeal by water is an old way of settling a question: put the body in and let the water answer. The old courts used it to settle guilt; these five use it to settle what actually happened, and it gives a different answer every time. Five novellas about people who go into water that will not permit assistance — a flooded quarry, a cave under limestone, the largest wave in Europe, six hundred days alone at sea, thirty-four kilometres at twelve degrees:",
    cap:  "every record is accurate, complete, and wrong about the only thing that matters",
    body: "The way out is the ordeal itself, going past what hurts. What opens it is trained and physical: a held breath with rungs continuing past blackout, the arithmetic of thirds. The room is the surface afterwards, where somebody came up and is now the only witness. Memory is not a document. It is rebuilt every time it is opened. Five books, five bodies of water, and five accounts given afterwards by the only person left alive to give one. Not a single one of them is lying, which is precisely the difficulty.",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><line x1=\"0\" y1=\"8\" x2=\"600\" y2=\"8\" stroke=\"var(--sv-mark)\" stroke-width=\"1.4\"/><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"14.8\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"34\" y1=\"9\" x2=\"34\" y2=\"21.6\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"56\" y1=\"9\" x2=\"56\" y2=\"28.5\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"78\" y1=\"9\" x2=\"78\" y2=\"13.5\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"100\" y1=\"9\" x2=\"100\" y2=\"20.4\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"122\" y1=\"9\" x2=\"122\" y2=\"27.2\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"144\" y1=\"9\" x2=\"144\" y2=\"12.2\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"166\" y1=\"9\" x2=\"166\" y2=\"19.1\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"188\" y1=\"9\" x2=\"188\" y2=\"26.0\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"210\" y1=\"9\" x2=\"210\" y2=\"11.0\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"232\" y1=\"9\" x2=\"232\" y2=\"17.9\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"254\" y1=\"9\" x2=\"254\" y2=\"24.8\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"276\" y1=\"9\" x2=\"276\" y2=\"31.6\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"298\" y1=\"9\" x2=\"298\" y2=\"16.6\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"320\" y1=\"9\" x2=\"320\" y2=\"23.5\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"342\" y1=\"9\" x2=\"342\" y2=\"30.4\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"364\" y1=\"9\" x2=\"364\" y2=\"15.4\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"386\" y1=\"9\" x2=\"386\" y2=\"22.2\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"408\" y1=\"9\" x2=\"408\" y2=\"29.1\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"430\" y1=\"9\" x2=\"430\" y2=\"14.1\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"452\" y1=\"9\" x2=\"452\" y2=\"21.0\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"474\" y1=\"9\" x2=\"474\" y2=\"27.9\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"496\" y1=\"9\" x2=\"496\" y2=\"12.9\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"518\" y1=\"9\" x2=\"518\" y2=\"19.8\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"540\" y1=\"9\" x2=\"540\" y2=\"26.6\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"562\" y1=\"9\" x2=\"562\" y2=\"11.6\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/><line x1=\"584\" y1=\"9\" x2=\"584\" y2=\"18.5\" stroke=\"var(--sv-faint)\" stroke-width=\"1.2\"/></svg>"
  },
  "The Ghariban": {
    lede: "Gharīb is the stranger — the one far from home, the one nobody came for. Shām-e Ghariban, the evening of the strangers, is the night after Ashura: the survivors of Karbala left in the dark with nobody to claim them, still kept every year by candlelight with the drums and the chains put away. The short version: it is the word for people who have to be mourned by people who never knew them. Two of these four books are named straight out of that one phrase — one for the evening itself, one for the road the captives were walked down to reach it:",
    cap:  "eleven years of a life built alone, and the strength that took",
    body: "The way out is a rite or a refusal — a chain kept at a beat somebody else chose, an offer of help that quietly hands the asking back. What opens it is small: a favourite song nobody can name, a wedding left early, a light fixture replaced. The room is the sixth year, when the visitors have stopped and nobody has noticed that they stopped. Four books that never meet, sharing one word and one condition: somebody living beside a thing the people around them cannot see. The Evening of Strangers carries that night to Los Angeles, where a man attends nine mourning halls a year for people he barely knew and has never once decided not to go — which turns the phrase over: the ghariban are not only the ones nobody came for, they are also the ones who come. None of the four is about dying, and none of them meets another; they can be read in any order, because this is not a cycle, it is four uses of one word.",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><line x1=\"0\" y1=\"11\" x2=\"30\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"44\" y1=\"11\" x2=\"72\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"86\" y1=\"11\" x2=\"111\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"125\" y1=\"11\" x2=\"149\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"163\" y1=\"11\" x2=\"184\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"198\" y1=\"11\" x2=\"217\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"231\" y1=\"11\" x2=\"248\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"262\" y1=\"11\" x2=\"276\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"290\" y1=\"11\" x2=\"303\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"317\" y1=\"11\" x2=\"327\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"341\" y1=\"11\" x2=\"349\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"363\" y1=\"11\" x2=\"369\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"383\" y1=\"11\" x2=\"388\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"402\" y1=\"11\" x2=\"407\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><line x1=\"421\" y1=\"11\" x2=\"426\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg>"
  },
  "The Unheard House": {
    lede: "A walled village outside Tabriz that appears on no map, built around an illness that takes the nerve first — so that nobody inside it can be trusted to feel what is happening to them. The house is unheard in both directions at once — nobody outside was listening, and inside, the illness had already taken the sense that tells you to cry out. Three novellas about what the people in there were protecting, and who they were protecting it from:",
    cap:  "a dialect none of the crew could follow, subtitled in nine languages as a prayer",
    body: "The way out is stillness — khāmūshī, the flat hour, held for four years. What opens it is eleven cans of film, or three sentences a father said on the end of a bed. The room is a cold room thirty-four years later, run frame by frame, where eleven minutes subtitled in nine languages as a prayer turn out not to be a prayer. Three books and three vantage points on one place: one from outside and thirty-four years late, one from inside the wall, one from a city that has worked out how to sell what the wall was built to hold. Here the order does matter — each book knows something the one before it could not.",
    dev:  "<div class=\"sv-film\"><div class=\"sv-row\" style=\"height:7px\"><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i></div><div class=\"sv-filmline\" style=\"background:var(--sv-rule)\"></div><div class=\"sv-row\" style=\"height:7px\"><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-perf\" style=\"border-color:var(--sv-mark)\"></i></div></div>"
  },
  "From the Old Book": {
    lede: "The old book is the Shāhnāma, Ferdowsi's book of kings, a thousand years old and still the one everybody half-remembers. Nearly every Iranian household keeps a copy and almost nobody has finished it, and that gap is exactly what these three are written into. These are not retellings. They are its episodes told again from floor level — the pit, then the rim above it, then a ridge over a different hole entirely:",
    cap:  "the rule a scribe ruled between one telling and the next",
    body: "The way out is an ordeal, a refusal, a rite: the same three the poem always used. What opens it is domestic and exact — bread that travels better flat, a voice coming down a gap, a rope taken the way you take a coat on that ground. The room is the hole, and then the lip of the hole, which knows things the hole does not. Three tellings, and the poem is never once quoted at you. If you know the Shāhnāma you will see exactly what has been moved; if you do not, nothing whatever is missing.",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><defs><pattern id=\"svo\" width=\"30\" height=\"22\" patternUnits=\"userSpaceOnUse\"><path d=\"M15 5 L21 11 L15 17 L9 11 Z\" fill=\"none\" stroke=\"var(--sv-soft)\" stroke-width=\"1\"/><circle cx=\"15\" cy=\"11\" r=\"1.4\" fill=\"var(--sv-mark)\"/></pattern></defs><line x1=\"0\" y1=\"2\" x2=\"600\" y2=\"2\" stroke=\"var(--sv-mark)\" stroke-width=\"1.2\"/><line x1=\"0\" y1=\"20\" x2=\"600\" y2=\"20\" stroke=\"var(--sv-mark)\" stroke-width=\"1.2\"/><rect width=\"600\" height=\"22\" fill=\"url(#svo)\"/></svg>"
  },
  "Come In, the Water Is Lovely": {
    lede: "The title is what somebody says from the water to a person standing on the tiles with their arms folded. A small warm dare, and a lie about the temperature. Everyone has stood on both sides of that sentence, which is the entire reason it is the title. The books carry it plainly — an invitation into a room you could leave at any second and do not:",
    cap:  "nobody is ever pushed, and nobody refuses",
    body: "The way out is a practice somebody keeps on purpose — an hour a day with no screen and nothing to do, four years of deliberately failing a test, one week a year with the power off at your own breaker. What opens it is small and deliberate every time: the hour, a bucket and a card, a root and thirty hours in the dark, a main switch thrown on a Sunday night. The room is what is left once the thing that was never counted has quietly gone. The author calls it one question asked five times, in five places, about five different things a person can lose while their life is measurably improving; three of the five are here. Nothing in them raises its voice, and nobody is ever pushed.",
    /* Was four concentric ellipses — a stone dropped in — drawn with
       preserveAspectRatio="none", so the rings flattened further the wider
       the window got; and a splash is the one thing this series never does.
       Nothing here is dropped in. Somebody is already in the water.

       So the rule does not stop at the centre: it enters the water and comes
       out the other side. One damped wave train, flat at both margins and
       highest in the middle, with the crest lit. A second, fainter train
       beneath it was tried and cut: at the margins it flattened to its own
       horizontal and read as a stray rule rather than a reflection. Two flex
       fillers either side with one fixed-width
       SVG between them, which is how Thursday Nights draws its row, so
       nothing stretches with the window. */
    dev:  "<span class=\"sv-row\" style=\"height:22px\"><i class=\"sv-gap\"></i>"
        + "<svg width=\"176\" height=\"20\" viewBox=\"0 5 176 20\" aria-hidden=\"true\" style=\"flex:0 0 auto;display:block;overflow:visible\">"
        + "<path d=\"M0 15 L2 14.9 L4 14.9 L6 14.8 L8 14.7 L10 14.7 L12 14.6 L14 14.6 L16 14.6 L18 14.7 L20 14.8 L22 15 L24 15.3 L26 15.5 L28 15.9 L30 16.2 L32 16.4 L34 16.5 L36 16.6 L38 16.4 L40 16.1 L42 15.6 L44 15 L46 14.2 L48 13.4 L50 12.6 L52 11.9 L54 11.4 L56 11.2 L58 11.3 L60 11.8 L62 12.6 L64 13.7 L66 15 L68 16.4 L70 17.9 L72 19.2 L74 20.1 L76 20.7 L78 20.9 L80 20.5 L82 19.6 L84 18.3 L86 16.7 L88 15 L90 13.3 L92 11.7 L94 10.4 L96 9.5 L98 9.1 L100 9.3 L102 9.9 L104 10.8 L106 12.1 L108 13.6 L110 15 L112 16.3 L114 17.4 L116 18.2 L118 18.7 L120 18.8 L122 18.6 L124 18.1 L126 17.4 L128 16.6 L130 15.8 L132 15 L134 14.4 L136 13.9 L138 13.6 L140 13.4 L142 13.5 L144 13.6 L146 13.8 L148 14.1 L150 14.5 L152 14.7 L154 15 L156 15.2 L158 15.3 L160 15.4 L162 15.4 L164 15.4 L166 15.3 L168 15.3 L170 15.2 L172 15.1 L174 15.1 L176 15\" fill=\"none\" stroke=\"var(--sv-mark)\" stroke-width=\"1.3\" stroke-linecap=\"round\"/>"
        + "<path d=\"M66 15 L68 16.4 L70 17.9 L72 19.2 L74 20.1 L76 20.7 L78 20.9 L80 20.5 L82 19.6 L84 18.3 L86 16.7 L88 15 L90 13.3 L92 11.7 L94 10.4 L96 9.5 L98 9.1 L100 9.3 L102 9.9 L104 10.8 L106 12.1 L108 13.6 L110 15\" fill=\"none\" stroke=\"var(--sv-hi)\" stroke-width=\"1.4\" stroke-linecap=\"round\"/>"
        + "</svg><i class=\"sv-gap\"></i></span>"
  },
  "Thursday Nights": {
    lede: "Panjshanbeh means, flatly, the fifth day. So the title is really a timetable: it names the one evening of the week when the houses empty out. Thursday night in Iran is when the whole family is at somebody's mother's house — which is why a burglar worked Thursday nights and only Thursday nights, and why a man in Block Three started calling him after it:",
    cap:  "panjshanbeh, the fifth day, when every house in the country is somewhere else",
    body: "Six accounts by a man who keeps being handed other men's authority and keeps turning out to be good at it: a cleric, a doctor, a teacher who cannot read, an inspector, a son. The way out is whatever the room needs. What opens it is never a document — it is rue burning in a doorway, an accent, four seconds at a door and a woman saying you have his hands. The room is the life that closes around him afterwards. He is qualified for none of it, and at none of it is he quite a fraud. Each account is written for whoever comes next, and each is a shade more honest than the last about what he is doing there. The sixth asks him to be the one man he has never once impersonated: himself, under oath, telling the truth.",
    dev:  "<div class=\"sv-row\" style=\"height:22px\"><i class=\"sv-box2\" style=\"width:20px;height:18px;border:1.2px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-box2\" style=\"width:20px;height:18px;border:1.2px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-box2\" style=\"width:20px;height:18px;border:1.2px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-box2\" style=\"width:20px;height:18px;border:1.2px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-box2\" style=\"width:20px;height:18px;background:var(--sv-hi)\"></i><i class=\"sv-gap\"></i><i class=\"sv-box2\" style=\"width:20px;height:18px;border:1.2px solid var(--sv-soft)\"></i><i class=\"sv-gap\"></i><i class=\"sv-box2\" style=\"width:20px;height:18px;border:1.2px solid var(--sv-soft)\"></i></div>"
  },
  "From the Unsaid": {
    lede: "Nāgofteh means the unsaid. Not the secret, which somebody is actively keeping — the thing that simply never gets said out loud, by anyone, for years, until the silence is load-bearing. Everybody reading this is keeping one, and could not tell you when they decided to. Eight novellas built in the space where the sentence should have gone:",
    cap:  "no dots, no black bar, nothing marking the place at all. That is the point.",
    body: "The way out is nearly always something withheld: not done, not asked, not objected to inside the twenty days you were allowed. What opens it is a piece of paperwork with a human name — a ta'ahhod, a load box, a mohlat, an allowlist of four hundred and sixty entries in his own hand. The room is the city carrying on exactly as before, and a man who cannot find anybody to tell. Eight books, eight silences, and not one of them is anybody's fault in a way you could write down. Taken together they describe a country's whole administrative surface, from underneath it.",
    dev:  "<svg viewBox=\"0 0 600 22\" preserveAspectRatio=\"none\" aria-hidden=\"true\" class=\"sv-svg\" style=\"height:22px\"><line x1=\"0\" y1=\"11\" x2=\"222\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.4\"/><line x1=\"378\" y1=\"11\" x2=\"600\" y2=\"11\" stroke=\"var(--sv-mark)\" stroke-width=\"1.4\"/></svg>"
  },
  "From the Delgoshā": {
    lede: "Delgoshā means heart-opening. Take that literally: it is a book named for what a good joke does to the person it lands on. Obeid Zakani gave the word to a collection of them in the fourteenth century, and every edition printed since has lifted the best lines out and left this in their place:",
    cap:  "the censor's dots, in every edition ever printed",
    body: "It is also a surname. Manuchehr Delgoshā writes the jokes a whole country repeats and has never once signed one, and these are his notebooks — nine nights he got out of his own head, each through a door of his own making. What opens it is always something made of language: a line, a laugh arriving twenty-five years late, an accent, nine minutes written for somebody else’s mouth. The room on the far side is not a place; it is the situation he has to stand in once the laughing stops. Seven were the whole frame; an eighth turned up eleven years later and a ninth after that, in the dark, once his eyes had gone — so what looks like a closed shape here keeps turning out not to be one. Start anywhere — they share a narrator and a preoccupation, not a running order.",
    dev:  "<div class=\"sv-row\" style=\"height:22px\"><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i><i class=\"sv-gap\"></i><i class=\"sv-dot\" style=\"width:3.2px;height:3.2px;background:var(--sv-mark)\"></i></div>"
  },
};

/* The panel itself. It carries no heading: the bar above the grid on a page,
   and the h2 on a handset, already set the series name and the number of
   books, and printing either of them twice inside the box was the one thing
   this did not need.

   Shown only on an unfiltered look at ONE series — a search crosses series, so
   a synopsis standing over those results would be describing the wrong set. */
/* One book's reading time in whole minutes, from the same words field and by
   the same arithmetic the card prints — 200 words a minute, a page counted as
   275 words. Sorting by length and totalling a series both need it, and they
   used to work it out separately. */
function bookMinutes(b){
  const w = String(b.w || "");
  let n = parseInt(w.replace(/[^0-9]/g, ""), 10) || 0;
  if (/page/i.test(w)) n = n * 275;
  return Math.round(n / 200);
}
function seriesMinutes(name){
  return BOOKS.filter(b => sName(b) === name).reduce((a, b) => a + bookMinutes(b), 0);
}

/* The three orders the shelf can stand in. `gloss` is worked out from the
   books rather than typed, so it cannot drift when the catalogue grows — the
   same rule the counts everywhere else in this section follow. */
const SORTS = [
  { k:"newest",   label:"Newest",   gloss:() => `${BOOKS.length} down to 1` },
  { k:"number",   label:"Number",   gloss:() => `1 up to ${BOOKS.length}` },
  { k:"shortest", label:"Shortest", gloss:() => `${Math.min(...BOOKS.map(bookMinutes))} minutes up` }
];
const sortLabel = () => (SORTS.find(s => s.k === sortBy) || SORTS[0]).label;
/* Ties keep catalogue order, so two books of the same length never swap
   places between one draw and the next. */
const sortCmp = (a,b) =>
  sortBy === "number"   ? a.n - b.n
: sortBy === "shortest" ? (bookMinutes(a) - bookMinutes(b)) || (a.n - b.n)
:                         b.n - a.n;

function sortMenu(){
  return `<span class="sortwrap${sortOpen?' is-open':''}">
        <button class="sortbox" type="button" data-sort="1" aria-haspopup="listbox" aria-expanded="${sortOpen}">Sort: ${esc(sortLabel())} ${DICON.caret}</button>
        ${sortOpen ? `<div class="sort-list" role="listbox" aria-label="Sort the shelf">
          ${SORTS.map(s=>`<button type="button" role="option" data-sortpick="${s.k}" aria-selected="${sortBy===s.k}"><span>${esc(s.label)}</span><i>${esc(s.gloss())}</i></button>`).join("")}
        </div>` : ``}
      </span>`;
}
function seriesHours(mins){
  const h = Math.round(mins / 60 * 2) / 2;
  return h % 1 ? h.toFixed(1) : String(h);
}
function seriesPanel(){
  if (query.trim() || filter === "all" || filter === "Standalone") return "";
  const e = SERIES_SYN[railName(filter)];
  if (!e) return "";
  const n = BOOKS.filter(b => sName(b) === filter).length;
  if (!n) return "";
  return `
      <section class="sv" aria-label="About ${esc(railName(filter))}">
        <div class="sv-box">
          <p class="sv-p">${esc(e.lede)}</p>
          <div class="sv-mark">
            <span class="sv-art">${e.dev}</span>
            <span class="sv-cap">${esc(e.cap)}</span>
          </div>
          <p class="sv-p">${esc(e.body)}</p>
        </div>
        <p class="sv-foot"><b>${n} ${n === 1 ? "Story" : "Stories"}</b><i>\u00b7</i>
           <span>\u2248 ${seriesHours(seriesMinutes(filter))} Hours</span></p>
      </section>`;
}

function libraryRows(){
  const q = query.trim().toLowerCase();
  return BOOKS.filter(b=>{
    if (q) return (b.t+" "+sName(b)+" "+pad(b.n)+" "+b.n).toLowerCase().includes(q);
    if (filter === "all") return true;
    return sName(b) === filter;
  }).sort(sortCmp);
}

/* Share, as script.js does it: the system sheet where there is one, the
   clipboard otherwise, and a word in place of the label rather than an alert
   that has to be dismissed. The address is a real page — share/<slug>.html —
   because anything after a # never reaches a server, so a preview crawler
   asked about a #slug link only ever sees the front page. */
function shareBook(b, el){
  const url = shareHref(b);
  const say = word => {
    if(!el) return;
    const t = [...el.childNodes].find(n=>n.nodeType===3 && n.textContent.trim());
    if(!t) return;
    if(!el.dataset.label) el.dataset.label = t.textContent;
    t.textContent = " " + word;
    clearTimeout(el._t);
    el._t = setTimeout(()=>{ t.textContent = el.dataset.label; }, 1600);
  };
  if (navigator.share){
    navigator.share({ title: b.t + " \u2014 Chew Z", url }).catch(()=>{});
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(()=>say("Copied")).catch(()=>say("Copy failed"));
    return;
  }
  window.open(url, "_blank", "noopener");
}

/* READ STORY opens the reader. On the site that is openReader() in script.js:
   it loads read/NN.json, restores the reader's place and type size, and tracks
   progress. The sandbox has the section, not the reader, so this stands in for
   it with the same chrome — what matters here is that the control is wired and
   that opening and closing land the reader back where they were. */
/* ── the three things you can do with a book ──────────────────────────────
   These are the site's own addresses, built the way script.js builds them.
   In the sandbox both bases are absolute so the links can actually be clicked;
   ON THE SITE they become relative — PDF_BASE "pdfs/" and SHARE_BASE
   location.origin + basePath() + "share/" — and nothing else here changes. */
const PDF_BASE   = basePath() + "pdfs/";
const SHARE_BASE = location.origin + basePath() + "share/";
/* slugFor() from script.js, to the character: a book's share page is
   NN-title-with-hyphens.html, and a mismatch is a 404 rather than a wrong
   picture. All 94 were checked against the files in share/. */
function slugFor(b){
  /* pad2, not pad. The display number is three digits — "No. 001" — but every
     FILE on the site is two: pdfs/06.pdf, share/06-undertow.html,
     read/06.json. Using the display padding here builds pdfs/001.pdf, which
     404s on all ninety-four. */
  return pad2(b.n) + "-" + String(b.t).toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
const pdfHref   = b => PDF_BASE + pad2(b.n) + ".pdf";
const shareHref = b => SHARE_BASE + slugFor(b) + ".html";

function readerPanel(){
  if (readN == null) return "";
  const b = byNum[readN]; if (!b) return "";
  const paras = String(b.syn || b.hook || "").split("\n\n");
  return `
  <div class="rdr">
    <header class="rdr-top">
      <span class="rdr-ti">${esc(b.t)}</span>
      <button class="rdr-x" type="button" data-readclose="1" aria-label="Close the reader">${DICON.close}</button>
    </header>
    <div class="rdr-body">
      <p class="rdr-line">No. ${pad(b.n)} · ${esc(b.w)} · ${esc(b.rt)}</p>
      ${paras.map(x=>`<p class="rdr-p">${esc(x)}</p>`).join("")}
      <p class="rdr-note">The reader opens here. On the site this calls
        <code>openReader()</code>, which loads <code>read/${pad2(b.n)}.json</code>,
        remembers where you stopped and keeps your type size. The sandbox carries
        the section, not the reader, so it shows the synopsis in its place.</p>
    </div>
  </div>`;
}

/* The enlarged cover. The strip along the bottom is every book in the
   current filter, so a reader can walk the shelf without closing the view. */
function zoomOverlay(){
  if (zoomN == null) return "";
  const b = byNum[zoomN]; if (!b) return "";
  const rows = libraryRows();
  const i = rows.findIndex(x=>x.n===zoomN);
  const prev = i > 0 ? rows[i-1].n : rows[rows.length-1].n;
  const next = i > -1 && i < rows.length-1 ? rows[i+1].n : rows[0].n;
  return `
  <div class="zoom is-full">
    <div class="zoom-scroll">
      <figure class="zoom-fig">
        <span class="zoom-plate is-pair"><img src="${pair(b.n)}" alt="${esc(b.t)} — front and back cover"></span>
        <figcaption class="zoom-cap">
          <b>${esc(b.t)}</b>
          <i>No. ${pad(b.n)} · ${esc(b.rt)} · ${esc(sName(b))}</i>
        </figcaption>
      </figure>
    </div>
    <div class="zoom-strip">
      ${rows.map(x=>`<img src="${cov(x.n)}" alt="${esc(x.t)}" loading="lazy"
                          data-zoom="${x.n}" aria-current="${x.n===zoomN}">`).join("")}
    </div>
    <button class="zoom-nav rot-r" type="button" data-zoomstep="-1" aria-label="Previous cover">${DICON.caret}</button>
    <button class="zoom-nav rot-l" type="button" data-zoomstep="1" aria-label="Next cover">${DICON.caret}</button>
    <button class="zoom-x" type="button" data-zoomclose="1" aria-label="Close">${DICON.close}</button>
  </div>`;
}

/* LISTEN, pressed. A recording can be had two ways and the control cannot
   guess which is wanted: read along with it here, where the page lights the
   sentence being spoken, or keep the file. So the control asks.

   It is drawn as an overlay rather than a menu hanging off the control
   because four different cards draw that control, in places as narrow as a
   159px column, and a panel that has to fit beside all four would be built
   to the worst of them. Overlay also matches what the section already does
   for the enlarged cover and the reader — same backdrop, same close, same
   Escape. */
function listenPanel(){
  if (listenN == null) return "";
  const b = byNum[listenN]; if (!b) return "";
  /* audio: is normally a path inside the site ("assets/audio/35.mp3") and is
     resolved against it. It may also be a whole address, for a recording
     hosted somewhere other than the repo — which is the way out if these
     files ever outgrow GitHub Pages — and that is left exactly as written.
     Prefixing it would have built "/https://…/35.mp3". */
  const src = String(b.audio || "");
  const file = /^(https?:)?\/\//i.test(src) ? src
             : basePath() + src.replace(/^\/+/, "");
  return `
  <div class="lsn" data-listenback="1">
    <div class="lsn-box" role="dialog" aria-modal="true" aria-label="Listen to ${esc(b.t)}">
      <button class="lsn-x" type="button" data-listenclose="1" aria-label="Close">${DICON.close}</button>
      <span class="lsn-eyebrow">${DICON.listen}<i>Narrated</i></span>
      <h3 class="lsn-t">${esc(b.t)}</h3>
      <p class="lsn-sub">No. ${pad(b.n)} \u00b7 ${esc(sName(b))}</p>
      <button class="lsn-opt" type="button" data-listenplay="${b.n}">
        <span class="lsn-opt-t">Listen here</span>
        <span class="lsn-opt-d">${b.synced === false
          ? `The book opens with the recording playing, and you can read along
             at your own pace.`
          : `The book opens and reads along \u2014 the sentence being spoken
             lights up as it goes.`}</span>
      </button>
      <a class="lsn-opt is-dl" href="${file}" download data-listendl="${b.n}">
        <span class="lsn-opt-t">Download the recording</span>
        <span class="lsn-opt-d">Keep the audio file \u2014 yours to play anywhere,
          offline, in whatever you listen with.</span>
      </a>
    </div>
  </div>`;
}

/* The record panel — the desktop half of what a card opens. Two columns,
   the way the live feature panel reads: the line, the synopsis and the
   dials on the left, the cover on the right, Door / Room / Key beneath. */
function recordPanel(){
  if (recN == null) return "";
  const b = byNum[recN]; if (!b) return "";
  const rows = libraryRows();
  const i = rows.findIndex(x=>x.n===recN);
  const prev = i > 0 ? rows[i-1] : rows[rows.length-1];
  const next = i > -1 && i < rows.length-1 ? rows[i+1] : rows[0];
  return `
  <div class="rec" data-recground="1">
    <div class="rec-in">
      <button class="rec-x" type="button" data-recclose="1">Close &#10005;</button>
      <p class="rec-line">${esc(recLine(b))}</p>
      <div class="rec-cols">
        <div class="rec-text">
          <p class="rec-syn">${esc(b.syn || b.hook + ".")}</p>
          ${dials(b)}
        </div>
        <div class="rec-side">
          <span class="rec-pair">
            <img src="${pair(b.n)}" alt="${esc(b.t)} — front and back cover">
            <span class="bcard-zoom" role="button" tabindex="0" data-zoom="${b.n}"
                  title="Enlarge cover" aria-label="Enlarge cover">${DICON.expand}</span>
          </span>
          <span class="rec-series">${esc(sName(b))}</span>
          <span class="bcard-acts">
            ${readRow(b, "bcard-read")}
            <span class="bcard-side">
              <a class="bcard-act" href="${pdfHref(b)}" target="_blank" rel="noopener" data-stop="1">${DICON.pdf} PDF</a>
              <span class="bcard-act" role="button" tabindex="0" data-share="${b.n}">${DICON.share} Share</span>
            </span>
          </span>
        </div>
      </div>
      ${keyed(b)}
      <div class="rec-nav">
        <button class="rot-r" type="button" data-rec="${prev.n}">${DICON.caret} ${esc(prev.t)}</button>
        <button class="rot-l" type="button" data-rec="${next.n}">${esc(next.t)} ${DICON.caret}</button>
      </div>
    </div>
  </div>`;
}

function deskLibraryBody(){
  const rows = libraryRows();
  return `
      <p class="lib-lede">${esc(LIBRARY.lede).replace("{n}", BOOKS.length)}</p>
      <div class="main-bar">
        <span class="t">${esc(columnHead())} / ${rows.length}</span>
        <span class="rl-rule"></span>
        ${sortMenu()}
        <span class="sep"></span>
        <span class="viewtog">
          <button type="button" data-mode="grid" aria-pressed="${mode==='grid'}" aria-label="Grid">${DICON.grid}</button>
          <button type="button" data-mode="list" aria-pressed="${mode==='list'}" aria-label="List">${DICON.list}</button>
        </span>
      </div>
${seriesPanel()}
      <div class="grid ${mode==='list'?'is-list':''}">
        ${rows.map(b=>`
          <button class="bcard" type="button" data-rec="${b.n}" aria-current="${b.n===cur}">
            <span class="bcard-cov">
              <span class="bcard-plate">
                <img src="${cov(b.n)}" alt="" loading="lazy">
                <span class="bcard-zoom" role="button" tabindex="0" data-zoom="${b.n}"
                      title="Enlarge cover" aria-label="Enlarge cover">${DICON.expand}</span>
              </span>
              <span class="bcard-acts">
                ${readRow(b, "bcard-read")}
                <span class="bcard-side">
                  <a class="bcard-act" href="${pdfHref(b)}" target="_blank" rel="noopener" data-stop="1">${DICON.pdf} PDF</a>
                  <span class="bcard-act" role="button" tabindex="0" data-share="${b.n}">${DICON.share} Share</span>
                </span>
              </span>
            </span>
            <span class="bcard-body">
              <span class="bcard-no"><b>No. ${pad(b.n)}</b></span>
              <span class="bcard-ti${b.t.length>25?" is-long":b.t.length>17?" is-mid":""}">${esc(b.t)}</span>
              <hr>
              <p class="bcard-hook">${esc(b.hook)}.</p>
              <p class="bcard-meta"><span>${esc(b.rt)}</span><span>·</span><span>${esc(sName(b))}</span></p>
            </span>
          </button>`).join("")}
      </div>
`;
}

/* The three sections share the rail and a nav at the top of the main column;
   only the column's content changes. The rail is locked, so a reader never
   loses the series list or the search. */
/* 94 (Round Trip) out, 26 (Mang and Mustard) back in at the user's request —
   26 held this Transgressive slot before and its scene art, assets/start-26,
   is already the 3:1 repaint every other row here uses, so it frames itself.
   No PICKNOTE entry: the panel teaser written for 26 is not on file anywhere,
   so the row falls through to the book's own catalogue synopsis.

   PICKS below is what actually builds the three categories; this list is
   declared and never read. Kept in step so the two cannot disagree later. */
const RECOMMENDED = [6,7,78,8,50,26,35,52,102];
/* The key stays "listening" — it is in the view state, the handlers and a
   dozen comments below, and renaming it would touch all of them to no effect
   a reader could see. Only the label changed: "Listening Room" was the one
   two-word label in the bar and the only one that wrapped, which is what gave
   the four columns their uneven hairlines and forced a floor on the phone's
   type size. "Listen" is also the word on every button inside the section. */
const SECTIONS = [
  {k:"about",     t:"About",   d:"The series and its world"},
  {k:"library",   t:"Library", d:"Explore every cover"},
  {k:"listening", t:"Listen",  d:"The stories, read aloud"},
  {k:"notes",     t:"Notes",   d:"Behind the stories"}
];
/* Sound and Theme. They stood at the foot of the rail; they belong at the top
   of the page with everything else a reader can operate, and the rail is for
   finding things. Written once here because the desktop header and the phone
   band both draw them and the two used to carry their own copies.

   ── THE THEME BUTTON IS SWITCHED OFF ──
   Sound is on its own now. The Theme button is parked below rather than
   deleted, in both the shapes it was drawn in — the desktop bar's and the
   phone band's, which differ only in their indent. Three more lines are
   commented out further down and marked THEME OFF: the click handler, the
   read of the stored flag, and the attribute the stylesheet watches.

   TO RESTORE: put each button back inside its own template literal, bring
   back the two `const light = …` reads that fed it, un-comment the three
   marked lines, and follow the four other steps listed beside the Theme
   button in index.html.

   Desktop shape:

    <button class="side-tog" type="button" data-themeswap="1" aria-pressed="${light}"
            title="${light ? 'Switch to the dark theme' : 'Switch to the light theme'}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8.6"/>
        <path d="M12 3.4a8.6 8.6 0 0 ${light ? '1' : '0'} 0 17.2z" fill="currentColor" stroke="none"/>
      </svg>
      <span>Theme</span>
    </button>

   Phone shape:

        <button class="side-tog" type="button" data-themeswap="1" aria-pressed="${light}"
                title="${light ? 'Switch to the dark theme' : 'Switch to the light theme'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="8.6"/>
            <path d="M12 3.4a8.6 8.6 0 0 ${light ? '1' : '0'} 0 17.2z" fill="currentColor" stroke="none"/>
          </svg>
          <span>Theme</span>
        </button>
*/
/* Sound used to sit at the left of the section bar, out of the nav's flow, and
   the bar kept an 11rem lane clear so the links could not walk into it. It is
   on the emblem now — top right of the rail, where the plate already draws the
   eye — which hands the whole width of the bar back to the four links. */
function soundTog(){
  return `
    <button class="side-tog side-sound" type="button" data-soundswap="1" aria-pressed="${soundOn}"
            title="${soundOn ? 'Silence the ambient sound' : 'Ambient sound'}">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
        ${soundOn
          ? `<path class="rl-bar-em" d="M5.2 9.6v4.8M18.8 9.6v4.8"/>
             <path class="rl-bar-pa" d="M8.6 6.5v11M15.4 6.5v11"/>
             <path class="rl-bar-em" d="M12 3v18"/>`
          : `<path class="rl-bar-pa" d="M8.6 6.5v11M15.4 6.5v11"/>`}
      </svg>
      <span>Sound</span>
    </button>`;
}
function deskNav(){
  return `
  <nav class="dnav">
    ${SECTIONS.map(x=>`
      <button type="button" data-view="${x.k}" aria-current="${view===x.k}">
        <b>${esc(x.t)}</b><i>${esc(x.d)}</i>
      </button>`).join("")}
  </nav>`;
}
function deskPage(){
  return `
  <div class="lib">
    ${listenPanel()}
    ${zoomOverlay()}
    ${readerPanel()}
    ${recordPanel()}
    ${sidebar()}
    <div class="main">
      ${deskNav()}
      ${view==="library" ? deskLibraryBody() : `<div class="abt">${view==="notes" ? notesBody() : view==="listening" ? listeningBody() : aboutBody()}</div>`}
      <div class="main-foot">
        <span>Roya Publication</span><span class="sep">|</span>
        <span>${BOOKS.length} stories</span><span class="sep">|</span>
        <span>People · Places · Possibilities</span>
        <span class="r">Fiction keeps us human</span>
      </div>
    </div>
  </div>`;
}

/* ─────────── MOBILE · the Roya Library ───────────
   Same rows, same filter, same search as the desktop archive — only the
   shape changes. The identity band carries the emblem, the name and the
   imprint line, with sound and theme at the far right. */
function mobNav(){
  return `
  <nav class="mob-nav">
    ${SECTIONS.map(x=>`
      <button type="button" data-view="${x.k}" aria-current="${view===x.k}">${esc(x.t)}<span></span><i>${esc(x.d)}</i></button>`).join("")}
  </nav>`;
}

/* ── About and Author's Notes ──
   The words are the live page's own, not a paraphrase. About loses the
   ordered list of 94 — that is the Library now — and keeps everything else:
   the statement, the three terms, the recommended books and the series. */
/* {n} is the catalogue's own length, the way ABOUT.note already does it.
   The number was written into this line as 101 when there were 101 books,
   and publishing No. 103 made it wrong the same hour — the sentence sat
   directly above a bar reading THE COMPLETE COLLECTION / 102. A count
   typed into prose is a count that goes stale on the next book. */
const LIBRARY = {
  lede: "All {n} stories, in one place."
};
const LISTENING = {
  lede: "Some books are better said than read."
};
const ABOUT = {
  lede: "For years I read other people\u2019s stories and lived in worlds someone else had already decided the shape of. Then a drug took the walls off one night and I made my own \u2014 planner, participant, whole production crew \u2014 and I have not been a guest since, so I finish them here.",
  note: "{n} short stories about people who finally say it out loud. Every book works the same way \u2014 a door out of the mind, a room on the other side, and the key that opened it.",
  terms: [
    { term:"Door", def:"How they got out",
      about:"How the person got out of their own head. There are only four ways, and every book uses one: Dose, they took something \u00b7 Rite, they practised something \u00b7 Ordeal, they endured something \u00b7 Withholding, they went without something." },
    { term:"Room", def:"Where they ended",
      about:"Where they land once they are out. Not a place on a map \u2014 the situation they now have to live in." },
    { term:"Key", def:"What opened it",
      about:"The exact thing that opened the door. A pill, a song, a ritual, a notebook." }
  ]
};
const NOTES = [
  "Some thoughts can\u2019t be said out loud without changing how the room sees you afterward. So they don\u2019t get said.",
  "Not shameful thoughts. The partly true ones. Everyone keeps one, unsaid, for years \u2014 and unsaid is what keeps it alive. Sooner or later it wants a body that isn\u2019t yours. I give it one.",
  "The mind negotiates. Given a minute alone it will reframe anything, delay anything, forgive itself in advance. The body won\u2019t. It keeps the actual record, underneath the words, where no conversation reaches \u2014 which is why nothing here gets settled by one. An ordeal is the only interrogation that works on a witness who doesn\u2019t talk.",
  "Nothing here resolves. I\u2019m suspicious of anyone whose does.",
  "Call it noir, transgressive, plausible \u2014 most of these are all three. Something bad happens to someone who\u2019s earned about half of it, and nobody gets saved. I don\u2019t cut away from the ugly part. And it\u2019s plausible: everything in these books could actually happen. I let myself bend one thing about the world per book \u2014 never two \u2014 and everything else stays exactly as ordinary as it already is.",
  "Bring your ugliest thought. There\u2019s a chair for it."
];
const TERMICON = {
  Door:'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="9" y="4" width="30" height="40" stroke="currentColor" stroke-width="1.4"/><path d="M27 8h10v32H27z" fill="currentColor" opacity=".8"/><path d="M27 8l-9 3v26l9 3z" stroke="currentColor" stroke-width="1.3"/><circle cx="20.5" cy="24" r="1.3" fill="currentColor"/></svg>',
  Room:'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="8" y="8" width="32" height="32" stroke="currentColor" stroke-width="1.4"/><path d="M24 8v32M8 24h32" stroke="currentColor" stroke-width="1.2"/></svg>',
  Key:'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="18" cy="15" r="7.5" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="15" r="2.6" stroke="currentColor" stroke-width="1.5"/><path d="M22 21l13 21" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M29 32l6-3.4M32.5 38l6-3.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

/* Recommended books, grouped the way the live page groups them — under the
   three dials, each with the dial's own gloss, the artwork bleeding in from
   the right. */
/* The nine recommended books say on the live page what they say here: the
   blurb is a teaser written for this panel, not the book's synopsis, and two
   of them carry a Persian title. Copied from index.html rather than rewritten. */
const PICKNOTE = {"6": "A new drug lets a therapist walk down into a patient’s mind, to the riverbed where the original wound was carved. Then a patient arrives — someone three other clinics have already turned away — whose own mind has already named him before he speaks. Going that deep was never safe for the guide either; the water takes him too.", "7": "Consciousness turns out to have a kill switch, and Dr. Kelo finds it: silence the inner voice, and her subjects go calm, capable, and quietly unsure who’s actually in charge. That voice was never their own — it was standing guard for something that has waited seven hundred feet under a dead reservoir for centuries, and just opened its eyes.", "78": "In January 2026, she told him not to go. That evening the country’s phones and internet went dark, and the shooting started with nothing left to prove it happened. What’s left isn’t a death toll — there’s no agreed count, and every number serves whoever repeats it. Six months on, a young man keeps the record the state agreed to lose.", "8": "Every audience has a breaking point — eight to twelve seconds, on average — where it decides it has seen enough of a stranger’s ruin to stop listening. Mercy is built to interrupt exactly that reflex: a compound that makes a confession land in you as though it were your own. Eight strangers finally get a room that refuses to look away.", "50": "For centuries, practitioners sealed the body with mudras, holding sensation rather than spending it, and never wrote the final instruction down. A laboratory found what that practice had quietly been building in the body, cloned it, and shipped it anyway, missing the last line. Arousal becomes a residence, not an event, and within a generation men aren’t persecuted so much as simply no longer recognized.", "94": "When a government shuts off the internet, somebody has to do it. He is the engineer who does — and the job turns out to be not a wall but a list: hospitals, ambulances, banks, written in his own hand. Everyone left off it simply cannot reach anyone. Afterwards the calls that never connected begin arriving in his sleep.", "35": "Roya never spoke, never reached, never turned her head, and lived ten years and eleven months, growing heavier every one. Her mother's account of the therapy that hurt her daily to save her, and the sixth year, when the visitors had stopped and nobody had noticed. What eased was said out loud; what didn't, never was.", "52": "Surfers call it the samba: the shaking a body does after too long underwater. A rescue-ski driver has pulled four hundred and eleven people from the water — and believes speed is the only decent thing about him. He’s wrong. Then a wave bigger than any in the beach’s history arrives, and he finally learns what nine years of sixty-two-second rescues have actually been about.", "26": "Set on the Majnoon marshes, 1984, during the Iran–Iraq War, the title names two poisons: mustard gas, filling a field hospital with the blind and dying, and mang — Farsi for henbane, ancestor of atropine, the antidote to nerve agents. Sohrab, a nineteen-year-old orderly counting the ward's ampoules, finds soldiers injecting the antidote for its visions — reviving an old rite where a priest drank wine and mang, lay seven days as if dead, and returned from the other side to tell what he saw. His ledger becomes a doorway to the dead. By the 1988 ceasefire, the border is unmoved and a million are gone.", "102": "Set in the hills above Pacific Palisades through the last winter of 2024, where a family out of Tehran built a glass house on a slope that had not burned in fifty years. Contained, mostly is what a fire service says when a fire has been stopped rather than put out. On the ridge, white flowers that open only in summer are open in January \u2014 and between the chapters, something much older than the houses begins to speak.", "55": "The rules are absolute: nobody may touch her, for any reason, for the whole crossing. They were the same rules ten years ago, when her son drowned an arm’s length away and no one was allowed to reach him. Now she’s back for the crossing she has left. Past the twentieth hour, something starts swimming beside her — and starts, gently, correcting her memory of that night."};
/* 94's three lines are kept below though its slot went to 26 — the panel
   copy written for a book exists nowhere else, and putting 94 back should not
   mean writing it again. Unused entries cost nothing; a lost paragraph does. */
const PICKFA = {"78": "خاموشی", "94": "رفت و برگشت"};
const PICKGLOSS = {"6": "his patient’s mind named him", "7": "the dreamer was not you", "78": "the dark was the method", "8": "pity, measured in seconds", "50": "the last instruction went unwritten", "94": "the calls return", "35": "she grew heavier, alone", "52": "a dance name for drowning", "55": "her son’s old place", "102": "six days, underground", "26": "the antidote was the door"};
/* three paintings are framed off-centre on the live page, so the subject is
   not lost when the picture is cropped to the card */
/* start-94 is 1100x367 with the tower and the colour burst in its right
   quarter; on a phone the plate is cropped to a narrow vertical slice, and at
   84% that slice landed just left of the painting. */
/* The About headings use the live page's own one-line descriptions, which are
   shorter than the dial glossary's — the glossary has to explain a scale, a
   heading only has to name a mood. */
const PICKABOUT = {
  "Noir":"How cold it gets.",
  "Transgressive":"How far past comfort it goes.",
  "Plausible":"How much of it could actually happen."
};
const PICKS = [
  { dial:0, name:"Noir",          books:[6,7,78] },
  { dial:1, name:"Transgressive", books:[8,26,50] },
  { dial:2, name:"Plausible",     books:[35,52,102] }
];
/* The recommended-series panel, exactly as the live page configures it:
   an English name and a Persian one, the banner, every paragraph of the
   synopsis, a start-here book with its volume number, and the whole cycle. */
const SERIESFEAT = [
  /* `feat` is the panel's own cut of the synopsis, the way PICKNOTE is the
     panel's own cut of a book's. The full text stays in stories.js and is
     what the Library, the share page and the feed carry; this is the same
     prose set to the design ChewZ drew for each series. Nothing here is
     written — every line is the series' own. */
  /* Come in, the water's lovely. The plate is the mirror of The Unsaid's:
     the painting sits in the RIGHT half and dissolves into a flat field on
     the LEFT, so `side:"left"` hands the words that side and the stylesheet
     flips the two margins. Unlike the other two plates this one carries no
     painted title \u2014 it is set in HTML at every width, which is why
     .ab-feat--splitl puts .pl-t back at 1150 and up. `key` is the catalogue's
     own string and must stay exactly as stories.js spells it, or [data-series]
     filters to nothing. */
  /* The panel carries the whole title, set in three lines. `en` stays the
     running name — it is what the aria-labels and the cover's alt text read —
     and `enLines` is only how the head is set. */
  /* enLines is gone from this entry on purpose: the head is one line at every
     width now, so there are no author-set breaks to hold. The renderer and the
     .ft-line rules stay in place for any series that wants them. */
  { key:"Come In, the Water Is Lovely", en:"Come In, the Water Is Lovely",
    fa:"",
    art:"assets/series-waters-wide-3.webp", artTall:"assets/series-waters-tall-4.webp",
    start:93, startFa:"", vol:"Book One",
    books:[93,95,97],
    /* 1776/1104, the new painting's own shape. Since v578 the plate is drawn on
       a layer sized by this, so a stale ratio puts the fade off the picture's
       real edges. */
    feat:{ kind:"split", side:"left", cta:"Start the series", ratio:"1776/1104",
      eyebrow:"Everything got better",
      body:[
        "\u201cCome in, the water\u2019s lovely\u201d is what people in the water call to the one on the edge. Usually a kind lie.",
        "Here it\u2019s true.",
        "A woman is cured of loneliness. Nothing tells loneliness from solitude, so she loses both.",
        "The roads get safer, and the part of a person that flinches is never called on.",
        "The power goes off on an agreed schedule, the money is fair, nobody is cold.",
        "Each was solved by a machine better at it than any person alive, and never once wrong. Nothing was taken, nothing hidden, nobody to be angry with.",
        "The danger is not being overpowered or deceived. It is being satisfied."
      ] } },
  { key:"From the Delgosh\u0101", en:"The Delgosh\u0101", fa:"\u062f\u0644\u06af\u0634\u0627",
    art:"assets/series-delgosha-cover.webp", start:75,
    startFa:"\u0686\u0634\u0645\u200c\u0627\u0646\u062f\u0627\u0632 \u06f1\u06f4\u06f0\u06f4", vol:"Book Three",
    books:[68,70,75,77,79,82,87,91,96],
    /* the theatre, with the words standing in the dark half of the plate.
       The synopsis here is a short cut of the series' own prose: the field is
       the picture's, not the page's, and only about four lines of it can be
       read at the size the rest of the section uses. */
    feat:{ kind:"stage", cta:"Start the series here", ratio:"920/1380",
      quote:"Delgosh\u0101 means heart-opening. It is the title of the funniest book in Persian, the surname of the funniest man in Iran, and in both cases the best parts have been left out.",
      body:[
        "Manuchehr Delgosh\u0101 \u2014 Manu \u2014 is the most famous underground comedian in the country, and nobody has seen his face. Forty basements a week, no byline, no fee: an empire built from a chair at three in the morning.",
        "Then Roshanak Azimi turns up \u2014 street-smart, twenty-two, single digits out of six hundred thousand in the national examination. Together they build Romanu: attached to nobody, given away free, and within a decade the most widely read unsigned work in the language."
      ] } },
  { key:"From the Unsaid", en:"The Unsaid", fa:"\u0646\u0627\u06af\u0641\u062a\u0647",
    /* -wide-5: the painted title lifted 34px, and the painter's red thread taken
       out of the
       flat dark field on the right, where the synopsis stands. It ran directly
       under the words and read as a rule belonging to them. The thread is
       untouched in the artwork itself, and tapers out as it always did.
       A new number rather than the same name: the plate URL carries no ?v=,
       so a browser holding -3 would go on serving the old one. */
    art:"assets/series-unsaid-wide-5.webp", artTall:"assets/series-unsaid-tall-3.webp", start:89,
    startFa:"\u0633\u0647 \u063a\u0644\u0637\u060c \u06cc\u06a9 \u062f\u0631\u0633\u062a", vol:"Book Five",
    books:[78,80,83,86,89,92,94,99],
    /* the picture stands on the left and the words on the right, the way the
       design has it: a tall crop of the plate holding the face and the crowd,
       and beside it the title, the line, the synopsis and the way in. */
    /* No quote line here. It was the one thing standing between the reader and
       the synopsis, and the plate's own painted thread runs directly under it,
       so the italic read as a caption to a rule it had nothing to do with. */
    feat:{ kind:"split", cta:"Start the series", ratio:"1568/627",
      eyebrow:"Notice how little cruelty it takes",
      body:[
        "Iran, from 1979 onwards \u2014 mostly Tehran: its offices, courtrooms and classrooms.",
        "A mother dreams about her dead son, and the dream comes back to her in another person\u2019s words. A woman waits outside a courtroom. A boy sits an exam that will decide his life. A man wakes one morning unable to feel a weight he could always judge.",
        "No order. No refusal. No one to be angry with.",
        "N\u0101gofteh means the unsaid: not a secret somebody is keeping, but what was never spoken at all."
      ] } },
  { key:"The Unheard House", en:"The Unheard House", fa:"",
    art:"assets/forough.webp", start:63,
    startFa:"\u062e\u0627\u0646\u0647 \u0635\u0628\u0648\u0631 \u0627\u0633\u062a", vol:"Book One",
    books:[63,64,65], over:true,
    /* The years are isolated left-to-right so they read 1313-1345 with the
       earlier year on the left, as they would on the book's own page. Left to
       the paragraph's direction the browser mirrors the pair. */
    dedYears:"\u06f1\u06f3\u06f1\u06f3\u2013\u06f1\u06f3\u06f4\u06f5",
    ded:["\u062a\u0642\u062f\u06cc\u0645 \u0628\u0647 \u0641\u0631\u0648\u063a \u0641\u0631\u062e\u0632\u0627\u062f\u060c",
          "\u0631\u0641\u062a \u0622\u0646\u062c\u0627 \u06a9\u0647 \u0631\u0641\u062a\u0646 \u06af\u0646\u0627\u0647 \u0628\u0648\u062f\u060c \u06af\u0641\u062a \u0622\u0646\u0686\u0647 \u06a9\u0647 \u06af\u0641\u062a\u0646 \u06af\u0646\u0627\u0647 \u0628\u0648\u062f." ] }
];
const VOLWORD = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
/* Every scene comes from the repo's own assets/ - except two.
   35: the repo's file is a later, much wider rendering of the same scene, and
   at this row's proportions the wings all but vanish into black.
   94: the repo still holds the unshifted painting, the one that drew "hardly
   any of the painting is visible".
   Those two keep the rendering the section was designed against; the other
   seven scenes are the repo's own files, untouched. */
const ART_OWN = {35:1, 94:1};
/* Books with a second painting cut for the phone. A phone row is nearly as
   tall as it is wide, so a 3:1 scene painted for the desktop arrives there
   as a sliver of its own middle; where a 3:2 recut exists, the phone gets
   it. Listed rather than guessed, because a missing -m file would 404 on
   every draw and .ab-art is a CSS background, which no error handler sees. */
const ART_PHONE = {102:1};
const art = n => basePath() + (ART_OWN[n] ? "library/art/start-" : "assets/start-")
  + pad2(n) + (ART_PHONE[n] && dev === "phone" ? "-m" : "") + ".webp";
const ORN2 = '<svg class="ab-orn" viewBox="0 0 64 26" fill="none" aria-hidden="true">'
  + '<path d="M32 3l3.4 7L43 13l-7.6 3L32 23l-3.4-7L21 13l7.6-3z" fill="currentColor" opacity=".9"/>'
  + '<path d="M13 13h6M45 13h6" stroke="currentColor" stroke-width="1"/>'
  + '<path d="M22 6.5 32 2l10 4.5M22 19.5 32 24l10-4.5" stroke="currentColor" stroke-width=".8" opacity=".65"/></svg>';
const mark = t => `<span class="ab-mark">${ORN2}<b>${t}</b>${ORN2}</span>`;

/* Nothing in this section may print the size of the catalogue from a literal.
   Every count comes from BOOKS.length, and this fails loudly at load rather
   than showing a stale figure for however long it takes someone to notice. */
(function(){
  const typed = [ABOUT.note, ABOUT.lede].join(" ").match(/\b\d{2,}\s+(?:short\s+)?(?:noir\s+)?(?:stor|novella|book)/i);
  if (typed) console.warn("Roya Library: a catalogue count is typed into the copy —", typed[0]);
})();

/* ── the two plate features ──
   Both series now ship as a finished plate with their own title set into it,
   so the page supplies only what is below that title. Two shapes:

   "plate"  — one wide picture that dissolves into a flat dark field on the
              right; the words stand in that field.
   "spread" — an open book; the words set on the left page, and the line and
              the way in sit under the picture on the right.

   Above 1150px the words are laid INTO the plate: the block is pinned to the
   plate's own proportion, every text box is placed in per cents of it, and the
   type is sized in cqw, so the whole thing scales as one object and the words
   stay on the page at every width. Below that the plate cannot carry legible
   type — a spread at phone width puts the body at about six pixels — so the
   picture becomes a banner and the words fall underneath it at real sizes,
   with the page setting the title the plate would otherwise have given. */
function featPanel(f, sb){
  const fe = f.feat;
  /* A series may set its head in lines of its own rather than let the measure
     decide where it breaks. Each line is its own block, so the break holds at
     every width instead of moving with the column. */
  const enHtml = Array.isArray(f.enLines)
    /* joined on a real space so the lines can be set inline on a page, where
       the head runs as one row, and stacked on a handset, where each line is a
       block and the space between two blocks collapses away. */
    ? f.enLines.map(l=>`<span class="ft-line">${esc(l)}</span>`).join(" ")
    : esc(f.en);
  const title = `<h3 class="pl-t"><span class="ft-en">${enHtml}</span>${f.fa ? `<span class="ft-fa" lang="fa" dir="rtl">${esc(f.fa)}</span>` : ""}</h3>`;
  /* the way in. It opens the series' start book through the same control every
     other book on this panel uses — 75 for the Delgosh\u0101, 89 for The Unsaid. */
  /* The way in opens the SERIES in the Library, not its start book: the
     same [data-series] the series titles in About already use, which is
     the only control that can take a reader to a series rather than a
     volume. It no longer depends on `sb`, so a series with no start book
     still gets its button. */
  const cta = `<button class="ft-cta" type="button" data-series="${esc(f.key)}">${esc(fe.cta)}<span class="ft-arrow" aria-hidden="true">&rarr;</span></button>`;
  const style = `--plate:url('${basePath()}${f.art}'); --ratio:${fe.ratio}`
    + (f.artTall ? `; --plate-tall:url('${basePath()}${f.artTall}')` : "");
  const paras = a => a.map(x=>`<p class="pl-p">${esc(x)}</p>`).join("");

  /* ── the picture beside the words ──
     Two series are built this way now. The Unsaid takes the "split": a 2.5:1
     plate whose dark field sits to the right of the crowd. The Delgosh\u0101 takes
     the "stage": a 3:1 plate of the theatre with the whole right half given
     over to the words, and an upright plate for the handset that keeps its
     dark third at the top. Same markup, same four parts, different geometry —
     so they share this branch and part company in the stylesheet. */
  /* ── the Delgosh\u0101: the book itself, and the words beside it ──
     The series is shown as the object a reader would pick up — the theatre
     printed on a worn board cover, its title set into the dark band at the
     head of the picture where the painter left room for it. The panel's ground
     is the same painting thrown far out of focus, so the cover stands in its
     own light rather than on a flat black, and the two rails carry the series'
     line up the sides of it.

     On a page the cover keeps the left and the words take the right; on a
     handset the cover leads and the words fall underneath. Same parts, same
     order, turned through ninety degrees. */
  if (fe.kind === "stage") return `
    <section class="ab-feat ab-feat--stage" style="${style}">
      <div class="pl">
        <div class="pl-haze" aria-hidden="true"></div>
        <div class="pl-stack">
          <div class="pl-shelf">
            <div class="pl-cover" role="img" aria-label="${esc(f.en)} \u2014 cover"></div>
          </div>
          <div class="pl-side">
            ${title}
            <div class="pl-words">
              <p class="pl-q">${esc(fe.quote)}</p>
              <div class="pl-body">${paras(fe.body)}</div>
            </div>
            <div class="pl-way">${cta}</div>
          </div>
        </div>
      </div>
    </section>`;

  /* ── the picture beside the words ── */
  if (fe.kind === "split") return `
    <section class="ab-feat ab-feat--split${fe.side === "left" ? " ab-feat--splitl" : ""}" style="${style}">
      <div class="pl">
        ${title}
        <div class="pl-art" role="img" aria-label="${esc(f.en)}"></div>
        <div class="pl-words">
          ${fe.quote ? `<p class="pl-q">${esc(fe.quote)}</p>` : ""}
          <div class="pl-body">${paras(fe.body)}</div>
        </div>
        <div class="pl-way">
          ${fe.eyebrow ? `<p class="ft-eyebrow">${esc(fe.eyebrow)}</p>` : ""}
          ${cta}
        </div>
      </div>
    </section>`;

  /* ── the open book ── */
  const fo = fe.folio || ["",""];
  return `
    <section class="ab-feat ab-feat--spread" style="${style}">
      <div class="pl">
        <div class="pl-art" role="img" aria-label="${esc(f.en)}"></div>
        <div class="pl-words">
          ${title}
          <p class="pl-lede">${esc(fe.lede)}</p>
          <div class="pl-cols">
            <div class="pl-col">
              <p class="pl-p">${esc(fe.cols[0][0])}</p>
              <p class="pl-q">${esc(fe.quote)}</p>
              ${paras(fe.cols[0].slice(1))}
            </div>
            <div class="pl-col">${paras(fe.cols[1])}</div>
          </div>
        </div>
        <div class="pl-foot">
          ${fe.caption ? `<p class="pl-cap">${esc(fe.caption)}</p>` : ""}
          ${cta}
        </div>
        <p class="pl-folio pl-folio--l" aria-hidden="true">${esc(fo[0])}</p>
        <p class="pl-folio pl-folio--r" aria-hidden="true">${esc(fo[1])}</p>
      </div>
    </section>`;
}

/* ── The Listening Room ──
   Every book that carries a recording, newest first, with the runtime where
   the Library puts the reading time and the same Listen mark beside it. The
   rows are the About page's own .ab-row: a recording is still a book, and a
   reader who has met one of these rows should not have to learn a second
   kind. What the rows gain is the sort — recordings differ by hours, not by
   the minutes that separate two novellas, so the length is the thing a
   listener actually chooses on.

   Runtime comes off stories.js (runtime, in whole minutes). A book with
   audio and no runtime still lists; it just shows no figure and sorts last
   by length, which is the quiet failure rather than a thrown error. */
const LSORTS = [
  {k:"newest", t:"Newest"},
  {k:"short",  t:"Shortest"},
  {k:"long",   t:"Longest"}
];
function runLabel(m){
  if(!m && m!==0) return "";
  const h = Math.floor(m/60), r = m%60;
  /* "4h 06m", not "4 h 06 m": the unit belongs to the number in front of it,
     and at .24em tracking a space between them opened a gap wide enough that
     the H and the M read as separate words. */
  const u = x => `<i class="lr-u">${x}</i>`;
  return h ? `${h}${u("h")} ${String(r).padStart(2,"0")}${u("m")}`
           : `${r}${u("m")}`;
}
function listeningBody(){
  const rows = BOOKS.filter(b=>b.audio);
  if(!rows.length) return `<p class="ab-lede">No recordings yet.</p>`;
  const list = rows.slice();
  if(lsort==="short") list.sort((a,b)=>(a.runtime||1e9)-(b.runtime||1e9));
  else if(lsort==="long") list.sort((a,b)=>(b.runtime||-1)-(a.runtime||-1));
  else list.sort((a,b)=>b.n-a.n);

  return `
  <p class="ab-lede">${esc(LISTENING.lede)}</p>

  <div class="lr-bar">
    <span class="lr-count">${rows.length} recording${rows.length===1 ? "" : "s"}</span>
    <span class="lr-sorts">
      <span class="lr-sortlab">Sort</span>
      ${LSORTS.map(o=>`
        <button type="button" class="lr-sort${lsort===o.k ? " is-on" : ""}" data-lsort="${o.k}"
          aria-pressed="${lsort===o.k}">${esc(o.t)}</button>`).join("")}
    </span>
  </div>

  <div class="lr-list">
    ${list.map(b=>`
    <article class="lr-row">
      <span class="lr-cov">
        <img src="${cov3d(b.n)}" alt="" loading="lazy">
        <button class="lr-zoom" type="button" data-zoom="${b.n}"
          aria-label="View the ${esc(b.t)} cover full size" title="View full size">${DICON.zoom}</button>
      </span>
      <div class="lr-body">
        <h3 class="lr-t"><button type="button" data-rec="${b.n}"><b class="lr-n">${b.n}</b><span class="lr-dot" aria-hidden="true">\u00b7</span><span class="lr-name">${esc(b.t)}</span></button></h3>
        <p class="lr-syn">${esc(b.syn || b.hook + ".")}</p>
        <span class="lr-acts">
          <span class="lr-lsn">
            <button class="ab-lsn lr-listen" type="button" data-listen="${b.n}"
              aria-label="Listen to ${esc(b.t)}">${DICON.listen}<b>Listen</b></button>
            <b class="lr-run">${runLabel(b.runtime)}</b>
          </span>
          <button class="lr-read" type="button" data-rec="${b.n}">Read instead</button>
        </span>
      </div>
    </article>`).join("")}
  </div>`;
}

function aboutBody(){
  return `
  <div class="ab-marg" aria-hidden="true">\u06cc\u06a9\u06cc \u0628\u0648\u062f<br>\u06cc\u06a9\u06cc \u0646\u0628\u0648\u062f<br>\u0648 \u0647\u06cc\u0686 \u0641\u0631\u0642\u06cc \u0646\u062f\u0627\u0634\u062a</div>
  <p class="ab-lede">${esc(ABOUT.lede)}</p>
  <p class="ab-note">${esc(ABOUT.note).replace("{n}", `<b class="ab-count">${BOOKS.length}</b>`)}</p>
  <div class="ab-terms">
    ${ABOUT.terms.map(t=>`
      <div class="ab-term">
        <span class="ab-ic">${TERMICON[t.term]}</span>
        <span class="ab-t" tabindex="0">${esc(t.term)}<i class="hint">${esc(t.about)}</i></span>
        <span class="ab-d">${esc(t.def)}</span>
      </div>`).join("")}
  </div>

  <p class="ab-rule"><i></i>${mark("Pick a door")}<i></i></p>

  ${PICKS.map((g,i)=>{
    const sc = (GLOSS.notes||[])[g.dial] || {};
    return `
    <section class="ab-group">
      <header class="ab-gh">
        <div class="ab-gh-t">
          <h3>${esc(g.name)}</h3>
          <p>${esc(PICKABOUT[g.name] || sc.about || "")}</p>
        </div>
        ${dev==="phone" && i===0 ? `<div class="ab-gh-marg" aria-hidden="true">\u06cc\u06a9\u06cc \u0628\u0648\u062f<br>\u06cc\u06a9\u06cc \u0646\u0628\u0648\u062f<br>\u0648 \u0647\u06cc\u0686 \u0641\u0631\u0642\u06cc \u0646\u062f\u0627\u0634\u062a</div>` : ""}
      </header>
      ${g.books.map(n=>{
        const b = byNum[n]; if(!b) return "";
        const gl = PICKGLOSS[b.n] || b.gloss;
        return `
        <button class="ab-row" type="button" data-rec="${b.n}">
          <span class="ab-art" style="background-image:url('${art(b.n)}')" aria-hidden="true"></span>
          <span class="ab-rowin">
            <span class="ab-head">
              <b>${b.n}</b><span class="ab-dot">·</span><span class="ab-name">${esc(b.t)}</span>${PICKFA[b.n] ? `<span class="ab-fa" lang="fa" dir="rtl">${esc(PICKFA[b.n])}</span>` : ""}${gl ? `<i class="ab-gl">· ${esc(gl)}</i>` : ""}
            </span>
            <span class="ab-time">${esc(b.rt)}${b.audio ? `<i class="ab-lsn-rule" aria-hidden="true"></i><i class="ab-lsn" data-listen="${b.n}" aria-label="Listen to ${esc(b.t)}">${DICON.listen}<b>Listen</b></i>` : ""}</span>
            <p class="ab-syn">${esc(PICKNOTE[b.n] || b.syn || b.hook + ".")}</p>
          </span>
        </button>`;
      }).join("")}
    </section>`;
  }).join("")}

  <p class="ab-rule"><i></i>${mark("Recommended series")}<i></i></p>

  ${SERIESFEAT.map(f=>{
    const t = SERIES.find(x=>x.title.split(" \u00b7 ")[0] === f.key);
    const paras = (t && t.syn ? t.syn.split("\n\n") : []);
    const sb = byNum[f.start];
    /* Two of the three features carry their own layout. Both end on the same
       control — the series' start book, opened the way every other book on
       this panel opens — so the label is a real way in rather than a caption.
       The third (over:true) keeps the original arrangement below. */
    if (f.feat) return featPanel(f, sb);
    /* The third panel used to end on a start-here card and the whole cycle
       listed under it. It ends the way the other two do now: the synopsis,
       the one control that opens the series, and the dedication under it.
       The card and the cycle were the only place on this panel where the
       reader had to choose a book before anything happened; the series row
       on the shelf already lists all three, and the rail counts them. */
    return `
    <section class="ab-feat">
      <div class="${f.over ? "ab-over" : ""}" ${f.over && f.art ? `style="--ab-art:url('${basePath()+f.art}')"` : ""}>
      <h3 class="ab-feat-t"><button type="button" data-series="${esc(f.key)}">${esc(f.en)}${f.fa ? ` <span lang="fa" dir="rtl">${esc(f.fa)}</span>` : ""}</button></h3>
      ${!f.over && f.art ? `<span class="ab-feat-art"><img src="${basePath()+f.art}" alt="" loading="lazy"></span>` : ""}
      <div class="ab-feat-copy${f.over ? " is-centred" : ""}">
        ${paras.map((x,i)=>`<p class="${i===paras.length-1 && /^Start anywhere/.test(x) ? "ab-feat-p ab-feat-note" : "ab-feat-p"}">${esc(x)}</p>`).join("")}
      </div>
      <p class="ab-over-way"><button class="ft-cta" type="button" data-series="${esc(f.key)}">Start the series<span class="ft-arrow" aria-hidden="true">&rarr;</span></button></p>
      ${f.ded ? `<p class="ab-ded" lang="fa" dir="rtl"><span class="ab-ded-to">${esc(f.ded[0])}${f.dedYears ? ` <span dir="ltr">${esc(f.dedYears)}</span>` : ""}</span><em>${esc(f.ded[1])}</em></p>` : ""}
      </div>
    </section>`;
  }).join("")}

  <p class="ab-rule"><i></i>${mark("All series")}<i></i></p>
  <!-- Was a three-across grid of cards. A card grid has no order in it: the
       eye reads it as a set of equal tiles and the catalogue's own sequence —
       which is the one thing this list knows — was lost. As numbered rows the
       order is the content, the names line up in a column the eye can run
       down, and a row can open in place to show what is in the series without
       taking the reader off the panel. -->
  <div class="ab-serlist">
    ${GROUPS.filter(g=>g.name!=="Standalone").map((g,i)=>{
      const open = serOpen === g.name;
      const nm = railName(g.name);
      return `
      <div class="ab-srow${open?" is-open":""}">
        <button class="ab-srow-h" type="button" data-serex="${esc(g.name)}" aria-expanded="${open}">
          <span class="ab-sx">${pad2(i+1)}</span>
          <span class="ab-sn">${esc(nm)}</span>
          <span class="ab-sd">${esc(SERLINE(g))}</span>
          <span class="ab-sc">${g.books.length} book${g.books.length>1?"s":""}</span>
          <span class="ab-sv" aria-hidden="true">${DICON.caret}</span>
        </button>
        ${open ? `
        <div class="ab-spanel">
          <p class="ab-sp-syn">${esc(((g.syn||"").split("\n\n")[0] || "").trim() || SERLINE(g))}</p>
          <ol class="ab-sp-books">
            ${g.books.map((n,j)=>byNum[n] ? `
              <li><button type="button" data-rec="${n}">
                <span class="ab-sp-x">${pad2(j+1)}</span>${esc(byNum[n].t)}
              </button></li>` : "").join("")}
          </ol>
          <p class="ab-sp-go">
            <button type="button" data-series="${esc(g.name)}">Read series <span aria-hidden="true">&rarr;</span></button>
          </p>
        </div>` : ""}
      </div>`;
    }).join("")}
  </div>`;
}

function notesBody(){
  return `
  <p class="ab-eyebrow">Author&rsquo;s Notes</p>
  ${NOTES.map(n=>`<p class="ab-note ab-note--long">${esc(n)}</p>`).join("")}
  <p class="ab-sig">&mdash; Chew&#8239;Z</p>`;
}

/* ── the record ──
   What a reader actually came for: the full synopsis, the three dials and
   the Door / Room / Key the book was built from. Written once and used by
   both the desktop panel and the phone sheet, so the two can never drift. */
function dials(b){
  const scales = (GLOSS && GLOSS.notes) || [];
  if (!Array.isArray(b.notes) || !scales.length) return "";
  return `
  <div class="dials">
    ${scales.map((sc,i)=>{
      const lv = b.notes[i];
      if (!lv) return "";
      return `
      <div class="dial">
        <span class="dial-n" tabindex="0">${esc(sc.name)}<i class="hint">${esc(sc.about||"")}</i></span>
        <span class="dial-m" role="img" aria-label="${esc(sc.name)}: ${lv} of 3">
          ${[1,2,3].map(k=>`<i class="${k<=lv?"on":""}"></i>`).join("")}
        </span>
        <span class="dial-l">${esc((sc.levels||[])[lv-1]||"")}</span>
      </div>`;
    }).join("")}
  </div>`;
}

/* The three words About explains, keyed by the label the record prints, so the
   record and About can only ever say the same thing about them. */
const TERMABOUT = {};
ABOUT.terms.forEach(t => { TERMABOUT[t.term] = t; });

function keyed(b){
  const cell = (lab, name, gloss) => !name ? "" : `
    <div class="keyed-c">
      ${TERMABOUT[lab]
        ? `<span class="keyed-l has-hint" tabindex="0">${lab}<i class="hint"><b>${esc(TERMABOUT[lab].def)}</b>${esc(TERMABOUT[lab].about)}</i></span>`
        : `<span class="keyed-l">${lab}</span>`}
      <p class="keyed-t"><b>${esc(name)}</b>${gloss ? ` — ${esc(gloss)}` : ""}</p>
    </div>`;
  const cells = cell("Door", b.door, b.doorG) + cell("Room", b.room, b.roomG) + cell("Key", b.key, b.keyG);
  return cells ? `<div class="keyed">${cells}</div>` : "";
}

/* the line the live site runs above a synopsis */
const recLine = b => [pad(b.n), b.t, b.w, b.rt].filter(Boolean).join(" · ");

/* the sheet a card opens: the whole record for one book, without leaving
   the wall behind it */
function mobSheet(){
  if (sheetN == null) return "";
  const b = byNum[sheetN]; if (!b) return "";
  const rows = libraryRows();
  const i = rows.findIndex(x=>x.n===sheetN);
  const prev = i > 0 ? rows[i-1] : rows[rows.length-1];
  const next = i > -1 && i < rows.length-1 ? rows[i+1] : rows[0];
  return `
  <div class="sheet">
    <div class="sheet-fixed">
    <div class="sheet-top">
      <b>No. ${pad(b.n)}</b>
      <button class="sheet-x" type="button" data-sheetclose="1">Close &#10005;</button>
    </div>
    <span class="sheet-pair">
      <img src="${pair(b.n)}" alt="${esc(b.t)} — front and back cover">
      <span class="bcard-zoom" role="button" tabindex="0" data-zoom="${b.n}"
            title="Enlarge cover" aria-label="Enlarge cover">${DICON.expand}</span>
    </span>
    <h3>${esc(b.t)}</h3>
    <p class="sheet-meta"><span>${esc(b.w)}</span><span>·</span><span>${esc(b.rt)}</span><span>·</span><span>${esc(sName(b))}</span></p>
    </div>
    <div class="sheet-scroll">
    <p class="syn">${esc(b.syn || b.hook + ".")}</p>
    ${dials(b)}
    ${keyed(b)}
    <div class="sheet-acts">
      ${readRow(b, "bcard-read")}
      <span class="bcard-side">
        <a class="bcard-act" href="${pdfHref(b)}" target="_blank" rel="noopener" data-stop="1">${DICON.pdf} PDF</a>
        <span class="bcard-act" role="button" tabindex="0" data-share="${b.n}">${DICON.share} Share</span>
      </span>
    </div>
    <div class="sheet-nav">
      <button class="rot-r" type="button" data-sheet="${prev.n}">${DICON.caret} ${esc(prev.t)}</button>
      <button class="rot-l" type="button" data-sheet="${next.n}">${esc(next.t)} ${DICON.caret}</button>
    </div>
    </div>
  </div>`;
}

/* The read control, in one place because four cards draw it — the record
   panel, the grid card, the sheet and the phone card — and they must not
   drift apart.

   A book with a recording gets the row split in two: Read story on the
   left, Listen on the right. A book without one keeps the full-width Read
   story it has always had, so nothing changes for the other eighty-eight
   until their audio arrives. The field is the same audio: on stories.js
   that ADDING-AUDIO.md already defines; nothing new has to be set. */
function readRow(b, cls){
  const open = `<span class="${cls}" role="button" tabindex="0" data-read="${b.n}">`;
  /* The arrow belongs to the full-width control, where it sits at the far end
     of a long box and means "onward". In the split row it has nothing to
     point across — the box is half as wide and shares its line with Listen,
     which carries a mark of its own — so the two read as a pair of marks
     rather than one label and one arrow. Dropping it also gives the label
     back about 20px, which is most of what made it tight in the first place. */
  if (!b.audio) return `${open}Read story ${DICON.arrow}</span>`;
  return `<span class="${cls}s is-split">${open}Read story</span>` +
         `<span class="${cls} is-listen" role="button" tabindex="0" data-listen="${b.n}"` +
         ` aria-label="Listen to ${esc(b.t)}">${DICON.listen} Listen</span></span>`;
}

/* One option in the phone's series picker.

   The name is set in the reading face, not the control face the list used to
   borrow: a series name is a title, and every other title on the site is
   Garamond. The count goes in its own element so the two lay out as a pair —
   name left, figure right, tabular so the column is straight — which is the
   same arrangement railRow() already uses in the desktop sidebar.

   Order is GROUPS' order, newest series first; All series heads the list and
   the stand-alones close it, so the fourteen runs sit together between them. */
function pickRow(key, label, n){
  return `<button type="button" role="option" data-filter="${esc(key)}"
            aria-selected="${filter===key}"><span>${esc(label)}</span><i>${n}</i></button>`;
}

function mobile(){
  const rows = libraryRows();
  const names = GROUPS.filter(g=>g.name!=="Standalone").map(g=>g.name);
  return `
  <div class="mob${pickOpen ? ' is-picking' : ''}">
    ${pickOpen ? `<div class="pick-scrim" aria-hidden="true"></div>` : ``}
    <div class="mob-head">
    <header class="mob-bar">
      <span class="mob-lock">
        <button class="mob-mark" type="button" data-home="1" aria-label="Roya Publication — back to About">
          <span class="mob-word" aria-hidden="true"></span>
          <span class="mob-ears" aria-hidden="true"></span>
        </button>
        <b class="mob-name">CHEW&thinsp;Z</b>
      </span>
      <span class="mob-set">
        <span class="mob-set-row">
        <button class="side-tog side-sound" type="button" data-soundswap="1" aria-pressed="${soundOn}"
                title="${soundOn ? 'Silence the ambient sound' : 'Ambient sound'}">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
            ${soundOn
              ? `<path class="rl-bar-em" d="M5.2 9.6v4.8M18.8 9.6v4.8"/>
                 <path class="rl-bar-pa" d="M8.6 6.5v11M15.4 6.5v11"/>
                 <path class="rl-bar-em" d="M12 3v18"/>`
              : `<path class="rl-bar-pa" d="M8.6 6.5v11M15.4 6.5v11"/>`}
          </svg>
          <span>Sound</span>
        </button>
        </span>
        <i class="mob-rights">All rights reserved &copy; Chew&#8239;Z</i>
      </span>
    </header>
    ${mobNav()}
    ${view!=="library" ? "" : `
    <p class="lib-lede">${esc(LIBRARY.lede).replace("{n}", BOOKS.length)}</p>

    <h2 class="mob-h">${esc(columnHead())} <i>/ ${rows.length} <b>${rows.length===1 ? "story" : "stories"}</b></i></h2>

    <div class="mob-search">
      <input id="libSearch" type="search" placeholder="Search titles…" value="${esc(query)}"
             autocomplete="off" spellcheck="false">
      ${query ? `<button class="side-clear" type="button" data-clear="1" aria-label="Clear search">✕</button>` : DICON.search}
    </div>

    <div class="mob-ctrl">
      <span class="pickbox${pickOpen?' is-open':''}">
        <button class="pick-btn" type="button" data-pick="1" aria-expanded="${pickOpen}">
          <span>Series: ${esc(filter==='all' ? 'All' : railName(filter))}</span>
          ${DICON.caret}
        </button>
        ${pickOpen ? `<div class="pick-list" role="listbox" aria-label="Browse by series">
          ${pickRow("all", "All series", BOOKS.length)}
          ${names.map(n=>pickRow(n, railName(n), countOf(n))).join("")}
          ${pickRow("Standalone", "Stand alone", soloCount())}
        </div>` : ``}
      </span>
      ${sortMenu()}
      <span class="sep"></span>
      <span class="viewtog">
        <button type="button" data-mode="grid" aria-pressed="${mode==='grid'}" aria-label="Cards">${DICON.grid}</button>
        <button type="button" data-mode="list" aria-pressed="${mode==='list'}" aria-label="Rows">${DICON.list}</button>
      </span>
    </div>
    `}
    </div>

    ${view!=="library" ? `<div class="mob-sec">${view==="notes" ? notesBody() : view==="listening" ? listeningBody() : aboutBody()}</div>` : `
    ${seriesPanel()}
    <p class="mob-count">Showing ${rows.length} of ${BOOKS.length}</p>

    <div class="mob-grid ${mode==='list'?'is-rows':''}">
      ${rows.map(b=>`
        <button class="mcard" type="button" data-sheet="${b.n}" aria-current="${b.n===cur}">
          <span class="mcard-plate">
            <img src="${cov(b.n)}" alt="" loading="lazy">
            <span class="bcard-zoom" role="button" tabindex="0" data-zoom="${b.n}"
                  title="Enlarge cover" aria-label="Enlarge cover">${DICON.expand}</span>
          </span>
          <span class="mcard-body">
            <span class="mcard-no">No. ${pad(b.n)}</span>
            <span class="mcard-ti${b.t.length>20?" is-long":""}">${esc(b.t)}</span>
            <hr>
            <p class="mcard-hook">${esc(b.hook)}.</p>
            <p class="mcard-meta"><span>${esc(b.rt)}</span><span>·</span><span>${esc(sName(b))}</span></p>
            ${readRow(b, "mcard-read")}
          </span>
        </button>`).join("")}
    </div>`}

    <footer class="mob-foot">
      <span>Roya Publication</span><span>·</span><span>${BOOKS.length} stories</span>
      <span class="r">Fiction keeps us human</span>
    </footer>
  </div>`;
}
/* ─────────── wiring ─────────── */
/* The header folds once the reader is properly into the page and unfolds near
   the top. The flag lives on <html> so a redraw — a search keystroke, a filter
   — cannot reset it half way down the page.

   Two thresholds, not one. Folding removes about 70px from a header that sits
   in the flow at the top of the scroller, so the content below jumps up by
   that much. With a single 56px line, the fold moved the page across its own
   trigger and it oscillated: measured, setting scrollTop to 50 read back as
   106, to 54 as 12, to 60 as 0. Both thresholds are now clear of the fold —
   fold above 150, unfold below 40 — so crossing one can never put the page on
   the far side of the other. */
const MOB_FOLD_ON = 150, MOB_FOLD_OFF = 40;
let mobY = 0, mobCond = false, mobTick = 0;
/* Which element scrolls is not a property of the device. Here the phone is a
   mock handset with an overflow of its own; on the site it is the section
   itself, full height, and .phone does not scroll at all. Asking for .phone by
   name there reads a scrollTop that is permanently 0 — so the header never
   folds, the place in the shelf is never remembered, and the back-to-the-top
   arrow never appears, all three silently and only once the section is in the
   page. The element is chosen by what it DOES instead. */
function phoneScroller(){
  const ph = STAGE.querySelector(".phone");
  const cands = [ph, document.getElementById("royaLibrary"), document.scrollingElement];
  for (const el of cands) if (el && el.scrollHeight > el.clientHeight + 4) return el;
  return document.scrollingElement || ph;
}
function mobRead(){
  mobTick = 0;
  const root = document.documentElement;
  if (dev !== "phone"){ root.removeAttribute("data-mcond"); mobCond = false; return; }
  const ph = phoneScroller();
  if (!ph) return;
  const y = ph.scrollTop;
  if (sheetN == null && zoomN == null) mobY = y;
  const next = mobCond ? y > MOB_FOLD_OFF : y > MOB_FOLD_ON;
  /* writing the attribute unchanged still costs a style recalculation on every
     scroll event, so the write only happens on a real change — or when the
     attribute is missing, which is the state after a switch back from desktop */
  if (next !== mobCond || !root.hasAttribute("data-mcond")){
    mobCond = next;
    root.setAttribute("data-mcond", next ? "1" : "0");
  }
}
/* one read per frame: scroll fires far faster than the screen refreshes, and
   reading scrollTop inside the event forces layout each time */
function mobScroll(){ if (!mobTick) mobTick = requestAnimationFrame(mobRead); }
/* scroll does not bubble, so this is captured rather than listened for on the
   frame — the frame is rebuilt on every draw and a bound listener would go
   with it. Passive, so the listener can never hold up the scroll itself. */
document.addEventListener("scroll", mobScroll, {capture:true, passive:true});
window.addEventListener("resize", mobScroll, {passive:true});

function draw(){
  /* THEME OFF — pinned to dark. The light rules in roya-library.css are
     guarded on data-lt="light-off" and nothing writes that, but this is what
     actually makes the page dark, so it is pinned rather than left to a flag
     a reader's browser may still be holding at true from before.
     document.documentElement.setAttribute("data-lt", light ? "light" : "dark"); */
  document.documentElement.setAttribute("data-lt", "dark");
  const mover = (sheetN != null || zoomN != null || listenN != null);
  const html = dev==="phone"
    ? `<div class="phone-shell">
         <div class="phone${mover ? " is-locked" : ""}">${mobile()}</div>
         <div class="phone-over">${listenPanel()}${zoomOverlay()}${readerPanel()}${mobSheet()}</div>
       </div>`
    : deskPage();
  STAGE.innerHTML = html;
  syncTop();
  document.querySelectorAll("[data-view]").forEach(b=>b.setAttribute("aria-pressed", String(b.dataset.view===view)));
  const sl = STAGE.querySelector(".side-list");
  if (sl) sl.setAttribute("data-more", sl.scrollHeight > sl.clientHeight + 1 ? "1" : "0");
  if (searchHot){
    const f = document.getElementById("libSearch");
    if (f){ f.focus(); try{ f.setSelectionRange(caret, caret); }catch(e){} }
    searchHot = false;
  }
  const strip = document.querySelector('.zoom-strip [aria-current="true"]');
  if (strip && strip.scrollIntoView) strip.scrollIntoView({block:"nearest", inline:"center"});
  /* Bringing the selected card into view is right when the SELECTION moved —
     stepping to the next book, jumping in from About. It is wrong on every
     other redraw: changing the sort redrew the grid and then scrolled to
     wherever the selected book had landed in the new order, which for a
     shelf sorted newest-first means the far bottom. Only a real change of
     book scrolls now. */
  const on = (query.trim() || cur === scrolledTo) ? null
           : STAGE.querySelector('.bcard[aria-current="true"]');
  if (on && on.scrollIntoView && dev !== "phone") {
    on.scrollIntoView({block:"nearest", inline:"center"});
  }
  scrolledTo = cur;
  if (dev === "phone"){
    const ph = phoneScroller();
    if (ph) ph.scrollTop = mobY;
  }
  mobScroll();
  try{ localStorage.setItem("royaLibrary1", JSON.stringify({view,cur,light,soundOn})); }catch(e){}
}
function select(n){ cur=n; shelf=shelfOf(n); draw(); }
function step(d){
  const i = BOOKS.findIndex(x=>x.n===cur);
  select(BOOKS[Math.min(BOOKS.length-1, Math.max(0, i+d))].n);
}
document.addEventListener("click", e=>{
  /* THEME OFF — nothing on the page carries data-themeswap any more.
     const lt=e.target.closest("[data-themeswap]"); if(lt){ light=!light; draw(); return; } */
  const sd=e.target.closest("[data-soundswap]"); if(sd){ if(!syncSound()){ soundOn=!soundOn; draw(); } return; }
  const cl=e.target.closest("[data-clear]");if(cl){ query=""; searchHot=true; caret=0; mobY=0; draw(); return; }
  const hm=e.target.closest("[data-home]"); if(hm){ view="about"; mobY=0; pickOpen=false; sortOpen=false; draw(); return; }
  /* deskY as well as mobY. Switching section kept the desktop scroll, so
     leaving a Library scrolled a thousand pixels down and pressing About
     landed on the middle of About. It was always wrong; the Listening Room
     only made it easy to see, being long and the place a reader arrives at
     from a scrolled shelf. A new section starts at its top. */
  const v=e.target.closest("[data-view]");  if(v){
    view=v.dataset.view; mobY=0; deskY=0; pickOpen=false; draw();
    /* and actually move: restoreY() only runs when a record closes, so
       nothing re-applied deskY on a re-render and the container simply kept
       its old offset. Leaving a Library scrolled a thousand pixels down and
       pressing About landed on the middle of About. It was always wrong; the
       Listening Room only made it easy to see, being long and the place a
       reader arrives at from a scrolled shelf. */
    const sc = scroller(); if(sc) sc.scrollTop = 0;
    return; }
  const dk=e.target.closest("[data-desk]"); if(dk){ view=dk.dataset.desk==="series"?"about":dk.dataset.desk; draw(); return; }
  const md=e.target.closest("[data-mode]"); if(md){ mode=md.dataset.mode; draw(); return; }
  const sp=e.target.closest("[data-sortpick]"); if(sp){ sortBy=sp.dataset.sortpick; sortOpen=false; draw(); return; }
  const so=e.target.closest("[data-sort]"); if(so){ sortOpen=!sortOpen; pickOpen=false; draw(); return; }
  const pk=e.target.closest("[data-pick]");  if(pk){ pickOpen=!pickOpen; sortOpen=false; draw(); return; }
  /* Picking a series is a request to SEE that series. The rail is locked
     open beside About and Author's Notes, so choosing one there used to set
     the filter and leave the reader on the page they were already reading,
     with nothing on screen having changed — the list looked broken. It now
     carries them into the Library the way a series title in About does, and
     hands them the top of the new result set rather than their old scroll
     position in a shelf that no longer has the same rows in it. */
  /* The Listening Room's order. Its own state, not the Library's sortBy:
     one orders books by number or date, the other orders recordings by how
     long they run, and a reader who set one should not find the other moved. */
  const lso=e.target.closest("[data-lsort]"); if(lso){ lsort=lso.dataset.lsort; draw(); return; }

  const fl=e.target.closest("[data-filter]");if(fl){
    const jump = view !== "library";
    filter=fl.dataset.filter; view="library"; pickOpen=false; mobY=0;
    if(jump) deskY=0;
    draw();
    if(jump) scroller().scrollTop=0;
    return; }
  /* a series title in About opens the Library on that series — the only place
     a series, as opposed to a book, can actually take you */
  /* Opening a row is not navigation — it happens in place, and the row that
     was open closes. Tested before [data-series] and [data-rec] because the
     header button sits inside the same list as both. */
  const sx=e.target.closest("[data-serex]"); if(sx){
    serOpen = serOpen === sx.dataset.serex ? null : sx.dataset.serex;
    draw(); return; }
  const sr=e.target.closest("[data-series]"); if(sr){
    filter=sr.dataset.series; view="library"; query=""; mobY=0; deskY=0; pickOpen=false;
    draw(); scroller().scrollTop=0; return; }
  /* ── the reader sits over everything, so it is tested first ── */
  const rdx=e.target.closest("[data-readclose]"); if(rdx){ readN=null; draw(); return; }
  /* the control lives inside a card that carries data-rec or data-sheet, so it
     has to be read before them — the same trap the enlarge control had */
  const rd=e.target.closest("[data-read]"); if(rd){ openRead(+rd.dataset.read); return; }
  /* Listen asks first — see listenPanel(). The download is a real link and is
     read before data-stop so the browser keeps it; the panel closes a beat
     later, once the file has been handed over. */
  const ldl=e.target.closest("[data-listendl]"); if(ldl){
    setTimeout(()=>{ if(listenN!=null){ listenN=null; draw(); } }, 600); return; }
  const lpl=e.target.closest("[data-listenplay]"); if(lpl){
    const n=+lpl.dataset.listenplay; listenN=null; draw(); openRead(n, true); return; }
  const lcx=e.target.closest("[data-listenclose]"); if(lcx){ listenN=null; draw(); return; }
  const lbk=e.target.closest("[data-listenback]");
  if(lbk && !e.target.closest(".lsn-box")){ listenN=null; draw(); return; }
  const ls=e.target.closest("[data-listen]"); if(ls){ listenN=+ls.dataset.listen; draw(); return; }
  /* the PDF is a real link: let the browser have it, but stop the card under
     it from opening the record at the same time */
  const pd=e.target.closest("[data-stop]"); if(pd){ e.stopPropagation(); return; }
  const sh3=e.target.closest("[data-share]"); if(sh3){
    const b=byNum[+sh3.dataset.share];
    if(b) shareBook(b, sh3);
    return;
  }
  /* ── the enlarged view owns every click while it is open ── */
  const zc=e.target.closest("[data-zoomclose]"); if(zc){ zoomN=null; draw(); return; }
  const zs=e.target.closest("[data-zoomstep]"); if(zs){
    const rows=libraryRows(); const i=rows.findIndex(x=>x.n===zoomN);
    if(i>-1 && rows.length){ zoomN = rows[(i + +zs.dataset.zoomstep + rows.length) % rows.length].n; draw(); }
    return;
  }
  /* anywhere that is not the picture, its caption or a control closes it.
     matches() alone only caught a click on the backdrop element itself, and
     the scrolling layer covers the whole frame, so nothing ever reached it. */
  if(zoomN!=null){
    /* a cover on the shelf switches to that book. This has to be read here,
       inside the branch that says the enlarged view owns every click — the
       general data-zoom handler sits below it and never ran, so tapping a
       thumbnail fell through to "not the picture" and closed the view. */
    const t=e.target.closest(".zoom-strip [data-zoom]");
    if(t){ zoomN=+t.dataset.zoom; draw(); return; }
    /* the picture itself, not its box: the plate spans the full width, so the
       dark margin either side of a narrow cover belongs to "off the picture" */
    if(!e.target.closest(".zoom-plate img,.zoom-cap,.zoom-nav,.zoom-x,.zoom-strip")){ zoomN=null; draw(); }
    return;
  }
  const rx=e.target.closest("[data-recclose]"); if(rx){ recN=null; draw();
    restoreY(); return; }
  /* the enlarge control sits INSIDE a card that carries data-sheet (phone) or
     data-rec (desktop), so it has to be tested before them — closest() would
     otherwise find the card and open the record instead of the picture */
  const zm=e.target.closest("[data-zoom]"); if(zm){ zoomN=+zm.dataset.zoom; draw(); return; }
  const rc=e.target.closest("[data-rec]"); if(rc && zoomN==null){
    const n=+rc.dataset.rec;
    if(dev==="phone"){ sheetN=n; select(n); return; }
    if(recN==null) deskY = scroller().scrollTop;
    recN=n; select(n); return; }
  if(recN!=null && e.target.matches("[data-recground]")){ recN=null; draw();
    restoreY(); return; }
  const sc=e.target.closest("[data-sheetclose]"); if(sc){ sheetN=null; draw(); return; }
  const sh2=e.target.closest("[data-sheet]"); if(sh2 && zoomN==null){ sheetN=+sh2.dataset.sheet; select(+sh2.dataset.sheet); return; }
  const g=e.target.closest("[data-go]");    if(g){ select(+g.dataset.go); return; }
  const s=e.target.closest("[data-step]");  if(s){ step(+s.dataset.step); return; }
  const c=e.target.closest("[data-chip]");  if(c){ chip=c.dataset.chip; page=0; draw(); return; }
  const p=e.target.closest("[data-page]");  if(p){ page=Math.max(0,page+ +p.dataset.page); draw(); return; }
  const r=e.target.closest("[data-random]");if(r){ select(BOOKS[Math.floor(Math.random()*BOOKS.length)].n); return; }
  const sh=e.target.closest("[data-shelf]");if(sh){ shelf=Math.min(GROUPS.length-1, Math.max(0, shelf + +sh.dataset.shelf)); draw(); return; }
  if(pickOpen || sortOpen){ pickOpen=false; sortOpen=false; draw(); }
});
document.addEventListener("input", e=>{
  const f = e.target.closest("#libSearch");
  if(!f) return;
  /* Same reasoning as the series list: the search box sits in the rail at
     every view, and a reader typing into it is asking to be shown titles.
     Results only exist in the Library, so the first character taken while
     About or the Notes is up moves them there. The field itself survives the
     switch, though not by being left alone — see below.
     Clearing the box does not send them back; they stay in the Library.

     draw() rewrites the whole stage, rail included, so #libSearch is
     destroyed and rebuilt on every keystroke; searchHot/caret in draw() is
     the only thing putting the cursor back, and anything that removes that
     block breaks typing here, view switch or no view switch. */
  const jump = view !== "library" && f.value.trim() !== "";
  query = f.value; caret = f.selectionStart; searchHot = true; mobY = 0;
  if(jump){ view = "library"; deskY = 0; }
  draw();
  if(jump) scroller().scrollTop = 0;
});
document.addEventListener("keydown", e=>{
  if(e.target.tagName==="INPUT") return;
  if(zoomN != null){
    const rows=libraryRows(); const i=rows.findIndex(x=>x.n===zoomN);
    if(e.key==="Escape"){ zoomN=null; draw(); return; }
    if((e.key==="ArrowLeft"||e.key==="ArrowRight") && i>-1){
      zoomN = rows[(i + (e.key==="ArrowRight"?1:-1) + rows.length) % rows.length].n; draw(); return;
    }
    return;
  }
  if(listenN!=null && e.key==="Escape"){ listenN=null; draw(); return; }
  if((pickOpen || sortOpen) && e.key==="Escape"){ pickOpen=false; sortOpen=false; draw(); return; }
  if(readN!=null && e.key==="Escape"){ readN=null; draw(); return; }
  if(recN!=null && e.key==="Escape"){ recN=null; draw();
    restoreY(); return; }
  if(sheetN!=null && e.key==="Escape"){ sheetN=null; draw(); return; }
  if(e.key==="ArrowLeft") step(-1);
  if(e.key==="ArrowRight") step(1);
});
try{
  const s=JSON.parse(localStorage.getItem("royaLibrary1")||"null");
  /* THEME OFF — light is no longer read back. A reader who chose the light
     theme before this change still has light:true in their localStorage; left
     alone it would have stranded them on paper with no button to get off it.
     The flag is still written on every draw, but always as false now, so that
     old choice is overwritten rather than kept — which is the right way round:
     whoever brings the theme back should not have a handful of readers landing
     on paper on their first visit after it.
     …; light=!!s.light; … */
  if(s && byNum[s.cur]){ view=s.view||view; cur=s.cur; soundOn=!!s.soundOn; shelf=shelfOf(cur); }
}catch(e){}

  /* ══════════════ mounting, and the way in and out ══════════════ */

  /* The section scrolls inside itself, not down the page: it is an overlay
     over a page that is still there underneath. `deskY` and the two
     window.scrollTo calls in the body above therefore read and write THIS
     element rather than the window. */
  /* ── stage 4 ──
     When the section is the site's front door it opens on load, it has no way
     out, and the page behind it is scenery no reader should ever be dropped
     onto. index.html sets this before this file runs. */
  const HOME = !!window.ROYA_LIBRARY_HOME;

  /* the page's own reader is an overlay at z-index 70, above this section at
     60 — so it opens OVER the Library rather than instead of it, and when it
     closes the Library is still there. */
  const pageReader = document.getElementById("reader");
  const readerUp = function () { return !!pageReader && !pageReader.hidden; };

  function scroller() {
    /* phoneScroller() picks the element that actually scrolls rather than the
       one named after the device — on the page the phone frame is full height
       and never scrolls, so naming it here left the arrow watching a scrollTop
       that is always 0. */
    return dev === "phone" ? phoneScroller() : ROOT;
  }

  let libOpen = false;

  function openLibrary() {
    if (libOpen) return;
    libOpen = true;
    ROOT.hidden = false;
    document.body.classList.add("rl-on");
    dev = PHONE.matches ? "phone" : "desk";
    draw();
    requestAnimationFrame(function () { ROOT.classList.add("rl-show"); });
    syncTop();
  }

  function closeLibrary(force) {
    /* Nothing behind it to go back to. Escape and the close button both end
       up here, and in this mode both are meant to do nothing; READ STORY
       passes `force` on the one path that genuinely needs the section out of
       the way. */
    if (HOME && !force) return;
    if (!libOpen) return;
    libOpen = false;
    recN = null; sheetN = null; zoomN = null; readN = null; listenN = null; pickOpen = false;
    ROOT.classList.remove("rl-show");
    document.body.classList.remove("rl-on");
    setTimeout(function () { if (!libOpen) ROOT.hidden = true; }, 260);
    if (toTop) { toTop.classList.remove("show"); toTop.hidden = true; }
  }

  /* A window that crosses the phone line while the section is open gets the
     other layout, rather than a desktop rail squeezed into 380px. */
  const onWidth = function () {
    const want = PHONE.matches ? "phone" : "desk";
    if (want !== dev) { dev = want; if (libOpen) draw(); }
  };
  if (PHONE.addEventListener) PHONE.addEventListener("change", onWidth);
  else if (PHONE.addListener) PHONE.addListener(onWidth);

  /* ── back to the top ──
     The site's own button, its own icon, its own CSS — only what it watches
     changes. script.js shows it past 700px of window.scrollY; the section
     scrolls its own container, so window.scrollY never moves and the button
     would never appear. It is driven from the section's scroller instead, on
     the same threshold, and sent home the same way. `body.rl-on` is a
     different class from `gallery-on` precisely so the site's
     `body.gallery-on .to-top{display:none}` does not hide it. */
  const toTop = document.getElementById("toTop");
  const TOP_AT = 700;
  let topTicking = false;

  function syncTop() {
    topTicking = false;
    if (!toTop || !libOpen) return;
    /* nothing floats over an open record, cover or reader — including the
       page's own reader, which at the front door opens on top of the section
       rather than in place of it. The site's arrow is lifted to z-index 71
       while the section is open, which is above the reader's 70. */
    const busy = (recN != null || sheetN != null || zoomN != null || readN != null || listenN != null || readerUp());
    /* the way out of the section goes with it: an open record has a CLOSE of
       its own, and two close buttons on one screen is one too many */
    ROOT.classList.toggle("rl-busy", busy);
    const far = !busy && scroller().scrollTop > TOP_AT;
    if (far === !toTop.hidden) return;
    if (far) {
      toTop.hidden = false;
      requestAnimationFrame(function () { toTop.classList.add("show"); });
    } else {
      toTop.classList.remove("show");
      setTimeout(function () {
        if (!libOpen || scroller().scrollTop <= TOP_AT) toTop.hidden = true;
      }, 300);
    }
  }

  /* captured, because scroll does not bubble and the frame is rebuilt on
     every draw — a listener bound to it would be thrown away mid-scroll */
  document.addEventListener("scroll", function () {
    if (!libOpen || topTicking) return;
    topTicking = true;
    requestAnimationFrame(syncTop);
  }, { capture: true, passive: true });

  if (toTop) {
    toTop.addEventListener("click", function (e) {
      if (!libOpen) return;                 /* the site's own handler has it */
      e.stopImmediatePropagation();
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      scroller().scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
    }, true);
  }

  /* ── a cover that is not there yet ──
     The section shows the flat front from library/covers/NN.webp and the 3D
     pair from covers/pairs/NN.webp. A book published without one of those would
     show a broken image in the grid, on the card, in the record and in the
     enlarged view — four places, all silent until someone looks. The site's own
     art loader walks a chain of candidates for exactly this reason; this does
     the same for the section, in one captured listener, because `error` does
     not bubble and the frame is rebuilt on every draw. */
  const COVER_FALLBACK = [
    [/library\/covers\/(\d{2,3})\.webp/, "covers/$1.jpg"],
    /* the pair is WebP now; the JPEG stays reachable as the first fallback
       while the old files are still on the server, and the flat front is the
       last resort after that */
    [/covers\/pairs\/(\d{2,3})\.webp/,   "covers/pairs/$1.jpg"],
    [/covers\/pairs\/(\d{2,3})\.jpg/,    "library/covers/$1.webp"],
    [/library\/art\/start-(\d{2,3})\.webp/, "assets/start-$1.webp"]
  ];
  ROOT.addEventListener("error", function (e) {
    const img = e.target;
    if (!img || img.tagName !== "IMG" || img.dataset.rlTried) return;
    for (const [pat, to] of COVER_FALLBACK) {
      if (pat.test(img.getAttribute("src") || "")) {
        img.dataset.rlTried = "1";
        img.src = img.getAttribute("src").replace(pat, to);
        return;
      }
    }
  }, true);

  /* ── the reader ──
     script.js keeps openReader() private inside its own closure — there is no
     window.royaOpenReader and there never was, so every READ STORY in the
     section quietly fell through to the PDF. What IS reachable is the button
     the shelf builds for each book, which calls openReader itself: one per
     book, labelled "<Title> — read here". The section presses that.

     Matched on the label rather than a data attribute because the shelf's read
     button carries no number of its own, and the label is script.js's own
     construction. If the shelf is ever rebuilt without it, the PDF remains the
     fallback rather than nothing happening. */
  function readButtonFor(s) {
    const want = s.title + " \u2014 read here";
    const all = document.querySelectorAll("button.icon-btn.read[aria-label]");
    for (const b of all) if (b.getAttribute("aria-label") === want) return b;
    return null;
  }

  /* Listen opens the reader and then presses its own play control.

     Same reasoning as readButtonFor above: script.js keeps the reader
     private, so the way in is the control it built. The play control only
     exists once setupAudio() has found a sync file and shown the bar, and
     that happens after read/NN.json and read/NN.sync.json have both come
     back — so this waits for the bar rather than assuming it is there.

     A book with audio: but no sync file is the canon's plain-download case
     (see ADDING-AUDIO.md). The bar never appears, the wait times out, and
     the reader is simply open at the text, which is the right outcome. */
  function startPlayback() {
    const began = Date.now();
    (function wait() {
      const bar = document.getElementById("readerAudioBar");
      const play = document.getElementById("readerPlay");
      if (bar && play && !bar.hidden) { play.click(); return; }
      if (Date.now() - began < 6000) setTimeout(wait, 120);
    })();
  }

  function openRead(n, play) {
    const s = STORIES.filter(function (x) { return x.num === n; })[0];
    if (!s) return;
    const btn = readButtonFor(s);
    if (btn) {
      if (play) startPlayback();
      if (HOME) {
        /* the reader opens above, so the section stays exactly where it is —
           same scroll position, same filter — and is simply there again when
           the book is closed. */
        btn.click();
        syncTop();
        watchReader();
        return;
      }
      /* the section stands down first: the reader is the site's own overlay
         and should not open behind this one */
      closeLibrary(true);
      btn.click();
      return;
    }
    window.open(pdfHref({ n: n }), "_blank", "noopener");
  }

  /* The reader is the page's, so it is not going to tell this section when it
     shuts. Watched by the one attribute the page actually toggles. */
  let readerWatch = null;
  function watchReader() {
    if (!pageReader || readerWatch) return;
    readerWatch = new MutationObserver(function () {
      if (readerUp()) return;
      readerWatch.disconnect(); readerWatch = null;
      syncTop();
    });
    readerWatch.observe(pageReader, { attributes: true, attributeFilter: ["hidden"] });
  }

  /* ── the way in ──
     Stage 2: only with ?library=1, so the section can be walked on the live
     site without anyone finding it. Stage 3: the nav button opens it and the
     old All Covers overlay is left unreachable for one publish. */
  const FLAG = /[?&]library=1\b/.test(location.search);
  const navBtn = document.getElementById("galleryOpen");
  if (HOME) ROOT.classList.add("rl-home");

  if (navBtn && (FLAG || window.ROYA_LIBRARY_LIVE)) {
    navBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      openLibrary();
    }, true);
  }

  /* Captured, and that is the whole point of it. The section's own Escape
     handler was bound first, so in the bubble phase this one runs AFTER it —
     by which time the record has already been cleared, nothing looks open, and
     one Escape shuts the entire section instead of the card the reader was
     looking at. Taken in the capture phase it sees the state as the reader
     left it, steps aside while anything is open, and closes the section only
     when Escape had nothing else to close. */
  document.addEventListener("keydown", function (e) {
    if (!libOpen || e.key !== "Escape") return;
    if (recN != null || sheetN != null || zoomN != null || readN != null || listenN != null || pickOpen) return;
    closeLibrary();
  }, true);

  ROOT.addEventListener("click", function (e) {
    if (e.target.closest("[data-rlclose]")) closeLibrary();
  });

  /* ── the ambient track ──
     The page owns it. #soundToggle holds the state, drives #ambient, sets the
     level, paints its own icon and waits for a gesture; the section's speaker
     is the same switch seen from inside, not a second one.

     So the section does not keep its own answer. Pressing its speaker presses
     the page's button and stops there; the observer below reads the page back
     and redraws. Flipping soundOn here as well left the two exactly one press
     out of phase, because the section's own click handler sits on the document
     and runs on the other side of this one. */
  const pageSound = document.getElementById("soundToggle");
  const soundIsOn = function () {
    return !!pageSound && pageSound.getAttribute("aria-pressed") === "true";
  };

  /* called from the section's own handler, in the reader's gesture, which is
     what lets the browser start playback at all */
  function syncSound() {
    if (!pageSound || pageSound.hidden) return false;
    pageSound.click();
    return true;
  }

  if (pageSound) {
    new MutationObserver(function () {
      const on = soundIsOn();
      if (on === soundOn) return;
      soundOn = on;
      if (libOpen) draw();
    }).observe(pageSound, { attributes: true, attributeFilter: ["aria-pressed"] });
    soundOn = soundIsOn();
  }

  /* ── arriving from a shared link ──
     Every share/NN-slug.html redirects to the site with #NN-slug on the end,
     and script.js answers that hash by unfolding the book's entry on the
     shelf. That was right when the shelf was the page. Since stage 4 this
     section is the front door and stands over the shelf, so the reader
     following a shared link landed at the top of the Library with nothing to
     say which book had been shared — the link "just takes them to the
     website", which is exactly what it looked like.

     The record is the card the link is a link to, so the record is what
     opens. The slug is matched with slugFor(), the same function that builds
     the address the SHARE control hands out, so the two cannot drift apart;
     the number in front of it is a fallback for a hand-typed or truncated
     hash.

     Nothing here writes to the hash. script.js owns it, and it already drops
     it on a reload that did not come from a share page, so a reader who
     closes the card and reloads gets the Library rather than the card again. */
  function bookFromHash() {
    const slug = decodeURIComponent(String(location.hash).replace(/^#/, ""));
    if (!slug) return null;
    let b = BOOKS.filter(function (x) { return slugFor(x) === slug; })[0];
    if (!b) {
      const m = /^0*(\d+)(?:-|$)/.exec(slug);
      if (m) b = byNum[+m[1]];
    }
    return b || null;
  }

  function openShared() {
    const b = bookFromHash();
    if (!b) return false;
    /* the section remembers the view a reader left it on; a shared book is a
       book, so it opens in the Library rather than over About or the Notes */
    view = "library";
    zoomN = null; readN = null; listenN = null; pickOpen = false;
    if (dev === "phone") { sheetN = b.n; recN = null; }
    else { recN = b.n; sheetN = null; deskY = 0; }
    select(b.n);
    return true;
  }

  /* A reload is not an arrival. The hash stays in the address bar after a
     book has been opened from a shared link, and script.js only strips it
     when it can tell the visit was a reload — which it decides from
     document.referrer, and a reload KEEPS the referrer of the visit before
     it. So a reader who opened a book and then pulled to refresh got that
     book's record again, every single time, with no way back to the Library
     but the close button. The navigation entry says plainly which kind of
     visit this is; a reload opens the Library and leaves the record shut. */
  function arrivedByReload() {
    try {
      const nav = performance.getEntriesByType &&
                  performance.getEntriesByType("navigation")[0];
      if (nav && nav.type) return nav.type === "reload";
      return !!(performance.navigation && performance.navigation.type === 1);
    } catch (e) { return false; }
  }

  window.royaLibrary = { open: openLibrary, close: closeLibrary };
  if (FLAG || HOME) openLibrary();
  if (libOpen && !arrivedByReload()) openShared();
  window.addEventListener("hashchange", function () {
    if (!libOpen) return;
    if (!openShared() && (recN != null || sheetN != null)) {
      recN = null; sheetN = null; draw(); restoreY();
    }
  });
})();
