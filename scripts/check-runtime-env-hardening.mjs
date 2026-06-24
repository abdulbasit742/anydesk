#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const envPath = join(root, "apps", "api", "src", "config", "env.ts");
const validatePath = join(root, "scripts", "validate-env.mjs");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const envSource = read(envPath);
const validateSource = read(validatePath);

const checks = {
  envFileExists: existsSync(envPath),
  validateScriptExists: existsSync(validatePath),
  detectsProductionMode: envSource.includes('nodeEnv === "production"') || envSource.includes("nodeEnv === 'production'"),
  blocksDevJwtAccessSecret: envSource.includes("dev-access-secret") && envSource.includes("forbiddenProductionValues"),
  blocksDevJwtRefreshSecret: envSource.includes("dev-refresh-secret") && envSource.includes("forbiddenProductionValues"),
  enforcesSecretLength: envSource.includes("DEFAULT_SECRET_MIN_LENGTH") && envSource.includes("must be at least"),
  requiresCorsOriginInProduction: envSource.includes("Missing environment variable: CORS_ORIGIN"),
  blocksWildcardCorsInProduction: envSource.includes('origins.includes("*")') || envSource.includes("origins.includes('*')"),
  exposesRuntimeFlags: envSource.includes("isProduction") && envSource.includes("isDevelopment") && envSource.includes("isTest"),
  validateRequiresDatabaseUrl: validateSource.includes("DATABASE_URL") && validateSource.includes("required: true"),
  validateRequiresJwtSecrets: validateSource.includes("JWT_SECRET") && validateSource.includes("JWT_REFRESH_SECRET"),
};

const failures = Object.entries(checks)
  .filter(([, ok]) => !ok)
  .map(([name]) => name);

const status = failures.length > 0 ? "FAIL" : "PASS";
const report = {
  repo: "abdulbasit742/anydesk",
  generatedAt: new Date().toISOString(),
  status,
  checks,
  failures,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/runtime-env-hardening-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/runtime-env-hardening-check.md",
  [
    "# Runtime Environment Hardening Check",
    "",
    `Status: **${status}**`,
    `Failures: **${failures.length}**`,
    "",
    "| Check | Passed |",
    "|---|---:|",
    ...Object.entries(checks).map(([name, ok]) => `| ${name} | ${ok ? "yes" : "no"} |`),
    "",
    failures.length ? "## Failures" : "",
    ...failures.map((name) => `- ${name}`),
  ].filter(Boolean).join("\n")
);

console.log(`[runtime-env:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
