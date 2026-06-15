# Reconnection Policy

## Strategy
Exponential backoff with jitter:
- Attempt 1: 1s
- Attempt 2: 2s
- Attempt 3: 4s
- ... up to 30s max
- Max 10 attempts before giving up

## ICE Restart
Triggered when:
- ICE connection state fails
- DTLS transport errors
- Network change detected

Max 3 ICE restart attempts per session.

## Capture Restart
- Max 5 restarts per session
- 10s cooldown between attempts
- Resets on successful capture
