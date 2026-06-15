# Migration from Prototype Guide

## Assessment
1. Inventory existing prototype data
2. Map user accounts
3. Document custom configurations
4. Identify integration points

## Migration Steps
```
Phase 1: Parallel Setup
  -> Deploy RemoteDesk alongside prototype
  -> Configure SSO to work with both
  -> Migrate user accounts

Phase 2: Pilot Migration
  -> Select pilot group (5-10 users)
  -> Migrate pilot data
  -> Run parallel for 2 weeks
  -> Collect feedback

Phase 3: Full Migration
  -> Schedule maintenance window
  -> Migrate remaining users
  -> Update DNS
  -> Decommission prototype
```

## Data Migration Script
```bash
# Export from prototype
node scripts/export-prototype-data.js --source=old-db > prototype-export.json

# Transform and import
node scripts/import-to-remotedesk.js --input=prototype-export.json --org=new-org
```

## Rollback Plan
Keep prototype running for 48 hours post-migration. DNS TTL set to 300s.
