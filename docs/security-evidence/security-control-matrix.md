# RemoteDesk Security Control Matrix

| Control | Implementation | Status | Evidence |
|---------|---------------|--------|----------|
| AC-1: Access Control Policy | RBAC + ABAC | Implemented | rbac-tests.spec.ts |
| AC-2: Account Management | SCIM + manual | Implemented | user-management.spec.ts |
| AC-3: Access Enforcement | Middleware checks | Implemented | middleware/auth.ts |
| AU-1: Audit Policy | Audit logging | Implemented | audit-logger.ts |
| AU-6: Audit Review | Dashboard + alerts | Implemented | audit-dashboard.tsx |
| CM-2: Baseline Config | Terraform/Helm | Implemented | infra/ |
| CM-7: Least Functionality | Feature flags | Implemented | feature-flags.ts |
| IA-2: Identification | JWT tokens | Implemented | auth.ts |
| IA-5: Authenticators | Password + MFA | Implemented | mfa-service.ts |
| SC-8: Transmission Integrity | TLS 1.3 | Implemented | SSL config |
| SC-13: Cryptographic Protection | AES-256 + ECDSA | Implemented | crypto.ts |
| SI-4: Information Monitoring | SIEM integration | Implemented | security-alerts.ts |
