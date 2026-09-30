# Lovable Transfer Brief

Goal: move the current Armenia AI Travel app into Lovable without rebuilding or changing product logic.

## Import Priority

1. Import the repository exactly as-is.
2. Confirm the app renders and navigation works.
3. Confirm the deterministic Planner can generate a trip.
4. Confirm Today, My Trip, Map, Deals, and place detail dialogs still work.
5. Only after that, begin redesign work.

## Current App Behavior To Preserve

- The app starts on Today/Home.
- The Home screen is a cinematic AI trip cockpit.
- Planner uses a step-by-step trip creation flow.
- Planner writes into the existing deterministic route generator.
- Generated trips are saved into My Trip and shown on Map.
- Place details use local data with Google enrichment when available.
- Deals are contextual/demo marketplace cards unless marked by actual data.

## Environment

Set this in deployment/runtime settings if Google Places should work:

```text
GOOGLE_MAPS_API_KEY
```

Without the variable, the app should gracefully fall back to local seed data.
