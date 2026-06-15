# generated-remotedesk-customer-portal-pack-17 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack17.patch.md
PATCHES/desktop-pack17.patch.md
PATCHES/ops-pack17.patch.md
PATCHES/web-pack17.patch.md
REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsService.ts
REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/common/pack17Route.ts
REVIEW_REQUIRED/apps/api/src/pack17/common/portalAuth.ts
REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlePolicy.ts
REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesService.ts
REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsService.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoices/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicePolicy.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesService.ts
REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesService.ts
REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsService.ts
REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackService.ts
REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsService.ts
REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsService.ts
REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesService.ts
REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/index.ts
REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themePolicy.ts
REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsService.ts
REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsTypes.ts
REVIEW_REQUIRED/apps/desktop/src/pack17/billingStatusBadge.tsx
REVIEW_REQUIRED/apps/desktop/src/pack17/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack17/notificationPreferenceStore.ts
REVIEW_REQUIRED/apps/desktop/src/pack17/portalLinkBuilder.ts
REVIEW_REQUIRED/apps/desktop/src/pack17/publicStatusBadge.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/BillingPortalPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/CustomerPortalHome.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/HelpCenterPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/InvoicesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/NotificationPreferencesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/PaymentReceiptsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/PortalAuditPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/PortalFeedbackPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/PublicStatusPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/StatusIncidentsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/TaxProfilesPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/components/ThemeSettingsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack17/hooks/useBillingPortalSessions.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/useHelpArticles.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/useInvoices.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/useNotificationPreferences.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePaymentReceipts.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePortalAudit.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePortalFeedback.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePublicStatus.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/useStatusIncidents.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/useTaxProfiles.ts
REVIEW_REQUIRED/apps/web/src/pack17/hooks/useThemeSettings.ts
REVIEW_REQUIRED/apps/web/src/pack17/index.ts
SAFE_DIRECT_COPY/docs/pack17/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack17/02-billing-portal.md
SAFE_DIRECT_COPY/docs/pack17/03-public-status.md
SAFE_DIRECT_COPY/docs/pack17/04-help-center.md
SAFE_DIRECT_COPY/docs/pack17/05-theme-settings.md
SAFE_DIRECT_COPY/docs/pack17/06-notifications.md
SAFE_DIRECT_COPY/docs/pack17/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack17/prometheus-portal-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack17/billingPortalAccess.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/helpArticleSlug.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/invoiceNumber.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/notificationPreference.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/paymentStatus.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/portalRedaction.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/publicStatus.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/taxRegion.ts
SAFE_DIRECT_COPY/packages/shared/src/pack17/themeContrast.ts
SAFE_DIRECT_COPY/scripts/pack17/check-portal-content-safety.mjs
SAFE_DIRECT_COPY/tests/pack17/billingPortalAccess.test.ts
SAFE_DIRECT_COPY/tests/pack17/helpArticlePolicy.test.ts
SAFE_DIRECT_COPY/tests/pack17/invoiceNumber.test.ts
SAFE_DIRECT_COPY/tests/pack17/invoicePolicy.test.ts
SAFE_DIRECT_COPY/tests/pack17/portalLinkBuilder.test.ts
SAFE_DIRECT_COPY/tests/pack17/portalRedaction.test.ts
SAFE_DIRECT_COPY/tests/pack17/publicStatus.test.ts
SAFE_DIRECT_COPY/tests/pack17/themeContrast.test.ts
SAFE_DIRECT_COPY/tests/pack17/themePolicy.test.ts
generated-remotedesk-customer-portal-pack-17-code-review.md
generated-remotedesk-customer-portal-pack-17-manifest.json
generated-remotedesk-customer-portal-pack-17-merge-summary.md
generated-remotedesk-customer-portal-pack-17-risk-register.md
generated-remotedesk-customer-portal-pack-17-test-plan.md

```


## `PATCHES/api-pack17.patch.md`

```text
Mount Pack 17 portal routes behind portal/billing permissions. Keep payment provider operations server-side. Filter all records by team scope.

```


## `PATCHES/desktop-pack17.patch.md`

```text
Wire billing/status badges and portal links into desktop settings. Portal links must use HTTPS.

```


## `PATCHES/ops-pack17.patch.md`

```text
Run portal content safety scanner in CI. Enable portal Prometheus alerts only after metrics are emitted.

```


## `PATCHES/web-pack17.patch.md`

```text
Mount customer portal pages in authenticated web app and public status/help center in public routes after content review.

