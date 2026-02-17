import { defineConfig, devices } from "@playwright/test";
import { loadEnvironment } from "./config/env";

const env = loadEnvironment();

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }]
  ],
  use: {
    baseURL: env.baseUrl,
    // Keep artifacts off by default to reduce accidental sensitive data exposure.
    trace: env.enableArtifacts ? "on-first-retry" : "off",
    screenshot: env.enableArtifacts ? "only-on-failure" : "off",
    video: env.enableArtifacts ? "retain-on-failure" : "off"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    }
  ]
});
