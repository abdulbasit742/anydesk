# Database Migration Checklist

## Before Migration
- [ ] Review schema changes
- [ ] Test migration on staging
- [ ] Create database backup
- [ ] Schedule maintenance window
- [ ] Notify users of downtime

## During Migration
- [ ] Enable maintenance mode
- [ ] Run backup
- [ ] Apply migrations: `npm run db:migrate`
- [ ] Verify migration success
- [ ] Run smoke tests
- [ ] Disable maintenance mode

## After Migration
- [ ] Monitor error rates
- [ ] Verify application health
- [ ] Check data integrity
- [ ] Notify users migration complete
- [ ] Document any issues

## Rollback Plan
- [ ] Database backup available
- [ ] Previous version deployable
- [ ] Rollback procedure documented
- [ ] Team notified of rollback steps
