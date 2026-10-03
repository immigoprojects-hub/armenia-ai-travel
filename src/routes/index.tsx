import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import appShellHtml from "../legacy/app-shell.html?raw";

const LEGACY_SCRIPT_SRC = "/legacy/app.js";
const LEGACY_STYLES_HREF = "/legacy/styles.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Armenia AI Travel — Plan, navigate and book your Armenia trip" },
      {
        name: "description",
        content:
          "An AI-first Armenia trip operating system: daily plan, step-by-step planner, saved trip, map and local deals.",
      },
      { property: "og:title", content: "Armenia AI Travel" },
      {
        property: "og:description",
        content:
          "Plan Armenia day by day with an AI trip cockpit, deterministic route planner, map and curated local offers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif&display=swap",
      },
      { rel: "stylesheet", href: LEGACY_STYLES_HREF },
    ],
  }),
  component: ArmeniaApp,
});

function ArmeniaApp() {
  useEffect(() => {
    if (document.querySelector(`script[src="${LEGACY_SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = LEGACY_SCRIPT_SRC;
    script.onerror = () => {
      const root = document.querySelector("#todayRoot");
      if (root) root.textContent = "Your trip could not load. Please refresh and try again.";
    };
    document.body.appendChild(script);
  }, []);

  // The original app owns this markup and drives it imperatively from
  // /legacy/app.js. Do not convert to JSX: product logic must stay untouched.
  return <div dangerouslySetInnerHTML={{ __html: appShellHtml }} />;
}
