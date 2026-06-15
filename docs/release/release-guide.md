# Release Guide

## Versioning
We follow [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

## Release Steps
1. Update version in root `package.json`
2. Run full test suite: `npm run test`
3. Update `CHANGELOG.md`
4. Create git tag: `git tag -a v1.2.3 -m "Release v1.2.3"`
5. Push tag: `git push origin v1.2.3`
6. CI builds artifacts and creates GitHub release

## Artifacts
- Web: `.next/` static build
- API: Docker image `remotedesk/api:v1.2.3`
- Desktop: `.dmg`, `.exe`, `.AppImage`

## Post-Release
- Deploy to staging
- Run smoke tests
- Deploy to production
- Monitor error rates for 24h
