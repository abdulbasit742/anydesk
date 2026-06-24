#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const envPath = join(root, "apps", "api", "src", "config", "env.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const envSource = read(envPath);
const serverSource = read(serverPath);

const checks = {
  envFileExists: existsSync(envPath),
  serverFileExists: existsSync(serverPath),
  hasNormalizeCorsOrigin: envSource.includes("function normalizeCorsOrigin"),
  blocksWildcardWithCredentials: envSource.includes('origin === "*"') && envSource.includes("credentialed CORS"),
  validatesUrlWithConstructor: envSource.includes("new URL(origin)"),
  restrictsHttpProtocols: envSource.includes('"http:"') && envSource.includes('"https:"'),
  blocksPathQueryHash: envSource.includes("parsed.pathname") && envSource.includes("parsed.search") && envSource.includes("parsed.hash"),
  deduplicatesOrigins: envSource.includes("new Set(origins)"),
  exposesCorsOrigin: envSource.includes("corsOrigin: readCorsOrigins()"),
  serverUsesCorsPackage: serverSource.includes("import cors from \"cors\""),
  serverUsesEnvCorsOrigin: serverSource.includes("origin: env.corsOrigin"),
  serverUsesCredentials: serverSource.includes("credentials: true"),
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
writeFileSync("reports/cors-hardening-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/cors-hardening-check.md",
  [
    "# CORS Hardening Check",
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

console.log(`[cors:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
