import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".";
const out = process.argv[3] ?? "generated-file-list.txt";
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(root);
writeFileSync(out, files.sort().join("\n") + "\n");
console.log(`Wrote ${files.length} files to ${out}`);
