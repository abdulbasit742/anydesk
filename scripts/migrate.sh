#!/bin/bash
# Database Migration Script

set -euo pipefail

echo "Running database migrations..."

cd apps/web

# Generate migration if needed
if [ "${GENERATE:-false}" = "true" ]; then
  echo "Generating migration..."
  npm run db:generate
fi

# Apply migrations
echo "Applying migrations..."
npm run db:migrate

echo "Migrations complete!"
