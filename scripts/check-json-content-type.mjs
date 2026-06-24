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
  limitsToMutatingMethods: middlewareSource.includes("POST") && middlewareSource.includes("PUT") && middlewareSource.includes("PATCH"),
  limitsToApiPaths: middlewareSource.includes('path === "/api"') && middlewareSource.includes('path.startsWith("/api/")'),
  detectsRequestBody: middlewareSource.includes("function hasRequestBody") && middlewareSource.includes('req.get("content-length")'),
  detectsChunkedRequestBody: middlewareSource.includes('req.get("transfer-encoding")'),
  allowsEmptyBodyMutations: middlewareSource.includes("!hasRequestBody(req)"),
  acceptsJson: middlewareSource.includes('req.is("application/json")'),
  acceptsJsonSuffix: middlewareSource.includes('req.is("application/*+json")'),
  returnsUnsupportedMediaType: middlewareSource.includes("415") && middlewareSource.includes("unsupported_media_type"),
  returnsRequestId: middlewareSource.includes("requestId: req.requestId"),
  encodingGuardFileExists: existsSync(encodingGuardPath),
  exportsEncodingGuard: encodingGuardSource.includes("export function rejectUnsupportedContentEncoding"),
  normalizesContentEncoding: encodingGuardSource.includes("normalizeContentEncoding") && encodingGuardSource.includes('req.get("content-encoding")'),
  allowsIdentityEncoding: encodingGuardSource.includes("SUPPORTED_CONTENT_ENCODINGS") && encodingGuardSource.includes('"identity"'),
  rejectsUnsupportedEncoding: encodingGuardSource.includes("unsupported_content_encoding") && encodingGuardSource.includes("Compressed request bodies are not supported"),
  serverImportsEncodingGuard: serverSource.includes("./middleware/rejectUnsupportedContentEncoding.js"),
  serverUsesEncodingGuard: encodingGuardIndex >= 0,
  encodingGuardBeforeContentTypeGuard: encodingGuardIndex >= 0 && guardIndex >= 0 && encodingGuardIndex < guardIndex,
  encodingGuardBeforeJsonParser: encodingGuardIndex >= 0 && parserIndex >= 0 && encodingGuardIndex < parserIndex,
  charsetGuardFileExists: existsSync(charsetGuardPath),
  exportsCharsetGuard: charsetGuardSource.includes("export function rejectUnsupportedJsonCharset"),
  normalizesJsonCharset: charsetGuardSource.includes("normalizeJsonCharset") && charsetGuardSource.includes("charset"),
  allowsUtf8Charsets: charsetGuardSource.includes("SUPPORTED_JSON_CHARSETS") && charsetGuardSource.includes('"utf-8"') && charsetGuardSource.includes('"utf8"'),
  rejectsUnsupportedCharset: charsetGuardSource.includes("unsupported_charset") && charsetGuardSource.includes("Request body charset is not supported"),
  charsetGuardLimitsToJsonBody: charsetGuardSource.includes("isJsonContentType") && charsetGuardSource.includes("hasRequestBody"),
  serverImportsCharsetGuard: serverSource.includes("./middleware/rejectUnsupportedJsonCharset.js"),
  serverUsesCharsetGuard: charsetGuardIndex >= 0,
  charsetGuardAfterContentTypeGuard: guardIndex >= 0 && charsetGuardIndex >= 0 && guardIndex < charsetGuardIndex,
  charsetGuardBeforeJsonParser: charsetGuardIndex >= 0 && parserIndex >= 0 && charsetGuardIndex < parserIndex,
  serverImportsGuard: serverSource.includes("./middleware/requireJsonContentType.js"),
  serverUsesGuard: guardIndex >= 0,
  guardBeforeJsonParser: guardIndex >= 0 && parserIndex >= 0 && guardIndex < parserIndex,
  definesJsonBodyTypes: serverSource.includes("JSON_BODY_TYPES") && serverSource.includes('"application/json"') && serverSource.includes('"application/*+json"'),
  parserSupportsStandardJson: serverSource.includes("type: JSON_BODY_TYPES") && serverSource.includes('"application/json"'),
  parserSupportsJsonSuffix: serverSource.includes("type: JSON_BODY_TYPES") && serverSource.includes('"application/*+json"'),
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
