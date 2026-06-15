# Error Monitoring

## Tools
- Sentry for error tracking
- Datadog for APM
- PagerDuty for alerting

## Alert Rules
| Condition | Severity | Action |
|-----------|----------|--------|
| 5 errors/min | Warning | Slack |
| 20 errors/min | Critical | Page |
| New error type | Info | Log |

## Error Grouping
Group by: stack trace, error message, URL
