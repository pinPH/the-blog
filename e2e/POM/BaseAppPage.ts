import { expect, Locator, Page } from "@playwright/test";

export class BaseAppPage {
  protected readonly page: Page;
  readonly authButton: Locator;
  readonly profileButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.authButton = page.getByRole("button", { name: /Log in|Log out/i });
    this.profileButton = page.getByRole("button", { name: "Profile" });
    this.usernameInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Password");
    this.signInButton = page.getByRole("button", { name: "Sign in" });
  }

  async login(username: string, password: string) {
    const loginButton = this.page.getByRole("button", { name: "Log in" });
    const isLoggedOut = await loginButton.isVisible().catch(() => false);

    if (!isLoggedOut) {
      return;
    }

    await loginButton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
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
