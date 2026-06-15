# RemoteDesk API Examples

## Base URL
```
Production: https://api.remotedesk.io/v1
Staging:    https://api-staging.remotedesk.io/v1
```

## Authentication
```bash
# Login
curl -X POST https://api.remotedesk.io/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

# Response: {"token":"jwt_token","deskId":"123456789"}

# Use token
curl -H "Authorization: Bearer jwt_token" \
  https://api.remotedesk.io/v1/sessions
```

## Sessions
```bash
# List sessions
curl -H "Authorization: Bearer $TOKEN" \
  https://api.remotedesk.io/v1/sessions

# Get session by desk ID
curl -H "Authorization: Bearer $TOKEN" \
  https://api.remotedesk.io/v1/sessions/123456789

# End session
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
  https://api.remotedesk.io/v1/sessions/123456789
```

## Devices
```bash
# List devices
curl -H "Authorization: Bearer $TOKEN" \
  https://api.remotedesk.io/v1/devices

# Trust device
curl -X POST -H "Authorization: Bearer $TOKEN" \
  https://api.remotedesk.io/v1/devices/abc123/trust

# Remove device
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
  https://api.remotedesk.io/v1/devices/abc123
```

## Audit Logs
```bash
# Query audit logs (admin only)
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.remotedesk.io/v1/audit?start=2026-01-01&end=2026-06-30"

# Export as CSV
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.remotedesk.io/v1/audit/export?format=csv"
```

## Webhooks
```bash
# Register webhook
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/webhook","events":["session.started"]}' \
  https://api.remotedesk.io/v1/webhooks

# List webhooks
curl -H "Authorization: Bearer $TOKEN" \
  https://api.remotedesk.io/v1/webhooks
```

## Error Handling
```json
{
  "error": {
    "code": "RD_E002",
    "message": "Desk ID must be 9 digits",
    "details": {
      "field": "deskId",
      "value": "invalid"
    }
  }
}
```
