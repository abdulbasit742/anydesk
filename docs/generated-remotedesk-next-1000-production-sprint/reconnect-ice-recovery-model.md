# Reconnect Ice Recovery Model

Reconnect uses visible state, bounded backoff, safe ICE restart if exposed, and explicit failed state when recovery cannot safely proceed.

## Review Gates

- Confirm imports match the current repository.
- Do not overwrite working runtime files blindly.
- Keep native input disabled by default.
