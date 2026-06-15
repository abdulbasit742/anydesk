# Billing Integration

## Overview

Stripe-powered billing with 4 plan tiers: Free, Pro, Business, Enterprise.

## Plan Limits

| Feature | Free | Pro | Business | Enterprise |
|---------|------|-----|----------|------------|
| Concurrent sessions | 1 | 3 | 10 | Unlimited |
| Max session duration | 60min | 8h | Unlimited | Unlimited |
| Devices | 2 | 10 | 50 | Unlimited |
| File transfer | 100MB | 500MB | 2GB | Unlimited |
| Unattended access | No | Yes | Yes | Yes |
| Session recording | No | No | Yes | Yes |

## Stripe Integration

- Checkout sessions for subscription creation
- Customer portal for management
- Webhook handlers for state changes
- Invoice payment failure handling

## Webhooks

- `checkout.session.completed`: Activate subscription
- `invoice.payment_failed`: Downgrade to free
- `customer.subscription.deleted`: Clean up

## Implementation

- API: `apps/api/src/modules/billing/`
- Web: `apps/web/app/dashboard/billing/page.tsx`
- Contracts: `packages/shared/src/billing/`
