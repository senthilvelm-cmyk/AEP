import { test } from "@playwright/test";
import { loadEnvironment } from "../../config/env";
import { ApiClient, validateSafeApiResponse } from "../../utils/api-client";

test.describe("API - Basic checks", () => {
  test("should return a valid HTTP response from base API URL", async ({
    request
  }) => {
    const env = loadEnvironment();
    const client = new ApiClient(request, env);
    const response = await client.get(env.apiBaseUrl);

    // Keep accepted statuses broad for onboarding, but validate safely.
    await validateSafeApiResponse(response, [200, 201, 301, 302, 304, 401, 403]);
  });
});
