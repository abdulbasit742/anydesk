#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const asyncHandlerPath = join(root, "apps", "api", "src", "middleware", "asyncHandler.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");
const routeFiles = {
  auth: join(root, "apps", "api", "src", "routes", "auth.routes.ts"),
  users: join(root, "apps", "api", "src", "routes", "user.routes.ts"),
  sessions: join(root, "apps", "api", "src", "routes", "session.routes.ts"),
  subscriptions: join(root, "apps", "api", "src", "routes", "subscription.routes.ts"),
  beta: join(root, "apps", "api", "src", "routes", "beta.routes.ts")
};

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const asyncSource = read(asyncHandlerPath);
const serverSource = read(serverPath);
const routes = Object.fromEntries(Object.entries(routeFiles).map(([name, path]) => [name, read(path)]));

const checks = {
  asyncHandlerFileExists: existsSync(asyncHandlerPath),
  serverFileExists: existsSync(serverPath),
  asyncHandlerExportsHelper: asyncSource.includes("export function asyncHandler"),
  asyncHandlerCatchesNext: asyncSource.includes(".catch(next)"),
  serverMountsErrorHandler: serverSource.includes("app.use(errorHandler)"),

  authRoutesFileExists: existsSync(routeFiles.auth),
  authImportsAsyncHandler: routes.auth.includes("../middleware/asyncHandler.js"),
  signupWrapped: routes.auth.includes('router.post("/signup", authRateLimit, asyncHandler'),
  loginWrapped: routes.auth.includes('router.post("/login", authRateLimit, asyncHandler'),
  refreshWrapped: routes.auth.includes('router.post("/refresh", authRateLimit, asyncHandler'),
  meWrapped: routes.auth.includes('router.get("/me", requireAuth, asyncHandler'),

  userRoutesFileExists: existsSync(routeFiles.users),
  usersImportAsyncHandler: routes.users.includes("../middleware/asyncHandler.js"),
  userProfileWrapped: routes.users.includes('router.get("/profile", asyncHandler'),
  userProfilePatchWrapped: routes.users.includes('router.patch("/profile", asyncHandler'),
  userDevicePasswordWrapped: routes.users.includes('router.patch("/device-password", asyncHandler'),
  userLookupWrapped: routes.users.includes('router.get("/lookup/:remoteDeskId", asyncHandler'),

  sessionRoutesFileExists: existsSync(routeFiles.sessions),
  sessionsImportAsyncHandler: routes.sessions.includes("../middleware/asyncHandler.js"),
  sessionHistoryWrapped: routes.sessions.includes('router.get("/history", asyncHandler'),

  subscriptionRoutesFileExists: existsSync(routeFiles.subscriptions),
  subscriptionsImportAsyncHandler: routes.subscriptions.includes("../middleware/asyncHandler.js"),
  subscriptionCurrentWrapped: routes.subscriptions.includes('router.get("/current", asyncHandler'),
  subscriptionCheckoutWrapped: routes.subscriptions.includes('router.post("/checkout", asyncHandler'),

  betaRoutesFileExists: existsSync(routeFiles.beta),
  betaImportsAsyncHandler: routes.beta.includes("../middleware/asyncHandler.js"),
  betaFeaturesWrapped: routes.beta.includes('router.get("/features", asyncHandler')
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
