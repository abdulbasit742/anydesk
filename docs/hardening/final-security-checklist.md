# Final Security Checklist

## Authentication
- [ ] Password requirements enforced
- [ ] 2FA available and recommended
- [ ] Session timeout implemented
- [ ] Concurrent session limits
- [ ] Brute force protection
- [ ] Account lockout policy

## Authorization
- [ ] RBAC implemented and tested
- [ ] Principle of least privilege
- [ ] Permission checks on all endpoints
- [ ] Admin actions require re-auth
- [ ] API keys scoped to permissions

## Data Protection
- [ ] TLS 1.2+ enforced
- [ ] Encryption at rest (database)
- [ ] PII minimized
- [ ] Data retention policies enforced
- [ ] Secure deletion implemented

## Session Security
- [ ] Explicit accept required
- [ ] Host can terminate anytime
- [ ] No unattended access by default
- [ ] Session timeout configurable
- [ ] Recording requires consent

## Infrastructure
- [ ] Security headers set
- [ ] Rate limiting active
- [ ] DDoS protection enabled
- [ ] WAF configured
- [ ] Network segmentation

## Monitoring
- [ ] Audit logging enabled
- [ ] Failed login monitoring
- [ ] Anomaly detection
- [ ] Incident response plan
- [ ] Regular penetration testing

## Compliance
- [ ] GDPR compliance
- [ ] SOC 2 evidence collected
- [ ] Privacy policy published
- [ ] Data processing agreements
- [ ] Regular access reviews
