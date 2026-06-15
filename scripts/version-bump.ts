import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

type BumpType = 'patch' | 'minor' | 'major';

function bumpVersion(current: string, type: BumpType): string {
  const [major, minor, patch] = current.split('.').map(Number);
  switch (type) {
    case 'major': return `${major + 1}.0.0`;
    case 'minor': return `${major}.${minor + 1}.0`;
    case 'patch': return `${major}.${minor}.${patch + 1}`;
  }
}

function updatePackageJson(dir: string, newVersion: string) {
  const path = join(dir, 'package.json');
  const pkg = JSON.parse(readFileSync(path, 'utf-8'));
  pkg.version = newVersion;
  writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated ${path} to ${newVersion}`);
}

function main() {
  const type = (process.argv[2] ?? 'patch') as BumpType;
  const rootPkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  const newVersion = bumpVersion(rootPkg.version, type);

  updatePackageJson('.', newVersion);
  updatePackageJson('apps/api', newVersion);
  updatePackageJson('apps/web', newVersion);
  updatePackageJson('apps/desktop', newVersion);
  updatePackageJson('packages/shared', newVersion);

  console.log(`\nBumped to ${newVersion}`);
  console.log('Run: git add . && git commit -m "chore(release): v' + newVersion + '" && git tag v' + newVersion);
}

main();
