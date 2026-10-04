import { createFileRoute } from "@tanstack/react-router";
import { createHmac } from "node:crypto";
import { armeniaEntities } from "../../../../public/legacy/entities.js";
import { guardRequest, nativePreflight, withNativeCors } from "../../../lib/api-guard.server";

const GOOGLE_PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const CACHE_TTL_MS = 1000 * 60 * 5;

type Coordinates = { lat: number; lng: number };
type Photo = {
  name?: string;
  widthPx?: number;
  heightPx?: number;
  authorAttributions?: { displayName?: string; uri?: string }[];
};
type Place = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  currentOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  priceLevel?: string;
  photos?: Photo[];
};
type Entity = {
  id: string;
  name: string;
  category?: string;
  cityRegion?: string;
  coordinates?: Coordinates | null;
};

const globalScope = globalThis as unknown as {
  __armeniaPlacesCache?: Map<string, { createdAt: number; value: unknown }>;
};
const cache = globalScope.__armeniaPlacesCache || new Map();
globalScope.__armeniaPlacesCache = cache;

const CATEGORY_HINTS: Record<string, string> = {
  attractions: "tourist attraction",
  "restaurants-cafes": "restaurant cafe",
  hotels: "hotel",
  tours: "tour agency",
  "car-rentals": "car rental",
  esim: "travel eSIM",
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
  "places.photos",
].join(",");

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

function distanceKm(a?: Coordinates | null, b?: Coordinates | null) {
  if (!a || !b) return null;
  const radius = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function normalizePhoto(photo: Photo, entityId: string, index: number) {
  if (!photo?.name) return null;
  const signature = createHmac("sha256", process.env["GOOGLE_MAPS_API_KEY"] || "")
    .update(photo.name)
    .digest("hex");
  return {
    name: photo.name,
    widthPx: photo.widthPx || null,
    heightPx: photo.heightPx || null,
    url: `/api/public/place-photo?name=${encodeURIComponent(photo.name)}&w=900&h=680&sig=${signature}`,
    authorAttributions: photo.authorAttributions || [],
  };
}

function normalizePlace(entity: Entity, place: Place, confidence: string, distance: number | null) {
  const photos = (place.photos || [])
    .slice(0, 6)
    .map((photo: Photo, index: number) => normalizePhoto(photo, entity.id, index))
    .filter(Boolean);
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
      coordinates: place.location
        ? { lat: place.location.latitude, lng: place.location.longitude }
        : null,
      openNow:
        typeof place.currentOpeningHours?.openNow === "boolean"
          ? place.currentOpeningHours.openNow
          : typeof place.regularOpeningHours?.openNow === "boolean"
            ? place.regularOpeningHours.openNow
            : null,
      weekdayDescriptions:
        place.currentOpeningHours?.weekdayDescriptions ||
        place.regularOpeningHours?.weekdayDescriptions ||
        [],
      phoneNumber: place.internationalPhoneNumber || place.nationalPhoneNumber || null,
      website: place.websiteUri || null,
      googleMapsUrl: place.googleMapsUri || null,
      priceLevel: place.priceLevel || null,
      photos,
    },
  };
}

function bestPlaceForEntity(entity: Entity, places: Place[]) {
  return (
    places
      .map((place) => {
        const location = place.location
          ? { lat: place.location.latitude, lng: place.location.longitude }
          : null;
        const distance = distanceKm(entity.coordinates, location);
        const placeName = (place.displayName?.text || "").toLowerCase();
        const entityName = entity.name.toLowerCase().replace(/\+/g, " ");
        const tokens = entityName
          .split(/[^a-z0-9]+/)
          .filter(
            (t) =>
              t.length > 2 &&
              !["armenia", "yerevan", "restaurant", "hotel", "monastery", "temple"].includes(t),
          );
        const nameHit = tokens.some((t) => placeName.includes(t));
        const distanceScore = distance == null ? 0 : Math.max(0, 18 - distance);
        const score = (nameHit ? 20 : 0) + distanceScore + (place.rating || 0);
        return { place, distance, score, nameHit };
      })
      .sort((a, b) => b.score - a.score)[0] || null
  );
}

async function searchEntity(entity: Entity, apiKey: string) {
  const cached = cache.get(entity.id);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) return cached.value;

  const body: Record<string, unknown> = {
    textQuery: `${entity.name} ${entity.cityRegion || "Armenia"} ${
      CATEGORY_HINTS[entity.category || ""] || ""
    } Armenia`,
    languageCode: "en",
    regionCode: "AM",
    pageSize: 5,
  };

  if (entity.coordinates?.lat && entity.coordinates?.lng) {
    body["locationBias"] = {
      circle: {
        center: { latitude: entity.coordinates.lat, longitude: entity.coordinates.lng },
        radius: entity.category === "tours" || entity.category === "car-rentals" ? 12000 : 3500,
      },
    };
  }

  const response = await fetch(GOOGLE_PLACES_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    console.error(`Google Places search failed [${response.status}]: ${detail}`);
    return {
      id: entity.id,
      status: "error",
      message: `Google Places request failed: ${response.status}`,
      detail,
    };
  }

  const best = bestPlaceForEntity(
    entity,
    ((await response.json()) as { places?: Place[] }).places || [],
  );
  if (!best?.place) {
    return {
      id: entity.id,
      status: "manual_match_needed",
      message: "No Google Places result returned for this seed entity.",
    };
  }

  const needsManualReview =
    !best.nameHit ||
    (entity.category !== "esim" &&
      typeof best.distance === "number" &&
      best.distance > (entity.category === "tours" || entity.category === "car-rentals" ? 15 : 8));

  const result = needsManualReview
    ? {
        ...normalizePlace(entity, best.place, "needs_review", best.distance),
        status: "manual_match_needed",
        message: "Best match is far from the seed coordinates; verify manually before trusting it.",
      }
    : normalizePlace(
        entity,
        best.place,
        best.distance == null ? "name" : "name_and_location",
        best.distance,
      );

  cache.set(entity.id, { createdAt: Date.now(), value: result });
  return result;
}

export const Route = createFileRoute("/api/public/places-enrichment")({
  server: {
    handlers: {
      POST: async ({ request }) => withNativeCors(request, await enrichPlaces(request)),
      OPTIONS: ({ request }) => nativePreflight(request),
    },
  },
});

async function enrichPlaces(request: Request): Promise<Response> {
  const rejected = guardRequest(request, 8);
  if (rejected) return rejected;
  const apiKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!apiKey || apiKey === "[SENSITIVE]") {
    return json(200, {
      status: "missing_api_key",
      message: "Set GOOGLE_MAPS_API_KEY to enable Google Places enrichment.",
      results: [],
    });
  }

  try {
    const parsed = (await request.json()) as { entities?: Entity[] };
    const requested = Array.isArray(parsed?.entities) ? parsed.entities.slice(0, 30) : [];
    const entities = [...new Set(requested.map((e) => e?.id))]
      .map((id) => armeniaEntities.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));
    if (!entities.length) return json(400, { error: "No entities supplied." });

    const results: unknown[] = [];
    for (let i = 0; i < entities.length; i += 3) {
      results.push(
        ...(await Promise.all(
          entities
            .slice(i, i + 3)
            .map((entity) =>
              entity.category === "esim"
                ? { id: entity.id, status: "not_applicable" }
                : searchEntity(entity, apiKey),
            ),
        )),
      );
    }

    return json(200, { status: "ok", generatedAt: new Date().toISOString(), results });
  } catch (error) {
    console.error("Places enrichment error", error);
    return json(500, {
      status: "error",
      message: "Place data is temporarily unavailable.",
    });
  }
}
