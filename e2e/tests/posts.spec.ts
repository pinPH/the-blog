import { test, expect } from "@playwright/test";
import { HomePagePOM } from "../POM";

test.describe("Posts", () => {
  test("should create a new post and display it in the timeline", async ({
    page,
  }) => {
    const homePage = new HomePagePOM(page);
    const postContent = `Test post - ${Date.now()}`;

    await homePage.goto();
    await homePage.expectLoaded();

    await homePage.createPost(postContent);

    await expect(page.getByText(postContent).first()).toBeVisible();
  });

  test("should create a post and then delete it", async ({ page }) => {
    const homePage = new HomePagePOM(page);
    const postContent = `Test post #playwright - ${Date.now()}`;

    await homePage.goto();
    await homePage.expectLoaded();

    await homePage.createPost(postContent);
    await expect(page.getByText(postContent).first()).toBeVisible();

    await homePage.deletePost(postContent);
    await expect(page.getByText(postContent)).not.toBeVisible();
  });
});
