# Playwright + TypeScript Automation Framework

Simple beginner-friendly automation framework with:
- UI tests
- API tests
- Page Object Model (POM)
- `.env` configuration
- Reusable utilities
- HTML report
- Parallel browser execution
- Security-first configuration (redaction, env validation, safe API auth)

## Project Structure

```text
QA_codex/
  config/
    env.ts
  pages/
    login.page.ts
  tests/
    ui/
      login.spec.ts
    api/
      health.spec.ts
  utils/
    common-utils.ts
    logger.ts
    test-data.ts
  .env
  .env.example
  .gitignore
  package.json
  playwright.config.ts
  tsconfig.json
```

## Setup

```bash
cd QA_codex
npm install
npx playwright install
```

## Run Tests

```bash
npx playwright test
```

Run only UI tests:

```bash
npx playwright test tests/ui
```

Run only API tests:

```bash
npx playwright test tests/api
```

Open HTML report:

```bash
npx playwright show-report
```

## Environment Configuration

Create your local `.env` from template:

```bash
copy .env.example .env
```

Set real values only in `.env` (never commit `.env`):

```env
BASE_URL=https://your-app.example.com/
API_BASE_URL=https://your-api.example.com/
LOGIN_USERNAME=your_test_username
LOGIN_PASSWORD=your_test_password
API_TOKEN=your_api_token
API_AUTH_SCHEME=Bearer
ENABLE_ARTIFACTS=false
```

## Security Notes

- Sensitive values are loaded only from environment variables via `dotenv`.
- Logs automatically mask credentials, tokens, and IPv4 addresses.
- UI checks do not hardcode server hosts or IP addresses in test code.
- API requests support secure authorization headers from env variables.
- Artifacts (`trace`, `video`, `screenshot`) are disabled by default to reduce data leakage risk.
- Enable artifacts only when needed by setting `ENABLE_ARTIFACTS=true` in `.env`.

## Pre-commit Secret Scan

This project includes a lightweight staged-file scanner to block accidental commits of secrets.

Manual run:

```bash
npm run scan:secrets
```

Enable git hook for this repository:

```bash
git config core.hooksPath QA_codex/.githooks
```

After this, every `git commit` runs the scan first and rejects commits with potential secret patterns.

## CI Pipeline (GitHub Actions)

Workflow file:

```text
.github/workflows/playwright.yml
```

It runs Playwright tests from `QA_codex` on push/PR and uploads report artifacts.

Add these GitHub repository secrets before running CI:

- `BASE_URL`
- `API_BASE_URL`
- `LOGIN_USERNAME`
- `LOGIN_PASSWORD`
- `API_TOKEN`
- `API_AUTH_SCHEME` (example: `Bearer`)
