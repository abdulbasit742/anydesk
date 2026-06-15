# Merge Checklist

Copy SAFE_DIRECT_COPY first, then review runtime modules, apply PATCHES manually, run tests, verify contextIsolation IPC, and run two-device QA.

## Review Gates

- Confirm imports match the current repository.
- Do not overwrite working runtime files blindly.
- Keep native input disabled by default.
