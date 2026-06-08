import { test, expect } from "@playwright/test";
import { HomePage } from "./../../../pages/HomePage/HomePage";
import {
  isMobileOrTablet,
  getScreenshotSuffix,
  waitForVisualStability,
  assertNoHorizontalScroll,
} from "../../../utils/responsive";

test(
  "Filters adapts navigation to viewport",
  { tag: ["@ui", "@responsive"] },
  async ({ page }) => {
    const homePage = new HomePage(page);
    const isMobile = isMobileOrTablet(test.info());
    const suffix = getScreenshotSuffix(test.info().project.name);

    await homePage.goto();
    await page.waitForLoadState("networkidle");

    if (isMobile) {
      await test.step("Mobile: Filter menu interaction", async () => {
        await test.step("1. Verify closed state", async () => {
          await expect(homePage.FilterComponent.filters).not.toBeVisible();
          await expect(homePage.FilterComponent.filterMenu).toBeVisible();
          await waitForVisualStability(page);
          await expect(homePage.FilterComponent.filterMenu).toHaveScreenshot(
            `filter-menu-closed-${suffix}.png`,
            { maxDiffPixels: 60, threshold: 0.25 },
          );
        });

        await test.step("2. Open filter panel", async () => {
          await homePage.FilterComponent.openFilter();
          await expect(homePage.FilterComponent.filters).toBeVisible();
        });

        await test.step("3. Verify open state", async () => {
          await waitForVisualStability(page);
          await expect(homePage.FilterComponent.filters).toHaveScreenshot(
            `filter-panel-open-${suffix}.png`,
            { maxDiffPixels: 100, threshold: 0.35 },
          );
        });
        await test.step("4. Verify layout integrity", async () => {
          await assertNoHorizontalScroll(page);
        });
      });
    } else {
      await test.step("Desktop: Mobile elements hidden", async () => {
        await expect(homePage.FilterComponent.filterMenu).toHaveCount(0);
      });
    }
  },
);
