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

   hook is the one line shown under the title in the list — the thing
   that makes a stranger stop scrolling. Keep it short; it sits on one
   line beside the reading time.

   door / room / key read widest to narrowest: how they got out,
   what was on the other side, and the exact thing that opened it.
   All three are shown beside the book; only door is a menu.

   room and key are written as "Name \u2014 what it's like", split at
   the em dash. They belong to one book each, so there is no list to
   reuse from — write whatever is true of that story. door is shared
   and must be one of the four in GLOSSARY below.
   ============================================================ */

const STORIES = [

  {
    num: 1,
    title: "The Memory Liturgy",
    words: "8,000 words",
    hook: "Seven months of his own life, unaccounted for",
    door: "Dose",
    room: "Someone Else's Hour \u2014 you live an hour that was never yours",
    key: "Verity \u2014 the sacrament auditors take to read a stranger's memory",
    synopsis: "Memory is a public record in Ctesiphon, and Cale Rook audits it for a living \u2014 deciding whose version of an hour survives. Then an envelope arrives holding his own photograph, and seven months of his own life he cannot account for. This time, the record is him."
  },

  {
    num: 2,
    title: "Bright Mercy",
    words: "31,500 words",
    hook: "\u201cRise now, rise now, let the chorus swell\u201d",
    door: "Rite",
    room: "The Song Decides \u2014 four notes make the choice, and the room agrees",
    key: "Bright Mercy \u2014 a lullaby built to keep working on a frightened listener",
    synopsis: "A burned-out music journalist follows a viral lullaby from a grain silo to a dry lakebed \u2014 and finds the night an entire chain of command hummed the same four notes on its way to a decision no one could take back. The song hasn't ended. It's moved into the walls."
  },

  {
    num: 3,
    title: "The Painless Reel",
    words: "16 pages",
    hook: "An hour inside a man who never flinched",
    door: "Dose",
    room: "A Night Without Dread \u2014 his worst hour, and none of the fear",
    key: "Halo \u2014 an hour inside a man who felt nothing while he did it",
    synopsis: "In a back room on Vine, a drug called Halo sells the strangest peace on the market: someone else's worst night, lived from inside a man who felt nothing while doing it. He tells himself he's only visiting \u2014 until an unlabeled fifth reel shows him hands he knows."
  },

  {
    num: 4,
    title: "The Weeping Hour",
    words: "12,000 words",
    hook: "One second the machine cannot account for",
    door: "Dose",
    room: "The Second They Took \u2014 the moment the machine edited out of you",
    key: "Kairos \u2014 felt time, dripped into the eyes drop by drop",
    synopsis: "In Vellum, a machine curates every citizen's day down to the mood they wake into. One unaccounted-for second sends Daniel Voss to a dealer selling Kairos \u2014 felt time, drop by drop through the eyes \u2014 and toward the one truth the machine's mercy was built to spare him."
  },

  {
    num: 5,
    title: "Glass Savanna",
    words: "19,900 words",
    hook: "The mushroom that made us, eaten again",
    door: "Rite",
    room: "The Archaic Revival \u2014 back in a hunter-gatherer's body, cold and awake",
    key: "The Communion \u2014 the wild mushroom of the stoned ape theory",
    synopsis: "MOTHER ended hunger, disease, and want \u2014 and left a species with nothing left to want. A forbidden mushroom drops Vale four hundred thousand years into a hunter-gatherer's cold, grief, and astonishment, where she begins to suspect the machine built to end suffering has spent ninety patient years trying to give it back."
  },

  {
    num: 6,
    title: "Undertow",
    words: "15,100 words",
    hook: "Everything you meet down there is real",
    door: "Dose",
    room: "The Riverbed \u2014 the floor of you, where the first wound was cut",
    key: "Le-The \u2014 a drug that lets a doctor walk down inside you",
    synopsis: "Through a drug called Le-The, Dr. Halcyon walks his patients down through the layers of the self, to the riverbed where the original wound was carved. Then the Institute admits a man three clinics refused \u2014 a patient whose own mind, from the intake scan alone, has named him Undertow."
  },

  {
    num: 7,
    title: "Meat That Dreams",
    words: "20,400 words",
    hook: "The voice in your head switches off",
    door: "Dose",
    room: "No One Narrating \u2014 the voice stops, and something older sits up",
    key: "Sublate \u2014 switches off the voice that talks you through your life",
    synopsis: "Sublate switches off the exhausting inner narrator, and Dr. Kelo's subjects become superb at living without it. Seven hundred feet beneath a dead reservoir, something folklore called a vampire begins to wake \u2014 and Kelo learns what the voice in a human head was always for."
  },

  {
    num: 8,
    title: "The Mercy Dose",
    words: "24,200 words",
    hook: "Eight chairs. The last one is his father's",
    door: "Dose",
    room: "Their Confession, Your Shame \u2014 you feel it as though you did it",
    key: "Mercy \u2014 a stranger's confession arriving as your own memory",
    synopsis: "Daniel Voss gives a camera to the people audiences flinch from \u2014 dosed on Mercy, a compound that makes a stranger's confession feel like his own. Eight sittings, each hiding a harder truth beneath the first, and a final chair reserved for the one man the chemical was never built to survive: his father."
  },

  {
    num: 9,
    title: "The Kindred Stone",
    words: "21,100 words",
    hook: "Auditing whether a god's grief is genuine",
    door: "Rite",
    room: "A God's Grief, Piped In \u2014 a whole city mourning on one signal",
    key: "The Stones \u2014 hold one and a god's suffering comes into you",
    synopsis: "David Cole audits the authenticity of a god's suffering \u2014 grief piped through fist-sized Stones into a faithful city. Then one trace surfaces that the instruments can't call genuine or false, and the trail leads to the forbidden hill itself, where the real question isn't whether the suffering was human."
  },

  {
    num: 10,
    title: "The Gospel of Broken Skin",
    words: "8,000 words",
    hook: "He walked smiling out of a wreck",
    door: "Ordeal",
    room: "Proof You're Alive \u2014 the one feeling a numbed city cannot fake",
    key: "The threshold \u2014 pain, then more, because the last one stopped working",
    synopsis: "Wren has spent ten years stitching a numbed city back together when Ezra Coyne walks smiling out of a wreck he shouldn't have survived. His nameless circle treats sensation as the last unfakeable proof of being alive \u2014 a threshold that keeps demanding to be crossed further. Someone is about to find the last one."
  },

  {
    num: 11,
    title: "The Marriage of Stones",
    words: "14,400 words",
    hook: "Half seduction, half interrogation \u2014 of her",
    door: "Ordeal",
    room: "Back There Again \u2014 one touch and she is in another year",
    key: "Two stones, pink and black \u2014 they teach a body to read itself",
    synopsis: "Reyhan doesn't live her life in order \u2014 a stranger's grip or a slant of afternoon light can trapdoor her into any year of it. With paired stones, pink and black, she teaches the powerful a total literacy of their own bodies. Her new client has mastered everything but himself, and their sessions are half seduction, half interrogation \u2014 of her."
  },

  {
    num: 12,
    title: "Semazen",
    words: "12,700 words",
    hook: "He spins until the grief goes into the floor",
    door: "Rite",
    room: "A Doorway For Grief \u2014 it comes in through you and grounds out",
    key: "The turn \u2014 whirling, badly and without lineage, until the grief moves",
    synopsis: "A worn-down hospice aide teaches himself, badly and without lineage, to whirl \u2014 and finds the turn doesn't bring peace. It makes him a doorway, pulling grief out of anyone near him and grounding it through his own body. Then one grief goes in barbed, and won't pass through, and won't leave."
  },

  {
    num: 13,
    title: "A Stranger's Favorite Song",
    words: "22,200 words",
    hook: "What song did his father love? He can't answer",
    door: "Rite",
    room: "Losing Him Twice \u2014 once to the forgetting, once to the death",
    key: "Alzheimer's \u2014 a mind letting go of when it is, and who",
    synopsis: "At his father's memorial, Kian can't answer the three simplest questions: what song he loved, what food, what place. A story about losing a man twice \u2014 once to forgetting, once to death \u2014 and the strange, late mercy of understanding a father only after becoming one."
  },

  {
    num: 14,
    title: "Fourteenth Trial",
    words: "11,900 words",
    hook: "Only one of the two collars was treated",
    door: "Dose",
    room: "Certainty That Isn't Yours \u2014 you feel gifted, and it came in the collar",
    key: "The compound \u2014 an unnamed agent that feels exactly like talent",
    synopsis: "Two actors sign the same contract on the same afternoon. Six weeks later they wear different collars on a full-scale reconstruction of a concentration camp, filmed as the most immersive character study ever made. What neither of them read on page thirty-three: only one collar has been treated."
  },

  {
    num: 15,
    title: "The Archon's Ledger",
    words: "16,000 words",
    hook: "Six deaths too clean to be deaths",
    door: "Rite",
    room: "The Half-Percent \u2014 the deaths that read too clean to be deaths",
    key: "An unregulated compound \u2014 and a banned manuscript about who runs the walls",
    synopsis: "Julian Voss audits the half-percent \u2014 deaths so clean they read wrong. Six cases share a toxicology result that shouldn't exist, and one woman keeps recurring through his life with slightly different histories each time. The fracture leads to the thing administering the walls of his world: an authority utterly sincere in its own ignorance."
  },

  {
    num: 16,
    title: "The Fasting Ground",
    words: "15,400 words",
    hook: "Fifteen years of proof that changed nothing",
    door: "Ordeal",
    room: "One True Thing \u2014 something about yourself you can't talk your way out of",
    key: "Three ordeals \u2014 no food, a freezing river, a stranger's deathbed",
    synopsis: "Fifteen years of gathering proof of the world's worst lies taught Halloran one thing: evidence stopped mattering. In a mountain village, a man named Rashnu offers what no institution ever could \u2014 one truth about himself that cannot be argued away. The price is a fast, a freezing river, a stranger's deathbed, and the story he's told for eleven years."
  },

  {
    num: 17,
    title: "Natural Noise",
    words: "17,400 words",
    hook: "The bees remember the hours. He doesn't",
    door: "Rite",
    room: "A Year Unaccounted For \u2014 the bees remember the hours; he doesn't",
    key: "Restorative work \u2014 a year of conditioning he can't remember agreeing to",
    synopsis: "Teo keeps bees above Halden, sent there a year ago for reasons he cannot \u2014 no matter how honestly he tries \u2014 remember. The slime mold remembers feeding hours. The ant trails move overnight. Log by log, Teo builds the case that his entire life has been arranged \u2014 against the bees' quiet counter-argument that some things can't be."
  },

  {
    num: 18,
    title: "Between Kenoma and Pleroma",
    words: "11,900 words",
    hook: "The kindness turns out to have a floor",
    door: "Rite",
    room: "Kindness With A Floor \u2014 the valley decides which griefs stay worth seeing",
    key: "Haoma \u2014 a sacrament passed at every meal that binds a table",
    synopsis: "When his sister vanishes into a valley commune called Pleroma, Aram follows \u2014 into a place where crime is nursed as sickness, marriage is chosen aloud each year, and a sacrament binds every table. The kindness turns out to have a floor. And the valley decides, almost invisibly, which griefs are worth continuing to see."
  },

  {
    num: 19,
    title: "The Gardener's Century",
    words: "28,000 words",
    hook: "Three centuries of patience, and one dying bathhouse",
    door: "Rite",
    room: "Planted Generations Ago \u2014 the wanting was sown before you were born",
    key: "The Gardener method \u2014 desire grown slowly, across whole bloodlines",
    synopsis: "For three centuries the B'not Anahita have planted their influence in the bloodlines of the powerful \u2014 not by force, but by desire, cultivated across generations. Romania, 1972: a Qedesha named Nahid arrives at a decaying bathhouse to imprint a banking heir, and finds a loneliness that answers something in her own carefully governed heart."
  },

  {
    num: 20,
    title: "The First Flame",
    words: "27,000 words",
    hook: "One want, ungoverned, and a kingdom burns",
    door: "Rite",
    room: "A Kingdom On Fire \u2014 one want, ungoverned, and a country burns down",
    key: "The Flame \u2014 reading a stranger's deepest want on sight, and lighting it",
    synopsis: "Before the Gardener's patient century, there was only the Flame \u2014 ungoverned and unrepeatable. Rudabeh, a temple priestess who reads a stranger's deepest want on sight, ignites a king's devotion so total it hollows his kingdom and ends in his blood. In the wreckage she must choose: hide the gift, or forge it into the discipline three thousand years will answer to."
  },

  {
    num: 21,
    title: "The Final Bloom",
    words: "21,000 words",
    hook: "She was designed. He works it out anyway",
    door: "Rite",
    room: "Knowing, And Staying \u2014 he works out exactly what is being done to him",
    key: "Tarsim \u2014 a woman written before birth to be irresistible to one man",
    synopsis: "Daniel Cole spent fifteen years armoring himself against every crude tool of capture \u2014 money, flattery, pressure \u2014 and never considered the failure mode might be intimate. Shirin wasn't found or chosen. She was designed: the first Qedesha in three thousand years to hold both Flame and Gardener whole. He guards the future of the species. She has all the patience ever bred."
  },

  {
    num: 22,
    title: "Folie Douce",
    words: "21,400 words",
    hook: "Nothing in the world requires him to hurry",
    door: "Withholding",
    room: "Nothing Making You Hurry \u2014 no rule anywhere requires him to be quick",
    key: "Four minutes each \u2014 sixty-two claimants a day, and never enough time",
    synopsis: "Martin Coyle works Window 9: sixty-two claimants a day, four minutes each, never enough, nobody's fault. Then a stranger's form lands with a four-character error, and Coyle discovers the world contains no mechanism requiring him to hurry. Everything that follows is courteous, correct, defensible in writing \u2014 and built to prove one bad day can drive the sanest person alive to lunacy."
  },

  {
    num: 23,
    title: "Folie Générale",
    words: "15,900 words",
    hook: "Forty extra seconds of hold. Then a heatwave",
    door: "Withholding",
    room: "The City Burning Quietly \u2014 nobody screams; the calls simply don't land",
    key: "Forty seconds of hold \u2014 properly authorised, four million cheaper, agreed by everyone",
    synopsis: "Bellhaven merges its emergency and non-emergency lines \u2014 two pages, properly authorised, four million cheaper, and nobody who reads the memo disagrees. The merge adds forty seconds of hold. Then a heatwave. No villain authors what follows; every decision is correct and will be found correct. By the third night, the city stops burning loudly and starts burning quietly."
  },

  {
    num: 24,
    title: "Folie Imposée",
    words: "16,200 words",
    hook: "Two words in white paint: NO ETA",
    door: "Withholding",
    room: "Somebody Came \u2014 he says your whole name and your legs give way",
    key: "The Second Ring \u2014 they answer when nobody else does",
    synopsis: "Two words in white paint under an underpass: NO ETA. You call. You stand outside a door for three days. Then a man comes out, says your whole name, and your legs stop holding you. They're called the Second Ring, and they answer when nobody else does \u2014 and they're about to discover they need the city to keep failing."
  },

  {
    num: 25,
    title: "Doubling Time",
    words: "16,900 words",
    hook: "The treatment works. Then it keeps working",
    door: "Dose",
    room: "It Doesn't Stop \u2014 the repair works, and then it keeps working",
    key: "CONSENSUS \u2014 countless small machines that mend you and never finish",
    synopsis: "Emil Kestner, sixty-eight, a restorer of damaged books, is out of time \u2014 so he takes a trial never run on a human being, sealed in a room where the air only flows inward. The treatment works. Then it goes on working. Four people come to his door across eleven months, and none can answer the only question that matters: what stops it."
  },

  {
    num: 26,
    title: "Mang and Mustard",
    words: "26,000 words",
    hook: "Twelve needles missing from the antidote count",
    door: "Dose",
    room: "The Dead Are Waiting \u2014 on the far side, and they have questions",
    key: "Mang \u2014 the antidote in overdose: three cups, seven days of witnesses",
    synopsis: "Majnoon, 1984. Nineteen-year-old Sohrab keeps the ledger of the antidote \u2014 green-sleeved needles, counted like bread, that pull the gassed back toward life. Then the count stops balancing, and twelve missing needles lead to a secret congregation of survivors who know what the old corpse-washer knows: in overdose, the medicine becomes a door. The dead are waiting on the far side, with questions."
  },

  {
    num: 27,
    title: "The Clear Ones",
    words: "18,600 words",
    hook: "A third kind of eyes in the queue",
    door: "Ordeal",
    room: "The Serene Ones \u2014 courteous, asking for nothing, dead within days",
    key: "The clarity \u2014 the calm that arrives at the far end of hunger",
    synopsis: "Kharkiv oblast, winter 1932. The grain is gone, the roads are closed, and one door in the raion town stays lit: the state gold store, where the starving buy back their own bread with wedding rings and the crosses their grandmothers buried in 1918. Danylo keeps the scale \u2014 item, weight, fineness, receipt \u2014 and by night a second book, for the words engraved inside the rings. Then he begins to sort the eyes in his queue, and finds a third kind: serene, courteous, asking for nothing. Every one of them is dead within days."
  },

  {
    num: 28,
    title: "Marsh and Machete",
    words: "20,100 words",
    hook: "Ten motionless hours among the floating dead",
    door: "Ordeal",
    room: "Ten Hours Without Moving \u2014 mud for clothing, water for a roof",
    key: "The stillness \u2014 not moving, all day, among the floating dead",
    synopsis: "Rwanda, April 1994. On a hill above the papyrus marshes, Vestine has traded the same greeting with her neighbour every market morning for ten years \u2014 muraho, you are still there. Then a plane comes down, the radio's warm-voiced Cousin announces the household has work to do, and her own house is informed, courteously, that it is not until Thursday. In the marsh she learns the season's one surviving discipline: mud for clothing, water for a roof, ten motionless hours a day among the floating dead."
  },

  {
    num: 29,
    title: "The Quiet Ones",
    words: "18,900 words",
    hook: "A ward of infants that has stopped crying",
    door: "Rite",
    room: "A Ward That Doesn't Cry \u2014 hundreds of infants who worked out nobody comes",
    key: "The rocking \u2014 what a body does for itself when nothing answers it",
    synopsis: "Romania, 1989. Decree 770 has forced a birth rate for a generation, and the surplus children are warehoused in institutions with a beautiful name \u2014 leag\u0103ne, cradles \u2014 at one caregiver to forty infants. Lidia is a decree child herself, aged out at eighteen and hired back as a night attendant: the machine staffing itself with its own product. Her unauthorised notebook records the two things the state's files cannot hold \u2014 the silence of wards where hundreds of infants have each concluded that crying reaches no one, and the rocking."
  },

  {
    num: 30,
    title: "Model and Meadow",
    words: "21,000 words",
    hook: "Thursdays, in a basement, she taught them to look",
    door: "Rite",
    room: "Two Truths At Once \u2014 a town dressed as a town, and certified",
    key: "The frame \u2014 breathing, rhythm, and one hour a week to really look",
    synopsis: "Terez\u00edn, 1942. The fortress ghetto is a town built to be looked at \u2014 sixty thousand people in a town of seven thousand beds, two truths running at all times. Eva, eleven, is sent to Room Twenty-Eight, where thirty girls run a civilization on a constitution of their own, and where on Thursdays, in a basement, a woman who packed fifty kilos of paper instead of clothes teaches them to breathe, to look, and to sign their names. She never corrects a drawing. She keeps every one. Then the world's certified eyes arrive, walk through a lie built of conscripted truth, and call it almost normal."
  },

  {
    num: 31,
    title: "The Sway",
    words: "20,300 words",
    hook: "The fuel curve was the cleanest ever recorded",
    door: "Rite",
    room: "Forty-One Minutes Gone \u2014 the truck held its lane; he wasn't there",
    key: "Highway hypnosis \u2014 the driver who takes over when you go under",
    synopsis: "Cal Dorsey has driven eighty thousand pounds across the middle of America for twenty-six years, and in all that time he has lost forty-one minutes. He did not fall asleep. The truck stayed in its lane, and the fuel curve was the cleanest the company had ever recorded. When he came back to himself the sun was not up, the road ahead was empty, and something behind him was on fire. Out on the night frequencies a preacher nobody has ever met tells a scattered congregation that the driver who takes over when you go under is the better one \u2014 and in a glass building in Kansas City there is a research group that agrees, and has the numbers, and needs a great deal more of them."
  },

  {
    num: 32,
    title: "The Compassionate Fare",
    words: "18,300 words",
    hook: "Eleven hundred and forty signatures, in her own hand",
    door: "Withholding",
    room: "Touched At Last \u2014 nobody has laid a hand on you since the death",
    key: "The forty minutes \u2014 a stranger kneels in the aisle and holds on",
    synopsis: "There is a cheaper ticket you can buy when somebody dies, and to qualify for it you have to prove the death at the desk, in a queue, in front of everyone. Ilse Novak has worked that queue for twelve years \u2014 senior cabin attendant on a small carrier that flies the bereaved in the cabin and their dead in the hold, on the same aircraft, on the same night. Somewhere in the seventh hour, with the lights down and the air thin and nobody aboard touched in days, she kneels in the aisle beside a chosen passenger and takes their hand and does not let go. Eleven hundred and forty signatures, kept in her own handwriting, because she is proud of it and because a record ought to be kept properly. She has never once asked what happens after the signature."
  },

  {
    num: 33,
    title: "The Isolated Hand",
    words: "16,900 words",
    hook: "She read the consent form. Twice",
    door: "Dose",
    room: "Awake, Unable To Say So \u2014 you feel all of it and cannot signal",
    key: "Three drugs \u2014 you forget, it doesn't hurt, you can't move",
    synopsis: "Sara Karim is halfway through a staged reconstruction: four operations, consented to twice, in writing, and she read the form both times. During the second one she was awake \u2014 able to hear the room, able to feel every part of what was done to her, in a body chemically separated from every channel it had ever used to say stop. She has told four people and been believed by none, and one of them was kind about it, which was worse. There is a published figure for how often this happens, and the figure is very small, and the figure is the reason nobody believes her. Then a consultant anaesthetist who has never lost a patient in twenty-two years pulls her chart apart, works out that her body was always going to do this, and offers her something nobody has offered her before, which is to be asked a question."
  },

  {
    num: 34,
    title: "Four Minutes Past Two",
    words: "16,100 words",
    hook: "By night one hundred and forty she is losing hours",
    door: "Withholding",
    room: "Someone Else Writing You \u2014 her doctor agrees with him, and then so does she",
    key: "The nights \u2014 enough of them and you stop being able to judge",
    synopsis: "Amal was born on the first of March and did not sleep, and neither did her mother. Everyone tells Leila Sadr the same three things: it passes, you'll forget it, you're doing brilliantly. By night ninety she is losing words. By night one hundred and forty she is losing hours. She has started writing things down, because there is a pattern in the nights and she cannot hold it in her head long enough to look at it. She is not imagining it, and she is not well, and both are true at the same time, and only one of them can be written on a form. Her husband is calm and kind and has not raised his voice once in ten months. Everybody says so. Her GP says so, her health visitor says so, and by the end so does she."
  },

  {
    num: 35,
    title: "The Weight of Her",
    words: "26,500 words",
    hook: "The first year has visitors and casseroles",
    door: "Withholding",
    room: "The Sixth Year \u2014 the visitors stopped, and nobody noticed they had",
    key: "Let me know if you need anything \u2014 the offer that hands the asking back",
    synopsis: "Roya never spoke, never reached, never turned her head. She lived ten years and eleven months and got heavier every one of them.\n\nHer mother's account of the therapy that hurt her daily to save her, the sister who asked for nothing, and the phrase people used so they wouldn't have to visit.\n\nAnd of what came after \u2014 when life got easier, and the grief did not, and only one of those could ever be said out loud."
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

/* ============================================================
   GLOSSARY — the one-line meaning shown beside each Door, in the
   menu above the list and in the block beside each book. Doors are
   the only shared vocabulary left, so this is all it holds. Rooms
   and Keys describe themselves, one book at a time, in the fields
   above. A door with no entry here simply shows its name alone.
   ============================================================ */

const GLOSSARY = {
  doors: {
    "Dose":        "You took something",
    "Rite":        "You practiced it",
    "Ordeal":      "You went past what hurt",
    "Withholding": "You went without"
  }
};

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
    label: "",
    books: [26, 27, 28, 29, 30],
    synopsis: "Five atrocities the world declined to witness: poison gas drifting over the marshes of Iran and Iraq; a famine ordered by decree in Ukraine; a hundred machete days in Rwanda; wards of unheld children in Ceau\u0219escu's Romania; a show-ghetto dressed for the Red Cross and certified as almost normal. Five clerks counting what the ledgers were built to erase. Five doors the cornered body found \u2014 smoke, hunger, stillness, rocking, the drawn page \u2014 and one question, noir to the bone: shelter from the century, or the century, inside?"
  },
  {
    title: "The Unguarded Hours",
    label: "",
    books: [31, 32, 33, 34],
    synopsis: "There are hours no one chooses and no one can defend \u2014 when exhaustion takes the wheel, when grief wears through the last wall, when the body is awake and cannot say so. They happen at scale and almost nobody reports them, because whatever opens the door also erases the record. Someone has noticed. Someone has worked out what it's worth."
  }
];
