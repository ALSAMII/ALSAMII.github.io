/* Roya Library — the section that replaces All Covers.
   Version 39 · last updated 2026-09-18 05:26 PDT
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
        syn: s.synopsis || "", notes: s.notes || []
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
/* the second render: front-and-spine beside the back cover, one landscape
   image. Same numbering as the covers themselves. */
const pair = n => basePath() + "covers/pairs/" + pad2(n) + ".jpg";
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
const SERLINE = g => {
  const first = ((g.syn||"").split("\n\n")[0] || "").trim();
  if(!first) return "Books that stand together.";
  const sentence = first.split(/(?<=\.)\s/)[0];
  const colon = sentence.indexOf(":");
  if(colon > 0 && sentence.length > 74) return sentence.slice(0, colon) + ".";
  return sentence;
};

/* series groups, in catalogue order, standalones last */
const GROUPS = (()=>{
  const g = SERIES.map(s=>({name:s.title.split(" · ")[0], books:s.books.slice().sort((a,b)=>a-b), syn:s.syn}));
  const held = new Set(g.flatMap(x=>x.books));
  const solo = BOOKS.filter(b=>!held.has(b.n)).map(b=>b.n);
  g.sort((a,b)=>a.books[0]-b.books[0]);
  if (solo.length) g.push({name:"Standalone", books:solo, syn:""});
  return g;
})();
const shelfOf = n => Math.max(0, GROUPS.findIndex(g=>g.books.includes(n)));

let dev = PHONE.matches ? "phone" : "desk", view="library", cur=94, shelf=shelfOf(94);
let filter="all", query="", mode="grid", sortDesc=true, zoomN=null, readN=null;
let light=false, soundOn=false, searchHot=false, caret=0, sheetN=null, pickOpen=false, recN=null;
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
  close:'<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4"/></svg>'
};
const RANGES = [[1,25],[26,50],[51,75],[76,94]];

function sidebar(){
  const light = document.documentElement.getAttribute('data-lt') === 'light';
  const sound = soundOn;
  const names = GROUPS.filter(g=>g.name!=="Standalone").map(g=>g.name);
  return `
  <aside class="side"><div class="side-in">
    <span class="side-emblem" role="img" aria-label="Roya Publication · Fiction"></span>
    <p class="side-who">Chew&#8239;Z</p>
    <p class="side-count"><b>${BOOKS.length}</b>${BOOKS.length===1 ? "Story" : "Stories"}</p>
    <hr>
    <span class="side-lab">Browse by series</span>
    <div class="side-list">
      <button type="button" data-filter="all" aria-pressed="${filter==='all'}">All stories</button>
      <button class="solo" type="button" data-filter="Standalone" aria-pressed="${filter==='Standalone'}">Stand alone</button>
      ${names.map(n=>`<button type="button" data-filter="${esc(n)}" aria-pressed="${filter===n}" title="${esc(n)}">${esc(railName(n))}</button>`).join("")}
    </div>
    <hr>
    <span class="side-lab">Search titles</span>
    <span class="side-search">
      <input id="libSearch" type="search" placeholder="Search titles…" value="${esc(query)}"
             autocomplete="off" spellcheck="false">
      ${query ? `<button class="side-clear" type="button" data-clear="1" aria-label="Clear search">✕</button>` : DICON.search}
    </span>
    <hr class="side-foot-rule">
    <div class="side-set">
      <button class="side-tog side-sound" type="button" data-soundswap="1" aria-pressed="${sound}"
              title="${sound ? 'Silence the ambient sound' : 'Ambient sound'}">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
          ${sound
            ? `<path class="rl-bar-em" d="M5.2 9.6v4.8M18.8 9.6v4.8"/>
               <path class="rl-bar-pa" d="M8.6 6.5v11M15.4 6.5v11"/>
               <path class="rl-bar-em" d="M12 3v18"/>`
            : `<path class="rl-bar-pa" d="M8.6 6.5v11M15.4 6.5v11"/>`}
        </svg>
        <span>Sound</span>
      </button>
      <button class="side-tog" type="button" data-themeswap="1" aria-pressed="${light}"
              title="${light ? 'Switch to the dark theme' : 'Switch to the light theme'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="8.6"/>
          <path d="M12 3.4a8.6 8.6 0 0 ${light ? '1' : '0'} 0 17.2z" fill="currentColor" stroke="none"/>
        </svg>
        <span>Theme</span>
      </button>
    </div>
    <p class="side-rights">All stories &copy; Chew&#8239;Z.<br>All rights reserved.</p>
  </div></aside>`;
}

