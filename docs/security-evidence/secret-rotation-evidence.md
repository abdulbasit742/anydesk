# RemoteDesk Secret Rotation Evidence

## Rotation Log
| Secret | Last Rotated | Next Rotation | Method |
|--------|:------------:|:-------------:|--------|
| DB Password | 2026-06-01 | 2026-09-01 | Automated |
| JWT Secret | 2026-06-01 | 2026-09-01 | Automated |
| TURN Secret | 2026-06-01 | 2026-09-01 | Automated |
| API Master Key | 2026-05-15 | 2026-08-15 | Manual |
| SSL Certificate | 2026-05-20 | 2026-08-18 | Auto (certbot) |

## Evidence
- [x] Rotation script executed successfully
- [x] All services restarted with new secrets
- [x] Zero downtime during rotation
- [x] Health checks passed post-rotation
- [x] Old secrets invalidated after 24h grace

## Verification Commands
```bash
# Verify DB connection with new password
psql $DATABASE_URL -c "SELECT 1"

# Verify JWT signing with new secret
curl -H "Authorization: Bearer $(./scripts/generate-test-jwt.sh)" \
  https://api.remotedesk.io/sessions

# Verify TURN credentials
turnutils_uclient -u test -w $(cat /secrets/turn-secret) turn.remotedesk.io
```
