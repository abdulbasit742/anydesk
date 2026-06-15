# Enterprise Bulk Operations

## Supported Bulk Actions
- Import users (CSV/SCIM)
- Update device groups
- Apply policy templates
- Revoke sessions
- Export audit logs

## CSV Format
```csv
email,name,role,team
alice@company.com,Alice,user,Engineering
bob@company.com,Bob,admin,IT
```

## SCIM Endpoints
```
GET    /scim/v2/Users
POST   /scim/v2/Users
PUT    /scim/v2/Users/:id
DELETE /scim/v2/Users/:id
```
