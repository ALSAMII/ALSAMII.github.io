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
      the theme text back. (On phones, tapping the title expands
      the synopsis inline instead.)
   3. Hovering About or Author's Notes in the nav reveals those
      texts; moving away brings the theme text back.
   4. The speaker button plays assets/ambient-tearoom.mp3, if present.

   Door, Room and Key read widest to narrowest. Only Door is a menu:
   at nine rooms and thirty-five keys the other two had stopped being
   a choice and become a list, so they now appear beside each book
   instead. Door and Room take their one-line meanings from GLOSSARY;
   Key is derived from the "key" field, split at the em dash — the
   name before it, the description after.

   Note: one DOM id and CSS class still carry the older word
   "substance" (#ftSubstance, .feature-substance). They are only
   handles. What they hold is the Door / Room / Key block.
   ============================================================ */

(function () {
  "use strict";

  /* ---- 1. Build the list from stories.js ------------------- */

  var panels    = document.querySelectorAll(".panel");
  var navLinks  = document.querySelectorAll("[data-stage]");
  var canHover  = window.matchMedia("(hover: hover)").matches;
  var easel     = document.getElementById("easelImg");
  var easelSet  = document.getElementById("easelSet");
  var feature   = document.getElementById("feature");
  var ftMeta    = document.getElementById("ftMeta");
  var ftText    = document.getElementById("ftText");
  var ftLink    = document.getElementById("ftLink");
  var hideTimer = null;
  var navHideTimer = null;   /* separate clock for the nav links, below */

  var TRIOS = (typeof TRILOGIES !== "undefined") ? TRILOGIES : [];

  /* Which series a book belongs to, and where it stands in it. Built
     once: a row needs to say "Les Folies, the second of three" without
     the reader having to remember what heading they scrolled past. */
  var SERIES_OF = {};

  TRIOS.forEach(function (t) {
    (t.books || []).forEach(function (n, i) {
      SERIES_OF[n] = {
        title: t.title,
        place: String(i + 1),
        of: t.books.length,
        /* Whether the row says which one of how many. A cycle that has
           to be read in order earns it; a group of standalones does
           not, and saying "2 of 4" of books that share nothing but a
           preoccupation tells a reader they have started in the wrong
           place. Set per series in stories.js. */
        numbered: t.numbered !== false,
        first: i === 0,
        last: i === t.books.length - 1
      };
    });
  });
  var trioByFirst = {}, inTrio = {};
  TRIOS.forEach(function (t) {
    trioByFirst[t.books[0]] = t;
    t.books.forEach(function (n) { inTrio[n] = true; });
  });

  /* Pictures are requested by plain filename, so replacing one — a new
     series banner, a new scene — leaves every returning reader looking
     at the copy their browser already holds. The three ?v= links in
     index.html never covered this, because they only tag the stylesheet
     and the two scripts.

     The number is read off this script's own src rather than typed
     again here, so raising the cache-buster in index.html, which is
     already the habit after any change, now refreshes the artwork too
     and there is no second number to remember. */
  var ASSET_V = (function () {
    var el = document.currentScript ||
             document.querySelector('script[src*="script.js"]');
    var m = el && el.getAttribute("src") &&
            el.getAttribute("src").match(/[?&]v=([^&]+)/);
    return m ? m[1] : "";
  })();

  function stamped(url) {
    if (!ASSET_V || !url || /^(data:|https?:)/.test(url)) return url;
    return url + (url.indexOf("?") === -1 ? "?v=" : "&v=") + ASSET_V;
  }

  function coverFor(n) { return "covers/" + String(n).padStart(2, "0") + ".jpg"; }

  /* Split a title that carries its Persian into the two scripts, so
     each can be given a line of its own. Everything up to the first
     Arabic letter is the English; everything from there is the
     Persian. Any separator left stranded on the end of the English —
     the middle dot in "From the Delgosha \u00b7 az Delgosha" — comes off
     with it, because a separator earns its keep on one line and
     dangles on two. A title with no Persian in it is not split. */
  function splitScripts(str) {
    var m = /[\u0600-\u06FF\u0750-\u077F]/.exec(str || "");
    if (!m) return null;
    var en = str.slice(0, m.index).replace(/[\s\u00b7\u2013\u2014\-:,]+$/, "");
    var fa = str.slice(m.index).trim();
    return en && fa ? { en: en, fa: fa } : null;
  }


  /* ---- Artwork: WebP first, the original as a safety net --------------
     Every painting on the site is a photograph-like image, and WebP
     carries those at roughly half the bytes of a JPEG and a twentieth
     of a PNG with no visible difference. Rather than rename anything
     in the markup, each picture asks for the .webp beside it and drops
     back to the file actually named if that is not there yet.

     This means the site behaves identically before and after the
     conversion script has been run — the only cost while the .webp
     files are missing is one failed request per picture, which the
     browser then remembers for the rest of the visit.

     order:  <name>.webp  ->  <name>.jpg|.png  ->  the book's cover
                                                ->  nothing at all */
  function webpTwin(url) {
    return url ? url.replace(/\.(jpe?g|png)$/i, ".webp") : url;
  }

  function loadArt(img, original, lastResort) {
    if (!img || !original) return;

    var chain = [];
    var webp = webpTwin(original);
    if (webp !== original) chain.push(webp);
    chain.push(original);
    if (lastResort && lastResort !== original) chain.push(lastResort);

    var at = 0;
    img.decoding = "async";
    img.addEventListener("error", function () {
      at += 1;
      if (at < chain.length) { img.src = stamped(chain[at]); return; }
      /* Out of fallbacks. Flagged rather than removed here, so a caller
         that wants to take away more than the picture — a banner row
         dropping its whole frame — can act on the last failure instead
         of on the first. */
      img.dataset.artDone = "1";
      img.remove();
    });
    img.src = stamped(chain[0]);
  }

  /* The folder index.html is served from, with a trailing slash. At
     the domain root this is just "/", but it keeps share links right
     if the site is ever previewed from a subfolder. */
  function basePath() {
    return location.pathname.replace(/[^/]*$/, "");
  }

  /* The one-line meaning beside each Door and Room. Optional: a name
     with no entry in GLOSSARY just shows on its own. */
  var GLOSS = (typeof GLOSSARY !== "undefined") ? GLOSSARY : {};

  /* Room and Key are both written as "Name — what it's like". They
     belong to one book each, so there is no shared list behind them —
     each field carries its own meaning, split here at the em dash. */
  function splitPair(v) {
    if (!v) return null;
    var parts = String(v).split(" \u2014 ");
    return { name: parts[0].trim(), gloss: parts.slice(1).join(" \u2014 ").trim() };
  }

  /* Door, Room and Key as three labelled lines. Room and Key are no
     longer menus — there are far too many of each to pick from — so
     this is where a reader meets them: beside the cover, for the book
     actually in front of them. Built once, used on the stage and in
     the phone's inline synopsis both. */
  /* The three readings, as a band of their own: a name, three squares
     with the level filled in, and the words for that level. Kept apart
     from the Door / Room / Key block above it, because it answers a
     different question — not what the book is, but what it will do to
     you. A book with no notes simply gets no band. */
  function notesEl(s) {
    var scales = (GLOSS.notes || []);
    if (!s || !Array.isArray(s.notes) || !scales.length) return null;

    var wrap = document.createElement("div");
    wrap.className = "notes";

    scales.forEach(function (scale, i) {
      var level = s.notes[i];
      if (!level) return;

      var row = document.createElement("div");
      row.className = "note-row";

      /* A button, not a span: the label explains what the dial measures,
         which a reader needs on a pointer and on a phone alike. Hover
         opens it on a mouse; a tap opens it on touch. */
      var name;
      if (scale.about) {
        name = document.createElement("button");
        name.type = "button";
        name.className = "note-name caps has-about";
        name.setAttribute("aria-expanded", "false");

        var about = document.createElement("span");
        about.className = "note-about";
        about.textContent = scale.about;

        var label = document.createElement("span");
        label.textContent = scale.name;

        name.append(label, about);
        name.addEventListener("click", function (e) {
          e.stopPropagation();
          var open = name.getAttribute("aria-expanded") === "true";
          /* One at a time — two open bubbles would overlap. */
          wrap.querySelectorAll(".has-about[aria-expanded='true']")
              .forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
          name.setAttribute("aria-expanded", open ? "false" : "true");
        });
      } else {
        name = document.createElement("span");
        name.className = "note-name caps";
        name.textContent = scale.name;
      }

      var meter = document.createElement("span");
      meter.className = "note-meter";
      meter.setAttribute("role", "img");
      meter.setAttribute("aria-label", scale.name + ": " + level + " of 3");
      for (var k = 1; k <= 3; k++) {
        var box = document.createElement("span");
        box.className = "note-box" + (k <= level ? " is-lit" : "");
        meter.append(box);
      }

      var word = document.createElement("span");
      word.className = "note-word";
      word.textContent = scale.levels[level - 1] || "";

      row.append(name, meter, word);
      wrap.append(row);
    });

    return wrap.childNodes.length ? wrap : null;
  }

  function triadEl(s) {
    var wrap = document.createElement("div");
    wrap.className = "tri";
    var rp = splitPair(s.room), kp = splitPair(s.key);
    var rows = [
      ["Door", s.door,             (GLOSS.doors || {})[s.door]],
      ["Room", rp ? rp.name : "",  rp ? rp.gloss : ""],
      ["Key",  kp ? kp.name : "",  kp ? kp.gloss : ""]
    ];
    rows.forEach(function (r) {
      if (!r[1]) return;
      var row = document.createElement("span");
      row.className = "tri-row";
      var term = document.createElement("span");
      term.className = "tri-term caps";
      term.textContent = r[0];
      var def = document.createElement("span");
      def.className = "tri-def";
      def.textContent = r[2] ? r[1] + " \u2014 " + r[2] : r[1];
      row.append(term, def);
      wrap.append(row);
    });
    return wrap;
  }

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
     tells a reader something. 200 wpm is a more generous estimate
     than the 250 this used to run at — comfortable literary-fiction
     pace rather than a brisk one; a page is counted as roughly 275
     words. */

  function readingTime(words) {
    if (!words) return "";
    var n = parseInt(String(words).replace(/[^0-9]/g, ""), 10);
    if (!n) return "";
    if (/page/i.test(words)) n = n * 275;
    var mins = Math.round(n / 200);
    if (mins < 60) return mins + " min read";
    var hrs = mins / 60;
    /* Round to the nearest half hour — false precision helps nobody. */
    var rounded = Math.round(hrs * 2) / 2;
    return (rounded % 1 ? rounded.toFixed(1) : rounded) +
      (rounded === 1 ? " hour read" : " hours read");
  }

  /* The stage rests on About: it's the reader's guide, so a first
     visit lands on it and every hover returns to it. Hovering a book
     or opening the Notes swaps it out; letting go brings it back. */
  var stage = document.querySelector(".stage");
  var DEFAULT_PANEL = "panel-about";
  var pinned = null;   /* the book or group currently held on the stage */

  /* The stage scrolls, and About is long enough to scroll a long
     way. A reader who has gone down the Pick a Door list and then
     opens the Notes was being shown the middle of nothing: the new
     panel is short, it starts at the top of the stage, and the
     stage was still parked a thousand pixels below it.

     So the stage returns to the top whenever what stands on it
     changes. "auto" rather than "smooth": this is a cut between two
     things, not a journey, and a half-second glide down the length
     of the About panel is a worse answer than simply being there.

     Guarded, because on a phone the stage does not scroll — it is
     overflow: visible and the page scrolls instead, and resetting
     that would throw the reader back to the masthead. */
  function stageToTop() {
    if (!stage) return;
    if (stage.scrollHeight > stage.clientHeight + 1) {
      stage.scrollTop = 0;
    }
  }

  function showPanel(id) {
    var wasFeature = feature.classList.contains("show");
    feature.classList.remove("show");

    var activate = function () {
      if (feature.classList.contains("show")) return;  /* superseded */
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.id === id);
      });
      stageToTop();
    };

    /* If the cover was up, let it fade before the text arrives,
       so the two never sit on top of each other. */
    if (wasFeature) setTimeout(activate, 300); else activate();
  }

  /* The Door / Room / Key block under a book's synopsis on the stage.
     A book missing all three simply doesn't get one. */
  var ftSub = document.getElementById("ftSubstance");

  function setTriad(s) {
    if (!ftSub) return;
    ftSub.textContent = "";
    if (!s || (!s.door && !s.room && !s.key)) { ftSub.hidden = true; return; }
    ftSub.hidden = false;
    /* Notes above the triad, as in the shelf below: whether a book is
       for you, then where it sits in the Reach. */
    var n = notesEl(s);
    if (n) ftSub.append(n);
    ftSub.append(triadEl(s));
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
    setTriad(s);
    ftLink.setAttribute("href", pdf);
    ftLink.setAttribute("target", "_blank");
    ftLink.setAttribute("rel", "noopener");

    /* And the other way round: a series leaves its row of spines
       behind, so clear those before the single cover goes back up. */
    easelSet.textContent = "";
    easelSet.removeAttribute("data-count");
    easelSet.classList.remove("many");

    easel.style.display = "";
    easel.alt = s.title + " — cover";
    easelCaption = num + " \u00b7 " + s.title;
    var stampedCover = stamped(cover);
    if (easel.getAttribute("src") !== stampedCover) easel.src = stampedCover;

    feature.classList.add("show");
    stageToTop();
  }

  /* The small line above a group's title. stories.js can set its own
     with a "label" field. Leave the field out and a group of three
     says "A Triptych", anything else "A Series". Set it to an empty
     string and no label is shown at all. */
  function groupLabel(t) {
    if (typeof t.label === "string") return t.label;
    return t.books.length === 3 ? "A Triptych" : "A Series";
  }

  function showTrilogy(t) {
    clearTimeout(hideTimer);
    panels.forEach(function (p) { p.classList.remove("is-active"); });
    feature.classList.add("trio");

    var lab = groupLabel(t);
    ftMeta.textContent = lab ? lab + " \u00b7 " + t.title : t.title;
    ftText.textContent = t.synopsis;
    setTriad(null);
    ftLink.style.display = "none";

    /* Put the single cover away. It belongs to whichever book was on
       the stage a moment ago, and nothing here was clearing it — so
       opening a series after looking at a book left that book's cover
       standing beside the series' own synopsis, which is how Black
       Out came to be illustrating Thursday Nights. showFeature turns
       it back on, so this only has to hide it. */
    easel.style.display = "none";
    easel.removeAttribute("src");

    /* Built fresh each time, so a group can hold any number of books.

       "many" rather than a count, for the same reason the shelf row
       uses it: the stylesheet used to name data-count 4 and 5, and
       when the Delgoshā reached six those rules simply stopped
       matching. The set kept the triptych's large covers on one
       unwrapped line, overran the stage and was pushed below the
       synopsis — a series growing by one book should not be able to
       do that. Over three is over three, at any number. */
    easelSet.textContent = "";
    easelSet.setAttribute("data-count", t.books.length);
    easelSet.classList.toggle("many", t.books.length > 3);
    t.books.forEach(function (n) {
      var im = document.createElement("img");
      im.alt = "";
      im.addEventListener("error", function () { im.remove(); });
      im.src = stamped(coverFor(n));
      easelSet.append(im);
    });

    feature.classList.add("show");
  }

  /* Leaving a book starts a short grace period, so the reader can
     move the mouse onto the feature and click the PDF link.

     Then the stage goes back to About — always. It used to fall back
     to the pinned book instead, which is why a book's synopsis could
     seem stuck: clicking a title pins it, and from that point every
     hover-away restored the pin rather than the guide. Nothing was
     holding on to the hover; the pin was being put back.

     So a pinned book is let go here rather than restored. unpin()
     clears the marker on the row and the address in the bar as well,
     so nothing is left half-held: what the reader sees, the row and
     the URL all say the same thing.

     Pinning still does its job everywhere it matters — a book is
     still pinned when the page is opened on its own address, so a
     shared link lands on the book. And the SHARE button beside each
     row is the real way to get that address; it does not depend on
     this at all. */
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (pinned) unpin(); else showPanel(DEFAULT_PANEL);
    }, 400);
  }

  feature.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
  feature.addEventListener("mouseleave", scheduleHide);

  var easelCaption = "";
  makeCoverOpen(easel, "");
  easel.addEventListener("click", function () {
    if (easelCaption && lightboxCap) lightboxCap.textContent = easelCaption;
  });

  easel.addEventListener("error", function () {
    /* Missing cover: show the synopsis alone */
    easel.style.display = "none";
  });

  var PDF_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0' +
    ' 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';

  var READ_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true"><path d="M12 6.5v13"/>' +
    '<path d="M12 6.5C10.5 5 8.5 4.5 6 4.5H3v13h3c2.5 0 4.5.5 6 2"/>' +
    '<path d="M12 6.5C13.5 5 15.5 4.5 18 4.5h3v13h-3c-2.5 0-4.5.5-6 2"/></svg>';

  var SHARE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true"><circle cx="18" cy="5" r="3"/>' +
    '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>' +
    '<path d="M8.6 10.5l6.8-4"/><path d="M8.6 13.5l6.8 4"/></svg>';

  var AUDIO_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true"><path d="M4 14v-3a8 8 0 0 1 16 0v3"/>' +
    '<rect x="2" y="14" width="5" height="7" rx="1.5"/>' +
    '<rect x="17" y="14" width="5" height="7" rx="1.5"/></svg>';

  /* The two icons are not self-explanatory — one opens the PDF, one
     unfolds the synopsis — so each carries a word underneath. */
  function iconLabel(text) {
    var el = document.createElement("span");
    el.className = "icon-label caps";
    el.textContent = text;
    return el;
  }

  var list = document.querySelector(".shelf ol");

  /* Filled as the list is built; the filter works from these. */
  var rows      = [];   /* one entry per book row */
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

  /* Bringing a book to the reader.

     On a mouse, pinning is right: the stage swaps to the book and the
     panel behind it steps aside. On touch there is no stage feature —
     .feature is display:none below 56rem — so pinning would empty the
     stage and take the About panel with it, leaving nothing behind when
     the reader scrolls back up. There, the row simply unfolds in place
     and the panel is left alone. */
  function revealBook(s, writeHash) {
    var li = document.querySelector('[data-slug="' + slugFor(s) + '"]');

    if (canHover) {
      pin({ kind: "book", data: s }, li, writeHash);
    } else {
      if (li) {
        li.classList.add("open");
        var tb = li.querySelector(".title-btn");
        if (tb) tb.setAttribute("aria-expanded", "true");
      }
      if (writeHash && history.replaceState) {
        history.replaceState(null, "", "#" + slugFor(s));
      }
    }

    if (li && li.scrollIntoView) li.scrollIntoView({ block: "center" });
  }

  /* Scrolling to the book once is not enough on a first visit.

     The covers are lazy, and a picture that has not loaded has no
     height. alignTitles() then re-runs as each one lands and writes
     fresh padding onto every row. So the whole list grows underneath
     the reader after the scroll has already happened, and the book
     slides away from the middle of the screen. The further down the
     list a book sits the more rows there are above it to grow, which
     is why the newest book drifts furthest — and why a second visit,
     with the covers already in cache, lands perfectly and hides the
     fault.

     So the book is held in the middle until the layout stops moving:
     re-centred whenever it has drifted, for a few seconds, and let go
     the instant the reader scrolls, taps or types. Never fights a
     deliberate scroll, and does nothing at all when nothing shifts. */
  function keepCentred(el) {
    if (!el || !el.scrollIntoView) return;
    var stop = false;
    var until = Date.now() + 4000;
    var last = null;
    function release() { stop = true; }
    ["wheel", "touchstart", "pointerdown", "keydown"].forEach(function (t) {
      window.addEventListener(t, release, { once: true, passive: true });
    });
    (function tick() {
      if (stop || Date.now() > until) return;
      var top = el.getBoundingClientRect().top;
      /* Whether it drifted, not whether it is exactly centred. The
         newest book is the last row on the page, so the document often
         cannot scroll far enough to centre it at all — measuring
         against the middle would then correct it every tenth of a
         second, forever, and never once succeed.

         behavior:"auto" on purpose: if the stylesheet ever turns on
         smooth scrolling, a correction mid-glide would read as a page
         that cannot sit still. */
      if (last !== null && Math.abs(top - last) > 2) {
        el.scrollIntoView({ block: "center", behavior: "auto" });
        top = el.getBoundingClientRect().top;
      }
      last = top;
      setTimeout(tick, 100);
    })();
  }

  function openFromHash() {
    var slug = decodeURIComponent(String(location.hash).replace(/^#/, ""));
    if (!slug) return false;
    var entry = bySlug[slug];
    if (!entry) return false;
    var el = document.querySelector('[data-slug="' + slug + '"]');
    if (canHover) {
      pin(entry, el, false);
    } else if (el) {
      /* Touch has no stage: unfold in place, panel untouched. */
      el.classList.add("open");
    }
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ block: "center" });
      keepCentred(el);
    }
    return true;
  }

  function buildTrilogyHead(t) {
    var li = document.createElement("li");
    li.className = "trilogy";
    li.tabIndex = 0;

    var lab = groupLabel(t);
    var label = null;
    if (lab) {
      label = document.createElement("p");
      label.className = "t-label caps";
      label.textContent = lab;
    }

    var title = document.createElement("h2");
    var parts = splitScripts(t.title);
    title.className = "t-title" + (parts ? " has-nastaliq" : "");
    if (parts) {
      /* Two lines, always: the English sets its own, and the Persian
         starts a new one underneath rather than running on from
         wherever the English happened to wrap. Left as one string it
         broke wherever the column ran out — "From the / Delgosha \u00b7
         az / Delgosha" — which put half the Persian on a line with
         English and the other half alone. */
      var en = document.createElement("span");
      en.className = "t-en";
      en.textContent = parts.en;
      var fa = document.createElement("span");
      fa.className = "t-fa";
      fa.setAttribute("dir", "rtl");
      fa.setAttribute("lang", "fa");
      fa.textContent = parts.fa;
      title.append(en, fa);
    } else {
      title.textContent = t.title;
    }

    var syn = document.createElement("div");
    syn.className = "synopsis";

    /* The covers stand beside the heading, in the space that was
       empty — a series should show what is in it before it is opened,
       the same way the rows below show a book by its cover. */
    var head = document.createElement("div");
    head.className = "t-head";

    var words = document.createElement("div");
    words.className = "t-words";
    if (label) words.append(label);
    words.append(title);

    /* A series with a painted banner shows that instead of its spines:
       seven covers in a row would be a row of stamps, where the
       panorama is one picture of the world they share. */
    var set = document.createElement("div");
    if (t.banner) {
      li.classList.add("has-banner");
      set.className = "t-banner";
      var bn = document.createElement("img");
      bn.alt = t.title;
      bn.loading = "lazy";
      bn.setAttribute("fetchpriority", "low");
      /* Through loadArt, so a banner asks for its .webp first like the
         scenes and the series covers already do. A panorama is the
         largest single picture on the shelf — this one is 235 KB as a
         JPEG and 161 KB as WebP — and it was the last thing still
         fetching the heavy file. If neither exists the row drops the
         picture and keeps its spines, which is what it did before. */
      loadArt(bn, t.banner);
      bn.addEventListener("error", function () {
        if (bn.dataset.artDone === "1") set.remove();
      });
      set.append(bn);
    } else {
      set.className = "t-covers" + (t.books.length > 3 ? " many" : "");
      t.books.forEach(function (n) {
        var im = document.createElement("img");
        im.src = stamped(coverFor(n));
        im.alt = "";
        im.loading = "lazy";
        im.addEventListener("error", function () { im.remove(); });
        set.append(im);
      });
    }

    head.append(words, set);

    var txt = document.createElement("span");
    txt.textContent = t.synopsis;
    syn.append(txt);

    li.append(head, syn);
    li.dataset.slug = trioSlug(t);
    list.append(li);
    groupRows.push({ group: t, el: li });

    li.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;

      if (!canHover) {
        /* Touch: open and close in place. Pinning here would clear the
           stage, and on a phone there is nothing to put in its place. */
        var open = li.classList.toggle("open");
        if (history.replaceState) {
          history.replaceState(null, "",
            open ? "#" + trioSlug(t) : location.pathname + location.search);
        }
        return;
      }

      if (pinned && pinned.kind === "trio" && pinned.data === t) unpin();
      else pin({ kind: "trio", data: t }, li, true);
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

  /* ---- The order the shelf is built in -----------------------
     A series is one block. It stands where its first book stands and
     holds every book it lists, in the order it lists them — and only
     those. That last part only started mattering when a series
     stopped being consecutive: The Delgoshā Notebooks is 68 and 70,
     and No. 69 sits between them belonging to nothing.

     Walking STORIES straight through put 69 physically inside the
     block, under the heading and between two indented rows, which
     said it was the middle book of a series it has nothing to do
     with. A number is not a membership.

     So members are gathered to their heading, and a book that is not
     one is emitted at its own turn — which, once the block above has
     taken the numbers it owns, puts it directly after the block. It
     costs one book its exact place in the numbering. That is the
     cheaper of the two errors: a reader can see 69 is out of step,
     and could not see that it was never in the series. */
  var SHELF = (function () {
    var out = [], placed = {};
    STORIES.forEach(function (s) {
      if (placed[s.num]) return;
      var t = trioByFirst[s.num];
      if (t) {
        out.push({ head: t });
        t.books.forEach(function (n) {
          if (!byNum[n] || placed[n]) return;
          out.push({ story: byNum[n] });
          placed[n] = true;
        });
        return;
      }
      out.push({ story: s });
      placed[s.num] = true;
    });
    return out;
  })();

  SHELF.forEach(function (entry, i) {
    if (entry.head) { buildTrilogyHead(entry.head); return; }
    var s = entry.story;

    var num   = String(s.num || i + 1).padStart(2, "0");
    var pdf   = s.pdf   || "pdfs/" + num + ".pdf";
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
    titleBtn.setAttribute("aria-label", s.title + " \u2014 show on the stage");

    /* A chevron says the title opens. Only where tapping is the way
       in: under a cursor the synopsis arrives on hover, and a mark
       promising something the reader already has would only mislead.
       Marked hidden from screen readers — aria-expanded on the button
       already says the same thing, and says it better. */
    if (!canHover) {
      var caret = document.createElement("span");
      caret.className = "title-caret";
      caret.setAttribute("aria-hidden", "true");
      caret.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 9l6 6 6-6"/></svg>';
      titleBtn.append(caret);
    }

    title.append(titleBtn);

    var head = document.createElement("div");
    head.className = "story-head";
    head.append(title);

    var pdfBtn = document.createElement("a");
    pdfBtn.className = "icon-btn";
    pdfBtn.href = pdf;
    pdfBtn.title = "Read the PDF";
    pdfBtn.setAttribute("aria-label", s.title + " — PDF (opens in a new tab)");
    /* New tab: the reader keeps the room open behind the story. */
    pdfBtn.target = "_blank";
    pdfBtn.rel = "noopener";
    pdfBtn.innerHTML = PDF_ICON;
    pdfBtn.append(iconLabel("PDF"));

    /* The recording, offered as a download beside the PDF — only for
       the books that have one. Most don't yet, so this is absent from
       the column entirely rather than shown disabled. */
    var audioBtn = null;
    if (s.audio) {
      audioBtn = document.createElement("a");
      audioBtn.className = "icon-btn";
      audioBtn.href = s.audio;
      audioBtn.download = "";
      audioBtn.title = "Download the audio";
      audioBtn.setAttribute("aria-label", s.title + " — download the audio");
      audioBtn.innerHTML = AUDIO_ICON;
      audioBtn.append(iconLabel("Audio"));
    }

    /* Title, then the hook and the reading time under it. Thirty-five
       bare titles told a new visitor nothing; this is what they scroll
       past, so it is where the book has to make its case. */
    var main = document.createElement("div");
    main.className = "story-main";
    main.append(head);

    var sub = document.createElement("p");
    sub.className = "story-sub";

    if (s.hook) {
      var hook = document.createElement("span");
      hook.className = "story-hook";
      hook.textContent = s.hook;
      sub.append(hook);
    }
    var rt = readingTime(s.words);
    if (rt) {
      var time = document.createElement("span");
      time.className = "story-time caps";
      time.textContent = rt;
      sub.append(time);
    }
    /* A book inside a series says so on its own row: the heading it
       belongs to may be several screens back by the time it is read,
       and "Doubling Time" sitting under Les Folies looked like a
       fourth Folie. */
    var series = SERIES_OF[s.num];
    if (series) {
      var mark2 = document.createElement("span");
      mark2.className = "story-series caps";
      /* The English half of the name only.

         This line is a footnote on a book's row — it says which
         shelf the book belongs to, under the reading time, in small
         caps at eleven pixels. The series HEADING a few rows up
         carries the Persian, at size, where it can be read; repeating
         it here in nastaliq at this size was a second and worse
         setting of the same words on every row that has a series. The
         name in one script is enough for a footnote.

         splitScripts does the trimming: it hands back the English with
         the separator taken off the end, and the Persian, which is
         dropped. A Latin-only title has no split and is used whole.

         The isolates stay. The title is fenced — U+2068 in front,
         U+2069 behind — and the count is fenced separately. There
         is no right-to-left run left on this line to need them, but
         they cost nothing, and the day a name carries a Persian word
         inside its English half they are what stops "2 of 2" coming
         out as "2 ... OF 2". */
      var sparts = splitScripts(series.title);
      /* An unnumbered series says its name and stops. See numbered in
         SERIES_OF above for why four of them do. */
      var count = series.numbered
        ? " \u00b7 \u2068" + series.place + " of " + series.of + "\u2069"
        : "";
      mark2.textContent = "\u2068" + (sparts ? sparts.en : series.title) +
                          "\u2069" + count;
      sub.append(mark2);
    }

    if (sub.childNodes.length) main.append(sub);

    /* Share: hands over a link that opens straight onto this book.
       The address the site writes when a book is opened is the same
       one used here, so what a reader sends is what they were looking
       at. Where the device has a share sheet it gets used; everywhere
       else the link goes to the clipboard and the label says so. */
    var shareBtn = document.createElement("button");
    shareBtn.className = "icon-btn share";
    shareBtn.type = "button";
    shareBtn.title = "Share this book";
    shareBtn.setAttribute("aria-label", s.title + " — copy a link to this book");
    /* The mark is back: share stands in a column with PDF and Read
       now, and without one of its own its word would not line up with
       theirs. */
    shareBtn.innerHTML = SHARE_ICON;
    var shareLabel = iconLabel("Share");
    shareBtn.append(shareLabel);

    shareBtn.addEventListener("click", function () {
      /* Not the #slug address the site uses for itself. Everything
         after a # stays in the browser and never reaches a server, so
         a preview crawler asking about that link is only ever shown
         the front page — which is why every book used to share the
         same forest picture. /share/<slug>.html is a real page carrying
         this book's cover, and it sends a reader straight on to the
         book. Built by build-share-pages.js. */
      var url = location.origin + basePath() + "share/" + slugFor(s) + ".html";

      /* A word in place of the label, then back — no alert to dismiss
         and nothing that moves the row. */
      var say = function (word) {
        shareLabel.textContent = word;
        shareBtn.classList.add("shared");
        clearTimeout(shareBtn._t);
        shareBtn._t = setTimeout(function () {
          shareLabel.textContent = "Share";
          shareBtn.classList.remove("shared");
        }, 1600);
      };

      if (navigator.share) {
        navigator.share({ title: s.title + " — Chew Z", url: url })
          .catch(function () { /* dismissed: nothing to report */ });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(function () { say("Copied"); })
          .catch(function () { say("Copy failed"); });
      } else {
        /* Older Safari, and any page not served over https. */
        var tmp = document.createElement("input");
        tmp.value = url;
        document.body.append(tmp);
        tmp.select();
        try { document.execCommand("copy"); say("Copied"); }
        catch (e) { say("Copy failed"); }
        tmp.remove();
      }
    });

    /* Share sits with the reading time rather than under the cover:
       it belongs with the words about the book, and it keeps its place
       when the row opens. Appended here, where the button exists —
       above, var would have handed us an empty box. */
    /* The left margin of the row: the cover. A shelf of books ought to look like
       one — the covers are the reason anybody stops scrolling. */
    var mark = document.createElement("div");
    mark.className = "story-mark";

    var rowImg = document.createElement("img");
    rowImg.className = "row-cover";
    rowImg.src = cover;
    rowImg.alt = "";
    rowImg.loading = "lazy";
    rowImg.addEventListener("error", function () { rowImg.remove(); });
    makeCoverOpen(rowImg, num + " \u00b7 " + s.title);

    mark.append(rowImg);

    /* Read here, rather than downloading the object. First of the two,
       because it is what most people want and the PDF is the keepsake. */
    var readBtn = document.createElement("button");
    readBtn.className = "icon-btn read";
    readBtn.type = "button";
    readBtn.title = "Read here";
    readBtn.setAttribute("aria-label", s.title + " \u2014 read here");
    readBtn.innerHTML = READ_ICON;
    readBtn.append(iconLabel("Read"));
    readBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openReader(s);
    });

    /* No synopsis button. The title opens the synopsis on touch and
       shows it on the stage under a cursor, so an eye beside it was a
       second way to do a thing already done — and a row has only so
       much room before the controls stop being read at all. The title
       carries the expanded state in its place. */
    var eye = null;
    titleBtn.setAttribute("aria-expanded", "false");

    /* The two things you can do with a book, in one column down the
       right, under its number: download it, or read it here. */
    var acts = document.createElement("div");
    acts.className = "story-acts";
    /* The number crowns the column: the top right was the one piece of
       empty space in the row, and a numbered series should wear its
       numbers where they can be seen. */
    /* PDF, then read, then share at the foot: two ways into the book
       and then the way to hand it on. The number has left this column
       for the title, so the three sit at the top of the row. */
    /* The number closes the column, below the three actions: set
       plainly and large, it reads as the plate number of the volume
       rather than as a fourth thing to press. */
    acts.append(pdfBtn, readBtn);
    if (audioBtn) acts.append(audioBtn);
    acts.append(shareBtn, numEl);

    row.append(mark, main, acts);

    var syn = document.createElement("div");
    syn.className = "synopsis";

    /* No cover here any more — it stands in the row above, and
       repeating it only pushed the reading matter down the screen.
       Door, Room and Key take the full width instead, side by side. */
    var synHead = document.createElement("div");
    synHead.className = "syn-head";
    synHead.append(triadEl(s));

    var synText = document.createElement("span");
    synText.textContent = s.synopsis;
    /* The order a stranger needs, not the order the catalogue was
       built in: what the book is about, then whether it is for them,
       then where it sits in the Reach. The synopsis first because the
       three terms below it name things the reader has not met yet —
       "Halo" means nothing until the story has introduced it. */
    syn.append(synText);

    var notes = notesEl(s);
    if (notes) syn.append(notes);

    syn.append(synHead);

    /* Inside the row, not after it. The row is a grid, and as a child
       the synopsis can take the two left columns on a second line
       while the actions keep the right-hand column beside it — which
       is what closes the gap that opened under a short title when the
       icons were stacked three deep. */
    row.append(syn);

    li.append(row);
    if (series) {
      li.classList.add("in-series");
      if (series.first) li.classList.add("series-first");
      if (series.last) li.classList.add("series-last");
    }

    li.dataset.slug = slugFor(s);
    list.append(li);

    /* Everything a reader might half-remember about this book, in one
       lowercase string: the title, the hook, the synopsis, the room and
       key, its door, its number — and, if it belongs to one, the series
       title, so "unwitnessed" finds all five.

       The series synopsis is deliberately left out. It names Rwanda,
       Ukraine and the rest, which would make a search for "rwanda"
       return the whole cycle instead of the one book set there. */
    var group = null;
    TRIOS.forEach(function (t) { if (t.books.indexOf(s.num) !== -1) group = t; });
    var hay = [s.title, s.hook, s.synopsis, s.room, s.key, s.door, s.words,
               String(s.num), num,
               group ? group.title : ""]
      .join(" ").toLowerCase();

    rows.push({ story: s, el: li, hay: hay });

    /* Clicking the title pins the book to the stage and puts its
       address in the bar, so the link can be copied and shared.
       Clicking it again lets go. */
    titleBtn.addEventListener("click", function () {
      if (!canHover) {
        /* Touch: a plain open/close toggle. Nothing is pinned, so the
           panel on the stage stays where the reader left it. */
        var open = li.classList.toggle("open");
        titleBtn.setAttribute("aria-expanded", open ? "true" : "false");
        if (history.replaceState) {
          history.replaceState(null, "",
            open ? "#" + slugFor(s) : location.pathname + location.search);
        }
        return;
      }
      if (pinned && pinned.kind === "book" && pinned.data === s) unpin();
      else pin({ kind: "book", data: s }, li, true);
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
    }
  });

  /* Door, Room and Key explain themselves on a tap, the way the dials
     under a synopsis do. On a mouse the hover in the stylesheet has
     already done it; this is for the screens that have no hover. */
  document.querySelectorAll(".guide-term").forEach(function (term) {
    term.addEventListener("click", function () {
      var open = term.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".guide-term[aria-expanded='true']")
              .forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      term.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  /* An open description closes when the reader looks elsewhere. */
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-about")) {
      document.querySelectorAll(".has-about[aria-expanded='true']")
              .forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    }
    if (!e.target.closest(".guide-term")) {
      document.querySelectorAll(".guide-term[aria-expanded='true']")
              .forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    }
  });

  /* ---- A cover, full size -----------------------------------
     Click rather than hover: a hover-opened overlay flickers as the
     pointer crosses it, and a click works the same on a phone. The
     covers are 1000px wide, so this is the only place their detail is
     actually visible. */

  var lightbox      = document.getElementById("lightbox");
  var lightboxImg   = document.getElementById("lightboxImg");
  var lightboxCap   = document.getElementById("lightboxCap");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxFrom  = null;

  function openCover(src, caption, opener) {
    if (!lightbox || !src) return;
    lightboxFrom = opener || null;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "";
    if (lightboxCap) lightboxCap.textContent = caption || "";
    lightbox.hidden = false;
    document.body.classList.add("gallery-on");
    requestAnimationFrame(function () { lightbox.classList.add("show"); });
    if (lightboxClose) lightboxClose.focus();
  }

  function closeCover() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove("show");
    document.body.classList.remove("gallery-on");
    setTimeout(function () { lightbox.hidden = true; }, 260);
    if (lightboxFrom && lightboxFrom.focus) lightboxFrom.focus();
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target === lightboxImg) closeCover();
    });
    if (lightboxClose) lightboxClose.addEventListener("click", closeCover);
  }

  /* Every cover on the page opens it, wherever it happens to sit. */
  function makeCoverOpen(img, caption) {
    if (!img) return;
    img.classList.add("cover-open");
    img.setAttribute("role", "button");
    img.setAttribute("tabindex", "0");
    img.title = "See the cover full size";
    var go = function (e) {
      e.stopPropagation();
      e.preventDefault();
      openCover(img.getAttribute("src"), caption, img);
    };
    img.addEventListener("click", go);
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") go(e);
    });
  }

  /* ---- 3. All Covers --------------------------------------- */

  var gallery      = document.getElementById("gallery");
  var galleryGrid  = document.getElementById("galleryGrid");
  var galleryOpen  = document.getElementById("galleryOpen");
  var galleryClose = document.getElementById("galleryClose");
  var lastFocus    = null;

  function buildGallery() {
    galleryGrid.textContent = "";
    STORIES.forEach(function (s) {
      var n = String(s.num).padStart(2, "0");

      var coverSrc = stamped(s.cover || coverFor(s.num));

      /* A plain wrapper, not itself a button: it holds two separate
         controls — the card (cover, title, time) that goes to the
         book, and a small zoom button riding over the corner of the
         art. A button can't contain another button, so the zoom
         control is this element's second child, not nested inside
         the first — laid over the art with CSS, not the DOM. */
      var card = document.createElement("div");
      card.className = "gcard";

      var open = document.createElement("button");
      open.type = "button";
      open.className = "gcard-open";
      open.setAttribute("aria-label", s.title + " — show on the stage");

      var frame = document.createElement("span");
      frame.className = "gcard-frame";

      var img = document.createElement("img");
      img.src = coverSrc;
      img.alt = s.title + " — cover";
      img.loading = "lazy";
      img.addEventListener("error", function () { card.classList.add("no-art"); });

      frame.append(img);

      var cap = document.createElement("span");
      cap.className = "gcard-title";
      cap.textContent = n + " \u00b7 " + s.title;

      var meta = document.createElement("span");
      meta.className = "gcard-meta caps";
      meta.textContent = readingTime(s.words);

      open.append(frame, cap, meta);
      open.addEventListener("click", function () {
        closeGallery();
        revealBook(s, true);
      });

      var zoom = document.createElement("button");
      zoom.type = "button";
      zoom.className = "gcard-zoom";
      zoom.setAttribute("aria-label", "View the " + s.title + " cover full size");
      zoom.title = "View full size";
      zoom.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ' +
        'aria-hidden="true"><circle cx="10.3" cy="10.3" r="6.3"/>' +
        '<path d="M10.3 7.6v5.4M7.6 10.3h5.4"/>' +
        '<path d="M19.4 19.4l-4.3-4.3"/></svg>';
      zoom.addEventListener("click", function (e) {
        e.stopPropagation();
        openCover(coverSrc, n + " \u00b7 " + s.title, zoom);
      });

      card.append(open, zoom);
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
    if (lightbox && !lightbox.hidden) closeCover();
    else if (!gallery.hidden) closeGallery();
    else if (pinned) unpin();
  });

  buildGallery();

  /* ---- 3b. The Door filter ---------------------------------
     Built from the door field in stories.js, so a new book with a
     new door needs no edit here.

     Room and Key were menus once. At nine rooms and thirty-five keys
     that stopped being a choice and became a list, so they moved to
     where they do more good: beside the book itself. Door is broad
     enough to stay a way in.

     Not a native <select>. An option list is drawn by the operating
     system, which means its font, colours and highlight ignore the
     stylesheet entirely. So it is a button and a listbox, built here. */

  var resetBtn = document.getElementById("filterReset");
  var noMatch  = document.getElementById("noMatch");
  var countEl  = document.getElementById("shelfCount");
  var COUNT_TEXT = STORIES.length + " stories \u00b7 more coming";

  var query = "";

  function matches(r, door) {
    if (door && r.story.door !== door) return false;
    if (!query) return true;
    /* Every word has to appear somewhere — so "rwanda marsh" narrows
       rather than widening, which is what a reader expects. */
    return query.split(/\s+/).every(function (w) { return r.hay.indexOf(w) !== -1; });
  }

  /* Order follows first appearance in the list rather than the
     alphabet — the series' own order is the meaningful one. */
  function doorOptions() {
    var seen = [], out = [];
    STORIES.forEach(function (s) {
      if (!s.door || seen.indexOf(s.door) !== -1) return;
      seen.push(s.door);
      out.push({ name: s.door, gloss: (GLOSS.doors || {})[s.door] || "" });
    });
    return out;
  }

  /* ---- The menu itself --------------------------------------
     "inline" runs the name and its meaning together on a line, which
     suits the short door glosses. Keyboard and screen-reader
     behaviour follows the listbox pattern. */

  var openMenu = null;

  function makeCombo(cfg) {
    var root    = document.getElementById(cfg.root);
    var btn     = document.getElementById(cfg.btn);
    var listEl  = document.getElementById(cfg.list);
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

    /* Choose an option by name, as a click would. Used to open the
       shelf on an order other than the blank one. Silently does
       nothing if the name is not among the options, so a renamed
       option can never leave the menu in a state it cannot show. */
    api.select = function (name) {
      var found = null;
      options.forEach(function (o) { if (o.name === name) found = o; });
      if (!found) return false;
      api.value = found.name;
      api.gloss = found.gloss || "";
      paint(); build();
      if (cfg.onChange) cfg.onChange();
      return true;
    };
    api.close = close;

    paint();
    return api;
  }

  var doorMenu = makeCombo({
    root: "filterDoor", btn: "doorBtn", list: "doorList", value: "doorValue",
    allLabel: "All Doors", inline: true, onChange: function () { applyFilter(); }
  });

  var sortMenu = makeCombo({
    root: "filterSort", btn: "sortBtn", list: "sortList", value: "sortValue",
    allLabel: "Series order", inline: true, onChange: function () { applySort(); }
  });

  /* The label above the order menu counts the shelf. It used to be
     typed into index.html, which meant it quietly went stale every
     time a book was added — it read 52 while the catalogue held 55.
     Written from STORIES instead, it can't drift again. */
  (function countShelf() {
    var el = document.getElementById("sortLabel");
    if (el && typeof STORIES !== "undefined" && STORIES.length) {
      el.textContent = "All " + STORIES.length + " stories \u00b7 order";
    }
  })();

  /* ---- The count under the wordmark ---------------------------
     The tagline said "Short Fiction", two inches from a stamp that
     reads PUBLICATION / FICTION and above a page titled Short
     Fiction — the same word three times on one screen, and the one
     slot on the page that a stranger reads before anything else.
     It carries the size of the catalogue instead.

     A numeral here, not the spelled-out form the title and the
     descriptions use: this is a label, like the shelf line above,
     and a label takes a figure. From STORIES.length, so it cannot
     go stale — the whole reason the shelf line was rewritten. */
  (function countBrand() {
    var el = document.getElementById("brandCount");
    if (el && typeof STORIES !== "undefined" && STORIES.length) {
      el.textContent = STORIES.length + " Short Novellas";
    }
  })();

  /* ---- Order --------------------------------------------------
     Three ways through the same shelf. Series order is the blank
     option, so clearing the menu — or the reset button — always
     returns the list to the order the books were written in.

     Length is the biggest practical difference between these books:
     eighteen minutes at one end, over two hours at the other. Newest
     first answers the other common question, which a returning reader
     currently has to scroll the whole shelf to answer. */

  /* The order the shelf opens in. Named once, because three separate
     places have to agree on it: the menu that selects it at startup,
     the reset button that returns to it, and the count line that must
     not mistake it for a filter. */
  var DEFAULT_ORDER = "Newest first";

  var shelfOrder = Array.prototype.slice.call(list.children);

  function minutesOf(s) {
    var n = parseInt(String(s.words).replace(/[^0-9]/g, ""), 10) || 0;
    if (/page/i.test(s.words)) n = n * 275;
    return Math.round(n / 200);
  }

  function applySort() {
    var mode = sortMenu ? sortMenu.value : "";

    /* Whether the group headings are on the shelf at all. The member
       rows carry a rule down their left edge that points up at the
       heading above them, and in the one order that hides the
       headings that rule would be pointing at nothing — so the
       stylesheet takes the group marks off when this is set. */
    list.classList.toggle("groups-hidden", mode === "Shortest first");

    if (!mode) {
      /* Back to the order the shelf was built in, headings and all. */
      shelfOrder.forEach(function (el) { list.append(el); });
      groupRows.forEach(function (g) { g.el.classList.remove("sorted-away"); });
      rows.forEach(function (r) { r.el.classList.remove("flat"); });
    } else if (mode === "Shortest first") {
      /* Length breaks a series apart and there is no honest way round
         it: a group is not a length, so it has no place on a shelf
         ordered by one. The headings step aside and the member books
         lose their indent — a group heading above books that are no
         longer its own would be a lie. */
      groupRows.forEach(function (g) { g.el.classList.add("sorted-away"); });

      rows.slice()
        .sort(function (a, b) { return minutesOf(a.story) - minutesOf(b.story); })
        .forEach(function (r) {
          r.el.classList.add("flat");
          list.append(r.el);
        });

    } else {
      /* Newest first, where a series does have an honest position:
         the book it most recently gained. The group used to be hidden
         here along with the rest, which meant the one order a
         returning reader is most likely to open was also the only one
         that never showed the artwork.

         So the books are laid out newest to oldest, and then each
         series is lifted back in directly above its own newest member
         — the covers first, then that book, then the shelf carries on
         down. A group whose newest book is No. 65 sits at 65, which is
         where a reader looking for what is new would look for it. */
      rows.slice()
        .sort(function (a, b) { return b.story.num - a.story.num; })
        .forEach(function (r) {
          r.el.classList.add("flat");
          list.append(r.el);
        });

      groupRows.forEach(function (g) {
        /* Newest member first, to match the shelf around it. */
        var members = g.group.books.slice().sort(function (a, b) { return b - a; });

        var byRow = {};
        rows.forEach(function (r) { byRow[r.story.num] = r; });

        var anchor = byRow[members[0]];
        if (!anchor) {
          /* Its newest book is not on the shelf — nothing to stand
             above, so it stays out rather than floating. */
          g.el.classList.add("sorted-away");
          return;
        }

        g.el.classList.remove("sorted-away");
        list.insertBefore(g.el, anchor.el);

        /* Then pull the rest of the series up under the heading. The
           sort has laid the shelf out by number, so a series whose
           books are not consecutive has strangers standing between
           them — No. 69 was sitting under the Delgoshā heading,
           indented rows above and below it, because it happens to
           fall between 68 and 70. Gathering the members closes the
           block over them and drops the stranger out of the bottom of
           it, back onto the shelf on its own. */
        var mark = g.el;
        members.forEach(function (n) {
          var r = byRow[n];
          if (!r) return;
          list.insertBefore(r.el, mark.nextSibling);
          mark = r.el;
        });
      });
    }

    applyFilter();   /* the top-of-list hairline has probably moved */
  }

  function applyFilter() {
    var door = doorMenu ? doorMenu.value : "";
    var shown = 0;

    rows.forEach(function (r) {
      var ok = matches(r, door);
      r.el.classList.toggle("filtered-out", !ok);
      if (ok) shown++;
    });

    /* A series heading stays only while at least one of its books does. */
    groupRows.forEach(function (g) {
      var any = rows.some(function (r) {
        return g.group.books.indexOf(r.story.num) !== -1 && matches(r, door);
      });
      g.el.classList.toggle("filtered-out", !any);
    });

    /* Give whatever is now on top the hairline the first row had. */
    var first = true;
    Array.prototype.forEach.call(list.children, function (el) {
      var hidden = el.classList.contains("filtered-out") ||
                   el.classList.contains("sorted-away");
      el.classList.toggle("first-visible", !hidden && first);
      if (!hidden) first = false;
    });

    /* Two different questions, and they used to share one answer.

       The count line reports what is being *hidden*, so only the door
       and the search belong in it. Order does not remove a book. With
       Newest first now the order the shelf opens in, the old test
       counted the default as filtering and the line read "65 of 65
       stories" to every arriving reader — a true sentence that says
       nothing, in place of the one that says the shelf is still
       growing.

       The reset button asks the other question: has anything moved
       since arrival? That one does include the order. */
    var hiding  = Boolean(door) || Boolean(query);
    var changed = hiding ||
                  Boolean(sortMenu && sortMenu.value !== DEFAULT_ORDER);

    noMatch.hidden = shown !== 0;
    resetBtn.disabled = !changed;
    if (countEl) {
      countEl.textContent = hiding
        ? shown + " of " + STORIES.length + " stories"
        : COUNT_TEXT;
    }
  }

  /* ---- Search -------------------------------------------------
     One field over everything: title, hook, synopsis, room, key, door,
     number and series. This is the control that keeps working as the
     shelf grows — a door narrows thirty-seven books to eleven, but a
     word narrows them to the one you were thinking of. */

  var searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      query = searchInput.value.trim().toLowerCase();
      searchInput.classList.toggle("is-set", Boolean(query));
      applyFilter();
    });

    /* Escape clears the field rather than unpinning a book — the reader
       is plainly working in here, not on the stage. */
    searchInput.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !searchInput.value) return;
      e.stopPropagation();
      searchInput.value = "";
      query = "";
      searchInput.classList.remove("is-set");
      applyFilter();
    });
  }

  if (doorMenu) {
    doorMenu.setOptions(doorOptions());
    if (sortMenu) {
      sortMenu.setOptions([
        { name: "Shortest first", gloss: "eighteen minutes up" },
        { name: "Newest first",   gloss: STORIES.length + " down to 1" }
      ]);
      /* The shelf opens on the newest book rather than on No. 1.
         Series order is still the blank option in the menu, so it is
         one click away and still what the list is built in. */
      sortMenu.select(DEFAULT_ORDER);
    }
    resetBtn.addEventListener("click", function () {
      doorMenu.clear();
      /* Reset returns the shelf to how it looked on arrival, which is
         now Newest first — clearing to the blank option would have
         reset it to something the reader had never seen. */
      if (sortMenu && !sortMenu.select(DEFAULT_ORDER)) sortMenu.clear();
      if (searchInput) {
        searchInput.value = "";
        searchInput.classList.remove("is-set");
      }
      query = "";
      applySort();
    });
    applySort();
  } else if (countEl) {
    countEl.textContent = COUNT_TEXT;
  }

  /* The three books recommended on the About panel — the first thing a
     new visitor meets, so each one gets its cover and its reading time.
     Both are filled in here rather than written into index.html, so a
     changed word count can never leave a stale figure on the page.
     Clicking a card pins that book and scrolls the list to it. */
  /* Read once, outside the loop: the topmost picture on the panel, the
     only one that should not be lazy. */
  var firstScene = document.querySelector(".start-row .start-scene");

  document.querySelectorAll("[data-book]").forEach(function (btn) {
    var s = byNum[Number(btn.dataset.book)];
    if (!s) return;

    /* index.html already carries the card's markup — the motif, the
       image, the text. Nothing is built here; only the two things that
       must never be typed by hand get filled in. */
    var slot = btn.querySelector(".start-time");
    if (slot) slot.textContent = readingTime(s.words);

    /* The book's number at the head of a series card's title line, the
       same way the Start Here rows carry theirs. Written here rather
       than typed into index.html so it can never disagree with the
       data-book it sits on. */
    var num = btn.querySelector(".series-num");
    if (num) num.textContent = String(s.num);

    /* The scene: assets/start-NN.jpg, a wide image with no text on it.
       Missing, it falls back to the book's cover; missing that too, the
       card keeps its frame and simply carries no picture. */
    var img = btn.querySelector(".start-scene");
    if (img) {
      var n = String(s.num).padStart(2, "0");

      /* The first card is the top of the page on a phone — it is what a
         new reader is looking at while the rest is still arriving. It
         was being lazy-loaded along with the five below it, which told
         the browser to wait for something already on screen. It is now
         asked for first and hard; everything under it still waits until
         it is nearly in view. */
      if (img === firstScene) {
        img.loading = "eager";
        img.setAttribute("fetchpriority", "high");
      } else {
        img.loading = "lazy";
        img.setAttribute("fetchpriority", "low");
      }

      /* The scene is normally named for the book it belongs to, but a
         row may name its own file with data-scene — useful when a
         picture outlives the book it was first made for. */
      loadArt(img,
              btn.dataset.scene || ("assets/start-" + n + ".jpg"),
              s.cover || coverFor(s.num));
    }

    btn.addEventListener("click", function () { revealBook(s, true); });
  });

  /* The series paintings. Their filenames stay in index.html, on a
     data-art attribute rather than src, so the picture is requested
     once — through loadArt, which gets the WebP if it exists — instead
     of the browser starting the PNG and the script then replacing it.
     They sit well below the fold, so nothing is lost by letting the
     script name them.

     A painting that is not there yet falls back to the book's own
     cover, read off the card's data-book — the same net the Start Here
     scenes use. A series can be featured the day its books go up and
     collect its paintings afterwards; each one takes over the moment
     its file lands in assets/, with no change to the markup. */
  document.querySelectorAll(".series-cover img[data-art], .series-portrait img[data-art]").forEach(function (im) {
    im.loading = "lazy";
    im.setAttribute("fetchpriority", "low");
    /* A dedication portrait stands on no card, so it has no book to
       fall back to; missing, it simply goes. */
    var card = im.closest("[data-book]");
    var book = card ? byNum[Number(card.dataset.book)] : null;
    loadArt(im, im.dataset.art,
            book ? (book.cover || coverFor(book.num)) : null);
  });

  /* The recommended series cards. A card shows the reading time for
     its own book — the one on data-book, which is also the one it
     opens. A card may carry data-books instead, the numbers of a whole
     run, and then it shows the time for all of them together; the
     Ghariban cards did that, and it read as one six-hour book beside a
     title that was a two-hour one. Everything else about the card,
     including the click, is already handled above. */
  document.querySelectorAll(".series-card").forEach(function (card) {
    var slot = card.querySelector(".series-time");
    if (!slot) return;

    var nums = (card.dataset.books || card.dataset.book || "").split(",")
      .map(function (n) { return Number(n.trim()); })
      .filter(function (n) { return n; });

    var total = nums.reduce(function (sum, n) {
      var b = byNum[n];
      return sum + (b ? (parseInt(String(b.words).replace(/[^0-9]/g, ""), 10) || 0) : 0);
    }, 0);

    if (total) slot.textContent = readingTime(total.toLocaleString() + " words");

    /* The span reads "Books 1–2" from the same numbers, so the two can
       never drift apart the way two hand-typed figures would. */
    var span = card.querySelector(".series-books");
    if (span && nums.length) {
      span.textContent = nums.length === 1
        ? "Book " + nums[0]
        : "Books " + nums[0] + "\u2013" + nums[nums.length - 1];
    }
  });

  /* Open straight onto a shared link, and follow the back button.

     A reload is the exception. Opening a book writes its name into the
     address so the page can be linked, and that name outlives the visit
     — so refreshing used to reopen whatever was last read instead of
     starting clean. The browser knows how the page was reached, so a
     reload drops the name and begins at the door; a followed link, a
     typed address, or a press of back still lands on the book. */
  function arrivedByReload() {
    try {
      var nav = performance.getEntriesByType("navigation")[0];
      if (nav && nav.type) return nav.type === "reload";
      /* Older Safari: the deprecated reading, which still answers. */
      if (performance.navigation) return performance.navigation.type === 1;
    } catch (e) { /* fall through — treat it as a fresh arrival */ }
    return false;
  }

  /* A share page hands the reader on with location.replace() and a
     meta refresh behind it. Several browsers — WebKit most reliably —
     file that arrival as a reload rather than as a followed link, so
     the guard below threw away the very name the share page existed to
     deliver, and every shared link opened the front door instead of
     the book it named.

     A redirect leaves a trace a reload does not: the page that sent
     the reader is still in document.referrer, and it is one of ours.
     So an arrival from a share page is a followed link whatever the
     browser wants to call it. */
  function arrivedFromShare() {
    try {
      var r = String(document.referrer || "");
      if (r.indexOf(location.origin) !== 0) return false;
      return /\/(share|b)\/[^\/]+\.html$/.test(r);
    } catch (e) { return false; }
  }

  if (arrivedByReload() && location.hash && !arrivedFromShare()) {
    if (history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    } else {
      location.hash = "";
    }
  }

  openFromHash();
  window.addEventListener("hashchange", function () {
    if (!openFromHash()) unpin();
  });

  /* Every title is set at one size, and a long one wraps. Shrinking
     the few that did not fit left book 18 visibly smaller than its
     neighbours, which read as a fault rather than as a fit.

     The covers are photographs of a book standing up, which means the
     top of the picture is not the top of the book — there is a band of
     empty room above it, and the edge fade thins another sliver. So
     the title is dropped to meet the printed edge rather than the edge
     of the file, or it floats above the book it names.

     A proportion of the cover's own height, so it holds at every
     screen size. Raise COVER_HEADROOM if a future cover has more room
     above the book than these do; lower it if it has less. */
  var COVER_HEADROOM = 0.085;

  function alignTitles() {
    var rows = document.querySelectorAll(".story-row");
    for (var i = 0; i < rows.length; i++) {
      var cover = rows[i].querySelector(".row-cover");
      var main  = rows[i].querySelector(".story-main");
      var btn   = rows[i].querySelector(".title-btn");
      if (!cover || !main || !btn) continue;

      main.style.paddingTop = "0px";
      var cs = window.getComputedStyle(btn);
      var fs = parseFloat(cs.fontSize);
      var lh = parseFloat(cs.lineHeight);

      /* Where the ink of a capital starts inside its line box: half
         the leading, then the gap the font leaves above its caps. */
      var inkTop = (lh - fs) / 2 + fs * 0.14;
      var want = cover.getBoundingClientRect().height * COVER_HEADROOM;
      main.style.paddingTop = Math.max(0, want - inkTop).toFixed(1) + "px";
    }
  }

  alignTitles();

  /* The covers arrive after the list is built — they are lazy, and a
     picture that has not loaded has no height to measure. So the
     alignment is run again as each one lands, and once more when the
     page is fully loaded, for anything served from cache. */
  (function () {
    var pending = null;
    var again = function () {
      clearTimeout(pending);
      pending = setTimeout(alignTitles, 60);
    };
    document.querySelectorAll(".row-cover").forEach(function (img) {
      if (img.complete && img.naturalHeight) return;
      img.addEventListener("load", again, { once: true });
    });
    window.addEventListener("load", again);
  })();
  window.addEventListener("resize", (function () {
    var t = null;
    return function () {
      clearTimeout(t);
      t = setTimeout(alignTitles, 150);
    };
  })());

  /* ---- The reader ---------------------------------------------
     The novella in the room, rather than in a downloaded file. Text
     comes from read/NN.json — the PDFs pulled back into paragraphs by
     build-reader.py — so it reflows to the screen it is on, sets its
     own type size, and remembers where the reader stopped. The PDF
     stays on offer for anyone who wants the typeset object. */
  var reader       = document.getElementById("reader");
  var readerPage   = document.getElementById("readerPage");
  var readerScroll = document.getElementById("readerScroll");
  var readerTitle  = document.getElementById("readerTitle");
  var readerTimeLeft = document.getElementById("readerTimeLeft");
  var readerEnd    = document.getElementById("readerEnd");
  var readerBar    = document.getElementById("readerBar");

  /* The narration player — present in the markup for every book, shown
     only for the ones that have both a recording and sentence timing. */
  var readerAudioBar  = document.getElementById("readerAudioBar");
  var readerPlay      = document.getElementById("readerPlay");
  var readerPlayIcon  = document.getElementById("readerPlayIcon");
  var readerPauseIcon = document.getElementById("readerPauseIcon");
  var readerAudioTrack = document.getElementById("readerAudioTrack");
  var readerAudioFill  = document.getElementById("readerAudioFill");
  var readerAudioTime  = document.getElementById("readerAudioTime");
  var readerAudioEl    = document.getElementById("readerAudioEl");

  var STEPS = [1.05, 1.15, 1.3, 1.45, 1.6];   /* type sizes on offer */
  var readerBook = null;
  var textCache  = {};
  var syncCache  = {};    /* book number -> parsed NN.sync.json, or null */
  var syncTimeline = [];  /* flat, reading-order list of {start, el} for the open book */
  var currentSync  = null;
  var highlightedEl = null;
  var audioSaveTimer = null;
  var wordCountCache = {};  /* book number -> total words, counted once */
  var readerTotalWords = 0; /* for the book currently open */

  /* Average adult silent-reading pace. Nothing about this site tracks
     how fast any one person actually reads — it's a single constant
     used only to turn a word count into a rough estimate, the same
     way an e-reader's "12 min left" is a guess, not a measurement. */
  var WPM = 235;

  function fmtTime(t) {
    t = Math.max(0, Math.floor(t || 0));
    var m = Math.floor(t / 60), sec = t % 60;
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  /* Plain word count across every block, headings and verse included —
     close enough for an estimate, and simpler than trying to weight
     block types differently. */
  function countWords(blocks) {
    var total = 0;
    for (var i = 0; i < blocks.length; i++) {
      var plain = blocks[i].h.replace(/<[^>]+>/g, " ");
      var words = plain.match(/\S+/g);
      if (words) total += words.length;
    }
    return total;
  }

  /* "42 min left", "1h 12m left" — from how far scrolled, against the
     word count taken when the book opened. Approximate on purpose: it
     assumes words are spread evenly through the scroll height, which
     is true enough for prose to be useful and never claims to be more
     than a guess. Blank for anything under a minute of reading left,
     or before a word count exists at all — the element collapses when
     empty, so the bar just carries the title alone in that case. */
  function fmtTimeLeft(fractionDone) {
    if (!readerTotalWords) return "";
    var wordsLeft = readerTotalWords * Math.max(0, 1 - fractionDone);
    var minutes = wordsLeft / WPM;
    if (minutes < 1) return "";
    var mins = Math.round(minutes);
    if (mins < 60) return mins + " min left";
    var h = Math.floor(mins / 60), m = mins % 60;
    return h + "h" + (m ? " " + m + "m" : "") + " left";
  }

  /* read/NN.sync.json exists only for a book that has been through
     build-audio-sync.py. A missing file is the ordinary case, not an
     error — it just means this book has no synced narration yet, and
     is cached as null so a book without one is only ever asked for
     once per visit. */
  function fetchSync(n) {
    if (Object.prototype.hasOwnProperty.call(syncCache, n)) {
      return Promise.resolve(syncCache[n]);
    }
    return fetch(stamped("read/" + n + ".sync.json"))
      .then(function (r) { if (!r.ok) throw new Error("no sync"); return r.json(); })
      .then(function (data) { syncCache[n] = data; return data; })
      .catch(function () { syncCache[n] = null; return null; });
  }

  function readerPref(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function readerSave(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  function applyTypeSize() {
    var i = Number(readerPref("readerSize", 1));
    i = Math.max(0, Math.min(STEPS.length - 1, i));
    readerPage.style.fontSize = STEPS[i] + "rem";
  }

  function nudgeTypeSize(by) {
    var i = Math.max(0, Math.min(STEPS.length - 1,
                                Number(readerPref("readerSize", 1)) + by));
    readerSave("readerSize", i);
    applyTypeSize();
  }

  /* Where they stopped, kept per book as a fraction of the whole. A
     fraction rather than a pixel count, because the type size and the
     width of the screen can both change between one sitting and the
     next, and the place should survive both. */
  function markPlace() {
    if (!readerBook) return;
    var max = readerScroll.scrollHeight - readerScroll.clientHeight;
    var at  = max > 0 ? readerScroll.scrollTop / max : 0;
    readerSave("place:" + readerBook, at.toFixed(4));
    if (readerBar) readerBar.style.width = (at * 100).toFixed(1) + "%";
    if (readerTimeLeft) readerTimeLeft.textContent = fmtTimeLeft(at);
  }

  /* sync is read/NN.sync.json, or null for a book without one — in
     which case every block renders exactly as it always has. Where a
     block does have timing, its sentences are wrapped individually so
     playback can light one up at a time; a block sync had to skip (see
     build-audio-sync.py) falls back to the same plain rendering. */
  function renderBlocks(blocks, sync) {
    var byBlock = {};
    if (sync && sync.blocks) {
      sync.blocks.forEach(function (b) { byBlock[b.i] = b.sentences; });
    }
    var html = "";
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      var tag = b.t === "h" ? "h2" : "p";
      var cls = b.t === "h" ? "r-h" : (b.t === "v" ? "r-v" : "");
      var sentences = byBlock[i];
      var inner = sentences
        ? sentences.map(function (sent) {
            return '<span class="r-sent" data-t="' + sent.start + '">' +
                   sent.html + "</span>";
          }).join(" ")
        : b.h;
      html += "<" + tag + (cls ? ' class="' + cls + '"' : "") + ">" +
              inner + "</" + tag + ">";
    }
    readerPage.innerHTML = html;
  }

  /* Ties the just-rendered spans to the narration: builds the lookup
     used to find "what's playing right now", and shows or hides the
     player itself. Called every time the reader opens a book, whether
     or not that book has a recording. */
  function setupAudio(s, n, sync) {
    syncTimeline = [];
    highlightedEl = null;
    currentSync = (sync && s.audio) ? sync : null;

    readerAudioEl.pause();

    if (!currentSync) {
      readerAudioBar.hidden = true;
      readerAudioEl.removeAttribute("src");
      return;
    }

    document.querySelectorAll("#readerPage .r-sent").forEach(function (el) {
      syncTimeline.push({ start: parseFloat(el.dataset.t), el: el });
    });

    readerAudioBar.hidden = false;
    readerPlayIcon.style.display = "";
    readerPauseIcon.style.display = "none";
    readerAudioFill.style.width = "0%";
    readerAudioTrack.style.setProperty("--pos", "0%");
    readerAudioTrack.setAttribute("aria-valuenow", "0");
    readerAudioTime.textContent = "0:00 / " + fmtTime(currentSync.duration);

    /* A new src always resets playback to the start; the saved spot is
       reapplied as soon as the browser knows how long the file is. */
    readerAudioEl.src = s.audio;
    var savedT = Number(readerPref("audioPlace:" + n, 0));
    if (savedT > 0) {
      readerAudioEl.addEventListener("loadedmetadata", function once() {
        readerAudioEl.removeEventListener("loadedmetadata", once);
        if (readerAudioEl.duration) {
          readerAudioEl.currentTime = Math.min(savedT, Math.max(0, readerAudioEl.duration - 0.5));
        }
      });
    }
  }

  /* Finds the sentence whose start time is the latest one at or before
     t, and lights it up in place of whichever was lit before. Gaps
     between sentences (a breath, a paragraph break) simply leave the
     previous one highlighted until the next begins, which is how a
     listener actually experiences a pause — not as "nothing playing". */
  function updateHighlight(t) {
    if (!syncTimeline.length) return;
    var lo = 0, hi = syncTimeline.length - 1, idx = 0;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (syncTimeline[mid].start <= t) { idx = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    var el = syncTimeline[idx].el;
    if (el === highlightedEl) return;
    if (highlightedEl) highlightedEl.classList.remove("playing");
    el.classList.add("playing");
    highlightedEl = el;

    var r = el.getBoundingClientRect();
    var sr = readerScroll.getBoundingClientRect();
    if (r.top < sr.top + 40 || r.bottom > sr.bottom - 40) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function wordCountFor(n, blocks) {
    if (!Object.prototype.hasOwnProperty.call(wordCountCache, n)) {
      wordCountCache[n] = countWords(blocks);
    }
    return wordCountCache[n];
  }

  function openReader(s) {
    var n = String(s.num).padStart(2, "0");
    readerBook = n;
    readerTitle.textContent = s.title;
    readerEnd.textContent = "End \u00b7 " + s.title;
    readerTotalWords = 0;
    if (readerTimeLeft) readerTimeLeft.textContent = "";
    reader.hidden = false;
    document.body.classList.add("gallery-on");
    applyTypeSize();
    requestAnimationFrame(function () { reader.classList.add("show"); });

    var place = Number(readerPref("place:" + n, 0));
    var settle = function () {
      /* Two frames: one for the text to lay out, one for the browser
         to know how tall it became. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var max = readerScroll.scrollHeight - readerScroll.clientHeight;
          readerScroll.scrollTop = max * place;
          markPlace();
          readerScroll.focus({ preventScroll: true });
        });
      });
    };

    /* Only a book with an audio field ever asks for a sync file \u2014
       every other book skips the request entirely, same as before this
       feature existed. */
    var syncPromise = s.audio ? fetchSync(n) : Promise.resolve(null);

    if (textCache[n]) {
      readerTotalWords = wordCountFor(n, textCache[n]);
      syncPromise.then(function (sync) {
        renderBlocks(textCache[n], sync);
        setupAudio(s, n, sync);
        settle();
      });
      return;
    }

    readerPage.innerHTML = '<p class="r-wait">Opening\u2026</p>';
    /* Stamped, like every other asset. This was the one fetch on the
       site without a version on it, and it did not matter while a
       reader file only ever appeared alongside a book that was new —
       nobody could be holding an old copy of a file that had never
       existed. The first time a published book was re-typeset (No. 85,
       whose last page was rewritten and whose spacing after italics
       was corrected on eight pages) it mattered at once: a reader who
       had opened it before would have gone on being served the old
       text out of their own cache, with nothing to tell either of us. */
    Promise.all([
      fetch(stamped("read/" + n + ".json")).then(function (r) {
        if (!r.ok) throw new Error("no text");
        return r.json();
      }),
      syncPromise
    ])
      .then(function (results) {
        var data = results[0], sync = results[1];
        textCache[n] = data.blocks;
        readerTotalWords = wordCountFor(n, data.blocks);
        renderBlocks(data.blocks, sync);
        setupAudio(s, n, sync);
        settle();
      })
      .catch(function () {
        /* No reading text for this one yet — say so plainly, and
           point at the file that certainly exists. */
        readerAudioBar.hidden = true;
        readerPage.innerHTML =
          '<p class="r-wait">This one isn\u2019t set for reading here yet. ' +
          '<a href="' + (s.pdf || "pdfs/" + n + ".pdf") + '" target="_blank" rel="noopener">' +
          "Open the PDF instead.</a></p>";
      });
  }

  function closeReader() {
    markPlace();
    if (readerAudioEl) readerAudioEl.pause();
    reader.classList.remove("show");
    document.body.classList.remove("gallery-on");
    setTimeout(function () { reader.hidden = true; }, 250);
    readerBook = null;
  }

  if (reader) {
    document.getElementById("readerClose").addEventListener("click", closeReader);
    document.getElementById("readerSmaller").addEventListener("click", function () { nudgeTypeSize(-1); });
    document.getElementById("readerBigger").addEventListener("click", function () { nudgeTypeSize(1); });

    var placeTimer = null;
    readerScroll.addEventListener("scroll", function () {
      clearTimeout(placeTimer);
      placeTimer = setTimeout(markPlace, 120);
    }, { passive: true });

    document.addEventListener("keydown", function (e) {
      if (reader.hidden) return;
      if (e.key === "Escape") closeReader();
    });

    /* Clicking a sentence in the text jumps the narration to it —
       one listener on the page rather than one per span, since the
       page's contents are replaced wholesale on every render. */
    readerPage.addEventListener("click", function (e) {
      var el = e.target.closest ? e.target.closest(".r-sent") : null;
      if (!el || !readerAudioEl.src) return;
      var t = parseFloat(el.dataset.t);
      if (isNaN(t)) return;
      readerAudioEl.currentTime = t;
      updateHighlight(t);
    });

    readerPlay.addEventListener("click", function () {
      if (readerAudioEl.paused) readerAudioEl.play().catch(function () { /* blocked or no src */ });
      else readerAudioEl.pause();
    });

    readerAudioEl.addEventListener("play", function () {
      readerPlayIcon.style.display = "none";
      readerPauseIcon.style.display = "";
    });
    readerAudioEl.addEventListener("pause", function () {
      readerPlayIcon.style.display = "";
      readerPauseIcon.style.display = "none";
    });

    readerAudioEl.addEventListener("timeupdate", function () {
      var t = readerAudioEl.currentTime;
      var d = readerAudioEl.duration;
      if (!d || isNaN(d)) d = currentSync ? currentSync.duration : 0;
      updateHighlight(t);
      if (d > 0) {
        var pct = Math.max(0, Math.min(100, t / d * 100));
        readerAudioFill.style.width = pct.toFixed(2) + "%";
        readerAudioTrack.style.setProperty("--pos", pct.toFixed(2) + "%");
        readerAudioTrack.setAttribute("aria-valuenow", Math.round(pct));
      }
      readerAudioTime.textContent = fmtTime(t) + " / " + fmtTime(d);

      /* Saved the same way the scroll position is: a little after
         things settle, keyed to the book, so a return visit picks up
         roughly where playback stopped. */
      clearTimeout(audioSaveTimer);
      var book = readerBook;
      audioSaveTimer = setTimeout(function () {
        if (book) readerSave("audioPlace:" + book, t.toFixed(1));
      }, 400);
    });

    readerAudioEl.addEventListener("ended", function () {
      if (readerBook) readerSave("audioPlace:" + readerBook, "0");
    });

    /* The seek strip: a click or drag anywhere along it jumps there,
       same gesture as the volume/type-size controls elsewhere in the
       reader. Arrow keys move it five seconds either way, for anyone
       working the reader from a keyboard. */
    var seekFromEvent = function (e) {
      var rect = readerAudioTrack.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      var d = readerAudioEl.duration;
      if (!d || isNaN(d)) d = currentSync ? currentSync.duration : 0;
      if (d > 0) {
        readerAudioEl.currentTime = frac * d;
        updateHighlight(frac * d);
        var pct = (frac * 100).toFixed(2) + "%";
        readerAudioFill.style.width = pct;
        readerAudioTrack.style.setProperty("--pos", pct);
        readerAudioTrack.setAttribute("aria-valuenow", Math.round(frac * 100));
        readerAudioTime.textContent = fmtTime(frac * d) + " / " + fmtTime(d);
      }
    };
    readerAudioTrack.addEventListener("pointerdown", function (e) {
      if (!readerAudioEl.src) return;
      seekFromEvent(e);
      var move = function (e2) { seekFromEvent(e2); };
      var up = function () {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    });
    readerAudioTrack.addEventListener("keydown", function (e) {
      var d = readerAudioEl.duration;
      if (!d || isNaN(d)) d = currentSync ? currentSync.duration : 0;
      if (!d) return;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        readerAudioEl.currentTime = Math.min(d, readerAudioEl.currentTime + 5);
        e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        readerAudioEl.currentTime = Math.max(0, readerAudioEl.currentTime - 5);
        e.preventDefault();
      }
    });
  }



  var stageFor = { about: "panel-about", notes: "panel-notes" };

  /* Leaving a nav link used to drop the panel the instant the cursor
     left it — About is a couple of short paragraphs, so nobody
     noticed, but Author's Notes is six, and a reader whose mouse
     moves off "AUTHOR'S NOTES" on the way down to actually read it
     lost the panel before the first line finished. Same fix as the
     shelf's hover preview below (see scheduleHide): a short grace
     period instead of an instant revert, so the pointer has time to
     land somewhere that counts. */
  function scheduleNavHide() {
    clearTimeout(navHideTimer);
    navHideTimer = setTimeout(function () {
      if (pinned) restorePinned(); else showPanel(DEFAULT_PANEL);
    }, 400);
  }

  navLinks.forEach(function (link) {
    var target = stageFor[link.dataset.stage];

    if (canHover) {
      link.addEventListener("mouseenter", function () {
        clearTimeout(hideTimer);
        clearTimeout(navHideTimer);
        showPanel(target);
      });
      link.addEventListener("mouseleave", scheduleNavHide);
      link.addEventListener("focus", function () {
        clearTimeout(navHideTimer);
        showPanel(target);
      });
      link.addEventListener("blur", scheduleNavHide);
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

  /* The other half of the fix: the grace period above only buys a
     moment to get there. Landing on the panel itself — the actual
     paragraphs — has to hold the hide off for as long as the reader
     is there, the same way hovering the feature already does for a
     book's synopsis (see feature's own mouseenter/mouseleave). */
  if (canHover && stage) {
    stage.addEventListener("mouseenter", function () { clearTimeout(navHideTimer); });
    stage.addEventListener("mouseleave", scheduleNavHide);
  }

  /* ---- Back to the top -------------------------------------
     Only shown once the reader is a screen and a half down, and only
     where the page scrolls at all — on a wide window the frame is a
     fixed height and the list scrolls inside itself, so scrollY stays
     at zero and the button never appears. */

  var toTop = document.getElementById("toTop");

  if (toTop) {
    var TOP_AT = 700;          /* px scrolled before it earns its place */
    var topTicking = false;

    var syncTop = function () {
      topTicking = false;
      var far = window.scrollY > TOP_AT;
      if (far === !toTop.hidden) return;   /* nothing to change */
      if (far) {
        toTop.hidden = false;
        requestAnimationFrame(function () { toTop.classList.add("show"); });
      } else {
        toTop.classList.remove("show");
        setTimeout(function () {
          if (window.scrollY <= TOP_AT) toTop.hidden = true;
        }, 300);
      }
    };

    window.addEventListener("scroll", function () {
      if (topTicking) return;
      topTicking = true;
      requestAnimationFrame(syncTop);
    }, { passive: true });

    toTop.addEventListener("click", function () {
      var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
      /* Send focus back to the top of the document, so a keyboard or
         screen-reader user lands where the page now is. */
      var brand = document.querySelector(".masthead nav a");
      if (brand && brand.focus) brand.focus({ preventScroll: true });
    });

    syncTop();
  }

  /* ---- Light and dark ---------------------------------------
     The choice is remembered and applied in the head, before the first
     paint, so a reader who chose light never sees the dark room flash
     past first. All this does is flip the attribute and the icon.

     theme-color moves with it: Safari fills its toolbar from that, and
     a black bar under a grey page is the seam we spent so long on. */

  var themeBtn  = document.getElementById("themeToggle");
  var themeMoon = document.getElementById("themeMoon");
  var themeSun  = document.getElementById("themeSun");
  var themeMeta  = document.querySelector('meta[name="theme-color"]');

  if (themeBtn) {
    var paintTheme = function () {
      var light = document.documentElement.getAttribute("data-theme") === "light";
      if (themeMoon) themeMoon.style.display = light ? "none" : "";
      if (themeSun)  themeSun.style.display  = light ? "" : "none";
      themeBtn.setAttribute("aria-pressed", light ? "true" : "false");
      themeBtn.title = light ? "Switch to the dark theme"
                             : "Switch to the light theme";
      if (themeMeta) themeMeta.setAttribute("content", light ? "#eceded" : "#0b0907");
    };

    themeBtn.addEventListener("click", function () {
      var light = document.documentElement.getAttribute("data-theme") !== "light";
      if (light) document.documentElement.setAttribute("data-theme", "light");
      else document.documentElement.removeAttribute("data-theme");
      try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
      paintTheme();
    });

    paintTheme();
  }

  /* ---- 5. Ambient sound ------------------------------------ */
  /* Each scene has its own track, keyed by the data-scene the head
     script set. A scene with no entry here simply plays nothing, and
     the controls retire rather than sit there dead. The <audio> tag
     carries loop, so a track repeats until muted.

     ambient-tearoom is the only track now. The one that used to play
     here came off YouTube and had no licence behind it, which is not
     something to host on a public site. */

  var TRACK_FOR_SCENE = {
    "0": "assets/ambient-tearoom.mp3?v=4"
  };

  var audio  = document.getElementById("ambient");
  var toggle = document.getElementById("soundToggle");

  var scene = document.documentElement.getAttribute("data-scene") || "0";
  var track = TRACK_FOR_SCENE[scene] || "";

  if (track) {
    audio.src = track;
  } else {
    /* Nothing for this scene — stop the tag reaching for a file that
       isn't there, and retire the control rather than leave a dead one. */
    audio.removeAttribute("src");
    toggle.hidden = true;
  }

  var muted = true;               /* silence by default — the speaker
                                     button is the invitation */

  /* One level, set here rather than left to the reader. The slider it
     replaces sat at 30 of 100, which came out at 0.09 once squared for
     the ear; this is that tenth quieter again. Ambience should sit
     under the room, not in it — anyone who wants it louder has their
     own volume keys. */
  var LEVEL = 0.081;

  audio.volume = LEVEL;

  var waveOn  = document.getElementById("waveOn");
  var waveOff = document.getElementById("waveOff");

  function paint() {
    /* set inline so the swap works even if the stylesheet is stale */
    waveOn.style.display  = muted ? "none" : "";
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

})();
