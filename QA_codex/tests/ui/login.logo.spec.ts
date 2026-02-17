import { test } from "@playwright/test";
import { LandingPage } from "../../pages/landing.page";
import { Logger } from "../../utils/logger";

test.describe("UI - Landing page branding", () => {
  test("should display the AEP (Aziro) logo section on landing page", async ({
    page
  }) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigateToLandingPage();

    Logger.info("Verifying landing page logo and branding text");
    await landingPage.verifyAziroBrandingIsVisible();
  });

  test("should display the Merchandise icon card on landing page", async ({
    page
  }) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigateToLandingPage();

    Logger.info("Verifying Merchandise card and icon on landing page");
    await landingPage.verifyMerchandiseCardIsVisible();
  });

  test("should navigate to merchandise page when Merchandise card is clicked", async ({
    page
  }) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigateToLandingPage();

    Logger.info("Clicking Merchandise card and validating navigation");
    await landingPage.clickMerchandiseCard();
    await landingPage.verifyNavigationToMerchandisePage();
  });
});
