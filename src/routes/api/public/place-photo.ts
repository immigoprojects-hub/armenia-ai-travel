import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { guardRequest } from "../../../lib/api-guard.server";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;

function text(status: number, message: string) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/public/place-photo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const rejected = guardRequest(request, 100);
        if (rejected) return rejected;
        const apiKey = process.env["GOOGLE_MAPS_API_KEY"];
        if (!apiKey) return text(404, "Google Places photo proxy is not configured.");

        const params = new URL(request.url).searchParams;
        const name = params.get("name");
        if (!name || !/^places\/[^/]+\/photos\/[^/]+$/.test(name)) {
          return text(400, "Missing or invalid Google photo name.");
        }
        const signature = params.get("sig") || "";
        const expected = createHmac("sha256", apiKey).update(name).digest("hex");
        if (
          signature.length !== expected.length ||
          !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
        )
          return text(403, "Invalid photo request.");

        const width = Math.min(Math.max(Number(params.get("w")) || 900, 120), 1600);
        const height = Math.min(Math.max(Number(params.get("h")) || 680, 120), 1600);
        const url = new URL(`https://places.googleapis.com/v1/${name}/media`);
        url.searchParams.set("maxWidthPx", String(width));
        url.searchParams.set("maxHeightPx", String(height));
        url.searchParams.set("key", apiKey);

        try {
          const response = await fetch(url, {
            redirect: "follow",
            signal: AbortSignal.timeout(12000),
          });
          if (!response.ok) {
            console.error(
              `Google Places photo failed [${response.status}]: ${(await response.text()).slice(0, 240)}`,
            );
            return text(response.status, "Could not load Google Places photo.");
          }

          return new Response(await response.arrayBuffer(), {
            status: 200,
            headers: {
              "Content-Type": response.headers.get("content-type") || "image/jpeg",
              "Cache-Control": "private, no-store",
            },
          });
        } catch (error) {
          console.error("Google Places photo proxy error", error);
          return text(500, "Could not proxy Google Places photo.");
        }
      },
    },
  },
});
