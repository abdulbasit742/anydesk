# Log Format Specification

## Structured Logging (JSON)
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info",
  "service": "api",
  "requestId": "req_abc123",
  "message": "User authenticated",
  "meta": {
    "userId": "usr_001",
    "ip": "192.168.1.1",
    "durationMs": 45
  }
}
```

## Levels
| Level | Usage |
|-------|-------|
| error | System failures, exceptions |
| warn | Degraded service, retries |
| info | Business events, state changes |
| debug | Detailed diagnostics |

## Required Fields
- timestamp (ISO 8601)
- level
- service
- message

## Optional Fields
- requestId (correlation ID)
- userId
- organizationId
- durationMs
- error.code
- error.stack

## Redaction
The following fields are redacted in production:
- password, token, secret, authorization, cookie
- Use `logRedaction` helper before logging
