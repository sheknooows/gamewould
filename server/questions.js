const AnthropicModule = require('@anthropic-ai/sdk')
const Anthropic = AnthropicModule.default || AnthropicModule

// Initialise client only when API key is present
let anthropic = null
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic()
  console.log('[Claude] API key found — live question generation enabled')
} else {
  console.log('[Claude] No API key — using mock question bank')
}

const VIBE_DESCRIPTIONS = {
  spicy: 'edgy, controversial, or personally revealing choices that make people squirm in a fun way',
  funny: 'silly, absurd, or hilariously weird scenarios that make people laugh out loud',
  deep:  'philosophical, existential, or meaningful questions about life, values, and identity',
  weird: 'bizarre, surreal, and wonderfully strange scenarios that defy all logic',
}

async function generateQuestionWithClaude(vibes, history) {
  const vibe = vibes[Math.floor(Math.random() * vibes.length)]

  const historyNote = history.length > 0
    ? `\n\nThese questions have already been used — do NOT repeat them:\n${history.slice(-20).join('\n')}`
    : ''

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 300,
    system: 'You create questions for a "Would You Rather" party game. Respond with valid JSON only — no markdown, no explanation, nothing else.',
    messages: [{
      role: 'user',
      content: `Generate one original "Would You Rather" question with a ${vibe} vibe: ${VIBE_DESCRIPTIONS[vibe]}.

The two options must be genuinely difficult to choose between — both compelling, distinct, and memorable. Keep each option under 15 words.${historyNote}

Respond with ONLY this JSON (no extra keys):
{"optionA": "...", "optionB": "..."}`,
    }],
  })

  const parsed = JSON.parse(message.content[0].text.trim())
  if (!parsed.optionA || !parsed.optionB) throw new Error('Invalid response structure from Claude')

  return {
    text: `${parsed.optionA} OR ${parsed.optionB}`,
    optionA: parsed.optionA,
    optionB: parsed.optionB,
    vibe,
  }
}

