import { test, expect } from "../../../fixtures";
import { setAllureMeta } from "../../../utils/allure-utils";
import { HomePage } from "./../../../pages/HomePage/HomePage";

test.describe("Product Pagination UI", { tag: ["@ui", "@pagination"] }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test(
    "Basic navigation: Next, Prev, and direct page selection",
    { tag: ["@smoke"] },
    async ({ checkA11y, page }) => {
      await setAllureMeta({
        title: "Pagination UI - Basic Navigation",
        description:
          "Verify Next/Prev buttons and direct page number clicks update active state correctly",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Products",
        feature: "Pagination UI",
        qaseCaseId: "?suite=8&case=19",
        parameters: {
          Browser: test.info().project.name,
          Coverage: "UI State + A11y + Visual Regression",
          ExpectedBehavior:
            "Active page highlights, Prev/Next toggle correctly",
        },
      });

      await test.step("Verify initial state: Page 1 active, Prev disabled", async () => {
        expect(await homePage.PaginationComponent.getActivePageNumber()).toBe(
          1,
        );
        await expect(homePage.PaginationComponent.getPrevLi()).toHaveClass(
          /disabled/,
        );
      });

      await test.step("Click Next → Page 2 becomes active, Prev enabled", async () => {
        await homePage.PaginationComponent.clickNext();
        expect(await homePage.PaginationComponent.getActivePageNumber()).toBe(
          2,
        );
        await expect(homePage.PaginationComponent.getPrevLi()).not.toHaveClass(
          /disabled/,
        );
      });

      await test.step("Click Page 4 directly → navigation works", async () => {
        await homePage.PaginationComponent.clickPage(4);
        expect(await homePage.PaginationComponent.getActivePageNumber()).toBe(
          4,
        );
      });

      await test.step("Click Page 4 directly → navigation works", async () => {
        await homePage.PaginationComponent.clickPage(4);
        expect(await homePage.PaginationComponent.getActivePageNumber()).toBe(
          4,
        );
      });

      await test.step("Visual & Accessibility baseline", async () => {
        await checkA11y("Pagination - Active Navigation", {
          strict: false,
          debug: true,
        });
        await expect(
          homePage.PaginationComponent.paginationUl,
        ).toHaveScreenshot("pagination-nav-active.png", { maxDiffPixels: 50 });
      });
    },
  );

  test(
    "Boundary state: Last page disables Next button",
    { tag: ["@negative"] },
    async ({ checkA11y, page }) => {
      await setAllureMeta({
        title: "Pagination UI - Last Page Boundary",
        description:
          "Verify Next button is disabled on last page and re-enables after navigating back",
        severity: "normal",
        priority: "P1",
        owner: "QA Team",
        suite: "Products",
        feature: "Pagination UI",
        qaseCaseId: "?suite=8&case=20",
        parameters: {
          Browser: test.info().project.name,
          Coverage: "UI State + A11y + Visual Regression",
          ExpectedBehavior: "Next disabled at boundary, UI remains consistent",
        },
      });

      await test.step("Navigate to last page", async () => {
        await homePage.PaginationComponent.goToLastPage();
        expect(
          await homePage.PaginationComponent.getActivePageNumber(),
        ).toBeGreaterThan(1);
      });

      await test.step("Verify Next button is disabled", async () => {
        await expect(homePage.PaginationComponent.getNextLi()).toHaveClass(
          /disabled/,
        );
      });

      await test.step("Click Prev → Next becomes enabled again", async () => {
        await homePage.PaginationComponent.clickPrev();
        await expect(homePage.PaginationComponent.getNextLi()).not.toHaveClass(
          /disabled/,
        );
      });

      await test.step("Visual & Accessibility baseline", async () => {
        await checkA11y("Pagination - Last Page Boundary", {
          strict: false,
          debug: true,
        });
        await expect(
          homePage.PaginationComponent.paginationUl,
        ).toHaveScreenshot("pagination-last-page-boundary.png", {
          maxDiffPixels: 50,
        });
      });
    },
  );
});
