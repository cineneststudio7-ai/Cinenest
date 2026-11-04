import { Episode } from '../types/series';

// Base metadata definitions for topics and themes across 105 episodes
interface EpisodeSeed {
  title: string;
  titleBn: string;
  theme: string;
  timeOfDay: 'Golden Sunrise' | 'Warm Morning' | 'Breezy Midday' | 'Amber Afternoon' | 'Twilit Sunset';
  locationExt: string;
  problem: string;
  learning: string;
  rhymeTitle: string;
  rhymeBnScript: string;
  rhymeBn: string;
  rhymeEn: string;
  lessonEn: string;
  lessonBnScript: string;
  lessonBn: string;
  cliffhanger: string;
  tags: string[];
}

const SEED_EPISODES: EpisodeSeed[] = [
  {
    title: "The Dancing Butterfly",
    titleBn: "নাচনে প্রজাপতি",
    theme: "Colors & Nature",
    timeOfDay: "Warm Morning",
    locationExt: "Marigold Garden Corner by the Wicker Basket",
    problem: "A vivid yellow and sapphire butterfly lands on Puchu's tea saucer, and Puchu doesn't know how to welcome it without scaring it away.",
    learning: "Gentle stillness and soft whispers invite nature closer; patience brings friendship.",
    rhymeTitle: "Projapoti Shundor (Beautiful Butterfly)",
    rhymeBnScript: "প্রজাপতি, প্রজাপতি, কোথায় পেলে ভাই এমন রঙিন পাখা? / হলুদ আর নীলে মাখা!",
    rhymeBn: "Projapoti, projapoti, kothay pele bhai emon rongin pakha? / Holud ar neele makha!",
    rhymeEn: "Butterfly, butterfly, with your wings so bright / Dipped in warm gold and sapphire light!",
    lessonEn: "When we are quiet and gentle like the breeze, the world's prettiest wonders come to sit with us.",
    lessonBnScript: "আমরা যখন শান্ত আর নরম থাকি, সুন্দর বন্ধুরা আমাদের কাছে আসে।",
    lessonBn: "Amra jokhon shanto ar norom thaki, shundor bondhura amader kache ashe.",
    cliffhanger: "Just as the butterfly took flight, a faint metallic clink echoed from beneath the picnic bench...",
    tags: ["Nature", "Colors", "Kindness", "Courtyard"]
  },
  {
    title: "The Lost Silver Spoon",
    titleBn: "হারানো রূপালী চামচ",
    theme: "Curiosity & Problem Solving",
    timeOfDay: "Golden Sunrise",
    locationExt: "Checkered Tablecloth & Porcelain Tea Set",
    problem: "Puchu's favorite shiny silver tea spoon has slipped behind a giant earthen water pot.",
    learning: "Asking for help and working as a team with Puku turns frustration into a joyful treasure hunt.",
    rhymeTitle: "Chomoch Chomoch Jholmol (Shiny Little Spoon)",
    rhymeBnScript: "চামচ আমার রূপালী, কোথায় গেলে লুকিয়ে? / পুকুর আলোয় খুঁজে পাই, হাসি সবার মুখে!",
    rhymeBn: "Chomoch amar rupali, kothay gele lukiye? / Pukur aloy khuje pai, hashi shobar mukhe!",
    rhymeEn: "Silver spoon so round and neat, playing hide and seek / Puku's glow lights up the floor, a happy smile upon our cheek!",
    lessonEn: "Even when things go missing, keeping a calm heart and looking together always lights the way.",
    lessonBnScript: "কোনো কিছু হারালে অস্থির হতে নেই, শান্ত মনে খুঁজলে সব পাওয়া যায়।",
    lessonBn: "Kono kichu harale osthir hote nei, shanto mone khujle shob pawa jay.",
    cliffhanger: "Behind the clay pitcher, Puchu spots a glossy green feather with shimmering droplets of morning dew...",
    tags: ["Problem Solving", "Teamwork", "Garden", "Bengali Words"]
  },
  {
    title: "Raindrops on the Banana Leaf",
    titleBn: "কলার পাতায় বৃষ্টির ফোঁটা",
    theme: "Weather & Musical Sounds",
    timeOfDay: "Amber Afternoon",
    locationExt: "Courtyard Veranda overlooking the Broad Banana Fronds",
    problem: "A sudden monsoon drizzle threatens to cancel the picnic, making Puchu worried and sad.",
    learning: "Rain brings the sweet scent of wet earth (Mati'r Gondho) and a rhythmic drumming song on the leaves.",
    rhymeTitle: "Brishti Pore Tapur Tupur (Raindrop Symphony)",
    rhymeBnScript: "বৃষ্টি পড়ে টাপুর টুপুর, নদে এলো বান / কলার পাতায় বাজে দেখো খুশির মিষ্টি গান!",
    rhymeBn: "Brishti pore tapur tupur, nodey elo baan / Kolar patay baje dekho khushir mishti gaan!",
    rhymeEn: "Pitter patter falls the rain, drumming soft and sweet / Big green banana leaves tap dance to the beat!",
    lessonEn: "Rainy days are not a spoiled picnic; they are nature's joyful music concert for our tea party.",
    lessonBnScript: "বৃষ্টি মানে থেমে যাওয়া নয়, প্রকৃতির মিষ্টি বাজনার সঙ্গে গান গাওয়া।",
    lessonBn: "Brishti mane theme jaowa noy, prokritir mishti bajnar shonge gaan gaowa.",
    cliffhanger: "As the clouds part and sunshine glimmers, a tiny baby turtle peeks from the courtyard drainage canal...",
    tags: ["Weather", "Music", "Monsoon", "Nature"]
  },
  {
    title: "The Sweet Mango Branch",
    titleBn: "আমের মিষ্টি ডাল",
    theme: "Patience & Growth",
    timeOfDay: "Breezy Midday",
    locationExt: "Shaded Corner Under the Ancient Courtyard Mango Tree",
    problem: "Puchu sees a ripe golden Fazli mango hanging high up and tries to shake the heavy branch recklessly.",
    learning: "Fruit ripens when it is ready; rushing nature can hurt the branch, but waiting rewards us with sweetness.",
    rhymeTitle: "Paka Aam Shona (Golden Sweet Mango)",
    rhymeBnScript: "আম ধরেছে ডালে ডালে, সোনালী রোদ গায়ে / মিষ্টি সুবাস ছড়িয়ে পড়ে দখিন হাওয়া বায়ে!",
    rhymeBn: "Aam dhoreche dale dale, shonali rod gaye / Mishti subash choriye pore dokhin hawa baye!",
    rhymeEn: "Golden mango on the bough, kissed by summer sun / Wait in patience, sweet and soft, a treat for everyone!",
    lessonEn: "The sweetest things in life need time to grow, just like our thoughts and kindness.",
    lessonBnScript: "সবচেয়ে মিষ্টি ফলটি সময় নিয়ে পাকে, তাই ধৈর্য ধরা সবচেয়ে বড় গুণ।",
    lessonBn: "Shobcheye mishti folti shomoy niye pake, tai dhoirjo dhora shobcheye boro gun.",
    cliffhanger: "A gentle wind blows, and a ripe mango drops directly into the wicker basket, but beneath it lies a mystery seed...",
    tags: ["Patience", "Nature", "Bengali Food", "Courtyard"]
  },
  {
    title: "The Tiny Weaver Bird's Nest",
    titleBn: "বাবুই পাখির বাসা",
    theme: "Architecture & Hard Work",
    timeOfDay: "Warm Morning",
    locationExt: "Bamboo Trellis Bordering the Garden Courtyard",
    problem: "Puchu wonders how a tiny bird without hands or tools can build such an intricate woven home.",
    learning: "Piece by piece, blade of grass by blade of grass, dedication crafts miracles.",
    rhymeTitle: "Babui Pakhi Re (Little Weaver Bird)",
    rhymeBnScript: "বাবুই পাখি ডাকে বলি, কী সুন্দর তোমার ঘর! / ঘাসের পরে ঘাস সাজিয়ে গড়েছো সুন্দর পর!",
    rhymeBn: "Babui pakhi daake boli, ki shundor tomar ghor! / Ghash-er pore ghash sajiye gorecho shundor por!",
    rhymeEn: "Little weaver bird so clever, braiding green and brown / One dry stem and then another, building a golden crown!",
    lessonEn: "Big, wonderful things are built with small, patient steps taken one at a time.",
    lessonBnScript: "ছোট ছোট চেষ্টা দিয়েই একদিন বড় আর সুন্দর কিছু গড়ে তোলা যায়।",
    lessonBn: "Choto choto cheshta diyei ekdin boro ar shundor kichu gore tola jay.",
    cliffhanger: "The weaver bird drops a single blade of dried golden reed right next to Puku's handle...",
    tags: ["Animals", "Perseverance", "Bangladeshi Village", "Architecture"]
  },
  {
    title: "Grandma's Clay Tea Pitcher",
    titleBn: "দাদিমার মাটির কলসি",
    theme: "Tradition & Earth",
    timeOfDay: "Golden Sunrise",
    locationExt: "Courtyard Veranda by the Terracotta Stove",
    problem: "Puchu accidentally spills lukewarm water and wonders why Grandma prefers porous clay over shiny metal.",
    learning: "Earthen pots breathe, keeping village water naturally cool and sweet with the aroma of the earth.",
    rhymeTitle: "Matir Kolshi (Clay Jar Cool and Sweet)",
    rhymeBnScript: "মাটির কলসি ঠান্ডা পানি, তৃষ্ণা মেটায় প্রাণ / গাঁয়ের মাটির গন্ধ মেখে জুড়ায় দেহ মন!",
    rhymeBn: "Matir kolshi thanda pani, trishna metay pran / Gayer matir gondho mekhe juray deho mon!",
    rhymeEn: "Terracotta jug of clay, cooling water clear / Nature's breath upon the earth, bringing comfort near!",
    lessonEn: "Ancient ways and simple earthen vessels hold deep wisdom and caring coolness.",
    lessonBnScript: "মাটির তৈরি জিনিস সাধারণ হলেও এর মধ্যে প্রকৃতির গভীর ভালোবাসা আর শীতলতা থাকে।",
    lessonBn: "Matir toiri jinish shadharon holeo er moddhe prokritir gobhir bhalobasha ar sheetolota thake.",
    cliffhanger: "Inside the clay pitcher's cool rim, a tiny green cricket begins tuning its little violin legs...",
    tags: ["Culture", "Tradition", "Science", "Courtyard"]
  },
  {
    title: "The Floating Water Lily",
    titleBn: "ভাসমান শাপলা ফুল",
    theme: "National Symbols & Floating",
    timeOfDay: "Breezy Midday",
    locationExt: "Stone Basin Pond beside the Courtyard Garden",
    problem: "Puchu thinks heavy blossoms must sink to the bottom like stones.",
    learning: "Water lilies (Shapla) have spongy air-filled stems that let them dance gracefully on the surface.",
    rhymeTitle: "Shapla Phul Shada (White Water Lily)",
    rhymeBnScript: "পুকুর জলে শাপলা ফোটে, সাদা পাপড়ি মেলে / আমাদের এই দেশের ফুল, দোলে শীতল জলে!",
    rhymeBn: "Pukur jole shapla phote, shada papri mele / Amader ei desher phul, dole sheetol jole!",
    rhymeEn: "White water lily floating high, beneath the sunny sky / National flower of our land, nodding as ripples pass by!",
    lessonEn: "Nature gives everything special gifts so it can rise and shine where it belongs.",
    lessonBnScript: "সবার মধ্যেই নিজস্ব বৈশিষ্ট্য থাকে, যা তাদের সুন্দরভাবে বিকশিত হতে সাহায্য করে।",
    lessonBn: "Shobar moddhei nijossho boishishto thake, ja tader shundorbhabe bikoshito hote shahajjo kore.",
    cliffhanger: "A gentle frog leaps onto the lily pad, bearing a tiny rolled-up hibiscus petal...",
    tags: ["National Flower", "Science", "Pond", "Bengali Words"]
  },
  {
    title: "The Cricket's Twilit Lullaby",
    timeOfDay: "Twilit Sunset",
    titleBn: "ঝিঁঝিঁ পোকার সন্ধ্যার গান",
    theme: "Day into Night & Resting",
    locationExt: "Picnic Table Under the Amber Sky Lanterns",
    problem: "Puchu does not want the sunny tea party to end and resists packing up her tea set.",
    learning: "Sunset is not an ending, but the time when the stars wake up and night creatures sing their soothing lullaby.",
    rhymeTitle: "Jhirijhiri Shondha (Soft Evening Breeze)",
    rhymeBnScript: "সূর্য মামা ডুবলো রে ভাই, এলো সন্ধ্যা বেলা / ঝিঁঝিঁ পোকার সুর শুনে আজ শেষ করো ভাই খেলা!",
    rhymeBn: "Shurjo mama dublo re bhai, elo shondha bela / Jhinjhi pokar shur shune aaj shesh koro bhai khela!",
    rhymeEn: "Golden sun has gone to sleep, evening stars arrive / Crickets sing their gentle chime, keeping dreams alive!",
    lessonEn: "Resting at twilight prepares our eyes and hearts for tomorrow's bright new discoveries.",
    lessonBnScript: "দিনের শেষে বিশ্রাম নেওয়া জরুরি, যাতে আগামীকালের নতুন দিনটি হাসিমুখে শুরু করা যায়।",
    lessonBn: "Diner sheshe bishram neowa joruri, jate agamikal-er notun dinti hashimukhe shuru kora jay.",
    cliffhanger: "As twilight deepens, a tiny speck of emerald light blinks on the jasmine vine: a firefly...",
    tags: ["Bedtime", "Evening", "Nature", "Gratitude"]
  },
  {
    title: "The Glowing Firefly's Lantern",
    titleBn: "জোনাকি পোকার বাতি",
    theme: "Bioluminescence & Inner Light",
    timeOfDay: "Twilit Sunset",
    locationExt: "Jasmine Arbour at Courtyard Fence",
    problem: "The garden courtyard is growing dark, and Puchu fears they cannot see the path to Grandma's door.",
    learning: "A single tiny firefly (Jonaki) lights the way; Puku's heart responds with its own warm glow.",
    rhymeTitle: "Jonaki Jonaki (Little Firefly)",
    rhymeBnScript: "জোনাকি জোনাকি মিষ্টি বাতি, জ্বালো আলো জ্বালো / অন্ধকারের বুক চিরে পথ দেখাও ভালো!",
    rhymeBn: "Jonaki jonaki mishti bati, jwalo alo jwalo / Ondhokarer buk chire poth dekhao bhalo!",
    rhymeEn: "Firefly with lantern bright, glowing through the night / Even little lights can chase the shadows out of sight!",
    lessonEn: "No matter how small we are, our kindness can be a shining light for everyone around us.",
    lessonBnScript: "আমরা যতই ছোট হই না কেন, আমাদের ভালোবাসা আর সততা অন্যের পথ আলোকিত করতে পারে।",
    lessonBn: "Amra jotoi choto hoi na keno, amader bhalobasha ar shotota onner poth alokito korte pare.",
    cliffhanger: "Puku's heart glow matches the firefly's pulse, illuminating a fresh cluster of dew-kissed jasmine buds...",
    tags: ["Insects", "Night", "Kindness", "Puku Glow"]
  },
  {
    title: "The Scent of Fresh Jasmine",
    titleBn: "বেলি ফুলের মিষ্টি সুবাস",
    theme: "Senses & Memory",
    timeOfDay: "Golden Sunrise",
    locationExt: "Jasmine Bush & Courtyard Bench",
    problem: "Puchu wants to preserve the sweet fragrance of the white Beli flower forever in a jar.",
    learning: "Scents belong to living flowers on their vine, but our loving memories keep them fresh forever in our hearts.",
    rhymeTitle: "Beli Phuler Mala (Jasmine Garland)",
    rhymeBnScript: "বেলি ফুল ফুটলো ভোরে, শুভ্র সাদা সাজে / মিষ্টি সুবাস ছড়িয়ে পড়ে সকালের এই কাজে!",
    rhymeBn: "Beli phul phutlo bhore, shubhro shada saaje / Mishti subash choriye pore shokal-er ei kaaje!",
    rhymeEn: "Jasmine blossoms at the dawn, white petals pure and sweet / Bringing peace to every lawn, morning joy complete!",
    lessonEn: "True beauty does not need to be locked away; sharing its scent freely makes everyone happy.",
    lessonBnScript: "সৌন্দর্যকে আটকে রাখতে নেই, তা সবার মাঝে ছড়িয়ে দিলেই তার আসল রূপ ফোটে।",
    lessonBn: "Shoundorjoke aatke rakhte nei, ta shobar majhe choriye dilei tar ashol rup phote.",
    cliffhanger: "A curious calico kitten tiptoes onto the checkered tablecloth and sniffs Puchu's teacup...",
    tags: ["Flowers", "Senses", "Courtyard", "Friendship"]
  }
];

