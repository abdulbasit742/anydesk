#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const middlewarePath = join(root, "apps", "api", "src", "middleware", "requireJsonContentType.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const middlewareSource = read(middlewarePath);
const serverSource = read(serverPath);

const guardIndex = serverSource.indexOf("app.use(requireJsonContentType)");
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
  serverImportsGuard: serverSource.includes("./middleware/requireJsonContentType.js"),
  serverUsesGuard: guardIndex >= 0,
  guardBeforeJsonParser: guardIndex >= 0 && parserIndex >= 0 && guardIndex < parserIndex,
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
