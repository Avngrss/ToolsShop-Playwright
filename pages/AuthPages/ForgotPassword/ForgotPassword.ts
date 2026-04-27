import { Locator, Page } from "@playwright/test";

export class ForgotPassword {
  readonly page: Page;
  readonly emailAddress: Locator;
  readonly forgotPasswordSubmit: Locator;
  readonly successNotification: Locator;
  readonly emailErrorNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailAddress = page.locator('[data-test="email"]');
    this.forgotPasswordSubmit = page.locator(
      '[data-test="forgot-password-submit"]',
    );
    this.emailErrorNotification = page.getByText(
      /The selected email is invalid\.?/i,
    );
    this.successNotification = page.getByText("page.forgot-password.confirm", {
      exact: true,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/auth/forgot-password");
  }

  async fillForgotEmailField(email: string): Promise<void> {
    await this.emailAddress.fill(email);
  }

  async submitForm(): Promise<void> {
    await this.forgotPasswordSubmit.click();
  }

  async submitAndWaitForApiError(expectedStatus = 422) {
    const responsePromise = this.page.waitForResponse(
      (r) =>
        r.url().includes("forgot-password") && r.status() === expectedStatus,
    );
    await this.submitForm();
    return await responsePromise;
  }
}
