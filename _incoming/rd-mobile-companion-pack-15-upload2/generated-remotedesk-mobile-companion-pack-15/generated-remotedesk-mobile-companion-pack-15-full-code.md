# generated-remotedesk-mobile-companion-pack-15 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack15.patch.md
PATCHES/desktop-pack15.patch.md
PATCHES/ops-pack15.patch.md
PATCHES/web-pack15.patch.md
REVIEW_REQUIRED/apps/api/src/pack15/common/mobileCompanionAuth.ts
REVIEW_REQUIRED/apps/api/src/pack15/common/pack15Route.ts
REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesService.ts
REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsService.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesService.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsService.ts
REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodePolicy.ts
REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesService.ts
REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokenPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensService.ts
REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsService.ts
REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsService.ts
REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/index.ts
REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworkPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksService.ts
REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksTypes.ts
REVIEW_REQUIRED/apps/desktop/src/pack15/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack15/mobileApprovalPrompt.tsx
REVIEW_REQUIRED/apps/desktop/src/pack15/mobileCompanionStatus.ts
REVIEW_REQUIRED/apps/desktop/src/pack15/pushNotificationPreview.tsx
REVIEW_REQUIRED/apps/desktop/src/pack15/qrPairingDisplay.tsx
REVIEW_REQUIRED/apps/desktop/src/pack15/trustedNetworkIndicator.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/DeviceApprovalPoliciesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/MobileApprovalRequestsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/MobileCompanionDashboard.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/MobileDevicesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/MobileDiagnosticsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/PushTokensPage.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/PwaInstallPromptsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/QrPairingPanel.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/SessionRequestNotificationsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack15/components/TrustedNetworksPage.tsx
REVIEW_REQUIRED/apps/web/src/pack15/hooks/useDeviceApprovalPolicies.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileApprovalRequests.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileAudit.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileDevices.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileDiagnostics.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePairingCodes.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePushTokens.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePwaInstallPrompts.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/useSessionRequestNotifications.ts
REVIEW_REQUIRED/apps/web/src/pack15/hooks/useTrustedNetworks.ts
REVIEW_REQUIRED/apps/web/src/pack15/index.ts
SAFE_DIRECT_COPY/docs/pack15/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack15/02-qr-pairing.md
SAFE_DIRECT_COPY/docs/pack15/03-push-notifications.md
SAFE_DIRECT_COPY/docs/pack15/04-mobile-approvals.md
SAFE_DIRECT_COPY/docs/pack15/05-device-posture.md
SAFE_DIRECT_COPY/docs/pack15/06-pwa-companion.md
SAFE_DIRECT_COPY/docs/pack15/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack15/prometheus-mobile-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack15/deepLinkSafety.ts
SAFE_DIRECT_COPY/packages/shared/src/pack15/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack15/mobileApproval.ts
SAFE_DIRECT_COPY/packages/shared/src/pack15/mobileDevicePosture.ts
SAFE_DIRECT_COPY/packages/shared/src/pack15/pairingCode.ts
SAFE_DIRECT_COPY/packages/shared/src/pack15/pushRedaction.ts
SAFE_DIRECT_COPY/packages/shared/src/pack15/qrPayload.ts
SAFE_DIRECT_COPY/packages/shared/src/pack15/sessionRequestCooldown.ts
SAFE_DIRECT_COPY/packages/shared/src/pack15/trustedNetwork.ts
SAFE_DIRECT_COPY/scripts/pack15/check-mobile-secrets.mjs
SAFE_DIRECT_COPY/tests/pack15/deepLinkSafety.test.ts
SAFE_DIRECT_COPY/tests/pack15/mobileApproval.test.ts
SAFE_DIRECT_COPY/tests/pack15/mobileCompanionStatus.test.ts
SAFE_DIRECT_COPY/tests/pack15/mobileDevicePosture.test.ts
SAFE_DIRECT_COPY/tests/pack15/pairingCode.test.ts
SAFE_DIRECT_COPY/tests/pack15/pairingCodePolicy.test.ts
SAFE_DIRECT_COPY/tests/pack15/pushRedaction.test.ts
SAFE_DIRECT_COPY/tests/pack15/qrPayload.test.ts
SAFE_DIRECT_COPY/tests/pack15/trustedNetworkPolicy.test.ts
generated-remotedesk-mobile-companion-pack-15-code-review.md
generated-remotedesk-mobile-companion-pack-15-manifest.json
generated-remotedesk-mobile-companion-pack-15-merge-summary.md
generated-remotedesk-mobile-companion-pack-15-risk-register.md
generated-remotedesk-mobile-companion-pack-15-test-plan.md

```


## `PATCHES/api-pack15.patch.md`

```text
Mount Pack 15 routes behind mobile/admin permissions. Store pairing codes and push tokens hashed/encrypted. Enforce team ownership in repositories.

```


## `PATCHES/desktop-pack15.patch.md`

```text
Wire QR pairing display and mobile approval prompt into settings/session UI. Do not expose access tokens in QR payloads.

```


## `PATCHES/ops-pack15.patch.md`

```text
Monitor pairing and push delivery failures. Run mobile secret scanner in CI.

```


## `PATCHES/web-pack15.patch.md`

```text
Mount mobile companion pages in admin settings. PWA install prompts should be optional and dismissible.

