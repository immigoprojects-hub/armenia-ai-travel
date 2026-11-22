import { createFileRoute } from "@tanstack/react-router";
import { nativePreflight, withNativeCors } from "../../../lib/api-guard.server";
import { nearbyRequest } from "../../../lib/nearby.server";

export const Route = createFileRoute("/api/public/nearby")({
  server: {
    handlers: {
      GET: async ({ request }) => withNativeCors(request, await nearbyRequest(request)),
      OPTIONS: ({ request }) => nativePreflight(request),
    },
  },
});
