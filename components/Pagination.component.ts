import { Page, Locator } from "@playwright/test";

export class PaginationComponent {
  readonly page: Page;
  readonly paginationUl: Locator;
  readonly prevButton: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paginationUl = page.locator("ul.pagination");
    this.prevButton = page.locator('[data-test="pagination-prev"]');
    this.nextButton = page.locator('[data-test="pagination-next"]');
  }

  async clickPrev(): Promise<void> {
    await this.prevButton.click();
  }
  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  async clickPage(num: number): Promise<void> {
    await this.page.click(`a[aria-label="Page-${num}"]`);
  }

  async goToLastPage(): Promise<void> {
    await this.paginationUl.locator('a[aria-label^="Page-"]').last().click();
  }

  getPrevLi() {
    return this.prevButton.locator("..");
  }
  getNextLi() {
    return this.nextButton.locator("..");
  }
  getPageLi(num: number) {
    return this.page.locator(`a[aria-label="Page-${num}"]`).locator("..");
  }

  async getActivePageNumber(): Promise<number> {
    const label = await this.paginationUl
      .locator("li.active a")
      .getAttribute("aria-label");
    return parseInt(label?.replace("Page-", "") || "1", 10);
  }
}
