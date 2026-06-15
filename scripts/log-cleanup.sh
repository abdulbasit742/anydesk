#!/bin/bash
# Clean old log files
set -euo pipefail
APP_LOG_DAYS=${APP_LOG_DAYS:-30}
AUDIT_LOG_YEARS=${AUDIT_LOG_YEARS:-7}

# Application logs
find /var/log/remotedesk/app -name "*.log" -mtime +$APP_LOG_DAYS -delete

# Audit logs (archive instead of delete)
find /var/log/remotedesk/audit -name "*.log" -mtime +$((AUDIT_LOG_YEARS * 365)) -exec gzip {} \;
echo "Log cleanup complete"
