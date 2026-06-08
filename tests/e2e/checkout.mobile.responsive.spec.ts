import { test, expect } from "../../fixtures";
import { setAllureMeta } from "../../utils/allure-utils";
import { HomePage } from "./../../pages/HomePage/HomePage";
import { ProductPage } from "./../../pages/ProductPage/ProductPage";
import { CheckoutPage } from "./../../pages/CheckoutPage/CheckoutPage";
import { loginUi } from "../../utils/auth.ui";
import { validBankTransfer } from "./../../types/paymentMethods";
import {
  isMobileOrTablet,
  getScreenshotSuffix,
  waitForVisualStability,
  assertNoHorizontalScroll,
} from "../../utils/responsive";

test(
  "E2E: Authenticated Checkout Flow (Mobile Smoke Path)",
  { tag: ["@e2e", "@checkout", "@auth", "@mobile-smoke", "@critical"] },
  async ({ page, request, createTestUser, checkA11y }) => {
    const suffix = getScreenshotSuffix(test.info().project.name);
    const isMobile = isMobileOrTablet(test.info());

    await setAllureMeta({
      title: "E2E Mobile - Auth Checkout Success",
      description:
        "Verify authenticated user journey on mobile: product → cart → checkout → payment → confirmation + visual regression",
      severity: "critical",
      priority: "P0",
      owner: "QA Team",
      suite: "Checkout Flow",
      feature: "Authenticated Order - Mobile",
      parameters: {
        Browser: test.info().project.name,
        Viewport: `${page.viewportSize()?.width}x${page.viewportSize()?.height}`,
        UserType: "Authenticated",
        PaymentMethod: "Bank Transfer",
        ExpectedResult: "Order confirmed with pre-filled user data",
        Coverage: "E2E UI + Mobile Layout + Visual Regression + A11y",
      },
    });

    const testUser = await createTestUser();
    await loginUi(page, request, {
      email: testUser.email,
      password: testUser.password,
    });

    const homePage = new HomePage(page);

    if (isMobile) {
      await assertNoHorizontalScroll(page);
    }

    await test.step("Navigate to Home Page", async () => {
      await homePage.goto();
    });

    await test.step("Navigate to Product Details", async () => {
      await homePage.gotoProductPage();
      await page.waitForLoadState("networkidle");
    });

    const productPage = new ProductPage(page);

    await test.step("Add product to cart & verify UI sync", async () => {
      await expect(productPage.addToCardBtn).toBeVisible();
      await productPage.addToCard();
      await expect(
        productPage.getToastByText(" Product added to shopping cart. "),
      ).toBeVisible();

      if (isMobile) {
        await test.step("Verify mobile menu & cart interaction", async () => {
          await productPage.header.openMobileMenu();
          await expect(productPage.header.mobileNavPanel).toBeVisible();

          await expect(async () => {
            expect(await productPage.header.getBadgeCount()).toBe(1);
          }).toPass({ timeout: 5000 });

          await waitForVisualStability(page);
          await expect(productPage.header.mobileNavPanel).toHaveScreenshot(
            `mobile-menu-open-${suffix}.png`,
            { maxDiffPixels: 80, threshold: 0.3 },
          );

          await productPage.header.openCart();
        });
      }
    });

    const checkOutPage = new CheckoutPage(page);

    await test.step("Open cart & redirect to checkout", async () => {
      await productPage.header.openCart();
      await expect(page).toHaveURL("/checkout");
      await checkOutPage.cartAppComponent.proceedToCheckout();

      if (isMobile) {
        await assertNoHorizontalScroll(page);
      }
    });

    await test.step("Proceed checkout as Customer", async () => {
      await checkOutPage.signInAppComponent.proceedCheckoutAsCustomer();

      if (isMobile) {
        await page.waitForLoadState("networkidle");

        const billingForm = page
          .locator(`aw-wizard-step > app-address > div.container`)
          .first();

        await expect(billingForm).toBeVisible({ timeout: 10000 });
        await checkOutPage.billingAddressAppComponent.countryDropdown.waitFor({
          state: "visible",
          timeout: 10000,
        });

        await checkOutPage.billingAddressAppComponent.countryDropdown.selectOption(
          "Canada",
        );

        await waitForVisualStability(page);
        await assertNoHorizontalScroll(page);

        await expect(billingForm).toHaveScreenshot(
          `mobile-billing-form-${suffix}.png`,
          {
            maxDiffPixels: 100,
            threshold: 0.35,
            timeout: 10000,
            mask: [
              page.locator('[data-test="street"]'),
              page.locator('[data-test="city"]'),
              page.locator('[data-test="state"]'),
              page.locator('[data-test="postal_code"]'),
              page.locator('[data-test="house_number"]'),
            ],
          },
        );

        await checkOutPage.billingAddressAppComponent.proceedCheckOut();
      }
    });

    await test.step("Process payment with Bank transfer", async () => {
      await checkOutPage.paymentAppComponent.fillBankTransferData(
        validBankTransfer,
      );
      await checkA11y("Checkout - Order Confirmation", { strict: false });
      await checkOutPage.paymentAppComponent.confirmPayment();

      await expect(
        checkOutPage.billingAddressAppComponent.paymentSuccessMessage,
      ).toBeVisible();
      await expect(
        checkOutPage.billingAddressAppComponent.paymentSuccessMessage,
      ).toHaveText("Payment was successful");
    });

    await test.step("Verify order confirmation & invoice generation", async () => {
      await checkOutPage.paymentAppComponent.confirmPayment();

      await expect(
        checkOutPage.paymentAppComponent.orderConfirmation,
      ).toBeVisible();
      await expect(
        checkOutPage.paymentAppComponent.orderConfirmation,
      ).toContainText(/Thanks for your order! Your invoice number is INV-\d+/);

      if (isMobile) {
        await waitForVisualStability(page);
        await expect(
          checkOutPage.paymentAppComponent.orderConfirmation,
        ).toHaveScreenshot(`mobile-order-success-${suffix}.png`, {
          maxDiffPixels: 80,
          threshold: 0.3,
          mask: [page.locator('[data-test="invoice-number"]')],
        });

        await assertNoHorizontalScroll(page);
      }
    });
  },
);
