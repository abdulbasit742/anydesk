# Security QA Checklist

## Authentication
- [ ] Password complexity enforced
- [ ] MFA works correctly
- [ ] Session timeout enforced
- [ ] Concurrent session limits work
- [ ] Brute force protection active

## Authorization
- [ ] RBAC enforced on all endpoints
- [ ] Horizontal escalation blocked
- [ ] Vertical escalation blocked
- [ ] Admin actions require re-auth

## Data Protection
- [ ] TLS 1.3 on all connections
- [ ] WebRTC uses DTLS-SRTP
- [ ] No sensitive data in logs
- [ ] Database encrypted at rest
- [ ] Backups encrypted

## Input Validation
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF tokens validated
- [ ] File upload validated
- [ ] Rate limiting enforced

## Infrastructure
- [ ] No unnecessary ports open
- [ ] Container images scanned
- [ ] Secrets not in code
- [ ] Security headers present
- [ ] WAF rules active
