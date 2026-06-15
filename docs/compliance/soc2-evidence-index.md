# SOC 2 Evidence Index

## Trust Services Criteria

### Security (CC6.1 - CC6.3)
| Control | Evidence | Location |
|---------|----------|----------|
| Access Control | RBAC tests | `apps/api/tests/enterprise/rbac.test.ts` |
| Authentication | Auth token tests | `apps/api/tests/security/auth-token.test.ts` |
| Encryption | TLS config | `config/nginx/nginx.conf` |
| Audit Logging | Audit log tests | `apps/api/tests/enterprise/audit-log.test.ts` |

### Availability (A1.1 - A1.3)
| Control | Evidence | Location |
|---------|----------|----------|
| Monitoring | Prometheus/Grafana | `config/prometheus/`, `config/grafana/` |
| Backups | Backup scripts | `scripts/backup.sh` |
| Recovery | Restore scripts | `scripts/restore.sh` |
| Health Checks | Health endpoint | `apps/api/src/routes/metrics.ts` |

### Processing Integrity (PI1.1 - PI1.5)
| Control | Evidence | Location |
|---------|----------|----------|
| Input Validation | Validation tests | `packages/shared/tests/dto-validation.test.ts` |
| Error Handling | Error middleware | `apps/api/src/middleware/error.ts` |

### Confidentiality (C1.1 - C1.3)
| Control | Evidence | Location |
|---------|----------|----------|
| Data Classification | Privacy docs | `docs/privacy/data-inventory.md` |
| Access Restrictions | Permission gates | `apps/api/tests/security/permission-gate.test.ts` |

## Evidence Collection Schedule
- Daily: Automated logs, metrics
- Weekly: Access reviews
- Monthly: Policy reviews
- Quarterly: Full evidence collection
