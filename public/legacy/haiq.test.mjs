import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const functionSource = source.match(/function addNearby\(\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(functionSource);

test("swipe-right add action adds the current nearby place to today", () => {
  const added = [];
  const context = {
    haiq: { nearby: 0 },
    nearbyItems: [{ id: "mirzoyan-library" }],
    inPlan: () => false,
    currentDayIndex: () => 2,
    addToDay: (id, day) => added.push({ id, day }),
    renderAll: () => {},
  };
  vm.runInNewContext(`${functionSource}; addNearby();`, context);
  assert.deepEqual(added, [{ id: "mirzoyan-library", day: 2 }]);
  assert.equal(context.haiq.nearby, 1);
});

test("adding an already planned nearby place never duplicates the stop", () => {
  let additions = 0;
  const context = {
    haiq: { nearby: 0 },
    nearbyItems: [{ id: "lavash-restaurant" }],
    inPlan: () => true,
    addToDay: () => additions++,
    showToast: () => {},
    ht: (x) => x,
    renderAll: () => {},
  };
  vm.runInNewContext(`${functionSource}; addNearby();`, context);
  assert.equal(additions, 0);
  assert.equal(context.haiq.nearby, 1);
});

test("coupon issuance saves one QR per coupon in the wallet", () => {
  const code = source.slice(
    source.indexOf("function showCoupon(id)"),
    source.indexOf("function showFirstDay()"),
  );
  const dialog = { innerHTML: "", showModal() {} };
  const context = {
    coupons: [{ id: "lavash", partner: "Lavash", off: 20, until: "2026-12-31", distance: "350 m" }],
    haiq: { wallet: [] },
    renderMyTrip() {},
    $: () => dialog,
    ht: (x) => x,
  };
  vm.runInNewContext(`${code}; showCoupon('lavash'); showCoupon('lavash');`, context);
  assert.deepEqual(context.haiq.wallet, ["lavash"]);
});

test("swipe-left advances to the next nearby card without adding a stop", () => {
  const code = source.match(/function skipNearby\(\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(code);
  const deck = { innerHTML: "" };
  const context = {
    haiq: { nearby: 0 },
    $: () => deck,
    nearbyTemplate: () => "next card",
    addToDay() {
      assert.fail("Left swipe must not add a stop");
    },
  };
  vm.runInNewContext(`${code}; skipNearby();`, context);
  assert.equal(context.haiq.nearby, 1);
});

const pick = (name) =>
  source.match(new RegExp(`function ${name}\\(.*\\) \\{[\\s\\S]*?\\n\\}`))?.[0];

test("today's hours line maps Google's Monday-first list to the current weekday", () => {
  const fn = pick("todayHoursLine");
  const google = {
    weekdayDescriptions: ["Mon: 9–18", "Tue: 9–18", "Wed", "Thu", "Fri", "Sat", "Sunday: Closed"],
  };
  const sunday = new Date(2026, 9, 18);
  const monday = new Date(2026, 9, 19);
  const ctx = { google, sunday, monday };
  vm.runInNewContext(
    `${fn}; a = todayHoursLine(google, sunday); b = todayHoursLine(google, monday); c = todayHoursLine({}, monday);`,
    ctx,
  );
  assert.equal(ctx.a, "Sunday: Closed");
  assert.equal(ctx.b, "Mon: 9–18");
  assert.equal(ctx.c, "");
});

test("Ara actions only run for known places and coupons", () => {
  const calls = [];
  const ctx = {
    coupons: [{ id: "lavash" }],
    state: { plan: [{ stops: [] }, { stops: ["garni-temple"] }] },
    $: () => ({ close: () => calls.push("close") }),
    getEntityById: (id) =>
      ["cascade", "garni-temple"].includes(id) ? { id, name: id } : undefined,
    inPlan: (id) => id === "garni-temple",
    currentDayIndex: () => 0,
    addToDay: (id, day) => calls.push(`add:${id}:${day}`),
    showToast: () => calls.push("toast"),
    ht: (x) => x,
    showCoupon: (id) => calls.push(`coupon:${id}`),
    openScreen: (s) => calls.push(`screen:${s}`),
    selectStop: (id, d) => calls.push(`stop:${id}:${d}`),
    openEntityDetail: (id) => calls.push(`detail:${id}`),
  };
  vm.runInNewContext(
    `${pick("runAraActions")}; done = runAraActions([
      { type: "add_to_plan", placeId: "cascade", day: 2 },
      { type: "add_to_plan", placeId: "garni-temple" },
      { type: "add_to_plan", placeId: "made-up" },
      { type: "show_on_map", placeId: "garni-temple" },
      { type: "open_coupon", couponId: "fake" },
      { type: "open_coupon", couponId: "lavash" },
    ]);`,
    ctx,
  );
  assert.deepEqual(calls, [
    "add:cascade:1",
    "toast",
    "close",
    "screen:mapScreen",
    "stop:garni-temple:1",
    "close",
    "coupon:lavash",
  ]);
  assert.deepEqual([...ctx.done], ["add", "add", "map", "coupon"]);
});
