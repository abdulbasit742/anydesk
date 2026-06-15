# Data Export Procedure

## Purpose
Allow users to export their personal data in a structured, machine-readable format.

## Scope
All data related to a specific user account.

## Export Contents
- Account information (email, name)
- Device list and settings
- Session history (metadata only)
- Organization memberships
- Audit logs involving the user
- Billing history (subscription status)

## Procedure
1. User requests export via dashboard or support
2. Verify identity (re-authentication required)
3. Generate export package (JSON format)
4. Encrypt package with user-provided password
5. Provide secure download link (24h expiry)
6. Log export in audit log

## SLA
- Export generation: within 24 hours
- Download availability: 24 hours
- Maximum file size: 1GB (split if larger)

## Security
- Export encrypted at rest
- Download link single-use
- Access logged and audited
- No email delivery (security risk)
