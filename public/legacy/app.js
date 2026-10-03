import { armeniaEntities } from "./entities.js";
import { selectRouteSuggestions } from "./trip-intelligence.js";

const categoryLabels = {
  attractions: "Attraction",
  "restaurants-cafes": "Restaurant/Cafe",
  hotels: "Hotel",
  tours: "Tour",
  "car-rentals": "Car rental",
  esim: "eSIM",
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
    note: "Walkable city day with museums, viewpoints, and a central restaurant.",
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
    note: "A lighter city day for cafes, Armenian food, and evening wine.",
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
    note: "Short countryside route. Garni and Geghard belong together and should not be mixed with Sevan or Tatev in the same day.",
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
    note: "Northbound day with lake and forest. Best as a full day; Dilijan can become an overnight.",
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
    note: "Southbound route for Ararat views, monastery scenery, and the wine-region corridor.",
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
    note: "Long-distance route. Only recommended in longer or intensive trips; better as an overnight than a casual day trip.",
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
    note: "Useful setup day with hotel base, connectivity, and optional rental-car planning.",
  },
];

const interestToTags = {
  food: ["food", "cafe", "breakfast", "armenian", "brunch"],
  nature: ["nature", "lake", "view", "family"],
  history: ["history", "culture", "unesco", "classic", "museum"],
  wine: ["wine", "wine-route", "bar"],
  hiking: ["hiking", "nature", "long-drive"],
  nightlife: ["nightlife", "bar", "night"],
};

const groupSize = {
  solo: 1,
  couple: 2,
  friends: 3,
  family: 4,
};
const imagePalettes = {
  attractions: ["#401f25", "#8c3141", "#d99a52", "#f6e0b5"],
  "restaurants-cafes": ["#2b211a", "#7b3f2f", "#c77a42", "#f4d7ad"],
  hotels: ["#172836", "#2e6275", "#86aeb5", "#e0f0ec"],
  tours: ["#17291f", "#24553f", "#7c9e62", "#e0e7c6"],
  "car-rentals": ["#1b2228", "#465461", "#a6a091", "#efe4cf"],
  esim: ["#20203a", "#4c4a80", "#90a5e6", "#e0e7ff"],
};

function hashString(value) {
  return [...String(value)].reduce(
    (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
    0,
  );
}

function sceneKind(entity) {
  if (entity.id?.includes("sevan")) return "lake";
  if (entity.id?.includes("dilijan")) return "forest";
  if (entity.id?.includes("tatev")) return "cliff";
  if (entity.id?.includes("garni")) return "temple";
  if (
    entity.id?.includes("geghard") ||
    entity.id?.includes("noravank") ||
    entity.id?.includes("khor")
  )
    return "monastery";
  if (entity.category === "restaurants-cafes")
    return entity.tags.includes("wine") ? "wine" : "restaurant";
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
      <g fill="${ink}" opacity=".52">${[0, 1, 2, 3, 4].map((i) => `<rect x="${templeX - 105 + i * 52}" y="${height * 0.66}" width="20" height="116" rx="4"/>`).join("")}</g>
      <rect x="${templeX - 134}" y="${height * 0.76}" width="268" height="24" rx="8" fill="#fff3df" opacity=".8"/>`,
    monastery: `
      <path d="M0 ${height * 0.65} C ${width * 0.25} ${height * 0.48}, ${width * 0.38} ${height * 0.58}, ${width * 0.56} ${height * 0.38} C ${width * 0.72} ${height * 0.6}, ${width * 0.82} ${height * 0.5}, ${width} ${height * 0.62} L${width} ${height} L0 ${height}Z" fill="#fff0dc" opacity=".6"/>
      <g fill="${ink}" opacity=".58"><rect x="${width * 0.37}" y="${height * 0.58}" width="160" height="150" rx="14"/><path d="M${width * 0.37} ${height * 0.58} L${width * 0.45} ${height * 0.42} L${width * 0.55} ${height * 0.58}Z"/><rect x="${width * 0.47}" y="${height * 0.47}" width="36" height="92" rx="10"/></g>`,
    lake: `
      <path d="M0 ${height * 0.48} C ${width * 0.18} ${height * 0.36}, ${width * 0.28} ${height * 0.42}, ${width * 0.43} ${height * 0.32} C ${width * 0.6} ${height * 0.46}, ${width * 0.74} ${height * 0.36}, ${width} ${height * 0.5} L${width} ${height} L0 ${height}Z" fill="#fff5e0" opacity=".72"/>
      <path d="M0 ${height * 0.68} C ${width * 0.2} ${height * 0.62}, ${width * 0.34} ${height * 0.74}, ${width * 0.52} ${height * 0.66} C ${width * 0.68} ${height * 0.6}, ${width * 0.84} ${height * 0.72}, ${width} ${height * 0.64} L${width} ${height} L0 ${height}Z" fill="#e6fbff" opacity=".72"/>`,
    forest: `
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${width * (0.12 + i * 0.12)} ${height * 0.36} l${-48 - i * 3} ${height * 0.36} h${96 + i * 6}Z" fill="${i % 2 ? ink : dark}" opacity=".48"/>`).join("")}
      <path d="M0 ${height * 0.78} C ${width * 0.28} ${height * 0.7}, ${width * 0.5} ${height * 0.86}, ${width} ${height * 0.72} L${width} ${height} L0 ${height}Z" fill="${ink}" opacity=".42"/>`,
    cliff: `
      <path d="M0 ${height * 0.58} C ${width * 0.22} ${height * 0.5}, ${width * 0.32} ${height * 0.38}, ${width * 0.48} ${height * 0.5} C ${width * 0.64} ${height * 0.62}, ${width * 0.75} ${height * 0.44}, ${width} ${height * 0.56} L${width} ${height} L0 ${height}Z" fill="#f6e6cc" opacity=".7"/>
      <path d="M${width * 0.58} ${height * 0.56} l80 54 v112 h-166 v-112z" fill="${ink}" opacity=".58"/><rect x="${width * 0.62}" y="${height * 0.64}" width="26" height="72" rx="10" fill="#fff7e9" opacity=".42"/>`,
    restaurant: `
      <rect x="${width * 0.08}" y="${height * 0.36}" width="${width * 0.84}" height="${height * 0.48}" rx="34" fill="#fff2dd" opacity=".52"/>
      <circle cx="${width * 0.32}" cy="${height * 0.58}" r="82" fill="${ink}" opacity=".36"/><circle cx="${width * 0.32}" cy="${height * 0.58}" r="54" fill="#fffdf8" opacity=".58"/>
      <rect x="${width * 0.56}" y="${height * 0.5}" width="190" height="28" rx="14" fill="${ink}" opacity=".46"/><rect x="${width * 0.58}" y="${height * 0.58}" width="150" height="22" rx="11" fill="${ink}" opacity=".34"/>`,
    wine: `
      <path d="M${width * 0.38} ${height * 0.34} C ${width * 0.33} ${height * 0.48}, ${width * 0.36} ${height * 0.58}, ${width * 0.45} ${height * 0.62} v116 h-42 v28 h126 v-28 h-42 v-116 c${width * 0.09} -${height * 0.04}, ${width * 0.12} -${height * 0.14}, ${width * 0.07} -${height * 0.28}Z" fill="#fff5e7" opacity=".72"/>
      <rect x="${width * 0.58}" y="${height * 0.44}" width="58" height="230" rx="20" fill="${ink}" opacity=".5"/><rect x="${width * 0.59}" y="${height * 0.38}" width="36" height="72" rx="12" fill="${ink}" opacity=".5"/>`,
    hotel: `
      <rect x="${width * 0.18}" y="${height * 0.34}" width="${width * 0.64}" height="${height * 0.42}" rx="28" fill="#fff9eb" opacity=".58"/>
      ${[0, 1, 2].map((row) => [0, 1, 2, 3].map((col) => `<rect x="${width * 0.25 + col * 95}" y="${height * 0.42 + row * 62}" width="44" height="34" rx="8" fill="${ink}" opacity=".34"/>`).join("")).join("")}
      <rect x="${width * 0.45}" y="${height * 0.62}" width="90" height="82" rx="18" fill="${ink}" opacity=".42"/>`,
    tour: `
      <path d="M${width * 0.22} ${height} C ${width * 0.38} ${height * 0.75}, ${width * 0.52} ${height * 0.62}, ${width * 0.78} ${height * 0.48}" fill="none" stroke="#fff8e9" stroke-width="78" stroke-linecap="round" opacity=".72"/>
      <path d="M${width * 0.28} ${height} C ${width * 0.42} ${height * 0.77}, ${width * 0.55} ${height * 0.64}, ${width * 0.8} ${height * 0.5}" fill="none" stroke="${ink}" stroke-width="7" stroke-dasharray="24 22" opacity=".42"/>
      <rect x="${width * 0.25}" y="${height * 0.47}" width="210" height="86" rx="24" fill="${ink}" opacity=".54"/><circle cx="${width * 0.31}" cy="${height * 0.64}" r="24" fill="#fff8e9" opacity=".72"/><circle cx="${width * 0.47}" cy="${height * 0.64}" r="24" fill="#fff8e9" opacity=".72"/>`,
    car: `
      <path d="M0 ${height * 0.72} C ${width * 0.22} ${height * 0.62}, ${width * 0.34} ${height * 0.78}, ${width * 0.55} ${height * 0.68} C ${width * 0.72} ${height * 0.6}, ${width * 0.82} ${height * 0.72}, ${width} ${height * 0.62} L${width} ${height} L0 ${height}Z" fill="#fff5e4" opacity=".5"/>
      <rect x="${width * 0.24}" y="${height * 0.48}" width="360" height="112" rx="34" fill="${ink}" opacity=".58"/><path d="M${width * 0.32} ${height * 0.48} l62 -70 h150 l72 70Z" fill="${ink}" opacity=".48"/><circle cx="${width * 0.34}" cy="${height * 0.64}" r="30" fill="#fff8e9" opacity=".7"/><circle cx="${width * 0.58}" cy="${height * 0.64}" r="30" fill="#fff8e9" opacity=".7"/>`,
    phone: `
      <rect x="${width * 0.36}" y="${height * 0.22}" width="250" height="390" rx="44" fill="#fff8ff" opacity=".68"/><rect x="${width * 0.4}" y="${height * 0.3}" width="178" height="250" rx="26" fill="${ink}" opacity=".35"/>
      <g fill="none" stroke="#fff8ff" stroke-width="10" opacity=".8"><path d="M${width * 0.18} ${height * 0.48} q${width * 0.16} -${height * 0.18} ${width * 0.32} 0"/><path d="M${width * 0.58} ${height * 0.48} q${width * 0.16} -${height * 0.18} ${width * 0.32} 0"/></g>`,
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
  return `onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${escapeHtml(entity.image || localTravelImage(entity, variant))}'}else{this.onerror=null;this.src='${localTravelImage(entity, variant)}'}"`;
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
  return coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    : null;
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
  score += state.planner.anchors.filter((id) => cluster.baseStops.includes(id)).length * 100;
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
    .filter(
      (cluster) =>
        !(cluster.id === "tatev-syunik" && (inputs.days < 5 || inputs.pace === "relaxed")),
    )
    .filter(
      (cluster) =>
        !(cluster.driveLevel === "long" && inputs.transport === "no-car" && inputs.days < 6),
    )
    .map((cluster, index) => ({ cluster, score: clusterScore(cluster, inputs, index) }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.cluster);

  const result =
    inputs.days === 1 && state.planner.anchors.some((id) => !cityFirst.baseStops.includes(id))
      ? [...candidates, cityFirst]
      : [cityFirst, ...candidates];
  if ((inputs.days >= 4 || inputs.transport === "car") && !state.planner.anchors.length)
    result.push(practical);
  return result.filter(Boolean);
}

function capStopsForPace(stops, pace) {
  const cap = pace === "relaxed" ? 3 : pace === "intensive" ? 5 : 4;
  const places = stops.filter((id) =>
    ["attractions", "restaurants-cafes"].includes(getEntityById(id)?.category),
  );
  const essentials = stops.filter((id) => !places.includes(id));
  return [...places.slice(0, cap), ...essentials];
}

function estimateDailyCost(day, inputs) {
  inputs = { ...inputs, ...day.costInputs };
  const party = groupSize[inputs.group] || 2;
  const budgetRates = {
    budget: { meal: 12, city: 8, tour: 30, car: 42, hotel: 70, esim: 6 },
    mid: { meal: 24, city: 14, tour: 55, car: 65, hotel: 120, esim: 10 },
    premium: { meal: 45, city: 24, tour: 95, car: 110, hotel: 220, esim: 18 },
  };
  const rates = budgetRates[inputs.budget];
  let cost = 0;

  day.stops.forEach((id) => {
    const entity = getEntityById(id);
    if (!entity) return;
    if (entity.category === "restaurants-cafes") cost += rates.meal * party;
    if (entity.category === "attractions" && entity.estimatedPrice !== "Free")
      cost += rates.city * party;
    if (entity.category === "tours") cost += rates.tour * party;
    if (entity.category === "car-rentals") cost += rates.car;
    if (entity.category === "hotels") cost += rates.hotel;
    if (entity.category === "esim") cost += rates.esim;
  });

  if (
    day.driveLevel === "medium" &&
    inputs.transport === "no-car" &&
    !day.stops.some((id) => getEntityById(id)?.category === "tours")
  ) {
    cost += rates.tour * party;
  }
  if (
    day.driveLevel === "long" &&
    !day.stops.some((id) => ["tours", "car-rentals"].includes(getEntityById(id)?.category))
  )
    cost += inputs.transport === "car" ? rates.car : rates.tour * party;
  if (inputs.pace === "intensive") cost = Math.round(cost * 1.15);

  return Math.max(cost, rates.meal * party);
}
function buildDayFromCluster(cluster, inputs, index, overrides = {}) {
  const usedIds = new Set(
    state.plan.flatMap((day, dayIndex) => (dayIndex === index ? [] : day.stops)),
  );
  const stops = [...cluster.baseStops];
  const restaurant = pickRestaurant(cluster, inputs, usedIds);
  if (restaurant) stops.push(restaurant);

  const transportId = pickTransportEntity(cluster, inputs);
  if (transportId && (cluster.driveLevel !== "none" || index === 0 || inputs.transport === "car"))
    stops.push(transportId);
  if (index === 0 && !stops.includes("airalo-armenia-esim")) stops.push("airalo-armenia-esim");

  const finalStops = capStopsForPace(
    [...new Set([...(overrides.prependStops || []), ...stops, ...(overrides.appendStops || [])])],
    inputs.pace,
  );
  const needsTransport = cluster.driveLevel !== "none";
  const transportNote = needsTransport
    ? inputs.transport === "car"
      ? "Use own/rental car"
      : "Tour/driver recommended"
    : "Walk/taxi within Yerevan";
  const title =
    inputs.pace === "relaxed"
      ? `${cluster.title} (easy pace)`
      : inputs.pace === "intensive"
        ? `${cluster.title} (full day)`
        : cluster.title;
  const day = {
    clusterId: cluster.id,
    title,
    region: cluster.region,
    note: overrides.note || cluster.note,
    driveLevel: overrides.driveLevel || cluster.driveLevel,
    transportNote,
    stops: finalStops,
  };
  day.estimatedCost = estimateDailyCost(day, inputs);
  return day;
}
function adjustDay(dayIndex, action) {
  const inputs = currentInputs();
  const currentDay = state.plan[dayIndex];
  if (!currentDay) return;

  if (action === "change") {
    const existingClusterIds = new Set(state.plan.map((day) => day.clusterId));
    const options = orderedClusters(inputs).filter(
      (cluster) => cluster.id !== currentDay.clusterId,
    );
    const replacement =
      options.find((cluster) => !existingClusterIds.has(cluster.id)) ||
      options[0] ||
      clusterById("yerevan-arrival");
    state.plan[dayIndex] = buildDayFromCluster(replacement, inputs, dayIndex, {
      note: `${replacement.note} Swapped by Change this day.`,
    });
    refreshGeneratedPlan("Day changed");
    return;
  }

  if (action === "cheaper") {
    const cheaperInputs = {
      ...inputs,
      budget: "budget",
      transport: currentDay.driveLevel === "none" ? inputs.transport : "no-car",
    };
    const cheaperStops = currentDay.stops
      .filter((id) => !["hotels", "car-rentals"].includes(getEntityById(id)?.category))
      .filter(
        (id) =>
          !(
            getEntityById(id)?.category === "restaurants-cafes" &&
            ["dolmama", "gouroo-club-garden"].includes(id)
          ),
      );
    if (!cheaperStops.some((id) => getEntityById(id)?.category === "restaurants-cafes"))
      cheaperStops.push("crumbs-bread-factory");
    state.plan[dayIndex] = {
      ...currentDay,
      title: `${currentDay.title.replace(" (budget-adjusted)", "")} (budget-adjusted)`,
      note: "Cheaper version: fewer paid services, simpler food stop, and lower-cost assumptions.",
      costInputs: { budget: "budget" },
      transportNote:
        currentDay.driveLevel === "none"
          ? currentDay.transportNote
          : "Tour/driver recommended; compare low-cost group options",
      stops: capStopsForPace([...new Set(cheaperStops)], inputs.pace),
    };
    state.plan[dayIndex].estimatedCost = estimateDailyCost(state.plan[dayIndex], cheaperInputs);
    refreshGeneratedPlan("Made day cheaper");
    return;
  }

  if (action === "less-driving") {
    const replacement =
      currentDay.driveLevel === "none"
        ? clusterById("yerevan-food")
        : clusterById("yerevan-arrival");
    state.plan[dayIndex] = buildDayFromCluster(replacement, inputs, dayIndex, {
      note: "Less-driving version: replaced countryside movement with a city-focused day.",
    });
    refreshGeneratedPlan("Reduced driving");
    return;
  }

  if (action === "more-food") {
    const foodOptions = [
      "lavash-restaurant",
      "sherep-restaurant",
      "tavern-yerevan",
      "in-vino",
      "crumbs-bread-factory",
      "mirzoyan-library",
    ];
    const nextFood = foodOptions.find((id) => !currentDay.stops.includes(id));
    if (nextFood) {
      const previousFood = currentDay.stops.find(
        (id) => getEntityById(id)?.category === "restaurants-cafes",
      );
      currentDay.stops = previousFood
        ? currentDay.stops.map((id) => (id === previousFood ? nextFood : id))
        : [...currentDay.stops, nextFood];
    }
    currentDay.note = `${currentDay.note} Added a stronger food/cafe stop.`;
    currentDay.estimatedCost = estimateDailyCost(currentDay, inputs);
    refreshGeneratedPlan("Added more food");
    return;
  }

  if (action === "more-nature") {
    const replacement =
      currentDay.driveLevel === "none"
        ? clusterById("garni-geghard")
        : clusterById("sevan-dilijan");
    state.plan[dayIndex] = buildDayFromCluster(replacement, inputs, dayIndex, {
      note: `${replacement.note} Nature-forward adjustment.`,
    });
    refreshGeneratedPlan("Added more nature");
  }
}

/* ==========================================================================
   Armenia AI — Living Trip Cockpit UI layer
   Data, clusters and trip-building rules above are unchanged from the
   original app. Everything below renders the redesigned screens.
   ========================================================================== */

const STORE_KEY = "armeniaTripV2";
const GEO_CATEGORIES = ["attractions", "restaurants-cafes", "hotels"];
const BASE = { lat: 40.1792, lng: 44.5133, name: "Yerevan" };
const STATUS_LABEL = {
  booked: "Marked booked",
  not: "Not booked",
  flexible: "Flexible",
  needs: "Needs attention",
};

function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("Changes are kept for this visit. Storage is unavailable.");
  }
}
const storedTrip = readStored(STORE_KEY, null);
const validIds = new Set(armeniaEntities.map((e) => e.id));
const recoveredPlan = Array.isArray(storedTrip?.plan)
  ? storedTrip.plan
      .slice(0, 7)
      .filter((d) => d && Array.isArray(d.stops) && clusterById(d.clusterId))
      .map((d) => ({ ...d, stops: [...new Set(d.stops.filter((id) => validIds.has(id)))] }))
  : [];
