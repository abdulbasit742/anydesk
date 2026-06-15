#!/bin/bash

# API Prisma Connection Check Script
# Checks if the Prisma ORM can connect to the configured database.

# This script assumes `DATABASE_URL` is available in the environment
# or can be sourced from an .env file.

# Navigate to the API directory
cd apps/api || { echo "Error: apps/api directory not found."; exit 1; }

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(grep -v "^#" .env | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set."
  echo "Please ensure your apps/api/.env file is configured or DATABASE_URL is exported."
  exit 1
fi

echo "Attempting to connect to database using Prisma..."

# Use Prisma CLI to validate the connection
# `prisma validate` checks the schema, `prisma db pull` attempts connection
# For a simple connection check, `prisma migrate diff --from-empty --to-schema-datamodel` can be used
# or a direct `npx prisma db execute --stdin --command "SELECT 1"`

# Using `prisma migrate diff` as it's a non-destructive way to check connection
# and schema validity without applying migrations.
output=$(npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel=prisma/schema.prisma \
  --script \
  --preview-feature 2>&1)

if echo "$output" | grep -q "Error"; then
  echo "Prisma database connection FAILED."
  echo "Error details:"
  echo "$output"
  exit 1
else
  echo "Prisma database connection SUCCESSFUL."
  exit 0
fi
