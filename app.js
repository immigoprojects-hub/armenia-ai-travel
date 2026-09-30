const armeniaEntities = [
  {
    id: "cascade-complex",
    name: "Cascade Complex",
    category: "attractions",
    cityRegion: "Yerevan",
    shortDescription: "Open-air stairway, modern art, city views, and cafes near the Cafesjian Center.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Yerevan_Cascade_2019.jpg/900px-Yerevan_Cascade_2019.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1911, lng: 44.5151 },
    estimatedPrice: "Free",
    fromPrice: null,
    externalUrl: "https://www.cmf.am/",
    sponsored: false,
    dealPrice: null,
    tags: ["culture", "view", "yerevan", "walkable"]
  },
  {
    id: "republic-square",
    name: "Republic Square",
    category: "attractions",
    cityRegion: "Yerevan",
    shortDescription: "Central square with pink tuff architecture, museums, fountains, and evening walks.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Republic_Square%2C_Yerevan.jpg/900px-Republic_Square%2C_Yerevan.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1776, lng: 44.5126 },
    estimatedPrice: "Free",
    fromPrice: null,
    externalUrl: "https://www.visityerevan.am/places/details/35/en/",
    sponsored: false,
    dealPrice: null,
    tags: ["culture", "yerevan", "night", "classic"]
  },
  {
    id: "matenadaran",
    name: "Matenadaran",
    category: "attractions",
    cityRegion: "Yerevan",
    shortDescription: "Museum and research institute of ancient manuscripts, one of Yerevan's signature cultural stops.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Matenadaran_Yerevan.jpg/900px-Matenadaran_Yerevan.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.192, lng: 44.5206 },
    estimatedPrice: "Paid entry",
    fromPrice: null,
    externalUrl: "https://matenadaran.am/en/",
    sponsored: false,
    dealPrice: null,
    tags: ["museum", "culture", "history", "rainy-day"]
  },
  {
    id: "garni-temple",
    name: "Garni Temple",
    category: "attractions",
    cityRegion: "Kotayk",
    shortDescription: "Armenia's iconic pagan-era temple, usually paired with Geghard and Symphony of Stones.",
    image: "./assets/garni-temple-hero.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1124, lng: 44.7306 },
    estimatedPrice: "Paid entry",
    fromPrice: null,
    externalUrl: "https://www.armenia.travel/destinations/garni-temple/",
    sponsored: false,
    dealPrice: null,
    tags: ["day-trip", "culture", "nature", "classic"]
  },
  {
    id: "geghard-monastery",
    name: "Geghard Monastery",
    category: "attractions",
    cityRegion: "Kotayk",
    shortDescription: "UNESCO-listed monastery partly carved into the rock, set inside a dramatic gorge.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Geghard_Monastery_Armenia.jpg/900px-Geghard_Monastery_Armenia.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1405, lng: 44.8186 },
    estimatedPrice: "Free",
    fromPrice: null,
    externalUrl: "https://whc.unesco.org/en/list/960/",
    sponsored: false,
    dealPrice: null,
    tags: ["day-trip", "unesco", "culture", "classic"]
  },
  {
    id: "khor-virap",
    name: "Khor Virap Monastery",
    category: "attractions",
    cityRegion: "Ararat",
    shortDescription: "Famous monastery near the Turkish border with classic Mount Ararat views.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Khor_Virap_monastery_with_Mount_Ararat.jpg/900px-Khor_Virap_monastery_with_Mount_Ararat.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 39.8786, lng: 44.5761 },
    estimatedPrice: "Free",
    fromPrice: null,
    externalUrl: "https://www.armenia.travel/destinations/khor-virap/",
    sponsored: false,
    dealPrice: null,
    tags: ["day-trip", "ararat-view", "culture", "classic"]
  },
  {
    id: "noravank",
    name: "Noravank Monastery",
    category: "attractions",
    cityRegion: "Vayots Dzor",
    shortDescription: "Red-rock canyon monastery, often combined with Areni wineries and Khor Virap.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Noravank_Monastery_2014.jpg/900px-Noravank_Monastery_2014.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 39.6847, lng: 45.2336 },
    estimatedPrice: "Free",
    fromPrice: null,
    externalUrl: "https://www.armenia.travel/destinations/noravank/",
    sponsored: false,
    dealPrice: null,
    tags: ["day-trip", "culture", "nature", "wine-route"]
  },
  {
    id: "sevanavank-lake-sevan",
    name: "Lake Sevan + Sevanavank",
    category: "attractions",
    cityRegion: "Gegharkunik",
    shortDescription: "High-altitude lake views with Sevanavank monastery and fish restaurants nearby.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Lake_Sevan_with_Sevanavank.jpg/900px-Lake_Sevan_with_Sevanavank.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.5649, lng: 45.0104 },
    estimatedPrice: "Free",
    fromPrice: null,
    externalUrl: "https://www.armenia.travel/destinations/lake-sevan/",
    sponsored: false,
    dealPrice: null,
    tags: ["nature", "day-trip", "family", "lake"]
  },
  {
    id: "dilijan-national-park",
    name: "Dilijan National Park",
    category: "attractions",
    cityRegion: "Tavush",
    shortDescription: "Forest trails, monasteries, fresh air, and one of Armenia's best soft-nature escapes.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Dilijan_National_Park.jpg/900px-Dilijan_National_Park.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.7406, lng: 44.8636 },
    estimatedPrice: "Free/Paid activities",
    fromPrice: null,
    externalUrl: "https://www.armenia.travel/destinations/dilijan-national-park/",
    sponsored: false,
    dealPrice: null,
    tags: ["nature", "hiking", "family", "overnight"]
  },
  {
    id: "tatev-monastery",
    name: "Tatev Monastery",
    category: "attractions",
    cityRegion: "Syunik",
    shortDescription: "Major southern Armenia monastery reached by mountain road or the Wings of Tatev cableway.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tatev_Monastery_from_a_distance.jpg/900px-Tatev_Monastery_from_a_distance.jpg",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 39.3793, lng: 46.2506 },
    estimatedPrice: "Free monastery; cableway paid",
    fromPrice: null,
    externalUrl: "https://www.tatever.am/en",
    sponsored: false,
    dealPrice: null,
    tags: ["culture", "nature", "overnight", "long-drive"]
  },
  {
    id: "lavash-restaurant",
    name: "Lavash Restaurant",
    category: "restaurants-cafes",
    cityRegion: "Yerevan",
    shortDescription: "Well-known Armenian restaurant popular with visitors for classic dishes and lavash theatre.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1817, lng: 44.5158 },
    estimatedPrice: "$$",
    fromPrice: null,
    externalUrl: "https://www.lavash.restaurant/",
    sponsored: false,
    dealPrice: null,
    tags: ["food", "armenian", "yerevan", "classic"]
  },
  {
    id: "sherep-restaurant",
    name: "Sherep Restaurant",
    category: "restaurants-cafes",
    cityRegion: "Yerevan",
    shortDescription: "Central Armenian restaurant near Republic Square with an open kitchen and tourist-friendly menu.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1781, lng: 44.5108 },
    estimatedPrice: "$$",
    fromPrice: null,
    externalUrl: "https://www.sherep.restaurant/",
    sponsored: false,
    dealPrice: null,
    tags: ["food", "armenian", "yerevan", "central"]
  },
  {
    id: "dolmama",
    name: "Dolmama",
    category: "restaurants-cafes",
    cityRegion: "Yerevan",
    shortDescription: "Long-running restaurant known for refined Armenian cuisine and its signature dolma.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1813, lng: 44.515 },
    estimatedPrice: "$$$",
    fromPrice: null,
    externalUrl: "https://www.dolmama.am/",
    sponsored: false,
    dealPrice: null,
    tags: ["food", "armenian", "fine-dining", "yerevan"]
  },
  {
    id: "tavern-yerevan",
    name: "Tavern Yerevan",
    category: "restaurants-cafes",
    cityRegion: "Yerevan",
    shortDescription: "Traditional Armenian restaurant brand with multiple central locations and a broad local menu.",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1785, lng: 44.5106 },
    estimatedPrice: "$$",
    fromPrice: null,
    externalUrl: "https://www.tavernyerevan.am/",
    sponsored: false,
    dealPrice: null,
    tags: ["food", "armenian", "groups", "yerevan"]
  },
  {
    id: "in-vino",
    name: "In Vino",
    category: "restaurants-cafes",
    cityRegion: "Yerevan",
    shortDescription: "Compact Saryan Street wine bar focused on Armenian and international bottles.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1861, lng: 44.5093 },
    estimatedPrice: "$$",
    fromPrice: null,
    externalUrl: "https://www.facebook.com/invinowinebar/",
    sponsored: false,
    dealPrice: null,
    tags: ["wine", "nightlife", "yerevan", "bar"]
  },
  {
    id: "mirzoyan-library",
    name: "Mirzoyan Library",
    category: "restaurants-cafes",
    cityRegion: "Yerevan",
    shortDescription: "Cafe, photo library, and courtyard space with a creative local atmosphere.",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1784, lng: 44.5161 },
    estimatedPrice: "$$",
    fromPrice: null,
    externalUrl: "https://www.facebook.com/mirzoyanlibrary/",
    sponsored: false,
    dealPrice: null,
    tags: ["cafe", "creative", "yerevan", "rainy-day"]
  },
  {
    id: "gouroo-club-garden",
    name: "Gouroo Club & Garden",
    category: "restaurants-cafes",
    cityRegion: "Yerevan",
    shortDescription: "Popular cafe-restaurant with brunch, garden seating, and international dishes.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.187, lng: 44.516 },
    estimatedPrice: "$$",
    fromPrice: null,
    externalUrl: "https://www.instagram.com/gourooclub/",
    sponsored: false,
    dealPrice: null,
    tags: ["cafe", "brunch", "yerevan", "food"]
  },
  {
    id: "crumbs-bread-factory",
    name: "Crumbs Bread Factory",
    category: "restaurants-cafes",
    cityRegion: "Yerevan",
    shortDescription: "Bakery-cafe known for breakfast, bread, pastries, coffee, and easy traveler comfort food.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1842, lng: 44.5162 },
    estimatedPrice: "$$",
    fromPrice: null,
    externalUrl: "https://www.instagram.com/crumbs_am/",
    sponsored: false,
    dealPrice: null,
    tags: ["cafe", "breakfast", "bakery", "yerevan"]
  },
  {
    id: "the-alexander-yerevan",
    name: "The Alexander, a Luxury Collection Hotel",
    category: "hotels",
    cityRegion: "Yerevan",
    shortDescription: "Luxury hotel in central Yerevan near Republic Square, Northern Avenue, and key city walks.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1803, lng: 44.5131 },
    estimatedPrice: "$$$$",
    fromPrice: null,
    externalUrl: "https://www.marriott.com/en-us/hotels/evnlc-the-alexander-a-luxury-collection-hotel-yerevan/overview/",
    sponsored: false,
    dealPrice: null,
    tags: ["hotel", "luxury", "central", "yerevan"]
  },
  {
    id: "tufenkian-historic-yerevan",
    name: "Tufenkian Historic Yerevan Hotel",
    category: "hotels",
    cityRegion: "Yerevan",
    shortDescription: "Boutique-style central hotel close to Vernissage and Republic Square.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1769, lng: 44.5178 },
    estimatedPrice: "$$$",
    fromPrice: null,
    externalUrl: "https://tufenkianheritage.com/en/accommodation/yerevan",
    sponsored: false,
    dealPrice: null,
    tags: ["hotel", "boutique", "central", "yerevan"]
  },
  {
    id: "republica-hotel-yerevan",
    name: "Republica Hotel Yerevan",
    category: "hotels",
    cityRegion: "Yerevan",
    shortDescription: "Modern central hotel near Republic Square with easy access to restaurants and museums.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1783, lng: 44.5087 },
    estimatedPrice: "$$$",
    fromPrice: null,
    externalUrl: "https://republicahotel.am/",
    sponsored: false,
    dealPrice: null,
    tags: ["hotel", "central", "yerevan", "modern"]
  },
  {
    id: "armenia-marriott-yerevan",
    name: "Armenia Marriott Hotel Yerevan",
    category: "hotels",
    cityRegion: "Yerevan",
    shortDescription: "Landmark hotel directly on Republic Square, useful for first-time city orientation.",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1777, lng: 44.511 },
    estimatedPrice: "$$$",
    fromPrice: null,
    externalUrl: "https://www.marriott.com/en-us/hotels/evnmc-armenia-marriott-hotel-yerevan/overview/",
    sponsored: false,
    dealPrice: null,
    tags: ["hotel", "central", "republic-square", "yerevan"]
  },
  {
    id: "tufenkian-old-dilijan",
    name: "Tufenkian Old Dilijan Complex",
    category: "hotels",
    cityRegion: "Dilijan, Tavush",
    shortDescription: "Heritage-style Dilijan stay option for travelers extending Sevan/Dilijan into an overnight.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.7419, lng: 44.8649 },
    estimatedPrice: "$$-$$$",
    fromPrice: null,
    externalUrl: "https://tufenkianheritage.com/en/accommodation/dilijan",
    sponsored: false,
    dealPrice: null,
    tags: ["hotel", "dilijan", "overnight", "heritage"]
  },
  {
    id: "hyur-service",
    name: "Hyur Service",
    category: "tours",
    cityRegion: "Yerevan / Armenia-wide",
    shortDescription: "Major Armenia tour operator offering group/private tours, transfers, packages, and accommodation services.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
    rating: 5.0,
    reviewCount: 16267,
    coordinates: { lat: 40.181, lng: 44.5146 },
    estimatedPrice: "Varies",
    fromPrice: null,
    externalUrl: "https://hyurservice.com/en",
    sponsored: false,
    dealPrice: null,
    tags: ["tour", "day-trip", "transfer", "armenia-wide"]
  },
  {
    id: "yerani-travel",
    name: "Yerani Travel",
    category: "tours",
    cityRegion: "Yerevan / Armenia-wide",
    shortDescription: "Armenia tour operator known for group and private tours with multilingual guide options.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviewCount: 3226,
    coordinates: { lat: 40.1796, lng: 44.5129 },
    estimatedPrice: "Varies",
    fromPrice: null,
    externalUrl: "https://www.yeranitravel.com/",
    sponsored: false,
    dealPrice: null,
    tags: ["tour", "day-trip", "private-tour", "armenia-wide"]
  },
  {
    id: "one-way-tour",
    name: "One Way Tour",
    category: "tours",
    cityRegion: "Yerevan / Armenia-wide",
    shortDescription: "Local tour operator with Armenia and regional tours, day trips, hiking, and private tour options.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviewCount: 3987,
    coordinates: { lat: 40.1818, lng: 44.5125 },
    estimatedPrice: "Varies",
    fromPrice: null,
    externalUrl: "https://onewaytour.com/",
    sponsored: false,
    dealPrice: null,
    tags: ["tour", "day-trip", "hiking", "armenia-wide"]
  },
  {
    id: "hertz-armenia",
    name: "Hertz Armenia",
    category: "car-rentals",
    cityRegion: "Yerevan / Zvartnots Airport",
    shortDescription: "International car rental brand with Armenia locations, useful for independent countryside trips.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1473, lng: 44.3959 },
    estimatedPrice: "Varies",
    fromPrice: null,
    externalUrl: "https://www.hertz.com/rentacar/location/armenia",
    sponsored: false,
    dealPrice: null,
    tags: ["car-rental", "airport", "self-drive", "transport"]
  },
  {
    id: "sixt-armenia",
    name: "SIXT Armenia",
    category: "car-rentals",
    cityRegion: "Yerevan / Zvartnots Airport",
    shortDescription: "International rental car provider with Armenia service for city and countryside self-drive plans.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1473, lng: 44.3959 },
    estimatedPrice: "Varies",
    fromPrice: null,
    externalUrl: "https://www.sixt.com/car-rental/armenia/",
    sponsored: false,
    dealPrice: null,
    tags: ["car-rental", "airport", "self-drive", "transport"]
  },
  {
    id: "airalo-armenia-esim",
    name: "Airalo Armenia eSIM",
    category: "esim",
    cityRegion: "Armenia",
    shortDescription: "Travel eSIM marketplace with Armenia data plans for tourists who want connectivity on arrival.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1772, lng: 44.5035 },
    estimatedPrice: "From plan price",
    fromPrice: null,
    externalUrl: "https://www.airalo.com/armenia-esim",
    sponsored: false,
    dealPrice: "Demo deal only - not a real partner discount",
    tags: ["esim", "travel-essential", "connectivity", "demo-deal"]
  },
  {
    id: "nomad-armenia-esim",
    name: "Nomad Armenia eSIM",
    category: "esim",
    cityRegion: "Armenia",
    shortDescription: "Travel eSIM provider with Armenia coverage and app-based setup before arrival.",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80",
    rating: null,
    reviewCount: null,
    coordinates: { lat: 40.1772, lng: 44.5035 },
    estimatedPrice: "From plan price",
    fromPrice: null,
    externalUrl: "https://www.getnomad.app/armenia-eSIM",
    sponsored: false,
    dealPrice: "Demo deal only - not a real partner discount",
    tags: ["esim", "travel-essential", "connectivity", "demo-deal"]
  }
];

