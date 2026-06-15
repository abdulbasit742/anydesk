# Data Retention Evidence

## Retention Schedule
| Data Type | Retention Period | Trigger | Action |
|-----------|-----------------|---------|--------|
| User profile | Account lifetime + 30 days | Account deletion | Anonymize |
| Session metadata | 1 year | Session end | Archive |
| Session recordings | 90 days (if enabled) | Recording end | Delete |
| Audit logs | 7 years | Creation | Archive |
| Chat messages | 90 days | Message sent | Delete |
| File transfers | 30 days | Transfer complete | Delete |
| Clipboard history | Never stored | N/A | Not collected |
| Debug logs | 30 days | Log creation | Delete |
| Error logs | 1 year | Log creation | Archive |
| Backups | 30 days | Backup creation | Delete old |

## Automated Enforcement
```typescript
// Runs daily via cron
async function enforceRetention() {
  await deleteOldSessionRecordings(90);
  await archiveOldAuditLogs(7 * 365);
  await anonymizeDeletedUsers(30);
  await deleteOldFileTransfers(30);
  await deleteOldChatMessages(90);
}
```

## Evidence
- [x] Retention policy documented and approved
- [x] Automated jobs running daily
- [x] Last execution: 2026-06-11 02:00 UTC
- [x] Zero retention violations in Q2 2026
