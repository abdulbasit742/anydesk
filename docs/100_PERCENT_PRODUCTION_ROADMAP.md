# 100% Production Roadmap (Core/Backend)

This roadmap outlines the exact remaining steps required to move the `anydesk` core repository from its current state (architected and partially implemented) to a 100% production-ready state.

## Already Complete (75-90%)
*   **Architecture & Contracts:** The shared contracts (`packages/shared`) for sessions, devices, auth, and observability are deeply defined and robust.
*   **API Foundation:** Express server, Prisma schema, basic routing, request ID propagation, and safe logging are implemented.
*   **Desktop Skeleton:** Electron IPC bridges, tray icon, and renderer architecture are established.

## Demo-Ready (50%)
*   **Device & Session APIs:** Basic CRUD operations exist but rely heavily on mock data or lack full integration with the signaling layer.
*   **Socket.IO Skeleton:** The server exists and can authenticate, but complex session routing is not fully wired.

## Partially Implemented (25-50%)
*   **RBAC & Auth:** JWT validation exists, but deep team-based permission checks are missing from most routes.
*   **Audit Logging:** Contracts exist, but the middleware to automatically intercept and log mutations to the database is incomplete.

## Placeholder / Dry-Run (25%)
*   **Remote Input:** Desktop client has a `noopInputExecutor`. Native OS input injection is strictly dry-run for safety.
*   **Clipboard & File Transfer:** Contracts exist, but the native desktop implementation is a dry-run placeholder.

## Requires Infrastructure
*   **WebRTC Signaling:** Requires a production Coturn (STUN/TURN) deployment for NAT traversal.
*   **Database:** Requires a managed PostgreSQL instance (e.g., Supabase, AWS RDS) with connection pooling (PgBouncer).
*   **Caching/PubSub:** Requires Redis for Socket.IO multi-node scaling and rate limiting.

## Requires Security Review
*   **Native Input Injection:** Must be audited by a security professional before enabling the real `platformInputExecutor`.
*   **Clipboard Access:** Must be reviewed for data exfiltration risks.

## Requires Legal Review
*   **Consent Flows:** Ensure the screen-sharing and remote-control consent dialogs meet regional privacy laws (GDPR, CCPA).

## Requires Desktop Installer Signing
*   **Windows/macOS:** The Electron app must be signed with valid EV/Apple Developer certificates to prevent OS warnings (SmartScreen, Gatekeeper).

## Requires Real QA & Deployment
*   **End-to-End Testing:** Cypress/Playwright tests must be written to verify the full device pairing and session connection flow.
*   **CI/CD:** GitHub Actions pipelines must be created to automate the build, test, and release process for the API and Desktop clients.
