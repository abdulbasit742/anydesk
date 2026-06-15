# Policy Architecture

## Flow
1. Policy defined in admin UI
2. Stored in `organization_policy` table
3. Enforced via `PolicyEnforcer` class
4. Middleware checks on relevant endpoints
5. Violations logged to audit

## Priority
- User-level policies override org-level
- Team-level policies override org-level
- Deny always wins over allow

## Performance
Policies cached in Redis for 5 minutes.
Cache invalidated on policy change.
