#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const handlerPath = join(root, "apps", "api", "src", "middleware", "errorHandler.ts");
const serverPath = join(root, "apps", "api", "src", "server.ts");
const packagePath = join(root, "package.json");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const handlerSource = read(handlerPath);
const serverSource = read(serverPath);
const packageSource = read(packagePath);

const checks = {
  handlerFileExists: existsSync(handlerPath),
  serverFileExists: existsSync(serverPath),
  packageFileExists: existsSync(packagePath),
  packageHasApiErrorsCheckScript: packageSource.includes('"api-errors:check"') && packageSource.includes("node scripts/check-api-error-handling.mjs"),
  ciRunsApiErrorsCheck: packageSource.includes("npm run api-errors:check"),
  exportsNotFound: handlerSource.includes("export function notFound"),
  exportsErrorHandler: handlerSource.includes("export function errorHandler"),
  handlesZodErrors: handlerSource.includes("ZodError") && handlerSource.includes("validation_error"),
  detectsJsonSyntaxError: handlerSource.includes("function isJsonSyntaxError") && handlerSource.includes("error instanceof SyntaxError"),
  returnsInvalidJsonCode: handlerSource.includes("invalid_json") && handlerSource.includes("Request body contains invalid JSON"),
  detectsUnsupportedContentEncoding: handlerSource.includes("function isUnsupportedContentEncodingError") && handlerSource.includes("encoding.unsupported"),
  returnsUnsupportedContentEncodingCode: handlerSource.includes("unsupported_content_encoding") && handlerSource.includes("Compressed request bodies are not supported"),
  detectsUnsupportedCharset: handlerSource.includes("function isUnsupportedCharsetError") && handlerSource.includes("charset.unsupported"),
  returnsUnsupportedCharsetCode: handlerSource.includes("unsupported_charset") && handlerSource.includes("Request body charset is not supported"),
  detectsPayloadTooLarge: handlerSource.includes("function isPayloadTooLargeError") && handlerSource.includes("entity.too.large"),
  maps413ToPayloadTooLarge: handlerSource.includes("status === 413") && handlerSource.includes("payload_too_large"),
  returnsPayloadTooLargeMessage: handlerSource.includes("Request body exceeds the maximum allowed size"),
  delegatesWhenHeadersSent: handlerSource.includes("res.headersSent") && handlerSource.includes("return next(error)"),
  hidesStackInProduction: handlerSource.includes("env.isProduction") && handlerSource.includes("stack: error.stack"),
  logsWithSafeLogger: handlerSource.includes("safeLogger") || handlerSource.includes("logger.error"),
  returnsRequestId: handlerSource.includes("requestId"),
  serverImportsHandlers: serverSource.includes("notFound") && serverSource.includes("errorHandler"),
  serverMountsNotFound: serverSource.includes("app.use(notFound)"),
  serverMountsErrorHandler: serverSource.includes("app.use(errorHandler)"),
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
writeFileSync("reports/api-error-handling-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/api-error-handling-check.md",
  [
    "# API Error Handling Check",
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

console.log(`[api-errors:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
