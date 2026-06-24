#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const tokensPath = join(root, "apps", "api", "src", "lib", "tokens.ts");
const authRoutesPath = join(root, "apps", "api", "src", "routes", "auth.routes.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const tokensSource = read(tokensPath);
const authSource = read(authRoutesPath);

const checks = {
  tokensFileExists: existsSync(tokensPath),
  authRoutesFileExists: existsSync(authRoutesPath),
  hasVerifyRefreshToken: tokensSource.includes("verifyRefreshToken"),
  accessUsesJwtSecret: tokensSource.includes("env.jwtSecret"),
  refreshUsesRefreshSecret: tokensSource.includes("env.jwtRefreshSecret"),
  validatesTokenPayload: tokensSource.includes("assertTokenPayload"),
  hasIssueTokenPair: tokensSource.includes("issueTokenPair"),
  authRouteHasRefreshEndpoint: authSource.includes('router.post("/refresh"') || authSource.includes("router.post('/refresh'"),
  refreshEndpointVerifiesRefreshToken: authSource.includes("verifyRefreshToken"),
  authResponsesUseIssueTokenPair: authSource.includes("issueTokenPair"),
  emailIsNormalized: authSource.includes("toLowerCase().trim()"),
  doesNotReturnPasswordHash: !authSource.includes("passwordHash,") && !authSource.includes("passwordHash: true"),
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
writeFileSync("reports/auth-hardening-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/auth-hardening-check.md",
  [
    "# Auth Hardening Check",
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

console.log(`[auth:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
