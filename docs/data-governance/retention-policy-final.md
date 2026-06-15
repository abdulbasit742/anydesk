# RemoteDesk Data Retention Policy (Final)

## Retention Schedule
| Data Type | Active Retention | Archive | Total | Trigger |
|-----------|-----------------|---------|-------|---------|
| User profile | Account + 30d | - | Account + 30d | Deletion |
| Session metadata | 1 year | - | 1 year | Session end |
| Session recordings | 90 days | - | 90 days | Recording end |
| Audit logs | 7 years | Glacier | 7 years | Creation |
| Chat messages | 90 days | - | 90 days | Sent |
| File transfers | 30 days | - | 30 days | Complete |
| Device records | Account + 30d | - | Account + 30d | Deletion |
| Failed login attempts | 90 days | - | 90 days | Attempt |
| API logs | 30 days | - | 30 days | Request |
| Error logs | 1 year | - | 1 year | Occurrence |
| Backup data | 30 days | - | 30 days | Creation |

## Special Cases

### Legal Hold
When legal hold is active:
- All relevant data preserved
- Overrides normal retention
- Marked in system with hold ID
- Released only by legal team

### GDPR Right to Erasure
1. User requests deletion
2. Verify identity
3. Mark account for deletion
4. Anonymize or delete all PII within 30 days
5. Retain audit trail of deletion
6. Confirm completion

### Contractual Retention
Enterprise customers may specify:
- Longer retention periods
- Specific data to retain
- Deletion procedures
- Certificate of destruction

## Enforcement
- Automated daily cleanup jobs
- Quarterly compliance audits
- Retention exceptions logged
- Breach alerts for violations

## Policy Review
- Annual review required
- After data incidents
- When regulations change
- When contracts change
