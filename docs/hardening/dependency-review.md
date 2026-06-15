# Dependency Review

## Tools
- `npm audit` - Built-in audit
- Dependabot - Automated PRs
- Snyk - Advanced scanning
- OWASP Dependency Check

## Process
1. Weekly: Run `npm audit`
2. On PR: Automated dependency scan
3. Monthly: Full dependency review
4. Quarterly: License compliance review

## Criteria for Update
- **Critical CVE**: Fix within 24 hours
- **High CVE**: Fix within 7 days
- **Medium CVE**: Fix within 30 days
- **Low CVE**: Next scheduled update

## Prohibited Dependencies
- Packages with known critical vulnerabilities (unpatched)
- Packages with incompatible licenses
- Unmaintained packages (no updates in 1 year)

## Approval Process
- Patch updates: Auto-merge if tests pass
- Minor updates: 1 approval
- Major updates: 2 approvals + manual QA
