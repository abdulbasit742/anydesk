#!/bin/bash
set -e

BACKUP_DIR="/backups/remotedesk"

if [ -z "$1" ]; then
  echo "Usage: $0 <backup_timestamp>"
  echo "Available backups:"
  ls -1 "$BACKUP_DIR"/*.sql.gz | xargs -n1 basename
  exit 1
fi

TIMESTAMP=$1
DB_BACKUP="$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

if [ ! -f "$DB_BACKUP" ]; then
  echo "Backup not found: $DB_BACKUP"
  exit 1
fi

echo "Restoring database from $TIMESTAMP..."
gunzip -c "$DB_BACKUP" | docker exec -i remotedesk-db-1 psql -U postgres -d remotedesk

echo "Restore complete"
