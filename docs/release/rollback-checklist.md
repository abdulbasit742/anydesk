# RemoteDesk Rollback Checklist

## Rollback Triggers
- Error rate > 1% for 5 minutes
- P50 latency > 2x baseline
- Critical feature broken
- Data integrity issue
- Security vulnerability detected

## Rollback Steps

### 1. Decision (0-2 minutes)
- [ ] Incident commander declares rollback
- [ ] Notify team in #incidents
- [ ] Update status page

### 2. Preparation (2-5 minutes)
- [ ] Identify last stable version
- [ ] Verify database compatibility
- [ ] Prepare rollback commands

### 3. Database Rollback (if needed)
```bash
# Check if migration needed
kubectl exec -it db-pod -- psql -c \"\\dt\"

# Run down migration if available
npx prisma migrate resolve --rolled-back \"migration_name\"

# Or restore from backup (worst case)
pg_restore --clean --if-exists latest_backup.dump
```

### 4. Application Rollback (5 minutes)
```bash
# Kubernetes
kubectl set image deployment/api api=remotedesk/api:v${PREVIOUS_VERSION}
kubectl set image deployment/web web=remotedesk/web:v${PREVIOUS_VERSION}

# Verify rollback
kubectl rollout status deployment/api
kubectl rollout status deployment/web
```

### 5. Verification (5-10 minutes)
- [ ] Health checks pass
- [ ] Error rate normal
- [ ] Latency normal
- [ ] Critical paths work
- [ ] Smoke tests pass

### 6. Communication
- [ ] Update status page
- [ ] Notify customers
- [ ] Post-mortem scheduled
- [ ] Document lessons learned

## Rollback Targets
| Situation | Rollback Target |
|-----------|----------------|
| Bad deploy | Previous version |
| DB migration issue | Pre-migration backup |
| Config issue | Previous config |
| Dependency issue | Lock file version |

## Post-Rollback
- Fix forward in separate branch
- Thorough testing
- Plan new release