const categoryLabels = {
  attractions: "Attraction",
  "restaurants-cafes": "Restaurant/Cafe",
  hotels: "Hotel",
  tours: "Tour",
  "car-rentals": "Car rental",
  esim: "eSIM"
};

const categoryCounts = armeniaEntities.reduce((counts, entity) => {
  counts[entity.category] = (counts[entity.category] || 0) + 1;
  return counts;
}, {});

const tripClusters = [
  {
    id: "yerevan-arrival",
    title: "Yerevan first day",
    region: "Yerevan",
    driveLevel: "none",
    interests: ["history", "food", "nightlife"],
    baseStops: ["republic-square", "cascade-complex", "matenadaran"],
    restaurants: ["lavash-restaurant", "sherep-restaurant", "mirzoyan-library", "in-vino"],
    transport: { car: [], noCar: [] },
    note: "Walkable city day with museums, viewpoints, and a central restaurant."
  },
  {
    id: "yerevan-food",
    title: "Yerevan food and cafes",
    region: "Yerevan",
    driveLevel: "none",
    interests: ["food", "wine", "nightlife"],
    baseStops: ["cascade-complex", "republic-square"],
    restaurants: ["crumbs-bread-factory", "gouroo-club-garden", "dolmama", "in-vino"],
    transport: { car: [], noCar: [] },
    note: "A lighter city day for cafes, Armenian food, and evening wine."
  },
  {
    id: "garni-geghard",
    title: "Garni and Geghard",
    region: "Kotayk",
    driveLevel: "short",
    interests: ["history", "nature"],
    baseStops: ["garni-temple", "geghard-monastery"],
    restaurants: ["tavern-yerevan", "sherep-restaurant"],
    transport: { car: ["hertz-armenia"], noCar: ["hyur-service"] },
    note: "Short countryside route. Garni and Geghard belong together and should not be mixed with Sevan or Tatev in the same day."
  },
  {
    id: "sevan-dilijan",
    title: "Lake Sevan and Dilijan",
    region: "Gegharkunik + Tavush",
    driveLevel: "medium",
    interests: ["nature", "hiking", "family"],
    baseStops: ["sevanavank-lake-sevan", "dilijan-national-park"],
    restaurants: ["tufenkian-old-dilijan"],
    transport: { car: ["sixt-armenia"], noCar: ["yerani-travel"] },
    note: "Northbound day with lake and forest. Best as a full day; Dilijan can become an overnight."
  },
  {
    id: "ararat-vayots-dzor",
    title: "Khor Virap and Noravank",
    region: "Ararat + Vayots Dzor",
    driveLevel: "medium",
    interests: ["history", "wine", "nature"],
    baseStops: ["khor-virap", "noravank"],
    restaurants: ["in-vino"],
    transport: { car: ["hertz-armenia"], noCar: ["one-way-tour"] },
    note: "Southbound route for Ararat views, monastery scenery, and the wine-region corridor."
  },
  {
    id: "tatev-syunik",
    title: "Tatev long-drive option",
    region: "Syunik",
    driveLevel: "long",
    interests: ["history", "nature", "hiking"],
    baseStops: ["tatev-monastery"],
    restaurants: [],
    transport: { car: ["sixt-armenia"], noCar: ["hyur-service"] },
    note: "Long-distance route. Only recommended in longer or intensive trips; better as an overnight than a casual day trip."
  },
  {
    id: "practical-setup",
    title: "Arrival setup and logistics",
    region: "Armenia",
    driveLevel: "none",
    interests: ["food"],
    baseStops: ["republica-hotel-yerevan", "airalo-armenia-esim"],
    restaurants: ["lavash-restaurant"],
    transport: { car: ["hertz-armenia"], noCar: ["nomad-armenia-esim"] },
    note: "Useful setup day with hotel base, connectivity, and optional rental-car planning."
  }
];

