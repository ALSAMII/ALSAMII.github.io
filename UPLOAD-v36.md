# Upload — Roya Library v36

Version 1 · last updated 2026-09-18 04:22 PDT

Three files. Nothing else in this folder changed for this round — the covers,
the art, the guides and the lab file are all still the previous publish.

| Upload this | To here in the repo |
|---|---|
| `Roya Library/library/roya-library.css` | `library/roya-library.css` |
| `Roya Library/library/roya-library.js`  | `library/roya-library.js`  |
| `Roya Library/index.html`               | `index.html` (repo root)   |

`index.html` is in the set only because it carries the cache stamp: the six
`?v=` numbers go from 430 to **431**. A browser that has already been to the
site holds what it fetched from `…?v=430` and will not ask again, so the two
`library/` files would change nothing for a returning reader without it.
**All three go up in the same publish.** Never the two files on their own.

## What changed

1. Phone section nav 11px → 13.2px, scaling with the screen to a 15px cap.
2. CHEW Z moved onto the wordmark line; imprint 28.8px → 50.3px.
3. 7.4px of clearance under PUBLICATION, at every width.
4. Farsi marginalia 11px/.22 → 15px/.34 on the phone, 22px/.24 on the desktop.
5. The desktop nav's flat tinted fill replaced by a blur that fades out.
6. About statement 672px → 816px; Notes body 540px → 624px; the signature now
   shares one measure with the paragraphs it signs.
7. Desktop scene art zoomed out — 92% of each 3:1 painting in frame, was 49%.
8. A series in the rail, or a search, now opens the Library on that result.

## Two open items

**The sandbox is the source.** Both `library/` files carry *"Cut from the
sandbox by build-integration.py. Do not hand-edit: the next build overwrites
it."* These edits are in the built files, so they work as soon as they are
uploaded — but the next re-cut from the sandbox reverts all eight. Put the
sandbox page in the In folder and the same changes can be made there.

**Two paintings are the wrong shape.** `assets/start-08.webp` (1536×1024) and
`library/art/start-35.webp` (1100×733) are 3:2 where the other seven scenes are
3:1. In a box shaped for 3:1 they go from about a quarter of the painting to
about a half rather than to the whole of it. A 3:1 re-export of those two
sources finishes change 7; no further CSS will.
