import { test, expect } from "../../fixtures";
import { setAllureMeta } from "../../utils/allure-utils";
import { HomePage } from "./../../pages/HomePage/HomePage";
import { ProductPage } from "./../../pages/ProductPage/ProductPage";
import { CheckoutPage } from "./../../pages/CheckoutPage/CheckoutPage";
import { createUser } from "./../../utils/userFactory";
import { validCard } from "./../../types/paymentMethods";

test(
  "Guest proceeds a checkout",
  { tag: ["@e2e", "@ui", "@checkout"] },
  async ({ page, checkA11y }) => {
    await setAllureMeta({
      title: "E2E - Guest Checkout Success",
      description:
        "Verify full guest journey: product page → add to cart → guest checkout → billing → payment → order confirmation",
      severity: "critical",
      priority: "P0",
      owner: "QA Team",
      suite: "Checkout Flow",
      feature: "Guest Order",
      parameters: {
        Browser: test.info().project.name,
        UserType: "Guest",
        PaymentMethod: "Visa Card",
        ExpectedResult: "Order confirmed with generated invoice number",
        Coverage: "E2E UI Flow + A11y + Visual Regression + Payment Gateway",
      },
    });

    const homePage = new HomePage(page);

    await test.step("Navigate to Home Page", async () => {
      await homePage.goto();
    });

    await test.step("Navigate to Product Details", async () => {
      await homePage.gotoProductPage();
    });

    const productPage = new ProductPage(page);

    await test.step("Add product to cart & verify UI sync", async () => {
      await expect(productPage.addToCardBtn).toBeVisible();
      await productPage.addToCard();
      await expect(
        productPage.getToastByText(" Product added to shopping cart. "),
      ).toBeVisible();
      await expect(async () => {
        expect(await productPage.header.getBadgeCount()).toBe(1);
      }).toPass({ timeout: 5000 });
    });

    const checkOutPage = new CheckoutPage(page);

    await test.step("Open cart & redirect to checkout", async () => {
      await productPage.header.openCart();
      await expect(page).toHaveURL("/checkout");
    });

    await test.step("Proceed to checkout", async () => {
      await checkOutPage.cartAppComponent.proceedToCheckout();
      await checkOutPage.signInAppComponent.goToGuestForm();

      await checkA11y("Checkout - Guest Form", { strict: false });
      await expect(page.locator("#guest-tab")).toHaveScreenshot(
        "checkout-guest-form.png",
        { maxDiffPixels: 50 },
      );
    });

    const user = createUser();

    await test.step("Fill guest details & proceed to billing", async () => {
      await checkOutPage.signInAppComponent.continueAsGuestForm(user);
      await checkOutPage.signInAppComponent.proceedCheckoutAsGuest();
    });

    await test.step("Fill billing address & proceed to payment", async () => {
      await checkOutPage.billingAddressAppComponent.fillBillingInfo(user);
      await checkA11y("Checkout - Payment Form", { strict: false });
      await expect(
        page.locator('.login-form-1:has(h3:has-text("Payment"))'),
      ).toHaveScreenshot("checkout-payment-form.png", { maxDiffPixels: 50 });
      await checkOutPage.billingAddressAppComponent.proceedCheckOut();
    });

    await test.step("Process payment with Visa Card", async () => {
      await checkOutPage.paymentAppComponent.fillCardData(validCard);
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
      await checkA11y("Checkout - Order Confirmation", { strict: false });
      await expect(
        checkOutPage.paymentAppComponent.orderConfirmation,
      ).toHaveScreenshot("checkout-order-success.png", { maxDiffPixels: 50 });
    });
  },
);
