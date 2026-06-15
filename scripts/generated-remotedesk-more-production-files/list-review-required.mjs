import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
function walk(dir) { return readdirSync(dir).flatMap((entry) => { const path = join(dir, entry); return statSync(path).isDirectory() ? walk(path) : [path]; }); }
const root = process.argv[2] ?? 'generated-remotedesk-more-production-files/REVIEW_REQUIRED';
for (const file of walk(root)) console.log(file);
