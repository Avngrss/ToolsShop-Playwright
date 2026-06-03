import { test, expect } from "../../fixtures";
import { setAllureMeta } from "../../utils/allure-utils";
import { HomePage } from "./../../pages/HomePage/HomePage";
import { ProductPage } from "./../../pages/ProductPage/ProductPage";
import { CheckoutPage } from "./../../pages/CheckoutPage/CheckoutPage";
import { loginUi } from "../../utils/auth.ui";
import { validBankTransfer } from "./../../types/paymentMethods";

test(
  "E2E: Authenticated Checkout Flow",
  { tag: ["@e2e", "@checkout", "@auth", "@ui"] },
  async ({ page, request, createTestUser, checkA11y }) => {
    await setAllureMeta({
      title: "E2E - Auth Checkout Success",
      description:
        "Verify authenticated user journey: product → cart → checkout → payment → confirmation",
      severity: "critical",
      priority: "P0",
      owner: "QA Team",
      suite: "Checkout Flow",
      feature: "Authenticated Order",
      qaseCaseId: "?suite=5&case=102",
      parameters: {
        Browser: test.info().project.name,
        UserType: "Authenticated",
        PaymentMethod: "Visa Card",
        ExpectedResult: "Order confirmed with pre-filled user data",
        Coverage: "E2E UI + Auth Session + Payment + A11y + Visual",
      },
    });
    let testUser: { email: string; password: string };
    testUser = await createTestUser();

    await loginUi(page, request, {
      email: testUser.email,
      password: testUser.password,
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
      await checkOutPage.cartAppComponent.proceedToCheckout();
    });

    await test.step("Proceed checkout as Customer", async () => {
      await checkOutPage.signInAppComponent.proceedCheckoutAsCustomer();
    });

    await test.step("Fill billing address & proceed to payment", async () => {
      await checkOutPage.billingAddressAppComponent.countryDropdown.selectOption(
        "Canada",
      );
      await checkOutPage.billingAddressAppComponent.proceedCheckOut();
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
      await expect(
        checkOutPage.paymentAppComponent.orderConfirmation,
      ).toHaveScreenshot("checkout-order-success.png", { maxDiffPixels: 50 });
    });
  },
);
