#!/bin/bash
set -euo pipefail

OUTPUT_DIR="${1:-./exports}"
START_DATE="${2:-$(date -d '30 days ago' +%Y-%m-%d)}"
END_DATE="${3:-$(date +%Y-%m-%d)}"

echo "Exporting session data from ${START_DATE} to ${END_DATE}..."
mkdir -p "${OUTPUT_DIR}"

psql "${DATABASE_URL}" -c "\COPY (
  SELECT * FROM audit_logs 
  WHERE action LIKE 'SESSION_%' 
  AND created_at BETWEEN '${START_DATE}' AND '${END_DATE}'
  ORDER BY created_at DESC
) TO '${OUTPUT_DIR}/sessions.csv' WITH CSV HEADER;"

echo "Session export complete."
