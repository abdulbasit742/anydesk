# generated-remotedesk-automation-rules-pack-18 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack18.patch.md
PATCHES/desktop-pack18.patch.md
PATCHES/ops-pack18.patch.md
PATCHES/web-pack18.patch.md
REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsService.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationActions/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsService.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersService.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxService.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/eventDedupPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsService.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsService.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/rateLimitPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesService.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/automationRules/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/common/automationAdminAuth.ts
REVIEW_REQUIRED/apps/api/src/pack18/common/pack18Route.ts
REVIEW_REQUIRED/apps/api/src/pack18/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesService.ts
REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsService.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsService.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/index.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesService.ts
REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesTypes.ts
REVIEW_REQUIRED/apps/desktop/src/pack18/automationNotificationPanel.tsx
REVIEW_REQUIRED/apps/desktop/src/pack18/automationStatusBadge.tsx
REVIEW_REQUIRED/apps/desktop/src/pack18/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack18/safeActionNotice.tsx
REVIEW_REQUIRED/apps/desktop/src/pack18/workflowApprovalPrompt.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationActionsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationConditionsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationDeadLettersPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationEventInboxPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationMetricsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationRulesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/NotificationRoutesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/RuleBuilderPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/RuleChangeAuditPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowApprovalsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowRunsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowTemplatesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationActions.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationConditions.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationDeadLetters.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationEventInbox.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationMetrics.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationRateLimits.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationRules.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useNotificationRoutes.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useRuleChangeAudit.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowApprovals.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowRuns.ts
REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowTemplates.ts
REVIEW_REQUIRED/apps/web/src/pack18/index.ts
SAFE_DIRECT_COPY/docs/pack18/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack18/02-safe-actions.md
SAFE_DIRECT_COPY/docs/pack18/03-approvals.md
SAFE_DIRECT_COPY/docs/pack18/04-event-inbox.md
SAFE_DIRECT_COPY/docs/pack18/05-rate-limits.md
SAFE_DIRECT_COPY/docs/pack18/06-rule-builder.md
SAFE_DIRECT_COPY/docs/pack18/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack18/prometheus-automation-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack18/automationAction.ts
SAFE_DIRECT_COPY/packages/shared/src/pack18/automationCondition.ts
SAFE_DIRECT_COPY/packages/shared/src/pack18/automationTrigger.ts
SAFE_DIRECT_COPY/packages/shared/src/pack18/idempotencyKey.ts
SAFE_DIRECT_COPY/packages/shared/src/pack18/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack18/notificationRouter.ts
SAFE_DIRECT_COPY/packages/shared/src/pack18/ruleValidator.ts
SAFE_DIRECT_COPY/packages/shared/src/pack18/workflowApproval.ts
SAFE_DIRECT_COPY/packages/shared/src/pack18/workflowRunStatus.ts
SAFE_DIRECT_COPY/scripts/pack18/check-automation-safe-actions.mjs
SAFE_DIRECT_COPY/tests/pack18/automationAction.test.ts
SAFE_DIRECT_COPY/tests/pack18/automationActionPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack18/automationCondition.test.ts
SAFE_DIRECT_COPY/tests/pack18/automationTrigger.test.ts
SAFE_DIRECT_COPY/tests/pack18/notificationRouter.test.ts
SAFE_DIRECT_COPY/tests/pack18/rateLimitPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack18/ruleValidator.test.ts
SAFE_DIRECT_COPY/tests/pack18/workflowApproval.test.ts
SAFE_DIRECT_COPY/tests/pack18/workflowRunPolicy.test.ts
generated-remotedesk-automation-rules-pack-18-code-review.md
generated-remotedesk-automation-rules-pack-18-manifest.json
generated-remotedesk-automation-rules-pack-18-merge-summary.md
generated-remotedesk-automation-rules-pack-18-risk-register.md
generated-remotedesk-automation-rules-pack-18-test-plan.md

```


## `PATCHES/api-pack18.patch.md`

```text
Mount Pack 18 automation routes behind owner/admin automation permissions. Enforce team scope in repositories. Keep actions strictly allowlisted.

```


## `PATCHES/desktop-pack18.patch.md`

```text
Wire automation notifications and approval prompts into desktop notification center. Do not execute arbitrary commands from automation events.

```


## `PATCHES/ops-pack18.patch.md`

```text
Run safe-action scanner in CI. Enable Prometheus rules only after automation metrics are emitted.

```


## `PATCHES/web-pack18.patch.md`

```text
Mount rule builder and workflow pages in admin settings. Treat client-side validation as UX only; server validation is required.

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionPolicy.ts`

```text
const SAFE_ACTIONS = new Set(["send_notification", "create_support_ticket", "add_audit_note", "request_approval", "tag_device", "disable_file_transfer", "require_mfa"]);

