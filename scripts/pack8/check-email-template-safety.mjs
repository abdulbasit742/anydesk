import { readFileSync, readdirSync, statSync } from "node:fs"; import { join } from "node:path";
const root = process.argv[2] ?? "."; const bad = [];
function walk(dir){ for(const entry of readdirSync(dir)){ const path=join(dir,entry); const stat=statSync(path); if(stat.isDirectory()) walk(path); else if(/email.*template/i.test(path)){ const text=readFileSync(path,"utf8"); if(/<script|javascript:|{{\s*(token|password|secret|clipboard)\s*}}/i.test(text)) bad.push(path); } } }
walk(root); if(bad.length){ console.error("Unsafe email template content:",bad); process.exit(1); } console.log("Email template safety scan passed.");
