/* ══════════════════ THE LISTENING ROOM: STAGE AND STRIP ══════════════════
   Version 4 · last updated 2026-11-26 07:30 PST — Share is a word beside the title,
   no longer an icon on the cover; the header's foot measured for the bar
   Served as assets/lrstage/lrstage.js?v=4 — keep the two numbers equal.

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

  /* ── sharing a recording ──
     The address handed out is a real page, share/listen-NN-slug.html, made by
     build-share-pages.js beside the book's own share/NN-slug.html. It carries
     the same cover in its preview, and sends whoever opens it to
     #listen-NN-slug, which this file answers by opening Listen with that book
     on the stage. The slug is built exactly as the library and script.js
     build theirs, so the three cannot drift apart. */
  var STORY = {};
  if (typeof STORIES !== "undefined" && Array.isArray(STORIES)) {
    STORIES.forEach(function (b) { if (b) STORY[b.num] = b; });
  }
  function slugFor(b) {
    return pad(b.num) + "-" + String(b.title).toLowerCase()
      .replace(/['\u2019]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  function listenShareUrl(n) {
    var b = STORY[n];
    if (!b) return location.origin + location.pathname;
    var base = location.pathname.replace(/[^\/]*$/, "");
    return location.origin + base + "share/listen-" + slugFor(b) + ".html";
  }
  function shareListen(n, el) {
    var b = STORY[n], url = listenShareUrl(n);
    var say = function (word) {
      if (!el) return;
      el.setAttribute("data-said", word);
      clearTimeout(el._t);
      el._t = setTimeout(function () { el.removeAttribute("data-said"); }, 1600);
    };
    if (navigator.share) {
      navigator.share({ title: (b ? b.title + " \u2014 read aloud" : "Listen") + " \u00b7 Chew Z", url: url })
        .catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { say("Link copied"); })
        .catch(function () { say("Copy failed"); });
      return;
    }
    window.open(url, "_blank", "noopener");
  }

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
      '<div class="lst-strip">' + thumbs + "</div>" +
      '<div class="lst-dots" role="group" aria-label="Pages of the strip"></div>';
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
      /* the title, with Share beside it as a word in the Read instead face */
      var head = document.createElement("div");
      head.className = "lst-head";
      var t = row.querySelector(".lr-t");
      if (t) head.appendChild(t.cloneNode(true));
      var sh = document.createElement("button");
      sh.type = "button";
      sh.className = "lst-sharetxt";
      sh.setAttribute("data-lstshare", "1");
      sh.setAttribute("aria-label", "Share this recording");
      sh.textContent = "Share";
      head.appendChild(sh);
      info.appendChild(head);
      [".lr-syn", ".lr-acts"].forEach(function (q) {
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
    /* only when the choice has just changed: a redraw elsewhere on the page
       must not pull the strip back from wherever the reader scrolled it */
    var moved = st.getAttribute("data-shown") !== String(sel);
    if (moved) st.setAttribute("data-shown", String(sel));
    if (on && (moved || instant)) {
      var pad = 16, l = on.offsetLeft - pad, r = on.offsetLeft + on.offsetWidth + pad - strip.clientWidth;
      if (strip.scrollLeft > l) strip.scrollTo({ left: l, behavior: instant ? "auto" : "smooth" });
      else if (strip.scrollLeft < r) strip.scrollTo({ left: r, behavior: instant ? "auto" : "smooth" });
    }

    var prev = st.querySelector(".lst-prev"), next = st.querySelector(".lst-next");
    if (prev.disabled !== (i === 0)) prev.disabled = i === 0;
    if (next.disabled !== (i === nums.length - 1)) next.disabled = i === nums.length - 1;

    dots(st);

    if (instant) {
      var rail = st.querySelector(".lst-rail");
      var slide = rail.children[i];
      if (slide) rail.scrollLeft = slide.offsetLeft;
    }
  }

  /* ── the dots under the strip ──
     One per strip-width of books, not one per book: thirty-five dots would
     be wider than a phone. The lit one is the stretch of the strip on show;
     a tap on a dot scrolls the strip to that stretch. Rebuilt only when the
     number of pages changes, so scrolling just moves the light. */
  function dots(st) {
    var strip = st.querySelector(".lst-strip"), box = st.querySelector(".lst-dots");
    if (!strip || !box) return;
    var w = strip.clientWidth || 1;
    var pages = Math.max(1, Math.ceil((strip.scrollWidth - 2) / w));
    if (pages < 2) { if (box.childElementCount) box.innerHTML = ""; if (!box.hidden) box.hidden = true; return; }
    if (box.hidden) box.hidden = false;
    if (box.childElementCount !== pages) {
      var h = "";
      for (var p = 0; p < pages; p++) {
        h += '<button type="button" class="lst-dot" data-lstpage="' + p + '" aria-label="Page ' + (p + 1) + " of " + pages + '"></button>';
      }
      box.innerHTML = h;
    }
    var max = strip.scrollWidth - w;
    var cur = max > 0 ? Math.round(strip.scrollLeft / max * (pages - 1)) : 0;
    [].forEach.call(box.children, function (d, i) {
      setOn(d, i === cur);
      var a = i === cur ? "true" : "false";
      if (d.getAttribute("aria-current") !== a) d.setAttribute("aria-current", a);
    });
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
    /* A trackpad. Two fingers sideways on the stage fire a stream of small
       wheel events, and letting the browser scroll a snapping row with them
       fought the snap — a judder, then a jump. Taken over here instead: the
       sideways part of the gesture is added up, and one push past the
       threshold moves exactly one book, then the rest of that gesture is
       ignored. It also stops the push reaching the browser, which on a Mac
       otherwise reads a rightward swipe at the first book as "go Back". */
    var acc = 0, lock = 0;
    rail.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;   /* page scroll */
      e.preventDefault();
      var now = Date.now();
      if (now < lock) { lock = now + 180; return; }          /* same gesture */
      acc += e.deltaX;
      if (Math.abs(acc) > 40) {
        step(st, acc > 0 ? 1 : -1);
        acc = 0;
        lock = now + 350;
      }
    }, { passive: false });

    /* The strip scrolls freely, but a sideways push past either end goes
       nowhere rather than on to the browser's Back and Forward. */
    var strip = st.querySelector(".lst-strip");
    strip.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      var max = strip.scrollWidth - strip.clientWidth;
      if ((e.deltaX < 0 && strip.scrollLeft <= 0) || (e.deltaX > 0 && strip.scrollLeft >= max - 1)) {
        e.preventDefault();
      }
    }, { passive: false });
    var dt = 0;
    strip.addEventListener("scroll", function () {
      cancelAnimationFrame(dt);
      dt = requestAnimationFrame(function () { dots(st); });
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
    watchHead();
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

  /* ── where the header ends, for the bar that locks under it ──
     The phone header folds down by about 40px once the page scrolls (its logo
     row shrinks), so its foot is measured live, not once: a ResizeObserver on
     the header re-measures every time it changes height, and moves to the new
     header when the library redraws one. The figure goes in --lst-top, which
     lrstage.css uses to hold the Recordings bar at that foot. (The Library's
     own bar does the same with --lb-top, but that observer stays on the
     Library's header and goes stale once Listen is drawn.) */
  var headSeen = null;
  var headRO = window.ResizeObserver ? new ResizeObserver(function () { headTop(); }) : null;
  function headTop() {
    var h = headSeen;
    if (!h || !h.isConnected) return;
    var t = parseFloat(getComputedStyle(h).top) || 0;
    var v = Math.round(t + h.getBoundingClientRect().height) + "px";
    if (ROOT.style.getPropertyValue("--lst-top") !== v) ROOT.style.setProperty("--lst-top", v);
  }
  function watchHead() {
    var h = ROOT.querySelector(".mob-head") || ROOT.querySelector(".dnav");
    if (!h) return;
    if (h !== headSeen) {
      if (headRO && headSeen) headRO.unobserve(headSeen);
      headSeen = h;
      if (headRO) headRO.observe(h);
    }
    headTop();
  }
  if (!headRO) ROOT.addEventListener("scroll", headTop, { passive: true, capture: true });

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
    var dp = e.target.closest("[data-lstpage]");
    if (dp && st.contains(dp)) {
      var strip = st.querySelector(".lst-strip"), pages = st.querySelector(".lst-dots").childElementCount;
      var max = strip.scrollWidth - strip.clientWidth;
      strip.scrollTo({ left: pages > 1 ? max * (+dp.getAttribute("data-lstpage")) / (pages - 1) : 0, behavior: "smooth" });
      return;
    }
    var sh = e.target.closest("[data-lstshare]");
    if (sh && st.contains(sh)) { shareListen(sel, sh); return; }
    var sp = e.target.closest("[data-lststep]");
    if (sp && st.contains(sp)) { step(st, +sp.getAttribute("data-lststep")); }
  });

  /* ── arriving from a shared recording ──
     #listen-NN-slug (or just #listen-NN): open Listen with that book on the
     stage, and bring the stage into view. The library draws Listen when its
     own Listen tab is pressed, so that is what is pressed; then the stage is
     waited for, because it is built a frame or two after the library draws. */
  function fromHash() {
    var m = /^#listen-0*(\d+)/.exec(String(location.hash));
    if (!m) return false;
    var n = +m[1];
    if (!STORY[n] || !STORY[n].audio) return false;
    sel = n;
    var tries = 0;
    (function wait() {
      var tab = ROOT.querySelector('[data-view="listening"]');
      var st = ROOT.querySelector(".lst");
      if (!st || !ROOT.querySelector(".lr-list")) {
        if (tab && !ROOT.querySelector(".lr-list")) tab.click();
        if (++tries < 80) setTimeout(wait, 100);
        return;
      }
      paint(st, shownRows(), true);
      var y = st.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo(0, Math.max(0, y));
      st.scrollIntoView && st.scrollIntoView({ block: "center" });
    })();
    return true;
  }
  fromHash();
  window.addEventListener("hashchange", fromHash);

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