// Rich procedural continuity generator for all 105 episodes
const TOPIC_ROTATION = [
  { topic: "The Colorful Rangoli", topicBn: "রঙিন আলপনা", tag: "Art", theme: "Shapes & Creativity" },
  { topic: "The River's Singing Ripples", topicBn: "নদীর কলতান", tag: "Water", theme: "Rhythm & Nature" },
  { topic: "Counting Coriander Seeds", topicBn: "ধনিয়া বীজ গোনা", tag: "Numbers", theme: "Counting & Observation" },
  { topic: "The Helpful Garden Snail", topicBn: "বাগানের শান্ত শামুক", tag: "Animals", theme: "Patience & Slow Steps" },
  { topic: "Grandma's Handwoven Fan", topicBn: "নকশী হাতপাখা", tag: "Tradition", theme: "Craft & Family Love" },
  { topic: "The Dancing Peacock Feather", topicBn: "ময়ূরের রঙিন পালক", tag: "Colors", theme: "Patterns & Wonder" },
  { topic: "The Golden Marigold Garland", topicBn: "গাঁদা ফুলের মালা", tag: "Celebration", theme: "Festivity & Sharing" },
  { topic: "The Playful Courtyard Squirrel", topicBn: "কাঠবিড়ালির লুকোচুরি", tag: "Animals", theme: "Agility & Playfulness" },
  { topic: "The Sweet Coconut Treat", topicBn: "মিষ্টি নারিকেল নাড়ু", tag: "Food", theme: "Cooking & Hospitality" },
  { topic: "The Gentle Morning Mist", topicBn: "ভোরের নরম কুয়াশা", tag: "Seasons", theme: "Winter Warmth & Tea" },
  { topic: "The Wind Through the Bamboo", topicBn: "বাঁশবাগানের দোলা", tag: "Music", theme: "Sound of the Wind" },
  { topic: "The Clay Pigeon Whistle", topicBn: "মাটির পুতুল বাঁশি", tag: "Toys", theme: "Folk Crafts & Melodies" },
  { topic: "The Floating Paper Boat", topicBn: "কাগজের ছোট্ট নাও", tag: "Play", theme: "Buoyancy & Imagination" },
  { topic: "The Sunlit Hibiscus Tea", topicBn: "জবা ফুলের লাল চা", tag: "Colors", theme: "Colors & Flavors" },
  { topic: "The Busy Honeybee's Dance", topicBn: "মৌমাছির মিষ্টি নাচ", tag: "Nature", theme: "Pollination & Teamwork" }
];

