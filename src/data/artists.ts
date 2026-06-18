/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artist } from "../types";

// Build simplified flat path for tattoo portfolio images
const getTattooImage = (artistId: string, tattooId: string) => {
  let tattooIndex: number = 1;
  const match = tattooId.match(/\d+$/);
  if (match) {
    tattooIndex = parseInt(match[0], 10);
  }
  return `/images/artists/${artistId}-portfolio-${tattooIndex}.png`;
};

// Build simplified flat path for artist avatar images
const getAvatarImage = (artistId: string) => {
  return `/images/avatars/${artistId}.png`;
};

export const ARTISTS: Artist[] = [
  {
    id: "fede-almanzor",
    name: "Fede Almanzor",
    role: "Resident Master",
    avatarUrl: getAvatarImage("fede-almanzor"),
    specialty: "Neotraditional",
    bio: "Fede Almanzor is an authority in Neotraditional ink. Known for blending bold, pristine contours, saturated color ranges, and highly detailed organic elements. His work embodies natural symmetry and legendary symbols.",
    instagram: "fede_almanzor",
    nextAvailable: "In 2 Days",
    portfolio: [
      { id: "fede-1", title: "Phoenix Rebirth Sleeve", description: "Bespoke vibrant neotraditional phoenix layout wrapping the entire arm.", imageUrl: getTattooImage("fede-almanzor", "fede-1"), category: "custom" },
      { id: "fede-2", title: "Neo-Classical Lion Head", description: "Regal lion decorated with gold ornaments and intense colorful crown.", imageUrl: getTattooImage("fede-almanzor", "fede-2"), category: "custom" },
      { id: "fede-3", title: "Sacred Guardian Portrait", description: "Intricately detailed neotraditional warrior portrait with vivid highlights.", imageUrl: getTattooImage("fede-almanzor", "fede-3"), category: "custom" },
      { id: "fede-4", title: "Mystical Flora & Serpent", description: "Slinky black and color neotraditional snake weaving through deep red roses.", imageUrl: getTattooImage("fede-almanzor", "fede-4"), category: "custom" }
    ]
  },
  {
    id: "gkirin",
    name: "Gkirin",
    role: "Resident Master",
    avatarUrl: getAvatarImage("gkirin"),
    specialty: "Black & Gray Realism",
    bio: "Gkirin is celebrated for hyperrealistic black and grey portraits, deep atmospheric shading, and striking three-dimensional perspectives that adapt seamlessly to the body shape.",
    instagram: "gkirin_tattoo",
    nextAvailable: "In 3 Days",
    portfolio: [
      { id: "gkirin-1", title: "Angelic Winged Shading", description: "Deep black and grey wing sculpture with hyperdetailed feather structures.", imageUrl: getTattooImage("gkirin", "gkirin-1"), category: "realism" },
      { id: "gkirin-2", title: "Hyperrealistic Clock & Gears", description: "Bespoke timeless timepiece contouring the forearm with pristine gradients.", imageUrl: getTattooImage("gkirin", "gkirin-2"), category: "realism" },
      { id: "gkirin-3", title: "Roman Emperor Bust", description: "Classic sculpture study focusing on weathered marble textures and deep shadows.", imageUrl: getTattooImage("gkirin", "gkirin-3"), category: "realism" },
      { id: "gkirin-4", title: "Subtle Realistic Tiger Portrait", description: "Saturated micro-detail tiger eyes looking with absolute presence.", imageUrl: getTattooImage("gkirin", "gkirin-4"), category: "realism" }
    ]
  },
  {
    id: "jordan",
    name: "Jordan",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("jordan"),
    specialty: "Fineline-Conceptual",
    bio: "Jordan creates masterpieces using mechanical single-needle fine lines and high-contrast concept layouts. Perfect for minimalists who require flawless geometric alignment and intricate script.",
    instagram: "jordan_ink",
    nextAvailable: "In 5 Days",
    portfolio: [
      { id: "jordan-1", title: "Geometric Constellations", description: "Delicate single-needle cosmic charts and planetary orbits.", imageUrl: getTattooImage("jordan", "jordan-1"), category: "fineline" },
      { id: "jordan-2", title: "Fine Line Abstract Architecture", description: "Sleek miniature cathedral blueprint with incredible mechanical line work.", imageUrl: getTattooImage("jordan", "jordan-2"), category: "fineline" },
      { id: "jordan-3", title: "Concept Solar Eye", description: "Surrealistic stippled pupil wrapped in mathematical solar rings.", imageUrl: getTattooImage("jordan", "jordan-3"), category: "fineline" },
      { id: "jordan-4", title: "Minimalist Botanical Sleeve", description: "Elegant, flowing floral silhouettes climbing the wrist in pure grey wash.", imageUrl: getTattooImage("jordan", "jordan-4"), category: "fineline" }
    ]
  },
  {
    id: "toni-garcia",
    name: "Toni Garcia",
    role: "Resident Master",
    avatarUrl: getAvatarImage("toni-garcia"),
    specialty: "Portraits",
    bio: "Toni Garcia captures deep human emotion and lifelike expressions in high-contrast miniature and large-scale portraiture. Every piece represents absolute fidelity, texture, and light balance.",
    instagram: "toni_garcia",
    nextAvailable: "In 4 Days",
    portfolio: [
      { id: "toni-1", title: "Chopin Memorial Portrait", description: "Breathtaking dark realism portrait of the legendary composer.", imageUrl: getTattooImage("toni-garcia", "toni-1"), category: "portrait" },
      { id: "toni-2", title: "Classic Hollywood Icon Portrait", description: "Saturated silver shade profile of a classic cinema model.", imageUrl: getTattooImage("toni-garcia", "toni-2"), category: "portrait" },
      { id: "toni-3", title: "Mythological Greek God Portrait", description: "Hyper-detailed Zeus portrait displaying majestic white beard details.", imageUrl: getTattooImage("toni-garcia", "toni-3"), category: "portrait" },
      { id: "toni-4", title: "Symmetrical Ancestor Portrait", description: "Extremely delicate ancestral tribute with photographic realism.", imageUrl: getTattooImage("toni-garcia", "toni-4"), category: "portrait" }
    ]
  },
  {
    id: "fran-dmenchi",
    name: "Fran Dmenchi",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("fran-dmenchi"),
    specialty: "Fineline-Conceptual",
    bio: "Fran Dmenchi combines delicate microminimalist blueprints with deep blackwork components, specializing in mythological narratives compressed into microrealism.",
    instagram: "fran_dmenchi",
    nextAvailable: "In 6 Days",
    portfolio: [
      { id: "fran-1", title: "Astro-Mythology Solar Dial", description: "Intricate conceptual star maps and hyper realistic planetary charts.", imageUrl: getTattooImage("fran-dmenchi", "fran-1"), category: "fineline" },
      { id: "fran-2", title: "Micro-Draped Statue Contour", description: "Flawless fine needle portrait of a cloaked goddess under 3 inches.", imageUrl: getTattooImage("fran-dmenchi", "fran-2"), category: "fineline" },
      { id: "fran-3", title: "Abstract Concept Heart Grid", description: "Anatomical heart merged with mathematical vectors and thin grids.", imageUrl: getTattooImage("fran-dmenchi", "fran-3"), category: "fineline" },
      { id: "fran-4", title: "Symmetrical Geometric Chevron", description: "Crisp dotwork and line composition highlighting muscular curves.", imageUrl: getTattooImage("fran-dmenchi", "fran-4"), category: "fineline" }
    ]
  },
  {
    id: "suan",
    name: "Suan",
    role: "Resident Master",
    avatarUrl: getAvatarImage("suan"),
    specialty: "Black & Gray Realism",
    bio: "Suan focuses on classical sculpture renderings, mythological backpieces, and dark photorealistic sleeves. Master of continuous three-dimensional shadows.",
    instagram: "suan_tattoo",
    nextAvailable: "In 1 Week",
    portfolio: [
      { id: "suan-1", title: "Michelangelo's David Tribute", description: "Stunning marble statue sleeve capturing real lighting and cracks.", imageUrl: getTattooImage("suan", "suan-1"), category: "realism" },
      { id: "suan-2", title: "Serrated Bio-Mechanic Shoulder", description: "3D visual biomechanical machinery embedded under muscular skin layers.", imageUrl: getTattooImage("suan", "suan-2"), category: "realism" },
      { id: "suan-3", title: "Majestic Raven & Fog Backpiece", description: "Moody hyperrealistic raven emerging from dynamic mist and tree branches.", imageUrl: getTattooImage("suan", "suan-3"), category: "realism" },
      { id: "suan-4", title: "Gothic Cathedral Portal", description: "Incredible textured archway featuring realistic shadows and bricks.", imageUrl: getTattooImage("suan", "suan-4"), category: "realism" }
    ]
  },
  {
    id: "ivan-morant",
    name: "Ivan Morant",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("ivan-morant"),
    specialty: "Black & Gray Realism",
    bio: "Ivan Morant is a specialist in rich carbon pigments and deep contrast realism. His tattoos stand out with brilliant silver highlights and sharp focus fields.",
    instagram: "ivan_morant",
    nextAvailable: "In 4 Days",
    portfolio: [
      { id: "ivan-1", title: "Roaring Apex Predator", description: "Intense black and grey wolf face capturing high-contrast wet fur.", imageUrl: getTattooImage("ivan-morant", "ivan-1"), category: "realism" },
      { id: "ivan-2", title: "Smoky Antique Hourglass", description: "Detailed antique timepiece surrounded by flowing realistic smoke ribbons.", imageUrl: getTattooImage("ivan-morant", "ivan-2"), category: "realism" },
      { id: "ivan-3", title: "Poseidon Marine Backpiece", description: "Epic ocean waves with Poseidon handling a textured trident.", imageUrl: getTattooImage("ivan-morant", "ivan-3"), category: "realism" },
      { id: "ivan-4", title: "Realistic Compass & Map", description: "Stunning geometric compass overlaying ancient textured parchment maps.", imageUrl: getTattooImage("ivan-morant", "ivan-4"), category: "realism" }
    ]
  },
  {
    id: "cesar-pinto",
    name: "César Pinto",
    role: "Resident Master",
    avatarUrl: getAvatarImage("cesar-pinto"),
    specialty: "Color Realism",
    bio: "César Pinto injects electric color gradients and high-density saturated inks into the skin, famous for hyperrealistic portraits and botanical realism that remains vibrant forever.",
    instagram: "cesar_pinto",
    nextAvailable: "In 3 Days",
    portfolio: [
      { id: "cesar-1", title: "Saturated Red Parrot Sleeve", description: "Breathtaking electric feathers and jungle leaves with photorealistic glaze.", imageUrl: getTattooImage("cesar-pinto", "cesar-1"), category: "custom" },
      { id: "cesar-2", title: "Hyper-Dense Color Rose", description: "Velvety crimson rose covered in liquid dew drops with 3D shadows.", imageUrl: getTattooImage("cesar-pinto", "cesar-2"), category: "custom" },
      { id: "cesar-3", title: "Pop Art Portrait Realism", description: "Brilliant neon-colored female portrait utilizing illustrative gradients.", imageUrl: getTattooImage("cesar-pinto", "cesar-3"), category: "custom" },
      { id: "cesar-4", title: "Vivid Deep Sea Jellyfish", description: "Glowing bioluminescent jellyfish floating against a deep dark background.", imageUrl: getTattooImage("cesar-pinto", "cesar-4"), category: "custom" }
    ]
  },
  {
    id: "bk",
    name: "BK",
    role: "Resident Master",
    avatarUrl: getAvatarImage("bk"),
    specialty: "Black & Gray Realism",
    bio: "BK specializes in cinematic, large-scale black and grey realism, blending iconic mythological figures with dark surreal atmospheres and flawless proportions.",
    instagram: "bk_ink",
    nextAvailable: "In 5 Days",
    portfolio: [
      { id: "bk-1", title: "Roman Mythological Backpiece", description: "Panoramic classical gladiators fighting in an arena with deep shading.", imageUrl: getTattooImage("bk", "bk-1"), category: "realism" },
      { id: "bk-2", title: "Detailed Skull & Shrouded Rose", description: "Immaculate heavy contrast skull wrapped in high-definition petals.", imageUrl: getTattooImage("bk", "bk-2"), category: "realism" },
      { id: "bk-3", title: "Cloaked Seraphim Chest Piece", description: "Majestic angel holding a dynamic blade with smooth silver washes.", imageUrl: getTattooImage("bk", "bk-3"), category: "realism" },
      { id: "bk-4", title: "Lifelike Lion Pride Forearm", description: "Extremely rich textures of lion fur and deep powerful eyes.", imageUrl: getTattooImage("bk", "bk-4"), category: "realism" }
    ]
  },
  {
    id: "honart",
    name: "Honart",
    role: "Resident Master",
    avatarUrl: getAvatarImage("honart"),
    specialty: "Portraits",
    bio: "Honart is an authority in dual-tone portraits and historical classical figures, famous for blending soft grey wash with sudden vibrant colored accents.",
    instagram: "honart_tattoo",
    nextAvailable: "In 2 Days",
    portfolio: [
      { id: "honart-1", title: "Renaissance Madonna", description: "Classic portrait with a gold halos highlight utilizing subtle real gold pigment.", imageUrl: getTattooImage("honart", "honart-1"), category: "portrait" },
      { id: "honart-2", title: "Modernist Split Portrait", description: "Half-statue half-human face showing stunning organic shading transitions.", imageUrl: getTattooImage("honart", "honart-2"), category: "portrait" },
      { id: "honart-3", title: "Saturated Red Coral Face", description: "Classical bust covered with stylized underwater corals and bright color highlights.", imageUrl: getTattooImage("honart", "honart-3"), category: "portrait" },
      { id: "honart-4", title: "Hyperrealistic Child portrait", description: "Soft, emotional photographic rendering capturing perfect skin textures.", imageUrl: getTattooImage("honart", "honart-4"), category: "portrait" }
    ]
  },
  {
    id: "lewis",
    name: "Lewis",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("lewis"),
    specialty: "Black & Gray Realism",
    bio: "Lewis is celebrated for realistic textures, including hyper-detailed ancient relics, mythological monsters, and dramatic battle sleeves.",
    instagram: "lewis_customs",
    nextAvailable: "In 4 Days",
    portfolio: [
      { id: "lewis-1", title: "Ancient Centaur Skirmish", description: "Highly dynamic Greek battle representation wrapping the shoulder.", imageUrl: getTattooImage("lewis", "lewis-1"), category: "realism" },
      { id: "lewis-2", title: "Rusted Gladiator Helmet", description: "Unmatched steel styling showing authentic scars and metallic highlights.", imageUrl: getTattooImage("lewis", "lewis-2"), category: "realism" },
      { id: "lewis-3", title: "Greek Column & Floral Sleeve", description: "Structured marble columns climbing the forearm intertwined with Ivy.", imageUrl: getTattooImage("lewis", "lewis-3"), category: "realism" },
      { id: "lewis-4", title: "Majestic Owl Flight", description: "Spacious wing spread with high-contrast feathers and nocturnal moon.", imageUrl: getTattooImage("lewis", "lewis-4"), category: "realism" }
    ]
  },
  {
    id: "johan-castillo",
    name: "Johan Castillo",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("johan-castillo"),
    specialty: "Color Original Designs",
    bio: "Johan Castillo creates colorful custom compositions, utilizing a combination of vivid graffiti-style sprays, anime-inspired elements, and high-density abstract paint splashes.",
    instagram: "johan_castillo",
    nextAvailable: "In 6 Days",
    portfolio: [
      { id: "johan-1", title: "Cyberpunk Dreamscape", description: "Splashed electric purple and cobalt cityscape with high contrast lines.", imageUrl: getTattooImage("johan-castillo", "johan-1"), category: "custom" },
      { id: "johan-2", title: "Neon Geisha Portrait", description: "Traditional portrait with brilliant neon pink hair and digital glaze.", imageUrl: getTattooImage("johan-castillo", "johan-2"), category: "custom" },
      { id: "johan-3", title: "Liquid Abstract Koi Fish", description: "Vibrant yellow and blue watercolors morphing into elegant fish silhouettes.", imageUrl: getTattooImage("johan-castillo", "johan-3"), category: "custom" },
      { id: "johan-4", title: "Splattered Graffiti Skull", description: "Urban styled skull dripping with detailed acrylic paint gradients.", imageUrl: getTattooImage("johan-castillo", "johan-4"), category: "custom" }
    ]
  },
  {
    id: "diconeme",
    name: "Diconeme",
    role: "Resident Master",
    avatarUrl: getAvatarImage("diconeme"),
    specialty: "Fineline-Conceptual",
    bio: "Diconeme is an expert in microrealism, combining sharp geometric grids with bold blackwork fills. Highly requested for deep cosmic symbols.",
    instagram: "diconeme_tattoo",
    nextAvailable: "In 3 Days",
    portfolio: [
      { id: "dico-1", title: "Astronomy Compass Blueprint", description: "Pristine technical lines and miniature star maps overlaying a real clock.", imageUrl: getTattooImage("diconeme", "dico-1"), category: "fineline" },
      { id: "dico-2", title: "Gothic Micro-Cathedral", description: "Hyper-detailed medieval window designed under 4 inches with exact windows.", imageUrl: getTattooImage("diconeme", "dico-2"), category: "fineline" },
      { id: "dico-3", title: "Mathematical Golden Spiral", description: "Perfect Fibonacci sequences winding down the wrist in stippling gradients.", imageUrl: getTattooImage("diconeme", "dico-3"), category: "fineline" },
      { id: "dico-4", title: "Heavy Solid Blackwork Serpent", description: "Thick, high-contrast black shapes contrasting with thin linear floral wings.", imageUrl: getTattooImage("diconeme", "dico-4"), category: "fineline" }
    ]
  },
  {
    id: "guillermo",
    name: "Guillermo",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("guillermo"),
    specialty: "Black & Gray Realism",
    bio: "Guillermo handles bold, grand-scale black and grey and vibrant color realism. His work stands out with intense dark backdrops and clean contrast ratios.",
    instagram: "guillermo_ink",
    nextAvailable: "In 5 Days",
    portfolio: [
      { id: "guil-1", title: "Mythic Prometheus Release", description: "Dramatic torso piece displaying high-definition chain links and muscles.", imageUrl: getTattooImage("guillermo", "guil-1"), category: "realism" },
      { id: "guil-2", title: "Saturated Lotus & Buddha Statue", description: "Deep black background framing a peaceful stone sculpture of Buddha.", imageUrl: getTattooImage("guillermo", "guil-2"), category: "realism" },
      { id: "guil-3", title: "Classic Heavy-Shade Skull", description: "Skeletal study with incredibly realistic bone cracks and dark cavities.", imageUrl: getTattooImage("guillermo", "guil-3"), category: "realism" },
      { id: "guil-4", title: "Intense Wolf Gaze Forearm", description: "Brilliant wet-nose rendering with incredible lighting from the left.", imageUrl: getTattooImage("guillermo", "guil-4"), category: "realism" }
    ]
  },
  {
    id: "hector",
    name: "Hector",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("hector"),
    specialty: "Black & Gray Realism",
    bio: "Hector creates highly atmospheric black and grey tattoos. Celebrated for soft smoky backgrounds, realistic skin tones, and subtle transition textures.",
    instagram: "hector_tattoo",
    nextAvailable: "In 1 Week",
    portfolio: [
      { id: "hector-1", title: "Smoky Harbor Tall Ship", description: "Photorealistic ancient ship sailing through structured smoky mist.", imageUrl: getTattooImage("hector", "hector-1"), category: "realism" },
      { id: "hector-2", title: "Realistic Guardian Knight", description: "Exquisite knight armor showing real metal reflection and fine carvings.", imageUrl: getTattooImage("hector", "hector-2"), category: "realism" },
      { id: "hector-3", title: "Majestic Eagle Landing", description: "Rich details of feathers and powerful talons catching a realistic branch.", imageUrl: getTattooImage("hector", "hector-3"), category: "realism" },
      { id: "hector-4", title: "Surreal Floating Eye Clock", description: "Surrealistic pocket watch containing a detailed eye inside the lens.", imageUrl: getTattooImage("hector", "hector-4"), category: "realism" }
    ]
  },
  {
    id: "timor",
    name: "Timor",
    role: "Resident Master",
    avatarUrl: getAvatarImage("timor"),
    specialty: "Blackwork",
    bio: "Timor is a pure blackwork master. He uses high-saturation solid carbon fills alongside bold graphic lines to create modern, brutalist shapes.",
    instagram: "timor_blackwork",
    nextAvailable: "In 4 Days",
    portfolio: [
      { id: "timor-1", title: "Solid Flowing Tribal Swirls", description: "Bold blackwork fluid paths contouring the muscle flow of the shoulder.", imageUrl: getTattooImage("timor", "timor-1"), category: "custom" },
      { id: "timor-2", title: "Geometric Heavy Starburst", description: "Thick solid lines radiating from a pristine point with perfect symmetry.", imageUrl: getTattooImage("timor", "timor-2"), category: "custom" },
      { id: "timor-3", title: "Dark Brutalist Grid", description: "Grid configurations and heavy solid blocks wrapping the wrist.", imageUrl: getTattooImage("timor", "timor-3"), category: "custom" },
      { id: "timor-4", title: "Abstract Flame Sleeve", description: "Heavy graphic black silhouettes resembling sharp contemporary flames.", imageUrl: getTattooImage("timor", "timor-4"), category: "custom" }
    ]
  },
  {
    id: "henry",
    name: "Henry",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("henry"),
    specialty: "Black & Gray Realism",
    bio: "Henry specializes in hyperrealistic sculpture tattoos, capturing texture depth and classical details.",
    instagram: "henry_tattoo",
    nextAvailable: "In 5 Days",
    portfolio: [
      { id: "henry-1", title: "Angel of Grief Study", description: "Pristine sculpture replication capturing weeping textures of wet stone.", imageUrl: getTattooImage("henry", "henry-1"), category: "realism" },
      { id: "henry-2", title: "Classical Marble Columns", description: "Intricate architectural relics climbing the forearm.", imageUrl: getTattooImage("henry", "henry-2"), category: "realism" },
      { id: "henry-3", title: "Socrates Wisdom Portrait", description: "Highly textured philosopher face with deep thoughtful shadows.", imageUrl: getTattooImage("henry", "henry-3"), category: "realism" },
      { id: "henry-4", title: "High Contrast Rose Bunch", description: "Classic realism roses showing glowing white edges on black canvas.", imageUrl: getTattooImage("henry", "henry-4"), category: "realism" }
    ]
  },
  {
    id: "may-soria",
    name: "May Soria",
    role: "Resident Master",
    avatarUrl: getAvatarImage("may-soria"),
    specialty: "Color Microrealism",
    bio: "May Soria is an authority in vibrant miniature color realism. Perfect for hyper-detailed natural portraits and tiny, glowing floral layouts.",
    instagram: "may_soria",
    nextAvailable: "In 3 Days",
    portfolio: [
      { id: "may-1", title: "Micro Colored Hummingbird", description: "Incredibly saturated miniature hummingbird under 2 inches.", imageUrl: getTattooImage("may-soria", "may-1"), category: "portrait" },
      { id: "may-2", title: "Micro Sunflower with Dew", description: "Tiny, glowing sunflower showing absolute detail and reflection.", imageUrl: getTattooImage("may-soria", "may-2"), category: "portrait" },
      { id: "may-3", title: "Petite Colorful Crystal Druzy", description: "Faceted pastel gemstones refracting real glowing color highlights.", imageUrl: getTattooImage("may-soria", "may-3"), category: "portrait" },
      { id: "may-4", title: "Micro Portrait of a Kitten", description: "Lifelike pet portrait under 3 inches from a high-quality reference photo.", imageUrl: getTattooImage("may-soria", "may-4"), category: "portrait" }
    ]
  },
  {
    id: "avecilla",
    name: "Avecilla",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("avecilla"),
    specialty: "Black & Gray Realism",
    bio: "Avecilla specializes in moody, cinematic black and grey compositions. He combines hyperrealistic elements with beautiful fine line smoke transitions.",
    instagram: "avecilla_custom",
    nextAvailable: "In 2 Days",
    portfolio: [
      { id: "avec-1", title: "Ancient Roman Colosseum", description: "Panoramic rendering wrapping the forearm showing incredible bricks.", imageUrl: getTattooImage("avecilla", "avec-1"), category: "realism" },
      { id: "avec-2", title: "Subtle Shaded Feather Nest", description: "Fragile feather layouts stacked with smooth carbon pigment wash.", imageUrl: getTattooImage("avecilla", "avec-2"), category: "realism" },
      { id: "avec-3", title: "Moody Realistic Forest Pathway", description: "Foggy pine trees blending into a solid black gradient at the bottom.", imageUrl: getTattooImage("avecilla", "avec-3"), category: "realism" },
      { id: "avec-4", title: "Hourglass & Flying Ravens", description: "Action landscape showing sand particles escaping the hourglass.", imageUrl: getTattooImage("avecilla", "avec-4"), category: "realism" }
    ]
  },
  {
    id: "mammon",
    name: "Mammon",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("mammon"),
    specialty: "Blackwork",
    bio: "Mammon is highly requested for bold, graphic illustrations and solid blackout shapes, embodying dark medieval themes and modern geometries.",
    instagram: "mammon_ink",
    nextAvailable: "In 6 Days",
    portfolio: [
      { id: "mam-1", title: "Symmetrical Tribal Armor", description: "Solid black configurations decorating structural chest lines.", imageUrl: getTattooImage("mammon", "mam-1"), category: "custom" },
      { id: "mam-2", title: "Detailed Medieval Flail", description: "Heavy dark iron ball and chain spikes in illustrative blackwork.", imageUrl: getTattooImage("mammon", "mam-2"), category: "custom" },
      { id: "mam-3", title: "Solid Black Arrow Grid", description: "Brutalist block vectors covering the elbow with exact borders.", imageUrl: getTattooImage("mammon", "mam-3"), category: "custom" },
      { id: "mam-4", title: "Graphic Gothic Rose", description: "Heavy high contrast black petals outlined with thick sharp strokes.", imageUrl: getTattooImage("mammon", "mam-4"), category: "custom" }
    ]
  },
  {
    id: "anthony",
    name: "Anthony",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("anthony"),
    specialty: "Blackwork",
    bio: "Anthony crafts dark conceptual blueprints and heavy blackwork tattoos. Perfect for custom, bold decorative backpieces and sleeves.",
    instagram: "anthony_ink",
    nextAvailable: "In 5 Days",
    portfolio: [
      { id: "anth-1", title: "Brutalist Geometric Chevron", description: "Solid dark bands wrapping the lower leg with mechanical accuracy.", imageUrl: getTattooImage("anthony", "anth-1"), category: "custom" },
      { id: "anth-2", title: "Medieval Castle Gargoyle", description: "High contrast shadow study of a stone gargoyle on a tower.", imageUrl: getTattooImage("anthony", "anth-2"), category: "custom" },
      { id: "anth-3", title: "Bold Symmetrical Mandala", description: "Heavy blackwork geometry expanding from the elbow center.", imageUrl: getTattooImage("anthony", "anth-3"), category: "custom" },
      { id: "anth-4", title: "Heavy Solid Wrist Band", description: "Clean, consistent blackout bands framing the wrist with razor borders.", imageUrl: getTattooImage("anthony", "anth-4"), category: "custom" }
    ]
  },
  {
    id: "henko",
    name: "Henko",
    role: "Resident Master",
    avatarUrl: getAvatarImage("henko"),
    specialty: "Black & Gray Microrealism",
    bio: "Henko specializes in single-needle miniature details, transforming large realism concepts into small collections of high-definition wonders on skin.",
    instagram: "henko_micro",
    nextAvailable: "In 4 Days",
    portfolio: [
      { id: "henko-1", title: "Micro Saturn & Rocket", description: "Interstellar solar system in stippling detail under 2 inches.", imageUrl: getTattooImage("henko", "henko-1"), category: "realism" },
      { id: "henko-2", title: "Miniature Lion of Judah", description: "Hyper-detailed feline head smaller than a matchbook.", imageUrl: getTattooImage("henko", "henko-2"), category: "realism" },
      { id: "henko-3", title: "Micro Classical Pillar", description: "Corinthian architectural details shown in a miniature single needle stripe.", imageUrl: getTattooImage("henko", "henko-3"), category: "realism" },
      { id: "henko-4", title: "Petite Flying Dove Study", description: "Soft white shading representing flight and peace on the ribcage.", imageUrl: getTattooImage("henko", "henko-4"), category: "realism" }
    ]
  },
  {
    id: "alan",
    name: "Alan",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("alan"),
    specialty: "Blackwork",
    bio: "Alan is famous for custom ornamental framing, Norse mythological designs, and solid blackout sleeves utilizing heavy carbon shaders.",
    instagram: "alan_ink",
    nextAvailable: "In 3 Days",
    portfolio: [
      { id: "alan-1", title: "Norse Helm of Awe Chest", description: "Bold graphic Norse symbology with thick borders and dark fills.", imageUrl: getTattooImage("alan", "alan-1"), category: "custom" },
      { id: "alan-2", title: "Symmetrical Hand Mandala", description: "Intricate heavy patterns outlining hand lines.", imageUrl: getTattooImage("alan", "alan-2"), category: "custom" },
      { id: "alan-3", title: "Solid Flowing Neck Collar", description: "Elegant black bands flowing down the neck contour.", imageUrl: getTattooImage("alan", "alan-3"), category: "custom" },
      { id: "alan-4", title: "Brutalist Abstract Chevron", description: "Sharp graphic configuration wrapping the arm back.", imageUrl: getTattooImage("alan", "alan-4"), category: "custom" }
    ]
  },
  {
    id: "parse",
    name: "Parse",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("parse"),
    specialty: "Fineline-Conceptual",
    bio: "Parse mixes mathematical linear grids, delicate calligraphy, and modern abstract architecture in highly distinctive single-needle designs.",
    instagram: "parse_ink",
    nextAvailable: "In 1 Week",
    portfolio: [
      { id: "parse-1", title: "Linear Coordinate Blueprint", description: "Crisp geographic coordinates and abstract grids down the spine.", imageUrl: getTattooImage("parse", "parse-1"), category: "fineline" },
      { id: "parse-2", title: "Calligraphy Line Ribbon", description: "Fluid single needle cursive lettering wrapped gracefully around the forearm.", imageUrl: getTattooImage("parse", "parse-2"), category: "fineline" },
      { id: "parse-3", title: "Double Exposure Geometric Face", description: "Anatomical profiling merged with multiple thin parallel lines.", imageUrl: getTattooImage("parse", "parse-3"), category: "fineline" },
      { id: "parse-4", title: "Fine Line Lunar Phases", description: "The lunar cycle depicted in microscopic stippling details.", imageUrl: getTattooImage("parse", "parse-4"), category: "fineline" }
    ]
  },
  {
    id: "lola-bueno",
    name: "Lola Bueno",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("lola-bueno"),
    specialty: "Black & Gray Realism",
    bio: "Lola Bueno focuses on high-definition pet portraits, soft floral backpieces, and classical sculpture works crafted with diluted silver pigments.",
    instagram: "lola_bueno",
    nextAvailable: "In 4 Days",
    portfolio: [
      { id: "lola-1", title: "Gazing Golden Retriever", description: "Photorealistic dog portrait showing deep gloss in eyes and soft fur.", imageUrl: getTattooImage("lola-bueno", "lola-1"), category: "realism" },
      { id: "lola-2", title: "Renaissance Cherub", description: "Soft grey cupid floating in highly blended cloud transitions.", imageUrl: getTattooImage("lola-bueno", "lola-2"), category: "realism" },
      { id: "lola-3", title: "Cascading Peonies Backpiece", description: "Stunning realistic peonies falling gracefully down the shoulder blade.", imageUrl: getTattooImage("lola-bueno", "lola-3"), category: "realism" },
      { id: "lola-4", title: "Anatomical Realistic Eye", description: "Hyper-detailed tear duct and lashes reflecting a silhouette landscape.", imageUrl: getTattooImage("lola-bueno", "lola-4"), category: "realism" }
    ]
  },
  {
    id: "katya",
    name: "Katya",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("katya"),
    specialty: "Black & Gray Realism",
    bio: "Katya is highly skilled in blending dark, moody realism elements with sharp blackwork accents, creating beautiful mythological and contemporary combinations.",
    instagram: "katya_ink",
    nextAvailable: "In 5 Days",
    portfolio: [
      { id: "katya-1", title: "Gothic Gargoyle Shading", description: "Textured stone monster on heavy dark clouds backdrop.", imageUrl: getTattooImage("katya", "katya-1"), category: "realism" },
      { id: "katya-2", title: "Realistic Skull & Compass", description: "Unmatched carbon pigment styling showing razor sharp gear tooth details.", imageUrl: getTattooImage("katya", "katya-2"), category: "realism" },
      { id: "katya-3", title: "Solid Black Rose Outline", description: "High contrast graphic rose petals overlapping clean grey wash shading.", imageUrl: getTattooImage("katya", "katya-3"), category: "realism" },
      { id: "katya-4", title: "Delicate Shaded Serpent", description: "A beautifully winding snake displaying perfect metallic scales.", imageUrl: getTattooImage("katya", "katya-4"), category: "realism" }
    ]
  },
  {
    id: "abigail",
    name: "Abigail",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("abigail"),
    specialty: "Black & Gray Realism",
    bio: "Abigail specializes in soft grey wash portraiture and fine line conceptual layout configurations, capturing authentic expressions with extreme precision.",
    instagram: "abigail_art",
    nextAvailable: "In 3 Days",
    portfolio: [
      { id: "abi-1", title: "Weeping Venus De Milo", description: "Gorgeously soft shadows highlighting classical marble torso contours.", imageUrl: getTattooImage("abigail", "abi-1"), category: "realism" },
      { id: "abi-2", title: "Conceptual Line Frame Hands", description: "Drawn hands reaching with thin single lines connecting fingers.", imageUrl: getTattooImage("abigail", "abi-2"), category: "realism" },
      { id: "abi-3", title: "Delicate Sleeping Fox", description: "Soft realism fox curled in fine-line floral ferns.", imageUrl: getTattooImage("abigail", "abi-3"), category: "realism" },
      { id: "abi-4", title: "Timeless Hourglass Silhouette", description: "Symmetric timepiece with cosmic dust swirling inside.", imageUrl: getTattooImage("abigail", "abi-4"), category: "realism" }
    ]
  },
  {
    id: "jenni",
    name: "Jenni",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("jenni"),
    specialty: "Black & Gray Realism",
    bio: "Jenni produces masterwork black and grey sleeves and minimal conceptual line configurations, highly praised for soft transitions.",
    instagram: "jenni_tattoo",
    nextAvailable: "In 2 Days",
    portfolio: [
      { id: "jenni-1", title: "Ascending Valkyrie Shield", description: "Highly dramatic female warrior lifting a dynamic wooden circular shield.", imageUrl: getTattooImage("jenni", "jenni-1"), category: "realism" },
      { id: "jenni-2", title: "Fine Needle Solar Eclipse", description: "Stunning stippled sun flare around a perfectly black circular eclipse.", imageUrl: getTattooImage("jenni", "jenni-2"), category: "realism" },
      { id: "jenni-3", title: "Realistic Whispering Skull", description: "Surreal soft skull layout covered in butterflies with smooth wings.", imageUrl: getTattooImage("jenni", "jenni-3"), category: "realism" },
      { id: "jenni-4", title: "Sleek Coordinate Compass Grid", description: "Geometric lines crossing a photorealistic navigator emblem.", imageUrl: getTattooImage("jenni", "jenni-4"), category: "realism" }
    ]
  },
  {
    id: "yatzil",
    name: "Yatzil",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("yatzil"),
    specialty: "Black & Gray Microrealism",
    bio: "Yatzil specializes in micro-portraits and delicate scientific diagrams, blending single-needle fine lines with incredible contrast.",
    instagram: "yatzil_ink",
    nextAvailable: "In 6 Days",
    portfolio: [
      { id: "yatz-1", title: "Micro Solar Constellations", description: "Extremely delicate orbits and coordinates under 2 inches.", imageUrl: getTattooImage("yatzil", "yatz-1"), category: "realism" },
      { id: "yatz-2", title: "Micro Sphinx Statue", description: "Hyper-detailed Egyptian monument with perfect weathered brick lines.", imageUrl: getTattooImage("yatzil", "yatz-2"), category: "realism" },
      { id: "yatz-3", title: "Petite Flying Hummingbird", description: "Gorgeous fine-line wing feathers shown in premium single needle wash.", imageUrl: getTattooImage("yatzil", "yatz-3"), category: "realism" },
      { id: "yatz-4", title: "Miniature Classical Archer", description: "Action portrait of Greek archer drawing a bow under 3 inches.", imageUrl: getTattooImage("yatzil", "yatz-4"), category: "realism" }
    ]
  },
  {
    id: "albert-quintero",
    name: "Albert Quintero",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("albert-quintero"),
    specialty: "Black & Gray Realism",
    bio: "Albert Quintero is highly popular for classical sculpture reproductions, mythological dark portraits, and custom biomechanical creations.",
    instagram: "albert_quintero",
    nextAvailable: "In 4 Days",
    portfolio: [
      { id: "albert-1", title: "Laocoön and His Sons Study", description: "Epic sculpture reproduction showing detailed marble musculature and snakes.", imageUrl: getTattooImage("albert-quintero", "albert-1"), category: "realism" },
      { id: "albert-2", title: "Gears & Tissue Biomech Upper Arm", description: "Serrated gears nestled inside highly shaded skin fibers.", imageUrl: getTattooImage("albert-quintero", "albert-2"), category: "realism" },
      { id: "albert-3", title: "Poseidon Waves Shoulder", description: "Epic marine landscape with foaming ocean swells and classical face.", imageUrl: getTattooImage("albert-quintero", "albert-3"), category: "realism" },
      { id: "albert-4", title: "Symmetrical Gothic Architecture", description: "Perfect columns and windows wrapping the back neck perfectly.", imageUrl: getTattooImage("albert-quintero", "albert-4"), category: "realism" }
    ]
  },
  {
    id: "titos",
    name: "Titos",
    role: "Resident Artist",
    avatarUrl: getAvatarImage("titos"),
    specialty: "Black & Gray Realism",
    bio: "Titos crafts outstanding black and grey realistic tattoos, capturing intricate animal portraits and classic historical relics.",
    instagram: "titos_realism",
    nextAvailable: "In 1 Week",
    portfolio: [
      { id: "titos-1", title: "Epic Lone Wolf Headpiece", description: "Intense front-facing wolf portrait showing highly detailed wet fur.", imageUrl: getTattooImage("titos", "titos-1"), category: "realism" },
      { id: "titos-2", title: "Weathered Gladiator Shield Ring", description: "Classic iron shields overlapping the forearm with micro scratches.", imageUrl: getTattooImage("titos", "titos-2"), category: "realism" },
      { id: "titos-3", title: "Renaissance Guardian Angel", description: "Weoping sculpture angel wrapped in thick atmospheric clouds.", imageUrl: getTattooImage("titos", "titos-3"), category: "realism" },
      { id: "titos-4", title: "Symmetrical Rose Shading", description: "Perfect, velvety rose capturing glowing margins against deep black shadows.", imageUrl: getTattooImage("titos", "titos-4"), category: "realism" }
    ]
  }
];
