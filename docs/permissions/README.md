# Desktop Permissions

## Permission Types
- **remote_input**: Mouse and keyboard control
- **clipboard**: Copy/paste sharing
- **file_transfer**: File send/receive
- **unattended_access**: Access without approval

## States
- **prompt**: Ask user on first use
- **granted**: Allowed (session or permanent)
- **denied**: Blocked

## Consent Flow
1. Feature requests permission
2. Check store for existing decision
3. If prompt, show ConsentPrompt UI
4. User grants/denies
5. Audit logged
6. Feature proceeds or blocked

## Reset
- Per-device reset on disconnect
- All permissions can be reset in settings
- Audit trail preserved

## Security
- Default state is 'prompt' (most restrictive)
- Deny always wins over grant
- Session-granted expires after 24h
