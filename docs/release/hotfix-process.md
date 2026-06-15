# RemoteDesk Hotfix Process

## When to Hotfix
- Security vulnerability (critical)
- Data loss bug
- Service outage
- Compliance violation

## Process

### 1. Triage (5 minutes)
- Identify severity
- Determine if hotfix needed
- Assign owner

### 2. Fix (30 minutes - 2 hours)
```bash
# Create hotfix branch
git checkout -b hotfix/description v${CURRENT_RELEASE}

# Make fix
# Write test
# Commit
git commit -m \"fix: description\"
```

### 3. Review (15 minutes)
- PR review ( expedited )
- CI passes
- Minimal approval (1 senior engineer)

### 4. Deploy (15 minutes)
```bash
# Build
npm run build

# Deploy to staging
npm run deploy:staging

# Quick smoke test
npm run test:smoke

# Deploy to production
npm run deploy:production
```

### 5. Verify (15 minutes)
- Monitor error rates
- Verify fix
- Check related features

### 6. Follow-up
- Tag release: v${VERSION}-hotfix.1
- Update CHANGELOG
- Merge to main
- Post-mortem if needed

## Communication
| Time | Action |
|------|--------|
| T+0 | Incident declared |
| T+15 | Status page updated |
| T+fix | Fix deployed |
| T+verify | All clear announced |
| T+24h | Post-mortem published |

## Bypass Rules
- Hotfixes can skip non-critical CI checks
- Single approval sufficient
- No feature freeze needed
- Can deploy during freeze
