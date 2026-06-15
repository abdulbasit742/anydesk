#!/bin/bash
# Verify build integrity

echo "=== Build Verification ==="

cd apps/web

# Type check
echo "Type checking..."
npm run check || exit 1

# Tests
echo "Running tests..."
npm run test || exit 1

# Build
echo "Building..."
npm run build || exit 1

echo "=== All checks passed ==="
