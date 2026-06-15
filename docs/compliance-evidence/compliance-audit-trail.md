# Compliance Audit Trail

## What is Logged
- All authentication events
- All authorization decisions
- All data access (read, write, delete)
- All configuration changes
- All policy changes
- All admin actions

## Format
```json
{
  "timestamp": "ISO8601",
  "event_type": "auth.login|data.access|config.change|...",
  "actor": { "id": "...", "type": "user|system|api" },
  "resource": { "type": "session|user|device|...", "id": "..." },
  "action": "create|read|update|delete|execute",
  "result": "success|failure|denied",
  "context": { "ip": "...", "user_agent": "...", "location": "..." },
  "integrity_hash": "sha256:..."
}
```
