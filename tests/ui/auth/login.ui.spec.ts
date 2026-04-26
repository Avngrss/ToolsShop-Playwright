import { test, expect } from "../../../fixtures/auth-fixtures";
import { LoginPage } from "../../../pages/auth/LoginPage/LoginPage";
import { negativeLoginCases } from "../../../test-data/auth-validation";
import { setAllureMeta } from "../../../utils/allure-utils";

test.describe("Login UI", { tag: ["@ui", "@auth"] }, () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test(
    "Customer login successful",
    { tag: ["@smoke", "@visual"] },
    async ({ page, testUser, checkA11y }) => {
      await setAllureMeta({
        title: "Customer Login - Successful Authentication",
        description:
          "Verify that a valid customer can log in and is redirected to the Account page",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Sign in",
        feature: "Authentication",
        qaseCaseId: "?suite=2&case=4",
        parameters: {
          Browser: test.info().project.name,
          "User Role": "Customer",
        },
      });

      await test.step("Verify accessibility of login form", async () => {
        await checkA11y("Login Form", {
          strict: false,
          debug: true,
        });
      });

      await test.step("Submit credentials", async () => {
        await loginPage.login(testUser);
      });

      await test.step("Verify redirect to Account page", async () => {
        await expect(page).toHaveURL(/dashboard|account/i);
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveScreenshot("dashboard-after-login.png", {
          fullPage: false,
          maxDiffPixels: 40,
        });
      });

      await test.step("Verify accessibility of dashboard", async () => {
        await checkA11y("Dashboard", { strict: false });
      });
    },
  );

  for (const tc of negativeLoginCases) {
    test(
      `Should show error for ${tc.label}`,
      { tag: ["@negative", "@validation"] },
      async ({ page }) => {
        await setAllureMeta({
          title: `Login Negative: ${tc.label}`,
          description: `Verify UI feedback when ${tc.label} is submitted`,
          severity: "normal",
          priority: "P2",
          owner: "QA Team",
          suite: "Sign in",
          feature: "Authentication",
          qaseCaseId: tc.qaseCaseId,
        });

        await test.step("Submit form with invalid data", async () => {
          await loginPage.login(tc);
        });

        await test.step("Verify error message & capture state", async () => {
          const errorLocator = loginPage.getErrorLocator(tc.errorField);
          await expect(errorLocator).toBeVisible();
          await expect(errorLocator).toHaveText(tc.expectedMessage, {
            useInnerText: true,
          });
          const screenshot = await page.screenshot({ fullPage: false });
          await test.info().attach(`Error UI: ${tc.label}`, {
            body: screenshot,
            contentType: "image/png",
          });
        });
      },
    );
  }
});
