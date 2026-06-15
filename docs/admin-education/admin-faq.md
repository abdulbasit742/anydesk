# Admin FAQ

**Q: How do I reset a user's password?**\nA: Users -> Select user -> "Reset Password". They will receive an email link.

**Q: Can I see user's screen without them knowing?**\nA: No. All session access requires user acceptance or explicit policy override (which is logged).

**Q: How do I force 2FA for all users?**\nA: Admin Dashboard -> Security -> MFA -> "Require for all users"

**Q: What happens when I delete a user?**\nA: Their account is deactivated. Their session history is preserved for audit. Their desk ID is released.

**Q: Can I transfer data between users?**\nA: No. User data is isolated. Export and import manually if needed.

**Q: How do I set up SSO?**\nA: Admin Dashboard -> Security -> SSO. Upload SAML metadata or configure OIDC.

**Q: What are the different roles?**\nA: Super Admin (full access), Admin (most access), Help Desk (support only), User (no admin).

**Q: How do I restrict access by IP?**\nA: Admin Dashboard -> Security -> IP Restrictions. Enter allowed IP ranges.

**Q: Can I customize the retention period?**\nA: Audit logs: 7 years (fixed). Session recordings: configurable 30-365 days.

**Q: How do I get compliance reports?**\nA: Admin Dashboard -> Reports -> Compliance. Export as PDF for auditors.

**Q: What is the break-glass procedure?**\nA: Emergency admin access when SSO fails. Requires two admins to approve. Heavily logged.

**Q: How do I contact support as an admin?**\nA: support@remotedesk.io with [ADMIN] in subject. Priority routing for admin issues.
