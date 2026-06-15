# Security Model

## Threat Model

### Assets
- User credentials and 2FA secrets
- Session data and recordings
- Payment information (handled by Stripe)
- Device access permissions

### Threats
- Unauthorized remote access
- Man-in-the-middle attacks
- Credential theft
- Session hijacking
- Insider threats

## Controls

### Authentication
- Password-based with bcrypt hashing
- TOTP-based 2FA
- Trusted device management
- Session timeout (7 days)
- Account lockout after failed attempts

### Authorization
- Role-based access control
- Permission-based feature gating
- Organization policies
- Admin approval for sensitive actions

### Transport Security
- TLS 1.3 for all HTTP traffic
- DTLS-SRTP for WebRTC
- Certificate pinning (future)

### Data Protection
- Encryption at rest (database)
- Encryption in transit (TLS)
- No storage of payment data (Stripe)
- GDPR-compliant data handling

### Audit
- All security events logged
- Audit log retention: 365 days
- Tamper-resistant logging
- Admin action audit trail

## Secure Development
- Dependency scanning
- Secret detection in CI
- Security-focused code reviews
- Penetration testing (quarterly)

## Incident Response
See [Incident Response Guide](incident-response.md)
