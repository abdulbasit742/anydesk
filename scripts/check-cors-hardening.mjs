#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const envPath = join(root, "apps", "api", "src", "config", "env.ts");
const requestIdPath = join(root, "apps", "api", "src", "middleware", "requestId.ts");
const methodGuardPath = join(root, "apps", "api", "src", "middleware", "rejectUnsupportedHttpMethod.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");
const packagePath = join(root, "package.json");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const envSource = read(envPath);
const requestIdSource = read(requestIdPath);
const methodGuardSource = read(methodGuardPath);
const serverSource = read(serverPath);
const packageSource = read(packagePath);

const checks = {
  envFileExists: existsSync(envPath),
  requestIdFileExists: existsSync(requestIdPath),
  methodGuardFileExists: existsSync(methodGuardPath),
  serverFileExists: existsSync(serverPath),
  packageFileExists: existsSync(packagePath),
  hasNormalizeCorsOrigin: envSource.includes("function normalizeCorsOrigin"),
  blocksWildcardWithCredentials: envSource.includes('origin === "*"') && envSource.includes("credentialed CORS"),
  validatesUrlWithConstructor: envSource.includes("new URL(origin)"),
  restrictsHttpProtocols: envSource.includes('"http:"') && envSource.includes('"https:"'),
  blocksPathQueryHash: envSource.includes("parsed.pathname") && envSource.includes("parsed.search") && envSource.includes("parsed.hash"),
  deduplicatesOrigins: envSource.includes("new Set(origins)"),
  exposesCorsOrigin: envSource.includes("corsOrigin: readCorsOrigins()"),
  requestIdHeaderIsExported: requestIdSource.includes("export const REQUEST_ID_HEADER") && requestIdSource.includes('"x-request-id"'),
  methodGuardExportsAllowedMethods: methodGuardSource.includes("export const ALLOWED_HTTP_METHODS") && methodGuardSource.includes('"HEAD"') && methodGuardSource.includes('"OPTIONS"'),
  serverUsesCorsPackage: serverSource.includes("import cors from \"cors\""),
  serverUsesEnvCorsOrigin: serverSource.includes("origin: env.corsOrigin"),
  serverUsesCredentials: serverSource.includes("credentials: true"),
  serverDerivesCorsMethodsFromAllowlist: serverSource.includes("ALLOWED_CORS_METHODS = [...ALLOWED_HTTP_METHODS]") && serverSource.includes("methods: ALLOWED_CORS_METHODS"),
  serverUsesSharedRequestIdHeaderInAllowedHeaders: serverSource.includes('ALLOWED_REQUEST_HEADERS = ["authorization", "content-type", REQUEST_ID_HEADER]') && serverSource.includes("allowedHeaders: ALLOWED_REQUEST_HEADERS"),
  serverUsesSharedRequestIdHeaderInExposedHeaders: serverSource.includes("EXPOSED_RESPONSE_HEADERS = [REQUEST_ID_HEADER]") && serverSource.includes("exposedHeaders: EXPOSED_RESPONSE_HEADERS"),
  serverUsesExplicitCorsPreflightMaxAge: serverSource.includes("CORS_PREFLIGHT_MAX_AGE_SECONDS") && serverSource.includes("maxAge: CORS_PREFLIGHT_MAX_AGE_SECONDS"),
  serverUsesExplicitOptionsSuccessStatus: serverSource.includes("optionsSuccessStatus: 204"),
  packageHasCorsCheckScript: packageSource.includes('"cors:check"') && packageSource.includes("node scripts/check-cors-hardening.mjs"),
  ciRunsCorsCheck: packageSource.includes("npm run runtime-env:check && npm run cors:check && npm run auth:check"),
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
