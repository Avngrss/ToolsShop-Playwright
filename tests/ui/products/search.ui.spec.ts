import { test, expect } from "../../../fixtures";
import { HomePage } from "../../../pages/HomePage/HomePage";
import { setAllureMeta } from "../../../utils/allure-utils";

test.describe("Search Products UI", { tag: ["@ui", "@search"] }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await page.waitForResponse(
      (res) => res.url().includes("/products") && res.status() === 200,
    );
  });

  test("Search: product found - results displayed", async ({
    page,
    checkA11y,
  }) => {
    await setAllureMeta({
      title: "Search - Product Found",
      description: "Verify that searching for existing product shows results",
      severity: "normal",
      priority: "P1",
      owner: "QA Team",
      suite: "Products",
      feature: "Search",
      qaseCaseId: "?suite=6&case=16",
      parameters: {
        Browser: test.info().project.name,
        Query: "Wrench",
        Coverage: "UI + A11y + Visual Regression",
      },
    });

    await test.step("Enter search query", async () => {
      await homePage.SearchComponent.search("Wrench");
    });

    await test.step("Verify results and screenshot", async () => {
      await expect(homePage.productList).toBeVisible({
        timeout: 10000,
      });
      await checkA11y("Search Results", { strict: false, debug: true });
      await expect(page.locator("body")).toHaveScreenshot("search-found.png", {
        maxDiffPixels: 40,
      });
    });
  });

  test("Search: product not found - empty state displayed", async ({
    page,
    checkA11y,
  }) => {
    await setAllureMeta({
      title: "Search - Product Not Found",
      description:
        "Verify that searching for non-existing product shows empty state",
      severity: "normal",
      priority: "P1",
      owner: "QA Team",
      suite: "Products",
      feature: "Search",
      qaseCaseId: "?suite=6&case=15",
      parameters: {
        Browser: test.info().project.name,
        Query: "nonexistent",
        Coverage: "UI + A11y + Visual Regression",
      },
    });

    await test.step("Enter search query", async () => {
      await homePage.SearchComponent.search("nonexistent_product_123");
    });

    await test.step("Verify empty state and screenshot", async () => {
      await expect(homePage.emptyState).toBeVisible({
        timeout: 10000,
      });
      await expect(homePage.emptyState).toContainText(/no products|not found/i);
      await checkA11y("Search Empty State", { strict: false, debug: true });
      await expect(page.locator("body")).toHaveScreenshot("search-empty.png", {
        maxDiffPixels: 40,
      });
    });
  });
});
