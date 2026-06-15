# Admin QA Checklist

## Release QA
- [ ] User list loads (< 2s for 1000 users)
- [ ] User search works (name, email)
- [ ] User suspension works immediately
- [ ] User reactivation works
- [ ] Role changes take effect

- [ ] Device list loads
- [ ] Device filtering works
- [ ] Device removal works
- [ ] Session list loads
- [ ] Session termination works
- [ ] Audit log loads
- [ ] Audit log filtering works
- [ ] Audit log export works

- [ ] Billing dashboard loads
- [ ] Plan changes sync to Stripe
- [ ] Invoice list loads
- [ ] Refund processing works

## Security QA
- [ ] Non-admin cannot access admin routes
- [ ] Admin routes require auth
- [ ] Audit log shows admin actions
- [ ] Sensitive operations require re-auth

## Performance QA
- [ ] Page loads < 3s
- [ ] Tables sort correctly
- [ ] Filters apply quickly
- [ ] Exports complete in < 30s
