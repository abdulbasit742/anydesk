# Backup Verification

## Monthly Verification Process
1. **Restore test** to isolated environment
2. **Data integrity check** - row counts match
3. **Application smoke test** against restored DB
4. **Document results**

## Verification Checklist
- [ ] Backup file is not corrupted (checksum matches)
- [ ] Database restores without errors
- [ ] Row counts match production (within 1%)
- [ ] Key queries return expected results
- [ ] Application starts against restored DB
- [ ] API health check passes
- [ ] Restoration time documented

## Automated Verification
```bash
#!/bin/bash
# scripts/verify-backup.sh
./scripts/restore.sh "$1"
psql $TEST_DATABASE_URL -c "SELECT COUNT(*) FROM users;"
psql $TEST_DATABASE_URL -c "SELECT COUNT(*) FROM devices;"
curl -f http://localhost:4000/health
```

## Escalation
If verification fails:
1. Alert on-call engineer
2. Create incident ticket
3. Investigate root cause
4. Take new backup if needed
