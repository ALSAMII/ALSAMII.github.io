/* ══════════════════ THE LISTENING ROOM'S SERIES FILTER ══════════════════
   Version 1 · last updated 2026-10-18 18:05 PDT
   Served as assets/lrseries/lrseries.js?v=1 — keep the two numbers equal.

   A quiet dropdown on the Listening Room's control bar, beside Sort:

     31 recordings                    SERIES [ All ▾ ]   SORT (Newest)(…)

   WHY THIS IS A SEPARATE FILE, AND NOT AN EDIT TO roya-library.js

   The Listening Room is drawn by library/roya-library.js, and that file is
   generated — "Cut from the sandbox by build-integration.py. Do not
   hand-edit: the next build overwrites it, and the sandbox is the source."
   The build script is not in the repository, so an edit there could not be
   regenerated and would be silently reverted the next time it was. This file
   adds the control from outside instead, the same way assets/intro/ adds the
   introduction film: it touches no generated file, it survives a rebuild of
   the library, and taking it off again is deleting two lines from index.html.

   HOW IT SURVIVES A REDRAW

   The library rewrites its whole stage on every state change — a sort, a
   view, a search keystroke — so anything inserted once is gone a moment
   later. The pattern here is the library's own and the intro film's: an
   idempotent apply(), a rAF-debounced schedule(), and a MutationObserver on
   #royaLibrary. Nothing is inserted twice and nothing is left behind.

   WHAT IT READS

   STORIES and TRILOGIES, the globals stories.js already puts on the page —
   not a copy. Series appear in TRILOGIES order, which is the order the
   reader meets them everywhere else on the site, and a series is listed only
   when it actually has a recording. Add a recording to stories.js and its
   series appears here on its own; nothing in this file has to be touched.

   WHAT IT DOES NOT TOUCH

   It uses the Library's existing picker classes — .pickbox, .pick-btn,
   .pick-list — so the control is the site's own, light-off theme included,
   rather than a second dropdown in a second hand. Its own data attributes
   are data-lrpick and data-lrseries: NOT data-pick or data-filter, which
   roya-library.js listens for on document and which would carry the reader
   out of the Listening Room and into the Library.
   ──────────────────────────────────────────────────────────────────── */