const recoveredSaved = readStored("armeniaMvpSaved", []);

const state = {
  saved: Array.isArray(recoveredSaved)
    ? [...new Set(recoveredSaved.map((item) => item?.id || item).filter((id) => validIds.has(id)))]
    : [],
  plan: recoveredPlan,
  generatedEntityIds: [],
  lastInputs: storedTrip?.inputs || null,
  googlePlaces: {},
  googleReport: [],
  startDate:
    /^\d{4}-\d{2}-\d{2}$/.test(storedTrip?.startDate || "") &&
    !Number.isNaN(Date.parse(storedTrip.startDate))
      ? storedTrip.startDate
      : "",
  userBuilt: Boolean(storedTrip?.userBuilt),
  bookings: storedTrip?.bookings || {},
  planner: storedTrip?.planner || {
    startDate: "",
    days: 5,
    group: "couple",
    budget: "mid",
    interests: ["history", "nature", "food"],
    transport: "no-car",
    pace: "balanced",
    anchors: ["garni-temple", "geghard-monastery"],
  },
  plannerView: storedTrip?.userBuilt ? "result" : "form",
  plannerMore: false,
  mapDay: null,
  mapWhole: false,
  selectedStop: null,
  preview: null,
  adjustOpen: false,
  sheet: "half",
  exploreFilter: "route",
  expandedDays: new Set([0]),
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const defaultPlanner = {
  startDate: state.startDate,
  days: 5,
  group: "couple",
  budget: "mid",
  interests: ["history", "nature", "food"],
  transport: "no-car",
  pace: "balanced",
  anchors: ["garni-temple", "geghard-monastery"],
};
state.planner = {
  ...defaultPlanner,
  ...(state.planner && typeof state.planner === "object" ? state.planner : {}),
};
state.planner.days = Math.max(1, Math.min(7, Number(state.planner.days) || 5));
for (const [key, allowed] of Object.entries({
  group: ["solo", "couple", "friends", "family"],
  budget: ["budget", "mid", "premium"],
  transport: ["no-car", "car"],
  pace: ["relaxed", "balanced", "intensive"],
}))
  if (!allowed.includes(state.planner[key])) state.planner[key] = defaultPlanner[key];
state.planner.interests = Array.isArray(state.planner.interests)
  ? state.planner.interests.filter((i) => interestToTags[i])
  : defaultPlanner.interests;
state.planner.anchors = Array.isArray(state.planner.anchors)
  ? state.planner.anchors.filter((id) => validIds.has(id))
  : defaultPlanner.anchors;
if (!state.lastInputs || !["budget", "mid", "premium"].includes(state.lastInputs.budget))
  state.lastInputs = null;
if (!state.bookings || typeof state.bookings !== "object" || Array.isArray(state.bookings))
  state.bookings = {};

/* ---------- persistence ---------- */
function persistTrip() {
  state.generatedEntityIds = [...new Set(state.plan.flatMap((day) => day.stops))];
  writeStored(STORE_KEY, {
    plan: state.plan,
    inputs: state.lastInputs,
    startDate: state.startDate,
    bookings: state.bookings,
    userBuilt: state.userBuilt,
    planner: state.planner,
  });
}
function persistSaved() {
  writeStored("armeniaMvpSaved", state.saved);
}

/* ---------- small helpers ---------- */
function getEntityById(id) {
  return armeniaEntities.find((entity) => entity.id === id);
}
function isSaved(id) {
  return state.saved.includes(id);
}
function inPlan(id) {
  return state.plan.some((day) => day.stops.includes(id));
}
function shortName(entity) {
  return (entity?.name || "")
    .replace(/ (Temple|Monastery|Complex|Restaurant|National Park)$/i, "")
    .replace(/ - Lake Sevan$/, "")
    .replace(/, .*$/, "");
}
function cleanTitle(title) {
  return String(title || "").replace(/\s*\((easy pace|full day|budget-adjusted)\)/g, "");
}
function ratingText(entity) {
  const google = googleFor(entity);
  const rating = typeof google?.rating === "number" ? google.rating : entity.rating;
  const reviewCount =
    typeof google?.reviewCount === "number" ? google.reviewCount : entity.reviewCount;
  if (!rating) return "";
  return `★ ${rating.toFixed(1)}${reviewCount ? ` (${reviewCount.toLocaleString()})` : ""}`;
}
function priceText(entity) {
  return entity.fromPrice ? `From ${entity.fromPrice}` : entity.estimatedPrice || "Price varies";
}
function labelText(value) {
  return String(value || "").replace(/-/g, " ");
}
function publicTags(entity) {
  return entity.tags.filter((tag) => !/demo/i.test(tag));
}
function coords(entity) {
  return entity ? entity.coordinates : null;
}
function isGeo(entity) {
  return entity && GEO_CATEGORIES.includes(entity.category) && coords(entity);
}

function haversine(a, b) {
  if (!a || !b) return 0;
  const r = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
function legMinutes(a, b) {
  const km = haversine(a, b);
  if (km < 0.4) return 5;
  if (km < 6) return Math.max(5, Math.round((km * 4 + 6) / 5) * 5);
  return Math.round((((km * 1.3) / 58) * 60) / 5) * 5;
}
function visitMinutes(entity) {
  const custom = {
    matenadaran: 90,
    "garni-temple": 75,
    "geghard-monastery": 60,
    "tatev-monastery": 150,
    "dilijan-national-park": 120,
    "sevanavank-lake-sevan": 75,
    "cascade-complex": 60,
    "republic-square": 45,
    "khor-virap": 60,
    noravank: 75,
  };
  if (custom[entity.id]) return custom[entity.id];
  if (entity.category === "restaurants-cafes") return 75;
  if (entity.category === "hotels") return 0;
  return 60;
}
function fmtTime(minutes) {
  const m = Math.round(minutes);
  return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
function fmtDur(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
function navUrl(entity) {
  const c = entityCoordinates(entity);
  return c
    ? `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`
    : mapsUrl(entity);
}

/* ---------- dates / current day ---------- */
function tripStart() {
  return state.startDate ? new Date(`${state.startDate}T00:00:00Z`) : null;
}
function armeniaToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Yerevan",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return new Date(`${get("year")}-${get("month")}-${get("day")}T00:00:00Z`);
}
function currentDayIndex() {
  const start = tripStart();
  if (!start || !state.plan.length) return 0;
  const today = armeniaToday();
  const diff = Math.round((today - start) / 86400000);
  return Math.max(0, Math.min(state.plan.length - 1, diff));
}
function tripPhase() {
  const start = tripStart();
  if (!start) return "planned";
  const today = armeniaToday();
  const diff = Math.round((today - start) / 86400000);
  if (diff < 0) return `Starts in ${-diff} day${diff === -1 ? "" : "s"}`;
  if (diff >= state.plan.length) return "Trip complete";
  return "live";
}
function dayDate(index, opts = { weekday: "short", day: "numeric", month: "short" }) {
  const start = tripStart();
  if (!start) return "";
  const date = new Date(start);
  date.setUTCDate(date.getUTCDate() + index);
  return date.toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
}
function tripDateRange() {
  if (!tripStart()) return `${state.plan.length} days · dates flexible`;
  return `${dayDate(0, { day: "numeric", month: "short" })} – ${dayDate(state.plan.length - 1, { day: "numeric", month: "short" })}`;
}

/* ---------- itinerary model ---------- */
const roadRoutes = new Map();
const routeRequests = new Map();
const routeFailures = new Map();
function dayOrigin(day) {
  const index = state.plan.indexOf(day);
  const hotel =
    index > 0
      ? state.plan[index - 1].stops
          .map(getEntityById)
          .filter((e) => e?.category === "hotels")
          .at(-1)
      : null;
  return hotel
    ? { ...coords(hotel), name: hotel.name, id: hotel.id }
    : { ...BASE, id: "yerevan-base" };
}
function routeSpec(day, override) {
  const places = (override || day?.stops || []).map(getEntityById).filter(isGeo);
  const ordered = [
    ...places.filter((e) => e.category !== "hotels"),
    ...places.filter((e) => e.category === "hotels"),
  ];
  const ids = [dayOrigin(day).id, ...ordered.map((e) => e.id)];
  if (
    ordered.length &&
    ordered.at(-1).category !== "hotels" &&
    haversine(coords(ordered.at(-1)), BASE) > 15
  )
    ids.push("yerevan-base");
  const profile =
    day?.driveLevel === "none" && currentInputs().transport === "no-car"
      ? "foot-walking"
      : "driving-car";
  return { ids, profile };
}
function routeKey(spec) {
  return JSON.stringify(spec);
}
function roadRoute(day, override) {
  return roadRoutes.get(routeKey(routeSpec(day, override)));
}
async function requestRoadRoute(day, override) {
  const spec = routeSpec(day, override);
  const key = routeKey(spec);
  if (
    spec.ids.length < 2 ||
    roadRoutes.has(key) ||
    Date.now() - (routeFailures.get(key) || 0) < 60000
  )
    return;
  if (routeRequests.has(key)) return routeRequests.get(key);
  const task = (async () => {
    try {
      const response = await fetch("/api/public/road-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec),
        signal: AbortSignal.timeout(18000),
      });
      if (!response.ok) throw new Error("Route unavailable");
      const route = await response.json();
      if (route.status !== "ok" || route.legs.length !== spec.ids.length - 1)
        throw new Error("Invalid route");
      roadRoutes.set(key, route);
      renderAll(false);
    } catch {
      routeFailures.set(key, Date.now());
    } finally {
      routeRequests.delete(key);
    }
  })();
  routeRequests.set(key, task);
  return task;
}
async function syncRoadRoutes() {
  for (const day of [...state.plan]) await requestRoadRoute(day);
  const d = currentDayIndex();
  const day = state.plan[d];
  if (roadRoute(day)) {
    for (const s of routeSuggestions(d)
      .filter((s) => s.kind === "add")
      .slice(0, 2)) {
      await requestRoadRoute(day, previewIds(day, s));
    }
  }
}
function dayStartMinutes() {
  const pace = currentInputs().pace;
  return pace === "relaxed" ? 600 : pace === "intensive" ? 510 : 540;
}
function dayPlan(day, idsOverride) {
  const ids = idsOverride || day?.stops || [];
  const entities = ids.map(getEntityById).filter(Boolean);
  const geo = entities.filter(isGeo);
  const ordered = [
    ...geo.filter((e) => e.category !== "hotels"),
    ...geo.filter((e) => e.category === "hotels"),
  ];
  const logistics = entities.filter((e) => !isGeo(e));
  const services = entities.filter((e) =>
    ["hotels", "tours", "car-rentals", "esim"].includes(e.category),
  );
  let t = dayStartMinutes();
  const origin = dayOrigin(day);
  let prev = origin;
  const road = roadRoute(day, idsOverride);
  let drive = 0;
  const stops = ordered.map((entity, index) => {
    const leg = road?.legs[index]?.minutes ?? legMinutes(prev, coords(entity));
    drive += leg;
    const arrive = t + leg;
    const duration = visitMinutes(entity);
    t = arrive + duration;
    const from = index ? shortName(ordered[index - 1]) : origin.name;
    prev = coords(entity);
    return { entity, index, leg, arrive, depart: t, duration, from };
  });
  let returnLeg = 0;
  if (stops.length && ordered.at(-1)?.category !== "hotels" && haversine(prev, BASE) > 15) {
    returnLeg = road?.legs[ordered.length]?.minutes ?? legMinutes(prev, BASE);
    drive += returnLeg;
    t += returnLeg;
  }
  return {
    stops,
    logistics,
    services,
    driveMinutes: drive,
    returnLeg,
    startMinutes: dayStartMinutes(),
    endMinutes: t,
    origin,
    routed: Boolean(road),
  };
}
function daySummary(day) {
  const p = dayPlan(day);
  return `${p.stops.length} stop${p.stops.length === 1 ? "" : "s"} · ${p.routed ? "" : "~"}${fmtDur(p.driveMinutes)} ${p.routed ? "travel" : "estimated travel"}`;
}
function bookingStatus(entity, day) {
  if (state.bookings[entity.id]) return state.bookings[entity.id];
  if (["tours", "car-rentals"].includes(entity.category))
    return day && day.driveLevel !== "none" ? "needs" : "not";
  if (entity.category === "hotels" || entity.category === "esim") return "not";
  return "flexible";
}
function stopRole(entity) {
  if (entity.category === "restaurants-cafes") return "Lunch";
  if (entity.category === "hotels") return "Stay";
  return shortName(entity);
}
function practicalNote(entity, stop) {
  if (entity.category === "hotels") return "Confirm check-in time and availability with the hotel.";
  if (entity.category === "restaurants-cafes")
    return "Check opening hours and reservation requirements with the restaurant.";
  if (entity.estimatedPrice && /paid/i.test(entity.estimatedPrice))
    return "Paid entry · bring some cash in dram.";
  if (stop && stop.arrive > 17 * 60 + 30)
    return "Late arrival · light fades early in shoulder season.";
  if (publicTags(entity).includes("nature")) return "Wear proper shoes · paths can be uneven.";
  return "Check admission and opening hours before visiting; dress modestly for churches.";
}

/* ---------- trip intelligence (deterministic rules) ---------- */
function insertionFor(entity, day) {
  const p = dayPlan(day);
  const points = [p.origin, ...p.stops.map((s) => coords(s.entity))];
  const c = coords(entity);
  let best = null;
  const minPos = entity.category === "restaurants-cafes" && p.stops.length >= 2 ? 1 : 0;
  for (let i = minPos; i < points.length; i++) {
    const a = points[i];
    const b = points[i + 1];
    const proposedIds = [...p.stops.map((s) => s.entity.id)];
    proposedIds.splice(i, 0, entity.id);
    const proposed = roadRoute(day, proposedIds);
    const baseline = roadRoute(day);
    const extra =
      proposed && baseline
        ? proposed.minutes - baseline.minutes
        : b
          ? legMinutes(a, c) + legMinutes(c, b) - legMinutes(a, b)
          : legMinutes(a, c);
    const routed = Boolean(proposed && baseline);
    if (!best || (routed && !best.routed) || (routed === best.routed && extra < best.extra))
      best = { pos: i, extra: Math.max(0, extra), routed };
  }
  return best;
}
function previewIds(day, suggestion) {
  const p = dayPlan(day);
  const geoIds = p.stops.map((s) => s.entity.id);
  if (suggestion.kind === "add") geoIds.splice(suggestion.pos, 0, suggestion.id);
  if (suggestion.kind === "move") geoIds.splice(geoIds.indexOf(suggestion.id), 1);
  return [...geoIds, ...p.logistics.map((e) => e.id)];
}
function routeSuggestions(dayIndex) {
  const day = state.plan[dayIndex];
  if (!day) return [];
  const p = dayPlan(day);
  const used = new Set(state.plan.flatMap((d) => d.stops));
  const candidates = armeniaEntities
    .filter(
      (e) =>
        ["attractions", "restaurants-cafes"].includes(e.category) && !used.has(e.id) && coords(e),
    )
    .map((e) => ({ e, ...insertionFor(e, day) }))
    .filter((c) => c.extra <= 35)
    .sort((a, b) => a.extra - b.extra);
  const out = [];
  const hasFood = p.stops.some((s) => s.entity.category === "restaurants-cafes");
  const { food, sight, tight, movable } = selectRouteSuggestions({
    candidates,
    stops: p.stops,
    dayIndex,
    dayCount: state.plan.length,
    endMinutes: p.endMinutes,
    travelMinutes: p.driveMinutes,
  });
  const nextName = (pos) => (p.stops[pos] ? shortName(p.stops[pos].entity) : null);

  if (tight && p.stops.length > 2 && dayIndex < state.plan.length - 1) {
    if (movable)
      out.push({
        kind: "move",
        day: dayIndex,
        id: movable.entity.id,
        title: "Today is tight",
        sub: `Move ${shortName(movable.entity)} to Day ${dayIndex + 2}`,
        badge: `−${fmtDur(movable.duration + movable.leg)}`,
      });
  }
  if (food)
    out.push({
      kind: "add",
      day: dayIndex,
      id: food.e.id,
      pos: food.pos,
      extra: food.extra,
      title: hasFood ? `${shortName(food.e)} on your way` : "Lunch near your route",
      sub: `${food.e.name}${nextName(food.pos) ? ` · before ${nextName(food.pos)}` : ""}`,
      badge: `+${food.routed ? "" : "~"}${food.extra} min`,
    });
  if (sight && !tight)
    out.push({
      kind: "add",
      day: dayIndex,
      id: sight.e.id,
      pos: sight.pos,
      extra: sight.extra,
      title: nextName(sight.pos) ? `Stop before ${nextName(sight.pos)}` : "Worth adding today",
      sub: sight.e.name,
      badge: `+${sight.routed ? "" : "~"}${sight.extra} min`,
    });
  return out.slice(0, 3);
}
function tripIssues() {
  const issues = [];
  state.plan.forEach((day, index) => {
    const p = dayPlan(day);
    const firstPlace = p.stops.find((s) => s.entity.category === "attractions");
    if (p.driveMinutes > 210)
      issues.push({
        day: index,
        text: `Day ${index + 1} has ${fmtDur(p.driveMinutes)} of driving`,
        cta: "Reduce driving",
        action: "less-driving",
      });
    if (day.driveLevel !== "none" && firstPlace) {
      const transport = p.logistics.find((e) => ["tours", "car-rentals"].includes(e.category));
      if (!transport && currentInputs().transport === "no-car")
        issues.push({
          day: index,
          text: `You still need transport to ${shortName(firstPlace.entity)}`,
          cta: "Find a driver",
          open: "hyur-service",
        });
      else if (transport && bookingStatus(transport, day) !== "booked")
        issues.push({
          day: index,
          text: `You still need transport to ${shortName(firstPlace.entity)}`,
          cta: "Check availability",
          open: transport.id,
        });
    }
    p.stops
      .filter((s) => s.entity.category === "attractions" && s.arrive > 17 * 60 + 30)
      .forEach((s) => {
        issues.push({
          day: index,
          text: `${shortName(s.entity)} may close before you arrive at ${fmtTime(s.arrive)}`,
          cta: "Review day",
          map: index,
        });
      });
  });
  const hotel = state.plan
    .flatMap((d) => d.stops)
    .map(getEntityById)
    .find((e) => e?.category === "hotels");
  if (hotel && bookingStatus(hotel) !== "booked")
    issues.push({
      day: 0,
      text: `Your stay at ${hotel.name} isn't booked yet`,
      cta: "Check availability",
      open: hotel.id,
    });
  return issues;
}
function dealContext(entity) {
  const dayIndex = state.plan.findIndex((day) => day.stops.includes(entity.id));
  if (entity.category === "esim")
    return dayIndex >= 0 ? "Airport arrival · works from Day 1" : "Airport arrival essential";
  if (["tours", "car-rentals"].includes(entity.category)) {
    if (dayIndex >= 0) {
      const target = dayPlan(state.plan[dayIndex]).stops.find(
        (s) => s.entity.category === "attractions",
      );
      return `Transport for Day ${dayIndex + 1}${target ? ` · ${shortName(target.entity)}` : ""}`;
    }
    const countryside = state.plan.findIndex((d) => d.driveLevel !== "none");
    return countryside >= 0
      ? `Could cover Day ${countryside + 1}'s countryside drive`
      : "Countryside day trips";
  }
  if (entity.category === "hotels")
    return dayIndex >= 0
      ? `Your base from Day ${dayIndex + 1}`
      : `Near your ${entity.cityRegion.split(",")[0]} days`;
  if (dayIndex >= 0) return `Useful for Day ${dayIndex + 1}`;
  return "Near your route";
}
function dealAction(entity) {
  if (entity.category === "tours") return "Check availability";
  if (entity.category === "car-rentals") return "Book";
  if (entity.category === "hotels") return "Check availability";
  if (entity.category === "esim") return "View plans";
  return "Add to trip";
}
function fitForEntity(entity) {
  for (let d = 0; d < state.plan.length; d++) {
    const p = dayPlan(state.plan[d]);
    const stop = p.stops.find((s) => s.entity.id === entity.id);
    if (stop)
      return {
        inPlan: true,
        day: d,
        lines: [
          `Day ${d + 1} · stop ${stop.index + 1} of ${p.stops.length}`,
          `Arrive ${fmtTime(stop.arrive)} · ${stop.duration ? `${fmtDur(stop.duration)} here` : "overnight"}`,
          `${fmtDur(stop.leg)} from ${stop.from}`,
        ],
      };
    if (state.plan[d].stops.includes(entity.id))
      return {
        inPlan: true,
        day: d,
        lines: [dealContext(entity), STATUS_LABEL[bookingStatus(entity, state.plan[d])]],
      };
  }
  if (!isGeo(entity)) return { inPlan: false, lines: [dealContext(entity)] };
  let best = null;
  state.plan.forEach((day, d) => {
    const ins = insertionFor(entity, day);
    if (ins && (!best || ins.extra < best.extra)) best = { ...ins, day: d };
  });
  if (!best) return { inPlan: false, lines: [] };
  const p = dayPlan(state.plan[best.day]);
  const before = p.stops[best.pos - 1];
  const after = p.stops[best.pos];
  const lines = [`${best.extra} min from your Day ${best.day + 1} route`];
  if (before && after)
    lines.push(`Fits between ${shortName(before.entity)} and ${shortName(after.entity)}`);
  if (after)
    lines.push(
      `Adding this moves arrival at ${shortName(after.entity)} to ${fmtTime(after.arrive + best.extra + visitMinutes(entity))}`,
    );
  return { inPlan: false, day: best.day, pos: best.pos, extra: best.extra, lines };
}

/* ---------- planning (inputs come from the redesigned planner) ---------- */
function getPlannerInputs() {
  const p = state.planner;
  const interests = new Set(p.interests);
  p.anchors.forEach((id) => (anchorInterestMap[id] || []).forEach((i) => interests.add(i)));
  return {
    days: Number(p.days),
    budget: p.budget,
    group: p.group,
    transport: p.transport,
    pace: p.pace,
    interests: [...interests].filter((i) =>
      Object.prototype.hasOwnProperty.call(interestToTags, i),
    ),
  };
}
const anchorInterestMap = {
  "garni-temple": ["history", "nature"],
  "geghard-monastery": ["history", "nature"],
  "sevanavank-lake-sevan": ["nature"],
  "dilijan-national-park": ["nature", "hiking"],
  "khor-virap": ["history", "nature"],
  noravank: ["history", "wine", "nature"],
  "tatev-monastery": ["history", "nature", "hiking"],
  "lavash-restaurant": ["food"],
};
function currentInputs() {
  return state.lastInputs || getPlannerInputs();
}
function clusterById(id) {
  return tripClusters.find((cluster) => cluster.id === id);
}

function buildPlan(shouldSave = true) {
  const inputs = getPlannerInputs();
  state.lastInputs = inputs;
  const usedIds = new Set();
  const clusters = orderedClusters(inputs);
  const selectedClusters = [];
  while (selectedClusters.length < inputs.days)
    selectedClusters.push(clusters[selectedClusters.length % clusters.length]);

  state.plan = selectedClusters.map((cluster, index) => {
    const stops = [...cluster.baseStops];
    const restaurant = pickRestaurant(cluster, inputs, usedIds);
    if (restaurant) stops.push(restaurant);
    const transportId = pickTransportEntity(cluster, inputs);
    if (transportId && (cluster.driveLevel !== "none" || index === 0 || inputs.transport === "car"))
      stops.push(transportId);
    if (index === 0 && !stops.includes("airalo-armenia-esim")) stops.push("airalo-armenia-esim");
    const finalStops = capStopsForPace([...new Set(stops)], inputs.pace);
    finalStops.forEach((id) => usedIds.add(id));
    const needsTransport = cluster.driveLevel !== "none";
    const transportNote = needsTransport
      ? inputs.transport === "car"
        ? "Use own/rental car"
        : "Tour/driver recommended"
      : "Walk/taxi within Yerevan";
    const title =
      inputs.pace === "relaxed"
        ? `${cluster.title} (easy pace)`
        : inputs.pace === "intensive"
          ? `${cluster.title} (full day)`
          : cluster.title;
    const day = {
      clusterId: cluster.id,
      title,
      region: cluster.region,
      note: cluster.note,
      driveLevel: cluster.driveLevel,
      transportNote,
      stops: finalStops,
    };
    day.estimatedCost = estimateDailyCost(day, inputs);
    return day;
  });
  if (shouldSave) saveGeneratedTrip();
  else persistTrip();
}
function saveGeneratedTrip() {
  state.userBuilt = true;
  persistTrip();
}
function refreshGeneratedPlan(message) {
  persistTrip();
  renderAll();
  if (message) showToast(message);
}

/* ---------- toast ---------- */
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- shared templates ---------- */
const ICON = {
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 1 1 13 0c0 4.8-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>`,
  nav: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 16-7-7 16-2-7-7-2Z"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4V4Z"/></svg>`,
  car: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16V11l2-5h10l2 5v5M4 16h16v3H4zM7.5 13h.01M16.5 13h.01"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17h.01"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,
};
function img(entity, cls = "", variant = "card") {
  return `<img class="${cls}" src="${entityImage(entity, variant)}" alt="${escapeHtml(entity.name)}" loading="lazy" ${imageFallbackAttr(entity, variant)} />`;
}
function statusChip(status) {
  return `<span class="status status-${status}">${STATUS_LABEL[status]}</span>`;
}

/* ==========================================================================
   TODAY
   ========================================================================== */
function renderToday() {
  const root = $("#todayRoot");
  if (!root || !state.plan.length) return;
  const dayIndex = currentDayIndex();
  const day = state.plan[dayIndex];
  const p = dayPlan(day);
  const next = p.stops[0];
  const hero = next?.entity || getEntityById("cascade-complex");
  const phase = tripPhase();
  const suggestions = routeSuggestions(dayIndex);
  const pending = p.services.filter(
    (e) => ["needs", "not"].includes(bookingStatus(e, day)) && e.category !== "esim",
  );

  const chips = [];
  const tight = suggestions.find((s) => s.kind === "move");
  const lunch = suggestions.find(
    (s) => s.kind === "add" && getEntityById(s.id)?.category === "restaurants-cafes",
  );
  if (tight)
    chips.push(
      `<button class="ai-chip is-alert" data-suggest="${suggestions.indexOf(tight)}" data-suggest-day="${dayIndex}">Today is tight</button>`,
    );
  if (lunch)
    chips.push(
      `<button class="ai-chip" data-suggest="${suggestions.indexOf(lunch)}" data-suggest-day="${dayIndex}">Add lunch · ${lunch.badge}</button>`,
    );
  chips.push(
    `<button class="ai-chip" data-day-action="cheaper" data-day="${dayIndex}">Spend less</button>`,
  );
  chips.push(
    `<button class="ai-chip" data-day-action="more-food" data-day="${dayIndex}">More local</button>`,
  );
  chips.push(
    `<button class="ai-chip" data-day-action="change" data-day="${dayIndex}">Replace a stop</button>`,
  );

  root.innerHTML = `
    <section class="today-hero">
      ${img(hero, "today-hero-img", "hero")}
      <div class="today-hero-shade"></div>
      <div class="today-top">
        <span class="brand-mark">Armenia<em>AI</em></span>
        <button class="glass-icon" data-open-concierge aria-label="Ask Armenia AI">${ICON.spark}</button>
      </div>
      <div class="today-head">
        <p class="eyebrow on-dark">Day ${dayIndex + 1} of ${state.plan.length}${dayDate(dayIndex) ? ` · ${dayDate(dayIndex)}` : ""}${phase !== "live" && phase !== "planned" ? ` · ${phase}` : ""}</p>
        <h1 class="display">${escapeHtml(cleanTitle(day.title))}</h1>
        <p class="today-region">${escapeHtml(day.region)} · ${daySummary(day)}</p>
      </div>
      ${
        next
          ? `
      <button class="next-card detail-button" data-id="${next.entity.id}">
        <span class="next-label">Next stop</span>
        <span class="next-name">${escapeHtml(next.entity.name)}</span>
        <span class="next-meta">Leave ${fmtTime(p.startMinutes)} · ${fmtDur(next.leg)} from ${next.from} · arrive ${fmtTime(next.arrive)}</span>
        <span class="next-go">${ICON.chevron}</span>
      </button>`
          : ""
      }
    </section>

    <section class="today-panel">
      <div class="panel-head">
        <h2>Today's route</h2>
        <button class="text-link" data-screen-target="mapScreen">Open map ${ICON.chevron}</button>
      </div>
      <ol class="route-rail">
        <li class="rail-node is-origin"><span class="rail-dot"></span><div><strong>Yerevan</strong><small>Depart ${fmtTime(p.startMinutes)}</small></div></li>
        ${p.stops
          .map(
            (s, i) => `
          <li class="rail-leg"><span>${fmtDur(s.leg)}</span></li>
          <li class="rail-node ${i === 0 ? "is-next" : ""}">
            <span class="rail-dot">${i + 1}</span>
            <button class="rail-body detail-button" data-id="${s.entity.id}">
              <strong>${escapeHtml(s.entity.name)}</strong>
              <small>${fmtTime(s.arrive)}${s.duration ? ` – ${fmtTime(s.depart)}` : " · check-in"}${i === 0 ? " · next" : ""}</small>
            </button>
          </li>`,
          )
          .join("")}
        ${p.returnLeg ? `<li class="rail-leg"><span>${fmtDur(p.returnLeg)}</span></li><li class="rail-node is-origin"><span class="rail-dot"></span><div><strong>Back in Yerevan</strong><small>around ${fmtTime(p.endMinutes)}</small></div></li>` : ""}
      </ol>

      ${
        pending.length
          ? `<div class="attention-list">${pending
              .map(
                (e) => `
        <button class="attention-row detail-button" data-id="${e.id}">
          <span class="attention-icon">${ICON.car}</span>
          <span><strong>${e.category === "hotels" ? "Stay not booked" : "Transport not booked"}</strong><small>${escapeHtml(e.name)} · ${day.transportNote}</small></span>
          ${statusChip(bookingStatus(e, day))}
        </button>`,
              )
              .join("")}</div>`
          : ""
      }

      <div class="ai-strip">
        <span class="ai-label">${ICON.spark} Adjust today</span>
        <div class="chip-scroll">${chips.slice(0, 4).join("")}</div>
      </div>
    </section>

    <section class="explore">
      <div class="panel-head light">
        <h2>Around your route</h2>
      </div>
      <div class="seg-scroll" role="tablist">
        ${[
          ["route", "Best fits"],
          ["restaurants-cafes", "Food"],
          ["attractions", "Sights"],
          ["hotels", "Stays"],
        ]
          .map(
            ([k, l]) =>
              `<button class="seg-chip ${state.exploreFilter === k ? "active" : ""}" data-explore="${k}">${l}</button>`,
          )
          .join("")}
      </div>
      <div class="explore-row">${exploreCards(dayIndex)}</div>
    </section>
  `;
}
function exploreCards(dayIndex) {
  const day = state.plan[dayIndex];
  const filter = state.exploreFilter;
  const items = armeniaEntities
    .filter((e) => isGeo(e))
    .filter((e) => (filter === "route" ? !inPlan(e.id) : e.category === filter))
    .map((e) => {
      const ins = insertionFor(e, day);
      return { e, extra: ins?.extra ?? 99 };
    })
    .sort((a, b) => a.extra - b.extra)
    .slice(0, 8);
  return items
    .map(({ e, extra }) => {
      const planned = state.plan.findIndex((d) => d.stops.includes(e.id));
      const context = planned >= 0 ? `In Day ${planned + 1}` : `+${extra} min detour`;
      return `
      <button class="explore-card detail-button" data-id="${e.id}">
        ${img(e)}
        <span class="explore-copy">
          <small>${context}</small>
          <strong>${escapeHtml(e.name)}</strong>
          <span>${[ratingText(e), e.estimatedPrice].filter(Boolean).join(" · ")}</span>
        </span>
      </button>`;
    })
    .join("");
}

/* ==========================================================================
   PLANNER
   ========================================================================== */
function renderPlanner() {
  const root = $("#plannerRoot");
  if (!root) return;
  if (state.plannerView === "building") {
    root.innerHTML = `
      <div class="building">
        <svg viewBox="0 0 200 120" class="building-route" aria-hidden="true"><path d="M10 100 C50 20 90 110 130 50 S180 30 190 14"/></svg>
        <p class="eyebrow">Building your trip</p>
        <h2 class="display-sm">Balancing driving time, food stops and your must-sees</h2>
      </div>`;
    return;
  }
  if (state.plannerView === "result" && state.plan.length) return renderPlannerResult(root);

  const p = state.planner;
  const seg = (field, options) =>
    `<div class="segmented">${options.map(([v, l]) => `<button class="${String(p[field]) === String(v) ? "active" : ""}" data-plan-field="${field}" data-plan-value="${v}">${l}</button>`).join("")}</div>`;
  const interests = [
    ["history", "History"],
    ["nature", "Nature"],
    ["food", "Food"],
    ["wine", "Wine"],
    ["hiking", "Hiking"],
    ["nightlife", "Nightlife"],
  ];
  const anchors = [
    ["garni-temple", "Garni"],
    ["geghard-monastery", "Geghard"],
    ["sevanavank-lake-sevan", "Sevan"],
    ["dilijan-national-park", "Dilijan"],
    ["khor-virap", "Khor Virap"],
    ["noravank", "Noravank"],
    ["tatev-monastery", "Tatev"],
  ];
  root.innerHTML = `
    <header class="screen-head">
      <p class="eyebrow">Planner</p>
      <h1 class="display-sm">Where should Armenia take you?</h1>
      <p class="lede">A few choices. AI shapes the days, the route and what needs booking.</p>
    </header>
    <div class="plan-form">
      <div class="field">
        <span class="field-label">When</span>
        <div class="field-row">
          <input type="date" class="date-input" data-plan-date value="${p.startDate || ""}" aria-label="Start date" />
          <div class="stepper" aria-label="Trip length">
            <button data-plan-days="-1" aria-label="Fewer days">−</button>
            <span><strong>${p.days}</strong> day${p.days > 1 ? "s" : ""}</span>
            <button data-plan-days="1" aria-label="More days">+</button>
          </div>
        </div>
      </div>
      <div class="field"><span class="field-label">Who's going</span>${seg("group", [
        ["solo", "Solo"],
        ["couple", "Couple"],
        ["friends", "Friends"],
        ["family", "Family"],
      ])}</div>
      <div class="field"><span class="field-label">Budget</span>${seg("budget", [
        ["budget", "Smart value"],
        ["mid", "Comfortable"],
        ["premium", "Premium"],
      ])}</div>
      <div class="field">
        <span class="field-label">Interests</span>
        <div class="tag-picker">${interests.map(([v, l]) => `<button class="pick ${p.interests.includes(v) ? "active" : ""}" data-plan-interest="${v}">${l}</button>`).join("")}</div>
      </div>
      <button class="more-toggle" data-plan-more aria-expanded="${state.plannerMore}">${state.plannerMore ? "Fewer options" : "Transport, pace & must-sees"} ${ICON.chevron}</button>
      ${
        state.plannerMore
          ? `
      <div class="field"><span class="field-label">Getting around</span>${seg("transport", [
        ["no-car", "No car"],
        ["car", "Own or rental car"],
      ])}</div>
      <div class="field"><span class="field-label">Pace</span>${seg("pace", [
        ["relaxed", "Relaxed"],
        ["balanced", "Balanced"],
        ["intensive", "Full days"],
      ])}</div>
      <div class="field">
        <span class="field-label">Must-sees</span>
        <div class="tag-picker">${anchors.map(([v, l]) => `<button class="pick ${p.anchors.includes(v) ? "active" : ""}" data-plan-anchor="${v}">${l}</button>`).join("")}</div>
      </div>`
          : ""
      }
    </div>
    <div class="sticky-cta">
      <button class="btn-primary block" data-plan-build>Build my trip</button>
    </div>`;
}
function renderPlannerResult(root) {
  const inputs = currentInputs();
  const total = state.plan.reduce((sum, d) => sum + (d.estimatedCost || 0), 0);
  const drive = state.plan.reduce((sum, d) => sum + dayPlan(d).driveMinutes, 0);
  root.innerHTML = `
    <header class="screen-head">
      <div class="head-row">
        <p class="eyebrow">Your itinerary</p>
        <button class="text-link" data-plan-edit>Edit choices</button>
      </div>
      <h1 class="display-sm">${state.plan.length} days across Armenia</h1>
      <div class="stat-row">
        <span><strong>$${total}</strong> est. spend</span>
        <span><strong>${fmtDur(drive)}</strong> on the road</span>
        <span><strong>${inputs.transport === "car" ? "Own car" : "Drivers"}</strong> transport</span>
      </div>
    </header>
    <div class="modifier-row">
      <span class="ai-label dark">${ICON.spark} Refine</span>
      <div class="chip-scroll">
        <button class="ai-chip light" data-trip-mod="slower">Make it slower</button>
        <button class="ai-chip light" data-trip-mod="cheaper">Spend less</button>
        <button class="ai-chip light" data-trip-mod="more-nature">More nature</button>
        <button class="ai-chip light" data-trip-mod="less-driving">Less driving</button>
      </div>
    </div>
    <div class="chapters">${state.plan.map((day, i) => chapterTemplate(day, i, true)).join("")}</div>
    <div class="sticky-cta">
      <button class="btn-primary block" data-screen-target="homeScreen">Start trip in Today</button>
    </div>`;
}
function chapterTemplate(day, index, expanded) {
  const p = dayPlan(day);
  const open = expanded || state.expandedDays.has(index);
  const lead = p.stops[0]?.entity || getEntityById("cascade-complex");
  const needs = p.services.filter(
    (e) => ["needs", "not"].includes(bookingStatus(e, day)) && e.category !== "esim",
  );
  const isToday = index === currentDayIndex();
  return `
    <article class="chapter ${open ? "open" : ""} ${isToday ? "is-today" : ""}">
      <div class="chapter-rail"><span class="chapter-dot">${index + 1}</span></div>
      <div class="chapter-body">
        <button class="chapter-head" data-toggle-day="${index}" aria-expanded="${open}">
          ${img(lead, "chapter-thumb")}
          <span class="chapter-title">
            <small>Day ${index + 1}${dayDate(index) ? ` · ${dayDate(index)}` : ""}${isToday ? " · Today" : ""}</small>
            <strong>${escapeHtml(cleanTitle(day.title))}</strong>
            <span>${daySummary(day)} · $${day.estimatedCost}</span>
          </span>
        </button>
        ${needs.length ? `<div class="chapter-flags">${needs.map((e) => `<button class="flag detail-button" data-id="${e.id}">${ICON.alert}${e.category === "hotels" ? "Stay" : "Transport"} · ${STATUS_LABEL[bookingStatus(e, day)]}</button>`).join("")}</div>` : ""}
        ${
          open
            ? `
        <ol class="stop-list">
          ${p.stops
            .map(
              (s) => `
            <li>
              <span class="stop-leg">${fmtDur(s.leg)}</span>
              <button class="stop-row detail-button" data-id="${s.entity.id}">
                <span class="stop-time">${fmtTime(s.arrive)}</span>
                <span class="stop-name">${escapeHtml(s.entity.name)}<small>${s.duration ? fmtDur(s.duration) : "Overnight"} · ${categoryLabels[s.entity.category]}</small></span>
              </button>
            </li>`,
            )
            .join("")}
        </ol>
        <div class="chapter-foot">
          <span>${ICON.car} ${escapeHtml(day.transportNote)}</span>
          <button class="text-link" data-map-day="${index}">View on map ${ICON.chevron}</button>
        </div>`
            : ""
        }
      </div>
    </article>`;
}
function applyTripModifier(mod) {
  if (mod === "slower") {
    state.planner.pace = "relaxed";
    buildPlan(true);
    return refreshGeneratedPlan("Slower pace applied");
  }
  if (mod === "cheaper") {
    state.plan.forEach((_, i) => adjustDay(i, "cheaper", true));
    return refreshGeneratedPlan("Lower-spend version applied");
  }
  if (mod === "more-nature") {
    const target = state.plan.findIndex((d, i) => i > 0 && d.driveLevel === "none");
    adjustDay(target > 0 ? target : state.plan.length - 1, "more-nature", true);
    return refreshGeneratedPlan("More nature added");
  }
  if (mod === "less-driving") {
    let worst = 0;
    state.plan.forEach((d, i) => {
      if (dayPlan(d).driveMinutes > dayPlan(state.plan[worst]).driveMinutes) worst = i;
    });
    adjustDay(worst, "less-driving", true);
    return refreshGeneratedPlan(`Less driving on Day ${worst + 1}`);
  }
}

/* ==========================================================================
   MY TRIP
   ========================================================================== */
function renderMyTrip() {
  const root = $("#tripRoot");
  if (!root) return;
  if (!state.plan.length) {
    root.innerHTML = `<div class="empty"><h2 class="display-sm">No trip yet</h2><p>Build one in the Planner.</p><button class="btn-primary" data-screen-target="plannerScreen">Plan a trip</button></div>`;
    return;
  }
  const d = currentDayIndex();
  const today = state.plan[d];
  const tp = dayPlan(today);
  const next = tp.stops[0];
  const total = state.plan.reduce((sum, day) => sum + (day.estimatedCost || 0), 0);
  const issues = tripIssues();
  const bookings = [
    ...new Map(
      state.plan.flatMap((day) => dayPlan(day).services.map((e) => [e.id, { e, day }])),
    ).values(),
  ];
  const bookedCount = bookings.filter(({ e, day }) => bookingStatus(e, day) === "booked").length;
  const saved = state.saved.map(getEntityById).filter(Boolean);
  const phase = tripPhase();

  root.innerHTML = `
    <header class="trip-head">
      <p class="eyebrow">My Trip · ${tripDateRange()}</p>
      <h1 class="display-sm">Day ${d + 1} of ${state.plan.length}</h1>
      <p class="lede">${phase === "live" || phase === "planned" ? `${escapeHtml(cleanTitle(today.title))}${next ? ` · next ${escapeHtml(shortName(next.entity))} at ${fmtTime(next.arrive)}` : ""}` : phase}</p>
      ${tripRouteSvg()}
      <div class="stat-row">
        <span><strong>$${total}</strong> est. spend</span>
        <span><strong>${bookedCount}/${bookings.length}</strong> booked</span>
        <span><strong>${issues.length}</strong> to resolve</span>
      </div>
    </header>

    ${
      issues.length
        ? `
    <section class="block">
      <h2 class="block-title">${ICON.spark} Needs attention</h2>
      <div class="issue-list">
        ${issues
          .slice(0, 5)
          .map(
            (issue, i) => `
          <div class="issue">
            <span class="issue-text">${escapeHtml(issue.text)}</span>
            <button class="text-link" data-issue="${i}">${issue.cta}</button>
          </div>`,
          )
          .join("")}
      </div>
    </section>`
        : ""
    }

    <section class="block">
      <h2 class="block-title">Day by day</h2>
      <div class="chapters">${state.plan.map((day, i) => chapterTemplate(day, i, false)).join("")}</div>
    </section>

    <section class="block">
      <h2 class="block-title">Bookings & transport</h2>
      <div class="booking-list">
        ${bookings
          .map(({ e, day }) => {
            const status = bookingStatus(e, day);
            return `
          <div class="booking">
            <button class="booking-main detail-button" data-id="${e.id}">
              <strong>${escapeHtml(e.name)}</strong>
              <small>${dealContext(e)}</small>
            </button>
            <button class="status-toggle" data-toggle-booked="${e.id}" aria-label="Toggle booked">${statusChip(status)}</button>
          </div>`;
          })
          .join("")}
      </div>
    </section>

    <section class="block">
      <h2 class="block-title">Saved places <span class="count">${saved.length}</span></h2>
      ${
        saved.length
          ? `<div class="saved-row">${saved
              .map(
                (e) => `
        <div class="saved-item">
          <button class="detail-button" data-id="${e.id}">${img(e)}<span>${escapeHtml(e.name)}</span></button>
          <button class="saved-remove" data-unsave="${e.id}" aria-label="Remove ${escapeHtml(e.name)}">${ICON.close}</button>
        </div>`,
              )
              .join("")}</div>`
          : `<p class="muted">Bookmark places from the map or details to keep them here.</p>`
      }
    </section>

    <div class="trip-foot"><button class="text-link muted" data-reset-trip>Start over with a fresh trip</button></div>
  `;
}
function tripRouteSvg() {
  const points = state.plan.map((day) => dayPlan(day).stops.map((s) => coords(s.entity)));
  const all = [BASE, ...points.flat()];
  const lats = all.map((c) => c.lat);
  const lngs = all.map((c) => c.lng);
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats),
    minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs);
  const w = 320,
    h = 120,
    pad = 14;
  const sx = (lng) => pad + ((lng - minLng) / Math.max(0.05, maxLng - minLng)) * (w - pad * 2);
  const sy = (lat) => h - pad - ((lat - minLat) / Math.max(0.05, maxLat - minLat)) * (h - pad * 2);
  const today = currentDayIndex();
  const paths = points
    .map((pts, i) => {
      const line = [BASE, ...pts]
        .map((c) => `${sx(c.lng).toFixed(1)},${sy(c.lat).toFixed(1)}`)
        .join(" ");
      return `<polyline points="${line}" class="${i === today ? "is-today" : ""}" />`;
    })
    .join("");
  const dots = points
    .flat()
    .map((c) => `<circle cx="${sx(c.lng).toFixed(1)}" cy="${sy(c.lat).toFixed(1)}" r="3" />`)
    .join("");
  return `<button class="trip-route" data-screen-target="mapScreen" data-map-whole aria-label="Open whole trip on map">
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${paths}${dots}<circle class="base" cx="${sx(BASE.lng)}" cy="${sy(BASE.lat)}" r="4.5"/></svg>
    <span>Whole route ${ICON.chevron}</span>
  </button>`;
}

