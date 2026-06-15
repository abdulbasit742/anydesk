# RemoteDesk Trace Correlation

## Trace Structure
```
Request (trace_id: abc123)
  |-- API Handler (span_id: def456)
  |     |-- Auth Middleware (span_id: ghi789)
  |     |-- DB Query (span_id: jkl012)
  |     |-- Cache Lookup (span_id: mno345)
  |     |-- WebSocket Emit (span_id: pqr678)
```

## Propagation
```typescript
// Extract trace from incoming request
const traceId = req.headers["x-trace-id"] || generateTraceId();

// Propagate to downstream services
const headers = { "x-trace-id": traceId };
fetch("https://internal-service/api", { headers });

// Include in logs
logger.info("Processing request", { traceId, spanId });
```

## Context Fields
| Field | Source | Example |
|-------|--------|---------|
| trace_id | Request header or generated | abc123-def456 |
| span_id | Current operation | span_789 |
| parent_id | Parent span | span_456 |
| user_id | Auth context | user_123 |
| org_id | Auth context | org_456 |
| desk_id | Session context | 123456789 |

## Tools
- OpenTelemetry for instrumentation
- Jaeger for trace visualization
- Correlation in Kibana/Grafana

## Query Examples
```
# Find all spans for a trace
trace_id = "abc123-def456"

# Find slow DB queries
operation = "db.query" AND duration > 100ms

# Find errors for a user
user_id = "user_123" AND status = "error"
```