const interestToTags = {
  food: ["food", "cafe", "breakfast", "armenian", "brunch"],
  nature: ["nature", "lake", "view", "family"],
  history: ["history", "culture", "unesco", "classic", "museum"],
  wine: ["wine", "wine-route", "bar"],
  hiking: ["hiking", "nature", "long-drive"],
  nightlife: ["nightlife", "bar", "night"]
};

const groupSize = {
  solo: 1,
  couple: 2,
  friends: 3,
  family: 4
};

const state = {
  filter: "all",
  saved: JSON.parse(localStorage.getItem("armeniaMvpSaved") || "[]").map((item) => item.id || item),
  plan: [],
  generatedEntityIds: [],
  lastInputs: null,
  googlePlaces: {},
  googleReport: [],
  tripFlow: {
    step: 0,
    style: "classic",
    startDate: "",
    days: 3,
    anchors: ["garni-temple", "geghard-monastery"],
    budget: "mid",
    group: "couple",
    transport: "no-car",
    pace: "balanced",
    mode: "daily"
  }
};

const screens = document.querySelectorAll(".screen");
const navItems = document.querySelectorAll(".nav-item");
const screenTitle = document.querySelector("#screenTitle");
const placeList = document.querySelector("#placeList");
const placeCount = document.querySelector("#placeCount");
const planList = document.querySelector("#planList");
const savedList = document.querySelector("#savedList");
const savedCount = document.querySelector("#savedCount");
const emptyTrip = document.querySelector("#emptyTrip");
const dealList = document.querySelector("#dealList");
const tripOverview = document.querySelector("#tripOverview");
const myTripOverview = document.querySelector("#myTripOverview");
const mapArt = document.querySelector("#mapArt");
const mapDetail = document.querySelector("#mapDetail");
const toast = document.querySelector("#toast");
const conciergeDialog = document.querySelector("#conciergeDialog");
const entityDialog = document.querySelector("#entityDialog");
const entityDetail = document.querySelector("#entityDetail");
const chatLog = document.querySelector("#chatLog");
const todayDayNumber = document.querySelector("#todayDayNumber");
const todayTotalDays = document.querySelector("#todayTotalDays");
const todayHeroImage = document.querySelector("#todayHeroImage");
const todayNextStop = document.querySelector("#todayNextStop");
const todayTravelTime = document.querySelector("#todayTravelTime");
const todayNextDetails = document.querySelector("#todayNextDetails");
const todayDateTitle = document.querySelector("#todayDateTitle");
const todayTimeline = document.querySelector("#todayTimeline");
const todayRoutePreview = document.querySelector("#todayRoutePreview");
const todayFoodCard = document.querySelector("#todayFoodCard");
const todayDealCard = document.querySelector("#todayDealCard");
const tripFlow = document.querySelector("#tripFlow");
const flowBack = document.querySelector("#flowBack");
const flowProgress = document.querySelector("#flowProgress");
const flowStepCount = document.querySelector("#flowStepCount");

const imagePalettes = {
  attractions: ["#401f25", "#8c3141", "#d99a52", "#f6e0b5"],
  "restaurants-cafes": ["#2b211a", "#7b3f2f", "#c77a42", "#f4d7ad"],
  hotels: ["#172836", "#2e6275", "#86aeb5", "#e0f0ec"],
  tours: ["#17291f", "#24553f", "#7c9e62", "#e0e7c6"],
  "car-rentals": ["#1b2228", "#465461", "#a6a091", "#efe4cf"],
  esim: ["#20203a", "#4c4a80", "#90a5e6", "#e0e7ff"]
};

