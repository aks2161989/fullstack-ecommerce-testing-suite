import { Page, Locator } from "@playwright/test";
import { HeaderComponent } from "./components/HeaderComponent";
import { CartDropdownComponent } from "./components/CartDropdownComponent";
import { FooterComponent } from "./components/FooterComponent";

export class BasePage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly cartDropdownComponent: CartDropdownComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.cartDropdownComponent = new CartDropdownComponent(page);
    this.footer = new FooterComponent(page);
  }

  // Delegated accessors for backward-compatibility & ergonomics
  get nav(): Locator {
    return this.header.nav;
  }

  get logo(): Locator {
    return this.header.logo;
  }

  get navShopLink(): Locator {
    return this.header.navShopLink;
  }

  get navSignInLink(): Locator {
    return this.header.navSignInLink;
  }

  get logoutButton(): Locator {
    return this.header.logoutButton;
  }

  get cartIcon(): Locator {
    return this.header.cartIcon;
  }

  get cartItemCount(): Locator {
    return this.header.cartItemCount;
  }

  get cartDropdown(): Locator {
    return this.cartDropdownComponent.cartDropdown;
  }

  get emptyCartMessage(): Locator {
    return this.cartDropdownComponent.emptyCartMessage;
  }

  get checkoutButton(): Locator {
    return this.cartDropdownComponent.checkoutButton;
  }

  async toggleCart(): Promise<void> {
    await this.header.toggleCart();
  }

  async clickLogo(): Promise<void> {
    await this.header.clickLogo();
  }

  async clickLogout(): Promise<void> {
    await this.header.clickLogout();
  }

  async proceedToCheckoutFromDropdown(): Promise<void> {
    await this.cartDropdownComponent.proceedToCheckout();
  }
}
