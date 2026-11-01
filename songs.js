/* ════════════════════════════════════════════════════════════════
   songs.js — the recordings catalogue
   Version 3 · last updated 2026-10-31 22:50 PDT

   Hand-edited, like stories.js. Nothing generates this file.
   The house standard for everything in it is roya-recordings-format.md.

   ─── adding a song ───────────────────────────────────────────────
   Take the next catalogue number for its album, zero-padded: AA-TT.
   The number is permanent once published — it is in the B2 path and
   in the share URL — so it never changes, even if the album is
   reordered afterwards.

   `dur` is SECONDS, read off the master with ffprobe, never
   estimated. A card showing another song's length is the same class
   of error as a book card showing another book's reading time.

   `audio` is the full URL, exactly as stories.js stores a narration.
   Nothing here builds a URL from parts.
   ──────────────────────────────────────────────────────────────── */

const ALBUMS = [
  {
    num: 1,
    title: "Minister of Calm",
    fa: false,
    /* Where it sits on the shelf. Separate from `num` on purpose:
       the number is an identity, the order is a presentation. */
    order: 1,
    songs: 10,
    dur: 3128,                       /* 52:08 — the sum of its songs */
    released: "2026-11",
    syn: "Ten songs about letting go of the wheel. Everyone on this record has run somewhere to find peace — another country, another door, the far edge of the map — and every one of them arrives to learn it was never out there. Dark reggae underneath, downtempo house over it, and a title track that asks for an official of quiet because nobody else is handing it out."
  },
  {
    num: 3,
    title: "آروم همین‌جاست",
    translit: "Aroom hamin-jast",       /* slug only — permanent, in the share URL */
    en: "Calm Is Right Here",
    fa: true,
    order: 2,
    songs: 5,
    dur: 1547,                       /* 25:47 */
    released: "2026-11",
    syn: "Five songs in Persian for the things the English ones couldn't carry. A city drawn wrong, a reed cut from its bed, a night asked not to end, a wall addressed instead of a person, and one second that never stopped."
  },
  {
    num: 2,
    title: "Roya",
    fa: false,
    order: 3,
    songs: 2,
    dur: 586,                        /* 9:46 */
    released: "2026-11",
    open: true,                      /* this one keeps growing */
    /* [[slug|words]] is a link to a book's card in the Library — the slug is
       the book's share-page name without .html. Share pages print the words
       alone; the page makes them a link. */
    syn: "The two songs taken straight out of the books. A lullaby from [[02-bright-mercy|Bright Mercy]], book No. 2, that a crowd sings itself into the dark with, and what Laleh sings at the end of [[119-the-light-is-yours-to-take|The Light Is Yours to Take]], book No. 119. This one grows as the books do."
  }
];

