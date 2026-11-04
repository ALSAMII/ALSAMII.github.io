/* ══════════════════ THE LIBRARY'S CONTROL BAR ══════════════════
   Version 3 · last updated 2026-11-04 06:30 PST
   Served as assets/libbar/libbar.js?v=3 — keep the two numbers equal.

   Gives the Library the same opening Listen has: one line, then one bar.

     Every story here has a secret behind it. Some you'll guess by the end. Some you'll wish you hadn't.
     119 Stories      [ Search titles… ]  SERIES [All ▾]  SORT (Newest)(Number)(Shortest)  ▦ ☰

   WHY THIS IS A SEPARATE FILE

   The Library is drawn by library/roya-library.js, which is generated and
   must not be hand-edited (the next build overwrites it). Like
   assets/lrseries/ and assets/intro/, this rearranges what the library
   draws from outside, and taking it off again is deleting its two lines in
   index.html.

   IT MOVES THE LIBRARY'S OWN CONTROLS — IT DOES NOT COPY THEM

   The search box (#libSearch), the phone's series picker, the grid/list
   toggle: each is the library's own element, lifted into the bar, so every
   keystroke, filter and toggle still runs through roya-library.js exactly
   as before. The sort pills are buttons carrying data-sortpick, and the
   desktop series menu's rows carry data-filter — the library's own
   document-level handlers act on both. Nothing here keeps a copy of the
   library's state; it reads it back off the page after every draw.

   WHAT STAYS ON SCREEN WHEN YOU SCROLL

   Only the bar (and the section tabs above it, as on every page). The
   opening line scrolls away. On a phone the library froze its whole
   header — logo, tabs, opening line and controls, over 380px of a
   852px screen — so the opening line and the bar are lifted out of that
   frozen block to sit just under it, the way Listen's do, and the bar
   sticks on its own at the foot of the tabs. --lb-top is where that
   foot is, measured, because the tabs' height follows the screen width.

   HOW IT SURVIVES A REDRAW

   The library rewrites the whole stage on every change — every search
   keystroke included — so the bar is rebuilt after every draw. The
   MutationObserver runs apply() synchronously, before the browser paints,
   so the library's own layout is never shown for a frame; and when the
   search box was the focused element, focus and the caret are put back.
   ──────────────────────────────────────────────────────────────────── */

