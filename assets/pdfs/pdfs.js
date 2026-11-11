/* ══════════════════ WHERE THE BOOK PDFs LIVE ══════════════════
   Version 1 · last updated 2026-11-11 06:40 PST
   Served as assets/pdfs/pdfs.js?v=1 — keep the two numbers equal.

   The 119 novella PDFs moved off GitHub to Backblaze B2, beside the
   narration and the songs:

     https://f005.backblazeb2.com/file/roya-audio/pdfs/NN.pdf

   GitHub Pages re-sends the whole site on every deploy, and the PDFs were
   183 MB of it — the main reason deploys had begun timing out.

   EVERY PDF LINK GOES THROUGH HERE
     CHEWZ_PDF.href("06")  → the Backblaze address for book 6
     CHEWZ_PDF.fix(url)    → any old "pdfs/NN.pdf" address, moved; anything
                             else handed back untouched
   script.js calls href(). The Library (library/roya-library.js) is
   generated and must not be hand-edited, and it still builds "pdfs/NN.pdf"
   itself — so its links are corrected here, the way assets/libbar/ and
   assets/lrseries/ adjust it from outside: a MutationObserver rewrites each
   PDF link as it is drawn (before the browser paints), and window.open is
   passed the corrected address when the Library opens a PDF from script.

   REPLACING A PDF
   Backblaze tells browsers to keep a PDF for 30 days. After a corrected PDF
   is uploaded to Backblaze, raise V by one below (and this file's ?v= in
   index.html) so every reader gets the new copy at once.

   Old addresses (chewzfiction.com/pdfs/NN.pdf — bookmarks, search results)
   are sent on by 404.html.
   ──────────────────────────────────────────────────────────────────── */

(function chewzPdfs() {
  "use strict";

  var BASE = "https://f005.backblazeb2.com/file/roya-audio/pdfs/";
  var V = "1";                                  /* raise when a PDF is replaced */
  var OLD = /(?:^|\/)pdfs\/(\d{1,3})\.pdf(?:[?#].*)?$/i;

  function href(n) {
    var s = String(n).replace(/^0+(?=\d)/, "");
    if (s.length < 2) s = "0" + s;              /* 6 → 06; 119 stays 119 */
    return BASE + s + ".pdf?v=" + V;
  }

  function fix(url) {
    if (typeof url !== "string" || url.indexOf(BASE) === 0) return url;
    var m = OLD.exec(url);
    if (!m) return url;
    /* only the site's own PDFs: a relative path, or this site's address */
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) && url.indexOf(location.origin + "/") !== 0) return url;
    return href(m[1]);
  }

  window.CHEWZ_PDF = { base: BASE, v: V, href: href, fix: fix };

  /* links, wherever they are drawn */
  function fixLink(a) {
    var h = a.getAttribute("href");
    var f = fix(h);
    if (f !== h) a.setAttribute("href", f);
  }
  function sweep(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.tagName === "A") fixLink(node);
    var list = node.querySelectorAll ? node.querySelectorAll('a[href*="pdfs/"]') : [];
    for (var i = 0; i < list.length; i++) fixLink(list[i]);
  }
  new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      if (r.type === "attributes") { if (r.target.tagName === "A") fixLink(r.target); continue; }
      for (var j = 0; j < r.addedNodes.length; j++) sweep(r.addedNodes[j]);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
  if (document.body) sweep(document.body);
  else document.addEventListener("DOMContentLoaded", function () { sweep(document.body); });

  /* a press reaches a link before its href is used: last chance to correct it */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (a) fixLink(a);
  }, true);

  /* the Library opens a PDF with window.open */
  var open = window.open;
  window.open = function (url) {
    var args = Array.prototype.slice.call(arguments);
    if (typeof url === "string") args[0] = fix(url);
    return open.apply(window, args);
  };
})();
