import { guardRequest } from "./api-guard.server";
import { FIELD_MASK, normalizePlaces, type ExplorePlace, type GooglePlace } from "./explore.server";

// "Near me": real places around the traveller's position, nearest first (Google Places Nearby).
// Positions are rounded to ~100 m before caching, so one Google call serves everyone on the block.

const NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const RADIUS_M = 1500;
const MAX_CACHE = 2000;

export const NEARBY_KINDS: Record<string, string[]> = {
  all: ["restaurant", "cafe", "bar", "tourist_attraction", "museum"],
  food: ["restaurant"],
  coffee: ["cafe", "coffee_shop"],
  bars: ["bar", "wine_bar", "night_club"],
  sights: ["tourist_attraction", "museum", "art_gallery", "park", "church"],
};

// Rough box around Armenia: outside it the app has nothing local to say.
export function inArmenia(lat: number, lng: number): boolean {
  return lat > 38.8 && lat < 41.35 && lng > 43.4 && lng < 46.7;
}

const globalScope = globalThis as unknown as {
  __haiqNearbyCache?: Map<string, { at: number; places: ExplorePlace[] }>;
};
const cache = globalScope.__haiqNearbyCache || new Map();
globalScope.__haiqNearbyCache = cache;

async function searchNearby(
  types: string[],
  lat: number,
  lng: number,
  lang: string,
  apiKey: string,
): Promise<GooglePlace[]> {
  const response = await fetch(NEARBY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: types,
      maxResultCount: 20,
      rankPreference: "DISTANCE",
      languageCode: lang,
      regionCode: "AM",
      locationRestriction: {
        circle: { center: { latitude: lat, longitude: lng }, radius: RADIUS_M },
      },
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    console.error(`Nearby search failed [${response.status}]`);
    throw new Error("google_error");
  }
  const data = (await response.json()) as { places?: GooglePlace[] };
  return data.places || [];
}

export async function nearbyRequest(request: Request): Promise<Response> {
  const blocked = guardRequest(request, 30);
  if (blocked) return blocked;
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind") || "all";
  const lang = params.get("lang") === "ru" ? "ru" : "en";
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  const types = NEARBY_KINDS[kind];
  if (!types || !Number.isFinite(lat) || !Number.isFinite(lng))
    return Response.json({ status: "invalid_request" }, { status: 400 });
  if (!inArmenia(lat, lng)) return Response.json({ status: "outside" });

  const apiKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!apiKey) return Response.json({ status: "unavailable" }, { status: 503 });

  const rlat = Math.round(lat * 1000) / 1000;
  const rlng = Math.round(lng * 1000) / 1000;
  const key = `${kind}:${lang}:${rlat}:${rlng}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS)
    return Response.json({ status: "ok", kind, places: hit.places });

  try {
    const results = await searchNearby(types, rlat, rlng, lang, apiKey);
    const places = normalizePlaces(results, apiKey, { byRating: false, limit: 20 });
    if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value as string);
    cache.set(key, { at: Date.now(), places });
    return Response.json({ status: "ok", kind, places });
  } catch {
    return Response.json({ status: "provider_error" }, { status: 502 });
  }
}
