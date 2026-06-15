# RemoteDesk Build and Integration Feature Pack: Comprehensive QA Checklist

This document consolidates all quality assurance checklists and test plans for the RemoteDesk monorepo, covering build fixes, local setup, environment configurations, API, desktop, and web integration checks, two-client test harness, and debugging documentation. It aims to provide a holistic view of the testing required to ensure functionality, security, performance, and user experience across the entire application stack.

## 1. Build Readiness and Compile Blockers

Refer to the following documents for detailed checks:

*   **Build Readiness Checklist**: `docs/qa/build-readiness-checklist.md`
    *   Code Quality and Standards
    *   Testing Completion
    *   Configuration and Environment Setup
    *   Build Process Integrity
    *   Documentation Status
    *   Performance and Scalability Considerations
    *   Monitoring and Observability Setup
*   **Compile Blocker Checklist**: `docs/qa/compile-blocker-checklist.md`
    *   TypeScript Errors (e.g., `TS2307`, `TS2345`, `TS2532`, `TS7006`, `TS2741`, `TS1005`)
    *   Dependency Issues (missing `node_modules`, incorrect versions, missing `@types`)
    *   Configuration Errors (`tsconfig.json`, Vite/Webpack)
    *   Build Tool Errors (`electron-vite`, `next build`, `prisma generate`)
    *   File System Issues (case sensitivity, missing files)

## 2. Local Development Environment Setup

Refer to the following documents for detailed setup and verification:

*   **Windows PowerShell Run Guide**: `docs/development/windows-powershell-run-guide.md`
    *   Prerequisites (Git, Node.js, Yarn, Docker Desktop)
    *   Repository Cloning
    *   Dependency Installation
    *   Database Setup with Docker Compose
    *   Environment Variable Configuration
    *   Starting API, Web, and Desktop Services
*   **Environment Variables Guide**: `docs/development/env-vars.md`
    *   Root `.env.example.review` configuration
    *   API Service (`apps/api/.env.example.review`) configuration
    *   Web Dashboard (`apps/web/.env.example.review`) configuration
    *   Desktop Client (`apps/desktop/.env.example.review`) configuration
    *   Docker Environment (`docker-compose.env.example.review`) configuration
    *   Best Practices for Environment Variables

## 3. API Integration Checks

Refer to the following scripts and design document:

*   **API Health Check**: `scripts/checks/api-health-check.sh`
    *   Verify API service is running and returns HTTP 200 OK.
*   **API Authentication Endpoint Smoke Test**: `scripts/checks/api-auth-smoke-test.sh`
    *   Verify user signup and login functionality.
    *   Verify access to protected endpoints with a valid token.
*   **API User Endpoint Smoke Test**: `scripts/checks/api-user-smoke-test.sh`
    *   Verify fetching current user profile.
    *   Verify updating user profile (if applicable).
*   **API Session Endpoint Smoke Test**: `scripts/checks/api-session-smoke-test.sh`
    *   Verify fetching user sessions.
    *   (IDEA_ONLY) Verify session creation (if direct API call is supported).
*   **API Prisma Connection Check**: `scripts/checks/api-prisma-check.sh`
    *   Verify Prisma can connect to the configured database.
*   **API Redis Connection Check**: `scripts/checks/api-redis-check.sh`
    *   Verify Redis service is running and accessible.
*   **Socket Signaling Smoke Test Design**: `docs/qa/api/socket-signaling-smoke-test-design.md`
    *   Client connection and disconnection.
    *   `connect:request` and `connect:response` flow.
    *   WebRTC offer/answer/ICE exchange.
    *   `session:end` event handling.
    *   Error handling for malformed events.
*   **Test Data Seed Script Design**: `apps/api/scripts/test-data-seed-design.md`
    *   Verify script populates users, devices, sessions, etc.
    *   Verify idempotency of the seeding process.

## 4. Desktop Integration Checks

Refer to the following checklists and test plans:

*   **Desktop Startup Checklist**: `docs/qa/desktop/desktop-startup-checklist.md`
    *   Application Launch (no crashes, correct window display).
    *   Authentication and UI (login, RemoteDesk ID, device password).
    *   Core Functionality Initialization (screen picker, preview, WebRTC, DataChannel, chat, input toggles, emergency stop).
    *   Background Processes and Services.
    *   Network Connectivity to API and signaling server.
    *   Preload API Verification.
    *   Configuration Loading.
*   **Preload API Verification Checklist**: `docs/qa/desktop/preload-api-verification-checklist.md`
    *   General Preload API Structure (exposed functions, no direct Node/Electron access).
    *   Core Electron API Exposure (`getAppVersion`, `showOpenDialog`, etc.).
    *   Clipboard API Verification (`readClipboard`, `writeClipboard`, `onClipboardUpdate`, `onClipboardPermissionChange`).
    *   File Transfer API Verification (`requestFileTransfer`, `acceptFileTransfer`, `onFileTransferRequest`, etc.).
    *   Session Management API (if exposed).
    *   Event Handling and Cleanup.
*   **Screen Source Picker Test Plan**: `docs/qa/desktop/screen-source-picker-test-plan.md`
    *   List all available screens/windows accurately.
    *   Select primary/secondary monitors and application windows.
    *   Handle dynamic window changes.
    *   Picker responsiveness.
    *   Behavior with no available sources.
