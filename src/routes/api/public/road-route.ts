import { createFileRoute } from "@tanstack/react-router";
import { routeRequest } from "../../../lib/routing.server";

export const Route = createFileRoute("/api/public/road-route")({
  server: { handlers: { POST: ({ request }) => routeRequest(request) } },
});
