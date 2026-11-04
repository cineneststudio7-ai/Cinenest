export interface PreSchoolLesson {
  id: string;
  domain: 'Literacy & Phonics' | 'Math & Counting' | 'Social-Emotional (SEL)' | 'Science & Senses';
  usStandardCode: string; // e.g. CCSS.ELA-LITERACY.RF.K.2, Head Start Early Learning Outcomes
  title: string;
  titleBn: string;
  description: string;
  activityType: 'counting' | 'rhyme_match' | 'emotion_glow' | 'science_explorer';
  interactivePrompt: string;
  options: { label: string; isCorrect: boolean; explanation: string }[];
  audioNarration: string;
  bengaliWordBonus: { word: string; script: string; meaning: string };
}

export const US_PRESCHOOL_LESSONS: PreSchoolLesson[] = [
  {
    id: 'lesson-math-1',
    domain: 'Math & Counting',
    usStandardCode: 'CCSS.MATH.CONTENT.K.CC.B.4 (Count to tell the number of objects)',
    title: 'Counting Garden Tea Cups with Puku',
    titleBn: 'চায়ের কাপ গণনা',
    description: 'Help Puku count how many delicate floral tea cups are resting on the checkered picnic table.',
    activityType: 'counting',
    interactivePrompt: 'Puchu placed 3 small porcelain cups on the left and 2 cups on the right for Grandma. How many cups are on the picnic table in total?',
    options: [
      { label: '4 cups', isCorrect: false, explanation: 'Almost! Let’s count one by one: 1, 2, 3... and 4, 5!' },
      { label: '5 cups', isCorrect: true, explanation: 'Shabash! 3 + 2 = 5 cups! Puku’s heart is glowing with pride!' },
      { label: '6 cups', isCorrect: false, explanation: 'A bit too many! Try counting the little handles together.' }
    ],
    audioNarration: 'Puchu placed three small porcelain cups on the left, and two cups on the right. How many cups in total?',
    bengaliWordBonus: { word: 'Panch', script: 'পাঁচ', meaning: 'Five (5)' }
  },
  {
    id: 'lesson-literacy-1',
    domain: 'Literacy & Phonics',
    usStandardCode: 'CCSS.ELA-LITERACY.RF.K.2.A (Recognize and produce rhyming words)',
    title: 'Courtyard Rhyming Word Garden',
    titleBn: 'মিষ্টি ছন্দের বাগান',
    description: 'Listen to the sound of words in Grandma’s garden. Which word rhymes with PUKU’s friend "TEA"?',
    activityType: 'rhyme_match',
    interactivePrompt: 'Puchu is drinking warm sweet TEA under the green mango TREE. Which word rhymes with TEA and TREE?',
    options: [
      { label: 'BEE (🐝)', isCorrect: true, explanation: 'Wonderful! TEA, TREE, and BEE all share the long -EE rhyming sound!' },
      { label: 'CUP (☕)', isCorrect: false, explanation: 'Cup is nice, but it ends with a -UP sound instead of -EE.' },
      { label: 'SPOON (🥄)', isCorrect: false, explanation: 'Spoon ends with -OON. Listen for the sound like free, see, and bee!' }
    ],
    audioNarration: 'Puchu is drinking warm sweet TEA under the green mango TREE. Which word rhymes with TEA and TREE?',
    bengaliWordBonus: { word: 'Moumachi', script: 'মৌমাছি', meaning: 'Honeybee' }
  },
  {
    id: 'lesson-sel-1',
    domain: 'Social-Emotional (SEL)',
    usStandardCode: 'Head Start Domain: Social & Emotional Development (Managing emotions & empathy)',
    title: "Puku's Glowing Heart Emotion Thermometer",
    titleBn: 'পুকুর মনের আলো',
    description: 'Recognizing how kindness and patience make our internal hearts shine bright like Puku.',
    activityType: 'emotion_glow',
    interactivePrompt: 'When Puchu accidentally spilled a few drops of water, Puku smiled gently and helped wipe it clean with a cloth napkin. What feeling makes Puku’s heart glow warm golden-pink?',
    options: [
      { label: 'Kindness and Forgiveness', isCorrect: true, explanation: 'Exactly! When we are kind and forgiving, our hearts glow with golden warmth.' },
      { label: 'Getting Angry and Shouting', isCorrect: false, explanation: 'Anger makes our hearts feel tight. Puku glows when we share gentle patience.' },
      { label: 'Hiding under the table', isCorrect: false, explanation: 'Mistakes happen! Gentle teamwork always brings back the happy smiles.' }
    ],
    audioNarration: 'What feeling makes Pukus heart glow warm golden-pink when helping a friend?',
    bengaliWordBonus: { word: 'Bhalobasha', script: 'ভালোবাসা', meaning: 'Love & Caring' }
  },
  {
    id: 'lesson-science-1',
    domain: 'Science & Senses',
    usStandardCode: 'Head Start Domain: Scientific Reasoning (Observation of natural patterns & weather)',
    title: 'Raindrops and Senses on Banana Leaves',
    titleBn: 'বৃষ্টি ও পঞ্চইন্দ্রিয়',
    description: 'Explore the five senses in Grandma’s garden: what sound does the rain make on the broad leaves?',
    activityType: 'science_explorer',
    interactivePrompt: 'Puchu closes her eyes and listens to the monsoon drizzle on the garden banana fronds. What sense is she using to enjoy the "Tapur Tupur" raindrop rhythm?',
    options: [
      { label: 'Hearing (Ear)', isCorrect: true, explanation: 'Spot on! Our ears listen to nature’s drumming concert on the leaves!' },
      { label: 'Taste (Tongue)', isCorrect: false, explanation: 'Taste is for sweet mangoes and warm tea! Hearing is for listening.' },
      { label: 'Smell (Nose)', isCorrect: false, explanation: 'The nose smells wet earth (Mati’r Gondho), while our ears hear the music.' }
    ],
    audioNarration: 'What sense does Puchu use to hear the pitter-patter rhythm of the rain?',
    bengaliWordBonus: { word: 'Brishti', script: 'বৃষ্টি', meaning: 'Rain' }
  }
];

