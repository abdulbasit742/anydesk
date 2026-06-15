import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = "REVIEW_REQUIRED";
const output = process.argv[2] ?? "review-required-files.txt";
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
writeFileSync(output, files.sort().join("\n") + "\n");
console.log(`Wrote ${files.length} review-required files.`);
