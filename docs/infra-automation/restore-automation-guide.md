# RemoteDesk Restore Automation Guide

## Database Restore
```bash
#!/bin/bash
set -euo pipefail
BACKUP_FILE=$1
DB_NAME=remotedesk

# 1. Stop app (prevent writes)
kubectl scale deployment remotedesk-api --replicas=0

# 2. Drop and recreate DB
dropdb $DB_NAME || true
createdb $DB_NAME

# 3. Restore
pg_restore -d $DB_NAME $BACKUP_FILE

# 4. Restart app
kubectl scale deployment remotedesk-api --replicas=3

# 5. Verify
curl -f http://localhost:4000/health
```

## Point-in-Time Recovery
```bash
# Using WAL archives
pg_basebackup -D /var/lib/postgresql/recovery -X fetch -P
# Then apply WAL segments to reach target time
```

## Recovery Time Objectives
| Scenario | RTO | RPO |
|----------|-----|-----|
| Single table restore | 15 min | 0 |
| Full DB restore | 1 hour | 24 hours |
| Full system DR | 4 hours | 1 hour |
