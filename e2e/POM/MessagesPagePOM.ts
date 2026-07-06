import { expect, Locator, Page } from "@playwright/test";
import { BaseAppPage } from "./BaseAppPage";

export class MessagesPagePOM extends BaseAppPage {
  readonly directMessagesTitle: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly noConversationsText: Locator;
  readonly conversationListItems: Locator;

  constructor(page: Page) {
    super(page);
    this.directMessagesTitle = page.getByText("Direct messages");
    this.messageInput = page.getByPlaceholder("Write a message...");
    this.sendButton = page.getByRole("button", { name: "Send" });
    this.noConversationsText = page.getByText("No conversations");
    this.conversationListItems = page.locator("a > div > p");
  }

  get pageInstance(): Page {
    return this.page;
  }

  async goto() {
    await this.page.goto("/messages");
  }

  async sendMessage(text: string) {
    await this.messageInput.fill(text);
    await this.sendButton.click();
    await this.messageInput.clear();
  }

  async selectConversation(username: string) {
    await this.page.getByText(username).first().click();
  }

  async expectMessageVisible(text: string) {
    await expect(this.page.getByText(text).first()).toBeVisible();
  }

  async expectLoaded() {
    await expect(this.directMessagesTitle).toBeVisible();
    await expect(this.messageInput).toBeVisible();
    await expect(this.page.getByText("Loading messages...")).not.toBeVisible();
  }
}
