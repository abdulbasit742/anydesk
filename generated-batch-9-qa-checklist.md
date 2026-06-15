# QA Checklist - Batch 9

## Authentication & Security
- [ ] Registration with email/password
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] 2FA setup flow (QR code, verification)
- [ ] 2FA login flow
- [ ] Recovery codes generation and use
- [ ] Trusted devices list
- [ ] Revoke trusted device
- [ ] Active sessions list
- [ ] Revoke session
- [ ] Password policy configuration
- [ ] Security audit log

## Admin
- [ ] Admin dashboard loads
- [ ] User search by email/name
- [ ] User detail page
- [ ] Suspend/unsuspend user
- [ ] Device search
- [ ] Device detail page
- [ ] Delete device
- [ ] Active sessions monitor
- [ ] Audit log viewer with filters
- [ ] System health panel

## Support
- [ ] Create support ticket
- [ ] View ticket list
- [ ] Ticket detail page
- [ ] Add comment
- [ ] Add internal note (admin only)
- [ ] Change ticket status
- [ ] Assign ticket
- [ ] User timeline

## Billing
- [ ] View subscription
- [ ] Cancel subscription
- [ ] Resume subscription
- [ ] Change plan
- [ ] View invoice history
- [ ] View payment methods
- [ ] Trial banner displays
- [ ] Stripe webhook handling

## Compliance
- [ ] Export user data
- [ ] Request data deletion
- [ ] Consent banner
- [ ] Compliance status page

## Notifications
- [ ] Notification bell shows count
- [ ] Notification dropdown
- [ ] Mark as read
- [ ] Mark all as read
- [ ] Notification preferences

## Desktop
- [ ] Reconnection on disconnect
- [ ] ICE restart on failure
- [ ] Network quality monitoring
- [ ] Session watchdog
- [ ] Crash cleanup
- [ ] Diagnostics export
- [ ] Permission prompt
- [ ] Grant/deny permissions
- [ ] Permission reset on disconnect

## WebRTC Quality
- [ ] Stats collection
- [ ] Quality score calculation
- [ ] Quality trend charts
- [ ] Warning banner on poor quality
- [ ] Adaptive bitrate adjustment

## API
- [ ] All endpoints documented
- [ ] Auth endpoints work
- [ ] Rate limiting functional
- [ ] Error responses consistent

## Infrastructure
- [ ] Docker Compose starts
- [ ] Nginx routes correctly
- [ ] Database migrations run
- [ ] Backup script works
- [ ] Restore script works

## E2E
- [ ] Playwright auth tests pass
- [ ] Playwright dashboard tests pass
- [ ] Playwright billing tests pass
