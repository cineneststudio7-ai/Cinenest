import { CharacterProfile, UniverseLocation } from '../types/series';

export const PUCHU_PROFILE: CharacterProfile = {
  id: 'puchu',
  name: 'Puchu',
  nameBn: 'পুচু',
  role: 'The Curious Village Explorer',
  tagline: 'Always wondering, always caring — turning every garden discovery into a learning picnic.',
  bio: 'Puchu is an inquisitive, gentle toddler girl growing up in a lush Bangladeshi village courtyard. With her bouncy curly brown pigtails tied in emerald green ribbons and her signature mint green pinafore dress, Puchu discovers the universe through kind observation, sweet songs, and her inseparable companion Puku.',
  personalityTraits: ['Curious & Observant', 'Gentle & Patient', 'Bilingual Songbird', 'Nature Whisperer'],
  signatureItem: "Grandma's miniature porcelain teapot & wicker picnic basket",
  voiceNotes: 'Sweet, bright, melodic child voice with natural English and authentic Bengali colloquial lilts.',
  lockedTraits: [
    { label: 'Hair & Ribbons', value: 'Bouncy curly brown pigtails with emerald green satin bows' },
    { label: 'Facial Features', value: 'Chubby rosy cheeks with delicate freckles across button nose' },
    { label: 'Eyes & Gaze', value: 'Large warm chocolate brown Pixar eyes with bright specular highlights' },
    { label: 'Wardrobe', value: 'Light mint green A-line dress with rounded Peter Pan white collar' },
    { label: 'Proportions', value: 'Toddler 3D CGI chibi proportions, gentle baby hands' }
  ],
  soundbites: [
    {
      title: 'Morning Greeting',
      en: 'Look Puku, the sun is up! Good morning, Grandma courtyard!',
      bn: 'পুকু, দেখো! সূর্য মামা উঠেছে! শুভ সকাল!',
      speechText: 'Look Puku, the sun is up! Shurjo mama utheche!'
    },
    {
      title: 'Gentle Patience',
      en: 'Have a little patience, Puku, we can do it together!',
      bn: 'একটু ধৈর্য ধরো, আমরা পারবো!',
      speechText: 'Ektu dhoirjo dhoro, amra parbo!'
    },
    {
      title: 'Butterfly Welcome',
      en: 'When we are quiet and gentle like the breeze, beautiful friends come sit with us.',
      bn: 'আমরা যখন শান্ত আর নরম থাকি, সুন্দর বন্ধুরা আমাদের কাছে আসে।',
      speechText: 'When we are quiet and gentle, beautiful friends come sit with us.'
    }
  ],
  featuredEpisodeIds: [1, 2, 4, 6, 9]
};

export const RUTTI_PROFILE: CharacterProfile = {
  id: 'rutti',
  name: 'Rutti',
  nameBn: 'রুত্তি',
  role: 'The Big Sister & Creative Explorer',
  tagline: 'Sisters, Friends, Forever — Turning every imagination into a magical 3D animation.',
  bio: 'Rutti is the joyful older sister in the CineNest series. With her wavy dark brown hair adorned with a flower clip, bright curious hazel-brown eyes, and signature vibrant yellow floral summer dress, Rutti leads her younger sister Putti on imaginative adventures across the courtyard meadow and into the fairytale castle.',
  personalityTraits: ['Loving Big Sister', 'Imaginative Storyteller', 'Bilingual Songleader', 'Compassionate Guide'],
  signatureItem: 'Hand-picked daisy flower clip & golden sketchbook',
  voiceNotes: 'Warm, melodious, spirited older sibling voice filled with enthusiasm and patient encouragement.',
  lockedTraits: [
    { label: 'Hair & Flower Clip', value: 'Wavy dark brown hair with side-part and pink/coral daisy clip' },
    { label: 'Facial Features', value: 'Radiant smile, expressive big brown Pixar eyes, rosy warm cheeks' },
    { label: 'Outfit & Layers', value: 'Vibrant sunshine yellow summer dress with red and orange wildflower print' },
    { label: 'Proportions', value: 'Disney-Pixar stylized preschool girl proportions, expressive hand gestures' },
    { label: 'Animation Style', value: 'Smooth 3D CGI with soft subsurface scattering and volumetric sunlight' }
  ],
  soundbites: [
    {
      title: 'Sisterly Welcome',
      en: 'Come on, Putti! Look at the castle in the sky — our adventure starts right now!',
      bn: 'এসো পুত্তি! আকাশের দুর্গের দিকে তাকাও — আমাদের অভিযান এখনই শুরু!',
      speechText: 'Come on Putti! Look at the castle in the sky!'
    },
    {
      title: 'Courtyard Sharing',
      en: 'When we share with our hearts, the whole courtyard blooms like magic!',
      bn: 'যখন আমরা মন থেকে ভাগ করে নিই, পুরো উঠোন জাদুর মতো ফুটে ওঠে!',
      speechText: 'When we share with our hearts, the whole courtyard blooms like magic!'
    }
  ],
  featuredEpisodeIds: [1, 2, 3, 5, 8]
};

