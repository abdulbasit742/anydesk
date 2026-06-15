# Trusted Devices

## Overview
Trusted devices allow users to skip 2FA on recognized devices for 30 days.

## Security Model
- Devices identified by fingerprint (hash of user agent + screen + plugins)
- Token stored in httpOnly cookie
- Auto-expires after 30 days
- Can be revoked from Security Center

## Revocation
- Immediate effect
- Audit logged
- Requires re-authentication with 2FA
