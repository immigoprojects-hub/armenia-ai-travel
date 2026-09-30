const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;

function sendText(res, statusCode, message) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(message);
}

module.exports = async function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    sendText(res, 404, "Google Places photo proxy is not configured.");
    return;
  }

  const rawName = req.query?.name;
  const name = Array.isArray(rawName) ? rawName[0] : rawName;
  if (!name || !/^places\/[^/]+\/photos\/[^/]+$/.test(name)) {
    sendText(res, 400, "Missing or invalid Google photo name.");
    return;
  }

  const width = Math.min(Math.max(Number(req.query?.w) || 900, 120), 1600);
  const height = Math.min(Math.max(Number(req.query?.h) || 680, 120), 1600);
  const url = new URL(`https://places.googleapis.com/v1/${name}/media`);
  url.searchParams.set("maxWidthPx", String(width));
  url.searchParams.set("maxHeightPx", String(height));
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      sendText(res, response.status, "Could not load Google Places photo.");
      return;
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());
    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`);
    res.end(buffer);
  } catch (error) {
    sendText(res, 500, "Could not proxy Google Places photo.");
  }
};
