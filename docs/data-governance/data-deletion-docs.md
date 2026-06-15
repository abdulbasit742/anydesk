# RemoteDesk Data Deletion

## Types of Deletion

### User-Initiated
```
Settings -> Account -> Delete Account
```
- 30-day grace period
- Can cancel during grace period
- After grace: irreversible

### Admin-Initiated
```
Admin Dashboard -> Users -> Delete User
```
- Immediate effect
- Requires admin permission
- Audit logged

### Automated
- Retention period expired
- Daily cleanup job
- Soft delete -> hard delete

## Deletion Process
```
1. Mark for deletion
   - Set deleted_at timestamp
   - Remove from search/index
   - Revoke sessions

2. Soft delete (Day 0-30)
   - Data hidden from UI
   - Restorable by admin
   - Audit trail preserved

3. Hard delete (Day 30+)
   - PII permanently removed
   - Pseudonymized data retained for analytics
   - Audit trail preserved (hashed references)
   - Files removed from storage
```

## What Gets Deleted
| Data | Action | Timeline |
|------|--------|----------|
| Email | Overwritten with hash | 30 days |
| Name | Removed | 30 days |
| Password hash | Removed | 30 days |
| Sessions | Anonymized | 30 days |
| Messages | Deleted | 30 days |
| Files | Deleted | 30 days |
| Devices | Anonymized | 30 days |
| Audit logs | Hashed references kept | 7 years |

## What is Retained
- Anonymized analytics data
- Audit log entries (with hashed user ID)
- Billing records (as required by law)
- Support tickets (anonymized)

## Verification
```bash
# Verify deletion
GET /v1/user/:id/status
Response: { "status": "deleted", "deleted_at": "..." }
```
