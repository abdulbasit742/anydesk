# RemoteDesk Observability Dashboards

## API Dashboard
Panels:
- Request rate (requests/second)
- Error rate (% by status code)
- Latency percentiles (p50, p95, p99)
- Active connections
- Rate limit hits

## WebRTC Dashboard
Panels:
- Active sessions
- Connection success rate
- Average session duration
- ICE candidate types (host/reflexive/relay)
- Bandwidth usage (per session)
- Frame rate distribution

## Infrastructure Dashboard
Panels:
- CPU usage by instance
- Memory usage by instance
- Disk I/O
- Network throughput
- Container restart count
- Pod health status

## Business Dashboard
Panels:
- Daily active users
- Sessions per day
- Average session duration
- New registrations
- Feature usage (file transfer, chat, etc.)
- Revenue (if applicable)

## Security Dashboard
Panels:
- Failed login attempts
- Rate limit triggers
- Suspicious IP addresses
- Permission denied events
- MFA adoption rate

## Dashboard URLs
- Production: https://grafana.remotedesk.io
- Staging: https://grafana-staging.remotedesk.io

## Access Control
- Engineering: All dashboards
- Support: Business + Security
- Management: Business only
- On-call: All dashboards (read-only)
