import { Page, Locator } from "@playwright/test";

export class UserMenuComponent {
  readonly page: Page;
  readonly dropdownMenu: Locator;
  readonly signOutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdownMenu = page.locator(".dropdown-menu.show");
    this.signOutLink = this.dropdownMenu.getByText("Sign out");
  }

  async logout(): Promise<void> {
    await this.signOutLink.click();
    await this.page.waitForSelector(
      '[data-test="email"], a:has-text("Sign in")',
      {
        state: "visible",
        timeout: 10000,
      },
    );
  }
}
