# RemoteDesk Admin Permission Matrix

## Matrix
| Action | Super Admin | IT Admin | Security Admin | Billing Admin | Help Desk |
|--------|:-----------:|:--------:|:--------------:|:-------------:|:---------:|
| Manage Users | X | X | | | |
| Manage Admins | X | | | | |
| Manage Devices | X | X | X | | |
| View Sessions | X | X | X | | X |
| Join Sessions | X | | | | X |
| Manage Policies | X | | X | | |
| View Audit Logs | X | | X | | |
| Manage Billing | X | | | X | |
| View Reports | X | X | X | X | |
| Configure SSO | X | | X | | |
| Manage Webhooks | X | X | | | |
| Export Data | X | | X | | |
| API Access | X | X | | | |

## Legend
- X = Granted
- Empty = Denied
- Conditional = With restrictions

## Special Permissions
| Permission | Description |
|------------|-------------|
| sudo | Can impersonate any user (super admin only) |
| audit_immunity | Actions not logged (no user has this) |
| cross_org | Can access multiple orgs (platform admin) |

## Permission Checking
```typescript
function hasPermission(user: User, permission: string, resource?: string): boolean {
  if (user.role === "super_admin") return true;
  const rolePerms = ROLE_MATRIX[user.role];
  return rolePerms.includes(permission);
}
```
