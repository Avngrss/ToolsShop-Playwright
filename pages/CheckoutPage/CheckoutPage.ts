import { Page } from "@playwright/test";
import { Header } from "../../components/Header.component";
import { CartAppComponent } from "./../../components/CheckoutComponents/CartApp.component";
import { SignInAppComponent } from "./../../components/CheckoutComponents/SignInApp.component";
import { BillingAddressAppComponent } from "./../../components/CheckoutComponents/BillingAddressApp.component";
import { PaymentAppComponent } from "./../../components/CheckoutComponents/PaymentApp.component";

export class CheckoutPage {
  readonly page: Page;
  readonly header: Header;
  readonly cartAppComponent: CartAppComponent;
  readonly signInAppComponent: SignInAppComponent;
  readonly billingAddressAppComponent: BillingAddressAppComponent;
  readonly paymentAppComponent: PaymentAppComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.cartAppComponent = new CartAppComponent(page);
    this.signInAppComponent = new SignInAppComponent(page);
    this.billingAddressAppComponent = new BillingAddressAppComponent(page);
    this.paymentAppComponent = new PaymentAppComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/checkout");
  }
}
