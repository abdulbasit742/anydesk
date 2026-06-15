# RemoteDesk Deployment Security Hardening

## Network
- [ ] Firewall: Only 443, 3478, 49152-65535 open
- [ ] DDoS protection enabled
- [ ] WAF configured
- [ ] VPC/network segmentation

## Application
- [ ] JWT secrets rotated (256-bit minimum)
- [ ] API rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (output encoding)

## Database
- [ ] SSL/TLS enforced for connections
- [ ] Backup encryption (AES-256)
- [ ] Least-privilege DB user
- [ ] Query logging enabled

## Infrastructure
- [ ] OS patches automated
- [ ] Container scanning (Trivy/Snyk)
- [ ] Secret scanning in CI
- [ ] Security headers on all responses

## Monitoring
- [ ] Failed login alerts
- [ ] Unusual session pattern detection
- [ ] File transfer anomaly detection
- [ ] Privilege escalation alerts
