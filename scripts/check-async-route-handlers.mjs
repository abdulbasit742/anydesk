#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const asyncHandlerPath = join(root, "apps", "api", "src", "middleware", "asyncHandler.ts");
const authRoutesPath = join(root, "apps", "api", "src", "routes", "auth.routes.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const asyncSource = read(asyncHandlerPath);
const authSource = read(authRoutesPath);
const serverSource = read(serverPath);

const checks = {
  asyncHandlerFileExists: existsSync(asyncHandlerPath),
  authRoutesFileExists: existsSync(authRoutesPath),
  serverFileExists: existsSync(serverPath),
  asyncHandlerExportsHelper: asyncSource.includes("export function asyncHandler"),
  asyncHandlerCatchesNext: asyncSource.includes(".catch(next)"),
  authImportsAsyncHandler: authSource.includes("../middleware/asyncHandler.js"),
  signupWrapped: authSource.includes('router.post("/signup", authRateLimit, asyncHandler'),
  loginWrapped: authSource.includes('router.post("/login", authRateLimit, asyncHandler'),
  refreshWrapped: authSource.includes('router.post("/refresh", authRateLimit, asyncHandler'),
  meWrapped: authSource.includes('router.get("/me", requireAuth, asyncHandler'),
  serverMountsErrorHandler: serverSource.includes("app.use(errorHandler)"),
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
writeFileSync("reports/async-route-handler-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/async-route-handler-check.md",
  [
    "# Async Route Handler Check",
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

console.log(`[async-routes:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