*   **Screen Capture Test Plan**: `docs/qa/desktop/screen-capture-test-plan.md`
    *   Local preview accuracy (static and dynamic content).
    *   Video stream quality (text, UI, high-motion).
    *   Handling screen resolution changes.
    *   Handling monitor disconnection/reconnection.
    *   Resource utilization during capture.
*   **WebRTC Peer Creation Test Plan**: `docs/qa/desktop/webrtc-peer-creation-test-plan.md`
    *   Successful peer connection establishment (Host and Viewer).
    *   ICE candidate exchange.
    *   Data channel creation.
    *   TURN server usage (if configured).
    *   Error handling during peer creation.

## 5. Web Integration Checks

Refer to the following checklist:

*   **Web Dashboard Smoke Checklist**: `docs/qa/web/web-dashboard-smoke-checklist.md`
    *   Core Navigation and Layout.
    *   Authentication Flow (login, signup, logout).
    *   Dashboard Page (summary info, widgets).
    *   Devices Page (list devices, add device).
    *   Sessions Page (list sessions).
    *   Settings Page (user profile, security settings).
    *   Error Handling.

## 6. Two-Client Local Test Harness

Refer to the following guide and checklist for end-to-end testing:

*   **Two-Client Local Test Harness Guide**: `docs/qa/two-client-local-test.md`
    *   Running two desktop clients (development instances).
    *   Host/Client account setup.
    *   Connect request flow.
    *   Accept/Reject flow.
    *   Screen stream flow.
    *   WebRTC ICE debugging (`chrome://webrtc-internals`).
    *   Local TURN fallback guide.
    *   Logs to collect.
*   **Two-Client Local Test Checklist**: `scripts/checks/two-client-checklist.md`
    *   Setup Verification.
    *   Connection Flow.
    *   Screen Streaming.
    *   WebRTC Functionality.
    *   Data Channel Features (Clipboard Sync & File Transfer).
    *   Remote Input (if enabled).
    *   Disconnection and Reconnection.
    *   Logging and Debugging.

## 7. Logging and Debugging

Refer to the following guides for troubleshooting and observability:

*   **API Debug Logging Guide**: `docs/observability/api-debug-logging-guide.md`
    *   Configuring logging levels (`LOG_LEVEL`).
    *   Express request logging (`morgan`).
    *   Socket.IO debug logging (`DEBUG` environment variable).
    *   Prisma query logging.
    *   Collecting logs.
*   **Desktop Renderer Debugging Guide**: `docs/observability/desktop-renderer-debug-guide.md`
    *   Accessing Developer Tools.
    *   Console Logging, Breakpoints, Network Monitoring.
    *   State Inspection, Preload API Interaction.
    *   Troubleshooting Tips.
*   **Electron Main Process Debugging Guide**: `docs/observability/electron-main-debug-guide.md`
    *   Launching with Debugger Attached (`--inspect` flag).
    *   Attaching a Debugger (VS Code, Chrome DevTools).
    *   Console Logging, Breakpoints.
    *   IPC Debugging.
    *   Native Module Interactions.
    *   Troubleshooting Tips.
*   **WebRTC Logging and Debugging Guide**: `docs/observability/webrtc-logs-guide.md`
    *   `chrome://webrtc-internals` analysis (API Trace, Stats Graphs, ICE Candidate Grid).
    *   Creating a `webrtc-internals` dump.
    *   Application-level logging for signaling and client-side events.
    *   Common WebRTC Issues and Log Signatures.
*   **Socket.IO Debugging Guide**: `docs/observability/socketio-debug-guide.md`
    *   Enabling Debug Logs (Server-side and Client-side).
    *   Monitoring Socket.IO Events (Server-side handlers, Client-side listeners).
    *   Network Tab in Browser DevTools (inspecting frames).
    *   Common Socket.IO Issues and Debugging Steps.
*   **Support Bundle Checklist**: `docs/troubleshooting/support-bundle-checklist.md`
    *   General Information (problem description, environment details).
    *   Logs (Desktop, API, Web, `webrtc-internals` dump).
    *   Configuration Files (`.env`, `docker-compose.yml`, `turnserver.conf`).
    *   Screenshots and Recordings.
    *   Network Information.
    *   Steps to Reproduce, Expected vs. Actual Behavior.
*   **Common Failure Matrix**: `docs/troubleshooting/common-failure-matrix.md`
    *   Symptoms/Error Messages, Potential Causes, Troubleshooting Steps for various issues.

## 8. Merge and Review Reports

Refer to the following documents for the final merge and review process:

*   **Codex Merge Runbook**: `docs/development/codex-merge-runbook.md`
    *   Understanding Generated Output.
    *   Preparing Environment.
    *   Integrating `SAFE_DIRECT_COPY` Files.
    *   Integrating `REVIEW_REQUIRED` Files (iterative process).
    *   Integrating `IDEA_ONLY` Files.
    *   Testing and Validation.
    *   Documentation and Final Review.
*   **Review Required Files**: `generated-build-integration-750-pack-review-required.md`
    *   Lists all files that require thorough review due to their critical nature.

This comprehensive checklist ensures that all aspects of the RemoteDesk build and integration are thoroughly tested and documented, leading to a stable and reliable application.
