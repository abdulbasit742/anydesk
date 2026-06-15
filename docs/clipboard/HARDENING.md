# Clipboard Hardening

## Size Limits
- Max text: 100,000 characters
- Max image: 5 MB
- Max total payload: 10 MB
- Automatic truncation with ellipsis

## Secret Detection
- API keys and tokens
- Private keys
- Credit card numbers
- Social Security numbers
- URLs with embedded credentials
- Configurable blocking (enabled by default)

## Loop Prevention
- Tracks recently sent content
- Skips echo within 2-second window
- Hash-based deduplication
- 5-second history window

## Sync Cooldown
- Minimum 500ms between syncs
- Burst detection (3 in 2s triggers cooldown)
- Prevents clipboard flooding

## Permission Reset
- All permissions revoked on disconnect
- Per-session permission model
- Disabled by default

## Events
- `clipboard:sync-request` - Sync initiated
- `clipboard:sync-blocked` - Sync prevented
- `clipboard:secret-detected` - Secret found
- `clipboard:permission-changed` - Permissions updated
