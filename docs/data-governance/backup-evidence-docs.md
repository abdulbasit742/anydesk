# RemoteDesk Backup Evidence

## Backup Procedures

### Database Backups
| Type | Frequency | Retention | Storage | Encryption |
|------|-----------|-----------|---------|------------|
| Full | Daily | 30 days | S3 | AES-256 |
| Incremental | Hourly | 24 hours | S3 | AES-256 |
| Archive | Monthly | 7 years | Glacier | AES-256 |

### File Backups
| Type | Frequency | Retention | Storage | Encryption |
|------|-----------|-----------|---------|------------|
| User files | Real-time | 30 days | S3 | AES-256 |

### Configuration Backups
| Type | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| Terraform state | Every apply | Forever | S3 + DynamoDB |
| App config | On change | Forever | Git |

## Backup Verification
- Daily: Backup integrity checksum
- Weekly: Test restore to staging
- Monthly: Full DR drill

## Evidence Log
| Date | Backup Type | Size | Status | Verified By |
|------|-------------|------|--------|-------------|
| 2026-06-12 | Full DB | 2.3 GB | Success | Automated |
| 2026-06-11 | Full DB | 2.3 GB | Success | Automated |
| 2026-06-10 | Full DB | 2.2 GB | Success | Automated |

## RTO/RPO
| Scenario | RTO | RPO |
|----------|-----|-----|
| Single table | 15 min | 0 |
| Full database | 1 hour | 1 hour |
| Full system | 4 hours | 1 hour |
| Disaster recovery | 24 hours | 24 hours |

## Compliance
- SOC 2: Backup and recovery tested
- ISO 27001: Backup procedures documented
- GDPR: Data recoverable for subject requests
