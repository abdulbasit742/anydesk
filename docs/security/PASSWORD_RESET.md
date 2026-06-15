# Password Reset Token Flow

## Overview
Secure password reset using time-limited tokens.

## Flow
1. User requests password reset via email
2. System generates cryptographically secure token
3. Token stored hashed in database with expiry
4. Reset link emailed to user
5. User clicks link, token verified
6. Password updated, token invalidated

## Token Properties
- Format: Base64URL, 32 bytes random
- Expiry: 1 hour
- Single use only
- Hashed storage (SHA-256)

## Security Measures
- Rate limit: 3 requests per hour per email
- Token not returned in API responses
- Old password not required for reset
- All sessions invalidated on reset
- Audit log entry created

## Implementation
```
POST /auth/password-reset-request  { email }
POST /auth/password-reset-verify   { token, newPassword }
```

## Edge Cases
- Multiple requests: invalidate previous tokens
- Expired token: require new request
- Used token: clear and error
- Non-existent email: silent success (no enumeration)
