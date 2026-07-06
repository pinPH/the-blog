import { test } from "@playwright/test";
import { MessagesPagePOM } from "../POM";
import Chance from "chance";

const chance = new Chance();

test.describe("Messages", () => {
  let messagesPage: MessagesPagePOM;

  test.use({ storageState: "e2e/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    messagesPage = new MessagesPagePOM(page);
    await messagesPage.goto();
    await messagesPage.expectLoaded();
  });

  test("should send a message to a contact", async () => {
    const message = `Hello, this is a test message: ${chance.guid()}`;
    await messagesPage.sendMessage(message);
    await messagesPage.expectMessageVisible(message);
  });
});
