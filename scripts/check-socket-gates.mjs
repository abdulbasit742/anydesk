#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const socketPath = join(root, "apps", "api", "src", "socket", "index.ts");
const betaGatePath = join(root, "apps", "api", "src", "middleware", "betaFeatureGate.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const socketSource = read(socketPath);
const betaGateSource = read(betaGatePath);

const checks = {
  socketFileExists: existsSync(socketPath),
  betaGateFileExists: existsSync(betaGatePath),
  socketImportsGate: socketSource.includes("isBetaApiFeatureEnabled"),
  socketChecksSocketAccess: socketSource.includes('isBetaApiFeatureEnabled("socket_access")') || socketSource.includes("isBetaApiFeatureEnabled('socket_access')"),
  socketChecksSignalingAccess: socketSource.includes('isBetaApiFeatureEnabled("signaling_access")') || socketSource.includes("isBetaApiFeatureEnabled('signaling_access')"),
  socketEmitsFeatureDisabled: socketSource.includes("feature_disabled"),
  socketUsesSafeLogger: socketSource.includes("safeLogger") || socketSource.includes("logger.warn") || socketSource.includes("logger.info"),
  betaGateDefinesSocketAccess: betaGateSource.includes("socket_access"),
  betaGateDefinesSignalingAccess: betaGateSource.includes("signaling_access"),
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
writeFileSync("reports/socket-gate-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/socket-gate-check.md",
  [
    "# Engine Socket Gate Check",
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

console.log(`[socket-gates:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
