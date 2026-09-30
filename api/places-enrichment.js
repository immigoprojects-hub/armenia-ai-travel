const GOOGLE_PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;
const cache = globalThis.__armeniaPlacesCache || new Map();
globalThis.__armeniaPlacesCache = cache;

const CATEGORY_HINTS = {
  attractions: "tourist attraction",
  "restaurants-cafes": "restaurant cafe",
  hotels: "hotel",
  tours: "tour agency",
  "car-rentals": "car rental",
  esim: "travel eSIM"
};

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.regularOpeningHours",
  "places.currentOpeningHours",
  "places.priceLevel",
  "places.photos"
].join(",");

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=43200, stale-while-revalidate=86400");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 250000) reject(new Error("Request body too large"));
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function distanceKm(a, b) {
  if (!a || !b) return null;
  const radius = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function normalizePhoto(photo, entityId, index) {
  if (!photo?.name) return null;
  return {
    name: photo.name,
    widthPx: photo.widthPx || null,
    heightPx: photo.heightPx || null,
    url: `/api/place-photo?name=${encodeURIComponent(photo.name)}&w=900&h=680&entity=${encodeURIComponent(entityId)}&i=${index}`
  };
}

function normalizePlace(entity, place, confidence, distance) {
  const photos = (place.photos || []).slice(0, 6).map((photo, index) => normalizePhoto(photo, entity.id, index)).filter(Boolean);
  return {
    id: entity.id,
    status: "matched",
    confidence,
    distanceKm: distance,
    google: {
      placeId: place.id || null,
      displayName: place.displayName?.text || null,
      rating: typeof place.rating === "number" ? place.rating : null,
      reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      formattedAddress: place.formattedAddress || null,
      coordinates: place.location ? { lat: place.location.latitude, lng: place.location.longitude } : null,
      openNow: typeof place.currentOpeningHours?.openNow === "boolean"
        ? place.currentOpeningHours.openNow
        : typeof place.regularOpeningHours?.openNow === "boolean"
          ? place.regularOpeningHours.openNow
          : null,
      weekdayDescriptions: place.currentOpeningHours?.weekdayDescriptions || place.regularOpeningHours?.weekdayDescriptions || [],
      phoneNumber: place.internationalPhoneNumber || place.nationalPhoneNumber || null,
      website: place.websiteUri || null,
      googleMapsUrl: place.googleMapsUri || null,
      priceLevel: place.priceLevel || null,
      photos
    }
  };
}

function bestPlaceForEntity(entity, places) {
  return places.map((place) => {
    const location = place.location ? { lat: place.location.latitude, lng: place.location.longitude } : null;
    const distance = distanceKm(entity.coordinates, location);
    const placeName = (place.displayName?.text || "").toLowerCase();
    const entityName = entity.name.toLowerCase().replace(/\+/g, " ");
    const nameHit = placeName && (entityName.includes(placeName) || placeName.includes(entityName.split(",")[0]));
    const distanceScore = distance == null ? 0 : Math.max(0, 18 - distance);
    const score = (nameHit ? 20 : 0) + distanceScore + (place.rating || 0);
    return { place, distance, score };
  }).sort((a, b) => b.score - a.score)[0] || null;
}

async function searchEntity(entity, apiKey) {
  const cached = cache.get(entity.id);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) return cached.value;

  const body = {
    textQuery: `${entity.name} ${entity.cityRegion || "Armenia"} ${CATEGORY_HINTS[entity.category] || ""} Armenia`,
    languageCode: "en",
    regionCode: "AM",
    pageSize: 5
  };

  if (entity.coordinates?.lat && entity.coordinates?.lng) {
    body.locationBias = {
      circle: {
        center: { latitude: entity.coordinates.lat, longitude: entity.coordinates.lng },
        radius: entity.category === "tours" || entity.category === "car-rentals" ? 12000 : 3500
      }
    };
  }

  const response = await fetch(GOOGLE_PLACES_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return { id: entity.id, status: "error", message: `Google Places request failed: ${response.status}`, detail: (await response.text()).slice(0, 240) };
  }

  const best = bestPlaceForEntity(entity, (await response.json()).places || []);
  if (!best?.place) return { id: entity.id, status: "manual_match_needed", message: "No Google Places result returned for this seed entity." };

  const needsManualReview =
    entity.category !== "esim" &&
    typeof best.distance === "number" &&
    best.distance > (entity.category === "tours" || entity.category === "car-rentals" ? 15 : 8);

  const result = needsManualReview
    ? { ...normalizePlace(entity, best.place, "needs_review", best.distance), status: "manual_match_needed", message: "Best match is far from the seed coordinates; verify manually before trusting it." }
    : normalizePlace(entity, best.place, best.distance == null ? "name" : "name_and_location", best.distance);

  cache.set(entity.id, { createdAt: Date.now(), value: result });
  return result;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { error: "Use POST with the current seed entities." });
    return;
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    json(res, 200, { status: "missing_api_key", message: "Set GOOGLE_MAPS_API_KEY in Vercel to enable Google Places enrichment.", results: [] });
    return;
  }

  try {
    const parsed = JSON.parse((await readBody(req)) || "{}");
    const entities = Array.isArray(parsed.entities) ? parsed.entities.slice(0, 30) : [];
    if (!entities.length) {
      json(res, 400, { error: "No entities supplied." });
      return;
    }

    const results = [];
    for (const entity of entities) {
      if (entity?.id && entity?.name) results.push(await searchEntity(entity, apiKey));
    }

    json(res, 200, { status: "ok", generatedAt: new Date().toISOString(), results });
  } catch (error) {
    json(res, 500, { status: "error", message: error.message || "Could not enrich places." });
  }
};
