/* ============================================================
   This file builds the story list from stories.js and runs
   the page's behaviour. You should never need to edit it —
   add stories in stories.js instead.

   What it does:
   1. Builds the sidebar list from the STORIES array.
      Files are found by number automatically: story 01 uses
      pdfs/01.pdf and covers/01.jpg unless a story block in
      stories.js names its own "pdf" or "cover".
   2. Hovering a story shows its cover + synopsis in the panel
      under the list (on phones, tapping the eye expands it
      inline under the title instead)
   3. The top nav swaps the stage between Home / About / Notes
   4. The speaker button plays assets/ambient.mp3, if present
   ============================================================ */

(function () {
  "use strict";

  var panels = document.querySelectorAll(".panel");
  var navLinks = document.querySelectorAll("[data-stage]");
  var canHover = window.matchMedia("(hover: hover)").matches;
  var pinned = "panel-home";

  function show(id) {
    panels.forEach(function (p) {
      p.classList.toggle("is-active", p.id === id);
    });
  }

  /* ---- 1. Build the list from stories.js ------------------- */

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

  var cpImg = document.getElementById("cpImg");
  var cpMeta = document.getElementById("cpMeta");
  var cpText = document.getElementById("cpText");
  var cpLink = document.getElementById("cpLink");
  var coverPanel = document.getElementById("coverPanel");

  /* If a cover image is missing, hide the frame rather than
     showing a broken-image icon. */
  cpImg.addEventListener("error", function () { cpImg.style.display = "none"; });

  function showInPanel(s, num, pdf, cover) {
    cpImg.style.display = "";
    cpImg.src = cover;
    cpImg.alt = s.title + " — cover";
    cpMeta.textContent = num + " \u00b7 " + s.title + (s.words ? " \u00b7 " + s.words : "");
    cpText.textContent = s.synopsis;
    cpLink.setAttribute("href", pdf);
    coverPanel.classList.add("show");
  }

  STORIES.forEach(function (s, i) {
    var num = String(s.num || i + 1).padStart(2, "0");
    var pdf = s.pdf || "pdfs/" + num + ".pdf";
    var cover = s.cover || "covers/" + num + ".jpg";

    var li = document.createElement("li");
    li.className = "story";

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

    /* Inline synopsis used on phones: little cover + text */
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

    /* ---- 2. Synopsis behaviour for this story -------------- */

    if (canHover) {
      /* Desktop: hovering (or keyboard focus) fills the panel
         under the list. It stays until another story replaces
         it, so the reader can move the mouse to the panel. */
      li.addEventListener("mouseenter", function () { showInPanel(s, num, pdf, cover); });
      li.addEventListener("focusin", function () { showInPanel(s, num, pdf, cover); });
    } else {
      /* Touch: the eye expands the synopsis inline. */
      eye.addEventListener("click", function () {
        var open = li.classList.toggle("open");
        eye.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  });

  /* Start with the first story's cover on display. */
  if (canHover && STORIES.length) {
    var f0 = STORIES[0];
    var n0 = String(f0.num || 1).padStart(2, "0");
    showInPanel(f0, n0, f0.pdf || "pdfs/" + n0 + ".pdf",
                f0.cover || "covers/" + n0 + ".jpg");
  }

  /* ---- 3. Nav ---------------------------------------------- */

  var stageFor = { home: "panel-home", about: "panel-about", notes: "panel-notes" };

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      pinned = stageFor[link.dataset.stage];
      show(pinned);
      navLinks.forEach(function (l) {
        l.setAttribute("aria-current", l === link ? "true" : "false");
      });
      if (link.dataset.stage === "home" && !canHover) {
        document.getElementById("stories").scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---- 4. Ambient sound ------------------------------------ */

  var audio = document.getElementById("ambient");
  var toggle = document.getElementById("soundToggle");

  toggle.addEventListener("click", function () {
    if (audio.paused) {
      audio.volume = 0.35;
      audio.play().then(function () {
        toggle.setAttribute("aria-pressed", "true");
      }).catch(function () {
        toggle.setAttribute("aria-pressed", "false");
      });
    } else {
      audio.pause();
      toggle.setAttribute("aria-pressed", "false");
    }
  });
})();
