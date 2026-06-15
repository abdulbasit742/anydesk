# generated-remotedesk-launch-readiness-pack-9 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack9.patch.md
PATCHES/desktop-pack9.patch.md
PATCHES/ops-pack9.patch.md
PATCHES/web-pack9.patch.md
REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsService.ts
REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/common/launchAuth.ts
REVIEW_REQUIRED/apps/api/src/pack9/common/pack9Route.ts
REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsService.ts
REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsService.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/importJobValidator.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsService.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsService.ts
REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceService.ts
REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksService.ts
REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationGate.ts
REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsService.ts
REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutGate.ts
REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsService.ts
REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesService.ts
REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/index.ts
REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsService.ts
REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsTypes.ts
REVIEW_REQUIRED/apps/desktop/src/pack9/connectionDoctor.ts
REVIEW_REQUIRED/apps/desktop/src/pack9/desktopSmokeChecklist.ts
REVIEW_REQUIRED/apps/desktop/src/pack9/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack9/launchReadinessBanner.tsx
REVIEW_REQUIRED/apps/desktop/src/pack9/selfTestRunner.ts
REVIEW_REQUIRED/apps/desktop/src/pack9/systemPermissionsPanel.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/ApiHealthPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/CustomerAnnouncementsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/DataImportJobsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/DataImportRowsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/LaunchChecklistPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/LicenseCompliancePage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/MigrationChecksPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/RolloutApprovalsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/SecurityDrillsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/SessionQualityPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/components/SupportEscalationsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useApiHealth.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useCustomerAnnouncements.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useDataImportJobs.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useLaunchChecklist.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useLicenseCompliance.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useMigrationChecks.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useRolloutApprovals.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSecurityDrills.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSessionQuality.ts
REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSupportEscalations.ts
REVIEW_REQUIRED/apps/web/src/pack9/index.ts
SAFE_DIRECT_COPY/docs/pack9/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack9/02-data-import.md
SAFE_DIRECT_COPY/docs/pack9/03-migration-gates.md
SAFE_DIRECT_COPY/docs/pack9/04-rollout-approvals.md
SAFE_DIRECT_COPY/docs/pack9/05-desktop-self-diagnostics.md
SAFE_DIRECT_COPY/docs/pack9/06-license-compliance.md
SAFE_DIRECT_COPY/docs/pack9/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack9/prometheus-launch-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack9/announcementAudience.ts
SAFE_DIRECT_COPY/packages/shared/src/pack9/importRowValidation.ts
SAFE_DIRECT_COPY/packages/shared/src/pack9/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack9/launchChecklist.ts
SAFE_DIRECT_COPY/packages/shared/src/pack9/migrationRisk.ts
SAFE_DIRECT_COPY/packages/shared/src/pack9/qualityBudget.ts
SAFE_DIRECT_COPY/packages/shared/src/pack9/releaseCandidate.ts
SAFE_DIRECT_COPY/packages/shared/src/pack9/supportEscalation.ts
SAFE_DIRECT_COPY/scripts/pack9/check-no-release-blockers.mjs
SAFE_DIRECT_COPY/scripts/pack9/run-launch-smoke-check.mjs
SAFE_DIRECT_COPY/tests/pack9/connectionDoctor.test.ts
SAFE_DIRECT_COPY/tests/pack9/desktopSmokeChecklist.test.ts
SAFE_DIRECT_COPY/tests/pack9/importJobValidator.test.ts
SAFE_DIRECT_COPY/tests/pack9/launchChecklist.test.ts
SAFE_DIRECT_COPY/tests/pack9/migrationGate.test.ts
SAFE_DIRECT_COPY/tests/pack9/migrationRisk.test.ts
SAFE_DIRECT_COPY/tests/pack9/qualityBudget.test.ts
SAFE_DIRECT_COPY/tests/pack9/releaseCandidate.test.ts
SAFE_DIRECT_COPY/tests/pack9/supportEscalation.test.ts
generated-remotedesk-launch-readiness-pack-9-code-review.md
generated-remotedesk-launch-readiness-pack-9-manifest.json
generated-remotedesk-launch-readiness-pack-9-merge-summary.md
generated-remotedesk-launch-readiness-pack-9-risk-register.md
generated-remotedesk-launch-readiness-pack-9-test-plan.md

```


## `PATCHES/api-pack9.patch.md`

```text
Mount Pack 9 API routes behind owner/admin launch permissions. Wire migration gates into release approval, not normal customer traffic.

```


## `PATCHES/desktop-pack9.patch.md`

```text
Wire self-test runner and connection doctor into diagnostics/settings. Do not enable native input or unattended access.

```


## `PATCHES/ops-pack9.patch.md`

```text
Run launch smoke checks against staging and production before rollout. Do not run destructive import/migration checks without review.

```


## `PATCHES/web-pack9.patch.md`

```text
Mount Pack 9 launch pages only for admin/internal roles. Customer announcements must be reviewed before sending.

