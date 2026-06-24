#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const noStorePath = join(root, "apps", "api", "src", "middleware", "noStore.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const noStoreSource = read(noStorePath);
const serverSource = read(serverPath);

const noStoreApiIndex = serverSource.indexOf('app.use("/api", noStore)');
const authRoutesIndex = serverSource.indexOf('app.use("/api/auth", authRoutes)');
const usersRoutesIndex = serverSource.indexOf('app.use("/api/users", userRoutes)');
const sessionsRoutesIndex = serverSource.indexOf('app.use("/api/sessions", sessionRoutes)');
const connectorsRoutesIndex = serverSource.indexOf('app.use("/api/connectors", connectorRoutes)');

const checks = {
  noStoreFileExists: existsSync(noStorePath),
  exportsNoStore: noStoreSource.includes("export const noStore"),
  setsCacheControlNoStore: noStoreSource.includes("Cache-Control") && noStoreSource.includes("no-store"),
  setsPragmaNoCache: noStoreSource.includes("Pragma") && noStoreSource.includes("no-cache"),
  setsExpiresZero: noStoreSource.includes("Expires") && noStoreSource.includes('"0"'),
  callsNext: noStoreSource.includes("next()"),
  serverImportsNoStore: serverSource.includes("./middleware/noStore.js"),
  serverAppliesNoStoreToAllApi: noStoreApiIndex >= 0,
  noStoreBeforeAuthRoutes: noStoreApiIndex >= 0 && authRoutesIndex >= 0 && noStoreApiIndex < authRoutesIndex,
  noStoreBeforeUsersRoutes: noStoreApiIndex >= 0 && usersRoutesIndex >= 0 && noStoreApiIndex < usersRoutesIndex,
  noStoreBeforeSessionsRoutes: noStoreApiIndex >= 0 && sessionsRoutesIndex >= 0 && noStoreApiIndex < sessionsRoutesIndex,
  noStoreBeforeConnectorsRoutes: noStoreApiIndex >= 0 && connectorsRoutesIndex >= 0 && noStoreApiIndex < connectorsRoutesIndex,
  authUsesInheritedNoStore: serverSource.includes('app.use("/api/auth", authRoutes)') && !serverSource.includes('app.use("/api/auth", noStore, authRoutes)'),
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
writeFileSync("reports/no-store-auth-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/no-store-auth-check.md",
  [
    "# No-store API Check",
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

console.log(`[no-store:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
