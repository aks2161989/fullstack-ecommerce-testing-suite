import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ShopPage extends BasePage {
  readonly categoryNav: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);

    // User-facing roles (official Playwright best practices)
    this.categoryNav = page.getByRole("complementary", {
      name: /category navigation/i,
    });
    this.productCards = page.getByRole("article");
  }

  async goto(categoryPath = "/shop"): Promise<void> {
    await this.page.goto(categoryPath, { waitUntil: "domcontentloaded" });
  }

  getSidebarCategoryLink(categoryName: string): Locator {
    return this.categoryNav.getByRole("link", {
      name: new RegExp(`^${categoryName}$`, "i"),
    });
  }

  getProductCard(productName?: string): Locator {
    if (productName) {
      return this.page.getByRole("article", {
        name: new RegExp(productName, "i"),
      });
    }
    return this.productCards.first();
  }

  async selectSidebarCategory(categoryName: string): Promise<void> {
    await this.getSidebarCategoryLink(categoryName).click();
  }

  async addProductToCartByIndex(index: number = 0): Promise<void> {
    const card = this.productCards.nth(index);
    await card.hover();
    const addButton = card.getByRole("button", { name: /add to cart/i });
    await addButton.click();
  }

  async addProductToCartByName(name: string): Promise<void> {
    const card = this.getProductCard(name);
    await card.hover();
    const addButton = card.getByRole("button", { name: /add to cart/i });
    await addButton.click();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.addProductToCartByIndex(0);
  }
}
