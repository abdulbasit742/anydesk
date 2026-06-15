#!/bin/bash

# API Redis Connection Check Script
# Checks if the Redis service is running and accessible.

# This script assumes `REDIS_URL` is available in the environment
# or can be sourced from an .env file.

# Navigate to the API directory (assuming .env is there)
cd apps/api || { echo "Error: apps/api directory not found."; exit 1; }

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(grep -v "^#" .env | xargs)
fi

if [ -z "$REDIS_URL" ]; then
  echo "Error: REDIS_URL environment variable is not set."
  echo "Please ensure your apps/api/.env file is configured or REDIS_URL is exported."
  exit 1
fi

echo "Attempting to connect to Redis at: $REDIS_URL"

# Extract host and port from REDIS_URL
REDIS_HOST=$(echo $REDIS_URL | sed -E 's/redis:\/\/([^:]+)(:([0-9]+))?.*/\1/')
REDIS_PORT=$(echo $REDIS_URL | sed -E 's/redis:\/\/([^:]+):([0-9]+).*/\2/')

# Default port if not specified in URL
if [ -z "$REDIS_PORT" ]; then
  REDIS_PORT=6379
fi

# Use `redis-cli` to ping the Redis server
# If redis-cli is not installed, this will fail. Consider `nc` or a simple node script.
# For this example, we assume redis-cli is available in the environment where this script runs.

if command -v redis-cli &> /dev/null
then
  response=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT ping)
  if [ "$response" == "PONG" ]; then
    echo "Redis connection SUCCESSFUL."
    exit 0
  else
    echo "Redis connection FAILED. Response: $response"
    exit 1
  fi
else
  echo "Warning: redis-cli not found. Attempting connection with netcat (nc)."
  if command -v nc &> /dev/null
  then
    # nc -z will attempt to establish a connection without sending data
    if nc -z $REDIS_HOST $REDIS_PORT;
    then
      echo "Redis connection SUCCESSFUL (via nc)."
      exit 0
    else
      echo "Redis connection FAILED (via nc)."
      exit 1
    fi
  else
    echo "Error: Neither redis-cli nor nc found. Cannot check Redis connection."
    exit 1
  fi
fi
