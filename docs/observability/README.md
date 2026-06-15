# Observability

## Correlation IDs
- Generated per request: `cid-{timestamp}-{random}`
- Propagated via `x-correlation-id` header
- Linked across HTTP, WebSocket, and session events

## Log Redaction
Sensitive fields automatically redacted:
- Passwords, tokens, secrets
- Email addresses
- Credit card numbers
- Social security numbers

## Diagnostics Export
- Browser info, WebRTC support
- Network conditions
- Performance metrics
- Recent errors
- Exportable as JSON file

## Metrics
- Request counts and latencies
- Active sessions
- WebSocket connections
- Error rates

## Health Endpoints
- `GET /api/health` - Basic health
- `GET /api/health/ready` - Readiness probe
- `GET /api/metrics` - Application metrics