/* A search shows every title that CONTAINS what is typed — "be" finds
   Bright Mercy and The Riverbed alike — and it looks across the whole
   catalogue rather than inside whichever series happens to be open, so a
   search never comes back empty because of a filter the reader forgot. */
function libraryRows(){
  const q = query.trim().toLowerCase();
  return BOOKS.filter(b=>{
    if (q) return (b.t+" "+sName(b)+" "+pad(b.n)+" "+b.n).toLowerCase().includes(q);
    if (filter === "all") return true;
    return sName(b) === filter;
  }).sort((a,b)=> sortDesc ? b.n-a.n : a.n-b.n);
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
            <span class="bcard-read" role="button" tabindex="0" data-read="${b.n}">Read story ${DICON.arrow}</span>
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
      <div class="main-bar">
        <span class="t">${esc(columnHead())} / ${rows.length}</span>
        <span class="rl-rule"></span>
        <button class="sortbox" type="button" data-sort="1">Sort: ${sortDesc ? "Newest" : "Number"} ${DICON.caret}</button>
        <span class="sep"></span>
        <span class="viewtog">
          <button type="button" data-mode="grid" aria-pressed="${mode==='grid'}" aria-label="Grid">${DICON.grid}</button>
          <button type="button" data-mode="list" aria-pressed="${mode==='list'}" aria-label="List">${DICON.list}</button>
        </span>
      </div>

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
                <span class="bcard-read" role="button" tabindex="0" data-read="${b.n}">Read story ${DICON.arrow}</span>
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
const RECOMMENDED = [6,7,78,8,50,26,35,52,55];
const SECTIONS = [
  {k:"about",   t:"About",            d:"The series and its world"},
  {k:"library", t:"Roya Library",     d:"Explore every cover"},
  {k:"notes",   t:"Author\u2019s Notes", d:"The thoughts behind the stories"}
];
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
    ${zoomOverlay()}
    ${readerPanel()}
    ${recordPanel()}
    ${sidebar()}
    <div class="main">
      ${deskNav()}
      ${view==="library" ? deskLibraryBody() : `<div class="abt">${view==="notes" ? notesBody() : aboutBody()}</div>`}
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
      <button type="button" data-view="${x.k}" aria-current="${view===x.k}">${esc(x.t)}<span></span></button>`).join("")}
  </nav>`;
}

/* ── About and Author's Notes ──
   The words are the live page's own, not a paraphrase. About loses the
   ordered list of 94 — that is the Library now — and keeps everything else:
   the statement, the three terms, the recommended books and the series. */
