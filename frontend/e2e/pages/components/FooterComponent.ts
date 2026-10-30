import { Page, Locator } from "@playwright/test";

export class FooterComponent {
  readonly page: Page;
  readonly footer: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = page.locator("footer");
    this.copyrightText = this.footer.getByText(/copyrights/i);
  }
}
