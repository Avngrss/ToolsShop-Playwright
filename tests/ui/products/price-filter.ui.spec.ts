import { test, expect } from "../../../fixtures";
import { HomePage } from "../../../pages/HomePage/HomePage";
import { setAllureMeta } from "../../../utils/allure-utils";

test.describe("Price Filter UI", { tag: ["@ui", "@filter", "@price"] }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await page.waitForResponse(
      (res) => res.url().includes("/products") && res.status() === 200,
    );
  });

  test("Apply valid range (0-100) - products displayed", async ({
    page,
    checkA11y,
  }) => {
    await setAllureMeta({
      title: "Price Filter - Products Displayed",
      description:
        "Verify that applying 0-100 range updates UI and shows matching products",
      severity: "normal",
      priority: "P1",
      owner: "QA Team",
      suite: "Products",
      feature: "Filtering",
      qaseCaseId: "?suite=5&case=11",
      parameters: {
        Browser: test.info().project.name,
        Min: "0",
        Max: "100",
        Coverage: "UI + A11y + Visual Regression",
      },
    });

    await test.step("Set range and intercept API request", async () => {
      const requestPromise = page.waitForRequest(
        (req) =>
          req.url().includes("/products") &&
          req.url().includes("between=price,0,100"),
      );

      await homePage.RangeSliderComponent.setRange(0, 100);

      const request = await requestPromise;
      expect(request.url()).toContain("between=price,0,100");
    });

    await test.step("Verify UI state, a11y and screenshot", async () => {
      await expect(homePage.RangeSliderComponent.productList).toBeVisible();
      await checkA11y("Price Filter - Results", { strict: false, debug: true });
      await expect(page.locator("body")).toHaveScreenshot(
        "price-filter-0-100.png",
        { maxDiffPixels: 40 },
      );
    });
  });

  test("Apply empty range (200-200) - empty state displayed", async ({
    page,
    checkA11y,
  }) => {
    await setAllureMeta({
      title: "Price Filter - Empty State Displayed",
      description: "Verify that 200-200 range triggers empty state",
      severity: "normal",
      priority: "P1",
      owner: "QA Team",
      suite: "Products",
      feature: "Filtering",
      qaseCaseId: "?suite=5&case=13",
      parameters: {
        Browser: test.info().project.name,
        Min: "200",
        Max: "200",
        Coverage: "UI + A11y + Visual Regression",
      },
    });

    await test.step("Set range and intercept API request", async () => {
      const requestPromise = page.waitForRequest((req) => {
        const url = req.url();
        return (
          url.includes("/products") && url.includes("between=price,200,200")
        );
      });

      await page.waitForTimeout(100);
      await homePage.RangeSliderComponent.setRange(200, 200);

      const request = await requestPromise;
      expect(request.url()).toContain("between=price,200,200");
    });

    await test.step("Verify empty state, a11y and screenshot", async () => {
      await expect(homePage.RangeSliderComponent.emptyState).toBeVisible();
      await expect(homePage.RangeSliderComponent.emptyState).toContainText(
        /There are no products found./i,
      );
      await checkA11y("Price Filter - Empty State", {
        strict: false,
        debug: true,
      });
      await expect(page.locator("body")).toHaveScreenshot(
        "price-filter-empty.png",
        {
          maxDiffPixels: 40,
        },
      );
    });
  });
});