const ABOUT = {
  lede: "For years I read other people\u2019s stories and lived in worlds someone else had already decided the shape of. Then a drug took the walls off one night and I made my own \u2014 planner, participant, whole production crew \u2014 and I have not been a guest since, so I finish them here.",
  note: "{n} short noir novellas about people who finally say it out loud. Every book works the same way \u2014 a door out of the mind, a room on the other side, and the key that opened it.",
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
const PICKNOTE = {"6": "A new drug lets a therapist walk down into a patient’s mind, to the riverbed where the original wound was carved. Then a patient arrives — someone three other clinics have already turned away — whose own mind has already named him before he speaks. Going that deep was never safe for the guide either; the water takes him too.", "7": "Consciousness turns out to have a kill switch, and Dr. Kelo finds it: silence the inner voice, and her subjects go calm, capable, and quietly unsure who’s actually in charge. That voice was never their own — it was standing guard for something that has waited seven hundred feet under a dead reservoir for centuries, and just opened its eyes.", "78": "In January 2026, she told him not to go. That evening the country’s phones and internet went dark, and the shooting started with nothing left to prove it happened. What’s left isn’t a death toll — there’s no agreed count, and every number serves whoever repeats it. Six months on, a young man keeps the record the state agreed to lose.", "8": "Every audience has a breaking point — eight to twelve seconds, on average — where it decides it has seen enough of a stranger’s ruin to stop listening. Mercy is built to interrupt exactly that reflex: a compound that makes a confession land in you as though it were your own. Eight strangers finally get a room that refuses to look away.", "50": "For centuries, practitioners sealed the body with mudras, holding sensation rather than spending it, and never wrote the final instruction down. A laboratory found what that practice had quietly been building in the body, cloned it, and shipped it anyway, missing the last line. Arousal becomes a residence, not an event, and within a generation men aren’t persecuted so much as simply no longer recognized.", "94": "When a government shuts off the internet, somebody has to do it. He is the engineer who does — and the job turns out to be not a wall but a list: hospitals, ambulances, banks, written in his own hand. Everyone left off it simply cannot reach anyone. Afterwards the calls that never connected begin arriving in his sleep.", "35": "Roya never spoke, never reached, never turned her head, and lived ten years and eleven months, growing heavier every one. Her mother's account of the therapy that hurt her daily to save her, and the sixth year, when the visitors had stopped and nobody had noticed. What eased was said out loud; what didn't, never was.", "52": "Surfers call it the samba: the shaking a body does after too long underwater. A rescue-ski driver has pulled four hundred and eleven people from the water — and believes speed is the only decent thing about him. He’s wrong. Then a wave bigger than any in the beach’s history arrives, and he finally learns what nine years of sixty-two-second rescues have actually been about.", "26": "Set on the Majnoon marshes, 1984, during the Iran–Iraq War, the title names two poisons: mustard gas, filling a field hospital with the blind and dying, and mang — Farsi for henbane, ancestor of atropine, the antidote to nerve agents. Sohrab, a nineteen-year-old orderly counting the ward's ampoules, finds soldiers injecting the antidote for its visions — reviving an old rite where a priest drank wine and mang, lay seven days as if dead, and returned from the other side to tell what he saw. His ledger becomes a doorway to the dead. By the 1988 ceasefire, the border is unmoved and a million are gone.", "55": "The rules are absolute: nobody may touch her, for any reason, for the whole crossing. They were the same rules ten years ago, when her son drowned an arm’s length away and no one was allowed to reach him. Now she’s back for the crossing she has left. Past the twentieth hour, something starts swimming beside her — and starts, gently, correcting her memory of that night."};
/* 94's three lines are kept below though its slot went to 26 — the panel
   copy written for a book exists nowhere else, and putting 94 back should not
   mean writing it again. Unused entries cost nothing; a lost paragraph does. */
const PICKFA = {"78": "خاموشی", "94": "رفت و برگشت"};
const PICKGLOSS = {"6": "his patient’s mind named him", "7": "the dreamer was not you", "78": "the dark was the method", "8": "pity, measured in seconds", "50": "the last instruction went unwritten", "94": "the calls return", "35": "she grew heavier, alone", "52": "a dance name for drowning", "55": "her son’s old place"};
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
  { dial:1, name:"Transgressive", books:[8,50,26] },
  { dial:2, name:"Plausible",     books:[35,52,55] }
];
/* The recommended-series panel, exactly as the live page configures it:
   an English name and a Persian one, the banner, every paragraph of the
   synopsis, a start-here book with its volume number, and the whole cycle. */
