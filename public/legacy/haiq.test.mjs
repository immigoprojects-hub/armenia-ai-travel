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
