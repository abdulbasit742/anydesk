# generated-remotedesk-integrations-marketplace-pack-10 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack10.patch.md
PATCHES/desktop-pack10.patch.md
PATCHES/ops-pack10.patch.md
PATCHES/web-pack10.patch.md
REVIEW_REQUIRED/apps/api/src/pack10/common/integrationAuth.ts
REVIEW_REQUIRED/apps/api/src/pack10/common/pack10Route.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogService.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/defaultConnectorCatalog.ts
REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthScopePolicy.ts
REVIEW_REQUIRED/apps/api/src/pack10/siemExports/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookRetryPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/index.ts
REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsService.ts
REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsTypes.ts
REVIEW_REQUIRED/apps/desktop/src/pack10/ConnectorStatusPanel.tsx
REVIEW_REQUIRED/apps/desktop/src/pack10/connectorStatusStore.ts
REVIEW_REQUIRED/apps/desktop/src/pack10/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack10/integrationNotificationBridge.ts
REVIEW_REQUIRED/apps/web/src/pack10/components/ConnectorAuditPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/ConnectorMarketplacePage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/JiraMappingsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/OAuthConnectionsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/SiemExportsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/SlackMappingsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/StorageConnectorsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/TeamConnectorsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/TeamsMappingsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/WebhookAttemptsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/WebhookEndpointsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/components/ZendeskMappingsPage.tsx
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useConnectorAudit.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useConnectorCatalog.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useJiraMappings.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useOAuthConnections.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useSiemExports.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useSlackMappings.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useStorageConnectors.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useTeamConnectors.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useTeamsMappings.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useWebhookAttempts.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useWebhookEndpoints.ts
REVIEW_REQUIRED/apps/web/src/pack10/hooks/useZendeskMappings.ts
REVIEW_REQUIRED/apps/web/src/pack10/index.ts
SAFE_DIRECT_COPY/docs/pack10/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack10/02-oauth-security.md
SAFE_DIRECT_COPY/docs/pack10/03-webhook-security.md
SAFE_DIRECT_COPY/docs/pack10/04-marketplace-governance.md
SAFE_DIRECT_COPY/docs/pack10/05-storage-connectors.md
SAFE_DIRECT_COPY/docs/pack10/06-siem-export.md
SAFE_DIRECT_COPY/docs/pack10/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack10/prometheus-connector-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorAuthState.ts
SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorDisplayName.ts
SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorRateLimit.ts
SAFE_DIRECT_COPY/packages/shared/src/pack10/externalLinkSafety.ts
SAFE_DIRECT_COPY/packages/shared/src/pack10/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack10/marketplaceCategory.ts
SAFE_DIRECT_COPY/packages/shared/src/pack10/oauthStateToken.ts
SAFE_DIRECT_COPY/packages/shared/src/pack10/webhookEventFilter.ts
SAFE_DIRECT_COPY/scripts/pack10/check-no-connector-secrets.mjs
SAFE_DIRECT_COPY/tests/pack10/connectorAuthState.test.ts
SAFE_DIRECT_COPY/tests/pack10/connectorStatusStore.test.ts
SAFE_DIRECT_COPY/tests/pack10/externalLinkSafety.test.ts
SAFE_DIRECT_COPY/tests/pack10/oauthScopePolicy.test.ts
SAFE_DIRECT_COPY/tests/pack10/oauthStateToken.test.ts
SAFE_DIRECT_COPY/tests/pack10/webhookEndpointPolicy.test.ts
SAFE_DIRECT_COPY/tests/pack10/webhookEventFilter.test.ts
SAFE_DIRECT_COPY/tests/pack10/webhookRetryPolicy.test.ts
generated-remotedesk-integrations-marketplace-pack-10-code-review.md
generated-remotedesk-integrations-marketplace-pack-10-manifest.json
generated-remotedesk-integrations-marketplace-pack-10-merge-summary.md
generated-remotedesk-integrations-marketplace-pack-10-risk-register.md
generated-remotedesk-integrations-marketplace-pack-10-test-plan.md

```


## `PATCHES/api-pack10.patch.md`

```text
Mount Pack 10 integration routes behind owner/admin integrations permissions. Store OAuth tokens encrypted with existing secret manager. Webhook URLs must be HTTPS and signed.

```


## `PATCHES/desktop-pack10.patch.md`

```text
Wire connector status panel into settings/diagnostics. Desktop must not receive OAuth secrets directly.

```


## `PATCHES/ops-pack10.patch.md`

```text
Monitor webhook delivery failures and expired connector auth. Run no-connector-secrets scanner in CI.

```


## `PATCHES/web-pack10.patch.md`

```text
Mount marketplace and connector pages only for integration admins. Hide internal connectors from normal tenants.

