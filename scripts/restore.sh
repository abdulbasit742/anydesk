#!/bin/bash
# RemoteDesk Restore Script

set -euo pipefail

BACKUP_FILE="$1"
DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-password}"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file.sql.gz>"
  exit 1
fi

echo "Restoring from $BACKUP_FILE"

# Decompress if needed
if [[ "$BACKUP_FILE" == *.gz ]]; then
  gunzip -c "$BACKUP_FILE" | mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" remotedesk
else
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" remotedesk < "$BACKUP_FILE"
fi

echo "Restore completed"
