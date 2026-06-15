# Api Production Hardening Guide

Replace in-memory API repositories with Prisma implementations, then mount routes behind existing auth and role middleware.

## Review Gates

- Confirm imports match the current repository.
- Do not overwrite working runtime files blindly.
- Keep native input disabled by default.
