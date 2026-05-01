import { Page, Locator } from "@playwright/test";

export class SortingComponent {
  readonly page: Page;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortSelect = page.locator('[data-test="sort"]');
  }

  async selectOption(value: string) {
    await this.sortSelect.selectOption({ value });
  }
}
