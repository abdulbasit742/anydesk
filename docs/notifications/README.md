# Notifications System

## Types
- **In-app**: Real-time bell icon dropdown
- **Email**: SMTP/SES-based (skeleton)
- **Push**: FCM/APNs for mobile (skeleton)

## Events
- session_start: Remote session started
- session_end: Remote session ended
- login: New device/IP login
- billing: Invoice, payment, subscription events
- security: 2FA changes, password changes, suspicious activity

## Preferences
Users can enable/disable each notification type individually.
Default: all enabled.

## Email Setup
Configure environment variables:
```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
```
