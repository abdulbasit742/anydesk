#!/bin/bash
# Cleanup Script - Remove old data

set -euo pipefail

# Old recordings (90+ days)
echo "Cleaning old recordings..."
find /recordings -type f -mtime +90 -delete

# Old logs
echo "Cleaning old logs..."
find /var/log/remotedesk -name "*.log.*" -mtime +30 -delete

# Temp files
echo "Cleaning temp files..."
find /tmp -name "remotedesk-*" -mtime +1 -delete

echo "Cleanup complete!"
