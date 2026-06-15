# CI/CD and Release

## GitHub Actions Workflows

### ci.yml
Runs on every push/PR:
- Lint check
- API tests (with PostgreSQL + Redis)
- Shared package tests
- Web app tests
- TypeScript type check

### desktop-build.yml
Runs on version tags:
- Builds for macOS, Windows, Linux
- Uploads artifacts

### web-deploy.yml
Runs on main branch web changes:
- Builds Next.js app
- Deploys to Vercel

### api-deploy.yml
Runs on main branch API changes:
- Builds API server
- Deploys to Railway

### release.yml
Runs on version tags:
- Generates changelog
- Creates GitHub release
- Attaches desktop binaries

## Scripts

### version-bump.ts
```bash
npx tsx scripts/version-bump.ts [patch|minor|major]
```

### changelog.ts
```bash
npx tsx scripts/changelog.ts
```

## Release Checklist
1. Run tests locally
2. Bump version: `npx tsx scripts/version-bump.ts minor`
3. Generate changelog: `npx tsx scripts/changelog.ts`
4. Commit and tag: `git commit && git tag vX.Y.Z`
5. Push: `git push && git push --tags`
6. GitHub Actions handles the rest
