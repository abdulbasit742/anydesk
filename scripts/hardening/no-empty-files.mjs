import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const root = process.argv[2] ?? '.'; const empty = [];
function walk(dir){ for(const e of readdirSync(dir)){ const p=join(dir,e); const s=statSync(p); if(s.isDirectory()) walk(p); else if(!readFileSync(p,'utf8').trim()) empty.push(p); } }
walk(root); if(empty.length){ console.error(empty.join('
')); process.exit(1); } console.log('No empty files found');
