# RemoteDesk Security Guide

## Account Security
### Strong Password
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- Use a unique password
- Change periodically

### Two-Factor Authentication (2FA)
1. Go to Security Settings
2. Click "Enable 2FA"
3. Scan QR code with authenticator app
4. Enter verification code
5. Save backup codes

### Session Management
- Review active sessions regularly
- Revoke unknown sessions
- All sessions end on password change

## Connection Security
### Encryption
- All sessions use DTLS/SRTP
- End-to-end encrypted
- No man-in-the-middle possible

### Permissions
- Grant minimum necessary permissions
- Disable remote control if not needed
- Block file transfer for sensitive work
- Turn off clipboard sync when not needed

### Best Practices
- Verify who is connecting
- Use the waiting room feature
- Lock your screen when away
- Disconnect when done

## Data Handling
### File Transfers
- Scanned for dangerous extensions
- Size limits enforced
- Audit logged

### Clipboard
- Optional feature, disabled by default
- Secret detection enabled
- No passwords or keys synced

### Recording
- Requires consent from both parties
- Recording indicator visible
- Encrypted storage
- Configurable retention

## Incident Response
If you suspect unauthorized access:
1. Change your password immediately
2. Revoke all sessions
3. Enable 2FA if not already
4. Contact support

## Compliance
- GDPR compliant
- HIPAA ready (Enterprise)
- SOC2 Type II (Enterprise)
- Audit logs available
