#!/bin/bash
# RemoteDesk Health Check

URL="${1:-http://localhost:3000/api/health}"
TIMEOUT=5

response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$URL")

if [ "$response" = "200" ]; then
  echo "OK: Health check passed"
  exit 0
else
  echo "FAIL: Health check failed (HTTP $response)"
  exit 1
fi
