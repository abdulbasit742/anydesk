# Production Runbook

## On-Call Procedures

### Service Degradation
1. Check system health: `GET /health`
2. Review error rates in monitoring
3. Check database connection pool
4. Verify Redis connectivity
5. Review recent deployments

### API Down
1. Check container status: `docker ps`
2. Review logs: `docker logs remotedesk-api-1`
3. Check database: `docker exec remotedesk-db-1 pg_isready`
4. Restart if needed: `docker compose restart api`

### Database Issues
1. Check connection count: `SELECT count(*) FROM pg_stat_activity;`
2. Check replication lag (if applicable)
3. Review slow query log
4. Scale connection pool if needed

### WebRTC Connection Failures
1. Verify Coturn is running
2. Check TURN credentials
3. Review ICE server configuration
4. Check firewall rules

### High Error Rate
1. Identify error source from logs
2. Check if correlated with deployment
3. Consider rollback if needed
4. Enable debug logging

## Rollback Procedures

### API Rollback
```bash
docker compose pull api
docker compose up -d api
```

### Database Rollback
```bash
bash infra/scripts/restore.sh <backup_timestamp>
```

### Full Rollback
```bash
docker compose down
# Restore database
bash infra/scripts/restore.sh <timestamp>
docker compose up -d
```

## Emergency Contacts
- Engineering Lead: [REDACTED]
- DevOps: [REDACTED]
- Stripe Support: https://support.stripe.com

## Escalation
1. L1: On-call engineer (15 min response)
2. L2: Engineering lead (30 min response)
3. L3: Full team paged (1 hour response)
