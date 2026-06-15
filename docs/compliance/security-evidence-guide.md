# Security Evidence Guide

## Automated Evidence
The following evidence is collected automatically:
- Security test results (CI)
- Access logs
- Audit logs
- Vulnerability scan results
- Dependency audit results

## Manual Evidence
The following requires manual collection:
- Access reviews (quarterly)
- Policy acknowledgments (annually)
- Security training records (annually)
- Penetration test reports (annually)

## Evidence Storage
All evidence is stored in:
- Git repository (code, configs, tests)
- S3 bucket `remotedesk-compliance-evidence`
- Google Drive (manual docs, screenshots)

## Retention
| Type | Retention |
|------|-----------|
| Audit logs | 1 year |
| Access reviews | 3 years |
| Security tests | 3 years |
| Incident reports | 5 years |
| Training records | Duration of employment + 3 years |

## Audit Preparation
1. Run full test suite
2. Export logs for review period
3. Gather access review documents
4. Compile incident reports
5. Verify backup integrity
