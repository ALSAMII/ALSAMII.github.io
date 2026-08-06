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
  var setImgs = easelSet.querySelectorAll("img");
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
    return "triptych-" + t.title.toLowerCase()
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

  function showFeature(s, num, pdf, cover) {
    clearTimeout(hideTimer);
    feature.classList.remove("trio");
    ftLink.style.display = "";
    panels.forEach(function (p) { p.classList.remove("is-active"); });
    ftMeta.textContent = num + " \u00b7 " + s.title +
      (s.words ? " \u00b7 " + s.words : "") +
      (readingTime(s.words) ? " \u00b7 " + readingTime(s.words) : "");
    ftText.textContent = s.synopsis;
    ftLink.setAttribute("href", pdf);
    ftLink.setAttribute("target", "_blank");
    ftLink.setAttribute("rel", "noopener");
    easel.style.display = "";
    easel.alt = s.title + " — cover";
    if (easel.getAttribute("src") !== cover) easel.src = cover;
    feature.classList.add("show");
  }

  function showTrilogy(t) {
    clearTimeout(hideTimer);
    panels.forEach(function (p) { p.classList.remove("is-active"); });
    feature.classList.add("trio");
    ftMeta.textContent = "A Triptych \u00b7 " + t.title;
    ftText.textContent = t.synopsis;
    ftLink.style.display = "none";
    t.books.forEach(function (n, i) {
      setImgs[i].style.display = "";
      setImgs[i].alt = "";
      setImgs[i].onerror = function () { setImgs[i].style.display = "none"; };
      setImgs[i].src = coverFor(n);
    });
    feature.classList.add("show");
  }

  /* Leaving a book starts a short grace period, so the reader can
     move the mouse onto the feature and click the PDF link. If a book
     is pinned, the stage falls back to it instead of the theme text. */
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (pinned) restorePinned(); else showPanel("panel-about");
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
    showPanel("panel-about");
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
    label.textContent = "A Triptych";

    var title = document.createElement("h2");
    title.className = "t-title";
    title.textContent = t.title;

    var syn = document.createElement("div");
    syn.className = "synopsis";
    var minis = document.createElement("div");
    minis.className = "minis";
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

  var countEl = document.getElementById("shelfCount");
  if (countEl) {
    countEl.textContent = STORIES.length + " stories \u00b7 more coming";
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
        if (pinned) restorePinned(); else showPanel("panel-about");
      });
      link.addEventListener("focus", function () { showPanel(target); });
      link.addEventListener("blur", function () {
        if (pinned) restorePinned(); else showPanel("panel-about");
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

  var audio = document.getElementById("ambient");
  var toggle = document.getElementById("soundToggle");
  var vol = document.getElementById("volSlider");

  var muted = false;               /* music is on by default */

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

  /* Browsers won't let audio start unprompted, so if the initial
     attempt is blocked we arm it: the visitor's first click, tap,
     or keypress anywhere starts the music. */
  function arm() {
    if (!audio.paused || muted) return;
    var go = function () {
      document.removeEventListener("pointerdown", go);
      document.removeEventListener("keydown", go);
      if (!muted) play();
    };
    document.addEventListener("pointerdown", go);
    document.addEventListener("keydown", go);
  }

  paint();
  play().then(function () { if (audio.paused) arm(); });
  arm();

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
