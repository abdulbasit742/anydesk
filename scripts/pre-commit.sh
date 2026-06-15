#!/bin/bash
# Pre-commit hook

echo "Running pre-commit checks..."

cd apps/web

# Type check
echo "Type checking..."
npm run check

# Lint
echo "Linting..."
npm run lint

# Tests (staged files only)
echo "Running tests..."
npm run test:changed

echo "Pre-commit checks passed!"
