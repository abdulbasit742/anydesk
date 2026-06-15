# Two-Factor Authentication Setup

## Overview
RemoteDesk supports TOTP-based two-factor authentication using RFC 6238.

## Enabling 2FA
1. Navigate to Security Center > Two-Factor Authentication
2. Click "Set Up 2FA"
3. Scan QR code with authenticator app
4. Enter 6-digit verification code
5. Save backup codes securely

## Recovery
- Use backup codes if device is lost
- Each code can only be used once
- Regenerate codes from Security Center

## Disabling 2FA
- Requires current TOTP code
- Logs security audit event
- All trusted devices remain valid
