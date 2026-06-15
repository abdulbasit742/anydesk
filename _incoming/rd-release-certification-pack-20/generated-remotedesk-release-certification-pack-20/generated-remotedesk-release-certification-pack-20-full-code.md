# generated-remotedesk-release-certification-pack-20 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack20.patch.md
PATCHES/desktop-pack20.patch.md
PATCHES/ops-pack20.patch.md
PATCHES/web-pack20.patch.md
REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksService.ts
REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/common/pack20Route.ts
REVIEW_REQUIRED/apps/api/src/pack20/common/releaseAdminAuth.ts
REVIEW_REQUIRED/apps/api/src/pack20/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsService.ts
REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsService.ts
REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsService.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatePolicy.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesService.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceService.ts
REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsService.ts
REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlanPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansService.ts
REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsService.ts
REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksService.ts
REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/index.ts
REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsService.ts
REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityPolicy.ts
REVIEW_REQUIRED/apps/desktop/src/pack20/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack20/installerTrustPanel.tsx
REVIEW_REQUIRED/apps/desktop/src/pack20/releaseChannelBadge.tsx
REVIEW_REQUIRED/apps/desktop/src/pack20/releaseNotesPanel.tsx
REVIEW_REQUIRED/apps/desktop/src/pack20/updateReadinessStore.ts
REVIEW_REQUIRED/apps/web/src/pack20/components/CertificationChecksPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/InstallerArtifactsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/LaunchSignoffsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseApprovalsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseAuditPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseCandidatesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseEvidencePage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/RollbackRecordsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/RolloutPlansPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/SbomReportsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/SupportReadinessPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/components/VulnerabilityFindingsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useCertificationChecks.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useInstallerArtifacts.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useLaunchSignoffs.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseApprovals.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseAudit.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseCandidates.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseEvidence.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useRollbackRecords.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useRolloutPlans.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useSbomReports.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useSupportReadiness.ts
REVIEW_REQUIRED/apps/web/src/pack20/hooks/useVulnerabilityFindings.ts
REVIEW_REQUIRED/apps/web/src/pack20/index.ts
SAFE_DIRECT_COPY/docs/pack20/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack20/02-certification-gates.md
SAFE_DIRECT_COPY/docs/pack20/03-installer-signing.md
SAFE_DIRECT_COPY/docs/pack20/04-sbom-vulnerabilities.md
SAFE_DIRECT_COPY/docs/pack20/05-rollout-rollback.md
SAFE_DIRECT_COPY/docs/pack20/06-support-readiness.md
SAFE_DIRECT_COPY/docs/pack20/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack20/prometheus-release-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack20/certificationGate.ts
SAFE_DIRECT_COPY/packages/shared/src/pack20/evidenceHash.ts
SAFE_DIRECT_COPY/packages/shared/src/pack20/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack20/installerSignature.ts
SAFE_DIRECT_COPY/packages/shared/src/pack20/releaseChannel.ts
SAFE_DIRECT_COPY/packages/shared/src/pack20/rollbackWindow.ts
SAFE_DIRECT_COPY/packages/shared/src/pack20/sbomPolicy.ts
SAFE_DIRECT_COPY/packages/shared/src/pack20/supportReadiness.ts
SAFE_DIRECT_COPY/packages/shared/src/pack20/versionPolicy.ts
SAFE_DIRECT_COPY/scripts/pack20/check-release-no-secrets.mjs
SAFE_DIRECT_COPY/tests/pack20/certificationGate.test.ts
SAFE_DIRECT_COPY/tests/pack20/installerSignature.test.ts
SAFE_DIRECT_COPY/tests/pack20/releaseCandidatePolicy.test.ts
SAFE_DIRECT_COPY/tests/pack20/releaseChannel.test.ts
SAFE_DIRECT_COPY/tests/pack20/sbomPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack20/supportReadiness.test.ts
SAFE_DIRECT_COPY/tests/pack20/updateReadinessStore.test.ts
SAFE_DIRECT_COPY/tests/pack20/versionPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack20/vulnerabilityPolicy.test.ts
generated-remotedesk-release-certification-pack-20-code-review.md
generated-remotedesk-release-certification-pack-20-manifest.json
generated-remotedesk-release-certification-pack-20-merge-summary.md
generated-remotedesk-release-certification-pack-20-risk-register.md
generated-remotedesk-release-certification-pack-20-test-plan.md

```


## `PATCHES/api-pack20.patch.md`

```text
Mount Pack 20 release routes behind release admin permissions. Store signing/notary secrets only in the existing secret manager. Enforce evidence hashes before approval.

```


## `PATCHES/desktop-pack20.patch.md`

```text
Wire release channel, installer trust and release notes panels into update UI. Do not auto-install unsigned or unnotarized artifacts.

```


## `PATCHES/ops-pack20.patch.md`

```text
Run release secret scanner and SBOM/vulnerability checks in CI before publishing artifacts.

```


## `PATCHES/web-pack20.patch.md`

```text
Mount release certification dashboards for owner/admin/release roles only. Do not allow client-side bypass of certification gates.

