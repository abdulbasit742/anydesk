# Web dashboard final routing

This document is part of the additional RemoteDesk production hardening pack.

## Purpose

Move the project from feature scaffolding toward production review readiness without enabling unsafe unattended control.

## Checklist

- Verify auth and role checks.
- Verify audit events are emitted.
- Verify sensitive data is redacted.
- Verify desktop features degrade safely when data channel or permissions are missing.
- Verify billing and plan limits fail closed.
- Verify tests and manual QA are run before release.
