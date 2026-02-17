import { test } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { Logger } from "../../utils/logger";
import { testData } from "../../utils/test-data";

test.describe("UI - Login page", () => {
  test("should open the login page", async ({ page }) => {
    const loginPage = new LoginPage(page);

    Logger.info("Opening the login page");
    await loginPage.navigateToLogin();

    Logger.info("Validating that login page is loaded");
    await loginPage.verifyLoginPageIsOpen();
  });

  test.skip("should attempt login with configured credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageIsOpen();

    const loginFormAvailable = await loginPage.hasLoginForm();
    test.skip(
      !loginFormAvailable,
      "No matching login fields found. Update selectors in pages/login.page.ts."
    );

    // This is a sample login flow.
    // If selectors or credentials differ, update .env and page locators.
    await loginPage.login(testData.login.username, testData.login.password);
  });
});
