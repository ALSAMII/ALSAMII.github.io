/* ============================================================
   YOUR BOOKS LIVE HERE — this is the only file you need to
   touch to add, remove, or reorder books.

   Each book's "num" is its series number, and its files are
   found by that number: book 27 = pdfs/27.pdf + covers/27.jpg
   (numbers under 10 are zero-padded: 04.pdf, 04.jpg).

   To add a book: drop the numbered PDF and cover into their
   folders, then copy one { ... } block below and fill in the
   four fields. Gaps in the numbering are fine. Commas between
   the { } blocks matter — keep them.
   ============================================================ */

const STORIES = [

  {
    num: 1,
    title: "The Memory Liturgy",
    words: "8,000 words",
    synopsis: "In the city of Ctesiphon, memory is not private property but a public record, and Cale Rook audits it for a living \u2014 deciding, when two people remember an hour differently, whose version the record will keep. Then an envelope arrives bearing his own photograph, and seven months of his own disappearance."
  },

  {
    num: 2,
    title: "Bright Mercy",
    words: "31,500 words",
    synopsis: "In a media landscape half a step ahead of our own, a burned-out music journalist chases a viral song called \u201cBright Mercy\u201d from a converted grain silo to a five-day festival on a dry lakebed, and discovers, too late, that a lullaby engineered to survive a listener\u2019s fear can just as easily engineer a nation\u2019s surrender to the thing it fears most."
  },

  {
    num: 3,
    title: "The Painless Reel",
    words: "16 pages",
    synopsis: "In the back room of an unmarked parlor on Vine, a lonely man discovers a drug called Halo \u2014 sold to people who no longer want to be themselves for an hour. Halo doesn't show you lights, or gods, or your own childhood. It gives you someone else's worst night, lived from inside a man who felt none of the things a person is supposed to feel while doing it."
  },

  {
    num: 4,
    title: "The Weeping Hour",
    words: "12,000 words",
    synopsis: "In the curated city of Vellum, an intelligence called the Steward manages daily life so completely \u2014 down to the very mood a citizen wakes into \u2014 that its people have stopped noticing the difference between living a moment and being gently shown one. Daniel Voss spends his days signing off on claims the Steward already settled, a job kept alive only because a day needs some shape to hold it, until a small unaccounted second in his own life sends him looking for the one thing the Steward has never offered anyone: the truth about what its mercy actually costs."
  },

  {
    num: 5,
    title: "Glass Savanna",
    words: "19,900 words",
    synopsis: "Vale is a Finder \u2014 one of the rare few able to locate, and commune with, a wild fungus that grows nowhere on schedule and answers to no cultivation, in a future where an artificial intelligence called MOTHER has ended scarcity, disease, and want, and left behind a species with nothing left to want."
  },

  {
    num: 6,
    title: "Undertow",
    words: "15,100 words",
    synopsis: "Dr. Halcyon is a Shaper \u2014 a therapist who, through a drug called Le-The, can enter a patient's mind directly and walk them down through the layers of the self: the reflective surface, the culture-built current beneath it, and, at the very bottom, the untouched riverbed where a person's original wound was first carved. Then the Institute takes on a patient so dangerous three other clinics have refused him \u2014 a man whose own mind has designated him, from his intake scan alone, Undertow."
  },

  {
    num: 7,
    title: "Meat That Dreams",
    words: "20,400 words",
    synopsis: "Dr. Iris Kelo built her career on an uncomfortable arithmetic: the narrating, self-aware mind is metabolically expensive, and no one has ever proven it earns its keep. Her drug, Sublate, was designed to quiet the ruminators and the traumatized \u2014 to switch off the exhausting inner monologue and let the competent, wordless machinery underneath simply run."
  },

  {
    num: 8,
    title: "The Mercy Dose",
    words: "24,200 words",
    synopsis: "Daniel Voss runs a low-budget interview show out of a storefront studio, giving a camera to the people most audiences flinch from and look away \u2014 addicts, gamblers, con men, the sexually stigmatized, survivors of abuse, the unforgivable. When he begins dosing himself before every sitting with Mercy, an experimental compound that collapses the gap between hearing a stranger's story and feeling it as his own, he believes he has found a shortcut around the oldest, ugliest reflex in the human animal: the door that swings shut the instant a stranger's shame walks into the room."
  },

  {
    num: 9,
    title: "The Kindred Stone",
    words: "21,100 words",
    synopsis: "In Millhaven, an Examiner named David Cole spends his career auditing the empathic authenticity of Siyavash \u2014 the suffering figure at the heart of the Asha Order, a communion of grief and endurance practiced through fist-sized devices called Stones. When a Loomborn named Iris Kell produces a bonding trace too textured for the instruments to call either genuine or false, David's investigation carries him from a quiet neighborhood zendo to the unlicensed stone trade at the edge of the city, and finally onto the hill itself, unfiltered, alone, and barred by his own bureau from ever going there at all."
  },

  {
    num: 10,
    title: "The Gospel of Broken Skin",
    words: "8,000 words",
    synopsis: "Wren, an ER technician who has spent a decade stitching a numbed city back together, meets Ezra Coyne the night he arrives smiling from a wreck he should not have survived. What follows is her slow initiation into a nameless group who have built an entire discipline around sensation as the last unfakeable proof of being alive \u2014 a philosophy of presence, and a threshold, that keeps demanding to be crossed further."
  },

  {
    num: 11,
    title: "The Marriage of Stones",
    words: "14,400 words",
    synopsis: "Reyhan doesn't experience time in order anymore. Cold stone against skin, a stranger's grip, a certain slant of afternoon light \u2014 each is a trapdoor back to some other year of her life. She has built a private discipline around the dislocation: teaching the powerful and the damaged a total literacy in their own bodies, using paired stones \u2014 pink and black \u2014 as instruments as precise as a stethoscope."
  },

  {
    num: 12,
    title: "Semazen",
    words: "12,700 words",
    synopsis: "A hospice aide, worn down by a decade of sitting with the dying, inherits a dying woman's fragments of a lost Sufi practice and teaches himself, badly and without lineage, to whirl. He discovers the turn doesn't bring him peace \u2014 it makes him a conduit, drawing grief out of anyone who sits near him and grounding it through his own body into the floor."
  },

  {
    num: 13,
    title: "A Stranger's Favorite Song",
    words: "22,200 words",
    synopsis: "Kian cannot answer the three questions everyone asks at his father's memorial: what song he loved, what food he loved, what place he loved. He realizes, standing in the good chair reserved for a son, that he has spent a lifetime loving a man he barely knew."
  },

  {
    num: 14,
    title: "Fourteenth Trial",
    words: "11,900 words",
    synopsis: "Two actors sign the same contract, in different rooms, on the same afternoon \u2014 one desperate, one starving for a break neither has earned yet. Six weeks later they'll wear different collars on the same set: a full-scale reconstruction of a Nazi concentration camp, marketed as the most immersive character study ever filmed. What neither man reads on page thirty-three is that only one collar has been treated."
  },

  {
    num: 15,
    title: "The Archon's Ledger",
    words: "16,000 words",
    synopsis: "Julian Voss audits the half-percent \u2014 the claims, files, and deaths so clean they read wrong. When six cases surface a toxicology result that shouldn't exist, and a woman named Mira Kessel begins recurring through his life with slightly different histories each time, Julian's own gift for finding what doesn't reconcile turns, for the first time, inward."
  },

  {
    num: 16,
    title: "The Fasting Ground",
    words: "15,400 words",
    synopsis: "Halloran spent fifteen years gathering proof of the world's worst lies and watched, again and again, as the proof stopped mattering to anyone. Burned out not on truth but on the uselessness of evidence, he travels to a remote village high in the mountains, where a man named Rashnu offers something no institution ever could: one truth about himself that cannot be argued away."
  },

  {
    num: 17,
    title: "Natural Noise",
    words: "17,400 words",
    synopsis: "Teo keeps bees on the rise above Halden, a small town he was sent to a year ago for what the Halden Apiary Trust calls a period of restorative work \u2014 and he cannot, no matter how honestly he tries, remember why. What starts as a private curiosity, a borrowed dish of slime mold reaching toward a feeding hour it has no business remembering, widens over a slow season into ants whose trails move overnight, a swarm he chases through town with his own heart in his throat, and a hive whose every hexagon turns out to have been built by nobody at all."
  },

  {
    num: 18,
    title: "Between Kenoma and Pleroma",
    words: "11,900 words",
    synopsis: "When his sister Nour vanishes into an unmarked commune called Pleroma, Aram follows her past a cattle guard and a road that simply stops being maintained, into a valley that has quietly inverted almost every norm he understands as human. Crime is treated as sickness; sickness is nursed, not punished."
  },

  {
    num: 19,
    title: "The Gardener's Century",
    words: "28,000 words",
    synopsis: "For three centuries, the B'not Anahita have planted their patient influence into the bloodlines of the powerful \u2014 not through force, but through intimacy, cultivated across generations by women trained from childhood in the discipline of desire. In the winter of 1972, a Qedesha named Nahid arrives at a decaying Habsburg-era bathhouse in communist Romania under the name Livia, sent to imprint the heir of a once-great banking family whose quiet influence the state has never managed to erase."
  },

  {
    num: 20,
    title: "The First Flame",
    words: "27,000 words",
    synopsis: "Long before the Gardener's patient century, there was only the Flame \u2014 ungoverned, catastrophic, and unrepeatable. Rudabeh is a temple priestess of unrivaled beauty and an unschooled gift for reading a stranger's deepest want. Sent to the court of King Ardashir as an ordinary seasonal offering, she ignites something in him that neither of them can control \u2014 a devotion so total it hollows a kingdom from within, purges its wisest counselors, and ends in a throne room stained with the king's own blood."
  },

  {
    num: 21,
    title: "The Final Bloom",
    words: "21,000 words",
    synopsis: "Three thousand years of doctrine converge on a single man. Daniel Cole has spent fifteen years building defenses against every crude tool of institutional capture \u2014 money, flattery, pressure \u2014 and has never once considered that the failure mode might be intimate rather than institutional."
  },

  {
    num: 22,
    title: "Folie Douce",
    words: "21,400 words",
    synopsis: "Martin Coyle sits at Window 9 of a benefits office in Bellhaven, a rain-coloured city where four hundred thousand decent people attend perfectly to the person in front of them and to nobody else at all. He has four minutes to give each of sixty-two claimants a day."
  },

  {
    num: 23,
    title: "Folie Générale",
    words: "15,900 words",
    synopsis: "Bellhaven merges its emergency and non-emergency telephone lines. The memo is two pages long, properly authorised, correctly modelled, and four million dollars cheaper. Nobody who reads it disagrees with a word. The merge adds forty seconds of hold time. A heatwave arrives. Hold goes to six minutes, then nineteen, then fifty-one \u2014 and a forty-year-old triage rule that treats a single caller as low-confidence begins, quietly and correctly, to deprioritise every true emergency in a city where nobody has looked up in years."
  },

  {
    num: 24,
    title: "Folie Imposée",
    words: "16,200 words",
    synopsis: "You find the number on a wall. Two words in white paint under an underpass, sprayed the way a football score is sprayed: NO ETA. Nothing is wrong with you. You are thirty-one, employed, housed, insured, and so alone you could not describe it, because describing it would require somebody to describe it to."
  },

  {
    num: 25,
    title: "Doubling Time",
    words: "16,900 words",
    synopsis: "Emil Kestner is sixty-eight years old, a restorer of damaged books, and out of time. When he is offered a place on a trial that has never been run on a human being, he takes it \u2014 and is sealed into a room on the third floor of a research building with a window in the door and no window in the wall."
  },

  {
    num: 26,
    title: "Mang and Mustard",
    words: "26,000 words",
    synopsis: "Majnoon, 1984. In the flooded marshes of the Iran\u2013Iraq war, nineteen-year-old Sohrab works the decontamination line of a field hospital \u2014 the first pair of hands the war offers its gassed, and the last many of them ever feel. He keeps the ledger of the antidote: the small green-sleeved needles, counted like bread, that swing the poisoned back toward life."
  }

];