```


## `REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { ApiHealthSnapshotRecordService } from "./apiHealthSnapshotsService.js";
export function registerApiHealthSnapshotRecordRoutes(router: Router, service: ApiHealthSnapshotRecordService): void { router.get("/pack9/apiHealthSnapshots", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/apiHealthSnapshots", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsService.ts`

```text
import type { ApiHealthSnapshotRecord, ApiHealthSnapshotRecordRepository } from "./apiHealthSnapshotsTypes.js";
export class ApiHealthSnapshotRecordService { constructor(private readonly repository: ApiHealthSnapshotRecordRepository) {} create(record: ApiHealthSnapshotRecord): Promise<ApiHealthSnapshotRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<ApiHealthSnapshotRecord>): Promise<ApiHealthSnapshotRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("apiHealthSnapshots-not-found"); return updated; } list(filter: Partial<ApiHealthSnapshotRecord> = {}, limit = 50): Promise<ApiHealthSnapshotRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsTypes.ts`

```text
export interface ApiHealthSnapshotRecord { id: string; p95Ms: number; errorRate: number; uptimePercent: number; capturedAt: string; }
export interface ApiHealthSnapshotRecordRepository { create(record: ApiHealthSnapshotRecord): Promise<ApiHealthSnapshotRecord>; update(id: string, patch: Partial<ApiHealthSnapshotRecord>): Promise<ApiHealthSnapshotRecord | null>; list(filter: Partial<ApiHealthSnapshotRecord>, limit: number): Promise<ApiHealthSnapshotRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/index.ts`

```text
export * from "./apiHealthSnapshotsTypes.js";
export * from "./apiHealthSnapshotsService.js";
export * from "./apiHealthSnapshotsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/common/launchAuth.ts`

```text
import type { Request, Response, NextFunction } from "express";
export function requireLaunchAdmin(req: Request, res: Response, next: NextFunction): void { const user = req.user as { role?: string; permissions?: string[] } | undefined; if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("launch:manage")) { next(); return; } res.status(403).json({ error: "launch_admin_required" }); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/common/pack9Route.ts`

```text
import type { Request, Response, NextFunction } from "express";
export function pack9Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) { return (req: Request, res: Response, next: NextFunction): void => { handler(req, res, next).catch(next); }; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { CustomerAnnouncementRecordService } from "./customerAnnouncementsService.js";
export function registerCustomerAnnouncementRecordRoutes(router: Router, service: CustomerAnnouncementRecordService): void { router.get("/pack9/customerAnnouncements", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/customerAnnouncements", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsService.ts`

```text
import type { CustomerAnnouncementRecord, CustomerAnnouncementRecordRepository } from "./customerAnnouncementsTypes.js";
export class CustomerAnnouncementRecordService { constructor(private readonly repository: CustomerAnnouncementRecordRepository) {} create(record: CustomerAnnouncementRecord): Promise<CustomerAnnouncementRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<CustomerAnnouncementRecord>): Promise<CustomerAnnouncementRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("customerAnnouncements-not-found"); return updated; } list(filter: Partial<CustomerAnnouncementRecord> = {}, limit = 50): Promise<CustomerAnnouncementRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsTypes.ts`

```text
export interface CustomerAnnouncementRecord { id: string; title: string; body: string; audience: string; scheduledAt?: string; sentAt?: string; createdByUserId: string; }
export interface CustomerAnnouncementRecordRepository { create(record: CustomerAnnouncementRecord): Promise<CustomerAnnouncementRecord>; update(id: string, patch: Partial<CustomerAnnouncementRecord>): Promise<CustomerAnnouncementRecord | null>; list(filter: Partial<CustomerAnnouncementRecord>, limit: number): Promise<CustomerAnnouncementRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/index.ts`

```text
export * from "./customerAnnouncementsTypes.js";
export * from "./customerAnnouncementsService.js";
export * from "./customerAnnouncementsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { DataImportJobRecordService } from "./dataImportJobsService.js";
export function registerDataImportJobRecordRoutes(router: Router, service: DataImportJobRecordService): void { router.get("/pack9/dataImportJobs", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/dataImportJobs", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsService.ts`

```text
import type { DataImportJobRecord, DataImportJobRecordRepository } from "./dataImportJobsTypes.js";
export class DataImportJobRecordService { constructor(private readonly repository: DataImportJobRecordRepository) {} create(record: DataImportJobRecord): Promise<DataImportJobRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<DataImportJobRecord>): Promise<DataImportJobRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("dataImportJobs-not-found"); return updated; } list(filter: Partial<DataImportJobRecord> = {}, limit = 50): Promise<DataImportJobRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsTypes.ts`

```text
export interface DataImportJobRecord { id: string; teamId: string; kind: "users" | "devices" | "support_tickets"; status: "queued" | "validating" | "running" | "completed" | "failed"; createdAt: string; completedAt?: string; }
export interface DataImportJobRecordRepository { create(record: DataImportJobRecord): Promise<DataImportJobRecord>; update(id: string, patch: Partial<DataImportJobRecord>): Promise<DataImportJobRecord | null>; list(filter: Partial<DataImportJobRecord>, limit: number): Promise<DataImportJobRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/importJobValidator.ts`

```text
export function validateImportJobKind(kind: string): kind is "users" | "devices" | "support_tickets" { return ["users", "devices", "support_tickets"].includes(kind); }
export function importJobCanRun(status: string): boolean { return status === "queued" || status === "validating"; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/index.ts`

```text
export * from "./dataImportJobsTypes.js";
export * from "./dataImportJobsService.js";
export * from "./dataImportJobsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { DataImportRowRecordService } from "./dataImportRowsService.js";
export function registerDataImportRowRecordRoutes(router: Router, service: DataImportRowRecordService): void { router.get("/pack9/dataImportRows", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/dataImportRows", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsService.ts`

```text
import type { DataImportRowRecord, DataImportRowRecordRepository } from "./dataImportRowsTypes.js";
export class DataImportRowRecordService { constructor(private readonly repository: DataImportRowRecordRepository) {} create(record: DataImportRowRecord): Promise<DataImportRowRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<DataImportRowRecord>): Promise<DataImportRowRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("dataImportRows-not-found"); return updated; } list(filter: Partial<DataImportRowRecord> = {}, limit = 50): Promise<DataImportRowRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsTypes.ts`

```text
export interface DataImportRowRecord { id: string; importJobId: string; rowNumber: number; status: "valid" | "invalid" | "imported" | "skipped"; errors: string[]; }
export interface DataImportRowRecordRepository { create(record: DataImportRowRecord): Promise<DataImportRowRecord>; update(id: string, patch: Partial<DataImportRowRecord>): Promise<DataImportRowRecord | null>; list(filter: Partial<DataImportRowRecord>, limit: number): Promise<DataImportRowRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/index.ts`

```text
export * from "./dataImportRowsTypes.js";
export * from "./dataImportRowsService.js";
export * from "./dataImportRowsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/index.ts`

```text
export * from "./common/pack9Route.js";
export * from "./common/launchAuth.js";
export * from "./dataImportJobs/importJobValidator.js";
export * from "./migrationChecks/migrationGate.js";
export * from "./rolloutApprovals/rolloutGate.js";
export * from "./supportEscalations/supportEscalationPolicy.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/index.ts`

```text
export * from "./launchChecklistsTypes.js";
export * from "./launchChecklistsService.js";
export * from "./launchChecklistsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { LaunchChecklistRecordService } from "./launchChecklistsService.js";
export function registerLaunchChecklistRecordRoutes(router: Router, service: LaunchChecklistRecordService): void { router.get("/pack9/launchChecklists", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/launchChecklists", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsService.ts`

```text
import type { LaunchChecklistRecord, LaunchChecklistRecordRepository } from "./launchChecklistsTypes.js";
export class LaunchChecklistRecordService { constructor(private readonly repository: LaunchChecklistRecordRepository) {} create(record: LaunchChecklistRecord): Promise<LaunchChecklistRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<LaunchChecklistRecord>): Promise<LaunchChecklistRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("launchChecklists-not-found"); return updated; } list(filter: Partial<LaunchChecklistRecord> = {}, limit = 50): Promise<LaunchChecklistRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsTypes.ts`

```text
export interface LaunchChecklistRecord { id: string; area: string; label: string; status: "pass" | "warn" | "fail" | "not_applicable"; required: boolean; updatedAt: string; }
export interface LaunchChecklistRecordRepository { create(record: LaunchChecklistRecord): Promise<LaunchChecklistRecord>; update(id: string, patch: Partial<LaunchChecklistRecord>): Promise<LaunchChecklistRecord | null>; list(filter: Partial<LaunchChecklistRecord>, limit: number): Promise<LaunchChecklistRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/index.ts`

```text
export * from "./licenseComplianceTypes.js";
export * from "./licenseComplianceService.js";
export * from "./licenseComplianceRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { LicenseComplianceRecordService } from "./licenseComplianceService.js";
export function registerLicenseComplianceRecordRoutes(router: Router, service: LicenseComplianceRecordService): void { router.get("/pack9/licenseCompliance", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/licenseCompliance", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceService.ts`

```text
import type { LicenseComplianceRecord, LicenseComplianceRecordRepository } from "./licenseComplianceTypes.js";
export class LicenseComplianceRecordService { constructor(private readonly repository: LicenseComplianceRecordRepository) {} create(record: LicenseComplianceRecord): Promise<LicenseComplianceRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<LicenseComplianceRecord>): Promise<LicenseComplianceRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("licenseCompliance-not-found"); return updated; } list(filter: Partial<LicenseComplianceRecord> = {}, limit = 50): Promise<LicenseComplianceRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceTypes.ts`

```text
export interface LicenseComplianceRecord { id: string; dependencyName: string; license: string; allowed: boolean; reviewedAt: string; notes?: string; }
export interface LicenseComplianceRecordRepository { create(record: LicenseComplianceRecord): Promise<LicenseComplianceRecord>; update(id: string, patch: Partial<LicenseComplianceRecord>): Promise<LicenseComplianceRecord | null>; list(filter: Partial<LicenseComplianceRecord>, limit: number): Promise<LicenseComplianceRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/index.ts`

```text
export * from "./migrationChecksTypes.js";
export * from "./migrationChecksService.js";
export * from "./migrationChecksRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { MigrationCheckRecordService } from "./migrationChecksService.js";
export function registerMigrationCheckRecordRoutes(router: Router, service: MigrationCheckRecordService): void { router.get("/pack9/migrationChecks", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/migrationChecks", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksService.ts`

```text
import type { MigrationCheckRecord, MigrationCheckRecordRepository } from "./migrationChecksTypes.js";
export class MigrationCheckRecordService { constructor(private readonly repository: MigrationCheckRecordRepository) {} create(record: MigrationCheckRecord): Promise<MigrationCheckRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<MigrationCheckRecord>): Promise<MigrationCheckRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("migrationChecks-not-found"); return updated; } list(filter: Partial<MigrationCheckRecord> = {}, limit = 50): Promise<MigrationCheckRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksTypes.ts`

```text
export interface MigrationCheckRecord { id: string; migrationName: string; risk: "low" | "medium" | "high" | "critical"; reviewed: boolean; destructive: boolean; checkedAt: string; }
export interface MigrationCheckRecordRepository { create(record: MigrationCheckRecord): Promise<MigrationCheckRecord>; update(id: string, patch: Partial<MigrationCheckRecord>): Promise<MigrationCheckRecord | null>; list(filter: Partial<MigrationCheckRecord>, limit: number): Promise<MigrationCheckRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationGate.ts`

```text
export function migrationBlocksLaunch(input: { risk: "low" | "medium" | "high" | "critical"; reviewed: boolean; destructive: boolean }): boolean { if (input.risk === "critical") return true; if (input.destructive && !input.reviewed) return true; if (input.risk === "high" && !input.reviewed) return true; return false; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/index.ts`

```text
export * from "./rolloutApprovalsTypes.js";
export * from "./rolloutApprovalsService.js";
export * from "./rolloutApprovalsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { RolloutApprovalRecordService } from "./rolloutApprovalsService.js";
export function registerRolloutApprovalRecordRoutes(router: Router, service: RolloutApprovalRecordService): void { router.get("/pack9/rolloutApprovals", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/rolloutApprovals", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsService.ts`

```text
import type { RolloutApprovalRecord, RolloutApprovalRecordRepository } from "./rolloutApprovalsTypes.js";
export class RolloutApprovalRecordService { constructor(private readonly repository: RolloutApprovalRecordRepository) {} create(record: RolloutApprovalRecord): Promise<RolloutApprovalRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<RolloutApprovalRecord>): Promise<RolloutApprovalRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("rolloutApprovals-not-found"); return updated; } list(filter: Partial<RolloutApprovalRecord> = {}, limit = 50): Promise<RolloutApprovalRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsTypes.ts`

```text
export interface RolloutApprovalRecord { id: string; version: string; environment: "staging" | "production"; status: "pending" | "approved" | "rejected"; approverUserId?: string; createdAt: string; }
export interface RolloutApprovalRecordRepository { create(record: RolloutApprovalRecord): Promise<RolloutApprovalRecord>; update(id: string, patch: Partial<RolloutApprovalRecord>): Promise<RolloutApprovalRecord | null>; list(filter: Partial<RolloutApprovalRecord>, limit: number): Promise<RolloutApprovalRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutGate.ts`

```text
export function canRolloutToProduction(input: { approved: boolean; smokeTestsPassed: boolean; qualityBudgetPassed: boolean; migrationsBlocked: boolean }): { ok: true } | { ok: false; blockers: string[] } { const blockers: string[] = []; if (!input.approved) blockers.push("rollout-not-approved"); if (!input.smokeTestsPassed) blockers.push("smoke-tests-failed"); if (!input.qualityBudgetPassed) blockers.push("quality-budget-failed"); if (input.migrationsBlocked) blockers.push("migration-blocked"); return blockers.length === 0 ? { ok: true } : { ok: false, blockers }; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/index.ts`

```text
export * from "./securityDrillRunsTypes.js";
export * from "./securityDrillRunsService.js";
export * from "./securityDrillRunsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { SecurityDrillRunRecordService } from "./securityDrillRunsService.js";
export function registerSecurityDrillRunRecordRoutes(router: Router, service: SecurityDrillRunRecordService): void { router.get("/pack9/securityDrillRuns", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/securityDrillRuns", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsService.ts`

```text
import type { SecurityDrillRunRecord, SecurityDrillRunRecordRepository } from "./securityDrillRunsTypes.js";
export class SecurityDrillRunRecordService { constructor(private readonly repository: SecurityDrillRunRecordRepository) {} create(record: SecurityDrillRunRecord): Promise<SecurityDrillRunRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<SecurityDrillRunRecord>): Promise<SecurityDrillRunRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("securityDrillRuns-not-found"); return updated; } list(filter: Partial<SecurityDrillRunRecord> = {}, limit = 50): Promise<SecurityDrillRunRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsTypes.ts`

```text
export interface SecurityDrillRunRecord { id: string; drill: "incident_response" | "backup_restore" | "tenant_isolation" | "webhook_rotation"; status: "planned" | "running" | "passed" | "failed"; scheduledAt: string; completedAt?: string; }
export interface SecurityDrillRunRecordRepository { create(record: SecurityDrillRunRecord): Promise<SecurityDrillRunRecord>; update(id: string, patch: Partial<SecurityDrillRunRecord>): Promise<SecurityDrillRunRecord | null>; list(filter: Partial<SecurityDrillRunRecord>, limit: number): Promise<SecurityDrillRunRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/index.ts`

```text
export * from "./sessionQualityAggregatesTypes.js";
export * from "./sessionQualityAggregatesService.js";
export * from "./sessionQualityAggregatesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { SessionQualityAggregateRecordService } from "./sessionQualityAggregatesService.js";
export function registerSessionQualityAggregateRecordRoutes(router: Router, service: SessionQualityAggregateRecordService): void { router.get("/pack9/sessionQualityAggregates", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/sessionQualityAggregates", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesService.ts`

```text
import type { SessionQualityAggregateRecord, SessionQualityAggregateRecordRepository } from "./sessionQualityAggregatesTypes.js";
export class SessionQualityAggregateRecordService { constructor(private readonly repository: SessionQualityAggregateRecordRepository) {} create(record: SessionQualityAggregateRecord): Promise<SessionQualityAggregateRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<SessionQualityAggregateRecord>): Promise<SessionQualityAggregateRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("sessionQualityAggregates-not-found"); return updated; } list(filter: Partial<SessionQualityAggregateRecord> = {}, limit = 50): Promise<SessionQualityAggregateRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesTypes.ts`

```text
export interface SessionQualityAggregateRecord { id: string; teamId?: string; windowStart: string; windowEnd: string; totalSessions: number; failedSessions: number; avgRttMs?: number; }
export interface SessionQualityAggregateRecordRepository { create(record: SessionQualityAggregateRecord): Promise<SessionQualityAggregateRecord>; update(id: string, patch: Partial<SessionQualityAggregateRecord>): Promise<SessionQualityAggregateRecord | null>; list(filter: Partial<SessionQualityAggregateRecord>, limit: number): Promise<SessionQualityAggregateRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/index.ts`

```text
export * from "./supportEscalationsTypes.js";
export * from "./supportEscalationsService.js";
export * from "./supportEscalationsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationPolicy.ts`

```text
export function escalationSlaMinutes(target: "tier2" | "engineering" | "security" | "billing"): number { if (target === "security") return 15; if (target === "engineering") return 30; if (target === "billing") return 120; return 60; }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsRoutes.ts`

```text
import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { SupportEscalationRecordService } from "./supportEscalationsService.js";
export function registerSupportEscalationRecordRoutes(router: Router, service: SupportEscalationRecordService): void { router.get("/pack9/supportEscalations", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/supportEscalations", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsService.ts`

```text
import type { SupportEscalationRecord, SupportEscalationRecordRepository } from "./supportEscalationsTypes.js";
export class SupportEscalationRecordService { constructor(private readonly repository: SupportEscalationRecordRepository) {} create(record: SupportEscalationRecord): Promise<SupportEscalationRecord> { return this.repository.create(record); } async update(id: string, patch: Partial<SupportEscalationRecord>): Promise<SupportEscalationRecord> { const updated = await this.repository.update(id, patch); if (!updated) throw new Error("supportEscalations-not-found"); return updated; } list(filter: Partial<SupportEscalationRecord> = {}, limit = 50): Promise<SupportEscalationRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsTypes.ts`

```text
export interface SupportEscalationRecord { id: string; ticketId: string; target: "tier2" | "engineering" | "security" | "billing"; reason: string; status: "open" | "acknowledged" | "resolved"; createdAt: string; }
export interface SupportEscalationRecordRepository { create(record: SupportEscalationRecord): Promise<SupportEscalationRecord>; update(id: string, patch: Partial<SupportEscalationRecord>): Promise<SupportEscalationRecord | null>; list(filter: Partial<SupportEscalationRecord>, limit: number): Promise<SupportEscalationRecord[]>; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack9/connectionDoctor.ts`

```text
export interface ConnectionDoctorInput { socketConnected: boolean; iceConnected: boolean; dataChannelOpen: boolean; lastError?: string; }
export function diagnoseConnection(input: ConnectionDoctorInput): string[] { const issues: string[] = []; if (!input.socketConnected) issues.push("signaling-socket-disconnected"); if (!input.iceConnected) issues.push("ice-not-connected"); if (!input.dataChannelOpen) issues.push("data-channel-not-open"); if (input.lastError) issues.push(input.lastError); return issues; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack9/desktopSmokeChecklist.ts`

```text
export interface DesktopSmokeChecklistState { auth: boolean; screenPreview: boolean; signaling: boolean; dataChannel: boolean; disconnect: boolean; }
export function desktopSmokeChecklistPassed(state: DesktopSmokeChecklistState): boolean { return state.auth && state.screenPreview && state.signaling && state.dataChannel && state.disconnect; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack9/index.ts`

```text
export * from "./selfTestRunner.js";
export * from "./connectionDoctor.js";
export * from "./systemPermissionsPanel.jsx";
export * from "./launchReadinessBanner.jsx";
export * from "./desktopSmokeChecklist.js";

```


## `REVIEW_REQUIRED/apps/desktop/src/pack9/launchReadinessBanner.tsx`

```text
import React from "react";
export function LaunchReadinessBanner(props: { blocked: boolean; warnings: number; onOpenDetails: () => void }): JSX.Element { return (<aside role="status" data-blocked={props.blocked}><strong>{props.blocked ? "Launch blocked" : "Desktop readiness"}</strong><span>{props.warnings} warnings</span><button type="button" onClick={props.onOpenDetails}>Open details</button></aside>); }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack9/selfTestRunner.ts`

```text
export interface DesktopSelfTest { id: string; label: string; run(): Promise<{ passed: boolean; message: string }>; }
export async function runDesktopSelfTests(tests: readonly DesktopSelfTest[]): Promise<Array<{ id: string; label: string; passed: boolean; message: string }>> { const results = []; for (const test of tests) { const result = await test.run(); results.push({ id: test.id, label: test.label, ...result }); } return results; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack9/systemPermissionsPanel.tsx`

```text
import React from "react";
export function SystemPermissionsPanel(props: { screen: boolean; inputMonitoring: boolean; accessibility: boolean }): JSX.Element { return (<section><h3>System permissions</h3><ul><li>Screen capture: {props.screen ? "granted" : "missing"}</li><li>Input monitoring: {props.inputMonitoring ? "granted" : "not required unless native input is reviewed"}</li><li>Accessibility: {props.accessibility ? "granted" : "not required unless native input is reviewed"}</li></ul></section>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/ApiHealthPage.tsx`

```text
import React from "react";
export interface ApiHealthPageRow { id: string; title: string; status: string; detail?: string; }
export function ApiHealthPage(props: { rows: ApiHealthPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>API health snapshots</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/CustomerAnnouncementsPage.tsx`

```text
import React from "react";
export interface CustomerAnnouncementsPageRow { id: string; title: string; status: string; detail?: string; }
export function CustomerAnnouncementsPage(props: { rows: CustomerAnnouncementsPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Customer announcements</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/DataImportJobsPage.tsx`

```text
import React from "react";
export interface DataImportJobsPageRow { id: string; title: string; status: string; detail?: string; }
export function DataImportJobsPage(props: { rows: DataImportJobsPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Data import jobs</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/DataImportRowsPage.tsx`

```text
import React from "react";
export interface DataImportRowsPageRow { id: string; title: string; status: string; detail?: string; }
export function DataImportRowsPage(props: { rows: DataImportRowsPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Data import rows</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/LaunchChecklistPage.tsx`

```text
import React from "react";
export interface LaunchChecklistPageRow { id: string; title: string; status: string; detail?: string; }
export function LaunchChecklistPage(props: { rows: LaunchChecklistPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Launch checklist</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/LicenseCompliancePage.tsx`

```text
import React from "react";
export interface LicenseCompliancePageRow { id: string; title: string; status: string; detail?: string; }
export function LicenseCompliancePage(props: { rows: LicenseCompliancePageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>License compliance</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/MigrationChecksPage.tsx`

```text
import React from "react";
export interface MigrationChecksPageRow { id: string; title: string; status: string; detail?: string; }
export function MigrationChecksPage(props: { rows: MigrationChecksPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Migration checks</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/RolloutApprovalsPage.tsx`

```text
import React from "react";
export interface RolloutApprovalsPageRow { id: string; title: string; status: string; detail?: string; }
export function RolloutApprovalsPage(props: { rows: RolloutApprovalsPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Rollout approvals</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/SecurityDrillsPage.tsx`

```text
import React from "react";
export interface SecurityDrillsPageRow { id: string; title: string; status: string; detail?: string; }
export function SecurityDrillsPage(props: { rows: SecurityDrillsPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Security drills</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/SessionQualityPage.tsx`

```text
import React from "react";
export interface SessionQualityPageRow { id: string; title: string; status: string; detail?: string; }
export function SessionQualityPage(props: { rows: SessionQualityPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Session quality</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/components/SupportEscalationsPage.tsx`

```text
import React from "react";
export interface SupportEscalationsPageRow { id: string; title: string; status: string; detail?: string; }
export function SupportEscalationsPage(props: { rows: SupportEscalationsPageRow[]; onReview?: (id: string) => void }): JSX.Element { return (<main><h1>Support escalations</h1>{props.rows.length === 0 ? <p>No records yet.</p> : (<ul>{props.rows.map((row) => (<li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}{props.onReview && <button type="button" onClick={() => props.onReview?.(row.id)}>Review</button>}</li>))}</ul>)}</main>); }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useApiHealth.ts`

```text
import { useEffect, useState } from "react";
export interface useApiHealthResult<T> { data?: T; loading: boolean; error?: string; }
export function useApiHealth<T>(loader: () => Promise<T>): useApiHealthResult<T> { const [state, setState] = useState<useApiHealthResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useCustomerAnnouncements.ts`

```text
import { useEffect, useState } from "react";
export interface useCustomerAnnouncementsResult<T> { data?: T; loading: boolean; error?: string; }
export function useCustomerAnnouncements<T>(loader: () => Promise<T>): useCustomerAnnouncementsResult<T> { const [state, setState] = useState<useCustomerAnnouncementsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useDataImportJobs.ts`

```text
import { useEffect, useState } from "react";
export interface useDataImportJobsResult<T> { data?: T; loading: boolean; error?: string; }
export function useDataImportJobs<T>(loader: () => Promise<T>): useDataImportJobsResult<T> { const [state, setState] = useState<useDataImportJobsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useLaunchChecklist.ts`

```text
import { useEffect, useState } from "react";
export interface useLaunchChecklistResult<T> { data?: T; loading: boolean; error?: string; }
export function useLaunchChecklist<T>(loader: () => Promise<T>): useLaunchChecklistResult<T> { const [state, setState] = useState<useLaunchChecklistResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useLicenseCompliance.ts`

```text
import { useEffect, useState } from "react";
export interface useLicenseComplianceResult<T> { data?: T; loading: boolean; error?: string; }
export function useLicenseCompliance<T>(loader: () => Promise<T>): useLicenseComplianceResult<T> { const [state, setState] = useState<useLicenseComplianceResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useMigrationChecks.ts`

```text
import { useEffect, useState } from "react";
export interface useMigrationChecksResult<T> { data?: T; loading: boolean; error?: string; }
export function useMigrationChecks<T>(loader: () => Promise<T>): useMigrationChecksResult<T> { const [state, setState] = useState<useMigrationChecksResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useRolloutApprovals.ts`

```text
import { useEffect, useState } from "react";
export interface useRolloutApprovalsResult<T> { data?: T; loading: boolean; error?: string; }
export function useRolloutApprovals<T>(loader: () => Promise<T>): useRolloutApprovalsResult<T> { const [state, setState] = useState<useRolloutApprovalsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSecurityDrills.ts`

```text
import { useEffect, useState } from "react";
export interface useSecurityDrillsResult<T> { data?: T; loading: boolean; error?: string; }
export function useSecurityDrills<T>(loader: () => Promise<T>): useSecurityDrillsResult<T> { const [state, setState] = useState<useSecurityDrillsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSessionQuality.ts`

```text
import { useEffect, useState } from "react";
export interface useSessionQualityResult<T> { data?: T; loading: boolean; error?: string; }
export function useSessionQuality<T>(loader: () => Promise<T>): useSessionQualityResult<T> { const [state, setState] = useState<useSessionQualityResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSupportEscalations.ts`

```text
import { useEffect, useState } from "react";
export interface useSupportEscalationsResult<T> { data?: T; loading: boolean; error?: string; }
export function useSupportEscalations<T>(loader: () => Promise<T>): useSupportEscalationsResult<T> { const [state, setState] = useState<useSupportEscalationsResult<T>>({ loading: true }); useEffect(() => { let cancelled = false; loader().then((data) => { if (!cancelled) setState({ loading: false, data }); }).catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); }); return () => { cancelled = true; }; }, [loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack9/index.ts`

```text
export * from "./components/LaunchChecklistPage.js";
export * from "./components/DataImportJobsPage.js";
export * from "./components/DataImportRowsPage.js";
export * from "./components/MigrationChecksPage.js";
export * from "./components/RolloutApprovalsPage.js";
export * from "./components/CustomerAnnouncementsPage.js";
export * from "./components/SupportEscalationsPage.js";
export * from "./components/SessionQualityPage.js";
export * from "./components/LicenseCompliancePage.js";
export * from "./components/ApiHealthPage.js";
export * from "./components/SecurityDrillsPage.js";
export * from "./hooks/useLaunchChecklist.js";
export * from "./hooks/useDataImportJobs.js";
export * from "./hooks/useMigrationChecks.js";
export * from "./hooks/useRolloutApprovals.js";
export * from "./hooks/useCustomerAnnouncements.js";
export * from "./hooks/useSupportEscalations.js";
export * from "./hooks/useSessionQuality.js";
export * from "./hooks/useLicenseCompliance.js";
export * from "./hooks/useApiHealth.js";
export * from "./hooks/useSecurityDrills.js";

```


## `SAFE_DIRECT_COPY/docs/pack9/01-merge-guide.md`

```text
Pack 9 adds launch readiness checks, data import jobs, migration gates, rollout approvals, customer announcements, support escalations, session quality aggregates, license compliance, API health snapshots, security drills and desktop self-diagnostics.

```


## `SAFE_DIRECT_COPY/docs/pack9/02-data-import.md`

```text
Data import jobs should validate rows before import, store row-level errors, and require idempotency for re-runs.

```


## `SAFE_DIRECT_COPY/docs/pack9/03-migration-gates.md`

```text
High-risk and destructive migrations should block launch until reviewed. Critical migrations always block promotion.

```


## `SAFE_DIRECT_COPY/docs/pack9/04-rollout-approvals.md`

```text
Rollout approval should require smoke tests, quality budget pass, and unblocked migrations.

```


## `SAFE_DIRECT_COPY/docs/pack9/05-desktop-self-diagnostics.md`

```text
Desktop self-tests should check auth, screen preview, signaling, data channel and disconnect without enabling unsafe native input.

```


## `SAFE_DIRECT_COPY/docs/pack9/06-license-compliance.md`

```text
License compliance checks should review dependencies before release. This pack does not change package.json.

```


## `SAFE_DIRECT_COPY/docs/pack9/07-qa-checklist.md`

```text
Verify launch checklist, import validation, migration gates, rollout approvals, support escalation targets, desktop connection doctor and smoke checklist.

```


## `SAFE_DIRECT_COPY/infra/pack9/prometheus-launch-alerts.yml`

```text
groups:
  - name: remotedesk-launch-pack9
    rules:
      - alert: RemoteDeskLaunchBlocked
        expr: remotedesk_launch_required_checks_failed > 0
        for: 1m
        labels:
          severity: critical

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack9/announcementAudience.ts`

```text
export type AnnouncementAudience = "all" | "admins" | "billing_admins" | "support_users" | "affected_team";
export function canSendAnnouncement(role: string, audience: AnnouncementAudience): boolean { if (audience === "all") return role === "owner" || role === "admin"; if (audience === "billing_admins") return ["owner", "admin", "billing"].includes(role); if (audience === "support_users") return ["owner", "admin", "support"].includes(role); return ["owner", "admin"].includes(role); }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack9/importRowValidation.ts`

```text
export interface ImportRowValidationResult { ok: boolean; errors: string[]; }
export function validateEmailImportRow(row: Record<string, unknown>): ImportRowValidationResult { const errors: string[] = []; if (typeof row.email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) errors.push("invalid-email"); if (row.role !== undefined && !["admin", "support", "member", "viewer"].includes(String(row.role))) errors.push("invalid-role"); return { ok: errors.length === 0, errors }; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack9/index.ts`

```text
export * from "./launchChecklist.js";
export * from "./importRowValidation.js";
export * from "./migrationRisk.js";
export * from "./announcementAudience.js";
export * from "./supportEscalation.js";
export * from "./qualityBudget.js";
export * from "./releaseCandidate.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack9/launchChecklist.ts`

```text
export type LaunchCheckStatus = "pass" | "warn" | "fail" | "not_applicable";
export interface LaunchCheck { id: string; area: "api" | "web" | "desktop" | "infra" | "security" | "support" | "billing"; label: string; status: LaunchCheckStatus; required: boolean; }
export function isLaunchBlocked(checks: readonly LaunchCheck[]): boolean { return checks.some((check) => check.required && check.status === "fail"); }
export function summarizeLaunchChecks(checks: readonly LaunchCheck[]): Record<LaunchCheckStatus, number> { return checks.reduce<Record<LaunchCheckStatus, number>>((acc, check) => ({ ...acc, [check.status]: acc[check.status] + 1 }), { pass: 0, warn: 0, fail: 0, not_applicable: 0 }); }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack9/migrationRisk.ts`

```text
export type MigrationRisk = "low" | "medium" | "high" | "critical";
export interface MigrationRiskInput { touchesAuth: boolean; touchesBilling: boolean; destructive: boolean; backfillRows: number; }
export function classifyMigrationRisk(input: MigrationRiskInput): MigrationRisk { if (input.destructive && (input.touchesAuth || input.touchesBilling)) return "critical"; if (input.destructive || input.backfillRows > 1000000) return "high"; if (input.touchesAuth || input.touchesBilling || input.backfillRows > 50000) return "medium"; return "low"; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack9/qualityBudget.ts`

```text
export interface QualityBudget { maxCrashRatePercent: number; maxSessionFailurePercent: number; maxApiP95Ms: number; }
export interface QualitySnapshot { crashRatePercent: number; sessionFailurePercent: number; apiP95Ms: number; }
export function evaluateQualityBudget(budget: QualityBudget, snapshot: QualitySnapshot): string[] { const failures: string[] = []; if (snapshot.crashRatePercent > budget.maxCrashRatePercent) failures.push("crash-rate"); if (snapshot.sessionFailurePercent > budget.maxSessionFailurePercent) failures.push("session-failure-rate"); if (snapshot.apiP95Ms > budget.maxApiP95Ms) failures.push("api-p95"); return failures; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack9/releaseCandidate.ts`

```text
export interface ReleaseCandidate { version: string; gitSha: string; signedDesktopBuild: boolean; migrationsReviewed: boolean; smokeTestsPassed: boolean; }
export function canPromoteReleaseCandidate(candidate: ReleaseCandidate): { ok: true } | { ok: false; blockers: string[] } { const blockers: string[] = []; if (!candidate.signedDesktopBuild) blockers.push("desktop-build-not-signed"); if (!candidate.migrationsReviewed) blockers.push("migrations-not-reviewed"); if (!candidate.smokeTestsPassed) blockers.push("smoke-tests-failed"); return blockers.length === 0 ? { ok: true } : { ok: false, blockers }; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack9/supportEscalation.ts`

```text
export type EscalationTarget = "tier2" | "engineering" | "security" | "billing";
export interface EscalationInput { priority: "low" | "normal" | "high" | "urgent"; category: "connection" | "billing" | "security" | "desktop_crash" | "data_loss" | "other"; }
export function chooseEscalationTarget(input: EscalationInput): EscalationTarget { if (input.category === "security" || input.category === "data_loss") return "security"; if (input.category === "billing") return "billing"; if (input.category === "desktop_crash" || input.priority === "urgent") return "engineering"; return "tier2"; }

```


## `SAFE_DIRECT_COPY/scripts/pack9/check-no-release-blockers.mjs`

```text
import { readFileSync } from "node:fs"; const manifestPath = process.argv[2]; if (!manifestPath) throw new Error("manifest path required"); const manifest = JSON.parse(readFileSync(manifestPath, "utf8")); if (manifest.doNotMergeCount && manifest.doNotMergeCount > 0) { console.error("DO_NOT_MERGE files present"); process.exit(1); } console.log("No release blockers in manifest.");

```


## `SAFE_DIRECT_COPY/scripts/pack9/run-launch-smoke-check.mjs`

```text
const baseUrl = process.env.REMOTEDESK_API_URL; if (!baseUrl) throw new Error("REMOTEDESK_API_URL is required"); const response = await fetch(`${baseUrl}/health/live`); if (!response.ok) { console.error(`Launch smoke check failed: ${response.status}`); process.exit(1); } console.log("Launch smoke check passed.");

```


## `SAFE_DIRECT_COPY/tests/pack9/connectionDoctor.test.ts`

```text
import assert from "node:assert/strict"; import { diagnoseConnection } from "../../REVIEW_REQUIRED/apps/desktop/src/pack9/connectionDoctor.js"; assert.ok(diagnoseConnection({ socketConnected: false, iceConnected: true, dataChannelOpen: true }).includes("signaling-socket-disconnected"));

```


## `SAFE_DIRECT_COPY/tests/pack9/desktopSmokeChecklist.test.ts`

```text
import assert from "node:assert/strict"; import { desktopSmokeChecklistPassed } from "../../REVIEW_REQUIRED/apps/desktop/src/pack9/desktopSmokeChecklist.js"; assert.equal(desktopSmokeChecklistPassed({ auth: true, screenPreview: true, signaling: true, dataChannel: true, disconnect: true }), true);

```


## `SAFE_DIRECT_COPY/tests/pack9/importJobValidator.test.ts`

```text
import assert from "node:assert/strict"; import { validateImportJobKind } from "../../REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/importJobValidator.js"; assert.equal(validateImportJobKind("users"), true); assert.equal(validateImportJobKind("bad"), false);

```


## `SAFE_DIRECT_COPY/tests/pack9/launchChecklist.test.ts`

```text
import assert from "node:assert/strict"; import { isLaunchBlocked } from "../../packages/shared/src/pack9/launchChecklist.js"; assert.equal(isLaunchBlocked([{ id: "x", area: "api", label: "API", status: "fail", required: true }]), true);

```


## `SAFE_DIRECT_COPY/tests/pack9/migrationGate.test.ts`

```text
import assert from "node:assert/strict"; import { migrationBlocksLaunch } from "../../REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationGate.js"; assert.equal(migrationBlocksLaunch({ risk: "high", reviewed: false, destructive: false }), true);

```


## `SAFE_DIRECT_COPY/tests/pack9/migrationRisk.test.ts`

```text
import assert from "node:assert/strict"; import { classifyMigrationRisk } from "../../packages/shared/src/pack9/migrationRisk.js"; assert.equal(classifyMigrationRisk({ touchesAuth: true, touchesBilling: false, destructive: false, backfillRows: 0 }), "medium");

```


## `SAFE_DIRECT_COPY/tests/pack9/qualityBudget.test.ts`

```text
import assert from "node:assert/strict"; import { evaluateQualityBudget } from "../../packages/shared/src/pack9/qualityBudget.js"; assert.ok(evaluateQualityBudget({ maxCrashRatePercent: 1, maxSessionFailurePercent: 5, maxApiP95Ms: 500 }, { crashRatePercent: 2, sessionFailurePercent: 1, apiP95Ms: 100 }).includes("crash-rate"));

```


## `SAFE_DIRECT_COPY/tests/pack9/releaseCandidate.test.ts`

```text
import assert from "node:assert/strict"; import { canPromoteReleaseCandidate } from "../../packages/shared/src/pack9/releaseCandidate.js"; assert.equal(canPromoteReleaseCandidate({ version: "1.0.0", gitSha: "abc", signedDesktopBuild: true, migrationsReviewed: true, smokeTestsPassed: true }).ok, true);

```


## `SAFE_DIRECT_COPY/tests/pack9/supportEscalation.test.ts`

```text
import assert from "node:assert/strict"; import { chooseEscalationTarget } from "../../packages/shared/src/pack9/supportEscalation.js"; assert.equal(chooseEscalationTarget({ priority: "urgent", category: "connection" }), "engineering");

```


## `generated-remotedesk-launch-readiness-pack-9-code-review.md`

```text
Review launch admin authorization, data import validation, migration gate behavior, rollout approval blockers, customer announcement review, support escalation routing and desktop self-test placement.

```


## `generated-remotedesk-launch-readiness-pack-9-manifest.json`

```text
{
  "name": "generated-remotedesk-launch-readiness-pack-9",
  "createdAt": "2026-06-14T16:33:45.855988+00:00",
  "actualFileCount": 117,
  "safeDirectCopyCount": 27,
  "reviewRequiredCount": 79,
  "patchesCount": 4,
  "doNotMergeCount": 0,
  "filesByArea": {
    "shared": 8,
    "api": 51,
    "web": 22,
    "desktop": 6,
    "tests": 9,
    "docs": 7,
    "scripts": 2,
    "infra": 1
  },
  "safeDirectCopy": [
    "SAFE_DIRECT_COPY/docs/pack9/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack9/02-data-import.md",
    "SAFE_DIRECT_COPY/docs/pack9/03-migration-gates.md",
    "SAFE_DIRECT_COPY/docs/pack9/04-rollout-approvals.md",
    "SAFE_DIRECT_COPY/docs/pack9/05-desktop-self-diagnostics.md",
    "SAFE_DIRECT_COPY/docs/pack9/06-license-compliance.md",
    "SAFE_DIRECT_COPY/docs/pack9/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack9/prometheus-launch-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack9/announcementAudience.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack9/importRowValidation.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack9/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack9/launchChecklist.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack9/migrationRisk.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack9/qualityBudget.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack9/releaseCandidate.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack9/supportEscalation.ts",
    "SAFE_DIRECT_COPY/scripts/pack9/check-no-release-blockers.mjs",
    "SAFE_DIRECT_COPY/scripts/pack9/run-launch-smoke-check.mjs",
    "SAFE_DIRECT_COPY/tests/pack9/connectionDoctor.test.ts",
    "SAFE_DIRECT_COPY/tests/pack9/desktopSmokeChecklist.test.ts",
    "SAFE_DIRECT_COPY/tests/pack9/importJobValidator.test.ts",
    "SAFE_DIRECT_COPY/tests/pack9/launchChecklist.test.ts",
    "SAFE_DIRECT_COPY/tests/pack9/migrationGate.test.ts",
    "SAFE_DIRECT_COPY/tests/pack9/migrationRisk.test.ts",
    "SAFE_DIRECT_COPY/tests/pack9/qualityBudget.test.ts",
    "SAFE_DIRECT_COPY/tests/pack9/releaseCandidate.test.ts",
    "SAFE_DIRECT_COPY/tests/pack9/supportEscalation.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/apiHealthSnapshotsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/apiHealthSnapshots/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/common/launchAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/common/pack9Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/customerAnnouncementsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/customerAnnouncements/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/dataImportJobsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/importJobValidator.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportJobs/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/dataImportRowsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/dataImportRows/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/launchChecklists/launchChecklistsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/licenseCompliance/licenseComplianceTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationChecksTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/migrationChecks/migrationGate.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutApprovalsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/rolloutApprovals/rolloutGate.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/securityDrillRuns/securityDrillRunsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/sessionQualityAggregates/sessionQualityAggregatesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack9/supportEscalations/supportEscalationsTypes.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack9/connectionDoctor.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack9/desktopSmokeChecklist.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack9/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack9/launchReadinessBanner.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack9/selfTestRunner.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack9/systemPermissionsPanel.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/ApiHealthPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/CustomerAnnouncementsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/DataImportJobsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/DataImportRowsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/LaunchChecklistPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/LicenseCompliancePage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/MigrationChecksPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/RolloutApprovalsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/SecurityDrillsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/SessionQualityPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/components/SupportEscalationsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useApiHealth.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useCustomerAnnouncements.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useDataImportJobs.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useLaunchChecklist.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useLicenseCompliance.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useMigrationChecks.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useRolloutApprovals.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSecurityDrills.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSessionQuality.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/hooks/useSupportEscalations.ts",
    "REVIEW_REQUIRED/apps/web/src/pack9/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack9.patch.md",
    "PATCHES/desktop-pack9.patch.md",
    "PATCHES/ops-pack9.patch.md",
    "PATCHES/web-pack9.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Launch route access must be limited to internal owner/admin roles.",
    "Data import execution needs storage and transactional implementation.",
    "Desktop diagnostics do not enable native input.",
    "License compliance needs real dependency inventory feed."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 82-90% with prior packs after persistence wiring, QA, and launch smoke tests"
}
```


## `generated-remotedesk-launch-readiness-pack-9-merge-summary.md`

```text
Pack 9 adds launch readiness checks, import/migration controls, rollout approvals, customer announcements, support escalations, session quality, license compliance, API health snapshots, security drills, desktop self-diagnostics and smoke automation.

```


## `generated-remotedesk-launch-readiness-pack-9-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| Launch route exposed | High | owner/admin launch auth |
| Bad data import | High | row validation and idempotency |
| Destructive migration promoted | Critical | migration gate blocks |
| Announcement sent wrong audience | Medium | review workflow |
| Native input regression | Critical | diagnostics only, no executor enablement |

```


## `generated-remotedesk-launch-readiness-pack-9-test-plan.md`

```text
Run Pack 9 tests, launch smoke script, no-release-blockers script, then manual QA for checklist gates, import row validation, migration blocks, rollout approvals, support escalation and desktop self-diagnostics.

```
