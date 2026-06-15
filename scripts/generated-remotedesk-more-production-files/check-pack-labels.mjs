import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? 'generated-remotedesk-more-production-files';
const allowed = new Set(['SAFE_DIRECT_COPY', 'REVIEW_REQUIRED', 'PATCHES']);
const entries = readdirSync(root).filter((entry) => statSync(join(root, entry)).isDirectory());
const invalid = entries.filter((entry) => !allowed.has(entry));
if (invalid.length) {
  console.error(`Unexpected top-level directories: ${invalid.join(', ')}`);
  process.exit(1);
}
console.log('Pack labels look valid.');