const SERIESFEAT = [
  { key:"From the Delgosh\u0101", en:"The Delgosh\u0101", fa:"\u062f\u0644\u06af\u0634\u0627",
    art:"assets/series-delgosha.webp", start:75,
    startFa:"\u0686\u0634\u0645\u200c\u0627\u0646\u062f\u0627\u0632 \u06f1\u06f4\u06f0\u06f4", vol:"Book Three",
    books:[68,70,75,77,79,82,87,91] },
  { key:"From the Unsaid", en:"The Unsaid", fa:"\u0646\u0627\u06af\u0641\u062a\u0647",
    art:"assets/series-unsaid.webp", start:89,
    startFa:"\u0633\u0647 \u063a\u0644\u0637\u060c \u06cc\u06a9 \u062f\u0631\u0633\u062a", vol:"Book Five",
    books:[78,80,83,86,89,92,94] },
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
const art = n => basePath() + (ART_OWN[n] ? "library/art/start-" : "assets/start-") + pad2(n) + ".webp";
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

function aboutBody(){
  return `
  <div class="ab-marg" aria-hidden="true">\u06cc\u06a9\u06cc \u0628\u0648\u062f<br>\u06cc\u06a9\u06cc \u0646\u0628\u0648\u062f<br>\u0648 \u0647\u06cc\u0686 \u0641\u0631\u0642\u06cc \u0646\u062f\u0627\u0634\u062a</div>
  <p class="ab-lede">${esc(ABOUT.lede)}</p>
  <p class="ab-note">${esc(ABOUT.note.replace("{n}", BOOKS.length))}</p>
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
            <span class="ab-time">${esc(b.rt)}</span>
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
    return `
    <section class="ab-feat">
      <div class="${f.over ? "ab-over" : ""}" ${f.over && f.art ? `style="--ab-art:url('${basePath()+f.art}')"` : ""}>
      <h3 class="ab-feat-t"><button type="button" data-series="${esc(f.key)}">${esc(f.en)}${f.fa ? ` <span lang="fa" dir="rtl">${esc(f.fa)}</span>` : ""}</button></h3>
      ${!f.over && f.art ? `<span class="ab-feat-art"><img src="${basePath()+f.art}" alt="" loading="lazy"></span>` : ""}
      <div class="ab-feat-copy${f.over ? " is-centred" : ""}">
        ${paras.map((x,i)=>`<p class="${i===paras.length-1 && /^Start anywhere/.test(x) ? "ab-feat-p ab-feat-note" : "ab-feat-p"}">${esc(x)}</p>`).join("")}
        ${f.ded ? `<p class="ab-ded" lang="fa" dir="rtl"><span class="ab-ded-to">${esc(f.ded[0])}${f.dedYears ? ` <span dir="ltr">${esc(f.dedYears)}</span>` : ""}</span><em>${esc(f.ded[1])}</em></p>` : ""}
      </div>
      </div>
      ${sb ? `
      <p class="ab-sh">Start the series here</p>
      <button class="ab-start" type="button" data-rec="${sb.n}">
        <span class="ab-start-cov"><img src="${cov(sb.n)}" alt="" loading="lazy"></span>
        <span class="ab-start-body">
          <span class="ab-start-head">
            <b>${sb.n}.</b>
            <span class="ab-start-en">${esc(sb.t)}</span>
            ${f.startFa ? `<span class="ab-start-fa" lang="fa" dir="rtl">${esc(f.startFa)}</span>` : ""}
            <i class="ab-start-vol">(${esc(f.vol || ("Book " + (VOLWORD[f.books.indexOf(f.start)] || "One")))})</i>
          </span>
          <span class="ab-start-note">${esc(sb.hook)}.</span>
          <span class="ab-start-time">${esc(sb.rt)}</span>
        </span>
      </button>` : ""}
      <p class="ab-sh">All ${f.books.length} books in the series</p>
      <div class="ab-cycle">
        ${f.books.map(n=>byNum[n] ? `
          <button type="button" data-rec="${n}" class="${n===f.start?"rl-is-current":""}">
            <span>${n}</span>${esc(byNum[n].t)}
          </button>` : "").join("")}
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
      <span class="bcard-read" role="button" tabindex="0" data-read="${b.n}">Read story ${DICON.arrow}</span>
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

function mobile(){
  const rows = libraryRows();
  const names = GROUPS.filter(g=>g.name!=="Standalone").map(g=>g.name);
  return `
  <div class="mob">
    <div class="mob-head">
    <header class="mob-bar">
      <span class="mob-lock">
        <span class="mob-mark">
          <span class="mob-word" role="img" aria-label="Roya Publication"></span>
          <span class="mob-ears" aria-hidden="true"></span>
        </span>
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
        <button class="side-tog" type="button" data-themeswap="1" aria-pressed="${light}"
                title="${light ? 'Switch to the dark theme' : 'Switch to the light theme'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="8.6"/>
            <path d="M12 3.4a8.6 8.6 0 0 ${light ? '1' : '0'} 0 17.2z" fill="currentColor" stroke="none"/>
          </svg>
          <span>Theme</span>
        </button>
        </span>
        <i class="mob-rights">All rights reserved &copy; Chew&#8239;Z</i>
      </span>
    </header>
    ${mobNav()}
    ${view!=="library" ? "" : `
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
          <button type="button" role="option" data-filter="all" aria-selected="${filter==='all'}">All series</button>
          <button type="button" role="option" data-filter="Standalone" aria-selected="${filter==='Standalone'}">Stand alone</button>
          ${names.map(n=>`<button type="button" role="option" data-filter="${esc(n)}" aria-selected="${filter===n}">${esc(railName(n))}</button>`).join("")}
        </div>` : ``}
      </span>
      <button class="sortbox" type="button" data-sort="1">Sort: ${sortDesc ? "Newest" : "Number"} ${DICON.caret}</button>
      <span class="sep"></span>
      <span class="viewtog">
        <button type="button" data-mode="grid" aria-pressed="${mode==='grid'}" aria-label="Cards">${DICON.grid}</button>
        <button type="button" data-mode="list" aria-pressed="${mode==='list'}" aria-label="Rows">${DICON.list}</button>
      </span>
    </div>
    `}
    </div>

    ${view!=="library" ? `<div class="mob-sec">${view==="notes" ? notesBody() : aboutBody()}</div>` : `
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
            <span class="mcard-read" role="button" tabindex="0" data-read="${b.n}">Read story ${DICON.arrow}</span>
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
  document.documentElement.setAttribute("data-lt", light ? "light" : "dark");
  const mover = (sheetN != null || zoomN != null);
  const html = dev==="phone"
    ? `<div class="phone-shell">
         <div class="phone${mover ? " is-locked" : ""}">${mobile()}</div>
         <div class="phone-over">${zoomOverlay()}${readerPanel()}${mobSheet()}</div>
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
  const lt=e.target.closest("[data-themeswap]"); if(lt){ light=!light; draw(); return; }
  const sd=e.target.closest("[data-soundswap]"); if(sd){ if(!syncSound()){ soundOn=!soundOn; draw(); } return; }
  const cl=e.target.closest("[data-clear]");if(cl){ query=""; searchHot=true; caret=0; mobY=0; draw(); return; }
  const v=e.target.closest("[data-view]");  if(v){ view=v.dataset.view; mobY=0; pickOpen=false; draw(); return; }
  const dk=e.target.closest("[data-desk]"); if(dk){ view=dk.dataset.desk==="series"?"about":dk.dataset.desk; draw(); return; }
  const md=e.target.closest("[data-mode]"); if(md){ mode=md.dataset.mode; draw(); return; }
  const so=e.target.closest("[data-sort]"); if(so){ sortDesc=!sortDesc; draw(); return; }
  const pk=e.target.closest("[data-pick]");  if(pk){ pickOpen=!pickOpen; draw(); return; }
  /* Picking a series is a request to SEE that series. The rail is locked
     open beside About and Author's Notes, so choosing one there used to set
     the filter and leave the reader on the page they were already reading,
     with nothing on screen having changed — the list looked broken. It now
     carries them into the Library the way a series title in About does, and
     hands them the top of the new result set rather than their old scroll
     position in a shelf that no longer has the same rows in it. */
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
  if(pickOpen){ pickOpen=false; draw(); }
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
  if(pickOpen && e.key==="Escape"){ pickOpen=false; draw(); return; }
  if(readN!=null && e.key==="Escape"){ readN=null; draw(); return; }
  if(recN!=null && e.key==="Escape"){ recN=null; draw();
    restoreY(); return; }
  if(sheetN!=null && e.key==="Escape"){ sheetN=null; draw(); return; }
  if(e.key==="ArrowLeft") step(-1);
  if(e.key==="ArrowRight") step(1);
});
try{
  const s=JSON.parse(localStorage.getItem("royaLibrary1")||"null");
  if(s && byNum[s.cur]){ view=s.view||view; cur=s.cur; light=!!s.light; soundOn=!!s.soundOn; shelf=shelfOf(cur); }
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
    recN = null; sheetN = null; zoomN = null; readN = null; pickOpen = false;
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
    const busy = (recN != null || sheetN != null || zoomN != null || readN != null || readerUp());
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
     pair from covers/pairs/NN.jpg. A book published without one of those would
     show a broken image in the grid, on the card, in the record and in the
     enlarged view — four places, all silent until someone looks. The site's own
     art loader walks a chain of candidates for exactly this reason; this does
     the same for the section, in one captured listener, because `error` does
     not bubble and the frame is rebuilt on every draw. */
  const COVER_FALLBACK = [
    [/library\/covers\/(\d{2})\.webp/, "covers/$1.jpg"],
    [/covers\/pairs\/(\d{2})\.jpg/,    "library/covers/$1.webp"],
    [/library\/art\/start-(\d{2})\.webp/, "assets/start-$1.webp"]
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

  function openRead(n) {
    const s = STORIES.filter(function (x) { return x.num === n; })[0];
    if (!s) return;
    const btn = readButtonFor(s);
    if (btn) {
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
    if (recN != null || sheetN != null || zoomN != null || readN != null || pickOpen) return;
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

  window.royaLibrary = { open: openLibrary, close: closeLibrary };
  if (FLAG || HOME) openLibrary();
})();
