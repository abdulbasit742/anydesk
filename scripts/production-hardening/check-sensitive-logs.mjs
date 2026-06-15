import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".";
const findings = [];
const patterns = [/access_token=/i, /refresh_token=/i, /authorization:\s*bearer\s+[a-z0-9._-]+/i, /turnCredential=/i];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else {
      const text = readFileSync(path, "utf8");
      if (patterns.some((pattern) => pattern.test(text))) findings.push(path);
    }
  }
}
walk(root);
if (findings.length) {
  console.error("Potential sensitive log strings found:", findings);
  process.exit(1);
}
console.log("Sensitive log check passed.");
