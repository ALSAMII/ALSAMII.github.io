/* ============================================================
   This file builds the story list from stories.js and runs
   the page's behaviour. You should never need to edit it —
   add books in stories.js instead.

   What it does:
   1. Builds the sidebar list from the STORIES array.
      Files are found by each book's series number: book 27
      uses pdfs/27.pdf and covers/27.jpg (zero-padded under 10).
   2. Hovering a book shows its synopsis under the list and its
      cover LARGE in the middle of the page; moving away brings
      the theme text back. (On phones, tapping the eye expands
      the synopsis inline instead.)
   3. Hovering About or Author's Notes in the nav reveals those
      texts; moving away brings the theme text back.
   4. The speaker button plays assets/ambient.mp3, if present.

   The backdrop is no longer set here — it's one fixed scene on
   .atmosphere in style.css (assets/backdrop.webp / .jpg).
   ============================================================ */

(function () {
  "use strict";

  /* ---- 1. Build the list from stories.js ------------------- */

  var panels = document.querySelectorAll(".panel");
  var navLinks = document.querySelectorAll("[data-stage]");
  var canHover = window.matchMedia("(hover: hover)").matches;

  var easel = document.getElementById("easelImg");
  var easelSet = document.getElementById("easelSet");
  var feature = document.getElementById("feature");
  var ftMeta = document.getElementById("ftMeta");
  var ftText = document.getElementById("ftText");
  var ftLink = document.getElementById("ftLink");
  var hideTimer = null;

  var TRIOS = (typeof TRILOGIES !== "undefined") ? TRILOGIES : [];
  var trioByFirst = {}, inTrio = {};
  TRIOS.forEach(function (t) {
    trioByFirst[t.books[0]] = t;
    t.books.forEach(function (n) { inTrio[n] = true; });
  });

  function coverFor(n) { return "covers/" + String(n).padStart(2, "0") + ".jpg"; }

  /* ---- Deep links -----------------------------------------
     Every book gets its own address: #04-the-weeping-hour.
     Clicking a title pins that book and writes the hash, so the
     link can be shared and re-opened straight onto the story. */

  function slugFor(s) {
    return String(s.num).padStart(2, "0") + "-" +
      s.title.toLowerCase()
        .replace(/['\u2019]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
  }

  function trioSlug(t) {
    return (t.books.length === 3 ? "triptych-" : "series-") +
      t.title.toLowerCase()
      .replace(/['\u2019]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /* ---- Reading time ---------------------------------------
     "31,500 words" tells a writer something; "about 2 hours"
     tells a reader something. 250 wpm is the usual estimate for
     fiction; a page is counted as roughly 275 words. */

  function readingTime(words) {
    if (!words) return "";
    var n = parseInt(String(words).replace(/[^0-9]/g, ""), 10);
    if (!n) return "";
    if (/page/i.test(words)) n = n * 275;
    var mins = Math.round(n / 250);
    if (mins < 60) return mins + " min read";
    var hrs = mins / 60;
    /* Round to the nearest half hour — false precision helps nobody. */
    var rounded = Math.round(hrs * 2) / 2;
    return "about " + (rounded % 1 ? rounded.toFixed(1) : rounded) +
           (rounded === 1 ? " hour read" : " hours read");
  }

  /* The stage rests on the Author's Notes. Hovering a book or the
     About link swaps them out; letting go brings them back. */
  var DEFAULT_PANEL = "panel-notes";

  var pinned = null;   /* the book or triptych currently held on the stage */

  function showPanel(id) {
    var wasFeature = feature.classList.contains("show");
    feature.classList.remove("show");
    var activate = function () {
      if (feature.classList.contains("show")) return; /* superseded */
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.id === id);
      });
    };
    /* If the cover was up, let it fade before the text arrives,
       so the two never sit on top of each other. */
    if (wasFeature) setTimeout(activate, 300); else activate();
  }

  /* The line under a book's synopsis on the stage: what it runs on,
     and where it sits in the two menus. Books without the fields
     simply don't get the line. */
  var ftSub = document.getElementById("ftSubstance");

  function setSubstance(s) {
    if (!ftSub) return;
    var path = s && s.door
      ? s.door + (s.key ? " \u00b7 " + s.key : "") : "";
    if (!s || (!path && !s.substance)) { ftSub.hidden = true; ftSub.textContent = ""; return; }
    ftSub.hidden = false;
    ftSub.textContent = "";
    if (path) {
      var tag = document.createElement("span");
      tag.className = "ft-tag caps";
      tag.textContent = path;
      ftSub.append(tag);
    }
    if (s.substance) {
      var txt = document.createElement("span");
      txt.className = "ft-substance";
      txt.textContent = s.substance;
      ftSub.append(txt);
    }
  }

  function showFeature(s, num, pdf, cover) {
    clearTimeout(hideTimer);
    feature.classList.remove("trio");
    ftLink.style.display = "";
    panels.forEach(function (p) { p.classList.remove("is-active"); });
    ftMeta.textContent = num + " \u00b7 " + s.title +
      (s.words ? " \u00b7 " + s.words : "") +
      (readingTime(s.words) ? " \u00b7 " + readingTime(s.words) : "");
    ftText.textContent = s.synopsis;
    setSubstance(s);
    ftLink.setAttribute("href", pdf);
    ftLink.setAttribute("target", "_blank");
    ftLink.setAttribute("rel", "noopener");
    easel.style.display = "";
    easel.alt = s.title + " — cover";
    if (easel.getAttribute("src") !== cover) easel.src = cover;
    feature.classList.add("show");
  }

  /* The small line above a group's title. stories.js can set its
     own with a "label" field; a group of three keeps the old word. */
  function groupLabel(t) {
    return t.label || (t.books.length === 3 ? "A Triptych" : "A Series");
  }

  function showTrilogy(t) {
    clearTimeout(hideTimer);
    panels.forEach(function (p) { p.classList.remove("is-active"); });
    feature.classList.add("trio");
    ftMeta.textContent = groupLabel(t) + " \u00b7 " + t.title;
    ftText.textContent = t.synopsis;
    setSubstance(null);
    ftLink.style.display = "none";
    /* Built fresh each time, so a group can hold any number of books. */
    easelSet.textContent = "";
    easelSet.setAttribute("data-count", t.books.length);
    t.books.forEach(function (n) {
      var im = document.createElement("img");
      im.alt = "";
      im.addEventListener("error", function () { im.remove(); });
      im.src = coverFor(n);
      easelSet.append(im);
    });
    feature.classList.add("show");
  }

  /* Leaving a book starts a short grace period, so the reader can
     move the mouse onto the feature and click the PDF link. If a book
     is pinned, the stage falls back to it instead of the theme text. */
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (pinned) restorePinned(); else showPanel(DEFAULT_PANEL);
    }, 400);
  }

  feature.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
  feature.addEventListener("mouseleave", scheduleHide);

  easel.addEventListener("error", function () {
    /* Missing cover: show the synopsis alone */
    easel.style.display = "none";
  });

  var PDF_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0' +
    ' 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';

  var EYE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7' +
    '-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';

  var list = document.querySelector(".shelf ol");

  /* Filled as the list is built; the filter works from these. */
  var rows = [];        /* one entry per book row */
  var groupRows = [];   /* one entry per series heading */

  /* ---- Pinning + the address bar --------------------------- */

  var byNum = {}, bySlug = {};
  STORIES.forEach(function (s) {
    byNum[s.num] = s;
    bySlug[slugFor(s)] = { kind: "book", data: s };
  });
  TRIOS.forEach(function (t) { bySlug[trioSlug(t)] = { kind: "trio", data: t }; });

  function restorePinned() {
    if (!pinned) return;
    if (pinned.kind === "trio") { showTrilogy(pinned.data); return; }
    var s = pinned.data;
    var n = String(s.num).padStart(2, "0");
    showFeature(s, n, s.pdf || "pdfs/" + n + ".pdf", s.cover || coverFor(s.num));
  }

  function markPinned() {
    document.querySelectorAll(".is-pinned").forEach(function (el) {
      el.classList.remove("is-pinned");
    });
    if (!pinned || !pinned.el) return;
    pinned.el.classList.add("is-pinned");
  }

  function pin(entry, el, writeHash) {
    pinned = { kind: entry.kind, data: entry.data, el: el || null };
    markPinned();
    restorePinned();
    if (writeHash) {
      var slug = entry.kind === "trio"
        ? trioSlug(entry.data) : slugFor(entry.data);
      if (history.replaceState) history.replaceState(null, "", "#" + slug);
      else location.hash = slug;
    }
  }

  function unpin() {
    pinned = null;
    markPinned();
    showPanel(DEFAULT_PANEL);
    if (history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function openFromHash() {
    var slug = decodeURIComponent(String(location.hash).replace(/^#/, ""));
    if (!slug) return false;
    var entry = bySlug[slug];
    if (!entry) return false;
    var el = document.querySelector('[data-slug="' + slug + '"]');
    pin(entry, el, false);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" });
    /* Touch has no stage, so unfold the synopsis inline instead. */
    if (!canHover && el) el.classList.add("open");
    return true;
  }

  function buildTrilogyHead(t) {
    var li = document.createElement("li");
    li.className = "trilogy";
    li.tabIndex = 0;

    var label = document.createElement("p");
    label.className = "t-label caps";
    label.textContent = groupLabel(t);

    var title = document.createElement("h2");
    title.className = "t-title";
    title.textContent = t.title;

    var syn = document.createElement("div");
    syn.className = "synopsis";
    var minis = document.createElement("div");
    minis.className = "minis" + (t.books.length > 3 ? " many" : "");
    t.books.forEach(function (n) {
      var im = document.createElement("img");
      im.src = coverFor(n);
      im.alt = "";
      im.addEventListener("error", function () { im.remove(); });
      minis.append(im);
    });
    var txt = document.createElement("span");
    txt.textContent = t.synopsis;
    syn.append(minis, txt);

    li.append(label, title, syn);
    li.dataset.slug = trioSlug(t);
    list.append(li);
    groupRows.push({ group: t, el: li });

    li.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      if (pinned && pinned.kind === "trio" && pinned.data === t) {
        if (!canHover) li.classList.remove("open");
        unpin();
      } else {
        pin({ kind: "trio", data: t }, li, true);
        if (!canHover) li.classList.add("open");
      }
    });

    if (canHover) {
      li.addEventListener("mouseenter", function () { showTrilogy(t); });
      li.addEventListener("mouseleave", scheduleHide);
      li.addEventListener("focusin", function () { showTrilogy(t); });
      li.addEventListener("focusout", function (e) {
        if (!li.contains(e.relatedTarget)) scheduleHide();
      });
      li.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); li.click(); }
      });
    }
  }

  STORIES.forEach(function (s, i) {
    if (trioByFirst[s.num]) buildTrilogyHead(trioByFirst[s.num]);
    var num = String(s.num || i + 1).padStart(2, "0");
    var pdf = s.pdf || "pdfs/" + num + ".pdf";
    var cover = s.cover || "covers/" + num + ".jpg";

    var li = document.createElement("li");
    li.className = "story" + (inTrio[s.num] ? " in-trilogy" : "");

    var row = document.createElement("div");
    row.className = "story-row";

    var numEl = document.createElement("span");
    numEl.className = "num caps";
    numEl.textContent = num;

    var title = document.createElement("h2");
    title.className = "title";
    var titleBtn = document.createElement("button");
    titleBtn.type = "button";
    titleBtn.className = "title-btn";
    titleBtn.textContent = s.title;
    titleBtn.setAttribute("aria-label", s.title + " — show on the stage");
    title.append(titleBtn);

    var pdfBtn = document.createElement("a");
    pdfBtn.className = "icon-btn";
    pdfBtn.href = pdf;
    pdfBtn.title = "Read the PDF";
    pdfBtn.setAttribute("aria-label", s.title + " — PDF (opens in a new tab)");
    /* New tab: the reader keeps the room open behind the story. */
    pdfBtn.target = "_blank";
    pdfBtn.rel = "noopener";
    pdfBtn.innerHTML = PDF_ICON;

    row.append(numEl, title, pdfBtn);

    /* The eye only earns its place on touch, where there's no hover
       to reveal a synopsis. On a mouse or keyboard it would be a
       control that does nothing, so it isn't rendered at all. */
    var eye = null;
    if (!canHover) {
      eye = document.createElement("button");
      eye.className = "icon-btn eye";
      eye.type = "button";
      eye.title = "Synopsis";
      eye.setAttribute("aria-expanded", "false");
      eye.setAttribute("aria-label", s.title + " — synopsis");
      eye.innerHTML = EYE_ICON;
      row.append(eye);
    }

    var syn = document.createElement("div");
    syn.className = "synopsis";
    var synImg = document.createElement("img");
    synImg.src = cover;
    synImg.alt = "";
    synImg.addEventListener("error", function () { synImg.remove(); });
    var synText = document.createElement("span");
    synText.textContent = s.synopsis;
    syn.append(synImg, synText);

    li.append(row, syn);
    li.dataset.slug = slugFor(s);
    list.append(li);
    rows.push({ story: s, el: li });

    /* Clicking the title pins the book to the stage and puts its
       address in the bar, so the link can be copied and shared.
       Clicking it again lets go. */
    titleBtn.addEventListener("click", function () {
      if (pinned && pinned.kind === "book" && pinned.data === s) {
        if (!canHover) {
          li.classList.remove("open");
          if (eye) eye.setAttribute("aria-expanded", "false");
        }
        unpin();
      } else {
        pin({ kind: "book", data: s }, li, true);
        if (!canHover) {
          li.classList.add("open");
          if (eye) eye.setAttribute("aria-expanded", "true");
        }
      }
    });

    /* ---- 2. Hover behaviour for this book ------------------ */

    if (canHover) {
      li.addEventListener("mouseenter", function () {
        showFeature(s, num, pdf, cover);
      });
      li.addEventListener("mouseleave", scheduleHide);
      li.addEventListener("focusin", function () {
        showFeature(s, num, pdf, cover);
      });
      li.addEventListener("focusout", function (e) {
        if (!li.contains(e.relatedTarget)) scheduleHide();
      });
    } else {
      eye.addEventListener("click", function () {
        var open = li.classList.toggle("open");
        eye.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  });

  /* ---- 3. All Covers --------------------------------------- */

  var gallery = document.getElementById("gallery");
  var galleryGrid = document.getElementById("galleryGrid");
  var galleryOpen = document.getElementById("galleryOpen");
  var galleryClose = document.getElementById("galleryClose");
  var lastFocus = null;

  function buildGallery() {
    galleryGrid.textContent = "";
    STORIES.forEach(function (s) {
      var n = String(s.num).padStart(2, "0");
      var card = document.createElement("button");
      card.type = "button";
      card.className = "gcard";
      card.setAttribute("aria-label", s.title + " — show on the stage");

      var img = document.createElement("img");
      img.src = s.cover || coverFor(s.num);
      img.alt = s.title + " — cover";
      img.loading = "lazy";
      img.addEventListener("error", function () { card.classList.add("no-art"); });

      var cap = document.createElement("span");
      cap.className = "gcard-title";
      cap.textContent = n + " \u00b7 " + s.title;

      var meta = document.createElement("span");
      meta.className = "gcard-meta caps";
      meta.textContent = readingTime(s.words);

      card.append(img, cap, meta);
      card.addEventListener("click", function () {
        closeGallery();
        var li = document.querySelector('[data-slug="' + slugFor(s) + '"]');
        pin({ kind: "book", data: s }, li, true);
        if (li && li.scrollIntoView) li.scrollIntoView({ block: "center" });
        if (!canHover && li) li.classList.add("open");
      });
      galleryGrid.append(card);
    });
  }

  function openGallery() {
    lastFocus = document.activeElement;
    gallery.hidden = false;
    document.body.classList.add("gallery-on");
    requestAnimationFrame(function () { gallery.classList.add("show"); });
    galleryClose.focus();
  }

  function closeGallery() {
    gallery.classList.remove("show");
    document.body.classList.remove("gallery-on");
    setTimeout(function () { gallery.hidden = true; }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  galleryOpen.addEventListener("click", openGallery);
  galleryClose.addEventListener("click", closeGallery);
  gallery.addEventListener("click", function (e) {
    if (e.target === gallery) closeGallery();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!gallery.hidden) closeGallery();
    else if (pinned) unpin();
  });

  buildGallery();

  /* ---- 3b. Door / Key / What-turns-it filter ---------------
     All three menus are built from the fields in stories.js, so a
     new book with a new door needs no edit here. They cascade:
     choosing a Door narrows the Keys to the ones that occur behind
     it, and both narrow what's left in the third menu.

     None of the three is a native <select>. An option list is drawn
     by the operating system, which means its font, colours and
     highlight ignore the stylesheet entirely — and the third menu's
     entries are whole sentences a native list would clip. So they
     are buttons and listboxes, built here. */

  var resetBtn = document.getElementById("filterReset");
  var noMatch = document.getElementById("noMatch");
  var countEl = document.getElementById("shelfCount");
  var COUNT_TEXT = STORIES.length + " stories \u00b7 more coming";

  /* The one-line meaning beside each Door and Key. Optional: a name
     with no entry in GLOSSARY just shows on its own. */
  var GLOSS = (typeof GLOSSARY !== "undefined") ? GLOSSARY : {};

  /* What a book runs on comes from "substance", split at the em
     dash: the name before it, the description after. Keeping it
     derived means there is only ever one place to write it. */
  function splitSubstance(s) {
    if (!s || !s.substance) return null;
    var parts = String(s.substance).split(" \u2014 ");
    return { name: parts[0].trim(), gloss: parts.slice(1).join(" \u2014 ").trim() };
  }

  function turnsOf(s) {
    var p = splitSubstance(s);
    return p ? p.name : "";
  }

  function matches(s, door, key, turns) {
    return (!door || s.door === door) &&
           (!key || s.key === key) &&
           (!turns || turnsOf(s) === turns);
  }

  /* Order follows first appearance in the list rather than the
     alphabet — the series' own order is the meaningful one. */
  function fieldOptions(field, book, door, key) {
    var seen = [], out = [];
    STORIES.forEach(function (s) {
      var v = s[field];
      if (!v || seen.indexOf(v) !== -1) return;
      if (door && s.door !== door) return;
      if (key && s.key !== key) return;
      seen.push(v);
      out.push({ name: v, gloss: (GLOSS[book] || {})[v] || "" });
    });
    return out;
  }

  function turnsOptions(door, key) {
    var seen = [], out = [];
    STORIES.forEach(function (s) {
      var p = splitSubstance(s);
      if (!p || !p.name || seen.indexOf(p.name) !== -1) return;
      if (door && s.door !== door) return;
      if (key && s.key !== key) return;
      seen.push(p.name);
      out.push(p);
    });
    return out;
  }

  /* ---- The menu itself --------------------------------------
     One component, three instances. "inline" runs the name and its
     meaning together on a line, which suits the short glosses of
     Door and Key; without it the meaning sits under the name on its
     own lines, which is what the sentence-length third menu needs.
     Keyboard and screen-reader behaviour follows the listbox pattern. */

  var openMenu = null;

  function makeCombo(cfg) {
    var root = document.getElementById(cfg.root);
    var btn = document.getElementById(cfg.btn);
    var listEl = document.getElementById(cfg.list);
    var valueEl = document.getElementById(cfg.value);
    if (!root || !btn || !listEl || !valueEl) return null;

    var options = [], items = [], activeIndex = -1;
    var api = { value: "", gloss: "" };

    function render(target, opt) {
      target.textContent = "";
      var name = document.createElement("span");
      name.className = "combo-name";
      name.textContent = opt.name || cfg.allLabel;
      target.append(name);
      if (opt.name && opt.gloss) {
        var gloss = document.createElement("span");
        gloss.className = "combo-gloss";
        gloss.textContent = cfg.inline ? "\u2014 " + opt.gloss : opt.gloss;
        target.append(gloss);
      }
    }

    function paint() {
      render(valueEl, { name: api.value, gloss: api.gloss });
      btn.classList.toggle("is-set", Boolean(api.value));
    }

    function build() {
      listEl.textContent = "";
      items = [];
      [{ name: "", gloss: "" }].concat(options).forEach(function (opt) {
        var li = document.createElement("li");
        li.className = "combo-opt";
        li.setAttribute("role", "option");
        li.dataset.value = opt.name;
        var chosen = opt.name === api.value;
        li.setAttribute("aria-selected", chosen ? "true" : "false");
        if (chosen) li.classList.add("is-chosen");
        render(li, opt);
        li.addEventListener("click", function () {
          choose(opt);
          close(true);
        });
        listEl.append(li);
        items.push(li);
      });
    }

    function choose(opt) {
      api.value = opt.name || "";
      api.gloss = opt.name ? (opt.gloss || "") : "";
      paint();
      if (cfg.onChange) cfg.onChange();
    }

    function markActive(i) {
      items.forEach(function (el, n) { el.classList.toggle("is-active", n === i); });
      activeIndex = i;
      if (items[i] && items[i].scrollIntoView) {
        items[i].scrollIntoView({ block: "nearest" });
      }
    }

    function isOpen() { return !listEl.hidden; }

    function open() {
      if (openMenu && openMenu !== api) openMenu.close(false);
      listEl.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      openMenu = api;
      var at = -1;
      items.forEach(function (el, n) { if (el.dataset.value === api.value) at = n; });
      markActive(at === -1 ? 0 : at);
    }

    function close(refocus) {
      listEl.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      markActive(-1);
      if (openMenu === api) openMenu = null;
      if (refocus) btn.focus();
    }

    btn.addEventListener("click", function () {
      if (isOpen()) close(false); else open();
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { if (isOpen()) close(true); return; }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" &&
          e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (!isOpen()) { open(); return; }
      if (e.key === "Enter" || e.key === " ") {
        var el = items[activeIndex];
        if (el) {
          var name = el.dataset.value;
          var found = null;
          options.forEach(function (o) { if (o.name === name) found = o; });
          choose(found || { name: "", gloss: "" });
        }
        close(true);
        return;
      }
      markActive(Math.min(items.length - 1,
        Math.max(0, activeIndex + (e.key === "ArrowDown" ? 1 : -1))));
    });

    /* Clicking anywhere else puts the list away. */
    document.addEventListener("click", function (e) {
      if (isOpen() && !root.contains(e.target)) close(false);
    });

    api.setOptions = function (list) {
      options = list;
      var still = false;
      options.forEach(function (o) { if (o.name === api.value) { still = true; api.gloss = o.gloss; } });
      if (!still) { api.value = ""; api.gloss = ""; }
      paint();
      build();
    };
    api.clear = function () { api.value = ""; api.gloss = ""; paint(); build(); };
    api.close = close;

    paint();
    return api;
  }

  var doorMenu = makeCombo({
    root: "filterDoor", btn: "doorBtn", list: "doorList", value: "doorValue",
    allLabel: "All Doors", inline: true, onChange: function () { refresh(); }
  });

  var keyMenu = makeCombo({
    root: "filterKey", btn: "keyBtn", list: "keyList", value: "keyValue",
    allLabel: "All Keys", inline: true, onChange: function () { refresh(); }
  });

  var turnsMenu = makeCombo({
    root: "filterTurns", btn: "turnsBtn", list: "turnsList", value: "turnsValue",
    allLabel: "Anything", inline: false, onChange: function () { applyFilter(); }
  });

  /* Rebuild the downstream menus, then filter. Called after any
     change, so the three can never disagree with each other. A
     selection the narrowed menu no longer offers is dropped rather
     than left showing something the list isn't obeying. */
  function refresh() {
    keyMenu.setOptions(fieldOptions("key", "keys", doorMenu.value, ""));
    turnsMenu.setOptions(turnsOptions(doorMenu.value, keyMenu.value));
    applyFilter();
  }

  function applyFilter() {
    var door = doorMenu.value, key = keyMenu.value, turn = turnsMenu.value;
    var shown = 0;

    rows.forEach(function (r) {
      var ok = matches(r.story, door, key, turn);
      r.el.classList.toggle("filtered-out", !ok);
      if (ok) shown++;
    });

    /* A series heading stays only while at least one of its books does. */
    groupRows.forEach(function (g) {
      var any = g.group.books.some(function (n) {
        return byNum[n] && matches(byNum[n], door, key, turn);
      });
      g.el.classList.toggle("filtered-out", !any);
    });

    /* Give whatever is now on top the hairline the first row had. */
    var first = true;
    Array.prototype.forEach.call(list.children, function (el) {
      var hidden = el.classList.contains("filtered-out");
      el.classList.toggle("first-visible", !hidden && first);
      if (!hidden) first = false;
    });

    var filtering = Boolean(door || key || turn);
    noMatch.hidden = shown !== 0;
    resetBtn.disabled = !filtering;
    if (countEl) {
      countEl.textContent = filtering
        ? shown + " of " + STORIES.length + " stories"
        : COUNT_TEXT;
    }
  }

  if (doorMenu && keyMenu && turnsMenu) {
    doorMenu.setOptions(fieldOptions("door", "doors", "", ""));
    resetBtn.addEventListener("click", function () {
      doorMenu.clear();
      keyMenu.clear();
      turnsMenu.clear();
      refresh();
    });
    refresh();
  } else if (countEl) {
    countEl.textContent = COUNT_TEXT;
  }

  /* Open straight onto a shared link, and follow the back button. */
  openFromHash();
  window.addEventListener("hashchange", function () {
    if (!openFromHash()) unpin();
  });

  /* ---- 4. Nav: About / Author's Notes on hover -------------- */

  var stageFor = { about: "panel-about", notes: "panel-notes" };

  navLinks.forEach(function (link) {
    var target = stageFor[link.dataset.stage];

    if (canHover) {
      link.addEventListener("mouseenter", function () {
        clearTimeout(hideTimer);
        showPanel(target);
      });
      link.addEventListener("mouseleave", function () {
        if (pinned) restorePinned(); else showPanel(DEFAULT_PANEL);
      });
      link.addEventListener("focus", function () { showPanel(target); });
      link.addEventListener("blur", function () {
        if (pinned) restorePinned(); else showPanel(DEFAULT_PANEL);
      });
      link.addEventListener("click", function (e) { e.preventDefault(); });
    } else {
      /* Touch: tapping swaps the stage, as before */
      link.addEventListener("click", function (e) {
        e.preventDefault();
        showPanel(target);
        navLinks.forEach(function (l) {
          l.setAttribute("aria-current", l === link ? "true" : "false");
        });
      });
    }
  });

  /* ---- 5. Ambient sound ------------------------------------ */

  /* Each scene has its own track, keyed by the data-scene the head
     script set. A scene with no entry here simply plays nothing.
     The <audio> tag carries loop, so a track repeats until muted. */
  var TRACK_FOR_SCENE = {
    "0": "assets/ambient.mp3",           /* the window room */
    "1": "assets/ambient-tearoom.mp3?v=3" /* the tea room in the rain */
  };

  var audio = document.getElementById("ambient");
  var toggle = document.getElementById("soundToggle");
  var vol = document.getElementById("volSlider");

  var scene = document.documentElement.getAttribute("data-scene") || "0";
  var track = TRACK_FOR_SCENE[scene] || "";

  if (track) {
    audio.src = track;
  } else {
    /* Nothing for this scene — stop the tag reaching for a file that
       isn't there, and retire the controls rather than leave dead ones. */
    audio.removeAttribute("src");
    toggle.hidden = true;
    vol.hidden = true;
  }

  var muted = true;                /* silence by default — the speaker
                                      button is the invitation */

  /* Ears hear loudness logarithmically, so a slider mapped straight
     to audio.volume feels dead across its top half. Squaring the
     value spreads the audible change evenly along the bar. */
  function levelFor(v) {
    var x = Math.max(0, Math.min(100, v)) / 100;
    return x * x;
  }

  function applyVolume() {
    audio.volume = levelFor(vol.value);
  }

  applyVolume();

  var waveOn = document.getElementById("waveOn");
  var waveOff = document.getElementById("waveOff");

  function paint() {
    /* set inline so the swap works even if the stylesheet is stale */
    waveOn.style.display = muted ? "none" : "";
    waveOff.style.display = muted ? "" : "none";
    toggle.classList.toggle("muted", muted);
    toggle.setAttribute("aria-pressed", muted ? "false" : "true");
    toggle.title = muted ? "Play music" : "Mute music";
  }

  function play() {
    return audio.play().catch(function () { /* awaiting a gesture */ });
  }

  /* Nothing plays until asked. The first press of the speaker
     button is the gesture browsers require, so playback starts
     reliably from there. */
  paint();

  toggle.addEventListener("click", function () {
    muted = !muted;
    if (muted) audio.pause(); else play();
    paint();
  });

  vol.addEventListener("input", function () {
    applyVolume();
    var silent = Number(vol.value) === 0;

    /* Sliding to zero mutes (and shows the crossed speaker);
       sliding back up brings the music straight back. */
    if (silent !== muted) {
      muted = silent;
      if (muted) audio.pause(); else play();
      paint();
    } else if (!muted && audio.paused) {
      play();
    }
  });
})();
