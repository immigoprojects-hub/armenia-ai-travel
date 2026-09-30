# Armenia AI Travel

Mobile-first Armenia AI Travel MVP. This is the existing app we built in Codex/Work and prepared for GitHub/Lovable transfer.

## Current Product

- Today/Home AI cockpit
- Trip creation flow in Planner
- Deterministic Armenia itinerary generator
- My Trip saved itinerary
- Map pins from entity coordinates
- Deals marketplace cards
- Place detail dialog
- 30-entity local Armenia travel dataset
- Optional Google Places enrichment through Vercel serverless functions

## Project Structure

```text
index.html                 Static app shell
styles.css                 Mobile-first visual system and screen styles
app.js                     Seed data, app state, trip planner, map/deals/detail logic
assets/                    Bundled local assets
api/places-enrichment.js   Serverless Google Places search/enrichment proxy
api/place-photo.js         Serverless Google Places photo proxy
```

## Environment Variables

`GOOGLE_MAPS_API_KEY` is optional for local fallback mode, but required for real Google Places metadata/photos.

If the key is missing, the app still works with the local seed dataset and bundled/local image fallbacks.

## Run Locally

For the static UI only, open `index.html` in a browser.

For the API routes, use Vercel:

```bash
npm run dev
```

## Lovable Handoff Notes

Do not rebuild from scratch. Import this repository as the existing product baseline.

Preserve these working pieces before redesign:

- Today cockpit
- Planner trip creation flow and deterministic planner logic
- My Trip
- Map
- Deals
- 30 local seed entities
- Google Places enrichment fallback behavior
- Existing navigation and detail dialogs

Redesign should happen only after the import is confirmed working.
