/* ============================================================
   This file builds the story list from stories.js and runs
   the page's behaviour. You should never need to edit it —
   add stories in stories.js instead.

   What it does:
   1. Builds the sidebar list from the STORIES array
   2. Hovering a story shows its synopsis on the stage
      (on phones, tapping the eye expands it inline instead)
   3. The top nav swaps the stage between Home / About / Notes
   4. The speaker button plays assets/ambient.mp3, if present
   ============================================================ */

(function () {
  "use strict";

  var panels = document.querySelectorAll(".panel");
  var navLinks = document.querySelectorAll("[data-stage]");
  var canHover = window.matchMedia("(hover: hover)").matches;

  /* Which panel is "pinned" — shown when nothing is hovered */
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

  STORIES.forEach(function (s, i) {
    var num = String(i + 1).padStart(2, "0");

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

    var pdf = document.createElement("a");
    pdf.className = "icon-btn";
    pdf.href = s.pdf;
    pdf.title = "Read the PDF";
    pdf.setAttribute("aria-label", s.title + " — PDF");
    pdf.innerHTML = PDF_ICON;

    var eye = document.createElement("button");
    eye.className = "icon-btn eye";
    eye.type = "button";
    eye.title = "Synopsis";
    eye.setAttribute("aria-expanded", "false");
    eye.setAttribute("aria-label", s.title + " — synopsis");
    eye.innerHTML = EYE_ICON;

    row.append(numEl, title, pdf, eye);

    var syn = document.createElement("div");
    syn.className = "synopsis";
    syn.textContent = s.synopsis;

    li.append(row, syn);
    list.append(li);

    /* ---- 2. Synopsis behaviour for this story -------------- */

    function stageSynopsis() {
      document.getElementById("synMeta").textContent =
        "Synopsis \u00b7 " + num + (s.words ? " \u00b7 " + s.words : "");
      document.getElementById("synTitle").textContent = s.title;
      document.getElementById("synText").textContent = s.synopsis;
      document.getElementById("synLink").setAttribute("href", s.pdf);
      show("panel-synopsis");
    }

    if (canHover) {
      /* Desktop: hover (or keyboard focus) shows it on the stage,
         leaving returns to whatever panel was pinned. */
      li.addEventListener("mouseenter", stageSynopsis);
      li.addEventListener("mouseleave", function () { show(pinned); });
      li.addEventListener("focusin", stageSynopsis);
      li.addEventListener("focusout", function (e) {
        if (!li.contains(e.relatedTarget)) show(pinned);
      });
    } else {
      /* Touch: the eye expands the synopsis inline, under the row. */
      eye.addEventListener("click", function () {
        var open = li.classList.toggle("open");
        eye.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  });

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
        /* No assets/ambient.mp3 yet — quietly do nothing. */
        toggle.setAttribute("aria-pressed", "false");
      });
    } else {
      audio.pause();
      toggle.setAttribute("aria-pressed", "false");
    }
  });
})();
