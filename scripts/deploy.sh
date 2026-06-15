#!/bin/bash
# RemoteDesk Deployment Script

set -euo pipefail

ENV="${1:-staging}"
echo "Deploying to $ENV..."

# Build
echo "Building..."
npm run build

# Run tests
echo "Running tests..."
npm run test

# Deploy
if [ "$ENV" = "production" ]; then
  echo "Deploying to production..."
  # docker-compose -f docker-compose.prod.yml up -d
else
  echo "Deploying to staging..."
  docker-compose up -d --build
fi

echo "Deployment complete!"
