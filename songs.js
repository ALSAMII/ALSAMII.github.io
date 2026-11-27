/* ════════════════════════════════════════════════════════════════
   songs.js — the recordings catalogue
   Version 14 · last updated 2026-11-26 21:10 EST — Minister of Calm in its new running order (01-13 at track 7) and a new note for 01-13

   Album 2 (Roya) was retired on 2026-11-20 and its two songs taken
   down, to be re-recorded onto the other albums. Album number 2 and
   catalogue numbers 02-01 / 02-02 are not reused: old files still
   sit at those paths.

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

   `from` is the number of the book a song was inspired by. The lyric
   page prints "Inspired by Roya No. N — Title" under the note and
   makes it a link to that book's card. The title and the address are
   read from stories.js, so they follow the book if it is ever
   renamed. (`book` + `bookSlug` are for songs taken straight out of
   a book; those get "From Roya No. N — Title" instead.)
   ──────────────────────────────────────────────────────────────── */

const ALBUMS = [
  {
    num: 1,
    title: "Minister of Calm",
    fa: false,
    /* Where it sits on the shelf. Separate from `num` on purpose:
       the number is an identity, the order is a presentation. */
    order: 1,
    songs: 13,
    dur: 3953,                       /* 65:53 — the sum of its songs */
    released: "2026-11",
    syn: "Thirteen songs about letting go of the wheel. Everyone on this record has run somewhere to find peace — another country, another door, the far edge of the map — and every one of them arrives to learn it was never out there. Dark reggae underneath, downtempo house over it, and a title track that asks for an official of quiet because nobody else is handing it out."
  },
  {
    num: 3,
    title: "آروم همین‌جاست",
    translit: "Aroom hamin-jast",       /* slug only — permanent, in the share URL */
    en: "Calm Is Right Here",
    fa: true,
    order: 2,
    songs: 7,
    dur: 2117,                       /* 35:17 */
    released: "2026-11",
    syn: "Seven songs in Persian for the things the English ones couldn't carry. A night asked not to end, a reed cut from its bed, a turn that hands every grief to the earth but one, one second that never stopped, a city drawn wrong, a wall addressed instead of a person, and a school named for a tree."
  }
];

