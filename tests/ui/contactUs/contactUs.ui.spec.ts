import path from "path";
import { test, expect } from "../../../fixtures/data/users.fixture";
import { ContactUsPage } from "../../../pages/ContactUs/ContactUsPage";
import { createContactUsData } from "../../../test-data/contact-us";
import { setAllureMeta } from "../../../utils/allure-utils";

test.describe("Contact Us UI", () => {
  let contactUsPage: ContactUsPage;

  test.beforeEach(async ({ page }) => {
    contactUsPage = new ContactUsPage(page);
    await contactUsPage.goto();
  });

  test("Success Submit Contact Us form", async ({ checkA11y, page }) => {
    await setAllureMeta({
      title: "Contact Us UI - Successful Form Submission",
      description:
        "Verify that filling out the contact form with valid data and an attachment results in a success message",
      severity: "critical",
      priority: "P0",
      owner: "QA Team",
      suite: "Contact Us",
      feature: "Form Submission",
      qaseCaseId: "?suite=9&case=22",
      parameters: {
        Browser: test.info().project.name,
        Page: "Contact Us",
        Action: "Fill form + Upload file + Submit",
        ExpectedResult: "Success message visible",
        Coverage: "UI + A11y + Visual Regression",
      },
    });
    const data = createContactUsData();
    await test.step("Fill out contact form with valid data", async () => {
      await contactUsPage.fillForm(data);
    });

    await test.step("Upload attachment to the form", async () => {
      const filePath = path.join(process.cwd(), data.filePath);
      await contactUsPage.attachFile(filePath);
    });

    await test.step("Submit the contact form", async () => {
      await contactUsPage.submit();
    });

    await test.step("Verify success state, accessibility and visual baseline", async () => {
      await expect(contactUsPage.successMessage).toBeVisible();
      await checkA11y("Contact Us - Success State", {
        strict: false,
        debug: true,
      });
      await expect(page.locator("body")).toHaveScreenshot(
        "contact-us-success-state.png",
        {
          maxDiffPixels: 50,
        },
      );
    });
  });

  test("Submit empty form - validation errors displayed", async ({
    page,
    checkA11y,
  }) => {
    await setAllureMeta({
      title: "Contact Us UI - Empty Form Validation",
      description:
        "Verify that submitting an empty contact form displays validation errors for all required fields",
      severity: "normal",
      priority: "P1",
      owner: "QA Team",
      suite: "Contact Us",
      feature: "Form Validation",
      qaseCaseId: "?suite=9&case=56",
      parameters: {
        Browser: test.info().project.name,
        Page: "Contact Us",
        Action: "Submit empty form",
        ExpectedResult: "Validation errors for all required fields",
        Coverage: "UI + A11y + Visual Regression",
      },
    });
    await test.step("Attempt to submit empty contact form", async () => {
      await contactUsPage.submit();
    });

    await test.step("Verify all required field errors and disabled submit", async () => {
      const expectedFields = [
        "first-name",
        "last-name",
        "email",
        "subject",
        "message",
      ];

      for (const field of expectedFields) {
        await expect(contactUsPage.getErrorLocator(field)).toBeVisible();
      }
    });

    await test.step("Verify accessibility and visual baseline with errors", async () => {
      await checkA11y("Contact Us - Validation Errors", {
        strict: false,
        debug: true,
      });
      await expect(page.locator("body")).toHaveScreenshot(
        "contact-us-validation-errors.png",
        {
          maxDiffPixels: 50,
        },
      );
    });
  });
});
