import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const getBaseUrl = () =>
  process.env.BASE_URL || "https://practicesoftwaretesting.com";
const getApiUrl = () =>
  process.env.API_URL || "https://api.practicesoftwaretesting.com";

console.log(
  "Config loaded | BASE_URL:",
  getBaseUrl(),
  "| API_URL:",
  getApiUrl(),
);

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
    baseURL: getBaseUrl(),
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  build: {
    external: [],
  },

  projects: [
    // 🔹 Major browsers
    {
      name: "ui-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        baseURL: getBaseUrl(),
      },
      testMatch: /.*\.ui\.spec\.ts$/,
    },
    {
      name: "ui-firefox",
      testMatch: /.*\.ui\.spec\.ts$/,
      use: {
        ...devices["Desktop Firefox"],
        baseURL: getBaseUrl(),
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "ui-webkit",
      testMatch: /.*\.ui\.spec\.ts$/,
      use: {
        ...devices["Desktop Safari"],
        baseURL: getBaseUrl(),
        viewport: { width: 1920, height: 1080 },
      },
    },

    // 🔹 API project
    {
      name: "api",
      use: {
        baseURL: getApiUrl(), //
        browserName: undefined as any,
        extraHTTPHeaders: {
          Accept: "application/json",
        },
      },
      testMatch: /.*\.api\.spec\.ts$/,
    },
    {
      name: "ui-tablet",
      testMatch: /.*\.responsive\.spec\.ts$/,
      use: {
        ...devices["iPad Mini"],
        hasTouch: true,
        baseURL: getBaseUrl(),
      },
    },
    {
      name: "ui-android",
      testMatch: /.*\.responsive\.spec\.ts$/,
      use: {
        ...devices["Pixel 5"],
        hasTouch: true,
        isMobile: true,
        baseURL: getBaseUrl(),
      },
    },
    {
      name: "ui-ios",
      testMatch: /.*\.responsive\.spec\.ts$/,
      use: {
        ...devices["iPhone 13"],
        hasTouch: true,
        isMobile: true,
        baseURL: getBaseUrl(),
      },
    },
  ],
});
