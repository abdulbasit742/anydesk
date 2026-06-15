# Stripe Webhook Configuration

## Required Events
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `payment_method.attached`
- `payment_method.detached`

## Security
- Webhook signature verified using `STRIPE_WEBHOOK_SECRET`
- Idempotency handled via Stripe event ID
- Events processed asynchronously where possible

## Error Handling
- Failed webhook events logged to error tracking
- Retry logic handled by Stripe (automatic)
- Dead letter queue for persistently failing events
