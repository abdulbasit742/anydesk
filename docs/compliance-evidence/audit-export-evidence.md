# Audit Export Evidence

## Export Capabilities
| Format | Use Case | Size Limit |
|--------|----------|------------|
| JSON | API integration | No limit |
| CSV | Spreadsheet analysis | 1M rows |
| PDF | Compliance reports | 100 pages |
| CEF | SIEM import | No limit |

## Export API
```
GET /api/v1/audit/export?format=json&start=2026-01-01&end=2026-06-30
GET /api/v1/audit/export?format=csv&eventType=session.started
GET /api/v1/audit/export?format=pdf&userId=abc123
```

## Tamper Protection
- Audit logs are append-only
- Each entry has hash chain
- Export includes integrity signature
- Verification endpoint available

## Sample Export (JSON)
```json
{
  "export_metadata": {
    "generated_at": "2026-06-12T10:00:00Z",
    "hash": "sha256:abc123...",
    "record_count": 15432
  },
  "entries": [
    {
      "id": "log_001",
      "timestamp": "2026-06-01T09:00:00Z",
      "action": "session.started",
      "user_id": "user_123",
      "ip": "203.0.113.1",
      "hash": "sha256:def456..."
    }
  ]
}
```
