# Incident Response

## Severity Levels
| Level | Description | Response Time |
|-------|-------------|---------------|
| P0 | Complete outage | 15 minutes |
| P1 | Critical functionality impaired | 1 hour |
| P2 | Degraded performance | 4 hours |
| P3 | Minor issue | 24 hours |

## Runbook: API Down
1. Check health endpoint: `curl /health/detailed`
2. Check container status: `docker-compose ps`
3. Check logs: `docker-compose logs -f api`
4. Check database: `docker-compose exec postgres pg_isready`
5. If DB issue: Check disk space, connection limits
6. If app issue: Restart containers
7. Escalate if not resolved in 15 min

## Runbook: High Error Rate
1. Check error logs for patterns
2. Check recent deployments
3. Check dependent services (DB, Redis, Stripe)
4. Consider rollback if correlated with deploy
5. Enable circuit breakers if available

## Communication
- P0/P1: Notify on-call engineer immediately
- P2: Create incident channel, notify team
- P3: Create ticket for next sprint

## Post-Incident
1. Write incident report within 24h
2. Identify root cause
3. Create action items
4. Review in next team meeting
