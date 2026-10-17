import { createFileRoute } from "@tanstack/react-router";
import { nativePreflight, withNativeCors } from "../../../lib/api-guard.server";
import { araChat } from "../../../lib/ara.server";

export const Route = createFileRoute("/api/public/ara-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => withNativeCors(request, await araChat(request)),
      OPTIONS: ({ request }) => nativePreflight(request),
    },
  },
});
