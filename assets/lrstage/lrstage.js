/* ══════════════════ THE LISTENING ROOM: STAGE AND STRIP ══════════════════
   Version 1 · last updated 2026-11-25 06:55 PST
   Served as assets/lrstage/lrstage.js?v=1 — keep the two numbers equal.

   The Listening Room used to be a column of rows: a standing 3D cover on the
   left, the words on the right, one book under another. This turns it into
   a stage and a strip:

     ┌──────────── stage ────────────┐  119 · The Light Is Yours to Take
     │   front and back, full size   │  synopsis …
     │  ‹ swipe / arrows ›           │  [ LISTEN ]  3H 26M   Read instead
     └───────────────────────────────┘
     [▣][▣][▣][▣][▣][▣][▣] ← the strip: every recording, scrolls sideways

   On a phone the words drop under the stage and the strip sits beneath them.

   WHY THIS IS A SEPARATE FILE

   Same reason as assets/lrseries/: the Listening Room is drawn by
   library/roya-library.js, which is generated from a sandbox the repository
   does not carry. This file rearranges what that one draws, from outside, so
   it survives a rebuild of the library and comes off by deleting two lines
   from index.html — the old list is still drawn underneath and simply
   reappears.

   WHAT IT LEANS ON

   - The library's own rows (.lr-row), which it still draws and this file only
     hides. The words beside the stage are those rows' own title, synopsis and
     controls, copied across — so Listen, Read instead and the cover zoom are
     the library's own buttons, handled by the library's own click listener,
     and nothing here has to know what they do.
   - The series filter (assets/lrseries/), which marks rows it filters out
     with .is-lrhid. The stage and the strip show exactly the rows it leaves,
     in the order the library's Sort put them.
   - covers/pairs/NN.webp, the front-and-back render every book has.
   ──────────────────────────────────────────────────────────────────── */

