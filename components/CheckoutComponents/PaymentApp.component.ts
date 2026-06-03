import { Page, Locator } from "@playwright/test";
import { CardData } from "./../../types/paymentMethods";
import { bankTransferData } from "./../../types/paymentMethods";

export class PaymentAppComponent {
  readonly page: Page;
  readonly paymentMethodDropdown: Locator;
  //Payment by card
  readonly creditCartNumberFiled: Locator;
  readonly expirationDateFiled: Locator;
  readonly CVVField: Locator;
  readonly cardHolderName: Locator;
  //Payment by bank transfer
  readonly bankName: Locator;
  readonly accountName: Locator;
  readonly accountNumber: Locator;
  //Common locators
  readonly confirmBnt: Locator;
  readonly paymentSuccessMessage: Locator;
  readonly orderConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentMethodDropdown = page.locator('[data-test="payment-method"]');
    //Card's locators
    this.creditCartNumberFiled = page.locator(
      '[data-test="credit_card_number"]',
    );
    this.expirationDateFiled = page.locator('[data-test="expiration_date"]');
    this.CVVField = page.locator('[data-test="cvv"]');
    this.cardHolderName = page.locator('[data-test="card_holder_name"]');
    //Bank Transfer Locators
    this.bankName = page.locator('[data-test="bank_name"]');
    this.accountName = page.locator('[data-test="account_name"]');
    this.accountNumber = page.locator('[data-test="account_number"]');
    //Common locators
    this.confirmBnt = page.locator('[data-test="finish"]');
    this.paymentSuccessMessage = page.locator(
      '[data-test="payment-success-message"]',
    );
    this.orderConfirmation = page.locator("#order-confirmation");
  }

  async fillCardData(cardData: CardData): Promise<void> {
    await this.paymentMethodDropdown.selectOption(cardData.paymentMethod);
    await this.creditCartNumberFiled.fill(cardData.cardNumber);
    await this.expirationDateFiled.fill(cardData.expirationDate);
    await this.CVVField.fill(cardData.cvv);
    await this.cardHolderName.fill(cardData.cardHolderName);
  }

  async fillBankTransferData(
    bankTransferData: bankTransferData,
  ): Promise<void> {
    await this.paymentMethodDropdown.selectOption(
      bankTransferData.paymentMethod,
    );
    await this.bankName.fill(bankTransferData.bankName);
    await this.accountName.fill(bankTransferData.accountName);
    await this.accountNumber.fill(bankTransferData.accountNumber);
  }

  async confirmPayment(): Promise<void> {
    await this.confirmBnt.click();
  }
}
