import { test, expect } from "../../../fixtures/data/users.fixture";
import { loginUi } from "../../../fixtures/ui/ui-login.helpers";
import { HomePage } from "../../../pages/HomePage/HomePage";
import { setAllureMeta } from "../../../utils/allure-utils";

test(
  "Logout",
  { tag: ["@ui", "@auth", "@smoke"] },
  async ({ page, request }) => {
    await setAllureMeta({
      title: "Customer Successful Logout",
      description: "Verify that a valid customer can logout",
      severity: "critical",
      priority: "P0",
      owner: "QA Team",
      suite: "Auth",
      feature: "Authentication",
      qaseCaseId: "?suite=16&case=45",
      parameters: {
        Browser: test.info().project.name,
        "User Role": "Customer",
        Coverage: "UI + A11y + Visual Regression",
      },
    });
    await loginUi(page, request);

    const homePage = new HomePage(page);

    await test.step("Navigate to Home Page", async () => {
      await homePage.goto();
    });

    await test.step("Verify authenticated state", async () => {
      await expect(page).toHaveURL(/\/$/);
      await expect(page).toHaveScreenshot("logout-authenticated.png", {
        fullPage: false,
        maxDiffPixels: 40,
      });
    });

    await test.step("User performs logout via header menu", async () => {
      await homePage.header.clickAuthButton();
      await homePage.header.userMenu.logout();
    });

    await test.step("Auth button shows 'Sign in'", async () => {
      await expect(homePage.header.authButton).toHaveText("Sign in");
    });

    await test.step("Verify guest state", async () => {
      await expect(page).toHaveURL(/\/$/);
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveScreenshot("logout-guest.png", {
        fullPage: false,
        maxDiffPixels: 40,
      });
    });
  },
);
