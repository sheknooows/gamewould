const QUESTIONS = {
  spicy: [
    { text: 'always-tell-truth-or-lie', optionA: 'Always tell the truth', optionB: 'Always lie', vibe: 'spicy' },
    { text: 'search-history-or-texts-public', optionA: 'Have your search history made public', optionB: 'Have your texts made public', vibe: 'spicy' },
    { text: 'famous-hated-or-unknown-beloved', optionA: 'Be famous but universally hated', optionB: 'Be unknown but deeply beloved by a few', vibe: 'spicy' },
    { text: 'lose-money-or-memories', optionA: 'Lose all your money', optionB: 'Lose all your memories', vibe: 'spicy' },
    { text: 'no-friends-or-no-family', optionA: 'Have no friends', optionB: 'Have no family', vibe: 'spicy' },
    { text: 'know-how-or-when-you-die', optionA: 'Know exactly how you die', optionB: 'Know exactly when you die', vibe: 'spicy' },
    { text: 'cheated-on-or-be-cheater', optionA: 'Be cheated on', optionB: 'Be the cheater', vibe: 'spicy' },
    { text: 'ex-reads-texts-or-boss', optionA: 'Have your ex read all your texts', optionB: 'Have your boss read all your texts', vibe: 'spicy' },
    { text: 'never-fav-food-or-only-fav-food', optionA: 'Never eat your favorite food again', optionB: 'Only eat your favorite food forever', vibe: 'spicy' },
    { text: 'lose-taste-or-smell', optionA: 'Lose your sense of taste', optionB: 'Lose your sense of smell', vibe: 'spicy' },
    { text: 'no-music-or-no-tv', optionA: 'Live without music forever', optionB: 'Live without TV and movies forever', vibe: 'spicy' },
    { text: 'always-late-or-always-early', optionA: 'Always be 10 minutes late to everything', optionB: 'Always be 2 hours early to everything', vibe: 'spicy' },
    { text: 'money-no-time-or-time-no-money', optionA: 'Have unlimited money but only 4 hours of free time per day', optionB: 'Have unlimited free time but earn minimum wage', vibe: 'spicy' },
    { text: 'loved-poor-or-rich-alone', optionA: 'Be loved deeply but always broke', optionB: 'Be extremely rich but completely alone', vibe: 'spicy' },
    { text: 'no-social-media-or-no-streaming', optionA: 'Give up social media forever', optionB: 'Give up all streaming services forever', vibe: 'spicy' },
    { text: 'speak-every-language-or-play-every-instrument', optionA: 'Speak every language fluently', optionB: 'Play every instrument perfectly', vibe: 'spicy' },
    { text: 'never-sleep-or-always-tired', optionA: 'Never need to sleep again', optionB: 'Always feel well-rested but sleep 12 hours a day', vibe: 'spicy' },
  ],

  funny: [
    { text: 'dog-cat-personality-or-cat-dog-personality', optionA: 'Have a dog with a cat\'s personality', optionB: 'Have a cat with a dog\'s personality', vibe: 'funny' },
    { text: 'duck-sized-horses-or-horse-sized-duck', optionA: 'Fight 100 duck-sized horses', optionB: 'Fight 1 horse-sized duck', vibe: 'funny' },
    { text: 'walk-sideways-or-hop', optionA: 'Only be able to walk sideways', optionB: 'Only be able to hop everywhere', vibe: 'funny' },
    { text: 'spaghetti-hair-or-meatball-eyes', optionA: 'Have spaghetti for hair', optionB: 'Have meatballs for eyes', vibe: 'funny' },
    { text: 'laugh-angry-or-cry-happy', optionA: 'Uncontrollably laugh every time you\'re angry', optionB: 'Uncontrollably cry every time you\'re happy', vibe: 'funny' },
    { text: 'no-elbows-or-no-knees', optionA: 'Have no elbows', optionB: 'Have no knees', vibe: 'funny' },
    { text: 'movie-trailer-voice-or-laugh-track', optionA: 'Narrate everything you do in a movie trailer voice', optionB: 'Have a studio laugh track follow you everywhere', vibe: 'funny' },
    { text: 'clown-makeup-or-squeaky-shoes', optionA: 'Have permanent clown makeup you can\'t remove', optionB: 'Squeak loudly with every step you take', vibe: 'funny' },
    { text: 'like-old-photo-or-pocket-dial-boss', optionA: 'Accidentally like an old photo every time you stalk someone\'s profile', optionB: 'Pocket-dial your boss once a week', vibe: 'funny' },
    { text: 'sneeze-glitter-or-burp-confetti', optionA: 'Sneeze glitter', optionB: 'Burp confetti', vibe: 'funny' },
    { text: 'foot-long-fingers-or-foot-long-toes', optionA: 'Have fingers that are 1 foot long', optionB: 'Have toes that are 1 foot long', vibe: 'funny' },
    { text: 'lose-whisper-or-lose-shout', optionA: 'Lose the ability to whisper forever', optionB: 'Lose the ability to shout forever', vibe: 'funny' },
    { text: 'wrong-names-or-forget-own-name', optionA: 'Always call things by the wrong name', optionB: 'Forget your own name once every day', vibe: 'funny' },
    { text: 'chased-chicken-or-skunk-roommate', optionA: 'Be chased by one angry chicken every day for a year', optionB: 'Live with a skunk that hates you for a year', vibe: 'funny' },
    { text: 'giant-head-or-giant-feet', optionA: 'Have a head that\'s twice its normal size', optionB: 'Have feet that are twice their normal size', vibe: 'funny' },
    { text: 'hiccup-every-sentence-or-sneeze-every-minute', optionA: 'Hiccup at the end of every sentence', optionB: 'Sneeze every 60 seconds', vibe: 'funny' },
  ],

  deep: [
    { text: 'purpose-of-life-or-after-death', optionA: 'Know the purpose of life', optionB: 'Know what happens after death', vibe: 'deep' },
    { text: 'change-past-or-see-future', optionA: 'Change one decision from your past', optionB: 'See 5 minutes of your future', vibe: 'deep' },
    { text: 'world-no-art-or-no-science', optionA: 'Live in a world with no art', optionB: 'Live in a world with no science', vibe: 'deep' },
    { text: 'remembered-terrible-or-forgotten-good', optionA: 'Be remembered forever for something terrible', optionB: 'Be completely forgotten despite doing great good', vibe: 'deep' },
    { text: 'free-will-suffering-or-no-free-will-happy', optionA: 'Have free will but experience suffering', optionB: 'Have no free will but always be perfectly happy', vibe: 'deep' },
    { text: 'forgive-everyone-or-never-feel-guilt', optionA: 'Be able to genuinely forgive everyone anything', optionB: 'Never feel guilt about anything you do', vibe: 'deep' },
    { text: '100-average-or-50-extraordinary', optionA: 'Live 100 perfectly average years', optionB: 'Live 50 extraordinary years', vibe: 'deep' },
    { text: 'know-opinions-or-never-know', optionA: 'Know everyone\'s true opinion of you', optionB: 'Never know what anyone really thinks of you', vibe: 'deep' },
    { text: 'lose-love-or-lose-pain', optionA: 'Lose the ability to feel love', optionB: 'Lose the ability to feel physical pain', vibe: 'deep' },
    { text: 'outlive-loved-ones-or-die-first', optionA: 'Outlive everyone you love', optionB: 'Die before everyone you love', vibe: 'deep' },
    { text: 'world-honest-or-world-kind', optionA: 'Live in a world where everyone is brutally honest', optionB: 'Live in a world where everyone is always kind', vibe: 'deep' },
    { text: 'know-simulation-or-never-know', optionA: 'Know with certainty you\'re living in a simulation', optionB: 'Never know and just live your life', vibe: 'deep' },
    { text: 'right-thing-empty-or-mistakes-fulfilled', optionA: 'Always do the right thing but feel completely empty', optionB: 'Make many mistakes but feel deeply fulfilled', vibe: 'deep' },
    { text: 'wisdom-at-20-or-energy-at-90', optionA: 'Have the wisdom of a 90-year-old when you\'re 20', optionB: 'Have the energy of a 20-year-old when you\'re 90', vibe: 'deep' },
    { text: 'answer-any-question-or-never-need-questions', optionA: 'Get a perfect answer to any question you ask', optionB: 'Instantly understand everything without needing to ask', vibe: 'deep' },
    { text: 'relive-best-day-or-live-new-days', optionA: 'Relive your best day on repeat forever', optionB: 'Keep living forward with only uncertain new days', vibe: 'deep' },
  ],

  weird: [
    { text: 'rude-animals-or-loving-silent-animals', optionA: 'Talk to animals but they\'re all extremely rude', optionB: 'Never talk to animals but they all adore you', vibe: 'weird' },
    { text: 'sweat-mayo-or-cry-hot-sauce', optionA: 'Sweat mayonnaise', optionB: 'Cry hot sauce', vibe: 'weird' },
    { text: 'sing-instead-of-talk-or-third-person-narrate', optionA: 'Live in a world where everyone sings instead of talks', optionB: 'Live in a world where everyone narrates themselves in third person', vibe: 'weird' },
    { text: 'uncontrolled-tail-or-uncontrolled-third-arm', optionA: 'Have a tail you can\'t control', optionB: 'Have a third arm you can\'t control', vibe: 'weird' },
    { text: 'smell-like-waffle-or-taste-like-waffle', optionA: 'Permanently smell exactly like a waffle', optionB: 'Taste exactly like a waffle to anyone who licks you', vibe: 'weird' },
    { text: 'eyes-back-of-head-or-ears-on-hands', optionA: 'Have eyes in the back of your head', optionB: 'Have ears on the palms of your hands', vibe: 'weird' },
    { text: 'food-only-one-color-or-only-letter-b', optionA: 'Only eat food that is one specific color', optionB: 'Only eat food whose name starts with the letter B', vibe: 'weird' },
    { text: 'library-no-read-or-kitchen-no-eat', optionA: 'Live in a library but never be able to read', optionB: 'Live in a kitchen but never be able to eat', vibe: 'weird' },
    { text: 'random-historical-era-or-random-animal', optionA: 'Wake up in a random historical era every decade', optionB: 'Wake up as a random animal for one day each year', vibe: 'weird' },
    { text: 'teleport-visited-or-fly-3-feet', optionA: 'Teleport but only to places you\'ve already been', optionB: 'Fly but only 3 feet off the ground', vibe: 'weird' },
    { text: 'background-music-uncontrolled-or-sound-effects', optionA: 'Always have background music you can\'t control or turn off', optionB: 'Always have random sound effects that match your actions', vibe: 'weird' },
    { text: 'bow-everyone-or-spin-before-sitting', optionA: 'Bow deeply to every person you meet', optionB: 'Spin in a full circle before sitting down anywhere', vibe: 'weird' },
    { text: 'calorie-vision-or-thought-bell', optionA: 'See the exact calorie count of everything you look at', optionB: 'Hear a bell every time someone thinks about you', vibe: 'weird' },
    { text: 'breathe-through-ears-or-black-and-white-vision', optionA: 'Only be able to breathe through your ears', optionB: 'Only be able to see in black and white', vibe: 'weird' },
    { text: 'age-backwards-or-loop-best-week', optionA: 'Age backwards from 60 to 0, then disappear', optionB: 'Live your single best week on repeat forever', vibe: 'weird' },
    { text: 'hiccup-morse-code-or-sneeze-confetti', optionA: 'Hiccup in morse code that spells out your thoughts', optionB: 'Sneeze multicolored confetti that stains everything', vibe: 'weird' },
  ],
}

// ═══ TO WIRE UP CLAUDE: Replace this function body with an Anthropic SDK call ═══
async function generateQuestion(vibes, history) {
  const vibe = vibes[Math.floor(Math.random() * vibes.length)]
  const pool = QUESTIONS[vibe].filter(q => !history.includes(q.text))
  const candidates = pool.length ? pool : QUESTIONS[vibe] // cycle if exhausted
  return candidates[Math.floor(Math.random() * candidates.length)]
}

module.exports = { generateQuestion }
