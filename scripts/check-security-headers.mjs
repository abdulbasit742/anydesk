#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const headersPath = join(root, "apps", "api", "src", "middleware", "securityHeaders.ts");
const queryGuardPath = join(root, "apps", "api", "src", "middleware", "rejectOversizedQueryString.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const headersSource = read(headersPath);
const queryGuardSource = read(queryGuardPath);
const serverSource = read(serverPath);
const simpleQueryParserIndex = serverSource.indexOf('app.set("query parser", "simple")');
const requestIdIndex = serverSource.indexOf("app.use(requestId)");
const securityHeadersIndex = serverSource.indexOf("app.use(securityHeaders)");
const queryGuardIndex = serverSource.indexOf("app.use(rejectOversizedQueryString)");
const corsIndex = serverSource.indexOf("app.use(cors");

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
  enablesOriginAgentCluster: headersSource.includes("Origin-Agent-Cluster") && headersSource.includes("?1"),
  disablesDnsPrefetch: headersSource.includes("X-DNS-Prefetch-Control") && headersSource.includes("off"),
  disablesDownloadOpen: headersSource.includes("X-Download-Options") && headersSource.includes("noopen"),
  disablesCrossDomainPolicies: headersSource.includes("X-Permitted-Cross-Domain-Policies") && headersSource.includes("none"),
  disablesLegacyXssAuditor: headersSource.includes("X-XSS-Protection") && headersSource.includes('"0"'),
  preventsApiIndexing: headersSource.includes("X-Robots-Tag") && headersSource.includes("noindex, nofollow, nosnippet"),
  hstsProductionOnly: headersSource.includes("env.isProduction") && headersSource.includes("Strict-Transport-Security"),
  hstsIncludesPreload: headersSource.includes("includeSubDomains; preload"),
  removesPoweredBy: headersSource.includes("res.removeHeader") && headersSource.includes("X-Powered-By"),
  serverUsesSimpleQueryParser: simpleQueryParserIndex >= 0,
  simpleQueryParserBeforeMiddleware: simpleQueryParserIndex >= 0 && requestIdIndex >= 0 && simpleQueryParserIndex < requestIdIndex,
  queryGuardFileExists: existsSync(queryGuardPath),
  exportsQueryGuard: queryGuardSource.includes("export function rejectOversizedQueryString"),
  queryGuardHasTargetLimit: queryGuardSource.includes("MAX_REQUEST_TARGET_LENGTH") && queryGuardSource.includes("4096"),
  queryGuardHasPathLimit: queryGuardSource.includes("MAX_PATH_LENGTH") && queryGuardSource.includes("2048"),
  queryGuardHasPathSegmentLimit: queryGuardSource.includes("MAX_PATH_SEGMENTS") && queryGuardSource.includes("64"),
  queryGuardHasQueryLimit: queryGuardSource.includes("MAX_QUERY_STRING_LENGTH") && queryGuardSource.includes("2048"),
  queryGuardHasQueryParameterCountLimit: queryGuardSource.includes("MAX_QUERY_PARAMETER_COUNT") && queryGuardSource.includes("64"),
  queryGuardHasQueryParameterKeyLimit: queryGuardSource.includes("MAX_QUERY_PARAMETER_KEY_LENGTH") && queryGuardSource.includes("128"),
  queryGuardHasQueryParameterValueLimit: queryGuardSource.includes("MAX_QUERY_PARAMETER_VALUE_LENGTH") && queryGuardSource.includes("1024"),
  queryGuardUsesOriginalUrl: queryGuardSource.includes("getRequestTarget") && queryGuardSource.includes("originalUrl"),
  queryGuardParsesPath: queryGuardSource.includes("getPathFromRequestTarget") && queryGuardSource.includes("getPathSegmentCount"),
  queryGuardParsesQueryParameters: queryGuardSource.includes("getQueryParameterStats") && queryGuardSource.includes("maxKeyLength") && queryGuardSource.includes("maxValueLength"),
  queryGuardChecksMalformedEncoding: queryGuardSource.includes("hasMalformedPercentEncoding") && queryGuardSource.includes("PERCENT_ENCODING_PATTERN"),
  queryGuardChecksEncodedControls: queryGuardSource.includes("hasEncodedControlCharacter") && queryGuardSource.includes("ENCODED_CONTROL_CHARACTER_PATTERN"),
  queryGuardChecksEncodedBackslash: queryGuardSource.includes("hasEncodedBackslash") && queryGuardSource.includes("ENCODED_BACKSLASH_PATTERN"),
  queryGuardChecksParentSegment: queryGuardSource.includes("hasParentDirectorySegment") && queryGuardSource.includes("ENCODED_PARENT_SEGMENT_PATTERN"),
  queryGuardRejectsMalformedEncodingWith400: queryGuardSource.includes("res.status(400)") && queryGuardSource.includes("malformed_request_target_encoding"),
  queryGuardRejectsControlCharsWith400: queryGuardSource.includes("res.status(400)") && queryGuardSource.includes("invalid_request_target_character"),
  queryGuardRejectsEncodedBackslashWith400: queryGuardSource.includes("res.status(400)") && queryGuardSource.includes("invalid_path_separator"),
  queryGuardRejectsParentSegmentWith400: queryGuardSource.includes("res.status(400)") && queryGuardSource.includes("parent_path_segment_not_allowed"),
  queryGuardRejectsLongTargetWith414: queryGuardSource.includes("res.status(414)") && queryGuardSource.includes("request_target_too_long"),
  queryGuardRejectsLongPathWith414: queryGuardSource.includes("res.status(414)") && queryGuardSource.includes("path_too_long"),
  queryGuardRejectsTooManySegmentsWith414: queryGuardSource.includes("res.status(414)") && queryGuardSource.includes("too_many_path_segments"),
  queryGuardRejectsLongQueryWith414: queryGuardSource.includes("res.status(414)") && queryGuardSource.includes("query_string_too_long"),
  queryGuardRejectsTooManyQueryParametersWith414: queryGuardSource.includes("res.status(414)") && queryGuardSource.includes("too_many_query_parameters"),
  queryGuardRejectsLongQueryKeyWith414: queryGuardSource.includes("res.status(414)") && queryGuardSource.includes("query_parameter_key_too_long"),
  queryGuardRejectsLongQueryValueWith414: queryGuardSource.includes("res.status(414)") && queryGuardSource.includes("query_parameter_value_too_long"),
  queryGuardReturnsRequestId: queryGuardSource.includes("requestId: req.requestId"),
  serverImportsQueryGuard: serverSource.includes("./middleware/rejectOversizedQueryString.js"),
  serverUsesQueryGuard: queryGuardIndex >= 0,
  queryGuardAfterSecurityHeaders: securityHeadersIndex >= 0 && queryGuardIndex >= 0 && securityHeadersIndex < queryGuardIndex,
  queryGuardBeforeCors: queryGuardIndex >= 0 && corsIndex >= 0 && queryGuardIndex < corsIndex,
  serverUsesSecurityHeadersEarly: serverSource.includes("app.use(securityHeaders)") && requestIdIndex < securityHeadersIndex && securityHeadersIndex < corsIndex,
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
