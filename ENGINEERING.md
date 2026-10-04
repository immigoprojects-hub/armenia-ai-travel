# Engineering handoff

## Source recovery

GitHub main was `2caeeeb` (Unify app typography and visual system). The newer
Lovable redesign was not present there when inspected. This checkout recovers
the complete Lovable project at `4cc0eff4ff689b9944a2da0f1344e90211403c10`
from project `98cc7bdd-f561-42cc-a14e-77e793c45092` and applies engineering fixes.
The approved HTML/CSS is preserved, except technical overflow/error fixes.
Verify Lovable's GitHub connection before simultaneous edits in both environments.

## Run and verify

Use Node 24, `npm ci`, then `npm run dev`. Verification commands:
`npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e`,
and `npm run build`. Browser tests use installed Google Chrome.
Set `APP_URL` to test another deployment.

## Deployment and secrets

The TanStack Start server uses Nitro's Vercel preset. Deploy the repository root,
not the historical static output. Production alias: https://mvp-v01.vercel.app/.
The Vercel project is connected to this repository: every push to `main` deploys
to production automatically, and GitHub Actions CI runs typecheck, lint, unit
tests and build on pushes and pull requests.

- `GOOGLE_MAPS_API_KEY`: server-only; enable Places API (New). Existing production
  key was verified against the 30 entities: 28 physical matches, two eSIM providers
  intentionally excluded. Matching still merits manual location review before launch.
- `ORS_API_KEY`: server-only openrouteservice key; needed for live road geometry
  and durations. Without it, routes retain explicitly estimated travel and dashed
  direct lines. Provider parsing, ordering and cache behavior have automated tests.
- Never prefix these secrets with `VITE_` or commit environment files.

Routing accepts seed IDs only, at most 15 ordered waypoints. It has one-hour
bounded process-local caching and concurrent-request deduplication. Public API
origin checks and per-instance rate limits reduce misuse, but are not distributed
quota protection. Configure provider quotas and Vercel firewall before launch traffic.
Google photos are served through a signed, server-side proxy with attribution.
Places responses use a short cache; local metadata/photos remain the fallback.

## What is and is not live

Live: Google Places enrichment and external provider links, real OSM map tiles,
local deterministic planning, persistent itinerary/saved places, confirmed map edits.
Road routes become live only after ORS_API_KEY is configured and redeployed.
AI suggestions are rules, not an LLM. Costs are estimates, not quotes.
Booking markers are a personal checklist, not provider-confirmed reservations.
No authenticated account, payment, booking platform, or guaranteed partner discount.
OSM standard tiles are for modest compliant usage, not a production SLA; choose
a licensed tile provider before substantial traffic. No geolocation is implied by
the planned starting-point marker.

## Ownership

Lovable owns visual implementation. Engineering changes should preserve it.
The shared seed is `public/legacy/entities.js`; planner state and interactions are
in `public/legacy/app.js`. `trip-intelligence.js` isolates rule recommendation
selection so a future model can augment suggestions without owning mutations.

## iOS app (Capacitor)

The iOS app wraps the same legacy app; nothing is rewritten. `npm run build:native`
builds the site, assembles `native/www` (`scripts/build-native.mjs`: app-shell markup,
legacy JS/CSS, assets, plus `public/legacy/native.css`) and runs `cap sync ios`.
The Xcode project is `ios/App` (Swift Package Manager, no CocoaPods).

- API: the app has no server, so `window.ARMENIA_API_BASE` (default
  `https://mvp-v01.vercel.app`, override with `NATIVE_API_BASE`) prefixes `/api/public/*`.
  The API allows the app origin `capacitor://localhost` with CORS (`api-guard.server.ts`);
  every other cross-origin caller is still rejected.
- `public/legacy/native.js` is inert on the website. In the app it adds the
  Google Maps / Apple Maps choice to every Navigate button, uses the native
  location prompt, and switches the status bar text per screen.
- Map "Show my location" (both web and app) asks for location only when tapped.
- `.github/workflows/ios.yml` builds an unsigned simulator app on macOS, launches it,
  and uploads a screenshot. Signing and TestFlight need an Apple Developer account.
- Bundle id `com.armeniaai.travel` is a placeholder until the App Store record exists.
