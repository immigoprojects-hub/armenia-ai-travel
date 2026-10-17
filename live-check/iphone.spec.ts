import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Walks Today → Planner → My Trip → Map → Place details → Deals on the live site,
// saves a screenshot of each screen and writes a short report.md per device.
// Broken screens fail the run; a dashed (estimated) map line is reported as a warning.

const RESULTS = join(import.meta.dirname, "results");

type Row = { check: string; ok: boolean | "warn"; detail: string };

test("Live site works on iPhone", async ({ page, baseURL }, info) => {
  const slug = info.project.name.toLowerCase().replace(/\s+/g, "-");
  const dir = join(RESULTS, slug);
  mkdirSync(dir, { recursive: true });
  const rows: Row[] = [];
  const shots: string[] = [];
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const apiFailures: string[] = [];
  const roadRoutes: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
  });
  page.on("response", async (r) => {
    if (r.url().includes("/api/public/road-route")) {
      // Road-route failures only downgrade the map line to dashed, reported below as a warning.
      const body = await r.json().catch(() => null);
      roadRoutes.push(
        `HTTP ${r.status()} ${body?.status ?? "?"}${body?.provider ? ` via ${body.provider}` : ""}${body?.error || body?.message ? ` (${body.error ?? body.message})` : ""}`,
      );
    } else if (r.url().includes("/api/") && r.status() >= 500)
      apiFailures.push(`${r.status()} ${new URL(r.url()).pathname}`);
  });

  const record = (check: string, ok: Row["ok"], detail = "") => {
    rows.push({ check, ok, detail });
    if (ok === false) expect.soft(ok, `${check}: ${detail}`).toBe(true);
  };
  const shoot = async (name: string) => {
    const file = `${String(shots.length + 1).padStart(2, "0")}-${name}.jpg`;
    await page.screenshot({ path: join(dir, file), type: "jpeg", quality: 75, scale: "css" });
    shots.push(file);
  };
  const noSideScroll = (p: Page) =>
    p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  const openScreen = async (id: string, label: string) => {
    await page.locator(`.bottom-nav [data-screen="${id}"]`).click();
    const screen = page.locator(`#${id}`);
    const visible = await screen
      .waitFor({ state: "visible", timeout: 10000 })
      .then(() => true)
      .catch(() => false);
    await page.waitForTimeout(600);
    const text = visible ? (await screen.innerText()).trim().length : 0;
    record(
      `${label} opens`,
      visible && text > 20,
      visible ? `${text} chars of content` : "not visible",
    );
    record(`${label} fits the screen width`, await noSideScroll(page), "");
    await shoot(label.toLowerCase().replace(/\s+/g, "-"));
  };

  try {
    // Today
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    record("Site responds", response?.ok() ?? false, `HTTP ${response?.status()}`);
    await page.locator(".bottom-nav").waitFor({ timeout: 30000 });
    const todayLength = () =>
      page
        .locator("#homeScreen")
        .innerText()
        .then((t) => t.trim().length);
    await expect
      .poll(todayLength, { timeout: 20000 })
      .toBeGreaterThan(100)
      .catch(() => {});
    await page.waitForTimeout(1000);
    const todayText = await todayLength();
    record("Today opens", todayText > 100, `${todayText} chars of content`);
    record("Today fits the screen width", await noSideScroll(page), "");
    await shoot("today");

    await openScreen("plannerScreen", "Planner");
    await openScreen("tripScreen", "My Trip");

    // Map: pins, tiles, and whether the route line is real roads (solid) or estimated (dashed)
    await page.locator('.bottom-nav [data-screen="mapScreen"]').click();
    const mapShown = await page
      .locator(".leaflet-container")
      .waitFor({ state: "visible", timeout: 20000 })
      .then(() => true)
      .catch(() => false);
    record("Map opens", mapShown, "");
    const pins = await page
      .locator(".pin-stop")
      .first()
      .waitFor({ timeout: 15000 })
      .then(() => page.locator(".pin-stop").count())
      .catch(() => 0);
    record("Map shows numbered stops", pins > 0, `${pins} pins`);

    // Road routes are requested for every day at startup; give slow ones time to land and redraw.
    await expect
      .poll(() => roadRoutes.length, { timeout: 20000 })
      .toBeGreaterThan(0)
      .catch(() => {});
    await page.waitForTimeout(2500);
    const routeInfo = roadRoutes.length
      ? `road-route: ${[...new Set(roadRoutes)].join(", ")}`
      : "no road-route request seen";
    const tiles = await page.locator(".leaflet-tile-loaded").count();
    record("Map tiles load", tiles > 0, `${tiles} tiles`);
    const lines = await page.locator(".leaflet-overlay-pane path").evaluateAll((paths) =>
      paths.map((p) => {
        const box = p.getBoundingClientRect();
        return {
          dash: p.getAttribute("stroke-dasharray"),
          opacity: Number(p.getAttribute("stroke-opacity") || 1),
          size: Math.max(box.width, box.height),
        };
      }),
    );
    const main = lines.filter((l) => l.size > 40).sort((a, b) => b.opacity - a.opacity)[0];
    record(
      "Map route line is visible",
      Boolean(main),
      main
        ? `${lines.length} line(s), main line ${Math.round(main.size)}px`
        : `${lines.length} line(s), none visible`,
    );
    const solid = Boolean(main) && (!main!.dash || main!.dash === "none");
    record(
      "Map route line is SOLID (real roads)",
      solid ? true : "warn",
      `${solid ? "solid" : main ? `dashed (${main.dash}) = estimated fallback` : "no line"}; ${routeInfo}`,
    );
    await shoot("map");

    // Place details
    await page.locator('.bottom-nav [data-screen="homeScreen"]').click();
    await page.waitForTimeout(600);
    const detail = page.locator("#homeScreen .detail-button:visible").first();
    let opened = false;
    let placeName = "";
    if (await detail.count()) {
      await detail.click();
      opened = await page
        .locator("#entityDialog")
        .waitFor({ state: "visible", timeout: 10000 })
        .then(() => true)
        .catch(() => false);
      if (opened) {
        await page.waitForTimeout(800);
        placeName = (
          await page
            .locator("#entityDialog h2, #entityDialog h1")
            .first()
            .innerText()
            .catch(() => "")
        ).trim();
        await shoot("place-details");
        await page
          .locator("#entityDialog .dialog-close")
          .click()
          .catch(() => page.keyboard.press("Escape"));
      }
    }
    record("Place details open", opened, placeName || (opened ? "" : "no place card on Today"));

    await openScreen("dealsScreen", "Deals");
  } finally {
    record("No JavaScript crashes", pageErrors.length === 0, pageErrors.slice(0, 3).join(" | "));
    record(
      "No server errors from /api",
      apiFailures.length === 0,
      apiFailures.slice(0, 5).join(", "),
    );

    const mark = (ok: Row["ok"]) => (ok === true ? "✅" : ok === "warn" ? "⚠️" : "❌");
    const lines = [
      `### ${info.project.name} (${info.project.use.viewport?.width}×${info.project.use.viewport?.height}, ${info.project.use.browserName})`,
      "",
      `Site: ${baseURL}`,
      "",
      "| | Check | Detail |",
      "|---|---|---|",
      ...rows.map((r) => `| ${mark(r.ok)} | ${r.check} | ${r.detail.replace(/\|/g, "/")} |`),
      "",
      consoleErrors.length
        ? `Console errors: ${consoleErrors.slice(0, 5).join(" | ")}`
        : "Console errors: none",
      "",
      ...shots.map((s) => `![${s}](${slug}/${s})`),
      "",
    ];
    writeFileSync(join(dir, "report.md"), lines.join("\n"));
  }
});