```


## `REVIEW_REQUIRED/apps/api/src/pack15/common/mobileCompanionAuth.ts`

```text
import type { Request, Response, NextFunction } from 'express';
export function requireMobileCompanionAccess(req: Request, res: Response, next: NextFunction): void { const user = req.user as { role?: string; permissions?: string[] } | undefined; if (user?.role === 'owner' || user?.role === 'admin' || user?.permissions?.includes('mobile:manage')) { next(); return; } res.status(403).json({ error: 'mobile_companion_access_required' }); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/common/pack15Route.ts`

```text
import type { Request, Response, NextFunction } from 'express';
export function pack15Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) { return (req: Request, res: Response, next: NextFunction): void => { handler(req, res, next).catch(next); }; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { DeviceApprovalPolicyRecordService } from './deviceApprovalPoliciesService.js';
export function registerDeviceApprovalPolicyRecordRoutes(router: Router, service: DeviceApprovalPolicyRecordService): void { router.get('/pack15/deviceApprovalPolicies', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/deviceApprovalPolicies', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesService.ts`

```text
import type { DeviceApprovalPolicyRecord, DeviceApprovalPolicyRecordRepository } from './deviceApprovalPoliciesTypes.js';
export class DeviceApprovalPolicyRecordService { constructor(private readonly repository: DeviceApprovalPolicyRecordRepository) {} create(record: DeviceApprovalPolicyRecord): Promise<DeviceApprovalPolicyRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<DeviceApprovalPolicyRecord>): Promise<DeviceApprovalPolicyRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('deviceApprovalPolicies-not-found'); return updated; } list(filter: Partial<DeviceApprovalPolicyRecord> = {}, limit = 50): Promise<DeviceApprovalPolicyRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesTypes.ts`

```text
export interface DeviceApprovalPolicyRecord { id: string; teamId: string; requireMobileApproval: boolean; trustedNetworkOnly: boolean; updatedAt: string; }
export interface DeviceApprovalPolicyRecordRepository { create(record: DeviceApprovalPolicyRecord): Promise<DeviceApprovalPolicyRecord>; update(id: string, patch: Partial<DeviceApprovalPolicyRecord>): Promise<DeviceApprovalPolicyRecord | null>; list(filter: Partial<DeviceApprovalPolicyRecord>, limit: number): Promise<DeviceApprovalPolicyRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/index.ts`

```text
export * from "./deviceApprovalPoliciesTypes.js";
export * from "./deviceApprovalPoliciesService.js";
export * from "./deviceApprovalPoliciesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/index.ts`

```text
export * from './common/pack15Route.js';
export * from './common/mobileCompanionAuth.js';
export * from './pairingCodes/pairingCodePolicy.js';
export * from './pushTokens/pushTokenPolicy.js';
export * from './mobileApprovalRequests/mobileApprovalPolicy.js';
export * from './trustedNetworks/trustedNetworkPolicy.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/index.ts`

```text
export * from "./mobileApprovalRequestsTypes.js";
export * from "./mobileApprovalRequestsService.js";
export * from "./mobileApprovalRequestsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalPolicy.ts`

```text
export function mobileApprovalCanTransition(from: string, to: string): boolean { const allowed: Record<string, string[]> = { pending: ['approved', 'rejected', 'expired'], approved: [], rejected: [], expired: [] }; return (allowed[from] ?? []).includes(to); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { MobileApprovalRequestRecordService } from './mobileApprovalRequestsService.js';
export function registerMobileApprovalRequestRecordRoutes(router: Router, service: MobileApprovalRequestRecordService): void { router.get('/pack15/mobileApprovalRequests', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/mobileApprovalRequests', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsService.ts`

```text
import type { MobileApprovalRequestRecord, MobileApprovalRequestRecordRepository } from './mobileApprovalRequestsTypes.js';
export class MobileApprovalRequestRecordService { constructor(private readonly repository: MobileApprovalRequestRecordRepository) {} create(record: MobileApprovalRequestRecord): Promise<MobileApprovalRequestRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<MobileApprovalRequestRecord>): Promise<MobileApprovalRequestRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('mobileApprovalRequests-not-found'); return updated; } list(filter: Partial<MobileApprovalRequestRecord> = {}, limit = 50): Promise<MobileApprovalRequestRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsTypes.ts`

```text
export interface MobileApprovalRequestRecord { id: string; sessionId: string; requestedByUserId: string; approverUserId: string; state: 'pending' | 'approved' | 'rejected' | 'expired'; createdAt: string; }
export interface MobileApprovalRequestRecordRepository { create(record: MobileApprovalRequestRecord): Promise<MobileApprovalRequestRecord>; update(id: string, patch: Partial<MobileApprovalRequestRecord>): Promise<MobileApprovalRequestRecord | null>; list(filter: Partial<MobileApprovalRequestRecord>, limit: number): Promise<MobileApprovalRequestRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/index.ts`

```text
export * from "./mobileAuditTypes.js";
export * from "./mobileAuditService.js";
export * from "./mobileAuditRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { MobileAuditRecordService } from './mobileAuditService.js';
export function registerMobileAuditRecordRoutes(router: Router, service: MobileAuditRecordService): void { router.get('/pack15/mobileAudit', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/mobileAudit', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditService.ts`

```text
import type { MobileAuditRecord, MobileAuditRecordRepository } from './mobileAuditTypes.js';
export class MobileAuditRecordService { constructor(private readonly repository: MobileAuditRecordRepository) {} create(record: MobileAuditRecord): Promise<MobileAuditRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<MobileAuditRecord>): Promise<MobileAuditRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('mobileAudit-not-found'); return updated; } list(filter: Partial<MobileAuditRecord> = {}, limit = 50): Promise<MobileAuditRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditTypes.ts`

```text
export interface MobileAuditRecord { id: string; teamId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>; }
export interface MobileAuditRecordRepository { create(record: MobileAuditRecord): Promise<MobileAuditRecord>; update(id: string, patch: Partial<MobileAuditRecord>): Promise<MobileAuditRecord | null>; list(filter: Partial<MobileAuditRecord>, limit: number): Promise<MobileAuditRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/index.ts`

```text
export * from "./mobileDevicesTypes.js";
export * from "./mobileDevicesService.js";
export * from "./mobileDevicesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { MobileDeviceRecordService } from './mobileDevicesService.js';
export function registerMobileDeviceRecordRoutes(router: Router, service: MobileDeviceRecordService): void { router.get('/pack15/mobileDevices', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/mobileDevices', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesService.ts`

```text
import type { MobileDeviceRecord, MobileDeviceRecordRepository } from './mobileDevicesTypes.js';
export class MobileDeviceRecordService { constructor(private readonly repository: MobileDeviceRecordRepository) {} create(record: MobileDeviceRecord): Promise<MobileDeviceRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<MobileDeviceRecord>): Promise<MobileDeviceRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('mobileDevices-not-found'); return updated; } list(filter: Partial<MobileDeviceRecord> = {}, limit = 50): Promise<MobileDeviceRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesTypes.ts`

```text
export interface MobileDeviceRecord { id: string; teamId: string; userId: string; platform: 'ios' | 'android' | 'web_pwa'; appVersion: string; trusted: boolean; lastSeenAt?: string; }
export interface MobileDeviceRecordRepository { create(record: MobileDeviceRecord): Promise<MobileDeviceRecord>; update(id: string, patch: Partial<MobileDeviceRecord>): Promise<MobileDeviceRecord | null>; list(filter: Partial<MobileDeviceRecord>, limit: number): Promise<MobileDeviceRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/index.ts`

```text
export * from "./mobileDiagnosticsTypes.js";
export * from "./mobileDiagnosticsService.js";
export * from "./mobileDiagnosticsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { MobileDiagnosticRecordService } from './mobileDiagnosticsService.js';
export function registerMobileDiagnosticRecordRoutes(router: Router, service: MobileDiagnosticRecordService): void { router.get('/pack15/mobileDiagnostics', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/mobileDiagnostics', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsService.ts`

```text
import type { MobileDiagnosticRecord, MobileDiagnosticRecordRepository } from './mobileDiagnosticsTypes.js';
export class MobileDiagnosticRecordService { constructor(private readonly repository: MobileDiagnosticRecordRepository) {} create(record: MobileDiagnosticRecord): Promise<MobileDiagnosticRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<MobileDiagnosticRecord>): Promise<MobileDiagnosticRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('mobileDiagnostics-not-found'); return updated; } list(filter: Partial<MobileDiagnosticRecord> = {}, limit = 50): Promise<MobileDiagnosticRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsTypes.ts`

```text
export interface MobileDiagnosticRecord { id: string; deviceId: string; appVersion: string; platform: string; redactedPayloadKey: string; createdAt: string; }
export interface MobileDiagnosticRecordRepository { create(record: MobileDiagnosticRecord): Promise<MobileDiagnosticRecord>; update(id: string, patch: Partial<MobileDiagnosticRecord>): Promise<MobileDiagnosticRecord | null>; list(filter: Partial<MobileDiagnosticRecord>, limit: number): Promise<MobileDiagnosticRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/index.ts`

```text
export * from "./pairingCodesTypes.js";
export * from "./pairingCodesService.js";
export * from "./pairingCodesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodePolicy.ts`

```text
export function validatePairingCodeRequest(input: { expiresAt: string; maxAttempts: number }): string[] { const errors: string[] = []; if (new Date(input.expiresAt) <= new Date()) errors.push('expiry-in-past'); if (input.maxAttempts < 1 || input.maxAttempts > 10) errors.push('invalid-max-attempts'); return errors; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { PairingCodeRecordService } from './pairingCodesService.js';
export function registerPairingCodeRecordRoutes(router: Router, service: PairingCodeRecordService): void { router.get('/pack15/pairingCodes', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/pairingCodes', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesService.ts`

```text
import type { PairingCodeRecord, PairingCodeRecordRepository } from './pairingCodesTypes.js';
export class PairingCodeRecordService { constructor(private readonly repository: PairingCodeRecordRepository) {} create(record: PairingCodeRecord): Promise<PairingCodeRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<PairingCodeRecord>): Promise<PairingCodeRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('pairingCodes-not-found'); return updated; } list(filter: Partial<PairingCodeRecord> = {}, limit = 50): Promise<PairingCodeRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesTypes.ts`

```text
export interface PairingCodeRecord { id: string; teamId: string; codeHash: string; expiresAt: string; attempts: number; maxAttempts: number; createdByUserId: string; }
export interface PairingCodeRecordRepository { create(record: PairingCodeRecord): Promise<PairingCodeRecord>; update(id: string, patch: Partial<PairingCodeRecord>): Promise<PairingCodeRecord | null>; list(filter: Partial<PairingCodeRecord>, limit: number): Promise<PairingCodeRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/index.ts`

```text
export * from "./pushTokensTypes.js";
export * from "./pushTokensService.js";
export * from "./pushTokensRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokenPolicy.ts`

```text
export function pushTokenCanSend(input: { revokedAt?: string; userNotificationsEnabled: boolean }): boolean { return !input.revokedAt && input.userNotificationsEnabled; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { PushTokenRecordService } from './pushTokensService.js';
export function registerPushTokenRecordRoutes(router: Router, service: PushTokenRecordService): void { router.get('/pack15/pushTokens', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/pushTokens', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensService.ts`

```text
import type { PushTokenRecord, PushTokenRecordRepository } from './pushTokensTypes.js';
export class PushTokenRecordService { constructor(private readonly repository: PushTokenRecordRepository) {} create(record: PushTokenRecord): Promise<PushTokenRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<PushTokenRecord>): Promise<PushTokenRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('pushTokens-not-found'); return updated; } list(filter: Partial<PushTokenRecord> = {}, limit = 50): Promise<PushTokenRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensTypes.ts`

```text
export interface PushTokenRecord { id: string; userId: string; deviceId: string; provider: 'apns' | 'fcm' | 'webpush'; tokenHash: string; revokedAt?: string; createdAt: string; }
export interface PushTokenRecordRepository { create(record: PushTokenRecord): Promise<PushTokenRecord>; update(id: string, patch: Partial<PushTokenRecord>): Promise<PushTokenRecord | null>; list(filter: Partial<PushTokenRecord>, limit: number): Promise<PushTokenRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/index.ts`

```text
export * from "./pwaInstallPromptsTypes.js";
export * from "./pwaInstallPromptsService.js";
export * from "./pwaInstallPromptsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { PwaInstallPromptRecordService } from './pwaInstallPromptsService.js';
export function registerPwaInstallPromptRecordRoutes(router: Router, service: PwaInstallPromptRecordService): void { router.get('/pack15/pwaInstallPrompts', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/pwaInstallPrompts', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsService.ts`

```text
import type { PwaInstallPromptRecord, PwaInstallPromptRecordRepository } from './pwaInstallPromptsTypes.js';
export class PwaInstallPromptRecordService { constructor(private readonly repository: PwaInstallPromptRecordRepository) {} create(record: PwaInstallPromptRecord): Promise<PwaInstallPromptRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<PwaInstallPromptRecord>): Promise<PwaInstallPromptRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('pwaInstallPrompts-not-found'); return updated; } list(filter: Partial<PwaInstallPromptRecord> = {}, limit = 50): Promise<PwaInstallPromptRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsTypes.ts`

```text
export interface PwaInstallPromptRecord { id: string; userId: string; shownAt: string; acceptedAt?: string; dismissedAt?: string; }
export interface PwaInstallPromptRecordRepository { create(record: PwaInstallPromptRecord): Promise<PwaInstallPromptRecord>; update(id: string, patch: Partial<PwaInstallPromptRecord>): Promise<PwaInstallPromptRecord | null>; list(filter: Partial<PwaInstallPromptRecord>, limit: number): Promise<PwaInstallPromptRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/index.ts`

```text
export * from "./sessionRequestNotificationsTypes.js";
export * from "./sessionRequestNotificationsService.js";
export * from "./sessionRequestNotificationsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { SessionRequestNotificationRecordService } from './sessionRequestNotificationsService.js';
export function registerSessionRequestNotificationRecordRoutes(router: Router, service: SessionRequestNotificationRecordService): void { router.get('/pack15/sessionRequestNotifications', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/sessionRequestNotifications', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsService.ts`

```text
import type { SessionRequestNotificationRecord, SessionRequestNotificationRecordRepository } from './sessionRequestNotificationsTypes.js';
export class SessionRequestNotificationRecordService { constructor(private readonly repository: SessionRequestNotificationRecordRepository) {} create(record: SessionRequestNotificationRecord): Promise<SessionRequestNotificationRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<SessionRequestNotificationRecord>): Promise<SessionRequestNotificationRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('sessionRequestNotifications-not-found'); return updated; } list(filter: Partial<SessionRequestNotificationRecord> = {}, limit = 50): Promise<SessionRequestNotificationRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsTypes.ts`

```text
export interface SessionRequestNotificationRecord { id: string; sessionId: string; userId: string; channel: 'push' | 'email' | 'in_app'; status: 'queued' | 'sent' | 'failed'; createdAt: string; }
export interface SessionRequestNotificationRecordRepository { create(record: SessionRequestNotificationRecord): Promise<SessionRequestNotificationRecord>; update(id: string, patch: Partial<SessionRequestNotificationRecord>): Promise<SessionRequestNotificationRecord | null>; list(filter: Partial<SessionRequestNotificationRecord>, limit: number): Promise<SessionRequestNotificationRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/index.ts`

```text
export * from "./trustedNetworksTypes.js";
export * from "./trustedNetworksService.js";
export * from "./trustedNetworksRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworkPolicy.ts`

```text
export function validateTrustedNetworkCidr(cidr: string): boolean { return /^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(cidr) || /^[a-f0-9:]+\/\d{1,3}$/i.test(cidr); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksRoutes.ts`

```text
import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { TrustedNetworkRecordService } from './trustedNetworksService.js';
export function registerTrustedNetworkRecordRoutes(router: Router, service: TrustedNetworkRecordService): void { router.get('/pack15/trustedNetworks', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/trustedNetworks', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksService.ts`

```text
import type { TrustedNetworkRecord, TrustedNetworkRecordRepository } from './trustedNetworksTypes.js';
export class TrustedNetworkRecordService { constructor(private readonly repository: TrustedNetworkRecordRepository) {} create(record: TrustedNetworkRecord): Promise<TrustedNetworkRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<TrustedNetworkRecord>): Promise<TrustedNetworkRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error('trustedNetworks-not-found'); return updated; } list(filter: Partial<TrustedNetworkRecord> = {}, limit = 50): Promise<TrustedNetworkRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksTypes.ts`

```text
export interface TrustedNetworkRecord { id: string; teamId: string; label: string; cidr: string; enabled: boolean; createdAt: string; }
export interface TrustedNetworkRecordRepository { create(record: TrustedNetworkRecord): Promise<TrustedNetworkRecord>; update(id: string, patch: Partial<TrustedNetworkRecord>): Promise<TrustedNetworkRecord | null>; list(filter: Partial<TrustedNetworkRecord>, limit: number): Promise<TrustedNetworkRecord[]>; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack15/index.ts`

```text
export * from './qrPairingDisplay.js';
export * from './mobileApprovalPrompt.js';
export * from './mobileCompanionStatus.js';
export * from './trustedNetworkIndicator.js';
export * from './pushNotificationPreview.js';

```


## `REVIEW_REQUIRED/apps/desktop/src/pack15/mobileApprovalPrompt.tsx`

```text
import React from 'react';
export function MobileApprovalPrompt(props: { requesterName: string; onApprove: () => void; onReject: () => void }): JSX.Element { return <section role='dialog' aria-label='Mobile approval request'><h3>Approve session?</h3><p>{props.requesterName} is requesting approval.</p><button onClick={props.onApprove}>Approve</button><button onClick={props.onReject}>Reject</button></section>; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack15/mobileCompanionStatus.ts`

```text
export interface MobileCompanionStatus { pairedDevices: number; pushEnabled: boolean; pendingApprovals: number; }
export function mobileCompanionNeedsAttention(status: MobileCompanionStatus): boolean { return status.pendingApprovals > 0 || (status.pairedDevices > 0 && !status.pushEnabled); }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack15/pushNotificationPreview.tsx`

```text
import React from 'react';
export function PushNotificationPreview(props: { title: string; body: string }): JSX.Element { return <aside><strong>{props.title}</strong><p>{props.body}</p></aside>; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack15/qrPairingDisplay.tsx`

```text
import React from 'react';
export function QrPairingDisplay(props: { code: string; expiresAt: string; qrText: string }): JSX.Element { return <section><h3>Pair mobile companion</h3><code>{props.code}</code><p>Expires {new Date(props.expiresAt).toLocaleString()}</p><textarea readOnly value={props.qrText} aria-label='QR pairing payload' /></section>; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack15/trustedNetworkIndicator.tsx`

```text
import React from 'react';
export function TrustedNetworkIndicator(props: { trusted: boolean; label?: string }): JSX.Element { return <span data-trusted-network={props.trusted}>{props.trusted ? `Trusted network${props.label ? `: ${props.label}` : ''}` : 'Untrusted network'}</span>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/DeviceApprovalPoliciesPage.tsx`

```text
import React from 'react';
export interface DeviceApprovalPoliciesPageRow { id: string; title: string; status: string; detail?: string; }
export function DeviceApprovalPoliciesPage(props: { rows: DeviceApprovalPoliciesPageRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>DeviceApprovalPolicies</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/MobileApprovalRequestsPage.tsx`

```text
import React from 'react';
export interface MobileApprovalRequestsPageRow { id: string; title: string; status: string; detail?: string; }
export function MobileApprovalRequestsPage(props: { rows: MobileApprovalRequestsPageRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>MobileApproval Requests</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/MobileCompanionDashboard.tsx`

```text
import React from 'react';
export interface MobileCompanionDashboardRow { id: string; title: string; status: string; detail?: string; }
export function MobileCompanionDashboard(props: { rows: MobileCompanionDashboardRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>MobileCompanion</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/MobileDevicesPage.tsx`

```text
import React from 'react';
export interface MobileDevicesPageRow { id: string; title: string; status: string; detail?: string; }
export function MobileDevicesPage(props: { rows: MobileDevicesPageRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>MobileDevices</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/MobileDiagnosticsPage.tsx`

```text
import React from 'react';
export interface MobileDiagnosticsPageRow { id: string; title: string; status: string; detail?: string; }
export function MobileDiagnosticsPage(props: { rows: MobileDiagnosticsPageRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>MobileDiagnostics</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/PushTokensPage.tsx`

```text
import React from 'react';
export interface PushTokensPageRow { id: string; title: string; status: string; detail?: string; }
export function PushTokensPage(props: { rows: PushTokensPageRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>PushTokens</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/PwaInstallPromptsPage.tsx`

```text
import React from 'react';
export interface PwaInstallPromptsPageRow { id: string; title: string; status: string; detail?: string; }
export function PwaInstallPromptsPage(props: { rows: PwaInstallPromptsPageRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>PwaInstallPrompts</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/QrPairingPanel.tsx`

```text
import React from 'react';
export interface QrPairingPanelRow { id: string; title: string; status: string; detail?: string; }
export function QrPairingPanel(props: { rows: QrPairingPanelRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>QrPairing</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/SessionRequestNotificationsPage.tsx`

```text
import React from 'react';
export interface SessionRequestNotificationsPageRow { id: string; title: string; status: string; detail?: string; }
export function SessionRequestNotificationsPage(props: { rows: SessionRequestNotificationsPageRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>SessionRequestNotifications</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/components/TrustedNetworksPage.tsx`

```text
import React from 'react';
export interface TrustedNetworksPageRow { id: string; title: string; status: string; detail?: string; }
export function TrustedNetworksPage(props: { rows: TrustedNetworksPageRow[]; onOpen?: (id: string) => void }): JSX.Element { return <main><h1>TrustedNetworks</h1>{props.rows.length === 0 ? <p>No mobile companion records.</p> : <ul>{props.rows.map((row) => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onOpen && <button type='button' onClick={() => props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/useDeviceApprovalPolicies.ts`

```text
import { useEffect, useState } from 'react';
export interface useDeviceApprovalPoliciesResult<T> { data?: T; loading: boolean; error?: string; }
export function useDeviceApprovalPolicies<T>(loader: () => Promise<T>): useDeviceApprovalPoliciesResult<T> { const [state, setState] = useState<useDeviceApprovalPoliciesResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileApprovalRequests.ts`

```text
import { useEffect, useState } from 'react';
export interface useMobileApprovalRequestsResult<T> { data?: T; loading: boolean; error?: string; }
export function useMobileApprovalRequests<T>(loader: () => Promise<T>): useMobileApprovalRequestsResult<T> { const [state, setState] = useState<useMobileApprovalRequestsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileAudit.ts`

```text
import { useEffect, useState } from 'react';
export interface useMobileAuditResult<T> { data?: T; loading: boolean; error?: string; }
export function useMobileAudit<T>(loader: () => Promise<T>): useMobileAuditResult<T> { const [state, setState] = useState<useMobileAuditResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileDevices.ts`

```text
import { useEffect, useState } from 'react';
export interface useMobileDevicesResult<T> { data?: T; loading: boolean; error?: string; }
export function useMobileDevices<T>(loader: () => Promise<T>): useMobileDevicesResult<T> { const [state, setState] = useState<useMobileDevicesResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileDiagnostics.ts`

```text
import { useEffect, useState } from 'react';
export interface useMobileDiagnosticsResult<T> { data?: T; loading: boolean; error?: string; }
export function useMobileDiagnostics<T>(loader: () => Promise<T>): useMobileDiagnosticsResult<T> { const [state, setState] = useState<useMobileDiagnosticsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePairingCodes.ts`

```text
import { useEffect, useState } from 'react';
export interface usePairingCodesResult<T> { data?: T; loading: boolean; error?: string; }
export function usePairingCodes<T>(loader: () => Promise<T>): usePairingCodesResult<T> { const [state, setState] = useState<usePairingCodesResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePushTokens.ts`

```text
import { useEffect, useState } from 'react';
export interface usePushTokensResult<T> { data?: T; loading: boolean; error?: string; }
export function usePushTokens<T>(loader: () => Promise<T>): usePushTokensResult<T> { const [state, setState] = useState<usePushTokensResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePwaInstallPrompts.ts`

```text
import { useEffect, useState } from 'react';
export interface usePwaInstallPromptsResult<T> { data?: T; loading: boolean; error?: string; }
export function usePwaInstallPrompts<T>(loader: () => Promise<T>): usePwaInstallPromptsResult<T> { const [state, setState] = useState<usePwaInstallPromptsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/useSessionRequestNotifications.ts`

```text
import { useEffect, useState } from 'react';
export interface useSessionRequestNotificationsResult<T> { data?: T; loading: boolean; error?: string; }
export function useSessionRequestNotifications<T>(loader: () => Promise<T>): useSessionRequestNotificationsResult<T> { const [state, setState] = useState<useSessionRequestNotificationsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/hooks/useTrustedNetworks.ts`

```text
import { useEffect, useState } from 'react';
export interface useTrustedNetworksResult<T> { data?: T; loading: boolean; error?: string; }
export function useTrustedNetworks<T>(loader: () => Promise<T>): useTrustedNetworksResult<T> { const [state, setState] = useState<useTrustedNetworksResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack15/index.ts`

```text
export * from "./components/MobileCompanionDashboard.js";
export * from "./components/QrPairingPanel.js";
export * from "./components/MobileDevicesPage.js";
export * from "./components/PushTokensPage.js";
export * from "./components/MobileApprovalRequestsPage.js";
export * from "./components/SessionRequestNotificationsPage.js";
export * from "./components/MobileDiagnosticsPage.js";
export * from "./components/TrustedNetworksPage.js";
export * from "./components/PwaInstallPromptsPage.js";
export * from "./components/DeviceApprovalPoliciesPage.js";
export * from "./hooks/usePairingCodes.js";
export * from "./hooks/useMobileDevices.js";
export * from "./hooks/usePushTokens.js";
export * from "./hooks/useMobileApprovalRequests.js";
export * from "./hooks/useSessionRequestNotifications.js";
export * from "./hooks/useMobileDiagnostics.js";
export * from "./hooks/useTrustedNetworks.js";
export * from "./hooks/usePwaInstallPrompts.js";
export * from "./hooks/useDeviceApprovalPolicies.js";
export * from "./hooks/useMobileAudit.js";

```


## `SAFE_DIRECT_COPY/docs/pack15/01-merge-guide.md`

```text
Pack 15 adds mobile companion/PWA support: QR pairing, mobile devices, push tokens, mobile approvals, session notifications, mobile diagnostics, trusted networks, PWA prompts and desktop pairing UI.

```


## `SAFE_DIRECT_COPY/docs/pack15/02-qr-pairing.md`

```text
QR pairing payloads require HTTPS API base URL, expiry, max attempts and code hashing. Do not store raw pairing codes or access tokens in QR payloads.

```


## `SAFE_DIRECT_COPY/docs/pack15/03-push-notifications.md`

```text
Push messages are redacted before display. Do not send secrets, clipboard contents, tokens or passwords in push payloads.

```


## `SAFE_DIRECT_COPY/docs/pack15/04-mobile-approvals.md`

```text
Mobile approval can approve or reject session workflows but does not grant unattended access or native input execution.

```


## `SAFE_DIRECT_COPY/docs/pack15/05-device-posture.md`

```text
Mobile posture surfaces unsupported versions, disabled push, unknown screen lock and rooted/jailbroken signals.

```


## `SAFE_DIRECT_COPY/docs/pack15/06-pwa-companion.md`

```text
PWA install prompts should be optional and rate-limited. The PWA companion should not receive OAuth secrets or desktop tokens.

```


## `SAFE_DIRECT_COPY/docs/pack15/07-qa-checklist.md`

```text
Verify QR payload parsing, pairing expiry, push redaction, approval transitions, trusted network validation, desktop QR display and mobile approval prompt.

```


## `SAFE_DIRECT_COPY/infra/pack15/prometheus-mobile-alerts.yml`

```text
groups:
  - name: remotedesk-mobile-pack15
    rules:
      - alert: RemoteDeskPairingFailuresHigh
        expr: rate(remotedesk_mobile_pairing_failures_total[10m]) > 0.2
        for: 10m
        labels:
          severity: warning
      - alert: RemoteDeskPushDeliveryFailures
        expr: rate(remotedesk_push_delivery_failures_total[10m]) > 0.1
        for: 15m
        labels:
          severity: warning

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/deepLinkSafety.ts`

```text
export function isSafeMobileDeepLink(url: string): boolean { try { const parsed = new URL(url); return parsed.protocol === 'remotedesk:' || (parsed.protocol === 'https:' && parsed.hostname.length > 0); } catch { return false; } }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/index.ts`

```text
export * from "./pairingCode.js";
export * from "./qrPayload.js";
export * from "./mobileApproval.js";
export * from "./pushRedaction.js";
export * from "./mobileDevicePosture.js";
export * from "./deepLinkSafety.js";
export * from "./sessionRequestCooldown.js";
export * from "./trustedNetwork.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/mobileApproval.ts`

```text
export type MobileApprovalState = 'pending' | 'approved' | 'rejected' | 'expired';
export function mobileApprovalIsFinal(state: MobileApprovalState): boolean { return state === 'approved' || state === 'rejected' || state === 'expired'; }
export function mobileApprovalAllowsSession(state: MobileApprovalState): boolean { return state === 'approved'; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/mobileDevicePosture.ts`

```text
export interface MobileDevicePostureInput { appVersionSupported: boolean; pushEnabled: boolean; screenLockKnown: boolean; rootedOrJailbrokenKnown: boolean; }
export function evaluateMobileDevicePosture(input: MobileDevicePostureInput): { trusted: boolean; findings: string[] } { const findings: string[] = []; if (!input.appVersionSupported) findings.push('unsupported-mobile-app-version'); if (!input.pushEnabled) findings.push('push-notifications-disabled'); if (!input.screenLockKnown) findings.push('screen-lock-unknown'); if (input.rootedOrJailbrokenKnown) findings.push('rooted-or-jailbroken'); return { trusted: findings.length === 0, findings }; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/pairingCode.ts`

```text
export interface PairingCode { code: string; expiresAt: string; maxAttempts: number; attempts: number; }
export function normalizePairingCode(code: string): string { return code.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 16); }
export function canUsePairingCode(pairing: PairingCode, now = new Date()): boolean { return normalizePairingCode(pairing.code).length >= 8 && new Date(pairing.expiresAt) > now && pairing.attempts < pairing.maxAttempts; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/pushRedaction.ts`

```text
export interface PushMessage { title: string; body: string; data?: Record<string, string>; }
const SECRET_PATTERN = /(password|token|secret|api[_-]?key|clipboard)/i;
export function redactPushMessage(message: PushMessage): PushMessage { const scrub = (value: string) => SECRET_PATTERN.test(value) ? '[redacted]' : value.slice(0, 240); return { title: scrub(message.title), body: scrub(message.body), data: message.data ? Object.fromEntries(Object.entries(message.data).map(([k,v]) => [k, scrub(v)])) : undefined }; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/qrPayload.ts`

```text
export interface QrPairingPayload { version: 1; code: string; apiBaseUrl: string; expiresAt: string; }
export function encodeQrPairingPayload(payload: QrPairingPayload): string { return JSON.stringify(payload); }
export function parseQrPairingPayload(value: string): QrPairingPayload | undefined { try { const parsed = JSON.parse(value) as Partial<QrPairingPayload>; if (parsed.version !== 1 || typeof parsed.code !== 'string' || typeof parsed.apiBaseUrl !== 'string' || typeof parsed.expiresAt !== 'string') return undefined; if (!parsed.apiBaseUrl.startsWith('https://')) return undefined; return parsed as QrPairingPayload; } catch { return undefined; } }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/sessionRequestCooldown.ts`

```text
export interface SessionRequestCooldown { lastRequestedAt?: string; cooldownMs: number; }
export function canSendSessionRequest(input: SessionRequestCooldown, now = new Date()): boolean { if (!input.lastRequestedAt) return true; return now.getTime() - new Date(input.lastRequestedAt).getTime() >= input.cooldownMs; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack15/trustedNetwork.ts`

```text
export interface TrustedNetwork { id: string; label: string; cidr: string; enabled: boolean; }
export function trustedNetworkLabel(network: TrustedNetwork): string { return `${network.label} (${network.enabled ? 'enabled' : 'disabled'})`; }

```


## `SAFE_DIRECT_COPY/scripts/pack15/check-mobile-secrets.mjs`

```text
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = process.argv[2] ?? '.'; const bad = [];
function walk(dir) { for (const entry of readdirSync(dir)) { const path = join(dir, entry); const stat = statSync(path); if (stat.isDirectory()) walk(path); else { const text = readFileSync(path, 'utf8'); if (/push.*(password|token|secret|clipboard)|rawPairingCode|mobile.*accessToken/i.test(text)) bad.push(path); } } }
walk(root); if (bad.length) { console.error('Potential mobile secret exposure:', bad); process.exit(1); } console.log('No mobile secret exposure patterns found.');

```


## `SAFE_DIRECT_COPY/tests/pack15/deepLinkSafety.test.ts`

```text
import assert from 'node:assert/strict'; import { isSafeMobileDeepLink } from '../../packages/shared/src/pack15/deepLinkSafety.js'; assert.equal(isSafeMobileDeepLink('remotedesk://pair'), true); assert.equal(isSafeMobileDeepLink('javascript:alert(1)'), false);

```


## `SAFE_DIRECT_COPY/tests/pack15/mobileApproval.test.ts`

```text
import assert from 'node:assert/strict'; import { mobileApprovalIsFinal, mobileApprovalAllowsSession } from '../../packages/shared/src/pack15/mobileApproval.js'; assert.equal(mobileApprovalIsFinal('approved'), true); assert.equal(mobileApprovalAllowsSession('pending'), false);

```


## `SAFE_DIRECT_COPY/tests/pack15/mobileCompanionStatus.test.ts`

```text
import assert from 'node:assert/strict'; import { mobileCompanionNeedsAttention } from '../../REVIEW_REQUIRED/apps/desktop/src/pack15/mobileCompanionStatus.js'; assert.equal(mobileCompanionNeedsAttention({ pairedDevices: 1, pushEnabled: false, pendingApprovals: 0 }), true);

```


## `SAFE_DIRECT_COPY/tests/pack15/mobileDevicePosture.test.ts`

```text
import assert from 'node:assert/strict'; import { evaluateMobileDevicePosture } from '../../packages/shared/src/pack15/mobileDevicePosture.js'; assert.equal(evaluateMobileDevicePosture({ appVersionSupported: true, pushEnabled: true, screenLockKnown: true, rootedOrJailbrokenKnown: false }).trusted, true);

```


## `SAFE_DIRECT_COPY/tests/pack15/pairingCode.test.ts`

```text
import assert from 'node:assert/strict'; import { normalizePairingCode, canUsePairingCode } from '../../packages/shared/src/pack15/pairingCode.js'; assert.equal(normalizePairingCode('ab-cd 1234'), 'ABCD1234'); assert.equal(canUsePairingCode({ code: 'ABCD1234', expiresAt: '2999-01-01T00:00:00Z', maxAttempts: 3, attempts: 0 }), true);

```


## `SAFE_DIRECT_COPY/tests/pack15/pairingCodePolicy.test.ts`

```text
import assert from 'node:assert/strict'; import { validatePairingCodeRequest } from '../../REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodePolicy.js'; assert.deepEqual(validatePairingCodeRequest({ expiresAt: '2999-01-01T00:00:00Z', maxAttempts: 3 }), []);

```


## `SAFE_DIRECT_COPY/tests/pack15/pushRedaction.test.ts`

```text
import assert from 'node:assert/strict'; import { redactPushMessage } from '../../packages/shared/src/pack15/pushRedaction.js'; assert.equal(redactPushMessage({ title: 'token', body: 'hello' }).title, '[redacted]');

```


## `SAFE_DIRECT_COPY/tests/pack15/qrPayload.test.ts`

```text
import assert from 'node:assert/strict'; import { encodeQrPairingPayload, parseQrPairingPayload } from '../../packages/shared/src/pack15/qrPayload.js'; const text = encodeQrPairingPayload({ version: 1, code: 'ABC', apiBaseUrl: 'https://api.example.com', expiresAt: '2999-01-01T00:00:00Z' }); assert.equal(parseQrPairingPayload(text)?.version, 1);

```


## `SAFE_DIRECT_COPY/tests/pack15/trustedNetworkPolicy.test.ts`

```text
import assert from 'node:assert/strict'; import { validateTrustedNetworkCidr } from '../../REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworkPolicy.js'; assert.equal(validateTrustedNetworkCidr('10.0.0.0/8'), true);

```


## `generated-remotedesk-mobile-companion-pack-15-code-review.md`

```text
Review pairing code hashing, QR payload contents, push redaction, mobile approval transitions, trusted network validation, team/device repository filtering, and desktop UI placement.

```


## `generated-remotedesk-mobile-companion-pack-15-manifest.json`

```text
{
  "name": "generated-remotedesk-mobile-companion-pack-15",
  "createdAt": "2026-06-15T06:21:35.967932+00:00",
  "actualFileCount": 112,
  "safeDirectCopyCount": 27,
  "reviewRequiredCount": 74,
  "patchesCount": 4,
  "doNotMergeCount": 0,
  "filesByArea": {
    "shared": 9,
    "api": 47,
    "web": 21,
    "desktop": 6,
    "tests": 9,
    "docs": 7,
    "scripts": 1,
    "infra": 1
  },
  "safeDirectCopy": [
    "SAFE_DIRECT_COPY/docs/pack15/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack15/02-qr-pairing.md",
    "SAFE_DIRECT_COPY/docs/pack15/03-push-notifications.md",
    "SAFE_DIRECT_COPY/docs/pack15/04-mobile-approvals.md",
    "SAFE_DIRECT_COPY/docs/pack15/05-device-posture.md",
    "SAFE_DIRECT_COPY/docs/pack15/06-pwa-companion.md",
    "SAFE_DIRECT_COPY/docs/pack15/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack15/prometheus-mobile-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/deepLinkSafety.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/mobileApproval.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/mobileDevicePosture.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/pairingCode.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/pushRedaction.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/qrPayload.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/sessionRequestCooldown.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack15/trustedNetwork.ts",
    "SAFE_DIRECT_COPY/scripts/pack15/check-mobile-secrets.mjs",
    "SAFE_DIRECT_COPY/tests/pack15/deepLinkSafety.test.ts",
    "SAFE_DIRECT_COPY/tests/pack15/mobileApproval.test.ts",
    "SAFE_DIRECT_COPY/tests/pack15/mobileCompanionStatus.test.ts",
    "SAFE_DIRECT_COPY/tests/pack15/mobileDevicePosture.test.ts",
    "SAFE_DIRECT_COPY/tests/pack15/pairingCode.test.ts",
    "SAFE_DIRECT_COPY/tests/pack15/pairingCodePolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack15/pushRedaction.test.ts",
    "SAFE_DIRECT_COPY/tests/pack15/qrPayload.test.ts",
    "SAFE_DIRECT_COPY/tests/pack15/trustedNetworkPolicy.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack15/common/mobileCompanionAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/common/pack15Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/deviceApprovalPoliciesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/deviceApprovalPolicies/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileApprovalRequests/mobileApprovalRequestsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileAudit/mobileAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileDevices/mobileDevicesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/mobileDiagnostics/mobileDiagnosticsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodePolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pairingCodes/pairingCodesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokenPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pushTokens/pushTokensTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/pwaInstallPrompts/pwaInstallPromptsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/sessionRequestNotifications/sessionRequestNotificationsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworkPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack15/trustedNetworks/trustedNetworksTypes.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack15/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack15/mobileApprovalPrompt.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack15/mobileCompanionStatus.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack15/pushNotificationPreview.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack15/qrPairingDisplay.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack15/trustedNetworkIndicator.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/DeviceApprovalPoliciesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/MobileApprovalRequestsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/MobileCompanionDashboard.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/MobileDevicesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/MobileDiagnosticsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/PushTokensPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/PwaInstallPromptsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/QrPairingPanel.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/SessionRequestNotificationsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/components/TrustedNetworksPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/useDeviceApprovalPolicies.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileApprovalRequests.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileDevices.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/useMobileDiagnostics.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePairingCodes.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePushTokens.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/usePwaInstallPrompts.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/useSessionRequestNotifications.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/hooks/useTrustedNetworks.ts",
    "REVIEW_REQUIRED/apps/web/src/pack15/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack15.patch.md",
    "PATCHES/desktop-pack15.patch.md",
    "PATCHES/ops-pack15.patch.md",
    "PATCHES/web-pack15.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Push providers APNS/FCM/WebPush are represented as contracts only.",
    "QR payload intentionally excludes access tokens and secrets.",
    "Mobile approval does not grant unattended access or native input execution.",
    "Team ownership and device ownership must be enforced in repositories."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 90-96% with prior packs after persistence, push provider wiring and mobile/PWA QA"
}
```


## `generated-remotedesk-mobile-companion-pack-15-merge-summary.md`

```text
Pack 15 adds mobile companion/PWA support: pairing codes, QR payloads, mobile devices, push tokens, mobile approvals, session notifications, diagnostics, trusted networks, PWA prompts, admin pages, desktop QR/approval UI, tests/docs/scripts.

```


## `generated-remotedesk-mobile-companion-pack-15-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| QR token leak | High | short expiry and no access tokens |
| Push secret exposure | High | redaction and scanner |
| Pairing brute force | High | max attempts and rate limits |
| Mobile approval abuse | High | audit and user verification |
| Device ownership bypass | Critical | repository-level team/user filtering |

```


## `generated-remotedesk-mobile-companion-pack-15-test-plan.md`

```text
Run Pack 15 shared/API/desktop tests, mobile secret scanner, then manual QA for QR pairing, push notification redaction, mobile approvals, trusted networks, PWA prompts, and desktop approval UI.

```
