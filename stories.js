/* ============================================================
   YOUR BOOKS LIVE HERE — this is the only file you need to
   touch to add, remove, or reorder books.

   Each book's "num" is its series number, and its files are
   found by that number: book 27 = pdfs/27.pdf + covers/27.jpg
   (numbers under 10 are zero-padded: 04.pdf, 04.jpg).

   To add a book: drop the numbered PDF and cover into their
   folders, then copy one { ... } block below and fill in the
   fields. Gaps in the numbering are fine. Commas between
   the { } blocks matter — keep them.

   door / key / substance feed the three dropdowns above the
   list. The third menu, "What turns it", is built from the part
   of "substance" before the em dash — so keep writing that field
   as "Name \u2014 what it does". Reuse an existing door and key
   where one fits; a new spelling makes a new menu entry. Leave
   all three out and the book still shows in the full list, it
   just never appears under a filter.
   ============================================================ */

const STORIES = [

  {
    num: 1,
    title: "The Memory Liturgy",
    words: "8,000 words",
    door: "Dose",
    key: "Play It Back",
    substance: "Verity \u2014 sacrament issued to auditors; lets one mind hold another's memory as its own",
    synopsis: "Memory is a public record in Ctesiphon, and Cale Rook audits it for a living \u2014 deciding whose version of an hour survives. Then an envelope arrives holding his own photograph, and seven months of his own life he cannot account for. This time, the record is him."
  },

  {
    num: 2,
    title: "Bright Mercy",
    words: "31,500 words",
    door: "Rite",
    key: "Hearing Things",
    substance: "\u201cBright Mercy\u201d \u2014 a song engineered to survive a listener's fear",
    synopsis: "A burned-out music journalist follows a viral lullaby from a grain silo to a dry lakebed \u2014 and finds the night an entire chain of command hummed the same four notes on its way to a decision no one could take back. The song hasn't ended. It's moved into the walls."
  },

  {
    num: 3,
    title: "The Painless Reel",
    words: "16 pages",
    door: "Dose",
    key: "Nothing Hurts Here",
    substance: "Halo \u2014 an hour inside a man who never flinched; relief where dread should live",
    synopsis: "In a back room on Vine, a drug called Halo sells the strangest peace on the market: someone else's worst night, lived from inside a man who felt nothing while doing it. He tells himself he's only visiting \u2014 until an unlabeled fifth reel shows him hands he knows."
  },

  {
    num: 4,
    title: "The Weeping Hour",
    words: "12,000 words",
    door: "Dose",
    key: "Take It Together",
    substance: "Kairos \u2014 felt time, dosed drop by drop through the eyes",
    synopsis: "In Vellum, a machine curates every citizen's day down to the mood they wake into. One unaccounted-for second sends Daniel Voss to a dealer selling Kairos \u2014 felt time, drop by drop through the eyes \u2014 and toward the one truth the machine's mercy was built to spare him."
  },

  {
    num: 5,
    title: "Glass Savanna",
    words: "19,900 words",
    door: "Rite",
    key: "Look Closer",
    substance: "The Communion \u2014 a wild fungus; drops the user 400,000 years into a hunter-gatherer body",
    synopsis: "MOTHER ended hunger, disease, and want \u2014 and left a species with nothing left to want. A forbidden mushroom drops Vale four hundred thousand years into a hunter-gatherer's cold, grief, and astonishment, where she begins to suspect the machine built to end suffering has spent ninety patient years trying to give it back."
  },

  {
    num: 6,
    title: "Undertow",
    words: "15,100 words",
    door: "Dose",
    key: "Made to Believe",
    substance: "Le-The \u2014 lets a therapist enter a patient's mind and descend to the original wound",
    synopsis: "Through a drug called Le-The, Dr. Halcyon walks his patients down through the layers of the self, to the riverbed where the original wound was carved. Then the Institute admits a man three clinics refused \u2014 a patient whose own mind, from the intake scan alone, has named him Undertow."
  },

  {
    num: 7,
    title: "Meat That Dreams",
    words: "20,400 words",
    door: "Dose",
    key: "Quiet the Basement",
    substance: "Sublate \u2014 switches off the inner monologue; the wordless machinery underneath runs better",
    synopsis: "Sublate switches off the exhausting inner narrator, and Dr. Kelo's subjects become superb at living without it. Seven hundred feet beneath a dead reservoir, something folklore called a vampire begins to wake \u2014 and Kelo learns what the voice in a human head was always for."
  },

  {
    num: 8,
    title: "The Mercy Dose",
    words: "24,200 words",
    door: "Dose",
    key: "Take It Together",
    substance: "Mercy \u2014 collapses the gap between hearing a stranger's story and feeling it",
    synopsis: "Daniel Voss gives a camera to the people audiences flinch from \u2014 dosed on Mercy, a compound that makes a stranger's confession feel like his own. Eight sittings, each hiding a harder truth beneath the first, and a final chair reserved for the one man the chemical was never built to survive: his father."
  },

  {
    num: 9,
    title: "The Kindred Stone",
    words: "21,100 words",
    door: "Rite",
    key: "Made to Believe",
    substance: "The Stones \u2014 fist-sized devices for communion in shared grief and endurance",
    synopsis: "David Cole audits the authenticity of a god's suffering \u2014 grief piped through fist-sized Stones into a faithful city. Then one trace surfaces that the instruments can't call genuine or false, and the trail leads to the forbidden hill itself, where the real question isn't whether the suffering was human."
  },

  {
    num: 10,
    title: "The Gospel of Broken Skin",
    words: "8,000 words",
    door: "Ordeal",
    key: "Written in Skin",
    substance: "The threshold \u2014 sensation as the last unfakeable proof of being alive",
    synopsis: "Wren has spent ten years stitching a numbed city back together when Ezra Coyne walks smiling out of a wreck he shouldn't have survived. His nameless circle treats sensation as the last unfakeable proof of being alive \u2014 a threshold that keeps demanding to be crossed further. Someone is about to find the last one."
  },

  {
    num: 11,
    title: "The Marriage of Stones",
    words: "14,400 words",
    door: "Ordeal",
    key: "Past the Edge",
    substance: "Paired stones, pink and black \u2014 instruments of total bodily literacy",
    synopsis: "Reyhan doesn't live her life in order \u2014 a stranger's grip or a slant of afternoon light can trapdoor her into any year of it. With paired stones, pink and black, she teaches the powerful a total literacy of their own bodies. Her new client has mastered everything but himself, and their sessions are half seduction, half interrogation \u2014 of her."
  },

  {
    num: 12,
    title: "Semazen",
    words: "12,700 words",
    door: "Rite",
    key: "The Loop",
    substance: "The turn \u2014 whirling without lineage; grief drawn through the body into the floor",
    synopsis: "A worn-down hospice aide teaches himself, badly and without lineage, to whirl \u2014 and finds the turn doesn't bring peace. It makes him a doorway, pulling grief out of anyone near him and grounding it through his own body. Then one grief goes in barbed, and won't pass through, and won't leave."
  },

  {
    num: 13,
    title: "A Stranger's Favorite Song",
    words: "22,200 words",
    door: "Rite",
    key: "Play It Back",
    substance: "Alzheimer's \u2014 time and self from inside a mind coming apart",
    synopsis: "At his father's memorial, Kian can't answer the three simplest questions: what song he loved, what food, what place. A story about losing a man twice \u2014 once to forgetting, once to death \u2014 and the strange, late mercy of understanding a father only after becoming one."
  },

  {
    num: 14,
    title: "Fourteenth Trial",
    words: "11,900 words",
    door: "Dose",
    key: "Made to Believe",
    substance: "The compound \u2014 an unnamed classified agent; chemical certainty mistaken for talent",
    synopsis: "Two actors sign the same contract on the same afternoon. Six weeks later they wear different collars on a full-scale reconstruction of a concentration camp, filmed as the most immersive character study ever made. What neither of them read on page thirty-three: only one collar has been treated."
  },

  {
    num: 15,
    title: "The Archon's Ledger",
    words: "16,000 words",
    door: "Rite",
    key: "Made to Believe",
    substance: "An unregulated compound \u2014 plus a lapsed seminarian's leaked manuscript",
    synopsis: "Julian Voss audits the half-percent \u2014 deaths so clean they read wrong. Six cases share a toxicology result that shouldn't exist, and one woman keeps recurring through his life with slightly different histories each time. The fracture leads to the thing administering the walls of his world: an authority utterly sincere in its own ignorance."
  },

  {
    num: 16,
    title: "The Fasting Ground",
    words: "15,400 words",
    door: "Ordeal",
    key: "Starve It Out",
    substance: "Three ordeals \u2014 the fast, the cold immersion, the death vigil",
    synopsis: "Fifteen years of gathering proof of the world's worst lies taught Halloran one thing: evidence stopped mattering. In a mountain village, a man named Rashnu offers what no institution ever could \u2014 one truth about himself that cannot be argued away. The price is a fast, a freezing river, a stranger's deathbed, and the story he's told for eleven years."
  },

  {
    num: 17,
    title: "Natural Noise",
    words: "17,400 words",
    door: "Rite",
    key: "Made to Believe",
    substance: "Restorative work \u2014 a year of conditioning he can't remember consenting to",
    synopsis: "Teo keeps bees above Halden, sent there a year ago for reasons he cannot \u2014 no matter how honestly he tries \u2014 remember. The slime mold remembers feeding hours. The ant trails move overnight. Log by log, Teo builds the case that his entire life has been arranged \u2014 against the bees' quiet counter-argument that some things can't be."
  },

  {
    num: 18,
    title: "Between Kenoma and Pleroma",
    words: "11,900 words",
    door: "Rite",
    key: "Made to Believe",
    substance: "Haoma \u2014 a sacrament passed at every meal; binds a table to itself",
    synopsis: "When his sister vanishes into a valley commune called Pleroma, Aram follows \u2014 into a place where crime is nursed as sickness, marriage is chosen aloud each year, and a sacrament binds every table. The kindness turns out to have a floor. And the valley decides, almost invisibly, which griefs are worth continuing to see."
  },

  {
    num: 19,
    title: "The Gardener's Century",
    words: "28,000 words",
    door: "Rite",
    key: "Made to Believe",
    substance: "The Gardener method \u2014 desire cultivated across generations",
    synopsis: "For three centuries the B'not Anahita have planted their influence in the bloodlines of the powerful \u2014 not by force, but by desire, cultivated across generations. Romania, 1972: a Qedesha named Nahid arrives at a decaying bathhouse to imprint a banking heir, and finds a loneliness that answers something in her own carefully governed heart."
  },

  {
    num: 20,
    title: "The First Flame",
    words: "27,000 words",
    door: "Rite",
    key: "Made to Believe",
    substance: "The Flame \u2014 ungoverned, catastrophic, unrepeatable",
    synopsis: "Before the Gardener's patient century, there was only the Flame \u2014 ungoverned and unrepeatable. Rudabeh, a temple priestess who reads a stranger's deepest want on sight, ignites a king's devotion so total it hollows his kingdom and ends in his blood. In the wreckage she must choose: hide the gift, or forge it into the discipline three thousand years will answer to."
  },

  {
    num: 21,
    title: "The Final Bloom",
    words: "21,000 words",
    door: "Rite",
    key: "Made to Believe",
    substance: "Tarsim \u2014 methylation-writing; Flame and Gardener held whole",
    synopsis: "Daniel Cole spent fifteen years armoring himself against every crude tool of capture \u2014 money, flattery, pressure \u2014 and never considered the failure mode might be intimate. Shirin wasn't found or chosen. She was designed: the first Qedesha in three thousand years to hold both Flame and Gardener whole. He guards the future of the species. She has all the patience ever bred."
  },

  {
    num: 22,
    title: "Folie Douce",
    words: "21,400 words",
    door: "Withholding",
    key: "Four Minutes Each",
    substance: "Attention \u2014 dispensed all day, untrained, in doses too small to notice",
    synopsis: "Martin Coyle works Window 9: sixty-two claimants a day, four minutes each, never enough, nobody's fault. Then a stranger's form lands with a four-character error, and Coyle discovers the world contains no mechanism requiring him to hurry. Everything that follows is courteous, correct, defensible in writing \u2014 and built to prove one bad day can drive the sanest person alive to lunacy."
  },

  {
    num: 23,
    title: "Folie Générale",
    words: "15,900 words",
    door: "Withholding",
    key: "Nobody Called",
    substance: "Hold time \u2014 forty seconds becomes fifty-one minutes",
    synopsis: "Bellhaven merges its emergency and non-emergency lines \u2014 two pages, properly authorised, four million cheaper, and nobody who reads the memo disagrees. The merge adds forty seconds of hold. Then a heatwave. No villain authors what follows; every decision is correct and will be found correct. By the third night, the city stops burning loudly and starts burning quietly."
  },

  {
    num: 24,
    title: "Folie Imposée",
    words: "16,200 words",
    door: "Withholding",
    key: "Eleven Seconds",
    substance: "Being heard \u2014 undivided attention from someone who won't leave",
    synopsis: "Two words in white paint under an underpass: NO ETA. You call. You stand outside a door for three days. Then a man comes out, says your whole name, and your legs stop holding you. They're called the Second Ring, and they answer when nobody else does \u2014 and they're about to discover they need the city to keep failing."
  },

  {
    num: 25,
    title: "Doubling Time",
    words: "16,900 words",
    door: "Dose",
    key: "Quiet the Basement",
    substance: "CONSENSUS \u2014 not a drug; countless small agents that repair, then keep repairing",
    synopsis: "Emil Kestner, sixty-eight, a restorer of damaged books, is out of time \u2014 so he takes a trial never run on a human being, sealed in a room where the air only flows inward. The treatment works. Then it goes on working. Four people come to his door across eleven months, and none can answer the only question that matters: what stops it."
  },

  {
    num: 26,
    title: "Mang and Mustard",
    words: "26,000 words",
    door: "Dose",
    key: "Take It Together",
    substance: "Mang \u2014 the antidote in overdose; three cups, seven days of witnesses, a door",
    synopsis: "Majnoon, 1984. Nineteen-year-old Sohrab keeps the ledger of the antidote \u2014 green-sleeved needles, counted like bread, that pull the gassed back toward life. Then the count stops balancing, and twelve missing needles lead to a secret congregation of survivors who know what the old corpse-washer knows: in overdose, the medicine becomes a door. The dead are waiting on the far side, with questions."
  },

  {
    num: 27,
    title: "The Clear Ones",
    words: "18,600 words",
    door: "Ordeal",
    key: "Starve It Out",
    substance: "The clarity \u2014 hunger's late stage; reading the queue's changing eyes",
    synopsis: "Kharkiv oblast, winter 1932. The grain is gone, the roads are closed, and one door in the raion town stays lit: the state gold store, where the starving buy back their own bread with wedding rings and the crosses their grandmothers buried in 1918. Danylo keeps the scale \u2014 item, weight, fineness, receipt \u2014 and by night a second book, for the words engraved inside the rings. Then he begins to sort the eyes in his queue, and finds a third kind: serene, courteous, asking for nothing. Every one of them is dead within days."
  },

  {
    num: 28,
    title: "Marsh and Machete",
    words: "20,100 words",
    door: "Ordeal",
    key: "Don't Move",
    substance: "The stillness \u2014 mud for clothing, water for a roof, ten motionless hours",
    synopsis: "Rwanda, April 1994. On a hill above the papyrus marshes, Vestine has traded the same greeting with her neighbour every market morning for ten years \u2014 muraho, you are still there. Then a plane comes down, the radio's warm-voiced Cousin announces the household has work to do, and her own house is informed, courteously, that it is not until Thursday. In the marsh she learns the season's one surviving discipline: mud for clothing, water for a roof, ten motionless hours a day among the floating dead."
  },

  {
    num: 29,
    title: "The Quiet Ones",
    words: "18,900 words",
    door: "Rite",
    key: "The Loop",
    substance: "The rocking \u2014 the body's last self-made answer when nothing answers",
    synopsis: "Romania, 1989. Decree 770 has forced a birth rate for a generation, and the surplus children are warehoused in institutions with a beautiful name \u2014 leag\u0103ne, cradles \u2014 at one caregiver to forty infants. Lidia is a decree child herself, aged out at eighteen and hired back as a night attendant: the machine staffing itself with its own product. Her unauthorised notebook records the two things the state's files cannot hold \u2014 the silence of wards where hundreds of infants have each concluded that crying reaches no one, and the rocking."
  },

  {
    num: 30,
    title: "Model and Meadow",
    words: "21,000 words",
    door: "Rite",
    key: "Look Closer",
    substance: "The frame \u2014 breathing, rhythm, seeing; four lines and an hour",
    synopsis: "Terez\u00edn, 1942. The fortress ghetto is a town built to be looked at \u2014 sixty thousand people in a town of seven thousand beds, two truths running at all times. Eva, eleven, is sent to Room Twenty-Eight, where thirty girls run a civilization on a constitution of their own, and where on Thursdays, in a basement, a woman who packed fifty kilos of paper instead of clothes teaches them to breathe, to look, and to sign their names. She never corrects a drawing. She keeps every one. Then the world's certified eyes arrive, walk through a lie built of conscripted truth, and call it almost normal."
  },

  {
    num: 31,
    title: "The Sway",
    words: "20,300 words",
    door: "Rite",
    key: "The Loop",
    substance: "Highway hypnosis \u2014 the 41-minute gap",
    synopsis: "Cal Dorsey has driven eighty thousand pounds across the middle of America for twenty-six years, and in all that time he has lost forty-one minutes. He did not fall asleep. The truck stayed in its lane, and the fuel curve was the cleanest the company had ever recorded. When he came back to himself the sun was not up, the road ahead was empty, and something behind him was on fire. Out on the night frequencies a preacher nobody has ever met tells a scattered congregation that the driver who takes over when you go under is the better one \u2014 and in a glass building in Kansas City there is a research group that agrees, and has the numbers, and needs a great deal more of them."
  }

];


