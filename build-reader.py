"""
BUILDS THE READING TEXT FROM THE PDFs, INTO /read

The novellas exist as typeset PDFs. A PDF is a photograph of a page:
fixed at six by nine inches, whatever it is opened on. On a phone that
means pinching, or scrolling sideways a line at a time — and it means
the reading itself happens somewhere other than the site.

This pulls the prose back out. Each book becomes read/NN.json: a list
of blocks the reader renders as flowing text. Italics survive, because
the typesetting distinguishes them by font. Chapter headings survive,
because they are set larger. Verse survives with its line breaks,
because in verse the breaks are the writing.

    python3 build-reader.py            # every PDF in pdfs/
    python3 build-reader.py 41         # one book

Nothing here is hand-edited. Rebuild after replacing a PDF.
"""

import json, os, re, sys
import pdfplumber

PDF_DIR = "pdfs"
OUT_DIR = "read"

# Nothing below is a fixed measurement, because the books are not
# typeset alike: the body is set at 9 in one and 10.6 in another, one
# puts its page numbers at the foot and another runs a header along the
# top. So each book is measured first, and these are the proportions
# used to read that measurement.

HEAD_RATIO = 1.18    # larger than the body by this much: a heading
FURNITURE  = 0.92    # smaller than the body by this much: page furniture
INDENT_PT  = 4       # further right than the margin: a new paragraph
MARGIN_PT  = 42      # this close to the top or foot: not the text


def measure(pdf):
    """Take the book's own measurements before reading it. The body is
       whatever size most of the words are set in, and the left margin
       is wherever most lines begin — everything else is judged against
       those two."""
    sizes, lefts, gaps = {}, {}, {}
    for page in pdf.pages[:24]:
        prev = None
        for line in page.extract_text_lines():
            if not line["text"].strip():
                continue
            size = round(max(c["size"] for c in line["chars"]), 1)
            sizes[size] = sizes.get(size, 0) + len(line["text"])
            x0 = round(line["x0"])
            lefts[x0] = lefts.get(x0, 0) + 1
            if prev is not None:
                g = round(line["top"] - prev)
                if 0 < g < 60:
                    gaps[g] = gaps.get(g, 0) + 1
            prev = line["top"]
    if not sizes:
        return 10.0, 60, 16
    body = max(sizes, key=sizes.get)
    left = max(lefts, key=lefts.get)
    # The ordinary step from one line to the next. Anything taller is
    # air the typesetter put there on purpose.
    lead = max(gaps, key=gaps.get) if gaps else 16
    return body, left, lead