export const PUTTI_PROFILE: CharacterProfile = {
  id: 'putti',
  name: 'Putti',
  nameBn: 'পুত্তি',
  role: 'The Sweet Toddler Sibling',
  tagline: 'Curious eyes, gentle steps — discovering the wonder of the world one giggle at a time.',
  bio: 'Putti is the adorable younger sibling in Rutti & Putti. With her cherubic cheeks, neat dark bangs, and sky-blue shirt featuring a cheerful little duck/bird patch, Putti observes everything with wide-eyed wonder and lights up with joy whenever their blue robot friend learns something new.',
  personalityTraits: ['Curious & Gentle', 'Heartwarming Giggler', 'Empathic Listener', 'Nature Lover'],
  signatureItem: 'Sky-blue duck emblem shirt & little ceramic teacup',
  voiceNotes: 'Sweet, gentle toddler lilt with bubbly giggles and tender questions.',
  lockedTraits: [
    { label: 'Hair & Face', value: 'Neat dark hair with baby bangs, chubby cheeks, warm dark eyes' },
    { label: 'Wardrobe', value: 'Sky-blue crewneck toddler shirt with embroidered yellow duck/bird patch' },
    { label: 'Proportions', value: 'Cute chibi toddler proportions, gentle tiny hands' },
    { label: 'Animation Style', value: 'Disney-Pixar 3D CGI with soft lighting' }
  ],
  soundbites: [
    {
      title: 'Curious Question',
      en: 'Rutti, does the little blue bird sing in Bengali too?',
      bn: 'রুত্তি, নীল পাখিটাও কি বাংলায় গান গায়?',
      speechText: 'Rutti, does the little blue bird sing too?'
    }
  ],
  featuredEpisodeIds: [1, 2, 4, 7, 12]
};

export const ROBOC_PROFILE: CharacterProfile = {
  id: 'roboc',
  name: 'Robo-C',
  nameBn: 'রোবো-সি',
  role: 'The Friendly AI Companion',
  tagline: 'An adorable white-and-cyan robot companion learning preschool empathy and sharing.',
  bio: 'Robo-C is CineNest’s friendly AI robot with a round glossy helmet, soft cyan LED animated expressions, and a glowing "C" badge on his chest. Whenever a preschool problem is solved, Robo-C dances and his chest heart pulses with warm light.',
  personalityTraits: ['Helpful Assistant', 'Expressive Digital Face', 'Playful Sounds', 'Eager Learner'],
  signatureItem: 'Glowing cyan chest "C" emblem & rotating blue ear antennae',
  voiceNotes: 'Gentle synth chirps, friendly electronic hums, and cheerful preschool words.',
  lockedTraits: [
    { label: 'Body & Chassis', value: 'Smooth curved white ceramic-like casing with baby-blue trim' },
    { label: 'LED Visor', value: 'Dark glossy visor displaying cyan digital eyes and smiling mouth' },
    { label: 'Emblem', value: 'Circular cyan "C" CineNest studio crest glowing on chest' }
  ],
  soundbites: [
    {
      title: 'Beep of Joy',
      en: 'Beep-boop! Sharing unlocked! Heart level 100% full!',
      bn: 'বীপ-বুপ! বন্ধুত্ব সক্রিয়! আনন্দের স্তর শতভাগ!',
      speechText: 'Beep-boop! Sharing unlocked! Heart level 100 percent!'
    }
  ],
  featuredEpisodeIds: [1, 3, 5, 9, 15]
};

export const PUKU_PROFILE: CharacterProfile = {
  id: 'puku',
  name: 'Puku',
  nameBn: 'পুকু',
  role: 'The Living Ceramic Mug Companion',
  tagline: 'A cheerful white ceramic companion whose heart lights up whenever wisdom is learned.',
  bio: 'Puku is a living, smiling round white ceramic tea mug who shares every picnic with Puchu. Whenever Puchu solves a problem or learns a lesson, Puku’s internal heart emblem blooms into a warm, pulsating golden-pink luminescence, filling the courtyard with peaceful magic.',
  personalityTraits: ['Loyal & Supportive', 'Expressive Facial Mimic', 'Magical Glowing Heart', 'Playful Steamer'],
  signatureItem: 'Radiant glowing heart emblem & glossy white porcelain handle',
  voiceNotes: 'Whimsical porcelain chimes, musical tea steam whistles, and warm backchannel hums.',
  lockedTraits: [
    { label: 'Form & Shape', value: 'Round smiling glossy white porcelain mug, perfectly cylindrical' },
    { label: 'Face Details', value: 'Animated oval black eyes, curved cheerful mouth, rosy ceramic blush' },
    { label: 'Handle', value: 'Smooth sturdy white ceramic handle on right side' },
    { label: 'Internal Light', value: 'Magical heart emblem glowing in golden-pink luminescence' },
    { label: 'Material Physics', value: 'Subtle reflective ceramic specular glaze with soft rising steam' }
  ],
  soundbites: [
    {
      title: 'Joyful Teacup Chime',
      en: 'Ding-ling! *Puku rocks side to side happily*',
      bn: 'পুকুর হাসিমুখ ও মিষ্টি চায়ের সুর',
      speechText: 'Ding ling! Puku is smiling happily!'
    },
    {
      title: 'Heart Glow Hum',
      en: 'Mmm-hm! *Puku pulses in warm golden-pink light*',
      bn: 'পুকুর বুকে জ্বলছে ভালোবাসার আলো',
      speechText: 'Pukus glowing heart shines bright with kindness!'
    },
    {
      title: 'Steam Whistle Whimsy',
      en: 'Whoosh-whistle! *Curly steam forms a soft heart in the air*',
      bn: 'ধোঁয়া উড়ে তৈরি হয় ভালোবাসার মিষ্টি ছবি',
      speechText: 'Whoosh whistle! Sweet tea steam dances in the breeze!'
    }
  ],
  featuredEpisodeIds: [1, 3, 5, 8, 10]
};

