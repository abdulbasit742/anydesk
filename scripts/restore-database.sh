#!/bin/bash
set -euo pipefail
BACKUP_FILE=$1
DB_NAME=${DB_NAME:-remotedesk}

echo "Stopping application..."
kubectl scale deployment remotedesk-api --replicas=0 2>/dev/null || true

echo "Restoring database..."
dropdb $DB_NAME 2>/dev/null || true
createdb $DB_NAME
pg_restore -d $DB_NAME "$BACKUP_FILE"

echo "Restarting application..."
kubectl scale deployment remotedesk-api --replicas=3 2>/dev/null || true

echo "Verifying..."
sleep 10
curl -f http://localhost:4000/health
echo "Restore complete"
