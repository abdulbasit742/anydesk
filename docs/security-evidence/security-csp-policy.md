# Content Security Policy

## Policy String
```
default-src 'self';
script-src 'self' 'nonce-{nonce}';
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data:;
connect-src 'self' https://api.remotedesk.io wss://signaling.remotedesk.io;
font-src 'self';
media-src 'self' blob:;
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

## WebRTC Specific
- `blob:` needed for MediaStream recordings
- `wss:` needed for Socket.IO signaling
- No `unsafe-eval` (no inline scripts)
