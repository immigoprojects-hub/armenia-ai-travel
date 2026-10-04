const requests = new Map<string, { count: number; until: number }>();

// The iOS app (Capacitor) serves its bundled UI from this origin and calls the
// deployed API cross-origin. Browsers can't send this origin from a website, so
// allowing it doesn't open the API to other sites.
const NATIVE_APP_ORIGINS = new Set(["capacitor://localhost"]);

function nativeAppOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  return origin && NATIVE_APP_ORIGINS.has(origin) ? origin : null;
}

export function guardRequest(request: Request, limit = 60): Response | null {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin && !nativeAppOrigin(request)) {
    return Response.json({ status: "forbidden" }, { status: 403 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const key = `${new URL(request.url).pathname}:${ip}`;
  const now = Date.now();
  if (requests.size > 2000) for (const [k, v] of requests) if (v.until < now) requests.delete(k);
  const entry = requests.get(key);
  if (entry && entry.until > now) {
    if (entry.count >= limit)
      return Response.json(
        { status: "rate_limited" },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    entry.count++;
  } else requests.set(key, { count: 1, until: now + 60000 });
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 20000) return Response.json({ status: "invalid_request" }, { status: 413 });
  return null;
}

/** Adds CORS headers for the native app's origin; other responses pass through unchanged. */
export function withNativeCors(request: Request, response: Response): Response {
  const origin = nativeAppOrigin(request);
  if (!origin) return response;
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.append("Vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** CORS preflight: answered only for the native app's origin. */
export function nativePreflight(request: Request): Response {
  const origin = nativeAppOrigin(request);
  if (!origin) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    },
  });
}
