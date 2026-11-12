import { defineConfig, devices } from "@playwright/test";

// Checks the live production site the way a traveler sees it on an iPhone.
// Run with: LIVE_URL=https://mvp-v01.vercel.app npx playwright test -c live-check
const browserName = (process.env["LIVE_BROWSER"] || "webkit") as "webkit" | "chromium";
const executablePath = process.env["LIVE_EXECUTABLE_PATH"];

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  outputDir: "./test-output",
  timeout: 120000,
  retries: 1,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env["LIVE_URL"] || "https://mvp-v01.vercel.app",
    browserName,
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    { name: "iPhone 15", use: { ...devices["iPhone 15"], browserName } },
    { name: "iPhone SE", use: { ...devices["iPhone SE"], browserName } },
  ],
});
