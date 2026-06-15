# Email Templates

## Available Templates
- `session-start.ts`: Session started notification
- `login-alert.ts`: New login detected
- `billing.ts`: Invoice paid, trial ending
- `security.ts`: 2FA disabled, password changed

## Customization
Templates support HTML and plain text versions.
Variables are passed as function parameters.

## Adding New Templates
1. Create new file in `templates/`
2. Export function returning `{ subject, body, html }`
3. Wire into notification service
