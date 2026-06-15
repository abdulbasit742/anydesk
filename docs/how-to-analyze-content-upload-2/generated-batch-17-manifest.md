# RemoteDesk Batch 17 Generated Files Manifest

This document lists all the files generated as part of Batch 17 for the RemoteDesk SaaS project.

## Core Components
- `remotedesk/apps/api/auth.ts`
- `remotedesk/apps/api/prisma.schema`
- `remotedesk/apps/api/socket.ts`
- `remotedesk/packages/shared/remotedesk-ids.ts`
- `remotedesk/apps/web/dashboard.tsx`

## Area 1: Windows Desktop Distribution
- `remotedesk/docs/windows/installer.md`
- `remotedesk/apps/desktop/src/windows/nsis-config.nsi`
- `remotedesk/docs/windows/code-signing-guide.md`
- `remotedesk/docs/windows/firewall-notes.md`
- `remotedesk/docs/windows/accessibility-permission-notes.md`
- `remotedesk/docs/windows/uninstall-docs.md`
- `remotedesk/docs/windows/qa-checklist.md`
- `remotedesk/apps/desktop/src/windows/windows-distribution.test.ts`

## Area 2: macOS Desktop Distribution
- `remotedesk/docs/macos/dmg-docs.md`
- `remotedesk/docs/macos/code-signing-guide.md`
- `remotedesk/docs/macos/notarization-guide.md`
- `remotedesk/docs/macos/screen-recording-permission-guide.md`
- `remotedesk/docs/macos/accessibility-permission-guide.md`
- `remotedesk/docs/macos/privacy-prompts-docs.md`
- `remotedesk/docs/macos/qa-checklist.md`
- `remotedesk/apps/desktop/src/macos/macos-distribution.test.ts`

## Area 3: Linux Desktop Distribution
- `remotedesk/docs/linux/appimage-docs.md`
- `remotedesk/docs/linux/debian-package-notes.md`
- `remotedesk/docs/linux/wayland-x11-limitations.md`
- `remotedesk/docs/linux/screen-capture-notes.md`
- `remotedesk/docs/linux/input-permission-notes.md`
- `remotedesk/docs/linux/qa-checklist.md`
- `remotedesk/apps/desktop/src/linux/linux-distribution.test.ts`

## Area 4: Auto-update System
- `remotedesk/docs/auto-update/update-channel-contracts.md`
- `remotedesk/apps/desktop/src/auto-update/update-available-ui.tsx`
- `remotedesk/apps/desktop/src/auto-update/update-progress-ui.tsx`
- `remotedesk/apps/desktop/src/auto-update/update-error-ui.tsx`
- `remotedesk/docs/auto-update/release-metadata-docs.md`
- `remotedesk/docs/auto-update/rollback-notes.md`
- `remotedesk/docs/auto-update/qa-checklist.md`

## Area 5: Desktop Diagnostics
- `remotedesk/apps/desktop/src/diagnostics/diagnostics-collector.ts`
- `remotedesk/apps/desktop/src/diagnostics/system-info-collector.ts`
- `remotedesk/apps/desktop/src/diagnostics/network-info-collector.ts`
- `remotedesk/apps/desktop/src/diagnostics/webrtc-stats-exporter.ts`
- `remotedesk/apps/desktop/src/diagnostics/session-log-exporter.ts`
- `remotedesk/docs/desktop-diagnostics/diagnostics-zip-guide.md`
- `remotedesk/docs/desktop-diagnostics/privacy-redaction-docs.md`
- `remotedesk/apps/desktop/src/diagnostics/diagnostics.test.ts`

## Area 6: Remote Session Support Tools
- `remotedesk/apps/desktop/src/session-support/session-debug-panel.tsx`
- `remotedesk/apps/desktop/src/session-support/copy-session-diagnostics.ts`
- `remotedesk/apps/desktop/src/session-support/reconnect-action.ts`
- `remotedesk/apps/desktop/src/session-support/force-disconnect-action.ts`
- `remotedesk/apps/desktop/src/session-support/host-emergency-stop-action.ts`
- `remotedesk/apps/desktop/src/session-support/viewer-retry-connection-action.ts`
- `remotedesk/docs/remote-session-support/support-docs.md`
- `remotedesk/apps/desktop/src/session-support/support-tools.test.ts`

## Area 7: Admin Session Visibility
- `remotedesk/apps/web/src/admin/sessions/ActiveSessionsTable.tsx`
- `remotedesk/apps/web/src/admin/sessions/session.types.ts`
- `remotedesk/apps/web/src/admin/sessions/session.api.ts`
- `remotedesk/apps/web/src/admin/sessions/SessionDetailPage.tsx`
- `remotedesk/apps/api/src/admin/sessions/session.routes.ts`
- `remotedesk/docs/admin/session-visibility.md`
- `remotedesk/apps/web/src/admin/sessions/admin-session-visibility.test.ts`

