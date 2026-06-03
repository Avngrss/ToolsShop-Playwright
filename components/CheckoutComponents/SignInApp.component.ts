import { Page, Locator } from "@playwright/test";
import { PartialUser } from "./../../types/auth";
import { LoginCredentials } from "../../types/auth";

export class SignInAppComponent {
  readonly page: Page;
  //Guest form
  readonly continueAsGuestTab: Locator;
  readonly guestEmailField: Locator;
  readonly guestFirstNameField: Locator;
  readonly continueGuestBtn: Locator;
  readonly guestLastNameField: Locator;
  readonly proceedAsGuestBtn: Locator;

  //Customer form
  readonly signInTab: Locator;
  readonly emailAddressField: Locator;
  readonly passwordField: Locator;
  readonly loginBtn: Locator;

  readonly proceed2Btn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueAsGuestTab = page.getByRole("tab", {
      name: "Continue as Guest",
    });
    this.guestEmailField = page.locator('[data-test="guest-email"]');
    this.guestFirstNameField = page.locator('[data-test="guest-first-name"]');
    this.continueGuestBtn = page.locator('[data-test="guest-submit"]');
    this.guestLastNameField = page.locator('[data-test="guest-last-name"]');
    this.proceedAsGuestBtn = page.locator('[data-test="proceed-2-guest"]');

    this.signInTab = page.getByRole("tab", { name: "Sign in" });
    this.emailAddressField = page.locator('[data-test="email"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginBtn = page.locator('[data-test="login-submit"]');
    this.proceed2Btn = page.locator('[data-test="proceed-2"]');
  }

  async goToGuestForm(): Promise<void> {
    await this.continueAsGuestTab.click();
  }

  async continueAsGuestForm(guestData: PartialUser): Promise<void> {
    if (!guestData.email || !guestData.first_name || !guestData.last_name) {
      throw new Error("Guest checkout requires: email, first_name, last_name");
    }
    await this.guestEmailField.fill(guestData.email);
    await this.guestFirstNameField.fill(guestData.first_name);
    await this.guestLastNameField.fill(guestData.last_name);
    await this.continueGuestBtn.click();
  }

  async proceedCheckoutAsGuest(): Promise<void> {
    this.proceedAsGuestBtn.click();
  }

  async proceedCheckoutAsCustomer(): Promise<void> {
    this.proceed2Btn.click();
  }

  async continueAsCustomer(credentials: LoginCredentials) {
    await this.signInTab.click();
    await this.emailAddressField.fill(credentials.email);
    await this.passwordField.fill(credentials.password);
    await this.loginBtn.click();
  }
}
