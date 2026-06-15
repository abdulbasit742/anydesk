# Admin Operations Guide

## Accessing Admin Panel
- Requires `admin` or `superadmin` role
- Navigate to `/admin` after login
- Route guards enforce role checks

## User Management
- Search users by email, name, or status
- View user details including devices and sessions
- Suspend users with reason logging
- All actions are audit logged

## Device Management
- Search devices by name or RemoteDesk ID
- View device details and history
- Delete devices (irreversible)

## Session Monitoring
- Real-time active session list
- Auto-refreshes every 10 seconds
- Admin can terminate sessions

## Audit Logs
- Filter by event type
- Export capability (CSV)
- 90-day retention default

## System Health
- Memory usage, uptime metrics
- Version information
- Auto-refreshes every 15 seconds
