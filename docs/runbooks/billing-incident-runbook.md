# Billing Incident Runbook

## Common Scenarios

### Failed Payments (Multiple Customers)
1. Check payment processor status
2. Verify our payment configuration
3. Check for rate limiting
4. If processor down: retry queue

### Incorrect Charges
1. Identify scope (how many affected)
2. Stop incorrect billing job
3. Calculate refunds
4. Issue credits/refunds
5. Notify affected customers
6. Fix billing logic

### Subscription Sync Issues
1. Check webhook delivery
2. Verify subscription state
3. Reconcile with payment processor
4. Manual fix for affected accounts

## Contacts
| Service | Contact |
|---------|---------|
| Stripe | https://status.stripe.com |
| Support | billing@remotedesk.io |
| On-call | pagerduty escalation |
