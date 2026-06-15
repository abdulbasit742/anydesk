# Data Retention Policy

## Audit Logs
- Standard events: 90 days
- Security events: 365 days
- Billing events: 7 years
- Failed logins: 180 days

## Automatic Cleanup
- Daily cleanup job runs at 2 AM UTC
- Removes expired audit logs
- Preserves aggregated statistics

## User Data
- Retained while account is active
- 14-day grace period after deletion request
- Irreversible after grace period
