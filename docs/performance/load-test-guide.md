# Load Testing Guide

## Tools
- **k6**: Primary load testing tool
- **Grafana k6 Cloud**: Managed option
- **k6 Operator**: Kubernetes-native

## Running Tests
```bash
# API load test
k6 run docs/performance/api-load-test.ts

# With custom parameters
k6 run -e BASE_URL=https://staging-api.remotedesk.io docs/performance/api-load-test.ts

# Socket load test
k6 run -e WS_URL=wss://staging-api.remotedesk.io docs/performance/socket-load-test.ts
```

## Scenarios
| Scenario | VUs | Duration | Purpose |
|----------|-----|----------|---------|
| Smoke | 10 | 1m | Verify test works |
| Load | 100 | 10m | Baseline performance |
| Stress | 500 | 10m | Find breaking point |
| Spike | 1000 | 2m | Sudden traffic test |
| Soak | 100 | 1h | Memory leak detection |

## Interpreting Results
- p95 < 500ms: Good
- p95 500-1000ms: Acceptable
- p95 > 1000ms: Investigate
- Error rate < 1%: Good
- Error rate > 5%: Critical