export interface CoworkerSticker {
  id: string;
  name: string;
  nameBn: string;
  category: 'Encouragement' | 'Teamwork' | 'Tea Break' | 'Kudos' | 'Focus Mode';
  tagline: string;
  taglineBn: string;
  suggestedOccasion: string;
  badgeColor: string;
  iconSymbol: string;
  defaultMessage: string;
}

export const COWORKER_STICKERS: CoworkerSticker[] = [
  {
    id: 'sticker-kindness-cup',
    name: 'Cup of Kindness',
    nameBn: 'এক কাপ ভালোবাসা',
    category: 'Tea Break',
    tagline: 'Warm tea & peaceful vibes for your workday.',
    taglineBn: 'কাজের মাঝে একটু মিষ্টি বিরতি',
    suggestedOccasion: 'Morning standup, mid-week slump, or sending thoughtful support',
    badgeColor: 'from-amber-500 to-rose-400',
    iconSymbol: '☕',
    defaultMessage: 'Sending you a warm cup of kindness and peace today! You’re doing amazing work.'
  },
  {
    id: 'sticker-teamwork-pour',
    name: 'Teamwork Makes the Teapot Pour',
    nameBn: 'একসাথে সবার কাজ',
    category: 'Teamwork',
    tagline: 'High-five for extraordinary collaboration!',
    taglineBn: 'মিলিত প্রচেষ্টায় দারুণ সাফল্য!',
    suggestedOccasion: 'Celebrating a completed sprint, shipping a release, or cross-team help',
    badgeColor: 'from-emerald-600 to-teal-500',
    iconSymbol: '🤝',
    defaultMessage: 'Thank you for being such a stellar partner on this project. Teamwork truly makes everything pour smoothly!'
  },
  {
    id: 'sticker-shabash-kudos',
    name: 'Shabash! (Well Done!)',
    nameBn: 'শাবাশ! দারুণ কাজ!',
    category: 'Kudos',
    tagline: 'Puchu & Puku standing ovation for you!',
    taglineBn: 'তোমার মেধার আন্তরিক প্রশংসা!',
    suggestedOccasion: 'Peer bonus, promotion, hitting a goal, or outstanding creativity',
    badgeColor: 'from-yellow-500 to-amber-600',
    iconSymbol: '🌟',
    defaultMessage: 'Shabash! Huge applause for your brilliant work and dedication. We’re lucky to work with you!'
  },
  {
    id: 'sticker-deep-breath',
    name: 'Tea & A Deep Breath',
    nameBn: 'শান্ত মন, মিষ্টি চা',
    category: 'Encouragement',
    tagline: 'Gentle reminder to pause, breathe, and reset.',
    taglineBn: 'ক্লান্তি ভুলে এক পলক শান্তি নিন',
    suggestedOccasion: 'High-pressure deadline, busy meeting day, or burnout prevention',
    badgeColor: 'from-cyan-600 to-blue-500',
    iconSymbol: '🍃',
    defaultMessage: 'Remember to step away, take a slow deep breath, and grab a warm cup. You’ve got this!'
  },
  {
    id: 'sticker-focus-banana-leaf',
    name: 'Banana Leaf Focus Mode',
    nameBn: 'মনোযোগের মিষ্টি ছাতা',
    category: 'Focus Mode',
    tagline: 'Under the green leaf: Deep work in progress!',
    taglineBn: 'গভীর কাজে নিমগ্ন',
    suggestedOccasion: 'Slack status, calendar focus block, or coding flow state',
    badgeColor: 'from-emerald-700 to-green-600',
    iconSymbol: '🌿',
    defaultMessage: 'Under my leaf in deep focus mode! Brewing something wonderful for the team.'
  },
  {
    id: 'sticker-glowing-heart',
    name: 'Glowing Heart of Wisdom',
    nameBn: 'জ্ঞানের উজ্জ্বল আলো',
    category: 'Kudos',
    tagline: 'When an idea clicks and the whole team shines!',
    taglineBn: 'দারুণ একটি নতুন ভাবনার উদয়!',
    suggestedOccasion: 'Great retrospective insight, brilliant bug fix, or strategic vision',
    badgeColor: 'from-rose-500 to-amber-400',
    iconSymbol: '💖',
    defaultMessage: 'That idea was pure genius! You made everyone’s day brighter.'
  }
];