/* ============================================================
   SERIES — groups of books shown under one header in the list.
   Hovering the header shows every cover in the group together
   with the group's synopsis. "books" are the series numbers,
   and a group can hold any number of them.

   "label" is the small line above the title in the sidebar.
   Leave it out and a group of three says "A Triptych".
   ============================================================ */

const TRILOGIES = [
  {
    title: "Daughters of Anahita",
    books: [19, 20, 21],
    synopsis: "They don't buy men. They don't threaten them. They wait \u2014 and they have been waiting for three thousand years. The Gardener's Century: a dying bathhouse in communist Romania, an heir with nothing left but his name, and a woman planting something that won't bloom until everyone in the room is dead. The First Flame: the night it all began, when one ungoverned beauty burned a kingdom to ash \u2014 and patience was invented to make sure it never happened by accident again. The Final Bloom: a near future where gene-editing and ambient AI have made that patience absolute, and the order's most perfect instrument is aimed at the last incorruptible man on Earth. He will figure out exactly what is being done to him. It will not save him."
  },
  {
    title: "Les Folies",
    books: [22, 23, 24],
    synopsis: "One city, three books, no villains. A clerk, then a crowd, then a congregation \u2014 each does everything correctly, and the result is wrong every time. Nobody breaks a law, nobody raises a voice, and by the final rule, you may already have agreed to it."
  },
  {
    title: "The Unwitnessed Wars I\u2013V",
    label: "A Cycle in Five Books",
    books: [26, 27, 28, 29, 30],
    synopsis: "Five atrocities the world declined to witness: poison gas drifting over the marshes of Iran and Iraq; a famine ordered by decree in Ukraine; a hundred machete days in Rwanda; wards of unheld children in Ceau\u0219escu's Romania; a show-ghetto dressed for the Red Cross and certified as almost normal. Five clerks counting what the ledgers were built to erase. Five doors the cornered body found \u2014 smoke, hunger, stillness, rocking, the drawn page \u2014 and one question, noir to the bone: shelter from the century, or the century, inside?"
  }
];

