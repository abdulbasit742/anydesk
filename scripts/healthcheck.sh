#!/bin/bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4000}"
TIMEOUT=5

# Check API health
if ! curl -sf --max-time "${TIMEOUT}" "${API_URL}/health" > /dev/null; then
  echo "FAIL: API health check failed"
  exit 1
fi

# Check database connectivity
if ! curl -sf --max-time "${TIMEOUT}" "${API_URL}/health/detailed" | grep -q '"database":true'; then
  echo "FAIL: Database connectivity check failed"
  exit 1
fi

# Check critical endpoints
for endpoint in "/auth/me" "/devices"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "${TIMEOUT}" "${API_URL}${endpoint}")
  if [[ "${status}" != "401" && "${status}" != "200" ]]; then
    echo "FAIL: ${endpoint} returned ${status}"
    exit 1
  fi
done

echo "OK: All health checks passed"
