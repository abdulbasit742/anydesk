#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dependencyPath = join(root, "apps", "api", "src", "observability", "dependencyHealth.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");
const packagePath = join(root, "package.json");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const dependencySource = read(dependencyPath);
const serverSource = read(serverPath);
const packageSource = read(packagePath);

const checks = {
  dependencyFileExists: existsSync(dependencyPath),
  serverFileExists: existsSync(serverPath),
  packageFileExists: existsSync(packagePath),
  packageHasDependencyReadinessCheckScript: packageSource.includes('"dependency-readiness:check"') && packageSource.includes("node scripts/check-dependency-readiness.mjs"),
  ciRunsDependencyReadinessCheck: packageSource.includes("npm run dependency-readiness:check"),
  exportsDependencyHealth: dependencySource.includes("export interface DependencyHealth"),
  exportsDatabaseHealthCheck: dependencySource.includes("export async function checkDatabaseHealth"),
  databaseUsesPrismaQuery: dependencySource.includes("prisma.$queryRaw") && dependencySource.includes("SELECT 1"),
  databaseReportsLatency: dependencySource.includes("latencyMs"),
  databaseReportsDegraded: dependencySource.includes('"degraded"'),
  databaseReportsCached: dependencySource.includes("cached: boolean") && dependencySource.includes("cached: true"),
  databaseReportsTimeout: dependencySource.includes("timedOut") && dependencySource.includes("database_health_timeout"),
  databaseHasTimeoutLimit: dependencySource.includes("DATABASE_HEALTH_TIMEOUT_MS") && dependencySource.includes("2_000"),
  databaseHasCacheTtl: dependencySource.includes("DATABASE_HEALTH_CACHE_TTL_MS") && dependencySource.includes("5_000"),
  databaseUsesPromiseRace: dependencySource.includes("Promise.race"),
  timeoutIsUnrefed: dependencySource.includes("timeout.unref()"),
  serverImportsDependencyCheck: serverSource.includes("./observability/dependencyHealth.js"),
  serverImportsAsyncHandler: serverSource.includes("./middleware/asyncHandler.js"),
  hasReadinessBodyHelper: serverSource.includes("async function readinessBody"),
  readinessIncludesDependencies: serverSource.includes("dependencies") && serverSource.includes("database"),
  readyRequiresDatabaseOk: serverSource.includes('database.status === "ok"'),
  healthReadyRouteAsync: serverSource.includes('app.get("/health/ready", asyncHandler'),
  readyzRouteAsync: serverSource.includes('app.get("/readyz", asyncHandler'),
  degradedReturns503: serverSource.includes("res.status(body.ready ? 200 : 503)")
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
writeFileSync("reports/dependency-readiness-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/dependency-readiness-check.md",
  [
    "# Dependency Readiness Check",
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

console.log(`[dependency-readiness:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
