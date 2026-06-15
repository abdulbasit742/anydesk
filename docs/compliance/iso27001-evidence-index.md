# ISO 27001 Evidence Index

## Annex A Controls

### A.9 Access Control
- **A.9.1.1**: Access control policy -> `docs/enterprise/enterprise-qa-guide.md`
- **A.9.1.2**: Access to networks -> `config/nginx/nginx.conf`
- **A.9.2.1**: User registration -> `apps/api/tests/e2e/auth-flow.spec.ts`
- **A.9.2.2**: Privilege management -> `apps/api/tests/enterprise/rbac.test.ts`
- **A.9.4.1**: Information access restriction -> `apps/api/tests/security/permission-gate.test.ts`

### A.12 Operations Security
- **A.12.1.1**: Operational procedures -> `docs/deployment/deployment-guide.md`
- **A.12.3.1**: Information backup -> `scripts/backup.sh`
- **A.12.4.1**: Event logging -> `docs/observability/log-format.md`
- **A.12.4.2**: Protection of log information -> `apps/api/src/middleware/logger.ts`

### A.16 Information Security Incident Management
- **A.16.1.1**: Responsibilities -> `docs/observability/incident-response.md`
- **A.16.1.2**: Reporting events -> `docs/observability/incident-response.md`

## Audit Trail
All evidence is stored in version control with timestamps.
