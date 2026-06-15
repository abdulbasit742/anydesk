# Administrator Guide

## Accessing Admin Panel
Navigate to `/admin` after logging in with an admin account.

## Dashboard
- View total users, devices, and active sessions
- Monitor system health
- Recent activity overview

## User Management
### Searching Users
- Search by email or name
- Filter by status (active, suspended, pending)
- Pagination for large result sets

### User Actions
- View user details including devices and sessions
- Suspend/unsuspend accounts
- Update user information
- View user timeline (tickets, sessions, devices)

## Device Management
### Searching Devices
- Search by name or RemoteDesk ID
- Filter by platform and status

### Device Actions
- View device details
- Delete devices
- View device session history

## Session Monitoring
- Real-time active session list
- Auto-refreshes every 10 seconds
- Shows host/client information
- Admin can terminate sessions

## Audit Logs
- Filter by event type
- Export to CSV/JSON
- 90-day default retention
- Security events: 365-day retention

## Support Tickets
- View all support tickets
- Filter by status and priority
- Assign tickets to support staff
- Add internal notes

## System Health
- Memory usage
- Uptime
- API version
- Auto-refreshes every 15 seconds

## Security
- All admin actions are audit logged
- Require `admin` or `superadmin` role
- Permission checks on all endpoints
- Session timeout applies to admins
