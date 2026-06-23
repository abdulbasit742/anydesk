# Production Blockers (Core/Backend)

The following items strictly block the `anydesk` repository from being considered production-ready.

## 1. Missing Core Functionality
The application cannot perform remote desktop operations. The WebRTC signaling layer, native screen capture, and native input injection are missing or replaced with `noop` placeholders.

## 2. API Typecheck Failures
The `apps/api` application fails TypeScript compilation (`npx tsc`) with 23 errors. These are primarily caused by missing mock packages (e.g., `pack7`, `pack9`) and Prisma type mismatches (`JsonValue`). The API cannot be safely built or deployed until these are resolved.

## 3. Incomplete RBAC
While basic JWT authentication exists, robust Role-Based Access Control (RBAC) is not enforced across all API routes. This is a critical security vulnerability if deployed.

## 4. Missing Infrastructure Integration
The application requires a PostgreSQL database, Redis for Socket.IO scaling, and a Coturn server for WebRTC. None of these integrations are fully configured or tested in a production-like environment.

## 5. Desktop Client Code Signing
The Electron desktop client lacks code signing configuration for Windows (Authenticode/EV) and macOS (Developer ID). Distributing unsigned binaries will result in severe OS warnings and blocked installations.

## 6. Lack of End-to-End Tests
There is no automated test suite verifying the critical path: Device Enrollment -> Session Initiation -> WebRTC Connection -> Graceful Disconnect.
