# Admin Permission Model

## Roles
- `superadmin`: Full access to all endpoints
- `admin`: Access based on permission list
- `support`: Limited read access + ticket management

## Permission Strings
- `admin:users:read` - View user list/details
- `admin:users:write` - Update user info
- `admin:users:suspend` - Suspend/unsuspend users
- `admin:devices:read` - View device list/details
- `admin:devices:delete` - Remove devices
- `admin:sessions:read` - View active sessions
- `admin:sessions:monitor` - Real-time session monitoring
- `admin:audit:read` - View audit logs
- `admin:system:read` - View system health
- `admin:tickets:read` - View support tickets
- `admin:tickets:write` - Manage support tickets
