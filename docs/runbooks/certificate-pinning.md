# Certificate Pinning Runbook

## Mobile Apps
- Pin to specific certificate
- Include backup pin
- Update before expiry

## Rotation
1. Add new pin alongside old
2. Wait for app update distribution
3. Remove old pin after 90 days

## Emergency Rotation
If private key compromised:
1. Revoke old certificate
2. Issue new certificate
3. Push emergency app update
