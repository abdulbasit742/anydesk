# DNS Failover Runbook

## Failover Steps
1. Update Route53 health checks
2. Switch to secondary region
3. Update DNS records
4. Verify propagation
5. Monitor traffic

## Rollback
Reverse the steps above.
TTL is 60 seconds for quick rollback.
