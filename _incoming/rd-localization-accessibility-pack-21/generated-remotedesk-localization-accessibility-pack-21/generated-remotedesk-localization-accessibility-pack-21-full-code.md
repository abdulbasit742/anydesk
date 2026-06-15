# generated-remotedesk-localization-accessibility-pack-21 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack21.patch.md
PATCHES/desktop-pack21.patch.md
PATCHES/ops-pack21.patch.md
PATCHES/web-pack21.patch.md
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsService.ts
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesService.ts
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/common/experienceAdminAuth.ts
REVIEW_REQUIRED/apps/api/src/pack21/common/pack21Route.ts
REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsService.ts
REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesService.ts
REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesService.ts
REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlePolicy.ts
REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesService.ts
REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressService.ts
REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursService.ts
REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysService.ts
REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsService.ts
REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/index.ts
REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsService.ts
REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsTypes.ts
REVIEW_REQUIRED/apps/desktop/src/pack21/accessibilityStatusPanel.tsx
REVIEW_REQUIRED/apps/desktop/src/pack21/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack21/keyboardShortcutHelp.tsx
REVIEW_REQUIRED/apps/desktop/src/pack21/localeSelector.tsx
REVIEW_REQUIRED/apps/desktop/src/pack21/onboardingTourCard.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/AccessibilityAuditsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/AccessibilityIssuesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/CopyReviewItemsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/ExperienceAuditPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/KeyboardShortcutProfilesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/LocalePreferencesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/LocalizationBundlesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/OnboardingProgressPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/OnboardingToursPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/TranslationKeysPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/TranslationReviewsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/components/UxExperimentsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useAccessibilityAudits.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useAccessibilityIssues.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useCopyReviewItems.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useExperienceAudit.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useKeyboardShortcutProfiles.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useLocalePreferences.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useLocalizationBundles.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useOnboardingProgress.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useOnboardingTours.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useTranslationKeys.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useTranslationReviews.ts
REVIEW_REQUIRED/apps/web/src/pack21/hooks/useUxExperiments.ts
REVIEW_REQUIRED/apps/web/src/pack21/index.ts
SAFE_DIRECT_COPY/docs/pack21/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack21/02-localization.md
SAFE_DIRECT_COPY/docs/pack21/03-accessibility.md
SAFE_DIRECT_COPY/docs/pack21/04-copy-review.md
SAFE_DIRECT_COPY/docs/pack21/05-ux-experiments.md
SAFE_DIRECT_COPY/docs/pack21/06-onboarding.md
SAFE_DIRECT_COPY/docs/pack21/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack21/prometheus-experience-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack21/accessibilityIssue.ts
SAFE_DIRECT_COPY/packages/shared/src/pack21/copyReview.ts
SAFE_DIRECT_COPY/packages/shared/src/pack21/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack21/keyboardShortcut.ts
SAFE_DIRECT_COPY/packages/shared/src/pack21/localeNegotiation.ts
SAFE_DIRECT_COPY/packages/shared/src/pack21/pluralRules.ts
SAFE_DIRECT_COPY/packages/shared/src/pack21/reducedMotion.ts
SAFE_DIRECT_COPY/packages/shared/src/pack21/rtlLocale.ts
SAFE_DIRECT_COPY/packages/shared/src/pack21/timezoneFormat.ts
SAFE_DIRECT_COPY/scripts/pack21/check-copy-safety.mjs
SAFE_DIRECT_COPY/tests/pack21/accessibilityAuditPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack21/accessibilityIssue.test.ts
SAFE_DIRECT_COPY/tests/pack21/copyReview.test.ts
SAFE_DIRECT_COPY/tests/pack21/keyboardShortcut.test.ts
SAFE_DIRECT_COPY/tests/pack21/localeNegotiation.test.ts
SAFE_DIRECT_COPY/tests/pack21/localizationBundlePolicy.test.ts
SAFE_DIRECT_COPY/tests/pack21/pluralRules.test.ts
SAFE_DIRECT_COPY/tests/pack21/rtlLocale.test.ts
SAFE_DIRECT_COPY/tests/pack21/uxExperimentPolicy.test.ts
generated-remotedesk-localization-accessibility-pack-21-code-review.md
generated-remotedesk-localization-accessibility-pack-21-manifest.json
generated-remotedesk-localization-accessibility-pack-21-merge-summary.md
generated-remotedesk-localization-accessibility-pack-21-risk-register.md
generated-remotedesk-localization-accessibility-pack-21-test-plan.md

```


## `PATCHES/api-pack21.patch.md`

```text
Mount Pack 21 routes behind experience/admin permissions. Translation publish and copy publish must use server-side approval gates.

```


## `PATCHES/desktop-pack21.patch.md`

```text
Wire locale selector, accessibility status, shortcut help and onboarding cards into desktop settings/help surfaces.

```


## `PATCHES/ops-pack21.patch.md`

```text
Run copy/accessibility safety scanner in CI and block release on high/critical accessibility issues.

