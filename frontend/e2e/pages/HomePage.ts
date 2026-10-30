import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly directoryContainer: Locator;
  readonly categoryButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.directoryContainer = page.getByRole("region", {
      name: "Directory Categories",
    });
    this.categoryButtons = this.directoryContainer.getByRole("button");
  }

  async goto(): Promise<void> {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  getCategoryButton(categoryName: string): Locator {
    return this.directoryContainer.getByRole("button", {
      name: new RegExp(`^${categoryName}$`, "i"),
    });
  }

  async selectCategory(categoryName: string): Promise<void> {
    await this.getCategoryButton(categoryName).click();
  }
}
