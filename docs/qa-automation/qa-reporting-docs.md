# QA Reporting Documentation

## Daily Report Template
```markdown
# QA Daily Report - YYYY-MM-DD

## Test Execution
| Suite | Passed | Failed | Skipped | Coverage |
|-------|--------|--------|---------|----------|
| Smoke | 45 | 0 | 0 | 100% |
| Regression | 85 | 2 | 3 | 95% |
| Desktop | 30 | 1 | 0 | 97% |
| Web | 25 | 0 | 0 | 100% |
| API | 40 | 0 | 0 | 100% |
| Socket | 20 | 1 | 0 | 95% |

## Failures
| Test | Severity | Owner | Status |
|------|----------|-------|--------|
| REG-042 | Medium | @dev-team | Investigating |

## Environment
- Branch: main
- Commit: abc1234
- Deployment: staging-20240612

## Sign-off
- [ ] QA Lead
- [ ] Release Manager
```

## Release Report Template
```markdown
# QA Release Report - vX.Y.Z

## Scope
Features: List
Bug fixes: List

## Test Results
Total tests: N
Passed: N (X%)
Failed: N
Blocked: N

## Known Issues
| Issue | Severity | Workaround |
|-------|----------|------------|

## Recommendation
[ ] Ready for production
[ ] Not ready - issues found
```