/* ==========================================================================
   DEALS
   ========================================================================== */
function renderDeals() {
  const root = $("#dealsRoot");
  if (!root) return;
  const pool = armeniaEntities.filter(
    (e) =>
      e.sponsored || e.dealPrice || ["tours", "car-rentals", "esim", "hotels"].includes(e.category),
  );
  const forTrip = pool.filter((e) => inPlan(e.id));
  const others = pool.filter((e) => !inPlan(e.id));
  const card = (e) => {
    const action = inPlan(e.id)
      ? dealAction(e)
      : isGeo(e) || e.category === "esim"
        ? dealAction(e)
        : "Add to trip";
    const actionAttr = action === "Add to trip" ? `data-add-trip="${e.id}"` : `data-book="${e.id}"`;
    return `
      <article class="deal">
        <button class="deal-media detail-button" data-id="${e.id}">${img(e)}</button>
        <div class="deal-body">
          <p class="deal-context">${dealContext(e)}</p>
          <button class="deal-name detail-button" data-id="${e.id}">${escapeHtml(e.name)}</button>
          <p class="deal-meta">${[categoryLabels[e.category], e.dealPrice || `Est. ${priceText(e)}`, e.sponsored ? "Sponsored" : ""].filter(Boolean).join(" · ")}</p>
          <button class="btn-secondary sm" ${actionAttr}>${action}</button>
        </div>
      </article>`;
  };
  root.innerHTML = `
    <header class="screen-head">
      <p class="eyebrow">Deals</p>
      <h1 class="display-sm">What your trip still needs</h1>
      <p class="lede">Stays, drivers and connectivity matched to your days.</p>
    </header>
    ${forTrip.length ? `<section class="block"><h2 class="block-title">For your itinerary</h2><div class="deal-list">${forTrip.map(card).join("")}</div></section>` : ""}
    <section class="block"><h2 class="block-title">Also useful</h2><div class="deal-list">${others.map(card).join("")}</div></section>`;
}