(function lrStage() {
  "use strict";

  var ROOT = document.getElementById("royaLibrary");
  if (!ROOT) return;

  /* The shared cache stamp, read off the library's own script tag, so a
     replaced pair render reaches people the same day it is uploaded. */
  var V = (function () {
    var s = document.querySelector('script[src*="roya-library.js"]');
    var m = s && /[?&]v=(\d+)/.exec(s.getAttribute("src") || "");
    return m ? m[1] : "";
  })();
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function pairSrc(n) { return "covers/pairs/" + pad(n) + ".webp" + (V ? "?v=" + V : ""); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var sel = null;          /* the book on stage, by number; kept across redraws */

  var ARW_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var ARW_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  function shownRows() {
    return [].slice.call(ROOT.querySelectorAll(".lr-list .lr-row")).filter(function (r) {
      return !r.classList.contains("is-lrhid");
    });
  }
  function numOf(row) {
    var k = row.querySelector("[data-rec]");
    return k ? +k.getAttribute("data-rec") : NaN;
  }
  function titleOf(row) {
    var t = row.querySelector(".lr-name");
    return t ? t.textContent : "";
  }

  /* ─────────────────────────────── build ─────────────────────────────── */

  function build(rows) {
    var st = document.createElement("section");
    st.className = "lst";
    st.setAttribute("aria-label", "Recordings");
    var slides = "", thumbs = "";
    rows.forEach(function (r, i) {
      var n = numOf(r), t = esc(titleOf(r));
      slides += '<div class="lst-slide" data-lstslide="' + n + '">' +
        '<img src="' + pairSrc(n) + '" alt="' + t + ', front and back" draggable="false"' +
        (i > 2 ? ' loading="lazy"' : "") + "></div>";
      thumbs += '<button type="button" class="lst-th" data-lstn="' + n + '" aria-label="' + t + '">' +
        '<img src="' + pairSrc(n) + '" alt="" loading="lazy" draggable="false">' +
        '<span class="lst-cap"><b>' + n + "</b>" + t + "</span></button>";
    });
    st.innerHTML =
      '<div class="lst-top">' +
        '<div class="lst-hero">' +
          '<div class="lst-rail" tabindex="0" aria-label="Recordings — swipe or use the arrow keys">' + slides + "</div>" +
          '<button type="button" class="lst-arw lst-prev" data-lststep="-1" aria-label="Previous recording">' + ARW_L + "</button>" +
          '<button type="button" class="lst-arw lst-next" data-lststep="1" aria-label="Next recording">' + ARW_R + "</button>" +
          '<span class="lst-zoomslot"></span>' +
        "</div>" +
        '<div class="lst-info" aria-live="polite"></div>' +
      "</div>" +
      '<div class="lst-strip">' + thumbs + "</div>";
    return st;
  }

  /* ─────────────────────────── the chosen book ───────────────────────── */

  function setOn(el, on) {                 /* only touch the DOM on a change */
    if (el.classList.contains("is-on") !== on) el.classList.toggle("is-on", on);
  }

  function paint(st, rows, instant) {
    var nums = rows.map(numOf);
    var i = nums.indexOf(sel);
    if (i < 0) { i = 0; sel = nums[0]; }
    var row = rows[i];

    /* the words: the row's own title, synopsis and controls */
    var info = st.querySelector(".lst-info");
    if (info.getAttribute("data-n") !== String(sel)) {
      info.setAttribute("data-n", String(sel));
      info.innerHTML = "";
      [".lr-t", ".lr-syn", ".lr-acts"].forEach(function (q) {
        var el = row.querySelector(q);
        if (el) info.appendChild(el.cloneNode(true));
      });
      var slot = st.querySelector(".lst-zoomslot");
      slot.innerHTML = "";
      var z = row.querySelector(".lr-zoom");
      if (z) slot.appendChild(z.cloneNode(true));
    }

    /* the strip: light the chosen one and keep it in view */
    var strip = st.querySelector(".lst-strip");
    var on = null;
    [].forEach.call(strip.children, function (b) {
      var me = +b.getAttribute("data-lstn") === sel;
      setOn(b, me);
      if (me) on = b;
      if (b.getAttribute("aria-current") !== String(me)) b.setAttribute("aria-current", String(me));
    });
    if (on) {
      var pad = 16, l = on.offsetLeft - pad, r = on.offsetLeft + on.offsetWidth + pad - strip.clientWidth;
      if (strip.scrollLeft > l) strip.scrollTo({ left: l, behavior: instant ? "auto" : "smooth" });
      else if (strip.scrollLeft < r) strip.scrollTo({ left: r, behavior: instant ? "auto" : "smooth" });
    }

    var prev = st.querySelector(".lst-prev"), next = st.querySelector(".lst-next");
    if (prev.disabled !== (i === 0)) prev.disabled = i === 0;
    if (next.disabled !== (i === nums.length - 1)) next.disabled = i === nums.length - 1;

    if (instant) {
      var rail = st.querySelector(".lst-rail");
      var slide = rail.children[i];
      if (slide) rail.scrollLeft = slide.offsetLeft;
    }
  }

  function go(st, n, smooth) {
    var rail = st.querySelector(".lst-rail");
    var slide = rail.querySelector('[data-lstslide="' + n + '"]');
    if (!slide) return;
    sel = n;
    rail.scrollTo({ left: slide.offsetLeft, behavior: smooth ? "smooth" : "auto" });
    paint(st, shownRows(), false);
  }

  function wire(st) {
    var rail = st.querySelector(".lst-rail");
    var t = 0;
    rail.addEventListener("scroll", function () {
      cancelAnimationFrame(t);
      t = requestAnimationFrame(function () {
        var w = rail.clientWidth || 1;
        var i = Math.round(rail.scrollLeft / w);
        var slide = rail.children[Math.max(0, Math.min(rail.children.length - 1, i))];
        var n = slide ? +slide.getAttribute("data-lstslide") : sel;
        if (n !== sel) { sel = n; paint(st, shownRows(), false); }
      });
    }, { passive: true });
    rail.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      step(st, e.key === "ArrowLeft" ? -1 : 1);
    });
  }

  function step(st, d) {
    var nums = shownRows().map(numOf);
    var i = nums.indexOf(sel) + d;
    if (i >= 0 && i < nums.length) go(st, nums[i], true);
  }

  /* ──────────────────────────────── apply ─────────────────────────────── */

  /* Idempotent, like the series filter: the library rewrites its whole stage
     on every state change, so this puts the stage back when it is missing,
     rebuilds it when the set of books has changed (a sort, a series), and
     otherwise only re-lights the chosen one. */
  function apply() {
    var list = ROOT.querySelector(".lr-list");
    if (!list) return;
    var rows = shownRows();
    var st = ROOT.querySelector(".lst");
    if (!rows.length) {
      if (st) st.remove();
      list.classList.remove("lst-hide");
      return;
    }
    if (!list.classList.contains("lst-hide")) list.classList.add("lst-hide");
    var sig = rows.map(numOf).join(",");
    if (st && st.getAttribute("data-sig") === sig && st.nextElementSibling === list) {
      paint(st, rows, false);
      return;
    }
    if (st) st.remove();
    st = build(rows);
    st.setAttribute("data-sig", sig);
    list.parentNode.insertBefore(st, list);
    wire(st);
    paint(st, rows, true);
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; apply(); });
  }

  /* Watch the library for redraws, and for the series filter marking rows —
     a class change, which is why attributes are watched too. Changes inside
     the stage itself are ignored, or every re-light would schedule another. */
  new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var t = recs[i].target;
      if (!(t.closest && t.closest(".lst"))) { schedule(); return; }
    }
  }).observe(ROOT, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  schedule();

  /* ──────────────────────────────── events ───────────────────────────── */

  document.addEventListener("click", function (e) {
    var st = ROOT.querySelector(".lst");
    if (!st) return;
    var th = e.target.closest("[data-lstn]");
    if (th && st.contains(th)) { go(st, +th.getAttribute("data-lstn"), true); return; }
    var sp = e.target.closest("[data-lststep]");
    if (sp && st.contains(sp)) { step(st, +sp.getAttribute("data-lststep")); }
  });

  /* A resize changes the slide width; put the chosen book back on stage. */
  var rz = 0;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(function () {
      var st = ROOT.querySelector(".lst");
      if (st) paint(st, shownRows(), true);
    });
  });
})();
