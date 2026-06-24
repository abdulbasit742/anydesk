#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const healthPath = join(root, "apps", "api", "src", "observability", "health.ts");
const shutdownPath = join(root, "apps", "api", "src", "lifecycle", "gracefulShutdown.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const healthSource = read(healthPath);
const shutdownSource = read(shutdownPath);
const serverSource = read(serverPath);

const checks = {
  healthFileExists: existsSync(healthPath),
  hasStartingReason: healthSource.includes('readinessReason = "starting"'),
  tracksReadinessChangedAt: healthSource.includes("readinessChangedAt") && healthSource.includes("new Date().toISOString()"),
  hasSetReadinessHelper: healthSource.includes("function setReadiness"),
  markReadyAcceptsReason: healthSource.includes("markReady(reason = \"ready\")"),
  markNotReadyAcceptsReason: healthSource.includes("markNotReady(reason = \"not_ready\")"),
  readinessReturnsReason: healthSource.includes("reason: readinessReason"),
  readinessReturnsChangedAt: healthSource.includes("readinessChangedAt"),
  readinessReturnsUptime: healthSource.includes("uptimeSec"),
  serverMarksReady: serverSource.includes("health.markReady()"),
  shutdownMarksReason: shutdownSource.includes('health.markNotReady("shutting_down")'),
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
writeFileSync("reports/readiness-state-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/readiness-state-check.md",
  [
    "# Readiness State Check",
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

console.log(`[readiness-state:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
