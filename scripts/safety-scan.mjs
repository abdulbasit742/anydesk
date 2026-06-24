#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules", "dist", "build", "coverage", "reports", "_incoming"]);
const allowedContextPatterns = [/\.md$/i, /test/i, /fixture/i, /generated-/i, /manifest\.json$/i];

const bannedRemoteInputPatterns = [
  { id: "robotjs", severity: "P0", regex: /\brobotjs\b/i },
  { id: "nut-tree", severity: "P0", regex: /\b(?:nut\.js|@nut-tree)\b/i },
  { id: "xdotool", severity: "P0", regex: /\bxdotool\b/i },
  { id: "sendinput", severity: "P0", regex: /\bSendInput\b/i },
  { id: "keybd-event", severity: "P0", regex: /\bkeybd_event\b/i },
  { id: "mouse-event", severity: "P0", regex: /\bmouse_event\b/i },
  { id: "osascript", severity: "P0", regex: /\bosascript\b/i },
  { id: "applescript", severity: "P0", regex: /\bAppleScript\b/i },
  { id: "powershell", severity: "P0", regex: /\bPowerShell\b|\bpowershell\.exe\b/i },
  { id: "child-process-exec", severity: "P1", regex: /child_process\.(?:exec|execFile|spawn)\b|from\s+["']node:child_process["']/i }
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

function rel(path) {
  return relative(root, path).replaceAll("\\", "/");
}

function isAllowedContext(filePath) {
  const file = rel(filePath);
  return allowedContextPatterns.some((pattern) => pattern.test(file));
}

const findings = [];
for (const file of walk(root)) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    for (const pattern of bannedRemoteInputPatterns) {
      if (pattern.regex.test(lines[i])) {
        findings.push({
          id: pattern.id,
          severity: pattern.severity,
          file: rel(file),
          line: i + 1,
          allowed: isAllowedContext(file),
          preview: lines[i].slice(0, 160)
        });
      }
    }
  }
}

const blocking = findings.filter((finding) => !finding.allowed && finding.severity === "P0");
const status = blocking.length > 0 ? "FAIL" : "PASS";
const report = { repo: "abdulbasit742/anydesk", generatedAt: new Date().toISOString(), status, findings };

mkdirSync("reports", { recursive: true });
writeFileSync("reports/safety-scan.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/safety-scan.md",
  [
    "# RemoteDesk Engine Safety Scan",
    "",
    `Status: **${status}**`,
    `Findings: **${findings.length}**`,
    `Blocking P0 findings: **${blocking.length}**`,
    "",
    "| Severity | Pattern | File | Line | Allowed | Preview |",
    "|---|---|---|---:|---:|---|",
    ...findings.map((f) => `| ${f.severity} | ${f.id} | ${f.file} | ${f.line} | ${f.allowed ? "yes" : "no"} | ${f.preview.replaceAll("|", "\\|")} |`),
    "",
    "This scan blocks unsafe OS-level remote-input APIs outside documented/test contexts."
  ].join("\n")
);

console.log(`[safety:scan] ${status} - ${findings.length} findings, ${blocking.length} blocking P0`);
if (status === "FAIL") process.exit(1);
