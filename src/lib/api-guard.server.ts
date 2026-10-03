const requests = new Map<string, { count: number; until: number }>();

export function guardRequest(request: Request, limit = 60): Response | null {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
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
