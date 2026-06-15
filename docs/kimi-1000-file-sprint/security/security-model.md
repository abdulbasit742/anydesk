# RemoteDesk Security Model

## Core Principles

1. **Defense in depth**: Multiple security layers
2. **Least privilege**: Minimum permissions required
3. **Explicit consent**: Host must approve all sensitive actions
4. **Audit everything**: All security events logged
5. **Fail closed**: Security features disabled by default

## Permission System

### Default States

| Permission | Default |
|------------|---------|
| Remote Input | Not requested |
| Clipboard Sync | Not requested |
| File Transfer | Not requested |
| Session Recording | Not requested |
| Unattended Access | Denied |
| Chat | Granted |

### Dangerous Permissions

- Remote Input: Full mouse/keyboard control
- Unattended Access: Connect without host present
- Session Recording: Captures all activity

## Authentication

- JWT access tokens (7-day expiry)
- Refresh tokens (30-day expiry)
- Login attempt throttling (5 attempts / 15min)
- Account lockout (30min)
- Optional TOTP 2FA

## Input Security

- Dry-run mode if native input unavailable
- Dangerous shortcut blocking
- Coordinate validation (clamped 0-1)
- Input event validation before execution

## File Transfer Security

- Incoming file consent required
- Filename sanitization
- Max file size enforced (2GB)
- Chunk-level integrity checking

## Audit Logging

All events logged:
- Login attempts (success/failure)
- Permission grants/revocations
- Session start/end
- Device registration
- Billing changes
- Admin actions
