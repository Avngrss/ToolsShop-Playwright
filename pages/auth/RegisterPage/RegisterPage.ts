import { Locator, Page } from "@playwright/test";
import { User } from "../../../types/auth";

export class RegisterPage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly dboField: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeField: Locator;
  readonly houseNumber: Locator;
  readonly streetField: Locator;
  readonly cityField: Locator;
  readonly stateField: Locator;
  readonly phoneField: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly registerSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.locator('[data-test="first-name"]');
    this.lastNameField = page.locator('[data-test="last-name"]');
    this.dboField = page.locator('[data-test="dob"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeField = page.locator('[data-test="postal_code"]');
    this.houseNumber = page.locator('[data-test="house_number"]');
    this.streetField = page.locator('[data-test="street"]');
    this.cityField = page.locator('[data-test="city"]');
    this.stateField = page.locator('[data-test="state"]');
    this.phoneField = page.locator('[data-test="phone"]');
    this.emailField = page.locator('[data-test="email"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.registerSubmitButton = page.locator('[data-test="register-submit"]');
  }

  async registerUser(userData: User) {
    await this.firstNameField.fill(userData.first_name);
    await this.lastNameField.fill(userData.last_name);
    await this.dboField.fill(userData.dob);
    await this.countrySelect.selectOption(userData.country);
    await this.postalCodeField.fill(userData.postal_code);
    await this.houseNumber.fill(userData.house_number);
    await this.streetField.fill(userData.street);
    await this.stateField.fill(userData.state);
    await this.phoneField.fill(userData.phone);
    await this.emailField.fill(userData.email);
    await this.passwordField.fill(userData.password);
  }

  async submitForm() {
    await this.registerSubmitButton.click();
  }
}
