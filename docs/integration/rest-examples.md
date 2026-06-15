# REST API Examples

## Authentication
```bash
# Login
curl -X POST https://api.remotedesk.io/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

# Use token in subsequent requests
curl https://api.remotedesk.io/devices \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Devices
```bash
# List devices
curl https://api.remotedesk.io/devices \
  -H "Authorization: Bearer TOKEN"

# Create device
curl -X POST https://api.remotedesk.io/devices \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Laptop","os":"windows","version":"11"}'

# Get device
curl https://api.remotedesk.io/devices/123456789 \
  -H "Authorization: Bearer TOKEN"
```

## Billing
```bash
# Get plan
curl https://api.remotedesk.io/billing/plan \
  -H "Authorization: Bearer TOKEN"

# Create checkout
curl -X POST https://api.remotedesk.io/billing/checkout \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_123"}'
```

## Admin
```bash
# List users (admin only)
curl https://api.remotedesk.io/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# List audit logs
curl https://api.remotedesk.io/admin/audit-logs \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
