# Disaster Recovery Drill

## Schedule
Quarterly DR drill.

## Scenario: Database Corruption
### Timeline
| Time | Action |
|------|--------|
| T+0 | Detect corruption |
| T+15 | Alert team, stop writes |
| T+30 | Identify last good backup |
| T+45 | Start restore procedure |
| T+90 | Verify restored data |
| T+120 | Resume service |

### Steps
1. Stop API services
2. Announce maintenance window
3. Restore from backup: `./scripts/restore.sh /backups/latest.tar.gz`
4. Run migrations: `./scripts/migrate.sh`
5. Verify data integrity
6. Start API services
7. Monitor error rates

## Success Criteria
- RTO < 2 hours
- RPO < 1 hour (max data loss)
- All user data recoverable
- No configuration loss

## Post-Drill
1. Document actual RTO/RPO
2. Identify improvements
3. Update runbooks
4. Schedule next drill
