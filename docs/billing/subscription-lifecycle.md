# Subscription Lifecycle

## States
- `incomplete` → Payment required
- `active` → Fully active
- `past_due` → Payment retry
- `canceled` → Ended
- `unpaid` → Grace period expired

## Transitions
- Trial → Active (payment method added)
- Active → Past Due (payment failed)
- Past Due → Active (payment succeeds)
- Past Due → Unpaid (retries exhausted)
- Active → Canceled (user cancellation)

## Plan Changes
- Upgrades: Prorated immediately
- Downgrades: Applied at period end
- All changes audit logged
