import { armeniaEntities } from "../../public/legacy/entities.js";
import { guardRequest } from "./api-guard.server";

export type RoadRoute = {
  status: "ok";
  provider: "openrouteservice";
  geometry: [number, number][];
  legs: { minutes: number; distanceMeters: number }[];
  minutes: number;
  distanceMeters: number;
};
const base = { lat: 40.1792, lng: 44.5133 };
const cache = new Map<string, { expires: number; value: RoadRoute }>();
const pending = new Map<string, Promise<RoadRoute>>();
const geoCategories = new Set(["attractions", "restaurants-cafes", "hotels"]);

export async function routeRequest(request: Request): Promise<Response> {
  const rejected = guardRequest(request, 40);
  if (rejected) return rejected;
  let body: { ids?: unknown; profile?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ status: "invalid_request" }, { status: 400 });
  }
  const ids = body.ids;
  const profile = body.profile;
  if (
    !Array.isArray(ids) ||
    ids.length < 2 ||
    ids.length > 15 ||
    !["driving-car", "foot-walking"].includes(String(profile))
  ) {
    return Response.json({ status: "invalid_request" }, { status: 400 });
  }
  const points = ids.map((id) =>
    id === "yerevan-base"
      ? base
      : armeniaEntities.find((e) => e.id === id && geoCategories.has(e.category))?.coordinates,
  );
  if (points.some((p) => !p)) return Response.json({ status: "invalid_stop" }, { status: 400 });
  const key = JSON.stringify([profile, ids]);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return Response.json(hit.value);
  const apiKey = process.env["ORS_API_KEY"];
  if (!apiKey)
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  try {
    let task = pending.get(key);
    if (!task) {
      task = (async () => {
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
          {
            method: "POST",
            headers: { Authorization: apiKey, "Content-Type": "application/json" },
            body: JSON.stringify({
              coordinates: points.map((p) => [p!.lng, p!.lat]),
              instructions: false,
            }),
            signal: AbortSignal.timeout(15000),
          },
        );
        if (!response.ok) throw new Error(`Routing provider returned ${response.status}`);
        const data = await response.json();
        const feature = data.features?.[0];
        const segments = feature?.properties?.segments;
        if (!feature?.geometry?.coordinates?.length || segments?.length !== ids.length - 1)
          throw new Error("Invalid route response");
        const value: RoadRoute = {
          status: "ok",
          provider: "openrouteservice",
          geometry: feature.geometry.coordinates.map((p: number[]) => [p[1], p[0]]),
          legs: segments.map((s: { duration: number; distance: number }) => ({
            minutes: Math.max(0, Math.ceil(s.duration / 60)),
            distanceMeters: s.distance,
          })),
          minutes: Math.ceil(feature.properties.summary.duration / 60),
          distanceMeters: feature.properties.summary.distance,
        };
        if (cache.size >= 300) cache.delete(cache.keys().next().value!);
        cache.set(key, { expires: Date.now() + 3600000, value });
        return value;
      })();
      pending.set(key, task);
    }
    return Response.json(await task, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch (error) {
    console.error("Route unavailable", error instanceof Error ? error.message : "Unknown error");
    return Response.json(
      { status: "unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  } finally {
    pending.delete(key);
  }
}