/* ==========================================================================
   MAP
   ========================================================================== */
let leafletMap = null;
let mapLayer = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve();
  if (loadLeaflet.promise) return loadLeaflet.promise;
  loadLeaflet.promise = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/vendor/leaflet/leaflet.css";
    document.head.appendChild(css);
    const script = document.createElement("script");
    script.src = "/vendor/leaflet/leaflet.js";
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      loadLeaflet.promise = null;
      reject(new Error("Map unavailable"));
    };
    document.head.appendChild(script);
  });
  return loadLeaflet.promise;
}
function mapDayIndex() {
  return state.mapDay ?? currentDayIndex();
}
async function ensureMap() {
  const el = $("#mapCanvas");
  if (!el) return;
  try {
    await loadLeaflet();
  } catch {
    el.innerHTML = `<div class="map-error">Map couldn't load. <button class="btn-secondary" data-map-retry>Try again</button></div>`;
    return;
  }
  if (!leafletMap) {
    el.innerHTML = "";
    leafletMap = L.map(el, { zoomControl: false, attributionControl: true }).setView(
      [BASE.lat, BASE.lng],
      10,
    );
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMap);
    mapLayer = L.layerGroup().addTo(leafletMap);
    leafletMap.on("click", () => {
      if (state.selectedStop || state.preview) {
        state.selectedStop = null;
        state.preview = null;
        renderMap();
      }
    });
  }
  setTimeout(() => leafletMap.invalidateSize(), 60);
  drawMap(true);
}
function sheetPadding() {
  const sheet = $("#mapSheet");
  const visible = sheet ? sheet.getBoundingClientRect() : null;
  const host = $("#mapScreen")?.getBoundingClientRect();
  if (!visible || !host) return 220;
  return Math.max(120, host.bottom - visible.top) + 16;
}
function divIcon(html, size, cls = "") {
  return L.divIcon({
    html,
    className: `mk ${cls}`,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
  });
}
function drawMap(fit) {
  if (!leafletMap || !mapLayer) return;
  mapLayer.clearLayers();
  const dIndex = mapDayIndex();
  const wine =
    getComputedStyle(document.documentElement).getPropertyValue("--wine").trim() || "#6e1b2d";
  const apricot =
    getComputedStyle(document.documentElement).getPropertyValue("--apricot").trim() || "#e39a5b";
  const boundsPts = [[BASE.lat, BASE.lng]];
  const routeIds = new Set();

  const drawDay = (day, i, emphasis) => {
    const p = dayPlan(day);
    const pts = [p.origin, ...p.stops.map((s) => coords(s.entity))];
    if (p.returnLeg) pts.push(BASE);
    const road = roadRoute(day);
    const geometry = road?.geometry || pts.map((c) => [c.lat, c.lng]);
    boundsPts.push(...geometry);
    L.polyline(geometry, {
      color: wine,
      weight: emphasis ? 4 : 3,
      opacity: emphasis ? 0.9 : 0.35,
      dashArray: road ? undefined : "5 8",
      lineCap: "round",
      lineJoin: "round",
    }).addTo(mapLayer);
    p.stops.forEach((s, n) => {
      routeIds.add(s.entity.id);
      const c = coords(s.entity);
      boundsPts.push([c.lat, c.lng]);
      const selected = state.selectedStop === s.entity.id;
      const isNext = emphasis && n === 0 && !state.mapWhole;
      const label = state.mapWhole ? `${i + 1}` : `${n + 1}`;
      const marker = L.marker([c.lat, c.lng], {
        icon: divIcon(
          `<span class="pin-stop ${isNext ? "is-next" : ""} ${selected ? "is-selected" : ""} ${emphasis ? "" : "is-dim"}">${label}</span>`,
          [32, 32],
        ),
        zIndexOffset: selected ? 1000 : isNext ? 500 : 100,
      }).addTo(mapLayer);
      marker.on("click", (ev) => {
        L.DomEvent.stopPropagation(ev);
        selectStop(s.entity.id, i);
      });
      if ((emphasis && !state.mapWhole && n > 0) || (emphasis && !state.mapWhole && n === 0)) {
        const from = n === 0 ? BASE : coords(p.stops[n - 1].entity);
        if (s.leg >= 10) {
          L.marker([(from.lat + c.lat) / 2, (from.lng + c.lng) / 2], {
            icon: divIcon(`<span class="leg-tag">${fmtDur(s.leg)}</span>`, [64, 22], "leg"),
            interactive: false,
          }).addTo(mapLayer);
        }
      }
    });
  };

  if (state.mapWhole) state.plan.forEach((day, i) => drawDay(day, i, true));
  else drawDay(state.plan[dIndex], dIndex, true);

  // saved bookmarks (not already on route)
  state.saved
    .map(getEntityById)
    .filter((e) => isGeo(e) && !routeIds.has(e.id))
    .forEach((e) => {
      const c = coords(e);
      L.marker([c.lat, c.lng], {
        icon: divIcon(`<span class="pin-saved">${ICON.bookmark}</span>`, [22, 22]),
      })
        .addTo(mapLayer)
        .on("click", (ev) => {
          L.DomEvent.stopPropagation(ev);
          openEntityDetail(e.id);
        });
    });

  // AI suggestions as subtle outlined dots
  if (!state.mapWhole) {
    routeSuggestions(dIndex).forEach((s, idx) => {
      if (s.kind !== "add") return;
      const e = getEntityById(s.id);
      const c = coords(e);
      L.marker([c.lat, c.lng], {
        icon: divIcon(
          `<span class="pin-suggest ${state.preview?.id === s.id ? "is-active" : ""}"></span>`,
          [18, 18],
        ),
      })
        .addTo(mapLayer)
        .on("click", (ev) => {
          L.DomEvent.stopPropagation(ev);
          startPreview(dIndex, idx);
        });
    });
  }

  // preview route
  if (state.preview) {
    const day = state.plan[state.preview.day];
    const pp = dayPlan(day, previewIds(day, state.preview));
    const pts = [pp.origin, ...pp.stops.map((s) => coords(s.entity))];
    if (pp.returnLeg) pts.push(BASE);
    const previewRoad = roadRoute(day, previewIds(day, state.preview));
    L.polyline(previewRoad?.geometry || pts.map((c) => [c.lat, c.lng]), {
      color: apricot,
      weight: 4,
      opacity: 0.95,
      dashArray: "6 8",
    }).addTo(mapLayer);
  }

  // Planned origin; never implies that geolocation has been obtained.
  const origin = dayOrigin(state.plan[dIndex]);
  L.marker([origin.lat, origin.lng], {
    icon: divIcon(`<span class="pin-you"><i></i></span>`, [22, 22]),
    interactive: false,
    title: "Planned starting point",
    zIndexOffset: 2000,
  }).addTo(mapLayer);

  if (fit && boundsPts.length > 1) {
    leafletMap.fitBounds(boundsPts, {
      paddingTopLeft: [28, 96],
      paddingBottomRight: [28, sheetPadding()],
      maxZoom: 13,
      animate: true,
    });
  }
}
function selectStop(id, dayIndex) {
  state.selectedStop = id;
  state.preview = null;
  state.adjustOpen = false;
  state.mapDay = dayIndex;
  if (state.sheet === "peek") setSheet("half");
  renderMap();
  const c = coords(getEntityById(id));
  if (leafletMap && c) leafletMap.panTo([c.lat, c.lng], { animate: true });
  $(`[data-stop-focus="${id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function startPreview(dayIndex, index) {
  const s = routeSuggestions(dayIndex)[index];
  if (!s) return;
  state.mapWhole = false;
  state.mapDay = dayIndex;
  state.preview = s;
  state.selectedStop = null;
  setSheet("half");
  renderMap(true);
  const day = state.plan[dayIndex];
  const ids = previewIds(day, s);
  requestRoadRoute(day, ids);
}
function applyPreview() {
  const s = state.preview;
  if (!s) return;
  const day = state.plan[s.day];
  if (s.kind === "add") {
    day.stops = previewIds(day, s);
  } else if (s.kind === "move") {
    day.stops = day.stops.filter((id) => id !== s.id);
    const next = state.plan[s.day + 1];
    if (next) next.stops = [s.id, ...next.stops];
    if (next) next.estimatedCost = estimateDailyCost(next, currentInputs());
  }
  day.estimatedCost = estimateDailyCost(day, currentInputs());
  state.preview = null;
  refreshGeneratedPlan("Itinerary updated");
}
function moveStop(id, delta) {
  const day = state.plan[mapDayIndex()];
  const p = dayPlan(day);
  const geoIds = p.stops.map((s) => s.entity.id);
  const i = geoIds.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= geoIds.length) return;
  [geoIds[i], geoIds[j]] = [geoIds[j], geoIds[i]];
  day.stops = [...geoIds, ...p.logistics.map((e) => e.id)];
  refreshGeneratedPlan("Stop order changed");
}
function removeStop(id) {
  const day = state.plan[mapDayIndex()];
  day.stops = day.stops.filter((x) => x !== id);
  day.estimatedCost = estimateDailyCost(day, currentInputs());
  state.selectedStop = null;
  refreshGeneratedPlan("Stop removed");
}

function renderMap(fit = false) {
  const head = $("#mapTop");
  const body = $("#mapSheetBody");
  if (!head || !body || !state.plan.length) return;
  const dIndex = mapDayIndex();
  const day = state.plan[dIndex];
  const p = dayPlan(day);
  const isToday = dIndex === currentDayIndex();

  head.innerHTML = `
    <div class="map-seg">
      <button class="${!state.mapWhole ? "active" : ""}" data-map-mode="day">${isToday ? "Today" : `Day ${dIndex + 1}`}</button>
      <button class="${state.mapWhole ? "active" : ""}" data-map-mode="whole">Whole trip</button>
    </div>
    <button class="glass-icon light" data-map-fit aria-label="Fit route">${ICON.nav}</button>`;

  if (state.mapWhole) {
    const totalDrive = state.plan.reduce((s, d) => s + dayPlan(d).driveMinutes, 0);
    const totalStops = state.plan.reduce((s, d) => s + dayPlan(d).stops.length, 0);
    body.innerHTML = `
      <div class="sheet-title">
        <div><p class="eyebrow on-dark">Whole trip · ${tripDateRange()}</p><h2>${state.plan.length} days · ${totalStops} stops</h2><p class="sheet-sub">${fmtDur(totalDrive)} on the road</p></div>
      </div>
      <div class="sheet-days">${state.plan
        .map(
          (d, i) => `
        <button class="sheet-day" data-map-day="${i}">
          <span class="sheet-day-num">${i + 1}</span>
          <span><strong>${escapeHtml(cleanTitle(d.title))}</strong><small>${daySummary(d)}${dayDate(i) ? ` · ${dayDate(i)}` : ""}</small></span>
          ${ICON.chevron}
        </button>`,
        )
        .join("")}</div>`;
  } else {
    const suggestions = routeSuggestions(dIndex);
    const sel = state.selectedStop && p.stops.find((s) => s.entity.id === state.selectedStop);
    body.innerHTML = `
      <div class="sheet-title">
        <div>
          <p class="eyebrow on-dark">${isToday ? "Today" : `Day ${dIndex + 1}`}${dayDate(dIndex) ? ` · ${dayDate(dIndex)}` : ""}</p>
          <h2>${escapeHtml(cleanTitle(day.title))}</h2>
          <p class="sheet-sub">${daySummary(day)}</p>
        </div>
      </div>
      <div class="route-ribbon">
        <span class="ribbon-now">Now</span>
        ${p.stops.map((s, i) => `<span class="ribbon-arrow">→</span><button class="ribbon-stop ${state.selectedStop === s.entity.id ? "active" : ""} ${i === 0 ? "is-next" : ""}" data-stop="${s.entity.id}" data-stop-day="${dIndex}">${escapeHtml(stopRole(s.entity))}</button>`).join("")}
      </div>
      ${state.preview ? previewTemplate(day, p) : sel ? selectedTemplate(sel, p, day) : ""}
      <ol class="sheet-timeline">
        ${p.stops
          .map(
            (s, i) => `
          <li class="${state.selectedStop === s.entity.id ? "active" : ""}" data-stop-focus="${s.entity.id}">
            ${`<span class="tl-leg">${fmtDur(s.leg)} from ${escapeHtml(s.from)}</span>`}
            <button class="tl-row" data-stop="${s.entity.id}" data-stop-day="${dIndex}">
              <span class="tl-num ${i === 0 ? "is-next" : ""}">${i + 1}</span>
              <span class="tl-copy"><strong>${escapeHtml(s.entity.name)}</strong><small>${fmtTime(s.arrive)}${s.duration ? ` · ${fmtDur(s.duration)}` : " · overnight"}</small></span>
            </button>
          </li>`,
          )
          .join("")}
      </ol>
      ${
        suggestions.length && !state.preview
          ? `
      <div class="sheet-ai">
        <p class="ai-label">${ICON.spark} Along your route</p>
        ${suggestions
          .map(
            (s, i) => `
          <button class="suggest-row ${s.kind === "move" ? "is-alert" : ""}" data-suggest="${i}" data-suggest-day="${dIndex}">
            <span><strong>${escapeHtml(s.title)}</strong><small>${escapeHtml(s.sub)}</small></span>
            <span class="suggest-badge">${s.badge}</span>
          </button>`,
          )
          .join("")}
      </div>`
          : ""
      }`;
  }
  drawMap(fit);
}
function selectedTemplate(s, p, day) {
  const e = s.entity;
  const status = bookingStatus(e, day);
  return `
    <div class="sel-card">
      <button class="sel-media detail-button" data-id="${e.id}">${img(e)}</button>
      <div class="sel-body">
        <p class="eyebrow on-dark">Stop ${s.index + 1} · ${categoryLabels[e.category]}</p>
        <h3>${escapeHtml(e.name)}</h3>
        <dl class="sel-facts">
          <div><dt>Arrive</dt><dd>${fmtTime(s.arrive)}</dd></div>
          <div><dt>Visit</dt><dd>${s.duration ? fmtDur(s.duration) : "Overnight"}</dd></div>
          <div><dt>From ${escapeHtml(s.from)}</dt><dd>${fmtDur(s.leg)}</dd></div>
        </dl>
        <p class="sel-note">${practicalNote(e, s)}${status !== "flexible" ? ` ${statusChip(status)}` : ""}</p>
        <div class="sel-actions">
          <a class="btn-primary" href="${navUrl(e)}" target="_blank" rel="noreferrer">${ICON.nav} Navigate</a>
          <button class="btn-ghost" data-adjust-toggle>Adjust stop</button>
        </div>
        ${
          state.adjustOpen
            ? `
        <div class="adjust-menu">
          <button data-move-stop="${e.id}" data-delta="-1" ${s.index === 0 ? "disabled" : ""}>Visit earlier</button>
          <button data-move-stop="${e.id}" data-delta="1" ${s.index === p.stops.length - 1 ? "disabled" : ""}>Visit later</button>
          <button class="detail-button" data-id="${e.id}">Details</button>
          <button class="danger" data-remove-stop="${e.id}">Remove from day</button>
        </div>`
            : ""
        }
      </div>
    </div>`;
}
function previewTemplate(day, p) {
  const s = state.preview;
  const after = dayPlan(day, previewIds(day, s));
  const e = getEntityById(s.id);
  const beforeMap = Object.fromEntries(p.stops.map((x) => [x.entity.id, x.arrive]));
  const changes = after.stops.filter(
    (x) => beforeMap[x.entity.id] != null && beforeMap[x.entity.id] !== x.arrive,
  );
  return `
    <div class="preview-card">
      <p class="eyebrow apricot">${ICON.spark} Preview · nothing changes until you apply</p>
      <h3>${escapeHtml(s.title)}</h3>
      <p class="preview-sub">${escapeHtml(s.sub)} · ${s.badge}</p>
      ${e && s.kind === "add" ? `<button class="preview-place detail-button" data-id="${e.id}">${img(e)}<span>${escapeHtml(e.name)}<small>${[ratingText(e), e.estimatedPrice].filter(Boolean).join(" · ")}</small></span></button>` : ""}
      <ul class="preview-changes">
        ${changes
          .slice(0, 3)
          .map(
            (x) =>
              `<li><span>${escapeHtml(shortName(x.entity))}</span><span><s>${fmtTime(beforeMap[x.entity.id])}</s> → ${fmtTime(x.arrive)}</span></li>`,
          )
          .join("")}
        <li><span>Day ends</span><span><s>${fmtTime(p.endMinutes)}</s> → ${fmtTime(after.endMinutes)}</span></li>
      </ul>
      <div class="sel-actions">
        <button class="btn-primary" data-apply-preview>Apply change</button>
        <button class="btn-ghost" data-cancel-preview>Not now</button>
      </div>
    </div>`;
}

/* ---------- bottom sheet drag ---------- */
function setSheet(stateName) {
  state.sheet = stateName;
  const sheet = $("#mapSheet");
  if (sheet) sheet.dataset.state = stateName;
}
function initSheetDrag() {
  const sheet = $("#mapSheet");
  const handle = $("#mapSheetHandle");
  if (!sheet || !handle) return;
  let startY = 0;
  let startTop = 0;
  let dragging = false;
  handle.addEventListener("pointerdown", (ev) => {
    dragging = true;
    startY = ev.clientY;
    startTop = sheet.getBoundingClientRect().top;
    sheet.classList.add("dragging");
    handle.setPointerCapture(ev.pointerId);
  });
  handle.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const host = $("#mapScreen").getBoundingClientRect();
    const top = Math.max(
      host.top + 70,
      Math.min(host.bottom - 110, startTop + (ev.clientY - startY)),
    );
    sheet.style.transform = `translateY(${top - host.top}px)`;
  });
  const end = (ev) => {
    if (!dragging) return;
    dragging = false;
    sheet.classList.remove("dragging");
    sheet.style.transform = "";
    const moved = ev.clientY - startY;
    const order = ["peek", "half", "full"];
    let i = order.indexOf(state.sheet);
    if (Math.abs(moved) < 6) i = (i + 1) % order.length;
    else if (moved < -40) i = Math.min(2, i + 1);
    else if (moved > 40) i = Math.max(0, i - 1);
    setSheet(order[i]);
    setTimeout(() => drawMap(true), 320);
  };
  handle.addEventListener("pointerup", end);
  handle.addEventListener("pointercancel", end);
}

/* ==========================================================================
   PLACE DETAILS
   ========================================================================== */
function openEntityDetail(id) {
  const entity = getEntityById(id);
  if (!entity) return;
  const google = googleFor(entity);
  const gallery = entityGallery(entity);
  const website = google?.website || entity.externalUrl;
  const fit = state.plan.length ? fitForEntity(entity) : { lines: [] };
  const dayForStatus = fit.day != null ? state.plan[fit.day] : null;
  const status = bookingStatus(entity, dayForStatus);
  const bookable = ["hotels", "tours", "car-rentals", "esim"].includes(entity.category);
  const facts = [
    isGeo(entity) && entity.category !== "hotels"
      ? ["Time needed", fmtDur(visitMinutes(entity))]
      : null,
    ["Price", entity.dealPrice || googlePriceText(entity)],
    google?.openNow != null ? ["Status", openStatusText(entity)] : null,
    ratingText(entity) ? ["Rating", ratingText(entity)] : null,
  ].filter(Boolean);

  let primary = "";
  if (fit.inPlan && isGeo(entity))
    primary = `<a class="btn-primary" href="${navUrl(entity)}" target="_blank" rel="noreferrer">${ICON.nav} Navigate</a>`;
  else if (!fit.inPlan && isGeo(entity) && fit.day != null)
    primary = `<button class="btn-primary" data-add-to-day="${entity.id}" data-day="${fit.day}" data-pos="${fit.pos}">Add to Day ${fit.day + 1}</button>`;
  else if (bookable && website)
    primary = `<a class="btn-primary" href="${website}" target="_blank" rel="noreferrer">${dealAction(entity)}</a>`;

  $("#entityDetail").innerHTML = `
    <div class="detail-media">
      <img src="${gallery[0]}" alt="${escapeHtml(entity.name)}" ${imageFallbackAttr(entity, "detail")} />
      ${
        gallery.length > 1
          ? `<div class="detail-thumbs">${gallery
              .slice(1, 5)
              .map((src) => `<img src="${src}" alt="" loading="lazy" />`)
              .join("")}</div>`
          : ""
      }
    </div>
    <div class="detail-content">
      <p class="eyebrow">${categoryLabels[entity.category]} · ${escapeHtml(entity.cityRegion)}</p>
      <h2 class="display-sm">${escapeHtml(entity.name)}</h2>
      ${
        fit.lines.length
          ? `
      <div class="fit-box ${fit.inPlan ? "in-plan" : ""}">
        <p class="fit-title">${ICON.pin} ${fit.inPlan ? "In your trip" : "How it fits your trip"}</p>
        <ul>${fit.lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>
      </div>`
          : ""
      }
      <p class="detail-why">${escapeHtml(entity.shortDescription)}</p>
      <dl class="detail-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`).join("")}</dl>
      <div class="detail-practical">
        <p>${practicalNote(entity)}</p>
        <p class="muted">${escapeHtml(addressText(entity))}${google?.phoneNumber ? ` · ${escapeHtml(google.phoneNumber)}` : ""}</p>
        ${google ? `<p class="muted">Place data: <a href="${escapeHtml(google.googleMapsUrl)}" target="_blank" rel="noreferrer">Google Maps</a></p>` : ""}
        ${google?.weekdayDescriptions?.length ? `<details><summary>Opening hours</summary>${google.weekdayDescriptions.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</details>` : ""}
        ${(google?.photos || [])
          .flatMap((photo) => photo.authorAttributions || [])
          .map(
            (author) =>
              `<small class="muted">Photo: <a href="${escapeHtml(author.uri || google.googleMapsUrl)}" target="_blank" rel="noreferrer">${escapeHtml(author.displayName || "Google Maps contributor")}</a></small>`,
          )
          .join("")}
        ${!google && entity.image?.includes("unsplash.com") ? '<p class="muted">Illustrative photo · confirm details with the provider.</p>' : ""}
      </div>
      ${bookable || entity.category === "hotels" ? `<button class="status-line" data-toggle-booked="${entity.id}">Booking status ${statusChip(status)}<span class="muted">Your checklist only · ${status === "booked" ? "unmark" : "mark as booked"}</span></button>` : ""}
    </div>
    <div class="detail-actions">
      ${primary}
      <div class="detail-secondary">
        ${isGeo(entity) && !fit.inPlan ? `<a class="btn-ghost dark" href="${navUrl(entity)}" target="_blank" rel="noreferrer">Navigate</a>` : ""}
        ${website && !(bookable && !fit.inPlan && !isGeo(entity)) ? `<a class="btn-ghost dark" href="${website}" target="_blank" rel="noreferrer">${bookable ? dealAction(entity) : "Website"}</a>` : ""}
        <button class="btn-ghost dark" data-save="${entity.id}">${isSaved(entity.id) ? "Saved" : "Save"}</button>
      </div>
    </div>`;
  const dialog = $("#entityDialog");
  if (!dialog.open) dialog.showModal();
  dialog.querySelector(".dialog-scroll")?.scrollTo(0, 0);
}
function addToDay(id, dayIndex, pos) {
  const day = state.plan[dayIndex];
  if (!day) return;
  if (day.stops.includes(id)) return;
  day.stops = previewIds(day, { kind: "add", id, pos });
  day.estimatedCost = estimateDailyCost(day, currentInputs());
  refreshGeneratedPlan(`Added to Day ${dayIndex + 1}`);
}

/* ==========================================================================
   CONCIERGE
   ========================================================================== */
function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  $("#chatLog").appendChild(message);
  $("#chatLog").scrollTop = $("#chatLog").scrollHeight;
}
function conciergeReply(text) {
  const query = text.toLowerCase();
  if (query.includes("rain"))
    return "Rainy day: use Matenadaran, cafes like Mirzoyan Library, central restaurants and short city walks. Move Garni, Sevan, Dilijan and Tatev to clearer days.";
  if (query.includes("kid") || query.includes("family"))
    return "With family: Cascade, Republic Square, Sevan, Dilijan and a shorter Garni/Geghard route work well. Skip Tatev as a day trip unless everyone is fine with long drives.";
  if (query.includes("wine") || query.includes("food"))
    return "Food and wine: anchor evenings with Lavash, Sherep, Tavern Yerevan or In Vino, and use Khor Virap + Noravank as your southbound wine-route day.";
  if (query.includes("driver") || query.includes("car"))
    return "For countryside days, compare a driver with Hyur, Yerani or One Way Tour, or self-drive with Hertz or SIXT. Check My Trip to see which days still need transport.";
  if (query.includes("internet") || query.includes("esim"))
    return "Airalo and Nomad both sell Armenia eSIMs — set one up before you land so maps and messaging work from the airport.";
  const d = currentDayIndex();
  const p = dayPlan(state.plan[d]);
  return `Today is Day ${d + 1}: ${p.stops.map((s) => shortName(s.entity)).join(" → ")}. Ask me about rain, kids, food, wine, drivers or connectivity.`;
}

/* ==========================================================================
   NAVIGATION + RENDER ALL
   ========================================================================== */
function openScreen(screenId) {
  $$(".screen").forEach((screen) => screen.classList.toggle("active", screen.id === screenId));
  $$(".nav-item").forEach((item) =>
    item.classList.toggle("active", item.dataset.screen === screenId),
  );
  document.body.dataset.screen = screenId;
  window.scrollTo({ top: 0 });
  if (screenId === "mapScreen") {
    renderMap();
    ensureMap();
  }
}
function repaintAll() {
  renderAll();
}
function renderAll(loadRoutes = true) {
  renderToday();
  renderPlanner();
  renderMyTrip();
  renderDeals();
  if ($("#mapScreen")?.classList.contains("active")) renderMap();
  if (loadRoutes) syncRoadRoutes();
}

/* ---------- events ---------- */
document.addEventListener("click", (event) => {
  const t = event.target;
  const q = (sel) => t.closest(sel);

  const nav = q(".nav-item");
  if (nav) return openScreen(nav.dataset.screen);

  if (q("[data-open-concierge]")) return $("#conciergeDialog").showModal();

  const screenTarget = q("[data-screen-target]");
  if (screenTarget) {
    if ($("#entityDialog").open) $("#entityDialog").close();
    if (screenTarget.hasAttribute("data-map-whole")) state.mapWhole = true;
    if (
      screenTarget.dataset.screenTarget === "mapScreen" &&
      !screenTarget.hasAttribute("data-map-whole")
    ) {
      state.mapWhole = false;
      state.mapDay = null;
    }
    return openScreen(screenTarget.dataset.screenTarget);
  }

  const mapDay = q("[data-map-day]");
  if (mapDay) {
    state.mapWhole = false;
    state.mapDay = Number(mapDay.dataset.mapDay);
    state.selectedStop = null;
    state.preview = null;
    if (!$("#mapScreen").classList.contains("active")) openScreen("mapScreen");
    else renderMap(true);
    return;
  }
  const mapMode = q("[data-map-mode]");
  if (mapMode) {
    state.mapWhole = mapMode.dataset.mapMode === "whole";
    if (!state.mapWhole) state.mapDay = null;
    state.selectedStop = null;
    state.preview = null;
    return renderMap(true);
  }
  if (q("[data-map-fit]")) return drawMap(true);
  if (q("[data-map-retry]")) return ensureMap();

  const stop = q("[data-stop]");
  if (stop) return selectStop(stop.dataset.stop, Number(stop.dataset.stopDay));

  const suggest = q("[data-suggest]");
  if (suggest) {
    const day = Number(suggest.dataset.suggestDay);
    const index = Number(suggest.dataset.suggest);
    if (!$("#mapScreen").classList.contains("active")) {
      state.mapWhole = false;
      openScreen("mapScreen");
    }
    return startPreview(day, index);
  }
  if (q("[data-apply-preview]")) return applyPreview();
  if (q("[data-cancel-preview]")) {
    state.preview = null;
    return renderMap();
  }
  if (q("[data-adjust-toggle]")) {
    state.adjustOpen = !state.adjustOpen;
    return renderMap();
  }
  const mv = q("[data-move-stop]");
  if (mv) return moveStop(mv.dataset.moveStop, Number(mv.dataset.delta));
  const rm = q("[data-remove-stop]");
  if (rm) return removeStop(rm.dataset.removeStop);

  const dayAction = q("[data-day-action]");
  if (dayAction) return adjustDay(Number(dayAction.dataset.day), dayAction.dataset.dayAction);

  const mod = q("[data-trip-mod]");
  if (mod) return applyTripModifier(mod.dataset.tripMod);

  const explore = q("[data-explore]");
  if (explore) {
    state.exploreFilter = explore.dataset.explore;
    return renderToday();
  }

  const toggleDay = q("[data-toggle-day]");
  if (toggleDay && !q("#plannerRoot")) {
    const i = Number(toggleDay.dataset.toggleDay);
    if (state.expandedDays.has(i)) state.expandedDays.delete(i);
    else state.expandedDays.add(i);
    return renderMyTrip();
  }

  const issue = q("[data-issue]");
  if (issue) {
    const item = tripIssues()[Number(issue.dataset.issue)];
    if (!item) return;
    if (item.action) return adjustDay(item.day, item.action);
    if (item.open) return openEntityDetail(item.open);
    if (item.map != null) {
      state.mapWhole = false;
      state.mapDay = item.map;
      return openScreen("mapScreen");
    }
  }

  const booked = q("[data-toggle-booked]");
  if (booked) {
    const id = booked.dataset.toggleBooked;
    if (state.bookings[id] === "booked") delete state.bookings[id];
    else state.bookings[id] = "booked";
    persistTrip();
    renderAll();
    if ($("#entityDialog").open) openEntityDetail(id);
    return showToast(state.bookings[id] ? "Marked as booked" : "Marked as not booked");
  }

  const save = q("[data-save]");
  if (save) {
    const id = save.dataset.save;
    if (isSaved(id)) state.saved = state.saved.filter((x) => x !== id);
    else state.saved.push(id);
    persistSaved();
    renderAll();
    openEntityDetail(id);
    return showToast(isSaved(id) ? "Saved to My Trip" : "Removed from saved");
  }
  const unsave = q("[data-unsave]");
  if (unsave) {
    state.saved = state.saved.filter((x) => x !== unsave.dataset.unsave);
    persistSaved();
    return renderAll();
  }

  const addDay = q("[data-add-to-day]");
  if (addDay) {
    addToDay(addDay.dataset.addToDay, Number(addDay.dataset.day), Number(addDay.dataset.pos));
    return openEntityDetail(addDay.dataset.addToDay);
  }
  const addTrip = q("[data-add-trip]");
  if (addTrip) {
    const id = addTrip.dataset.addTrip;
    const entity = getEntityById(id);
    const target =
      entity.category === "esim"
        ? 0
        : Math.max(
            0,
            state.plan.findIndex((d) => d.driveLevel !== "none"),
          );
    if (state.plan[target] && !state.plan[target].stops.includes(id))
      state.plan[target].stops.push(id);
    return refreshGeneratedPlan(`Added to Day ${target + 1}`);
  }
  const book = q("[data-book]");
  if (book) {
    const entity = getEntityById(book.dataset.book);
    const url = googleFor(entity)?.website || entity.externalUrl;
    if (url) window.open(url, "_blank", "noopener");
    return;
  }

  if (q("[data-reset-trip]")) {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* Fresh state still applies for this visit. */
    }
    state.saved = [];
    state.bookings = {};
    state.startDate = "";
    state.planner = {
      ...defaultPlanner,
      startDate: "",
      interests: [...defaultPlanner.interests],
      anchors: [...defaultPlanner.anchors],
    };
    state.lastInputs = null;
    state.mapDay = null;
    state.selectedStop = null;
    state.preview = null;
    state.userBuilt = false;
    state.plannerView = "form";
    persistSaved();
    buildPlan(false);
    renderAll();
    return showToast("Trip reset");
  }

  // planner
  const field = q("[data-plan-field]");
  if (field) {
    state.planner[field.dataset.planField] = field.dataset.planValue;
    return renderPlanner();
  }
  const days = q("[data-plan-days]");
  if (days) {
    state.planner.days = Math.max(
      1,
      Math.min(7, state.planner.days + Number(days.dataset.planDays)),
    );
    return renderPlanner();
  }
  const interest = q("[data-plan-interest]");
  if (interest) {
    const v = interest.dataset.planInterest;
    state.planner.interests = state.planner.interests.includes(v)
      ? state.planner.interests.filter((x) => x !== v)
      : [...state.planner.interests, v];
    return renderPlanner();
  }
  const anchor = q("[data-plan-anchor]");
  if (anchor) {
    const v = anchor.dataset.planAnchor;
    state.planner.anchors = state.planner.anchors.includes(v)
      ? state.planner.anchors.filter((x) => x !== v)
      : [...state.planner.anchors, v];
    return renderPlanner();
  }
  if (q("[data-plan-more]")) {
    state.plannerMore = !state.plannerMore;
    return renderPlanner();
  }
  if (q("[data-plan-edit]")) {
    state.plannerView = "form";
    return renderPlanner();
  }
  if (q("[data-plan-build]")) {
    state.plannerView = "building";
    renderPlanner();
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      state.startDate = state.planner.startDate || "";
      state.selectedStop = null;
      state.preview = null;
      state.mapDay = null;
      buildPlan(true);
      state.plannerView = "result";
      state.expandedDays = new Set([0]);
      renderAll();
      showToast("Your Armenia trip is ready");
    }, 900);
    return;
  }

  const detail = q(".detail-button");
  if (detail && detail.dataset.id) return openEntityDetail(detail.dataset.id);
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-plan-date]")) state.planner.startDate = event.target.value;
});

$("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#chatInput");
  const text = input.value.trim();
  if (!text) return;
  addMessage("user", text);
  input.value = "";
  setTimeout(() => addMessage("assistant", conciergeReply(text)), 180);
});

$$("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

/* ---------- Google Places enrichment (silent; falls back to local data) ---------- */
async function loadGooglePlacesEnrichment() {
  try {
    const payload = {
      entities: armeniaEntities.map((e) => ({
        id: e.id,
        name: e.name,
        category: e.category,
        cityRegion: e.cityRegion,
        coordinates: e.coordinates,
      })),
    };
    const response = await fetch("/api/public/places-enrichment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return;
    const data = await response.json();
    state.googleReport = data.results || [];
    window.__armeniaGoogleReport = state.googleReport;
    if (data.status !== "ok") return;
    state.googlePlaces = state.googleReport.reduce((places, item) => {
      if (item.status === "matched" && item.google) places[item.id] = item;
      return places;
    }, {});
    renderAll();
  } catch (error) {
    console.warn(error);
  }
}

/* ---------- boot ---------- */
if (!state.plan.length) buildPlan(false);
persistTrip();
addMessage(
  "assistant",
  "Hi — I know your itinerary. Ask about rain, kids, food, wine, drivers or connectivity.",
);
initSheetDrag();
setSheet("half");
document.body.dataset.screen = "homeScreen";
renderAll();
loadGooglePlacesEnrichment();
export {
  state,
  dayPlan,
  currentDayIndex,
  tripPhase,
  routeSuggestions,
  openEntityDetail,
  buildPlan,
  renderAll,
  refreshGeneratedPlan,
};
