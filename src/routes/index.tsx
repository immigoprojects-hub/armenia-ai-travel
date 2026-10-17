import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import appShellHtml from "../legacy/app-shell.html?raw";

// Temporary visuals until final Ara artwork and partner photos arrive.
const araImage = "/assets/ara.svg";
const foodImage = "/assets/republic-square-yerevan.jpg";
const courtyardImage = "/assets/cascade-complex-yerevan.jpg";

const LEGACY_SCRIPT_SRC = "/legacy/app.js";
const LEGACY_STYLES_HREF = "/legacy/styles.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HAIQ — Armenia Travel Guide" },
      {
        name: "description",
        content:
          "Explore Armenia with Ara, your friendly travel guide. Plan your days, discover nearby places and collect local coupons in English or Russian.",
      },
      { property: "og:title", content: "HAIQ — Armenia Travel Guide" },
      {
        property: "og:description",
        content:
          "Meet Ara and discover Armenia through daily plans, nearby discoveries and local offers in English and Russian.",
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
    document.documentElement.dataset["araImage"] = araImage;
    document.documentElement.dataset["foodImage"] = foodImage;
    document.documentElement.dataset["courtyardImage"] = courtyardImage;
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
  return (
    <div dangerouslySetInnerHTML={{ __html: appShellHtml.replaceAll("__ARA_IMAGE__", araImage) }} />
  );
}
