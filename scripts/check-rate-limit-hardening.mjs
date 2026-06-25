#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const rateLimitPath = join(root, "apps", "api", "src", "middleware", "rateLimit.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");
const authRoutesPath = join(root, "apps", "api", "src", "routes", "auth.routes.ts");
const packagePath = join(root, "package.json");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const rateLimitSource = read(rateLimitPath);
const serverSource = read(serverPath);
const authSource = read(authRoutesPath);
const packageSource = read(packagePath);

const checks = {
  rateLimitFileExists: existsSync(rateLimitPath),
  serverFileExists: existsSync(serverPath),
  authRoutesFileExists: existsSync(authRoutesPath),
  packageFileExists: existsSync(packagePath),
  packageHasRateLimitCheckScript: packageSource.includes('"rate-limit:check"') && packageSource.includes("node scripts/check-rate-limit-hardening.mjs"),
  ciRunsRateLimitCheck: packageSource.includes("npm run rate-limit:check"),
  exportsCreateRateLimit: rateLimitSource.includes("export function createRateLimit"),
  hasNamedPolicies: rateLimitSource.includes("name?: string") && rateLimitSource.includes("limiterName"),
  hasCleanupInterval: rateLimitSource.includes("cleanupIntervalMs") && rateLimitSource.includes("nextCleanupAt"),
  deletesStaleBuckets: rateLimitSource.includes("hits.delete(key)"),
  clampsPositiveIntegers: rateLimitSource.includes("clampPositiveInteger"),
  checksBeforeAddingRejectedHit: rateLimitSource.includes("if (recent.length >= max)"),
  sendsRetryAfterSeconds: rateLimitSource.includes("retryAfterSeconds") && rateLimitSource.includes("Retry-After"),
  sendsStandardHeaders: rateLimitSource.includes("RateLimit-Limit") && rateLimitSource.includes("RateLimit-Remaining") && rateLimitSource.includes("RateLimit-Reset"),
  sendsPolicyHeader: rateLimitSource.includes("X-RateLimit-Policy"),
  globalLimiterNamed: serverSource.includes('name: "global-api"') || serverSource.includes("name: 'global-api'"),
  authLimiterStillApplied: authSource.includes("const authRateLimit = createRateLimit") && authSource.includes('router.post("/login", authRateLimit') && authSource.includes('router.post("/refresh", authRateLimit'),
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
writeFileSync("reports/rate-limit-hardening-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/rate-limit-hardening-check.md",
  [
    "# Rate Limit Hardening Check",
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

console.log(`[rate-limit:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
