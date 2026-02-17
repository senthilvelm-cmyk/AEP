import { expect, test } from "@playwright/test";
import { Logger } from "../../utils/logger";
import { CommonUtils } from "../../utils/common-utils";

test.describe("UI - Landing page branding", () => {
  test("should display the AEP (Aziro) logo section on landing page", async ({
    page
  }) => {
    await CommonUtils.safeGoto(page, "/");

    // Target the exact navigation anchor block shared in the DOM.
    const logoLink = page
      .locator('a[href="/"][data-status="active"]')
      .filter({ hasText: "Engagement Platform" });
    const logoImage = logoLink.locator(
      'img[alt="Aziro"][src*="logo"][class*="rounded-xl"]'
    );
    const brandTitle = logoLink.locator('span:has-text("Aziro")');
    const brandSubtitle = logoLink.locator(
      'span:has-text("Engagement Platform")'
    );

    Logger.info("Verifying landing page logo and branding text");
    await expect(logoLink).toBeVisible();
    await expect(logoImage).toBeVisible();
    await expect(brandTitle).toBeVisible();
    await expect(brandSubtitle).toBeVisible();
  });
});
