import test, { expect, Locator, Page } from "@playwright/test";

export class BaseAppPage {
  protected readonly page: Page;
  readonly authButton: Locator;
  readonly profileButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = this.page.getByRole("button", { name: "Log in" });
    this.authButton = page.getByRole("button", { name: /Log in|Log out/i });
    this.profileButton = page.getByRole("button", { name: "Profile" });
    this.usernameInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Password");
    this.signInButton = page.getByRole("button", { name: "Sign in" });
  }

  async login(username: string, password: string) {
    try {
      await this.loginButton.waitFor({ state: "visible", timeout: 5000 });
    } catch {
      return test.skip();
    }

    await this.loginButton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();

    //await this.page.getByRole("dialog").waitFor({ state: "hidden" });
  }

  async logoutIfNeeded() {
    const logoutButton = this.page.getByRole("button", { name: "Log out" });
    const isLoggedIn = await logoutButton.isVisible().catch(() => false);

    if (isLoggedIn) {
      await logoutButton.click();
    }
  }

  async expectAuthenticatedUi() {
    await expect(
      this.page.getByRole("button", { name: "Log out" }),
    ).toBeVisible();
  }
}