function hashString(value) {
  return [...String(value)].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function sceneKind(entity) {
  if (entity.id?.includes("sevan")) return "lake";
  if (entity.id?.includes("dilijan")) return "forest";
  if (entity.id?.includes("tatev")) return "cliff";
  if (entity.id?.includes("garni")) return "temple";
  if (entity.id?.includes("geghard") || entity.id?.includes("noravank") || entity.id?.includes("khor")) return "monastery";
  if (entity.category === "restaurants-cafes") return entity.tags.includes("wine") ? "wine" : "restaurant";
  if (entity.category === "hotels") return "hotel";
  if (entity.category === "tours") return "tour";
  if (entity.category === "car-rentals") return "car";
  if (entity.category === "esim") return "phone";
  return "city";
}

function svgDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function localTravelImage(entity, variant = "card") {
  const [ink, dark, mid, light] = imagePalettes[entity.category] || imagePalettes.attractions;
  const isHero = variant === "hero";
  const width = isHero ? 1200 : 900;
  const height = isHero ? 650 : 560;
  const hash = Math.abs(hashString(entity.id || entity.name || "armenia"));
  const sunX = width * (0.62 + (hash % 22) / 100);
  const sunY = height * (0.12 + (hash % 13) / 100);
  const scene = isHero ? "hero" : sceneKind(entity);
  const templeX = width * (0.42 + (hash % 16) / 100);
  const svgScene = {
    hero: `
      <path d="M0 ${height * 0.5} C ${width * 0.22} ${height * 0.34}, ${width * 0.32} ${height * 0.42}, ${width * 0.48} ${height * 0.22} C ${width * 0.65} ${height * 0.45}, ${width * 0.78} ${height * 0.31}, ${width} ${height * 0.48} L ${width} ${height} L 0 ${height} Z" fill="#f8ead2" opacity=".82"/>
      <g fill="#fff7e9" opacity=".78"><rect x="${width * 0.08}" y="${height * 0.58}" width="96" height="150" rx="14"/><rect x="${width * 0.19}" y="${height * 0.53}" width="74" height="184" rx="14"/><rect x="${width * 0.3}" y="${height * 0.62}" width="132" height="120" rx="14"/></g>
      <path d="M0 ${height * 0.76} C ${width * 0.2} ${height * 0.7}, ${width * 0.34} ${height * 0.82}, ${width * 0.54} ${height * 0.74} C ${width * 0.72} ${height * 0.66}, ${width * 0.84} ${height * 0.78}, ${width} ${height * 0.7} L ${width} ${height} L 0 ${height} Z" fill="${ink}" opacity=".44"/>`,
    city: `
      <g fill="#fff3df" opacity=".8"><rect x="${width * 0.12}" y="${height * 0.52}" width="92" height="170" rx="10"/><rect x="${width * 0.25}" y="${height * 0.46}" width="72" height="212" rx="10"/><rect x="${width * 0.36}" y="${height * 0.56}" width="146" height="135" rx="10"/><rect x="${width * 0.57}" y="${height * 0.5}" width="82" height="175" rx="10"/></g>
      <path d="M0 ${height * 0.78} L ${width} ${height * 0.68} L ${width} ${height} L 0 ${height} Z" fill="${ink}" opacity=".4"/>`,
    temple: `
      <path d="M${templeX - 145} ${height * 0.68} L${templeX} ${height * 0.42} L${templeX + 145} ${height * 0.68} Z" fill="#fff3df" opacity=".82"/>
      <g fill="${ink}" opacity=".52">${[0,1,2,3,4].map(i => `<rect x="${templeX - 105 + i * 52}" y="${height * 0.66}" width="20" height="116" rx="4"/>`).join("")}</g>
      <rect x="${templeX - 134}" y="${height * 0.76}" width="268" height="24" rx="8" fill="#fff3df" opacity=".8"/>`,
    monastery: `
      <path d="M0 ${height * 0.65} C ${width * 0.25} ${height * 0.48}, ${width * 0.38} ${height * 0.58}, ${width * 0.56} ${height * 0.38} C ${width * 0.72} ${height * 0.6}, ${width * 0.82} ${height * 0.5}, ${width} ${height * 0.62} L${width} ${height} L0 ${height}Z" fill="#fff0dc" opacity=".6"/>
      <g fill="${ink}" opacity=".58"><rect x="${width * 0.37}" y="${height * 0.58}" width="160" height="150" rx="14"/><path d="M${width * 0.37} ${height * 0.58} L${width * 0.45} ${height * 0.42} L${width * 0.55} ${height * 0.58}Z"/><rect x="${width * 0.47}" y="${height * 0.47}" width="36" height="92" rx="10"/></g>`,
    lake: `
      <path d="M0 ${height * 0.48} C ${width * 0.18} ${height * 0.36}, ${width * 0.28} ${height * 0.42}, ${width * 0.43} ${height * 0.32} C ${width * 0.6} ${height * 0.46}, ${width * 0.74} ${height * 0.36}, ${width} ${height * 0.5} L${width} ${height} L0 ${height}Z" fill="#fff5e0" opacity=".72"/>
      <path d="M0 ${height * 0.68} C ${width * 0.2} ${height * 0.62}, ${width * 0.34} ${height * 0.74}, ${width * 0.52} ${height * 0.66} C ${width * 0.68} ${height * 0.6}, ${width * 0.84} ${height * 0.72}, ${width} ${height * 0.64} L${width} ${height} L0 ${height}Z" fill="#e6fbff" opacity=".72"/>`,
    forest: `
      ${[0,1,2,3,4,5,6].map(i => `<path d="M${width*(0.12+i*.12)} ${height*.36} l${-48-i*3} ${height*.36} h${96+i*6}Z" fill="${i % 2 ? ink : dark}" opacity=".48"/>`).join("")}
      <path d="M0 ${height * 0.78} C ${width * 0.28} ${height * 0.7}, ${width * 0.5} ${height * 0.86}, ${width} ${height * 0.72} L${width} ${height} L0 ${height}Z" fill="${ink}" opacity=".42"/>`,
    cliff: `
      <path d="M0 ${height * 0.58} C ${width * 0.22} ${height * 0.5}, ${width * 0.32} ${height * 0.38}, ${width * 0.48} ${height * 0.5} C ${width * 0.64} ${height * 0.62}, ${width * 0.75} ${height * 0.44}, ${width} ${height * 0.56} L${width} ${height} L0 ${height}Z" fill="#f6e6cc" opacity=".7"/>
      <path d="M${width*.58} ${height*.56} l80 54 v112 h-166 v-112z" fill="${ink}" opacity=".58"/><rect x="${width*.62}" y="${height*.64}" width="26" height="72" rx="10" fill="#fff7e9" opacity=".42"/>`,
    restaurant: `
      <rect x="${width*.08}" y="${height*.36}" width="${width*.84}" height="${height*.48}" rx="34" fill="#fff2dd" opacity=".52"/>
      <circle cx="${width*.32}" cy="${height*.58}" r="82" fill="${ink}" opacity=".36"/><circle cx="${width*.32}" cy="${height*.58}" r="54" fill="#fffdf8" opacity=".58"/>
      <rect x="${width*.56}" y="${height*.5}" width="190" height="28" rx="14" fill="${ink}" opacity=".46"/><rect x="${width*.58}" y="${height*.58}" width="150" height="22" rx="11" fill="${ink}" opacity=".34"/>`,
    wine: `
      <path d="M${width*.38} ${height*.34} C ${width*.33} ${height*.48}, ${width*.36} ${height*.58}, ${width*.45} ${height*.62} v116 h-42 v28 h126 v-28 h-42 v-116 c${width*.09} -${height*.04}, ${width*.12} -${height*.14}, ${width*.07} -${height*.28}Z" fill="#fff5e7" opacity=".72"/>
      <rect x="${width*.58}" y="${height*.44}" width="58" height="230" rx="20" fill="${ink}" opacity=".5"/><rect x="${width*.59}" y="${height*.38}" width="36" height="72" rx="12" fill="${ink}" opacity=".5"/>`,
    hotel: `
      <rect x="${width*.18}" y="${height*.34}" width="${width*.64}" height="${height*.42}" rx="28" fill="#fff9eb" opacity=".58"/>
      ${[0,1,2].map(row => [0,1,2,3].map(col => `<rect x="${width*.25+col*95}" y="${height*.42+row*62}" width="44" height="34" rx="8" fill="${ink}" opacity=".34"/>`).join("")).join("")}
      <rect x="${width*.45}" y="${height*.62}" width="90" height="82" rx="18" fill="${ink}" opacity=".42"/>`,
    tour: `
      <path d="M${width*.22} ${height} C ${width*.38} ${height*.75}, ${width*.52} ${height*.62}, ${width*.78} ${height*.48}" fill="none" stroke="#fff8e9" stroke-width="78" stroke-linecap="round" opacity=".72"/>
      <path d="M${width*.28} ${height} C ${width*.42} ${height*.77}, ${width*.55} ${height*.64}, ${width*.8} ${height*.5}" fill="none" stroke="${ink}" stroke-width="7" stroke-dasharray="24 22" opacity=".42"/>
      <rect x="${width*.25}" y="${height*.47}" width="210" height="86" rx="24" fill="${ink}" opacity=".54"/><circle cx="${width*.31}" cy="${height*.64}" r="24" fill="#fff8e9" opacity=".72"/><circle cx="${width*.47}" cy="${height*.64}" r="24" fill="#fff8e9" opacity=".72"/>`,
    car: `
      <path d="M0 ${height*.72} C ${width*.22} ${height*.62}, ${width*.34} ${height*.78}, ${width*.55} ${height*.68} C ${width*.72} ${height*.6}, ${width*.82} ${height*.72}, ${width} ${height*.62} L${width} ${height} L0 ${height}Z" fill="#fff5e4" opacity=".5"/>
      <rect x="${width*.24}" y="${height*.48}" width="360" height="112" rx="34" fill="${ink}" opacity=".58"/><path d="M${width*.32} ${height*.48} l62 -70 h150 l72 70Z" fill="${ink}" opacity=".48"/><circle cx="${width*.34}" cy="${height*.64}" r="30" fill="#fff8e9" opacity=".7"/><circle cx="${width*.58}" cy="${height*.64}" r="30" fill="#fff8e9" opacity=".7"/>`,
    phone: `
      <rect x="${width*.36}" y="${height*.22}" width="250" height="390" rx="44" fill="#fff8ff" opacity=".68"/><rect x="${width*.4}" y="${height*.3}" width="178" height="250" rx="26" fill="${ink}" opacity=".35"/>
      <g fill="none" stroke="#fff8ff" stroke-width="10" opacity=".8"><path d="M${width*.18} ${height*.48} q${width*.16} -${height*.18} ${width*.32} 0"/><path d="M${width*.58} ${height*.48} q${width*.16} -${height*.18} ${width*.32} 0"/></g>`
  }[scene];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${light}"/>
          <stop offset="0.5" stop-color="${mid}"/>
          <stop offset="1" stop-color="${dark}"/>
        </linearGradient>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.08"/>
          <stop offset="0.58" stop-color="#17201d" stop-opacity="0.04"/>
          <stop offset="1" stop-color="#17201d" stop-opacity="0.38"/>
        </linearGradient>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .08"/></feComponentTransfer></filter>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#sky)"/>
      <circle cx="${sunX}" cy="${sunY}" r="${height * 0.11}" fill="#fff6d7" opacity="0.72"/>
      ${svgScene}
      <rect width="${width}" height="${height}" fill="url(#shade)"/>
      <rect width="${width}" height="${height}" filter="url(#grain)" opacity=".55"/>
    </svg>
  `;
  return svgDataUri(svg);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function googleFor(entity) {
  return state.googlePlaces[entity.id]?.google || null;
}

function entityCoordinates(entity) {
  return googleFor(entity)?.coordinates || entity.coordinates;
}

function entityImage(entity, variant = "card") {
  const google = googleFor(entity);
  return google?.photos?.[0]?.url || entity.image || localTravelImage(entity, variant);
}

function imageFallbackAttr(entity, variant = "card") {
  return `onerror="this.onerror=null;this.src='${localTravelImage(entity, variant)}'"`;
}

function entityGallery(entity) {
  const google = googleFor(entity);
  const photos = google?.photos?.length ? google.photos.map((photo) => photo.url) : [];
  return photos.length ? photos : [entity.image || localTravelImage(entity, "detail")];
}

function addressText(entity) {
  return googleFor(entity)?.formattedAddress || entity.cityRegion;
}

function openStatusText(entity) {
  const openNow = googleFor(entity)?.openNow;
  if (openNow === true) return "Open now";
  if (openNow === false) return "Closed now";
  return "Hours unavailable";
}

function googlePriceText(entity) {
  const priceLevel = googleFor(entity)?.priceLevel;
  if (!priceLevel) return priceText(entity);
  const level = String(priceLevel).replace("PRICE_LEVEL_", "").toLowerCase().replace(/_/g, " ");
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function mapsUrl(entity) {
  const google = googleFor(entity);
  if (google?.googleMapsUrl) return google.googleMapsUrl;
  const coordinates = entityCoordinates(entity);
  return coordinates ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}` : null;
}

function repaintAll() {
  renderToday();
  renderEntities();
  renderSaved();
  renderDeals();
  renderMapPins();
  if (state.plan.length) renderPlan();
}

function activeDayIndex() {
  if (!state.plan.length) return 0;
  return Math.min(1, state.plan.length - 1);
}

function routeTravelText(day) {
  if (!day) return "Walkable day";
  if (day.driveLevel === "long") return "4-5 hr drive";
  if (day.driveLevel === "medium") return "1.5-2 hr drive";
  if (day.driveLevel === "short") return "42 min drive";
  return "Walk/taxi";
}

function timelineIcon(entity) {
  if (!entity) return "•";
  if (entity.category === "restaurants-cafes") return "🍽";
  if (entity.category === "hotels") return "▣";
  if (entity.category === "tours") return "◎";
  if (entity.category === "car-rentals") return "▰";
  if (entity.category === "esim") return "◈";
  return "⛪";
}

function stopTime(index) {
  return ["08:30", "09:30", "12:00", "16:00", "19:00"][index] || "Later";
}

function routePreviewTemplate(day) {
  const stops = (day?.stops || []).map(getEntityById).filter(Boolean).slice(0, 4);
  return `
    <div class="mini-map">
      <div class="mini-route-line"></div>
      ${stops.map((entity, index) => `<button class="mini-pin detail-button p${index + 1}" type="button" data-id="${entity.id}" aria-label="Open ${entity.name}">${index + 1}</button>`).join("")}
      <span class="mini-city start">Yerevan</span>
      <span class="mini-city end">${day?.region || "Armenia"}</span>
    </div>
    <button class="round-arrow" type="button" data-screen-target="mapScreen" aria-label="Open map">›</button>
  `;
}

function compactTripCard(entity, eyebrow, cta = "Open") {
  if (!entity) return "";
  const isOffer = eyebrow.toLowerCase().includes("unlock");
  const priceLine = entity.dealPrice || entity.fromPrice || entity.estimatedPrice || "Demo lead - no live price";
  return `
    <article class="horizontal-offer ${isOffer ? "journey-unlock" : "journey-food"}">
      <button class="thumb-button detail-button" type="button" data-id="${entity.id}" aria-label="Open ${entity.name}">
        <img src="${entityImage(entity)}" alt="${escapeHtml(entity.name)}" ${imageFallbackAttr(entity)} />
      </button>
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h3>${entity.name}</h3>
        <p>${isOffer ? priceLine : `${ratingText(entity)} · ${addressText(entity)}`}</p>
      </div>
      <button class="round-arrow detail-button" type="button" data-id="${entity.id}" aria-label="${cta} ${entity.name}">›</button>
    </article>
  `;
}

function renderToday() {
  if (!todayTimeline || !state.plan.length) return;
  const dayIndex = activeDayIndex();
  const day = state.plan[dayIndex];
  const stops = day.stops.map(getEntityById).filter(Boolean);
  const nextStop = stops.find((entity) => entity.category === "attractions") || stops[0] || getEntityById("garni-temple");
  const food = stops.find((entity) => entity.category === "restaurants-cafes") || getEntityById("lavash-restaurant");
  const deal = dayContextDeals(day)[0] || getEntityById("tufenkian-old-dilijan") || getEntityById(day.transportNote.includes("car") ? "hertz-armenia" : "hyur-service");

  todayDayNumber.textContent = String(dayIndex + 1);
  todayTotalDays.textContent = String(Math.max(state.plan.length, 5));
  todayNextStop.textContent = (nextStop?.name || "Armenia").replace(" Temple", "");
  todayTravelTime.textContent = routeTravelText(day).replace(" drive", "");
  todayDateTitle.textContent = "Mountains. Monasteries. Living culture.";
  todayHeroImage.src = entityImage(nextStop || getEntityById("cascade-complex"));
  todayNextDetails.dataset.id = nextStop?.id || "cascade-complex";
  document.querySelectorAll("#homeAiActions button").forEach((button) => {
    button.dataset.day = String(dayIndex);
  });

  todayTimeline.innerHTML = stops.slice(0, 4).map((entity, index) => `
    <button class="timeline-row detail-button route-node-${index + 1}" type="button" data-id="${entity.id}">
      <span class="time">${index + 1}</span>
      <span class="timeline-dot"><img src="${entityImage(entity)}" alt="" ${imageFallbackAttr(entity)} />${index + 1}</span>
      <span class="timeline-copy">
        <strong>${entity.name}</strong>
        <small>${stopTime(index)}${index === 0 ? " · next stop" : ""}</small>
      </span>
    </button>
  `).join("");

  todayRoutePreview.innerHTML = routePreviewTemplate(day);
  todayFoodCard.innerHTML = compactTripCard(food, "Contextual lunch", "View food");
  todayDealCard.innerHTML = compactTripCard(deal, "Unlocked for your trip", "View offer");
}

async function loadGooglePlacesEnrichment() {
  try {
    const payload = {
      entities: armeniaEntities.map((entity) => ({
        id: entity.id,
        name: entity.name,
        category: entity.category,
        cityRegion: entity.cityRegion,
        coordinates: entity.coordinates
      }))
    };

    const response = await fetch("/api/places-enrichment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Google enrichment failed: ${response.status}`);
    const data = await response.json();
    state.googleReport = data.results || [];
    window.__armeniaGoogleReport = state.googleReport;

    if (data.status === "missing_api_key") {
      showToast("Google Places key not configured; using local travel data");
      return;
    }

    state.googlePlaces = state.googleReport.reduce((places, item) => {
      if (item.status === "matched" && item.google) places[item.id] = item;
      return places;
    }, {});

    repaintAll();
    const matched = Object.keys(state.googlePlaces).length;
    showToast(`Google Places enriched ${matched} of ${armeniaEntities.length} entities`);
  } catch (error) {
    console.warn(error);
    showToast("Google Places unavailable; using local travel data");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function persistSaved() {
  localStorage.setItem("armeniaMvpSaved", JSON.stringify(state.saved));
}

function getEntityById(id) {
  return armeniaEntities.find((entity) => entity.id === id);
}

function isSaved(id) {
  return state.saved.includes(id);
}

function ratingText(entity) {
  const google = googleFor(entity);
  const rating = typeof google?.rating === "number" ? google.rating : entity.rating;
  const reviewCount = typeof google?.reviewCount === "number" ? google.reviewCount : entity.reviewCount;
  if (!rating) return "Curated";
  return `${rating.toFixed(1)}${reviewCount ? ` · ${reviewCount.toLocaleString()} reviews` : ""}`;
}

function priceText(entity) {
  return entity.fromPrice ? `From ${entity.fromPrice}` : entity.estimatedPrice || "Price varies";
}

function labelText(value) {
  return String(value || "").replace(/-/g, " ");
}

const flowSteps = ["intro", "style", "length", "anchors", "budget", "transport", "pace", "ask", "generating", "review"];

const flowInterestMap = {
  classic: ["history", "nature", "food"],
  "food-wine": ["food", "wine", "nightlife"],
  nature: ["nature", "hiking", "food"],
  culture: ["history", "culture", "food"]
};

const anchorInterestMap = {
  "garni-temple": ["history", "nature"],
  "geghard-monastery": ["history", "nature"],
  "sevanavank-lake-sevan": ["nature", "family"],
  "dilijan-national-park": ["nature", "hiking"],
  "khor-virap": ["history", "nature"],
  noravank: ["history", "wine", "nature"],
  "tatev-monastery": ["history", "nature", "hiking"],
  "lavash-restaurant": ["food"]
};

function flowStepName() {
  return flowSteps[state.tripFlow.step] || flowSteps[0];
}

function showFlowStep(stepIndex) {
  if (!tripFlow) return;
  state.tripFlow.step = Math.max(0, Math.min(flowSteps.length - 1, stepIndex));
  const activeName = flowStepName();
  tripFlow.querySelectorAll(".flow-step").forEach((step) => {
    step.classList.toggle("active", step.dataset.flowStep === activeName);
  });
  flowBack.disabled = state.tripFlow.step === 0 || activeName === "generating";
  flowBack.classList.toggle("is-hidden", state.tripFlow.step === 0 || activeName === "generating");
  flowProgress.style.width = `${((state.tripFlow.step + 1) / flowSteps.length) * 100}%`;
  flowStepCount.textContent = `${state.tripFlow.step + 1}/${flowSteps.length}`;
  if (activeName === "review" && state.plan.length) renderPlan();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function flowInterests() {
  const interests = new Set(flowInterestMap[state.tripFlow.style] || flowInterestMap.classic);
  state.tripFlow.anchors.forEach((anchorId) => {
    (anchorInterestMap[anchorId] || []).forEach((interest) => interests.add(interest));
  });
  if (state.tripFlow.pace === "intensive") interests.add("hiking");
  return [...interests].filter((interest) => Object.prototype.hasOwnProperty.call(interestToTags, interest));
}

function syncFlowToPlannerInputs() {
  document.querySelector("#tripDays").value = String(state.tripFlow.days);
  document.querySelector("#tripBudget").value = state.tripFlow.budget;
  document.querySelector("#tripGroup").value = state.tripFlow.group;
  document.querySelector("#tripTransport").value = state.tripFlow.transport;
  document.querySelector("#tripPace").value = state.tripFlow.pace;
  const interests = new Set(flowInterests());
  document.querySelectorAll(".interest-picker input").forEach((input) => {
    input.checked = interests.has(input.value);
  });
}

function updateFlowVisualState(field) {
  tripFlow.querySelectorAll(`[data-flow-field="${field}"]`).forEach((button) => {
    button.classList.toggle("active", button.dataset.flowValue === state.tripFlow[field]);
  });
}

function updateFlowLengthCopy() {
  const note = document.querySelector("#flowLengthNote");
  if (!note) return;
  const copy = {
    1: "1 day stays focused and realistic around Yerevan or Garni.",
    2: "2 days gives you Yerevan plus one nearby countryside route.",
    3: "3 days gives you Yerevan plus one countryside route.",
    4: "4 days unlocks Sevan, Dilijan or a stronger food day.",
    5: "5 days can include a longer Armenia route without rushing.",
    6: "6 days gives room for north and south with recovery time.",
    7: "7 days supports the most complete Armenia loop."
  };
  note.textContent = copy[state.tripFlow.days] || copy[3];
}

function updateAnchorNodes() {
  tripFlow.querySelectorAll(".anchor-node").forEach((node) => {
    node.classList.toggle("selected", state.tripFlow.anchors.includes(node.dataset.anchorId));
  });
}

function buildTripFromFlow(mode = "daily") {
  state.tripFlow.mode = mode;
  syncFlowToPlannerInputs();
  showFlowStep(flowSteps.indexOf("generating"));
  window.setTimeout(() => {
    buildPlan(true);
    showFlowStep(flowSteps.indexOf("review"));
    showToast(mode === "flexible" ? "Flexible Armenia route created" : "Armenia days generated");
  }, 760);
}

function initTripFlow() {
  if (!tripFlow) return;
  updateFlowLengthCopy();
  updateAnchorNodes();
  ["style", "budget", "transport", "pace"].forEach(updateFlowVisualState);
  showFlowStep(0);
}

function currentInputs() {
  return state.lastInputs || getPlannerInputs();
}

function clusterById(id) {
  return tripClusters.find((cluster) => cluster.id === id);
}

function whyEntityFits(entity) {
  const inputs = currentInputs();
  const matchingInterests = inputs.interests.filter((interest) => {
    const desiredTags = interestToTags[interest] || [interest];
    return entity.tags.some((tag) => desiredTags.includes(tag));
  });
  const inTrip = state.generatedEntityIds.includes(entity.id);
  const reasons = [];

  if (inTrip) reasons.push("It is already part of your generated route.");
  if (matchingInterests.length) reasons.push(`It matches your ${matchingInterests.join(", ")} interest${matchingInterests.length > 1 ? "s" : ""}.`);
  if (entity.category === "restaurants-cafes") reasons.push("It gives the day a practical food or cafe stop.");
  if (entity.category === "tours" && inputs.transport === "no-car") reasons.push("It helps solve countryside transport without a rental car.");
  if (entity.category === "car-rentals" && inputs.transport === "car") reasons.push("It supports your own/rental car transport choice.");
  if (entity.category === "esim") reasons.push("It is a travel essential for maps, messaging, and bookings on arrival.");
  if (!reasons.length) reasons.push("It is a useful Armenia travel entity from the local seed dataset.");

  return reasons.join(" ");
}

function dayContextDeals(day) {
  return day.stops
    .map(getEntityById)
    .filter(Boolean)
    .filter((entity) => ["tours", "car-rentals", "esim"].includes(entity.category) || entity.dealPrice)
    .slice(0, 2);
}

function saveEntity(entity) {
  if (!entity) return;
  if (isSaved(entity.id)) {
    showToast(`${entity.name} is already in My Trip`);
    return;
  }
  state.saved.push(entity.id);
  persistSaved();
  renderSaved();
  showToast(`Saved ${entity.name}`);
}

function removeEntity(id) {
  state.saved = state.saved.filter((savedId) => savedId !== id);
  persistSaved();
  renderSaved();
  renderEntities();
  renderDeals();
  showToast("Removed from My Trip");
}

function entityCardTemplate(entity, mode = "place") {
  const saved = isSaved(entity.id);
  const dealCopy = entity.dealPrice ? `<span class="tag sponsored">${entity.dealPrice}</span>` : "";
  const demoLeadCopy = mode === "deal" && !entity.dealPrice ? `<span class="tag sponsored">Demo lead card - no discount</span>` : "";
  const isExplore = mode === "place";
  const isDeal = mode === "deal";
  return `
    <article class="place-card ${isExplore ? "discovery-card" : ""} ${isDeal ? "market-card" : ""}" data-entity-id="${entity.id}">
      <button class="image-button detail-button" type="button" data-id="${entity.id}" aria-label="Open ${entity.name} details">
        <img src="${entityImage(entity)}" alt="${escapeHtml(entity.name)}" />
        <span class="photo-badge">${categoryLabels[entity.category]}</span>
      </button>
      <div class="card-body">
        <button class="card-title detail-button" type="button" data-id="${entity.id}">${entity.name}</button>
        <div class="premium-meta">
          <span>★ ${ratingText(entity)}</span>
          <span>${addressText(entity)}</span>
          <span>${googlePriceText(entity)}</span>
          <span>${openStatusText(entity)}</span>
        </div>
        ${isExplore ? "" : `<p class="card-description">${entity.shortDescription}</p>`}
        ${isExplore ? "" : `<p class="fit-copy">${whyEntityFits(entity)}</p>`}
        <div class="tag-row">
          ${entity.sponsored ? `<span class="tag sponsored">Sponsored</span>` : ""}
          ${dealCopy}
          ${demoLeadCopy}
          ${entity.tags.slice(0, 3).map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="card-actions">
          ${mode === "saved"
            ? `<button class="secondary-button remove-button" type="button" data-id="${entity.id}">Remove</button>`
            : `<button class="primary-button save-button compact-action" type="button" data-id="${entity.id}">${saved ? "Added" : "Add to trip"}</button>`}
          <button class="secondary-button detail-button" type="button" data-id="${entity.id}">Details</button>
          ${mode === "deal" ? `<button class="secondary-button lead-button" type="button" data-id="${entity.id}">Request</button>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderEntities() {
  const filtered = armeniaEntities.filter((entity) => state.filter === "all" || entity.category === state.filter);
  placeCount.textContent = `${filtered.length} entities`;
  placeList.innerHTML = filtered.map((entity) => entityCardTemplate(entity)).join("");
}

function itineraryDayTemplate(day, index) {
  const leadEntity = getEntityById(day.stops[0]) || getEntityById("cascade-complex");
  const stops = day.stops.map(getEntityById).filter(Boolean);
  return `
    <article class="itinerary-visual-card">
      <button class="image-button detail-button" type="button" data-id="${leadEntity.id}" aria-label="Open ${leadEntity.name} details">
        <img src="${entityImage(leadEntity)}" alt="${escapeHtml(leadEntity.name)}" />
        <span class="photo-badge">Day ${index + 1} · ${day.region}</span>
      </button>
      <div class="card-body">
        <div class="day-card-title">
          <div>
            <p class="kicker">Day ${index + 1}</p>
            <h3>${day.title}</h3>
          </div>
          <strong>$${day.estimatedCost}</strong>
        </div>
        <p class="muted">${day.region} · ${routeTravelText(day)} · ${day.transportNote}</p>
        <div class="mini-route-card">${routePreviewTemplate(day)}</div>
        <div class="compact-timeline">
          ${stops.slice(0, 4).map((entity, stopIndex) => `
            <button class="timeline-row detail-button" type="button" data-id="${entity.id}">
              <span class="time">${stopTime(stopIndex)}</span>
              <span class="timeline-dot">${timelineIcon(entity)}</span>
              <span class="timeline-copy"><strong>${entity.name}</strong><small>${entity.cityRegion}</small></span>
            </button>
          `).join("")}
        </div>
      </div>
    </article>
  `;
}

function getPlannerInputs() {
  return {
    days: Number(document.querySelector("#tripDays").value),
    budget: document.querySelector("#tripBudget").value,
    group: document.querySelector("#tripGroup").value,
    transport: document.querySelector("#tripTransport").value,
    pace: document.querySelector("#tripPace").value,
    interests: [...document.querySelectorAll(".interest-picker input:checked")].map((input) => input.value)
  };
}

function scoreEntity(entity, interests) {
  const desiredTags = interests.flatMap((interest) => interestToTags[interest] || [interest]);
  return entity.tags.reduce((score, tag) => score + (desiredTags.includes(tag) ? 1 : 0), 0);
}

function pickRestaurant(cluster, inputs, usedIds) {
  const candidates = cluster.restaurants
    .map(getEntityById)
    .filter(Boolean)
    .filter((entity) => !usedIds.has(entity.id))
    .sort((a, b) => scoreEntity(b, inputs.interests) - scoreEntity(a, inputs.interests));
  return candidates[0]?.id || cluster.restaurants[0] || null;
}

function pickTransportEntity(cluster, inputs) {
  const options = inputs.transport === "car" ? cluster.transport.car : cluster.transport.noCar;
  return options.find(getEntityById) || null;
}

function clusterScore(cluster, inputs, index) {
  let score = 0;
  inputs.interests.forEach((interest) => {
    if (cluster.interests.includes(interest)) score += 4;
  });
  if (inputs.group === "family" && cluster.interests.includes("family")) score += 4;
  if (inputs.transport === "no-car" && cluster.driveLevel !== "none") score += 1;
  if (inputs.transport === "car" && cluster.driveLevel !== "none") score += 2;
  if (inputs.pace === "relaxed" && cluster.driveLevel === "long") score -= 8;
  if (inputs.pace === "intensive" && cluster.driveLevel === "long") score += 3;
  if (index < 2) score += 1;
  return score;
}

function orderedClusters(inputs) {
  const cityFirst = tripClusters.find((cluster) => cluster.id === "yerevan-arrival");
  const practical = tripClusters.find((cluster) => cluster.id === "practical-setup");
  const candidates = tripClusters
    .filter((cluster) => cluster.id !== "yerevan-arrival" && cluster.id !== "practical-setup")
    .filter((cluster) => !(cluster.id === "tatev-syunik" && (inputs.days < 5 || inputs.pace === "relaxed")))
    .filter((cluster) => !(cluster.driveLevel === "long" && inputs.transport === "no-car" && inputs.days < 6))
    .map((cluster, index) => ({ cluster, score: clusterScore(cluster, inputs, index) }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.cluster);

  const result = [cityFirst, ...candidates];
  if (inputs.days >= 4 || inputs.transport === "car") result.splice(1, 0, practical);
  return result.filter(Boolean);
}

function capStopsForPace(stops, pace) {
  const cap = pace === "relaxed" ? 3 : pace === "intensive" ? 5 : 4;
  return stops.slice(0, cap);
}

function estimateDailyCost(day, inputs) {
  const party = groupSize[inputs.group] || 2;
  const budgetRates = {
    budget: { meal: 12, city: 8, tour: 30, car: 42, hotel: 70, esim: 6 },
    mid: { meal: 24, city: 14, tour: 55, car: 65, hotel: 120, esim: 10 },
    premium: { meal: 45, city: 24, tour: 95, car: 110, hotel: 220, esim: 18 }
  };
  const rates = budgetRates[inputs.budget];
  let cost = 0;

  day.stops.forEach((id) => {
    const entity = getEntityById(id);
    if (!entity) return;
    if (entity.category === "restaurants-cafes") cost += rates.meal * party;
    if (entity.category === "attractions" && entity.estimatedPrice !== "Free") cost += rates.city * party;
    if (entity.category === "tours") cost += rates.tour * party;
    if (entity.category === "car-rentals") cost += rates.car;
    if (entity.category === "hotels") cost += rates.hotel;
    if (entity.category === "esim") cost += rates.esim;
  });

  if (day.driveLevel === "medium" && inputs.transport === "no-car" && !day.stops.some((id) => getEntityById(id)?.category === "tours")) {
    cost += rates.tour * party;
  }
  if (day.driveLevel === "long") cost += inputs.transport === "car" ? rates.car : rates.tour * party;
  if (inputs.pace === "intensive") cost = Math.round(cost * 1.15);

  return Math.max(cost, rates.meal * party);
}

function saveGeneratedTrip() {
  const ids = [...new Set(state.plan.flatMap((day) => day.stops))];
  ids.forEach((id) => {
    if (getEntityById(id) && !isSaved(id)) state.saved.push(id);
  });
  state.generatedEntityIds = ids;
  persistSaved();
  renderSaved();
  renderEntities();
  renderDeals();
  renderMapPins();
}

function renderTripOverview() {
  const inputs = currentInputs();
  const totalCost = state.plan.reduce((sum, day) => sum + (day.estimatedCost || 0), 0);
  const interests = inputs.interests.length ? inputs.interests.join(", ") : "classic highlights";
  const html = `
    <div class="overview-card">
      <div>
        <p class="kicker">Trip summary</p>
        <h2>${inputs.days || state.plan.length}-day Armenia plan</h2>
        <p class="muted">$${totalCost || 0} estimated total · ${labelText(inputs.budget)} budget · ${labelText(inputs.pace)} pace</p>
      </div>
      <div class="summary-grid">
        <span>${labelText(inputs.group)}</span>
        <span>${inputs.transport === "car" ? "Own/rental car" : "No car"}</span>
        <span>${interests}</span>
      </div>
    </div>
  `;
  tripOverview.innerHTML = html;
  myTripOverview.innerHTML = state.plan.length ? html : "";
}

function renderPlan() {
  planList.innerHTML = state.plan.map((day, index) => `
    <article class="day-card ${day.driveLevel === "long" ? "long-drive" : ""}">
      <div class="day-card-title">
        <div>
          <p class="kicker">Day ${index + 1} · ${day.region}</p>
          <h3>${day.title}</h3>
        </div>
        <strong>$${day.estimatedCost}</strong>
      </div>
      <p class="muted">${day.note}</p>
      <div class="mini-route-card">${routePreviewTemplate(day)}</div>
      <div class="day-meta">
        <span>Estimated spend $${day.estimatedCost}</span>
        <span>${routeTravelText(day)}</span>
        <span>${day.transportNote}</span>
      </div>
      <ul class="plan-timeline">
        ${day.stops.map((id) => {
          const entity = getEntityById(id);
          return `<li><strong>${timelineIcon(entity)} ${entity?.cityRegion || "Armenia"}</strong><button class="inline-detail detail-button" type="button" data-id="${id}">${entity?.name || id}</button></li>`;
        }).join("")}
      </ul>
      <div class="day-deals">
        ${dayContextDeals(day).map((entity) => `
          <button class="deal-strip detail-button" type="button" data-id="${entity.id}">
            <strong>${entity.name}</strong>
            <span>${entity.dealPrice || "Contextual demo lead - no discount"}</span>
          </button>
        `).join("")}
      </div>
      <div class="day-actions">
        <button type="button" data-action="change" data-day="${index}">Change this day</button>
        <button type="button" data-action="cheaper" data-day="${index}">Make it cheaper</button>
        <button type="button" data-action="less-driving" data-day="${index}">Less driving</button>
        <button type="button" data-action="more-food" data-day="${index}">More food</button>
        <button type="button" data-action="more-nature" data-day="${index}">More nature</button>
      </div>
    </article>
  `).join("");
  renderTripOverview();
  renderToday();
}

function buildPlan(shouldSave = true) {
  const inputs = getPlannerInputs();
  state.lastInputs = inputs;
  const usedIds = new Set();
  const clusters = orderedClusters(inputs);
  const selectedClusters = [];

  while (selectedClusters.length < inputs.days) {
    const next = clusters[selectedClusters.length % clusters.length];
    selectedClusters.push(next);
  }

  state.plan = selectedClusters.map((cluster, index) => {
    const stops = [...cluster.baseStops];
    const restaurant = pickRestaurant(cluster, inputs, usedIds);
    if (restaurant) stops.push(restaurant);

    const transportId = pickTransportEntity(cluster, inputs);
    if (transportId && (cluster.driveLevel !== "none" || index === 0 || inputs.transport === "car")) {
      stops.push(transportId);
    }

    if (index === 0 && !stops.includes("airalo-armenia-esim")) stops.push("airalo-armenia-esim");
    const finalStops = capStopsForPace([...new Set(stops)], inputs.pace);
    finalStops.forEach((id) => usedIds.add(id));

    const needsTransport = cluster.driveLevel !== "none";
    const transportNote = needsTransport
      ? inputs.transport === "car"
        ? "Use own/rental car"
        : "Tour/driver recommended"
      : "Walk/taxi within Yerevan";

    const title = inputs.pace === "relaxed" ? `${cluster.title} (easy pace)` : inputs.pace === "intensive" ? `${cluster.title} (full day)` : cluster.title;
    const day = {
      clusterId: cluster.id,
      title,
      region: cluster.region,
      note: cluster.note,
      driveLevel: cluster.driveLevel,
      transportNote,
      stops: finalStops
    };
    day.estimatedCost = estimateDailyCost(day, inputs);
    return day;
  });

  renderPlan();
  if (shouldSave) saveGeneratedTrip();
}

function buildDayFromCluster(cluster, inputs, index, overrides = {}) {
  const usedIds = new Set(state.plan.flatMap((day, dayIndex) => dayIndex === index ? [] : day.stops));
  const stops = [...cluster.baseStops];
  const restaurant = pickRestaurant(cluster, inputs, usedIds);
  if (restaurant) stops.push(restaurant);

  const transportId = pickTransportEntity(cluster, inputs);
  if (transportId && (cluster.driveLevel !== "none" || index === 0 || inputs.transport === "car")) stops.push(transportId);
  if (index === 0 && !stops.includes("airalo-armenia-esim")) stops.push("airalo-armenia-esim");

  const finalStops = capStopsForPace([...new Set([...(overrides.prependStops || []), ...stops, ...(overrides.appendStops || [])])], inputs.pace);
  const needsTransport = cluster.driveLevel !== "none";
  const transportNote = needsTransport
    ? inputs.transport === "car"
      ? "Use own/rental car"
      : "Tour/driver recommended"
    : "Walk/taxi within Yerevan";
  const title = inputs.pace === "relaxed" ? `${cluster.title} (easy pace)` : inputs.pace === "intensive" ? `${cluster.title} (full day)` : cluster.title;
  const day = {
    clusterId: cluster.id,
    title,
    region: cluster.region,
    note: overrides.note || cluster.note,
    driveLevel: overrides.driveLevel || cluster.driveLevel,
    transportNote,
    stops: finalStops
  };
  day.estimatedCost = estimateDailyCost(day, inputs);
  return day;
}

function refreshGeneratedPlan(message) {
  renderPlan();
  saveGeneratedTrip();
  showToast(message);
}

function adjustDay(dayIndex, action) {
  const inputs = currentInputs();
  const currentDay = state.plan[dayIndex];
  if (!currentDay) return;

  if (action === "change") {
    const existingClusterIds = new Set(state.plan.map((day) => day.clusterId));
    const options = orderedClusters(inputs).filter((cluster) => cluster.id !== currentDay.clusterId);
    const replacement = options.find((cluster) => !existingClusterIds.has(cluster.id)) || options[0] || clusterById("yerevan-arrival");
    state.plan[dayIndex] = buildDayFromCluster(replacement, inputs, dayIndex, { note: `${replacement.note} Swapped by Change this day.` });
    refreshGeneratedPlan("Day changed");
    return;
  }

  if (action === "cheaper") {
    const cheaperInputs = { ...inputs, budget: "budget", transport: currentDay.driveLevel === "none" ? inputs.transport : "no-car" };
    const cheaperStops = currentDay.stops
      .filter((id) => !["hotels", "car-rentals"].includes(getEntityById(id)?.category))
      .filter((id) => !(getEntityById(id)?.category === "restaurants-cafes" && ["dolmama", "gouroo-club-garden"].includes(id)));
    if (!cheaperStops.some((id) => getEntityById(id)?.category === "restaurants-cafes")) cheaperStops.push("crumbs-bread-factory");
    state.plan[dayIndex] = {
      ...currentDay,
      title: `${currentDay.title.replace(" (budget-adjusted)", "")} (budget-adjusted)`,
      note: "Cheaper version: fewer paid services, simpler food stop, and lower-cost assumptions.",
      transportNote: currentDay.driveLevel === "none" ? currentDay.transportNote : "Tour/driver recommended; compare low-cost group options",
      stops: capStopsForPace([...new Set(cheaperStops)], inputs.pace)
    };
    state.plan[dayIndex].estimatedCost = estimateDailyCost(state.plan[dayIndex], cheaperInputs);
    refreshGeneratedPlan("Made day cheaper");
    return;
  }

  if (action === "less-driving") {
    const replacement = currentDay.driveLevel === "none" ? clusterById("yerevan-food") : clusterById("yerevan-arrival");
    state.plan[dayIndex] = buildDayFromCluster(replacement, inputs, dayIndex, {
      note: "Less-driving version: replaced countryside movement with a city-focused day."
    });
    refreshGeneratedPlan("Reduced driving");
    return;
  }

  if (action === "more-food") {
    const foodOptions = ["lavash-restaurant", "sherep-restaurant", "tavern-yerevan", "in-vino", "crumbs-bread-factory", "mirzoyan-library"];
    const nextFood = foodOptions.find((id) => !currentDay.stops.includes(id));
    if (nextFood) currentDay.stops = capStopsForPace([...currentDay.stops, nextFood], inputs.pace === "relaxed" ? "balanced" : inputs.pace);
    currentDay.note = `${currentDay.note} Added a stronger food/cafe stop.`;
    currentDay.estimatedCost = estimateDailyCost(currentDay, inputs);
    refreshGeneratedPlan("Added more food");
    return;
  }

  if (action === "more-nature") {
    const replacement = currentDay.driveLevel === "none" ? clusterById("garni-geghard") : clusterById("sevan-dilijan");
    state.plan[dayIndex] = buildDayFromCluster(replacement, inputs, dayIndex, {
      note: `${replacement.note} Nature-forward adjustment.`
    });
    refreshGeneratedPlan("Added more nature");
  }
}

function renderSaved() {
  const savedEntities = state.saved.map(getEntityById).filter(Boolean);
  const hasSavedGeneratedPlan = state.generatedEntityIds.length > 0 && state.plan.length > 0;
  savedCount.textContent = savedEntities.length;
  savedList.innerHTML = hasSavedGeneratedPlan
    ? state.plan.map((day, index) => itineraryDayTemplate(day, index)).join("")
    : savedEntities.map((entity) => entityCardTemplate(entity, "saved")).join("");
  emptyTrip.classList.toggle("show", savedEntities.length === 0 && !hasSavedGeneratedPlan);
}

function renderDeals() {
  const dealEntities = armeniaEntities.filter((entity) => entity.sponsored || entity.dealPrice || ["tours", "car-rentals", "esim"].includes(entity.category));
  dealList.innerHTML = dealEntities.map((entity) => entityCardTemplate(entity, "deal")).join("");
}

function renderMapPins() {
  const bounds = { minLat: 39.25, maxLat: 40.85, minLng: 44.35, maxLng: 46.35 };
  mapArt.querySelectorAll(".map-pin").forEach((pin) => pin.remove());
  armeniaEntities
    .filter((entity) => entityCoordinates(entity))
    .forEach((entity) => {
      const coordinates = entityCoordinates(entity);
      const x = ((coordinates.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
      const y = (1 - (coordinates.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
      const pin = document.createElement("button");
      pin.className = `map-pin ${entity.category}${state.generatedEntityIds.includes(entity.id) ? " selected" : ""}`;
      pin.type = "button";
      pin.dataset.id = entity.id;
      pin.textContent = entity.name.split(" ")[0];
      pin.style.left = `${Math.max(4, Math.min(86, x))}%`;
      pin.style.top = `${Math.max(4, Math.min(88, y))}%`;
      mapArt.appendChild(pin);
    });
}

function openScreen(screenId) {
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === screenId));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.screen === screenId));
  const activeScreen = document.querySelector(`#${screenId}`);
  screenTitle.textContent = activeScreen.dataset.title;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showMapEntity(id) {
  const entity = getEntityById(id);
  if (!entity) return;
  const mapLink = mapsUrl(entity);
  mapDetail.innerHTML = `
    <div class="map-sheet-head">
      <img src="${entityImage(entity)}" alt="${escapeHtml(entity.name)}" />
      <div>
        <p class="kicker">${categoryLabels[entity.category]} · ${openStatusText(entity)}</p>
        <h2>${entity.name}</h2>
        <p class="muted">${ratingText(entity)} · ${routeTravelText(state.plan[activeDayIndex()])}</p>
      </div>
    </div>
    <div class="tag-row">
      ${entity.tags.slice(0, 3).map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
    <div class="card-actions">
      ${mapLink ? `<a class="secondary-button link-button" href="${mapLink}" target="_blank" rel="noreferrer">Navigate</a>` : ""}
      <button class="primary-button save-button compact-action" type="button" data-id="${entity.id}">${isSaved(entity.id) ? "Saved" : "Add / Swap"}</button>
      <button class="secondary-button detail-button" type="button" data-id="${entity.id}">Details</button>
    </div>
  `;
}

function openEntityDetail(id) {
  const entity = getEntityById(id);
  if (!entity) return;
  const google = googleFor(entity);
  const coordinates = entityCoordinates(entity);
  const mapLink = mapsUrl(entity);
  const gallery = entityGallery(entity);
  const website = google?.website || entity.externalUrl;
  const phone = google?.phoneNumber || "Not available";
  entityDetail.innerHTML = `
    <img class="detail-image" src="${gallery[0]}" alt="${escapeHtml(entity.name)}" />
    ${gallery.length > 1 ? `<div class="photo-gallery">${gallery.slice(0, 5).map((src, index) => `<img src="${src}" alt="${escapeHtml(entity.name)} photo ${index + 1}" />`).join("")}</div>` : ""}
    <p class="kicker">${categoryLabels[entity.category]} · ${openStatusText(entity)}</p>
    <h2>${entity.name}</h2>
    <p>${entity.shortDescription}</p>
    <div class="why-box">
      <strong>Why this place fits your trip</strong>
      <span>${whyEntityFits(entity)}</span>
    </div>
    <div class="detail-grid">
      <div><strong>Rating</strong><span>${ratingText(entity)}</span></div>
      <div><strong>Price</strong><span>${googlePriceText(entity)}</span></div>
      <div><strong>Address</strong><span>${addressText(entity)}</span></div>
      <div><strong>Hours</strong><span>${openStatusText(entity)}</span></div>
      <div><strong>Phone</strong><span>${phone}</span></div>
      <div><strong>Coordinates</strong><span>${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}</span></div>
      <div><strong>Deal</strong><span>${entity.dealPrice || "No active deal"}</span></div>
    </div>
    <div class="tag-row">${entity.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    <div class="card-actions">
      <button class="primary-button save-button compact-action" type="button" data-id="${entity.id}">${isSaved(entity.id) ? "Added" : "Add to trip"}</button>
      ${mapLink ? `<a class="secondary-button link-button" href="${mapLink}" target="_blank" rel="noreferrer">Navigate</a>` : ""}
      <a class="secondary-button link-button book-link" href="${website}" target="_blank" rel="noreferrer">Book</a>
    </div>
  `;
  entityDialog.showModal();
}

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function conciergeReply(text) {
  const query = text.toLowerCase();
  if (query.includes("rain")) return "Rainy day: use Matenadaran, cafes like Mirzoyan Library, central restaurants, and short city walks. Move Garni, Sevan, Dilijan, and Tatev to clearer days.";
  if (query.includes("kid") || query.includes("family")) return "Family plan: choose Cascade, Republic Square, Sevan, Dilijan, and shorter Garni/Geghard routing. Avoid Tatev as a day trip unless everyone tolerates long drives.";
  if (query.includes("wine") || query.includes("food")) return "Food and wine: anchor evenings with Lavash, Sherep, Tavern Yerevan, In Vino, and use Khor Virap + Noravank as the southbound wine-route day.";
  if (query.includes("driver") || query.includes("car")) return "For countryside, compare tours with Hyur/Yerani/One Way or self-drive with Hertz/SIXT. The app should eventually turn this into route-aware leads.";
  if (query.includes("internet") || query.includes("esim")) return "For connectivity, the seed data includes Airalo and Nomad Armenia eSIM entries. Any deal shown there is demo data, not a real partner discount.";
  return `This v0.2 dataset has ${armeniaEntities.length} real Armenia travel entities: ${categoryCounts.attractions} attractions, ${categoryCounts["restaurants-cafes"]} food spots, ${categoryCounts.hotels} hotels, ${categoryCounts.tours} tours, ${categoryCounts["car-rentals"]} car rentals, and ${categoryCounts.esim} eSIM providers.`;
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    state.filter = chip.dataset.filter;
    document.querySelectorAll(".chip").forEach((item) => item.classList.toggle("active", item === chip));
    renderEntities();
  });
});

document.querySelector(".bottom-nav").addEventListener("click", (event) => {
  const item = event.target.closest(".nav-item");
  if (!item) return;
  openScreen(item.dataset.screen);
});

document.body.addEventListener("click", (event) => {
  const saveButton = event.target.closest(".save-button");
  const removeButton = event.target.closest(".remove-button");
  const detailButton = event.target.closest(".detail-button");
  const mapPin = event.target.closest(".map-pin");
  const leadButton = event.target.closest(".lead-button");
  const dayAction = event.target.closest(".day-actions button");
  const screenTarget = event.target.closest("[data-screen-target]");

  if (saveButton) {
    const entity = getEntityById(saveButton.dataset.id);
    saveEntity(entity);
    renderEntities();
    renderDeals();
  }

  if (removeButton) removeEntity(removeButton.dataset.id);
  if (detailButton) openEntityDetail(detailButton.dataset.id);
  if (mapPin) showMapEntity(mapPin.dataset.id);
  if (dayAction) adjustDay(Number(dayAction.dataset.day), dayAction.dataset.action);
  if (screenTarget) openScreen(screenTarget.dataset.screenTarget);

  if (leadButton) {
    const entity = getEntityById(leadButton.dataset.id);
    showToast(`Demo lead captured for ${entity.name}`);
  }
});

flowBack?.addEventListener("click", () => {
  showFlowStep(state.tripFlow.step - 1);
});

document.querySelector("#flowStartDate")?.addEventListener("change", (event) => {
  state.tripFlow.startDate = event.target.value;
});

tripFlow?.addEventListener("click", (event) => {
  const next = event.target.closest(".flow-next");
  const choice = event.target.closest("[data-flow-field]");
  const day = event.target.closest("[data-flow-days]");
  const anchor = event.target.closest("[data-anchor-id]");
  const build = event.target.closest("[data-flow-build]");
  const edit = event.target.closest("[data-flow-edit]");
  const enterHome = event.target.closest("[data-flow-enter-home]");

  if (choice) {
    const field = choice.dataset.flowField;
    state.tripFlow[field] = choice.dataset.flowValue;
    updateFlowVisualState(field);
    if (["style", "budget", "transport", "pace"].includes(field)) {
      window.setTimeout(() => showFlowStep(state.tripFlow.step + 1), 120);
    }
  }

  if (day) {
    state.tripFlow.days = Number(day.dataset.flowDays);
    tripFlow.querySelectorAll(".flow-day").forEach((button) => button.classList.toggle("active", button === day));
    updateFlowLengthCopy();
  }

  if (anchor) {
    const anchorId = anchor.dataset.anchorId;
    if (state.tripFlow.anchors.includes(anchorId)) {
      state.tripFlow.anchors = state.tripFlow.anchors.filter((id) => id !== anchorId);
    } else {
      state.tripFlow.anchors.push(anchorId);
    }
    updateAnchorNodes();
  }

  if (next) showFlowStep(state.tripFlow.step + 1);
  if (build) buildTripFromFlow(build.dataset.flowBuild);
  if (edit) showFlowStep(flowSteps.indexOf("style"));
  if (enterHome) openScreen("homeScreen");
});

document.querySelector("#plannerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  buildPlan(true);
  showToast("Trip generated, saved, and shown on the map");
});

document.querySelector("#saveWholeTrip").addEventListener("click", () => {
  state.plan.flatMap((day) => day.stops).forEach((id) => {
    if (getEntityById(id) && !isSaved(id)) state.saved.push(id);
  });
  state.generatedEntityIds = [...new Set(state.plan.flatMap((day) => day.stops))];
  persistSaved();
  renderSaved();
  renderEntities();
  renderDeals();
  renderMapPins();
  showToast("Plan saved to My Trip");
});

document.querySelector("#clearTrip").addEventListener("click", () => {
  state.saved = [];
  state.generatedEntityIds = [];
  persistSaved();
  renderSaved();
  renderEntities();
  renderDeals();
  renderMapPins();
  showToast("My Trip cleared");
});

document.querySelector("#resetDemo").addEventListener("click", () => {
  state.saved = [];
  state.generatedEntityIds = [];
  state.filter = "all";
  persistSaved();
  document.querySelectorAll(".chip").forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  renderEntities();
  renderSaved();
  renderMapPins();
  showToast("Demo reset");
});

document.querySelector("#openConcierge").addEventListener("click", () => {
  conciergeDialog.showModal();
});

document.querySelector("#openConciergeHome")?.addEventListener("click", () => {
  conciergeDialog.showModal();
});

document.querySelector("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const text = input.value.trim();
  if (!text) return;
  addMessage("user", text);
  input.value = "";
  window.setTimeout(() => addMessage("assistant", conciergeReply(text)), 180);
});

addMessage("assistant", "Hi. Ask about rain, kids, wine, food, drivers, car rental, or eSIM.");
buildPlan(false);
initTripFlow();
renderToday();
renderEntities();
renderSaved();
renderDeals();
renderMapPins();
loadGooglePlacesEnrichment();
