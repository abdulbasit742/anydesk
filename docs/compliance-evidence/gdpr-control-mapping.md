# RemoteDesk GDPR Control Mapping

## Article 5 - Principles
| Principle | Implementation | Evidence |
|-----------|---------------|----------|
| Lawfulness | Consent on signup | privacy-policy-v2.1.pdf |
| Purpose limitation | Data use documented | data-inventory.csv |
| Data minimization | Only collect necessary fields | user-schema.prisma |
| Accuracy | User can update profile | settings-page.tsx |
| Storage limitation | Retention policies enforced | retention-policy.md |
| Integrity/confidentiality | Encryption in transit and at rest | crypto-spec.md |

## Article 15 - Right of Access
| Control | Implementation | Evidence |
|---------|---------------|----------|
| Data export | Full data export API | /api/v1/user/export |
| Format | JSON, CSV, PDF | export-service.ts |
| Timeline | Within 30 days | sla-dashboard |

## Article 17 - Right to Erasure
| Control | Implementation | Evidence |
|---------|---------------|----------|
| Account deletion | Self-service deletion | delete-account.tsx |
| Cascade delete | All data removed | prisma cascade |
| Verification | Confirmation email | email-templates.ts |

## Article 32 - Security
| Control | Implementation | Evidence |
|---------|---------------|----------|
| Encryption | AES-256 at rest, TLS 1.3 | security-headers-config.md |
| Pseudonymization | User IDs are UUIDs | user-schema.prisma |
| Resilience | Backups, HA | disaster-recovery-plan.md |

## DPO Contact
- Name: Jane Smith
- Email: dpo@remotedesk.io
- Address: RemoteDesk Inc., 123 Security Lane, San Francisco, CA 94105
