import { test, expect } from "../../../fixtures/auth-fixtures";
import { ForgotPassword } from "../../../pages/AuthPages/ForgotPassword/ForgotPassword";
import { setAllureMeta } from "../../../utils/allure-utils";

test.describe("Forgot Password UI", { tag: ["@ui", "@auth"] }, () => {
  let forgotPasswordPage: ForgotPassword;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPassword(page);
    await forgotPasswordPage.goto();
  });

  test(
    "Success request when forgot password",
    { tag: ["@smoke"] },
    async ({ page, testUser, checkA11y }) => {
      await setAllureMeta({
        title: "Customer Forgot password - Successful request",
        description:
          "Verify that a valid customer can request a new password to change",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Sign in",
        feature: "Authentication",
        qaseCaseId: "?suite=18&case=48",
        parameters: {
          Browser: test.info().project.name,
          "User Role": "Customer",
        },
      });

      await test.step("Verify accessibility of Forgot password form", async () => {
        await checkA11y("Forgot password Form", {
          strict: false,
          debug: true,
        });
      });

      await test.step("Submit email", async () => {
        await forgotPasswordPage.fillForgotEmailField(testUser.email);
        await forgotPasswordPage.submitForm();
      });

      await test.step("Verify success notification", async () => {
        await expect(forgotPasswordPage.successNotification).toBeVisible();
        await expect(page).toHaveScreenshot(
          "success-notification-appears.png",
          {
            fullPage: false,
            maxDiffPixels: 40,
          },
        );
      });
    },
  );

  test("Submit non-existed email", { tag: ["@negative"] }, async ({ page }) => {
    const notExistedEmail = "does-not-exist@practicesoftwaretesting.com";

    await setAllureMeta({
      title: "Submit non-existed email and verify error",
      description:
        "Verify that an invalid account can't request password changing",
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

    await test.step("Submit invalid email", async () => {
      await forgotPasswordPage.fillForgotEmailField(notExistedEmail);
      await forgotPasswordPage.submitAndWaitForApiError(422);
    });

    await test.step("Verify error is visible", async () => {
      await expect(forgotPasswordPage.emailErrorNotification).toBeVisible({
        timeout: 4000,
      });
      await expect(page).toHaveScreenshot("error-notification-appears.png", {
        fullPage: false,
        maxDiffPixels: 40,
      });
    });
  });
});
