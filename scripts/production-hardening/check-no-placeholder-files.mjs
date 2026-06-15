import { readdirSync, readFileSync, statSync } from "node:fs";
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
      if (/extraFile\d+|TODO:\s*implement later|placeholder-only|dummy constant/i.test(text + path)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) {
  console.error("Placeholder-like files found:", bad);
  process.exit(1);
}
console.log("No placeholder-like files found.");
