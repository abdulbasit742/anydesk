#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requestIdPath = join(root, "apps", "api", "src", "middleware", "requestId.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");
const errorHandlerPath = join(root, "apps", "api", "src", "middleware", "errorHandler.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const requestIdSource = read(requestIdPath);
const serverSource = read(serverPath);
const errorSource = read(errorHandlerPath);

const checks = {
  requestIdFileExists: existsSync(requestIdPath),
  exportsRequestWithId: requestIdSource.includes("export interface RequestWithId"),
  exportsNormalizeRequestId: requestIdSource.includes("export function normalizeRequestId"),
  hasMaxLengthLimit: requestIdSource.includes("REQUEST_ID_MAX_LENGTH") && requestIdSource.includes("96"),
  hasAllowlistPattern: requestIdSource.includes("REQUEST_ID_PATTERN") && requestIdSource.includes("/^[a-zA-Z0-9._:-]+$/"),
  rejectsLongIds: requestIdSource.includes("trimmed.length > REQUEST_ID_MAX_LENGTH"),
  rejectsPatternMismatch: requestIdSource.includes("!REQUEST_ID_PATTERN.test(trimmed)"),
  fallsBackToRandomUuid: requestIdSource.includes("incoming ?? randomUUID()"),
  setsResponseHeader: requestIdSource.includes('res.setHeader("x-request-id", id)'),
  serverDefinesAllowedRequestHeaders: serverSource.includes("ALLOWED_REQUEST_HEADERS") && serverSource.includes('"authorization"') && serverSource.includes('"content-type"'),
  allowedHeadersIncludeRequestId: serverSource.includes('"x-request-id"') && serverSource.includes("allowedHeaders: ALLOWED_REQUEST_HEADERS"),
  serverDefinesExposedResponseHeaders: serverSource.includes("EXPOSED_RESPONSE_HEADERS") && serverSource.includes('"x-request-id"'),
  corsExposesRequestIdHeader: serverSource.includes("exposedHeaders: EXPOSED_RESPONSE_HEADERS"),
  serverUsesRequestIdEarly: serverSource.includes("app.use(requestId)") && serverSource.indexOf("app.use(requestId)") < serverSource.indexOf("app.use(securityHeaders)"),
  errorHandlerReturnsRequestId: errorSource.includes("requestId: req.requestId"),
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
writeFileSync("reports/request-id-hardening-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/request-id-hardening-check.md",
  [
    "# Request ID Hardening Check",
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

console.log(`[request-id:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
