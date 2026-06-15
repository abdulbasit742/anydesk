# Data Retention Jobs

## Automated Cleanup
Daily cron job at 3 AM UTC.

### Jobs
| Job | Table | Condition | Action |
|-----|-------|-----------|--------|
| expired_sessions | audit_logs | action=SESSION_* AND created_at < 90 days | Archive to S3, delete |
| old_audit_logs | audit_logs | created_at < 1 year | Archive to cold storage |
| soft_deleted_users | users | status=DELETED AND updated_at < 30 days | Hard delete cascade |
| expired_tokens | sessions | expires_at < now | Delete |
| failed_logins | (log table) | created_at < 30 days | Delete |

### SQL Examples
```sql
-- Archive old audit logs
INSERT INTO audit_logs_archive 
SELECT * FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Clean expired sessions
DELETE FROM sessions WHERE expires_at < NOW();
```

### Monitoring
- Job runs logged
- Row counts before/after
- Errors alerted via PagerDuty
- Run time tracked
