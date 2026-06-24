#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const middlewarePath = join(root, "apps", "api", "src", "middleware", "requireJsonContentType.ts");
const encodingGuardPath = join(root, "apps", "api", "src", "middleware", "rejectUnsupportedContentEncoding.ts");
const charsetGuardPath = join(root, "apps", "api", "src", "middleware", "rejectUnsupportedJsonCharset.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const middlewareSource = read(middlewarePath);
const encodingGuardSource = read(encodingGuardPath);
const charsetGuardSource = read(charsetGuardPath);
const serverSource = read(serverPath);

const encodingGuardIndex = serverSource.indexOf("app.use(rejectUnsupportedContentEncoding)");
const guardIndex = serverSource.indexOf("app.use(requireJsonContentType)");
const charsetGuardIndex = serverSource.indexOf("app.use(rejectUnsupportedJsonCharset)");
const parserIndex = serverSource.indexOf("app.use(express.json");

const checks = {
  middlewareFileExists: existsSync(middlewarePath),
  exportsGuard: middlewareSource.includes("export const requireJsonContentType"),
  exportsJsonBodyTypes: middlewareSource.includes("export const JSON_BODY_TYPES") && middlewareSource.includes('"application/json"') && middlewareSource.includes('"application/*+json"'),
  exportsJsonBodyMethods: middlewareSource.includes("export const JSON_BODY_METHODS") && middlewareSource.includes('"POST"') && middlewareSource.includes('"PUT"') && middlewareSource.includes('"PATCH"'),
  exportsUnsupportedMediaTypeMessage: middlewareSource.includes("export const UNSUPPORTED_JSON_MEDIA_TYPE_MESSAGE") && middlewareSource.includes("application/json or application/*+json"),
  exportsJsonRequestScopeHelpers: middlewareSource.includes("export function isApiPath") && middlewareSource.includes("export function hasRequestBody"),
  exportsJsonContentTypeMatcher: middlewareSource.includes("export function isJsonContentType") && middlewareSource.includes("getMediaType") && middlewareSource.includes("JSON_BODY_TYPES.some"),
  limitsToMutatingMethods: middlewareSource.includes("JSON_BODY_METHODS.has(req.method)"),
  limitsToApiPaths: middlewareSource.includes('path === "/api"') && middlewareSource.includes('path.startsWith("/api/")'),
  detectsRequestBody: middlewareSource.includes("export function hasRequestBody") && middlewareSource.includes('req.get("content-length")'),
  detectsChunkedRequestBody: middlewareSource.includes('req.get("transfer-encoding")'),
  allowsEmptyBodyMutations: middlewareSource.includes("!hasRequestBody(req)"),
  acceptsJsonFromSharedMatcher: middlewareSource.includes('isJsonContentType(req.get("content-type"))'),
  returnsUnsupportedMediaType: middlewareSource.includes("415") && middlewareSource.includes("unsupported_media_type"),
  returnsAllowlistAlignedMessage: middlewareSource.includes("message: UNSUPPORTED_JSON_MEDIA_TYPE_MESSAGE"),
  returnsRequestId: middlewareSource.includes("requestId: req.requestId"),
  encodingGuardFileExists: existsSync(encodingGuardPath),
  exportsEncodingGuard: encodingGuardSource.includes("export function rejectUnsupportedContentEncoding"),
  exportsSupportedContentEncodings: encodingGuardSource.includes("export const SUPPORTED_CONTENT_ENCODINGS") && encodingGuardSource.includes('"identity"'),
  encodingGuardImportsSharedRequestScope: encodingGuardSource.includes('import { JSON_BODY_METHODS, hasRequestBody, isApiPath } from "./requireJsonContentType.js"'),
  encodingGuardLimitsToJsonBody: encodingGuardSource.includes("hasRequestBody(req)") && encodingGuardSource.includes("JSON_BODY_METHODS.has(req.method)") && encodingGuardSource.includes("isApiPath(req.path)"),
  normalizesContentEncoding: encodingGuardSource.includes("normalizeContentEncoding") && encodingGuardSource.includes('req.get("content-encoding")'),
  allowsIdentityEncoding: encodingGuardSource.includes("SUPPORTED_CONTENT_ENCODINGS.has(encoding)"),
  rejectsUnsupportedEncoding: encodingGuardSource.includes("unsupported_content_encoding") && encodingGuardSource.includes("Compressed request bodies are not supported"),
  serverImportsEncodingGuard: serverSource.includes("./middleware/rejectUnsupportedContentEncoding.js"),
  serverUsesEncodingGuard: encodingGuardIndex >= 0,
  encodingGuardBeforeContentTypeGuard: encodingGuardIndex >= 0 && guardIndex >= 0 && encodingGuardIndex < guardIndex,
  encodingGuardBeforeJsonParser: encodingGuardIndex >= 0 && parserIndex >= 0 && encodingGuardIndex < parserIndex,
  charsetGuardFileExists: existsSync(charsetGuardPath),
  exportsCharsetGuard: charsetGuardSource.includes("export function rejectUnsupportedJsonCharset"),
  exportsSupportedJsonCharsets: charsetGuardSource.includes("export const SUPPORTED_JSON_CHARSETS") && charsetGuardSource.includes('"utf-8"') && charsetGuardSource.includes('"utf8"'),
  charsetGuardImportsSharedJsonMatcher: charsetGuardSource.includes('import { JSON_BODY_METHODS, hasRequestBody, isApiPath, isJsonContentType } from "./requireJsonContentType.js"'),
  normalizesJsonCharset: charsetGuardSource.includes("normalizeJsonCharset") && charsetGuardSource.includes("charset"),
  allowsUtf8Charsets: charsetGuardSource.includes("SUPPORTED_JSON_CHARSETS.has(charset)"),
  rejectsUnsupportedCharset: charsetGuardSource.includes("unsupported_charset") && charsetGuardSource.includes("Request body charset is not supported"),
  charsetGuardLimitsToJsonBody: charsetGuardSource.includes("hasRequestBody(req)") && charsetGuardSource.includes("JSON_BODY_METHODS.has(req.method)") && charsetGuardSource.includes("isApiPath(req.path)"),
  charsetGuardUsesSharedJsonMatcher: charsetGuardSource.includes("isJsonContentType(contentType)") && !charsetGuardSource.includes("JSON_BODY_TYPES.some"),
  serverImportsCharsetGuard: serverSource.includes("./middleware/rejectUnsupportedJsonCharset.js"),
  serverUsesCharsetGuard: charsetGuardIndex >= 0,
  charsetGuardAfterContentTypeGuard: guardIndex >= 0 && charsetGuardIndex >= 0 && guardIndex < charsetGuardIndex,
  charsetGuardBeforeJsonParser: charsetGuardIndex >= 0 && parserIndex >= 0 && charsetGuardIndex < parserIndex,
  serverImportsGuardAndTypes: serverSource.includes("JSON_BODY_TYPES, requireJsonContentType") && serverSource.includes("./middleware/requireJsonContentType.js"),
  serverUsesGuard: guardIndex >= 0,
  guardBeforeJsonParser: guardIndex >= 0 && parserIndex >= 0 && guardIndex < parserIndex,
  parserSupportsStandardJson: serverSource.includes("type: JSON_BODY_TYPES") && middlewareSource.includes('"application/json"'),
  parserSupportsJsonSuffix: serverSource.includes("type: JSON_BODY_TYPES") && middlewareSource.includes('"application/*+json"'),
  definesJsonBodyLimit: serverSource.includes("JSON_BODY_LIMIT") && serverSource.includes('const JSON_BODY_LIMIT = "1mb"'),
  parserKeepsBodyLimit: serverSource.includes("limit: JSON_BODY_LIMIT"),
  parserDisablesInflation: serverSource.includes("inflate: false"),
  parserUsesStrictMode: serverSource.includes("strict: true"),
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
writeFileSync("reports/json-content-type-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/json-content-type-check.md",
  [
    "# JSON Content-Type Check",
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

console.log(`[json-content-type:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
