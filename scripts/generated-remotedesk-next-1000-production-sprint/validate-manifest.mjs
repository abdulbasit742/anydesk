import { readFile } from "node:fs/promises";
const manifest = JSON.parse(await readFile(process.argv[2], "utf8"));
if (!manifest.actualFileCount) throw new Error("actualFileCount is missing");
console.log(JSON.stringify({ actualFileCount: manifest.actualFileCount, reviewRequiredCount: manifest.reviewRequiredCount }, null, 2));
