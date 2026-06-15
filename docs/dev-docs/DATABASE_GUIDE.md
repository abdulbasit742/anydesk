# Database Development Guide

## Schema
Defined in `apps/web/db/schema.ts`

## Migrations
```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# Push schema (dev only)
npm run db:push

# Seed data
npx tsx db/seed.ts
```

## Adding a Table
```typescript
// db/schema.ts
export const myTable = mysqlTable('my_table', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Querying
```typescript
import { getDb } from '@/queries/connection';

const users = await getDb().query.users.findMany();

const user = await getDb().query.users.findFirst({
  where: (users, { eq }) => eq(users.id, userId),
});
```

## Best Practices
- Use type-safe queries
- Never use raw SQL
- Index foreign keys
- Use transactions for writes
- Add `createdAt`/`updatedAt` to all tables
