#!/bin/bash
set -euo pipefail

OUTPUT_DIR="${1:-./exports}"

echo "Exporting billing data..."
mkdir -p "${OUTPUT_DIR}"

# Organization plans
psql "${DATABASE_URL}" -c "\COPY (
  SELECT id, name, plan, status, trial_ends_at, created_at
  FROM organizations
  ORDER BY created_at DESC
) TO '${OUTPUT_DIR}/organizations.csv' WITH CSV HEADER;"

echo "Billing export complete."
