import { Page } from "@playwright/test";
import { Logger } from "./logger";

export class CommonUtils {
  static async waitForPageToLoad(page: Page): Promise<void> {
    await page.waitForLoadState("domcontentloaded");
  }

  static async safeGoto(page: Page, urlOrPath: string): Promise<void> {
    try {
      await page.goto(urlOrPath);
    } catch {
      Logger.error("Navigation failed. Check target environment connectivity and .env configuration.");
      throw new Error("Navigation failed while opening target application.");
    }
  }

  static getTimestamp(): string {
    return new Date().toISOString();
  }
}
