# Backup Evidence Template

## Backup Configuration
| Field | Value |
|-------|-------|
| Schedule | Daily at 02:00 UTC |
| Retention | 30 days |
| Storage | Local + S3 |
| Encryption | AES-256 |

## Backup Log
| Date | Type | Size | Duration | Status | Location |
|------|------|------|----------|--------|----------|
| | Full | | | Success / Failed | |
| | Incremental | | | Success / Failed | |

## Restore Tests
| Date | Backup Used | Restore Time | Verified? | Tester |
|------|-------------|--------------|-----------|--------|
| | | | Yes / No | |

## Compliance Check
- [ ] Backups run on schedule
- [ ] Backup integrity verified
- [ ] Restore tested quarterly
- [ ] Offsite copies exist
- [ ] Encryption confirmed
- [ ] Retention policy enforced

## Evidence Location
- Backup scripts: `scripts/backup.sh`
- Restore scripts: `scripts/restore.sh`
- Logs: `/var/log/remotedesk/backups/`
