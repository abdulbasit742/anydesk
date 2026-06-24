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
  beta: join(root, "apps", "api", "src", "routes", "beta.routes.ts"),
  launch: join(root, "apps", "api", "src", "routes", "launch.routes.ts"),
  devices: join(root, "apps", "api", "src", "routes", "device.routes.ts"),
  connectors: join(root, "apps", "api", "src", "routes", "connector.routes.ts")
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
  betaFeaturesWrapped: routes.beta.includes('router.get("/features", asyncHandler'),

  launchRoutesFileExists: existsSync(routeFiles.launch),
  launchImportsAsyncHandler: routes.launch.includes("../middleware/asyncHandler.js"),
  launchReadinessWrapped: routes.launch.includes('router.get("/readiness", asyncHandler'),
  launchChecksPatchWrapped: routes.launch.includes('router.patch("/checks/:key", asyncHandler'),
  launchReleaseCandidateCreateWrapped: routes.launch.includes('router.post("/release-candidates", asyncHandler'),
  launchReleaseCandidatePatchWrapped: routes.launch.includes('router.patch("/release-candidates/:id", asyncHandler'),
  launchRolloutApprovalCreateWrapped: routes.launch.includes('router.post("/rollout-approvals", asyncHandler'),
  launchRolloutApprovalPatchWrapped: routes.launch.includes('router.patch("/rollout-approvals/:id", asyncHandler'),
  launchMigrationCreateWrapped: routes.launch.includes('router.post("/migration-checks", asyncHandler'),
  launchMigrationPatchWrapped: routes.launch.includes('router.patch("/migration-checks/:id", asyncHandler'),
  launchSupportCreateWrapped: routes.launch.includes('router.post("/support-escalations", asyncHandler'),
  launchSupportPatchWrapped: routes.launch.includes('router.patch("/support-escalations/:id", asyncHandler'),

  deviceRoutesFileExists: existsSync(routeFiles.devices),
  devicesImportAsyncHandler: routes.devices.includes("../middleware/asyncHandler.js"),
  deviceListWrapped: routes.devices.includes('router.get("/", asyncHandler'),
  deviceRegisterWrapped: routes.devices.includes('router.post("/register", asyncHandler'),
  deviceDetailWrapped: routes.devices.includes('router.get("/:deviceId", asyncHandler'),
  deviceAuditWrapped: routes.devices.includes('router.get("/:deviceId/audit", asyncHandler'),
  deviceHeartbeatWrapped: routes.devices.includes('router.patch("/:deviceId/heartbeat", asyncHandler'),
  deviceTrustWrapped: routes.devices.includes('router.patch("/:deviceId/trust", asyncHandler'),
  deviceAccessPolicyWrapped: routes.devices.includes('router.patch("/:deviceId/access-policy", asyncHandler'),
  deviceCommandsWrapped: routes.devices.includes('router.get("/:deviceId/commands", asyncHandler'),
  devicePendingCommandsWrapped: routes.devices.includes('router.get("/:deviceId/commands/pending", asyncHandler'),
  deviceCommandCreateWrapped: routes.devices.includes('router.post("/:deviceId/commands", asyncHandler'),
  deviceCommandAckWrapped: routes.devices.includes('router.patch("/:deviceId/commands/:commandId", asyncHandler'),

  connectorRoutesFileExists: existsSync(routeFiles.connectors),
  connectorsImportAsyncHandler: routes.connectors.includes("../middleware/asyncHandler.js"),
  connectorCatalogWrapped: routes.connectors.includes('router.get("/catalog", asyncHandler'),
  connectorInstallWrapped: routes.connectors.includes('router.post("/:key/install", asyncHandler'),
  connectorUninstallWrapped: routes.connectors.includes('router.delete("/:key/install", asyncHandler'),
  connectorAuditWrapped: routes.connectors.includes('router.get("/audit", asyncHandler')
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
