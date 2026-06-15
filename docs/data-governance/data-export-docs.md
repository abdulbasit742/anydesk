# RemoteDesk Data Export Documentation

## Export Types
| Type | Format | Contents | Time |
|------|--------|----------|------|
| Full export | ZIP (JSON) | All user data | 24h |
| Session history | CSV | Session metadata | Instant |
| Audit log | CSV/JSON | Audit events | 1h |
| Messages | JSON | Chat history | Instant |

## Self-Service Export
```
Settings -> Privacy -> Export My Data
```

## API Export
```bash
# Request export
POST /v1/user/export
Body: { "format": "json", "since": "2024-01-01" }

# Check status
GET /v1/user/export/:id

# Download
GET /v1/user/export/:id/download
```

## Export Contents (Full)
```json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "John",
    "created_at": "2024-01-15T10:00:00Z"
  },
  "sessions": [...],
  "devices": [...],
  "audit_logs": [...],
  "settings": {...},
  "metadata": {
    "exported_at": "2026-06-12T10:00:00Z",
    "format_version": "1.0"
  }
}
```

## Data Portability
Exports follow a standard schema for interoperability.
Can be imported into compatible systems.

## Security
- Exports encrypted with user-provided password
- Download link expires in 7 days
- Access logged in audit trail
- Admin exports require approval
