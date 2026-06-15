# RemoteDesk Enterprise Control Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| policy.inheritance | enum | "additive" | Child policy inheritance mode |
| approval.required | boolean | false | Require session approval |
| approval.timeout | number | 15 | Approval timeout (minutes) |
| compliance.checkInterval | number | 15 | Compliance check interval |
| compliance.gracePeriod | number | 24 | Non-compliance grace period (hours) |
| audit.retentionDays | number | 365 | Audit log retention |
| session.maxDuration | number | 480 | Max session duration (minutes) |
| session.recordByDefault | boolean | false | Auto-record sessions |
