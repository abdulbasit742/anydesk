#!/bin/bash
# RemoteDesk Environment Setup

set -euo pipefail

echo "Setting up RemoteDesk environment..."

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 20 ]; then
  echo "Error: Node.js 20+ required"
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
cd apps/web && npm install
cd ../..

# Set up database
echo "Setting up database..."
npm run db:push

# Seed data (optional)
if [ "${SEED_DATA:-false}" = "true" ]; then
  echo "Seeding data..."
  npx tsx db/seed.ts
fi

echo "Setup complete!"
