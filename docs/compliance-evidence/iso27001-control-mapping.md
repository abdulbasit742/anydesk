# RemoteDesk ISO 27001 Control Mapping

## A.5 - Information Security Policies
| Control | Status | Evidence |
|---------|--------|----------|
| A.5.1.1 - Policy review | Implemented | security-policy-v1.3.pdf |
| A.5.1.2 - Policy compliance | Implemented | compliance-audit-q2-2026.pdf |

## A.9 - Access Control
| Control | Status | Evidence |
|---------|--------|----------|
| A.9.1.1 - Access control policy | Implemented | access-control-policy.md |
| A.9.2.1 - User registration | Implemented | user-registration-flow.ts |
| A.9.2.2 - Privilege management | Implemented | rbac-system.ts |
| A.9.2.3 - Password management | Implemented | password-policy.ts |
| A.9.2.4 - Review of user access | Implemented | access-review-workflow.md |
| A.9.2.5 - Removal of access | Implemented | user-offboarding.ts |
| A.9.4.1 - Restriction of access | Implemented | network-segmentation.tf |

## A.12 - Operations Security
| Control | Status | Evidence |
|---------|--------|----------|
| A.12.1.1 - Operating procedures | Implemented | runbook-library/ |
| A.12.3.1 - Information backup | Implemented | backup-automation-guide.md |
| A.12.4.1 - Event logging | Implemented | audit-logger.ts |
| A.12.4.2 - Protection of logs | Implemented | log-protection.md |
| A.12.4.3 - Admin/operator logs | Implemented | admin-action-logs.ts |
| A.12.4.4 - Clock sync | Implemented | ntp-config.yml |

## A.16 - Incident Management
| Control | Status | Evidence |
|---------|--------|----------|
| A.16.1.1 - Responsibilities | Implemented | incident-response-plan.md |
| A.16.1.2 - Reporting events | Implemented | incident-reporting-form.md |
| A.16.1.3 - Reporting weaknesses | Implemented | security@remotedesk.io |
| A.16.1.4 - Assessment and decision | Implemented | incident-triage.md |
| A.16.1.5 - Response to incidents | Implemented | incident-runbook-library/ |
| A.16.1.6 - Learning from incidents | Implemented | incident-retrospectives/ |
