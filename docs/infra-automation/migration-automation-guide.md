# RemoteDesk Migration Automation Guide

## Schema Migrations
```bash
# Generate migration
npx prisma migrate dev --name add_session_recording

# Apply in production
npx prisma migrate deploy

# Verify
npx prisma migrate status
```

## Data Migrations
```typescript
// migrations/20240612_migrate_user_roles.ts
import { prisma } from "../lib/prisma";

export async function migrateUserRoles() {
  const users = await prisma.user.findMany({ where: { role: "legacy_admin" } });
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "admin" },
    });
  }
  console.log(`Migrated ${users.length} users`);
}
```

## Migration Checklist
- [ ] Migration tested in staging
- [ ] Backup taken before migration
- [ ] Rollback script prepared
- [ ] Migration runs in transaction
- [ ] Post-migration tests pass
- [ ] Application restarted
- [ ] Health checks verified
