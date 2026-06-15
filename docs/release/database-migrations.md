# Database Migration Guide

## Principles
1. Backward compatible changes only
2. Add before removing
3. Test on copy of production data
4. Have rollback plan

## Process
1. Create migration: `prisma migrate dev --name add_column`
2. Test locally
3. Test on staging
4. Deploy with application
5. Verify

## Rollback
```bash
prisma migrate resolve --rolled-back 'migration_name'
```
