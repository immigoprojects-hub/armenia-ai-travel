/* Native (iOS app) bridge for the legacy app.
   On the website every export here is inert: API calls stay relative, links behave as before.
   Inside the Capacitor app, native/www/index.html sets window.ARMENIA_API_BASE and the native
   runtime injects window.Capacitor with the registered plugins (no bundler needed). */

const capacitor = () => globalThis.Capacitor;
const plugin = (name) => capacitor()?.Plugins?.[name] || null;

export function isNativeApp() {
  return Boolean(capacitor()?.isNativePlatform?.());
}

const API_BASE = String(globalThis.ARMENIA_API_BASE || "").replace(/\/+$/, "");

/** Prefix same-site API paths with the production origin when running inside the app. */
export function apiUrl(path) {
  if (!API_BASE || typeof path !== "string" || !path.startsWith("/")) return path;
  return `${API_BASE}${path}`;
}

/* ---------- location ---------- */
function browserPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("unsupported"));
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/** Current device position as { lat, lng, accuracy }. Rejects with err.code "denied" when refused. */
export async function getDeviceLocation() {
  const options = { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 };
  const geo = isNativeApp() ? plugin("Geolocation") : null;
  try {
    const position = geo ? await geo.getCurrentPosition(options) : await browserPosition(options);
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
  } catch (error) {
    const message = String(error?.message || "");
    const denied = error?.code === 1 || /denied|permission/i.test(message);
    const failure = new Error(denied ? "Location permission denied" : "Location unavailable");
    failure.code = denied ? "denied" : "unavailable";
    throw failure;
  }
}

/* ---------- navigation hand-off ---------- */
function destinationFrom(href) {
  try {
    const url = new URL(href);
    if (!/(^|\.)google\.[a-z.]+$/.test(url.hostname) || !url.pathname.startsWith("/maps/dir"))
      return null;
    const match = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/.exec(url.searchParams.get("destination"));
    return match ? { lat: Number(match[1]), lng: Number(match[2]) } : null;
  } catch {
    return null;
  }
}

async function openExternal(url) {
  const launcher = plugin("AppLauncher");
  if (launcher) await launcher.openUrl({ url });
  else window.open(url, "_blank");
}

async function chooseNavigationApp(dest) {
  const google = `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}&travelmode=driving`;
  const apple = `https://maps.apple.com/?daddr=${dest.lat},${dest.lng}&dirflg=d`;
  const sheet = plugin("ActionSheet");
  if (!sheet) return openExternal(apple);
  const { index } = await sheet.showActions({
    title: "Open directions in",
    options: [
      { title: "Google Maps" },
      { title: "Apple Maps" },
      { title: "Cancel", style: "CANCEL" },
    ],
  });
  if (index === 0) return openExternal(google);
  if (index === 1) return openExternal(apple);
  return undefined;
}

/* ---------- status bar ---------- */
function syncStatusBar() {
  const bars = plugin("SystemBars");
  if (!bars) return;
  const dark = document.body?.dataset.screen === "homeScreen";
  // DARK = light text for dark surfaces (Today); LIGHT = dark text for ivory screens.
  bars.setStyle({ style: dark ? "DARK" : "LIGHT" }).catch(() => {});
}

export function installNativeShell() {
  if (!isNativeApp()) return;
  document.documentElement.classList.add("native-app");

  // Every "Navigate" button links to Google Maps directions; inside the app let the
  // traveler pick Google Maps or Apple Maps instead of landing on a web page.
  document.addEventListener(
    "click",
    (event) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const dest = link && destinationFrom(link.href);
      if (!dest) return;
      event.preventDefault();
      event.stopPropagation();
      chooseNavigationApp(dest).catch(() => openExternal(link.href));
    },
    true,
  );

  syncStatusBar();
  new MutationObserver(syncStatusBar).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-screen"],
  });
}
