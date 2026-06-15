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
      if (/rawPassword|rawToken|rawSecret|unescapedCsv/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("Report safety scanner findings:", bad); process.exit(1); }
console.log("Report safety scanner passed.");