const TIME_OF_DAY_LIST: ('Golden Sunrise' | 'Warm Morning' | 'Breezy Midday' | 'Amber Afternoon' | 'Twilit Sunset')[] = [
  'Warm Morning',
  'Golden Sunrise',
  'Breezy Midday',
  'Amber Afternoon',
  'Twilit Sunset'
];

/**
 * Returns a complete, fully fleshed-out Episode object for any episode number from 1 to 105.
 * Strictly adheres to:
 * - 330 seconds total duration (20s opening, 240s adventure, 40s lesson, 30s closing)
 * - Strict Character Lock (Puchu: baby girl, curly brown pigtails, green ribbons, rosy cheeks, nose freckles, brown eyes, light green dress with white collar. Puku: round white ceramic mug with glowing heart)
 * - Courtyard setting in a Bangladeshi village with signature checkered tablecloth and tea set
 * - Continuity line recapping previous episode
 */
export function getEpisode(episodeNum: number): Episode {
  const id = Math.max(1, Math.min(105, Math.floor(episodeNum)));

  // If directly in curated seed list
  if (id <= SEED_EPISODES.length) {
    const seed = SEED_EPISODES[id - 1];
    const prevRecap = id === 1
      ? "Yesterday, Puchu discovered the smiling white ceramic mug Puku resting on Grandma's checkered picnic tablecloth, and their magical tea adventures began!"
      : `In our last adventure (Episode ${id - 1}), Puchu and Puku solved the puzzle of "${SEED_EPISODES[id - 2].title}" together in the sunny garden courtyard.`;

    return buildFullEpisode(id, seed, prevRecap);
  }

  // Procedural continuity for episodes 11 to 105
  const topicIdx = (id - 1) % TOPIC_ROTATION.length;
  const rotation = TOPIC_ROTATION[topicIdx];
  const timeOfDay = TIME_OF_DAY_LIST[(id - 1) % TIME_OF_DAY_LIST.length];

  const prevTopic = TOPIC_ROTATION[(id - 2 + TOPIC_ROTATION.length) % TOPIC_ROTATION.length];
  const prevRecap = `After their heartwarming discovery with "${prevTopic.topic}" in Episode ${id - 1}, Puchu and Puku returned to their signature checkered picnic table.`;

  const seed: EpisodeSeed = {
    title: `${rotation.topic}`,
    titleBn: `${rotation.topicBn}`,
    theme: `${rotation.theme}`,
    timeOfDay,
    locationExt: `Courtyard Courtyard Zone ${Math.floor((id - 1) / 5) + 1} - Beside the ${rotation.tag} Garden`,
    problem: `Puchu and Puku encounter an unexpected surprise involving ${rotation.topic.toLowerCase()}, requiring careful observation and kindness.`,
    learning: `Learning how ${rotation.theme.toLowerCase()} enriches our days and helps us care for everyone in the village.`,
    rhymeTitle: `${rotation.topicBn} (Bilingual Song)`,
    rhymeBnScript: `এসো মিলি সবাই ভাই, ${rotation.topicBn} গান গাই! / পুকুর আলোয় হাসিমুখে নতুন কিছু পাই!`,
    rhymeBn: `Esho mili shobai bhai, ${rotation.topicBn} gaan gai! / Pukur aloy hashimukhe notun kichu pai!`,
    rhymeEn: `Come together, friends so dear, sing the song of joy and cheer / Puku's heart is shining bright, filling courtyard with pure light!`,
    lessonEn: `When we look closely with an open heart, every little moment in our courtyard teaches us love, patience, and joy.`,
    lessonBnScript: `মন দিয়ে দেখলে চারপাশের সাধারণ জিনিসগুলোর মধ্যেও আনন্দ আর ভালোবাসার গভীর শিক্ষা লুকিয়ে থাকে।`,
    lessonBn: `Mon diye dekhle charpasher shadharon jinishguli-o anondo ar bhalobashar shikkha dey.`,
    cliffhanger: `Just as the courtyard settled into peaceful warmth, a gentle rustle beneath the hibiscus bush whispered of Episode ${id === 105 ? 1 : id + 1}...`,
    tags: [rotation.tag, "Bangladeshi Village", "Pixar 3D", "Courtyard", "Friendship"]
  };

  return buildFullEpisode(id, seed, prevRecap);
}

