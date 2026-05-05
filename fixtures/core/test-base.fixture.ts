import { test as base, expect } from "@playwright/test";
import * as fs from "fs";
import path from "path";

const baseTest = base.extend({});
baseTest.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const outputDir = testInfo.outputDir;
    if (fs.existsSync(outputDir)) {
      for (const file of fs.readdirSync(outputDir)) {
        if (
          file.includes("-diff.png") ||
          file.includes("-actual.png") ||
          file.includes("-expected.png")
        ) {
          const label = file.includes("-diff")
            ? "🟪 Visual Diff"
            : file.includes("-actual")
              ? "🟥 Actual Result"
              : "🟦 Expected Baseline";
          await testInfo.attach(label, {
            path: path.join(outputDir, file),
            contentType: "image/png",
          });
        }
      }
    }
  }
});

export const test = baseTest;
export { expect };
