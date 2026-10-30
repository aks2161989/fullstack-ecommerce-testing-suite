import { Page, Locator } from "@playwright/test";

export class HeaderComponent {
  readonly page: Page;
  readonly nav: Locator;
  readonly logo: Locator;
  readonly navShopLink: Locator;
  readonly navSignInLink: Locator;
  readonly logoutButton: Locator;
  readonly cartIcon: Locator;
  readonly cartItemCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByRole("navigation");
    this.logo = this.nav.getByRole("link", { name: /crown clothing/i });
    this.navShopLink = this.nav.getByRole("link", { name: "SHOP" });
    this.navSignInLink = this.nav.getByRole("link", { name: "SIGN/SIGNUP" });
    this.logoutButton = this.nav.getByRole("button", { name: /log out/i });
    this.cartIcon = this.nav.getByRole("button", { name: /shopping cart/i });
    this.cartItemCount = this.cartIcon.getByText(/\d+/);
  }

  getNavLink(name: string): Locator {
    return this.nav.getByRole("link", { name: new RegExp(`^${name}$`, "i") });
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async clickShop(): Promise<void> {
    await this.navShopLink.click();
  }

  async clickSignIn(): Promise<void> {
    await this.navSignInLink.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }

  async toggleCart(): Promise<void> {
    await this.cartIcon.click();
  }
}
