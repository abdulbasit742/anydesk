#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const packagePath = join(root, "package.json");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const packageSource = read(packagePath);
const serverSource = read(serverPath);

const checks = {
  packageFileExists: existsSync(packagePath),
  serverFileExists: existsSync(serverPath),
  packageHasServerTimeoutScript: packageSource.includes('"server-timeouts:check"') && packageSource.includes("node scripts/check-server-timeouts.mjs"),
  ciRunsServerTimeoutScript: packageSource.includes("npm run security-headers:check && npm run server-timeouts:check && npm run shutdown:check"),
  definesRequestTimeout: serverSource.includes("HTTP_REQUEST_TIMEOUT_MS") && serverSource.includes("120_000"),
  definesHeadersTimeout: serverSource.includes("HTTP_HEADERS_TIMEOUT_MS") && serverSource.includes("30_000"),
  definesKeepAliveTimeout: serverSource.includes("HTTP_KEEP_ALIVE_TIMEOUT_MS") && serverSource.includes("5_000"),
  appliesRequestTimeout: serverSource.includes("server.requestTimeout = HTTP_REQUEST_TIMEOUT_MS"),
  appliesHeadersTimeout: serverSource.includes("server.headersTimeout = HTTP_HEADERS_TIMEOUT_MS"),
  appliesKeepAliveTimeout: serverSource.includes("server.keepAliveTimeout = HTTP_KEEP_ALIVE_TIMEOUT_MS"),
  appliesLegacySocketTimeout: serverSource.includes("server.timeout = HTTP_REQUEST_TIMEOUT_MS"),
  createsServerBeforeSocket: serverSource.indexOf("http.createServer(app)") < serverSource.indexOf("initSocketServer(server)"),
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
writeFileSync("reports/server-timeouts-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/server-timeouts-check.md",
  [
    "# HTTP Server Timeout Check",
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

console.log(`[server-timeouts:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
