import { Page, Locator } from "@playwright/test";
import { UserMenuComponent } from "./UserMenu.component";

export class Header {
  readonly page: Page;
  readonly authButton: Locator;
  readonly userMenu: UserMenuComponent;
  readonly cartIcon: Locator;
  readonly badge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authButton = page.locator('[data-test="nav-menu"]');
    this.cartIcon = page.locator('[data-test="nav-cart"]');
    this.badge = page.locator('[data-test="cart-quantity"]');
    this.userMenu = new UserMenuComponent(page);
  }

  async clickAuthButton(): Promise<void> {
    await this.authButton.click();
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async getBadgeCount(): Promise<number> {
    const isVisible = await this.badge.isVisible();
    if (!isVisible) return 0;
    const text = await this.badge.innerText();
    const num = parseInt(text, 10);
    return isNaN(num) ? 0 : num;
  }
}
