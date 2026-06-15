# RemoteDesk Custom Role Contracts

## Role Definition Schema
```typescript
interface CustomRole {
  id: string;
  orgId: string;
  name: string;
  description: string;
  permissions: PermissionGrant[];
  scope: "global" | "team" | "device";
  createdAt: Date;
}

interface PermissionGrant {
  permission: string;
  access: "grant" | "deny" | "inherit";
  conditions?: PermissionCondition[];
}
```

## Pre-defined Enterprise Roles
| Role | Description | Key Permissions |
|------|-------------|-----------------|
| IT Admin | Full IT management | devices.manage, policies.manage, audit.view |
| Security Admin | Security-focused | policies.manage, audit.view, alerts.manage |
| Help Desk | Support staff | sessions.view, remote_input, chat.send |
| Viewer | Read-only | sessions.view, devices.view |
| Host | Can be remote-controlled | host.allow, unattended.allow |

## Role Assignment Rules
- A user can have multiple roles
- Deny always wins over grant
- Role assignments are auditable
- Time-bound assignments supported (temporary admin)

## API
```
POST /api/v1/roles           - Create role
GET  /api/v1/roles           - List roles
PUT  /api/v1/roles/:id       - Update role
POST /api/v1/users/:id/roles - Assign role
```
