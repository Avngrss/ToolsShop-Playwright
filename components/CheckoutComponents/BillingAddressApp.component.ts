import { Page, Locator } from "@playwright/test";
import { PartialUser } from "./../../types/auth";

export class BillingAddressAppComponent {
  readonly page: Page;
  readonly countryDropdown: Locator;
  readonly postalCodeField: Locator;
  readonly houseNumberFiled: Locator;
  readonly proceedBtn3: Locator;
  readonly paymentSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryDropdown = page.locator('[data-test="country"]');
    this.postalCodeField = page.locator('[data-test="postal_code"]');
    this.houseNumberFiled = page.locator('[data-test="house_number"]');
    this.proceedBtn3 = page.locator('[data-test="proceed-3"]');
    this.paymentSuccessMessage = page.locator(
      '[data-test="payment-success-message"]',
    );
  }

  async fillBillingInfo(billingInfo: PartialUser) {
    if (
      !billingInfo.country ||
      !billingInfo.postal_code ||
      !billingInfo.house_number
    ) {
      throw new Error(
        "Billing checkout requires: email, postal_code, house_number",
      );
    }
    await this.countryDropdown.selectOption(billingInfo.country);
    await this.postalCodeField.fill(billingInfo.postal_code);
    await this.houseNumberFiled.fill(billingInfo.house_number);
  }

  async proceedCheckOut(): Promise<void> {
    await this.proceedBtn3.click();
  }
}
