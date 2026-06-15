# Release Checklist

## Pre-release
- [ ] All tests passing
- [ ] TypeScript type check clean
- [ ] Lint clean
- [ ] Changelog updated
- [ ] Version bumped
- [ ] API docs updated

## Release
- [ ] Commit: `chore(release): vX.Y.Z`
- [ ] Tag: `git tag vX.Y.Z`
- [ ] Push: `git push origin main --tags`
- [ ] Verify CI passes
- [ ] Verify deployments

## Post-release
- [ ] Verify production health
- [ ] Verify web app loads
- [ ] Verify desktop downloads work
- [ ] Announce in Slack
- [ ] Monitor error rates

## Hotfix Process
1. Branch from tag: `git checkout -b hotfix/vX.Y.Z+1 vX.Y.Z`
2. Fix and test
3. Bump patch version
4. Tag and deploy
