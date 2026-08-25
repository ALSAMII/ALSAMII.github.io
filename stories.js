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

   synopsis is the paragraph on the stage. Keep it to about sixty
   words — the early books sit at fifty-five, and anything much longer
   reads as a wall rather than an invitation.

   notes are the three readings shown beside each book: how dark, how
   hard, how strange — each 1, 2 or 3. The wording for each level lives
   in GLOSSARY.notes; only the numbers belong here.

   notes are the three dials shown under the cover: how dark, how hard,
   how strange. Each is 1, 2 or 3, in that order, and the wording for
   each level lives in GLOSSARY.notes at the foot of this file. Leave
   the field out and a book simply shows no scale.

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
    notes: [2, 1, 1],
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
    notes: [3, 1, 1],
    synopsis: "A burned-out music journalist follows a viral lullaby from a grain silo to a dry lakebed \u2014 and finds the night an entire chain of command hummed the same four notes on its way to a decision no one could take back. The song hasn't ended. It's moved into the walls."
  },

  {
    num: 3,
    title: "The Painless Reel",
    words: "3,300 words",
    hook: "An hour inside a man who never flinched",
    door: "Dose",
    room: "A Night Without Dread \u2014 his worst hour, and none of the fear",
    key: "Halo \u2014 an hour inside a man who felt nothing while he did it",
    notes: [2, 2, 1],
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
    notes: [2, 2, 1],
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
    notes: [1, 2, 1],
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
    notes: [2, 3, 1],
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
    notes: [3, 2, 1],
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
    notes: [2, 3, 3],
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
    notes: [1, 2, 1],
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
    notes: [2, 3, 1],
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
    notes: [2, 2, 2],
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
    notes: [1, 2, 2],
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
    notes: [1, 2, 3],
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
    notes: [3, 2, 2],
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
    notes: [1, 1, 1],
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
    notes: [1, 2, 2],
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
    notes: [1, 1, 1],
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
    notes: [1, 2, 1],
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
    notes: [1, 2, 1],
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
    notes: [1, 2, 1],
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
    notes: [2, 2, 1],
    synopsis: "Daniel Cole spent fifteen years armouring himself against every crude tool of capture, and never considered the failure mode might be intimate. Shirin wasn't found or chosen \u2014 she was designed, the first in three thousand years to hold both Flame and Gardener whole. He guards the future of the species. She has all the patience ever bred."
  },

  {
    num: 22,
    title: "Folie Douce",
    words: "21,400 words",
    hook: "Nothing in the world requires him to hurry",
    door: "Withholding",
    room: "Nothing Making You Hurry \u2014 no rule anywhere requires him to be quick",
    key: "Four minutes each \u2014 sixty-two claimants a day, and never enough time",
    notes: [3, 2, 3],
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
    notes: [3, 2, 3],
    synopsis: "Bellhaven merges its emergency and non-emergency lines: two pages, properly authorised, four million cheaper, and nobody who reads the memo disagrees. The merge adds forty seconds of hold. Then a heatwave. No villain authors what follows, and by the third night the city stops burning loudly and starts burning quietly."
  },

  {
    num: 24,
    title: "Folie Imposée",
    words: "16,200 words",
    hook: "Two words in white paint: NO ETA",
    door: "Withholding",
    room: "Somebody Came \u2014 he says your whole name and your legs give way",
    key: "The Second Ring \u2014 they answer when nobody else does",
    notes: [3, 3, 3],
    synopsis: "Two words in white paint under an underpass: NO ETA. You call. You stand outside a door for three days, and then a man comes out, says your whole name, and your legs stop holding you. They're called the Second Ring, they answer when nobody else does \u2014 and they are about to discover they need the city to keep failing."
  },

  {
    num: 25,
    title: "Doubling Time",
    words: "16,900 words",
    hook: "The treatment works. Then it keeps working",
    door: "Dose",
    room: "It Doesn't Stop \u2014 the repair works, and then it keeps working",
    key: "CONSENSUS \u2014 countless small machines that mend you and never finish",
    notes: [2, 3, 1],
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
    notes: [3, 2, 2],
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
    notes: [2, 3, 2],
    synopsis: "Kharkiv oblast, winter 1932. The grain is gone and one door in the raion town stays lit: the state gold store, where the starving buy back their own bread with wedding rings. Danylo keeps the scale by day and a second book by night, for the words engraved inside the rings. Then he starts sorting the eyes in his queue, and finds a third kind \u2014 serene, courteous, asking for nothing, and dead within days."
  },

  {
    num: 28,
    title: "Marsh and Machete",
    words: "20,100 words",
    hook: "Ten motionless hours among the floating dead",
    door: "Ordeal",
    room: "Ten Hours Without Moving \u2014 mud for clothing, water for a roof",
    key: "The stillness \u2014 not moving, all day, among the floating dead",
    notes: [2, 3, 2],
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
    notes: [3, 3, 2],
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
    notes: [2, 2, 2],
    synopsis: "Terez\u00edn, 1942: a town built to be looked at, sixty thousand people in seven thousand beds. Eva, eleven, is sent to Room Twenty-Eight, where thirty girls run a civilisation on a constitution of their own \u2014 and where on Thursdays a woman who packed fifty kilos of paper instead of clothes teaches them to breathe, to look, and to sign their names."
  },

  {
    num: 31,
    title: "The Sway",
    words: "20,300 words",
    hook: "The fuel curve was the cleanest ever recorded",
    door: "Rite",
    room: "Forty-One Minutes Gone \u2014 the truck held its lane; he wasn't there",
    key: "Highway hypnosis \u2014 the driver who takes over when you go under",
    notes: [2, 3, 2],
    synopsis: "Cal Dorsey has driven eighty thousand pounds across America for twenty-six years, and lost forty-one minutes of it. He did not fall asleep: the truck held its lane and the fuel curve was the cleanest the company had ever recorded. Out on the night frequencies a preacher tells a scattered congregation that the driver who takes over when you go under is the better one."
  },

  {
    num: 32,
    title: "The Compassionate Fare",
    words: "18,300 words",
    hook: "Eleven hundred and forty signatures, in her own hand",
    door: "Withholding",
    room: "Touched At Last \u2014 nobody has laid a hand on you since the death",
    key: "The forty minutes \u2014 a stranger kneels in the aisle and holds on",
    notes: [2, 2, 3],
    synopsis: "There is a cheaper ticket you can buy when somebody dies, and to get it you must prove the death at the desk, in a queue, in front of everyone. Ilse Novak has worked that queue for twelve years. Somewhere in the seventh hour she kneels in the aisle, takes a stranger's hand and does not let go. Eleven hundred and forty signatures, in her own handwriting."
  },

  {
    num: 33,
    title: "The Isolated Hand",
    words: "16,900 words",
    hook: "She read the consent form. Twice",
    door: "Dose",
    room: "Awake, Unable To Say So \u2014 you feel all of it and cannot signal",
    key: "Three drugs \u2014 you forget, it doesn't hurt, you can't move",
    notes: [2, 3, 3],
    synopsis: "Sara Karim consented twice, in writing, and read the form both times. During the second operation she was awake \u2014 able to hear the room, able to feel every part of it, in a body chemically cut off from every channel it had ever used to say stop. She has told four people and been believed by none. One of them was kind about it, which was worse."
  },

  {
    num: 34,
    title: "Four Minutes Past Two",
    words: "16,100 words",
    hook: "By night one hundred and forty she is losing hours",
    door: "Withholding",
    room: "Someone Else Writing You \u2014 her doctor agrees with him, and then so does she",
    key: "The nights \u2014 enough of them and you stop being able to judge",
    notes: [3, 2, 3],
    synopsis: "Amal was born on the first of March and did not sleep, and neither did her mother. By night ninety Leila Sadr is losing words; by night one hundred and forty she is losing hours. Her husband is calm and kind and has not raised his voice in ten months \u2014 everybody says so. Her GP says so, her health visitor says so, and by the end so does she."
  },

  {
    num: 35,
    title: "The Weight of Her",
    words: "26,500 words",
    hook: "The first year has visitors and casseroles",
    door: "Withholding",
    room: "The Sixth Year \u2014 the visitors stopped, and nobody noticed they had",
    key: "Let me know if you need anything \u2014 the offer that hands the asking back",
    notes: [1, 2, 3],
    synopsis: "Roya never spoke, never reached, never turned her head. She lived ten years and eleven months and got heavier every one of them.\n\nHer mother's account of the therapy that hurt her daily to save her, the sister who asked for nothing, and the phrase people used so they wouldn't have to visit.\n\nAnd of what came after \u2014 when life got easier, and the grief did not, and only one of those could ever be said out loud."
  },

  {
    num: 36,
    title: "What the Hand Kept",
    words: "17,800 words",
    hook: "His left hand writes what he left out",
    door: "Rite",
    room: "The Second Page \u2014 the hand sets down what the dying avoided",
    key: "The left hand \u2014 after the stroke it writes without asking him",
    notes: [2, 2, 2],
    synopsis: "For thirty years Martin Hale has written the last words of the dying, and he is famous on the ward for what he leaves out. He calls it mercy. Then a small stroke severs the bridge between the halves of his brain, and his left hand begins to write on its own \u2014 only what the dying avoided, and never wrong. It is working towards one account in particular: his own."
  },

  {
    num: 37,
    title: "Nothing to Push Against",
    words: "21,100 words",
    hook: "The feeling goes. The map stays",
    door: "Dose",
    room: "The Warm Room \u2014 six hours inside the weather everyone else lives in",
    key: "Six doses \u2014 a guard he has never lowered, lowered for him",
    notes: [3, 2, 2],
    synopsis: "Hector Vane is fifty-one, employed, and over the diagnostic threshold \u2014 and a court order keeps him from the daughter who stopped speaking to him nine years ago. So he volunteers for six sessions of drug-assisted therapy. Under the compound the defences he has never had to lower are simply not there, and he can feel the weather everyone else lives in. Then it wears off."
  },

  {
    num: 38,
    title: "The Vertical Yes",
    words: "18,200 words",
    hook: "One blink for yes. Two for no",
    door: "Withholding",
    room: "Agreeing To Everything \u2014 the only answer left is the one they wanted",
    key: "The alphabet board \u2014 twenty-two words an hour, and she is faster than that",
    notes: [2, 3, 3],
    synopsis: "A clot takes out the bridge in Marek Sokol's brainstem and leaves everything above it working: he thinks, he hears, he feels every wrinkle in the sheet. All he has left is one eye movement and an alphabet board. His wife starts to guess \u2014 not from malice, from love and exhaustion \u2014 first apologies he never made, then a confession to the hit-and-run that sent his brother to prison. She is right about everything except the fact."
  },

  {
    num: 39,
    title: "Blind Spot Blue",
    words: "18,400 words",
    hook: "She is right about everyone but him",
    door: "Withholding",
    room: "Nothing Flattering Left \u2014 the filter that softens people is switched off",
    key: "Depressive realism \u2014 the illness that makes her read a room correctly",
    notes: [2, 2, 2],
    synopsis: "Mira is nineteen and has been lying on a made bed in her coat since eleven this morning. Nothing is wrong with her life, which is the actual clinical picture and which nobody believes. She has one thing nobody else has: her readings of people are almost never wrong, and Anton Reisz runs a consultancy that sells exactly that. He warns her that getting better is a trade \u2014 and she cannot read him, because her instrument was built to detect coldness."
  },

  {
    num: 40,
    title: "No Alarm",
    words: "19,000 words",
    hook: "Sold as fearless. Frightened the entire time",
    door: "Withholding",
    room: "No Word For It \u2014 afraid, with nothing to call it and a certificate saying otherwise",
    key: "Two missing alarms \u2014 born without pain, and told a parasite took the rest",
    notes: [2, 3, 3],
    synopsis: "Corni Rowan was born unable to feel pain, and at twenty-three a clinic told him a parasite had taken what was left of his fear. Forty-one fights he could not be made to quit, eleven hundred jumps, and a drinks company whose entire product was the premise that fear is optional. Kids who could feel everything started imitating him, and started dying. Then, checking a fact for his daughter's science fair, he finds eleven years of blood panels \u2014 every one negative."
  },

  /* ---- The Borrowed Sun Cycle, Books I\u2013III ---- */

  {
    num: 41,
    title: "The Gentled World",
    words: "14,600 words",
    hook: "Peace worked. Something moved into the empty rooms",
    door: "Dose",
    room: "Someone Else's Appetite \u2014 borrowed memories, and the wanting that arrives with them",
    key: "The Clearing \u2014 ego dissolution, taken as a civic sacrament",
    notes: [1, 3, 1],
    synopsis: "Half a century after ego dissolution became a civic sacrament, the world is at peace \u2014 genuinely, verifiably, unbearably. Then Mara Voss's patients start coming up from the Clearing carrying memories that belong to no one, a man dies of the trade in them, and she follows the leak down to the question no one gentled can bear to ask: is what's coming through a disease, a cure, or a collection notice?"
  },

  {
    num: 42,
    title: "The Carrier",
    words: "14,400 words",
    hook: "A world that never left, still broadcasting",
    door: "Withholding",
    room: "The Other Shore \u2014 a century of terror, playing back like a documentary of a nightmare",
    key: "The Farside Deep Array \u2014 deep telemetry, checksummed one bit at a time",
    notes: [1, 2, 1],
    synopsis: "They never built the arsenals: the terror was cancelled, and a species spent its twentieth century aiming outward instead \u2014 atom-drive ships by 1975, Mars a working port, robot Pilgrims past the edge of the sun's weather. Then a Pilgrim relays home decades of radio and television from a world that never left, wrong in the details the way copies are wrong, and somewhere in Vera Nyquist's own station something has been answering it."
  },

  {
    num: 43,
    title: "The Kept Flame",
    words: "18,800 words",
    hook: "Two thousand years of fire, and three nights missing",
    door: "Rite",
    room: "The Gap \u2014 three forged nights, centuries deep, and the door they open",
    key: "The Lineage Ledger \u2014 the descent of a sacred fire, audited line by line",
    notes: [2, 1, 1],
    synopsis: "At Salamis the Persian fleet did not break, and the faith of the fire became the governing belief of a commonwealth running from Lisbon to Lahore \u2014 with the Accord Fire at its heart, burning unbroken for two thousand five hundred and six years. Auditing its lineage ledger for the jubilee, Reckoner Roshan Azad finds what every Reckoner is sworn to look for and none has ever found: a gap, three nights deep, forged over by a hand that loved the fire too much to be honest about it."
  },

  {
    num: 44,
    title: "The Quiet Ride",
    words: "15,100 words",
    hook: "They didn\u2019t use dogs. They used medicine",
    door: "Dose",
    room: "The Calm \u2014 a country that cannot say what is being done to it",
    key: "Agitation Psychosis \u2014 a diagnosis for saying true things out loud",
    notes: [1, 3, 1],
    synopsis: "In 1963 America met the movement with medicine rather than dogs and hoses: saying certain true things aloud became a diagnosis, and the cure was a pill, a certificate and \u2014 for those who kept talking \u2014 the quiet ride. Odessa Vane has spent thirty years transcribing the sanest sentences in America in rooms where saying them is the disease, and now patients in sealed wards hundreds of miles apart have begun dictating the same thing word for word: a street corner, an overpass, and four lines of a poem writing themselves onto a wall."
  },

  {
    num: 45,
    title: "The Dark Companion",
    words: "13,700 words",
    hook: "Nobody grieves alone. Something is collecting the difference",
    door: "Withholding",
    room: "The Branches \u2014 every loss undone somewhere, and no comfort in it",
    key: "The Weight \u2014 a sky that has been getting heavier on a schedule",
    notes: [2, 1, 1],
    synopsis: "In this world Everett was believed, and a civilization learned to grieve gently: every loss has a counterpart who did not lose, on some other branch, and the branches are equal and can never touch. Petra Varga weighs the sky for a living, and it has been getting heavier by exact and dateable amounts for ninety years \u2014 more than any number of equal, silent branches could explain. Something out past the edge of the visible is not sharing the load. It is collecting it."
  },

  {
    num: 46,
    title: "The Unburned Library",
    words: "13,600 words",
    hook: "Nothing written was ever lost. Something was taken anyway",
    door: "Withholding",
    room: "The Compact \u2014 whoever may read, rules",
    key: "The Tiles \u2014 two thousand years of knowledge fired into clay",
    notes: [2, 1, 1],
    synopsis: "In 391 a governor turned the mob back at the gate, and the House of Life did not fall \u2014 so nothing written has ever been lost, every text copied forward and fired into tile in an unbroken chain, and the world\u2019s peace rests on a colder arithmetic than treaties: whoever may read, rules. Isidora Iskandar verifies tile against tile for a living, and finds a gap in the oldest layer that no record explains \u2014 pieces of the world\u2019s most guarded truth, missing for centuries, taken by someone who left no name."
  },

  {
    num: 47,
    title: "The Fourth Dawn",
    words: "17,200 words",
    hook: "The same tall stranger, at ground zero, who did not run",
    door: "Ordeal",
    room: "The Registry \u2014 thirty years of counting what was done that morning",
    key: "Trinity \u2014 a fireball hotter than the sun, and no warning given",
    notes: [2, 3, 1],
    synopsis: "Elena Baca has spent thirty years building the registry that finally made the government count what it did in the New Mexico desert on the morning of July 16, 1945 \u2014 and she has just won. Then she finds testimony in her own files belonging to no one: the same tall stranger with the same bag, described in identical words by families with no connection to each other, present at ground zero, who did not run. Getting to the bottom of it will cost her the clean story of her family and the clean story of her own thirty years of care."
  },

  {
    num: 48,
    title: "Service Life",
    words: "28,600 words",
    hook: "He certifies the day your things were always going to die",
    door: "Rite",
    room: "Lifecycle Confidence \u2014 a death date certified, signed and filed",
    key: "The Chamber \u2014 things cooked until they fail, exactly on time",
    notes: [3, 2, 1],
    synopsis: "Cyrus Aban is a Longevity Advocate II in the Department of Lifecycle Confidence: he cooks consumer electronics in sealed chambers until they fail, works out precisely when they were always going to fail, and signs the certificate by hand while everyone else uses a stamp. Nineteen years of certifying death dates for objects, in a country that has made an institution of knowing exactly how long a thing is meant to last \u2014 and a growing suspicion about what else is being scheduled, and by whom."
  },

  {
    num: 49,
    title: "The Sin Drinker",
    words: "20,900 words",
    hook: "The town hired someone to hold its grudges",
    door: "Rite",
    room: "A Kind Town \u2014 pleasant, forgiving, and no longer able to recognise what is done to it",
    key: "The Taking \u2014 grievances dictated across a desk and carried out in a body",
    notes: [3, 2, 1],
    synopsis: "Once a season every resident of Halloran sits across a plain desk and dictates their grievances to the Taker, who writes them down in longhand and carries them out of the building in her body. Ninety years of this, and the town is kind in a way visitors notice and cannot place. What Ruth Amsel learns, always a little too late to act on, is that the grievances are not dissipated but stored \u2014 and that when a Taker reaches capacity, Halloran has a procedure for emptying her."
  },

  {
    num: 50,
    title: "The Glow",
    words: "39,900 words",
    hook: "No partner required. No wanting left",
    door: "Dose",
    room: "The Loop \u2014 continuous ecstasy, and no one on the other side of it",
    key: "The Glow \u2014 a self-replicating implant grown from thirty generations of prayer",
    notes: [3, 2, 1],
    synopsis: "For centuries practitioners sealed the body with mudras \u2014 tongue, hands, gaze \u2014 and learned to hold sensation rather than spend it. Then a laboratory cloned it and sold it on prescription. Under the Glow, arousal is not an event but a residence: a warmth that never clears, softening thought until the body becomes an instrument that plays itself."
  },

  {
    num: 51,
    title: "One Came Up",
    words: "40,100 words",
    hook: "Ninety-four metres of still water, and one hand in it",
    door: "Ordeal",
    room: "The Cut \u2014 a flooded quarry where a man stops arguing with himself",
    key: "The Hold \u2014 the urge to breathe, trained until it stops arriving on time",
    notes: [2, 1, 3],
    synopsis: "A cold black lake, ninety-four metres to the bottom. They call it the Cut, and Sabine Vasseur has not swum in it for nine years. Then a young man starts diving it alone. She teaches him everything \u2014 except the old story about what waits below, patient, and fond of company."
  },

  {
    num: 52,
    title: "Samba",
    words: "29,000 words",
    hook: "Four hundred and eleven recoveries, and none of them the point",
    door: "Ordeal",
    room: "Past the Alarm \u2014 the quiet on the far side of panic, and what is standing in it",
    key: "The Ladder \u2014 breath-hold conditioning with rungs that continue past blackout",
    notes: [2, 1, 2],
    synopsis: "Cass Moura drives a rescue ski at the largest wave in Europe: four hundred and eleven recoveries, sixty-two seconds from impact to hand-on-body, a life built on the belief that his speed is the only decent thing about him. He is wrong about what the speed is for. The tow crews have been training under a retired navy diving medic, and their breath-hold work is a ladder whose rungs go past blackout \u2014 because forty-one subjects have described the same structure, in the same words, in the same absence of fear. Then a swell arrives with no precedent in the recorded history of the beach."
  },

  {
    num: 53,
    title: "The Vagabond Watch",
    words: "17,200 words",
    hook: "A second hand has started writing in his logbook",
    door: "Withholding",
    room: "The Margins \u2014 a companion that is neither comfort nor intruder, and is never wrong",
    key: "The Watch \u2014 six hundred days of twenty-minute sleep, and no witness to any of it",
    notes: [3, 1, 3],
    synopsis: "Nuno Sequeira has been at sea alone for six hundred days. No race, no sponsor, no tracker, no witness. Then a second hand begins writing in his logbook \u2014 correcting his positions, noting bodily changes he has not felt, annotating his estranged daughter more accurately than he can. He starts consulting the margins in order to remember her."
  },

  {
    num: 54,
    title: "The Donor",
    words: "20,900 words",
    hook: "He came up alone, and his statement has stood for ten years",
    door: "Ordeal",
    room: "Two Hundred and Forty Metres \u2014 absolute dark under a ceiling of limestone, and no way out but the way in",
    key: "The Thirds \u2014 the arithmetic of coming back, and one patient rule about sharing air",
    notes: [2, 1, 3],
    synopsis: "A body has lain at two hundred and forty metres for ten years. The dead man\u2019s sister hires the only diver rated to reach him \u2014 she says she wants a burial, but what she wants is the equipment, because which mouthpiece is in whose mouth is a record of a man\u2019s last four minutes. Bijan Rahsepar was on the original dive. He came up alone."
  },

  {
    num: 55,
    title: "The Second Swimmer",
    words: "42,600 words",
    hook: "Something is swimming on the side away from the boat",
    door: "Ordeal",
    room: "The Rules \u2014 no contact, no assistance, and four people forbidden to reach out",
    key: "Twelve Degrees \u2014 thirty-four kilometres of cold, and thirty-one hours to cross it",
    notes: [2, 1, 3],
    synopsis: "Thirty-four kilometres of twelve-degree water between Ireland and Scotland, and Farangis Roshanfar needs it to finish the seven. Ten years ago her son swam beside her as pace swimmer and drowned in the dark; under the rules of the sport, nobody was permitted to touch him. Past the twentieth hour, in the jellyfish field, something begins swimming on the side away from the boat \u2014 and begins, gently, to correct her."
  },

  {
    num: 56,
    title: "The Long Part",
    words: "10,300 words",
    hook: "Three days awake and moving, and she comes back further away each time",
    door: "Withholding",
    room: "The Long Part \u2014 the hours after the second night, where the trail stops being a trail",
    key: "The Chair and the Thermos \u2014 a daughter at every finish, counting",
    notes: [2, 1, 2],
    synopsis: "Rudabeh Sarrafi crossed a border on foot at thirteen and let a new country call her Ruby. At forty-one she started running. By forty-nine she was one of the few people alive who could stay awake and moving for three days \u2014 and her daughter waited at every finish with a folding chair, watching her come back a little further away each time."
  },

  {
    num: 57,
    title: "Hold Me Up Till The Horn",
    words: "37,500 words",
    hook: "Eleven hundred hours on the floor, and one rule: keep moving",
    door: "Ordeal",
    room: "The Floor \u2014 forty-five minutes dancing, fifteen on a cot, around the clock, for as long as a body will hold",
    key: "The Story \u2014 a thousand years old, taught as steps, to keep her upright",
    notes: [3, 3, 3],
    synopsis: "Outside Detroit, September 1932. Ninety-one couples take the floor for a contest with one rule: keep moving. Alma Sutter buried a daughter six weeks ago and is paired with a stranger the announcer cannot be bothered to name correctly. To keep her awake he starts telling her a story a thousand years old \u2014 and because he cannot stop moving to tell it, he teaches it to her as steps."
  },

  {
    num: 58,
    title: "The Standing Man",
    words: "21,300 words",
    hook: "Her son is still up there, upright, and the route uses him as a waypoint",
    door: "Ordeal",
    room: "Eight Thousand Six Hundred Metres \u2014 where the dead are left where they stop and the living steer by them",
    key: "The Stairwell \u2014 four years of training for an arithmetic she has already done",
    notes: [2, 1, 2],
    synopsis: "Above eight thousand metres the dead are not brought down. Four years ago Ruth Aldiss\u2019s son sat down on a shelf of rock and did not get up; he is still there, upright, facing downhill, and every climber on the route navigates by him. She is fifty-eight, twenty-nine years in payroll, and she has trained in a stairwell. She is not going up there to bring him home."
  },

  {
    num: 59,
    title: "The Bell",
    words: "50,100 words",
    hook: "Four minutes after the knockdown, his dead wife is in the room",
    door: "Ordeal",
    room: "The Room Under Chicago \u2014 no rounds, no referee, one bell to start and one when a man does not get up",
    key: "The Visit \u2014 four minutes the medical literature has a flat clinical name for",
    notes: [2, 3, 2],
    synopsis: "After a knockdown in a VFW hall, Sean Vardy has four minutes the medical literature has a flat clinical name for and he calls, privately, a visit. His wife, four years dead, is in the room \u2014 not remembered but present, breathing, saying his name. He starts taking fights to get it back, and the threshold rises the way it always rises."
  },

  {
    num: 60,
    title: "Fifty Metres a Second",
    words: "28,800 words",
    hook: "Nineteen memorial films, and every one of them ends in mid-air",
    door: "Rite",
    room: "The Edit \u2014 the last minute of a person\u2019s life, watched as many times as it takes",
    key: "The Card \u2014 a brown envelope, handed over by a man who will not look at her",
    notes: [2, 1, 2],
    synopsis: "Every flyer in the valley wears a camera. When one of them dies the memory card comes off the body, and for fifteen years Solveig Aandahl has been the one who cuts it into four minutes a family can sit through in a church. She has made nineteen. Every one of them ends in mid-air. Her brother\u2019s card is in a kitchen drawer, and she has never put it in a reader."
  },

  {
    num: 61,
    title: "The Road to Shaam",
    words: "48,400 words",
    hook: "On the seventh night he leaves his body and sees an alley three streets from his uncle\u2019s door",
    door: "Rite",
    room: "The Yard \u2014 a walled space behind a butcher\u2019s shop in south Tehran, every Muharram since he was nine",
    key: "The Chain \u2014 and the beat it keeps, set for him at a speed chosen by people who loved him",
    notes: [2, 1, 3],
    synopsis: "Ali Shabani is fifteen, the second son of a comfortable family in north Tehran, and every year he takes a bus forty minutes south to beat himself with a chain until he bleeds through his shirt. Nobody makes him go; that is the part he cannot explain. This year he is given the best part there is, and on the seventh night he floats out of his body and sees an alley, a man on the ground, and men from his own neighbourhood standing over him doing nothing. The old men tell him he has been shown Karbala. The alley is three streets from his uncle\u2019s door."
  },

  {
    num: 62,
    title: "The Evening of Strangers",
    words: "28,400 words",
    hook: "Nine mourning halls in Los Angeles, and he has never once decided not to go",
    door: "Withholding",
    room: "Eleven Years \u2014 a life built alone, entirely, and the strength that took",
    key: "The Small Things \u2014 a wedding left early, a light fixture replaced, a playlist he calls taste",
    notes: [2, 1, 3],
    synopsis: "Ali arrives in Los Angeles with one suitcase, nine hundred dollars and two hands that do not fully close. Nobody meets him at the airport. Over eleven years he builds everything himself, and finds \u2014 genuinely, unmistakably \u2014 that he is happy. The strength that took is the most attractive thing about him. It is also the lock. There are nine mourning halls in the city, he knows where all of them are, and he has never once been in one, and never once decided not to go."
  },

  {
    num: 63,
    title: "The House Is Patient",
    words: "31,300 words",
    hook: "A patch of skin the size of a playing card has stopped reporting to him",
    door: "Withholding",
    room: "The Cold Room \u2014 fifteen degrees, one frame at a time, eight hours at a stretch",
    key: "Eleven Cans \u2014 film shot in a walled colony in 1962, delivered by two lawyers when he was nineteen",
    notes: [1, 3, 2],
    synopsis: "In 1962 a camera was allowed eleven days inside a walled colony outside Tabriz, where the illness takes the nerve and nobody can be trusted to feel what is happening to them. Thirty-four years later a man runs those eleven cans frame by frame. Eleven minutes are a woman speaking into the lens in a dialect none of the crew could follow, subtitled in nine languages as a prayer. She is not praying. She was his mother, and she was speaking to him."
  },

  {
    num: 64,
    title: "The House Is Ours",
    words: "27,800 words",
    hook: "Between one and three in the afternoon the House sits down, and does not move",
    door: "Rite",
    room: "The Garden \u2014 swept earth, a wall with no gate anywhere in it, one pomegranate that stays the same distance away",
    key: "Kh\u0101m\u016bsh\u012b \u2014 the stillness of the flat hour, which for four years was only people resting",
    notes: [2, 2, 2],
    synopsis: "Outside Tabriz, 1938. Homa is twenty-six, a teacher who believed a country could be cured by decree, sent eleven kilometres past the end of the road. She is the only person there who will never fall ill, the only one whose body still reports to her, and she stays twenty-four years. In the worst week of her life she sits down against the wall in the afternoon and does not come back for most of a day. By spring a hundred people are standing in a garden she cannot explain."
  },

  {
    num: 65,
    title: "The Room Is Quiet",
    words: "31,500 words",
    hook: "Every evening at seven she sits down in a chair by the window and goes somewhere",
    door: "Rite",
    room: "The Walled Enclosure \u2014 dry, water down the middle, something living at the far end that cannot be reached, and something behind you that you do not turn round on",
    key: "Three Sentences \u2014 what her father taught her on the end of her bed when she was six, and was proud of the phrasing",
    notes: [2, 3, 2],
    synopsis: "Rotterdam. Bahar Kamrani is forty, restores film for a living, and every evening at seven she sits down by the window and goes somewhere. A company that has tested four hundred thousand people finds the forty-one who sit off the end of the instrument, and every one of them traces back to a village outside Tabriz that is a weighbridge now. They want to know how it is done. She spends two years telling them honestly why it must not be, and nobody there can attend long enough to hear it."
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
  notes: [
    { name: "Noir",
      levels: ["Warmth survives it", "Cold, but bearable", "No rescue at all"] },
    { name: "Transgressive",
      levels: ["Mildly unsettling", "Moderately disturbing", "Genuinely harrowing"] },
    { name: "Uncanny",
      levels: ["Only slightly off", "Something is wrong here", "The world itself is wrong"] }
  ],
  doors: {
    "Dose":        "You took something",
    "Rite":        "You practiced it",
    "Ordeal":      "You went past what hurt",
    "Withholding": "You went without"
  },

  /* The three dials under each cover, and what each level means. The
     order here is the order of the numbers in every book's "notes"
     field, and the order they appear on the page. */
  notes: [
    { name: "Noir",
      about: "How cold it gets, and whether anyone is rescued.",
      levels: ["Warmth survives it", "Cold, but bearable", "No rescue at all"] },
    { name: "Transgressive",
      about: "How far past comfort it goes, and what it asks you to look at.",
      levels: ["You'll be fine", "It will cost you", "Genuinely harrowing"] },
    { name: "Plausible",
      about: "How much of it could actually happen.",
      levels: ["Not possible", "Almost possible", "Entirely possible"] }
  ]
};

