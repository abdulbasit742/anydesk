#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const strict = process.argv.includes("--strict") || process.env.VALIDATE_ENV_STRICT === "1" || process.env.CI === "true";

const envSpec = [
  { name: "DATABASE_URL", required: true, serverOnly: true, description: "Postgres/Prisma database connection string" },
  { name: "JWT_SECRET", required: true, serverOnly: true, description: "Access-token signing secret" },
  { name: "JWT_REFRESH_SECRET", required: true, serverOnly: true, description: "Refresh-token signing secret" },
  { name: "ENGINE_ID", required: false, serverOnly: true, description: "Stable engine identifier for webhooks/events" },
  { name: "DASHBOARD_ENGINE_SIGNING_SECRET", required: false, serverOnly: true, description: "HMAC secret for dashboard-to-engine signed requests" },
  { name: "ENGINE_WEBHOOK_SIGNING_SECRET", required: false, serverOnly: true, description: "HMAC secret for engine-to-dashboard webhooks" },
  { name: "DASHBOARD_ENGINE_WEBHOOK_URL", required: false, serverOnly: true, description: "Dashboard endpoint that receives engine webhooks" },
  { name: "CORS_ORIGIN", required: false, serverOnly: false, description: "Comma-separated allowed web origins" },
  { name: "WEBRTC_STUN_URLS", required: false, serverOnly: false, description: "Comma-separated STUN URLs" },
  { name: "WEBRTC_TURN_URLS", required: false, serverOnly: true, description: "Comma-separated TURN URLs" },
  { name: "WEBRTC_TURN_USERNAME", required: false, serverOnly: true, description: "TURN username" },
  { name: "WEBRTC_TURN_CREDENTIAL", required: false, serverOnly: true, description: "TURN credential/password" },
  { name: "RELEASE_MANIFEST_URL", required: false, serverOnly: false, description: "Client release manifest URL" }
];

const publicPrefixes = ["VITE_", "NEXT_PUBLIC_", "PUBLIC_"];
const results = envSpec.map((item) => {
  const present = Boolean(process.env[item.name]);
  const publicLike = publicPrefixes.some((prefix) => item.name.startsWith(prefix));
  const invalidPublicSecret = item.serverOnly && publicLike;
  const status = item.required && !present ? "missing" : invalidPublicSecret ? "invalid_public_secret_name" : "ok";
  return { ...item, present, status };
});

const missing = results.filter((item) => item.status === "missing");
const invalid = results.filter((item) => item.status === "invalid_public_secret_name");
const status = strict && (missing.length > 0 || invalid.length > 0) ? "FAIL" : missing.length > 0 || invalid.length > 0 ? "WARN" : "PASS";

const report = {
  repo: "abdulbasit742/anydesk",
  generatedAt: new Date().toISOString(),
  strict,
  status,
  results: results.map(({ name, required, serverOnly, description, present, status }) => ({
    name,
    required,
    serverOnly,
    description,
    present,
    status
  }))
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/env-validation.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/env-validation.md",
  [
    "# RemoteDesk Engine Environment Validation",
    "",
    `Status: **${status}**`,
    `Strict mode: **${strict ? "yes" : "no"}**`,
    "",
    "| Variable | Required | Server-only | Present | Status |",
    "|---|---:|---:|---:|---|",
    ...report.results.map((item) => `| ${item.name} | ${item.required ? "yes" : "no"} | ${item.serverOnly ? "yes" : "no"} | ${item.present ? "yes" : "no"} | ${item.status} |`),
    "",
    "No environment values are printed by this report."
  ].join("\n")
);

console.log(`[env:validate] ${status} - ${missing.length} missing, ${invalid.length} invalid public-secret names`);
if (status === "FAIL") process.exit(1);
