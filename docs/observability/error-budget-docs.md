# RemoteDesk Error Budget

## Error Budget Calculation
```
Error Budget = 100% - SLO Target

Example:
  API Availability SLO = 99.95%
  Error Budget = 0.05% per 30 days

  For 1M requests/month:
  Allowed failures = 1,000,000 x 0.0005 = 500 requests
```

## Budget Consumption Alerting
| Consumption | Status | Action |
|-------------|--------|--------|
| < 50% | Healthy | None |
| 50-75% | Warning | Review recent incidents |
| 75-100% | Critical | Freeze non-critical changes |
| > 100% | Breach | Incident response, SLO review |

## Error Budget Policy
1. When budget is exhausted, halt feature releases
2. Prioritize reliability work
3. SRE and Product agree on exemption process
4. Post-mortem required for budget breach
5. SLO review if > 2 breaches per quarter

## Dashboard
Track at: https://grafana.remotedesk.io/d/error-budget

## Quarterly Review
| Quarter | API Budget | Consumed | Status |
|---------|-----------|----------|--------|
| Q1 2026 | 0.05% | 0.02% | Healthy |
| Q2 2026 | 0.05% | 0.08% | Breach |
