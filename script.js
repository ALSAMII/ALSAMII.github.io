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

  function coverFor(n) { return "covers/" + String(n).padStart(2, "0") + ".jpg"; }

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
    return (rounded % 1 ? rounded.toFixed(1) : rounded) +
      (rounded === 1 ? " hour read" : " hours read");
  }

  /* The stage rests on About: it's the reader's guide, so a first
     visit lands on it and every hover returns to it. Hovering a book
     or opening the Notes swaps it out; letting go brings it back. */
  var DEFAULT_PANEL = "panel-about";
  var pinned = null;   /* the book or group currently held on the stage */

  function showPanel(id) {
    var wasFeature = feature.classList.contains("show");
    feature.classList.remove("show");

    var activate = function () {
      if (feature.classList.contains("show")) return;  /* superseded */
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.id === id);
      });
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

    easel.style.display = "";
    easel.alt = s.title + " — cover";
    easelCaption = num + " \u00b7 " + s.title;
    if (easel.getAttribute("src") !== cover) easel.src = cover;

    feature.classList.add("show");
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
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" });
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
    title.className = "t-title";
    title.textContent = t.title;

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
      bn.src = t.banner;
      bn.alt = t.title;
      bn.loading = "lazy";
      bn.addEventListener("error", function () { set.remove(); });
      set.append(bn);
    } else {
      set.className = "t-covers" + (t.books.length > 3 ? " many" : "");
      t.books.forEach(function (n) {
        var im = document.createElement("img");
        im.src = coverFor(n);
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

  STORIES.forEach(function (s, i) {
    if (trioByFirst[s.num]) buildTrilogyHead(trioByFirst[s.num]);

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
      mark2.textContent = series.title + " \u00b7 " + series.place +
                          " of " + series.of;
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
    acts.append(pdfBtn, readBtn, shareBtn, numEl);

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

  /* An open dial description closes when the reader looks elsewhere. */
  document.addEventListener("click", function (e) {
    if (e.target.closest(".has-about")) return;
    document.querySelectorAll(".has-about[aria-expanded='true']")
            .forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
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
        revealBook(s, true);
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

  /* ---- Order --------------------------------------------------
     Three ways through the same shelf. Series order is the blank
     option, so clearing the menu — or the reset button — always
     returns the list to the order the books were written in.

     Length is the biggest practical difference between these books:
     eighteen minutes at one end, over two hours at the other. Newest
     first answers the other common question, which a returning reader
     currently has to scroll the whole shelf to answer. */

  var shelfOrder = Array.prototype.slice.call(list.children);

  function minutesOf(s) {
    var n = parseInt(String(s.words).replace(/[^0-9]/g, ""), 10) || 0;
    if (/page/i.test(s.words)) n = n * 275;
    return Math.round(n / 250);
  }

  function applySort() {
    var mode = sortMenu ? sortMenu.value : "";

    if (!mode) {
      /* Back to the order the shelf was built in, headings and all. */
      shelfOrder.forEach(function (el) { list.append(el); });
      groupRows.forEach(function (g) { g.el.classList.remove("sorted-away"); });
      rows.forEach(function (r) { r.el.classList.remove("flat"); });
    } else {
      /* Any other order breaks the series apart, so the headings step
         aside and the member books lose their indent — a group heading
         above books that are no longer its own would be a lie. */
      groupRows.forEach(function (g) { g.el.classList.add("sorted-away"); });

      var ordered = rows.slice();
      if (mode === "Shortest first") {
        ordered.sort(function (a, b) { return minutesOf(a.story) - minutesOf(b.story); });
      } else {
        ordered.sort(function (a, b) { return b.story.num - a.story.num; });
      }
      ordered.forEach(function (r) {
        r.el.classList.add("flat");
        list.append(r.el);
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

    var filtering = Boolean(door) || Boolean(query) ||
                    Boolean(sortMenu && sortMenu.value);
    noMatch.hidden = shown !== 0;
    resetBtn.disabled = !filtering;
    if (countEl) {
      countEl.textContent = filtering
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
    }
    resetBtn.addEventListener("click", function () {
      doorMenu.clear();
      if (sortMenu) sortMenu.clear();
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
  document.querySelectorAll("[data-book]").forEach(function (btn) {
    var s = byNum[Number(btn.dataset.book)];
    if (!s) return;

    /* index.html already carries the card's markup — the motif, the
       image, the text. Nothing is built here; only the two things that
       must never be typed by hand get filled in. */
    var slot = btn.querySelector(".start-time");
    if (slot) slot.textContent = readingTime(s.words);

    /* The scene: assets/start-NN.jpg, a wide image with no text on it.
       Missing, it falls back to the book's cover; missing that too, the
       card keeps its frame and simply carries no picture. */
    var img = btn.querySelector(".start-scene");
    if (img) {
      var n = String(s.num).padStart(2, "0");
      var fellBack = false;
      img.loading = "lazy";
      img.addEventListener("error", function () {
        if (!fellBack) {
          fellBack = true;
          img.src = s.cover || coverFor(s.num);
        } else {
          img.remove();
        }
      });
      /* The scene is normally named for the book it belongs to, but a
         row may name its own file with data-scene — useful when a
         picture outlives the book it was first made for. */
      img.src = btn.dataset.scene || ("assets/start-" + n + ".jpg");
    }

    btn.addEventListener("click", function () { revealBook(s, true); });
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

  if (arrivedByReload() && location.hash) {
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
  var readerEnd    = document.getElementById("readerEnd");
  var readerBar    = document.getElementById("readerBar");

  var STEPS = [0.95, 1.05, 1.15, 1.3, 1.45];   /* type sizes on offer */
  var readerBook = null;
  var textCache  = {};

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
  }

  function renderBlocks(blocks) {
    var html = "";
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (b.t === "h") html += '<h2 class="r-h">' + b.h + "</h2>";
      else if (b.t === "v") html += '<p class="r-v">' + b.h + "</p>";
      else html += "<p>" + b.h + "</p>";
    }
    readerPage.innerHTML = html;
  }

  function openReader(s) {
    var n = String(s.num).padStart(2, "0");
    readerBook = n;
    readerTitle.textContent = s.title;
    readerEnd.textContent = "End \u00b7 " + s.title;
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

    if (textCache[n]) { renderBlocks(textCache[n]); settle(); return; }

    readerPage.innerHTML = '<p class="r-wait">Opening\u2026</p>';
    fetch("read/" + n + ".json")
      .then(function (r) {
        if (!r.ok) throw new Error("no text");
        return r.json();
      })
      .then(function (data) {
        textCache[n] = data.blocks;
        renderBlocks(data.blocks);
        settle();
      })
      .catch(function () {
        /* No reading text for this one yet — say so plainly, and
           point at the file that certainly exists. */
        readerPage.innerHTML =
          '<p class="r-wait">This one isn\u2019t set for reading here yet. ' +
          '<a href="' + (s.pdf || "pdfs/" + n + ".pdf") + '" target="_blank" rel="noopener">' +
          "Open the PDF instead.</a></p>";
      });
  }

  function closeReader() {
    markPlace();
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
  }



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