const SONGS = [

  /* ─── Album 1 · Minister of Calm ─────────────────────────────── */
  { cat: "01-01", album: 1, track: 1, title: "Minister of Calm", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-01.mp3",
    lyric: "songs/01-01.json",
    note: "A petition, sung as a chant, for a public office that doesn't exist: someone whose actual job is to lower the temperature. It isn't anti-authority so much as exhausted by it — “I don't wanna shoot the man who's flying the plane, but I'm tired of the rules that keep changing the lane.”" },

  { cat: "01-02", album: 1, track: 2, title: "Hands Off, Heart On", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-02.mp3",
    lyric: "songs/01-02.json",
    note: "Control fails at altitude and the choice is to fight the drift or move with it. Letting go of the wheel turns out to be the only thing that keeps you going." },

  { cat: "01-03", album: 1, track: 3, title: "Here Be No Dragons", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-03.mp3",
    lyric: "songs/01-03.json",
    note: "Mapmakers drew monsters where the known world stopped. The narrator goes to that edge and finds nothing there to fear — the terror was the clenched fist, not what was past it." },

  { cat: "01-04", album: 1, track: 4, title: "Right Where We Are", dur: 329,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-04.mp3",
    lyric: "songs/01-04.json",
    note: "A lifetime of horizons, a hundred rooms with nothing on the walls, and the discovery that the thing being chased is standing next to you. The one straightforwardly tender song on the record." },

  { cat: "01-05", album: 1, track: 5, title: "The Long Way to Quiet", dur: 299,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-05.mp3",
    lyric: "songs/01-05.json",
    note: "Every door calls your name and promises the same quiet; only one of them is telling the truth. He walks through all of them to find the quiet was already there before he started." },

  { cat: "01-06", album: 1, track: 6, title: "Stranger Than We Suppose", dur: 299,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-06.mp3",
    lyric: "songs/01-06.json",
    note: "He spent half a life trying to hold the whole ocean in one hand and measure the plan. Every lock he picked only showed him how little he knew — so he stops counting and lets it glow." },

  { cat: "01-07", album: 1, track: 7, title: "Nobody Here Is Here", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-07.mp3",
    lyric: "songs/01-07.json",
    note: "An island child steps off the plane into a bright city where everybody is running from the clock. Full tables and slow evenings traded for a place where everyone has arrived and nobody is present." },

  { cat: "01-08", album: 1, track: 8, title: "Just Don’t Be Gone", dur: 269,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-08.mp3",
    lyric: "songs/01-08.json",
    note: "Washing someone's hair, waiting for a tap on the pipes, asking to be fought with the way they used to fight. A vigil at a bedside, told entirely in small physical requests rather than grief." },

  { cat: "01-09", album: 1, track: 9, title: "Hold Me Under", dur: 257,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-09.mp3",
    lyric: "songs/01-09.json",
    note: "The warm room where nothing hurts and a mother laughs from a kitchen that burned down years ago. It's the inside of going under, and the last thing it says is “hold me up”." },

  { cat: "01-10", album: 1, track: 10, title: "Two Ghosts", dur: 239,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-10.mp3",
    lyric: "songs/01-10.json",
    note: "Two strangers at a petrol station, each wearing a look the other recognises because they wore it last week. Neither wants to go back and neither wants to run alone." },

  /* ─── Album 3 · آروم همین‌جاست ───────────────────────────────── */
  { cat: "03-01", album: 3, track: 1, title: "آروم همین‌جاست", fa: true,
    translit: "Aroom hamin-jast", en: "Calm Is Right Here", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-01.mp3",
    lyric: "songs/03-01.json",
    note: "The city is a map drawn wrong, every alley a door promising calm, and behind none of them a home. He drew the map himself, and he's the dragon on it too — the calm turns out to be in the breath he was holding." },

  { cat: "03-02", album: 3, track: 2, title: "بسوزونم", fa: true,
    translit: "Besoozoonam", en: "Let Me Burn", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-02.mp3",
    lyric: "songs/03-02.json",
    note: "It opens where Rumi opens, with the reed cut from the reed bed, crying because it was cut. Being pulled out of the soil and planted in the wind, and a voice that only becomes a voice through the separation that made it." },

  { cat: "03-03", album: 3, track: 3, title: "تا شب تموم نشه", fa: true,
    translit: "Ta shab tamoom nashe", en: "Don't Let the Night End", dur: 306,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-03.mp3",
    lyric: "songs/03-03.json",
    note: "Two people asking the night not to finish, looking for somewhere the day can't reach and nobody's hand can find them. The most straightforwardly romantic song in the catalogue, and the most frightened underneath." },

  { cat: "03-04", album: 3, track: 4, title: "ساکت نباش", fa: true,
    translit: "Saket nabash", en: "Don't Be Silent", dur: 239,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-04.mp3",
    lyric: "songs/03-04.json",
    note: "Addressed to a wall, because there's nobody else to address. A child left in the morning and didn't come back at night, and the song's whole argument is in its title and its last line: say it loud — I'll remember." },

  { cat: "03-05", album: 3, track: 5, title: "هنوز", fa: true,
    translit: "Hanooz", en: "Still", dur: 284,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-05.mp3",
    lyric: "songs/03-05.json",
    note: "A glance, a second longer than it needed to be, a warmer hello, two chairs and a table between. Nothing happened, and it is still happening." },

  /* ─── Album 2 · Roya ─────────────────────────────────────────── */
  { cat: "02-01", album: 2, track: 1, title: "Don’t Come to the Door", dur: 359,
    book: 119, bookSlug: "119-the-light-is-yours-to-take",
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/02-01.mp3",
    lyric: "songs/02-01.json",
    note: "A mother at the piano telling a child to stay asleep, through four verses, while something happens in the courtyard she isn't hearing. The fifth verse unsays every one of the first four." },

  { cat: "02-02", album: 2, track: 2, title: "Bright Mercy", dur: 227,
    book: 2, bookSlug: "02-bright-mercy",
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/02-02.mp3",
    lyric: "songs/02-02.json",
    note: "The four-note lullaby from No. 2, the one engineered to survive a listener's fear. Sung by a whole lakebed on the last night, it stops being a lullaby and becomes permission." }
];

/* Written but not yet recorded. Kept here so they are not lost, and
   so neither gets a catalogue number before its audio exists.
     · Sky, Hold Mi — full lyric, no recording, album undecided
     · Here Be No Dragons (Slowed) — same words as 01-03, slower
       arrangement; whether it is a separate track is open
   Neither appears on the site. */
const SONGS_PENDING = ["Sky, Hold Mi", "Here Be No Dragons (Slowed)"];
