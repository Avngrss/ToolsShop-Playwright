import { test, expect } from "../../../fixtures/authenticatedPage.fixture";
import { HomePage } from "../../../pages/HomePage/HomePage";
import { setAllureMeta } from "../../../utils/allure-utils";

test("Logout", { tag: ["@ui", "@auth", "@smoke"] }, async ({ authPage }) => {
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
    },
  });

  const homePage = new HomePage(authPage);

  await test.step("Navigate to Home Page", async () => {
    await homePage.goto();
  });

  await test.step("Verify authenticated state", async () => {
    await expect(authPage).toHaveURL(/\/$/);
    await authPage.waitForLoadState("networkidle");
    await expect(authPage).toHaveScreenshot("logout-authenticated.png", {
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
    await expect(authPage).toHaveURL(/\/$/);
    await authPage.waitForLoadState("networkidle");
    await expect(authPage).toHaveScreenshot("logout-guest.png", {
      fullPage: false,
      maxDiffPixels: 40,
    });
  });
});
