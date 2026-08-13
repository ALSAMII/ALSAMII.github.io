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

# The page furniture to drop: anything below this sits in the bottom
# margin, which holds nothing but the page number.
FOOTER_TOP = 590

# A line starting this far right of the text block is an indented
# first line — which is how this typesetting marks a new paragraph.
BODY_LEFT = 60
INDENT_MIN = 66

# Set larger than the body: a chapter number, or a section heading.
HEADING_SIZE = 12

# Front matter runs until the first chapter. These headings mark the
# parts of it worth keeping — the rest is copyright and contents.
FRONT_KEEP = ("SYNOPSIS", "A NOTE FROM THE AUTHOR")
SKIP_HEADS = ("CONTENTS",)


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
       paragraph, a heading, or a line of verse — the reader knows all
       three. Sizes do the sorting: the body is set at 9, headings
       above 10, and the closing verse at 10.5 under a heading of its
       own, which is why the verse flag has to hold once it is set."""
    blocks = []
    in_verse = False
    para = []

    def flush():
        if para:
            blocks.append({"t": "p", "h": " ".join(para)})
            para.clear()

    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            for line in page.extract_text_lines():
                text = line["text"].strip()
                if not text:
                    continue
                if line["top"] > FOOTER_TOP:
                    continue
                if re.fullmatch(r"[0-9ivxlcIVXLC]+", text):
                    continue

                size = max(round(c["size"], 1) for c in line["chars"])
                html = line_html(line)

                if size >= 12:
                    flush()
                    in_verse = False
                    blocks.append({"t": "h", "h": html})
                    continue

                if size >= 10 and not in_verse:
                    flush()
                    if is_verse_head(text):
                        in_verse = True
                    blocks.append({"t": "h", "h": html})
                    continue

                if in_verse:
                    # Each line stands alone: in verse the breaks are
                    # the writing, and joining them would be a rewrite.
                    blocks.append({"t": "v", "h": html})
                    continue

                if line["x0"] >= INDENT_MIN and para:
                    flush()
                para.append(html)
            flush()
    return blocks


def tidy(blocks):
    """Open at the author\'s note, drop the contents list, and put back
       paragraphs that a page break cut in half. The title page,
       copyright and synopsis are the book\'s front matter — the site
       says all of that already."""
    start = 0
    for i, b in enumerate(blocks):
        if b["t"] == "h" and re.match(r"^\s*A NOTE FROM THE AUTHOR",
                                      re.sub("<[^>]+>", "", b["h"]), re.I):
            start = i
            break
    else:
        for i, b in enumerate(blocks):
            if b["t"] == "h" and re.match(r"^\s*CHAPTER\b",
                                          re.sub("<[^>]+>", "", b["h"]), re.I):
                start = i
                break

    out, skipping = [], False
    for b in blocks[start:]:
        plain = re.sub("<[^>]+>", "", b["h"]).strip()
        if b["t"] == "h":
            skipping = bool(re.match(r"^\s*CONTENTS\b", plain, re.I))
            if skipping:
                continue
        if skipping:
            continue
        if not plain:
            continue
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
