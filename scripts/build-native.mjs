// Assembles the iOS app's web bundle (native/www) from the production web build.
// Run via `npm run build:native` (vite build → this script → cap sync ios).
// The app ships the same legacy HTML/CSS/JS as the website; only the API calls go to
// the deployed site (NATIVE_API_BASE), because the bundled app has no server of its own.
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const staticDir = path.join(root, ".vercel/output/static");
const outDir = path.join(root, "native/www");
const apiBase = (process.env.NATIVE_API_BASE || "https://mvp-v01.vercel.app").replace(/\/+$/, "");

if (!/^https:\/\/[^/]+$/.test(apiBase)) {
  throw new Error(`NATIVE_API_BASE must be an https origin, got "${apiBase}"`);
}
if (!existsSync(staticDir)) {
  throw new Error("Missing .vercel/output/static — run `npm run build` first.");
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

// Static files the legacy app references by absolute path (/legacy, /vendor, /assets).
for (const dir of ["legacy", "vendor"]) {
  await cp(path.join(staticDir, dir), path.join(outDir, dir), { recursive: true });
}
// Images and the compiled Tailwind base stylesheet; the React shell's JS is not needed.
const assets = await readdir(path.join(staticDir, "assets"));
await mkdir(path.join(outDir, "assets"));
for (const file of assets.filter((f) => !f.endsWith(".js"))) {
  await cp(path.join(staticDir, "assets", file), path.join(outDir, "assets", file));
}
const baseCss = assets.filter((f) => /^styles-.*\.css$/.test(f));
if (baseCss.length !== 1) throw new Error(`Expected one base stylesheet, found ${baseCss}`);
if (existsSync(path.join(staticDir, "favicon.ico")))
  await cp(path.join(staticDir, "favicon.ico"), path.join(outDir, "favicon.ico"));

const appShell = await readFile(path.join(root, "src/legacy/app-shell.html"), "utf8");

// Mirrors the <head> the TanStack shell renders (src/routes/__root.tsx + index.tsx).
const html = `<!doctype html>
<html lang="en" class="native-app">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="format-detection" content="telephone=no" />
    <title>Armenia AI</title>
    <link rel="stylesheet" href="/assets/${baseCss[0]}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif&display=swap" />
    <link rel="stylesheet" href="/legacy/styles.css" />
    <link rel="stylesheet" href="/legacy/native.css" />
    <script>window.ARMENIA_API_BASE = ${JSON.stringify(apiBase)};</script>
  </head>
  <body>
    <div>${appShell}</div>
    <script type="module" src="/legacy/app.js" onerror="document.querySelector('#todayRoot').textContent='Your trip could not load. Please restart the app.'"></script>
  </body>
</html>
`;
await writeFile(path.join(outDir, "index.html"), html);
console.log(`native/www ready (API: ${apiBase})`);
