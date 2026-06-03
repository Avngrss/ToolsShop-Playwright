import { Page, Locator } from "@playwright/test";

export class CartAppComponent {
  readonly page: Page;
  readonly emptyMessage: Locator;
  readonly qtyInput: Locator;
  readonly deleteBtn: Locator;
  readonly toastContainer: Locator;
  readonly proceedBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyMessage = page.getByText(
      "The cart is empty. Nothing to display.",
      { exact: true },
    );
    this.qtyInput = page.locator('[data-test="product-quantity"]');
    this.deleteBtn = page.locator(".btn.btn-danger");
    this.toastContainer = page.locator("#toast-container");
    this.proceedBtn = page.locator('[data-test="proceed-1"]');
  }

  async updateQuantity(qty: number): Promise<void> {
    await this.qtyInput.fill(String(qty));
    await this.page.keyboard.press("Enter");
  }

  async removeItem(): Promise<void> {
    await this.deleteBtn.click();
  }

  getToastByText(text: string | RegExp): Locator {
    return this.toastContainer.getByText(text);
  }

  async hasItems(): Promise<boolean> {
    return await this.qtyInput.isVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedBtn.click();
  }
}
