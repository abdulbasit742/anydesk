# Troubleshooting Admin Issues

## Cannot Access Admin Dashboard
1. Verify you have admin role
2. Check if admin access is IP-restricted
3. Clear browser cache
4. Try different browser
5. Contact super admin if role missing

## User Management
### Cannot Add User
- Check seat limit on current plan
- Verify email is not already in use
- Check if SCIM is managing users
- Enterprise: may need HR approval

### Cannot Remove User
- User has active sessions -> end them first
- User is team owner -> transfer ownership
- Audit trail preserves user actions
- GDPR: use deletion workflow for full removal

## Policy Not Applied
1. Policy inheritance may override
2. Check policy scope (global vs team)
3. User may have explicit exception
4. Changes take effect on next session
5. Clear policy cache if available

## Audit Log Issues
- Logs are read-only (cannot delete)
- Search supports date range, user, action
- Export available in JSON/CSV/PDF
- Retention: 7 years (enterprise)
- Access requires audit_view permission

## SSO Configuration
- SAML: Upload metadata XML
- OIDC: Provide client ID, secret, issuer
- Test with "Test Configuration" button
- Enable after successful test
- Have backup admin account (in case SSO breaks)
