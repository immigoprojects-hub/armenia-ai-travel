import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { armeniaEntities } from "../public/legacy/entities.js";

const uri = (code) => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const compile = (code) =>
  ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
const guard = uri(
  compile(await readFile(new URL("../src/lib/api-guard.server.ts", import.meta.url), "utf8")),
);
const routeCode = compile(
  await readFile(new URL("../src/lib/routing.server.ts", import.meta.url), "utf8"),
)
  .replace(
    "../../public/legacy/entities.js",
    new URL("../public/legacy/entities.js", import.meta.url).href,
  )
  .replace("./api-guard.server", guard);
const { routeRequest } = await import(uri(routeCode));
const req = (body) =>
  new Request("https://example.com/api/public/road-route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

test("Seed has exactly 30 unique entities and eSIM is not geographic", () => {
  assert.equal(armeniaEntities.length, 30);
  assert.equal(new Set(armeniaEntities.map((e) => e.id)).size, 30);
  assert.deepEqual(
    Object.fromEntries(
      [...new Set(armeniaEntities.map((e) => e.category))].map((category) => [
        category,
        armeniaEntities.filter((e) => e.category === category).length,
      ]),
    ),
    { attractions: 10, "restaurants-cafes": 8, hotels: 5, tours: 3, "car-rentals": 2, esim: 2 },
  );
});
test("Routing rejects arbitrary places, eSIM pins and cross-origin calls", async () => {
  assert.equal(
    (
      await routeRequest(
        req({ ids: ["yerevan-base", "airalo-armenia-esim"], profile: "driving-car" }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await routeRequest(req({ ids: ["yerevan-base", "invented"], profile: "driving-car" }))).status,
    400,
  );
  const forbidden = new Request("https://example.com/api/public/road-route", {
    method: "POST",
    headers: { origin: "https://other.example" },
    body: "{}",
  });
  assert.equal((await routeRequest(forbidden)).status, 403);
});
test("Ordered road geometry and times are returned, cached, and no key is exposed", async () => {
  const original = globalThis.fetch;
  const previous = process.env.ORS_API_KEY;
  process.env.ORS_API_KEY = "test-only-key";
  let calls = 0;
  globalThis.fetch = async (_url, options) => {
    calls++;
    const body = JSON.parse(options.body);
    assert.deepEqual(body.coordinates, [
      [44.5133, 40.1792],
      [44.7306, 40.1124],
      [44.8186, 40.1405],
    ]);
    return Response.json({
      features: [
        {
          geometry: {
            coordinates: [
              [44.5133, 40.1792],
              [44.6, 40.15],
              [44.7306, 40.1124],
              [44.8183, 40.1404],
            ],
          },
          properties: {
            segments: [
              { duration: 2520, distance: 28000 },
              { duration: 1200, distance: 11000 },
            ],
            summary: { duration: 3720, distance: 39000 },
          },
        },
      ],
    });
  };
  try {
    const body = {
      ids: ["yerevan-base", "garni-temple", "geghard-monastery"],
      profile: "driving-car",
    };
    const response = await routeRequest(req(body));
    assert.equal(response.status, 200);
    const value = await response.json();
    assert.deepEqual(
      value.legs.map((l) => l.minutes),
      [42, 20],
    );
    assert.equal(value.geometry.length, 4);
    assert.deepEqual(value.geometry[0], [40.1792, 44.5133]);
    assert.ok(!JSON.stringify(value).includes("test-only-key"));
    assert.equal((await routeRequest(req(body))).status, 200);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = original;
    if (previous) process.env.ORS_API_KEY = previous;
    else delete process.env.ORS_API_KEY;
  }
});
test("iOS app origin is allowed with CORS; other sites stay blocked", async () => {
  const { guardRequest, withNativeCors, nativePreflight } = await import(guard);
  const from = (origin, method = "POST") =>
    new Request("https://example.com/api/public/road-route", {
      method,
      headers: { origin, "Access-Control-Request-Method": "POST" },
    });

  assert.equal(guardRequest(from("capacitor://localhost")), null);
  assert.equal(guardRequest(from("https://example.com")), null);
  assert.equal(guardRequest(from("https://other.example"))?.status, 403);
  assert.equal(guardRequest(from("capacitor://evil.example"))?.status, 403);

  const native = withNativeCors(from("capacitor://localhost"), Response.json({ ok: true }));
  assert.equal(native.headers.get("access-control-allow-origin"), "capacitor://localhost");
  assert.deepEqual(await native.json(), { ok: true });
  const web = withNativeCors(from("https://example.com"), Response.json({ ok: true }));
  assert.equal(web.headers.get("access-control-allow-origin"), null);

  const preflight = nativePreflight(from("capacitor://localhost", "OPTIONS"));
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), "capacitor://localhost");
  assert.equal(nativePreflight(from("https://other.example", "OPTIONS")).status, 403);
});
test("Routing asks ORS for segments and parses its real GeoJSON shape", async () => {
  const original = globalThis.fetch;
  const previous = process.env.ORS_API_KEY;
  process.env.ORS_API_KEY = "test-only-key";
  // Mirrors openrouteservice: per-leg `segments` are only sent with instructions.
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    const properties = {
      summary: { distance: 64512.3, duration: 4321.6 },
      way_points: [0, 41, 97],
    };
    if (body.instructions !== false)
      properties.segments = [
        {
          distance: 45210.1,
          duration: 2950.4,
          steps: [{ distance: 45210.1, duration: 2950.4, type: 11, instruction: "Head east" }],
        },
        {
          distance: 19302.2,
          duration: 1371.2,
          steps: [{ distance: 19302.2, duration: 1371.2, type: 10, instruction: "Arrive" }],
        },
      ];
    return Response.json({
      type: "FeatureCollection",
      bbox: [44.4, 39.8, 44.6, 40.2],
      features: [
        {
          bbox: [44.4, 39.8, 44.6, 40.2],
          type: "Feature",
          properties,
          geometry: {
            type: "LineString",
            coordinates: [
              [44.5133, 40.1792],
              [44.5101, 40.0],
              [44.5763, 39.8784],
              [44.6, 39.85],
            ],
          },
        },
      ],
      metadata: { service: "routing", engine: { version: "9.0.0" } },
    });
  };
  try {
    const response = await routeRequest(
      req({ ids: ["yerevan-base", "khor-virap", "noravank"], profile: "driving-car" }),
    );
    assert.equal(response.status, 200);
    const value = await response.json();
    assert.deepEqual(
      value.legs.map((l) => l.minutes),
      [50, 23],
    );
    assert.equal(value.minutes, 73);
    assert.equal(value.geometry.length, 4);
  } finally {
    globalThis.fetch = original;
    if (previous) process.env.ORS_API_KEY = previous;
    else delete process.env.ORS_API_KEY;
  }
});
