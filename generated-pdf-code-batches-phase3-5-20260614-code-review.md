# Phase 3/4/5 PDF Code Batches Code Review - 2026-06-14

## Phase 3 Batch 1 - Auth & Identity

Status: **review-only**.

The current API already has working auth routes, token helpers, password hashing, user lookup, and device password support. The generated auth batch uses a different folder layout and DTO structure, so copying it would risk breaking existing desktop/web login.

Useful later ideas:

- Pairing DTOs and pairing tests can be ported once the current API route conventions are extended.
- Auth validation schemas can be consolidated into shared contracts after the current API surface stabilizes.

## Phase 4 Batch 1 - CI, Playwright E2E & Release Packaging

Status: **docs imported, raw workflows review-only**.

The extracted GitHub Actions YAML has indentation damage from PDF extraction. It was not copied. The CI/release docs were imported.

Useful later ideas:

- Create fresh GitHub workflows from current package scripts.
- Add Playwright only after the web app has stable e2e fixtures.
- Add Electron packaging once desktop build works locally with a full Node/npm toolchain.

## Phase 4 Batch 2 - Observability + Docker Deploy

Status: **partially ported**.

Ported:

- API request ID middleware.
- `/healthz` and `/readyz` health endpoints.
- Web Dockerfile.

Skipped:

- Extracted logger code because PDF extraction split the newline string incorrectly.
- Raw app/server replacements because the current Express server is smaller and already wired to Socket.IO.

## Phase 4 Batch 3 - Security Hardening + K8s Manifests

Status: **partially ported**.

Ported:

- Security headers middleware.
- HTTP rate limiter middleware.
- Clean Kubernetes manifests based on the generated intent but with corrected indentation and current API port/probe paths.

Skipped:

- Raw YAML copied from PDF because indentation was invalid.
- Env/config replacement because the current env module is already simple and working.

## Phase 4 Batch 4 - Postgres + Prisma Persistence

Status: **docs imported, runtime review-only**.

The current Prisma schema already exists and is tied to the current auth/session/subscription routes. The generated schema replacement was not copied.

Useful later ideas:

- Add migrations incrementally for audit logs, support tickets, unattended access grants, and usage metrics.
- Avoid full schema replacement.

## Phase 5 Batch 1 - Signaling Server + Redis Fan-out

Status: **docs imported, Redis deploy manifest added, runtime review-only**.

The current Socket.IO signaling server already supports auth, presence, connection requests, offer/answer/ICE, and session end. Redis fan-out is valuable, but replacing the socket layer now would be risky.

Useful later ideas:

- Add Redis adapter incrementally to the existing Socket.IO server.
- Keep current event names and desktop client contracts stable.

## Phase 5 Batch 4 - Unattended Access + Wake-on-LAN

Status: **helper-only runtime port**.

Ported:

- Access schedule evaluator.
- Wake-on-LAN MAC normalization and magic packet builder.

Skipped:

- Access grant routes/repositories and PIN service because they need schema, audit logging, and explicit security review before enabling unattended access.
