# Regression Checklist

Run before every release.

## Authentication
- [ ] Registration (valid, duplicate, invalid)
- [ ] Login (valid, invalid, locked)
- [ ] Logout (clears session)
- [ ] Token refresh
- [ ] 2FA setup and use

## Session
- [ ] Host accepts session
- [ ] Host rejects session
- [ ] Viewer connects
- [ ] Viewer disconnects
- [ ] Host disconnects
- [ ] Multi-monitor support
- [ ] Quality adjustment

## Desktop
- [ ] App launches on Windows/macOS/Linux
- [ ] System tray integration
- [ ] Auto-start option
- [ ] Update notification
- [ ] Crash recovery

## Web
- [ ] Dashboard loads
- [ ] Device list updates
- [ ] Connect form validation
- [ ] Video stream displays
- [ ] Toolbar functions

## Enterprise
- [ ] Org creation
- [ ] Member invitation
- [ ] Role assignment
- [ ] Policy enforcement
- [ ] Audit log completeness

## Integrations
- [ ] Stripe webhooks
- [ ] Email delivery
- [ ] API key authentication
