# RemoteDesk Billing

## Overview
Stripe-based billing with support for subscriptions, trials, and invoicing.

## Plans
- **Free**: 1 device, basic sessions
- **Basic**: 3 devices, session history
- **Pro**: 10 devices, file transfer, priority support
- **Enterprise**: Unlimited, SSO, dedicated support

## Environment Variables
```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_...
```

## Testing
Use Stripe test mode with card `4242 4242 4242 4242`.
