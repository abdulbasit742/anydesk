# Admin Audit Guide

## Audit Log Access
Admin > Audit Logs

### What is Logged
- User logins/logouts
- Session start/end
- Device registration/removal
- Organization changes
- Policy changes
- Billing changes
- Admin actions

### Log Format
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "action": "SESSION_STARTED",
  "user": "user@example.com",
  "ip": "192.168.1.1",
  "details": { "deviceId": "123456789" }
}
```

### Filtering
- Date range
- User
- Action type
- Organization
- IP address

### Export
- CSV export (up to 10,000 rows)
- JSON export (full)
- Scheduled exports (daily/weekly)

### Retention
- Active logs: 1 year
- Archived logs: 3 years (cold storage)
- Legal hold: Indefinite

## Compliance
Audit logs are immutable.
Tampering detection is enabled.
Export logs for compliance audits.
