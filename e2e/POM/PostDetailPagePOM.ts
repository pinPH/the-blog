import { expect, Locator, Page } from "@playwright/test";
import { BaseAppPage } from "./BaseAppPage";

export class PostDetailPagePOM extends BaseAppPage {
  readonly backButton: Locator;
  readonly commentsSection: Locator;
  readonly commentInput: Locator;
  readonly commentSubmit: Locator;
  readonly postNotFoundTitle: Locator;
  readonly backToTimelineButton: Locator;

  constructor(page: Page) {
    super(page);
    this.backButton = page.getByRole("button", { name: /Back/ });
    this.commentsSection = page.getByTestId("comments-section");
    this.commentInput = page.getByTestId("comment-input");
    this.commentSubmit = page.getByTestId("comment-submit");
    this.postNotFoundTitle = page.getByText("Post not found");
    this.backToTimelineButton = page.getByRole("button", {
      name: "Back to timeline",
    });
  }

  async goto(postId: string) {
    await this.page.goto("/post/" + postId);
  }

  async comment(text: string) {
    await this.commentInput.fill(text);
    await this.commentSubmit.click();
  }

  async waitForCommentToBePosted() {
    await expect(this.page.getByText("Posting...")).not.toBeVisible();
  }

  async expectLoaded() {
    await expect(this.commentsSection).toBeVisible();
  }

  async expectNotFoundState() {
    await expect(this.postNotFoundTitle).toBeVisible();
    await expect(this.backToTimelineButton).toBeVisible();
  }
}
