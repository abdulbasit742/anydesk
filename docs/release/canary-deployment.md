# Canary Deployment

## Process
1. Deploy to 5% of traffic
2. Monitor for 30 minutes
3. Increase to 25%
4. Monitor for 1 hour
5. Increase to 100%

## Abort Criteria
- Error rate > 0.5%
- Latency p95 > 1s
- Any P1 alert
