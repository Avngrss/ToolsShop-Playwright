import { Page, Locator } from "@playwright/test";
import { LoginCredentials } from "../../../types/auth";
import { ErrorField } from "../../../types/auth";

export class LoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly submitButton: Locator;

  //Errors
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator('[data-test="email"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.submitButton = page.locator('[data-test="login-submit"]');
    this.emailError = page.locator('[data-test="email-error"]');
    this.passwordError = page.locator('[data-test="password-error"]');
    this.loginError = page.locator('[data-test="login-error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto("/auth/login");
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.emailField.pressSequentially(credentials.email, { delay: 80 });
    await this.passwordField.pressSequentially(credentials.password, {
      delay: 100,
    });
    await this.submitButton.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  getErrorLocator(field: ErrorField): Locator {
    const errorMap: Record<ErrorField, Locator> = {
      emailError: this.emailError,
      passwordError: this.passwordError,
      loginError: this.loginError,
    };
    return errorMap[field];
  }
}
