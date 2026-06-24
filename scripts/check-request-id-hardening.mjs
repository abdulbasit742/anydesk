#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requestIdPath = join(root, "apps", "api", "src", "middleware", "requestId.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");
const errorHandlerPath = join(root, "apps", "api", "src", "middleware", "errorHandler.ts");
const packagePath = join(root, "package.json");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const requestIdSource = read(requestIdPath);
const serverSource = read(serverPath);
const errorSource = read(errorHandlerPath);
const packageSource = read(packagePath);

const checks = {
  requestIdFileExists: existsSync(requestIdPath),
  packageFileExists: existsSync(packagePath),
  packageHasTraceCheckScript: packageSource.includes('"trace:check"') && packageSource.includes("node scripts/check-request-id-hardening.mjs"),
  ciRunsTraceCheck: packageSource.includes("npm run trace:check"),
  exportsRequestWithId: requestIdSource.includes("export interface RequestWithId"),
  exportsNormalizeRequestId: requestIdSource.includes("export function normalizeRequestId"),
  exportsRequestIdHeader: requestIdSource.includes("export const REQUEST_ID_HEADER") && requestIdSource.includes('"x-request-id"'),
  exportsRequestIdLimits: requestIdSource.includes("export const REQUEST_ID_MIN_LENGTH") && requestIdSource.includes("export const REQUEST_ID_MAX_LENGTH"),
  hasMinLengthLimit: requestIdSource.includes("REQUEST_ID_MIN_LENGTH") && requestIdSource.includes("8"),
  hasMaxLengthLimit: requestIdSource.includes("REQUEST_ID_MAX_LENGTH") && requestIdSource.includes("96"),
  exportsAllowlistPattern: requestIdSource.includes("export const REQUEST_ID_PATTERN"),
  hasAllowlistPattern: requestIdSource.includes("REQUEST_ID_PATTERN") && requestIdSource.includes("/^[a-zA-Z0-9._:-]+$/"),
  rejectsShortIds: requestIdSource.includes("trimmed.length < REQUEST_ID_MIN_LENGTH"),
  rejectsLongIds: requestIdSource.includes("trimmed.length > REQUEST_ID_MAX_LENGTH"),
  rejectsPatternMismatch: requestIdSource.includes("!REQUEST_ID_PATTERN.test(trimmed)"),
  trimsIncomingIds: requestIdSource.includes("value?.trim()"),
  readsHeaderViaConstant: requestIdSource.includes("req.header(REQUEST_ID_HEADER)"),
  fallsBackToRandomUuid: requestIdSource.includes("incoming ?? randomUUID()"),
  setsResponseHeaderViaConstant: requestIdSource.includes("res.setHeader(REQUEST_ID_HEADER, id)"),
  serverImportsRequestIdHeader: serverSource.includes("REQUEST_ID_HEADER, requestId"),
  serverDefinesCorsPreflightMaxAge: serverSource.includes("CORS_PREFLIGHT_MAX_AGE_SECONDS") && serverSource.includes("600"),
  corsUsesPreflightMaxAge: serverSource.includes("maxAge: CORS_PREFLIGHT_MAX_AGE_SECONDS"),
  corsUsesExplicitOptionsStatus: serverSource.includes("optionsSuccessStatus: 204"),
  serverDefinesAllowedCorsMethods: serverSource.includes("ALLOWED_CORS_METHODS") && serverSource.includes("ALLOWED_HTTP_METHODS") && serverSource.includes("methods: ALLOWED_CORS_METHODS"),
  corsUsesAllowedMethods: serverSource.includes("methods: ALLOWED_CORS_METHODS"),
  serverDefinesAllowedRequestHeaders: serverSource.includes("ALLOWED_REQUEST_HEADERS") && serverSource.includes('"authorization"') && serverSource.includes('"content-type"'),
  allowedHeadersIncludeRequestIdConstant: serverSource.includes("ALLOWED_REQUEST_HEADERS") && serverSource.includes("REQUEST_ID_HEADER") && serverSource.includes("allowedHeaders: ALLOWED_REQUEST_HEADERS"),
  serverDefinesExposedResponseHeaders: serverSource.includes("EXPOSED_RESPONSE_HEADERS") && serverSource.includes("REQUEST_ID_HEADER"),
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
