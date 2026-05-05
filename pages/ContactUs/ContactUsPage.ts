import { Page, Locator } from "@playwright/test";
import { PartialContactUsData } from "../../test-data/contact-us";

export class ContactUsPage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly subjectMenu: Locator;
  readonly messageField: Locator;
  readonly attachmentField: Locator;
  readonly contactSubmitButton: Locator;
  readonly successMessage: Locator;
  //Error Locators
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly subjectError: Locator;
  readonly messageError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.locator('[data-test="first-name"]');
    this.lastNameField = page.locator('[data-test="last-name"]');
    this.emailField = page.locator('[data-test="email"]');
    this.subjectMenu = page.locator('[data-test="subject"]');
    this.messageField = page.locator('[data-test="message"]');
    this.attachmentField = page.locator('[data-test="attachment"]');
    this.contactSubmitButton = page.locator('[data-test="contact-submit"]');
    this.successMessage = page.getByText(
      "Thanks for your message! We will contact you shortly.",
    );
    this.firstNameError = page.locator('[data-test="first-name-error"]');
    this.lastNameError = page.locator('[data-test="last-name-error"]');
    this.emailError = page.locator('[data-test="email-error"]');
    this.subjectError = page.locator('[data-test="subject-error"]');
    this.messageError = page.locator('[data-test="message-error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto("/contact");
  }

  async fillForm(data: PartialContactUsData): Promise<void> {
    if (data.firstName) await this.firstNameField.fill(data.firstName);
    if (data.lastName) await this.lastNameField.fill(data.lastName);
    if (data.email) await this.emailField.fill(data.email);
    if (data.subject) await this.subjectMenu.selectOption(data.subject);
    if (data.message) await this.messageField.fill(data.message);
  }

  async attachFile(filePath: string): Promise<void> {
    await this.attachmentField.setInputFiles(filePath);
  }

  async submit(): Promise<void> {
    await this.contactSubmitButton.click();
  }

  getErrorLocator(fieldName: string): Locator {
    return this.page.locator(`[data-test="${fieldName}-error"]`);
  }
}
