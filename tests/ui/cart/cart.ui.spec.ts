import { HomePage } from "./../../../pages/HomePage/HomePage";
import { test, expect } from "../../../fixtures";
import { setAllureMeta } from "../../../utils/allure-utils";
import { CheckoutPage } from "../../../pages/CheckoutPage/CheckoutPage";

test.describe("Cart test UI", { tag: ["@ui", "@cart"] }, () => {
  let checkoutPage: CheckoutPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page, setupCartUi }) => {
    checkoutPage = new CheckoutPage(page);
    await setupCartUi();
    homePage = new HomePage(page);
    await homePage.header.openCart();
  });

  test("Updates badge and shows toast on quantity change", async ({
    checkA11y,
    page,
  }) => {
    await setAllureMeta({
      title: "Cart UI - Quantity Update & Badge Sync",
      description:
        "Verify that changing product quantity in cart header updates badge count and shows success toast",
      severity: "critical",
      priority: "P0",
      owner: "QA Team",
      suite: "Cart Header",
      feature: "Quantity Management",
      qaseCaseId: "?suite=10&case=28",
      parameters: {
        Browser: test.info().project.name,
        Page: "Product Listing / Global Header",
        Action: "Open cart → Change qty input → Press Enter",
        ExpectedResult:
          "Toast 'Product quantity updated.' visible; badge count matches new quantity",
        Coverage: "UI + API (setupCartUi) + Toast + A11y + Visual Regression",
      },
    });

    await test.step("Change quantity to 3", async () => {
      await checkoutPage.cartAppComponent.updateQuantity(3);
    });

    await test.step("Verify toast and badge state", async () => {
      await expect(
        checkoutPage.cartAppComponent.getToastByText(
          "Product quantity updated.",
        ),
      ).toBeVisible();
      await expect(async () => {
        expect(await checkoutPage.header.getBadgeCount()).toBe(3);
      }).toPass({ timeout: 5000 });
    });

    await test.step("Verify A11y & visual baseline", async () => {
      await checkA11y("Cart - Qty Updated", {
        strict: false,
        debug: true,
      });
      await expect(page).toHaveScreenshot("cart-item-qty-updated.png", {
        maxDiffPixels: 50,
        threshold: 0.2,
        timeout: 10000,
      });
    });
  });

  test("Shows toast and empty state after removing item", async ({
    page,
    checkA11y,
  }) => {
    await setAllureMeta({
      title: "Cart UI - Remove Item & Empty State",
      description:
        "Verify that removing the last item from cart header shows success toast, resets badge to 0, and displays empty state message",
      severity: "critical",
      priority: "P1",
      owner: "QA Team",
      suite: "Cart Header",
      feature: "Item Removal",
      qaseCaseId: "?suite=10&case=25",
      parameters: {
        Browser: test.info().project.name,
        Page: "Product Listing / Global Header",
        Action: "Open cart → Click remove button → Confirm deletion",
        ExpectedResult:
          "Toast 'Product deleted.' visible; badge count = 0; empty message displayed",
        Coverage:
          "UI + API (setupCartUi) + Toast + sessionStorage sync + A11y + Visual Regression",
      },
    });

    await test.step("Remove the only item", async () => {
      await checkoutPage.cartAppComponent.removeItem();
    });

    await test.step("Verify empty state and badge reset", async () => {
      await expect(
        checkoutPage.cartAppComponent.getToastByText("Product deleted."),
      ).toBeVisible();
      await expect(checkoutPage.cartAppComponent.emptyMessage).toBeVisible({
        timeout: 5000,
      });
      expect(await checkoutPage.header.getBadgeCount()).toBe(0);
    });

    await test.step("Verify A11y & visual baseline", async () => {
      await checkA11y("Cart - Empty State", {
        strict: false,
        debug: true,
      });

      await expect(page).toHaveScreenshot("cart-empty-state.png", {
        maxDiffPixels: 50,
        threshold: 0.2,
        timeout: 10000,
      });
    });
  });
});
