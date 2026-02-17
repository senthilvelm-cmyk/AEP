import { expect, Locator, Page } from "@playwright/test";
import { CommonUtils } from "../utils/common-utils";
import { loginSelectors } from "./selectors/login.selectors";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // These are common selector patterns for login forms.
    // Update them if your application uses different attributes.
    this.usernameInput = page.locator(loginSelectors.usernameInput);
    this.passwordInput = page.locator(loginSelectors.passwordInput);
    this.submitButton = page.locator(loginSelectors.submitButton);
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
