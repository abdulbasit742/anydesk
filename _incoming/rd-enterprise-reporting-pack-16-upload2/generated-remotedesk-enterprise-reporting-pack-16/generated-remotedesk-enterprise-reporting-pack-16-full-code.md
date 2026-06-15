# generated-remotedesk-enterprise-reporting-pack-16 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack16.patch.md
PATCHES/desktop-pack16.patch.md
PATCHES/ops-pack16.patch.md
PATCHES/web-pack16.patch.md
REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/common/enterpriseAdminAuth.ts
REVIEW_REQUIRED/apps/api/src/pack16/common/pack16Route.ts
REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/csvExports/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/departments/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersService.ts
REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/organizations/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/index.ts
REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsService.ts
REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimEventPolicy.ts
REVIEW_REQUIRED/apps/desktop/src/pack16/departmentSwitcher.tsx
REVIEW_REQUIRED/apps/desktop/src/pack16/enterpriseContextBanner.tsx
REVIEW_REQUIRED/apps/desktop/src/pack16/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack16/orgRoleGuard.ts
REVIEW_REQUIRED/apps/desktop/src/pack16/reportExportStatus.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/AdminDashboardsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/CsvExportsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/DepartmentsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/EnterpriseAuditPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/OrgMembersPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/OrganizationsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/ReportDefinitionsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/ReportRunsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/RoleAssignmentsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/SamlGroupMappingsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/ScheduledReportsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/components/ScimDirectoryEventsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useAdminDashboards.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useCsvExports.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useDepartments.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useEnterpriseAudit.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useOrgMembers.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useOrganizations.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useReportDefinitions.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useReportRuns.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useRoleAssignments.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useSamlGroupMappings.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useScheduledReports.ts
REVIEW_REQUIRED/apps/web/src/pack16/hooks/useScimDirectoryEvents.ts
REVIEW_REQUIRED/apps/web/src/pack16/index.ts
SAFE_DIRECT_COPY/docs/pack16/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack16/02-rbac.md
SAFE_DIRECT_COPY/docs/pack16/03-saml-scim.md
SAFE_DIRECT_COPY/docs/pack16/04-reporting.md
SAFE_DIRECT_COPY/docs/pack16/05-csv-safety.md
SAFE_DIRECT_COPY/docs/pack16/06-admin-dashboard.md
SAFE_DIRECT_COPY/docs/pack16/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack16/postgres-enterprise-indexes.sql
SAFE_DIRECT_COPY/packages/shared/src/pack16/csvExportSafety.ts
SAFE_DIRECT_COPY/packages/shared/src/pack16/departmentPath.ts
SAFE_DIRECT_COPY/packages/shared/src/pack16/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack16/orgRole.ts
SAFE_DIRECT_COPY/packages/shared/src/pack16/reportDateRange.ts
SAFE_DIRECT_COPY/packages/shared/src/pack16/reportRedaction.ts
SAFE_DIRECT_COPY/packages/shared/src/pack16/samlGroupMapping.ts
SAFE_DIRECT_COPY/packages/shared/src/pack16/scheduledReport.ts
SAFE_DIRECT_COPY/packages/shared/src/pack16/scimPatchSafety.ts
SAFE_DIRECT_COPY/scripts/pack16/check-report-safety.mjs
SAFE_DIRECT_COPY/tests/pack16/csvExportPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack16/csvExportSafety.test.ts
SAFE_DIRECT_COPY/tests/pack16/departmentPath.test.ts
SAFE_DIRECT_COPY/tests/pack16/orgRole.test.ts
SAFE_DIRECT_COPY/tests/pack16/orgRoleGuard.test.ts
SAFE_DIRECT_COPY/tests/pack16/reportDateRange.test.ts
SAFE_DIRECT_COPY/tests/pack16/roleAssignmentPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack16/samlGroupMapping.test.ts
SAFE_DIRECT_COPY/tests/pack16/scimPatchSafety.test.ts
generated-remotedesk-enterprise-reporting-pack-16-code-review.md
generated-remotedesk-enterprise-reporting-pack-16-manifest.json
generated-remotedesk-enterprise-reporting-pack-16-merge-summary.md
generated-remotedesk-enterprise-reporting-pack-16-risk-register.md
generated-remotedesk-enterprise-reporting-pack-16-test-plan.md

```


## `PATCHES/api-pack16.patch.md`

```text
Mount Pack 16 enterprise routes behind owner/admin enterprise permissions. Enforce organization scope in every repository query. Use object storage for large CSV exports.

```


## `PATCHES/desktop-pack16.patch.md`

```text
Wire enterprise context banner and department switcher into settings/profile. Do not expose restricted reports in desktop UI.

```


## `PATCHES/ops-pack16.patch.md`

```text
Run report safety scanner in CI and review Postgres index names against the actual schema before applying.

```


## `PATCHES/web-pack16.patch.md`

```text
Mount enterprise reporting pages in admin settings. Treat client-side filters as presentation only; authorization must be server-side.

```


## `REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { AdminDashboardRecordService } from "./adminDashboardsService.js";

