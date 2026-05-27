import { Page, Locator } from "@playwright/test";
import { Header } from "../../components/Header.component";

export class CartPage {
  readonly page: Page;
  readonly emptyMessage: Locator;
  readonly qtyInput: Locator;
  readonly deleteBtn: Locator;
  readonly toastContainer: Locator;
  readonly header: Header;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.emptyMessage = page.getByText(
      "The cart is empty. Nothing to display.",
      { exact: true },
    );
    this.qtyInput = page.locator('[data-test="product-quantity"]');
    this.deleteBtn = page.locator(".btn.btn-danger");
    this.toastContainer = page.locator("#toast-container");
  }

  async goto(): Promise<void> {
    await this.page.goto("/checkout");
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
}
