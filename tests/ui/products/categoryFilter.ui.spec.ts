import { test, expect } from "../../../fixtures/data/users.fixture";
import { setAllureMeta } from "../../../utils/allure-utils";
import { HomePage } from "./../../../pages/HomePage/HomePage";

test.describe(
  "Product Category Filters UI",
  { tag: ["@ui", "@filters"] },
  () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.goto();
    });

    test("Select Hammer category filters products", async ({
      page,
      checkA11y,
    }) => {
      await setAllureMeta({
        title: "Filter - Category Selection Shows Correct Products",
        description:
          "Verify that selecting 'Hammer' category filters product list and displays only relevant items",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Products",
        feature: "Category Filter",
        qaseCaseId: "?suite=7&case=17",
        parameters: {
          Browser: test.info().project.name,
          Category: "Hammer",
          ExpectedBehavior: "Show only Hammer products",
        },
      });

      await test.step("Selects Hammer category", async () => {
        const responsePromise = page.waitForResponse(
          (res) => res.url().includes("/products") && res.status() === 200,
        );
        await homePage.FilterComponent.selectCategory("Hammer");
        await responsePromise;

        await expect(
          homePage.productList.locator(".card").first(),
        ).toBeVisible();
      });

      await test.step("Verify products list is not empty", async () => {
        const cards = homePage.productList.locator(".card");
        await expect(cards).not.toHaveCount(0);
      });

      await test.step("Verify ALL products match the filter", async () => {
        await expect(async () => {
          const titles = await homePage.productList
            .locator('[data-test="product-name"]')
            .evaluateAll((nodes) =>
              nodes.map((n) => n.textContent?.toLowerCase().trim() || ""),
            );
          const allMatch = titles.every((text) => text.includes("hammer"));
          expect(
            allMatch,
            `Not all products matched! Found: [${titles.join(", ")}]`,
          ).toBeTruthy();
        }).toPass();
      });

      await test.step("Verify accessibility (non-blocking)", async () => {
        await checkA11y("Product List with Hammer Filter", {
          strict: false,
          debug: true,
        });
      });

      await test.step("Capture visual baseline", async () => {
        await expect(page.locator("body")).toHaveScreenshot(
          "filter-hammer-active.png",
          {
            maxDiffPixels: 50,
          },
        );
      });
    });

    test("Select category with no results - empty state displayed", async ({
      page,
      checkA11y,
    }) => {
      await setAllureMeta({
        title: "Filter - Empty State When No Products Match",
        description:
          "Verify that selecting a category with no products displays appropriate empty state message instead of error or blank screen",
        severity: "normal",
        priority: "P1",
        owner: "QA Team",
        suite: "Products",
        feature: "Category Filter",
        qaseCaseId: "?case=53&suite=7",
        parameters: {
          Browser: test.info().project.name,
          Category: "Hand Saw",
          ExpectedResult: "Empty state message",
        },
      });

      await test.step("Select category with no results", async () => {
        await homePage.FilterComponent.selectCategory("Grinder");
        await expect(
          homePage.FilterComponent.page.getByRole("checkbox", {
            name: "Grinder",
          }),
        ).toBeChecked();
      });

      await test.step("Verify empty state message", async () => {
        await expect(homePage.emptyState).toBeVisible();
        await expect(homePage.emptyState).toContainText(/no products/i);
      });

      await test.step("Verify accessibility of empty state", async () => {
        await checkA11y("Product List Empty State", {
          strict: false,
          debug: true,
        });
      });

      await test.step("Capture visual baseline of empty state", async () => {
        await expect(page.locator("body")).toHaveScreenshot(
          "filter-empty-state.png",
          {
            maxDiffPixels: 50,
          },
        );
      });
    });
  },
);
