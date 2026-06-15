# Data Deletion Procedure

## Types of Deletion
1. **Account deletion** - Full user-initiated removal
2. **Data purge** - Admin-initiated cleanup
3. **Retention expiry** - Automated cleanup

## Account Deletion Steps
1. User initiates deletion from account settings
2. Re-authentication required
3. 7-day grace period (account recoverable)
4. After grace period:
   - Soft delete: Mark account as deleted
   - Queue for hard deletion (30 days)
   - Cancel active subscriptions
   - Remove from organizations
   - Anonymize audit logs (retain action, remove PII)
5. Hard delete:
   - Remove user record
   - Cascade delete devices, sessions
   - Remove from backup rotation after 30 days

## Verification
- Confirm deletion via API
- Check database for residual data
- Verify audit log anonymization
- Confirm Stripe customer data deletion request

## Exceptions
- Legal hold: Retain data with legal approval
- Billing records: Retain for 7 years (anonymized)
- Aggregate analytics: Retain if fully anonymized
