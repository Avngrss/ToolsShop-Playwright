import { Page, Locator } from "@playwright/test";

export class SearchComponent {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly productList: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-test="search-query"]');
    this.productList = page.locator(".col-md-9 .container");
    this.emptyState = page.locator('[data-test="no-results"]');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }
}
