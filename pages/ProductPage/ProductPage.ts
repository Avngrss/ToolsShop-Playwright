import { Header } from "./../../components/Header.component";
import { Page, Locator } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly addToCardBtn: Locator;
  readonly addToFavoriteBtn: Locator;
  readonly addToCompareBtn: Locator;
  readonly header: Header;
  readonly toastContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.addToCardBtn = page.locator('[data-test="add-to-cart"]');
    this.addToFavoriteBtn = page.locator('[data-test="add-to-favorites"]');
    this.addToCompareBtn = page.locator('[data-test="add-to-compare"]');
    this.toastContainer = page.locator("#toast-container");
  }

  async addToCard(): Promise<void> {
    await this.addToCardBtn.click();
  }

  async addToFavorite(): Promise<void> {
    await this.addToFavoriteBtn.click();
  }

  async addToCompare(): Promise<void> {
    await this.addToCompareBtn.click();
  }

  getToastByText(text: string | RegExp): Locator {
    return this.toastContainer.getByText(text);
  }
}
