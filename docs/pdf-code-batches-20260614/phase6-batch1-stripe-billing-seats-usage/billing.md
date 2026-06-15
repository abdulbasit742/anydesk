# Billing, Seats & Usage


## Plans
free / pro / business defined in `PLANS` (shared). Each sets seats, max concurrent
sessions, monthly session-minute cap (-1 = unlimited), and whether unattended access is allowed.


## Stripe flow
1. `POST /billing/checkout` â†’ returns a Stripe Checkout URL for the chosen tier.
2. User pays; Stripe fires `checkout.session.completed` â†’ webhook upgrades the org's subscription.
3. `customer.subscription.updated/deleted` keep status + tier in sync (cancel â†’ back to free).
4. The webhook route uses the **raw body** (mounted before `express.json`) for signature verification.


## Enforcement
`enforcePlan('seat' | 'usage' | 'unattended')` middleware blocks actions past plan limits
(SEAT_LIMIT_REACHED / USAGE_LIMIT_REACHED / PLAN_FORBIDS_FEATURE). Wire `req.orgId` upstream.


## Metering
When a session ends, its minutes are recorded via `usageService.record` (hooked into the
audit log). `GET /billing/:orgId/usage` returns the current period's usage + remaining.


## Config
Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`. Without them, billing endpoints throw
BILLING_NOT_CONFIGURED and the app still runs (self-host / free mode).
