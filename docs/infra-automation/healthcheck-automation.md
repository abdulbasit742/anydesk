# RemoteDesk Health Check Automation

## Health Check Endpoints
| Endpoint | Purpose | Frequency |
|----------|---------|-----------|
| /health | Liveness | 30s |
| /ready | Readiness | 10s |
| /metrics | Prometheus | 15s |
| /health/deep | Deep check | 5min |

## Deep Health Check
```typescript
app.get("/health/deep", async (req, res) => {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkTURNServer(),
    checkExternalAPIs(),
  ]);
  const allHealthy = checks.every(c => c.healthy);
  res.status(allHealthy ? 200 : 503).json({ checks });
});
```

## Synthetic Monitoring
```bash
# Every 5 minutes from external monitor
curl -f https://remotedesk.io/health/deep
curl -f -X POST https://remotedesk.io/api/v1/auth/test
# WebRTC connectivity test
node scripts/webrtc-smoke-test.js
```
