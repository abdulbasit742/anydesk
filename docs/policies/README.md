# Enterprise Policies

## Available Policies
- **force_2fa**: Require all org members to use 2FA
- **disable_clipboard**: Block clipboard sync in sessions
- **disable_file_transfer**: Block file transfers
- **restrict_remote_input**: Require approval for remote input
- **require_recording**: Record all sessions
- **device_allowlist**: Only approved devices allowed

## Enforcement
Policies are checked at session start and during session.
Violations are audit logged.

## Defaults
All policies are disabled by default.
