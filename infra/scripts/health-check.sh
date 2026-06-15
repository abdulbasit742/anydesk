#!/bin/bash

API_URL="${API_URL:-http://localhost:4000}"

check_service() {
  local name=$1
  local url=$2
  if curl -sf "$url" > /dev/null 2>&1; then
    echo "✓ $name is healthy"
    return 0
  else
    echo "✗ $name is unhealthy"
    return 1
  fi
}

echo "Health check at $(date)"
check_service "API" "$API_URL/health"
check_service "Web" "http://localhost:3000"
check_service "Database" "$API_URL/health/db"
check_service "Redis" "$API_URL/health/cache"
