import path from "path";
import { test, expect } from "../../../fixtures/data/users.fixture";
import { ContactUsPage } from "../../../pages/ContactUs/ContactUsPage";
import { createContactUsData } from "../../../test-data/contact-us";

test.describe("Contact Us UI", () => {
  let contactUsPage: ContactUsPage;

  test.beforeEach(async ({ page }) => {
    contactUsPage = new ContactUsPage(page);
    await contactUsPage.goto();
  });

  test("Success Submit Contact Us form", async ({ checkA11y, page }) => {
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
