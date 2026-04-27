import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [["line"], ["allure-playwright"]],
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      maxDiffPixelRatio: 0.01,
      threshold: 0.1,
      animations: "disabled",
      caret: "hide",
      scale: "css",
    },
  },
  use: {
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
    colorScheme: "light",
    timezoneId: "Europe/Moscow",
    locale: "en-US",
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "ui",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        baseURL: process.env.BASE_URL,
      },

      testMatch: /.*\.ui\.spec\.ts$/,
    },
    {
      name: "api",
      use: {
        baseURL: process.env.API_URL,
        browserName: undefined,
        extraHTTPHeaders: {
          Accept: "application/json",
        },
      },

      testMatch: /.*\.api\.spec\.ts$/,
    },
  ],
});
