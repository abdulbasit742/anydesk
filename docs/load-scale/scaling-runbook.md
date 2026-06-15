# RemoteDesk Scaling Runbook

## Horizontal Scaling
### Scale Up (Increase Capacity)
```bash
# Kubernetes
kubectl scale deployment remotedesk-api --replicas=10

# AWS ECS
aws ecs update-service --cluster remotedesk --service api --desired-count 10

# Verify
kubectl get pods -l app=remotedesk-api
watch -n 1 'curl -s http://localhost:4000/metrics | grep http_requests_total'
```

### Scale Down (Decrease Capacity)
```bash
# Ensure graceful shutdown
kubectl scale deployment remotedesk-api --replicas=3
# Wait for old pods to terminate
```

## Database Scaling
### Read Replica
```sql
-- Route read queries to replica
SET default_transaction_read_only = ON;
```

### Connection Pool
```typescript
const pool = new Pool({
  max: 20, // per instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Cache Scaling
### Redis Cluster
```bash
redis-cli --cluster create \
  10.0.1.10:6379 10.0.1.11:6379 10.0.1.12:6379 \
  --cluster-replicas 1
```

## Emergency Scaling
```bash
# When under DDoS
# 1. Enable rate limiting (stricter)
# 2. Scale API 3x
# 3. Enable WAF rules
# 4. Notify on-call
```

## Capacity Triggers
| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| CPU | > 60% | > 80% | Scale up |
| Memory | > 70% | > 85% | Scale up |
| DB connections | > 70% | > 90% | Add pool |
| Response time | > 500ms | > 2s | Scale + investigate |
| Error rate | > 1% | > 5% | Rollback |
