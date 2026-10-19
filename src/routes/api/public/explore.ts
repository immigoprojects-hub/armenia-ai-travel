import { createFileRoute } from "@tanstack/react-router";
import { nativePreflight, withNativeCors } from "../../../lib/api-guard.server";
import { exploreRequest } from "../../../lib/explore.server";

export const Route = createFileRoute("/api/public/explore")({
  server: {
    handlers: {
      GET: async ({ request }) => withNativeCors(request, await exploreRequest(request)),
      OPTIONS: ({ request }) => nativePreflight(request),
    },
  },
});
