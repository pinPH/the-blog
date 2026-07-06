import { test, expect } from "@playwright/test";
import { HomePagePOM, PostDetailPagePOM } from "../POM";

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

  test("should comment on another user's post", async ({ page }) => {
    const homePage = new HomePagePOM(page);
    const postDetailPage = new PostDetailPagePOM(page);
    const commentContent = `Test comment - ${Date.now()}`;

    await homePage.goto();
    await homePage.expectLoaded();

    await homePage.openPostFromAnotherUser("Playwrigth");

    await postDetailPage.expectLoaded();
    await postDetailPage.comment(commentContent);
    await postDetailPage.waitForCommentToBePosted();

    await expect(page.getByText(commentContent)).toBeVisible();
  });
});
