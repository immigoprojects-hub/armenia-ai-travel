import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const stopProgress = source.match(/function stopProgress\(stops, now\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(stopProgress);
const progress = (stops, now) =>
  vm.runInNewContext(`${stopProgress}; stopProgress(stops, now)`, { stops, now });

// 09:05–09:50 Republic Square, 10:00–11:00 Cascade, 11:10–12:40 Matenadaran
const stops = [
  { arrive: 545, depart: 590 },
  { arrive: 600, depart: 660 },
  { arrive: 670, depart: 760 },
];

test("before the day starts the first stop is next", () => {
  assert.deepEqual({ ...progress(stops, 480) }, { index: 0, state: "upcoming" });
});

test("during a visit that stop is the current one", () => {
  assert.deepEqual({ ...progress(stops, 620) }, { index: 1, state: "now" });
});

test("between stops the following stop is next", () => {
  assert.deepEqual({ ...progress(stops, 662) }, { index: 2, state: "upcoming" });
});

test("after the last stop the day is done", () => {
  assert.deepEqual({ ...progress(stops, 800) }, { index: -1, state: "done" });
});

test("an evening hotel check-in counts as done once reached", () => {
  const withHotel = [...stops, { arrive: 800, depart: 800 }];
  assert.deepEqual({ ...progress(withHotel, 790) }, { index: 3, state: "upcoming" });
  assert.deepEqual({ ...progress(withHotel, 800) }, { index: -1, state: "done" });
});
