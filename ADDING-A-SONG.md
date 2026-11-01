<!-- Updated 2026-10-31 20:20 PDT — written with the Record Room. 3 albums, 17 songs.
     The house standard for the object itself is roya-recordings-format.md. -->
# Adding a song

Everything that has to happen when a recording joins the Record Room, in
order. This is the operational side; the house standard for the object —
artwork sizes, sleeve geometry, the lyric schema — is
`roya-recordings-format.md`.

**A narration is not a song.** A book's reading voice is
[ADDING-AUDIO.md](ADDING-AUDIO.md): mono, 32 kbps, `NN.mp3` at the root
of the bucket, and it attaches to a book in `stories.js`. A song is
stereo, 192 kbps, lives under `songs/` in the same bucket, and belongs
to `songs.js`. The two never mix.

---

## 0. The catalogue number

A song's number is **album, hyphen, track**, both zero-padded:

```
01-07     album 1, track 7
03-02     album 3, track 2
```

**It is permanent from the moment it is published.** It is in the B2
path and in the share URL, so changing it breaks both. Reordering an
album afterwards does not renumber anything — the running order on the
page comes from the `track` field, and the shelf order from `order` on
the album.

The same goes for album numbers. Album 2 is *Roya* and shows third on
the shelf; that is deliberate, not a mistake to tidy up.

---

## 1. Encode the master

Masters are WAV, 48 kHz, 16-bit stereo, and they are **archived
off-site** — never in this repository and never on B2.

```
ffmpeg -i "Master.wav" \
  -codec:a libmp3lame -b:a 192k -ar 44100 -ac 2 \
  -metadata title="…" -metadata artist="Chew Z" \
  -metadata album="…" -metadata track="7" -metadata date="2026" \
  songs/01-07.mp3
```

**192 kbps, not the 32 the narrations use.** A narration is one dry
voice and survives heavy compression. A song does not — the bass, the
room and the saxophone go first. Do not reuse the narration settings.

Read the length off the file, do not estimate it:

```
ffprobe -v error -show_entries format=duration -of csv=p=0 songs/01-07.mp3
```

**Floor it, never round it.** 359.6 seconds is **5:59**. Rounding gives
6:00, and a card that says six minutes for a five-fifty-nine track is
the same class of error as a book card showing another book's reading
time.

## 2. Upload it to Backblaze

Into the existing public bucket `roya-audio`, under `songs/`:

```
https://f005.backblazeb2.com/file/roya-audio/songs/01-07.mp3
```

For a handful of files the web console is the better tool — **B2 Cloud
Storage → Browse Files → roya-audio → songs** and drag them in. No
application key is involved, so there is nothing to clean up afterwards.

If you script it instead, scope the key to `roya-audio` only and
**delete it in the console the moment the upload finishes**. It is in
your shell history from that point on.

**Never overwrite a song in place.** B2 urls carry no cache stamp, so an
overwrite silently reaches nobody who has already played it. A revised
recording goes up under a new catalogue path.

## 3. Write the lyric sheet

`songs/AA-TT.json`, an array, one entry per line:

```json
[ { "t": 12.0, "k": "mark",  "x": "Verse 1" },
  { "t": 18.4, "k": "lyric", "x": "Been running from the same old game" } ]
```

`t` is seconds from the start, one decimal. `k` is `lyric` (sung,
highlights) or `mark` (a section label, set small in caps, never
highlights). `x` is the line.

- Time order, and the first `t` is where the voice actually starts.
- A `mark` carries the section name only. The studio direction that
  follows it in the writing file is production material and does not ship.
- Persian lines are stored in Persian, logical order, **with the
  zero-width non-joiner** where it belongs — `می‌دونم`, not `میدونم`.
  Direction is set by the `fa` flag, not by marks in the text.
- A long instrumental is one `mark`, not a run of empties.

**A song may ship without a sheet.** The player shows a stated empty
state and still plays. Omit the `lyric` field rather than pointing at a
file that is not there.

