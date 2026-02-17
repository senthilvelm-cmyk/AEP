import { expect, Locator, Page } from "@playwright/test";
import { CommonUtils } from "../utils/common-utils";
import { landingSelectors } from "./selectors/landing.selectors";

export class LandingPage {
  readonly page: Page;

  // Keep all landing page selectors in one place for easy maintenance.
  readonly logoLink: Locator;
  readonly logoImage: Locator;
  readonly brandTitle: Locator;
  readonly brandSubtitle: Locator;

  readonly merchandiseCard: Locator;
  readonly merchandiseIcon: Locator;
  readonly merchandiseSubtitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoLink = page
      .locator(landingSelectors.logoLink)
      .filter({ hasText: landingSelectors.logoLinkText });
    this.logoImage = this.logoLink.locator(landingSelectors.logoImage);
    this.brandTitle = this.logoLink.locator(landingSelectors.brandTitle);
    this.brandSubtitle = this.logoLink.locator(landingSelectors.brandSubtitle);

    this.merchandiseCard = page
      .locator(landingSelectors.merchandiseCardContainer)
      .filter({ has: page.locator(landingSelectors.merchandiseCardHeading) })
      .first();
    this.merchandiseIcon = this.merchandiseCard.locator(
      landingSelectors.merchandiseIcon
    );
    this.merchandiseSubtitle = this.merchandiseCard.locator(
      landingSelectors.merchandiseSubtitle
    );
  }

  async navigateToLandingPage(): Promise<void> {
    await CommonUtils.safeGoto(this.page, "/");
  }

  async verifyAziroBrandingIsVisible(): Promise<void> {
    await expect(this.logoLink).toBeVisible();
    await expect(this.logoImage).toBeVisible();
    await expect(this.brandTitle).toBeVisible();
    await expect(this.brandSubtitle).toBeVisible();
  }

  async verifyMerchandiseCardIsVisible(): Promise<void> {
    await expect(this.merchandiseCard).toBeVisible();
    await expect(this.merchandiseIcon).toBeVisible();
    await expect(this.merchandiseSubtitle).toBeVisible();
  }

  async clickMerchandiseCard(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/merchandise\/?$/, { timeout: 10000 }),
      this.merchandiseCard.click()
    ]);
  }

  async verifyNavigationToMerchandisePage(): Promise<void> {
    // Route-based assertion keeps the test portable across environments.
    await expect(this.page).toHaveURL(/\/merchandise\/?$/, { timeout: 10000 });
  }
}
