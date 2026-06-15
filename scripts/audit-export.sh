#!/bin/bash
set -euo pipefail

OUTPUT_DIR="${1:-./exports}"
START_DATE="${2:-$(date -d '30 days ago' +%Y-%m-%d)}"
END_DATE="${3:-$(date +%Y-%m-%d)}"

echo "Exporting audit logs from ${START_DATE} to ${END_DATE}..."
mkdir -p "${OUTPUT_DIR}"

# Export from PostgreSQL
psql "${DATABASE_URL}" -c "\COPY (
  SELECT id, organization_id, user_id, action, resource, resource_id, 
         details::text, ip_address, created_at 
  FROM audit_logs 
  WHERE created_at BETWEEN '${START_DATE}' AND '${END_DATE}'
  ORDER BY created_at DESC
) TO '${OUTPUT_DIR}/audit_logs.csv' WITH CSV HEADER;"

echo "Exported $(wc -l < ${OUTPUT_DIR}/audit_logs.csv) rows"
