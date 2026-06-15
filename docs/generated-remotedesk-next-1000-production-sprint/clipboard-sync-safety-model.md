# Clipboard Sync Safety Model

Clipboard sync is disabled by default, text-only, size-limited, loop-protected, and blocks likely secrets before transmission.

## Review Gates

- Confirm imports match the current repository.
- Do not overwrite working runtime files blindly.
- Keep native input disabled by default.
