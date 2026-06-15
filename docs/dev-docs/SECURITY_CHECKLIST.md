# Developer Security Checklist

## Before Submitting PR
- [ ] No secrets in code
- [ ] Input validation on all endpoints
- [ ] Output sanitization
- [ ] Rate limiting considered
- [ ] Permission checks implemented
- [ ] Audit logging for sensitive actions

## Authentication
- [ ] Sessions have expiry
- [ ] Password reset tokens expire
- [ ] 2FA verification on sensitive actions
- [ ] JWT tokens refreshed

## Data Handling
- [ ] No PII in logs
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS only in production
- [ ] CORS configured correctly

## WebSocket Security
- [ ] Auth on connection
- [ ] Rate limiting
- [ ] Input validation
- [ ] Room authorization

## Dependencies
- [ ] No known vulnerabilities (`npm audit`)
- [ ] Dependencies up to date
- [ ] Minimal dependency tree

## Review Checklist
- [ ] Security team review for auth changes
- [ ] Penetration test for major features
- [ ] Dependency scan passes
- [ ] Security unit tests pass