(function lrSeries() {
  "use strict";

  var ROOT = document.getElementById("royaLibrary");
  if (!ROOT) return;
  if (typeof STORIES === "undefined" || !Array.isArray(STORIES)) return;

  var ALL  = "all";
  var SOLO = "\u0001solo";          /* cannot collide with a series title */

  var sel  = ALL;
  var open = false;

  /* ───────────────────────── what has a recording ─────────────────────── */

  var heard = Object.create(null);           /* book number -> true        */
  STORIES.forEach(function (b) { if (b && b.audio) heard[b.num] = true; });

  var owner = Object.create(null);           /* book number -> series name */
  var runs  = [];                            /* {key, label, nums}         */

  if (typeof TRILOGIES !== "undefined" && Array.isArray(TRILOGIES)) {
    TRILOGIES.forEach(function (t) {
      if (!t || !t.title || !Array.isArray(t.books)) return;
      var nums = t.books.filter(function (n) { return heard[n]; });
      t.books.forEach(function (n) { owner[n] = t.title; });
      if (nums.length) runs.push({ key: t.title, label: t.title, nums: nums });
    });
  }

  var solo = Object.keys(heard).map(Number).filter(function (n) { return !owner[n]; });
  var total = Object.keys(heard).length;

  /* Nothing to filter by. One series, or none, and the control would be a
     dropdown with a single destination — so it simply never appears. */
  if (runs.length < 2) return;

  var OPTS = [{ key: ALL, label: "All recordings", n: total }]
    .concat(runs.map(function (r) { return { key: r.key, label: r.label, n: r.nums.length }; }));
  if (solo.length) OPTS.push({ key: SOLO, label: "Stand alone", n: solo.length });

  function wanted(num) {
    if (sel === ALL)  return true;
    if (sel === SOLO) return !owner[num];
    return owner[num] === sel;
  }
  function countFor(key) {
    for (var i = 0; i < OPTS.length; i++) if (OPTS[i].key === key) return OPTS[i].n;
    return total;
  }
  function labelFor(key) {
    for (var i = 0; i < OPTS.length; i++) if (OPTS[i].key === key) return OPTS[i].label;
    return "All recordings";
  }

  /* ─────────────────────────────── markup ─────────────────────────────── */

  var CARET = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function build() {
    var box = document.createElement("span");
    box.className = "lrs" + (open ? " is-open" : "") + (sel !== ALL ? " is-set" : "");

    /* "Series" is set exactly as the bar's own "Sort" label is, so the two
       controls read as one row rather than as a control and a visitor. */
    var lab = document.createElement("span");
    lab.className = "lr-sortlab lrs-lab";
    lab.textContent = "Series";

    var pick = document.createElement("span");
    pick.className = "pickbox lrs-box" + (open ? " is-open" : "");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick-btn lrs-btn";
    btn.setAttribute("data-lrpick", "1");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-haspopup", "listbox");
    btn.innerHTML = "<span>" + esc(sel === ALL ? "All" : labelFor(sel)) + "</span>" + CARET;
    pick.appendChild(btn);

    if (open) {
      var list = document.createElement("div");
      list.className = "pick-list lrs-list";
      list.setAttribute("role", "listbox");
      list.setAttribute("aria-label", "Filter the recordings by series");
      list.innerHTML = OPTS.map(function (o) {
        return '<button type="button" role="option" data-lrseries="' + esc(o.key) + '"' +
               ' aria-selected="' + (sel === o.key) + '">' +
               "<span>" + esc(o.label) + "</span><i>" + o.n + "</i></button>";
      }).join("");
      pick.appendChild(list);
    }

    box.appendChild(lab);
    box.appendChild(pick);
    return box;
  }

  /* ──────────────────────────────── apply ─────────────────────────────── */

  /* Idempotent. The bar is rebuilt under us constantly; this puts the control
     back if it is missing, leaves it alone if it is already right, and then
     states the filter on the rows either way. */
  function apply() {
    var bar = ROOT.querySelector(".lr-bar");
    if (!bar) return;

    var sorts = bar.querySelector(".lr-sorts");
    var have  = bar.querySelector(".lrs");
    var fresh = build();

    if (have) {
      if (have.outerHTML === fresh.outerHTML) { paint(bar); return; }
      have.replaceWith(fresh);
    } else if (sorts) {
      sorts.parentNode.insertBefore(fresh, sorts);   /* Series, then Sort */
    } else {
      bar.appendChild(fresh);
    }
    paint(bar);
  }

  /* The rows, and the count that announces them. The count is the library's
     own line and its own wording — "31 recordings" — so a filtered bar reads
     as the same sentence with a smaller number in it, not as a second idiom. */
  function paint(bar) {
    var shown = 0;
    ROOT.querySelectorAll(".lr-row").forEach(function (row) {
      var k = row.querySelector("[data-rec]");
      var n = k ? +k.getAttribute("data-rec") : NaN;
      var keep = isNaN(n) ? true : wanted(n);
      row.classList.toggle("is-lrhid", !keep);
      if (keep) shown++;
    });

    var count = bar.querySelector(".lr-count");
    if (count) {
      count.textContent = shown + " recording" + (shown === 1 ? "" : "s");
    }
  }

  /* ─────────────────────────────── schedule ───────────────────────────── */

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; apply(); });
  }

  new MutationObserver(schedule).observe(ROOT, { childList: true, subtree: true });
  schedule();

  /* ──────────────────────────────── events ───────────────────────────── */

  document.addEventListener("click", function (e) {
    var opt = e.target.closest("[data-lrseries]");
    if (opt) {
      sel = opt.getAttribute("data-lrseries");
      open = false;
      apply();
      /* The reader asked for a different set; give them the top of it rather
         than their old distance down a list that no longer has those rows. */
      var bar = ROOT.querySelector(".lr-bar");
      if (bar && bar.scrollIntoView) bar.scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.target.closest("[data-lrpick]")) { open = !open; apply(); return; }
    if (open && !e.target.closest(".lrs")) { open = false; apply(); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) { open = false; apply(); }
  });
})();
