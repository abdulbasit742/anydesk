# Security Testing Guide

## Test Categories
1. **Auth Token Tests** - JWT generation, validation, expiry, tampering
2. **Rate Limit Tests** - Request throttling, burst handling, window reset
3. **CORS Tests** - Origin validation, credentials policy
4. **Security Headers** - Required HTTP response headers
5. **Input Validation** - SQL injection, XSS, path traversal prevention
6. **Socket Payload Validation** - Message structure, size limits
7. **Permission Gates** - Role-based access control enforcement

## Running Tests
```bash
npm run test --workspace=@remotedesk/api -- --testPathPattern=security
```

## CI Requirements
- All security tests must pass before merge
- No skipped security tests allowed
- New features require corresponding security tests

## Reporting
Security test failures are treated as P0 incidents.
