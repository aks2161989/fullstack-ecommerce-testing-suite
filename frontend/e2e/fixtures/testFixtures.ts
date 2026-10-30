import { test as baseTest, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ShopPage } from "../pages/ShopPage";
import { AuthPage } from "../pages/AuthPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HeaderComponent } from "../pages/components/HeaderComponent";
import { CartDropdownComponent } from "../pages/components/CartDropdownComponent";
import { FooterComponent } from "../pages/components/FooterComponent";

export type TestFixtures = {
  homePage: HomePage;
  shopPage: ShopPage;
  authPage: AuthPage;
  checkoutPage: CheckoutPage;
  header: HeaderComponent;
  cartDropdown: CartDropdownComponent;
  footer: FooterComponent;
};

export const test = baseTest.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  cartDropdown: async ({ page }, use) => {
    await use(new CartDropdownComponent(page));
  },
  footer: async ({ page }, use) => {
    await use(new FooterComponent(page));
  },
});

export { expect };
