# generated-remotedesk-data-residency-pack-19 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack19.patch.md
PATCHES/desktop-pack19.patch.md
PATCHES/ops-pack19.patch.md
PATCHES/web-pack19.patch.md
REVIEW_REQUIRED/apps/api/src/pack19/common/pack19Route.ts
REVIEW_REQUIRED/apps/api/src/pack19/common/residencyAdminAuth.ts
REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsService.ts
REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsService.ts
REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/transferRequestPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsService.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesService.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/residencyPolicyValidator.ts
REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeyPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysService.ts
REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesService.ts
REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsService.ts
REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesService.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsService.ts
REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksService.ts
REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksTypes.ts
REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/index.ts
REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsService.ts
REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsTypes.ts
REVIEW_REQUIRED/apps/desktop/src/pack19/complianceExportStatus.tsx
REVIEW_REQUIRED/apps/desktop/src/pack19/dataRegionBadge.tsx
REVIEW_REQUIRED/apps/desktop/src/pack19/encryptionStatusBadge.tsx
REVIEW_REQUIRED/apps/desktop/src/pack19/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack19/retentionStatusNotice.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/ComplianceExportsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/CrossRegionTransfersPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/DataInventoryPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/DataResidencyPoliciesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/EncryptionKeysPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/FieldClassificationRulesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/KeyRotationJobsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/ResidencyAuditPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/RetentionPoliciesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/RetentionRunsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/TenantIsolationChecksPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/components/TenantRegionAssignmentsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useComplianceExports.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useCrossRegionTransfers.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useDataInventory.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useDataResidencyPolicies.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useEncryptionKeys.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useFieldClassificationRules.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useKeyRotationJobs.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useResidencyAudit.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useRetentionPolicies.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useRetentionRuns.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useTenantIsolationChecks.ts
REVIEW_REQUIRED/apps/web/src/pack19/hooks/useTenantRegionAssignments.ts
REVIEW_REQUIRED/apps/web/src/pack19/index.ts
SAFE_DIRECT_COPY/docs/pack19/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack19/02-data-residency.md
SAFE_DIRECT_COPY/docs/pack19/03-tenant-isolation.md
SAFE_DIRECT_COPY/docs/pack19/04-key-lifecycle.md
SAFE_DIRECT_COPY/docs/pack19/05-retention-controls.md
SAFE_DIRECT_COPY/docs/pack19/06-compliance-exports.md
SAFE_DIRECT_COPY/docs/pack19/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack19/postgres-residency-indexes.sql
SAFE_DIRECT_COPY/infra/pack19/prometheus-residency-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack19/classifiedField.ts
SAFE_DIRECT_COPY/packages/shared/src/pack19/dataRegion.ts
SAFE_DIRECT_COPY/packages/shared/src/pack19/dataTransferGuard.ts
SAFE_DIRECT_COPY/packages/shared/src/pack19/exportScope.ts
SAFE_DIRECT_COPY/packages/shared/src/pack19/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack19/keyRotation.ts
SAFE_DIRECT_COPY/packages/shared/src/pack19/residencyPolicy.ts
SAFE_DIRECT_COPY/packages/shared/src/pack19/retentionWindow.ts
SAFE_DIRECT_COPY/packages/shared/src/pack19/tenantBoundary.ts
SAFE_DIRECT_COPY/scripts/pack19/check-residency-safe-defaults.mjs
SAFE_DIRECT_COPY/tests/pack19/dataRegion.test.ts
SAFE_DIRECT_COPY/tests/pack19/exportScope.test.ts
SAFE_DIRECT_COPY/tests/pack19/keyRotation.test.ts
SAFE_DIRECT_COPY/tests/pack19/residencyPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack19/residencyPolicyValidator.test.ts
SAFE_DIRECT_COPY/tests/pack19/retentionRunPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack19/retentionWindow.test.ts
SAFE_DIRECT_COPY/tests/pack19/tenantBoundary.test.ts
SAFE_DIRECT_COPY/tests/pack19/transferRequestPolicy.test.ts
generated-remotedesk-data-residency-pack-19-code-review.md
generated-remotedesk-data-residency-pack-19-manifest.json
generated-remotedesk-data-residency-pack-19-merge-summary.md
generated-remotedesk-data-residency-pack-19-risk-register.md
generated-remotedesk-data-residency-pack-19-test-plan.md

```


## `PATCHES/api-pack19.patch.md`

```text
Mount Pack 19 routes behind residency/admin permissions. Enforce tenant scope in repositories before returning any records. Wire KMS operations through existing secret infrastructure.

```


## `PATCHES/desktop-pack19.patch.md`

```text
Wire data region/encryption/retention badges into settings diagnostics. Do not expose restricted compliance export data in desktop.

```


## `PATCHES/ops-pack19.patch.md`

```text
Run residency safe-default scanner in CI and review Postgres index names against actual schema before applying.

```


## `PATCHES/web-pack19.patch.md`

```text
Mount data residency dashboards only for owner/admin/auditor roles. Treat client filters as presentation only.