```


## `REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { CertificationCheckRecordService } from './certificationChecksService.js';
export function registerCertificationCheckRecordRoutes(router:Router, service:CertificationCheckRecordService): void { router.get('/pack20/certificationChecks', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/certificationChecks', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksService.ts`

```text
import type { CertificationCheckRecord, CertificationCheckRecordRepository } from './certificationChecksTypes.js';
export class CertificationCheckRecordService { constructor(private readonly repository:CertificationCheckRecordRepository) {} create(record:CertificationCheckRecord): Promise<CertificationCheckRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<CertificationCheckRecord>): Promise<CertificationCheckRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('certificationChecks-not-found'); return updated; } list(filter:Partial<CertificationCheckRecord>={}, limit=50): Promise<CertificationCheckRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksTypes.ts`

```text
export interface CertificationCheckRecord { id:string; releaseId:string; checkKey:string; status:string; evidenceId?:string; updatedAt:string; }
export interface CertificationCheckRecordRepository { create(record:CertificationCheckRecord): Promise<CertificationCheckRecord>; update(id:string, patch:Partial<CertificationCheckRecord>): Promise<CertificationCheckRecord|null>; list(filter:Partial<CertificationCheckRecord>, limit:number): Promise<CertificationCheckRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/index.ts`

```text
export * from './certificationChecksTypes.js';
export * from './certificationChecksService.js';
export * from './certificationChecksRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/common/pack20Route.ts`

```text
import type { Request, Response, NextFunction } from 'express';
export function pack20Route(handler: (req: Request, res: Response, next: NextFunction)=>Promise<void>) { return (req: Request, res: Response, next: NextFunction): void => { handler(req,res,next).catch(next); }; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/common/releaseAdminAuth.ts`

```text
import type { Request, Response, NextFunction } from 'express';
export function requireReleaseAdmin(req: Request, res: Response, next: NextFunction): void { const user=req.user as { role?:string; permissions?:string[] }|undefined; if(user?.role==='owner'||user?.role==='admin'||user?.permissions?.includes('release:manage')) { next(); return; } res.status(403).json({ error:'release_admin_required' }); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/index.ts`

```text
export * from './common/pack20Route.js';
export * from './common/releaseAdminAuth.js';
export * from './releaseCandidates/releaseCandidatePolicy.js';
export * from './installerArtifacts/installerArtifactPolicy.js';
export * from './vulnerabilityFindings/vulnerabilityPolicy.js';
export * from './rolloutPlans/rolloutPlanPolicy.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/index.ts`

```text
export * from './installerArtifactsTypes.js';
export * from './installerArtifactsService.js';
export * from './installerArtifactsRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactPolicy.ts`

```text
export function installerArtifactBlocksRelease(i:{platform:string; signed:boolean; notarized?:boolean}): boolean { return !i.signed || (i.platform==='macos' && i.notarized!==true); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { InstallerArtifactRecordService } from './installerArtifactsService.js';
export function registerInstallerArtifactRecordRoutes(router:Router, service:InstallerArtifactRecordService): void { router.get('/pack20/installerArtifacts', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/installerArtifacts', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsService.ts`

```text
import type { InstallerArtifactRecord, InstallerArtifactRecordRepository } from './installerArtifactsTypes.js';
export class InstallerArtifactRecordService { constructor(private readonly repository:InstallerArtifactRecordRepository) {} create(record:InstallerArtifactRecord): Promise<InstallerArtifactRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<InstallerArtifactRecord>): Promise<InstallerArtifactRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('installerArtifacts-not-found'); return updated; } list(filter:Partial<InstallerArtifactRecord>={}, limit=50): Promise<InstallerArtifactRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsTypes.ts`

```text
export interface InstallerArtifactRecord { id:string; releaseId:string; platform:string; objectKey:string; sha256:string; signed:boolean; notarized?:boolean; }
export interface InstallerArtifactRecordRepository { create(record:InstallerArtifactRecord): Promise<InstallerArtifactRecord>; update(id:string, patch:Partial<InstallerArtifactRecord>): Promise<InstallerArtifactRecord|null>; list(filter:Partial<InstallerArtifactRecord>, limit:number): Promise<InstallerArtifactRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/index.ts`

```text
export * from './launchSignoffsTypes.js';
export * from './launchSignoffsService.js';
export * from './launchSignoffsRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { LaunchSignoffRecordService } from './launchSignoffsService.js';
export function registerLaunchSignoffRecordRoutes(router:Router, service:LaunchSignoffRecordService): void { router.get('/pack20/launchSignoffs', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/launchSignoffs', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsService.ts`

```text
import type { LaunchSignoffRecord, LaunchSignoffRecordRepository } from './launchSignoffsTypes.js';
export class LaunchSignoffRecordService { constructor(private readonly repository:LaunchSignoffRecordRepository) {} create(record:LaunchSignoffRecord): Promise<LaunchSignoffRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<LaunchSignoffRecord>): Promise<LaunchSignoffRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('launchSignoffs-not-found'); return updated; } list(filter:Partial<LaunchSignoffRecord>={}, limit=50): Promise<LaunchSignoffRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsTypes.ts`

```text
export interface LaunchSignoffRecord { id:string; releaseId:string; team:string; state:string; signedByUserId?:string; }
export interface LaunchSignoffRecordRepository { create(record:LaunchSignoffRecord): Promise<LaunchSignoffRecord>; update(id:string, patch:Partial<LaunchSignoffRecord>): Promise<LaunchSignoffRecord|null>; list(filter:Partial<LaunchSignoffRecord>, limit:number): Promise<LaunchSignoffRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/index.ts`

```text
export * from './releaseApprovalsTypes.js';
export * from './releaseApprovalsService.js';
export * from './releaseApprovalsRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { ReleaseApprovalRecordService } from './releaseApprovalsService.js';
export function registerReleaseApprovalRecordRoutes(router:Router, service:ReleaseApprovalRecordService): void { router.get('/pack20/releaseApprovals', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/releaseApprovals', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsService.ts`

```text
import type { ReleaseApprovalRecord, ReleaseApprovalRecordRepository } from './releaseApprovalsTypes.js';
export class ReleaseApprovalRecordService { constructor(private readonly repository:ReleaseApprovalRecordRepository) {} create(record:ReleaseApprovalRecord): Promise<ReleaseApprovalRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<ReleaseApprovalRecord>): Promise<ReleaseApprovalRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('releaseApprovals-not-found'); return updated; } list(filter:Partial<ReleaseApprovalRecord>={}, limit=50): Promise<ReleaseApprovalRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsTypes.ts`

```text
export interface ReleaseApprovalRecord { id:string; releaseId:string; approverUserId:string; state:string; createdAt:string; }
export interface ReleaseApprovalRecordRepository { create(record:ReleaseApprovalRecord): Promise<ReleaseApprovalRecord>; update(id:string, patch:Partial<ReleaseApprovalRecord>): Promise<ReleaseApprovalRecord|null>; list(filter:Partial<ReleaseApprovalRecord>, limit:number): Promise<ReleaseApprovalRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/index.ts`

```text
export * from './releaseAuditTypes.js';
export * from './releaseAuditService.js';
export * from './releaseAuditRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { ReleaseAuditRecordService } from './releaseAuditService.js';
export function registerReleaseAuditRecordRoutes(router:Router, service:ReleaseAuditRecordService): void { router.get('/pack20/releaseAudit', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/releaseAudit', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditService.ts`

```text
import type { ReleaseAuditRecord, ReleaseAuditRecordRepository } from './releaseAuditTypes.js';
export class ReleaseAuditRecordService { constructor(private readonly repository:ReleaseAuditRecordRepository) {} create(record:ReleaseAuditRecord): Promise<ReleaseAuditRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<ReleaseAuditRecord>): Promise<ReleaseAuditRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('releaseAudit-not-found'); return updated; } list(filter:Partial<ReleaseAuditRecord>={}, limit=50): Promise<ReleaseAuditRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditTypes.ts`

```text
export interface ReleaseAuditRecord { id:string; releaseId:string; actorUserId:string; action:string; occurredAt:string; metadata?:Record<string, unknown>; }
export interface ReleaseAuditRecordRepository { create(record:ReleaseAuditRecord): Promise<ReleaseAuditRecord>; update(id:string, patch:Partial<ReleaseAuditRecord>): Promise<ReleaseAuditRecord|null>; list(filter:Partial<ReleaseAuditRecord>, limit:number): Promise<ReleaseAuditRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/index.ts`

```text
export * from './releaseCandidatesTypes.js';
export * from './releaseCandidatesService.js';
export * from './releaseCandidatesRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatePolicy.ts`

```text
export function releaseCandidateCanApprove(i:{status:string; blockers:string[]; approvals:number}): {allowed:boolean; reason:string} { if(i.status!=='certifying') return {allowed:false, reason:'not-certifying'}; if(i.blockers.length) return {allowed:false, reason:'blockers-open'}; if(i.approvals<2) return {allowed:false, reason:'approval-count'}; return {allowed:true, reason:'allowed'}; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { ReleaseCandidateRecordService } from './releaseCandidatesService.js';
export function registerReleaseCandidateRecordRoutes(router:Router, service:ReleaseCandidateRecordService): void { router.get('/pack20/releaseCandidates', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/releaseCandidates', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesService.ts`

```text
import type { ReleaseCandidateRecord, ReleaseCandidateRecordRepository } from './releaseCandidatesTypes.js';
export class ReleaseCandidateRecordService { constructor(private readonly repository:ReleaseCandidateRecordRepository) {} create(record:ReleaseCandidateRecord): Promise<ReleaseCandidateRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<ReleaseCandidateRecord>): Promise<ReleaseCandidateRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('releaseCandidates-not-found'); return updated; } list(filter:Partial<ReleaseCandidateRecord>={}, limit=50): Promise<ReleaseCandidateRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesTypes.ts`

```text
export interface ReleaseCandidateRecord { id:string; version:string; gitSha:string; channel:string; status:string; createdAt:string; }
export interface ReleaseCandidateRecordRepository { create(record:ReleaseCandidateRecord): Promise<ReleaseCandidateRecord>; update(id:string, patch:Partial<ReleaseCandidateRecord>): Promise<ReleaseCandidateRecord|null>; list(filter:Partial<ReleaseCandidateRecord>, limit:number): Promise<ReleaseCandidateRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/index.ts`

```text
export * from './releaseEvidenceTypes.js';
export * from './releaseEvidenceService.js';
export * from './releaseEvidenceRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { ReleaseEvidenceRecordService } from './releaseEvidenceService.js';
export function registerReleaseEvidenceRecordRoutes(router:Router, service:ReleaseEvidenceRecordService): void { router.get('/pack20/releaseEvidence', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/releaseEvidence', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceService.ts`

```text
import type { ReleaseEvidenceRecord, ReleaseEvidenceRecordRepository } from './releaseEvidenceTypes.js';
export class ReleaseEvidenceRecordService { constructor(private readonly repository:ReleaseEvidenceRecordRepository) {} create(record:ReleaseEvidenceRecord): Promise<ReleaseEvidenceRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<ReleaseEvidenceRecord>): Promise<ReleaseEvidenceRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('releaseEvidence-not-found'); return updated; } list(filter:Partial<ReleaseEvidenceRecord>={}, limit=50): Promise<ReleaseEvidenceRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceTypes.ts`

```text
export interface ReleaseEvidenceRecord { id:string; releaseId:string; kind:string; objectKey:string; sha256:string; createdAt:string; }
export interface ReleaseEvidenceRecordRepository { create(record:ReleaseEvidenceRecord): Promise<ReleaseEvidenceRecord>; update(id:string, patch:Partial<ReleaseEvidenceRecord>): Promise<ReleaseEvidenceRecord|null>; list(filter:Partial<ReleaseEvidenceRecord>, limit:number): Promise<ReleaseEvidenceRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/index.ts`

```text
export * from './rollbackRecordsTypes.js';
export * from './rollbackRecordsService.js';
export * from './rollbackRecordsRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { RollbackRecordService } from './rollbackRecordsService.js';
export function registerRollbackRecordRoutes(router:Router, service:RollbackRecordService): void { router.get('/pack20/rollbackRecords', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/rollbackRecords', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsService.ts`

```text
import type { RollbackRecord, RollbackRecordRepository } from './rollbackRecordsTypes.js';
export class RollbackRecordService { constructor(private readonly repository:RollbackRecordRepository) {} create(record:RollbackRecord): Promise<RollbackRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<RollbackRecord>): Promise<RollbackRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('rollbackRecords-not-found'); return updated; } list(filter:Partial<RollbackRecord>={}, limit=50): Promise<RollbackRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsTypes.ts`

```text
export interface RollbackRecord { id:string; releaseId:string; targetVersion:string; reason:string; status:string; createdAt:string; }
export interface RollbackRecordRepository { create(record:RollbackRecord): Promise<RollbackRecord>; update(id:string, patch:Partial<RollbackRecord>): Promise<RollbackRecord|null>; list(filter:Partial<RollbackRecord>, limit:number): Promise<RollbackRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/index.ts`

```text
export * from './rolloutPlansTypes.js';
export * from './rolloutPlansService.js';
export * from './rolloutPlansRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlanPolicy.ts`

```text
export function rolloutPlanAllowed(i:{percentage:number; approved:boolean; paused:boolean}): {allowed:boolean; reason:string} { if(!i.approved) return {allowed:false, reason:'approval-required'}; if(i.paused) return {allowed:false, reason:'rollout-paused'}; if(i.percentage<1||i.percentage>100) return {allowed:false, reason:'invalid-percentage'}; return {allowed:true, reason:'allowed'}; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { RolloutPlanRecordService } from './rolloutPlansService.js';
export function registerRolloutPlanRecordRoutes(router:Router, service:RolloutPlanRecordService): void { router.get('/pack20/rolloutPlans', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/rolloutPlans', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansService.ts`

```text
import type { RolloutPlanRecord, RolloutPlanRecordRepository } from './rolloutPlansTypes.js';
export class RolloutPlanRecordService { constructor(private readonly repository:RolloutPlanRecordRepository) {} create(record:RolloutPlanRecord): Promise<RolloutPlanRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<RolloutPlanRecord>): Promise<RolloutPlanRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('rolloutPlans-not-found'); return updated; } list(filter:Partial<RolloutPlanRecord>={}, limit=50): Promise<RolloutPlanRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansTypes.ts`

```text
export interface RolloutPlanRecord { id:string; releaseId:string; percentage:number; channel:string; startedAt?:string; pausedAt?:string; }
export interface RolloutPlanRecordRepository { create(record:RolloutPlanRecord): Promise<RolloutPlanRecord>; update(id:string, patch:Partial<RolloutPlanRecord>): Promise<RolloutPlanRecord|null>; list(filter:Partial<RolloutPlanRecord>, limit:number): Promise<RolloutPlanRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/index.ts`

```text
export * from './sbomReportsTypes.js';
export * from './sbomReportsService.js';
export * from './sbomReportsRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { SbomReportRecordService } from './sbomReportsService.js';
export function registerSbomReportRecordRoutes(router:Router, service:SbomReportRecordService): void { router.get('/pack20/sbomReports', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/sbomReports', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsService.ts`

```text
import type { SbomReportRecord, SbomReportRecordRepository } from './sbomReportsTypes.js';
export class SbomReportRecordService { constructor(private readonly repository:SbomReportRecordRepository) {} create(record:SbomReportRecord): Promise<SbomReportRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<SbomReportRecord>): Promise<SbomReportRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('sbomReports-not-found'); return updated; } list(filter:Partial<SbomReportRecord>={}, limit=50): Promise<SbomReportRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsTypes.ts`

```text
export interface SbomReportRecord { id:string; releaseId:string; objectKey:string; packageCount:number; unknownLicenses:number; createdAt:string; }
export interface SbomReportRecordRepository { create(record:SbomReportRecord): Promise<SbomReportRecord>; update(id:string, patch:Partial<SbomReportRecord>): Promise<SbomReportRecord|null>; list(filter:Partial<SbomReportRecord>, limit:number): Promise<SbomReportRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/index.ts`

```text
export * from './supportReadinessChecksTypes.js';
export * from './supportReadinessChecksService.js';
export * from './supportReadinessChecksRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { SupportReadinessCheckRecordService } from './supportReadinessChecksService.js';
export function registerSupportReadinessCheckRecordRoutes(router:Router, service:SupportReadinessCheckRecordService): void { router.get('/pack20/supportReadinessChecks', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/supportReadinessChecks', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksService.ts`

```text
import type { SupportReadinessCheckRecord, SupportReadinessCheckRecordRepository } from './supportReadinessChecksTypes.js';
export class SupportReadinessCheckRecordService { constructor(private readonly repository:SupportReadinessCheckRecordRepository) {} create(record:SupportReadinessCheckRecord): Promise<SupportReadinessCheckRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<SupportReadinessCheckRecord>): Promise<SupportReadinessCheckRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('supportReadinessChecks-not-found'); return updated; } list(filter:Partial<SupportReadinessCheckRecord>={}, limit=50): Promise<SupportReadinessCheckRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksTypes.ts`

```text
export interface SupportReadinessCheckRecord { id:string; releaseId:string; runbookPublished:boolean; macrosPublished:boolean; onCallAssigned:boolean; escalationPathTested:boolean; }
export interface SupportReadinessCheckRecordRepository { create(record:SupportReadinessCheckRecord): Promise<SupportReadinessCheckRecord>; update(id:string, patch:Partial<SupportReadinessCheckRecord>): Promise<SupportReadinessCheckRecord|null>; list(filter:Partial<SupportReadinessCheckRecord>, limit:number): Promise<SupportReadinessCheckRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/index.ts`

```text
export * from './vulnerabilityFindingsTypes.js';
export * from './vulnerabilityFindingsService.js';
export * from './vulnerabilityFindingsRoutes.js';

```


## `REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsRoutes.ts`

```text
import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { VulnerabilityFindingRecordService } from './vulnerabilityFindingsService.js';
export function registerVulnerabilityFindingRecordRoutes(router:Router, service:VulnerabilityFindingRecordService): void { router.get('/pack20/vulnerabilityFindings', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/vulnerabilityFindings', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsService.ts`

```text
import type { VulnerabilityFindingRecord, VulnerabilityFindingRecordRepository } from './vulnerabilityFindingsTypes.js';
export class VulnerabilityFindingRecordService { constructor(private readonly repository:VulnerabilityFindingRecordRepository) {} create(record:VulnerabilityFindingRecord): Promise<VulnerabilityFindingRecord> { return this.repository.create(record); } async update(id:string, patch:Partial<VulnerabilityFindingRecord>): Promise<VulnerabilityFindingRecord> { const updated=await this.repository.update(id, patch); if(!updated) throw new Error('vulnerabilityFindings-not-found'); return updated; } list(filter:Partial<VulnerabilityFindingRecord>={}, limit=50): Promise<VulnerabilityFindingRecord[]> { return this.repository.list(filter, Math.max(1, Math.min(200, limit))); } }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsTypes.ts`

```text
export interface VulnerabilityFindingRecord { id:string; releaseId:string; packageName:string; severity:string; status:string; }
export interface VulnerabilityFindingRecordRepository { create(record:VulnerabilityFindingRecord): Promise<VulnerabilityFindingRecord>; update(id:string, patch:Partial<VulnerabilityFindingRecord>): Promise<VulnerabilityFindingRecord|null>; list(filter:Partial<VulnerabilityFindingRecord>, limit:number): Promise<VulnerabilityFindingRecord[]>; }

```


## `REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityPolicy.ts`

```text
export function vulnerabilityBlocksRelease(i:{severity:string; status:string}): boolean { if(i.status==='fixed'||i.status==='accepted') return false; return i.severity==='critical'||i.severity==='high'; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack20/index.ts`

```text
export * from './releaseChannelBadge.js';
export * from './installerTrustPanel.js';
export * from './updateReadinessStore.js';
export * from './releaseNotesPanel.js';

```


## `REVIEW_REQUIRED/apps/desktop/src/pack20/installerTrustPanel.tsx`

```text
import React from 'react';
export function InstallerTrustPanel(props:{signed:boolean; notarized?:boolean; sha256:string}): JSX.Element { return <section><h3>Installer trust</h3><p>Signed: {props.signed ? 'yes' : 'no'}</p><p>Notarized: {props.notarized ? 'yes' : 'not required or missing'}</p><code>{props.sha256}</code></section>; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack20/releaseChannelBadge.tsx`

```text
import React from 'react';
export function ReleaseChannelBadge(props:{channel:'internal'|'alpha'|'beta'|'stable'|'hotfix'; version:string}): JSX.Element { return <span data-release-channel={props.channel}>Release {props.version} · {props.channel}</span>; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack20/releaseNotesPanel.tsx`

```text
import React from 'react';
export function ReleaseNotesPanel(props:{version:string; notes:string[]}): JSX.Element { return <section><h3>Release notes {props.version}</h3><ul>{props.notes.map(note => <li key={note}>{note}</li>)}</ul></section>; }

```


## `REVIEW_REQUIRED/apps/desktop/src/pack20/updateReadinessStore.ts`

```text
export interface DesktopUpdateReadiness { installerSigned:boolean; channelAllowed:boolean; rollbackAvailable:boolean; }
export function desktopUpdateReady(i:DesktopUpdateReadiness): boolean { return i.installerSigned && i.channelAllowed && i.rollbackAvailable; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/CertificationChecksPage.tsx`

```text
import React from 'react';
export interface CertificationChecksPageRow { id:string; title:string; status:string; detail?:string; }
export function CertificationChecksPage(props: { rows:CertificationChecksPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Certification checks</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/InstallerArtifactsPage.tsx`

```text
import React from 'react';
export interface InstallerArtifactsPageRow { id:string; title:string; status:string; detail?:string; }
export function InstallerArtifactsPage(props: { rows:InstallerArtifactsPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Installer artifacts</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/LaunchSignoffsPage.tsx`

```text
import React from 'react';
export interface LaunchSignoffsPageRow { id:string; title:string; status:string; detail?:string; }
export function LaunchSignoffsPage(props: { rows:LaunchSignoffsPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Launch signoffs</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseApprovalsPage.tsx`

```text
import React from 'react';
export interface ReleaseApprovalsPageRow { id:string; title:string; status:string; detail?:string; }
export function ReleaseApprovalsPage(props: { rows:ReleaseApprovalsPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Release approvals</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseAuditPage.tsx`

```text
import React from 'react';
export interface ReleaseAuditPageRow { id:string; title:string; status:string; detail?:string; }
export function ReleaseAuditPage(props: { rows:ReleaseAuditPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Release audit</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseCandidatesPage.tsx`

```text
import React from 'react';
export interface ReleaseCandidatesPageRow { id:string; title:string; status:string; detail?:string; }
export function ReleaseCandidatesPage(props: { rows:ReleaseCandidatesPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Release candidates</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseEvidencePage.tsx`

```text
import React from 'react';
export interface ReleaseEvidencePageRow { id:string; title:string; status:string; detail?:string; }
export function ReleaseEvidencePage(props: { rows:ReleaseEvidencePageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Release evidence</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/RollbackRecordsPage.tsx`

```text
import React from 'react';
export interface RollbackRecordsPageRow { id:string; title:string; status:string; detail?:string; }
export function RollbackRecordsPage(props: { rows:RollbackRecordsPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Rollback records</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/RolloutPlansPage.tsx`

```text
import React from 'react';
export interface RolloutPlansPageRow { id:string; title:string; status:string; detail?:string; }
export function RolloutPlansPage(props: { rows:RolloutPlansPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Rollout plans</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/SbomReportsPage.tsx`

```text
import React from 'react';
export interface SbomReportsPageRow { id:string; title:string; status:string; detail?:string; }
export function SbomReportsPage(props: { rows:SbomReportsPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>SBOM reports</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/SupportReadinessPage.tsx`

```text
import React from 'react';
export interface SupportReadinessPageRow { id:string; title:string; status:string; detail?:string; }
export function SupportReadinessPage(props: { rows:SupportReadinessPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Support readiness</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/components/VulnerabilityFindingsPage.tsx`

```text
import React from 'react';
export interface VulnerabilityFindingsPageRow { id:string; title:string; status:string; detail?:string; }
export function VulnerabilityFindingsPage(props: { rows:VulnerabilityFindingsPageRow[]; onOpen?: (id:string)=>void }): JSX.Element { return <main><h1>Vulnerability findings</h1>{props.rows.length===0 ? <p>No release records.</p> : <ul>{props.rows.map(row => <li key={row.id} data-status={row.status}><strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>} {props.onOpen && <button type='button' onClick={()=>props.onOpen?.(row.id)}>Open</button>}</li>)}</ul>}</main>; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useCertificationChecks.ts`

```text
import { useEffect, useState } from 'react';
export interface useCertificationChecksResult<T> { data?:T; loading:boolean; error?:string; }
export function useCertificationChecks<T>(loader:()=>Promise<T>): useCertificationChecksResult<T> { const [state,setState]=useState<useCertificationChecksResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useInstallerArtifacts.ts`

```text
import { useEffect, useState } from 'react';
export interface useInstallerArtifactsResult<T> { data?:T; loading:boolean; error?:string; }
export function useInstallerArtifacts<T>(loader:()=>Promise<T>): useInstallerArtifactsResult<T> { const [state,setState]=useState<useInstallerArtifactsResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useLaunchSignoffs.ts`

```text
import { useEffect, useState } from 'react';
export interface useLaunchSignoffsResult<T> { data?:T; loading:boolean; error?:string; }
export function useLaunchSignoffs<T>(loader:()=>Promise<T>): useLaunchSignoffsResult<T> { const [state,setState]=useState<useLaunchSignoffsResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseApprovals.ts`

```text
import { useEffect, useState } from 'react';
export interface useReleaseApprovalsResult<T> { data?:T; loading:boolean; error?:string; }
export function useReleaseApprovals<T>(loader:()=>Promise<T>): useReleaseApprovalsResult<T> { const [state,setState]=useState<useReleaseApprovalsResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseAudit.ts`

```text
import { useEffect, useState } from 'react';
export interface useReleaseAuditResult<T> { data?:T; loading:boolean; error?:string; }
export function useReleaseAudit<T>(loader:()=>Promise<T>): useReleaseAuditResult<T> { const [state,setState]=useState<useReleaseAuditResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseCandidates.ts`

```text
import { useEffect, useState } from 'react';
export interface useReleaseCandidatesResult<T> { data?:T; loading:boolean; error?:string; }
export function useReleaseCandidates<T>(loader:()=>Promise<T>): useReleaseCandidatesResult<T> { const [state,setState]=useState<useReleaseCandidatesResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseEvidence.ts`

```text
import { useEffect, useState } from 'react';
export interface useReleaseEvidenceResult<T> { data?:T; loading:boolean; error?:string; }
export function useReleaseEvidence<T>(loader:()=>Promise<T>): useReleaseEvidenceResult<T> { const [state,setState]=useState<useReleaseEvidenceResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useRollbackRecords.ts`

```text
import { useEffect, useState } from 'react';
export interface useRollbackRecordsResult<T> { data?:T; loading:boolean; error?:string; }
export function useRollbackRecords<T>(loader:()=>Promise<T>): useRollbackRecordsResult<T> { const [state,setState]=useState<useRollbackRecordsResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useRolloutPlans.ts`

```text
import { useEffect, useState } from 'react';
export interface useRolloutPlansResult<T> { data?:T; loading:boolean; error?:string; }
export function useRolloutPlans<T>(loader:()=>Promise<T>): useRolloutPlansResult<T> { const [state,setState]=useState<useRolloutPlansResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useSbomReports.ts`

```text
import { useEffect, useState } from 'react';
export interface useSbomReportsResult<T> { data?:T; loading:boolean; error?:string; }
export function useSbomReports<T>(loader:()=>Promise<T>): useSbomReportsResult<T> { const [state,setState]=useState<useSbomReportsResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useSupportReadiness.ts`

```text
import { useEffect, useState } from 'react';
export interface useSupportReadinessResult<T> { data?:T; loading:boolean; error?:string; }
export function useSupportReadiness<T>(loader:()=>Promise<T>): useSupportReadinessResult<T> { const [state,setState]=useState<useSupportReadinessResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/hooks/useVulnerabilityFindings.ts`

```text
import { useEffect, useState } from 'react';
export interface useVulnerabilityFindingsResult<T> { data?:T; loading:boolean; error?:string; }
export function useVulnerabilityFindings<T>(loader:()=>Promise<T>): useVulnerabilityFindingsResult<T> { const [state,setState]=useState<useVulnerabilityFindingsResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }

```


## `REVIEW_REQUIRED/apps/web/src/pack20/index.ts`

```text
export * from './components/ReleaseCandidatesPage.js';
export * from './components/CertificationChecksPage.js';
export * from './components/InstallerArtifactsPage.js';
export * from './components/SbomReportsPage.js';
export * from './components/VulnerabilityFindingsPage.js';
export * from './components/ReleaseApprovalsPage.js';
export * from './components/RolloutPlansPage.js';
export * from './components/RollbackRecordsPage.js';
export * from './components/SupportReadinessPage.js';
export * from './components/ReleaseEvidencePage.js';
export * from './components/LaunchSignoffsPage.js';
export * from './components/ReleaseAuditPage.js';
export * from './hooks/useReleaseCandidates.js';
export * from './hooks/useCertificationChecks.js';
export * from './hooks/useInstallerArtifacts.js';
export * from './hooks/useSbomReports.js';
export * from './hooks/useVulnerabilityFindings.js';
export * from './hooks/useReleaseApprovals.js';
export * from './hooks/useRolloutPlans.js';
export * from './hooks/useRollbackRecords.js';
export * from './hooks/useSupportReadiness.js';
export * from './hooks/useReleaseEvidence.js';
export * from './hooks/useLaunchSignoffs.js';
export * from './hooks/useReleaseAudit.js';

```


## `SAFE_DIRECT_COPY/docs/pack20/01-merge-guide.md`

```text
Pack 20 adds release certification, installer artifacts, SBOM reports, vulnerability evidence, approvals, rollout plans, rollback records, support readiness, launch signoffs and release audit.

```


## `SAFE_DIRECT_COPY/docs/pack20/02-certification-gates.md`

```text
Certification blocks release until smoke, security, performance, docs and support readiness checks are complete.

```


## `SAFE_DIRECT_COPY/docs/pack20/03-installer-signing.md`

```text
Installer artifacts require SHA-256 evidence and platform signing. macOS artifacts require notarization before stable release.

```


## `SAFE_DIRECT_COPY/docs/pack20/04-sbom-vulnerabilities.md`

```text
SBOM reports block release on unknown licenses or unresolved critical vulnerabilities. High vulnerabilities need explicit policy review.

```


## `SAFE_DIRECT_COPY/docs/pack20/05-rollout-rollback.md`

```text
Rollout plans require approval and valid percentages. Rollback windows should remain open during staged rollouts.

```


## `SAFE_DIRECT_COPY/docs/pack20/06-support-readiness.md`

```text
Support runbooks, macros, on-call assignment and escalation path tests are required before release signoff.

```


## `SAFE_DIRECT_COPY/docs/pack20/07-qa-checklist.md`

```text
Verify certification gates, installer signatures, SBOM/vulnerability blockers, approval counts, rollout pause, rollback records and launch signoffs.

```


## `SAFE_DIRECT_COPY/infra/pack20/prometheus-release-alerts.yml`

```text
groups:
  - name: remotedesk-release-pack20
    rules:
      - alert: RemoteDeskReleaseBlockersOpen
        expr: remotedesk_release_blockers_open_total > 0
        for: 5m
        labels:
          severity: warning
      - alert: RemoteDeskRollbackRunning
        expr: remotedesk_rollback_running_total > 0
        for: 1m
        labels:
          severity: critical

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/certificationGate.ts`

```text
export interface CertificationGateInput { smokePassed:boolean; securityPassed:boolean; performancePassed:boolean; docsPublished:boolean; supportReady:boolean; }
export function certificationBlockers(i: CertificationGateInput): string[] { const b:string[]=[]; if(!i.smokePassed)b.push('smoke-tests-failed'); if(!i.securityPassed)b.push('security-checks-failed'); if(!i.performancePassed)b.push('performance-budget-failed'); if(!i.docsPublished)b.push('docs-not-published'); if(!i.supportReady)b.push('support-not-ready'); return b; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/evidenceHash.ts`

```text
export async function evidenceSha256(text:string): Promise<string> { const d=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join(''); }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/index.ts`

```text
export * from './releaseChannel.js';
export * from './versionPolicy.js';
export * from './certificationGate.js';
export * from './sbomPolicy.js';
export * from './installerSignature.js';
export * from './rollbackWindow.js';
export * from './supportReadiness.js';
export * from './evidenceHash.js';

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/installerSignature.ts`

```text
export interface InstallerSignature { platform:'windows'|'macos'|'linux'; signed:boolean; notarized?:boolean; }
export function installerSignatureValid(s: InstallerSignature): boolean { if(!s.signed) return false; return s.platform === 'macos' ? s.notarized === true : true; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/releaseChannel.ts`

```text
export type ReleaseChannel = 'internal'|'alpha'|'beta'|'stable'|'hotfix';
export function releaseChannelRank(c: ReleaseChannel): number { return {internal:0,alpha:1,beta:2,stable:3,hotfix:4}[c]; }
export function canPromoteChannel(from: ReleaseChannel, to: ReleaseChannel): boolean { return releaseChannelRank(to) >= releaseChannelRank(from) && !(from === 'hotfix' && to !== 'stable'); }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/rollbackWindow.ts`

```text
export interface RollbackWindow { releaseStartedAt:string; hours:number; }
export function rollbackWindowOpen(w: RollbackWindow, now=new Date()): boolean { return now.getTime() - new Date(w.releaseStartedAt).getTime() <= w.hours * 3600000; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/sbomPolicy.ts`

```text
export interface SbomSummary { packageCount:number; unknownLicenses:number; criticalVulnerabilities:number; highVulnerabilities:number; }
export function sbomBlocksRelease(s: SbomSummary): boolean { return s.unknownLicenses > 0 || s.criticalVulnerabilities > 0 || s.highVulnerabilities > 10; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/supportReadiness.ts`

```text
export interface SupportReadiness { runbookPublished:boolean; macrosPublished:boolean; onCallAssigned:boolean; escalationPathTested:boolean; }
export function supportReadinessMissing(i: SupportReadiness): string[] { const m:string[]=[]; if(!i.runbookPublished)m.push('runbook'); if(!i.macrosPublished)m.push('macros'); if(!i.onCallAssigned)m.push('on-call'); if(!i.escalationPathTested)m.push('escalation-test'); return m; }

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack20/versionPolicy.ts`

```text
export interface SemverParts { major:number; minor:number; patch:number; }
export function parseSemver(v:string): SemverParts|undefined { const m=/^(\d+)\.(\d+)\.(\d+)$/.exec(v.trim()); return m ? {major:+m[1], minor:+m[2], patch:+m[3]} : undefined; }
export function isForwardVersion(previous:string,next:string): boolean { const a=parseSemver(previous), b=parseSemver(next); return !!a && !!b && (b.major>a.major || (b.major===a.major && b.minor>a.minor) || (b.major===a.major && b.minor===a.minor && b.patch>a.patch)); }

```


## `SAFE_DIRECT_COPY/scripts/pack20/check-release-no-secrets.mjs`

```text
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root=process.argv[2] ?? '.'; const bad=[];
function walk(dir){ for(const entry of readdirSync(dir)){ const path=join(dir,entry); const stat=statSync(path); if(stat.isDirectory()) walk(path); else { const text=readFileSync(path,'utf8'); if(/rawToken|rawSecret|signingPrivateKey|notaryPassword|publisherPassword/i.test(text)) bad.push(path); } } }
walk(root); if(bad.length){ console.error('Release secret findings:', bad); process.exit(1); } console.log('Release secret scanner passed.');

```


## `SAFE_DIRECT_COPY/tests/pack20/certificationGate.test.ts`

```text
import assert from 'node:assert/strict'; import { certificationBlockers } from '../../packages/shared/src/pack20/certificationGate.js'; assert.deepEqual(certificationBlockers({smokePassed:true,securityPassed:true,performancePassed:true,docsPublished:true,supportReady:true}), []);

```


## `SAFE_DIRECT_COPY/tests/pack20/installerSignature.test.ts`

```text
import assert from 'node:assert/strict'; import { installerSignatureValid } from '../../packages/shared/src/pack20/installerSignature.js'; assert.equal(installerSignatureValid({platform:'macos',signed:true,notarized:true}), true);

```


## `SAFE_DIRECT_COPY/tests/pack20/releaseCandidatePolicy.test.ts`

```text
import assert from 'node:assert/strict'; import { releaseCandidateCanApprove } from '../../REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatePolicy.js'; assert.equal(releaseCandidateCanApprove({status:'certifying',blockers:[],approvals:2}).allowed, true);

```


## `SAFE_DIRECT_COPY/tests/pack20/releaseChannel.test.ts`

```text
import assert from 'node:assert/strict'; import { canPromoteChannel } from '../../packages/shared/src/pack20/releaseChannel.js'; assert.equal(canPromoteChannel('alpha','beta'), true);

```


## `SAFE_DIRECT_COPY/tests/pack20/sbomPolicy.test.ts`

```text
import assert from 'node:assert/strict'; import { sbomBlocksRelease } from '../../packages/shared/src/pack20/sbomPolicy.js'; assert.equal(sbomBlocksRelease({packageCount:10,unknownLicenses:0,criticalVulnerabilities:1,highVulnerabilities:0}), true);

```


## `SAFE_DIRECT_COPY/tests/pack20/supportReadiness.test.ts`

```text
import assert from 'node:assert/strict'; import { supportReadinessMissing } from '../../packages/shared/src/pack20/supportReadiness.js'; assert.deepEqual(supportReadinessMissing({runbookPublished:true,macrosPublished:true,onCallAssigned:true,escalationPathTested:true}), []);

```


## `SAFE_DIRECT_COPY/tests/pack20/updateReadinessStore.test.ts`

```text
import assert from 'node:assert/strict'; import { desktopUpdateReady } from '../../REVIEW_REQUIRED/apps/desktop/src/pack20/updateReadinessStore.js'; assert.equal(desktopUpdateReady({installerSigned:true,channelAllowed:true,rollbackAvailable:true}), true);

```


## `SAFE_DIRECT_COPY/tests/pack20/versionPolicy.test.ts`

```text
import assert from 'node:assert/strict'; import { isForwardVersion } from '../../packages/shared/src/pack20/versionPolicy.js'; assert.equal(isForwardVersion('1.0.0','1.0.1'), true);

```


## `SAFE_DIRECT_COPY/tests/pack20/vulnerabilityPolicy.test.ts`

```text
import assert from 'node:assert/strict'; import { vulnerabilityBlocksRelease } from '../../REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityPolicy.js'; assert.equal(vulnerabilityBlocksRelease({severity:'critical',status:'open'}), true);

```


## `generated-remotedesk-release-certification-pack-20-code-review.md`

```text
Review release admin authorization, certification blockers, installer signature/notarization policy, SBOM/vulnerability gates, approval counts, rollout plans, rollback readiness, support signoffs and evidence hash storage.

```


## `generated-remotedesk-release-certification-pack-20-manifest.json`

```text
{
  "name": "generated-remotedesk-release-certification-pack-20",
  "createdAt": "2026-06-15T08:57:18.617424+00:00",
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
    "SAFE_DIRECT_COPY/docs/pack20/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack20/02-certification-gates.md",
    "SAFE_DIRECT_COPY/docs/pack20/03-installer-signing.md",
    "SAFE_DIRECT_COPY/docs/pack20/04-sbom-vulnerabilities.md",
    "SAFE_DIRECT_COPY/docs/pack20/05-rollout-rollback.md",
    "SAFE_DIRECT_COPY/docs/pack20/06-support-readiness.md",
    "SAFE_DIRECT_COPY/docs/pack20/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack20/prometheus-release-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/certificationGate.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/evidenceHash.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/installerSignature.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/releaseChannel.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/rollbackWindow.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/sbomPolicy.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/supportReadiness.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack20/versionPolicy.ts",
    "SAFE_DIRECT_COPY/scripts/pack20/check-release-no-secrets.mjs",
    "SAFE_DIRECT_COPY/tests/pack20/certificationGate.test.ts",
    "SAFE_DIRECT_COPY/tests/pack20/installerSignature.test.ts",
    "SAFE_DIRECT_COPY/tests/pack20/releaseCandidatePolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack20/releaseChannel.test.ts",
    "SAFE_DIRECT_COPY/tests/pack20/sbomPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack20/supportReadiness.test.ts",
    "SAFE_DIRECT_COPY/tests/pack20/updateReadinessStore.test.ts",
    "SAFE_DIRECT_COPY/tests/pack20/versionPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack20/vulnerabilityPolicy.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/certificationChecksTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/certificationChecks/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/common/pack20Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/common/releaseAdminAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/installerArtifacts/installerArtifactsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/launchSignoffs/launchSignoffsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseApprovals/releaseApprovalsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseAudit/releaseAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatePolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseCandidates/releaseCandidatesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/releaseEvidence/releaseEvidenceTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rollbackRecords/rollbackRecordsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlanPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/rolloutPlans/rolloutPlansTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/sbomReports/sbomReportsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/supportReadinessChecks/supportReadinessChecksTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityFindingsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack20/vulnerabilityFindings/vulnerabilityPolicy.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack20/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack20/installerTrustPanel.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack20/releaseChannelBadge.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack20/releaseNotesPanel.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack20/updateReadinessStore.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/CertificationChecksPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/InstallerArtifactsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/LaunchSignoffsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseApprovalsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseAuditPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseCandidatesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/ReleaseEvidencePage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/RollbackRecordsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/RolloutPlansPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/SbomReportsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/SupportReadinessPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/components/VulnerabilityFindingsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useCertificationChecks.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useInstallerArtifacts.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useLaunchSignoffs.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseApprovals.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseCandidates.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useReleaseEvidence.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useRollbackRecords.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useRolloutPlans.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useSbomReports.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useSupportReadiness.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/hooks/useVulnerabilityFindings.ts",
    "REVIEW_REQUIRED/apps/web/src/pack20/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack20.patch.md",
    "PATCHES/desktop-pack20.patch.md",
    "PATCHES/ops-pack20.patch.md",
    "PATCHES/web-pack20.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Actual signing/notarization providers must be wired through existing CI/secret infrastructure.",
    "SBOM and vulnerability scan ingestion requires CI artifact integration.",
    "Release routes must remain admin-only and evidence-gated.",
    "No remote shell, unattended access, arbitrary command execution or unsafe native input is included."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 95-99% with prior packs after CI/provider wiring and final release QA"
}
```


## `generated-remotedesk-release-certification-pack-20-merge-summary.md`

```text
Pack 20 adds release certification gates, release candidates, installer artifacts, SBOM reports, vulnerability findings, approvals, rollout plans, rollback records, support readiness checks, release evidence, launch signoffs, release audit, web/desktop UI, docs/tests/scripts.

```


## `generated-remotedesk-release-certification-pack-20-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| Unsigned installer release | Critical | installer signature gate |
| Critical vulnerability release | Critical | vulnerability blocker |
| Signing secret leak | Critical | secret manager and scanner |
| Rollout without rollback | High | rollback record gate |
| Support not ready | Medium | support readiness signoff |

```


## `generated-remotedesk-release-certification-pack-20-test-plan.md`

```text
Run Pack 20 shared/API/desktop tests, release secret scanner, then manual QA for certification checks, SBOM/vulnerability blockers, installer signature evidence, release approvals, rollout plans, rollback records and launch signoffs.

```
