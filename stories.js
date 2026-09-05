/* Version 394 · last updated 2026-09-05 09:11 PDT */
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

   audio is optional: assets/audio/NN.mp3, for a book with a narrated
   recording. It adds a download link beside PDF/Read. For the synced,
   highlighted read-along in the reader, build read/NN.sync.json first
   with build-audio-sync.py (see ADDING-AUDIO.md) \u2014 that file is what
   turns the download into a synced player; the audio field alone only
   offers the download.
   ============================================================ */

const STORIES = [

  {
    num: 1,
    title: "Quiet Street to the Long Evening",
    words: "9,600 words",
    hook: "Seven months of his own life, unaccounted for",
    door: "Dose",
    room: "Someone Else's Hour \u2014 you live an hour that was never yours",
    key: "Verity \u2014 the sacrament auditors take to read a stranger's memory",
    notes: [2, 1, 1],
    synopsis: "Memory is a public record in Ctesiphon, and Cale Rook audits it for a living \u2014 deciding whose version of an hour survives. Then an envelope arrives holding his own photograph, and seven months of his own life he cannot account for. This time, the record is him."
    // audio: "assets/audio/01.mp3"  \u2014 held back for changes before publishing.
    // The download icon, the narration bar, and the sentence highlighting
    // in the Read view all key off this one field being present \u2014 put it
    // back and both come back exactly as they were. Nothing else to touch.
  },

  {
    num: 2,
    title: "Bright Mercy",
    words: "9,500 words",
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
    words: "3,800 words",
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
    words: "11,200 words",
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
    words: "18,800 words",
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
    words: "15,300 words",
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
    words: "19,300 words",
    hook: "The voice in your head switches off",
    door: "Dose",
    room: "No One Narrating \u2014 the voice stops, and something older sits up",
    key: "Sublate \u2014 switches off the voice that talks you through your life",
    notes: [3, 2, 1],
    synopsis: "Consciousness turns out to have a kill switch, and Dr. Kelo finds it: silence the inner voice, and her subjects go calm, capable, and quietly unsure who's actually in charge. That voice was never their own \u2014 it was standing guard for something that has waited seven hundred feet under a dead reservoir for centuries, and just opened its eyes."
  },

  {
    num: 8,
    title: "The Soft Spot",
    words: "23,500 words",
    hook: "Eight chairs. The last one is his father's",
    door: "Dose",
    room: "Their Confession, Your Shame \u2014 you feel it as though you did it",
    key: "Mercy \u2014 a stranger's confession arriving as your own memory",
    notes: [2, 3, 3],
    synopsis: "Daniel Voss gives a camera to the people audiences flinch from \u2014 dosed on Mercy, a compound that makes a stranger's confession feel like his own. Eight sittings, each hiding a harder truth beneath the first, and a final chair reserved for the one man the chemical was never built to survive: his father."
  },

  {
    num: 9,
    title: "Ferdowsi Household Nine",
    words: "20,600 words",
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
    words: "7,400 words",
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
    words: "13,900 words",
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
    words: "12,600 words",
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
    words: "26,600 words",
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
    words: "11,300 words",
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
    words: "15,600 words",
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
    words: "14,900 words",
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
    words: "17,000 words",
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
    words: "11,600 words",
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
    words: "27,500 words",
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
    words: "26,500 words",
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
    words: "20,500 words",
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
    words: "20,800 words",
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
    words: "15,300 words",
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
    words: "15,500 words",
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
    words: "16,500 words",
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
    words: "25,500 words",
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
    words: "19,800 words",
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
    words: "21,100 words",
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
    words: "19,700 words",
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
    words: "22,200 words",
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
    words: "20,500 words",
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
    words: "18,600 words",
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
    words: "17,300 words",
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
    words: "16,300 words",
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
    words: "26,600 words",
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
    words: "18,400 words",
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
    words: "21,500 words",
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
    words: "18,400 words",
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
    words: "18,700 words",
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
    words: "19,400 words",
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
    words: "14,200 words",
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
    words: "13,900 words",
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
    words: "18,900 words",
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
    words: "14,600 words",
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
    words: "13,300 words",
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
    words: "13,100 words",
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
    words: "16,700 words",
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
    words: "27,600 words",
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
    words: "40,100 words",
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
    words: "40,600 words",
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
    words: "29,800 words",
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
    words: "19,300 words",
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
    words: "21,300 words",
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
    words: "42,900 words",
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
    words: "10,700 words",
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
    words: "37,700 words",
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
    words: "21,200 words",
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
    words: "49,900 words",
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
    words: "28,700 words",
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
    words: "49,000 words",
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
    words: "28,600 words",
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
    words: "32,500 words",
    hook: "Every evening at seven she sits down in a chair by the window and goes somewhere",
    door: "Rite",
    room: "The Walled Enclosure \u2014 dry, water down the middle, something living at the far end that cannot be reached, and something behind you that you do not turn round on",
    key: "Three Sentences \u2014 what her father taught her on the end of her bed when she was six, and was proud of the phrasing",
    notes: [2, 3, 2],
    synopsis: "Rotterdam. Bahar Kamrani is forty, restores film for a living, and every evening at seven she sits down by the window and goes somewhere. A company that has tested four hundred thousand people finds the forty-one who sit off the end of the instrument, and every one of them traces back to a village outside Tabriz that is a weighbridge now. They want to know how it is done. She spends two years telling them honestly why it must not be, and nobody there can attend long enough to hear it."
  },

  {
    num: 66,
    title: "The Illuminated Face",
    words: "27,500 words",
    hook: "His wife's face is failing, and the new lines say something better than the old ones ever did",
    door: "Rite",
    room: "The Front Room \u2014 his wife in her own chair, ratified, visited, photographed and transcribed by strangers who have come to read her",
    key: "The Reading Angle \u2014 a lamp set on the floor, low and oblique, because light from above fills the ground and light from below throws the lines",
    /* Was 1, "Not possible", which the book is not: Hurufism was a
       real doctrine and the reading of it here is a real practice.
       The one thing in it that could not happen is what the ruin of
       her face turns out to be writing, and that is a 2. */
    notes: [2, 3, 2],
    synopsis: "A provincial Iranian city, and three families keeping a doctrine the world burned six hundred years ago: that the human face is not like scripture but is scripture, fourteen lines of divine writing laid out in hair and bone. Mansur Sarmadi is their reader \u2014 when one of them dies he reads the face aloud, and the reading is the funeral. Then his wife's face begins to fail. He starts reading her in secret while she sleeps, and finds that what the ruin is writing is better than anything the old text ever said."
  },

  {
    num: 67,
    title: "Sayyid of Nowhere",
    words: "32,500 words",
    hook: "He took the clothes because they were on a chair and nobody was watching the chair",
    door: "Dose",
    room: "The Inner Chamber \u2014 four paces by five, one door, no window, and a vent bricked up in 1961",
    key: "Esfand \u2014 wild rue, burned in every doorway in Iran against the evil eye, and nobody there has ever called it a drug",
    /* Was 1, "Not possible". There is nothing in this book that could
       not happen \u2014 a man in the wrong turban, and a village that
       needs a custodian more than it needs to check. */
    notes: [1, 2, 3],
    synopsis: "A career burglar walks out of a hospital in Mashhad in a dead cleric's clothes, taken because they were on a chair and nobody was watching the chair. He does not check the colour of the turban. It is black, which means sayyid \u2014 descent from the Prophet. He has not faked a job, he has faked a bloodline. He gets off a bus in a salt town meaning to stay twelve days, and nine men who have waited eleven nights for a custodian take his bag and walk him up the hill. He stays fourteen months."
  },

  {
    num: 68,
    title: "Fill in the Blanks",
    words: "15,000 words",
    hook: "He supplies the jokes a country repeats, and has not laughed himself in fifteen years",
    door: "Rite",
    room: "The Third Hour \u2014 between three and five in the morning, when the thing arrives with the turn already in position and all he does is hold the paper",
    key: "The Joke \u2014 a sentence that travels without a sender, that no one will admit to writing, and that the body answers before its owner can rule on it",
    notes: [1, 2, 3],
    synopsis: "Manuchehr Delgosh\u0101 is the most widely read unpublished writer in the Persian language: a satirical channel with two million subscribers, three comedians who each believe they are his only client, a state programme that pays properly and takes his teeth out. By day he subtitles pirated American sitcoms into a language that will not hold the punchlines; by night, in a chair with a broken caster, he takes dictation from something he does not care to name. It is not a novel but a notebook \u2014 eighty-four entries, some nine pages and some four lines, in the shape of a fourteenth-century treatise that has been censored in every edition printed since. A man who can see a laugh coming before the room can, and who has not laughed in fifteen years, sets down everything except the parts he cannot write, and leaves the reader to supply them."
  },

  {
    num: 69,
    title: "The Blind Lamp",
    words: "15,500 words",
    hook: "He read the same book every night for fifteen years by the one light that cannot show violet",
    door: "Dose",
    room: "The Thirteenth of Farvardin \u2014 one night and the working day after it, hours he was awake for, and talking, and driving a horse, and digging, and was not in",
    key: "The Blind Lamp \u2014 the small oil flame a pipe is warmed over and a page is read by, which renders violet ink and printer's black the same colour",
    notes: [3, 2, 2],
    synopsis: "Tehran, 1951. Mahmud Sarshar paints the same girl's face on pen cases nobody buys, and has spent fifteen years looking for the grave he dug for his wife on a night he cannot remember an hour of. What he has instead is a book — one of fifty printed by hand in Bombay in 1936 — which he has read every evening since by the lamp he warms his pipe over, and whose margins carry a second voice he has always taken for the author's. Then he carries it to a window, and sees in daylight that the marginal hand is violet."
  },

  {
    num: 70,
    title: "Under His Own Name",
    words: "10,600 words",
    hook: "His brother said eleven of his words out loud, under his own name, and has not come home",
    door: "Withholding",
    room: "The Queue \u2014 a country's attention, which is not a courtroom but a line that moves, where something has to fall off the bottom for anything to go on the top",
    key: "The Line \u2014 eleven words built in February, on tea, given to nobody, and now the property of ninety million people, a dead poet and a shop on Vali Asr",
    notes: [1, 2, 3],
    synopsis: "Three years after a basement in the south of the city, eleven words are still travelling: seven of them in white paint on a wall in Narmak, and the whole line on state television, slightly wrong, getting a comedian the biggest laugh of his career. Manuchehr Delgoshā wrote them and gave them to nobody, and cannot say so, because saying so requires a sentence he will not put in his own mouth. So he does the only thing his trade has taught him: he writes over it, trying to bury what he cannot correct."
  },

  {
    num: 71,
    title: "A Steady Hand",
    words: "23,300 words",
    hook: "He cannot read a drug name, and four hundred people have decided he is their doctor",
    door: "Rite",
    room: "Ab-Bidar \u2014 four hundred people on a dying qanat, and no door that closes on two of them without the village knowing which door and for how long",
    key: "The Ampoule \u2014 a sealed glass vial, and in Iranian usage the injection itself: tablets are advice, a needle is treatment, and a consultation that ends without one has not happened",
    notes: [2, 1, 3],
    synopsis: "A burglar lifts an unattended bag off a luggage rack and finds a stethoscope, a perished blood-pressure cuff mended with electrical tape, and a Ministry of Health card belonging to a man born eleven months before him. He wants it only so that he can say a sentence with a title in it if a policeman stops him. Then he gets off a bus in Ab-Bidar, where a doctor has been promised six times in eleven months, and a man outside the shop stands up and says: Doctor? They said Thursday."
  },

  {
    num: 72,
    title: "Bijan's Well",
    words: "15,300 words",
    hook: "Down here the dark makes things, and makes them well, so the voice that feeds him is probably not real",
    door: "Ordeal",
    room: "The Pit \u2014 deeper than a man can reach, one stone across the top of it, and dark enough that he cannot see his own hand or be sure of anything he hears",
    key: "The Voice \u2014 the only thing that comes down the gap besides the food, unverifiable from the bottom, and not to be told apart from what the dark has already made for him",
    notes: [2, 3, 1],
    synopsis: "A man wakes at the bottom of a pit in the dark and cannot remember arriving. His name is Bijan, and a week ago he was the only man in the Shah's hall who would stand up. What happened after that he has in pieces: a guide, a festival two days over the Turanian border, a woman's tent, and a cup handed to him on the last afternoon. Food comes through a gap he cannot reach, and with it a voice that knows his name — and he decides quite early that the voice is not real."
  },

  {
    num: 73,
    title: "Manijeh at the Rim",
    words: "14,100 words",
    hook: "A king's daughter is given a hole in the ground as an address",
    door: "Withholding",
    room: "The Rim \u2014 the lip of a hole two miles out of a town where everyone knows exactly who she used to be, and where she cannot be certain on any day of it that there is still anybody down there",
    key: "The Bread \u2014 flat travels better than round and stale better than fresh, because fresh tears itself apart on the way down, and never two pieces at once: she will hear one land, go to it, and lose the other",
    notes: [3, 3, 1],
    synopsis: "Eleven springs running, Manijeh has taken tents out to the same festival ground two days inside the Turanian border, and nothing has ever happened there. This spring a young man in Byzantine silk appears alone at the treeline, and her first clear thought is that somebody is going to get him killed. She is right, and she does it herself. Her father takes her rank, her women, her rings and her shoes, walks her out to the pit where he has put the Iranian, and tells her this is her house now."
  },

  {
    num: 74,
    title: "The Break Bell",
    words: "21,600 words",
    hook: "Forty children, six grades, no teacher since Mehr — and the man holding the keys cannot read",
    door: "Ordeal",
    room: "Tang-e Sorkh — two hundred people in a gorge, two rooms and six grades, and a pass that shuts in Azar and does not open until Farvardin",
    key: "Tātureh — seeds on a coal and a cloth over the head, the village cure for a tooth since before there were dentists, which works, and which puts his mother in the room for two hours and does not lay down one word of it",
    notes: [1, 2, 3],
    synopsis: "He goes north-west because it is the only direction he has not used. In the second week of Azar the pass closes behind him and will not open until Farvardin, and for the first time since he was seventeen there is no door. There is a village of two hundred in the gorge, a school of two rooms and forty children across six grades, no teacher since Mehr, and a man in the shop who has been carrying the keys for eleven weeks. Nobody checks anything. And he cannot read."
  },

  {
    num: 75,
    title: "Vision 1404",
    words: "11,600 words",
    hook: "He has never written more than forty words at a stretch, and she needs nine minutes",
    door: "Rite",
    room: "The Hall — six hundred seats and more than that in it, chairs down the sides against the fire regulations, and thirty feet of blue vinyl saying the bright future that will be thrown away on Sunday",
    key: "Nine Minutes — a speech built for somebody else's mouth by a man who knows compression the way a locksmith knows a cylinder and has no idea how to build a room",
    notes: [1, 1, 3],
    synopsis: "A young woman ranked ninth in the national entrance examination out of six hundred thousand is graduating top of her year at Sharif and is required to give the address. She cannot write it — not because she cannot write, but because there is nothing she is permitted to say, and she has spent four years being the proof of a system she has concluded is a machine for producing people like her and then losing them. So she finds a man who writes for other people's mouths, and takes him entirely seriously, which nobody has ever done."
  },

  {
    num: 76,
    title: "The Airing",
    words: "23,200 words",
    hook: "An escaped prisoner is taken for the inspector, and for three days nobody inside says no to him",
    door: "Withholding",
    room: "Havākhori — literally air-eating, the hour a wing is let out into the yard, in a building where an inspector can close a wing and cannot open one door, issue one blanket, or shorten one sentence by an hour",
    key: "Cheshm — upon my eye: at once, certainly, consider it done. It carries no information about whether the thing will happen, because that was never the question. What was on the table was the relative position of two people, and it settles that instantly and closes it.",
    notes: [2, 1, 3],
    synopsis: "He has been in the town nine weeks doing nothing, which he is extremely good at and nobody has ever paid him for. On a Tuesday in the third week of Tir a car stops outside the wrong guesthouse, a man in a lanyard makes two telephone calls that are not answered, and then looks up a street containing four people. Aqa-ye bāzras? He has four seconds, and underneath the arithmetic is the only thought that moves his mouth: that car goes through that gate."
  },

  {
    num: 77,
    title: "Opening Act",
    words: "11,800 words",
    hook: "At fifty-four he has begun to laugh, and it has ruined and remade him in the same movement",
    door: "Ordeal",
    room: "The Side Hall — a majles-e tarhim in a mosque: recitation, an address, tea and dates and halva, and a stranger who will not give his name stipulating three things about what is said over a woman he will not explain",
    key: "The Laugh — arriving twenty-five years late in a man who could always see one coming and never once felt it, and who is now obliged to feel what he sells before he is allowed to sell it",
    notes: [1, 1, 3],
    synopsis: "Manuchehr Delgoshā is fifty-four and has begun laughing, and it has ruined and remade him in the same movement. For twenty-five years he could see the shape of a joke and never feel it land, and that was the whole of his gift. He can now do both at once, and is obliged for the first time to feel what he sells before he sells it. His broker of twenty-six years dies between one Tuesday and the next. And a man who will not give his name asks him for a funeral speech."
  },

  {
    num: 78,
    title: "Black Out",
    words: "15,800 words",
    hook: "She told her son not to go, and he asked her where she thought he got it",
    door: "Withholding",
    room: "The Ward — Fridays, four until half past five, a chair by a window, and a different woman at the desk each week asking what your relation is",
    key: "The Dream Manual — her mother's book, ordered by the thing dreamed of, with door and demon as neighbouring headings; he reads it to her aloud every Friday and has started making the entries up",
    notes: [3, 3, 3],
    synopsis: "Farkhondeh Nikkhah has taught Persian literature in the same district of Tehran for thirty-one years. There is a son of twenty who grew up at a table where the government was discussed every night of his life, and a second boy who arrived in the alley when the two of them were six and eight and has eaten at that table ever since — and there is no word in the language for what he is to her. In Dey the street fills, and she stands in her own hallway and tells her son not to go."
  },

  {
    num: 79,
    title: "The Twelfth Minute",
    words: "11,800 words",
    hook: "Two rooms in one night, and nobody who books her can understand a word of the real one",
    door: "Rite",
    room: "The Second Room — ten o'clock in Hässelby, four hundred Iranians in Persian who heckle in three registers and know precisely when she is lying about home",
    key: "The Twelfth Minute — the part where somebody else is doing it. It arrives about a quarter of the way in, runs ten or fourteen minutes, cannot be summoned, and does not come back with you.",
    notes: [2, 2, 3],
    synopsis: "Roshanak Azimi is twenty-six and has built something in Europe out of night buses, other people's floors, and a working knowledge of how festivals are structured to make performers pay for the privilege of appearing. She plays two rooms in Stockholm on the same night: at eight, fifty Swedes in English who laugh in the wrong places; at ten, four hundred Iranians in a hall in Hässelby who heckle in three registers. Neither audience knows the other exists, and nobody who books her can understand a word of the second."
  },

  {
    num: 80,
    title: "The Reminder",
    words: "16,600 words",
    hook: "Twelve years spent looking at the top two centimetres of strangers, and she has stopped seeing faces",
    door: "Rite",
    room: "The Van — three of them and no air conditioning through a summer that reaches forty-three degrees, working a street that has less on it to find every week",
    key: "The Ta'ahhod — an undertaking not to repeat the offence, written in the woman's own hand in wording dictated to her. Forty-nine of them head this account, and the last one is hers.",
    notes: [3, 2, 3],
    synopsis: "Zeynab Moradi is thirty-eight and has worked the guidance patrol for twelve years, because there was a job in it. She is good at it the way anybody is good at a thing done every day: she has a private taxonomy for scarves that is on no form anywhere, and she can tell from a woman's hands whether one will stay fixed past the corner. Then her numbers begin to fall — not because she has softened, but because a rule that everybody breaks is not a rule."
  },

  {
    num: 81,
    title: "One Was, One Was Not",
    words: "20,100 words",
    hook: "A woman of seventy-four looks at his hands for four seconds and says: you have his hands",
    door: "Withholding",
    room: "The Chair — kept at the table for a man who walked out in 1367, sent three letters and then nothing; still there at the end, and nobody in that house able to say which of the two of them it is for now",
    key: "You have his hands — four seconds at a door, and no document anywhere in the world that can contradict it, because a family is not an institution but a story a number of people have agreed to",
    notes: [1, 2, 3],
    synopsis: "He is fifty, has no papers in any name, and has been in that border town four months because a border town is the only kind of place where nobody asks a stranger anything. A woman of seventy-four opens a door, looks at his hands, and gives him a name — her husband's brother, who walked out in 1367 and sent three letters and then nothing. He does not correct her. He takes his shoes off and goes in, and thirty people adjust, and by the end of the week it has always been true."
  },

  {
    num: 82,
    title: "Hooshang",
    words: "9,400 words",
    hook: "Five months asking a machine for the joke he has just written, to see if it can tell",
    door: "Ordeal",
    room: "The Median — what a thing returns when it has read very nearly everything: the centre of it, in four seconds, which is also a map of exactly where a Persian audience expects the operative word",
    key: "Hooshang — a perfect model of the average, run for five months against a man whose whole trade is putting the operative word where the room is not expecting it",
    notes: [2, 1, 3],
    synopsis: "Manuchehr Delgoshā is fifty-eight and has spent thirty-one years finding where a room expects the operative word and putting it somewhere else. That is the whole trade, and everything else is in service of it. He can now generate the expected version in four seconds by asking a machine, and he has spent five months doing exactly that, one night at a time, in the chair, with the log open beside him. At four fifty-three one morning the machine says something back that neither of them can claim."
  },

  {
    num: 83,
    title: "Permitted Capacity",
    words: "16,500 words",
    hook: "He can feel what a load weighs, and four times he has not let himself know",
    door: "Withholding",
    room: "Before Six — set up in the dark, off the road by twenty past, with his back to the load and the sheet on his knee, and nothing in the record of the day to say what the job was",
    key: "The Load Box — the square on a lift plan where a driver writes the weight before he lifts it. It is a prediction rather than a record, and nobody in that country is required to write one at all.",
    notes: [2, 2, 3],
    synopsis: "Sattār Fallāhi is sixty-one and owns one truck-mounted loader crane. For thirty years he has put things on the roofs of a provincial city at an hourly rate with a four-hour minimum, and the reputation that keeps him working rests on one thing: he knows what a load weighs. Not by looking — through the machine, in the half-second when it leaves the ground, right to within twenty kilos. Four times in twenty years a man has come to the yard and asked what it can do at four metres."
  },

  {
    num: 84,
    title: "None But Afrasiyab",
    words: "8,800 words",
    hook: "A crack in the rock breathes out cold air and the sound of a man crying",
    door: "Rite",
    room: "The Ridge — a low stone room, a wall built against the wind, and a fire he keeps, where he prays all night the way you sit up with a sick animal",
    key: "The Rope — taken the way you take a coat on that ground, used once on a man who had gone down into a crack in the rock, and hanging on the hook by the door ever since, unused, with work up there that wants one",
    notes: [2, 2, 1],
    synopsis: "He lives on a ridge in the north-west, alone, and prays through the night. He gathers at first light from a shelf of rock, takes the stems and not the roots, and that is the whole of his life. Then a crack in the ground starts breathing out cold air and the sound of a man crying, and he goes down after it with a rope he brought the way you bring a coat. What he pulls up is a king sixty years into a war, and nobody will believe how he knew."
  },

  {
    num: 85,
    title: "Kafka at the Gate",
    words: "9,900 words",
    hook: "Seventy years behind a working gate, and no charge, no hearing, and nobody to ask",
    door: "Withholding",
    room: "The Room — warm and dark and moving, which took some years to get used to and which he would now miss",
    key: "The Gate — not rusted, not broken, not stuck. Somebody puts their weight against it every hour the building is awake and keeps it exactly where it is, deliberately, with attention, the way a man holds a door in a wind.",
    notes: [1, 2, 2],
    synopsis: "He has been here since the beginning and nobody has told him why. There is a room, and there is a gate, and the gate works perfectly — it is simply held, every waking hour, by somebody on the other side. No charge has been laid, no hearing convened, no period specified. He is not mistreated: he is fed, he is kept warm, nobody has ever raised a hand to him. He has simply never been let out, and after seventy years he would like the matter looked at."
  },

  {
    num: 86,
    title: "The Time Allowed",
    words: "15,600 words",
    hook: "The right is not withheld. It is spent, early, by the man appointed to protect it.",
    door: "Withholding",
    room: "Branch 26 — a lift out since 1387, a basement archive that floods, a clerk whose filing nobody else can operate, and a form with a box that cannot be filled",
    key: "Mohlat — the time you are allowed to object to a judgment. Twenty days in the law; also what his mother said when she wanted a few minutes more, and what a shopkeeper says when he lets you pay next week.",
    notes: [3, 2, 3],
    synopsis: "A judge applies the law exactly. Where the code runs out he is required to go to the sources, because the constitution says so, and that is not a cleric improvising — it is the job. A mother counts the days from her son's arrest and keeps a folder: a school certificate, two letters from teachers, nine signatures from the building. He heads his entries with the order he wrote and its file number. She heads hers with the day and the time on the clock. One event, two units, and they never touch."
  },

  {
    num: 87,
    title: "Homeland Security",
    words: "10,400 words",
    hook: "The same two words are a department in one country and a charge in the other",
    door: "Ordeal",
    room: "The Boardwalk — unlicensed vendors, permits that are technically real, and an entire informal economy running beside a legal one that has decided not to see it, which is Javadiyeh with better weather",
    key: "The Accent — the thing that lets four hundred people in a hall in Hässelby catch every word, and that a room of Americans hears before it hears the joke",
    notes: [1, 1, 3],
    synopsis: "She moves to Los Angeles and takes a room in Venice on purpose, forty minutes from the forty thousand Iranians in Westwood, because she has worked out that if she goes there in the first year she will never leave. It is not contempt. It is arithmetic. She has come from four years in a hall where four hundred people understood every word and let her get away with nothing, and she is now starting again in a language that hears her before it hears the joke."
  },

  {
    num: 88,
    title: "Head Office",
    words: "10,500 words",
    hook: "Five years, one order, never a single query — until something starts covering up what he actually makes.",
    door: "Withholding",
    room: "Head Office — the source of every order he has ever run, which he has never seen, heard from, or recognized as himself",
    key: "The Glossary — the single page at the end that tells you what every word before it actually meant",
    notes: [2, 1, 3],
    synopsis: "He has run this plant for five years, one item, to spec, without ever once sending back a query. When the raw material that used to arrive warm and without fail starts arriving short, then late, then not at all, he keeps the line running anyway — because the docket is the docket, and a decision would be a query, and Head Office has never once been wrong. Then something begins appearing on his finished product that never came from inside his plant, painted over what he actually made, with nothing left to prove which part is whose. He never learns what Head Office actually is — but by the last page, you will."
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
  /* There were two "notes" blocks here, this one naming the third
     dial "Uncanny" and the one further down naming it "Plausible".
     A repeated key in an object literal is not an error in
     JavaScript — the later one simply wins — so the site had been
     showing Plausible all along while this block sat above it
     looking authoritative and doing nothing. Removed, because a
     reader of this file could only be misled by it. The live
     definition is the one below, under the dials comment. */
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
    synopsis: "Five novellas about people who go into water that will not permit assistance \u2014 a flooded quarry, a cave under limestone, the largest wave in Europe, six hundred days alone at sea, a channel in twelve degrees. Each leaves a record, and each record is accurate, complete, and wrong about the only thing that matters. Somebody came up. Somebody did not. The survivor is the sole witness, and memory is not a document but a reconstruction, rebuilt every time it is opened."
  },
  {
    title: "The Ghariban",
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
  },
  {
    /* Renamed from "The Delgoshā Notebooks" when the third day
       arrived. "From the Delgoshā" is the books' own heading for the
       passages they quote out of the censored treatise, and it holds
       both senses at once: the Resāleh-ye Delgoshā that gives them
       their form, and the man keeping the notebooks. Carries its
       Persian, like Thursday Nights — see the note on .t-title in
       style.css for how the two scripts are set. */
    title: "From the Delgoshā · از دلگشا",
    /* The first series here whose books were not consecutive — 69,
       and now 71 to 74, stand between them and belong elsewhere.
       Nothing special is needed: a row labels itself from its
       position in this list, not from its number.

       The label is an empty string rather than absent, and stays
       that way at any length. Seven days is the whole frame, and
       No. 87 is headed THE SEVENTH DAY, so the group is complete —
       which is a reason to leave the label alone rather than to
       start calling it a septet.

       No banner — the covers stand side by side. */
    label: "",
    books: [68, 70, 75, 77, 79, 82, 87],
    /* No "3 of 7" on the rows. These books are standalones that share
       a narrator, a form or a preoccupation, and they say so
       themselves — No. 81 opens by telling a reader they may be read
       in any order. A count on the row contradicts that: it tells
       somebody who has just found one of them that they have started
       in the wrong place. The heading still gathers them and the
       panel still shows the whole set, which is the part that is
       true. The ordered groups below keep their numbering. */
    numbered: false,
    synopsis: "Seven notebooks kept by the most widely read unpublished writer in the Persian language. Manuchehr Delgoshā supplies the jokes a country repeats and has never put his name on one — until his younger brother says eleven of his words out loud, in a basement, under his own name, and does not come home. Then those words come loose and stop belonging to anybody. Then a woman who was ninth out of six hundred thousand asks him for nine minutes she is not permitted to say herself. Then, at fifty-four, he begins to laugh. The form is Obeid Zakani's fourteenth-century Resāleh-ye Delgoshā, bowdlerised in every edition printed since and its omissions marked with rows of dots; the frame is the old story of seven ministers telling tales one day at a time to hold off an execution. A joke is the only sentence in the language that can travel without a sender. The fifth is not his. It is kept by the woman he wrote nine minutes for, who left, and who is now working two rooms a night four thousand kilometres away. The sixth is the one he does not want an answer to: five months spent asking a machine for the joke he has just written, to find out whether the difference is a gift or a habit. On the seventh she is in Los Angeles, working in a language that hears her before it hears the joke, and a researcher writes to say she knows who Romanu is. In the old story the vow ends on the seventh day and the prince speaks. These are the seven days."
  },
  {
    /* The only series title here carrying its Persian. The heading is
       set in Cormorant, which has no Arabic-script glyphs at all, so
       .t-title in style.css names Gulzar behind it — a browser picks
       a font per glyph, so the English stays in the serif and the
       Persian falls to the nastaliq the dedication already uses. */
    title: "Thursday Nights شب‌های پنجشنبه",
    /* Not consecutive either: 68, 69, 70, 72 and 73 stand between
       these three. See the note on The Delgoshā Notebooks above — the
       same rule carries both, and script.js gathers a block's members
       to their heading rather than swallowing whatever falls between
       them.

       Four accounts had one door each — Dose, Rite, Ordeal,
       Withholding, in that order — which looked deliberate rather
       than lucky. The fifth repeated one, as it was always going to:
       No. 81 is a Withholding, like No. 76, and for the same reason.
       He is handed something and declines to correct it.

       The name pays off inside No. 76, which is where it comes from:
       he worked Thursday nights and only Thursday nights, because
       Thursday night the whole family is at somebody's mother's
       house, and a man in Block Three called him Panjshanbeh for it.

       The label stays an empty string rather than being removed. */
    label: "",
    books: [67, 71, 74, 76, 81],
    /* No "3 of 7" on the rows. These books are standalones that share
       a narrator, a form or a preoccupation, and they say so
       themselves — No. 81 opens by telling a reader they may be read
       in any order. A count on the row contradicts that: it tells
       somebody who has just found one of them that they have started
       in the wrong place. The heading still gathers them and the
       panel still shows the whole set, which is the part that is
       true. The ordered groups below keep their numbering. */
    numbered: false,
    synopsis: "Five accounts by a burglar who keeps being handed other men's authority and keeps turning out to be good at it. He walks out of a hospital in Mashhad in a dead cleric's clothes, and nine men who have waited eleven nights for a custodian take his bag and walk him up the hill. Then a bag on a luggage rack makes him the doctor a village of four hundred stopped expecting. Then a pass shuts behind him in a gorge and he is the teacher of forty children across six grades, and he cannot read. Then a man in a lanyard takes him for the inspector, and he walks into a prison. Then a woman of seventy-four looks at his hands on a doorstep and gives him a dead man's place at her table, and there is no uniform this time and no institution to check him — a family is not an institution, it is a story a number of people have agreed to. He is qualified for none of it, and at none of it is he quite a fraud: what he has is the one thing nobody can counterfeit and everybody can recognise, which is the standing to be looked at while something is done. Each account is written for whoever comes next, and each one is a little more honest than the last about what he is doing there."
  },
  {
    /* 72 and 73 tell one story twice, so this was the first group
       here whose books covered the same days rather than following
       one another. The reading order is still the listing order: 72
       is the pit and 73 is the rim, and the rim knows things the pit
       does not.

       84 is a different episode of the same poem rather than a third
       telling of that one, which is what the series is for: anything
       drawn from the Shāhnāma belongs here. It answers the pair
       across the hole all the same — the pit again, and this time the
       narrator is the one at the top of it. */
    title: "From the Old Book",
    label: "",
    books: [72, 73, 84],
    /* No "3 of 7" on the rows. These books are standalones that share
       a narrator, a form or a preoccupation, and they say so
       themselves — No. 81 opens by telling a reader they may be read
       in any order. A count on the row contradicts that: it tells
       somebody who has just found one of them that they have started
       in the wrong place. The heading still gathers them and the
       panel still shows the whole set, which is the part that is
       true. The ordered groups below keep their numbering. */
    numbered: false,
    synopsis: "Three novellas out of Ferdowsi. Two of them stand on either side of one hole in the ground, over the same eleven months. Bijan is at the bottom of it, in an iron collar, working out that the voice which feeds him is almost certainly something the dark has made. Manijeh is at the rim, barefoot, begging bread door to door in a town where everyone knows exactly who she used to be, and unable to be sure on any given day that there is still anybody down there. The story is the most famous love story in the Persian language, and Ferdowsi did not have it: he stops the Shāhnāma in the middle of a war to describe a night at his own house, when a woman came into the garden with a candle and told him there was a story in the old book, and that if he would listen he could put it into verse. She had the book. He did not. Nobody wrote her name down. The third is the same shape from the other end: a hermit on a ridge hears crying come up out of a crack in the rock, goes down after it with a rope, and pulls out the king the whole war has been about — and spends the rest of his life being the man nobody believes about how he knew."
  },
  {
    /* Nāgofteh — the past participle of not saying. A thing that was
       not said: not banned, not censored, which are words about the
       state, but a word about the silence itself.

       Carries its Persian like Thursday Nights and the Delgoshā, so
       the heading sets in two lines — see splitScripts in script.js
       and .t-en/.t-fa in style.css.

       Not consecutive: 79, 81, 82, 84, 85 and 87 stand between these
       four and belong elsewhere. The books are standalones with no
       shared narrator and no continuing plot; what makes them one
       line is that every one of them stands beside the machinery
       rather than in front of it, and puts the reader in the head of
       whoever signs, files, weighs or looks away. */
    title: "From the Unsaid · ناگفته",
    label: "",
    books: [78, 80, 83, 86],
    /* No "3 of 7" on the rows. These books are standalones that share
       a narrator, a form or a preoccupation, and they say so
       themselves — No. 81 opens by telling a reader they may be read
       in any order. A count on the row contradicts that: it tells
       somebody who has just found one of them that they have started
       in the wrong place. The heading still gathers them and the
       panel still shows the whole set, which is the part that is
       true. The ordered groups below keep their numbering. */
    numbered: false,
    synopsis: "Four books about the person holding the thing when the door opens, and usually the person whose job it was to decide. A teacher of Persian literature for thirty-one years stands in her own hallway and tells her son not to go, and he asks her where she thinks he got it. A guidance patrol officer of twelve years' standing works a street with less on it to find every week, and starts to lose the ability to see a face. A crane driver who can feel a load's weight to within twenty kilos takes four jobs in twenty years that he sets up before six and never writes a number for. A judge applies the law exactly, and the law tells him that where it runs out God does not, while a mother in the same city counts the days from her son's arrest. Nobody in these books wins an argument with the machine and nobody loses one either, because no argument is ever held: decisions arrive as forms, delays and reassignments, and the state never once explains itself. Everything in them that is cruel is administrative, and everything administrative in them was designed by somebody who went home at six."
  }
];
