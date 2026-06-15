import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const root = process.argv[2] ?? ".";
const bad = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (/remote_shell|execute_native_input|run_command|unattended/i.test(readFileSync(path, "utf8"))) bad.push(path);
  }
}
walk(root);
if (bad.length) { console.error("Dangerous device command terms found:", bad); process.exit(1); }
console.log("No dangerous device command terms found.");
