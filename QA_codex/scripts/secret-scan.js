/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..", "..");

// Explicit false-positive allowlist for framework docs/config files.
// Keep this list short and review periodically.
const allowlistedFiles = new Set([
  "QA_codex/README.md",
  "QA_codex/config/env.ts",
  "QA_codex/scripts/secret-scan.js",
  "QA_codex/utils/test-data.ts"
]);

const skipExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".pdf",
  ".zip",
  ".lock"
]);

// Basic high-signal patterns for accidental secret leakage.
const rules = [
  { name: "AWS Access Key", regex: /\bAKIA[0-9A-Z]{16}\b/g },
  {
    name: "Generic Token/Key assignment",
    regex: /\b(api[_-]?key|secret|token|password|passwd|pwd)\b\s*[:=]\s*["']?[A-Za-z0-9_\-./+=]{8,}/gi
  },
  {
    name: "Bearer token",
    regex: /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/g
  },
  {
    name: "Private key header",
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g
  },
  {
    name: "Connection string credential",
    regex: /\b(?:mongodb|postgres|mysql|redis):\/\/[^/\s]+:[^@\s]+@/gi
  },
  {
    name: "IPv4 hardcoded URL",
    regex: /https?:\/\/\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?/g
  }
];

function getStagedFiles() {
  const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8"
  });

  return output
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function shouldScanFile(filePath) {
  if (allowlistedFiles.has(filePath.replace(/\\/g, "/"))) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  if (skipExtensions.has(ext)) {
    return false;
  }
  const lower = filePath.toLowerCase();
  if (lower.includes("node_modules/") || lower.includes("playwright-report/")) {
    return false;
  }
  return true;
}

function readSafe(filePath) {
  const fullPath = path.join(repoRoot, filePath);
  try {
    return fs.readFileSync(fullPath, "utf8");
  } catch {
    return "";
  }
}

function scanFile(filePath) {
  const content = readSafe(filePath);
  if (!content) {
    return [];
  }

  const issues = [];
  for (const rule of rules) {
    const match = content.match(rule.regex);
    if (match && match.length > 0) {
      issues.push({
        filePath,
        rule: rule.name
      });
    }
  }
  return issues;
}

function main() {
  const stagedFiles = getStagedFiles().filter(shouldScanFile);
  if (stagedFiles.length === 0) {
    console.log("[secret-scan] No staged text files to scan.");
    process.exit(0);
  }

  const allIssues = stagedFiles.flatMap(scanFile);
  if (allIssues.length === 0) {
    console.log("[secret-scan] Passed: no obvious secrets detected.");
    process.exit(0);
  }

  console.error("[secret-scan] Blocked commit: potential sensitive values detected.");
  for (const issue of allIssues) {
    console.error(`- ${issue.filePath} (${issue.rule})`);
  }
  console.error(
    "[secret-scan] If this is a false positive, rotate/mask data or adjust the scanner rules intentionally."
  );
  process.exit(1);
}

main();