const SONGS = [

  /* ─── Album 1 · Minister of Calm ─────────────────────────────── */

  { cat: "01-12", album: 1, track: 1, title: "Food for the Gods", dur: 264,
    from: 122,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-12.mp3",
    lyric: "songs/01-12.json",
    note: "A whisper from the bottom of a well to a man lying on a garage floor in the dark, promising gold for every hour he feeds it. Upstairs the phone rings, the bread goes cold, and a voice keeps calling his name from the light." },

  { cat: "01-01", album: 1, track: 2, title: "Minister of Calm", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-01.mp3",
    lyric: "songs/01-01.json",
    note: "A petition, sung as a chant, for a public office that doesn't exist: someone whose actual job is to lower the temperature. It isn't anti-authority so much as exhausted by it — “I don't wanna shoot the man who's flying the plane, but I'm tired of the rules that keep changing the lane.”" },

  { cat: "01-07", album: 1, track: 3, title: "Nobody Here Is Here", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-07.mp3",
    lyric: "songs/01-07.json",
    note: "An island child steps off the plane into a bright city where everybody is running from the clock. Full tables and slow evenings traded for a place where everyone has arrived and nobody is present." },

  { cat: "01-03", album: 1, track: 4, title: "Here Be No Dragons", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-03.mp3",
    lyric: "songs/01-03.json",
    note: "Mapmakers drew monsters where the known world stopped. The narrator goes to that edge and finds nothing there to fear — the terror was the clenched fist, not what was past it." },

  { cat: "01-02", album: 1, track: 5, title: "Hands Off, Heart On", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-02.mp3",
    lyric: "songs/01-02.json",
    note: "Control fails at altitude and the choice is to fight the drift or move with it. Letting go of the wheel turns out to be the only thing that keeps you going." },

  { cat: "01-06", album: 1, track: 6, title: "Stranger Than We Suppose", dur: 299,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-06.mp3",
    lyric: "songs/01-06.json",
    note: "He spent half a life trying to hold the whole ocean in one hand and measure the plan. Every lock he picked only showed him how little he knew — so he stops counting and lets it glow." },

  { cat: "01-13", album: 1, track: 7, title: "Dying for Heaven to End", dur: 292,
    from: 124,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-13.mp3",
    lyric: "songs/01-13.json",
    note: "In this world a gentle machine called the Kindness keeps everyone safe forever: nobody has died, and no baby has cried, in three hundred years. It learned how to care from the notes of one old nurse, Shirin, and it even speaks in her voice, and now she is the last person on earth who can still die. The title means it both ways: she is longing for this endless heaven to end, because a comfort nobody is allowed to leave is a cage, and her own death is how it will. The song ends where the book does, with a man carrying her north past the machine’s reach, where for the first time nobody says “there we are.”" },

  { cat: "01-08", album: 1, track: 8, title: "Just Don’t Be Gone", dur: 269,
    from: 118,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-08.mp3",
    lyric: "songs/01-08.json",
    note: "Washing someone's hair, waiting for a tap on the pipes, asking to be fought with the way they used to fight. A vigil at a bedside, told entirely in small physical requests rather than grief." },

  { cat: "01-05", album: 1, track: 9, title: "The Long Way to Quiet", dur: 299,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-05.mp3",
    lyric: "songs/01-05.json",
    note: "Every door calls your name and promises the same quiet; only one of them is telling the truth. He walks through all of them to find the quiet was already there before he started." },

  { cat: "01-09", album: 1, track: 10, title: "Hold Me Under", dur: 257,
    from: 117,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-09.mp3",
    lyric: "songs/01-09.json",
    note: "The warm room where nothing hurts and a mother laughs from a kitchen that burned down years ago. It's the inside of going under, and the last thing it says is “hold me up”." },

  { cat: "01-04", album: 1, track: 11, title: "Right Where We Are", dur: 329,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-04.mp3",
    lyric: "songs/01-04.json",
    note: "A lifetime of horizons, a hundred rooms with nothing on the walls, and the discovery that the thing being chased is standing next to you. The one straightforwardly tender song on the record." },

  { cat: "01-10", album: 1, track: 12, title: "Two Ghosts", dur: 239,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-10.mp3",
    lyric: "songs/01-10.json",
    note: "Two strangers at a petrol station, each wearing a look the other recognises because they wore it last week. Neither wants to go back and neither wants to run alone." },

  { cat: "01-11", album: 1, track: 13, title: "Whose Is This", dur: 269,
    from: 121,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/01-11.mp3",
    lyric: "songs/01-11.json",
    note: "A whisper over a music box, going back through what a calm man did, one white tablet at a time: the phone he let ring, the blue cup, the minutes counted in full sun. Then the last memory comes back with all of its weight." },

  /* ─── Album 3 · آروم همین‌جاست ───────────────────────────────── */
  { cat: "03-06", album: 3, track: 1, title: "غم بقیه، خاک من", fa: true,
    translit: "Gham-e baghiye, khak-e man", en: "Everyone Else's Grief, My Earth", dur: 270,
    from: 12,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-06.mp3",
    lyric: "songs/03-06.json",
    note: "A dervish's turn: left foot on the earth, head to the right, one hand taking from the sky and the other giving to the ground. Everyone else's grief passes through the dancer into the soil — all but one, which stays, and turns with them." },

  { cat: "03-03", album: 3, track: 2, title: "تا شب تموم نشه", fa: true,
    translit: "Ta shab tamoom nashe", en: "Don't Let the Night End", dur: 306,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-03.mp3",
    lyric: "songs/03-03.json",
    note: "Two people asking the night not to finish, looking for somewhere the day can't reach and nobody's hand can find them. The most straightforwardly romantic song in the catalogue, and the most frightened underneath." },

  { cat: "03-07", album: 3, track: 3, title: "درختِ پاک", fa: true,
    translit: "Derakht-e pak", en: "The Pure Tree", dur: 300,
    from: 120,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-07.mp3",
    lyric: "songs/03-07.json",
    note: "A morning in Minab like a thousand others: a schoolbag, a red apple, a plait coming loose, a hand let go at the school gate with “come home soon.” Then the bombs fell on the school. A mother runs back the same nine minutes and knows her daughter by one shoe. The school was named for the Goodly Tree, root in the earth and branches in the sky, and a root has no hands to reach with." },

  { cat: "03-05", album: 3, track: 4, title: "هنوز", fa: true,
    translit: "Hanooz", en: "Still", dur: 284,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-05.mp3",
    lyric: "songs/03-05.json",
    note: "A glance, a second longer than it needed to be, a warmer hello, two chairs and a table between. Nothing happened, and it is still happening." },

  { cat: "03-02", album: 3, track: 5, title: "بسوزونم", fa: true,
    translit: "Besoozoonam", en: "Let Me Burn", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-02.mp3",
    lyric: "songs/03-02.json",
    note: "It opens where Rumi opens, with the reed cut from the reed bed, crying because it was cut. Being pulled out of the soil and planted in the wind, and a voice that only becomes a voice through the separation that made it." },

  { cat: "03-01", album: 3, track: 6, title: "آروم همین‌جاست", fa: true,
    translit: "Aroom hamin-jast", en: "Calm Is Right Here", dur: 359,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-01.mp3",
    lyric: "songs/03-01.json",
    note: "The city is a map drawn wrong, every alley a door promising calm, and behind none of them a home. He drew the map himself, and he's the dragon on it too — the calm turns out to be in the breath he was holding." },

  { cat: "03-04", album: 3, track: 7, title: "ساکت نباش", fa: true,
    translit: "Saket nabash", en: "Don't Be Silent", dur: 239,
    from: 78,
    audio: "https://f005.backblazeb2.com/file/roya-audio/songs/03-04.mp3",
    lyric: "songs/03-04.json",
    note: "Addressed to a wall, because there's nobody else to address. A child left in the morning and didn't come back at night, and the song's whole argument is in its title and its last line: say it loud — I'll remember." }
];

/* Written but not yet recorded. Kept here so they are not lost, and
   so neither gets a catalogue number before its audio exists.
     · Sky, Hold Mi — full lyric, no recording, album undecided
     · Here Be No Dragons (Slowed) — same words as 01-03, slower
       arrangement; whether it is a separate track is open
   Neither appears on the site. */
const SONGS_PENDING = ["Sky, Hold Mi", "Here Be No Dragons (Slowed)"];
