# Audit Export & SSO/SAML


## Tamper-evident audit log
- Org-wide events recorded via `orgAuditLog.record` across categories (auth/session/device/access/billing/org).
- Each entry stores a SHA-256 `hash` over its canonical content + the previous entry's hash â†’ a chain.
- `verifyChain()` detects any insertion, deletion, or edit (the hashes stop linking).
- Export: `GET /orgs/:orgId/audit/export?format=csv|json&from=&to=&category=` (owner/admin only).


## SAML 2.0 SSO (Business tier)
- Owner configures the IdP (entityId, SSO URL, cert) via `PUT /orgs/:orgId/sso` - gated behind the plan check +
`billing:manage`.
- IdP POSTs the signed assertion to the ACS endpoint `POST /sso/:orgId/acs`.
- We verify the RSA-SHA256 signature against the IdP cert, JIT-provision the user, add them to the org with
`defaultRole`, and return our JWT.

 - `enforced` mode (config flag) blocks password login for the org's domains so SSO is mandatory.


 ## Notes
 - Real deployments should use a hardened SAML lib for XML canonicalization (c14n) + replay protection (assertion IDs,
 NotOnOrAfter). The signature verification + attribute extraction here is the core; wrap it with that lib in production.
 - SCIM-lite (`ScimUserDto`) is defined for later: push deprovisioning from the IdP.
