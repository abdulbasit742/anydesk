# Admin Console & RBAC

## Roles
- **owner** - full control incl. billing + org delete (exactly one, the creator).
- **admin** - manage members, devices, grants; no billing/delete.
- **member** - use the product; no team management.


Permissions are a pure map in `@remotedesk/shared` (`can(role, permission)`), shared
by server enforcement and client UI gating so they never drift.


## Membership flow
1. Owner/admin invites by email â†’ time-boxed invite token (7-day TTL).
2. Invitee accepts (`POST /invites/:token/accept`) â†’ joins with the invited role.
3. Role changes + removals guarded: can't modify the owner, can't escalate above your own rank.


## Billing portal
`POST /billing/portal` returns a Stripe Billing Portal URL (owner-only via `billing:manage`)
so customers manage cards/invoices/cancellation in Stripe's hosted UI.

## Org context
`orgContext` middleware resolves the caller's role for `:orgId` and rejects non-members,
so every team route is both authenticated and authorized.
