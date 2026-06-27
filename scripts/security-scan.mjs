#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules", "dist", "build", "coverage", ".next", "out", "reports", "docs"]);
const allowedExampleFiles = [/\.env\.example$/, /README\.md$/, /^docs\//, /test/i, /fixture/i];

const patterns = [
  { id: "private-key", severity: "P0", regex: /-----BEGIN (?:OPENSSH |RSA |EC |DSA |)?PRIVATE KEY-----/i },
  { id: "bearer-token", severity: "P0", regex: /Authorization\s*:\s*Bearer\s+[A-Za-z0-9._~+\/-]{24,}/i },
  { id: "jwt-secret", severity: "P0", regex: /JWT_SECRET\s*=\s*(?!replace|change|dev|test|fake|example)[^\s#]+/i },
  { id: "service-role", severity: "P0", regex: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(?!replace|change|dev|test|fake|example)[^\s#]+/i },
  { id: "engine-webhook-secret", severity: "P0", regex: /ENGINE_WEBHOOK_SIGNING_SECRET\s*=\s*(?!replace|change|dev|test|fake|example)[^\s#]+/i },
  { id: "dashboard-engine-secret", severity: "P0", regex: /DASHBOARD_ENGINE_SIGNING_SECRET\s*=\s*(?!replace|change|dev|test|fake|example)[^\s#]+/i },
  { id: "turn-credential", severity: "P1", regex: /WEBRTC_TURN_CREDENTIAL\s*=\s*(?!replace|change|dev|test|fake|example)[^\s#]+/i },
  { id: "device-token-field", severity: "P1", regex: /device[_-]?token\s*[:=]\s*["'][A-Za-z0-9._~+\/-]{16,}["']/i },
  { id: "session-token-field", severity: "P1", regex: /session[_-]?token\s*[:=]\s*["'][A-Za-z0-9._~+\/-]{16,}["']/i },
  { id: "github-token", severity: "P0", regex: /(?:ghp|github_pat)_[A-Za-z0-9_]{20,}/ }
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;
    const path = join(dir, entry);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, files);
    else if (st.isFile()) files.push(path);
  }
  return files;
}

function isAllowedContext(path) {
  const rel = relative(root, path).replaceAll("\\", "/");
  return allowedExampleFiles.some((rule) => rule.test(rel));
}

const findings = [];
for (const file of walk(root)) {
  const rel = relative(root, file).replaceAll("\\", "/");
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const pattern of patterns) {
      if (pattern.regex.test(line)) {
        const allowed = 
          (isAllowedContext(file) && /replace|change|dev|test|fake|example|placeholder|redacted/i.test(line)) ||
          /\$\{.*\}/.test(line) ||
          /\$\(.*\)/.test(line);
        findings.push({
          id: pattern.id,
          severity: pattern.severity,
          file: rel,
          line: i + 1,
          allowed,
          preview: line.slice(0, 160).replace(/([A-Za-z0-9._~+\/-]{12})[A-Za-z0-9._~+\/-]{8,}/g, "$1...[REDACTED]")
        });
      }
    }
  }
}

const blocking = findings.filter((item) => !item.allowed && item.severity === "P0");
const status = blocking.length > 0 ? "FAIL" : "PASS";
const report = { repo: "abdulbasit742/anydesk", generatedAt: new Date().toISOString(), status, findings };

mkdirSync("reports", { recursive: true });
writeFileSync("reports/security-scan.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/security-scan.md",
  [
    "# RemoteDesk Engine Security Scan",
    "",
    `Status: **${status}**`,
    `Findings: **${findings.length}**`,
    `Blocking P0 findings: **${blocking.length}**`,
    "",
    "| Severity | Pattern | File | Line | Allowed | Preview |",
    "|---|---|---|---:|---:|---|",
    ...findings.map((f) => `| ${f.severity} | ${f.id} | ${f.file} | ${f.line} | ${f.allowed ? "yes" : "no"} | ${f.preview.replaceAll("|", "\\|")} |`),
    "",
    "Secret values are redacted in this report."
  ].join("\n")
);

console.log(`[security:scan] ${status} - ${findings.length} findings, ${blocking.length} blocking P0`);
if (status === "FAIL") process.exit(1);
