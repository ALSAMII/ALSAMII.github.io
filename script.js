/* ============================================================
   BACKDROP ROTATION
   A scene is chosen at random every time the page loads, never
   repeating the one shown immediately before it.
   To add a scene: drop the image into assets/backdrops/ and
   add its path to this list. To retire one, remove its line.
   ============================================================ */

var BACKDROPS = [
  "assets/backdrops/01.jpg",
  "assets/backdrops/02.jpg",
  "assets/backdrops/03.jpg",
  "assets/backdrops/04.jpg",
  "assets/backdrops/05.jpg",
  "assets/backdrops/06.jpg",
  "assets/backdrops/07.jpg"
];



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
   ============================================================ */

(function () {
  "use strict";

  /* ---- Backdrop for this visit ----------------------------- */
  if (BACKDROPS.length) {
    var idx = Math.floor(Math.random() * BACKDROPS.length);

    /* Avoid showing the same scene twice in a row on refresh. */
    try {
      var last = sessionStorage.getItem("lastBackdrop");
      if (BACKDROPS.length > 1 && last !== null && Number(last) === idx) {
        idx = (idx + 1 + Math.floor(Math.random() * (BACKDROPS.length - 1)))
              % BACKDROPS.length;
      }
      sessionStorage.setItem("lastBackdrop", String(idx));
    } catch (e) { /* private browsing — a plain random pick is fine */ }

    var atmos = document.querySelector(".atmosphere");
    if (atmos) {
      /* Set immediately — no waiting, so nothing else can flash
         first. The second layer is a fallback the browser paints
         only if the chosen scene is missing. */
      atmos.style.backgroundImage =
        'url("' + BACKDROPS[idx] + '"), url("' + BACKDROPS[0] + '")';
    }
  }

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
    ftMeta.textContent = num + " \u00b7 " + s.title + (s.words ? " \u00b7 " + s.words : "");
    ftText.textContent = s.synopsis;
    ftLink.setAttribute("href", pdf);
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
     move the mouse onto the feature and click the PDF link. */
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { showPanel("panel-about"); }, 400);
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
    list.append(li);

    if (canHover) {
      li.addEventListener("mouseenter", function () { showTrilogy(t); });
      li.addEventListener("mouseleave", scheduleHide);
      li.addEventListener("focusin", function () { showTrilogy(t); });
      li.addEventListener("focusout", function (e) {
        if (!li.contains(e.relatedTarget)) scheduleHide();
      });
    } else {
      li.addEventListener("click", function () { li.classList.toggle("open"); });
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
    title.textContent = s.title;

    var pdfBtn = document.createElement("a");
    pdfBtn.className = "icon-btn";
    pdfBtn.href = pdf;
    pdfBtn.title = "Read the PDF";
    pdfBtn.setAttribute("aria-label", s.title + " — PDF");
    pdfBtn.innerHTML = PDF_ICON;

    var eye = document.createElement("button");
    eye.className = "icon-btn eye";
    eye.type = "button";
    eye.title = "Synopsis";
    eye.setAttribute("aria-expanded", "false");
    eye.setAttribute("aria-label", s.title + " — synopsis");
    eye.innerHTML = EYE_ICON;

    row.append(numEl, title, pdfBtn, eye);

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
    list.append(li);

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

  /* ---- 3. Nav: About / Author's Notes on hover -------------- */

  var stageFor = { about: "panel-about", notes: "panel-notes" };

  navLinks.forEach(function (link) {
    var target = stageFor[link.dataset.stage];

    if (canHover) {
      link.addEventListener("mouseenter", function () {
        clearTimeout(hideTimer);
        showPanel(target);
      });
      link.addEventListener("mouseleave", function () { showPanel("panel-about"); });
      link.addEventListener("focus", function () { showPanel(target); });
      link.addEventListener("blur", function () { showPanel("panel-about"); });
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

  /* ---- 4. Ambient sound ------------------------------------ */

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