```


## `PATCHES/web-pack21.patch.md`

```text
Mount localization, accessibility and UX dashboards in admin settings. Use direction-aware layout for RTL locales.

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditPolicy.ts`

```text
export function accessibilityAuditBlocksRelease(input: { highIssues: number; criticalIssues: number }): boolean {
  return input.highIssues > 0 || input.criticalIssues > 0;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { AccessibilityAuditRecordService } from "./accessibilityAuditsService.js";

export function registerAccessibilityAuditRecordRoutes(router: Router, service: AccessibilityAuditRecordService): void {
  router.get("/pack21/accessibilityAudits", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/accessibilityAudits", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsService.ts`

```text
import type { AccessibilityAuditRecord, AccessibilityAuditRecordRepository } from "./accessibilityAuditsTypes.js";

export class AccessibilityAuditRecordService {
  constructor(private readonly repository: AccessibilityAuditRecordRepository) {}

  create(record: AccessibilityAuditRecord): Promise<AccessibilityAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AccessibilityAuditRecord>): Promise<AccessibilityAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("accessibilityAudits-not-found");
    return updated;
  }

  list(filter: Partial<AccessibilityAuditRecord> = {}, limit = 50): Promise<AccessibilityAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsTypes.ts`

```text
export interface AccessibilityAuditRecord {
  id: string; target: string; status: 'queued' | 'running' | 'passed' | 'failed'; issueCount: number; createdAt: string;
}

export interface AccessibilityAuditRecordRepository {
  create(record: AccessibilityAuditRecord): Promise<AccessibilityAuditRecord>;
  update(id: string, patch: Partial<AccessibilityAuditRecord>): Promise<AccessibilityAuditRecord | null>;
  list(filter: Partial<AccessibilityAuditRecord>, limit: number): Promise<AccessibilityAuditRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/index.ts`

```text
export * from "./accessibilityAuditsTypes.js";
export * from "./accessibilityAuditsService.js";
export * from "./accessibilityAuditsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { AccessibilityIssueRecordService } from "./accessibilityIssuesService.js";

export function registerAccessibilityIssueRecordRoutes(router: Router, service: AccessibilityIssueRecordService): void {
  router.get("/pack21/accessibilityIssues", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/accessibilityIssues", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesService.ts`

```text
import type { AccessibilityIssueRecord, AccessibilityIssueRecordRepository } from "./accessibilityIssuesTypes.js";

export class AccessibilityIssueRecordService {
  constructor(private readonly repository: AccessibilityIssueRecordRepository) {}

  create(record: AccessibilityIssueRecord): Promise<AccessibilityIssueRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AccessibilityIssueRecord>): Promise<AccessibilityIssueRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("accessibilityIssues-not-found");
    return updated;
  }

  list(filter: Partial<AccessibilityIssueRecord> = {}, limit = 50): Promise<AccessibilityIssueRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesTypes.ts`

```text
export interface AccessibilityIssueRecord {
  id: string; auditId: string; severity: 'low' | 'medium' | 'high' | 'critical'; rule: string; message: string; status: 'open' | 'resolved';
}

export interface AccessibilityIssueRecordRepository {
  create(record: AccessibilityIssueRecord): Promise<AccessibilityIssueRecord>;
  update(id: string, patch: Partial<AccessibilityIssueRecord>): Promise<AccessibilityIssueRecord | null>;
  list(filter: Partial<AccessibilityIssueRecord>, limit: number): Promise<AccessibilityIssueRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/index.ts`

```text
export * from "./accessibilityIssuesTypes.js";
export * from "./accessibilityIssuesService.js";
export * from "./accessibilityIssuesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/common/experienceAdminAuth.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function requireExperienceAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("experience:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "experience_admin_required" });
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/common/pack21Route.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function pack21Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { CopyReviewItemRecordService } from "./copyReviewItemsService.js";

export function registerCopyReviewItemRecordRoutes(router: Router, service: CopyReviewItemRecordService): void {
  router.get("/pack21/copyReviewItems", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/copyReviewItems", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsService.ts`

```text
import type { CopyReviewItemRecord, CopyReviewItemRecordRepository } from "./copyReviewItemsTypes.js";

export class CopyReviewItemRecordService {
  constructor(private readonly repository: CopyReviewItemRecordRepository) {}

  create(record: CopyReviewItemRecord): Promise<CopyReviewItemRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CopyReviewItemRecord>): Promise<CopyReviewItemRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("copyReviewItems-not-found");
    return updated;
  }

  list(filter: Partial<CopyReviewItemRecord> = {}, limit = 50): Promise<CopyReviewItemRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsTypes.ts`

```text
export interface CopyReviewItemRecord {
  id: string; surface: string; copy: string; state: 'draft' | 'reviewed' | 'approved' | 'rejected'; updatedAt: string;
}

export interface CopyReviewItemRecordRepository {
  create(record: CopyReviewItemRecord): Promise<CopyReviewItemRecord>;
  update(id: string, patch: Partial<CopyReviewItemRecord>): Promise<CopyReviewItemRecord | null>;
  list(filter: Partial<CopyReviewItemRecord>, limit: number): Promise<CopyReviewItemRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewPolicy.ts`

```text
export function copyReviewCanPublish(input: { state: string; containsSecret: boolean; containsHtmlScript: boolean }): boolean {
  return input.state === "approved" && !input.containsSecret && !input.containsHtmlScript;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/index.ts`

```text
export * from "./copyReviewItemsTypes.js";
export * from "./copyReviewItemsService.js";
export * from "./copyReviewItemsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { ExperienceAuditRecordService } from "./experienceAuditService.js";

export function registerExperienceAuditRecordRoutes(router: Router, service: ExperienceAuditRecordService): void {
  router.get("/pack21/experienceAudit", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/experienceAudit", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditService.ts`

```text
import type { ExperienceAuditRecord, ExperienceAuditRecordRepository } from "./experienceAuditTypes.js";

export class ExperienceAuditRecordService {
  constructor(private readonly repository: ExperienceAuditRecordRepository) {}

  create(record: ExperienceAuditRecord): Promise<ExperienceAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ExperienceAuditRecord>): Promise<ExperienceAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("experienceAudit-not-found");
    return updated;
  }

  list(filter: Partial<ExperienceAuditRecord> = {}, limit = 50): Promise<ExperienceAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditTypes.ts`

```text
export interface ExperienceAuditRecord {
  id: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface ExperienceAuditRecordRepository {
  create(record: ExperienceAuditRecord): Promise<ExperienceAuditRecord>;
  update(id: string, patch: Partial<ExperienceAuditRecord>): Promise<ExperienceAuditRecord | null>;
  list(filter: Partial<ExperienceAuditRecord>, limit: number): Promise<ExperienceAuditRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/index.ts`

```text
export * from "./experienceAuditTypes.js";
export * from "./experienceAuditService.js";
export * from "./experienceAuditRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/index.ts`

```text
export * from "./common/pack21Route.js";
export * from "./common/experienceAdminAuth.js";
export * from "./localizationBundles/localizationBundlePolicy.js";
export * from "./accessibilityAudits/accessibilityAuditPolicy.js";
export * from "./uxExperiments/uxExperimentPolicy.js";
export * from "./copyReviewItems/copyReviewPolicy.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/index.ts`

```text
export * from "./keyboardShortcutProfilesTypes.js";
export * from "./keyboardShortcutProfilesService.js";
export * from "./keyboardShortcutProfilesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { KeyboardShortcutProfileRecordService } from "./keyboardShortcutProfilesService.js";

export function registerKeyboardShortcutProfileRecordRoutes(router: Router, service: KeyboardShortcutProfileRecordService): void {
  router.get("/pack21/keyboardShortcutProfiles", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/keyboardShortcutProfiles", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesService.ts`

```text
import type { KeyboardShortcutProfileRecord, KeyboardShortcutProfileRecordRepository } from "./keyboardShortcutProfilesTypes.js";

export class KeyboardShortcutProfileRecordService {
  constructor(private readonly repository: KeyboardShortcutProfileRecordRepository) {}

  create(record: KeyboardShortcutProfileRecord): Promise<KeyboardShortcutProfileRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<KeyboardShortcutProfileRecord>): Promise<KeyboardShortcutProfileRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("keyboardShortcutProfiles-not-found");
    return updated;
  }

  list(filter: Partial<KeyboardShortcutProfileRecord> = {}, limit = 50): Promise<KeyboardShortcutProfileRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesTypes.ts`

```text
export interface KeyboardShortcutProfileRecord {
  id: string; userId: string; profileName: string; shortcuts: Record<string, string>; updatedAt: string;
}

export interface KeyboardShortcutProfileRecordRepository {
  create(record: KeyboardShortcutProfileRecord): Promise<KeyboardShortcutProfileRecord>;
  update(id: string, patch: Partial<KeyboardShortcutProfileRecord>): Promise<KeyboardShortcutProfileRecord | null>;
  list(filter: Partial<KeyboardShortcutProfileRecord>, limit: number): Promise<KeyboardShortcutProfileRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/index.ts`

```text
export * from "./localePreferencesTypes.js";
export * from "./localePreferencesService.js";
export * from "./localePreferencesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { LocalePreferenceRecordService } from "./localePreferencesService.js";

export function registerLocalePreferenceRecordRoutes(router: Router, service: LocalePreferenceRecordService): void {
  router.get("/pack21/localePreferences", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/localePreferences", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesService.ts`

```text
import type { LocalePreferenceRecord, LocalePreferenceRecordRepository } from "./localePreferencesTypes.js";

export class LocalePreferenceRecordService {
  constructor(private readonly repository: LocalePreferenceRecordRepository) {}

  create(record: LocalePreferenceRecord): Promise<LocalePreferenceRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<LocalePreferenceRecord>): Promise<LocalePreferenceRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("localePreferences-not-found");
    return updated;
  }

  list(filter: Partial<LocalePreferenceRecord> = {}, limit = 50): Promise<LocalePreferenceRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesTypes.ts`

```text
export interface LocalePreferenceRecord {
  id: string; userId: string; locale: string; timeZone: string; updatedAt: string;
}

export interface LocalePreferenceRecordRepository {
  create(record: LocalePreferenceRecord): Promise<LocalePreferenceRecord>;
  update(id: string, patch: Partial<LocalePreferenceRecord>): Promise<LocalePreferenceRecord | null>;
  list(filter: Partial<LocalePreferenceRecord>, limit: number): Promise<LocalePreferenceRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/index.ts`

```text
export * from "./localizationBundlesTypes.js";
export * from "./localizationBundlesService.js";
export * from "./localizationBundlesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlePolicy.ts`

```text
export function localizationBundleCanPublish(input: { approvedTranslations: number; totalTranslations: number; issueCount: number }): { allowed: boolean; reason: string } {
  if (input.issueCount > 0) return { allowed: false, reason: "open-issues" };
  if (input.totalTranslations === 0) return { allowed: false, reason: "empty-bundle" };
  if (input.approvedTranslations / input.totalTranslations < 0.95) return { allowed: false, reason: "approval-threshold" };
  return { allowed: true, reason: "allowed" };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { LocalizationBundleRecordService } from "./localizationBundlesService.js";

export function registerLocalizationBundleRecordRoutes(router: Router, service: LocalizationBundleRecordService): void {
  router.get("/pack21/localizationBundles", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/localizationBundles", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesService.ts`

```text
import type { LocalizationBundleRecord, LocalizationBundleRecordRepository } from "./localizationBundlesTypes.js";

export class LocalizationBundleRecordService {
  constructor(private readonly repository: LocalizationBundleRecordRepository) {}

  create(record: LocalizationBundleRecord): Promise<LocalizationBundleRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<LocalizationBundleRecord>): Promise<LocalizationBundleRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("localizationBundles-not-found");
    return updated;
  }

  list(filter: Partial<LocalizationBundleRecord> = {}, limit = 50): Promise<LocalizationBundleRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesTypes.ts`

```text
export interface LocalizationBundleRecord {
  id: string; locale: string; namespace: string; version: number; published: boolean; updatedAt: string;
}

export interface LocalizationBundleRecordRepository {
  create(record: LocalizationBundleRecord): Promise<LocalizationBundleRecord>;
  update(id: string, patch: Partial<LocalizationBundleRecord>): Promise<LocalizationBundleRecord | null>;
  list(filter: Partial<LocalizationBundleRecord>, limit: number): Promise<LocalizationBundleRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/index.ts`

```text
export * from "./onboardingProgressTypes.js";
export * from "./onboardingProgressService.js";
export * from "./onboardingProgressRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { OnboardingProgressRecordService } from "./onboardingProgressService.js";

export function registerOnboardingProgressRecordRoutes(router: Router, service: OnboardingProgressRecordService): void {
  router.get("/pack21/onboardingProgress", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/onboardingProgress", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressService.ts`

```text
import type { OnboardingProgressRecord, OnboardingProgressRecordRepository } from "./onboardingProgressTypes.js";

export class OnboardingProgressRecordService {
  constructor(private readonly repository: OnboardingProgressRecordRepository) {}

  create(record: OnboardingProgressRecord): Promise<OnboardingProgressRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OnboardingProgressRecord>): Promise<OnboardingProgressRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("onboardingProgress-not-found");
    return updated;
  }

  list(filter: Partial<OnboardingProgressRecord> = {}, limit = 50): Promise<OnboardingProgressRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressTypes.ts`

```text
export interface OnboardingProgressRecord {
  id: string; userId: string; tourKey: string; completedStep: number; completedAt?: string; updatedAt: string;
}

export interface OnboardingProgressRecordRepository {
  create(record: OnboardingProgressRecord): Promise<OnboardingProgressRecord>;
  update(id: string, patch: Partial<OnboardingProgressRecord>): Promise<OnboardingProgressRecord | null>;
  list(filter: Partial<OnboardingProgressRecord>, limit: number): Promise<OnboardingProgressRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/index.ts`

```text
export * from "./onboardingToursTypes.js";
export * from "./onboardingToursService.js";
export * from "./onboardingToursRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { OnboardingTourRecordService } from "./onboardingToursService.js";

export function registerOnboardingTourRecordRoutes(router: Router, service: OnboardingTourRecordService): void {
  router.get("/pack21/onboardingTours", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/onboardingTours", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursService.ts`

```text
import type { OnboardingTourRecord, OnboardingTourRecordRepository } from "./onboardingToursTypes.js";

export class OnboardingTourRecordService {
  constructor(private readonly repository: OnboardingTourRecordRepository) {}

  create(record: OnboardingTourRecord): Promise<OnboardingTourRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OnboardingTourRecord>): Promise<OnboardingTourRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("onboardingTours-not-found");
    return updated;
  }

  list(filter: Partial<OnboardingTourRecord> = {}, limit = 50): Promise<OnboardingTourRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursTypes.ts`

```text
export interface OnboardingTourRecord {
  id: string; key: string; title: string; enabled: boolean; steps: string[]; updatedAt: string;
}

export interface OnboardingTourRecordRepository {
  create(record: OnboardingTourRecord): Promise<OnboardingTourRecord>;
  update(id: string, patch: Partial<OnboardingTourRecord>): Promise<OnboardingTourRecord | null>;
  list(filter: Partial<OnboardingTourRecord>, limit: number): Promise<OnboardingTourRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/index.ts`

```text
export * from "./translationKeysTypes.js";
export * from "./translationKeysService.js";
export * from "./translationKeysRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { TranslationKeyRecordService } from "./translationKeysService.js";

export function registerTranslationKeyRecordRoutes(router: Router, service: TranslationKeyRecordService): void {
  router.get("/pack21/translationKeys", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/translationKeys", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysService.ts`

```text
import type { TranslationKeyRecord, TranslationKeyRecordRepository } from "./translationKeysTypes.js";

export class TranslationKeyRecordService {
  constructor(private readonly repository: TranslationKeyRecordRepository) {}

  create(record: TranslationKeyRecord): Promise<TranslationKeyRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TranslationKeyRecord>): Promise<TranslationKeyRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("translationKeys-not-found");
    return updated;
  }

  list(filter: Partial<TranslationKeyRecord> = {}, limit = 50): Promise<TranslationKeyRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysTypes.ts`

```text
export interface TranslationKeyRecord {
  id: string; namespace: string; key: string; defaultText: string; description?: string; updatedAt: string;
}

export interface TranslationKeyRecordRepository {
  create(record: TranslationKeyRecord): Promise<TranslationKeyRecord>;
  update(id: string, patch: Partial<TranslationKeyRecord>): Promise<TranslationKeyRecord | null>;
  list(filter: Partial<TranslationKeyRecord>, limit: number): Promise<TranslationKeyRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/index.ts`

```text
export * from "./translationReviewsTypes.js";
export * from "./translationReviewsService.js";
export * from "./translationReviewsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { TranslationReviewRecordService } from "./translationReviewsService.js";

export function registerTranslationReviewRecordRoutes(router: Router, service: TranslationReviewRecordService): void {
  router.get("/pack21/translationReviews", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/translationReviews", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsService.ts`

```text
import type { TranslationReviewRecord, TranslationReviewRecordRepository } from "./translationReviewsTypes.js";

export class TranslationReviewRecordService {
  constructor(private readonly repository: TranslationReviewRecordRepository) {}

  create(record: TranslationReviewRecord): Promise<TranslationReviewRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TranslationReviewRecord>): Promise<TranslationReviewRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("translationReviews-not-found");
    return updated;
  }

  list(filter: Partial<TranslationReviewRecord> = {}, limit = 50): Promise<TranslationReviewRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsTypes.ts`

```text
export interface TranslationReviewRecord {
  id: string; locale: string; keyId: string; state: 'draft' | 'reviewed' | 'approved' | 'rejected'; reviewerUserId?: string; updatedAt: string;
}

export interface TranslationReviewRecordRepository {
  create(record: TranslationReviewRecord): Promise<TranslationReviewRecord>;
  update(id: string, patch: Partial<TranslationReviewRecord>): Promise<TranslationReviewRecord | null>;
  list(filter: Partial<TranslationReviewRecord>, limit: number): Promise<TranslationReviewRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/index.ts`

```text
export * from "./uxExperimentsTypes.js";
export * from "./uxExperimentsService.js";
export * from "./uxExperimentsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentPolicy.ts`

```text
export function experimentRolloutAllowed(input: { rolloutPercent: number; enabled: boolean; guardrailPassed: boolean }): { allowed: boolean; reason: string } {
  if (!input.enabled) return { allowed: false, reason: "experiment-disabled" };
  if (!input.guardrailPassed) return { allowed: false, reason: "guardrail-failed" };
  if (input.rolloutPercent < 0 || input.rolloutPercent > 100) return { allowed: false, reason: "invalid-rollout" };
  return { allowed: true, reason: "allowed" };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsRoutes.ts`

```text
import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { UxExperimentRecordService } from "./uxExperimentsService.js";

export function registerUxExperimentRecordRoutes(router: Router, service: UxExperimentRecordService): void {
  router.get("/pack21/uxExperiments", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/uxExperiments", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsService.ts`

```text
import type { UxExperimentRecord, UxExperimentRecordRepository } from "./uxExperimentsTypes.js";

export class UxExperimentRecordService {
  constructor(private readonly repository: UxExperimentRecordRepository) {}

  create(record: UxExperimentRecord): Promise<UxExperimentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<UxExperimentRecord>): Promise<UxExperimentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("uxExperiments-not-found");
    return updated;
  }

  list(filter: Partial<UxExperimentRecord> = {}, limit = 50): Promise<UxExperimentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsTypes.ts`

```text
export interface UxExperimentRecord {
  id: string; key: string; variant: string; enabled: boolean; rolloutPercent: number; updatedAt: string;
}

export interface UxExperimentRecordRepository {
  create(record: UxExperimentRecord): Promise<UxExperimentRecord>;
  update(id: string, patch: Partial<UxExperimentRecord>): Promise<UxExperimentRecord | null>;
  list(filter: Partial<UxExperimentRecord>, limit: number): Promise<UxExperimentRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack21/accessibilityStatusPanel.tsx`

```text
import React from "react";

export function AccessibilityStatusPanel(props: { highIssues: number; criticalIssues: number; reducedMotion: boolean }): JSX.Element {
  return <aside role="status">Accessibility: {props.highIssues} high · {props.criticalIssues} critical · reduced motion {props.reducedMotion ? "on" : "off"}</aside>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack21/index.ts`

```text
export * from "./localeSelector.js";
export * from "./accessibilityStatusPanel.js";
export * from "./keyboardShortcutHelp.js";
export * from "./onboardingTourCard.js";

```


## `REVIEW_REQUIRED/apps/desktop/src/pack21/keyboardShortcutHelp.tsx`

```text
import React from "react";

export function KeyboardShortcutHelp(props: { shortcuts: Array<{ label: string; action: string }> }): JSX.Element {
  return <section><h3>Keyboard shortcuts</h3><ul>{props.shortcuts.map((item) => <li key={item.action}>{item.label}: {item.action}</li>)}</ul></section>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack21/localeSelector.tsx`

```text
import React from "react";

export function LocaleSelector(props: { locale: string; locales: string[]; onChange: (locale: string) => void }): JSX.Element {
  return (
    <label>
      Language
      <select value={props.locale} onChange={(event) => props.onChange(event.currentTarget.value)}>
        {props.locales.map((locale) => <option key={locale} value={locale}>{locale}</option>)}
      </select>
    </label>
  );
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack21/onboardingTourCard.tsx`

```text
import React from "react";

export function OnboardingTourCard(props: { title: string; step: number; total: number; onContinue: () => void }): JSX.Element {
  return <section><h3>{props.title}</h3><p>Step {props.step} of {props.total}</p><button onClick={props.onContinue}>Continue</button></section>;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack21/components/AccessibilityAuditsPage.tsx`

```text
import React from "react";

export interface AccessibilityAuditsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AccessibilityAuditsPage(props: { rows: AccessibilityAuditsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Accessibility audits</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/AccessibilityIssuesPage.tsx`

```text
import React from "react";

export interface AccessibilityIssuesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AccessibilityIssuesPage(props: { rows: AccessibilityIssuesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Accessibility issues</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/CopyReviewItemsPage.tsx`

```text
import React from "react";

export interface CopyReviewItemsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function CopyReviewItemsPage(props: { rows: CopyReviewItemsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Copy review items</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/ExperienceAuditPage.tsx`

```text
import React from "react";

export interface ExperienceAuditPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ExperienceAuditPage(props: { rows: ExperienceAuditPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Experience audit</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/KeyboardShortcutProfilesPage.tsx`

```text
import React from "react";

export interface KeyboardShortcutProfilesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function KeyboardShortcutProfilesPage(props: { rows: KeyboardShortcutProfilesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Keyboard shortcut profiles</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/LocalePreferencesPage.tsx`

```text
import React from "react";

export interface LocalePreferencesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function LocalePreferencesPage(props: { rows: LocalePreferencesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Locale preferences</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/LocalizationBundlesPage.tsx`

```text
import React from "react";

export interface LocalizationBundlesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function LocalizationBundlesPage(props: { rows: LocalizationBundlesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Localization bundles</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/OnboardingProgressPage.tsx`

```text
import React from "react";

export interface OnboardingProgressPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function OnboardingProgressPage(props: { rows: OnboardingProgressPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Onboarding progress</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/OnboardingToursPage.tsx`

```text
import React from "react";

export interface OnboardingToursPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function OnboardingToursPage(props: { rows: OnboardingToursPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Onboarding tours</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/TranslationKeysPage.tsx`

```text
import React from "react";

export interface TranslationKeysPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function TranslationKeysPage(props: { rows: TranslationKeysPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Translation keys</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/TranslationReviewsPage.tsx`

```text
import React from "react";

export interface TranslationReviewsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function TranslationReviewsPage(props: { rows: TranslationReviewsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Translation reviews</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/components/UxExperimentsPage.tsx`

```text
import React from "react";

export interface UxExperimentsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function UxExperimentsPage(props: { rows: UxExperimentsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>UX experiments</h1>
      {props.rows.length === 0 ? <p>No experience records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useAccessibilityAudits.ts`

```text
import { useEffect, useState } from "react";

export interface useAccessibilityAuditsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAccessibilityAudits<T>(loader: () => Promise<T>): useAccessibilityAuditsResult<T> {
  const [state, setState] = useState<useAccessibilityAuditsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useAccessibilityIssues.ts`

```text
import { useEffect, useState } from "react";

export interface useAccessibilityIssuesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAccessibilityIssues<T>(loader: () => Promise<T>): useAccessibilityIssuesResult<T> {
  const [state, setState] = useState<useAccessibilityIssuesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useCopyReviewItems.ts`

```text
import { useEffect, useState } from "react";

export interface useCopyReviewItemsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useCopyReviewItems<T>(loader: () => Promise<T>): useCopyReviewItemsResult<T> {
  const [state, setState] = useState<useCopyReviewItemsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useExperienceAudit.ts`

```text
import { useEffect, useState } from "react";

export interface useExperienceAuditResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useExperienceAudit<T>(loader: () => Promise<T>): useExperienceAuditResult<T> {
  const [state, setState] = useState<useExperienceAuditResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useKeyboardShortcutProfiles.ts`

```text
import { useEffect, useState } from "react";

export interface useKeyboardShortcutProfilesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useKeyboardShortcutProfiles<T>(loader: () => Promise<T>): useKeyboardShortcutProfilesResult<T> {
  const [state, setState] = useState<useKeyboardShortcutProfilesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useLocalePreferences.ts`

```text
import { useEffect, useState } from "react";

export interface useLocalePreferencesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useLocalePreferences<T>(loader: () => Promise<T>): useLocalePreferencesResult<T> {
  const [state, setState] = useState<useLocalePreferencesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useLocalizationBundles.ts`

```text
import { useEffect, useState } from "react";

export interface useLocalizationBundlesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useLocalizationBundles<T>(loader: () => Promise<T>): useLocalizationBundlesResult<T> {
  const [state, setState] = useState<useLocalizationBundlesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useOnboardingProgress.ts`

```text
import { useEffect, useState } from "react";

export interface useOnboardingProgressResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useOnboardingProgress<T>(loader: () => Promise<T>): useOnboardingProgressResult<T> {
  const [state, setState] = useState<useOnboardingProgressResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useOnboardingTours.ts`

```text
import { useEffect, useState } from "react";

export interface useOnboardingToursResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useOnboardingTours<T>(loader: () => Promise<T>): useOnboardingToursResult<T> {
  const [state, setState] = useState<useOnboardingToursResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useTranslationKeys.ts`

```text
import { useEffect, useState } from "react";

export interface useTranslationKeysResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useTranslationKeys<T>(loader: () => Promise<T>): useTranslationKeysResult<T> {
  const [state, setState] = useState<useTranslationKeysResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useTranslationReviews.ts`

```text
import { useEffect, useState } from "react";

export interface useTranslationReviewsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useTranslationReviews<T>(loader: () => Promise<T>): useTranslationReviewsResult<T> {
  const [state, setState] = useState<useTranslationReviewsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/hooks/useUxExperiments.ts`

```text
import { useEffect, useState } from "react";

export interface useUxExperimentsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useUxExperiments<T>(loader: () => Promise<T>): useUxExperimentsResult<T> {
  const [state, setState] = useState<useUxExperimentsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack21/index.ts`

```text
export * from "./components/LocalizationBundlesPage.js";
export * from "./components/TranslationKeysPage.js";
export * from "./components/TranslationReviewsPage.js";
export * from "./components/LocalePreferencesPage.js";
export * from "./components/AccessibilityAuditsPage.js";
export * from "./components/AccessibilityIssuesPage.js";
export * from "./components/KeyboardShortcutProfilesPage.js";
export * from "./components/OnboardingToursPage.js";
export * from "./components/OnboardingProgressPage.js";
export * from "./components/UxExperimentsPage.js";
export * from "./components/CopyReviewItemsPage.js";
export * from "./components/ExperienceAuditPage.js";
export * from "./hooks/useLocalizationBundles.js";
export * from "./hooks/useTranslationKeys.js";
export * from "./hooks/useTranslationReviews.js";
export * from "./hooks/useLocalePreferences.js";
export * from "./hooks/useAccessibilityAudits.js";
export * from "./hooks/useAccessibilityIssues.js";
export * from "./hooks/useKeyboardShortcutProfiles.js";
export * from "./hooks/useOnboardingTours.js";
export * from "./hooks/useOnboardingProgress.js";
export * from "./hooks/useUxExperiments.js";
export * from "./hooks/useCopyReviewItems.js";
export * from "./hooks/useExperienceAudit.js";

```


## `SAFE_DIRECT_COPY/docs/pack21/01-merge-guide.md`

```text
Pack 21 adds localization, translation review, locale preferences, accessibility audits/issues, keyboard shortcut profiles, onboarding tours, UX experiments, copy review and experience audit.

```


## `SAFE_DIRECT_COPY/docs/pack21/02-localization.md`

```text
Locale negotiation supports base-language fallback and RTL direction detection. Published bundles should require approved translations.

```


## `SAFE_DIRECT_COPY/docs/pack21/03-accessibility.md`

```text
High and critical accessibility issues block release. Reduced motion and keyboard access are first-class preferences.

```


## `SAFE_DIRECT_COPY/docs/pack21/04-copy-review.md`

```text
Customer-facing copy requires approval and should block possible secrets or script content before publishing.

```


## `SAFE_DIRECT_COPY/docs/pack21/05-ux-experiments.md`

```text
UX experiments require guardrails before rollout and must stay within 0-100 percent rollout.

```


## `SAFE_DIRECT_COPY/docs/pack21/06-onboarding.md`

```text
Onboarding progress should be user-scoped and resumable. Completion should not affect permissions.

```


## `SAFE_DIRECT_COPY/docs/pack21/07-qa-checklist.md`

```text
Verify locale fallback, RTL rendering, translation approval, accessibility blockers, keyboard shortcuts, onboarding progress and copy review.

```


## `SAFE_DIRECT_COPY/infra/pack21/prometheus-experience-alerts.yml`

```text
groups:
  - name: remotedesk-experience-pack21
    rules:
      - alert: RemoteDeskAccessibilityCriticalIssues
        expr: remotedesk_accessibility_critical_issues_total > 0
        for: 5m
        labels:
          severity: warning
      - alert: RemoteDeskLocalizationPublishFailures
        expr: rate(remotedesk_localization_publish_failures_total[10m]) > 0
        for: 10m
        labels:
          severity: info

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/accessibilityIssue.ts`

```text
export type AccessibilitySeverity = "low" | "medium" | "high" | "critical";

export interface AccessibilityIssue {
  id: string;
  severity: AccessibilitySeverity;
  rule: string;
  message: string;
}

export function accessibilityBlocksRelease(issue: AccessibilityIssue): boolean {
  return issue.severity === "critical" || issue.severity === "high";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/copyReview.ts`

```text
export type CopyReviewState = "draft" | "reviewed" | "approved" | "rejected";

export function copyCanPublish(state: CopyReviewState): boolean {
  return state === "approved";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/index.ts`

```text
export * from "./localeNegotiation.js";
export * from "./rtlLocale.js";
export * from "./pluralRules.js";
export * from "./timezoneFormat.js";
export * from "./accessibilityIssue.js";
export * from "./reducedMotion.js";
export * from "./keyboardShortcut.js";
export * from "./copyReview.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/keyboardShortcut.ts`

```text
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function shortcutToLabel(shortcut: KeyboardShortcut): string {
  return [shortcut.ctrl && "Ctrl", shortcut.meta && "Meta", shortcut.shift && "Shift", shortcut.alt && "Alt", shortcut.key.toUpperCase()].filter(Boolean).join("+");
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/localeNegotiation.ts`

```text
export type SupportedLocale = "en" | "es" | "fr" | "de" | "pt" | "ar" | "ur" | "ja" | "ko" | "zh";

export function normalizeLocale(value: string): string {
  return value.trim().toLowerCase().replace("_", "-");
}

export function chooseSupportedLocale(requested: readonly string[], supported: readonly SupportedLocale[], fallback: SupportedLocale = "en"): SupportedLocale {
  for (const raw of requested) {
    const normalized = normalizeLocale(raw);
    const exact = supported.find((locale) => normalized === locale);
    if (exact) return exact;
    const base = supported.find((locale) => normalized.startsWith(`${locale}-`));
    if (base) return base;
  }
  return fallback;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/pluralRules.ts`

```text
export function formatCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function simplePluralCategory(count: number): "one" | "other" {
  return count === 1 ? "one" : "other";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/reducedMotion.ts`

```text
export interface MotionPreference {
  reduceMotion: boolean;
}

export function animationDurationMs(preference: MotionPreference, defaultMs: number): number {
  return preference.reduceMotion ? 0 : defaultMs;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/rtlLocale.ts`

```text
export function isRtlLocale(locale: string): boolean {
  return ["ar", "he", "fa", "ur"].some((rtl) => locale.toLowerCase() === rtl || locale.toLowerCase().startsWith(`${rtl}-`));
}

export function textDirectionForLocale(locale: string): "ltr" | "rtl" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack21/timezoneFormat.ts`

```text
export interface TimezoneFormatInput {
  iso: string;
  locale: string;
  timeZone: string;
}

export function formatLocalDateTime(input: TimezoneFormatInput): string {
  return new Intl.DateTimeFormat(input.locale, { dateStyle: "medium", timeStyle: "short", timeZone: input.timeZone }).format(new Date(input.iso));
}

```


## `SAFE_DIRECT_COPY/scripts/pack21/check-copy-safety.mjs`

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
      if (/<script|rawToken|rawSecret|rawPassword|disableAccessibility/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("Copy/accessibility safety findings:", bad); process.exit(1); }
console.log("Copy/accessibility safety scanner passed.");

```


## `SAFE_DIRECT_COPY/tests/pack21/accessibilityAuditPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { accessibilityAuditBlocksRelease } from "../../REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditPolicy.js"; assert.equal(accessibilityAuditBlocksRelease({ highIssues: 1, criticalIssues: 0 }), true);

```


## `SAFE_DIRECT_COPY/tests/pack21/accessibilityIssue.test.ts`

```text
import assert from "node:assert/strict"; import { accessibilityBlocksRelease } from "../../packages/shared/src/pack21/accessibilityIssue.js"; assert.equal(accessibilityBlocksRelease({ id: "a", severity: "high", rule: "contrast", message: "bad" }), true);

```


## `SAFE_DIRECT_COPY/tests/pack21/copyReview.test.ts`

```text
import assert from "node:assert/strict"; import { copyCanPublish } from "../../packages/shared/src/pack21/copyReview.js"; assert.equal(copyCanPublish("approved"), true);

```


## `SAFE_DIRECT_COPY/tests/pack21/keyboardShortcut.test.ts`

```text
import assert from "node:assert/strict"; import { shortcutToLabel } from "../../packages/shared/src/pack21/keyboardShortcut.js"; assert.equal(shortcutToLabel({ ctrl: true, key: "k" }), "Ctrl+K");

```


## `SAFE_DIRECT_COPY/tests/pack21/localeNegotiation.test.ts`

```text
import assert from "node:assert/strict"; import { chooseSupportedLocale } from "../../packages/shared/src/pack21/localeNegotiation.js"; assert.equal(chooseSupportedLocale(["ur-PK"], ["en", "ur"]), "ur");

```


## `SAFE_DIRECT_COPY/tests/pack21/localizationBundlePolicy.test.ts`

```text
import assert from "node:assert/strict"; import { localizationBundleCanPublish } from "../../REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlePolicy.js"; assert.equal(localizationBundleCanPublish({ approvedTranslations: 95, totalTranslations: 100, issueCount: 0 }).allowed, true);

```


## `SAFE_DIRECT_COPY/tests/pack21/pluralRules.test.ts`

```text
import assert from "node:assert/strict"; import { formatCountLabel } from "../../packages/shared/src/pack21/pluralRules.js"; assert.equal(formatCountLabel(2, "file", "files"), "2 files");

```


## `SAFE_DIRECT_COPY/tests/pack21/rtlLocale.test.ts`

```text
import assert from "node:assert/strict"; import { textDirectionForLocale } from "../../packages/shared/src/pack21/rtlLocale.js"; assert.equal(textDirectionForLocale("ur-PK"), "rtl"); assert.equal(textDirectionForLocale("en-US"), "ltr");

```


## `SAFE_DIRECT_COPY/tests/pack21/uxExperimentPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { experimentRolloutAllowed } from "../../REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentPolicy.js"; assert.equal(experimentRolloutAllowed({ rolloutPercent: 50, enabled: true, guardrailPassed: true }).allowed, true);

```


## `generated-remotedesk-localization-accessibility-pack-21-code-review.md`

```text
Review locale fallback, RTL handling, translation approval gates, accessibility release blockers, copy review publish policy, UX experiment guardrails, user-scoped onboarding progress and desktop settings integration.

```


## `generated-remotedesk-localization-accessibility-pack-21-manifest.json`

```text
{
  "name": "generated-remotedesk-localization-accessibility-pack-21",
  "createdAt": "2026-06-15T09:07:24.137121+00:00",
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
    "SAFE_DIRECT_COPY/docs/pack21/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack21/02-localization.md",
    "SAFE_DIRECT_COPY/docs/pack21/03-accessibility.md",
    "SAFE_DIRECT_COPY/docs/pack21/04-copy-review.md",
    "SAFE_DIRECT_COPY/docs/pack21/05-ux-experiments.md",
    "SAFE_DIRECT_COPY/docs/pack21/06-onboarding.md",
    "SAFE_DIRECT_COPY/docs/pack21/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack21/prometheus-experience-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/accessibilityIssue.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/copyReview.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/keyboardShortcut.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/localeNegotiation.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/pluralRules.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/reducedMotion.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/rtlLocale.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack21/timezoneFormat.ts",
    "SAFE_DIRECT_COPY/scripts/pack21/check-copy-safety.mjs",
    "SAFE_DIRECT_COPY/tests/pack21/accessibilityAuditPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack21/accessibilityIssue.test.ts",
    "SAFE_DIRECT_COPY/tests/pack21/copyReview.test.ts",
    "SAFE_DIRECT_COPY/tests/pack21/keyboardShortcut.test.ts",
    "SAFE_DIRECT_COPY/tests/pack21/localeNegotiation.test.ts",
    "SAFE_DIRECT_COPY/tests/pack21/localizationBundlePolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack21/pluralRules.test.ts",
    "SAFE_DIRECT_COPY/tests/pack21/rtlLocale.test.ts",
    "SAFE_DIRECT_COPY/tests/pack21/uxExperimentPolicy.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/accessibilityAuditsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityAudits/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/accessibilityIssuesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/accessibilityIssues/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/common/experienceAdminAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/common/pack21Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewItemsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/copyReviewPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/copyReviewItems/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/experienceAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/experienceAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/keyboardShortcutProfiles/keyboardShortcutProfilesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localePreferences/localePreferencesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlePolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/localizationBundles/localizationBundlesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/onboardingProgress/onboardingProgressTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/onboardingTours/onboardingToursTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/translationKeys/translationKeysTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/translationReviews/translationReviewsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack21/uxExperiments/uxExperimentsTypes.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack21/accessibilityStatusPanel.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack21/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack21/keyboardShortcutHelp.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack21/localeSelector.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack21/onboardingTourCard.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/AccessibilityAuditsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/AccessibilityIssuesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/CopyReviewItemsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/ExperienceAuditPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/KeyboardShortcutProfilesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/LocalePreferencesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/LocalizationBundlesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/OnboardingProgressPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/OnboardingToursPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/TranslationKeysPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/TranslationReviewsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/components/UxExperimentsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useAccessibilityAudits.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useAccessibilityIssues.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useCopyReviewItems.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useExperienceAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useKeyboardShortcutProfiles.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useLocalePreferences.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useLocalizationBundles.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useOnboardingProgress.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useOnboardingTours.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useTranslationKeys.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useTranslationReviews.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/hooks/useUxExperiments.ts",
    "REVIEW_REQUIRED/apps/web/src/pack21/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack21.patch.md",
    "PATCHES/desktop-pack21.patch.md",
    "PATCHES/ops-pack21.patch.md",
    "PATCHES/web-pack21.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Translation storage and loading must be wired into the existing frontend i18n layer.",
    "Accessibility audits need a real scanner in CI.",
    "UX experiments need analytics guardrail integration.",
    "No remote shell, unattended access, arbitrary command execution or unsafe native input is included."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 96-99% with prior packs after i18n/a11y tooling and UX QA"
}
```


## `generated-remotedesk-localization-accessibility-pack-21-merge-summary.md`

```text
Pack 21 adds localization bundles, translation keys/reviews, locale preferences, accessibility audits/issues, keyboard shortcut profiles, onboarding tours/progress, UX experiments, copy review, experience audit, web/desktop UI, docs/tests/scripts.

```


## `generated-remotedesk-localization-accessibility-pack-21-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| Broken RTL layout | Medium | direction-aware UI QA |
| Inaccessible release | High | high/critical a11y blockers |
| Unreviewed copy published | Medium | copy approval gate |
| Bad experiment rollout | Medium | guardrail policy |
| Locale data leak | Low | namespace and role review |

```


## `generated-remotedesk-localization-accessibility-pack-21-test-plan.md`

```text
Run Pack 21 shared/API/desktop tests, copy/accessibility scanner, then manual QA for locale selector, RTL pages, translation review, accessibility audit blockers, shortcut help, onboarding tours and UX experiment guardrails.

```
