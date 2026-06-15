#!/bin/bash
set -euo pipefail

OUTPUT_DIR="${1:-./exports}"

echo "Exporting device data..."
mkdir -p "${OUTPUT_DIR}"

psql "${DATABASE_URL}" -c "\COPY (
  SELECT id, remote_desk_id, name, os, version, status, 
         last_seen_at, created_at
  FROM devices
  ORDER BY created_at DESC
) TO '${OUTPUT_DIR}/devices.csv' WITH CSV HEADER;"

echo "Device export complete."
