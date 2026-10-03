# Armenia AI — Full Product Redesign

Turn Today, Map, Planner, My Trip, Deals and Place Details into one "Living Trip Cockpit", mobile-first, keeping all existing data, the Planner → My Trip flow and Google Places fallback.

## Design system (applies to every screen)
- Palette: deep Armenian wine, charcoal, warm ivory, restrained apricot accent. Dark cinematic surfaces only for Today hero, Map sheet and selected-stop moments; ivory for planning/utility.
- Type: refined modern sans for UI (e.g. "Geist" / "Inter Tight"-class, weights 400/500/600), one restrained serif accent (e.g. "Fraunces" light) for day titles only. No ultra-bold display text.
- One radius scale, one spacing scale, one icon style, one button hierarchy (primary / secondary / text). Fewer pills, borders and nested cards; more photography and route visuals.
- Restrained motion: sheet drag, pin select, route highlight, itinerary expand, screen cross-fade.

## Screens
1. **Today** — Day X of Y derived from trip start date (fallback Day 1). Hero photo + next stop, arrival/departure, a continuous route strip as the central object, remaining stops, booking/timing alerts. 2–3 contextual AI chips (Today is tight, Add lunch, Spend less, More local, Replace stop).
2. **Map (top priority, rebuilt)** — Real interactive map (OpenStreetMap-based tiles, no key needed). Today / Whole trip toggle, default Today; route fitted to view; numbered wine pins for stops, small bookmarks for saved, outlined dots for AI suggestions; no eSIM/service pins. Summary "3 stops · 2h 40m driving", leg times. Draggable bottom sheet timeline synced with pins. Selected stop: photo, arrival, duration, leg time, note, booking status, Navigate + Adjust stop. Route-aware suggestions ("Lunch near your route · +12 min") show a preview of the new route and times, applied only on "Apply change".
3. **Planner** — Compact single-screen start (duration/dates, budget, travelers, interests chips, transport, pace) with progressive "more options"; CTA "Build my trip". Result: itinerary as hero — Day chapters with continuous route, times, travel time, spend, transport, booking needs; modifiers Make it slower / Spend less / More nature / Less driving.
4. **My Trip** — Trip command center: dates, Day X of Y, today status, next major activity, full route, day chapters connected by a route line, transport, bookings with Booked / Not booked / Flexible / Needs attention, estimated spend, AI-detected issues. Saved places moved to a lower section.
5. **Deals** — Each deal tied to the trip ("Useful for Day 2", "Near tomorrow's route"), one primary action per type (View deal / Book / Check availability / Add to trip). Remove "Request" and all demo copy.
6. **Place Details** — Photo-led, why it matters, open status, time needed, price, practical info, and "How it fits my trip" (detour minutes, arrival impact), clear Add / Navigate actions.
7. **Cleanup** — Remove all debug/demo/API/status text (e.g. "Google Places enriched…", "Demo reset", "Demo lead"); keep proper loading/error states.

## Technical details
- Keep the existing vanilla architecture (app-shell.html + app.js + styles.css) and its data/logic; rewrite markup, styles and render functions, not the trip-building algorithms or API routes.
- Map via Leaflet + OSM/CARTO light tiles loaded client-side; travel times estimated from distance (same approach as today) — swapping in Google Directions later is an engineering task.
- AI suggestions/issues are deterministic rules on the current plan (no backend change); a real AI model can replace them later.
- Verify every screen at 390px width with Playwright (no overflow, sheet, tap targets, flows).
- GitHub: changes sync automatically to the connected repo; I can't run commits myself, so the commit hash will appear in GitHub/Lovable history.
- Update AGENTS.md rule since the redesign phase has started.