function buildFullEpisode(id: number, seed: EpisodeSeed, prevRecap: string): Episode {
  const openingDuration = 20;
  const adventureDuration = 240;
  const lessonDuration = 40;
  const closingDuration = 30;

  // Pixar-quality character lock reference description
  const puchuLock = "Puchu (toddler baby girl, curly brown pigtails, emerald green hair ribbons, rosy chubby cheeks, delicate freckles across small nose bridge, large warm brown expressive Pixar eyes, mint green dress with Peter Pan white collar)";
  const pukuLock = "Puku (living round smiling white glossy ceramic mug companion, expressive black oval eyes, cheerful curved mouth, smooth white handle, internal glowing heart)";

  const establishingShot = `Candid, cinematic establishing shot of a sunny garden courtyard in a rural Bangladeshi village at ${seed.timeOfDay}. In the foreground, an orange-and-white checkered picnic tablecloth rests on a rustic wooden picnic table beside a woven wicker basket and a steaming clay tea set. Lush terracotta flower pots with bright yellow marigolds and white jasmine blossoms surround the patio. Pixar-grade 720p 3D CGI rendering, warm volumetric sunlight, soft depth of field, gentle lens dust motes, vibrant warm color grading.`;

  const adventureKeyframe = `Cinematic medium-wide shot of ${puchuLock} kneeling on the checkered blanket with ${pukuLock} beside her at ${seed.locationExt}. Puchu is actively engaged in ${seed.problem.toLowerCase()}, her face showing an expressive, curious smile with large shining brown eyes. Puku sits smiling warmly, steam rising softly in curly whimsical tendrils from his rim. Pixar animation aesthetic, rich subsurface scattering on toddler skin, ceramic specular highlights, warm natural courtyard lighting.`;

  const rhymeSongScene = `Dynamic medium two-shot of ${puchuLock} clapping her gentle baby hands in rhythm, singing "${seed.rhymeTitle}". Beside her, ${pukuLock} rocks joyfully from side to side in playful 24fps Pixar physics. Surrounding them are floating garden petals and warm sunbeams in the Bangladeshi village courtyard. Whimsical Pixar 3D CGI style, vibrant color saturation, joyful expressive facial animation.`;

  const pukuGlowKeyframe = `Close cinematic medium shot of ${pukuLock} whose internal heart lights up in a radiant, pulsating warm golden-pink glow, casting gentle luminous reflections across the porcelain rim and onto ${puchuLock}'s rosy cheeks and green dress. Puchu looks at Puku with wide, enchanted brown eyes and delivers the lesson with an adorable, confident nod. Soft cinematic focus, Pixar volumetric lighting, magical learning moment.`;

  const closingShot = `Cinematic wide pull-back shot of the tranquil courtyard at ${seed.timeOfDay}. ${puchuLock} waves goodbye to the camera while holding ${pukuLock} securely in her hands. The checkered picnic table, terracotta pots, and wicker basket are framed in cozy harmony. Camera slowly dollys backwards through lush tropical leaves. Warm sunset lens flare, Pixar storybook ending aesthetic.`;

  const omniKinematic = `Camera Movement: Slow Dolly-in. Character Action: Puchu blinks with curiosity, smiling as Puku rocks gently. Environment Physics: Soft steam rising from mug, leaves swaying in breeze. Pacing: Smooth continuous motion, 24fps.`;

  return {
    id,
    title: seed.title,
    titleBn: seed.titleBn,
    timeOfDay: seed.timeOfDay,
    location: seed.locationExt,
    courtyardOrigin: "The Signature Checkered Picnic Table & Terracotta Garden Patio",
    prevEpisodeRecap: prevRecap,
    problem: seed.problem,
    learningMoment: seed.learning,
    rhyme: {
      title: seed.rhymeTitle,
      bengaliScript: seed.rhymeBnScript,
      bengali: seed.rhymeBn,
      english: seed.rhymeEn,
      melodyNotes: "Warm acoustic dotara and flute lilt with playful children's xylophone tempo (105 BPM)"
    },
    pukuGlowLesson: {
      lessonEn: seed.lessonEn,
      lessonBnScript: seed.lessonBnScript,
      lessonBn: seed.lessonBn,
      pukuVisualAction: "Puku's embossed ceramic heart emblem pulses with a magical golden-pink luminescence",
      glowColor: "Warm Rosy Gold (#FFD166 / #FF6B6B)"
    },
    closingCliffhanger: seed.cliffhanger,
    timecodes: {
      opening: {
        startSec: 0,
        endSec: openingDuration,
        durationSec: openingDuration,
        title: "Courtyard Establishing & Signature Theme",
        cameraShot: "Wide sweeping crane shot lowering down to the checkered table",
        lightingAndLens: `Volumetric golden sunlight, 35mm lens, f/2.8 shallow depth of field, warm morning backlight with golden rim light`,
        visualAction: `The camera glides into Grandma's sunny Bangladeshi courtyard. Puchu in her mint dress and pigtails sets her small porcelain teapot down on the checkered cloth, while Puku beams with a wide happy smile.`,
        audioDialogueEn: `Narrator: "Welcome back to Grandma's sunny garden courtyard! What will Puchu and Puku discover today?"`,
        audioDialogueBn: `Puchu: "Puku, dekho! Shurjo mama utheche! (Look Puku, the sun is up!)"`,
        audioDialogueBnScript: `পুচু: "পুকু, দেখো! সূর্য মামা উঠেছে!"`,
        pukuState: "Smiling cheerfully, slight steam rising from tea mug"
      },
      adventure: {
        startSec: 20,
        endSec: 20 + adventureDuration,
        durationSec: adventureDuration,
        title: "The Problem, Exploration & Bilingual Rhyme",
        cameraShot: "Dynamic medium shots alternating with close-ups of discovery",
        lightingAndLens: `Bright natural sun filtering through tropical mango and jackfruit leaves, 50mm lens, crisp Pixar texture`,
        visualAction: `Puchu and Puku face the episode problem (${seed.problem}). Together they explore the garden courtyard, learn through gentle trial, and sing the cheerful bilingual rhyme while Puku rocks along with rhythm.`,
        audioDialogueEn: `Puchu: "Look Puku! If we look closely together, we can figure it out!" Puku whistles a cheerful chime.`,
        audioDialogueBn: `Puchu: "Ektu dhoirjo dhoro, amra parbo! (Have a little patience, we can do it!)"`,
        audioDialogueBnScript: `পুচু: "একটু ধৈর্য ধরো, আমরা পারবো!"`,
        pukuState: "Expressive nodding, curious blinking, dancing side-to-side during the rhyme"
      },
      lesson: {
        startSec: 260,
        endSec: 260 + lessonDuration,
        durationSec: lessonDuration,
        title: "Puku's Glowing Heart & The Bilingual Lesson Recap",
        cameraShot: "Intimate two-shot focusing on Puku's glowing heart and Puchu's proud smile",
        lightingAndLens: `Warm glowing interior light blooming from Puku, 85mm portrait lens, f/1.8, golden-pink fill light`,
        visualAction: `Puku's heart emblem lights up in a radiant golden-pink pulse as the learning clicks. Puchu hugs her knees, looking proudly into the camera to state the moral lesson in both Bengali and English.`,
        audioDialogueEn: `Puchu: "${seed.lessonEn}"`,
        audioDialogueBn: `Puchu: "${seed.lessonBn}"`,
        audioDialogueBnScript: `পুচু: "${seed.lessonBnScript}"`,
        pukuState: "Heart emblem pulsing softly, smiling warmly, joyful tea chime sound effect"
      },
      closing: {
        startSec: 300,
        endSec: 300 + closingDuration,
        durationSec: closingDuration,
        title: "Warm Farewell & Episode Cliffhanger",
        cameraShot: "Gentle dolly-out crane shot drifting through jasmine flower branches",
        lightingAndLens: `Warm late afternoon glow, soft vignetting, cinematic 2.39:1 / 16:9 720p framing with sunset amber glow`,
        visualAction: `Puchu waves her hand happily, holding Puku by his handle. As the peaceful courtyard music swells, a tiny mystery sound hints at the cliffhanger for the next episode.`,
        audioDialogueEn: `Narrator: "${seed.cliffhanger}" Puchu: "See you next time, bondhura!"`,
        audioDialogueBn: `পুচু: "আবার দেখা হবে বন্ধুরা! টা টা!" (Abar dekha hobe bondhura! Tata!)`,
        audioDialogueBnScript: `পুচু: "আবার দেখা হবে বন্ধুরা! টা টা!"`,
        pukuState: "Joyful wink and gentle steam puff forming a tiny heart shape"
      }
    },
    productionPrompts: {
      establishingShot,
      adventureKeyframe,
      rhymeSongScene,
      pukuGlowLessonKeyframe: pukuGlowKeyframe,
      closingShot,
      omniVideoKinematicPrompt: omniKinematic
    },
    tags: seed.tags
  };
}

