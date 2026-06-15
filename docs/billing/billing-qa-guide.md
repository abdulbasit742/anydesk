# Billing QA Guide

## Test Scenarios
1. **Checkout Flow** - Stripe Checkout session creation, redirect, completion
2. **Portal Flow** - Customer portal access, subscription management
3. **Trial Flow** - Trial start, reminder, expiry, conversion
4. **Past Due Flow** - Payment failure, grace period, suspension
5. **Cancel/Resume** - Cancellation at period end, immediate reactivation
6. **Plan Gates** - Feature availability per plan, limit enforcement

## Webhook Testing
```bash
# Forward Stripe webhooks locally
stripe listen --forward-to localhost:4000/webhooks/stripe
```

## Test Cards
| Number | Result |
|--------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 9995 | Decline |
| 4000 0025 0000 3155 | 3D Secure required |

## Fixtures
Use `apps/api/tests/fixtures/billing.ts` for consistent test data.
