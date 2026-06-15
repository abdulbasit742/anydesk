# Secret Rotation Procedure

## Schedule
| Secret | Rotation Frequency |
|--------|-------------------|
| JWT signing key | Every 90 days |
| Database password | Every 180 days |
| Stripe API keys | Every 365 days |
| Webhook secrets | Every 90 days |
| API keys | On demand / after incident |

## JWT Key Rotation
1. Generate new key
2. Update API to accept both old and new keys (grace period: 24h)
3. Force re-authentication for all users
4. Remove old key after grace period

## Database Password Rotation
1. Create new DB user with same permissions
2. Update application config
3. Restart application instances
4. Revoke old user

## Emergency Rotation
If secret is compromised:
1. Immediately rotate
2. Revoke all active sessions
3. Notify affected users
4. Post-incident review

## Automation
Consider automating with:
- AWS Secrets Manager
- HashiCorp Vault
- 1Password Secrets Automation
