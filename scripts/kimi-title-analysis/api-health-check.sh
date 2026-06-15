#!/bin/bash

# API Health Check Script
# Checks if the API service is running and responsive.

API_URL="${1:-http://localhost:3000/api/health}"

echo "Checking API health at: $API_URL"

response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ "$response" -eq 200 ]; then
  echo "API is healthy (HTTP 200 OK)."
  exit 0
else
  echo "API health check failed (HTTP $response)."
  exit 1
fi
