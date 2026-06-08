import { Page, Locator } from "@playwright/test";

export class FilterComponent {
  readonly page: Page;
  readonly hammerCheckbox: Locator;
  readonly filterMenu: Locator;
  readonly filters: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hammerCheckbox = page.getByLabel("Hammer", { exact: true });
    this.filterMenu = page.getByRole("button", { name: "Filters" });
    this.filters = page.locator("#filters");
  }

  async selectCategory(categoryName: string): Promise<void> {
    await this.page.getByRole("checkbox", { name: categoryName }).check();
  }

  async isCategorySelected(categoryName: string): Promise<boolean> {
    return await this.page
      .getByRole("checkbox", { name: categoryName })
      .isChecked();
  }

  async clearCategoryFilter(categoryName: string): Promise<void> {
    await this.page.getByRole("checkbox", { name: categoryName }).uncheck();
  }

  async openFilter(): Promise<void> {
    await this.filterMenu.click();
  }
}