```


## `REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionPolicy.ts`

```text
export function billingPortalSessionValid(input: { expiresAt: string; teamActive: boolean }): boolean {
  return input.teamActive && new Date(input.expiresAt) > new Date();
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { BillingPortalSessionRecordService } from "./billingPortalSessionsService.js";

export function registerBillingPortalSessionRecordRoutes(router: Router, service: BillingPortalSessionRecordService): void {
  router.get("/pack17/billingPortalSessions", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/billingPortalSessions", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsService.ts`

```text
import type { BillingPortalSessionRecord, BillingPortalSessionRecordRepository } from "./billingPortalSessionsTypes.js";

export class BillingPortalSessionRecordService {
  constructor(private readonly repository: BillingPortalSessionRecordRepository) {}

  create(record: BillingPortalSessionRecord): Promise<BillingPortalSessionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<BillingPortalSessionRecord>): Promise<BillingPortalSessionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("billingPortalSessions-not-found");
    return updated;
  }

  list(filter: Partial<BillingPortalSessionRecord> = {}, limit = 50): Promise<BillingPortalSessionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsTypes.ts`

```text
export interface BillingPortalSessionRecord {
  id: string; teamId: string; userId: string; expiresAt: string; createdAt: string;
}

export interface BillingPortalSessionRecordRepository {
  create(record: BillingPortalSessionRecord): Promise<BillingPortalSessionRecord>;
  update(id: string, patch: Partial<BillingPortalSessionRecord>): Promise<BillingPortalSessionRecord | null>;
  list(filter: Partial<BillingPortalSessionRecord>, limit: number): Promise<BillingPortalSessionRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/index.ts`

```text
export * from "./billingPortalSessionsTypes.js";
export * from "./billingPortalSessionsService.js";
export * from "./billingPortalSessionsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/common/pack17Route.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function pack17Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/common/portalAuth.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function requirePortalAccess(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.role === "billing" || user?.permissions?.includes("portal:read")) {
    next();
    return;
  }
  res.status(403).json({ error: "portal_access_required" });
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlePolicy.ts`

```text
export function canPublishHelpArticle(input: { title: string; body: string }): string[] {
  const errors: string[] = [];
  if (input.title.trim().length < 3) errors.push("title-too-short");
  if (input.body.trim().length < 20) errors.push("body-too-short");
  if (/<script/i.test(input.body)) errors.push("script-tag-blocked");
  return errors;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { HelpArticleRecordService } from "./helpArticlesService.js";

export function registerHelpArticleRecordRoutes(router: Router, service: HelpArticleRecordService): void {
  router.get("/pack17/helpArticles", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/helpArticles", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesService.ts`

```text
import type { HelpArticleRecord, HelpArticleRecordRepository } from "./helpArticlesTypes.js";

export class HelpArticleRecordService {
  constructor(private readonly repository: HelpArticleRecordRepository) {}

  create(record: HelpArticleRecord): Promise<HelpArticleRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<HelpArticleRecord>): Promise<HelpArticleRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("helpArticles-not-found");
    return updated;
  }

  list(filter: Partial<HelpArticleRecord> = {}, limit = 50): Promise<HelpArticleRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesTypes.ts`

```text
export interface HelpArticleRecord {
  id: string; slug: string; title: string; body: string; published: boolean; updatedAt: string;
}

export interface HelpArticleRecordRepository {
  create(record: HelpArticleRecord): Promise<HelpArticleRecord>;
  update(id: string, patch: Partial<HelpArticleRecord>): Promise<HelpArticleRecord | null>;
  list(filter: Partial<HelpArticleRecord>, limit: number): Promise<HelpArticleRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/index.ts`

```text
export * from "./helpArticlesTypes.js";
export * from "./helpArticlesService.js";
export * from "./helpArticlesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/index.ts`

```text
export * from "./common/pack17Route.js";
export * from "./common/portalAuth.js";
export * from "./billingPortalSessions/billingPortalSessionPolicy.js";
export * from "./invoices/invoicePolicy.js";
export * from "./themeSettings/themePolicy.js";
export * from "./helpArticles/helpArticlePolicy.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/index.ts`

```text
export * from "./invoiceLineItemsTypes.js";
export * from "./invoiceLineItemsService.js";
export * from "./invoiceLineItemsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { InvoiceLineItemRecordService } from "./invoiceLineItemsService.js";

export function registerInvoiceLineItemRecordRoutes(router: Router, service: InvoiceLineItemRecordService): void {
  router.get("/pack17/invoiceLineItems", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/invoiceLineItems", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsService.ts`

```text
import type { InvoiceLineItemRecord, InvoiceLineItemRecordRepository } from "./invoiceLineItemsTypes.js";

export class InvoiceLineItemRecordService {
  constructor(private readonly repository: InvoiceLineItemRecordRepository) {}

  create(record: InvoiceLineItemRecord): Promise<InvoiceLineItemRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<InvoiceLineItemRecord>): Promise<InvoiceLineItemRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("invoiceLineItems-not-found");
    return updated;
  }

  list(filter: Partial<InvoiceLineItemRecord> = {}, limit = 50): Promise<InvoiceLineItemRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsTypes.ts`

```text
export interface InvoiceLineItemRecord {
  id: string; invoiceId: string; description: string; quantity: number; unitCents: number;
}

export interface InvoiceLineItemRecordRepository {
  create(record: InvoiceLineItemRecord): Promise<InvoiceLineItemRecord>;
  update(id: string, patch: Partial<InvoiceLineItemRecord>): Promise<InvoiceLineItemRecord | null>;
  list(filter: Partial<InvoiceLineItemRecord>, limit: number): Promise<InvoiceLineItemRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoices/index.ts`

```text
export * from "./invoicesTypes.js";
export * from "./invoicesService.js";
export * from "./invoicesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicePolicy.ts`

```text
export function invoiceCanBeDownloaded(status: string): boolean {
  return ["open", "paid", "void", "uncollectible"].includes(status);
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { InvoiceRecordService } from "./invoicesService.js";

export function registerInvoiceRecordRoutes(router: Router, service: InvoiceRecordService): void {
  router.get("/pack17/invoices", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/invoices", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesService.ts`

```text
import type { InvoiceRecord, InvoiceRecordRepository } from "./invoicesTypes.js";

export class InvoiceRecordService {
  constructor(private readonly repository: InvoiceRecordRepository) {}

  create(record: InvoiceRecord): Promise<InvoiceRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<InvoiceRecord>): Promise<InvoiceRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("invoices-not-found");
    return updated;
  }

  list(filter: Partial<InvoiceRecord> = {}, limit = 50): Promise<InvoiceRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesTypes.ts`

```text
export interface InvoiceRecord {
  id: string; teamId: string; number: string; status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'; totalCents: number; createdAt: string;
}

export interface InvoiceRecordRepository {
  create(record: InvoiceRecord): Promise<InvoiceRecord>;
  update(id: string, patch: Partial<InvoiceRecord>): Promise<InvoiceRecord | null>;
  list(filter: Partial<InvoiceRecord>, limit: number): Promise<InvoiceRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/index.ts`

```text
export * from "./notificationPreferencesTypes.js";
export * from "./notificationPreferencesService.js";
export * from "./notificationPreferencesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { NotificationPreferenceRecordService } from "./notificationPreferencesService.js";

export function registerNotificationPreferenceRecordRoutes(router: Router, service: NotificationPreferenceRecordService): void {
  router.get("/pack17/notificationPreferences", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/notificationPreferences", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesService.ts`

```text
import type { NotificationPreferenceRecord, NotificationPreferenceRecordRepository } from "./notificationPreferencesTypes.js";

export class NotificationPreferenceRecordService {
  constructor(private readonly repository: NotificationPreferenceRecordRepository) {}

  create(record: NotificationPreferenceRecord): Promise<NotificationPreferenceRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<NotificationPreferenceRecord>): Promise<NotificationPreferenceRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("notificationPreferences-not-found");
    return updated;
  }

  list(filter: Partial<NotificationPreferenceRecord> = {}, limit = 50): Promise<NotificationPreferenceRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesTypes.ts`

```text
export interface NotificationPreferenceRecord {
  id: string; userId: string; channel: 'email' | 'in_app' | 'push' | 'webhook'; enabled: boolean; digestOnly?: boolean; updatedAt: string;
}

export interface NotificationPreferenceRecordRepository {
  create(record: NotificationPreferenceRecord): Promise<NotificationPreferenceRecord>;
  update(id: string, patch: Partial<NotificationPreferenceRecord>): Promise<NotificationPreferenceRecord | null>;
  list(filter: Partial<NotificationPreferenceRecord>, limit: number): Promise<NotificationPreferenceRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/index.ts`

```text
export * from "./paymentReceiptsTypes.js";
export * from "./paymentReceiptsService.js";
export * from "./paymentReceiptsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { PaymentReceiptRecordService } from "./paymentReceiptsService.js";

export function registerPaymentReceiptRecordRoutes(router: Router, service: PaymentReceiptRecordService): void {
  router.get("/pack17/paymentReceipts", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/paymentReceipts", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsService.ts`

```text
import type { PaymentReceiptRecord, PaymentReceiptRecordRepository } from "./paymentReceiptsTypes.js";

export class PaymentReceiptRecordService {
  constructor(private readonly repository: PaymentReceiptRecordRepository) {}

  create(record: PaymentReceiptRecord): Promise<PaymentReceiptRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PaymentReceiptRecord>): Promise<PaymentReceiptRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("paymentReceipts-not-found");
    return updated;
  }

  list(filter: Partial<PaymentReceiptRecord> = {}, limit = 50): Promise<PaymentReceiptRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsTypes.ts`

```text
export interface PaymentReceiptRecord {
  id: string; teamId: string; invoiceId: string; amountCents: number; providerReceiptId: string; createdAt: string;
}

export interface PaymentReceiptRecordRepository {
  create(record: PaymentReceiptRecord): Promise<PaymentReceiptRecord>;
  update(id: string, patch: Partial<PaymentReceiptRecord>): Promise<PaymentReceiptRecord | null>;
  list(filter: Partial<PaymentReceiptRecord>, limit: number): Promise<PaymentReceiptRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/index.ts`

```text
export * from "./portalAuditTypes.js";
export * from "./portalAuditService.js";
export * from "./portalAuditRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { PortalAuditRecordService } from "./portalAuditService.js";

export function registerPortalAuditRecordRoutes(router: Router, service: PortalAuditRecordService): void {
  router.get("/pack17/portalAudit", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/portalAudit", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditService.ts`

```text
import type { PortalAuditRecord, PortalAuditRecordRepository } from "./portalAuditTypes.js";

export class PortalAuditRecordService {
  constructor(private readonly repository: PortalAuditRecordRepository) {}

  create(record: PortalAuditRecord): Promise<PortalAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PortalAuditRecord>): Promise<PortalAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("portalAudit-not-found");
    return updated;
  }

  list(filter: Partial<PortalAuditRecord> = {}, limit = 50): Promise<PortalAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditTypes.ts`

```text
export interface PortalAuditRecord {
  id: string; teamId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface PortalAuditRecordRepository {
  create(record: PortalAuditRecord): Promise<PortalAuditRecord>;
  update(id: string, patch: Partial<PortalAuditRecord>): Promise<PortalAuditRecord | null>;
  list(filter: Partial<PortalAuditRecord>, limit: number): Promise<PortalAuditRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/index.ts`

```text
export * from "./portalFeedbackTypes.js";
export * from "./portalFeedbackService.js";
export * from "./portalFeedbackRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { PortalFeedbackRecordService } from "./portalFeedbackService.js";

export function registerPortalFeedbackRecordRoutes(router: Router, service: PortalFeedbackRecordService): void {
  router.get("/pack17/portalFeedback", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/portalFeedback", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackService.ts`

```text
import type { PortalFeedbackRecord, PortalFeedbackRecordRepository } from "./portalFeedbackTypes.js";

export class PortalFeedbackRecordService {
  constructor(private readonly repository: PortalFeedbackRecordRepository) {}

  create(record: PortalFeedbackRecord): Promise<PortalFeedbackRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PortalFeedbackRecord>): Promise<PortalFeedbackRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("portalFeedback-not-found");
    return updated;
  }

  list(filter: Partial<PortalFeedbackRecord> = {}, limit = 50): Promise<PortalFeedbackRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackTypes.ts`

```text
export interface PortalFeedbackRecord {
  id: string; teamId: string; userId: string; rating: number; message: string; createdAt: string;
}

export interface PortalFeedbackRecordRepository {
  create(record: PortalFeedbackRecord): Promise<PortalFeedbackRecord>;
  update(id: string, patch: Partial<PortalFeedbackRecord>): Promise<PortalFeedbackRecord | null>;
  list(filter: Partial<PortalFeedbackRecord>, limit: number): Promise<PortalFeedbackRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/index.ts`

```text
export * from "./publicStatusComponentsTypes.js";
export * from "./publicStatusComponentsService.js";
export * from "./publicStatusComponentsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { PublicStatusComponentRecordService } from "./publicStatusComponentsService.js";

export function registerPublicStatusComponentRecordRoutes(router: Router, service: PublicStatusComponentRecordService): void {
  router.get("/pack17/publicStatusComponents", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/publicStatusComponents", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsService.ts`

```text
import type { PublicStatusComponentRecord, PublicStatusComponentRecordRepository } from "./publicStatusComponentsTypes.js";

export class PublicStatusComponentRecordService {
  constructor(private readonly repository: PublicStatusComponentRecordRepository) {}

  create(record: PublicStatusComponentRecord): Promise<PublicStatusComponentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PublicStatusComponentRecord>): Promise<PublicStatusComponentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("publicStatusComponents-not-found");
    return updated;
  }

  list(filter: Partial<PublicStatusComponentRecord> = {}, limit = 50): Promise<PublicStatusComponentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsTypes.ts`

```text
export interface PublicStatusComponentRecord {
  id: string; key: string; name: string; status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance'; updatedAt: string;
}

export interface PublicStatusComponentRecordRepository {
  create(record: PublicStatusComponentRecord): Promise<PublicStatusComponentRecord>;
  update(id: string, patch: Partial<PublicStatusComponentRecord>): Promise<PublicStatusComponentRecord | null>;
  list(filter: Partial<PublicStatusComponentRecord>, limit: number): Promise<PublicStatusComponentRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/index.ts`

```text
export * from "./publicStatusIncidentsTypes.js";
export * from "./publicStatusIncidentsService.js";
export * from "./publicStatusIncidentsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { PublicStatusIncidentRecordService } from "./publicStatusIncidentsService.js";

export function registerPublicStatusIncidentRecordRoutes(router: Router, service: PublicStatusIncidentRecordService): void {
  router.get("/pack17/publicStatusIncidents", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/publicStatusIncidents", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsService.ts`

```text
import type { PublicStatusIncidentRecord, PublicStatusIncidentRecordRepository } from "./publicStatusIncidentsTypes.js";

export class PublicStatusIncidentRecordService {
  constructor(private readonly repository: PublicStatusIncidentRecordRepository) {}

  create(record: PublicStatusIncidentRecord): Promise<PublicStatusIncidentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PublicStatusIncidentRecord>): Promise<PublicStatusIncidentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("publicStatusIncidents-not-found");
    return updated;
  }

  list(filter: Partial<PublicStatusIncidentRecord> = {}, limit = 50): Promise<PublicStatusIncidentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsTypes.ts`

```text
export interface PublicStatusIncidentRecord {
  id: string; title: string; status: 'investigating' | 'identified' | 'monitoring' | 'resolved'; public: boolean; createdAt: string;
}

export interface PublicStatusIncidentRecordRepository {
  create(record: PublicStatusIncidentRecord): Promise<PublicStatusIncidentRecord>;
  update(id: string, patch: Partial<PublicStatusIncidentRecord>): Promise<PublicStatusIncidentRecord | null>;
  list(filter: Partial<PublicStatusIncidentRecord>, limit: number): Promise<PublicStatusIncidentRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/index.ts`

```text
export * from "./taxProfilesTypes.js";
export * from "./taxProfilesService.js";
export * from "./taxProfilesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { TaxProfileRecordService } from "./taxProfilesService.js";

export function registerTaxProfileRecordRoutes(router: Router, service: TaxProfileRecordService): void {
  router.get("/pack17/taxProfiles", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/taxProfiles", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesService.ts`

```text
import type { TaxProfileRecord, TaxProfileRecordRepository } from "./taxProfilesTypes.js";

export class TaxProfileRecordService {
  constructor(private readonly repository: TaxProfileRecordRepository) {}

  create(record: TaxProfileRecord): Promise<TaxProfileRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TaxProfileRecord>): Promise<TaxProfileRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("taxProfiles-not-found");
    return updated;
  }

  list(filter: Partial<TaxProfileRecord> = {}, limit = 50): Promise<TaxProfileRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesTypes.ts`

```text
export interface TaxProfileRecord {
  id: string; teamId: string; countryCode: string; stateOrProvince?: string; taxIdMasked?: string; updatedAt: string;
}

export interface TaxProfileRecordRepository {
  create(record: TaxProfileRecord): Promise<TaxProfileRecord>;
  update(id: string, patch: Partial<TaxProfileRecord>): Promise<TaxProfileRecord | null>;
  list(filter: Partial<TaxProfileRecord>, limit: number): Promise<TaxProfileRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/index.ts`

```text
export * from "./themeSettingsTypes.js";
export * from "./themeSettingsService.js";
export * from "./themeSettingsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themePolicy.ts`

```text
export function validateAccentColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsRoutes.ts`

```text
import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { ThemeSettingsRecordService } from "./themeSettingsService.js";

export function registerThemeSettingsRecordRoutes(router: Router, service: ThemeSettingsRecordService): void {
  router.get("/pack17/themeSettings", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/themeSettings", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsService.ts`

```text
import type { ThemeSettingsRecord, ThemeSettingsRecordRepository } from "./themeSettingsTypes.js";

export class ThemeSettingsRecordService {
  constructor(private readonly repository: ThemeSettingsRecordRepository) {}

  create(record: ThemeSettingsRecord): Promise<ThemeSettingsRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ThemeSettingsRecord>): Promise<ThemeSettingsRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("themeSettings-not-found");
    return updated;
  }

  list(filter: Partial<ThemeSettingsRecord> = {}, limit = 50): Promise<ThemeSettingsRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsTypes.ts`

```text
export interface ThemeSettingsRecord {
  id: string; teamId: string; brandName: string; logoObjectKey?: string; accentColor: string; updatedAt: string;
}

export interface ThemeSettingsRecordRepository {
  create(record: ThemeSettingsRecord): Promise<ThemeSettingsRecord>;
  update(id: string, patch: Partial<ThemeSettingsRecord>): Promise<ThemeSettingsRecord | null>;
  list(filter: Partial<ThemeSettingsRecord>, limit: number): Promise<ThemeSettingsRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack17/billingStatusBadge.tsx`

```text
import React from "react";

export function BillingStatusBadge(props: { status: "active" | "trialing" | "past_due" | "cancelled" }): JSX.Element {
  return <span data-billing-status={props.status}>Billing: {props.status}</span>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack17/index.ts`

```text
export * from "./billingStatusBadge.js";
export * from "./publicStatusBadge.js";
export * from "./notificationPreferenceStore.js";
export * from "./portalLinkBuilder.js";

```


## `REVIEW_REQUIRED/apps/desktop/src/pack17/notificationPreferenceStore.ts`

```text
export interface DesktopNotificationPreference {
  channel: "email" | "in_app" | "push" | "webhook";
  enabled: boolean;
}

export function enabledDesktopNotificationChannels(items: readonly DesktopNotificationPreference[]): string[] {
  return items.filter((item) => item.enabled).map((item) => item.channel);
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack17/portalLinkBuilder.ts`

```text
export function buildSafePortalLink(baseUrl: string, path: string): string {
  const base = new URL(baseUrl);
  if (base.protocol !== "https:") throw new Error("portal-base-url-must-use-https");
  return new URL(path.replace(/^\/+/, ""), `${base.origin}/`).toString();
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack17/publicStatusBadge.tsx`

```text
import React from "react";

export function PublicStatusBadge(props: { status: "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance" }): JSX.Element {
  return <span data-public-status={props.status}>Service status: {props.status}</span>;
}

```


## `REVIEW_REQUIRED/apps/web/src/pack17/components/BillingPortalPage.tsx`

```text
import React from "react";

export interface BillingPortalPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function BillingPortalPage(props: { rows: BillingPortalPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Billing portal</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/CustomerPortalHome.tsx`

```text
import React from "react";

export interface CustomerPortalHomeRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function CustomerPortalHome(props: { rows: CustomerPortalHomeRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Customer portal</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/HelpCenterPage.tsx`

```text
import React from "react";

export interface HelpCenterPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function HelpCenterPage(props: { rows: HelpCenterPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Help center</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/InvoicesPage.tsx`

```text
import React from "react";

export interface InvoicesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function InvoicesPage(props: { rows: InvoicesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Invoices</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/NotificationPreferencesPage.tsx`

```text
import React from "react";

export interface NotificationPreferencesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function NotificationPreferencesPage(props: { rows: NotificationPreferencesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Notification preferences</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/PaymentReceiptsPage.tsx`

```text
import React from "react";

export interface PaymentReceiptsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function PaymentReceiptsPage(props: { rows: PaymentReceiptsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Payment receipts</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/PortalAuditPage.tsx`

```text
import React from "react";

export interface PortalAuditPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function PortalAuditPage(props: { rows: PortalAuditPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Portal audit</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/PortalFeedbackPage.tsx`

```text
import React from "react";

export interface PortalFeedbackPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function PortalFeedbackPage(props: { rows: PortalFeedbackPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Portal feedback</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/PublicStatusPage.tsx`

```text
import React from "react";

export interface PublicStatusPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function PublicStatusPage(props: { rows: PublicStatusPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Public status</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/StatusIncidentsPage.tsx`

```text
import React from "react";

export interface StatusIncidentsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function StatusIncidentsPage(props: { rows: StatusIncidentsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Status incidents</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/TaxProfilesPage.tsx`

```text
import React from "react";

export interface TaxProfilesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function TaxProfilesPage(props: { rows: TaxProfilesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Tax profiles</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/components/ThemeSettingsPage.tsx`

```text
import React from "react";

export interface ThemeSettingsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ThemeSettingsPage(props: { rows: ThemeSettingsPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Theme settings</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/useBillingPortalSessions.ts`

```text
import { useEffect, useState } from "react";

export interface useBillingPortalSessionsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useBillingPortalSessions<T>(loader: () => Promise<T>): useBillingPortalSessionsResult<T> {
  const [state, setState] = useState<useBillingPortalSessionsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/useHelpArticles.ts`

```text
import { useEffect, useState } from "react";

export interface useHelpArticlesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useHelpArticles<T>(loader: () => Promise<T>): useHelpArticlesResult<T> {
  const [state, setState] = useState<useHelpArticlesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/useInvoices.ts`

```text
import { useEffect, useState } from "react";

export interface useInvoicesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useInvoices<T>(loader: () => Promise<T>): useInvoicesResult<T> {
  const [state, setState] = useState<useInvoicesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/useNotificationPreferences.ts`

```text
import { useEffect, useState } from "react";

export interface useNotificationPreferencesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useNotificationPreferences<T>(loader: () => Promise<T>): useNotificationPreferencesResult<T> {
  const [state, setState] = useState<useNotificationPreferencesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePaymentReceipts.ts`

```text
import { useEffect, useState } from "react";

export interface usePaymentReceiptsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function usePaymentReceipts<T>(loader: () => Promise<T>): usePaymentReceiptsResult<T> {
  const [state, setState] = useState<usePaymentReceiptsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePortalAudit.ts`

```text
import { useEffect, useState } from "react";

export interface usePortalAuditResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function usePortalAudit<T>(loader: () => Promise<T>): usePortalAuditResult<T> {
  const [state, setState] = useState<usePortalAuditResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePortalFeedback.ts`

```text
import { useEffect, useState } from "react";

export interface usePortalFeedbackResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function usePortalFeedback<T>(loader: () => Promise<T>): usePortalFeedbackResult<T> {
  const [state, setState] = useState<usePortalFeedbackResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePublicStatus.ts`

```text
import { useEffect, useState } from "react";

export interface usePublicStatusResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function usePublicStatus<T>(loader: () => Promise<T>): usePublicStatusResult<T> {
  const [state, setState] = useState<usePublicStatusResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/useStatusIncidents.ts`

```text
import { useEffect, useState } from "react";

export interface useStatusIncidentsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useStatusIncidents<T>(loader: () => Promise<T>): useStatusIncidentsResult<T> {
  const [state, setState] = useState<useStatusIncidentsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/useTaxProfiles.ts`

```text
import { useEffect, useState } from "react";

export interface useTaxProfilesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useTaxProfiles<T>(loader: () => Promise<T>): useTaxProfilesResult<T> {
  const [state, setState] = useState<useTaxProfilesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/hooks/useThemeSettings.ts`

```text
import { useEffect, useState } from "react";

export interface useThemeSettingsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useThemeSettings<T>(loader: () => Promise<T>): useThemeSettingsResult<T> {
  const [state, setState] = useState<useThemeSettingsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack17/index.ts`

```text
export * from "./components/CustomerPortalHome.js";
export * from "./components/BillingPortalPage.js";
export * from "./components/InvoicesPage.js";
export * from "./components/TaxProfilesPage.js";
export * from "./components/PaymentReceiptsPage.js";
export * from "./components/PublicStatusPage.js";
export * from "./components/StatusIncidentsPage.js";
export * from "./components/HelpCenterPage.js";
export * from "./components/ThemeSettingsPage.js";
export * from "./components/NotificationPreferencesPage.js";
export * from "./components/PortalFeedbackPage.js";
export * from "./components/PortalAuditPage.js";
export * from "./hooks/useBillingPortalSessions.js";
export * from "./hooks/useInvoices.js";
export * from "./hooks/useTaxProfiles.js";
export * from "./hooks/usePaymentReceipts.js";
export * from "./hooks/usePublicStatus.js";
export * from "./hooks/useStatusIncidents.js";
export * from "./hooks/useHelpArticles.js";
export * from "./hooks/useThemeSettings.js";
export * from "./hooks/useNotificationPreferences.js";
export * from "./hooks/usePortalFeedback.js";
export * from "./hooks/usePortalAudit.js";

```


## `SAFE_DIRECT_COPY/docs/pack17/01-merge-guide.md`

```text
Pack 17 adds customer portal, billing portal, invoices, tax profiles, receipts, public status, help center, branding/theme settings, notification preferences, portal feedback and audit.

```


## `SAFE_DIRECT_COPY/docs/pack17/02-billing-portal.md`

```text
Billing portal access is role-gated. Auditors may view but not modify billing. Actual payment provider actions must remain server-side.

```


## `SAFE_DIRECT_COPY/docs/pack17/03-public-status.md`

```text
Public status components are safe to show externally only after review. Internal incident fields should not be exposed.

```


## `SAFE_DIRECT_COPY/docs/pack17/04-help-center.md`

```text
Help articles block script tags and should be sanitized before publishing.

```


## `SAFE_DIRECT_COPY/docs/pack17/05-theme-settings.md`

```text
Theme settings validate accent color and should check contrast before release.

```


## `SAFE_DIRECT_COPY/docs/pack17/06-notifications.md`

```text
Notification preferences should never include secrets in message bodies or push payloads.

```


## `SAFE_DIRECT_COPY/docs/pack17/07-qa-checklist.md`

```text
Verify billing access, invoice download status, public status priority, help article publishing, theme contrast, notification preferences and portal audit.

```


## `SAFE_DIRECT_COPY/infra/pack17/prometheus-portal-alerts.yml`

```text
groups:
  - name: remotedesk-portal-pack17
    rules:
      - alert: RemoteDeskPortalErrorRateHigh
        expr: rate(remotedesk_portal_http_errors_total[10m]) > 0.05
        for: 10m
        labels:
          severity: warning
      - alert: RemoteDeskPublicStatusMajorOutage
        expr: remotedesk_public_status_level{level="major_outage"} > 0
        for: 1m
        labels:
          severity: critical

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/billingPortalAccess.ts`

```text
export type BillingPortalRole = "owner" | "admin" | "billing" | "auditor" | "member" | "viewer";

export function canOpenBillingPortal(role: BillingPortalRole): boolean {
  return ["owner", "admin", "billing", "auditor"].includes(role);
}

export function canModifyBillingPortal(role: BillingPortalRole): boolean {
  return ["owner", "admin", "billing"].includes(role);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/helpArticleSlug.ts`

```text
export function buildHelpArticleSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/index.ts`

```text
export * from "./billingPortalAccess.js";
export * from "./invoiceNumber.js";
export * from "./taxRegion.js";
export * from "./paymentStatus.js";
export * from "./publicStatus.js";
export * from "./helpArticleSlug.js";
export * from "./themeContrast.js";
export * from "./notificationPreference.js";
export * from "./portalRedaction.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/invoiceNumber.ts`

```text
export function normalizeInvoiceNumber(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 40);
}

export function buildInvoiceNumber(prefix: string, sequence: number): string {
  return `${normalizeInvoiceNumber(prefix)}-${String(sequence).padStart(6, "0")}`;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/notificationPreference.ts`

```text
export type NotificationChannel = "email" | "in_app" | "push" | "webhook";

export interface NotificationPreference {
  channel: NotificationChannel;
  enabled: boolean;
  digestOnly?: boolean;
}

export function channelEnabled(preferences: readonly NotificationPreference[], channel: NotificationChannel): boolean {
  return preferences.some((preference) => preference.channel === channel && preference.enabled);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/paymentStatus.ts`

```text
export type PaymentStatus = "not_required" | "pending" | "paid" | "failed" | "refunded" | "past_due";

export function paymentStatusBlocksNewSubscription(status: PaymentStatus): boolean {
  return status === "failed" || status === "past_due";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/portalRedaction.ts`

```text
const SECRET_PATTERN = /\b(password|token|secret|api[_-]?key|clipboard)\b/i;

export function redactPortalText(value: string): string {
  if (SECRET_PATTERN.test(value)) return "[redacted]";
  return value.slice(0, 500);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/publicStatus.ts`

```text
export type PublicStatusLevel = "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";

export function publicStatusPriority(level: PublicStatusLevel): number {
  return { operational: 0, maintenance: 1, degraded: 2, partial_outage: 3, major_outage: 4 }[level];
}

export function worstPublicStatus(levels: readonly PublicStatusLevel[]): PublicStatusLevel {
  return levels.reduce((worst, level) => publicStatusPriority(level) > publicStatusPriority(worst) ? level : worst, "operational" as PublicStatusLevel);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/taxRegion.ts`

```text
export interface TaxRegionInput {
  countryCode: string;
  stateOrProvince?: string;
}

export function normalizeTaxRegion(input: TaxRegionInput): string {
  return [input.countryCode.trim().toUpperCase(), input.stateOrProvince?.trim().toUpperCase()].filter(Boolean).join("-");
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack17/themeContrast.ts`

```text
export interface ThemeContrastInput {
  foregroundLuma: number;
  backgroundLuma: number;
}

export function contrastRatio(input: ThemeContrastInput): number {
  const lighter = Math.max(input.foregroundLuma, input.backgroundLuma);
  const darker = Math.min(input.foregroundLuma, input.backgroundLuma);
  return (lighter + 0.05) / (darker + 0.05);
}

export function contrastPasses(input: ThemeContrastInput): boolean {
  return contrastRatio(input) >= 4.5;
}

```


## `SAFE_DIRECT_COPY/scripts/pack17/check-portal-content-safety.mjs`

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
      if (/<script|rawPassword|rawToken|rawSecret|clipboard sync token/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("Portal content safety findings:", bad); process.exit(1); }
console.log("Portal content safety scanner passed.");

```


## `SAFE_DIRECT_COPY/tests/pack17/billingPortalAccess.test.ts`

```text
import assert from "node:assert/strict"; import { canOpenBillingPortal, canModifyBillingPortal } from "../../packages/shared/src/pack17/billingPortalAccess.js"; assert.equal(canOpenBillingPortal("auditor"), true); assert.equal(canModifyBillingPortal("auditor"), false);

```


## `SAFE_DIRECT_COPY/tests/pack17/helpArticlePolicy.test.ts`

```text
import assert from "node:assert/strict"; import { canPublishHelpArticle } from "../../REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlePolicy.js"; assert.deepEqual(canPublishHelpArticle({ title: "Install", body: "This article explains installation." }), []);

```


## `SAFE_DIRECT_COPY/tests/pack17/invoiceNumber.test.ts`

```text
import assert from "node:assert/strict"; import { buildInvoiceNumber } from "../../packages/shared/src/pack17/invoiceNumber.js"; assert.equal(buildInvoiceNumber("rd", 7), "RD-000007");

```


## `SAFE_DIRECT_COPY/tests/pack17/invoicePolicy.test.ts`

```text
import assert from "node:assert/strict"; import { invoiceCanBeDownloaded } from "../../REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicePolicy.js"; assert.equal(invoiceCanBeDownloaded("paid"), true); assert.equal(invoiceCanBeDownloaded("draft"), false);

```


## `SAFE_DIRECT_COPY/tests/pack17/portalLinkBuilder.test.ts`

```text
import assert from "node:assert/strict"; import { buildSafePortalLink } from "../../REVIEW_REQUIRED/apps/desktop/src/pack17/portalLinkBuilder.js"; assert.equal(buildSafePortalLink("https://example.com", "/billing"), "https://example.com/billing");

```


## `SAFE_DIRECT_COPY/tests/pack17/portalRedaction.test.ts`

```text
import assert from "node:assert/strict"; import { redactPortalText } from "../../packages/shared/src/pack17/portalRedaction.js"; assert.equal(redactPortalText("token here"), "[redacted]");

```


## `SAFE_DIRECT_COPY/tests/pack17/publicStatus.test.ts`

```text
import assert from "node:assert/strict"; import { worstPublicStatus } from "../../packages/shared/src/pack17/publicStatus.js"; assert.equal(worstPublicStatus(["operational", "major_outage", "degraded"]), "major_outage");

```


## `SAFE_DIRECT_COPY/tests/pack17/themeContrast.test.ts`

```text
import assert from "node:assert/strict"; import { contrastPasses } from "../../packages/shared/src/pack17/themeContrast.js"; assert.equal(contrastPasses({ foregroundLuma: 1, backgroundLuma: 0 }), true);

```


## `SAFE_DIRECT_COPY/tests/pack17/themePolicy.test.ts`

```text
import assert from "node:assert/strict"; import { validateAccentColor } from "../../REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themePolicy.js"; assert.equal(validateAccentColor("#3366ff"), true);

```


## `generated-remotedesk-customer-portal-pack-17-code-review.md`

```text
Review billing portal authorization, team-scoped repository filtering, invoice download policy, help article sanitization, theme contrast checks, portal link HTTPS enforcement and payment provider boundaries.

```


## `generated-remotedesk-customer-portal-pack-17-manifest.json`

```text
{
  "name": "generated-remotedesk-customer-portal-pack-17",
  "createdAt": "2026-06-15T07:07:27.397328+00:00",
  "actualFileCount": 123,
  "safeDirectCopyCount": 28,
  "reviewRequiredCount": 84,
  "patchesCount": 4,
  "doNotMergeCount": 0,
  "filesByArea": {
    "shared": 10,
    "api": 55,
    "web": 24,
    "desktop": 5,
    "tests": 9,
    "docs": 7,
    "scripts": 1,
    "infra": 1
  },
  "safeDirectCopy": [
    "SAFE_DIRECT_COPY/docs/pack17/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack17/02-billing-portal.md",
    "SAFE_DIRECT_COPY/docs/pack17/03-public-status.md",
    "SAFE_DIRECT_COPY/docs/pack17/04-help-center.md",
    "SAFE_DIRECT_COPY/docs/pack17/05-theme-settings.md",
    "SAFE_DIRECT_COPY/docs/pack17/06-notifications.md",
    "SAFE_DIRECT_COPY/docs/pack17/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack17/prometheus-portal-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/billingPortalAccess.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/helpArticleSlug.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/invoiceNumber.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/notificationPreference.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/paymentStatus.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/portalRedaction.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/publicStatus.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/taxRegion.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack17/themeContrast.ts",
    "SAFE_DIRECT_COPY/scripts/pack17/check-portal-content-safety.mjs",
    "SAFE_DIRECT_COPY/tests/pack17/billingPortalAccess.test.ts",
    "SAFE_DIRECT_COPY/tests/pack17/helpArticlePolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack17/invoiceNumber.test.ts",
    "SAFE_DIRECT_COPY/tests/pack17/invoicePolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack17/portalLinkBuilder.test.ts",
    "SAFE_DIRECT_COPY/tests/pack17/portalRedaction.test.ts",
    "SAFE_DIRECT_COPY/tests/pack17/publicStatus.test.ts",
    "SAFE_DIRECT_COPY/tests/pack17/themeContrast.test.ts",
    "SAFE_DIRECT_COPY/tests/pack17/themePolicy.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/billingPortalSessionsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/billingPortalSessions/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/common/pack17Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/common/portalAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlePolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/helpArticlesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/helpArticles/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoiceLineItems/invoiceLineItemsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoices/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicePolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/invoices/invoicesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/notificationPreferences/notificationPreferencesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/paymentReceipts/paymentReceiptsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/portalAudit/portalAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/portalFeedback/portalFeedbackTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/publicStatusComponents/publicStatusComponentsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/publicStatusIncidents/publicStatusIncidentsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/taxProfiles/taxProfilesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themePolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack17/themeSettings/themeSettingsTypes.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack17/billingStatusBadge.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack17/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack17/notificationPreferenceStore.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack17/portalLinkBuilder.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack17/publicStatusBadge.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/BillingPortalPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/CustomerPortalHome.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/HelpCenterPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/InvoicesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/NotificationPreferencesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/PaymentReceiptsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/PortalAuditPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/PortalFeedbackPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/PublicStatusPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/StatusIncidentsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/TaxProfilesPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/components/ThemeSettingsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/useBillingPortalSessions.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/useHelpArticles.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/useInvoices.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/useNotificationPreferences.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePaymentReceipts.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePortalAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePortalFeedback.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/usePublicStatus.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/useStatusIncidents.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/useTaxProfiles.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/hooks/useThemeSettings.ts",
    "REVIEW_REQUIRED/apps/web/src/pack17/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack17.patch.md",
    "PATCHES/desktop-pack17.patch.md",
    "PATCHES/ops-pack17.patch.md",
    "PATCHES/web-pack17.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Payment provider operations are not implemented; this pack adds self-serve portal contracts and UI.",
    "Public help/status content must be reviewed before publishing.",
    "Portal routes need strict team-scoped filtering.",
    "No remote shell, unattended access or native input execution is included."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 92-98% with prior packs after persistence/provider wiring and portal QA"
}
```


## `generated-remotedesk-customer-portal-pack-17-merge-summary.md`

```text
Pack 17 adds customer portal and self-serve billing surfaces: billing sessions, invoices, tax profiles, receipts, public status, help center, theming, notification preferences, portal feedback/audit, web/desktop UI, docs/tests/scripts.

```


## `generated-remotedesk-customer-portal-pack-17-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| Billing data leak | Critical | team-scoped repositories and role gates |
| Payment operation misuse | High | server-side provider flow only |
| Public status data leak | High | public content review |
| Help article XSS | High | script blocking and sanitizer |
| Bad contrast theme | Medium | contrast checks |

```


## `generated-remotedesk-customer-portal-pack-17-test-plan.md`

```text
Run Pack 17 shared/API/desktop tests, portal content safety scanner, then manual QA for billing role access, invoice downloads, public status, help center publishing, theme settings, notifications and portal audit.

```
