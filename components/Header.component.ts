import { Page, Locator } from "@playwright/test";
import { UserMenuComponent } from "./UserMenu.component";

export class Header {
  readonly page: Page;
  readonly authButton: Locator;
  readonly userMenu: UserMenuComponent;

  constructor(page: Page) {
    this.page = page;
    this.authButton = page.locator('[data-test="nav-menu"]');
    this.userMenu = new UserMenuComponent(page);
  }

  async clickAuthButton(): Promise<void> {
    await this.authButton.click();
  }
}
