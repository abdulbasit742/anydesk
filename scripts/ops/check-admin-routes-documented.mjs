import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? "REVIEW_REQUIRED/apps/api/src/ops";
const missing = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (path.endsWith("Routes.ts")) {
      const text = readFileSync(path, "utf8");
      if (!text.includes("requireAdminRole")) missing.push(path);
    }
  }
}
walk(root);
if (missing.length) {
  console.error("Ops routes missing admin guard:", missing);
  process.exit(1);
}
console.log("All ops route files include admin guard.");
