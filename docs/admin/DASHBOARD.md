# Admin Dashboard

## Pages

### Overview (/admin)
- Summary cards: Users, Devices, Sessions, Alerts
- System health cards
- Quick stats with week-over-week changes

### Users (/admin/users)
- Searchable user table
- Filter by role, status
- Bulk actions (activate, deactivate, email)
- Export to CSV/JSON

### Devices (/admin/devices)
- Device inventory with RemoteDesk IDs
- Filter by type, OS, status
- View by user

### Sessions (/admin/sessions)
- Active and historical sessions
- Recording indicator
- Duration and participant info

### Audit Log (/admin/audit)
- Filter by action type, result, date
- Search by actor
- Export for compliance

### Settings (/admin/settings)
- Security policies
- Session timeout
- Feature toggles

## Components
- AdminLayout - Sidebar navigation
- AdminRouteGuard - Role-based access
- SystemHealthCards - Real-time metrics
- AdminTableSkeleton - Loading states
- AdminBulkActions - Multi-select actions
- AdminDataExport - CSV/JSON export