export const UNIVERSE_LOCATIONS: UniverseLocation[] = [
  {
    id: 'courtyard-table',
    name: 'The Signature Picnic Table',
    nameBn: 'চেকার্ড পিকনিক টেবিল',
    growthOrigin: 'Courtyard Center',
    description: 'The iconic wooden picnic table draped with Puchu and Puku’s orange-and-white checkered tablecloth, surrounded by terracotta flower pots and Grandma’s wicker picnic basket.',
    signatureElement: 'Orange-and-white checkered tablecloth & clay tea set',
    bestTimeOfDay: 'Warm Morning',
    featuredEpisodeIds: [1, 2, 7, 9, 15]
  },
  {
    id: 'ancient-mango-shade',
    name: 'Under the Ancient Mango Shade',
    nameBn: 'আম গাছের শান্ত ছায়া',
    growthOrigin: 'Expands northeast from the courtyard patio',
    description: 'A towering hundred-year-old mango tree with emerald foliage, golden ripening fruit, and cool dappled sunbeams where lessons on patience and nature unfold.',
    signatureElement: 'Golden Fazli mangoes & dancing sunbeam patterns',
    bestTimeOfDay: 'Breezy Midday',
    featuredEpisodeIds: [4, 11, 22, 34]
  },
  {
    id: 'jasmine-trellis',
    name: 'Jasmine & Marigold Trellis',
    nameBn: 'বেলি ও গাঁদা ফুলের বাগান',
    growthOrigin: 'Bordering the courtyard garden fence',
    description: 'Rows of sun-warmed terracotta pots brimming with vibrant orange marigolds and sweet-scented white Beli blossoms that attract fluttering butterflies and honeybees.',
    signatureElement: 'Terracotta flower pots & fluttering yellow butterflies',
    bestTimeOfDay: 'Golden Sunrise',
    featuredEpisodeIds: [1, 10, 16, 28]
  },
  {
    id: 'water-lily-basin',
    name: 'The Lotus Basin Pond',
    nameBn: 'শাপলা ফুলের শান্ত দিঘি',
    growthOrigin: 'Flows through the stone courtyard drainage stream',
    description: 'A serene stone basin reflecting the sky, home to white Shapla (water lilies), gentle ripples, and curious garden frogs who love to listen to Puchu’s rhymes.',
    signatureElement: 'Floating white water lilies & crystal ripples',
    bestTimeOfDay: 'Breezy Midday',
    featuredEpisodeIds: [7, 13, 19, 31]
  },
  {
    id: 'earthen-veranda',
    name: "Grandma's Earthen Veranda",
    nameBn: 'দাদিমার মাটির দাওয়া',
    growthOrigin: 'Connecting the courtyard to the traditional village homestead',
    description: 'A smooth clay veranda kept cool under thatched eaves, featuring rustic water jugs, handwoven Nakshi fans, and the comforting aroma of Bengal earth.',
    signatureElement: 'Porous clay water pitchers & handwoven fans',
    bestTimeOfDay: 'Amber Afternoon',
    featuredEpisodeIds: [3, 6, 14, 25]
  },
  {
    id: 'firefly-meadow',
    name: 'Twilight Firefly Meadow',
    nameBn: 'জোনাকির সান্ধ্য প্রান্তর',
    growthOrigin: 'Extends beyond the courtyard bamboo gate at dusk',
    description: 'As the sun dips below the palms, the garden transforms into a star-lit sanctuary where emerald fireflies sync their gentle blinks to Puku’s glowing heart.',
    signatureElement: 'Blinking emerald fireflies & evening lavender skies',
    bestTimeOfDay: 'Twilit Sunset',
    featuredEpisodeIds: [8, 9, 20, 42]
  }
];
