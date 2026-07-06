import { expect, Locator, Page } from "@playwright/test";
import { BaseAppPage } from "./BaseAppPage";

export class ProfilePagePOM extends BaseAppPage {
  readonly editProfileButton: Locator;
  readonly editDialogTitle: Locator;
  readonly bioInput: Locator;
  readonly locationInput: Locator;
  readonly websiteInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly loadErrorText: Locator;

  constructor(page: Page) {
    super(page);
    this.editProfileButton = page.getByRole("button", { name: "Edit profile" });
    this.editDialogTitle = page.getByText("Edit profile");
    this.bioInput = page.getByLabel("Bio");
    this.locationInput = page.getByLabel("Location");
    this.websiteInput = page.getByLabel("Website");
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.loadErrorText = page.getByText("Could not load profile.");
  }

  async goto() {
    await this.page.goto("/profile");
  }

  async openEditModal() {
    await this.editProfileButton.click();
    await expect(this.editDialogTitle).toBeVisible();
  }

  async editProfile(values: {
    bio?: string;
    location?: string;
    website?: string;
  }) {
    if (values.bio !== undefined) {
      await this.bioInput.fill(values.bio);
    }

    if (values.location !== undefined) {
      await this.locationInput.fill(values.location);
    }

    if (values.website !== undefined) {
      await this.websiteInput.fill(values.website);
    }

    await this.saveButton.click();
  }

  async expectLoaded() {
    await expect(this.editProfileButton).toBeVisible();
  }
}
