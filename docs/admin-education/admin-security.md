# Admin Security Guide

## Security Checklist

### Authentication
- [ ] Enforce strong passwords (12+ chars)
- [ ] Require 2FA for all users
- [ ] Enable SSO (enterprise)
- [ ] Set session timeout (4 hours)
- [ ] Disable inactive accounts (90 days)

### Authorization
- [ ] Use principle of least privilege
- [ ] Regular access reviews (quarterly)
- [ ] Document role assignments
- [ ] Revoke terminated employee access immediately
- [ ] No shared accounts

### Session Security
- [ ] Require approval for all sessions
- [ ] Set maximum session duration
- [ ] Enable audit logging
- [ ] Disable unattended access (default)
- [ ] Require consent for recording

### Device Security
- [ ] Require disk encryption
- [ ] Enforce OS update policy
- [ ] Block jailbroken/rooted devices
- [ ] Require corporate network (sensitive)
- [ ] Regular compliance checks

### Monitoring
- [ ] Review audit logs weekly
- [ ] Set up security alerts
- [ ] Monitor failed login attempts
- [ ] Track policy violations
- [ ] Review after-hours access

## Incident Response
1. Identify: Spot unusual activity in audit logs
2. Contain: End suspicious sessions, block devices
3. Investigate: Review full audit trail
4. Remediate: Reset passwords, revoke access
5. Report: Document and notify stakeholders

## Security Settings
- Admin Dashboard -> Security
- Password policy
- MFA settings
- Session policies
- IP restrictions
- Audit configuration
