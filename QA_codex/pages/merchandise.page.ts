import { expect, Locator, Page, Response } from "@playwright/test";
import { CommonUtils } from "../utils/common-utils";
import { Logger } from "../utils/logger";
import { merchandiseSelectors } from "./selectors/merchandise.selectors";

export class MerchandisePage {
  readonly page: Page;
  readonly pickFromStoreText: Locator;
  readonly pickFromStoreIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pickFromStoreText = page.locator(merchandiseSelectors.pickFromStoreText);
    this.pickFromStoreIcon = page.locator(merchandiseSelectors.pickFromStoreIcon);
  }

  async navigateToMerchandisePage(): Promise<void> {
    await CommonUtils.safeGoto(this.page, merchandiseSelectors.merchandisePagePath);
  }

  async navigateAndGetFulfillmentMethodCount(method: string): Promise<number | null> {
    const candidateCounts: number[] = [];

    const onResponse = async (response: Response): Promise<void> => {
      if (!this.isRelevantMerchandiseResponse(response)) {
        return;
      }

      const count = await this.getFulfillmentMethodCountFromSingleResponse(response, method);
      if (count > 0) {
        candidateCounts.push(count);
      }
    };

    this.page.on("response", onResponse);

    try {
      await this.navigateToMerchandisePage();

      // Allow API calls for product listing/cards to settle.
      await this.page.waitForLoadState("networkidle", {
        timeout: merchandiseSelectors.responseTimeoutMs
      });
    } catch {
      // Ignore timeouts here and rely on captured responses.
    } finally {
      this.page.off("response", onResponse);
    }

    if (candidateCounts.length === 0) {
      Logger.info(
        `No API response with fulfillmentMethod=${method} found during timeout window.`
      );
      return null;
    }

    // Prefer the largest response count, which usually represents the main listing payload.
    return Math.max(...candidateCounts);
  }

  async getPickFromStoreIndicatorCountOnUi(): Promise<number> {
    const textCount = await this.pickFromStoreText.evaluateAll((nodes) =>
      nodes.filter((node) => {
        const element = node as HTMLElement;
        const style = window.getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          element.offsetParent !== null
        );
      }).length
    );
    if (textCount > 0) {
      return textCount;
    }

    return this.pickFromStoreIcon.evaluateAll((nodes) =>
      nodes.filter((node) => {
        const element = node as HTMLElement;
        const style = window.getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          element.offsetParent !== null
        );
      }).length
    );
  }

  async verifyPickFromStoreCountMatches(expectedCount: number): Promise<void> {
    const uiCount = await this.getPickFromStoreIndicatorCountOnUi();
    Logger.info(`PICK_AND_PACK count from API=${expectedCount}, UI indicators=${uiCount}`);
    expect(uiCount).toBe(expectedCount);
  }

  async hasPickFromStoreIndicatorOnUi(): Promise<boolean> {
    return (await this.getPickFromStoreIndicatorCountOnUi()) > 0;
  }

  async verifyPickFromStoreIndicatorIsVisible(): Promise<void> {
    if ((await this.pickFromStoreText.count()) > 0) {
      await expect(this.pickFromStoreText.first()).toBeVisible();
      return;
    }

    await expect(this.pickFromStoreIcon.first()).toBeVisible();
  }

  private isRelevantMerchandiseResponse(response: Response): boolean {
    const url = response.url().toLowerCase();
    return (
      url.includes("merchandise") ||
      url.includes("product") ||
      url.includes("catalog") ||
      url.includes("fulfillment")
    );
  }

  private async getFulfillmentMethodCountFromSingleResponse(
    response: Response,
    method: string
  ): Promise<number> {
    try {
      const contentType = response.headers()["content-type"]?.toLowerCase() ?? "";
      if (!contentType.includes("application/json")) {
        return 0;
      }

      const payload = await response.json();
      return this.countFulfillmentMethodOccurrences(payload, method);
    } catch {
      return 0;
    }
  }

  private countFulfillmentMethodOccurrences(value: unknown, method: string): number {
    if (Array.isArray(value)) {
      return value.reduce(
        (total, item) => total + this.countFulfillmentMethodOccurrences(item, method),
        0
      );
    }

    if (value && typeof value === "object") {
      const objectValue = value as Record<string, unknown>;
      const currentCount = objectValue.fulfillmentMethod === method ? 1 : 0;
      let nestedCount = 0;

      for (const nestedValue of Object.keys(objectValue)) {
        nestedCount += this.countFulfillmentMethodOccurrences(
          objectValue[nestedValue],
          method
        );
      }

      return currentCount + nestedCount;
    }

    return 0;
  }
}
