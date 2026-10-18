/* ══════════════════ THE INTRODUCTION ══════════════════
   A small link in the About panel, between the opening paragraph and the
   one that counts the stories. Clicking it opens the film full screen,
   with sound.

   This file is SELF-CONTAINED on purpose. It adds nothing to script.js and
   nothing to style.css, so it cannot disturb anything already on the site;
   to take it off again, delete the two lines in index.html that call this
   file and its stylesheet. Nothing else has to be unpicked.

   The About panel is rebuilt out of the generated library markup every time
   the view changes, which would wipe a one-off insertion. So the work is
   done the way the rest of script.js does it: an idempotent apply(), a
   rAF-debounced schedule(), and a MutationObserver on #royaLibrary.
   ──────────────────────────────────────────────────────────────────── */

(function introFilm() {
  "use strict";

  /* ───────────────────────────── THE FILM ───────────────────────────
     The address below is the 24 fps cut: 68.000 seconds, 1920×1080,
     1632 frames, with the narration. Upload chewz-intro-68s-web.mp4 to the
     roya-audio bucket and this address is already right. If you keep a
     different filename, change it here — it is the only place it appears.

     Not the 30 fps export: that one had the 24p picture conformed to a
     30p timeline, which duplicates frames on an uneven cadence and makes
     the pans judder. Same audio, bit for bit; steadier picture; 17 MB
     rather than 40.

     To put a different cut up: replace the address, and raise the ?v= on
     this file in index.html so browsers fetch the change. Nothing else
     moves. Emptying it is safe too — the link still appears and a click
     says the film is on its way, rather than opening a dead player.

     Keep it on Backblaze rather than in the repository. A forty-megabyte
     file committed to ALSAMII.github.io sits in the git history for good
     and counts against the Pages bandwidth on every view.             */

  var FILM = {
    src:      "https://f005.backblazeb2.com/file/roya-audio/chewz-intro-68s-v2.mp4",
    poster:   "assets/intro/intro-poster.jpg",
    captions: ""                                   /* a .vtt here turns captions on */
  };

  /* ─────────────────────────────── the copy ───────────────────────── */

  var COPY = {
    kicker:  "Start with the film",
    head:    "How to find your way around",
    meta:    "Introduction \u00b7 01:08",   /* the cut is 68.000s exactly */
    waiting: "The film is being uploaded \u2014 it will be here shortly."
  };

  var ROOT = document.getElementById("royaLibrary");
  if (!ROOT) return;

  var SVG = "http://www.w3.org/2000/svg";
  function svg(d, w) {
    var s = document.createElementNS(SVG, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", w || "1.4");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    var p = document.createElementNS(SVG, "path");
    p.setAttribute("d", d);
    s.appendChild(p);
    return s;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ──────────────────────────── the link ──────────────────────────── */

  function build() {
    var wrap = el("div", "rvi");

    var btn = el("button", "rvi-link");
    btn.type = "button";

    var thumb = el("span", "rvi-thumb");
    var img = new Image();
    img.src = FILM.poster;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    thumb.appendChild(img);

    var play = el("span", "rvi-play");
    var tri = document.createElementNS(SVG, "svg");
    tri.setAttribute("viewBox", "0 0 24 24");
    tri.setAttribute("aria-hidden", "true");
    var tp = document.createElementNS(SVG, "path");
    tp.setAttribute("d", "M7 4.5l12 7.5-12 7.5z");
    tp.setAttribute("fill", "currentColor");
    tri.appendChild(tp);
    play.appendChild(tri);
    thumb.appendChild(play);

    var text = el("span", "rvi-text");
    text.appendChild(el("span", "rvi-kicker", COPY.kicker));
    text.appendChild(el("span", "rvi-head", COPY.head));
    text.appendChild(el("span", "rvi-meta", COPY.meta));

    /* Words first, picture second — the rule on the left belongs to the
       words, the way it does on a mood header. The four-corner expand
       mark is gone: the play circle on the still already says what a
       click does, and a second mark only crowded it. */
    btn.appendChild(text);
    btn.appendChild(thumb);
    btn.addEventListener("click", open);

    wrap.appendChild(btn);
    return wrap;
  }

  function apply() {
    /* The opening paragraph is the anchor, NOT the panel around it. A
       desktop wraps it in .abt and a phone in .mob-sec, so keying off the
       wrapper meant the link simply never appeared on a phone — the
       function returned before it got as far as looking.

       Anchoring on .ab-lede works in both, and survives a window being
       dragged across the breakpoint: the wrapper changes underneath, the
       paragraph does not. */
    var lede = ROOT.querySelector(".ab-lede");
    if (!lede || !lede.parentElement) return;

    /* Idempotent, and it has to still be in the right place — the panel
       is rebuilt on every view change, and rebuilt into a different
       wrapper when the layout flips. */
    var have = ROOT.querySelector(".rvi");
    if (have && have.previousElementSibling === lede) return;
    if (have) have.remove();
    lede.after(build());
  }

  /* ─────────────────────────── the player ─────────────────────────── */

  var box = null, vid = null, wasPlaying = false, lastFocus = null;

  function make() {
    if (box) return;

    box = el("div", "rvp");
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "An introduction to the house of Roya");

    var scrim = el("div", "rvp-scrim");
    scrim.addEventListener("click", close);

    var stage = el("div", "rvp-stage");

    var x = el("button", "rvp-x");
    x.type = "button";
    x.setAttribute("aria-label", "Close");
    x.appendChild(svg("M6 6l12 12M18 6L6 18", "1.5"));
    x.addEventListener("click", close);

    if (FILM.src) {
      vid = document.createElement("video");
      vid.className = "rvp-v";
      vid.setAttribute("playsinline", "");      /* iOS: ours, not its own */
      vid.setAttribute("controls", "");         /* native: scrub, volume,
                                                   captions, full screen */
      /* The element is not built until the first click, so nothing is
         fetched before someone asks for the film — a preload hint here
         would only slow the start once they have. */
      vid.setAttribute("preload", "auto");
      vid.poster = FILM.poster;
      vid.src = FILM.src;
      if (FILM.captions) {
        var tr = document.createElement("track");
        tr.kind = "captions";
        tr.label = "English";
        tr.srclang = "en";
        tr.src = FILM.captions;
        tr.default = true;
        vid.appendChild(tr);
      }
      vid.addEventListener("ended", close);
      stage.appendChild(vid);
    } else {
      /* published before the upload — say so plainly */
      var wait = el("div", "rvp-wait");
      var pimg = new Image();
      pimg.src = FILM.poster;
      pimg.alt = "";
      wait.appendChild(pimg);
      wait.appendChild(el("p", "rvp-waitline", COPY.waiting));
      stage.appendChild(wait);
    }

    stage.appendChild(x);
    box.appendChild(scrim);
    box.appendChild(stage);
    document.body.appendChild(box);
  }

  /* The room tone, hushed while the film talks, and put back after. */
  function hushAmbient() {
    var a = document.getElementById("ambient");
    wasPlaying = !!(a && !a.paused);
    if (wasPlaying) a.pause();
  }
  function restoreAmbient() {
    if (!wasPlaying) return;
    var a = document.getElementById("ambient");
    if (a) { var p = a.play(); if (p && p.catch) p.catch(function () {}); }
    wasPlaying = false;
  }

  /* The film opens in a window over a darkened page, not full screen.
     The player's own controls still carry a full-screen button for anyone
     who wants it — this is just not what a click does by default.

     On an iPhone the choice is not ours: iOS hands any playing video to
     its own full-screen player whatever the page asks for. playsinline
     asks it not to, and newer iOS obliges. */

  function open() {
    lastFocus = document.activeElement;
    make();
    box.hidden = false;
    document.documentElement.classList.add("rvp-on");
    hushAmbient();

    if (vid) {
      /* Both of these spend the click: the sound and the full screen are
         each allowed only because a person just pressed something. Start
         the film FIRST — a full-screen request made first can swallow the
         gesture on some browsers and leave the video refused and silent. */
      vid.muted = false;                 /* the link said: with sound */
      var pr = vid.play();
      if (pr && pr.catch) pr.catch(function () {
        /* Still refused. Better quiet than nothing — and the native
           controls carry an unmute button, so it is one tap back. */
        vid.muted = true;
        var q = vid.play();
        if (q && q.catch) q.catch(function () {});
      });
    }
    var x = box.querySelector(".rvp-x");
    if (x) x.focus();
    document.addEventListener("keydown", onKey, true);
  }

  function close() {
    if (!box || box.hidden) return;
    if (vid) { try { vid.pause(); vid.currentTime = 0; } catch (e) {} }
    if (document.fullscreenElement && document.exitFullscreen) {
      try { document.exitFullscreen(); } catch (e) {}
    } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
      try { document.webkitExitFullscreen(); } catch (e) {}
    }
    box.hidden = true;
    document.documentElement.classList.remove("rvp-on");
    restoreAmbient();
    document.removeEventListener("keydown", onKey, true);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === "Escape" || e.key === "Esc") { e.stopPropagation(); close(); }
  }

  /* ────────────────────── keep it in the panel ────────────────────── */

  var tick = 0;
  function schedule() {
    if (tick) return;
    tick = requestAnimationFrame(function () { tick = 0; apply(); });
  }
  apply();
  new MutationObserver(schedule).observe(ROOT, { childList: true, subtree: true });

})();
