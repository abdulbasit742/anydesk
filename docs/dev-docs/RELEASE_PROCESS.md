# Release Process

## Version Numbering
Semantic Versioning: MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

## Release Cycle
- Patch releases: Weekly (if needed)
- Minor releases: Bi-weekly
- Major releases: Quarterly

## Release Steps

### 1. Prepare Release Branch
```bash
git checkout -b release/v1.2.0
```

### 2. Update Version
```bash
npm version minor
```

### 3. Update Changelog
- Add version header
- List all changes
- Credit contributors

### 4. Run Full Test Suite
```bash
npm run check
npm run test
npm run test:e2e
npm run build
```

### 5. Create PR
- Title: `Release v1.2.0`
- Tag: @release-managers
- Include changelog diff

### 6. After Merge
```bash
git checkout main
git pull
git tag v1.2.0
git push origin v1.2.0
```

### 7. GitHub Release
- CI creates draft release
- Add release notes
- Publish release

### 8. Deploy
- Staging: Auto-deploy
- Production: Manual approval

## Hotfix Process
For critical production bugs:

### 1. Create Hotfix Branch
```bash
git checkout -b hotfix/fix-description
```

### 2. Fix and Test
- Minimal change
- Targeted test
- Quick review

### 3. Merge and Deploy
- Merge to main
- Cherry-pick to release
- Deploy immediately

## Rollback
If release causes issues:
1. Stop deployment
2. Revert commit
3. Tag rollback version
4. Deploy previous version
5. Post-mortem within 48 hours
