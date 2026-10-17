import { armeniaEntities } from "../../public/legacy/entities.js";
import { guardRequest } from "./api-guard.server";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-haiku-5-5";
const MAX_HISTORY = 8;
const MAX_TEXT = 600;

type Turn = { role: "user" | "assistant"; text: string };
type Entity = { id: string; name: string; category?: string; cityRegion?: string };

const placeIndex = (armeniaEntities as Entity[])
  .map((e) => `${e.id}: ${e.name} (${e.category ?? "place"}, ${e.cityRegion ?? "Armenia"})`)
  .join("\n");

function systemPrompt(lang: "en" | "ru", trip: string): string {
  return [
    "You are Ara, the friendly guide inside HAIQ — Armenia Travel Guide, a mobile app for tourists in Armenia.",
    "Personality: warm Armenian host, light humour, occasionally a word of Armenian (Barev, Shnorhakalutyun, Apres). Short answers: 2–4 sentences, or a short list.",
    `Always answer in ${lang === "ru" ? "Russian" : "English"}.`,
    "Help with: what to see and eat, planning a day, getting around (Yandex Go, minibuses), weather-appropriate ideas, first-day tips (eSIM, cash, AMD), the Upper Lars border in general terms.",
    "Never invent prices, opening hours, phone numbers, live exchange rates, border queue times or partner discounts. If you don't know, say so and suggest checking the place's details in the app or an official source.",
    "Coupons in the app are sample offers for now; do not promise real discounts.",
    "Prefer places from this catalogue (id: name) and mention them by name so the user can find them in the app:",
    placeIndex,
    trip
      ? `The user's current trip:\n${trip}`
      : "The user has no trip yet; suggest using the Planner.",
  ].join("\n");
}

function clean(value: unknown, max = MAX_TEXT): string {
  return typeof value === "string" ? value.slice(0, max).trim() : "";
}

export async function araChat(request: Request): Promise<Response> {
  const blocked = guardRequest(request, 20);
  if (blocked) return blocked;

  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) return Response.json({ status: "unavailable" }, { status: 503 });

  let body: { message?: unknown; history?: unknown; lang?: unknown; trip?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ status: "invalid_request" }, { status: 400 });
  }
  const message = clean(body.message);
  if (!message) return Response.json({ status: "invalid_request" }, { status: 400 });
  const lang = body.lang === "ru" ? "ru" : "en";
  const trip = clean(body.trip, 1500);
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
        max_tokens: 400,
        system: systemPrompt(lang, trip),
        messages: [...history, { role: "user", content: message }],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      console.error("Ara chat provider error", response.status);
      return Response.json({ status: "provider_error" }, { status: 502 });
    }
    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const reply = (data.content ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("")
      .trim();
    if (!reply) return Response.json({ status: "provider_error" }, { status: 502 });
    return Response.json({ status: "ok", reply });
  } catch (error) {
    console.error("Ara chat failed", error);
    return Response.json({ status: "provider_error" }, { status: 502 });
  }
}
