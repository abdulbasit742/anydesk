#!/bin/bash
set -e

BACKUP_DIR="/backups/remotedesk"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# Database backup
echo "Backing up database..."
docker exec remotedesk-db-1 pg_dump -U postgres remotedesk | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# Redis backup
echo "Backing up Redis..."
docker exec remotedesk-redis-1 redis-cli BGSAVE
sleep 2
docker cp remotedesk-redis-1:/data/dump.rdb "$BACKUP_DIR/redis_$TIMESTAMP.rdb"

# Uploads/attachments (if applicable)
# tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" /data/uploads

# Cleanup old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.rdb" -mtime +$RETENTION_DAYS -delete

echo "Backup complete: $BACKUP_DIR"
ls -lh "$BACKUP_DIR"
