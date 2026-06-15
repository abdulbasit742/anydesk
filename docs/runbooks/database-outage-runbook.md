# Database Outage Runbook

## Symptoms
- API returning 500/503
- Connection timeouts
- High connection wait times
- Replication lag

## Diagnosis

### Check Database Status
```bash
# Connection count
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Active queries
psql -c "SELECT pid, query, state, now() - query_start AS duration
         FROM pg_stat_activity
         WHERE state = 'active'
         ORDER BY duration DESC
         LIMIT 10;"

# Lock waits
psql -c "SELECT * FROM pg_locks WHERE NOT granted;"

# Replication lag
psql -c "SELECT extract(epoch from now() - pg_last_xact_replay_timestamp()) AS lag;"
```

### Check Resources
```bash
# CPU/Memory
top -p $(pgrep postgres)

# Disk I/O
iostat -x 1

# Disk space
df -h /var/lib/postgresql
```

## Common Issues

### Connection Pool Exhausted
- Scale application instances down temporarily
- Increase max connections (if safe)
- Kill idle connections

### Long-Running Queries
```sql
-- Identify and terminate
SELECT pg_terminate_pid(pid)
FROM pg_stat_activity
WHERE query_start < now() - interval '5 minutes'
  AND state = 'active';
```

### Disk Full
```bash
# Check largest tables
psql -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
         FROM pg_tables
         ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
         LIMIT 10;"

# Vacuum if needed
psql -c "VACUUM ANALYZE;"
```

### Primary Failure
1. Promote replica to primary
2. Update connection strings
3. Verify application connectivity
4. Plan primary recovery

## Escalation
- L1: Connection/query issues
- L2: Hardware/resource issues
- L3: Corruption/data loss
