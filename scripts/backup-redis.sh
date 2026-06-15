#!/bin/bash
set -euo pipefail
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=${BACKUP_DIR:-/backups/remotedesk}
REDIS_HOST=${REDIS_HOST:-localhost}
S3_BUCKET=${S3_BUCKET:-remotedesk-backups}

mkdir -p $BACKUP_DIR
redis-cli -h $REDIS_HOST BGSAVE
sleep 5
cp /var/lib/redis/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"
aws s3 cp "$BACKUP_DIR/redis_$DATE.rdb" "s3://$S3_BUCKET/redis/"
echo "Redis backup complete"
