import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { FrameworkEnvironment } from "../config/env";
import { Logger } from "./logger";

export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly env: FrameworkEnvironment;

  constructor(request: APIRequestContext, env: FrameworkEnvironment) {
    this.request = request;
    this.env = env;
  }

  private buildAuthHeader(): Record<string, string> {
    if (!this.env.apiToken) {
      return {};
    }

    // Token value is never logged. Only the presence of auth is tracked.
    return {
      Authorization: `${this.env.apiAuthScheme} ${this.env.apiToken}`
    };
  }

  async get(path: string): Promise<APIResponse> {
    try {
      const response = await this.request.get(path, {
        headers: {
          ...this.buildAuthHeader(),
          Accept: "application/json, text/plain, */*"
        }
      });

      Logger.info(
        `API GET ${path} completed with status ${response.status()} (auth=${this.env.apiToken ? "enabled" : "disabled"})`
      );
      return response;
    } catch (error) {
      // Keep error output generic so no network endpoint details leak in logs.
      Logger.error("API request failed unexpectedly. Check connectivity and environment settings.");
      throw new Error("API request failed. Verify server availability and secure environment configuration.");
    }
  }
}

export async function validateSafeApiResponse(
  response: APIResponse,
  acceptedStatusCodes: number[]
): Promise<void> {
  expect(acceptedStatusCodes).toContain(response.status());

  const contentType = response.headers()["content-type"] ?? "";
  expect(contentType.length).toBeGreaterThan(0);

  // Parse JSON only when server advertises JSON content.
  if (contentType.toLowerCase().includes("application/json")) {
    try {
      const body = await response.json();
      expect(body).toBeTruthy();
    } catch {
      throw new Error("Response declared JSON but body parsing failed.");
    }
  }
}