const TRILOGIES = [
  {
    title: "Daughters of Anahita",
    banner: "assets/daughters-of-anahita.jpg",
    books: [19, 20, 21],
    synopsis: "They don't buy men. They don't threaten them. They wait \u2014 and they have been waiting for three thousand years. The Gardener's Century: a dying bathhouse in communist Romania, an heir with nothing left but his name, and a woman planting something that won't bloom until everyone in the room is dead. The First Flame: the night it all began, when one ungoverned beauty burned a kingdom to ash \u2014 and patience was invented to make sure it never happened by accident again. The Final Bloom: a near future where gene-editing and ambient AI have made that patience absolute, and the order's most perfect instrument is aimed at the last incorruptible man on Earth. He will figure out exactly what is being done to him. It will not save him."
  },
  {
    title: "Les Folies",
    banner: "assets/les-folies.jpg",
    books: [22, 23, 24],
    synopsis: "One city, three books, no villains. A clerk, then a crowd, then a congregation \u2014 each does everything correctly, and the result is wrong every time. Nobody breaks a law, nobody raises a voice, and by the final rule, you may already have agreed to it."
  },
  {
    title: "The Unwitnessed Wars I\u2013V",
    /* Its five covers, standing together, rather than the painted
       panorama. To put the banner back, uncomment the line below —
       nothing else needs changing, and the written heading will hide
       itself again because the artwork carries the title.
       banner: "assets/unwitnessed-wars.jpg", */
    label: "",
    books: [26, 27, 28, 29, 30],
    synopsis: "Five atrocities the world declined to witness: poison gas drifting over the marshes of Iran and Iraq; a famine ordered by decree in Ukraine; a hundred machete days in Rwanda; wards of unheld children in Ceau\u0219escu's Romania; a show-ghetto dressed for the Red Cross and certified as almost normal. Five clerks counting what the ledgers were built to erase. Five doors the cornered body found \u2014 smoke, hunger, stillness, rocking, the drawn page \u2014 and one question, noir to the bone: shelter from the century, or the century, inside?"
  },
  {
    title: "The Unguarded Hours",
    /* Its four covers, standing together. See the note on The
       Unwitnessed Wars above.
       banner: "assets/unguarded-hours.jpg", */
    label: "",
    books: [31, 32, 33, 34],
    synopsis: "There are hours no one chooses and no one can defend \u2014 when exhaustion takes the wheel, when grief wears through the last wall, when the body is awake and cannot say so. They happen at scale and almost nobody reports them, because whatever opens the door also erases the record. Someone has noticed. Someone has worked out what it's worth."
  },
  {
    title: "The Sovereign Rooms",
    /* Its five covers, standing together. See the note on The
       Unwitnessed Wars above.
       banner: "assets/sovereign-rooms.jpg", */
    label: "",
    books: [36, 37, 38, 39, 40],
    synopsis: "Two accounts of a self that does not answer to its owner. A hospice scribe whose left hand, cut loose by a stroke, begins writing the things thirty years of mercy left out \u2014 and is never wrong about any of them. A man over the diagnostic threshold who takes six doses of a compound that lowers a guard he has never once had to lower, and comes back with a complete map of what other people feel and no way at all to be moved by it. One room writes without permission. The other can be entered at will and costs nothing to leave. Both are sovereign, and neither is governed."
  },
  {
    title: "The Borrowed Sun Cycle",
    /* Blank, not absent: left out, a group of three would be labelled
       "A Triptych", which this is not. An empty string shows nothing
       above the title at all. */
    label: "",
    books: [41, 42, 43, 44, 45, 46, 47],
    /* A painted panorama of the whole cycle rather than a row of
       covers — the seven belong to one street corner, and the picture
       says so where seven separate spines would not. */
    banner: "assets/borrowed-sun.jpg",
    synopsis: "Seven worlds, one street corner, and a tall man walking through all of them with everything he owns in one bag. In each world, humanity made a different choice \u2014 cancelled its terror, kept its fire, sold its sleep \u2014 and in each one, something patient has begun leaving messages in the margins. A verse is being written across realities, one installment per world, and it reads like a bill coming due. There is no true world."
  },
  {
    title: "The Water Ordeals",
    label: "",
    books: [51, 52, 53, 54, 55],
    /* A single painted panorama rather than a row of covers \u2014 quarry
       wall, open sea, the wave and the weed all belong to one body of
       water, and the picture says so where five spines would not. */
    banner: "assets/water-ordeals.jpg",
    synopsis: "Five novellas about people who go into water that will not permit assistance \u2014 a flooded quarry, a cave under limestone, the largest wave in Europe, six hundred days alone at sea, a channel in twelve degrees. Each leaves a record, and each record is accurate, complete, and wrong about the only thing that matters. Somebody came up. Somebody did not. The survivor is the sole witness, and memory is not a document but a reconstruction, rebuilt every time it is opened."
  },
  {
    title: "The Ghariban",
    /* One picture of the world the two books share — Tehran under snow
       on the left, Los Angeles under palms on the right, one figure on
       the wet road between them. Two spines side by side could not say
       that. No lettering in the artwork, so the written heading stays. */
    banner: "assets/ghariban.jpg",
    label: "",
    books: [61, 62],
    synopsis: "Two novellas about one boy and the ritual he was raised inside. In Tehran he beats himself with a chain every Muharram, and in the state that follows he sees something happening three streets from his uncle\u2019s door. Eleven years later in Los Angeles he has built an entire life alone, and cannot say why he knows where all nine mourning halls are and has never once been in one. Ghariban: the stranger, the one far from home, the one nobody came for."
  },
  {
    title: "The Unheard House",
    /* Three books now, and the label field is gone rather than emptied:
       left out entirely, a group of three is called "A Triptych" by
       script.js, which is what Daughters of Anahita and Les Folies
       already do. An empty string would suppress the line instead.

       Without a "banner" the row shows the three spines side by side,
       which is right until there is a painting of the place itself.
       When one exists, add banner: "assets/unheard-house.jpg" here. */
    books: [63, 64, 65],
    synopsis: "Three novellas about a walled village outside Tabriz that appears on no map, and about what the people inside it were protecting. One watches from a cutting room thirty-four years late, frame by frame. One is written from inside the wall, by the only person there who was never ill. The third is set in Rotterdam now, where a company works out that the thing two hundred people gave their hands and their eyes for can be reached by anybody, in ninety minutes, for four hundred euro."
  }
];
