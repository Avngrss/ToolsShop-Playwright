import { test, expect } from "../../../fixtures/data/users.fixture";
import { HomePage } from "../../../pages/HomePage/HomePage";
import { setAllureMeta } from "../../../utils/allure-utils";

test.describe("Sorting UI", { tag: ["@ui", "@sorting"] }, () => {
  test("Select sort option triggers correct API request", async ({
    page,
    checkA11y,
  }) => {
    await setAllureMeta({
      title: "Product Sorting - API Request Triggered",
      description:
        "Verify that selecting a sort option in the dropdown triggers the correct API request with proper 'sort' query parameter",
      severity: "normal",
      priority: "P1",
      owner: "QA Team",
      suite: "Products",
      feature: "Product Listing",
      qaseCaseId: "?suite=4&case=8",
      parameters: {
        Browser: test.info().project.name,
        "Sort Field": "name",
        "Sort Direction": "asc",
        Component: "Native <select>",
      },
    });

    const homePage = new HomePage(page);
    await homePage.goto();

    await test.step("Navigate to Home page", async () => {
      await homePage.goto();
      await page.waitForResponse(
        (res) => res.url().includes("/products") && res.status() === 200,
      );
    });

    await test.step("Verify accessibility of sorting component", async () => {
      await checkA11y("Sorting Component", {
        strict: false,
        debug: true,
      });
    });

    await test.step("Select sort option and verify API request", async () => {
      const requestPromise = page.waitForRequest((req) => {
        const url = req.url();
        return url.includes("/products") && url.includes("sort=name,asc");
      });

      await homePage.sortingComponent.selectOption("name,asc");

      const request = await requestPromise;
      expect(request.url()).toContain("sort=name,asc");
    });

    await test.step("Verify UI state and capture screenshot", async () => {
      await expect(homePage.sortingComponent.sortSelect).toHaveValue(
        "name,asc",
      );

      await expect(page.locator("body")).toHaveScreenshot(
        "sorting-name-asc.png",
        {
          maxDiffPixels: 40,
        },
      );
    });
  });
});
