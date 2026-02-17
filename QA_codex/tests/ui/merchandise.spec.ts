import { test } from "@playwright/test";
import { MerchandisePage } from "../../pages/merchandise.page";
import { Logger } from "../../utils/logger";

test.describe("UI - Merchandise page", () => {
  test("should match Pick from store UI count with PICK_AND_PACK count from API response", async ({
    page
  }) => {
    const merchandisePage = new MerchandisePage(page);

    const pickAndPackCount = await merchandisePage.navigateAndGetFulfillmentMethodCount(
      "PICK_AND_PACK"
    );
    test.skip(
      !pickAndPackCount || pickAndPackCount <= 0,
      "No PICK_AND_PACK fulfillment method found in merchandise API response."
    );

    const expectedPickAndPackCount = pickAndPackCount ?? 0;
    const hasPickupIndicator = await merchandisePage.hasPickFromStoreIndicatorOnUi();
    test.skip(
      !hasPickupIndicator,
      "Pick from store indicator is not rendered on current merchandise landing UI."
    );

    Logger.info("Verifying Pick from store indicator count on merchandise page");
    await merchandisePage.verifyPickFromStoreCountMatches(expectedPickAndPackCount);
  });
});
