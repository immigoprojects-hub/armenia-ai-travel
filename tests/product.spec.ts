import { test, expect } from "@playwright/test";

test("Road-route response updates shared itinerary times without changing stops", async ({
  page,
}) => {
  await page.route("**/api/public/road-route", async (route) => {
    const { ids } = route.request().postDataJSON();
    await route.fulfill({
      json: {
        status: "ok",
        provider: "openrouteservice",
        geometry: [
          [40.1792, 44.5133],
          [40.185, 44.515],
          [40.19, 44.52],
        ],
        legs: ids.slice(1).map(() => ({ minutes: 17, distanceMeters: 1000 })),
        minutes: (ids.length - 1) * 17,
        distanceMeters: (ids.length - 1) * 1000,
      },
    });
  });
  await page.goto("/");
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const app = await import("/legacy/app.js");
        const day = app.dayPlan(app.state.plan[0]);
        return { routed: day.routed, leg: day.stops[0].leg, arrive: day.stops[0].arrive };
      }),
    )
    .toEqual({ routed: true, leg: 17, arrive: 557 });
});

test.use({ viewport: { width: 390, height: 844 } });
test("Planner, trip, map, details and saved state stay synchronized", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Yerevan first day" })).toBeVisible();
  await page.getByRole("button", { name: "Planner", exact: true }).click();
  await page.locator("[data-plan-date]").fill("2026-10-02");
  await page.getByRole("button", { name: "Fewer days" }).click();
  await page.getByRole("button", { name: "Fewer days" }).click();
  await page.getByRole("button", { name: "Build my trip", exact: true }).click();
  await expect(page.getByRole("heading", { name: "3 days across Armenia" })).toBeVisible();
  const generated = await page.evaluate(() => JSON.parse(localStorage.getItem("armeniaTripV2")!));
  expect(generated.plan).toHaveLength(3);
  expect(generated.plan.flatMap((d: { stops: string[] }) => d.stops)).toContain("garni-temple");
  await page.getByRole("button", { name: "My Trip", exact: true }).click();
  await expect(page.locator("#tripRoot .chapters .chapter")).toHaveCount(3);
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 20000 });
  await expect(page.locator(".pin-stop").first()).toBeVisible();
  await page.locator('[data-map-mode="whole"]').click();
  await expect(page.locator(".pin-stop")).toHaveCount(
    generated.plan.reduce(
      (sum: number, day: { stops: string[] }) =>
        sum +
        day.stops.filter(
          (id) =>
            ![
              "hyur-service",
              "yerani-travel",
              "one-way-tour",
              "hertz-armenia",
              "sixt-armenia",
              "airalo-armenia-esim",
              "nomad-armenia-esim",
            ].includes(id),
        ).length,
      0,
    ),
  );
  await page.locator('[data-map-mode="day"]').click();
  const suggestion = page.locator("#mapSheetBody [data-suggest]").first();
  if (await suggestion.count()) {
    const before = await page.evaluate(() => localStorage.getItem("armeniaTripV2"));
    await suggestion.click();
    await expect(page.locator("[data-apply-preview]")).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("armeniaTripV2"))).toBe(before);
    await page.locator("[data-apply-preview]").click();
    expect(await page.evaluate(() => localStorage.getItem("armeniaTripV2"))).not.toBe(before);
  }
  await page.locator(".bottom-nav").getByRole("button", { name: "Today", exact: true }).click();
  await page.locator(".next-card").click();
  await expect(page.locator("#entityDialog")).toBeVisible();
  await page.locator("#entityDialog [data-save]").click();
  const saved = await page.evaluate(() => localStorage.getItem("armeniaMvpSaved"));
  expect(saved).not.toBe("[]");
  await page.locator("#entityDialog .dialog-close").click();
  await page.reload();
  await expect(page.locator(".next-card")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("armeniaMvpSaved"))).toBe(saved);
  for (const screen of ["Today", "Planner", "My Trip", "Map", "Deals"]) {
    await page.locator(".bottom-nav").getByRole("button", { name: screen, exact: true }).click();
    await page.waitForTimeout(400);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await page.screenshot({ path: `test-results/${screen.replace(" ", "-")}-mobile.png` });
  }
  expect(errors).toEqual([]);
});

test("All 30 details work and dates follow Armenia time; corrupted storage recovers", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-10-03T08:00:00Z"));
  await page.addInitScript(() => {
    localStorage.setItem("armeniaTripV2", "{bad");
    localStorage.setItem("armeniaMvpSaved", "{bad");
  });
  await page.goto("/");
  await expect(page.locator(".next-card")).toBeVisible();
  const checked = await page.evaluate(async () => {
    const app = await import("/legacy/app.js");
    const { armeniaEntities } = await import("/legacy/entities.js");
    for (const entity of armeniaEntities) {
      app.openEntityDetail(entity.id);
      if (!document.querySelector("#entityDetail")?.textContent?.includes(entity.name))
        throw new Error(entity.id);
      (document.querySelector("#entityDialog") as HTMLDialogElement).close();
    }
    app.state.startDate = "2026-10-02";
    const dayTwo = app.currentDayIndex();
    app.state.startDate = "2026-09-01";
    const lastDay = app.currentDayIndex();
    return {
      count: armeniaEntities.length,
      dayTwo,
      lastDay,
      length: app.state.plan.length,
      phase: app.tripPhase(),
    };
  });
  expect(checked.count).toBe(30);
  expect(checked.dayTwo).toBe(1);
  expect(checked.lastDay).toBe(checked.length - 1);
  expect(checked.phase).toBe("Trip complete");
});
