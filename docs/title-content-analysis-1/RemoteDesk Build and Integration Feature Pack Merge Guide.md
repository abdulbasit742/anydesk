# RemoteDesk Build and Integration Feature Pack Merge Guide

This guide provides instructions for integrating the generated build, local setup, environment, integration checks, test harness, and debugging documentation into the existing RemoteDesk monorepo.

## Overview of Generated Files

The generated pack includes:

*   **Build Fixes & Development Guides**: Located in `docs/development/` and `generated-build-fix-patches/`.
    *   `build-fix-guide.md`, `windows-powershell-run-guide.md`, `env-vars.md`, `codex-merge-runbook.md`
    *   `generated-build-fix-patches/001-fix-global-declaration.d.ts`
*   **Environment Files**: Located at the root and within `apps/api`, `apps/web`, `apps/desktop`.
    *   `.env.example.review`, `apps/api/.env.example.review`, `apps/web/.env.example.review`, `apps/desktop/.env.example.review`, `docker-compose.env.example.review`
*   **API Integration Checks**: Located in `scripts/checks/` and `docs/qa/api/`.
    *   `api-health-check.sh`, `api-auth-smoke-test.sh`, `api-user-smoke-test.sh`, `api-session-smoke-test.sh`, `api-prisma-check.sh`, `api-redis-check.sh`
    *   `socket-signaling-smoke-test-design.md`
    *   `apps/api/scripts/test-data-seed-design.md`
*   **Desktop Integration Checks**: Located in `docs/qa/desktop/`.
    *   `desktop-startup-checklist.md`, `preload-api-verification-checklist.md`, `screen-source-picker-test-plan.md`, `screen-capture-test-plan.md`, `webrtc-peer-creation-test-plan.md`
*   **Web Integration Checks**: Located in `docs/qa/web/`.
    *   `web-dashboard-smoke-checklist.md`
*   **Two-Client Local Test Harness**: Located in `docs/qa/` and `scripts/checks/`.
    *   `two-client-local-test.md`
    *   `two-client-checklist.md`
*   **Logging & Debugging Guides**: Located in `docs/observability/` and `docs/troubleshooting/`.
    *   `api-debug-logging-guide.md`, `desktop-renderer-debug-guide.md`, `electron-main-debug-guide.md`, `webrtc-logs-guide.md`, `socketio-debug-guide.md`
    *   `support-bundle-checklist.md`, `common-failure-matrix.md`
*   **Test Harness Foundation & Review Reports**: Located in `docs/qa/` and at the root.
    *   `testing-strategy.md`, `build-readiness-checklist.md`, `compile-blocker-checklist.md`, `integration-blocker-checklist.md`
    *   `generated-build-integration-750-pack-manifest.json`, `generated-build-integration-750-pack-merge-guide.md`, `generated-build-integration-750-pack-risk-register.md`, `generated-build-integration-750-pack-qa-checklist.md`, `generated-build-integration-750-pack-review-required.md`

## Merge Strategy

It is recommended to integrate these files incrementally, starting with documentation and configuration, then scripts, and finally reviewing patches.

### Step 1: Integrate Documentation and Configuration

1.  **Copy Files**: Copy all `.md` files from `docs/development/`, `docs/qa/`, `docs/observability/`, `docs/troubleshooting/` into their respective directories in your monorepo.
2.  **Copy Environment Examples**: Copy `.env.example.review` files to their specified locations. **Do not rename them to `.env` directly.** Use them as templates to create your actual `.env` files.
3.  **Review and Adapt**: Review the content of all documentation. Adapt them to your specific project context, existing standards, and any unique aspects of your setup. Pay close attention to the `env-vars.md` guide.

### Step 2: Integrate Scripts and Patches

1.  **Copy Scripts**: Copy all `.sh` scripts from `scripts/checks/` into your monorepo. Ensure they are executable (`chmod +x`).
2.  **Copy Patches**: Copy `generated-build-fix-patches/001-fix-global-declaration.d.ts` to a suitable location (e.g., `apps/desktop/src/types/` or `packages/shared/types/`).
3.  **Apply Patches**: For `.d.ts` files, ensure your `tsconfig.json` files are updated to include these new declaration files. For example, in `apps/desktop/tsconfig.json`, you might need to add the path to `include` array.
4.  **Review Patches**: The generated patches are minimal. Review them carefully to ensure they align with your project's architecture and do not introduce unintended side effects. Files marked `REVIEW_REQUIRED` are particularly important here.

