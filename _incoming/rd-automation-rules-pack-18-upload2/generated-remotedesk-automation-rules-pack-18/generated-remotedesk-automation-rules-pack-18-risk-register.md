| Risk | Severity | Mitigation |
| --- | --- | --- |
| Unsafe automation action | Critical | strict allowlist and CI scanner |
| Cross-team automation leak | Critical | team-scoped repositories |
| Notification storm | High | rule-level rate limits |
| Duplicate event execution | High | idempotency and event dedup |
| Approval bypass | High | server-side approval gates |
