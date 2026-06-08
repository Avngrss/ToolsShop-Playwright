import { test, expect } from "../../../fixtures";
import { HomePage } from "./../../../pages/HomePage/HomePage";
import {
  isMobileOrTablet,
  getScreenshotSuffix,
  waitForVisualStability,
  assertNoHorizontalScroll,
} from "../../../utils/responsive";

test(
  "Header adapts navigation to viewport",
  { tag: ["@ui", "@responsive"] },
  async ({ page }) => {
    const homePage = new HomePage(page);
    const isMobile = isMobileOrTablet(test.info());
    const suffix = getScreenshotSuffix(test.info().project.name);

    await homePage.goto();
    await page.waitForLoadState("networkidle");

    if (isMobile) {
      await test.step("Mobile: Navigation menu interaction", async () => {
        await test.step("1. Verify closed state", async () => {
          await expect(homePage.header.mobileMenuBtn).toBeVisible();
          await expect(homePage.header.navHome).not.toBeVisible();
        });

        await test.step("2. Open mobile menu", async () => {
          await homePage.header.openMobileMenu();
          await expect(homePage.header.mobileNavPanel).toBeVisible();
        });

        await test.step("3. Visual: Open menu state", async () => {
          await waitForVisualStability(page);
          await expect(homePage.header.mobileNavPanel).toHaveScreenshot(
            `mobile-menu-open-${suffix}.png`,
            { maxDiffPixels: 80, threshold: 0.3 },
          );
        });
        await test.step("4. Smoke: Sign in button is clickable", async () => {
          const signInBtn = homePage.header.navSignIn;
          await expect(signInBtn).toBeVisible();
          await signInBtn.click();
          await expect(page.locator('input[name="email"]')).toBeVisible({
            timeout: 5000,
          });
        });

        await test.step("5. Verify layout integrity", async () => {
          await assertNoHorizontalScroll(page);
        });
      });
    } else {
      await test.step("Desktop: Mobile elements hidden", async () => {
        await expect(homePage.header.mobileMenuBtn).toHaveCount(0);
        await expect(homePage.header.navHome).toBeVisible();

        await test.step("Visual: Desktop nav state", async () => {
          await waitForVisualStability(page);
          await expect(homePage.header.navHome).toHaveScreenshot(
            `desktop-nav-default-${suffix}.png`,
            { maxDiffPixels: 50, threshold: 0.2 },
          );
        });
      });
    }
  },
);
