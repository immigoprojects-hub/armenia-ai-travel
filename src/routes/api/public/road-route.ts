import { createFileRoute } from "@tanstack/react-router";
import { nativePreflight, withNativeCors } from "../../../lib/api-guard.server";
import { routeRequest } from "../../../lib/routing.server";

export const Route = createFileRoute("/api/public/road-route")({
  server: {
    handlers: {
      POST: async ({ request }) => withNativeCors(request, await routeRequest(request)),
      OPTIONS: ({ request }) => nativePreflight(request),
    },
  },
});
