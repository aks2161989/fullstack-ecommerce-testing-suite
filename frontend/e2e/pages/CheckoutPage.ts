import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  readonly checkoutContainer: Locator;
  readonly checkoutItems: Locator;
  readonly totalPrice: Locator;
  readonly payNowButton: Locator;

  constructor(page: Page) {
    super(page);

    this.checkoutContainer = page.getByRole("region", { name: "Checkout" });
    this.checkoutItems = page.getByRole("row").filter({
      has: page.getByRole("img"),
    });
    this.totalPrice = page.getByRole("status", { name: "Total Price" });
    this.payNowButton = page.getByRole("button", { name: /pay now/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/checkout", { waitUntil: "domcontentloaded" });
  }

  private resolveItemName(
    itemOrName: string | { name?: string; expectedInitialItemName?: string }
  ): string {
    if (typeof itemOrName === "string") return itemOrName;
    return itemOrName.name || itemOrName.expectedInitialItemName || "";
  }

  getCheckoutItem(
    itemOrName: string | { name?: string; expectedInitialItemName?: string }
  ): Locator {
    const productName = this.resolveItemName(itemOrName);
    return this.page.getByRole("row", { name: new RegExp(productName, "i") });
  }

  getQuantityValue(
    itemOrName: string | { name?: string; expectedInitialItemName?: string }
  ): Locator {
    const productName = this.resolveItemName(itemOrName);
    return this.getCheckoutItem(productName).getByLabel(
      `Quantity of ${productName}`,
      { exact: true }
    );
  }

  async increaseQuantity(
    itemOrName: string | { name?: string; expectedInitialItemName?: string }
  ): Promise<void> {
    const productName = this.resolveItemName(itemOrName);
    await this.getCheckoutItem(productName)
      .getByRole("button", {
        name: `Increase quantity of ${productName}`,
        exact: true,
      })
      .click();
  }

  async decreaseQuantity(
    itemOrName: string | { name?: string; expectedInitialItemName?: string }
  ): Promise<void> {
    const productName = this.resolveItemName(itemOrName);
    await this.getCheckoutItem(productName)
      .getByRole("button", {
        name: `Decrease quantity of ${productName}`,
        exact: true,
      })
      .click();
  }

  async removeItem(
    itemOrName: string | { name?: string; expectedInitialItemName?: string }
  ): Promise<void> {
    const productName = this.resolveItemName(itemOrName);
    await this.getCheckoutItem(productName)
      .getByRole("button", {
        name: `Remove ${productName} from cart`,
        exact: true,
      })
      .click();
  }

  async payWithStripe(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
      this.payNowButton.click();
    });
  }
}
