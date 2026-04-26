import { test, expect } from "../../../fixtures/auth-fixtures";
import { createUser } from "../../../utils/userFactory";
import { RegisterPage } from "../../../pages/auth/RegisterPage/RegisterPage";
import { setAllureMeta } from "../../../utils/allure-utils";
import { registrationNegativeCases } from "../../../test-data/registration-negative";

test.describe("Registration UI", { tag: ["@ui", "@auth"] }, () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test(
    "Registration: Successfully register a new user",
    { tag: ["@smoke"] },
    async ({ page, checkA11y }) => {
      await setAllureMeta({
        title: "Success registration a new user",
        description: "Verify that a new user can be register in the system",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Auth",
        feature: "Registration",
        qaseCaseId: "?suite=1&case=1",
        parameters: {
          Browser: test.info().project.name,
          "User Role": "New user",
        },
      });

      const user = createUser();

      await test.step("Verify accessibility of registration form", async () => {
        await checkA11y("Register Form", {
          strict: false,
          debug: true,
        });
      });

      await test.step("Complete registration form with valid data and submit", async () => {
        await registerPage.registerUser(user);
        await registerPage.submitForm();
      });

      await test.step("Ensure user is redirected to login page post-registration", async () => {
        await expect(page).toHaveURL("/auth/login");
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveScreenshot("redirect-to-login-page.png", {
          fullPage: false,
          maxDiffPixels: 40,
        });
      });
    },
  );

  test(`Registration: empty form`, async ({ page }) => {
    const tc = registrationNegativeCases.find((c) => c.label === "empty form")!;

    await setAllureMeta({
      title: `Registration Negative: ${tc.label}`,
      description: `Verify validation feedback when form is empty`,
      severity: "normal",
      priority: "P2",
      owner: "QA Team",
      suite: "Registration UI",
      feature: "Authentication",
      qaseCaseId: tc.qaseCaseId,
    });

    await test.step("Submit empty form", async () => {
      await registerPage.submitForm();
    });

    await test.step("Verify errors appear", async () => {
      await expect(registerPage.errorMessages.first()).toBeVisible({
        timeout: 10000,
      });
    });

    await test.step("Capture error state", async () => {
      await expect(page).toHaveScreenshot(`reg-empty-form.png`, {
        fullPage: false,
        maxDiffPixels: 40,
      });
    });
  });

  test(`Registration: weak password`, async ({ page }) => {
    const tc = registrationNegativeCases.find(
      (c) => c.label === "weak password",
    )!;

    await setAllureMeta({
      title: `Registration Negative: ${tc.label}`,
      description: `Verify validation feedback when form is empty`,
      severity: "normal",
      priority: "P2",
      owner: "QA Team",
      suite: "Registration UI",
      feature: "Authentication",
      qaseCaseId: tc.qaseCaseId,
    });

    await test.step("Submit form with weak password", async () => {
      await registerPage.registerUser(tc.data);
      await registerPage.submitForm();
    });

    await test.step("Verify password error", async () => {
      await expect(registerPage.errorMessages.first()).toBeVisible({
        timeout: 10000,
      });
    });

    await test.step("Capture error state", async () => {
      const screenshotBuffer = await page.screenshot({
        fullPage: false,
        type: "png",
      });

      await test.info().attach("Error state screenshot", {
        contentType: "image/png",
        body: screenshotBuffer,
      });
    });
  });

  test(`Registration: duplicate email`, async ({ page }) => {
    const tc = registrationNegativeCases.find(
      (c) => c.label === "duplicate email",
    )!;

    await setAllureMeta({
      title: `Registration Negative: ${tc.label}`,
      description: `Verify validation feedback when form is empty`,
      severity: "normal",
      priority: "P2",
      owner: "QA Team",
      suite: "Registration UI",
      feature: "Authentication",
      qaseCaseId: tc.qaseCaseId,
    });

    await test.step("Submit form with existing email", async () => {
      await registerPage.registerUser(tc.data);
      await registerPage.submitForm();
    });

    await test.step("Verify email error", async () => {
      await expect(registerPage.errorMessages.first()).toBeVisible({
        timeout: 10000,
      });
    });

    await test.step("Capture error state", async () => {
      await expect(page).toHaveScreenshot(`reg-duplicate-email.png`, {
        fullPage: false,
        maxDiffPixels: 40,
      });
    });
  });
});
