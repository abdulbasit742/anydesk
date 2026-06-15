import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const root = process.argv[2] ?? '.'; const bad = [];
function walk(dir){ for(const e of readdirSync(dir)){ const p=join(dir,e); const s=statSync(p); if(s.isDirectory()) walk(p); else { const t=readFileSync(p,'utf8'); if(/extraFile\d+|dummy constant|TODO: implement later/i.test(t+p)) bad.push(p); } } }
walk(root); if(bad.length){ console.error(bad.join('
')); process.exit(1); } console.log('No placeholder files found');
