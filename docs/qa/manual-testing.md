# Manual QA Scripts

## Authentication
1. Register new account → Should succeed, redirect to dashboard
2. Login with valid credentials → Should succeed
3. Login with invalid password → Should show error
4. Logout → Should redirect to login, protected pages inaccessible
5. Register with existing email → Should show error

## Session Flow
1. Copy RemoteDesk ID from host device
2. Enter ID on client → Session request sent
3. Host receives notification → Accept
4. Both see connected status
5. Client sees host screen
6. Disconnect from either side → Session ends cleanly

## Security
1. Enable 2FA → QR shown, verify works
2. Login with 2FA → Extra step required
3. Revoke trusted device → Must re-authenticate
4. View active sessions → Current session shown
5. Logout all other sessions → Other sessions invalidated

## Billing
1. View subscription → Current plan shown
2. View invoices → List loads
3. Cancel subscription → Status changes
4. Resume subscription → Status changes back

## Permissions
1. Request remote input → Host sees prompt
2. Deny permission → Client cannot control
3. Grant permission → Client can control
4. Disconnect → Permissions reset