// ─── Mock question bank (fallback when no API key) ───────────────────────────

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
    { text: 'read-minds-or-be-invisible', optionA: 'Read anyone\'s mind whenever you touch them', optionB: 'Turn invisible whenever you want', vibe: 'spicy' },
    { text: 'know-partner-history-or-future', optionA: 'Know your partner\'s full romantic history', optionB: 'Know exactly how your relationship ends', vibe: 'spicy' },
    { text: 'fired-or-quit-dramatically', optionA: 'Be fired from your dream job', optionB: 'Quit your dream job in a dramatic meltdown', vibe: 'spicy' },
    { text: 'parents-read-diary-or-strangers', optionA: 'Have your parents read your diary', optionB: 'Have strangers read your diary but your parents never find out', vibe: 'spicy' },
    { text: 'repeat-high-school-or-first-job', optionA: 'Repeat your last year of high school', optionB: 'Repeat your first year at your worst job', vibe: 'spicy' },
    { text: 'be-always-overdressed-or-underdressed', optionA: 'Always be overdressed for every occasion', optionB: 'Always be underdressed for every occasion', vibe: 'spicy' },
    { text: 'no-phone-for-year-or-no-internet', optionA: 'Give up your phone for a year', optionB: 'Give up the internet for a year', vibe: 'spicy' },
    { text: 'always-win-arguments-or-always-right', optionA: 'Always win every argument', optionB: 'Always be right but never win the argument', vibe: 'spicy' },
    { text: 'live-in-past-decade-or-future-decade', optionA: 'Live the last 10 years over again', optionB: 'Fast forward 10 years into your future', vibe: 'spicy' },
    { text: 'embarrassing-video-viral-or-secret-exposed', optionA: 'Have an embarrassing video of you go viral', optionB: 'Have your biggest secret exposed to only people you know', vibe: 'spicy' },
    { text: 'never-be-wrong-or-never-be-lied-to', optionA: 'Never be wrong about anything', optionB: 'Never be lied to by anyone', vibe: 'spicy' },
    { text: 'swap-lives-for-week-or-forever', optionA: 'Swap lives with anyone for one week', optionB: 'Permanently swap lives with whoever you envy most', vibe: 'spicy' },
    { text: 'know-when-friends-lie-or-enemies-thoughts', optionA: 'Always know when your friends are lying to you', optionB: 'Always know what your enemies are thinking', vibe: 'spicy' },
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
    { text: 'speak-only-questions-or-rhymes', optionA: 'Only be able to speak in questions', optionB: 'Only be able to speak in rhymes', vibe: 'funny' },
    { text: 'required-to-skip-or-roll', optionA: 'Be required to skip everywhere instead of walk', optionB: 'Be required to roll on the floor instead of sit', vibe: 'funny' },
    { text: 'everything-taste-like-pickles-or-ketchup', optionA: 'Have everything taste faintly of pickles', optionB: 'Have everything taste faintly of ketchup', vibe: 'funny' },
    { text: 'auto-tune-voice-or-slow-mo-movements', optionA: 'Have your voice permanently auto-tuned', optionB: 'Move in slow motion whenever someone is watching', vibe: 'funny' },
    { text: 'be-followed-by-bees-or-geese', optionA: 'Be followed by a swarm of friendly bees', optionB: 'Be followed by a flock of aggressive geese', vibe: 'funny' },
    { text: 'teeth-fall-out-when-lie-or-hair-changes-color', optionA: 'Lose a tooth every time you tell a lie', optionB: 'Have your hair change color based on your mood', vibe: 'funny' },
    { text: 'trump-voice-or-cartoon-voice', optionA: 'Have the voice of a 1950s cartoon character forever', optionB: 'Speak in an increasingly dramatic Shakespearean accent', vibe: 'funny' },
    { text: 'invisible-when-embarrassed-or-glow', optionA: 'Become invisible whenever you feel embarrassed', optionB: 'Glow bright red whenever you feel embarrassed', vibe: 'funny' },
    { text: 'hands-backwards-or-feet-backwards', optionA: 'Have your hands on backwards', optionB: 'Have your feet on backwards', vibe: 'funny' },
    { text: 'dramatic-music-entrance-or-applause', optionA: 'Have dramatic entrance music play every time you walk into a room', optionB: 'Have a small crowd applaud every time you sit down', vibe: 'funny' },
    { text: 'narrate-sleep-or-sleepwalk-sing', optionA: 'Narrate your dreams out loud in your sleep', optionB: 'Sleepwalk while performing Broadway musical numbers', vibe: 'funny' },
    { text: 'tiny-t-rex-arms-or-extra-long-neck', optionA: 'Have tiny T-Rex arms', optionB: 'Have a neck twice as long as normal', vibe: 'funny' },
    { text: 'phone-always-on-max-volume-or-always-silent', optionA: 'Have your phone stuck on max volume forever', optionB: 'Have your phone permanently silenced with no vibrate', vibe: 'funny' },
    { text: 'always-formal-or-always-costume', optionA: 'Be required to dress in a full suit every single day', optionB: 'Be required to wear a Halloween costume every single day', vibe: 'funny' },
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
    { text: 'be-loved-or-respected', optionA: 'Be deeply loved but not respected', optionB: 'Be deeply respected but not loved', vibe: 'deep' },
    { text: 'fix-one-mistake-or-prevent-one-tragedy', optionA: 'Go back and fix your biggest personal mistake', optionB: 'Go back and prevent the worst thing that happened to someone you love', vibe: 'deep' },
    { text: 'world-peace-or-personal-happiness', optionA: 'Guarantee world peace but live a personally miserable life', optionB: 'Live an incredibly happy life but the world stays as it is', vibe: 'deep' },
    { text: 'remember-everything-or-forget-pain', optionA: 'Remember every moment of your life in perfect detail', optionB: 'Forget every painful memory you have', vibe: 'deep' },
    { text: 'be-the-most-talented-or-hardest-working', optionA: 'Be the most naturally talented person in the room', optionB: 'Be the hardest working person in the room', vibe: 'deep' },
    { text: 'die-with-regrets-or-no-regrets-unremarkable', optionA: 'Die with many regrets from a full, eventful life', optionB: 'Die with no regrets from a safe, unremarkable life', vibe: 'deep' },
    { text: 'chosen-family-or-born-family', optionA: 'Have your family chosen for you by the universe', optionB: 'Choose your own family from scratch', vibe: 'deep' },
    { text: 'be-misunderstood-genius-or-understood-mediocre', optionA: 'Be a misunderstood genius no one appreciates in your lifetime', optionB: 'Be a celebrated but mediocre talent everyone loves', vibe: 'deep' },
    { text: 'know-your-purpose-or-feel-it', optionA: 'Intellectually know your life\'s purpose', optionB: 'Feel a deep sense of purpose without knowing what it is', vibe: 'deep' },
    { text: 'change-the-world-or-change-one-life-completely', optionA: 'Make a small positive impact on millions of people', optionB: 'Completely transform one person\'s life for the better', vibe: 'deep' },
    { text: 'live-without-fear-or-without-regret', optionA: 'Live a life completely without fear', optionB: 'Live a life completely without regret', vibe: 'deep' },
    { text: 'be-the-hero-or-the-mentor', optionA: 'Be the hero of your own story', optionB: 'Be the mentor who makes someone else the hero', vibe: 'deep' },
    { text: 'truth-destroy-relationship-or-lie-preserve', optionA: 'Tell a truth that destroys an important relationship', optionB: 'Tell a lie that preserves it forever', vibe: 'deep' },
    { text: 'grow-old-together-or-die-young-in-love', optionA: 'Grow old with someone you love deeply', optionB: 'Die young at the absolute peak of a great love', vibe: 'deep' },
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
    { text: 'shadow-does-own-thing-or-reflection-disagrees', optionA: 'Have a shadow that acts completely independently of you', optionB: 'Have a reflection that always disagrees with what you do', vibe: 'weird' },
    { text: 'everything-named-after-you-or-you-have-no-name', optionA: 'Have every object in your home named after you', optionB: 'Lose your name entirely and be referred to only as "them"', vibe: 'weird' },
    { text: 'live-inside-a-snow-globe-or-a-pop-up-book', optionA: 'Live inside a snow globe that gets shaken daily', optionB: 'Live inside a pop-up book where everything is 2D', vibe: 'weird' },
    { text: 'gravity-reversed-for-you-or-sideways', optionA: 'Experience gravity pointing upward only for you', optionB: 'Experience gravity pulling you sideways', vibe: 'weird' },
    { text: 'speak-only-emojis-or-only-sound-effects', optionA: 'Only be able to communicate using emojis you draw in the air', optionB: 'Only be able to communicate using sound effects', vibe: 'weird' },
    { text: 'food-appears-floating-or-has-to-be-caught', optionA: 'Have all your food arrive floating at eye level', optionB: 'Have to catch all your food, which is always thrown at you', vibe: 'weird' },
    { text: 'doors-always-wrong-size-or-stairs-move', optionA: 'Have every door be slightly the wrong size for you', optionB: 'Have every staircase move like an escalator, sometimes backwards', vibe: 'weird' },
    { text: 'time-stops-when-you-sneeze-or-everyone-freezes-when-blink', optionA: 'Have time stop for 5 seconds every time you sneeze', optionB: 'Have everyone around you freeze every time you blink', vibe: 'weird' },
    { text: 'money-turns-to-cheese-or-cheese-to-money', optionA: 'Have all your money slowly turn into cheese over time', optionB: 'Be able to turn any cheese into the equivalent amount of money', vibe: 'weird' },
    { text: 'be-chased-by-shopping-carts-or-followed-by-balloons', optionA: 'Be chased by exactly one rogue shopping cart everywhere you go', optionB: 'Have 40 helium balloons tied to you at all times', vibe: 'weird' },
    { text: 'hair-grows-down-or-gravity-reversed-for-hair', optionA: 'Have your hair grow 1 inch per hour forever', optionB: 'Have your hair defy gravity and always point upward', vibe: 'weird' },
    { text: 'everyone-knows-your-dreams-or-you-know-theirs', optionA: 'Have everyone know exactly what you dreamed last night', optionB: 'Know exactly what everyone around you dreamed last night', vibe: 'weird' },
    { text: 'bees-understand-you-or-you-understand-pigeons', optionA: 'Have bees perfectly understand everything you say', optionB: 'Perfectly understand everything pigeons say to each other', vibe: 'weird' },
    { text: 'become-furniture-one-hour-a-day-or-appliance', optionA: 'Turn into a random piece of furniture for one hour every day', optionB: 'Turn into a random kitchen appliance for one hour every day', vibe: 'weird' },
  ],
}

// ─── Main export ──────────────────────────────────────────────────────────────

// ═══ TO SWAP TO CLAUDE: set ANTHROPIC_API_KEY in server/.env — already wired ═

async function generateQuestion(vibes, history) {
  if (anthropic) {
    try {
      return await generateQuestionWithClaude(vibes, history)
    } catch (err) {
      console.error('[Claude] Question generation failed, falling back to mock:', err.message)
    }
  }

  // Mock fallback
  const vibe = vibes[Math.floor(Math.random() * vibes.length)]
  const pool = QUESTIONS[vibe].filter(q => !history.includes(q.text))
  const candidates = pool.length ? pool : QUESTIONS[vibe] // cycle if exhausted
  return candidates[Math.floor(Math.random() * candidates.length)]
}

module.exports = { generateQuestion }