### Step 3: Review and Implement Test Designs

1.  **Review Test Plans**: Go through `socket-signaling-smoke-test-design.md`, `test-data-seed-design.md`, and all test plans in `docs/qa/desktop/` and `docs/qa/web/`.
2.  **Implement Tests**: Use these designs to write actual test code in your `apps/api/tests/`, `apps/desktop/tests/`, `apps/web/tests/`, and `packages/shared/tests/` directories. Refer to `testing-strategy.md` for framework recommendations (Vitest/Jest).

### Step 4: Validate and Test

1.  **Run Build**: Attempt to build the entire monorepo (`npm run build` or `yarn build`). Address any compile blockers using `compile-blocker-checklist.md`.
2.  **Run Local Setup**: Follow `windows-powershell-run-guide.md` (or your OS equivalent) and `env-vars.md` to get all services running locally.
3.  **Execute Integration Checks**: Run the generated shell scripts in `scripts/checks/` to verify API health, authentication, and database/Redis connections.
4.  **Perform QA**: Systematically go through `desktop-startup-checklist.md`, `web-dashboard-smoke-checklist.md`, `two-client-checklist.md`, and other QA documents. Use `two-client-local-test.md` to set up and test host-viewer interactions.
5.  **Debug**: If issues arise, use the guides in `docs/observability/` and `docs/troubleshooting/` to diagnose and resolve problems.

## Important Considerations

*   **Environment Variables**: Always use the `.env.example.review` files as templates. **Never commit actual `.env` files with secrets to version control.**
*   **Security**: Pay extra attention to `REVIEW_REQUIRED` files, especially those related to security, IPC, and data handling. Ensure all security best practices are followed.
*   **TypeScript Strictness**: Continue to enforce and fix TypeScript strict mode issues as guided by `build-fix-guide.md`.
*   **Monorepo Tools**: If using tools like Turborepo, ensure your `turbo.json` is configured to run scripts efficiently across workspaces.

## Review Required Files

The following files are marked as `REVIEW_REQUIRED` in the manifest. These files contain critical information that must be thoroughly reviewed and potentially adapted to your specific project policies and architecture:

*   `docs/development/build-fix-guide.md`
*   `generated-build-fix-patches/001-fix-global-declaration.d.ts`
*   `docs/development/env-vars.md`
*   `.env.example.review`
*   `apps/api/.env.example.review`
*   `apps/web/.env.example.review`
*   `apps/desktop/.env.example.review`
*   `docker-compose.env.example.review`
*   `docs/qa/api/socket-signaling-smoke-test-design.md`
*   `apps/api/scripts/test-data-seed-design.md`
*   `docs/qa/desktop/desktop-startup-checklist.md`
*   `docs/qa/desktop/preload-api-verification-checklist.md`
*   `docs/qa/desktop/screen-source-picker-test-plan.md`
*   `docs/qa/desktop/screen-capture-test-plan.md`
*   `docs/qa/desktop/webrtc-peer-creation-test-plan.md`
*   `docs/qa/web/web-dashboard-smoke-checklist.md`
*   `docs/qa/two-client-local-test.md`
*   `scripts/checks/two-client-checklist.md`
*   `docs/observability/api-debug-logging-guide.md`
*   `docs/observability/desktop-renderer-debug-guide.md`
*   `docs/observability/electron-main-debug-guide.md`
*   `docs/observability/webrtc-logs-guide.md`
*   `docs/observability/socketio-debug-guide.md`
*   `docs/troubleshooting/support-bundle-checklist.md`
*   `docs/troubleshooting/common-failure-matrix.md`
*   `docs/qa/testing-strategy.md`
*   `docs/qa/build-readiness-checklist.md`
*   `docs/qa/compile-blocker-checklist.md`
*   `docs/qa/integration-blocker-checklist.md`
*   `docs/development/codex-merge-runbook.md`

By following this guide, you should be able to successfully integrate the new features and documentation into your RemoteDesk application.
