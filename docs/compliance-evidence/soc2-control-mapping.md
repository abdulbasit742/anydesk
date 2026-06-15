# RemoteDesk SOC 2 Control Mapping

## CC6.1 - Logical Access Security
| Control | Implementation | Evidence |
|---------|---------------|----------|
| User authentication | JWT + MFA | auth.ts, mfa-service.ts |
| Password policy | Zod validation | password-schema.ts |
| Session management | Expiring tokens | session-service.ts |
| Access revocation | Instant token invalidation | auth-middleware.ts |

## CC6.2 - Access Removal
| Control | Implementation | Evidence |
|---------|---------------|----------|
| User offboarding | Admin API + SCIM | user-management.ts |
| Device removal | Trust revocation | device-service.ts |

## CC7.1 - Security Operations
| Control | Implementation | Evidence |
|---------|---------------|----------|
| Vulnerability scanning | SAST/DAST in CI | .github/workflows/security.yml |
| Penetration testing | Quarterly external | pentest-report-q2-2026.pdf |
| Security monitoring | SIEM alerts | security-alerts.ts |

## CC7.2 - Incident Response
| Control | Implementation | Evidence |
|---------|---------------|----------|
| Incident detection | Automated alerts | alertmanager.yml |
| Response procedures | Documented runbooks | security-incident-response-plan.md |
| Post-incident review | Retrospective template | incident-retrospective.md |

## CC8.1 - Change Management
| Control | Implementation | Evidence |
|---------|---------------|----------|
| Code review | Required PR reviews | branch-protection.yml |
| Automated testing | CI pipeline | .github/workflows/test.yml |
| Deployment approval | Manual gate for prod | deploy-pipeline.yml |