export function registerAdminDashboardRecordRoutes(router: Router, service: AdminDashboardRecordService): void {
  router.get("/pack16/adminDashboards", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/adminDashboards", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsService.ts`

```text
import type { AdminDashboardRecord, AdminDashboardRecordRepository } from "./adminDashboardsTypes.js";

export class AdminDashboardRecordService {
  constructor(private readonly repository: AdminDashboardRecordRepository) {}

  create(record: AdminDashboardRecord): Promise<AdminDashboardRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AdminDashboardRecord>): Promise<AdminDashboardRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("adminDashboards-not-found");
    return updated;
  }

  list(filter: Partial<AdminDashboardRecord> = {}, limit = 50): Promise<AdminDashboardRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsTypes.ts`

```text
export interface AdminDashboardRecord {
  id: string; organizationId: string; name: string; layout: Record<string, unknown>; updatedAt: string;
}

export interface AdminDashboardRecordRepository {
  create(record: AdminDashboardRecord): Promise<AdminDashboardRecord>;
  update(id: string, patch: Partial<AdminDashboardRecord>): Promise<AdminDashboardRecord | null>;
  list(filter: Partial<AdminDashboardRecord>, limit: number): Promise<AdminDashboardRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/index.ts`

```text
export * from "./adminDashboardsTypes.js";
export * from "./adminDashboardsService.js";
export * from "./adminDashboardsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/common/enterpriseAdminAuth.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function requireEnterpriseAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("enterprise:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "enterprise_admin_required" });
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/common/pack16Route.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function pack16Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportPolicy.ts`

```text
export function csvExportAllowed(input: { role: string; rows: number }): { allowed: boolean; reason: string } {
  if (!["owner", "admin", "auditor", "billing"].includes(input.role)) return { allowed: false, reason: "role-not-allowed" };
  if (input.rows > 500000) return { allowed: false, reason: "row-limit-exceeded" };
  return { allowed: true, reason: "allowed" };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { CsvExportRecordService } from "./csvExportsService.js";

export function registerCsvExportRecordRoutes(router: Router, service: CsvExportRecordService): void {
  router.get("/pack16/csvExports", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/csvExports", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsService.ts`

```text
import type { CsvExportRecord, CsvExportRecordRepository } from "./csvExportsTypes.js";

export class CsvExportRecordService {
  constructor(private readonly repository: CsvExportRecordRepository) {}

  create(record: CsvExportRecord): Promise<CsvExportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CsvExportRecord>): Promise<CsvExportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("csvExports-not-found");
    return updated;
  }

  list(filter: Partial<CsvExportRecord> = {}, limit = 50): Promise<CsvExportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsTypes.ts`

```text
export interface CsvExportRecord {
  id: string; organizationId: string; reportRunId: string; objectKey: string; sha256: string; rows: number; createdAt: string;
}

export interface CsvExportRecordRepository {
  create(record: CsvExportRecord): Promise<CsvExportRecord>;
  update(id: string, patch: Partial<CsvExportRecord>): Promise<CsvExportRecord | null>;
  list(filter: Partial<CsvExportRecord>, limit: number): Promise<CsvExportRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/csvExports/index.ts`

```text
export * from "./csvExportsTypes.js";
export * from "./csvExportsService.js";
export * from "./csvExportsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { DepartmentRecordService } from "./departmentsService.js";

export function registerDepartmentRecordRoutes(router: Router, service: DepartmentRecordService): void {
  router.get("/pack16/departments", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/departments", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsService.ts`

```text
import type { DepartmentRecord, DepartmentRecordRepository } from "./departmentsTypes.js";

export class DepartmentRecordService {
  constructor(private readonly repository: DepartmentRecordRepository) {}

  create(record: DepartmentRecord): Promise<DepartmentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<DepartmentRecord>): Promise<DepartmentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("departments-not-found");
    return updated;
  }

  list(filter: Partial<DepartmentRecord> = {}, limit = 50): Promise<DepartmentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsTypes.ts`

```text
export interface DepartmentRecord {
  id: string; organizationId: string; path: string; name: string; parentId?: string; createdAt: string;
}

export interface DepartmentRecordRepository {
  create(record: DepartmentRecord): Promise<DepartmentRecord>;
  update(id: string, patch: Partial<DepartmentRecord>): Promise<DepartmentRecord | null>;
  list(filter: Partial<DepartmentRecord>, limit: number): Promise<DepartmentRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/departments/index.ts`

```text
export * from "./departmentsTypes.js";
export * from "./departmentsService.js";
export * from "./departmentsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { EnterpriseAuditRecordService } from "./enterpriseAuditService.js";

export function registerEnterpriseAuditRecordRoutes(router: Router, service: EnterpriseAuditRecordService): void {
  router.get("/pack16/enterpriseAudit", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/enterpriseAudit", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditService.ts`

```text
import type { EnterpriseAuditRecord, EnterpriseAuditRecordRepository } from "./enterpriseAuditTypes.js";

export class EnterpriseAuditRecordService {
  constructor(private readonly repository: EnterpriseAuditRecordRepository) {}

  create(record: EnterpriseAuditRecord): Promise<EnterpriseAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<EnterpriseAuditRecord>): Promise<EnterpriseAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("enterpriseAudit-not-found");
    return updated;
  }

  list(filter: Partial<EnterpriseAuditRecord> = {}, limit = 50): Promise<EnterpriseAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditTypes.ts`

```text
export interface EnterpriseAuditRecord {
  id: string; organizationId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface EnterpriseAuditRecordRepository {
  create(record: EnterpriseAuditRecord): Promise<EnterpriseAuditRecord>;
  update(id: string, patch: Partial<EnterpriseAuditRecord>): Promise<EnterpriseAuditRecord | null>;
  list(filter: Partial<EnterpriseAuditRecord>, limit: number): Promise<EnterpriseAuditRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/index.ts`

```text
export * from "./enterpriseAuditTypes.js";
export * from "./enterpriseAuditService.js";
export * from "./enterpriseAuditRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/index.ts`

```text
export * from "./common/pack16Route.js";
export * from "./common/enterpriseAdminAuth.js";
export * from "./roleAssignments/roleAssignmentPolicy.js";
export * from "./reportRuns/reportRunPolicy.js";
export * from "./csvExports/csvExportPolicy.js";
export * from "./scimDirectoryEvents/scimEventPolicy.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/index.ts`

```text
export * from "./orgMembersTypes.js";
export * from "./orgMembersService.js";
export * from "./orgMembersRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { OrgMemberRecordService } from "./orgMembersService.js";

export function registerOrgMemberRecordRoutes(router: Router, service: OrgMemberRecordService): void {
  router.get("/pack16/orgMembers", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/orgMembers", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersService.ts`

```text
import type { OrgMemberRecord, OrgMemberRecordRepository } from "./orgMembersTypes.js";

export class OrgMemberRecordService {
  constructor(private readonly repository: OrgMemberRecordRepository) {}

  create(record: OrgMemberRecord): Promise<OrgMemberRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OrgMemberRecord>): Promise<OrgMemberRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("orgMembers-not-found");
    return updated;
  }

  list(filter: Partial<OrgMemberRecord> = {}, limit = 50): Promise<OrgMemberRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersTypes.ts`

```text
export interface OrgMemberRecord {
  id: string; organizationId: string; userId: string; role: string; departmentId?: string; createdAt: string;
}

export interface OrgMemberRecordRepository {
  create(record: OrgMemberRecord): Promise<OrgMemberRecord>;
  update(id: string, patch: Partial<OrgMemberRecord>): Promise<OrgMemberRecord | null>;
  list(filter: Partial<OrgMemberRecord>, limit: number): Promise<OrgMemberRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/organizations/index.ts`

```text
export * from "./organizationsTypes.js";
export * from "./organizationsService.js";
export * from "./organizationsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { OrganizationRecordService } from "./organizationsService.js";

export function registerOrganizationRecordRoutes(router: Router, service: OrganizationRecordService): void {
  router.get("/pack16/organizations", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/organizations", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsService.ts`

```text
import type { OrganizationRecord, OrganizationRecordRepository } from "./organizationsTypes.js";

export class OrganizationRecordService {
  constructor(private readonly repository: OrganizationRecordRepository) {}

  create(record: OrganizationRecord): Promise<OrganizationRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OrganizationRecord>): Promise<OrganizationRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("organizations-not-found");
    return updated;
  }

  list(filter: Partial<OrganizationRecord> = {}, limit = 50): Promise<OrganizationRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsTypes.ts`

```text
export interface OrganizationRecord {
  id: string; name: string; slug: string; plan: string; createdAt: string;
}

export interface OrganizationRecordRepository {
  create(record: OrganizationRecord): Promise<OrganizationRecord>;
  update(id: string, patch: Partial<OrganizationRecord>): Promise<OrganizationRecord | null>;
  list(filter: Partial<OrganizationRecord>, limit: number): Promise<OrganizationRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/index.ts`

```text
export * from "./reportDefinitionsTypes.js";
export * from "./reportDefinitionsService.js";
export * from "./reportDefinitionsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { ReportDefinitionRecordService } from "./reportDefinitionsService.js";

export function registerReportDefinitionRecordRoutes(router: Router, service: ReportDefinitionRecordService): void {
  router.get("/pack16/reportDefinitions", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/reportDefinitions", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsService.ts`

```text
import type { ReportDefinitionRecord, ReportDefinitionRecordRepository } from "./reportDefinitionsTypes.js";

export class ReportDefinitionRecordService {
  constructor(private readonly repository: ReportDefinitionRecordRepository) {}

  create(record: ReportDefinitionRecord): Promise<ReportDefinitionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ReportDefinitionRecord>): Promise<ReportDefinitionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("reportDefinitions-not-found");
    return updated;
  }

  list(filter: Partial<ReportDefinitionRecord> = {}, limit = 50): Promise<ReportDefinitionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsTypes.ts`

```text
export interface ReportDefinitionRecord {
  id: string; organizationId: string; key: string; title: string; fields: string[]; createdAt: string;
}

export interface ReportDefinitionRecordRepository {
  create(record: ReportDefinitionRecord): Promise<ReportDefinitionRecord>;
  update(id: string, patch: Partial<ReportDefinitionRecord>): Promise<ReportDefinitionRecord | null>;
  list(filter: Partial<ReportDefinitionRecord>, limit: number): Promise<ReportDefinitionRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/index.ts`

```text
export * from "./reportRunsTypes.js";
export * from "./reportRunsService.js";
export * from "./reportRunsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunPolicy.ts`

```text
export function reportRunAllowed(input: { role: string; reportKey: string }): boolean {
  if (input.reportKey.includes("billing")) return ["owner", "admin", "billing", "auditor"].includes(input.role);
  if (input.reportKey.includes("audit")) return ["owner", "admin", "auditor"].includes(input.role);
  return ["owner", "admin", "support", "auditor"].includes(input.role);
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { ReportRunRecordService } from "./reportRunsService.js";

export function registerReportRunRecordRoutes(router: Router, service: ReportRunRecordService): void {
  router.get("/pack16/reportRuns", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/reportRuns", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsService.ts`

```text
import type { ReportRunRecord, ReportRunRecordRepository } from "./reportRunsTypes.js";

export class ReportRunRecordService {
  constructor(private readonly repository: ReportRunRecordRepository) {}

  create(record: ReportRunRecord): Promise<ReportRunRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ReportRunRecord>): Promise<ReportRunRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("reportRuns-not-found");
    return updated;
  }

  list(filter: Partial<ReportRunRecord> = {}, limit = 50): Promise<ReportRunRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsTypes.ts`

```text
export interface ReportRunRecord {
  id: string; organizationId: string; reportKey: string; status: 'queued' | 'running' | 'completed' | 'failed'; objectKey?: string; createdAt: string;
}

export interface ReportRunRecordRepository {
  create(record: ReportRunRecord): Promise<ReportRunRecord>;
  update(id: string, patch: Partial<ReportRunRecord>): Promise<ReportRunRecord | null>;
  list(filter: Partial<ReportRunRecord>, limit: number): Promise<ReportRunRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/index.ts`

```text
export * from "./roleAssignmentsTypes.js";
export * from "./roleAssignmentsService.js";
export * from "./roleAssignmentsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentPolicy.ts`

```text
const ROLE_RANK: Record<string, number> = { owner: 100, admin: 80, support: 60, billing: 55, auditor: 50, member: 20, viewer: 10 };

export function roleAssignmentAllowed(assignerRole: string, targetRole: string): boolean {
  if (assignerRole === "owner") return true;
  if (assignerRole === "admin") return (ROLE_RANK[targetRole] ?? 0) < ROLE_RANK.admin;
  return false;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { RoleAssignmentRecordService } from "./roleAssignmentsService.js";

export function registerRoleAssignmentRecordRoutes(router: Router, service: RoleAssignmentRecordService): void {
  router.get("/pack16/roleAssignments", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/roleAssignments", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsService.ts`

```text
import type { RoleAssignmentRecord, RoleAssignmentRecordRepository } from "./roleAssignmentsTypes.js";

export class RoleAssignmentRecordService {
  constructor(private readonly repository: RoleAssignmentRecordRepository) {}

  create(record: RoleAssignmentRecord): Promise<RoleAssignmentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<RoleAssignmentRecord>): Promise<RoleAssignmentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("roleAssignments-not-found");
    return updated;
  }

  list(filter: Partial<RoleAssignmentRecord> = {}, limit = 50): Promise<RoleAssignmentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsTypes.ts`

```text
export interface RoleAssignmentRecord {
  id: string; organizationId: string; subjectUserId: string; role: string; assignedByUserId: string; assignedAt: string;
}

export interface RoleAssignmentRecordRepository {
  create(record: RoleAssignmentRecord): Promise<RoleAssignmentRecord>;
  update(id: string, patch: Partial<RoleAssignmentRecord>): Promise<RoleAssignmentRecord | null>;
  list(filter: Partial<RoleAssignmentRecord>, limit: number): Promise<RoleAssignmentRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/index.ts`

```text
export * from "./samlGroupMappingsTypes.js";
export * from "./samlGroupMappingsService.js";
export * from "./samlGroupMappingsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { SamlGroupMappingRecordService } from "./samlGroupMappingsService.js";

export function registerSamlGroupMappingRecordRoutes(router: Router, service: SamlGroupMappingRecordService): void {
  router.get("/pack16/samlGroupMappings", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/samlGroupMappings", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsService.ts`

```text
import type { SamlGroupMappingRecord, SamlGroupMappingRecordRepository } from "./samlGroupMappingsTypes.js";

export class SamlGroupMappingRecordService {
  constructor(private readonly repository: SamlGroupMappingRecordRepository) {}

  create(record: SamlGroupMappingRecord): Promise<SamlGroupMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SamlGroupMappingRecord>): Promise<SamlGroupMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("samlGroupMappings-not-found");
    return updated;
  }

  list(filter: Partial<SamlGroupMappingRecord> = {}, limit = 50): Promise<SamlGroupMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsTypes.ts`

```text
export interface SamlGroupMappingRecord {
  id: string; organizationId: string; groupName: string; orgRole: string; departmentPath?: string; updatedAt: string;
}

export interface SamlGroupMappingRecordRepository {
  create(record: SamlGroupMappingRecord): Promise<SamlGroupMappingRecord>;
  update(id: string, patch: Partial<SamlGroupMappingRecord>): Promise<SamlGroupMappingRecord | null>;
  list(filter: Partial<SamlGroupMappingRecord>, limit: number): Promise<SamlGroupMappingRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/index.ts`

```text
export * from "./scheduledReportsTypes.js";
export * from "./scheduledReportsService.js";
export * from "./scheduledReportsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { ScheduledReportRecordService } from "./scheduledReportsService.js";

export function registerScheduledReportRecordRoutes(router: Router, service: ScheduledReportRecordService): void {
  router.get("/pack16/scheduledReports", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/scheduledReports", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsService.ts`

```text
import type { ScheduledReportRecord, ScheduledReportRecordRepository } from "./scheduledReportsTypes.js";

export class ScheduledReportRecordService {
  constructor(private readonly repository: ScheduledReportRecordRepository) {}

  create(record: ScheduledReportRecord): Promise<ScheduledReportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ScheduledReportRecord>): Promise<ScheduledReportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("scheduledReports-not-found");
    return updated;
  }

  list(filter: Partial<ScheduledReportRecord> = {}, limit = 50): Promise<ScheduledReportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsTypes.ts`

```text
export interface ScheduledReportRecord {
  id: string; organizationId: string; reportKey: string; cadence: 'daily' | 'weekly' | 'monthly'; nextRunAt: string; enabled: boolean;
}

export interface ScheduledReportRecordRepository {
  create(record: ScheduledReportRecord): Promise<ScheduledReportRecord>;
  update(id: string, patch: Partial<ScheduledReportRecord>): Promise<ScheduledReportRecord | null>;
  list(filter: Partial<ScheduledReportRecord>, limit: number): Promise<ScheduledReportRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/index.ts`

```text
export * from "./scimDirectoryEventsTypes.js";
export * from "./scimDirectoryEventsService.js";
export * from "./scimDirectoryEventsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsRoutes.ts`

```text
import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { ScimDirectoryEventRecordService } from "./scimDirectoryEventsService.js";

export function registerScimDirectoryEventRecordRoutes(router: Router, service: ScimDirectoryEventRecordService): void {
  router.get("/pack16/scimDirectoryEvents", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/scimDirectoryEvents", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsService.ts`

```text
import type { ScimDirectoryEventRecord, ScimDirectoryEventRecordRepository } from "./scimDirectoryEventsTypes.js";

export class ScimDirectoryEventRecordService {
  constructor(private readonly repository: ScimDirectoryEventRecordRepository) {}

  create(record: ScimDirectoryEventRecord): Promise<ScimDirectoryEventRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ScimDirectoryEventRecord>): Promise<ScimDirectoryEventRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("scimDirectoryEvents-not-found");
    return updated;
  }

  list(filter: Partial<ScimDirectoryEventRecord> = {}, limit = 50): Promise<ScimDirectoryEventRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsTypes.ts`

```text
export interface ScimDirectoryEventRecord {
  id: string; organizationId: string; externalId: string; action: 'created' | 'updated' | 'deactivated'; processedAt: string;
}

export interface ScimDirectoryEventRecordRepository {
  create(record: ScimDirectoryEventRecord): Promise<ScimDirectoryEventRecord>;
  update(id: string, patch: Partial<ScimDirectoryEventRecord>): Promise<ScimDirectoryEventRecord | null>;
  list(filter: Partial<ScimDirectoryEventRecord>, limit: number): Promise<ScimDirectoryEventRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimEventPolicy.ts`

```text
export function scimEventAllowed(action: string): boolean {
  return ["created", "updated", "deactivated"].includes(action);
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack16/departmentSwitcher.tsx`

```text
import React from "react";

export function DepartmentSwitcher(props: { departments: Array<{ id: string; path: string }>; selectedId?: string; onChange: (id: string) => void }): JSX.Element {
  return (
    <label>
      Department
      <select value={props.selectedId ?? ""} onChange={(event) => props.onChange(event.currentTarget.value)}>
        {props.departments.map((department) => <option key={department.id} value={department.id}>{department.path}</option>)}
      </select>
    </label>
  );
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack16/enterpriseContextBanner.tsx`

```text
import React from "react";

export function EnterpriseContextBanner(props: { organizationName: string; departmentPath?: string; role: string }): JSX.Element {
  return (
    <aside role="status">
      <strong>{props.organizationName}</strong>
      <span>{props.departmentPath ? ` · ${props.departmentPath}` : ""} · {props.role}</span>
    </aside>
  );
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack16/index.ts`

```text
export * from "./enterpriseContextBanner.js";
export * from "./reportExportStatus.js";
export * from "./orgRoleGuard.js";
export * from "./departmentSwitcher.js";

```


## `REVIEW_REQUIRED/apps/desktop/src/pack16/orgRoleGuard.ts`

```text
export function desktopRoleCanViewEnterpriseSettings(role: string): boolean {
  return ["owner", "admin", "auditor"].includes(role);
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack16/reportExportStatus.tsx`

```text
import React from "react";

export function ReportExportStatus(props: { status: "queued" | "running" | "completed" | "failed"; rows?: number }): JSX.Element {
  return <span data-report-status={props.status}>Report export: {props.status}{typeof props.rows === "number" ? ` · ${props.rows} rows` : ""}</span>;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack16/components/AdminDashboardsPage.tsx`

```text
import React from "react";

export interface AdminDashboardsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AdminDashboardsPage(props: { rows: AdminDashboardsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Admin dashboards</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/CsvExportsPage.tsx`

```text
import React from "react";

export interface CsvExportsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function CsvExportsPage(props: { rows: CsvExportsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>CSV exports</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/DepartmentsPage.tsx`

```text
import React from "react";

export interface DepartmentsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function DepartmentsPage(props: { rows: DepartmentsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Departments</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/EnterpriseAuditPage.tsx`

```text
import React from "react";

export interface EnterpriseAuditPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function EnterpriseAuditPage(props: { rows: EnterpriseAuditPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Enterprise audit</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/OrgMembersPage.tsx`

```text
import React from "react";

export interface OrgMembersPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function OrgMembersPage(props: { rows: OrgMembersPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Organization members</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/OrganizationsPage.tsx`

```text
import React from "react";

export interface OrganizationsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function OrganizationsPage(props: { rows: OrganizationsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Organizations</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/ReportDefinitionsPage.tsx`

```text
import React from "react";

export interface ReportDefinitionsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ReportDefinitionsPage(props: { rows: ReportDefinitionsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Report definitions</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/ReportRunsPage.tsx`

```text
import React from "react";

export interface ReportRunsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ReportRunsPage(props: { rows: ReportRunsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Report runs</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/RoleAssignmentsPage.tsx`

```text
import React from "react";

export interface RoleAssignmentsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function RoleAssignmentsPage(props: { rows: RoleAssignmentsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Role assignments</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/SamlGroupMappingsPage.tsx`

```text
import React from "react";

export interface SamlGroupMappingsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function SamlGroupMappingsPage(props: { rows: SamlGroupMappingsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>SAML group mappings</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/ScheduledReportsPage.tsx`

```text
import React from "react";

export interface ScheduledReportsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ScheduledReportsPage(props: { rows: ScheduledReportsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Scheduled reports</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/components/ScimDirectoryEventsPage.tsx`

```text
import React from "react";

export interface ScimDirectoryEventsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ScimDirectoryEventsPage(props: { rows: ScimDirectoryEventsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>SCIM directory events</h1>
      {props.rows.length === 0 ? <p>No enterprise records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useAdminDashboards.ts`

```text
import { useEffect, useState } from "react";

export interface useAdminDashboardsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAdminDashboards<T>(loader: () => Promise<T>): useAdminDashboardsResult<T> {
  const [state, setState] = useState<useAdminDashboardsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useCsvExports.ts`

```text
import { useEffect, useState } from "react";

export interface useCsvExportsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useCsvExports<T>(loader: () => Promise<T>): useCsvExportsResult<T> {
  const [state, setState] = useState<useCsvExportsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useDepartments.ts`

```text
import { useEffect, useState } from "react";

export interface useDepartmentsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useDepartments<T>(loader: () => Promise<T>): useDepartmentsResult<T> {
  const [state, setState] = useState<useDepartmentsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useEnterpriseAudit.ts`

```text
import { useEffect, useState } from "react";

export interface useEnterpriseAuditResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useEnterpriseAudit<T>(loader: () => Promise<T>): useEnterpriseAuditResult<T> {
  const [state, setState] = useState<useEnterpriseAuditResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useOrgMembers.ts`

```text
import { useEffect, useState } from "react";

export interface useOrgMembersResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useOrgMembers<T>(loader: () => Promise<T>): useOrgMembersResult<T> {
  const [state, setState] = useState<useOrgMembersResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useOrganizations.ts`

```text
import { useEffect, useState } from "react";

export interface useOrganizationsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useOrganizations<T>(loader: () => Promise<T>): useOrganizationsResult<T> {
  const [state, setState] = useState<useOrganizationsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useReportDefinitions.ts`

```text
import { useEffect, useState } from "react";

export interface useReportDefinitionsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useReportDefinitions<T>(loader: () => Promise<T>): useReportDefinitionsResult<T> {
  const [state, setState] = useState<useReportDefinitionsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useReportRuns.ts`

```text
import { useEffect, useState } from "react";

export interface useReportRunsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useReportRuns<T>(loader: () => Promise<T>): useReportRunsResult<T> {
  const [state, setState] = useState<useReportRunsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useRoleAssignments.ts`

```text
import { useEffect, useState } from "react";

export interface useRoleAssignmentsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useRoleAssignments<T>(loader: () => Promise<T>): useRoleAssignmentsResult<T> {
  const [state, setState] = useState<useRoleAssignmentsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useSamlGroupMappings.ts`

```text
import { useEffect, useState } from "react";

export interface useSamlGroupMappingsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useSamlGroupMappings<T>(loader: () => Promise<T>): useSamlGroupMappingsResult<T> {
  const [state, setState] = useState<useSamlGroupMappingsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useScheduledReports.ts`

```text
import { useEffect, useState } from "react";

export interface useScheduledReportsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useScheduledReports<T>(loader: () => Promise<T>): useScheduledReportsResult<T> {
  const [state, setState] = useState<useScheduledReportsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/hooks/useScimDirectoryEvents.ts`

```text
import { useEffect, useState } from "react";

export interface useScimDirectoryEventsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useScimDirectoryEvents<T>(loader: () => Promise<T>): useScimDirectoryEventsResult<T> {
  const [state, setState] = useState<useScimDirectoryEventsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack16/index.ts`

```text
export * from "./components/OrganizationsPage.js";
export * from "./components/DepartmentsPage.js";
export * from "./components/OrgMembersPage.js";
export * from "./components/RoleAssignmentsPage.js";
export * from "./components/SamlGroupMappingsPage.js";
export * from "./components/ScimDirectoryEventsPage.js";
export * from "./components/ReportDefinitionsPage.js";
export * from "./components/ScheduledReportsPage.js";
export * from "./components/ReportRunsPage.js";
export * from "./components/CsvExportsPage.js";
export * from "./components/AdminDashboardsPage.js";
export * from "./components/EnterpriseAuditPage.js";
export * from "./hooks/useOrganizations.js";
export * from "./hooks/useDepartments.js";
export * from "./hooks/useOrgMembers.js";
export * from "./hooks/useRoleAssignments.js";
export * from "./hooks/useSamlGroupMappings.js";
export * from "./hooks/useScimDirectoryEvents.js";
export * from "./hooks/useReportDefinitions.js";
export * from "./hooks/useScheduledReports.js";
export * from "./hooks/useReportRuns.js";
export * from "./hooks/useCsvExports.js";
export * from "./hooks/useAdminDashboards.js";
export * from "./hooks/useEnterpriseAudit.js";

```


## `SAFE_DIRECT_COPY/docs/pack16/01-merge-guide.md`

```text
Pack 16 adds enterprise org management, departments, role assignments, SAML group mappings, SCIM directory events, reporting definitions, scheduled reports, CSV exports, admin dashboards and enterprise audit.

```


## `SAFE_DIRECT_COPY/docs/pack16/02-rbac.md`

```text
RBAC is hierarchical. Owners can assign all roles; admins cannot assign owner/admin-equivalent roles above themselves.

```


## `SAFE_DIRECT_COPY/docs/pack16/03-saml-scim.md`

```text
SAML group mappings and SCIM events must be team/organization scoped. Do not accept SCIM patches to password, token or secret fields.

```


## `SAFE_DIRECT_COPY/docs/pack16/04-reporting.md`

```text
Report runs must validate date range, role and report type. Export large reports asynchronously with object storage checksums.

```


## `SAFE_DIRECT_COPY/docs/pack16/05-csv-safety.md`

```text
CSV exports escape formula-like cells to reduce spreadsheet injection risk.

```


## `SAFE_DIRECT_COPY/docs/pack16/06-admin-dashboard.md`

```text
Admin dashboards should be server-filtered by organization and role; client-side filters are not authorization.

```


## `SAFE_DIRECT_COPY/docs/pack16/07-qa-checklist.md`

```text
Verify RBAC, department hierarchy, SAML mapping, SCIM event filtering, report permissions, CSV escaping, scheduled report cadence and enterprise audit.

```


## `SAFE_DIRECT_COPY/infra/pack16/postgres-enterprise-indexes.sql`

```text
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_members_org_user ON org_members(organization_id, user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_departments_org_path ON departments(organization_id, path);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_report_runs_org_key_created ON report_runs(organization_id, report_key, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enterprise_audit_org_occurred ON enterprise_audit(organization_id, occurred_at DESC);

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/csvExportSafety.ts`

```text
const CSV_INJECTION = /^[=+\-@]/;

export function escapeCsvCell(value: unknown): string {
  const raw = String(value ?? "");
  const safe = CSV_INJECTION.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function buildCsvRow(values: readonly unknown[]): string {
  return values.map(escapeCsvCell).join(",");
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/departmentPath.ts`

```text
export function normalizeDepartmentPath(path: string): string {
  return path.split("/").map((part) => part.trim()).filter(Boolean).join("/").slice(0, 180);
}

export function isChildDepartment(parentPath: string, childPath: string): boolean {
  const parent = normalizeDepartmentPath(parentPath);
  const child = normalizeDepartmentPath(childPath);
  return child !== parent && child.startsWith(`${parent}/`);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/index.ts`

```text
export * from "./orgRole.js";
export * from "./departmentPath.js";
export * from "./reportDateRange.js";
export * from "./csvExportSafety.js";
export * from "./samlGroupMapping.js";
export * from "./scimPatchSafety.js";
export * from "./scheduledReport.js";
export * from "./reportRedaction.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/orgRole.ts`

```text
export type OrgRole = "owner" | "admin" | "support" | "billing" | "auditor" | "member" | "viewer";

export function orgRoleRank(role: OrgRole): number {
  return { owner: 100, admin: 80, support: 60, billing: 55, auditor: 50, member: 20, viewer: 10 }[role];
}

export function canAssignOrgRole(assigner: OrgRole, target: OrgRole): boolean {
  if (assigner === "owner") return true;
  if (assigner === "admin") return orgRoleRank(target) < orgRoleRank("admin");
  return false;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/reportDateRange.ts`

```text
export interface ReportDateRange {
  startsAt: string;
  endsAt: string;
}

export function validateReportDateRange(range: ReportDateRange): string[] {
  const errors: string[] = [];
  const starts = new Date(range.startsAt).getTime();
  const ends = new Date(range.endsAt).getTime();
  if (!Number.isFinite(starts) || !Number.isFinite(ends)) errors.push("invalid-date");
  if (starts >= ends) errors.push("start-after-end");
  if (ends - starts > 366 * 24 * 60 * 60 * 1000) errors.push("range-too-large");
  return errors;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/reportRedaction.ts`

```text
export type ReportFieldClass = "public" | "internal" | "confidential" | "restricted";

export function shouldRedactReportField(role: string, fieldClass: ReportFieldClass): boolean {
  if (fieldClass === "public") return false;
  if (fieldClass === "internal") return !["owner", "admin", "auditor", "support"].includes(role);
  if (fieldClass === "confidential") return !["owner", "admin", "auditor"].includes(role);
  return role !== "owner";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/samlGroupMapping.ts`

```text
export interface SamlGroupMapping {
  groupName: string;
  orgRole: string;
  departmentPath?: string;
}

export function findSamlGroupMapping(mappings: readonly SamlGroupMapping[], groups: readonly string[]): SamlGroupMapping | undefined {
  const groupSet = new Set(groups.map((group) => group.toLowerCase()));
  return mappings.find((mapping) => groupSet.has(mapping.groupName.toLowerCase()));
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/scheduledReport.ts`

```text
export type ScheduledReportCadence = "daily" | "weekly" | "monthly";

export function nextScheduledReportAt(cadence: ScheduledReportCadence, from = new Date()): Date {
  const next = new Date(from);
  if (cadence === "daily") next.setUTCDate(next.getUTCDate() + 1);
  if (cadence === "weekly") next.setUTCDate(next.getUTCDate() + 7);
  if (cadence === "monthly") next.setUTCMonth(next.getUTCMonth() + 1);
  next.setUTCHours(8, 0, 0, 0);
  return next;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack16/scimPatchSafety.ts`

```text
export interface ScimPatchOp {
  op: "add" | "replace" | "remove";
  path?: string;
  value?: unknown;
}

export function scimPatchIsAllowed(op: ScimPatchOp): boolean {
  if (op.path && /password|token|secret/i.test(op.path)) return false;
  return ["add", "replace", "remove"].includes(op.op);
}

```


## `SAFE_DIRECT_COPY/scripts/pack16/check-report-safety.mjs`

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
      if (/rawPassword|rawToken|rawSecret|unescapedCsv/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("Report safety scanner findings:", bad); process.exit(1); }
console.log("Report safety scanner passed.");

```


## `SAFE_DIRECT_COPY/tests/pack16/csvExportPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { csvExportAllowed } from "../../REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportPolicy.js"; assert.equal(csvExportAllowed({ role: "viewer", rows: 10 }).allowed, false);

```


## `SAFE_DIRECT_COPY/tests/pack16/csvExportSafety.test.ts`

```text
import assert from "node:assert/strict"; import { escapeCsvCell } from "../../packages/shared/src/pack16/csvExportSafety.js"; assert.equal(escapeCsvCell("=1+1"), "\"'=1+1\"");

```


## `SAFE_DIRECT_COPY/tests/pack16/departmentPath.test.ts`

```text
import assert from "node:assert/strict"; import { normalizeDepartmentPath, isChildDepartment } from "../../packages/shared/src/pack16/departmentPath.js"; assert.equal(normalizeDepartmentPath(" Sales / EU "), "Sales/EU"); assert.equal(isChildDepartment("Sales", "Sales/EU"), true);

```


## `SAFE_DIRECT_COPY/tests/pack16/orgRole.test.ts`

```text
import assert from "node:assert/strict"; import { canAssignOrgRole } from "../../packages/shared/src/pack16/orgRole.js"; assert.equal(canAssignOrgRole("admin", "owner"), false); assert.equal(canAssignOrgRole("owner", "admin"), true);

```


## `SAFE_DIRECT_COPY/tests/pack16/orgRoleGuard.test.ts`

```text
import assert from "node:assert/strict"; import { desktopRoleCanViewEnterpriseSettings } from "../../REVIEW_REQUIRED/apps/desktop/src/pack16/orgRoleGuard.js"; assert.equal(desktopRoleCanViewEnterpriseSettings("auditor"), true); assert.equal(desktopRoleCanViewEnterpriseSettings("member"), false);

```


## `SAFE_DIRECT_COPY/tests/pack16/reportDateRange.test.ts`

```text
import assert from "node:assert/strict"; import { validateReportDateRange } from "../../packages/shared/src/pack16/reportDateRange.js"; assert.deepEqual(validateReportDateRange({ startsAt: "2026-01-01T00:00:00Z", endsAt: "2026-01-02T00:00:00Z" }), []);

```


## `SAFE_DIRECT_COPY/tests/pack16/roleAssignmentPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { roleAssignmentAllowed } from "../../REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentPolicy.js"; assert.equal(roleAssignmentAllowed("admin", "member"), true); assert.equal(roleAssignmentAllowed("member", "viewer"), false);

```


## `SAFE_DIRECT_COPY/tests/pack16/samlGroupMapping.test.ts`

```text
import assert from "node:assert/strict"; import { findSamlGroupMapping } from "../../packages/shared/src/pack16/samlGroupMapping.js"; assert.equal(findSamlGroupMapping([{ groupName: "Admins", orgRole: "admin" }], ["admins"])?.orgRole, "admin");

```


## `SAFE_DIRECT_COPY/tests/pack16/scimPatchSafety.test.ts`

```text
import assert from "node:assert/strict"; import { scimPatchIsAllowed } from "../../packages/shared/src/pack16/scimPatchSafety.js"; assert.equal(scimPatchIsAllowed({ op: "replace", path: "password" }), false);

```


## `generated-remotedesk-enterprise-reporting-pack-16-code-review.md`

```text
Review RBAC hierarchy, organization-scoped repository filters, SCIM patch safety, SAML group mapping precedence, CSV injection escaping, report permissions and object storage checksum flow.

```


## `generated-remotedesk-enterprise-reporting-pack-16-manifest.json`

```text
{
  "name": "generated-remotedesk-enterprise-reporting-pack-16",
  "createdAt": "2026-06-15T06:59:06.311756+00:00",
  "actualFileCount": 123,
  "safeDirectCopyCount": 27,
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
    "infra": 1
  },
  "safeDirectCopy": [
    "SAFE_DIRECT_COPY/docs/pack16/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack16/02-rbac.md",
    "SAFE_DIRECT_COPY/docs/pack16/03-saml-scim.md",
    "SAFE_DIRECT_COPY/docs/pack16/04-reporting.md",
    "SAFE_DIRECT_COPY/docs/pack16/05-csv-safety.md",
    "SAFE_DIRECT_COPY/docs/pack16/06-admin-dashboard.md",
    "SAFE_DIRECT_COPY/docs/pack16/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack16/postgres-enterprise-indexes.sql",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/csvExportSafety.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/departmentPath.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/orgRole.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/reportDateRange.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/reportRedaction.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/samlGroupMapping.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/scheduledReport.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack16/scimPatchSafety.ts",
    "SAFE_DIRECT_COPY/scripts/pack16/check-report-safety.mjs",
    "SAFE_DIRECT_COPY/tests/pack16/csvExportPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack16/csvExportSafety.test.ts",
    "SAFE_DIRECT_COPY/tests/pack16/departmentPath.test.ts",
    "SAFE_DIRECT_COPY/tests/pack16/orgRole.test.ts",
    "SAFE_DIRECT_COPY/tests/pack16/orgRoleGuard.test.ts",
    "SAFE_DIRECT_COPY/tests/pack16/reportDateRange.test.ts",
    "SAFE_DIRECT_COPY/tests/pack16/roleAssignmentPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack16/samlGroupMapping.test.ts",
    "SAFE_DIRECT_COPY/tests/pack16/scimPatchSafety.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/adminDashboardsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/adminDashboards/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/common/enterpriseAdminAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/common/pack16Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/csvExports/csvExportsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/csvExports/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/departments/departmentsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/departments/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/enterpriseAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/enterpriseAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/orgMembers/orgMembersTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/organizations/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/organizations/organizationsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportDefinitions/reportDefinitionsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/reportRuns/reportRunsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/roleAssignments/roleAssignmentsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/samlGroupMappings/samlGroupMappingsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scheduledReports/scheduledReportsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimDirectoryEventsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack16/scimDirectoryEvents/scimEventPolicy.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack16/departmentSwitcher.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack16/enterpriseContextBanner.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack16/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack16/orgRoleGuard.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack16/reportExportStatus.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/AdminDashboardsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/CsvExportsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/DepartmentsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/EnterpriseAuditPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/OrgMembersPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/OrganizationsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/ReportDefinitionsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/ReportRunsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/RoleAssignmentsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/SamlGroupMappingsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/ScheduledReportsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/components/ScimDirectoryEventsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useAdminDashboards.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useCsvExports.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useDepartments.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useEnterpriseAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useOrgMembers.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useOrganizations.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useReportDefinitions.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useReportRuns.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useRoleAssignments.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useSamlGroupMappings.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useScheduledReports.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/hooks/useScimDirectoryEvents.ts",
    "REVIEW_REQUIRED/apps/web/src/pack16/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack16.patch.md",
    "PATCHES/desktop-pack16.patch.md",
    "PATCHES/ops-pack16.patch.md",
    "PATCHES/web-pack16.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Organization scope must be enforced server-side.",
    "Large CSV exports need object storage integration.",
    "SCIM/SAML integrations need existing identity provider plumbing.",
    "No remote input, remote shell or unattended access features are included."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 91-97% with prior packs after repository wiring and enterprise QA"
}
```


## `generated-remotedesk-enterprise-reporting-pack-16-merge-summary.md`

```text
Pack 16 adds enterprise org management, departments, RBAC, SAML group mappings, SCIM directory events, report definitions, scheduled reports, report runs, CSV exports, admin dashboards, enterprise audit, web pages, desktop enterprise UI, docs/tests/scripts.

```


## `generated-remotedesk-enterprise-reporting-pack-16-risk-register.md`

```text
| Risk | Severity | Mitigation |\n| --- | --- | --- |\n| Cross-org data leak | Critical | organization-scoped repositories |\n| Role escalation | Critical | role assignment policy |\n| CSV injection | High | escape formula cells |\n| SCIM unsafe patch | High | block password/token/secret paths |\n| Oversized report | Medium | async export and row limits |

```


## `generated-remotedesk-enterprise-reporting-pack-16-test-plan.md`

```text
Run Pack 16 shared/API/desktop tests, report safety scanner, then manual QA for RBAC, departments, SAML/SCIM mappings, report permissions, CSV exports, scheduled reports and enterprise dashboards.

```
