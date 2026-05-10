import { Page, Locator } from "@playwright/test";

export class FilterComponent {
  readonly page: Page;
  readonly hammerCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hammerCheckbox = page.getByLabel("Hammer", { exact: true });
  }

  async selectCategory(categoryName: string): Promise<void> {
    await this.page.getByRole("checkbox", { name: categoryName }).check();
  }

  async isCategorySelected(categoryName: string): Promise<boolean> {
    return await this.page
      .getByRole("checkbox", { name: categoryName })
      .isChecked();
  }
}
