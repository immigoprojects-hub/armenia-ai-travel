import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  use: { baseURL: process.env["APP_URL"] || "http://127.0.0.1:4173", channel: "chrome" },
  timeout: 60000,
  workers: 1,
});
