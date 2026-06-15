#!/bin/bash
# Scan for TODOs and FIXMEs in the codebase

echo "=== Scanning for TODOs ==="
grep -r "TODO\|FIXME\|HACK\|XXX"   --include="*.ts"   --include="*.tsx"   --exclude-dir=node_modules   --exclude-dir=dist   -n . | head -50

echo ""
echo "=== Scanning for placeholder files ==="
find . -name "*.placeholder" -o -name "*.stub" | grep -v node_modules | grep -v dist

echo ""
echo "=== Scanning for empty implementations ==="
grep -r "// TODO\|not implemented\|placeholder"   --include="*.ts"   --include="*.tsx"   --exclude-dir=node_modules   -n . | head -30