/**
 * Returns all 105 episodes in a list.
 */
export function getAllEpisodes(): Episode[] {
  const episodes: Episode[] = [];
  for (let i = 1; i <= 105; i++) {
    episodes.push(getEpisode(i));
  }
  return episodes;
}

/**
 * Searches and filters episodes by query string, topic tag, or time of day.
 */
export function searchEpisodes(query: string, tag?: string): Episode[] {
  const all = getAllEpisodes();
  const cleanQ = query.trim().toLowerCase();

  return all.filter((ep) => {
    const matchesTag = !tag || tag === 'All' || ep.tags.includes(tag) || ep.timeOfDay.toLowerCase().includes(tag.toLowerCase());
    if (!matchesTag) return false;

    if (!cleanQ) return true;

    // Search across title, Bengali title, problem, learning, rhyme, and script
    return (
      ep.id.toString() === cleanQ ||
      `episode ${ep.id}`.includes(cleanQ) ||
      `ep ${ep.id}`.includes(cleanQ) ||
      ep.title.toLowerCase().includes(cleanQ) ||
      ep.titleBn.toLowerCase().includes(cleanQ) ||
      ep.problem.toLowerCase().includes(cleanQ) ||
      ep.learningMoment.toLowerCase().includes(cleanQ) ||
      ep.rhyme.english.toLowerCase().includes(cleanQ) ||
      ep.rhyme.bengali.toLowerCase().includes(cleanQ) ||
      ep.location.toLowerCase().includes(cleanQ) ||
      ep.tags.some(t => t.toLowerCase().includes(cleanQ))
    );
  });
}
