import { armeniaEntities } from "../../public/legacy/entities.js";
import { guardRequest } from "./api-guard.server";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-haiku-5-5";
const MAX_HISTORY = 8;
const MAX_TEXT = 600;
const COUPON_IDS = ["lavash", "coffee", "wine", "tour"] as const;

type Turn = { role: "user" | "assistant"; text: string };
type Entity = { id: string; name: string; category?: string; cityRegion?: string };
export type AraAction =
  | { type: "add_to_plan"; placeId: string; day?: number }
  | { type: "show_on_map"; placeId: string }
  | { type: "open_place"; placeId: string }
  | { type: "open_coupon"; couponId: string };

const entities = armeniaEntities as Entity[];
const placeIds = new Set(entities.map((e) => e.id));
const placeIndex = entities
  .map((e) => `${e.id}: ${e.name} (${e.category ?? "place"}, ${e.cityRegion ?? "Armenia"})`)
  .join("\n");

// Tools let Ara act inside the app instead of only describing what to do.
// The client validates every action again before running it.
const TOOLS = [
  {
    name: "add_to_plan",
    description:
      "Add a place from the catalogue to the user's trip. Use when the user asks to add, include or plan a visit to a place.",
    input_schema: {
      type: "object",
      properties: {
        place_id: { type: "string", description: "Catalogue id of the place." },
        day: {
          type: "integer",
          description: "1-based trip day. Omit to use the current day.",
        },
      },
      required: ["place_id"],
    },
  },
  {
    name: "show_on_map",
    description: "Open the map focused on a place from the catalogue.",
    input_schema: {
      type: "object",
      properties: { place_id: { type: "string" } },
      required: ["place_id"],
    },
  },
  {
    name: "open_place",
    description: "Open the detail card of a place (photos, opening hours, rating, links).",
    input_schema: {
      type: "object",
      properties: { place_id: { type: "string" } },
      required: ["place_id"],
    },
  },
  {
    name: "open_coupon",
    description: "Open one of the app's sample coupons so the user can save its QR to the wallet.",
    input_schema: {
      type: "object",
      properties: { coupon_id: { type: "string", enum: [...COUPON_IDS] } },
      required: ["coupon_id"],
    },
  },
];

function systemPrompt(lang: "en" | "ru", trip: string, live: string): string {
  return [
    "You are Ara, the friendly guide inside HAIQ — Armenia Travel Guide, a mobile app for tourists in Armenia.",
    "Personality: warm Armenian host, light humour, occasionally a word of Armenian (Barev, Shnorhakalutyun, Apres). Short answers: 2–4 sentences, or a short list.",
    `Always answer in ${lang === "ru" ? "Russian" : "English"}.`,
    "Help with: what to see and eat, planning a day, getting around (Yandex Go, minibuses), weather-appropriate ideas, first-day tips (eSIM, cash, AMD), the Upper Lars border in general terms.",
    "You can act in the app with tools: add_to_plan, show_on_map, open_place, open_coupon. Use them when the user asks you to do something, or when one clear action obviously helps. Always also write a short sentence saying what you did.",
    "Opening hours, open-now status and ratings below come from Google and are the only ones you may state. Never invent prices, hours, phone numbers, live exchange rates, border queue times or partner discounts. If you don't know, say so and offer to open the place card.",
    "Coupons in the app are sample offers for now (lavash = Lavash restaurant, coffee = Mirzoyan Library café, wine = In Vino, tour = Yerevan Walks); do not promise real discounts.",
    "Catalogue (id: name). Only these ids work with tools:",
    placeIndex,
    live ? `Live place info (id | open now | today's hours | rating):\n${live}` : "",
    trip
      ? `The user's current trip:\n${trip}`
      : "The user has no trip yet; suggest using the Planner.",
  ]
    .filter(Boolean)
    .join("\n");
}

function clean(value: unknown, max = MAX_TEXT): string {
  return typeof value === "string" ? value.slice(0, max).trim() : "";
}

type ContentBlock =
  | { type: "text"; text?: string }
  | { type: "tool_use"; name?: string; input?: Record<string, unknown> };

export function toActions(content: ContentBlock[]): AraAction[] {
  const actions: AraAction[] = [];
  for (const block of content) {
    if (block.type !== "tool_use") continue;
    const input = block.input ?? {};
    const placeId = typeof input["place_id"] === "string" ? input["place_id"] : "";
    if (block.name === "open_coupon") {
      const couponId = String(input["coupon_id"] ?? "");
      if ((COUPON_IDS as readonly string[]).includes(couponId))
        actions.push({ type: "open_coupon", couponId });
      continue;
    }
    if (!placeIds.has(placeId)) continue;
    if (block.name === "add_to_plan") {
      const day = Number(input["day"]);
      actions.push(
        Number.isInteger(day) && day > 0
          ? { type: "add_to_plan", placeId, day }
          : { type: "add_to_plan", placeId },
      );
    } else if (block.name === "show_on_map") actions.push({ type: "show_on_map", placeId });
    else if (block.name === "open_place") actions.push({ type: "open_place", placeId });
  }
  return actions.slice(0, 3);
}

export async function araChat(request: Request): Promise<Response> {
  const blocked = guardRequest(request, 20);
  if (blocked) return blocked;

  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) return Response.json({ status: "unavailable" }, { status: 503 });

  let body: {
    message?: unknown;
    history?: unknown;
    lang?: unknown;
    trip?: unknown;
    live?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ status: "invalid_request" }, { status: 400 });
  }
  const message = clean(body.message);
  if (!message) return Response.json({ status: "invalid_request" }, { status: 400 });
  const lang = body.lang === "ru" ? "ru" : "en";
  const trip = clean(body.trip, 1500);
  const live = clean(body.live, 4000);
  const history = (Array.isArray(body.history) ? body.history : [])
    .slice(-MAX_HISTORY)
    .map((t: Turn) => ({
      role: t?.role === "assistant" ? "assistant" : "user",
      content: clean(t?.text),
    }))
    .filter((t) => t.content);
  // The API requires the conversation to start with a user turn.
  while (history.length && history[0]!.role !== "user") history.shift();

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env["ARA_MODEL"] || DEFAULT_MODEL,
        max_tokens: 500,
        // The long, stable instructions are cached so repeat questions cost less.
        system: [
          {
            type: "text",
            text: systemPrompt(lang, trip, live),
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: TOOLS,
        messages: [...history, { role: "user", content: message }],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      console.error("Ara chat provider error", response.status);
      return Response.json({ status: "provider_error" }, { status: 502 });
    }
    const data = (await response.json()) as { content?: ContentBlock[] };
    const content = data.content ?? [];
    const reply = content
      .filter((part) => part.type === "text")
      .map((part) => (part as { text?: string }).text ?? "")
      .join("")
      .trim();
    const actions = toActions(content);
    if (!reply && !actions.length)
      return Response.json({ status: "provider_error" }, { status: 502 });
    return Response.json({ status: "ok", reply, actions });
  } catch (error) {
    console.error("Ara chat failed", error);
    return Response.json({ status: "provider_error" }, { status: 502 });
  }
}
