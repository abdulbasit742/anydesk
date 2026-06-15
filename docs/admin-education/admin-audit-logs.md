# Admin Audit Logs Guide

## Accessing Audit Logs
- Admin Dashboard -> Audit Logs
- Or via API: GET /api/v1/audit

## Logged Events
| Category | Events |
|----------|--------|
| Authentication | login, logout, failed_login, mfa_trigger |
| User Management | user_created, user_deleted, role_changed |
| Session | session_started, session_ended, session_joined |
| Device | device_registered, device_trusted, device_revoked |
| Policy | policy_created, policy_updated, policy_deleted |
| Settings | setting_changed, sso_configured |
| Admin | admin_action, escalation, override |

## Searching Logs
- Date range picker
- User filter
- Event type filter
- Resource filter
- Free text search

## Export Options
| Format | Use Case | Retention |
|--------|----------|-----------|
| CSV | Spreadsheet analysis | 7 years |
| JSON | API integration | 7 years |
| PDF | Compliance report | 7 years |

## Alerting
Set up alerts for:
- Failed login attempts (> 5 in 1 hour)
- Admin actions (all)
- Policy changes
- Bulk user operations
- After-hours access

## Compliance
- Logs are tamper-evident
- Append-only storage
- Integrity verification available
- 7-year retention (enterprise)
- Exportable for auditors
