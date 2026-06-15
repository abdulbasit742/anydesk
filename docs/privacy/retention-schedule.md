# Data Retention Schedule

## Active Retention
| Data Type | Retention Period | Trigger |
|-----------|-----------------|---------|
| User account | Until deletion request | Account closure |
| Device records | Account lifetime | Device removal |
| Session metadata | 90 days | Session end |
| Audit logs | 1 year | Event creation |
| Billing records | 7 years | Transaction date |

## Deletion Schedule
| Data Type | Deletion Timeframe |
|-----------|-------------------|
| Soft-deleted accounts | 30 days |
| Expired sessions | 7 days |
| Failed login attempts | 30 days |
| Email logs | 30 days |

## Data Deletion Procedures
See `docs/privacy/data-deletion-procedure.md`

## Exceptions
- Legal hold: Indefinite retention with legal team approval
- Backup restoration: 30-day retention in backups after deletion
