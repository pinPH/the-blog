import { expect, Locator, Page } from "@playwright/test";
import { BaseAppPage } from "./BaseAppPage";

export class NotFoundPagePOM extends BaseAppPage {
  readonly title: Locator;
  readonly backToHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByText("Page not found");
    this.backToHomeButton = page.getByRole("button", { name: "Back to home" });
  }

  async gotoUnknownRoute() {
    await this.page.goto("/e2e");
  }

  async backToHome() {
    await this.backToHomeButton.click();
  }

  async expectLoaded() {
    await expect(this.title).toBeVisible();
    await expect(this.backToHomeButton).toBeVisible();
  }
}