## 4. Add it to songs.js

```js
{ cat: "01-07", album: 1, track: 7, title: "Nobody Here Is Here", dur: 359,
  audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-07.mp3",
  lyric: "songs/01-07.json",
  note: "An island child steps off the plane into a bright city where …" }
```

`dur` in whole seconds, floored, off the master. `audio` is the **full
url**, exactly as `stories.js` stores a narration — nothing builds it
from parts. `note` is one or two sentences on what the song is; it is
also what the share card uses as its description, so write it to be read
cold by someone who has never heard it.

A Persian song also takes `fa: true` and a `translit`. A song drawn from
a book takes `book: 119`.

**Then update the album's `songs` and `dur`.** They are the sum of its
tracks, and §10 checks them.

## 5. Generate the share page

```
node build-song-shares.js
```

Writes all twenty-plus pages, album and song. Run it after `songs.js` is
updated and after the stamp is raised, because **the og:image url
carries the stamp** — see the note below.

## 6. Raise the cache stamp

In `index.html`, **six** lines end in `?v=` and the shared number:
`style.css`, `library/roya-library.css`, `stories.js`, `songs.js`,
`script.js`, `library/roya-library.js`. Raise all six together and move
the version in the header comment. Never move it backwards.

New artwork at a new path does not strictly need it. **Replaced artwork
does** — the stamp is what makes a replaced cover a new address.

## 7. Regenerate the feeds and the share pages

```
node build-feeds.js          # sitemap gains the #album- and #song- anchors
node build-song-shares.js    # every page, because the stamp is in og:image
```

**Both, every time the stamp moves.** The book share pages point at an
unstamped cover and that is a known defect — when a book cover is
replaced, Facebook and LinkedIn keep serving whatever they scraped
first. The song pages do not repeat it, and the price is regenerating
them whenever the number changes.

---

## Adding a whole album

1. Take the next album number. It is permanent.
2. Make the artwork — hero, both flat cuts, and the landscape card. Sizes
   and the sleeve-square check are §4 of `roya-recordings-format.md`.
3. Add the `ALBUMS` entry, including `order` — where it sits on the shelf,
   which is not the same thing as its number.
4. Then steps 1–7 above for each song on it.

---

## Before you call it done

- [ ] **Every card shows that song's own length.** Check three against the masters, including the shortest and the longest.
- [ ] Every `audio` url returns 200 and plays from the start.
- [ ] Album totals equal the sum of their songs.
- [ ] Lyric sheets: first line lands on the voice, nothing sits past `dur`.
- [ ] Persian renders right-to-left, zero-width non-joiners intact.
- [ ] Every share link's `og:image` returns 200 **with the current stamp on it**.
- [ ] `#album-AA` and `#song-AA-TT` both open the right thing **from a cold load**, not just from inside the site.
- [ ] Rendered at 1440 and 393: no broken requests, no horizontal scroll.
- [ ] The dock survives a view change.

## Three things that will catch you

**The Library is the home screen and cannot be closed.** `closeLibrary()`
begins `if (HOME && !force) return`, and the overlay is `z-index: 60`. The
Record Room opens *over* it at 62 and is painted opaque rather than
veiled, because at the usual 93 % a grid of 119 covers ghosts through the
words.

**The fifth nav header is injected at runtime.** About, Library, Listen
and Notes come from `SECTIONS` inside `library/roya-library.js`, which is
cut from the sandbox by `build-integration.py` and is **not in this
repository** — anything written there dies at the next build. So Songs is
added by `script.js`, in each nav's own markup, behind a MutationObserver,
because both navs are rebuilt on every view change. The guard is the
`data-view`: if the sandbox ever ships a Songs section, the injection
stands down by itself.

**The audio is never in the repository.** GitHub Pages caps a single file
at 100 MB and is not a media host. Seventeen songs at 192 kbps are about
128 MB, and they belong on B2.
