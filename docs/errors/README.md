# API Error System

## Error Code Registry
Centralized error codes with:
- Machine-readable code
- HTTP status code
- Internal message (for logs)
- User-safe message (for UI)
- Retryable flag

## Categories
- `auth` - Authentication/authorization
- `validation` - Input validation
- `connection` - Remote connections
- `webrtc` - WebRTC errors
- `billing` - Subscription/payment
- `permission` - Access control
- `rate-limit` - Throttling
- `internal` - Server errors

## Response Format
```json
{
  "success": false,
  "error": {
    "code": "AUTH_UNAUTHORIZED",
    "category": "auth",
    "message": "Unauthorized",
    "userMessage": "Please log in to continue.",
    "retryable": false,
    "requestId": "req_123",
    "timestamp": "2026-01-01T00:00:00Z"
  }
}
```

## Sanitization
All user-facing messages are sanitized to remove:
- Email addresses
- IP addresses
- UUIDs
- File paths
- Credential patterns
