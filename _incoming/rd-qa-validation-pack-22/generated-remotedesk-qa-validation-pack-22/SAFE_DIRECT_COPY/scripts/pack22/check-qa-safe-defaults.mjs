import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const root = process.argv[2] ?? ".";
const bad = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else {
      const text = readFileSync(path, "utf8");
      if (/remote_shell|execute_command|unattended|native_input_execute|rawPassword|rawToken|rawSecret/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("QA safe-default findings:", bad); process.exit(1); }
console.log("QA safe-default scanner passed.");
