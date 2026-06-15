#!/bin/bash
set -euo pipefail
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=${BACKUP_DIR:-/backups/remotedesk}
DB_NAME=${DB_NAME:-remotedesk}
RETENTION_DAYS=${RETENTION_DAYS:-30}
S3_BUCKET=${S3_BUCKET:-remotedesk-backups}

mkdir -p $BACKUP_DIR
echo "Starting backup at $DATE"

pg_dump -Fc $DB_NAME > "$BACKUP_DIR/db_$DATE.dump"
aws s3 cp "$BACKUP_DIR/db_$DATE.dump" "s3://$S3_BUCKET/db/"

# Cleanup
find "$BACKUP_DIR" -name "db_*.dump" -mtime +$RETENTION_DAYS -delete
echo "Backup complete: db_$DATE.dump"