def line_html(line):
    """A line of text, with its italic runs marked.

       Built character by character, because the typesetting marks
       italics by font and that styling is worth keeping. pdfplumber
       hands back no space characters, so the spaces are put back from
       the gaps: anything wider than a fifth of the character\'s own
       width was a word break on the page."""
    out, italic, prev = [], False, None
    for ch in line["chars"]:
        want = "Italic" in ch["fontname"] or "Oblique" in ch["fontname"]
        if want != italic:
            out.append("<em>" if want else "</em>")
            italic = want
        # After the tag, so a space between two italic words stays
        # inside the run rather than cutting it in two.
        if prev is not None and ch["x0"] - prev["x1"] > prev["width"] * 0.2:
            out.append(" ")
        c = ch["text"]
        out.append(c.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
        prev = ch
    if italic:
        out.append("</em>")
    return "".join(out).strip()


def is_verse_head(text):
    return bool(re.match(r"^\s*VERSE\b", text.strip(), re.I))


def extract(path):
    """Walk the pages and turn lines into blocks. A block is a
       paragraph, a heading, or a line of verse. What sorts them is the
       book's own body size, measured first, so a novella set at 10.6
       reads the same as one set at 9."""
    blocks = []
    in_verse = False
    para = []

    def flush():
        if para:
            blocks.append({"t": "p", "h": " ".join(para)})
            para.clear()

    with pdfplumber.open(path) as pdf:
        body, left, lead = measure(pdf)
        head_at = body * HEAD_RATIO
        small_at = body * FURNITURE

        for page in pdf.pages:
            prev_top = None
            top_edge = MARGIN_PT
            foot_edge = page.height - MARGIN_PT

            for line in page.extract_text_lines():
                text = line["text"].strip()
                if not text:
                    continue

                size = round(max(c["size"] for c in line["chars"]), 1)

                # Page furniture: a folio, or a running head. Both sit
                # in a margin, or are set smaller than the body, or are
                # nothing but a number.
                if re.fullmatch(r"[0-9ivxlcIVXLC]+", text):
                    continue
                if size < small_at and (line["top"] < top_edge
                                        or line["top"] > foot_edge):
                    continue
                if line["top"] > foot_edge and len(text) < 60:
                    continue

                html = line_html(line)

                # Set larger than the body: a chapter, a part title.
                if size >= head_at:
                    flush()
                    in_verse = is_verse_head(text)
                    blocks.append({"t": "h", "h": html})
                    continue

                # Some of these books mark their sections in capitals
                # at ordinary size instead — SESSION FOUR, REEL TWO.
                # A short line shouting on its own is a heading too.
                letters = re.sub(r"[^A-Za-z]", "", text)
                if (letters and len(text) < 70 and text == text.upper()
                        and len(letters) > 2):
                    flush()
                    in_verse = is_verse_head(text)
                    blocks.append({"t": "h", "h": html})
                    continue

                if in_verse:
                    # Each line stands alone: in verse the breaks are
                    # the writing, and joining them would be a rewrite.
                    blocks.append({"t": "v", "h": html})
                    continue

                if size < small_at:
                    continue          # a caption or a stray running head

                # Two ways a book opens a paragraph, and these ten
                # use both: an indented first line, or a line of air
                # above it. Either one is enough.
                indented = line["x0"] >= left + INDENT_PT
                spaced = prev_top is not None and (line["top"] - prev_top) > lead * 1.3
                if (indented or spaced) and para:
                    flush()
                para.append(html)
                prev_top = line["top"]
            flush()
    return blocks


# The copyright page, in the words it always uses. Some books set
# these lines at body size, so no measurement will catch them.
BOILERPLATE = re.compile(
    r"^\s*(ISBN\b|Copyright\s*(\u00a9|\(c\))|All rights reserved"
    r"|This is a work of fiction|Typeset in\b|Printed in\b"
    r"|Roya Publication[s]?\s*(No\.|\u00b7)|A ROYA PUBLICATION\s*$)", re.I)

# Where the reading starts, however the book announces it. Kept tight:
# a looser pattern matched "Book I of the Borrowed Sun Cycle" on a
# title page and opened the book on its own half-title.
OPENER = re.compile(r"^\s*(A NOTE FROM THE AUTHOR|CHAPTER\b|PART\s+(ONE|I)\b)", re.I)

# A line of a contents list: a short title with the page it is on.
# Some books head the list with the word CONTENTS and some simply
# start listing, so the shape has to be recognised on its own.
CONTENTS_LINE = re.compile(r"^.{0,70}?\s\d{1,3}$")


def drop_contents(blocks):
    """Lose the contents list. Alone, a line like "Hearing One — the
       Founding 14" is indistinguishable from a heading; three or more
       in a row are unmistakably a list, so runs are what we look
       for."""
    plains = [re.sub("<[^>]+>", "", b["h"]).strip() for b in blocks]
    drop = set()
    run = []
    for i, text in enumerate(plains):
        if CONTENTS_LINE.match(text):
            run.append(i)
            continue
        if len(run) >= 3:
            drop.update(run)
        run = []
    if len(run) >= 3:
        drop.update(run)
    return [b for i, b in enumerate(blocks) if i not in drop]


def drop_listed_headings(blocks):
    """Lose a contents list that carries no page numbers.

       Some books list their sections as a bare stack of titles, which
       looks exactly like a stack of headings. What gives the list away
       is that the book then goes on to use the same titles again, in
       the same order, as the sections themselves. So inside a long run
       of headings with no prose between them, any title that turns up
       again later is the list's copy, not the section's."""
    runs, run = [], []
    for i, b in enumerate(blocks):
        if b["t"] == "h":
            run.append(i)
        else:
            if len(run) >= 4:
                runs.append(run)
            run = []
    if len(run) >= 4:
        runs.append(run)

    plains = [re.sub("<[^>]+>", "", b["h"]).strip().upper() for b in blocks]
    drop = set()
    for run in runs:
        for i in run:
            later = plains[i + 1:]
            if plains[i] and plains[i] in later:
                drop.add(i)
    return [b for i, b in enumerate(blocks) if i not in drop]


def tidy(blocks):
    """Open at the author\'s note, drop the contents list, and put back
       paragraphs that a page break cut in half. The title page,
       copyright and synopsis are the book\'s front matter — the site
       says all of that already."""
    # Find the first thing that is the book rather than its front
    # matter. Most announce it with a heading; some set the same words
    # at body size, at the head of a paragraph, so both are checked.
    start = 0
    for i, b in enumerate(blocks):
        plain = re.sub("<[^>]+>", "", b["h"]).strip()
        author_note = re.match(r"^\s*A Note from the Author\b", plain, re.I)
        # A chapter opening counts only when it is set as a heading;
        # as a paragraph it is far more likely to be a title page.
        if (b["t"] == "h" and OPENER.match(plain)) or author_note:
            start = i
            # Set inline: cut the announcement off the paragraph and
            # give it back as the heading it was meant to be.
            if b["t"] == "p":
                m = re.match(r"^\s*(A Note from the Author)\s*(.*)$",
                             plain, re.I | re.S)
                if m:
                    blocks[i] = {"t": "h", "h": m.group(1).upper()}
                    blocks.insert(i + 1, {"t": "p", "h": m.group(2)})
            break

    blocks = drop_listed_headings(drop_contents(blocks[start:]))
    start = 0

    out, skipping = [], False
    for b in blocks:
        plain = re.sub("<[^>]+>", "", b["h"]).strip()
        if b["t"] == "h":
            skipping = bool(re.match(r"^\s*CONTENTS\b", plain, re.I))
            if skipping:
                continue
        if skipping:
            # A contents list is a run of short lines. The moment a
            # real paragraph turns up the list is over — some books
            # have no heading after it to say so, and without this the
            # rest of the novella went in the bin with the list.
            if b["t"] == "p" and len(plain.split()) > 25:
                skipping = False
            else:
                continue
        if not plain:
            continue
        if BOILERPLATE.match(plain):
            continue          # the copyright page, wherever it landed
        if (out and out[-1]["t"] == "p" and b["t"] == "p"
                and not re.search(r'[.?!"\u201d\u2019]\s*$', out[-1]["h"])
                and plain[:1].islower()):
            out[-1]["h"] += " " + b["h"]
            continue
        out.append(b)
    return out


def build(num):
    src = os.path.join(PDF_DIR, f"{num}.pdf")
    blocks = tidy(extract(src))
    words = sum(len(re.sub("<[^>]+>", "", b["h"]).split())
                for b in blocks if b["t"] in ("p", "v"))
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, f"{num}.json"), "w", encoding="utf-8") as f:
        json.dump({"blocks": blocks}, f, ensure_ascii=False, separators=(",", ":"))
    return len(blocks), words


if __name__ == "__main__":
    nums = sys.argv[1:]
    if not nums:
        nums = sorted(f[:-4] for f in os.listdir(PDF_DIR) if f.endswith(".pdf"))
    for n in nums:
        b, w = build(n)
        print(f"read/{n}.json — {b} blocks, {w} words")
