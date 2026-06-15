# RemoteDesk Log Redaction

## Fields to Redact
| Field | Reason | Redaction Method |
|-------|--------|-----------------|
| password | Sensitive | Replace with [REDACTED] |
| token | Sensitive | Replace with [TOKEN] |
| credit_card | PII | Replace with ****-****-****-XXXX |
| ssn | PII | Replace with XXX-XX-XXXX |
| email | PII | Hash with HMAC-SHA256 |
| desk_id | Partial PII | Mask as ***-***-XXXX |
| ip_address | PII | Anonymize (remove last octet) |

## Implementation
```typescript
const REDACTED_FIELDS = ["password", "token", "secret", "apiKey"];

function redact(obj: Record<string, unknown>): Record<string, unknown> {
  const result = { ...obj };
  for (const key of REDACTED_FIELDS) {
    if (key in result) result[key] = "[REDACTED]";
  }
  return result;
}

// In logger
logger.info("User login", redact({ email: user.email, password: req.body.password }));
// Output: { email: "user@example.com", password: "[REDACTED]" }
```

## Audit Exception
Audit logs contain actual values (required for forensics) but are stored
in a separate, access-controlled system with stricter retention.
