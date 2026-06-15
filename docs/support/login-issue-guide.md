# Troubleshooting Login Issues

## Forgot Password
1. Go to https://remotedesk.io/forgot-password
2. Enter email address
3. Check inbox for reset link
4. Click link and set new password
5. Password must be 8+ chars with uppercase, lowercase, number

## Account Locked
- After 5 failed attempts, account locks for 30 minutes
- Contact support or wait for auto-unlock
- Admin can unlock immediately from dashboard

## MFA Issues
| Issue | Solution |
|-------|----------|
| Lost authenticator | Use backup codes or contact admin |
| TOTP code not working | Sync device time (NTP) |
| New phone | Re-scan QR code in settings |
| MFA not prompting | Clear browser cache, try incognito |

## SSO Issues
- Verify SAML/OIDC configuration with admin
- Check IdP logs for errors
- Ensure clock sync between IdP and RemoteDesk
- Contact IT admin for enterprise accounts