export function validateAutomationAction(action: string): { ok: true } | { ok: false; reason: string } {
  if (!SAFE_ACTIONS.has(action)) return { ok: false, reason: "unsupported-action" };
  return { ok: true };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { AutomationActionRecordService } from "./automationActionsService.js";

export function registerAutomationActionRecordRoutes(router: Router, service: AutomationActionRecordService): void {
  router.get("/pack18/automationActions", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/automationActions", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsService.ts`

```text
import type { AutomationActionRecord, AutomationActionRecordRepository } from "./automationActionsTypes.js";

export class AutomationActionRecordService {
  constructor(private readonly repository: AutomationActionRecordRepository) {}

  create(record: AutomationActionRecord): Promise<AutomationActionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationActionRecord>): Promise<AutomationActionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationActions-not-found");
    return updated;
  }

  list(filter: Partial<AutomationActionRecord> = {}, limit = 50): Promise<AutomationActionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsTypes.ts`

```text
export interface AutomationActionRecord {
  id: string; ruleId: string; action: string; config: Record<string, unknown>;
}

export interface AutomationActionRecordRepository {
  create(record: AutomationActionRecord): Promise<AutomationActionRecord>;
  update(id: string, patch: Partial<AutomationActionRecord>): Promise<AutomationActionRecord | null>;
  list(filter: Partial<AutomationActionRecord>, limit: number): Promise<AutomationActionRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationActions/index.ts`

```text
export * from "./automationActionsTypes.js";
export * from "./automationActionsService.js";
export * from "./automationActionsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { AutomationConditionRecordService } from "./automationConditionsService.js";

export function registerAutomationConditionRecordRoutes(router: Router, service: AutomationConditionRecordService): void {
  router.get("/pack18/automationConditions", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/automationConditions", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsService.ts`

```text
import type { AutomationConditionRecord, AutomationConditionRecordRepository } from "./automationConditionsTypes.js";

export class AutomationConditionRecordService {
  constructor(private readonly repository: AutomationConditionRecordRepository) {}

  create(record: AutomationConditionRecord): Promise<AutomationConditionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationConditionRecord>): Promise<AutomationConditionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationConditions-not-found");
    return updated;
  }

  list(filter: Partial<AutomationConditionRecord> = {}, limit = 50): Promise<AutomationConditionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsTypes.ts`

```text
export interface AutomationConditionRecord {
  id: string; ruleId: string; field: string; operator: string; value: string;
}

export interface AutomationConditionRecordRepository {
  create(record: AutomationConditionRecord): Promise<AutomationConditionRecord>;
  update(id: string, patch: Partial<AutomationConditionRecord>): Promise<AutomationConditionRecord | null>;
  list(filter: Partial<AutomationConditionRecord>, limit: number): Promise<AutomationConditionRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/index.ts`

```text
export * from "./automationConditionsTypes.js";
export * from "./automationConditionsService.js";
export * from "./automationConditionsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { AutomationDeadLetterRecordService } from "./automationDeadLettersService.js";

export function registerAutomationDeadLetterRecordRoutes(router: Router, service: AutomationDeadLetterRecordService): void {
  router.get("/pack18/automationDeadLetters", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/automationDeadLetters", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersService.ts`

```text
import type { AutomationDeadLetterRecord, AutomationDeadLetterRecordRepository } from "./automationDeadLettersTypes.js";

export class AutomationDeadLetterRecordService {
  constructor(private readonly repository: AutomationDeadLetterRecordRepository) {}

  create(record: AutomationDeadLetterRecord): Promise<AutomationDeadLetterRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationDeadLetterRecord>): Promise<AutomationDeadLetterRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationDeadLetters-not-found");
    return updated;
  }

  list(filter: Partial<AutomationDeadLetterRecord> = {}, limit = 50): Promise<AutomationDeadLetterRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersTypes.ts`

```text
export interface AutomationDeadLetterRecord {
  id: string; teamId: string; ruleId?: string; eventId: string; reason: string; createdAt: string;
}

export interface AutomationDeadLetterRecordRepository {
  create(record: AutomationDeadLetterRecord): Promise<AutomationDeadLetterRecord>;
  update(id: string, patch: Partial<AutomationDeadLetterRecord>): Promise<AutomationDeadLetterRecord | null>;
  list(filter: Partial<AutomationDeadLetterRecord>, limit: number): Promise<AutomationDeadLetterRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/index.ts`

```text
export * from "./automationDeadLettersTypes.js";
export * from "./automationDeadLettersService.js";
export * from "./automationDeadLettersRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { AutomationEventInboxRecordService } from "./automationEventInboxService.js";

export function registerAutomationEventInboxRecordRoutes(router: Router, service: AutomationEventInboxRecordService): void {
  router.get("/pack18/automationEventInbox", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/automationEventInbox", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxService.ts`

```text
import type { AutomationEventInboxRecord, AutomationEventInboxRecordRepository } from "./automationEventInboxTypes.js";

export class AutomationEventInboxRecordService {
  constructor(private readonly repository: AutomationEventInboxRecordRepository) {}

  create(record: AutomationEventInboxRecord): Promise<AutomationEventInboxRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationEventInboxRecord>): Promise<AutomationEventInboxRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationEventInbox-not-found");
    return updated;
  }

  list(filter: Partial<AutomationEventInboxRecord> = {}, limit = 50): Promise<AutomationEventInboxRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxTypes.ts`

```text
export interface AutomationEventInboxRecord {
  id: string; teamId: string; eventType: string; eventId: string; receivedAt: string; processedAt?: string;
}

export interface AutomationEventInboxRecordRepository {
  create(record: AutomationEventInboxRecord): Promise<AutomationEventInboxRecord>;
  update(id: string, patch: Partial<AutomationEventInboxRecord>): Promise<AutomationEventInboxRecord | null>;
  list(filter: Partial<AutomationEventInboxRecord>, limit: number): Promise<AutomationEventInboxRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/eventDedupPolicy.ts`

```text
export function automationEventDedupKey(teamId: string, eventType: string, eventId: string): string {
  return `${teamId}:${eventType}:${eventId}`.slice(0, 220);
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/index.ts`

```text
export * from "./automationEventInboxTypes.js";
export * from "./automationEventInboxService.js";
export * from "./automationEventInboxRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { AutomationMetricRecordService } from "./automationMetricsService.js";

export function registerAutomationMetricRecordRoutes(router: Router, service: AutomationMetricRecordService): void {
  router.get("/pack18/automationMetrics", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/automationMetrics", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsService.ts`

```text
import type { AutomationMetricRecord, AutomationMetricRecordRepository } from "./automationMetricsTypes.js";

export class AutomationMetricRecordService {
  constructor(private readonly repository: AutomationMetricRecordRepository) {}

  create(record: AutomationMetricRecord): Promise<AutomationMetricRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationMetricRecord>): Promise<AutomationMetricRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationMetrics-not-found");
    return updated;
  }

  list(filter: Partial<AutomationMetricRecord> = {}, limit = 50): Promise<AutomationMetricRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsTypes.ts`

```text
export interface AutomationMetricRecord {
  id: string; teamId: string; ruleId?: string; runs: number; failures: number; windowStart: string; windowEnd: string;
}

export interface AutomationMetricRecordRepository {
  create(record: AutomationMetricRecord): Promise<AutomationMetricRecord>;
  update(id: string, patch: Partial<AutomationMetricRecord>): Promise<AutomationMetricRecord | null>;
  list(filter: Partial<AutomationMetricRecord>, limit: number): Promise<AutomationMetricRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/index.ts`

```text
export * from "./automationMetricsTypes.js";
export * from "./automationMetricsService.js";
export * from "./automationMetricsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { AutomationRateLimitRecordService } from "./automationRateLimitsService.js";

export function registerAutomationRateLimitRecordRoutes(router: Router, service: AutomationRateLimitRecordService): void {
  router.get("/pack18/automationRateLimits", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/automationRateLimits", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsService.ts`

```text
import type { AutomationRateLimitRecord, AutomationRateLimitRecordRepository } from "./automationRateLimitsTypes.js";

export class AutomationRateLimitRecordService {
  constructor(private readonly repository: AutomationRateLimitRecordRepository) {}

  create(record: AutomationRateLimitRecord): Promise<AutomationRateLimitRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationRateLimitRecord>): Promise<AutomationRateLimitRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationRateLimits-not-found");
    return updated;
  }

  list(filter: Partial<AutomationRateLimitRecord> = {}, limit = 50): Promise<AutomationRateLimitRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsTypes.ts`

```text
export interface AutomationRateLimitRecord {
  id: string; teamId: string; ruleId: string; perMinute: number; enabled: boolean; updatedAt: string;
}

export interface AutomationRateLimitRecordRepository {
  create(record: AutomationRateLimitRecord): Promise<AutomationRateLimitRecord>;
  update(id: string, patch: Partial<AutomationRateLimitRecord>): Promise<AutomationRateLimitRecord | null>;
  list(filter: Partial<AutomationRateLimitRecord>, limit: number): Promise<AutomationRateLimitRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/index.ts`

```text
export * from "./automationRateLimitsTypes.js";
export * from "./automationRateLimitsService.js";
export * from "./automationRateLimitsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/rateLimitPolicy.ts`

```text
export function automationRateLimitExceeded(input: { perMinute: number; usedThisMinute: number; enabled: boolean }): boolean {
  if (!input.enabled) return false;
  return input.usedThisMinute >= input.perMinute;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { AutomationRuleRecordService } from "./automationRulesService.js";

export function registerAutomationRuleRecordRoutes(router: Router, service: AutomationRuleRecordService): void {
  router.get("/pack18/automationRules", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/automationRules", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesService.ts`

```text
import type { AutomationRuleRecord, AutomationRuleRecordRepository } from "./automationRulesTypes.js";

export class AutomationRuleRecordService {
  constructor(private readonly repository: AutomationRuleRecordRepository) {}

  create(record: AutomationRuleRecord): Promise<AutomationRuleRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationRuleRecord>): Promise<AutomationRuleRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationRules-not-found");
    return updated;
  }

  list(filter: Partial<AutomationRuleRecord> = {}, limit = 50): Promise<AutomationRuleRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesTypes.ts`

```text
export interface AutomationRuleRecord {
  id: string; teamId: string; name: string; trigger: string; enabled: boolean; createdByUserId: string; updatedAt: string;
}

export interface AutomationRuleRecordRepository {
  create(record: AutomationRuleRecord): Promise<AutomationRuleRecord>;
  update(id: string, patch: Partial<AutomationRuleRecord>): Promise<AutomationRuleRecord | null>;
  list(filter: Partial<AutomationRuleRecord>, limit: number): Promise<AutomationRuleRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/automationRules/index.ts`

```text
export * from "./automationRulesTypes.js";
export * from "./automationRulesService.js";
export * from "./automationRulesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/common/automationAdminAuth.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function requireAutomationAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("automation:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "automation_admin_required" });
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/common/pack18Route.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function pack18Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/index.ts`

```text
export * from "./common/pack18Route.js";
export * from "./common/automationAdminAuth.js";
export * from "./automationActions/automationActionPolicy.js";
export * from "./workflowRuns/workflowRunPolicy.js";
export * from "./automationEventInbox/eventDedupPolicy.js";
export * from "./automationRateLimits/rateLimitPolicy.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/index.ts`

```text
export * from "./notificationRoutesTypes.js";
export * from "./notificationRoutesService.js";
export * from "./notificationRoutesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { NotificationRouteRecordService } from "./notificationRoutesService.js";

export function registerNotificationRouteRecordRoutes(router: Router, service: NotificationRouteRecordService): void {
  router.get("/pack18/notificationRoutes", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/notificationRoutes", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesService.ts`

```text
import type { NotificationRouteRecord, NotificationRouteRecordRepository } from "./notificationRoutesTypes.js";

export class NotificationRouteRecordService {
  constructor(private readonly repository: NotificationRouteRecordRepository) {}

  create(record: NotificationRouteRecord): Promise<NotificationRouteRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<NotificationRouteRecord>): Promise<NotificationRouteRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("notificationRoutes-not-found");
    return updated;
  }

  list(filter: Partial<NotificationRouteRecord> = {}, limit = 50): Promise<NotificationRouteRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesTypes.ts`

```text
export interface NotificationRouteRecord {
  id: string; teamId: string; eventType: string; targetRole: string; enabled: boolean;
}

export interface NotificationRouteRecordRepository {
  create(record: NotificationRouteRecord): Promise<NotificationRouteRecord>;
  update(id: string, patch: Partial<NotificationRouteRecord>): Promise<NotificationRouteRecord | null>;
  list(filter: Partial<NotificationRouteRecord>, limit: number): Promise<NotificationRouteRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/index.ts`

```text
export * from "./ruleChangeAuditTypes.js";
export * from "./ruleChangeAuditService.js";
export * from "./ruleChangeAuditRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { RuleChangeAuditRecordService } from "./ruleChangeAuditService.js";

export function registerRuleChangeAuditRecordRoutes(router: Router, service: RuleChangeAuditRecordService): void {
  router.get("/pack18/ruleChangeAudit", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/ruleChangeAudit", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditService.ts`

```text
import type { RuleChangeAuditRecord, RuleChangeAuditRecordRepository } from "./ruleChangeAuditTypes.js";

export class RuleChangeAuditRecordService {
  constructor(private readonly repository: RuleChangeAuditRecordRepository) {}

  create(record: RuleChangeAuditRecord): Promise<RuleChangeAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<RuleChangeAuditRecord>): Promise<RuleChangeAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("ruleChangeAudit-not-found");
    return updated;
  }

  list(filter: Partial<RuleChangeAuditRecord> = {}, limit = 50): Promise<RuleChangeAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditTypes.ts`

```text
export interface RuleChangeAuditRecord {
  id: string; teamId: string; ruleId: string; actorUserId: string; action: string; occurredAt: string;
}

export interface RuleChangeAuditRecordRepository {
  create(record: RuleChangeAuditRecord): Promise<RuleChangeAuditRecord>;
  update(id: string, patch: Partial<RuleChangeAuditRecord>): Promise<RuleChangeAuditRecord | null>;
  list(filter: Partial<RuleChangeAuditRecord>, limit: number): Promise<RuleChangeAuditRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/index.ts`

```text
export * from "./workflowApprovalsTypes.js";
export * from "./workflowApprovalsService.js";
export * from "./workflowApprovalsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { WorkflowApprovalRecordService } from "./workflowApprovalsService.js";

export function registerWorkflowApprovalRecordRoutes(router: Router, service: WorkflowApprovalRecordService): void {
  router.get("/pack18/workflowApprovals", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/workflowApprovals", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsService.ts`

```text
import type { WorkflowApprovalRecord, WorkflowApprovalRecordRepository } from "./workflowApprovalsTypes.js";

export class WorkflowApprovalRecordService {
  constructor(private readonly repository: WorkflowApprovalRecordRepository) {}

  create(record: WorkflowApprovalRecord): Promise<WorkflowApprovalRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WorkflowApprovalRecord>): Promise<WorkflowApprovalRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("workflowApprovals-not-found");
    return updated;
  }

  list(filter: Partial<WorkflowApprovalRecord> = {}, limit = 50): Promise<WorkflowApprovalRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsTypes.ts`

```text
export interface WorkflowApprovalRecord {
  id: string; runId: string; state: 'pending' | 'approved' | 'rejected' | 'expired'; requestedByUserId: string; approverUserId?: string; createdAt: string;
}

export interface WorkflowApprovalRecordRepository {
  create(record: WorkflowApprovalRecord): Promise<WorkflowApprovalRecord>;
  update(id: string, patch: Partial<WorkflowApprovalRecord>): Promise<WorkflowApprovalRecord | null>;
  list(filter: Partial<WorkflowApprovalRecord>, limit: number): Promise<WorkflowApprovalRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/index.ts`

```text
export * from "./workflowRunsTypes.js";
export * from "./workflowRunsService.js";
export * from "./workflowRunsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunPolicy.ts`

```text
export function workflowRunCanStart(input: { ruleEnabled: boolean; rateLimited: boolean; approvalRequired: boolean; approvalApproved: boolean }): { allowed: boolean; reason: string } {
  if (!input.ruleEnabled) return { allowed: false, reason: "rule-disabled" };
  if (input.rateLimited) return { allowed: false, reason: "rate-limited" };
  if (input.approvalRequired && !input.approvalApproved) return { allowed: false, reason: "approval-required" };
  return { allowed: true, reason: "allowed" };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { WorkflowRunRecordService } from "./workflowRunsService.js";

export function registerWorkflowRunRecordRoutes(router: Router, service: WorkflowRunRecordService): void {
  router.get("/pack18/workflowRuns", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/workflowRuns", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsService.ts`

```text
import type { WorkflowRunRecord, WorkflowRunRecordRepository } from "./workflowRunsTypes.js";

export class WorkflowRunRecordService {
  constructor(private readonly repository: WorkflowRunRecordRepository) {}

  create(record: WorkflowRunRecord): Promise<WorkflowRunRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WorkflowRunRecord>): Promise<WorkflowRunRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("workflowRuns-not-found");
    return updated;
  }

  list(filter: Partial<WorkflowRunRecord> = {}, limit = 50): Promise<WorkflowRunRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsTypes.ts`

```text
export interface WorkflowRunRecord {
  id: string; ruleId: string; eventId: string; status: 'queued' | 'running' | 'completed' | 'failed' | 'skipped'; startedAt?: string; finishedAt?: string;
}

export interface WorkflowRunRecordRepository {
  create(record: WorkflowRunRecord): Promise<WorkflowRunRecord>;
  update(id: string, patch: Partial<WorkflowRunRecord>): Promise<WorkflowRunRecord | null>;
  list(filter: Partial<WorkflowRunRecord>, limit: number): Promise<WorkflowRunRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/index.ts`

```text
export * from "./workflowTemplatesTypes.js";
export * from "./workflowTemplatesService.js";
export * from "./workflowTemplatesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesRoutes.ts`

```text
import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { WorkflowTemplateRecordService } from "./workflowTemplatesService.js";

export function registerWorkflowTemplateRecordRoutes(router: Router, service: WorkflowTemplateRecordService): void {
  router.get("/pack18/workflowTemplates", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/workflowTemplates", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesService.ts`

```text
import type { WorkflowTemplateRecord, WorkflowTemplateRecordRepository } from "./workflowTemplatesTypes.js";

export class WorkflowTemplateRecordService {
  constructor(private readonly repository: WorkflowTemplateRecordRepository) {}

  create(record: WorkflowTemplateRecord): Promise<WorkflowTemplateRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WorkflowTemplateRecord>): Promise<WorkflowTemplateRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("workflowTemplates-not-found");
    return updated;
  }

  list(filter: Partial<WorkflowTemplateRecord> = {}, limit = 50): Promise<WorkflowTemplateRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesTypes.ts`

```text
export interface WorkflowTemplateRecord {
  id: string; key: string; title: string; trigger: string; actions: string[]; enabled: boolean;
}

export interface WorkflowTemplateRecordRepository {
  create(record: WorkflowTemplateRecord): Promise<WorkflowTemplateRecord>;
  update(id: string, patch: Partial<WorkflowTemplateRecord>): Promise<WorkflowTemplateRecord | null>;
  list(filter: Partial<WorkflowTemplateRecord>, limit: number): Promise<WorkflowTemplateRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack18/automationNotificationPanel.tsx`

```text
import React from "react";

export function AutomationNotificationPanel(props: { notifications: Array<{ id: string; title: string; status: string }>; onOpen: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h3>Automation notifications</h3>
      <ul>{props.notifications.map((item) => <li key={item.id}>{item.title} · {item.status} <button onClick={() => props.onOpen(item.id)}>Open</button></li>)}</ul>
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack18/automationStatusBadge.tsx`

```text
import React from "react";

export function AutomationStatusBadge(props: { enabled: boolean; failedRuns: number }): JSX.Element {
  return <span data-automation-enabled={props.enabled}>Automation: {props.enabled ? "enabled" : "disabled"} · failed runs {props.failedRuns}</span>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack18/index.ts`

```text
export * from "./automationNotificationPanel.js";
export * from "./workflowApprovalPrompt.js";
export * from "./automationStatusBadge.js";
export * from "./safeActionNotice.js";

```


## `REVIEW_REQUIRED/apps/desktop/src/pack18/safeActionNotice.tsx`

```text
import React from "react";

export function SafeActionNotice(props: { action: string; reason: string }): JSX.Element {
  return <aside role="status"><strong>Automation action blocked</strong><p>{props.action}: {props.reason}</p></aside>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack18/workflowApprovalPrompt.tsx`

```text
import React from "react";

export function WorkflowApprovalPrompt(props: { title: string; onApprove: () => void; onReject: () => void }): JSX.Element {
  return (
    <section role="dialog" aria-label="Workflow approval">
      <h3>{props.title}</h3>
      <button type="button" onClick={props.onApprove}>Approve</button>
      <button type="button" onClick={props.onReject}>Reject</button>
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationActionsPage.tsx`

```text
import React from "react";

export interface AutomationActionsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AutomationActionsPage(props: { rows: AutomationActionsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Automation actions</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationConditionsPage.tsx`

```text
import React from "react";

export interface AutomationConditionsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AutomationConditionsPage(props: { rows: AutomationConditionsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Automation conditions</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationDeadLettersPage.tsx`

```text
import React from "react";

export interface AutomationDeadLettersPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AutomationDeadLettersPage(props: { rows: AutomationDeadLettersPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Automation dead letters</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationEventInboxPage.tsx`

```text
import React from "react";

export interface AutomationEventInboxPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AutomationEventInboxPage(props: { rows: AutomationEventInboxPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Automation event inbox</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationMetricsPage.tsx`

```text
import React from "react";

export interface AutomationMetricsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AutomationMetricsPage(props: { rows: AutomationMetricsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Automation metrics</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationRulesPage.tsx`

```text
import React from "react";

export interface AutomationRulesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AutomationRulesPage(props: { rows: AutomationRulesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Automation rules</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/NotificationRoutesPage.tsx`

```text
import React from "react";

export interface NotificationRoutesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function NotificationRoutesPage(props: { rows: NotificationRoutesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Notification routes</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/RuleBuilderPage.tsx`

```text
import React from "react";

export interface RuleBuilderPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function RuleBuilderPage(props: { rows: RuleBuilderPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Rule builder</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/RuleChangeAuditPage.tsx`

```text
import React from "react";

export interface RuleChangeAuditPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function RuleChangeAuditPage(props: { rows: RuleChangeAuditPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Rule change audit</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowApprovalsPage.tsx`

```text
import React from "react";

export interface WorkflowApprovalsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function WorkflowApprovalsPage(props: { rows: WorkflowApprovalsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Workflow approvals</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowRunsPage.tsx`

```text
import React from "react";

export interface WorkflowRunsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function WorkflowRunsPage(props: { rows: WorkflowRunsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Workflow runs</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowTemplatesPage.tsx`

```text
import React from "react";

export interface WorkflowTemplatesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function WorkflowTemplatesPage(props: { rows: WorkflowTemplatesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Workflow templates</h1>
      {props.rows.length === 0 ? <p>No automation records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationActions.ts`

```text
import { useEffect, useState } from "react";

export interface useAutomationActionsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAutomationActions<T>(loader: () => Promise<T>): useAutomationActionsResult<T> {
  const [state, setState] = useState<useAutomationActionsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationConditions.ts`

```text
import { useEffect, useState } from "react";

export interface useAutomationConditionsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAutomationConditions<T>(loader: () => Promise<T>): useAutomationConditionsResult<T> {
  const [state, setState] = useState<useAutomationConditionsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationDeadLetters.ts`

```text
import { useEffect, useState } from "react";

export interface useAutomationDeadLettersResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAutomationDeadLetters<T>(loader: () => Promise<T>): useAutomationDeadLettersResult<T> {
  const [state, setState] = useState<useAutomationDeadLettersResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationEventInbox.ts`

```text
import { useEffect, useState } from "react";

export interface useAutomationEventInboxResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAutomationEventInbox<T>(loader: () => Promise<T>): useAutomationEventInboxResult<T> {
  const [state, setState] = useState<useAutomationEventInboxResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationMetrics.ts`

```text
import { useEffect, useState } from "react";

export interface useAutomationMetricsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAutomationMetrics<T>(loader: () => Promise<T>): useAutomationMetricsResult<T> {
  const [state, setState] = useState<useAutomationMetricsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationRateLimits.ts`

```text
import { useEffect, useState } from "react";

export interface useAutomationRateLimitsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAutomationRateLimits<T>(loader: () => Promise<T>): useAutomationRateLimitsResult<T> {
  const [state, setState] = useState<useAutomationRateLimitsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationRules.ts`

```text
import { useEffect, useState } from "react";

export interface useAutomationRulesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAutomationRules<T>(loader: () => Promise<T>): useAutomationRulesResult<T> {
  const [state, setState] = useState<useAutomationRulesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useNotificationRoutes.ts`

```text
import { useEffect, useState } from "react";

export interface useNotificationRoutesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useNotificationRoutes<T>(loader: () => Promise<T>): useNotificationRoutesResult<T> {
  const [state, setState] = useState<useNotificationRoutesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useRuleChangeAudit.ts`

```text
import { useEffect, useState } from "react";

export interface useRuleChangeAuditResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useRuleChangeAudit<T>(loader: () => Promise<T>): useRuleChangeAuditResult<T> {
  const [state, setState] = useState<useRuleChangeAuditResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowApprovals.ts`

```text
import { useEffect, useState } from "react";

export interface useWorkflowApprovalsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useWorkflowApprovals<T>(loader: () => Promise<T>): useWorkflowApprovalsResult<T> {
  const [state, setState] = useState<useWorkflowApprovalsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowRuns.ts`

```text
import { useEffect, useState } from "react";

export interface useWorkflowRunsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useWorkflowRuns<T>(loader: () => Promise<T>): useWorkflowRunsResult<T> {
  const [state, setState] = useState<useWorkflowRunsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowTemplates.ts`

```text
import { useEffect, useState } from "react";

export interface useWorkflowTemplatesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useWorkflowTemplates<T>(loader: () => Promise<T>): useWorkflowTemplatesResult<T> {
  const [state, setState] = useState<useWorkflowTemplatesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack18/index.ts`

```text
export * from "./components/AutomationRulesPage.js";
export * from "./components/RuleBuilderPage.js";
export * from "./components/AutomationConditionsPage.js";
export * from "./components/AutomationActionsPage.js";
export * from "./components/WorkflowRunsPage.js";
export * from "./components/WorkflowApprovalsPage.js";
export * from "./components/AutomationEventInboxPage.js";
export * from "./components/NotificationRoutesPage.js";
export * from "./components/RuleChangeAuditPage.js";
export * from "./components/AutomationDeadLettersPage.js";
export * from "./components/WorkflowTemplatesPage.js";
export * from "./components/AutomationMetricsPage.js";
export * from "./hooks/useAutomationRules.js";
export * from "./hooks/useAutomationConditions.js";
export * from "./hooks/useAutomationActions.js";
export * from "./hooks/useWorkflowRuns.js";
export * from "./hooks/useWorkflowApprovals.js";
export * from "./hooks/useAutomationEventInbox.js";
export * from "./hooks/useNotificationRoutes.js";
export * from "./hooks/useRuleChangeAudit.js";
export * from "./hooks/useAutomationDeadLetters.js";
export * from "./hooks/useAutomationRateLimits.js";
export * from "./hooks/useWorkflowTemplates.js";
export * from "./hooks/useAutomationMetrics.js";

```


## `SAFE_DIRECT_COPY/docs/pack18/01-merge-guide.md`

```text
Pack 18 adds automation rules, condition/action models, workflow runs, approvals, event inbox, notification routing, dead letters, rate limits, templates, metrics and rule builder UI.

```


## `SAFE_DIRECT_COPY/docs/pack18/02-safe-actions.md`

```text
Automation actions are allowlisted: notify, support ticket, audit note, approval request, tag device, disable file transfer, require MFA. No arbitrary code or shell execution.

```


## `SAFE_DIRECT_COPY/docs/pack18/03-approvals.md`

```text
Sensitive workflows should require approval before running. Approval states are final once approved, rejected or expired.

```


## `SAFE_DIRECT_COPY/docs/pack18/04-event-inbox.md`

```text
Event inbox should deduplicate by team, event type and event ID. Failed events should go to dead letters with reason.

```


## `SAFE_DIRECT_COPY/docs/pack18/05-rate-limits.md`

```text
Rule-level rate limits prevent notification storms and repeated actions.

```


## `SAFE_DIRECT_COPY/docs/pack18/06-rule-builder.md`

```text
The rule builder should validate triggers, conditions and actions before saving. Server-side validation remains authoritative.

```


## `SAFE_DIRECT_COPY/docs/pack18/07-qa-checklist.md`

```text
Verify rule validation, safe action allowlist, approval gates, event deduplication, rate limits, dead letters, notification routing and admin permissions.

```


## `SAFE_DIRECT_COPY/infra/pack18/prometheus-automation-alerts.yml`

```text
groups:
  - name: remotedesk-automation-pack18
    rules:
      - alert: RemoteDeskAutomationFailureRateHigh
        expr: rate(remotedesk_automation_failures_total[10m]) > 0.1
        for: 10m
        labels:
          severity: warning
      - alert: RemoteDeskAutomationDeadLettersGrowing
        expr: remotedesk_automation_dead_letters_total > 100
        for: 15m
        labels:
          severity: warning

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/automationAction.ts`

```text
export type SafeAutomationAction =
  | "send_notification"
  | "create_support_ticket"
  | "add_audit_note"
  | "request_approval"
  | "tag_device"
  | "disable_file_transfer"
  | "require_mfa";

export function isSafeAutomationAction(value: string): value is SafeAutomationAction {
  return [
    "send_notification",
    "create_support_ticket",
    "add_audit_note",
    "request_approval",
    "tag_device",
    "disable_file_transfer",
    "require_mfa"
  ].includes(value);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/automationCondition.ts`

```text
export type ConditionOperator = "equals" | "not_equals" | "contains" | "greater_than" | "less_than";

export interface AutomationCondition {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean;
}

export function evaluateCondition(condition: AutomationCondition, input: Record<string, unknown>): boolean {
  const actual = input[condition.field];
  if (condition.operator === "equals") return actual === condition.value;
  if (condition.operator === "not_equals") return actual !== condition.value;
  if (condition.operator === "contains") return String(actual ?? "").includes(String(condition.value));
  if (condition.operator === "greater_than") return Number(actual) > Number(condition.value);
  if (condition.operator === "less_than") return Number(actual) < Number(condition.value);
  return false;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/automationTrigger.ts`

```text
export type AutomationTrigger =
  | "session.started"
  | "session.ended"
  | "file_transfer.completed"
  | "support.ticket.created"
  | "billing.invoice.past_due"
  | "security.alert.opened"
  | "device.posture.failed";

export function isSupportedAutomationTrigger(value: string): value is AutomationTrigger {
  return [
    "session.started",
    "session.ended",
    "file_transfer.completed",
    "support.ticket.created",
    "billing.invoice.past_due",
    "security.alert.opened",
    "device.posture.failed"
  ].includes(value);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/idempotencyKey.ts`

```text
export function buildAutomationIdempotencyKey(ruleId: string, eventId: string): string {
  return `${ruleId}:${eventId}`.slice(0, 180);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/index.ts`

```text
export * from "./automationTrigger.js";
export * from "./automationAction.js";
export * from "./automationCondition.js";
export * from "./ruleValidator.js";
export * from "./workflowApproval.js";
export * from "./notificationRouter.js";
export * from "./idempotencyKey.js";
export * from "./workflowRunStatus.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/notificationRouter.ts`

```text
export type NotificationTarget = "owner" | "admin" | "support" | "billing" | "security";

export function routeAutomationNotification(eventType: string): NotificationTarget[] {
  if (eventType.startsWith("security.")) return ["owner", "admin", "security"];
  if (eventType.startsWith("billing.")) return ["owner", "admin", "billing"];
  if (eventType.startsWith("support.")) return ["support"];
  return ["admin"];
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/ruleValidator.ts`

```text
import { isSafeAutomationAction } from "./automationAction.js";
import { isSupportedAutomationTrigger } from "./automationTrigger.js";

export interface AutomationRuleDraft {
  name: string;
  trigger: string;
  actions: string[];
}

export function validateAutomationRuleDraft(rule: AutomationRuleDraft): string[] {
  const errors: string[] = [];
  if (rule.name.trim().length < 3) errors.push("name-too-short");
  if (!isSupportedAutomationTrigger(rule.trigger)) errors.push("unsupported-trigger");
  if (rule.actions.length === 0) errors.push("missing-actions");
  for (const action of rule.actions) {
    if (!isSafeAutomationAction(action)) errors.push(`unsupported-action:${action}`);
  }
  return errors;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/workflowApproval.ts`

```text
export type WorkflowApprovalState = "pending" | "approved" | "rejected" | "expired";

export function workflowApprovalIsFinal(state: WorkflowApprovalState): boolean {
  return state === "approved" || state === "rejected" || state === "expired";
}

export function workflowApprovalAllowsRun(state: WorkflowApprovalState): boolean {
  return state === "approved";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack18/workflowRunStatus.ts`

```text
export type WorkflowRunStatus = "queued" | "running" | "completed" | "failed" | "skipped";

export function workflowRunFinished(status: WorkflowRunStatus): boolean {
  return status === "completed" || status === "failed" || status === "skipped";
}

```


## `SAFE_DIRECT_COPY/scripts/pack18/check-automation-safe-actions.mjs`

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
      if (/run_shell|execute_command|eval\(|new Function|native_input_execute|unattended/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("Unsafe automation terms found:", bad); process.exit(1); }
console.log("Automation actions remain safe.");

```


## `SAFE_DIRECT_COPY/tests/pack18/automationAction.test.ts`

```text
import assert from "node:assert/strict"; import { isSafeAutomationAction } from "../../packages/shared/src/pack18/automationAction.js"; assert.equal(isSafeAutomationAction("send_notification"), true); assert.equal(isSafeAutomationAction("run_shell"), false);

```


## `SAFE_DIRECT_COPY/tests/pack18/automationActionPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { validateAutomationAction } from "../../REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionPolicy.js"; assert.deepEqual(validateAutomationAction("require_mfa"), { ok: true }); assert.equal(validateAutomationAction("execute_command").ok, false);

```


## `SAFE_DIRECT_COPY/tests/pack18/automationCondition.test.ts`

```text
import assert from "node:assert/strict"; import { evaluateCondition } from "../../packages/shared/src/pack18/automationCondition.js"; assert.equal(evaluateCondition({ field: "failures", operator: "greater_than", value: 3 }, { failures: 5 }), true);

```


## `SAFE_DIRECT_COPY/tests/pack18/automationTrigger.test.ts`

```text
import assert from "node:assert/strict"; import { isSupportedAutomationTrigger } from "../../packages/shared/src/pack18/automationTrigger.js"; assert.equal(isSupportedAutomationTrigger("session.started"), true); assert.equal(isSupportedAutomationTrigger("bad.trigger"), false);

```


## `SAFE_DIRECT_COPY/tests/pack18/notificationRouter.test.ts`

```text
import assert from "node:assert/strict"; import { routeAutomationNotification } from "../../packages/shared/src/pack18/notificationRouter.js"; assert.ok(routeAutomationNotification("security.alert.opened").includes("security"));

```


## `SAFE_DIRECT_COPY/tests/pack18/rateLimitPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { automationRateLimitExceeded } from "../../REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/rateLimitPolicy.js"; assert.equal(automationRateLimitExceeded({ perMinute: 10, usedThisMinute: 10, enabled: true }), true);

```


## `SAFE_DIRECT_COPY/tests/pack18/ruleValidator.test.ts`

```text
import assert from "node:assert/strict"; import { validateAutomationRuleDraft } from "../../packages/shared/src/pack18/ruleValidator.js"; assert.deepEqual(validateAutomationRuleDraft({ name: "Notify", trigger: "session.started", actions: ["send_notification"] }), []);

```


## `SAFE_DIRECT_COPY/tests/pack18/workflowApproval.test.ts`

```text
import assert from "node:assert/strict"; import { workflowApprovalAllowsRun } from "../../packages/shared/src/pack18/workflowApproval.js"; assert.equal(workflowApprovalAllowsRun("approved"), true); assert.equal(workflowApprovalAllowsRun("pending"), false);

```


## `SAFE_DIRECT_COPY/tests/pack18/workflowRunPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { workflowRunCanStart } from "../../REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunPolicy.js"; assert.equal(workflowRunCanStart({ ruleEnabled: true, rateLimited: false, approvalRequired: true, approvalApproved: false }).reason, "approval-required");

```


## `generated-remotedesk-automation-rules-pack-18-code-review.md`

```text
Review safe action allowlist, workflow approval gates, automation admin authorization, team-scoped repositories, event deduplication, rate limits, dead letter handling and notification routing.

```


## `generated-remotedesk-automation-rules-pack-18-manifest.json`

```text
{
  "name": "generated-remotedesk-automation-rules-pack-18",
  "createdAt": "2026-06-15T07:16:36.310008+00:00",
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
    "SAFE_DIRECT_COPY/docs/pack18/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack18/02-safe-actions.md",
    "SAFE_DIRECT_COPY/docs/pack18/03-approvals.md",
    "SAFE_DIRECT_COPY/docs/pack18/04-event-inbox.md",
    "SAFE_DIRECT_COPY/docs/pack18/05-rate-limits.md",
    "SAFE_DIRECT_COPY/docs/pack18/06-rule-builder.md",
    "SAFE_DIRECT_COPY/docs/pack18/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack18/prometheus-automation-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/automationAction.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/automationCondition.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/automationTrigger.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/idempotencyKey.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/notificationRouter.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/ruleValidator.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/workflowApproval.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack18/workflowRunStatus.ts",
    "SAFE_DIRECT_COPY/scripts/pack18/check-automation-safe-actions.mjs",
    "SAFE_DIRECT_COPY/tests/pack18/automationAction.test.ts",
    "SAFE_DIRECT_COPY/tests/pack18/automationActionPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack18/automationCondition.test.ts",
    "SAFE_DIRECT_COPY/tests/pack18/automationTrigger.test.ts",
    "SAFE_DIRECT_COPY/tests/pack18/notificationRouter.test.ts",
    "SAFE_DIRECT_COPY/tests/pack18/rateLimitPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack18/ruleValidator.test.ts",
    "SAFE_DIRECT_COPY/tests/pack18/workflowApproval.test.ts",
    "SAFE_DIRECT_COPY/tests/pack18/workflowRunPolicy.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationActions/automationActionsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationActions/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/automationConditionsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationConditions/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/automationDeadLettersTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationDeadLetters/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/automationEventInboxTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/eventDedupPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationEventInbox/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/automationMetricsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationMetrics/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/automationRateLimitsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRateLimits/rateLimitPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRules/automationRulesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/automationRules/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/common/automationAdminAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/common/pack18Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/notificationRoutes/notificationRoutesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/ruleChangeAudit/ruleChangeAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowApprovals/workflowApprovalsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowRuns/workflowRunsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack18/workflowTemplates/workflowTemplatesTypes.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack18/automationNotificationPanel.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack18/automationStatusBadge.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack18/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack18/safeActionNotice.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack18/workflowApprovalPrompt.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationActionsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationConditionsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationDeadLettersPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationEventInboxPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationMetricsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/AutomationRulesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/NotificationRoutesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/RuleBuilderPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/RuleChangeAuditPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowApprovalsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowRunsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/components/WorkflowTemplatesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationActions.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationConditions.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationDeadLetters.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationEventInbox.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationMetrics.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationRateLimits.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useAutomationRules.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useNotificationRoutes.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useRuleChangeAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowApprovals.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowRuns.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/hooks/useWorkflowTemplates.ts",
    "REVIEW_REQUIRED/apps/web/src/pack18/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack18.patch.md",
    "PATCHES/desktop-pack18.patch.md",
    "PATCHES/ops-pack18.patch.md",
    "PATCHES/web-pack18.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Automation actions are workflow actions only, not arbitrary code execution.",
    "Event producers must be wired from existing API/session/billing/security pipelines.",
    "Team scope must be enforced in repositories.",
    "No remote shell, unattended access or native input execution is included."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 93-98% with prior packs after persistence, event pipeline wiring and automation QA"
}
```


## `generated-remotedesk-automation-rules-pack-18-merge-summary.md`

```text
Pack 18 adds automation rules, conditions, actions, workflow runs, approvals, event inbox, notification routes, rule audit, dead letters, rate limits, templates, metrics, web rule builder, desktop approval prompts, docs/tests/scripts.

```


## `generated-remotedesk-automation-rules-pack-18-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| Unsafe automation action | Critical | strict allowlist and CI scanner |
| Cross-team automation leak | Critical | team-scoped repositories |
| Notification storm | High | rule-level rate limits |
| Duplicate event execution | High | idempotency and event dedup |
| Approval bypass | High | server-side approval gates |

```


## `generated-remotedesk-automation-rules-pack-18-test-plan.md`

```text
Run Pack 18 shared/API/desktop tests, safe-action scanner, then manual QA for rule creation, condition evaluation, safe action blocking, approval gates, event inbox, dead letters, rate limits and metrics.

```