```


## `REVIEW_REQUIRED/apps/api/src/pack19/common/pack19Route.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function pack19Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/common/residencyAdminAuth.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function requireResidencyAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("residency:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "residency_admin_required" });
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { ComplianceExportRecordService } from "./complianceExportsService.js";

export function registerComplianceExportRecordRoutes(router: Router, service: ComplianceExportRecordService): void {
  router.get("/pack19/complianceExports", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/complianceExports", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsService.ts`

```text
import type { ComplianceExportRecord, ComplianceExportRecordRepository } from "./complianceExportsTypes.js";

export class ComplianceExportRecordService {
  constructor(private readonly repository: ComplianceExportRecordRepository) {}

  create(record: ComplianceExportRecord): Promise<ComplianceExportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ComplianceExportRecord>): Promise<ComplianceExportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("complianceExports-not-found");
    return updated;
  }

  list(filter: Partial<ComplianceExportRecord> = {}, limit = 50): Promise<ComplianceExportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsTypes.ts`

```text
export interface ComplianceExportRecord {
  id: string; tenantId: string; scope: string; status: 'queued' | 'running' | 'completed' | 'failed'; objectKey?: string; createdAt: string;
}

export interface ComplianceExportRecordRepository {
  create(record: ComplianceExportRecord): Promise<ComplianceExportRecord>;
  update(id: string, patch: Partial<ComplianceExportRecord>): Promise<ComplianceExportRecord | null>;
  list(filter: Partial<ComplianceExportRecord>, limit: number): Promise<ComplianceExportRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/index.ts`

```text
export * from "./complianceExportsTypes.js";
export * from "./complianceExportsService.js";
export * from "./complianceExportsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { CrossRegionTransferRequestRecordService } from "./crossRegionTransferRequestsService.js";

export function registerCrossRegionTransferRequestRecordRoutes(router: Router, service: CrossRegionTransferRequestRecordService): void {
  router.get("/pack19/crossRegionTransferRequests", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/crossRegionTransferRequests", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsService.ts`

```text
import type { CrossRegionTransferRequestRecord, CrossRegionTransferRequestRecordRepository } from "./crossRegionTransferRequestsTypes.js";

export class CrossRegionTransferRequestRecordService {
  constructor(private readonly repository: CrossRegionTransferRequestRecordRepository) {}

  create(record: CrossRegionTransferRequestRecord): Promise<CrossRegionTransferRequestRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CrossRegionTransferRequestRecord>): Promise<CrossRegionTransferRequestRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("crossRegionTransferRequests-not-found");
    return updated;
  }

  list(filter: Partial<CrossRegionTransferRequestRecord> = {}, limit = 50): Promise<CrossRegionTransferRequestRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsTypes.ts`

```text
export interface CrossRegionTransferRequestRecord {
  id: string; tenantId: string; sourceRegion: string; targetRegion: string; purpose: string; approved: boolean; createdAt: string;
}

export interface CrossRegionTransferRequestRecordRepository {
  create(record: CrossRegionTransferRequestRecord): Promise<CrossRegionTransferRequestRecord>;
  update(id: string, patch: Partial<CrossRegionTransferRequestRecord>): Promise<CrossRegionTransferRequestRecord | null>;
  list(filter: Partial<CrossRegionTransferRequestRecord>, limit: number): Promise<CrossRegionTransferRequestRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/index.ts`

```text
export * from "./crossRegionTransferRequestsTypes.js";
export * from "./crossRegionTransferRequestsService.js";
export * from "./crossRegionTransferRequestsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/transferRequestPolicy.ts`

```text
export function transferRequestAllowed(input: { sourceRegion: string; targetRegion: string; purpose: string; approved: boolean }): { allowed: boolean; reason: string } {
  if (input.sourceRegion === input.targetRegion) return { allowed: true, reason: "same-region" };
  if (!input.approved) return { allowed: false, reason: "approval-required" };
  if (input.purpose === "support") return { allowed: false, reason: "support-cross-region-blocked" };
  return { allowed: true, reason: "approved" };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { DataInventoryItemRecordService } from "./dataInventoryItemsService.js";

export function registerDataInventoryItemRecordRoutes(router: Router, service: DataInventoryItemRecordService): void {
  router.get("/pack19/dataInventoryItems", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/dataInventoryItems", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsService.ts`

```text
import type { DataInventoryItemRecord, DataInventoryItemRecordRepository } from "./dataInventoryItemsTypes.js";

export class DataInventoryItemRecordService {
  constructor(private readonly repository: DataInventoryItemRecordRepository) {}

  create(record: DataInventoryItemRecord): Promise<DataInventoryItemRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<DataInventoryItemRecord>): Promise<DataInventoryItemRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("dataInventoryItems-not-found");
    return updated;
  }

  list(filter: Partial<DataInventoryItemRecord> = {}, limit = 50): Promise<DataInventoryItemRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsTypes.ts`

```text
export interface DataInventoryItemRecord {
  id: string; tenantId: string; resourceType: string; region: string; classification: string; updatedAt: string;
}

export interface DataInventoryItemRecordRepository {
  create(record: DataInventoryItemRecord): Promise<DataInventoryItemRecord>;
  update(id: string, patch: Partial<DataInventoryItemRecord>): Promise<DataInventoryItemRecord | null>;
  list(filter: Partial<DataInventoryItemRecord>, limit: number): Promise<DataInventoryItemRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/index.ts`

```text
export * from "./dataInventoryItemsTypes.js";
export * from "./dataInventoryItemsService.js";
export * from "./dataInventoryItemsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { DataResidencyPolicyRecordService } from "./dataResidencyPoliciesService.js";

export function registerDataResidencyPolicyRecordRoutes(router: Router, service: DataResidencyPolicyRecordService): void {
  router.get("/pack19/dataResidencyPolicies", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/dataResidencyPolicies", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesService.ts`

```text
import type { DataResidencyPolicyRecord, DataResidencyPolicyRecordRepository } from "./dataResidencyPoliciesTypes.js";

export class DataResidencyPolicyRecordService {
  constructor(private readonly repository: DataResidencyPolicyRecordRepository) {}

  create(record: DataResidencyPolicyRecord): Promise<DataResidencyPolicyRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<DataResidencyPolicyRecord>): Promise<DataResidencyPolicyRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("dataResidencyPolicies-not-found");
    return updated;
  }

  list(filter: Partial<DataResidencyPolicyRecord> = {}, limit = 50): Promise<DataResidencyPolicyRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesTypes.ts`

```text
export interface DataResidencyPolicyRecord {
  id: string; tenantId: string; primaryRegion: string; backupRegions: string[]; crossRegionSupportAccess: boolean; updatedAt: string;
}

export interface DataResidencyPolicyRecordRepository {
  create(record: DataResidencyPolicyRecord): Promise<DataResidencyPolicyRecord>;
  update(id: string, patch: Partial<DataResidencyPolicyRecord>): Promise<DataResidencyPolicyRecord | null>;
  list(filter: Partial<DataResidencyPolicyRecord>, limit: number): Promise<DataResidencyPolicyRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/index.ts`

```text
export * from "./dataResidencyPoliciesTypes.js";
export * from "./dataResidencyPoliciesService.js";
export * from "./dataResidencyPoliciesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/residencyPolicyValidator.ts`

```text
const SUPPORTED_REGIONS = new Set(["us", "eu", "uk", "apac", "ca", "au"]);

export function validateResidencyPolicy(input: { primaryRegion: string; backupRegions: string[] }): string[] {
  const errors: string[] = [];
  if (!SUPPORTED_REGIONS.has(input.primaryRegion)) errors.push("unsupported-primary-region");
  for (const region of input.backupRegions) if (!SUPPORTED_REGIONS.has(region)) errors.push(`unsupported-backup-region:${region}`);
  if (input.backupRegions.includes(input.primaryRegion)) errors.push("backup-duplicates-primary");
  return errors;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeyPolicy.ts`

```text
export function encryptionKeyCanRetire(input: { status: string; replacementKeyActive: boolean }): boolean {
  return input.status === "active" && input.replacementKeyActive;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { EncryptionKeyRecordService } from "./encryptionKeysService.js";

export function registerEncryptionKeyRecordRoutes(router: Router, service: EncryptionKeyRecordService): void {
  router.get("/pack19/encryptionKeys", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/encryptionKeys", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysService.ts`

```text
import type { EncryptionKeyRecord, EncryptionKeyRecordRepository } from "./encryptionKeysTypes.js";

export class EncryptionKeyRecordService {
  constructor(private readonly repository: EncryptionKeyRecordRepository) {}

  create(record: EncryptionKeyRecord): Promise<EncryptionKeyRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<EncryptionKeyRecord>): Promise<EncryptionKeyRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("encryptionKeys-not-found");
    return updated;
  }

  list(filter: Partial<EncryptionKeyRecord> = {}, limit = 50): Promise<EncryptionKeyRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysTypes.ts`

```text
export interface EncryptionKeyRecord {
  id: string; tenantId: string; region: string; keyAlias: string; status: 'active' | 'rotating' | 'retired' | 'disabled'; rotatedAt?: string;
}

export interface EncryptionKeyRecordRepository {
  create(record: EncryptionKeyRecord): Promise<EncryptionKeyRecord>;
  update(id: string, patch: Partial<EncryptionKeyRecord>): Promise<EncryptionKeyRecord | null>;
  list(filter: Partial<EncryptionKeyRecord>, limit: number): Promise<EncryptionKeyRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/index.ts`

```text
export * from "./encryptionKeysTypes.js";
export * from "./encryptionKeysService.js";
export * from "./encryptionKeysRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { FieldClassificationRuleRecordService } from "./fieldClassificationRulesService.js";

export function registerFieldClassificationRuleRecordRoutes(router: Router, service: FieldClassificationRuleRecordService): void {
  router.get("/pack19/fieldClassificationRules", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/fieldClassificationRules", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesService.ts`

```text
import type { FieldClassificationRuleRecord, FieldClassificationRuleRecordRepository } from "./fieldClassificationRulesTypes.js";

export class FieldClassificationRuleRecordService {
  constructor(private readonly repository: FieldClassificationRuleRecordRepository) {}

  create(record: FieldClassificationRuleRecord): Promise<FieldClassificationRuleRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<FieldClassificationRuleRecord>): Promise<FieldClassificationRuleRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("fieldClassificationRules-not-found");
    return updated;
  }

  list(filter: Partial<FieldClassificationRuleRecord> = {}, limit = 50): Promise<FieldClassificationRuleRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesTypes.ts`

```text
export interface FieldClassificationRuleRecord {
  id: string; tenantId: string; resourceType: string; fieldName: string; classification: string; encrypted: boolean; updatedAt: string;
}

export interface FieldClassificationRuleRecordRepository {
  create(record: FieldClassificationRuleRecord): Promise<FieldClassificationRuleRecord>;
  update(id: string, patch: Partial<FieldClassificationRuleRecord>): Promise<FieldClassificationRuleRecord | null>;
  list(filter: Partial<FieldClassificationRuleRecord>, limit: number): Promise<FieldClassificationRuleRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/index.ts`

```text
export * from "./fieldClassificationRulesTypes.js";
export * from "./fieldClassificationRulesService.js";
export * from "./fieldClassificationRulesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/index.ts`

```text
export * from "./common/pack19Route.js";
export * from "./common/residencyAdminAuth.js";
export * from "./dataResidencyPolicies/residencyPolicyValidator.js";
export * from "./encryptionKeys/encryptionKeyPolicy.js";
export * from "./retentionRuns/retentionRunPolicy.js";
export * from "./crossRegionTransferRequests/transferRequestPolicy.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/index.ts`

```text
export * from "./keyRotationJobsTypes.js";
export * from "./keyRotationJobsService.js";
export * from "./keyRotationJobsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { KeyRotationJobRecordService } from "./keyRotationJobsService.js";

export function registerKeyRotationJobRecordRoutes(router: Router, service: KeyRotationJobRecordService): void {
  router.get("/pack19/keyRotationJobs", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/keyRotationJobs", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsService.ts`

```text
import type { KeyRotationJobRecord, KeyRotationJobRecordRepository } from "./keyRotationJobsTypes.js";

export class KeyRotationJobRecordService {
  constructor(private readonly repository: KeyRotationJobRecordRepository) {}

  create(record: KeyRotationJobRecord): Promise<KeyRotationJobRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<KeyRotationJobRecord>): Promise<KeyRotationJobRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("keyRotationJobs-not-found");
    return updated;
  }

  list(filter: Partial<KeyRotationJobRecord> = {}, limit = 50): Promise<KeyRotationJobRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsTypes.ts`

```text
export interface KeyRotationJobRecord {
  id: string; tenantId: string; keyId: string; status: 'queued' | 'running' | 'completed' | 'failed'; createdAt: string; completedAt?: string;
}

export interface KeyRotationJobRecordRepository {
  create(record: KeyRotationJobRecord): Promise<KeyRotationJobRecord>;
  update(id: string, patch: Partial<KeyRotationJobRecord>): Promise<KeyRotationJobRecord | null>;
  list(filter: Partial<KeyRotationJobRecord>, limit: number): Promise<KeyRotationJobRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/index.ts`

```text
export * from "./residencyAuditTypes.js";
export * from "./residencyAuditService.js";
export * from "./residencyAuditRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { ResidencyAuditRecordService } from "./residencyAuditService.js";

export function registerResidencyAuditRecordRoutes(router: Router, service: ResidencyAuditRecordService): void {
  router.get("/pack19/residencyAudit", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/residencyAudit", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditService.ts`

```text
import type { ResidencyAuditRecord, ResidencyAuditRecordRepository } from "./residencyAuditTypes.js";

export class ResidencyAuditRecordService {
  constructor(private readonly repository: ResidencyAuditRecordRepository) {}

  create(record: ResidencyAuditRecord): Promise<ResidencyAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ResidencyAuditRecord>): Promise<ResidencyAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("residencyAudit-not-found");
    return updated;
  }

  list(filter: Partial<ResidencyAuditRecord> = {}, limit = 50): Promise<ResidencyAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditTypes.ts`

```text
export interface ResidencyAuditRecord {
  id: string; tenantId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface ResidencyAuditRecordRepository {
  create(record: ResidencyAuditRecord): Promise<ResidencyAuditRecord>;
  update(id: string, patch: Partial<ResidencyAuditRecord>): Promise<ResidencyAuditRecord | null>;
  list(filter: Partial<ResidencyAuditRecord>, limit: number): Promise<ResidencyAuditRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/index.ts`

```text
export * from "./retentionPoliciesTypes.js";
export * from "./retentionPoliciesService.js";
export * from "./retentionPoliciesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { RetentionPolicyRecordService } from "./retentionPoliciesService.js";

export function registerRetentionPolicyRecordRoutes(router: Router, service: RetentionPolicyRecordService): void {
  router.get("/pack19/retentionPolicies", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/retentionPolicies", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesService.ts`

```text
import type { RetentionPolicyRecord, RetentionPolicyRecordRepository } from "./retentionPoliciesTypes.js";

export class RetentionPolicyRecordService {
  constructor(private readonly repository: RetentionPolicyRecordRepository) {}

  create(record: RetentionPolicyRecord): Promise<RetentionPolicyRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<RetentionPolicyRecord>): Promise<RetentionPolicyRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("retentionPolicies-not-found");
    return updated;
  }

  list(filter: Partial<RetentionPolicyRecord> = {}, limit = 50): Promise<RetentionPolicyRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesTypes.ts`

```text
export interface RetentionPolicyRecord {
  id: string; tenantId: string; resourceType: string; keepDays: number; legalHoldAware: boolean; updatedAt: string;
}

export interface RetentionPolicyRecordRepository {
  create(record: RetentionPolicyRecord): Promise<RetentionPolicyRecord>;
  update(id: string, patch: Partial<RetentionPolicyRecord>): Promise<RetentionPolicyRecord | null>;
  list(filter: Partial<RetentionPolicyRecord>, limit: number): Promise<RetentionPolicyRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/index.ts`

```text
export * from "./retentionRunsTypes.js";
export * from "./retentionRunsService.js";
export * from "./retentionRunsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunPolicy.ts`

```text
export function retentionRunCanDelete(input: { legalHold: boolean; dryRun: boolean; approved: boolean }): { allowed: boolean; reason: string } {
  if (input.legalHold) return { allowed: false, reason: "legal-hold" };
  if (input.dryRun) return { allowed: false, reason: "dry-run" };
  if (!input.approved) return { allowed: false, reason: "approval-required" };
  return { allowed: true, reason: "allowed" };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { RetentionRunRecordService } from "./retentionRunsService.js";

export function registerRetentionRunRecordRoutes(router: Router, service: RetentionRunRecordService): void {
  router.get("/pack19/retentionRuns", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/retentionRuns", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsService.ts`

```text
import type { RetentionRunRecord, RetentionRunRecordRepository } from "./retentionRunsTypes.js";

export class RetentionRunRecordService {
  constructor(private readonly repository: RetentionRunRecordRepository) {}

  create(record: RetentionRunRecord): Promise<RetentionRunRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<RetentionRunRecord>): Promise<RetentionRunRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("retentionRuns-not-found");
    return updated;
  }

  list(filter: Partial<RetentionRunRecord> = {}, limit = 50): Promise<RetentionRunRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsTypes.ts`

```text
export interface RetentionRunRecord {
  id: string; tenantId: string; policyId: string; status: 'queued' | 'running' | 'completed' | 'failed'; deletedCount: number; createdAt: string;
}

export interface RetentionRunRecordRepository {
  create(record: RetentionRunRecord): Promise<RetentionRunRecord>;
  update(id: string, patch: Partial<RetentionRunRecord>): Promise<RetentionRunRecord | null>;
  list(filter: Partial<RetentionRunRecord>, limit: number): Promise<RetentionRunRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/index.ts`

```text
export * from "./tenantIsolationChecksTypes.js";
export * from "./tenantIsolationChecksService.js";
export * from "./tenantIsolationChecksRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { TenantIsolationCheckRecordService } from "./tenantIsolationChecksService.js";

export function registerTenantIsolationCheckRecordRoutes(router: Router, service: TenantIsolationCheckRecordService): void {
  router.get("/pack19/tenantIsolationChecks", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/tenantIsolationChecks", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksService.ts`

```text
import type { TenantIsolationCheckRecord, TenantIsolationCheckRecordRepository } from "./tenantIsolationChecksTypes.js";

export class TenantIsolationCheckRecordService {
  constructor(private readonly repository: TenantIsolationCheckRecordRepository) {}

  create(record: TenantIsolationCheckRecord): Promise<TenantIsolationCheckRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TenantIsolationCheckRecord>): Promise<TenantIsolationCheckRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("tenantIsolationChecks-not-found");
    return updated;
  }

  list(filter: Partial<TenantIsolationCheckRecord> = {}, limit = 50): Promise<TenantIsolationCheckRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksTypes.ts`

```text
export interface TenantIsolationCheckRecord {
  id: string; tenantId: string; check: string; status: 'passed' | 'failed' | 'warning'; checkedAt: string;
}

export interface TenantIsolationCheckRecordRepository {
  create(record: TenantIsolationCheckRecord): Promise<TenantIsolationCheckRecord>;
  update(id: string, patch: Partial<TenantIsolationCheckRecord>): Promise<TenantIsolationCheckRecord | null>;
  list(filter: Partial<TenantIsolationCheckRecord>, limit: number): Promise<TenantIsolationCheckRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/index.ts`

```text
export * from "./tenantRegionAssignmentsTypes.js";
export * from "./tenantRegionAssignmentsService.js";
export * from "./tenantRegionAssignmentsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsRoutes.ts`

```text
import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { TenantRegionAssignmentRecordService } from "./tenantRegionAssignmentsService.js";

export function registerTenantRegionAssignmentRecordRoutes(router: Router, service: TenantRegionAssignmentRecordService): void {
  router.get("/pack19/tenantRegionAssignments", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/tenantRegionAssignments", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsService.ts`

```text
import type { TenantRegionAssignmentRecord, TenantRegionAssignmentRecordRepository } from "./tenantRegionAssignmentsTypes.js";

export class TenantRegionAssignmentRecordService {
  constructor(private readonly repository: TenantRegionAssignmentRecordRepository) {}

  create(record: TenantRegionAssignmentRecord): Promise<TenantRegionAssignmentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TenantRegionAssignmentRecord>): Promise<TenantRegionAssignmentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("tenantRegionAssignments-not-found");
    return updated;
  }

  list(filter: Partial<TenantRegionAssignmentRecord> = {}, limit = 50): Promise<TenantRegionAssignmentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsTypes.ts`

```text
export interface TenantRegionAssignmentRecord {
  id: string; tenantId: string; region: string; purpose: 'primary' | 'backup' | 'archive'; assignedAt: string;
}

export interface TenantRegionAssignmentRecordRepository {
  create(record: TenantRegionAssignmentRecord): Promise<TenantRegionAssignmentRecord>;
  update(id: string, patch: Partial<TenantRegionAssignmentRecord>): Promise<TenantRegionAssignmentRecord | null>;
  list(filter: Partial<TenantRegionAssignmentRecord>, limit: number): Promise<TenantRegionAssignmentRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack19/complianceExportStatus.tsx`

```text
import React from "react";

export function ComplianceExportStatus(props: { status: "queued" | "running" | "completed" | "failed"; scope: string }): JSX.Element {
  return <span data-export-status={props.status}>{props.scope} export: {props.status}</span>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack19/dataRegionBadge.tsx`

```text
import React from "react";

export function DataRegionBadge(props: { region: string; purpose: "primary" | "backup" | "archive" }): JSX.Element {
  return <span data-region-purpose={props.purpose}>Data region: {props.region} · {props.purpose}</span>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack19/encryptionStatusBadge.tsx`

```text
import React from "react";

export function EncryptionStatusBadge(props: { status: "active" | "rotating" | "retired" | "disabled" }): JSX.Element {
  return <span data-encryption-key-status={props.status}>Encryption key: {props.status}</span>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack19/index.ts`

```text
export * from "./dataRegionBadge.js";
export * from "./retentionStatusNotice.js";
export * from "./encryptionStatusBadge.js";
export * from "./complianceExportStatus.js";

```


## `REVIEW_REQUIRED/apps/desktop/src/pack19/retentionStatusNotice.tsx`

```text
import React from "react";

export function RetentionStatusNotice(props: { resourceType: string; keepDays: number; legalHold: boolean }): JSX.Element {
  return <aside role="status">{props.resourceType}: retained {props.keepDays} days{props.legalHold ? " · legal hold active" : ""}</aside>;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/ComplianceExportsPage.tsx`

```text
import React from "react";

export interface ComplianceExportsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ComplianceExportsPage(props: { rows: ComplianceExportsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Compliance exports</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/CrossRegionTransfersPage.tsx`

```text
import React from "react";

export interface CrossRegionTransfersPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function CrossRegionTransfersPage(props: { rows: CrossRegionTransfersPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Cross-region transfers</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/DataInventoryPage.tsx`

```text
import React from "react";

export interface DataInventoryPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function DataInventoryPage(props: { rows: DataInventoryPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Data inventory</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/DataResidencyPoliciesPage.tsx`

```text
import React from "react";

export interface DataResidencyPoliciesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function DataResidencyPoliciesPage(props: { rows: DataResidencyPoliciesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Data residency policies</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/EncryptionKeysPage.tsx`

```text
import React from "react";

export interface EncryptionKeysPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function EncryptionKeysPage(props: { rows: EncryptionKeysPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Encryption keys</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/FieldClassificationRulesPage.tsx`

```text
import React from "react";

export interface FieldClassificationRulesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function FieldClassificationRulesPage(props: { rows: FieldClassificationRulesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Field classification rules</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/KeyRotationJobsPage.tsx`

```text
import React from "react";

export interface KeyRotationJobsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function KeyRotationJobsPage(props: { rows: KeyRotationJobsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Key rotation jobs</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/ResidencyAuditPage.tsx`

```text
import React from "react";

export interface ResidencyAuditPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ResidencyAuditPage(props: { rows: ResidencyAuditPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Residency audit</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/RetentionPoliciesPage.tsx`

```text
import React from "react";

export interface RetentionPoliciesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function RetentionPoliciesPage(props: { rows: RetentionPoliciesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Retention policies</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/RetentionRunsPage.tsx`

```text
import React from "react";

export interface RetentionRunsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function RetentionRunsPage(props: { rows: RetentionRunsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Retention runs</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/TenantIsolationChecksPage.tsx`

```text
import React from "react";

export interface TenantIsolationChecksPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function TenantIsolationChecksPage(props: { rows: TenantIsolationChecksPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Tenant isolation checks</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/components/TenantRegionAssignmentsPage.tsx`

```text
import React from "react";

export interface TenantRegionAssignmentsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function TenantRegionAssignmentsPage(props: { rows: TenantRegionAssignmentsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Tenant region assignments</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useComplianceExports.ts`

```text
import { useEffect, useState } from "react";

export interface useComplianceExportsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useComplianceExports<T>(loader: () => Promise<T>): useComplianceExportsResult<T> {
  const [state, setState] = useState<useComplianceExportsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useCrossRegionTransfers.ts`

```text
import { useEffect, useState } from "react";

export interface useCrossRegionTransfersResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useCrossRegionTransfers<T>(loader: () => Promise<T>): useCrossRegionTransfersResult<T> {
  const [state, setState] = useState<useCrossRegionTransfersResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useDataInventory.ts`

```text
import { useEffect, useState } from "react";

export interface useDataInventoryResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useDataInventory<T>(loader: () => Promise<T>): useDataInventoryResult<T> {
  const [state, setState] = useState<useDataInventoryResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useDataResidencyPolicies.ts`

```text
import { useEffect, useState } from "react";

export interface useDataResidencyPoliciesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useDataResidencyPolicies<T>(loader: () => Promise<T>): useDataResidencyPoliciesResult<T> {
  const [state, setState] = useState<useDataResidencyPoliciesResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useEncryptionKeys.ts`

```text
import { useEffect, useState } from "react";

export interface useEncryptionKeysResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useEncryptionKeys<T>(loader: () => Promise<T>): useEncryptionKeysResult<T> {
  const [state, setState] = useState<useEncryptionKeysResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useFieldClassificationRules.ts`

```text
import { useEffect, useState } from "react";

export interface useFieldClassificationRulesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useFieldClassificationRules<T>(loader: () => Promise<T>): useFieldClassificationRulesResult<T> {
  const [state, setState] = useState<useFieldClassificationRulesResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useKeyRotationJobs.ts`

```text
import { useEffect, useState } from "react";

export interface useKeyRotationJobsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useKeyRotationJobs<T>(loader: () => Promise<T>): useKeyRotationJobsResult<T> {
  const [state, setState] = useState<useKeyRotationJobsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useResidencyAudit.ts`

```text
import { useEffect, useState } from "react";

export interface useResidencyAuditResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useResidencyAudit<T>(loader: () => Promise<T>): useResidencyAuditResult<T> {
  const [state, setState] = useState<useResidencyAuditResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useRetentionPolicies.ts`

```text
import { useEffect, useState } from "react";

export interface useRetentionPoliciesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useRetentionPolicies<T>(loader: () => Promise<T>): useRetentionPoliciesResult<T> {
  const [state, setState] = useState<useRetentionPoliciesResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useRetentionRuns.ts`

```text
import { useEffect, useState } from "react";

export interface useRetentionRunsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useRetentionRuns<T>(loader: () => Promise<T>): useRetentionRunsResult<T> {
  const [state, setState] = useState<useRetentionRunsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useTenantIsolationChecks.ts`

```text
import { useEffect, useState } from "react";

export interface useTenantIsolationChecksResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useTenantIsolationChecks<T>(loader: () => Promise<T>): useTenantIsolationChecksResult<T> {
  const [state, setState] = useState<useTenantIsolationChecksResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/hooks/useTenantRegionAssignments.ts`

```text
import { useEffect, useState } from "react";

export interface useTenantRegionAssignmentsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useTenantRegionAssignments<T>(loader: () => Promise<T>): useTenantRegionAssignmentsResult<T> {
  const [state, setState] = useState<useTenantRegionAssignmentsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack19/index.ts`

```text
export * from "./components/DataResidencyPoliciesPage.js";
export * from "./components/TenantRegionAssignmentsPage.js";
export * from "./components/EncryptionKeysPage.js";
export * from "./components/KeyRotationJobsPage.js";
export * from "./components/RetentionPoliciesPage.js";
export * from "./components/RetentionRunsPage.js";
export * from "./components/TenantIsolationChecksPage.js";
export * from "./components/CrossRegionTransfersPage.js";
export * from "./components/ComplianceExportsPage.js";
export * from "./components/DataInventoryPage.js";
export * from "./components/FieldClassificationRulesPage.js";
export * from "./components/ResidencyAuditPage.js";
export * from "./hooks/useDataResidencyPolicies.js";
export * from "./hooks/useTenantRegionAssignments.js";
export * from "./hooks/useEncryptionKeys.js";
export * from "./hooks/useKeyRotationJobs.js";
export * from "./hooks/useRetentionPolicies.js";
export * from "./hooks/useRetentionRuns.js";
export * from "./hooks/useTenantIsolationChecks.js";
export * from "./hooks/useCrossRegionTransfers.js";
export * from "./hooks/useComplianceExports.js";
export * from "./hooks/useDataInventory.js";
export * from "./hooks/useFieldClassificationRules.js";
export * from "./hooks/useResidencyAudit.js";

```


## `SAFE_DIRECT_COPY/docs/pack19/01-merge-guide.md`

```text
Pack 19 adds data residency policies, tenant-region assignments, encryption key lifecycle, retention policies/runs, tenant isolation checks, cross-region transfer requests, compliance exports, data inventory, field classification and residency audit.

```


## `SAFE_DIRECT_COPY/docs/pack19/02-data-residency.md`

```text
Data residency policy chooses primary and backup regions. Cross-region support access is disabled by default unless explicitly allowed.

```


## `SAFE_DIRECT_COPY/docs/pack19/03-tenant-isolation.md`

```text
Tenant isolation must be enforced in every repository query. Client-side filters are not authorization.

```


## `SAFE_DIRECT_COPY/docs/pack19/04-key-lifecycle.md`

```text
Key rotation jobs are modeled but actual KMS/provider operations must be wired through existing secret infrastructure.

```


## `SAFE_DIRECT_COPY/docs/pack19/05-retention-controls.md`

```text
Retention runs must respect legal hold, dry-run mode and approval before deletion.

```


## `SAFE_DIRECT_COPY/docs/pack19/06-compliance-exports.md`

```text
Compliance exports must be role-gated by scope and stored with checksums in object storage.

```


## `SAFE_DIRECT_COPY/docs/pack19/07-qa-checklist.md`

```text
Verify region validation, tenant boundaries, key rotation due logic, legal-hold retention blocking, transfer approvals, export role gates and dashboard authorization.

```


## `SAFE_DIRECT_COPY/infra/pack19/postgres-residency-indexes.sql`

```text
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_residency_policy_tenant ON data_residency_policies(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenant_region_assignments_tenant_region ON tenant_region_assignments(tenant_id, region);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_encryption_keys_tenant_status ON encryption_keys(tenant_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_residency_audit_tenant_occurred ON residency_audit(tenant_id, occurred_at DESC);

```


## `SAFE_DIRECT_COPY/infra/pack19/prometheus-residency-alerts.yml`

```text
groups:
  - name: remotedesk-residency-pack19
    rules:
      - alert: RemoteDeskTenantIsolationCheckFailed
        expr: remotedesk_tenant_isolation_checks_failed_total > 0
        for: 1m
        labels:
          severity: critical
      - alert: RemoteDeskKeyRotationOverdue
        expr: remotedesk_encryption_key_rotation_overdue_total > 0
        for: 24h
        labels:
          severity: warning

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/classifiedField.ts`

```text
export type FieldClassification = "public" | "internal" | "confidential" | "restricted";

export function fieldRequiresEncryption(classification: FieldClassification): boolean {
  return classification === "confidential" || classification === "restricted";
}

export function fieldRequiresRedaction(role: string, classification: FieldClassification): boolean {
  if (classification === "public") return false;
  if (classification === "internal") return !["owner", "admin", "support", "auditor"].includes(role);
  if (classification === "confidential") return !["owner", "admin", "auditor"].includes(role);
  return role !== "owner";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/dataRegion.ts`

```text
export type DataRegion = "us" | "eu" | "uk" | "apac" | "ca" | "au";

export function normalizeDataRegion(value: string): DataRegion | undefined {
  const region = value.trim().toLowerCase();
  return ["us", "eu", "uk", "apac", "ca", "au"].includes(region) ? region as DataRegion : undefined;
}

export function regionDisplayName(region: DataRegion): string {
  return { us: "United States", eu: "European Union", uk: "United Kingdom", apac: "Asia Pacific", ca: "Canada", au: "Australia" }[region];
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/dataTransferGuard.ts`

```text
export interface DataTransferRequest {
  sourceRegion: string;
  targetRegion: string;
  purpose: "backup" | "support" | "migration" | "export";
  approved: boolean;
}

export function crossRegionTransferAllowed(request: DataTransferRequest): { allowed: boolean; reason: string } {
  if (request.sourceRegion === request.targetRegion) return { allowed: true, reason: "same-region" };
  if (!request.approved) return { allowed: false, reason: "approval-required" };
  if (request.purpose === "support") return { allowed: false, reason: "support-cross-region-blocked" };
  return { allowed: true, reason: "approved" };
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/exportScope.ts`

```text
export type ComplianceExportScope = "tenant" | "user" | "device" | "audit" | "billing";

export function exportScopeAllowed(role: string, scope: ComplianceExportScope): boolean {
  if (role === "owner") return true;
  if (role === "admin") return scope !== "billing";
  if (role === "auditor") return ["audit", "tenant", "device"].includes(scope);
  if (role === "billing") return scope === "billing";
  return false;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/index.ts`

```text
export * from "./dataRegion.js";
export * from "./residencyPolicy.js";
export * from "./tenantBoundary.js";
export * from "./keyRotation.js";
export * from "./retentionWindow.js";
export * from "./classifiedField.js";
export * from "./exportScope.js";
export * from "./dataTransferGuard.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/keyRotation.ts`

```text
export interface KeyRotationPolicy {
  rotationDays: number;
  lastRotatedAt?: string;
  disabled: boolean;
}

export function keyRotationDue(policy: KeyRotationPolicy, now = new Date()): boolean {
  if (policy.disabled) return false;
  if (!policy.lastRotatedAt) return true;
  return now.getTime() - new Date(policy.lastRotatedAt).getTime() >= policy.rotationDays * 24 * 60 * 60 * 1000;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/residencyPolicy.ts`

```text
import type { DataRegion } from "./dataRegion.js";

export interface ResidencyPolicy {
  tenantId: string;
  primaryRegion: DataRegion;
  allowedBackupRegions: DataRegion[];
  crossRegionSupportAccess: boolean;
}

export function regionAllowedByPolicy(policy: ResidencyPolicy, region: DataRegion, purpose: "primary" | "backup" | "support"): boolean {
  if (purpose === "primary") return policy.primaryRegion === region;
  if (purpose === "backup") return policy.allowedBackupRegions.includes(region);
  return policy.crossRegionSupportAccess || policy.primaryRegion === region;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/retentionWindow.ts`

```text
export interface RetentionWindow {
  keepDays: number;
  legalHold: boolean;
}

export function canDeleteByRetention(createdAt: string, window: RetentionWindow, now = new Date()): boolean {
  if (window.legalHold) return false;
  return now.getTime() - new Date(createdAt).getTime() >= window.keepDays * 24 * 60 * 60 * 1000;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack19/tenantBoundary.ts`

```text
export interface TenantScopedRecord {
  tenantId: string;
}

export function enforceTenantBoundary<T extends TenantScopedRecord>(records: readonly T[], tenantId: string): T[] {
  return records.filter((record) => record.tenantId === tenantId);
}

export function assertTenantMatch(recordTenantId: string, requestTenantId: string): void {
  if (recordTenantId !== requestTenantId) throw new Error("tenant-boundary-violation");
}

```


## `SAFE_DIRECT_COPY/scripts/pack19/check-residency-safe-defaults.mjs`

```text
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const root = process.argv[2] ?? ".";
const bad = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else {
      const text = readFileSync(path, "utf8");
      if (/crossRegionSupportAccess:\s*true|ignoreTenantBoundary|forceDeleteRetention/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("Residency safe-default findings:", bad); process.exit(1); }
console.log("Residency safe-default scanner passed.");

```


## `SAFE_DIRECT_COPY/tests/pack19/dataRegion.test.ts`

```text
import assert from "node:assert/strict"; import { normalizeDataRegion, regionDisplayName } from "../../packages/shared/src/pack19/dataRegion.js"; assert.equal(normalizeDataRegion("EU"), "eu"); assert.equal(regionDisplayName("us"), "United States");

```


## `SAFE_DIRECT_COPY/tests/pack19/exportScope.test.ts`

```text
import assert from "node:assert/strict"; import { exportScopeAllowed } from "../../packages/shared/src/pack19/exportScope.js"; assert.equal(exportScopeAllowed("auditor", "audit"), true); assert.equal(exportScopeAllowed("member", "tenant"), false);

```


## `SAFE_DIRECT_COPY/tests/pack19/keyRotation.test.ts`

```text
import assert from "node:assert/strict"; import { keyRotationDue } from "../../packages/shared/src/pack19/keyRotation.js"; assert.equal(keyRotationDue({ rotationDays: 30, disabled: false }), true);

```


## `SAFE_DIRECT_COPY/tests/pack19/residencyPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { regionAllowedByPolicy } from "../../packages/shared/src/pack19/residencyPolicy.js"; assert.equal(regionAllowedByPolicy({ tenantId: "t", primaryRegion: "eu", allowedBackupRegions: ["uk"], crossRegionSupportAccess: false }, "uk", "backup"), true);

```


## `SAFE_DIRECT_COPY/tests/pack19/residencyPolicyValidator.test.ts`

```text
import assert from "node:assert/strict"; import { validateResidencyPolicy } from "../../REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/residencyPolicyValidator.js"; assert.deepEqual(validateResidencyPolicy({ primaryRegion: "eu", backupRegions: ["uk"] }), []);

```


## `SAFE_DIRECT_COPY/tests/pack19/retentionRunPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { retentionRunCanDelete } from "../../REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunPolicy.js"; assert.equal(retentionRunCanDelete({ legalHold: true, dryRun: false, approved: true }).reason, "legal-hold");

```


## `SAFE_DIRECT_COPY/tests/pack19/retentionWindow.test.ts`

```text
import assert from "node:assert/strict"; import { canDeleteByRetention } from "../../packages/shared/src/pack19/retentionWindow.js"; assert.equal(canDeleteByRetention("2020-01-01T00:00:00Z", { keepDays: 30, legalHold: false }, new Date("2020-03-01T00:00:00Z")), true);

```


## `SAFE_DIRECT_COPY/tests/pack19/tenantBoundary.test.ts`

```text
import assert from "node:assert/strict"; import { enforceTenantBoundary } from "../../packages/shared/src/pack19/tenantBoundary.js"; assert.equal(enforceTenantBoundary([{ tenantId: "a" }, { tenantId: "b" }], "a").length, 1);

```


## `SAFE_DIRECT_COPY/tests/pack19/transferRequestPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { transferRequestAllowed } from "../../REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/transferRequestPolicy.js"; assert.equal(transferRequestAllowed({ sourceRegion: "eu", targetRegion: "us", purpose: "support", approved: true }).allowed, false);

```


## `generated-remotedesk-data-residency-pack-19-code-review.md`

```text
Review tenant-scoped repository filters, region policy validation, cross-region transfer approval, retention legal-hold handling, KMS key lifecycle boundaries, compliance export role gates and dashboard authorization.

```


## `generated-remotedesk-data-residency-pack-19-manifest.json`

```text
{
  "name": "generated-remotedesk-data-residency-pack-19",
  "createdAt": "2026-06-15T07:18:55.985961+00:00",
  "actualFileCount": 124,
  "safeDirectCopyCount": 28,
  "reviewRequiredCount": 85,
  "patchesCount": 4,
  "doNotMergeCount": 0,
  "filesByArea": {
    "shared": 9,
    "api": 55,
    "web": 25,
    "desktop": 5,
    "tests": 9,
    "docs": 7,
    "scripts": 1,
    "infra": 2
  },
  "safeDirectCopy": [
    "SAFE_DIRECT_COPY/docs/pack19/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack19/02-data-residency.md",
    "SAFE_DIRECT_COPY/docs/pack19/03-tenant-isolation.md",
    "SAFE_DIRECT_COPY/docs/pack19/04-key-lifecycle.md",
    "SAFE_DIRECT_COPY/docs/pack19/05-retention-controls.md",
    "SAFE_DIRECT_COPY/docs/pack19/06-compliance-exports.md",
    "SAFE_DIRECT_COPY/docs/pack19/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack19/postgres-residency-indexes.sql",
    "SAFE_DIRECT_COPY/infra/pack19/prometheus-residency-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/classifiedField.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/dataRegion.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/dataTransferGuard.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/exportScope.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/keyRotation.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/residencyPolicy.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/retentionWindow.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack19/tenantBoundary.ts",
    "SAFE_DIRECT_COPY/scripts/pack19/check-residency-safe-defaults.mjs",
    "SAFE_DIRECT_COPY/tests/pack19/dataRegion.test.ts",
    "SAFE_DIRECT_COPY/tests/pack19/exportScope.test.ts",
    "SAFE_DIRECT_COPY/tests/pack19/keyRotation.test.ts",
    "SAFE_DIRECT_COPY/tests/pack19/residencyPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack19/residencyPolicyValidator.test.ts",
    "SAFE_DIRECT_COPY/tests/pack19/retentionRunPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack19/retentionWindow.test.ts",
    "SAFE_DIRECT_COPY/tests/pack19/tenantBoundary.test.ts",
    "SAFE_DIRECT_COPY/tests/pack19/transferRequestPolicy.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack19/common/pack19Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/common/residencyAdminAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/complianceExportsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/complianceExports/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/crossRegionTransferRequestsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/crossRegionTransferRequests/transferRequestPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/dataInventoryItemsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataInventoryItems/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/dataResidencyPoliciesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/dataResidencyPolicies/residencyPolicyValidator.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeyPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/encryptionKeysTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/encryptionKeys/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/fieldClassificationRulesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/fieldClassificationRules/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/keyRotationJobs/keyRotationJobsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/residencyAudit/residencyAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionPolicies/retentionPoliciesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/retentionRuns/retentionRunsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/tenantIsolationChecks/tenantIsolationChecksTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack19/tenantRegionAssignments/tenantRegionAssignmentsTypes.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack19/complianceExportStatus.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack19/dataRegionBadge.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack19/encryptionStatusBadge.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack19/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack19/retentionStatusNotice.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/ComplianceExportsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/CrossRegionTransfersPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/DataInventoryPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/DataResidencyPoliciesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/EncryptionKeysPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/FieldClassificationRulesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/KeyRotationJobsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/ResidencyAuditPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/RetentionPoliciesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/RetentionRunsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/TenantIsolationChecksPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/components/TenantRegionAssignmentsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useComplianceExports.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useCrossRegionTransfers.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useDataInventory.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useDataResidencyPolicies.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useEncryptionKeys.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useFieldClassificationRules.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useKeyRotationJobs.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useResidencyAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useRetentionPolicies.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useRetentionRuns.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useTenantIsolationChecks.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/hooks/useTenantRegionAssignments.ts",
    "REVIEW_REQUIRED/apps/web/src/pack19/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack19.patch.md",
    "PATCHES/desktop-pack19.patch.md",
    "PATCHES/ops-pack19.patch.md",
    "PATCHES/web-pack19.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Actual KMS/provider key operations are not implemented.",
    "Object storage integration is needed for compliance exports.",
    "Tenant boundary checks must be enforced server-side in every repository.",
    "No remote shell, unattended access or unsafe native input is included."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 94-98% with prior packs after KMS/storage wiring and residency QA"
}
```


## `generated-remotedesk-data-residency-pack-19-merge-summary.md`

```text
Pack 19 adds data residency policy, tenant region assignments, encryption key lifecycle, retention policies/runs, tenant isolation checks, cross-region transfer approvals, compliance exports, data inventory, field classification, residency audit, dashboards, desktop badges and ops checks.

```


## `generated-remotedesk-data-residency-pack-19-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| Cross-tenant data leak | Critical | tenant-scoped repositories and isolation checks |
| Residency violation | Critical | region policy and transfer approvals |
| Deletion during legal hold | Critical | retention run legal-hold block |
| KMS misuse | High | provider integration through secret infrastructure |
| Compliance export leak | High | role gates and object checksums |

```


## `generated-remotedesk-data-residency-pack-19-test-plan.md`

```text
Run Pack 19 shared/API tests, residency safe-default scanner, then manual QA for region assignments, tenant isolation dashboards, key rotation jobs, retention legal hold, cross-region transfer approval and compliance exports.

```