```


## `REVIEW_REQUIRED/apps/api/src/pack10/common/integrationAuth.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function requireIntegrationAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("integrations:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "integration_admin_required" });
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/common/pack10Route.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function pack10Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { ConnectorAuditRecordService } from "./connectorAuditService.js";

export function registerConnectorAuditRecordRoutes(router: Router, service: ConnectorAuditRecordService): void {
  router.get("/pack10/connectorAudit", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/connectorAudit", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditService.ts`

```text
import type { ConnectorAuditRecord, ConnectorAuditRecordRepository } from "./connectorAuditTypes.js";

export class ConnectorAuditRecordService {
  constructor(private readonly repository: ConnectorAuditRecordRepository) {}

  create(record: ConnectorAuditRecord): Promise<ConnectorAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ConnectorAuditRecord>): Promise<ConnectorAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("connectorAudit-not-found");
    return updated;
  }

  list(filter: Partial<ConnectorAuditRecord> = {}, limit = 50): Promise<ConnectorAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditTypes.ts`

```text
export interface ConnectorAuditRecord {
  id: string; teamId: string; connectorKey: string; action: string; actorUserId: string; occurredAt: string;
}

export interface ConnectorAuditRecordRepository {
  create(record: ConnectorAuditRecord): Promise<ConnectorAuditRecord>;
  update(id: string, patch: Partial<ConnectorAuditRecord>): Promise<ConnectorAuditRecord | null>;
  list(filter: Partial<ConnectorAuditRecord>, limit: number): Promise<ConnectorAuditRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/index.ts`

```text
export * from "./connectorAuditTypes.js";
export * from "./connectorAuditService.js";
export * from "./connectorAuditRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { ConnectorCatalogRecordService } from "./connectorCatalogService.js";

export function registerConnectorCatalogRecordRoutes(router: Router, service: ConnectorCatalogRecordService): void {
  router.get("/pack10/connectorCatalog", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/connectorCatalog", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogService.ts`

```text
import type { ConnectorCatalogRecord, ConnectorCatalogRecordRepository } from "./connectorCatalogTypes.js";

export class ConnectorCatalogRecordService {
  constructor(private readonly repository: ConnectorCatalogRecordRepository) {}

  create(record: ConnectorCatalogRecord): Promise<ConnectorCatalogRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ConnectorCatalogRecord>): Promise<ConnectorCatalogRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("connectorCatalog-not-found");
    return updated;
  }

  list(filter: Partial<ConnectorCatalogRecord> = {}, limit = 50): Promise<ConnectorCatalogRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogTypes.ts`

```text
export interface ConnectorCatalogRecord {
  id: string; key: string; name: string; category: string; enabled: boolean; docsUrl?: string;
}

export interface ConnectorCatalogRecordRepository {
  create(record: ConnectorCatalogRecord): Promise<ConnectorCatalogRecord>;
  update(id: string, patch: Partial<ConnectorCatalogRecord>): Promise<ConnectorCatalogRecord | null>;
  list(filter: Partial<ConnectorCatalogRecord>, limit: number): Promise<ConnectorCatalogRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/defaultConnectorCatalog.ts`

```text
export const DEFAULT_CONNECTOR_CATALOG = [
  { key: "slack", name: "Slack", category: "communication" },
  { key: "microsoft-teams", name: "Microsoft Teams", category: "communication" },
  { key: "jira", name: "Jira", category: "support" },
  { key: "zendesk", name: "Zendesk", category: "support" },
  { key: "splunk", name: "Splunk", category: "security" },
  { key: "s3", name: "Amazon S3", category: "storage" }
] as const;

```


## `REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/index.ts`

```text
export * from "./connectorCatalogTypes.js";
export * from "./connectorCatalogService.js";
export * from "./connectorCatalogRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/index.ts`

```text
export * from "./common/pack10Route.js";
export * from "./common/integrationAuth.js";
export * from "./webhookEndpoints/webhookEndpointPolicy.js";
export * from "./connectorCatalog/defaultConnectorCatalog.js";
export * from "./webhookAttempts/webhookRetryPolicy.js";
export * from "./oauthConnections/oauthScopePolicy.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/index.ts`

```text
export * from "./jiraMappingsTypes.js";
export * from "./jiraMappingsService.js";
export * from "./jiraMappingsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { JiraMappingRecordService } from "./jiraMappingsService.js";

export function registerJiraMappingRecordRoutes(router: Router, service: JiraMappingRecordService): void {
  router.get("/pack10/jiraMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/jiraMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsService.ts`

```text
import type { JiraMappingRecord, JiraMappingRecordRepository } from "./jiraMappingsTypes.js";

export class JiraMappingRecordService {
  constructor(private readonly repository: JiraMappingRecordRepository) {}

  create(record: JiraMappingRecord): Promise<JiraMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<JiraMappingRecord>): Promise<JiraMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("jiraMappings-not-found");
    return updated;
  }

  list(filter: Partial<JiraMappingRecord> = {}, limit = 50): Promise<JiraMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsTypes.ts`

```text
export interface JiraMappingRecord {
  id: string; teamId: string; projectKey: string; issueType: string; eventType: string;
}

export interface JiraMappingRecordRepository {
  create(record: JiraMappingRecord): Promise<JiraMappingRecord>;
  update(id: string, patch: Partial<JiraMappingRecord>): Promise<JiraMappingRecord | null>;
  list(filter: Partial<JiraMappingRecord>, limit: number): Promise<JiraMappingRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/index.ts`

```text
export * from "./oauthConnectionsTypes.js";
export * from "./oauthConnectionsService.js";
export * from "./oauthConnectionsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { OAuthConnectionRecordService } from "./oauthConnectionsService.js";

export function registerOAuthConnectionRecordRoutes(router: Router, service: OAuthConnectionRecordService): void {
  router.get("/pack10/oauthConnections", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/oauthConnections", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsService.ts`

```text
import type { OAuthConnectionRecord, OAuthConnectionRecordRepository } from "./oauthConnectionsTypes.js";

export class OAuthConnectionRecordService {
  constructor(private readonly repository: OAuthConnectionRecordRepository) {}

  create(record: OAuthConnectionRecord): Promise<OAuthConnectionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OAuthConnectionRecord>): Promise<OAuthConnectionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("oauthConnections-not-found");
    return updated;
  }

  list(filter: Partial<OAuthConnectionRecord> = {}, limit = 50): Promise<OAuthConnectionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsTypes.ts`

```text
export interface OAuthConnectionRecord {
  id: string; teamId: string; connectorKey: string; subject: string; scopes: string[]; expiresAt?: string;
}

export interface OAuthConnectionRecordRepository {
  create(record: OAuthConnectionRecord): Promise<OAuthConnectionRecord>;
  update(id: string, patch: Partial<OAuthConnectionRecord>): Promise<OAuthConnectionRecord | null>;
  list(filter: Partial<OAuthConnectionRecord>, limit: number): Promise<OAuthConnectionRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthScopePolicy.ts`

```text
export function scopesAllowed(requested: readonly string[], allowed: readonly string[]): boolean {
  return requested.every((scope) => allowed.includes(scope));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/siemExports/index.ts`

```text
export * from "./siemExportsTypes.js";
export * from "./siemExportsService.js";
export * from "./siemExportsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { SiemExportRecordService } from "./siemExportsService.js";

export function registerSiemExportRecordRoutes(router: Router, service: SiemExportRecordService): void {
  router.get("/pack10/siemExports", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/siemExports", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsService.ts`

```text
import type { SiemExportRecord, SiemExportRecordRepository } from "./siemExportsTypes.js";

export class SiemExportRecordService {
  constructor(private readonly repository: SiemExportRecordRepository) {}

  create(record: SiemExportRecord): Promise<SiemExportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SiemExportRecord>): Promise<SiemExportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("siemExports-not-found");
    return updated;
  }

  list(filter: Partial<SiemExportRecord> = {}, limit = 50): Promise<SiemExportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsTypes.ts`

```text
export interface SiemExportRecord {
  id: string; teamId: string; destination: 'splunk' | 'datadog' | 'elastic' | 'custom'; enabled: boolean;
}

export interface SiemExportRecordRepository {
  create(record: SiemExportRecord): Promise<SiemExportRecord>;
  update(id: string, patch: Partial<SiemExportRecord>): Promise<SiemExportRecord | null>;
  list(filter: Partial<SiemExportRecord>, limit: number): Promise<SiemExportRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/index.ts`

```text
export * from "./slackMappingsTypes.js";
export * from "./slackMappingsService.js";
export * from "./slackMappingsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { SlackMappingRecordService } from "./slackMappingsService.js";

export function registerSlackMappingRecordRoutes(router: Router, service: SlackMappingRecordService): void {
  router.get("/pack10/slackMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/slackMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsService.ts`

```text
import type { SlackMappingRecord, SlackMappingRecordRepository } from "./slackMappingsTypes.js";

export class SlackMappingRecordService {
  constructor(private readonly repository: SlackMappingRecordRepository) {}

  create(record: SlackMappingRecord): Promise<SlackMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SlackMappingRecord>): Promise<SlackMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("slackMappings-not-found");
    return updated;
  }

  list(filter: Partial<SlackMappingRecord> = {}, limit = 50): Promise<SlackMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsTypes.ts`

```text
export interface SlackMappingRecord {
  id: string; teamId: string; channelId: string; eventType: string; enabled: boolean;
}

export interface SlackMappingRecordRepository {
  create(record: SlackMappingRecord): Promise<SlackMappingRecord>;
  update(id: string, patch: Partial<SlackMappingRecord>): Promise<SlackMappingRecord | null>;
  list(filter: Partial<SlackMappingRecord>, limit: number): Promise<SlackMappingRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/index.ts`

```text
export * from "./storageConnectorsTypes.js";
export * from "./storageConnectorsService.js";
export * from "./storageConnectorsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { StorageConnectorRecordService } from "./storageConnectorsService.js";

export function registerStorageConnectorRecordRoutes(router: Router, service: StorageConnectorRecordService): void {
  router.get("/pack10/storageConnectors", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/storageConnectors", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsService.ts`

```text
import type { StorageConnectorRecord, StorageConnectorRecordRepository } from "./storageConnectorsTypes.js";

export class StorageConnectorRecordService {
  constructor(private readonly repository: StorageConnectorRecordRepository) {}

  create(record: StorageConnectorRecord): Promise<StorageConnectorRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<StorageConnectorRecord>): Promise<StorageConnectorRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("storageConnectors-not-found");
    return updated;
  }

  list(filter: Partial<StorageConnectorRecord> = {}, limit = 50): Promise<StorageConnectorRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsTypes.ts`

```text
export interface StorageConnectorRecord {
  id: string; teamId: string; provider: 's3' | 'gcs' | 'azure_blob'; bucket: string; prefix?: string; enabled: boolean;
}

export interface StorageConnectorRecordRepository {
  create(record: StorageConnectorRecord): Promise<StorageConnectorRecord>;
  update(id: string, patch: Partial<StorageConnectorRecord>): Promise<StorageConnectorRecord | null>;
  list(filter: Partial<StorageConnectorRecord>, limit: number): Promise<StorageConnectorRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/index.ts`

```text
export * from "./teamConnectorsTypes.js";
export * from "./teamConnectorsService.js";
export * from "./teamConnectorsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { TeamConnectorRecordService } from "./teamConnectorsService.js";

export function registerTeamConnectorRecordRoutes(router: Router, service: TeamConnectorRecordService): void {
  router.get("/pack10/teamConnectors", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/teamConnectors", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsService.ts`

```text
import type { TeamConnectorRecord, TeamConnectorRecordRepository } from "./teamConnectorsTypes.js";

export class TeamConnectorRecordService {
  constructor(private readonly repository: TeamConnectorRecordRepository) {}

  create(record: TeamConnectorRecord): Promise<TeamConnectorRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TeamConnectorRecord>): Promise<TeamConnectorRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("teamConnectors-not-found");
    return updated;
  }

  list(filter: Partial<TeamConnectorRecord> = {}, limit = 50): Promise<TeamConnectorRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsTypes.ts`

```text
export interface TeamConnectorRecord {
  id: string; teamId: string; connectorKey: string; authState: string; connectedAt?: string; revokedAt?: string;
}

export interface TeamConnectorRecordRepository {
  create(record: TeamConnectorRecord): Promise<TeamConnectorRecord>;
  update(id: string, patch: Partial<TeamConnectorRecord>): Promise<TeamConnectorRecord | null>;
  list(filter: Partial<TeamConnectorRecord>, limit: number): Promise<TeamConnectorRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/index.ts`

```text
export * from "./teamsMappingsTypes.js";
export * from "./teamsMappingsService.js";
export * from "./teamsMappingsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { TeamsMappingRecordService } from "./teamsMappingsService.js";

export function registerTeamsMappingRecordRoutes(router: Router, service: TeamsMappingRecordService): void {
  router.get("/pack10/teamsMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/teamsMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsService.ts`

```text
import type { TeamsMappingRecord, TeamsMappingRecordRepository } from "./teamsMappingsTypes.js";

export class TeamsMappingRecordService {
  constructor(private readonly repository: TeamsMappingRecordRepository) {}

  create(record: TeamsMappingRecord): Promise<TeamsMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TeamsMappingRecord>): Promise<TeamsMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("teamsMappings-not-found");
    return updated;
  }

  list(filter: Partial<TeamsMappingRecord> = {}, limit = 50): Promise<TeamsMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsTypes.ts`

```text
export interface TeamsMappingRecord {
  id: string; teamId: string; webhookUrl: string; eventType: string; enabled: boolean;
}

export interface TeamsMappingRecordRepository {
  create(record: TeamsMappingRecord): Promise<TeamsMappingRecord>;
  update(id: string, patch: Partial<TeamsMappingRecord>): Promise<TeamsMappingRecord | null>;
  list(filter: Partial<TeamsMappingRecord>, limit: number): Promise<TeamsMappingRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/index.ts`

```text
export * from "./webhookAttemptsTypes.js";
export * from "./webhookAttemptsService.js";
export * from "./webhookAttemptsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { WebhookAttemptRecordService } from "./webhookAttemptsService.js";

export function registerWebhookAttemptRecordRoutes(router: Router, service: WebhookAttemptRecordService): void {
  router.get("/pack10/webhookAttempts", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/webhookAttempts", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsService.ts`

```text
import type { WebhookAttemptRecord, WebhookAttemptRecordRepository } from "./webhookAttemptsTypes.js";

export class WebhookAttemptRecordService {
  constructor(private readonly repository: WebhookAttemptRecordRepository) {}

  create(record: WebhookAttemptRecord): Promise<WebhookAttemptRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WebhookAttemptRecord>): Promise<WebhookAttemptRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("webhookAttempts-not-found");
    return updated;
  }

  list(filter: Partial<WebhookAttemptRecord> = {}, limit = 50): Promise<WebhookAttemptRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsTypes.ts`

```text
export interface WebhookAttemptRecord {
  id: string; endpointId: string; status: 'pending' | 'delivered' | 'failed'; attempts: number; nextAttemptAt?: string;
}

export interface WebhookAttemptRecordRepository {
  create(record: WebhookAttemptRecord): Promise<WebhookAttemptRecord>;
  update(id: string, patch: Partial<WebhookAttemptRecord>): Promise<WebhookAttemptRecord | null>;
  list(filter: Partial<WebhookAttemptRecord>, limit: number): Promise<WebhookAttemptRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookRetryPolicy.ts`

```text
export function nextConnectorWebhookRetry(attempts: number, now = Date.now()): number | null {
  if (attempts >= 8) return null;
  return now + Math.min(60 * 60 * 1000, 1000 * 2 ** attempts);
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/index.ts`

```text
export * from "./webhookEndpointsTypes.js";
export * from "./webhookEndpointsService.js";
export * from "./webhookEndpointsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointPolicy.ts`

```text
export function validateWebhookEndpoint(url: string): string[] {
  const errors: string[] = [];
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") errors.push("https-required");
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") errors.push("local-url-blocked");
  } catch {
    errors.push("invalid-url");
  }
  return errors;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { WebhookEndpointRecordService } from "./webhookEndpointsService.js";

export function registerWebhookEndpointRecordRoutes(router: Router, service: WebhookEndpointRecordService): void {
  router.get("/pack10/webhookEndpoints", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/webhookEndpoints", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsService.ts`

```text
import type { WebhookEndpointRecord, WebhookEndpointRecordRepository } from "./webhookEndpointsTypes.js";

export class WebhookEndpointRecordService {
  constructor(private readonly repository: WebhookEndpointRecordRepository) {}

  create(record: WebhookEndpointRecord): Promise<WebhookEndpointRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WebhookEndpointRecord>): Promise<WebhookEndpointRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("webhookEndpoints-not-found");
    return updated;
  }

  list(filter: Partial<WebhookEndpointRecord> = {}, limit = 50): Promise<WebhookEndpointRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsTypes.ts`

```text
export interface WebhookEndpointRecord {
  id: string; teamId: string; url: string; eventTypes: string[]; enabled: boolean; createdAt: string;
}

export interface WebhookEndpointRecordRepository {
  create(record: WebhookEndpointRecord): Promise<WebhookEndpointRecord>;
  update(id: string, patch: Partial<WebhookEndpointRecord>): Promise<WebhookEndpointRecord | null>;
  list(filter: Partial<WebhookEndpointRecord>, limit: number): Promise<WebhookEndpointRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/index.ts`

```text
export * from "./zendeskMappingsTypes.js";
export * from "./zendeskMappingsService.js";
export * from "./zendeskMappingsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsRoutes.ts`

```text
import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { ZendeskMappingRecordService } from "./zendeskMappingsService.js";

export function registerZendeskMappingRecordRoutes(router: Router, service: ZendeskMappingRecordService): void {
  router.get("/pack10/zendeskMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/zendeskMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsService.ts`

```text
import type { ZendeskMappingRecord, ZendeskMappingRecordRepository } from "./zendeskMappingsTypes.js";

export class ZendeskMappingRecordService {
  constructor(private readonly repository: ZendeskMappingRecordRepository) {}

  create(record: ZendeskMappingRecord): Promise<ZendeskMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ZendeskMappingRecord>): Promise<ZendeskMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("zendeskMappings-not-found");
    return updated;
  }

  list(filter: Partial<ZendeskMappingRecord> = {}, limit = 50): Promise<ZendeskMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsTypes.ts`

```text
export interface ZendeskMappingRecord {
  id: string; teamId: string; groupId?: string; priority: string; eventType: string;
}

export interface ZendeskMappingRecordRepository {
  create(record: ZendeskMappingRecord): Promise<ZendeskMappingRecord>;
  update(id: string, patch: Partial<ZendeskMappingRecord>): Promise<ZendeskMappingRecord | null>;
  list(filter: Partial<ZendeskMappingRecord>, limit: number): Promise<ZendeskMappingRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack10/ConnectorStatusPanel.tsx`

```text
import React from "react";
import type { DesktopConnectorStatus } from "./connectorStatusStore.js";

export function ConnectorStatusPanel(props: { statuses: DesktopConnectorStatus[]; onReconnect: (key: string) => void }): JSX.Element {
  return (
    <section>
      <h3>Integrations</h3>
      <ul>
        {props.statuses.map((status) => (
          <li key={status.connectorKey} data-state={status.state}>
            <strong>{status.connectorKey}</strong> · {status.state}
            {(status.state === "expired" || status.state === "error") && <button onClick={() => props.onReconnect(status.connectorKey)}>Reconnect</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack10/connectorStatusStore.ts`

```text
export interface DesktopConnectorStatus {
  connectorKey: string;
  state: "not_connected" | "connected" | "expired" | "error";
  lastSyncAt?: string;
}

export function connectorStatusNeedsAttention(status: DesktopConnectorStatus): boolean {
  return status.state === "expired" || status.state === "error";
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack10/index.ts`

```text
export * from "./connectorStatusStore.js";
export * from "./ConnectorStatusPanel.js";
export * from "./integrationNotificationBridge.js";

```


## `REVIEW_REQUIRED/apps/desktop/src/pack10/integrationNotificationBridge.ts`

```text
export interface IntegrationNotification {
  id: string;
  connectorKey: string;
  title: string;
  body: string;
  createdAt: string;
}

export function filterConnectorNotifications(items: readonly IntegrationNotification[], connectorKey: string): IntegrationNotification[] {
  return items.filter((item) => item.connectorKey === connectorKey);
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/ConnectorAuditPage.tsx`

```text
import React from "react";

export interface ConnectorAuditPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ConnectorAuditPage(props: { rows: ConnectorAuditPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Connector audit</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/ConnectorMarketplacePage.tsx`

```text
import React from "react";

export interface ConnectorMarketplacePageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ConnectorMarketplacePage(props: { rows: ConnectorMarketplacePageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Connector marketplace</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/JiraMappingsPage.tsx`

```text
import React from "react";

export interface JiraMappingsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function JiraMappingsPage(props: { rows: JiraMappingsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Jira mappings</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/OAuthConnectionsPage.tsx`

```text
import React from "react";

export interface OAuthConnectionsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function OAuthConnectionsPage(props: { rows: OAuthConnectionsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>OAuth connections</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/SiemExportsPage.tsx`

```text
import React from "react";

export interface SiemExportsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function SiemExportsPage(props: { rows: SiemExportsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>SIEM exports</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/SlackMappingsPage.tsx`

```text
import React from "react";

export interface SlackMappingsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function SlackMappingsPage(props: { rows: SlackMappingsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Slack mappings</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/StorageConnectorsPage.tsx`

```text
import React from "react";

export interface StorageConnectorsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function StorageConnectorsPage(props: { rows: StorageConnectorsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Storage connectors</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/TeamConnectorsPage.tsx`

```text
import React from "react";

export interface TeamConnectorsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function TeamConnectorsPage(props: { rows: TeamConnectorsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Team connectors</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/TeamsMappingsPage.tsx`

```text
import React from "react";

export interface TeamsMappingsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function TeamsMappingsPage(props: { rows: TeamsMappingsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Teams mappings</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/WebhookAttemptsPage.tsx`

```text
import React from "react";

export interface WebhookAttemptsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function WebhookAttemptsPage(props: { rows: WebhookAttemptsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Webhook attempts</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/WebhookEndpointsPage.tsx`

```text
import React from "react";

export interface WebhookEndpointsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function WebhookEndpointsPage(props: { rows: WebhookEndpointsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Webhook endpoints</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/components/ZendeskMappingsPage.tsx`

```text
import React from "react";

export interface ZendeskMappingsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ZendeskMappingsPage(props: { rows: ZendeskMappingsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Zendesk mappings</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useConnectorAudit.ts`

```text
import { useEffect, useState } from "react";

export interface useConnectorAuditResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useConnectorAudit<T>(loader: () => Promise<T>): useConnectorAuditResult<T> {
  const [state, setState] = useState<useConnectorAuditResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useConnectorCatalog.ts`

```text
import { useEffect, useState } from "react";

export interface useConnectorCatalogResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useConnectorCatalog<T>(loader: () => Promise<T>): useConnectorCatalogResult<T> {
  const [state, setState] = useState<useConnectorCatalogResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useJiraMappings.ts`

```text
import { useEffect, useState } from "react";

export interface useJiraMappingsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useJiraMappings<T>(loader: () => Promise<T>): useJiraMappingsResult<T> {
  const [state, setState] = useState<useJiraMappingsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useOAuthConnections.ts`

```text
import { useEffect, useState } from "react";

export interface useOAuthConnectionsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useOAuthConnections<T>(loader: () => Promise<T>): useOAuthConnectionsResult<T> {
  const [state, setState] = useState<useOAuthConnectionsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useSiemExports.ts`

```text
import { useEffect, useState } from "react";

export interface useSiemExportsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useSiemExports<T>(loader: () => Promise<T>): useSiemExportsResult<T> {
  const [state, setState] = useState<useSiemExportsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useSlackMappings.ts`

```text
import { useEffect, useState } from "react";

export interface useSlackMappingsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useSlackMappings<T>(loader: () => Promise<T>): useSlackMappingsResult<T> {
  const [state, setState] = useState<useSlackMappingsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useStorageConnectors.ts`

```text
import { useEffect, useState } from "react";

export interface useStorageConnectorsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useStorageConnectors<T>(loader: () => Promise<T>): useStorageConnectorsResult<T> {
  const [state, setState] = useState<useStorageConnectorsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useTeamConnectors.ts`

```text
import { useEffect, useState } from "react";

export interface useTeamConnectorsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useTeamConnectors<T>(loader: () => Promise<T>): useTeamConnectorsResult<T> {
  const [state, setState] = useState<useTeamConnectorsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useTeamsMappings.ts`

```text
import { useEffect, useState } from "react";

export interface useTeamsMappingsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useTeamsMappings<T>(loader: () => Promise<T>): useTeamsMappingsResult<T> {
  const [state, setState] = useState<useTeamsMappingsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useWebhookAttempts.ts`

```text
import { useEffect, useState } from "react";

export interface useWebhookAttemptsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useWebhookAttempts<T>(loader: () => Promise<T>): useWebhookAttemptsResult<T> {
  const [state, setState] = useState<useWebhookAttemptsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useWebhookEndpoints.ts`

```text
import { useEffect, useState } from "react";

export interface useWebhookEndpointsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useWebhookEndpoints<T>(loader: () => Promise<T>): useWebhookEndpointsResult<T> {
  const [state, setState] = useState<useWebhookEndpointsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/hooks/useZendeskMappings.ts`

```text
import { useEffect, useState } from "react";

export interface useZendeskMappingsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useZendeskMappings<T>(loader: () => Promise<T>): useZendeskMappingsResult<T> {
  const [state, setState] = useState<useZendeskMappingsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack10/index.ts`

```text
export * from "./components/ConnectorMarketplacePage.js";
export * from "./components/TeamConnectorsPage.js";
export * from "./components/OAuthConnectionsPage.js";
export * from "./components/WebhookEndpointsPage.js";
export * from "./components/WebhookAttemptsPage.js";
export * from "./components/SlackMappingsPage.js";
export * from "./components/TeamsMappingsPage.js";
export * from "./components/JiraMappingsPage.js";
export * from "./components/ZendeskMappingsPage.js";
export * from "./components/SiemExportsPage.js";
export * from "./components/StorageConnectorsPage.js";
export * from "./components/ConnectorAuditPage.js";
export * from "./hooks/useConnectorCatalog.js";
export * from "./hooks/useTeamConnectors.js";
export * from "./hooks/useOAuthConnections.js";
export * from "./hooks/useWebhookEndpoints.js";
export * from "./hooks/useWebhookAttempts.js";
export * from "./hooks/useSlackMappings.js";
export * from "./hooks/useTeamsMappings.js";
export * from "./hooks/useJiraMappings.js";
export * from "./hooks/useZendeskMappings.js";
export * from "./hooks/useSiemExports.js";
export * from "./hooks/useStorageConnectors.js";
export * from "./hooks/useConnectorAudit.js";

```


## `SAFE_DIRECT_COPY/docs/pack10/01-merge-guide.md`

```text
Pack 10 adds connector marketplace, OAuth connections, webhooks, Slack/Teams/Jira/Zendesk/SIEM/storage connector scaffolding, connector audit, web admin pages and desktop connector status.

```


## `SAFE_DIRECT_COPY/docs/pack10/02-oauth-security.md`

```text
OAuth state and nonce must be validated. Store tokens encrypted through the existing secret manager. Never log access tokens or refresh tokens.

```


## `SAFE_DIRECT_COPY/docs/pack10/03-webhook-security.md`

```text
Webhook endpoints must require HTTPS, block local URLs, sign payloads and retry with bounded backoff.

```


## `SAFE_DIRECT_COPY/docs/pack10/04-marketplace-governance.md`

```text
Connector catalog entries should be reviewed before enabling them for all customers. Internal connectors should be hidden from normal tenants.

```


## `SAFE_DIRECT_COPY/docs/pack10/05-storage-connectors.md`

```text
Storage connectors need bucket/prefix validation and least-privilege credentials. Do not store raw storage secrets in generated code.

```


## `SAFE_DIRECT_COPY/docs/pack10/06-siem-export.md`

```text
SIEM exports should be batched, signed where supported, redacted, and monitored for delivery failures.

```


## `SAFE_DIRECT_COPY/docs/pack10/07-qa-checklist.md`

```text
Verify connector admin auth, OAuth state validation, HTTPS webhook enforcement, retry limits, scope checks, desktop connector warnings and audit records.

```


## `SAFE_DIRECT_COPY/infra/pack10/prometheus-connector-alerts.yml`

```text
groups:
  - name: remotedesk-connectors-pack10
    rules:
      - alert: RemoteDeskWebhookDeliveryFailures
        expr: rate(remotedesk_webhook_delivery_failures_total[10m]) > 0.05
        for: 10m
        labels:
          severity: warning
      - alert: RemoteDeskConnectorAuthExpired
        expr: remotedesk_connector_auth_expired_total > 0
        for: 30m
        labels:
          severity: info

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorAuthState.ts`

```text
export type ConnectorAuthState = "not_connected" | "pending" | "connected" | "expired" | "revoked" | "error";

export function connectorNeedsReconnect(state: ConnectorAuthState): boolean {
  return state === "expired" || state === "revoked" || state === "error";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorDisplayName.ts`

```text
export function normalizeConnectorDisplayName(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorRateLimit.ts`

```text
export interface ConnectorRateLimit {
  perMinute: number;
  usedThisMinute: number;
  resetAt: number;
}

export function canSendConnectorRequest(limit: ConnectorRateLimit, now = Date.now()): boolean {
  if (now >= limit.resetAt) return true;
  return limit.usedThisMinute < limit.perMinute;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack10/externalLinkSafety.ts`

```text
export function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack10/index.ts`

```text
export * from "./connectorAuthState.js";
export * from "./oauthStateToken.js";
export * from "./webhookEventFilter.js";
export * from "./connectorRateLimit.js";
export * from "./externalLinkSafety.js";
export * from "./connectorDisplayName.js";
export * from "./marketplaceCategory.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack10/marketplaceCategory.ts`

```text
export type MarketplaceCategory = "communication" | "support" | "security" | "storage" | "automation" | "developer";

export function categoryLabel(category: MarketplaceCategory): string {
  return category.split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack10/oauthStateToken.ts`

```text
export interface OAuthStateToken {
  state: string;
  nonce: string;
  expiresAt: number;
}

export function isOAuthStateValid(token: OAuthStateToken, state: string, now = Date.now()): boolean {
  return token.state === state && token.expiresAt > now && token.nonce.length >= 12;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack10/webhookEventFilter.ts`

```text
export interface WebhookEventFilter {
  eventTypes: readonly string[];
  teamIds?: readonly string[];
}

export function webhookEventAllowed(filter: WebhookEventFilter, event: { type: string; teamId?: string }): boolean {
  if (!filter.eventTypes.includes(event.type)) return false;
  if (filter.teamIds && event.teamId && !filter.teamIds.includes(event.teamId)) return false;
  return true;
}

```


## `SAFE_DIRECT_COPY/scripts/pack10/check-no-connector-secrets.mjs`

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
      if (/refresh_token\s*=|access_token\s*=|client_secret\s*=/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("Potential connector secrets found:", bad); process.exit(1); }
console.log("No connector secrets found.");

```


## `SAFE_DIRECT_COPY/tests/pack10/connectorAuthState.test.ts`

```text
import assert from "node:assert/strict"; import { connectorNeedsReconnect } from "../../packages/shared/src/pack10/connectorAuthState.js"; assert.equal(connectorNeedsReconnect("expired"), true); assert.equal(connectorNeedsReconnect("connected"), false);

```


## `SAFE_DIRECT_COPY/tests/pack10/connectorStatusStore.test.ts`

```text
import assert from "node:assert/strict"; import { connectorStatusNeedsAttention } from "../../REVIEW_REQUIRED/apps/desktop/src/pack10/connectorStatusStore.js"; assert.equal(connectorStatusNeedsAttention({ connectorKey: "slack", state: "error" }), true);

```


## `SAFE_DIRECT_COPY/tests/pack10/externalLinkSafety.test.ts`

```text
import assert from "node:assert/strict"; import { isSafeExternalUrl } from "../../packages/shared/src/pack10/externalLinkSafety.js"; assert.equal(isSafeExternalUrl("https://example.com"), true); assert.equal(isSafeExternalUrl("http://example.com"), false);

```


## `SAFE_DIRECT_COPY/tests/pack10/oauthScopePolicy.test.ts`

```text
import assert from "node:assert/strict"; import { scopesAllowed } from "../../REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthScopePolicy.js"; assert.equal(scopesAllowed(["read"], ["read", "write"]), true); assert.equal(scopesAllowed(["admin"], ["read"]), false);

```


## `SAFE_DIRECT_COPY/tests/pack10/oauthStateToken.test.ts`

```text
import assert from "node:assert/strict"; import { isOAuthStateValid } from "../../packages/shared/src/pack10/oauthStateToken.js"; assert.equal(isOAuthStateValid({ state: "s", nonce: "abcdefghijkl", expiresAt: 9999999999999 }, "s"), true);

```


## `SAFE_DIRECT_COPY/tests/pack10/webhookEndpointPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { validateWebhookEndpoint } from "../../REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointPolicy.js"; assert.deepEqual(validateWebhookEndpoint("https://example.com/hook"), []); assert.ok(validateWebhookEndpoint("http://example.com").includes("https-required"));

```


## `SAFE_DIRECT_COPY/tests/pack10/webhookEventFilter.test.ts`

```text
import assert from "node:assert/strict"; import { webhookEventAllowed } from "../../packages/shared/src/pack10/webhookEventFilter.js"; assert.equal(webhookEventAllowed({ eventTypes: ["session.started"] }, { type: "session.started" }), true);

```


## `SAFE_DIRECT_COPY/tests/pack10/webhookRetryPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { nextConnectorWebhookRetry } from "../../REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookRetryPolicy.js"; assert.equal(nextConnectorWebhookRetry(8), null); assert.equal(typeof nextConnectorWebhookRetry(1, 0), "number");

```


## `generated-remotedesk-integrations-marketplace-pack-10-code-review.md`

```text
Review OAuth state validation, secret storage, webhook HTTPS enforcement, connector admin authorization, SIEM/storage redaction, webhook retry policy and desktop connector status privacy.

```


## `generated-remotedesk-integrations-marketplace-pack-10-manifest.json`

```text
{
  "name": "generated-remotedesk-integrations-marketplace-pack-10",
  "createdAt": "2026-06-14T16:47:53.335304+00:00",
  "actualFileCount": 120,
  "safeDirectCopyCount": 25,
  "reviewRequiredCount": 84,
  "patchesCount": 4,
  "doNotMergeCount": 0,
  "filesByArea": {
    "shared": 8,
    "api": 55,
    "web": 25,
    "desktop": 4,
    "tests": 8,
    "docs": 7,
    "scripts": 1,
    "infra": 1
  },
  "safeDirectCopy": [
    "SAFE_DIRECT_COPY/docs/pack10/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack10/02-oauth-security.md",
    "SAFE_DIRECT_COPY/docs/pack10/03-webhook-security.md",
    "SAFE_DIRECT_COPY/docs/pack10/04-marketplace-governance.md",
    "SAFE_DIRECT_COPY/docs/pack10/05-storage-connectors.md",
    "SAFE_DIRECT_COPY/docs/pack10/06-siem-export.md",
    "SAFE_DIRECT_COPY/docs/pack10/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack10/prometheus-connector-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorAuthState.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorDisplayName.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack10/connectorRateLimit.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack10/externalLinkSafety.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack10/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack10/marketplaceCategory.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack10/oauthStateToken.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack10/webhookEventFilter.ts",
    "SAFE_DIRECT_COPY/scripts/pack10/check-no-connector-secrets.mjs",
    "SAFE_DIRECT_COPY/tests/pack10/connectorAuthState.test.ts",
    "SAFE_DIRECT_COPY/tests/pack10/connectorStatusStore.test.ts",
    "SAFE_DIRECT_COPY/tests/pack10/externalLinkSafety.test.ts",
    "SAFE_DIRECT_COPY/tests/pack10/oauthScopePolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack10/oauthStateToken.test.ts",
    "SAFE_DIRECT_COPY/tests/pack10/webhookEndpointPolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack10/webhookEventFilter.test.ts",
    "SAFE_DIRECT_COPY/tests/pack10/webhookRetryPolicy.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack10/common/integrationAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/common/pack10Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/connectorAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/connectorCatalogTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/defaultConnectorCatalog.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/connectorCatalog/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/jiraMappings/jiraMappingsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthConnectionsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/oauthConnections/oauthScopePolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/siemExports/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/siemExports/siemExportsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/slackMappings/slackMappingsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/storageConnectors/storageConnectorsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/teamConnectors/teamConnectorsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/teamsMappings/teamsMappingsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookAttemptsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookAttempts/webhookRetryPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/webhookEndpoints/webhookEndpointsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack10/zendeskMappings/zendeskMappingsTypes.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack10/ConnectorStatusPanel.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack10/connectorStatusStore.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack10/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack10/integrationNotificationBridge.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/ConnectorAuditPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/ConnectorMarketplacePage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/JiraMappingsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/OAuthConnectionsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/SiemExportsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/SlackMappingsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/StorageConnectorsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/TeamConnectorsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/TeamsMappingsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/WebhookAttemptsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/WebhookEndpointsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/components/ZendeskMappingsPage.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useConnectorAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useConnectorCatalog.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useJiraMappings.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useOAuthConnections.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useSiemExports.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useSlackMappings.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useStorageConnectors.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useTeamConnectors.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useTeamsMappings.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useWebhookAttempts.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useWebhookEndpoints.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/hooks/useZendeskMappings.ts",
    "REVIEW_REQUIRED/apps/web/src/pack10/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack10.patch.md",
    "PATCHES/desktop-pack10.patch.md",
    "PATCHES/ops-pack10.patch.md",
    "PATCHES/web-pack10.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "OAuth token storage needs existing secret manager.",
    "External connector API calls are not implemented; this pack adds safe contract/wiring layers.",
    "Webhook signing keys must be generated and rotated by the real API.",
    "Desktop does not receive OAuth secrets."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 84-92% with prior packs after persistence, provider integrations, and QA"
}
```


## `generated-remotedesk-integrations-marketplace-pack-10-merge-summary.md`

```text
Pack 10 adds connector marketplace, team connectors, OAuth connections, webhooks, Slack/Teams/Jira/Zendesk/SIEM/storage mapping layers, connector audit, web admin pages, desktop connector status, tests/docs/scripts.

```


## `generated-remotedesk-integrations-marketplace-pack-10-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| OAuth token leak | Critical | encrypted secret manager, no desktop exposure |
| SSRF via webhook URL | Critical | HTTPS/local URL blocking |
| Connector route exposed | High | integration admin auth |
| Webhook retry storm | Medium | bounded backoff |
| SIEM export PII | High | redaction and audit |

```


## `generated-remotedesk-integrations-marketplace-pack-10-test-plan.md`

```text
Run Pack 10 shared/API/desktop tests, no-connector-secrets scanner, then manual QA for connector catalog, OAuth state, webhook URL validation, Slack/Teams/Jira/Zendesk mapping pages, SIEM/storage connector pages and desktop connector warnings.

```
