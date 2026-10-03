<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project structure rules

- The Armenia AI app stays a vanilla HTML/CSS/JS app hosted by the TanStack shell: markup in
  `src/legacy/app-shell.html`, behaviour in `public/legacy/app.js` (original data + trip-building rules
  at the top, redesigned UI layer below), styling in `public/legacy/styles.css`. `src/routes/index.tsx`
  only injects the markup and loads the script — keeps the original logic intact without a React port.
- The Map uses Leaflet with free OSM/CARTO tiles loaded at runtime; travel times are distance-based
  estimates until a directions provider is connected.
- Google Places enrichment and the photo proxy live in `src/routes/api/public/` because
  external-facing endpoints must sit under `/api/public/*` to bypass the published-site auth wall.

