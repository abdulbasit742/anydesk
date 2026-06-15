# RemoteDesk Backup Automation Guide

## Backup Scope
| Data | Frequency | Retention | Method |
|------|-----------|-----------|--------|
| Database | Daily | 30 days | pg_dump |
| Redis | Hourly | 7 days | RDB snapshot |
| User files | Real-time | 90 days | S3 versioning |
| Config | On change | Forever | Git |
| Audit logs | Daily | 7 years | Archive |

## pg_dump Script
```bash
#!/bin/bash
set -euo pipefail
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups/remotedesk
DB_NAME=remotedesk
RETENTION_DAYS=30

mkdir -p $BACKUP_DIR
pg_dump -Fc $DB_NAME > $BACKUP_DIR/db_$DATE.dump

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$DATE.dump s3://remotedesk-backups/db/

# Cleanup old
find $BACKUP_DIR -name "db_*.dump" -mtime +$RETENTION_DAYS -delete
aws s3 ls s3://remotedesk-backups/db/ | awk '$1 < "'$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)'" {print $4}' | xargs -I {} aws s3 rm s3://remotedesk-backups/db/{}
```

## Cron Schedule
```
0 2 * * * /opt/remotedesk/scripts/backup-db.sh
0 * * * * /opt/remotedesk/scripts/backup-redis.sh
```
