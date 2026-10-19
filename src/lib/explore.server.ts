import { createHmac } from "node:crypto";
import { guardRequest } from "./api-guard.server";

// Live places for the "Explore" categories, straight from Google Places.
// Results are cached for a day per category + language to keep Google costs low.

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const YEREVAN = { latitude: 40.1811, longitude: 44.5136 };
const MAX_RESULTS = 12;

export const EXPLORE_CATEGORIES: Record<string, string[]> = {
  food: ["Armenian restaurant Yerevan"],
  coffee: ["specialty coffee shop Yerevan"],
  wine: ["wine bar Yerevan"],
  bars: ["cocktail bar Yerevan"],
  clubs: ["night club Yerevan"],
  quests: ["escape room quest Yerevan"],
  spa: ["spa massage Yerevan"],
  money: ["VTB Bank Armenia ATM Yerevan", "currency exchange Yerevan"],
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
  "places.regularOpeningHours",
  "places.currentOpeningHours",
  "places.businessStatus",
  "places.photos",
].join(",");

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  websiteUri?: string;
  businessStatus?: string;
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  currentOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  photos?: { name?: string }[];
};

export type ExplorePlace = {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  reviews: number | null;
  openNow: boolean | null;
  hours: string[];
  mapsUrl: string | null;
  website: string | null;
  photo: string | null;
};

const globalScope = globalThis as unknown as {
  __haiqExploreCache?: Map<string, { at: number; places: ExplorePlace[] }>;
};
const cache = globalScope.__haiqExploreCache || new Map();
globalScope.__haiqExploreCache = cache;

function photoUrl(name: string | undefined, apiKey: string): string | null {
  if (!name) return null;
  const sig = createHmac("sha256", apiKey).update(name).digest("hex");
  return `/api/public/place-photo?name=${encodeURIComponent(name)}&w=600&h=450&sig=${sig}`;
}

export function normalizePlaces(places: GooglePlace[], apiKey: string): ExplorePlace[] {
  const seen = new Set<string>();
  const out: ExplorePlace[] = [];
  for (const p of places) {
    if (!p.id || seen.has(p.id) || !p.displayName?.text) continue;
    if (p.businessStatus && p.businessStatus !== "OPERATIONAL") continue;
    seen.add(p.id);
    const hours = p.currentOpeningHours || p.regularOpeningHours;
    out.push({
      id: p.id,
      name: p.displayName.text,
      address: p.formattedAddress || null,
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
      rating: typeof p.rating === "number" ? p.rating : null,
      reviews: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
      openNow: typeof hours?.openNow === "boolean" ? hours.openNow : null,
      hours: hours?.weekdayDescriptions || [],
      mapsUrl: p.googleMapsUri || null,
      website: p.websiteUri || null,
      photo: photoUrl(p.photos?.[0]?.name, apiKey),
    });
  }
  // Well-reviewed places first; a 5.0 from 3 reviews should not beat a 4.6 from 900.
  const score = (p: ExplorePlace) => (p.rating || 0) * Math.log10((p.reviews || 0) + 10);
  return out.sort((a, b) => score(b) - score(a)).slice(0, MAX_RESULTS);
}

async function search(query: string, lang: string, apiKey: string): Promise<GooglePlace[]> {
  const response = await fetch(SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: lang,
      regionCode: "AM",
      pageSize: 10,
      locationBias: { circle: { center: YEREVAN, radius: 15000 } },
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    console.error(`Explore search failed [${response.status}]`);
    throw new Error("google_error");
  }
  const data = (await response.json()) as { places?: GooglePlace[] };
  return data.places || [];
}

export async function exploreRequest(request: Request): Promise<Response> {
  const blocked = guardRequest(request, 40);
  if (blocked) return blocked;
  const params = new URL(request.url).searchParams;
  const category = params.get("cat") || "";
  const lang = params.get("lang") === "ru" ? "ru" : "en";
  const queries = EXPLORE_CATEGORIES[category];
  if (!queries) return Response.json({ status: "invalid_request" }, { status: 400 });

  const apiKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!apiKey) return Response.json({ status: "unavailable" }, { status: 503 });

  const key = `${category}:${lang}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS)
    return Response.json({ status: "ok", category, places: hit.places });

  try {
    const results = (await Promise.all(queries.map((q) => search(q, lang, apiKey)))).flat();
    const places = normalizePlaces(results, apiKey);
    cache.set(key, { at: Date.now(), places });
    return Response.json({ status: "ok", category, places });
  } catch {
    return Response.json({ status: "provider_error" }, { status: 502 });
  }
}
