# Performance QA Documentation

## Performance Budgets
| Metric | Target | Budget |
|--------|--------|--------|
| First Contentful Paint | < 1.5s | 2s |
| Largest Contentful Paint | < 2.5s | 3s |
| Time to Interactive | < 3.5s | 5s |
| API Response (p50) | < 100ms | 200ms |
| API Response (p95) | < 500ms | 1s |
| API Response (p99) | < 1s | 2s |

## Load Test Scenarios
### Normal Load
- 100 concurrent users
- 10 sessions/minute
- 1 hour duration

### Peak Load
- 500 concurrent users
- 50 sessions/minute
- 2 hour duration

### Spike Test
- 0 to 1000 users in 30 seconds
- Sustained for 10 minutes
- Measure recovery time

## Performance Regression
```bash
# Compare current vs baseline
npm run perf:baseline -- --output=baseline.json
npm run perf:current -- --output=current.json
npm run perf:compare -- baseline.json current.json

# Fail CI if regression > 10%
```

## Profiling
```bash
# CPU profiling
node --prof server.js
node --prof-process isolate-*.log > profile.txt

# Memory profiling
node --inspect server.js
# Chrome DevTools -> Memory tab
```
