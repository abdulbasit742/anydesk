#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const shutdownPath = join(root, "apps", "api", "src", "lifecycle", "gracefulShutdown.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");
const healthPath = join(root, "apps", "api", "src", "observability", "health.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const shutdownSource = read(shutdownPath);
const serverSource = read(serverPath);
const healthSource = read(healthPath);

const checks = {
  shutdownFileExists: existsSync(shutdownPath),
  serverFileExists: existsSync(serverPath),
  healthFileExists: existsSync(healthPath),
  exportsInstaller: shutdownSource.includes("export function installGracefulShutdown"),
  marksNotReadyWithReason: shutdownSource.includes('health.markNotReady("shutting_down")'),
  closesSocketServer: shutdownSource.includes("io.close"),
  closesHttpServer: shutdownSource.includes("server.close"),
  disconnectsPrisma: shutdownSource.includes("prisma.$disconnect()"),
  handlesSigterm: shutdownSource.includes('process.once("SIGTERM"'),
  handlesSigint: shutdownSource.includes('process.once("SIGINT"'),
  hasForceTimeout: shutdownSource.includes("setTimeout") && shutdownSource.includes("timeoutMs"),
  preventsDoubleShutdown: shutdownSource.includes("shuttingDown") && shutdownSource.includes("if (shuttingDown) return"),
  logsLifecycleEvents: shutdownSource.includes("api.shutdown.start") && shutdownSource.includes("api.shutdown.complete"),
  serverImportsInstaller: serverSource.includes("./lifecycle/gracefulShutdown.js"),
  serverCapturesSocketInstance: serverSource.includes("const io = initSocketServer(server)"),
  serverInstallsShutdown: serverSource.includes("installGracefulShutdown({ server, io })"),
  healthCanMarkNotReady: healthSource.includes("markNotReady(reason = \"not_ready\")"),
  healthTracksReadinessReason: healthSource.includes('readinessReason = "starting"') && healthSource.includes("reason: readinessReason"),
  healthTracksReadinessChangedAt: healthSource.includes("readinessChangedAt") && healthSource.includes("setReadiness"),
  healthReadinessIncludesUptime: healthSource.includes("uptimeSec")
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
writeFileSync("reports/graceful-shutdown-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/graceful-shutdown-check.md",
  [
    "# Graceful Shutdown Check",
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

console.log(`[graceful-shutdown:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
