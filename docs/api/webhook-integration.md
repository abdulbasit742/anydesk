# Webhook Integration

## Stripe Webhooks
Endpoint: `POST /billing/webhook`
- Verifies Stripe signature
- Handles subscription lifecycle
- Idempotent processing

## Required Events
Configure in Stripe Dashboard:
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Signature Verification
Uses `STRIPE_WEBHOOK_SECRET` environment variable.

## Custom Webhooks (Future)
Customer-facing webhooks for:
- Session events
- Device events
- Security alerts
