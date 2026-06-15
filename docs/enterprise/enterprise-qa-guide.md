# Enterprise QA Guide

## Test Areas
1. **Organization CRUD** - Create, read, update, delete orgs
2. **Team Management** - Members, roles, invitations
3. **RBAC** - Permission enforcement across roles
4. **Policies** - Device, session, security, DLP policies
5. **Audit Logs** - Logging, filtering, retention
6. **Admin Guards** - Route protection, role verification

## RBAC Matrix
| Action | OWNER | ADMIN | MEMBER |
|--------|-------|-------|--------|
| Manage org | Yes | No | No |
| Invite members | Yes | Yes | No |
| Remove members | Yes | Yes | No |
| Manage billing | Yes | No | No |
| Read devices | Yes | Yes | Yes |
| Write policies | Yes | Yes | No |
| Read audit | Yes | Yes | No |

## Running Tests
```bash
npm run test --workspace=@remotedesk/api -- --testPathPattern=enterprise
```
