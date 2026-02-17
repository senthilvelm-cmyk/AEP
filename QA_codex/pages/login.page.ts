import { expect, Locator, Page } from "@playwright/test";
import { CommonUtils } from "../utils/common-utils";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // These are common selector patterns for login forms.
    // Update them if your application uses different attributes.
    this.usernameInput = page.locator(
      'input[name="username"], input[id="username"], input[type="email"]'
    );
    this.passwordInput = page.locator(
      'input[name="password"], input[id="password"], input[type="password"]'
    );
    this.submitButton = page.locator(
      'button[type="submit"], button:has-text("Login"), button:has-text("Sign in")'
    );
  }

  async navigateToLogin(): Promise<void> {
    await CommonUtils.safeGoto(this.page, "/");
  }

  async verifyLoginPageIsOpen(): Promise<void> {
    // Validate route only, not full host, to avoid hardcoding server values.
    await expect(this.page).toHaveURL(/\/?$/);
    await expect(this.page).not.toHaveTitle("");
  }

  async hasLoginForm(): Promise<boolean> {
    const usernameExists = (await this.usernameInput.count()) > 0;
    const passwordExists = (await this.passwordInput.count()) > 0;
    const submitExists = (await this.submitButton.count()) > 0;
    return usernameExists && passwordExists && submitExists;
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.first().fill(username);
    await this.passwordInput.first().fill(password);
    await this.submitButton.first().click();
  }
}
