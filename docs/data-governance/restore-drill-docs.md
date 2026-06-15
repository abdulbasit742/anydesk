# RemoteDesk Restore Drill Documentation

## Drill Schedule
| Type | Frequency | Scope |
|------|-----------|-------|
| Table restore | Monthly | Single table |
| Database restore | Quarterly | Full database |
| Full system | Bi-annually | Complete infrastructure |

## Drill Process

### 1. Planning
- Select restore target (random table/database)
- Notify team
- Prepare verification scripts
- Document expected data state

### 2. Execution
```bash
# 1. Identify backup to restore
aws s3 ls s3://remotedesk-backups/db/ | sort | tail -5

# 2. Execute restore
./scripts/restore-database.sh s3://remotedesk-backups/db/db_20260612.dump

# 3. Verify
./scripts/verify-restore.sh --table=sessions --count-check --data-check
```

### 3. Verification
- [ ] Row counts match
- [ ] Sample data correct
- [ ] Referential integrity intact
- [ ] Application can connect
- [ ] End-to-end test passes

### 4. Documentation
- Actual RTO measured
- Actual RPO measured
- Issues encountered
- Improvements identified

## Drill Results Template
```markdown
# Restore Drill - YYYY-MM-DD

## Scope
Type: Full database restore
Source: db_YYYYMMDD.dump

## Execution
Started: HH:MM
Completed: HH:MM
Actual RTO: N minutes

## Verification
- [ ] Row counts: PASS/FAIL
- [ ] Data integrity: PASS/FAIL
- [ ] App connectivity: PASS/FAIL
- [ ] E2E test: PASS/FAIL

## Issues
| Issue | Severity | Resolution |
|-------|----------|------------|

## Improvements
| Improvement | Priority | Owner |
|-------------|----------|-------|

## Sign-off
- [ ] SRE Lead
- [ ] Engineering Manager
```

## Failure Criteria
Drill fails if:
- RTO exceeds SLA by > 25%
- Data corruption detected
- Application cannot connect
- Any PII exposure

## Escalation
Failed drills escalate to:
1. SRE Lead (immediate)
2. VP Engineering (within 1 hour)
3. Post-mortem within 48 hours
