# RemoteDesk Build and Integration Feature Pack: Review Required Files

This document lists all files generated as part of the RemoteDesk Build and Integration Feature Pack that are marked as `REVIEW_REQUIRED` in the manifest. These files contain critical information, core logic, or configuration that requires thorough review and potential adaptation to your specific project policies, architectural patterns, and existing codebase before integration.

It is highly recommended to review these files in the context of your existing monorepo structure and development practices. Refer to the `generated-build-integration-750-pack-merge-guide.md` for detailed instructions on how to integrate these files.

## Files Marked as `REVIEW_REQUIRED`

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
