import { test as setup } from "@playwright/test";
import { HomePagePOM } from "../POM";

setup("authenticate", async ({ page }) => {
  const homePage = new HomePagePOM(page);

  await homePage.goto();
  await homePage.login("Playwrigth", "coxinha123");
  await homePage.expectAuthenticatedUi();

  await page.context().storageState({
    path: "e2e/.auth/user.json",
  });
});
