#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const headersPath = join(root, "apps", "api", "src", "middleware", "securityHeaders.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const headersSource = read(headersPath);
const serverSource = read(serverPath);

const checks = {
  headersFileExists: existsSync(headersPath),
  importsRuntimeEnv: headersSource.includes('../config/env.js') || headersSource.includes("../config/env.js"),
  hasContentSecurityPolicy: headersSource.includes("Content-Security-Policy") && headersSource.includes("default-src 'none'"),
  blocksFrameAncestors: headersSource.includes("frame-ancestors 'none'"),
  blocksFormAction: headersSource.includes("form-action 'none'"),
  keepsDisplayCaptureSelf: headersSource.includes("display-capture=(self)"),
  deniesSensitivePermissions: headersSource.includes("camera=()") && headersSource.includes("microphone=()") && headersSource.includes("geolocation=()"),
  hasNoSniff: headersSource.includes("X-Content-Type-Options") && headersSource.includes("nosniff"),
  hasFrameDeny: headersSource.includes("X-Frame-Options") && headersSource.includes("DENY"),
  hasNoReferrer: headersSource.includes("Referrer-Policy") && headersSource.includes("no-referrer"),
  hasCrossOriginHeaders: headersSource.includes("Cross-Origin-Opener-Policy") && headersSource.includes("Cross-Origin-Resource-Policy"),
  disablesDnsPrefetch: headersSource.includes("X-DNS-Prefetch-Control") && headersSource.includes("off"),
  disablesDownloadOpen: headersSource.includes("X-Download-Options") && headersSource.includes("noopen"),
  disablesCrossDomainPolicies: headersSource.includes("X-Permitted-Cross-Domain-Policies") && headersSource.includes("none"),
  hstsProductionOnly: headersSource.includes("env.isProduction") && headersSource.includes("Strict-Transport-Security"),
  hstsIncludesPreload: headersSource.includes("includeSubDomains; preload"),
  removesPoweredBy: headersSource.includes("res.removeHeader") && headersSource.includes("X-Powered-By"),
  serverUsesSecurityHeadersEarly: serverSource.includes("app.use(securityHeaders)") && serverSource.indexOf("app.use(requestId)") < serverSource.indexOf("app.use(securityHeaders)") && serverSource.indexOf("app.use(securityHeaders)") < serverSource.indexOf("app.use(cors"),
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
writeFileSync("reports/security-headers-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/security-headers-check.md",
  [
    "# Security Headers Check",
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

console.log(`[security-headers:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
