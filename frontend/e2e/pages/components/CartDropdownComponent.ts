import { Page, Locator } from "@playwright/test";

export class CartDropdownComponent {
  readonly page: Page;
  readonly cartDropdown: Locator;
  readonly emptyCartMessage: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartDropdown = page.getByRole("dialog", {
      name: /shopping cart dropdown/i,
    });
    // Properly scoped within the cart dropdown dialog container
    this.emptyCartMessage = this.cartDropdown.getByText(/your cart is empty/i);
    this.checkoutButton = this.cartDropdown.getByRole("button", {
      name: /go to checkout/i,
    });
  }

  getCartItem(
    itemOrName: string | { name?: string; expectedInitialItemName?: string }
  ): Locator {
    const name =
      typeof itemOrName === "string"
        ? itemOrName
        : itemOrName.name || itemOrName.expectedInitialItemName || "";
    return this.cartDropdown.getByText(new RegExp(name, "i"));
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