## Area 8: Admin Device Visibility
- `remotedesk/apps/web/src/admin/devices/device.types.ts`
- `remotedesk/apps/web/src/admin/devices/DeviceInventoryPage.tsx`
- `remotedesk/apps/web/src/admin/devices/device.api.ts`
- `remotedesk/apps/web/src/admin/devices/DeviceDetailPage.tsx`
- `remotedesk/apps/api/src/admin/devices/device.routes.ts`
- `remotedesk/apps/web/src/admin/devices/DeviceHealthStatus.tsx`
- `remotedesk/docs/admin/device-visibility.md`
- `remotedesk/apps/web/src/admin/devices/admin-device-visibility.test.ts`

## Area 9: Enterprise Policy Enforcement
- `remotedesk/packages/shared/src/policy/policy.types.ts`
- `remotedesk/apps/api/src/policy/policy-evaluator.ts`
- `remotedesk/apps/desktop/src/policy/clipboard-policy-enforcement.ts`
- `remotedesk/apps/desktop/src/policy/file-transfer-policy-enforcement.ts`
- `remotedesk/apps/desktop/src/policy/input-control-policy-enforcement.ts`
- `remotedesk/apps/desktop/src/policy/max-session-duration-enforcement.ts`
- `remotedesk/apps/api/src/audit/policy-audit-events.ts`
- `remotedesk/docs/enterprise/policy-enforcement.md`
- `remotedesk/apps/desktop/src/policy/enterprise-policy-enforcement.test.ts`

## Area 10: SSO & Domain Readiness
- `remotedesk/packages/shared/src/sso/domain-verification.dto.ts`
- `remotedesk/apps/web/src/admin/sso/DomainVerificationUI.tsx`
- `remotedesk/packages/shared/src/sso/sso-provider-settings.dto.ts`
- `remotedesk/docs/sso/saml-oidc-docs.md`
- `remotedesk/docs/sso/sso-test-checklist.md`

## Area 11: API & Webhook Maturity
- `remotedesk/apps/api/src/api-keys/api-key-scopes.ts`
- `remotedesk/apps/api/src/api-keys/api-usage-logs.ts`
- `remotedesk/apps/api/src/webhooks/webhook-delivery-logs.ts`
- `remotedesk/docs/api-webhooks/api-webhook-maturity.md`
- `remotedesk/apps/web/src/admin/api-keys/ApiKeyManagementUI.tsx`
- `remotedesk/apps/web/src/admin/webhooks/WebhookManagementUI.tsx`
- `remotedesk/apps/api/src/api-keys/api-webhook-maturity.test.ts`

## Area 12: Notification System
- `remotedesk/packages/shared/src/notifications/notification.types.ts`
- `remotedesk/apps/api/src/notifications/notification.service.ts`
- `remotedesk/apps/web/src/notifications/NotificationCenter.tsx`
- `remotedesk/docs/notifications/notification-system.md`
- `remotedesk/apps/web/src/notifications/notification-system.test.ts`

## Area 13: Plan Limits & Billing
- `remotedesk/packages/shared/src/plan-limits/plan-limits.dto.ts`
- `remotedesk/apps/api/src/plan-limits/plan-limits.routes.ts`
- `remotedesk/apps/web/src/admin/plan-limits/PlanLimitsDashboard.tsx`
- `remotedesk/docs/plan-limits/plan-limits.md`

## Area 14: Security Events & Audit Logging
- `remotedesk/packages/shared/src/security-events/security-event.types.ts`
- `remotedesk/apps/api/src/security-events/security-event.service.ts`
- `remotedesk/apps/web/src/admin/security-events/SecurityEventsDashboard.tsx`
- `remotedesk/docs/security-events/security-events.md`

## Area 15: Privacy Controls & Compliance
- `remotedesk/packages/shared/src/privacy/privacy-settings.dto.ts`
- `remotedesk/apps/api/src/privacy/privacy.routes.ts`
- `remotedesk/apps/web/src/settings/privacy/UserPrivacySettingsUI.tsx`
- `remotedesk/apps/web/src/settings/privacy/OrganizationPrivacySettingsUI.tsx`

## Area 16: Release & Rollback
- `remotedesk/docs/release-rollback/release-process.md`
- `remotedesk/docs/release-rollback/rollback-strategy.md`
- `remotedesk/apps/api/src/release/release-notes.service.ts`
- `remotedesk/apps/api/src/release/release.types.ts`
- `remotedesk/apps/api/src/release/release-rollback.test.ts`

## Area 17: Incident Operations
- `remotedesk/apps/api/src/incident-management/incident.dto.ts`
- `remotedesk/apps/api/src/incident-management/incident.service.ts`
- `remotedesk/docs/incident-ops/incident-management.md`
- `remotedesk/apps/api/src/incident-management/incident-management.test.ts`

## Area 18: UX Polish
- `remotedesk/apps/web/src/ui/feedback/InAppFeedback.tsx`
- `remotedesk/apps/web/src/ui/onboarding/GuidedTour.tsx`
- `remotedesk/docs/ux-polish/ux-polish.md`
- `remotedesk/apps/web/src/ui/ux-polish.test.ts`

## Area 19: DX (Developer Experience)
- `remotedesk/docs/dx/dx-guide.md`
- `remotedesk/apps/api/src/sdk-generation/sdk-templates` (directory)

## Area 20: Final Artifacts
- `remotedesk/docs/final-artifacts/final-artifacts.md`
