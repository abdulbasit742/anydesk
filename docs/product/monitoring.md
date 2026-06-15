# Monitoring Strategy

## Metrics
- Request rate and latency (P50, P95, P99)
- Error rate by endpoint
- Active WebRTC sessions
- Database connection pool
- Redis memory usage
- CPU and memory per service

## Alerting
- High error rate (> 5% 5xx)
- API down
- Database connections high (> 80)
- Disk space low (< 10%)
- Memory usage high (> 90%)

## Dashboards
- Overview: Key metrics
- API: Endpoint performance
- WebRTC: Session quality
- Infrastructure: System resources
- Business: Users, sessions, revenue

## Log Aggregation
- Structured JSON logging
- Correlation IDs for request tracing
- Error tracking (Sentry integration planned)
- Audit log monitoring

## Health Endpoints
- `/health` - General health
- `/health/db` - Database connectivity
- `/health/cache` - Redis connectivity
- `/health/webrtc` - TURN server connectivity
