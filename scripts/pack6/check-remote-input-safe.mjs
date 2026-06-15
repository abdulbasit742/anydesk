import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const root = process.argv[2] ?? ".";
const bad = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (/remoteInputEnabled:\s*true|nativeInputEnabled:\s*true/i.test(readFileSync(path, "utf8"))) bad.push(path);
  }
}
walk(root);
if (bad.length) { console.error("Unsafe remote input default found:", bad); process.exit(1); }
console.log("Remote input defaults remain safe.");
