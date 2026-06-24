#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const routePath = join(root, "apps", "api", "src", "routes", "connector.routes.ts");
const libPath = join(root, "apps", "api", "src", "lib", "connectorCatalog.ts");
const asyncCheckPath = join(root, "scripts", "check-async-route-handlers.mjs");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const routeSource = read(routePath);
const libSource = read(libPath);
const asyncCheckSource = read(asyncCheckPath);

const checks = {
  routeFileExists: existsSync(routePath),
  libFileExists: existsSync(libPath),
  routeUsesAuth: routeSource.includes("router.use(requireAuth)"),
  routeUsesAsyncHandler: routeSource.includes("../middleware/asyncHandler.js"),
  connectorKeyParamsBounded: routeSource.includes("key: z.string().min(2).max(50)"),
  auditQuerySchemaExists: routeSource.includes("const auditQuerySchema"),
  auditLimitCoerced: routeSource.includes("z.coerce.number()"),
  auditLimitHardCapped: routeSource.includes(".min(1).max(100)"),
  auditQueryValidated: routeSource.includes("auditQuerySchema.safeParse(req.query)"),
  auditPassesLimitToLib: routeSource.includes("listConnectorAuditEvents(req.user!.id, { limit: input.data.limit })"),
  auditReturnsMetaLimit: routeSource.includes("meta: { limit: input.data.limit ?? 50 }"),
  libDefinesDefaultLimit: libSource.includes("CONNECTOR_AUDIT_DEFAULT_LIMIT") && libSource.includes("50"),
  libDefinesMaxLimit: libSource.includes("CONNECTOR_AUDIT_MAX_LIMIT") && libSource.includes("100"),
  libClampsLimit: libSource.includes("function clampConnectorAuditLimit") && libSource.includes("Math.min") && libSource.includes("Math.max"),
  libUsesClampedTake: libSource.includes("take: clampConnectorAuditLimit(options.limit)"),
  libHasSeedPromiseCache: libSource.includes("connectorCatalogSeedPromise") && libSource.includes("Promise<void> | null"),
  libHasDedicatedSeedFunction: libSource.includes("function seedDefaultConnectorCatalog"),
  libUsesNullishAssignmentForSeed: libSource.includes("connectorCatalogSeedPromise ??="),
  libResetsSeedPromiseOnFailure: libSource.includes("connectorCatalogSeedPromise = null") && libSource.includes("throw error"),
  asyncCheckerCoversConnectors: asyncCheckSource.includes("connector.routes.ts") && asyncCheckSource.includes("connectorAuditWrapped"),
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
writeFileSync("reports/connector-routes-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/connector-routes-check.md",
  [
    "# Connector Routes Check",
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

console.log(`[connectors:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
