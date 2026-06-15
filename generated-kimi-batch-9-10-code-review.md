# Kimi Batch 9 + 10 Runtime Code Review

## Decision

Runtime/shared code was not merged directly. The current app has working desktop capture and WebRTC session flow. Staged shared modules are useful, especially WebRTC utility helpers, but must be ported into the current contracts deliberately.

## Skipped Findings

| Batch | File | Staged bytes | Current exists | Current bytes | Recommendation |
|---|---|---:|---|---:|---|
| batch-10-next-400 | apps/web/.backend-features.json | 144 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/.dockerignore | 126 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/.env | 496 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/.env.example | 1365 | yes | 91 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/.env.production.example | 904 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/.gitignore | 462 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/.prettierignore | 310 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/.prettierrc | 310 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/auth-router.ts | 725 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/boot.ts | 1165 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/context.ts | 572 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/kimi/auth.ts | 3937 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/kimi/platform.ts | 712 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/kimi/session.ts | 1130 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/kimi/types.ts | 307 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/lib/cookies.ts | 462 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/lib/env.ts | 579 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/lib/http.ts | 1996 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/lib/response-wrapper.ts | 827 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/lib/vite.ts | 742 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/middleware.ts | 1083 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/middleware/observability.ts | 861 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/middleware/validation.ts | 916 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/queries/connection.ts | 447 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/queries/users.ts | 858 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/router.ts | 404 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/routers/base.ts | 716 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/routers/device.ts | 786 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/routers/index.ts | 180 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/routes/health.ts | 449 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/routes/metrics.ts | 339 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/api/routes/prometheus.ts | 670 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/components.json | 461 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/contracts/constants.ts | 335 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/contracts/errors.ts | 501 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/contracts/types.ts | 61 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/db/migrations/.gitkeep | 0 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/db/relations.ts | 27 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/db/schema.ts | 1258 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/db/seed.ts | 405 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/Dockerfile | 630 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/drizzle.config.ts | 378 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/eslint.config.js | 616 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/index.html | 297 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/info.md | 1385 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/package.json | 3601 | yes | 726 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/package-lock.json | 407231 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/postcss.config.js | 80 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/README.md | 2555 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/App.css | 606 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/App.tsx | 370 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminBulkActions.tsx | 1611 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminDataExport.tsx | 1343 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminLayout.tsx | 1507 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminPageHeader.tsx | 844 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminPagination.tsx | 1053 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminRouteGuard.tsx | 293 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminSearchInput.tsx | 967 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminStatusBadge.tsx | 1078 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/AdminTableSkeleton.tsx | 954 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/admin/SystemHealthCards.tsx | 2354 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/AuthLayout.tsx | 9039 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/AuthLayoutSkeleton.tsx | 1618 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/billing/BillingSettings.tsx | 1124 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/billing/InvoiceErrorState.tsx | 668 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/billing/InvoiceLoadingState.tsx | 668 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/billing/PaymentFailedBanner.tsx | 1241 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/billing/PlanCard.tsx | 1630 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/billing/PlanDowngradeWarning.tsx | 1449 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/billing/TrialBanner.tsx | 947 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/capture/CapturePermissionDialog.tsx | 1739 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/capture/QualityPresetSelector.tsx | 1372 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/capture/SourceRemovedNotification.tsx | 1125 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/clipboard/ClipboardAuditLog.tsx | 1815 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/clipboard/ClipboardStatusIndicator.tsx | 932 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/clipboard/ClipboardSyncToggle.tsx | 2130 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/clipboard/CooldownIndicator.tsx | 883 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/clipboard/SecretDetectedWarning.tsx | 1061 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/connection/ConnectionStatusBanner.tsx | 2350 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/connection/DuplicateRequestWarning.tsx | 817 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/connection/RejectedRequestDialog.tsx | 1493 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/connection/SessionCollisionAlert.tsx | 1335 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/errors/ErrorBanner.tsx | 1134 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/errors/ErrorBoundary.tsx | 1021 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/errors/ValidationErrorDisplay.tsx | 693 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/file-transfer/FileRiskWarningDialog.tsx | 1724 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/file-transfer/FileTransferQueue.tsx | 1271 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/file-transfer/IncomingFileConsentDialog.tsx | 2498 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/file-transfer/TransferProgress.tsx | 1434 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/input/EmergencyStopBanner.tsx | 1257 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/input/InputAuditViewer.tsx | 1487 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/input/InputPermissionPanel.tsx | 1544 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/input/RateLimitIndicator.tsx | 982 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/input/ShortcutBlockedToast.tsx | 376 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/observability/CorrelationIdProvider.tsx | 582 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/observability/DiagnosticsExportButton.tsx | 755 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/org/InviteExpiryBadge.tsx | 640 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/org/MemberRemovalDialog.tsx | 2327 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/org/OrgLayout.tsx | 1311 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/org/OwnerTransferDialog.tsx | 1905 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/org/RoleSelector.tsx | 746 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/recording/RecordingConsentDialog.tsx | 1863 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/recording/RecordingIndicator.tsx | 1215 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/recording/RecordingList.tsx | 2221 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/recording/RecordingPlaceholder.tsx | 1831 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/recording/RecordingSettingsPanel.tsx | 2021 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/security/MfaSetup.tsx | 1800 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/security/PasswordStrengthIndicator.tsx | 1045 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/security/RevokeSessionButton.tsx | 847 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/security/SecurityEventCard.tsx | 1566 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/security/SecurityLayout.tsx | 1250 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/support/InternalNotesPanel.tsx | 2543 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/support/SlaIndicator.tsx | 941 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/support/SupportLayout.tsx | 314 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/support/SupportSidebar.tsx | 1184 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/support/TicketStatusBadge.tsx | 656 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/support/UserTimeline.tsx | 1614 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/accordion.tsx | 2039 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/alert.tsx | 1614 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/alert-dialog.tsx | 3850 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/aspect-ratio.tsx | 280 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/avatar.tsx | 1083 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/badge.tsx | 1633 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/breadcrumb.tsx | 2357 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/button.tsx | 2218 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/button-group.tsx | 2209 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/calendar.tsx | 7793 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/card.tsx | 1987 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/carousel.tsx | 5542 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/chart.tsx | 10069 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/checkbox.tsx | 1219 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/collapsible.tsx | 786 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/command.tsx | 4804 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/context-menu.tsx | 8274 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/dialog.tsx | 3981 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/drawer.tsx | 4255 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/dropdown-menu.tsx | 8410 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/empty.tsx | 2396 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/field.tsx | 6145 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/form.tsx | 3764 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/hover-card.tsx | 1532 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/input.tsx | 962 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/input-group.tsx | 5065 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/input-otp.tsx | 2240 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/item.tsx | 4494 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/kbd.tsx | 862 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/label.tsx | 611 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/menubar.tsx | 8380 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/navigation-menu.tsx | 6664 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/pagination.tsx | 2717 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/popover.tsx | 1635 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/progress.tsx | 726 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/radio-group.tsx | 1466 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/resizable.tsx | 1980 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/scroll-area.tsx | 1645 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/select.tsx | 6344 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/separator.tsx | 699 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/sheet.tsx | 4076 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/sidebar.tsx | 21638 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/skeleton.tsx | 276 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/slider.tsx | 1996 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/sonner.tsx | 1020 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/spinner.tsx | 331 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/switch.tsx | 1177 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/table.tsx | 2434 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/tabs.tsx | 1969 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/textarea.tsx | 759 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/toggle.tsx | 1556 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/toggle-group.tsx | 2300 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/ui/tooltip.tsx | 1892 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/webrtc/ConnectionDegradationBanner.tsx | 2187 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/webrtc/StatsDisplay.tsx | 2457 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/components/webrtc/TurnStatusIndicator.tsx | 1461 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/const.ts | 36 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/admin/useAdminData.ts | 614 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/billing/useBilling.ts | 477 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/capture/useCaptureRestart.ts | 917 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/capture/useCaptureSource.ts | 956 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/capture/useMonitorDisconnect.ts | 987 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/clipboard/index.ts | 69 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/clipboard/useClipboardPermissions.ts | 907 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/connection/useBusyHost.ts | 1037 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/connection/useDuplicateGuard.ts | 805 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/connection/useOfflinePeer.ts | 864 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/errors/useErrorHandler.ts | 824 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/file-transfer/useFileSizeLimiter.ts | 914 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/input/useEmergencyStop.ts | 800 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/input/useInputPermissions.ts | 887 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/input/useViewerFocusGuard.ts | 689 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/observability/useCorrelationId.ts | 249 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/recording/useRecordingPermissions.ts | 1157 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/useAuth.ts | 1471 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/use-mobile.ts | 565 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/webrtc/useBandwidthWarnings.ts | 615 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/webrtc/useIceRestart.ts | 811 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/webrtc/useNetworkReconnect.ts | 806 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/hooks/webrtc/useStatsMonitor.ts | 893 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/index.css | 2118 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/admin/admin-api-service.ts | 1139 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/admin/admin-api-types.ts | 1452 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/api-client.ts | 1006 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/billing/billing-api-types.ts | 633 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/capture/desktop-capture-service.ts | 1172 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/clipboard/clipboard-service.ts | 2566 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/config.ts | 627 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/connection/connection-manager.ts | 1583 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/date-utils.ts | 1053 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/errors/api-error-interceptor.ts | 710 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/errors/socket-error-handler.ts | 554 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/file-transfer/file-transfer-service.ts | 1253 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/input/input-safety-service.ts | 1318 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/monitoring.ts | 612 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/org/org-api-types.ts | 614 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/recording/recording-api.ts | 1501 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/recording/recording-feature-flag.ts | 675 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/security/security-api-types.ts | 724 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/support/support-api-types.ts | 619 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/utils.ts | 166 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/lib/webrtc/webrtc-resilience-service.ts | 1897 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/main.tsx | 411 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/admin/AdminAuditLogPage.tsx | 4840 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/admin/AdminDevicesPage.tsx | 3403 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/admin/AdminOverviewPage.tsx | 1798 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/admin/AdminSessionsPage.tsx | 3381 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/admin/AdminSettingsPage.tsx | 1609 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/admin/AdminUsersPage.tsx | 3656 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/billing/BillingPage.tsx | 3033 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/Home.tsx | 425 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/Login.tsx | 1253 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/NotFound.tsx | 724 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/org/OrgInvitesPage.tsx | 2710 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/org/OrgMembersPage.tsx | 3098 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/org/OrgSettingsPage.tsx | 2254 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/security/SecurityDevicesPage.tsx | 1928 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/security/SecurityHistoryPage.tsx | 2146 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/security/SecuritySessionsPage.tsx | 3360 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/security/SecuritySettingsPage.tsx | 2443 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/support/SupportDashboardPage.tsx | 2436 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/support/SupportNewTicketPage.tsx | 3763 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/support/SupportTicketDetailPage.tsx | 1842 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/pages/support/SupportTicketsPage.tsx | 3682 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/src/providers/trpc.tsx | 954 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/tailwind.config.js | 2777 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/tsconfig.app.json | 930 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/tsconfig.json | 401 | yes | 576 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/tsconfig.node.json | 653 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/tsconfig.server.json | 616 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/vite.config.ts | 810 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | apps/web/vitest.config.ts | 489 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-10-next-400 | docker-compose.yml | 1218 | yes | 811 | Skip overwrite; root config could break current workspace/development flow. |
| batch-10-next-400 | IMPLEMENTATION_NOTES.md | 2658 | yes | 2932 | Skip overwrite; local docs include current merge/build status. |
| batch-10-next-400 | packages/shared/src/billing/__tests__/canceled-state.test.ts | 816 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/billing/__tests__/past-due.test.ts | 754 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/billing/__tests__/trial-ending.test.ts | 759 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/billing/billing-constants.ts | 789 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/billing/billing-types.ts | 1105 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/billing/canceled-state-handler.ts | 1834 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/billing/index.ts | 188 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/billing/past-due-handler.ts | 2120 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/billing/trial-ending-handler.ts | 1441 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/__tests__/fps-resolution-limiter.test.ts | 1153 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/__tests__/monitor-handler.test.ts | 1009 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/__tests__/permission-failure.test.ts | 679 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/capture-constants.ts | 869 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/capture-restart-helper.ts | 1988 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/capture-types.ts | 745 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/fps-resolution-limiter.ts | 3278 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/index.ts | 333 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/monitor-disconnected-handler.ts | 1809 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/permission-failure-handler.ts | 2993 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/quality-preset-selector.ts | 2161 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/capture/source-removed-handler.ts | 1596 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/ci/__tests__/test-helpers.test.ts | 469 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/ci/ci-constants.ts | 584 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/ci/index.ts | 64 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/ci/package.json | 123 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/ci/test-helpers.ts | 1523 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/__tests__/clipboard-size-limiter.test.ts | 707 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/__tests__/loop-prevention.test.ts | 699 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/__tests__/secret-detector.test.ts | 894 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/clipboard-constants.ts | 758 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/clipboard-loop-prevention.ts | 2078 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/clipboard-permission.ts | 1364 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/clipboard-size-limiter.ts | 2012 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/clipboard-sync-cooldown.ts | 1859 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/clipboard-types.ts | 583 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/index.ts | 287 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/clipboard/secret-pattern-detector.ts | 2341 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/__tests__/duplicate-guard.test.ts | 1162 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/busy-host-handler.ts | 2732 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/connection-constants.ts | 1217 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/connection-types.ts | 1043 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/duplicate-guard.ts | 2556 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/expired-request-cleanup.ts | 2685 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/index.ts | 400 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/offline-peer-handler.ts | 2307 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/rejected-request-ux.ts | 3399 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/session-collision-handler.ts | 3380 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/session-resume-draft.ts | 2357 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/connection/socket-reconnect-recovery.ts | 3459 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/__tests__/error-context.test.ts | 729 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/__tests__/error-registry.test.ts | 767 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/__tests__/user-safe-messages.test.ts | 759 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/__tests__/validation-formatter.test.ts | 606 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/error-code-registry.ts | 4504 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/error-constants.ts | 857 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/error-context.ts | 1061 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/error-response-mapper.ts | 1934 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/http-status-mapper.ts | 732 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/index.ts | 238 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/socket-error-mapper.ts | 1296 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/user-safe-messages.ts | 1138 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/validation-error-formatter.ts | 1418 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/errors/zod-error-formatter.ts | 537 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/__tests__/dangerous-extension.test.ts | 1168 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/__tests__/filename-sanitizer.test.ts | 706 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/__tests__/file-size-limiter.test.ts | 1010 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/__tests__/transfer-retry.test.ts | 867 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/dangerous-extension-checker.ts | 3226 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/filename-sanitizer.ts | 1781 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/file-size-limiter.ts | 2376 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/file-transfer-constants.ts | 976 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/file-transfer-types.ts | 999 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/incoming-consent-timeout.ts | 2373 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/index.ts | 326 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/partial-file-cleanup.ts | 1727 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/file-transfer/transfer-retry-cap.ts | 2094 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/__tests__/input-rate-limiter.test.ts | 962 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/host-emergency-stop.ts | 2453 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/index.ts | 293 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/input-constants.ts | 694 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/input-event-audit.ts | 2328 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/input-rate-limiter.ts | 2038 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/input-types.ts | 1012 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/os-shortcut-blocker.ts | 3362 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/permission-reset.ts | 1360 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/input/viewer-focus-guard.ts | 1225 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/__tests__/diagnostics.test.ts | 1032 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/__tests__/log-redaction.test.ts | 879 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/__tests__/metrics.test.ts | 975 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/__tests__/session-correlation.test.ts | 983 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/__tests__/socket-correlation.test.ts | 662 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/correlation-id.ts | 969 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/diagnostics-export.ts | 2269 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/index.ts | 225 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/log-redaction.ts | 1850 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/metrics-collector.ts | 1995 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/observability-constants.ts | 648 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/session-correlation.ts | 1531 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/observability/socket-correlation.ts | 1217 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/__tests__/invite-expiry.test.ts | 736 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/__tests__/owner-transfer.test.ts | 950 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/__tests__/role-protection.test.ts | 882 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/index.ts | 207 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/invite-expiry.ts | 1572 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/invite-resend.ts | 1730 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/org-constants.ts | 751 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/org-types.ts | 905 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/owner-transfer.ts | 2414 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/org/role-downgrade-protection.ts | 1645 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/__tests__/recording-permission.test.ts | 1112 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/__tests__/storage-policy.test.ts | 897 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/index.ts | 152 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/recording-constants.ts | 863 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/recording-metadata.ts | 1417 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/recording-permission.ts | 2416 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/recording-types.ts | 984 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/recording-validator.ts | 1777 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/recording/storage-policy.ts | 1554 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/__tests__/security-events.test.ts | 1098 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/__tests__/security-utils.test.ts | 727 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/__tests__/trusted-devices.test.ts | 1561 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/index.ts | 157 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/security-constants.ts | 799 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/security-event-timeline.ts | 1855 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/security-utils.ts | 1665 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/session-revoke.ts | 1725 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/security/trusted-device-manager.ts | 1400 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/support/__tests__/internal-notes.test.ts | 1239 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/support/__tests__/ticket-workflow.test.ts | 1020 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/support/index.ts | 172 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/support/internal-notes.ts | 1446 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/support/support-constants.ts | 753 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/support/support-types.ts | 760 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/support/ticket-workflow.ts | 2365 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/support/user-timeline.ts | 1416 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/types/common.ts | 570 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/types/index.ts | 26 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/utils/__tests__/utils.test.ts | 1756 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/utils/debounce.ts | 337 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/utils/index.ts | 105 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/utils/retry.ts | 902 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/utils/throttle.ts | 358 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/utils/uuid.ts | 368 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-10-next-400 | packages/shared/src/webrtc/__tests__/stats-monitor.test.ts | 1123 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/bandwidth-warnings.ts | 2464 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/ice-restart-flow.ts | 2849 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/index.ts | 342 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/network-reconnect-manager.ts | 2116 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/peer-cleanup-hardening.ts | 1985 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/quality-presets.ts | 1269 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/stats-monitor.ts | 4477 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/turn-fallback-diagnostics.ts | 2778 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/webrtc-constants.ts | 1041 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-10-next-400 | packages/shared/src/webrtc/webrtc-types.ts | 1030 | no | 0 | High-value candidate: port manually after adapting to current shared exports and desktop PeerConnectionManager. |
| batch-9-launch-prep | apps/api/src/admin/__tests__/admin-auth.test.ts | 1017 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/__tests__/health-monitor.test.ts | 613 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/__tests__/user-search.test.ts | 1005 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/admin.controller.ts | 5519 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/admin.routes.ts | 1508 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/middleware.ts | 1279 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/services/audit-export.service.ts | 1147 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/services/device-search.service.ts | 1181 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/services/health-monitor.service.ts | 1384 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/services/session-monitor.service.ts | 1305 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/admin/services/user-search.service.ts | 1409 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/audit/__tests__/audit.test.ts | 1380 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/audit/__tests__/retention.test.ts | 614 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/audit/audit.controller.ts | 2305 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/audit/audit.routes.ts | 448 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/audit/audit.service.ts | 1979 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/audit/audit-event-catalog.ts | 3666 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/audit/retention.service.ts | 688 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/__tests__/plans.test.ts | 630 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/__tests__/stripe-webhook.test.ts | 1300 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/__tests__/subscription.test.ts | 949 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/__tests__/trial.test.ts | 840 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/__tests__/usage.test.ts | 972 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/billing.controller.ts | 3974 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/billing.routes.ts | 1073 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/billing-audit.service.ts | 509 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/invoice.service.ts | 601 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/payment-method.service.ts | 896 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/plans.config.ts | 1361 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/stripe-webhook.service.ts | 4206 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/subscription.service.ts | 2023 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/trial.service.ts | 959 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/billing/usage.service.ts | 1002 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/__tests__/consent.test.ts | 821 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/__tests__/data-deletion.test.ts | 571 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/__tests__/data-export.test.ts | 718 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/__tests__/gdpr-utils.test.ts | 584 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/__tests__/retention-service.test.ts | 531 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/checklist.ts | 1873 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/compliance.controller.ts | 1227 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/compliance.routes.ts | 400 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/consent.service.ts | 978 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/data-deletion.service.ts | 1463 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/data-export.service.ts | 1094 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/data-retention.service.ts | 808 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/compliance/gdpr-utils.ts | 577 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/__tests__/examples.test.ts | 676 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/__tests__/openapi.test.ts | 611 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/admin.docs.ts | 933 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/auth.docs.ts | 2053 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/billing.docs.ts | 1126 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/device.docs.ts | 1099 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/examples.ts | 1197 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/openapi.config.ts | 1246 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/security.docs.ts | 1387 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/session.docs.ts | 1193 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/socket.docs.ts | 1960 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/docs/user.docs.ts | 1032 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/health/health.routes.ts | 699 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/middleware/cors.ts | 278 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/middleware/error-handler.ts | 798 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/middleware/request-logger.ts | 335 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/mobile/__tests__/mobile-controller.test.ts | 796 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/mobile/__tests__/mobile-errors.test.ts | 411 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/mobile/__tests__/qr.test.ts | 807 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/mobile/mobile.controller.ts | 1873 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/mobile/mobile.routes.ts | 601 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/mobile/qr.service.ts | 740 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/__tests__/batch.test.ts | 734 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/__tests__/email.test.ts | 403 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/__tests__/notification.test.ts | 1052 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/__tests__/notification-service.test.ts | 1016 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/batch.service.ts | 453 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/cleanup.service.ts | 279 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/digest.service.ts | 596 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/email.service.ts | 971 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/index.ts | 342 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/notification.controller.ts | 1365 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/notification.model.ts | 1633 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/notification.routes.ts | 496 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/notification.service.ts | 1475 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/push.service.ts | 522 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/templates/billing.ts | 687 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/templates/login-alert.ts | 554 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/templates/security.ts | 600 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/templates/session-start.ts | 365 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/notifications/webhook.service.ts | 622 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/__tests__/device-allowlist.test.ts | 906 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/__tests__/enforcer.test.ts | 816 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/__tests__/policy.test.ts | 898 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/__tests__/policy-check.test.ts | 792 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/audit.service.ts | 414 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/device-allowlist.service.ts | 890 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/index.ts | 274 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/middleware/policy-check.ts | 869 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/policy.controller.ts | 953 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/policy.model.ts | 1303 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/policy.routes.ts | 456 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/policy-cache.ts | 477 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/policy-enforcer.ts | 1067 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/policies/policy-sync.service.ts | 421 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/__tests__/login-session.test.ts | 1067 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/__tests__/password-policy.test.ts | 750 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/__tests__/trusted-device.test.ts | 1547 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/__tests__/two-factor.test.ts | 1060 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/middleware/rate-limit.ts | 541 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/middleware/require-2fa.ts | 494 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/models/login-session.model.ts | 1387 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/models/password-policy.model.ts | 1738 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/models/trusted-device.model.ts | 1400 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/models/two-factor.model.ts | 1696 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/security.controller.ts | 4664 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/security.routes.ts | 1368 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/services/rate-limiter.service.ts | 507 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/security/services/security-audit.service.ts | 624 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/__tests__/comment.test.ts | 939 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/__tests__/escalation.test.ts | 779 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/__tests__/permissions.test.ts | 648 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/__tests__/ticket.test.ts | 1075 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/escalation.service.ts | 765 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/permissions.ts | 615 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/support.controller.ts | 3021 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/support.routes.ts | 796 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/support-audit.service.ts | 542 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/support-ticket.model.ts | 2690 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/ticket-analytics.service.ts | 1022 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/support/ticket-comment.model.ts | 1034 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/utils/password.ts | 424 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/src/utils/validation.ts | 515 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/test/fixtures/database.ts | 800 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/test/fixtures/tokens.ts | 422 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/test/integration/auth.test.ts | 1365 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/test/integration/session.test.ts | 537 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/test/integration/socket.test.ts | 857 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/api/test/setup.ts | 218 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/main.ts | 870 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/__tests__/permission-audit.test.ts | 577 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/__tests__/permission-store.test.ts | 1142 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/__tests__/utils.test.ts | 615 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/consent-prompt.tsx | 1956 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/hooks/useAllPermissions.ts | 1428 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/hooks/usePermission.ts | 1023 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/hooks/usePermissionsForSession.ts | 319 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/permission-audit.ts | 1053 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/permission-gate.tsx | 790 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/permission-settings.tsx | 1377 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/permission-store.ts | 2618 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/permission-utils.ts | 944 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/permissions/session-permission-sync.ts | 925 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/preload.ts | 622 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/adaptive-bitrate.test.ts | 723 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/bitrate-estimator.test.ts | 696 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/congestion.test.ts | 600 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/fps.test.ts | 537 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/packet-loss.test.ts | 637 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/quality-dashboard.test.tsx | 1026 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/quality-score.test.ts | 918 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/rtt.test.ts | 608 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/__tests__/stats-collector.test.ts | 340 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/adaptive-bitrate.ts | 1032 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/bitrate-estimator.ts | 1140 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/congestion-detector.ts | 920 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/fps-estimator.ts | 1010 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/index.ts | 515 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/packet-loss-estimator.ts | 918 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/quality-dashboard.tsx | 2006 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/quality-reporter.ts | 1254 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/quality-score.ts | 2997 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/quality-trend-chart.tsx | 854 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/quality-warning-banner.tsx | 753 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/rtt-estimator.ts | 1037 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/quality/stats-collector.ts | 3049 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/__tests__/capture-restart.test.ts | 815 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/__tests__/connection-state.test.ts | 850 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/__tests__/crash-cleanup.test.ts | 623 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/__tests__/diagnostics.test.ts | 414 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/__tests__/error-reporter.test.ts | 652 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/__tests__/network-monitor.test.ts | 464 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/__tests__/reconnect-manager.test.ts | 761 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/__tests__/session-watchdog.test.ts | 853 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/capture-restart.ts | 1111 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/connection-state.ts | 1258 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/crash-cleanup.ts | 1077 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/dead-connection-detector.ts | 754 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/diagnostics-export.ts | 1519 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/error-reporter.ts | 890 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/heartbeat.ts | 510 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/ice-restart.ts | 843 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/index.ts | 467 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/network-monitor.ts | 1074 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/reconnect-manager.ts | 1454 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/session-persistence.ts | 671 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/reliability/session-watchdog.ts | 1150 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/desktop/src/renderer.tsx | 233 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/e2e/auth.spec.ts | 2003 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/e2e/billing.spec.ts | 932 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/e2e/dashboard.spec.ts | 1722 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/e2e/fixtures/users.ts | 540 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/e2e/global-setup.ts | 255 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/e2e/global-teardown.ts | 247 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/playwright.config.ts | 717 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/ActiveSessionsMonitor.tsx | 650 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/AdminDashboard.tsx | 1045 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/AdminLayout.tsx | 323 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/AdminSidebar.tsx | 571 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/AuditLogViewer.tsx | 1562 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/DeviceSearch.tsx | 1109 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useActiveSessions.ts | 590 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useAuditLogs.ts | 951 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useDashboardStats.ts | 414 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useDeviceSearch.ts | 605 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useSystemHealth.ts | 476 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useUserDetail.ts | 456 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useUserDevices.ts | 469 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useUserSearch.ts | 908 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/hooks/useUserSessions.ts | 475 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/StatCard.tsx | 599 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/SystemHealthPanel.tsx | 920 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/UserDetail.tsx | 821 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/UserDevices.tsx | 728 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/UserSearch.tsx | 947 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/UserSearchResult.tsx | 609 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/admin/UserSessions.tsx | 817 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/BillingSettings.tsx | 479 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/hooks/useBillingAudit.ts | 425 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/hooks/useInvoices.ts | 488 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/hooks/usePaymentMethods.ts | 1033 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/hooks/useSubscription.ts | 1259 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/hooks/useTrialStatus.ts | 411 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/InvoiceHistory.tsx | 1120 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/PaymentMethods.tsx | 789 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/PlanComparison.tsx | 1197 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/SubscriptionManager.tsx | 1390 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/billing/TrialBanner.tsx | 389 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/compliance/ComplianceSettings.tsx | 322 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/compliance/ConsentBanner.tsx | 890 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/compliance/DataDeletion.tsx | 1524 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/compliance/DataExport.tsx | 812 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/compliance/PrivacySettings.tsx | 439 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/notifications/hooks/useNotificationPreferences.ts | 862 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/notifications/hooks/useNotifications.ts | 1378 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/notifications/hooks/useNotificationSocket.ts | 422 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/notifications/NotificationBell.tsx | 743 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/notifications/NotificationDropdown.tsx | 1055 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/notifications/NotificationList.tsx | 859 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/notifications/NotificationPreferences.tsx | 1223 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/notifications/NotificationToast.tsx | 762 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/policies/DeviceAllowlist.tsx | 1061 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/policies/hooks/useAllowlist.ts | 924 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/policies/hooks/usePolicies.ts | 777 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/policies/hooks/usePolicyAudit.ts | 387 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/policies/PolicyAuditLog.tsx | 750 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/policies/PolicyManager.tsx | 1389 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/policies/PolicyToggle.tsx | 703 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/hooks/useLoginSessions.ts | 999 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/hooks/usePasswordPolicy.ts | 823 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/hooks/useRecoveryCodes.ts | 776 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/hooks/useSecurityOverview.ts | 396 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/hooks/useTrustedDevices.ts | 772 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/hooks/useTwoFactor.ts | 1053 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/LoginSessionsCard.tsx | 734 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/PasswordPolicyCard.tsx | 971 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/RecoveryCodes.tsx | 832 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/SecurityOverview.tsx | 877 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/SecuritySettings.tsx | 303 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/TrustedDevicesCard.tsx | 573 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/security/TwoFactorCard.tsx | 1414 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/CreateTicket.tsx | 2146 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/hooks/useAddComment.ts | 621 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/hooks/useTicketDetail.ts | 537 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/hooks/useTicketSearch.ts | 964 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/hooks/useTicketStats.ts | 435 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/hooks/useUpdateTicket.ts | 656 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/hooks/useUserTimeline.ts | 527 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/InternalNotes.tsx | 1214 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/SupportDashboard.tsx | 910 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/TicketActions.tsx | 976 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/TicketComments.tsx | 1279 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/TicketDetail.tsx | 1262 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/TicketList.tsx | 1586 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/TicketListItem.tsx | 852 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/components/support/UserTimeline.tsx | 1508 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/lib/api.ts | 639 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/lib/query-client.ts | 246 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | apps/web/src/lib/socket.ts | 581 | no | 0 | Review-only runtime/config file; do not overwrite current app without targeted port. |
| batch-9-launch-prep | IMPLEMENTATION_NOTES.md | 6033 | yes | 2932 | Skip overwrite; local docs include current merge/build status. |
| batch-9-launch-prep | packages/shared/src/constants/index.ts | 628 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/dto/admin.dto.ts | 1478 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/dto/billing.dto.ts | 875 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/dto/notification.dto.ts | 432 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/dto/policy.dto.ts | 334 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/dto/security.dto.ts | 1087 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/dto/support.dto.ts | 1177 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/__tests__/mobile-dto.test.ts | 933 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/__tests__/screen-adaptation.test.ts | 681 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/index.ts | 110 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/input-mapping.ts | 1048 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/mobile-auth.dto.ts | 587 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/mobile-device.dto.ts | 574 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/mobile-errors.ts | 466 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/mobile-events.ts | 504 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/mobile-permissions.dto.ts | 312 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/mobile-session.dto.ts | 791 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/mobile/screen-adaptation.ts | 1015 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/types/index.ts | 600 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/utils/__tests__/id-generator.test.ts | 726 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/src/utils/id-generator.ts | 392 | no | 0 | Review-only: shared module layout differs and could conflict with current single-file contracts. |
| batch-9-launch-prep | packages/shared/test/contract.test.ts | 1734 | no | 0 | Review-only: tests target staged shared layout; rewrite against current contracts before use. |
| batch-9-launch-prep | README.md | 2732 | yes | 728 | Skip overwrite; local docs include current merge/build status. |

## Highest-Value Manual Ports

- `packages/shared/src/webrtc/stats-monitor.ts`: adapt into desktop/web shared WebRTC diagnostics after current type contracts are split.
- `packages/shared/src/webrtc/ice-restart-flow.ts`: use as reference for reconnect/ICE restart feature.
- `packages/shared/src/utils/throttle.ts` and `debounce.ts`: safe candidates for remote input throttling once shared utilities module exists.
- `infra/**`: imported as deployment reference; validate secrets/paths before any real deployment.