(function libBar() {
  "use strict";

  var ROOT = document.getElementById("royaLibrary");
  if (!ROOT) return;

  var deskOpen = false;        /* the desktop series menu (the phone uses the library's own) */
  var busy = false;

  /* the opening line: the library's own ("All {n} stories, in one place.")
     repeated the count the bar shows right under it */
  var LEDE = "Every story here has a secret behind it. Some you\u2019ll guess by the end. Some you\u2019ll wish you hadn\u2019t.";

  var SORTS = [["newest", "Newest"], ["number", "Number"], ["shortest", "Shortest"]];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function currentSort() {
    var b = ROOT.querySelector(".sortbox");
    var t = b ? b.textContent.replace(/^\s*Sort:\s*/i, "").trim().toLowerCase() : "newest";
    for (var i = 0; i < SORTS.length; i++) if (SORTS[i][1].toLowerCase() === t) return SORTS[i][0];
    return "newest";
  }

  function sortPills() {
    var wrap = el("span", "lr-sorts lb-sorts");
    wrap.appendChild(el("span", "lr-sortlab", "Sort"));
    var on = currentSort();
    SORTS.forEach(function (s) {
      var b = el("button", "lr-sort" + (s[0] === on ? " is-on" : ""), s[1]);
      b.type = "button";
      b.setAttribute("data-sortpick", s[0]);         /* the library's own handler */
      b.setAttribute("aria-pressed", String(s[0] === on));
      wrap.appendChild(b);
    });
    return wrap;
  }

  /* desktop: the rail's series rows are the list, read back off the page */
  function deskSeries() {
    var rows = [].slice.call(ROOT.querySelectorAll(".side [data-filter]"));
    var box = el("span", "lrs lb-series");
    box.appendChild(el("span", "lr-sortlab lrs-lab", "Series"));
    var pick = el("span", "pickbox lrs-box" + (deskOpen ? " is-open" : ""));
    var on = rows.filter(function (r) { return r.getAttribute("aria-pressed") === "true"; })[0];
    var name = on ? (on.querySelector(".side-nm") || on).textContent.trim() : "All";
    var isAll = !on || on.getAttribute("data-filter") === "all";
    if (!isAll) box.classList.add("is-set");
    var btn = el("button", "pick-btn lrs-btn");
    btn.type = "button";
    btn.setAttribute("data-lbpick", "1");
    btn.setAttribute("aria-expanded", String(deskOpen));
    btn.setAttribute("aria-haspopup", "listbox");
    btn.appendChild(el("span", null, isAll ? "All" : name));
    btn.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>');
    pick.appendChild(btn);
    if (deskOpen) {
      var list = el("div", "pick-list lrs-list");
      list.setAttribute("role", "listbox");
      list.setAttribute("aria-label", "Browse by series");
      rows.forEach(function (r) {
        var o = el("button");
        o.type = "button";
        o.setAttribute("role", "option");
        o.setAttribute("data-filter", r.getAttribute("data-filter"));   /* the library's own handler */
        o.setAttribute("aria-selected", String(r.getAttribute("aria-pressed") === "true"));
        var nm = r.querySelector(".side-nm"), ct = r.querySelector(".side-ct");
        o.appendChild(el("span", null, nm ? nm.textContent.trim() : r.textContent.trim()));
        o.appendChild(el("i", null, ct ? ct.textContent.trim() : ""));
        list.appendChild(o);
      });
      pick.appendChild(list);
    }
    box.appendChild(pick);
    return box;
  }

  /* phone: the library's own picker, relabelled "All" with SERIES beside it */
  function phoneSeries(pickbox) {
    var box = el("span", "lrs lb-series");
    box.appendChild(el("span", "lr-sortlab lrs-lab", "Series"));
    pickbox.classList.add("lrs-box");
    var btn = pickbox.querySelector(".pick-btn");
    if (btn) {
      btn.classList.add("lrs-btn");
      var sp = btn.querySelector("span");
      if (sp) {
        var v = sp.textContent.replace(/^\s*Series:\s*/i, "").trim();
        sp.textContent = v || "All";
        if (v && v !== "All") box.classList.add("is-set");
      }
    }
    var list = pickbox.querySelector(".pick-list");
    if (list) list.classList.add("lrs-list");
    box.appendChild(pickbox);
    return box;
  }

  function apply() {
    var lede = ROOT.querySelector(".lib-lede");
    var phone = !!ROOT.querySelector(".mob-ctrl");
    var desk = !!ROOT.querySelector(".main-bar");
    if (!lede || (!phone && !desk)) { ROOT.classList.remove("lb-on"); return; }
    if (lede.textContent !== LEDE) lede.textContent = LEDE;
    if (lede.nextElementSibling && lede.nextElementSibling.classList.contains("lb-bar")) return;

    var search = document.getElementById("libSearch");
    var hadFocus = search && document.activeElement === search;
    var s0 = hadFocus ? search.selectionStart : 0, s1 = hadFocus ? search.selectionEnd : 0;

    var n = ROOT.querySelectorAll(phone ? ".mob-grid > .mcard" : ".main .grid > .bcard").length;

    var bar = el("div", "lb-bar");
    bar.appendChild(el("span", "lr-count lb-count", n + (n === 1 ? " story" : " stories")));

    var ctrls = el("span", "lb-ctrls");
    var sbox = search && search.parentElement;                   /* .side-search or .mob-search */
    if (sbox) { sbox.classList.add("lb-search"); ctrls.appendChild(sbox); }

    if (phone) {
      var pb = ROOT.querySelector(".mob-ctrl .pickbox");
      if (pb) ctrls.appendChild(phoneSeries(pb));
    } else {
      ctrls.appendChild(deskSeries());
    }
    ctrls.appendChild(sortPills());

    var tog = ROOT.querySelector(phone ? ".mob-ctrl .viewtog" : ".main-bar .viewtog");
    if (tog) { tog.classList.add("lb-view"); ctrls.appendChild(tog); }

    bar.appendChild(ctrls);
    /* phone: out of the frozen header, to sit under it */
    var head = phone && lede.parentElement.classList.contains("mob-head") ? lede.parentElement : null;
    if (head) head.after(lede);
    lede.after(bar);
    ROOT.classList.add("lb-on");
    measure();

    if (hadFocus) {
      search.focus({ preventScroll: true });
      try { search.setSelectionRange(s0, s1); } catch (e) {}
    }
  }

  /* where the frozen band above the bar ends */
  function measure() {
    var head = ROOT.querySelector(".mob-head") || ROOT.querySelector(".dnav");
    if (!head) return;
    var top = parseFloat(getComputedStyle(head).top) || 0;
    var v = Math.round(top + head.getBoundingClientRect().height) + "px";
    if (ROOT.style.getPropertyValue("--lb-top") !== v) ROOT.style.setProperty("--lb-top", v);
  }
  window.addEventListener("resize", measure);

  function run() {
    if (busy) return;
    busy = true;
    try { apply(); } finally { busy = false; }
  }

  /* the desktop menu is ours: open and close it here, and close it on
     any choice or any press elsewhere */
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-lbpick]");
    if (t) { e.preventDefault(); e.stopPropagation(); deskOpen = !deskOpen; rebuild(); return; }
    if (deskOpen && !(e.target.closest && e.target.closest(".lb-series .pick-list"))) { deskOpen = false; rebuild(); }
    if (deskOpen && e.target.closest && e.target.closest(".lb-series [data-filter]")) deskOpen = false;
  }, true);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && deskOpen) { deskOpen = false; rebuild(); }
  });

  function rebuild() {
    var old = ROOT.querySelector(".lb-series");
    if (!old || ROOT.querySelector(".mob-ctrl")) return;
    old.replaceWith(deskSeries());
  }

  new MutationObserver(function () { run(); }).observe(ROOT, { childList: true, subtree: true });
  run();
})();
