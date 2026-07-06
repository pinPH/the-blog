import { expect, Locator, Page } from "@playwright/test";
import { BaseAppPage } from "./BaseAppPage";

export class HomePagePOM extends BaseAppPage {
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly activeTagFilter: Locator;
  readonly clearTagFilter: Locator;
  readonly composeInput: Locator;
  readonly postButton: Locator;
  readonly postCards: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId("search-input");
    this.searchSubmit = page.getByTestId("search-submit");
    this.activeTagFilter = page.getByTestId("active-tag-filter");
    this.clearTagFilter = page.getByTestId("clear-tag-filter");
    this.composeInput = page.getByPlaceholder("What is happening?!");
    this.postButton = page.getByRole("button", { name: "Post" });
    this.postCards = page.getByTestId("post-card");
  }

  async goto() {
    await this.page.goto("/");
  }

  async gotoLegacyHomeAndAssertRedirect() {
    await this.page.goto("/home");
    await expect(this.page).toHaveURL(/\/$/);
  }

  async searchByQuery(text: string) {
    await this.searchInput.fill(text);
    await this.searchSubmit.click();
  }

  async clearTag() {
    await this.clearTagFilter.click();
  }

  async createPost(content: string) {
    await this.composeInput.fill(content);
    await this.postButton.click();
  }

  async openPostFromAnotherUser(username: string) {
    await this.postCards.filter({ hasNotText: username }).first().click();
  }

  async deletePost(content: string) {
    const postCard = this.page
      .locator(".MuiCard-root")
      .filter({ hasText: content });
    await postCard.getByRole("button", { name: "delete post" }).click();
    await this.page.getByRole("button", { name: "Delete" }).click();
  }

  async expectLoaded() {
    await expect(this.searchInput).toBeVisible();
  }
}
