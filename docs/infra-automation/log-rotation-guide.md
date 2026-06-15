# RemoteDesk Log Rotation Guide

## logrotate Configuration
```
/var/log/remotedesk/*.log {
  daily
  missingok
  rotate 30
  compress
  delaycompress
  notifempty
  create 0644 remotedesk remotedesk
  sharedscripts
  postrotate
    /bin/kill -HUP $(cat /var/run/remotedesk.pid 2>/dev/null) 2>/dev/null || true
  endscript
}
```

## Structured Logging
```json
{
  "timestamp": "2026-06-12T10:30:00Z",
  "level": "info",
  "service": "remotedesk-api",
  "trace_id": "abc-123",
  "message": "Session started",
  "metadata": {
    "session_id": "sess_456",
    "user_id": "user_789",
    "desk_id": "123456789"
  }
}
```

## Retention by Log Type
| Log Type | Retention | Archive |
|----------|-----------|---------|
| Application | 30 days | S3 |
| Audit | 7 years | Glacier |
| Access | 90 days | S3 |
| Error | 1 year | S3 |
