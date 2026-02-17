import * as dotenv from "dotenv";

dotenv.config();

export interface FrameworkEnvironment {
  baseUrl: string;
  apiBaseUrl: string;
  username: string;
  password: string;
  apiToken: string;
  apiAuthScheme: string;
  enableArtifacts: boolean;
}

function readRequiredValue(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Copy .env.example to .env and set it.`
    );
  }
  return value;
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) {
    return defaultValue;
  }
  return value.toLowerCase() === "true";
}

export function loadEnvironment(): FrameworkEnvironment {
  return {
    // URLs come strictly from environment variables so code never hardcodes servers.
    baseUrl: readRequiredValue("BASE_URL"),
    apiBaseUrl: readRequiredValue("API_BASE_URL"),
    username: process.env.LOGIN_USERNAME ?? "",
    password: process.env.LOGIN_PASSWORD ?? "",
    apiToken: process.env.API_TOKEN ?? "",
    apiAuthScheme: process.env.API_AUTH_SCHEME ?? "Bearer",
    enableArtifacts: parseBoolean(process.env.ENABLE_ARTIFACTS, false)
  };
}
