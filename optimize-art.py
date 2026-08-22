#!/usr/bin/env python3
"""
optimize-art.py — make a .webp twin of every painting on the site.

Run it from the repo root:

    python3 optimize-art.py            # see what it would do, change nothing
    python3 optimize-art.py --write    # actually write the .webp files

Nothing is deleted and nothing is overwritten in place. For every
assets/start-07.jpg it writes assets/start-07.webp beside it. script.js
asks for the .webp first and falls back to the file that is already
there, so the site works identically whether or not this has been run —
it is just several times lighter once it has.

Requires Pillow:  pip3 install --upgrade Pillow
"""

import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is not installed. Run:  pip3 install --upgrade Pillow")

# ---------------------------------------------------------------------
# What gets converted, and how wide it is allowed to be.
#
# The cap is the widest the picture is ever actually drawn, times the
# pixel density of a good phone. Anything past that is bytes the reader
# pays for and cannot see. Measure before changing these: the start
# scenes are drawn at 124% of a card that is at most ~560 CSS px wide,
# so ~1400px covers a 2x desktop and a 3x phone alike.
# ---------------------------------------------------------------------
TARGETS = [
    # folder      filename starts with   max width   quality
    ("assets",    "start-",              1440,       78),
    ("assets",    "series-",             1440,       78),
    ("assets",    "banner-",             1600,       78),
    ("covers",    "",                    1000,       80),
]

SOURCE_EXT = (".jpg", ".jpeg", ".png")


def human(n):
    return f"{n/1024:.0f} KB" if n < 1024 * 1024 else f"{n/1024/1024:.2f} MB"


def convert(path, max_w, quality, write):
    """Return (bytes_before, bytes_after, note)."""
    before = os.path.getsize(path)
    out = os.path.splitext(path)[0] + ".webp"

    if os.path.exists(out):
        return before, os.path.getsize(out), "exists, skipped"

    with Image.open(path) as im:
        im = im.convert("RGB")          # drops alpha; none of this art uses it
        if im.width > max_w:
            h = round(im.height * max_w / im.width)
            im = im.resize((max_w, h), Image.LANCZOS)
            note = f"{max_w}px"
        else:
            note = f"{im.width}px"

        if write:
            im.save(out, "WEBP", quality=quality, method=6)
            after = os.path.getsize(out)
        else:
            # Encode to memory so the dry run reports real numbers.
            import io
            buf = io.BytesIO()
            im.save(buf, "WEBP", quality=quality, method=6)
            after = buf.tell()

    return before, after, note


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true",
                    help="write the .webp files (default is a dry run)")
    args = ap.parse_args()

    total_before = total_after = 0
    rows = []

    for folder, prefix, max_w, quality in TARGETS:
        if not os.path.isdir(folder):
            continue
        for name in sorted(os.listdir(folder)):
            if not name.lower().endswith(SOURCE_EXT):
                continue
            if prefix and not name.startswith(prefix):
                continue
            path = os.path.join(folder, name)
            try:
                before, after, note = convert(path, max_w, quality, args.write)
            except Exception as e:                      # noqa: BLE001
                rows.append((path, "—", "—", f"failed: {e}"))
                continue
            total_before += before
            total_after += after
            cut = 100 - (after / before * 100) if before else 0
            rows.append((path, human(before), human(after), f"-{cut:.0f}%  {note}"))

    if not rows:
        sys.exit("No artwork found. Run this from the repo root, "
                 "where assets/ and covers/ live.")

    w = max(len(r[0]) for r in rows)
    print()
    print(f"{'file'.ljust(w)}  {'before':>9}  {'webp':>9}   saving")
    print("-" * (w + 32))
    for path, b, a, note in rows:
        print(f"{path.ljust(w)}  {b:>9}  {a:>9}   {note}")
    print("-" * (w + 32))

    cut = 100 - (total_after / total_before * 100) if total_before else 0
    print(f"{'TOTAL'.ljust(w)}  {human(total_before):>9}  "
          f"{human(total_after):>9}   -{cut:.0f}%")
    print()

    if args.write:
        print("Written. Upload the new .webp files alongside the originals —")
        print("keep the originals, they are the fallback.")
    else:
        print("Dry run — nothing written. Re-run with --write when the "
              "numbers look right.")


if __name__ == "__main__":
    main()
