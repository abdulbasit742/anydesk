#!/bin/bash
# RemoteDesk Backup Script

set -euo pipefail

BACKUP_DIR="/backups/remotedesk"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

echo "Starting RemoteDesk backup at $DATE"

# Database backup
echo "Backing up database..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" remotedesk > "$BACKUP_DIR/db_$DATE.sql"

# Recordings backup (if local)
if [ -d "/recordings" ]; then
  echo "Backing up recordings..."
  tar czf "$BACKUP_DIR/recordings_$DATE.tar.gz" -C /recordings .
fi

# Compress database backup
gzip "$BACKUP_DIR/db_$DATE.sql"

# Clean old backups
echo "Cleaning backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "recordings_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $BACKUP_DIR/db_$DATE.sql.gz"
