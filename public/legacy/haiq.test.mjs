import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("./app.js", import.meta.url), "utf8");

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
    renderDeals() {},
    fmtAmd: (n) => `${n} AMD`,
    couponSave: () => 1600,
    couponTermsTemplate: () => "",
    $: () => dialog,
    ht: (x) => x,
  };
  vm.runInNewContext(`${code}; showCoupon('lavash'); showCoupon('lavash');`, context);
  assert.deepEqual(context.haiq.wallet, ["lavash"]);
});

const pick = (name) =>
  source.match(new RegExp(`function ${name}\\(.*\\) \\{[\\s\\S]*?\\n\\}`))?.[0];

test("Near me measures real distance from the traveller", () => {
  const ctx = {};
  vm.runInNewContext(
    `${pick("distKm")}; a = distKm({ lat: 40.1776, lng: 44.5126 }, { lat: 40.1913, lng: 44.5153 });`,
    ctx,
  );
  // Republic Square → Cascade is roughly 1.5 km in a straight line.
  assert.ok(ctx.a > 1.4 && ctx.a < 1.7, String(ctx.a));
});

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

test("coupon savings round to 100 dram and ending soon shows in red", () => {
  const save = source.match(/const couponSave = .*;/)?.[0];
  const days = pick("daysLeft");
  const ctx = {};
  vm.runInNewContext(
    `${save}; ${days}; a = couponSave({ bill: 8000, off: 20 }); b = couponSave({ bill: 2500, off: 15 }); c = daysLeft(new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));`,
    ctx,
  );
  assert.equal(ctx.a, 1600);
  assert.equal(ctx.b, 400);
  assert.ok(ctx.c >= 3 && ctx.c <= 4);
});
