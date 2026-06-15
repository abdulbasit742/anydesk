import { readdir, readFile } from "node:fs/promises"; import { join } from "node:path";
async function walk(dir){ const out=[]; for(const entry of await readdir(dir,{withFileTypes:true})){ const path=join(dir,entry.name); if(entry.isDirectory()) out.push(...await walk(path)); else out.push(path); } return out; }
const files = await walk(process.argv[2] ?? process.cwd());
for (const file of files) { const text = await readFile(file, "utf8"); if (!text.trim()) throw new Error(`Empty file: ${file}`); if (/extraFile\d+/i.test(file)) throw new Error(`Filler file: ${file}`); }
console.log(`Verified ${files.length} non-empty files.`);
