import { Page, Locator } from "@playwright/test";
import { UserMenuComponent } from "./UserMenu.component";

export class Header {
  readonly page: Page;
  readonly authButton: Locator;
  readonly userMenu: UserMenuComponent;
  readonly cartIcon: Locator;
  readonly badge: Locator;

  //Links
  readonly navHome: Locator;
  readonly navCategories: Locator;
  readonly navContact: Locator;
  readonly navSignIn: Locator;
  readonly languageSelect: Locator;

  //Mobile
  readonly mobileMenuBtn: Locator;
  readonly mobileNavPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authButton = page.locator('[data-test="nav-menu"]');
    this.cartIcon = page.locator('[data-test="nav-cart"]');
    this.badge = page.locator('[data-test="cart-quantity"]');
    //Mobile
    this.userMenu = new UserMenuComponent(page);
    this.mobileMenuBtn = page.getByRole("button", {
      name: "Toggle navigation",
    });
    this.mobileNavPanel = page.locator("#navbarSupportedContent");
    //Links
    this.navHome = page.locator('[data-test="nav-home"]');
    this.navCategories = page.locator('[data-test="nav-categories"]');
    this.navContact = page.locator('[data-test="nav-contact"]');
    this.navSignIn = page.locator('[data-test="nav-sign-in"]');
    this.languageSelect = page.locator('[data-test="language-select"]');
  }

  async clickAuthButton(): Promise<void> {
    await this.authButton.click();
  }

  async gotoSignInPage(): Promise<void> {
    await this.navSignIn.click();
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

  async openMobileMenu(): Promise<void> {
    await this.mobileMenuBtn.click();
    await this.mobileNavPanel.waitFor({ state: "visible" });
  }
}
