# generated-remotedesk-webviewer-collaboration-pack-14 full code


## `FILE_TREE.txt`

```text
PATCHES/api-pack14.patch.md
PATCHES/desktop-pack14.patch.md
PATCHES/ops-pack14.patch.md
PATCHES/web-pack14.patch.md
REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationService.ts
REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditService.ts
REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/common/pack14Route.ts
REVIEW_REQUIRED/apps/api/src/pack14/common/sessionCollaborationAuth.ts
REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsService.ts
REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/annotationPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsService.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksService.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitePolicy.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesService.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesService.ts
REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsService.ts
REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionPolicy.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsService.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsTypes.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/index.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterRoutes.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterService.ts
REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterTypes.ts
REVIEW_REQUIRED/apps/desktop/src/pack14/annotationOverlay.ts
REVIEW_REQUIRED/apps/desktop/src/pack14/collaborationStatusStore.ts
REVIEW_REQUIRED/apps/desktop/src/pack14/hostConsentDialog.tsx
REVIEW_REQUIRED/apps/desktop/src/pack14/index.ts
REVIEW_REQUIRED/apps/desktop/src/pack14/safePermissionNotice.tsx
REVIEW_REQUIRED/apps/desktop/src/pack14/viewerRosterPopover.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/AnnotationToolbar.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/ChatModerationPanel.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/HostConsentPrompt.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/SessionBookmarksPanel.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/SessionInvitePanel.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/SessionNotesPanel.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/SupportHandoffPanel.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/ViewerPermissionEditor.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/ViewerRosterPanel.tsx
REVIEW_REQUIRED/apps/web/src/pack14/components/WebViewerShell.tsx
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useChatModeration.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useCollaborationAudit.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useHostConsent.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionAnnotations.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionBookmarks.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionInvites.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionNotes.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSupportHandoffs.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useViewerPermissions.ts
REVIEW_REQUIRED/apps/web/src/pack14/hooks/useViewerRoster.ts
REVIEW_REQUIRED/apps/web/src/pack14/index.ts
SAFE_DIRECT_COPY/docs/pack14/01-merge-guide.md
SAFE_DIRECT_COPY/docs/pack14/02-viewer-permissions.md
SAFE_DIRECT_COPY/docs/pack14/03-host-consent.md
SAFE_DIRECT_COPY/docs/pack14/04-annotations.md
SAFE_DIRECT_COPY/docs/pack14/05-chat-moderation.md
SAFE_DIRECT_COPY/docs/pack14/06-support-handoff.md
SAFE_DIRECT_COPY/docs/pack14/07-qa-checklist.md
SAFE_DIRECT_COPY/infra/pack14/prometheus-collaboration-alerts.yml
SAFE_DIRECT_COPY/packages/shared/src/pack14/annotationModel.ts
SAFE_DIRECT_COPY/packages/shared/src/pack14/chatModeration.ts
SAFE_DIRECT_COPY/packages/shared/src/pack14/consentState.ts
SAFE_DIRECT_COPY/packages/shared/src/pack14/index.ts
SAFE_DIRECT_COPY/packages/shared/src/pack14/sessionInviteToken.ts
SAFE_DIRECT_COPY/packages/shared/src/pack14/sessionNote.ts
SAFE_DIRECT_COPY/packages/shared/src/pack14/supportHandoff.ts
SAFE_DIRECT_COPY/packages/shared/src/pack14/viewerPermission.ts
SAFE_DIRECT_COPY/packages/shared/src/pack14/viewerRoster.ts
SAFE_DIRECT_COPY/scripts/pack14/check-collaboration-safe-defaults.mjs
SAFE_DIRECT_COPY/tests/pack14/annotationModel.test.ts
SAFE_DIRECT_COPY/tests/pack14/annotationOverlay.test.ts
SAFE_DIRECT_COPY/tests/pack14/chatModeration.test.ts
SAFE_DIRECT_COPY/tests/pack14/collaborationStatusStore.test.ts
SAFE_DIRECT_COPY/tests/pack14/sessionInvitePolicy.test.ts
SAFE_DIRECT_COPY/tests/pack14/sessionInviteToken.test.ts
SAFE_DIRECT_COPY/tests/pack14/supportHandoff.test.ts
SAFE_DIRECT_COPY/tests/pack14/viewerPermission.test.ts
SAFE_DIRECT_COPY/tests/pack14/viewerPermissionPolicy.test.ts
generated-remotedesk-webviewer-collaboration-pack-14-code-review.md
generated-remotedesk-webviewer-collaboration-pack-14-manifest.json
generated-remotedesk-webviewer-collaboration-pack-14-merge-summary.md
generated-remotedesk-webviewer-collaboration-pack-14-risk-register.md
generated-remotedesk-webviewer-collaboration-pack-14-test-plan.md

```


## `PATCHES/api-pack14.patch.md`

```text
Mount Pack 14 routes behind authenticated session collaboration permissions. Enforce team/session ownership in repositories. Keep remote_input and clipboard_sync stripped unless separately reviewed gates exist.

```


## `PATCHES/desktop-pack14.patch.md`

```text
Wire host consent dialog, viewer roster popover and annotation overlay into host session UI. Do not enable native input.

```


## `PATCHES/ops-pack14.patch.md`

```text
Monitor invite abuse and consent backlog. Run collaboration safe-default scanner in CI.

```


## `PATCHES/web-pack14.patch.md`

```text
Mount web viewer collaboration components inside the existing session UI. Do not expose support handoff to unverified support users.

```


## `REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationPolicy.ts`

```text
export function chatMessageAllowed(message: string): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (message.length > 2000) reasons.push("message-too-long");
  if (/\b(password|token|secret|api[_-]?key)\b/i.test(message)) reasons.push("possible-secret");
  return { allowed: reasons.length === 0, reasons };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { ChatModerationRecordService } from "./chatModerationService.js";

export function registerChatModerationRecordRoutes(router: Router, service: ChatModerationRecordService): void {
  router.get("/pack14/chatModeration", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/chatModeration", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationService.ts`

```text
import type { ChatModerationRecord, ChatModerationRecordRepository } from "./chatModerationTypes.js";

export class ChatModerationRecordService {
  constructor(private readonly repository: ChatModerationRecordRepository) {}

  create(record: ChatModerationRecord): Promise<ChatModerationRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ChatModerationRecord>): Promise<ChatModerationRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("chatModeration-not-found");
    return updated;
  }

  list(filter: Partial<ChatModerationRecord> = {}, limit = 50): Promise<ChatModerationRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationTypes.ts`

```text
export interface ChatModerationRecord {
  id: string; sessionId: string; messageId: string; allowed: boolean; reasons: string[]; checkedAt: string;
}

export interface ChatModerationRecordRepository {
  create(record: ChatModerationRecord): Promise<ChatModerationRecord>;
  update(id: string, patch: Partial<ChatModerationRecord>): Promise<ChatModerationRecord | null>;
  list(filter: Partial<ChatModerationRecord>, limit: number): Promise<ChatModerationRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/index.ts`

```text
export * from "./chatModerationTypes.js";
export * from "./chatModerationService.js";
export * from "./chatModerationRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { CollaborationAuditRecordService } from "./collaborationAuditService.js";

export function registerCollaborationAuditRecordRoutes(router: Router, service: CollaborationAuditRecordService): void {
  router.get("/pack14/collaborationAudit", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/collaborationAudit", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditService.ts`

```text
import type { CollaborationAuditRecord, CollaborationAuditRecordRepository } from "./collaborationAuditTypes.js";

export class CollaborationAuditRecordService {
  constructor(private readonly repository: CollaborationAuditRecordRepository) {}

  create(record: CollaborationAuditRecord): Promise<CollaborationAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CollaborationAuditRecord>): Promise<CollaborationAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("collaborationAudit-not-found");
    return updated;
  }

  list(filter: Partial<CollaborationAuditRecord> = {}, limit = 50): Promise<CollaborationAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditTypes.ts`

```text
export interface CollaborationAuditRecord {
  id: string; sessionId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface CollaborationAuditRecordRepository {
  create(record: CollaborationAuditRecord): Promise<CollaborationAuditRecord>;
  update(id: string, patch: Partial<CollaborationAuditRecord>): Promise<CollaborationAuditRecord | null>;
  list(filter: Partial<CollaborationAuditRecord>, limit: number): Promise<CollaborationAuditRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/index.ts`

```text
export * from "./collaborationAuditTypes.js";
export * from "./collaborationAuditService.js";
export * from "./collaborationAuditRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/common/pack14Route.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function pack14Route(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/common/sessionCollaborationAuth.ts`

```text
import type { Request, Response, NextFunction } from "express";

export function requireSessionCollaborationAccess(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.role === "support" || user?.permissions?.includes("session:collaborate")) {
    next();
    return;
  }
  res.status(403).json({ error: "session_collaboration_access_required" });
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { HostConsentRequestRecordService } from "./hostConsentRequestsService.js";

export function registerHostConsentRequestRecordRoutes(router: Router, service: HostConsentRequestRecordService): void {
  router.get("/pack14/hostConsentRequests", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/hostConsentRequests", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsService.ts`

```text
import type { HostConsentRequestRecord, HostConsentRequestRecordRepository } from "./hostConsentRequestsTypes.js";

export class HostConsentRequestRecordService {
  constructor(private readonly repository: HostConsentRequestRecordRepository) {}

  create(record: HostConsentRequestRecord): Promise<HostConsentRequestRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<HostConsentRequestRecord>): Promise<HostConsentRequestRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("hostConsentRequests-not-found");
    return updated;
  }

  list(filter: Partial<HostConsentRequestRecord> = {}, limit = 50): Promise<HostConsentRequestRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsTypes.ts`

```text
export interface HostConsentRequestRecord {
  id: string; sessionId: string; requestedByUserId: string; consentType: string; state: 'pending' | 'accepted' | 'rejected' | 'expired'; createdAt: string;
}

export interface HostConsentRequestRecordRepository {
  create(record: HostConsentRequestRecord): Promise<HostConsentRequestRecord>;
  update(id: string, patch: Partial<HostConsentRequestRecord>): Promise<HostConsentRequestRecord | null>;
  list(filter: Partial<HostConsentRequestRecord>, limit: number): Promise<HostConsentRequestRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/index.ts`

```text
export * from "./hostConsentRequestsTypes.js";
export * from "./hostConsentRequestsService.js";
export * from "./hostConsentRequestsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/index.ts`

```text
export * from "./common/pack14Route.js";
export * from "./common/sessionCollaborationAuth.js";
export * from "./viewerPermissions/viewerPermissionPolicy.js";
export * from "./sessionInvites/sessionInvitePolicy.js";
export * from "./sessionAnnotations/annotationPolicy.js";
export * from "./chatModeration/chatModerationPolicy.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/annotationPolicy.ts`

```text
export function annotationAllowed(input: { viewerCanAnnotate: boolean; sessionActive: boolean }): { allowed: boolean; reason: string } {
  if (!input.sessionActive) return { allowed: false, reason: "session-not-active" };
  if (!input.viewerCanAnnotate) return { allowed: false, reason: "annotate-permission-required" };
  return { allowed: true, reason: "allowed" };
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/index.ts`

```text
export * from "./sessionAnnotationsTypes.js";
export * from "./sessionAnnotationsService.js";
export * from "./sessionAnnotationsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { SessionAnnotationRecordService } from "./sessionAnnotationsService.js";

export function registerSessionAnnotationRecordRoutes(router: Router, service: SessionAnnotationRecordService): void {
  router.get("/pack14/sessionAnnotations", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/sessionAnnotations", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsService.ts`

```text
import type { SessionAnnotationRecord, SessionAnnotationRecordRepository } from "./sessionAnnotationsTypes.js";

export class SessionAnnotationRecordService {
  constructor(private readonly repository: SessionAnnotationRecordRepository) {}

  create(record: SessionAnnotationRecord): Promise<SessionAnnotationRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SessionAnnotationRecord>): Promise<SessionAnnotationRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("sessionAnnotations-not-found");
    return updated;
  }

  list(filter: Partial<SessionAnnotationRecord> = {}, limit = 50): Promise<SessionAnnotationRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsTypes.ts`

```text
export interface SessionAnnotationRecord {
  id: string; sessionId: string; tool: string; x: number; y: number; text?: string; createdByUserId: string; createdAt: string;
}

export interface SessionAnnotationRecordRepository {
  create(record: SessionAnnotationRecord): Promise<SessionAnnotationRecord>;
  update(id: string, patch: Partial<SessionAnnotationRecord>): Promise<SessionAnnotationRecord | null>;
  list(filter: Partial<SessionAnnotationRecord>, limit: number): Promise<SessionAnnotationRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/index.ts`

```text
export * from "./sessionBookmarksTypes.js";
export * from "./sessionBookmarksService.js";
export * from "./sessionBookmarksRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { SessionBookmarkRecordService } from "./sessionBookmarksService.js";

export function registerSessionBookmarkRecordRoutes(router: Router, service: SessionBookmarkRecordService): void {
  router.get("/pack14/sessionBookmarks", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/sessionBookmarks", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksService.ts`

```text
import type { SessionBookmarkRecord, SessionBookmarkRecordRepository } from "./sessionBookmarksTypes.js";

export class SessionBookmarkRecordService {
  constructor(private readonly repository: SessionBookmarkRecordRepository) {}

  create(record: SessionBookmarkRecord): Promise<SessionBookmarkRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SessionBookmarkRecord>): Promise<SessionBookmarkRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("sessionBookmarks-not-found");
    return updated;
  }

  list(filter: Partial<SessionBookmarkRecord> = {}, limit = 50): Promise<SessionBookmarkRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksTypes.ts`

```text
export interface SessionBookmarkRecord {
  id: string; sessionId: string; label: string; timestampMs: number; createdByUserId: string; createdAt: string;
}

export interface SessionBookmarkRecordRepository {
  create(record: SessionBookmarkRecord): Promise<SessionBookmarkRecord>;
  update(id: string, patch: Partial<SessionBookmarkRecord>): Promise<SessionBookmarkRecord | null>;
  list(filter: Partial<SessionBookmarkRecord>, limit: number): Promise<SessionBookmarkRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/index.ts`

```text
export * from "./sessionInvitesTypes.js";
export * from "./sessionInvitesService.js";
export * from "./sessionInvitesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitePolicy.ts`

```text
export function validateSessionInvite(input: { expiresAt: string; maxUses: number }): string[] {
  const errors: string[] = [];
  if (new Date(input.expiresAt) <= new Date()) errors.push("expiry-in-past");
  if (input.maxUses < 1 || input.maxUses > 25) errors.push("invalid-max-uses");
  return errors;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { SessionInviteRecordService } from "./sessionInvitesService.js";

export function registerSessionInviteRecordRoutes(router: Router, service: SessionInviteRecordService): void {
  router.get("/pack14/sessionInvites", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/sessionInvites", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesService.ts`

```text
import type { SessionInviteRecord, SessionInviteRecordRepository } from "./sessionInvitesTypes.js";

export class SessionInviteRecordService {
  constructor(private readonly repository: SessionInviteRecordRepository) {}

  create(record: SessionInviteRecord): Promise<SessionInviteRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SessionInviteRecord>): Promise<SessionInviteRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("sessionInvites-not-found");
    return updated;
  }

  list(filter: Partial<SessionInviteRecord> = {}, limit = 50): Promise<SessionInviteRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesTypes.ts`

```text
export interface SessionInviteRecord {
  id: string; sessionId: string; invitedEmailHash?: string; expiresAt: string; maxUses: number; used: number; createdByUserId: string;
}

export interface SessionInviteRecordRepository {
  create(record: SessionInviteRecord): Promise<SessionInviteRecord>;
  update(id: string, patch: Partial<SessionInviteRecord>): Promise<SessionInviteRecord | null>;
  list(filter: Partial<SessionInviteRecord>, limit: number): Promise<SessionInviteRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/index.ts`

```text
export * from "./sessionNotesTypes.js";
export * from "./sessionNotesService.js";
export * from "./sessionNotesRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { SessionNoteRecordService } from "./sessionNotesService.js";

export function registerSessionNoteRecordRoutes(router: Router, service: SessionNoteRecordService): void {
  router.get("/pack14/sessionNotes", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/sessionNotes", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesService.ts`

```text
import type { SessionNoteRecord, SessionNoteRecordRepository } from "./sessionNotesTypes.js";

export class SessionNoteRecordService {
  constructor(private readonly repository: SessionNoteRecordRepository) {}

  create(record: SessionNoteRecord): Promise<SessionNoteRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SessionNoteRecord>): Promise<SessionNoteRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("sessionNotes-not-found");
    return updated;
  }

  list(filter: Partial<SessionNoteRecord> = {}, limit = 50): Promise<SessionNoteRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesTypes.ts`

```text
export interface SessionNoteRecord {
  id: string; sessionId: string; body: string; privateToSupport: boolean; createdByUserId: string; createdAt: string;
}

export interface SessionNoteRecordRepository {
  create(record: SessionNoteRecord): Promise<SessionNoteRecord>;
  update(id: string, patch: Partial<SessionNoteRecord>): Promise<SessionNoteRecord | null>;
  list(filter: Partial<SessionNoteRecord>, limit: number): Promise<SessionNoteRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/index.ts`

```text
export * from "./supportHandoffsTypes.js";
export * from "./supportHandoffsService.js";
export * from "./supportHandoffsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { SupportHandoffRecordService } from "./supportHandoffsService.js";

export function registerSupportHandoffRecordRoutes(router: Router, service: SupportHandoffRecordService): void {
  router.get("/pack14/supportHandoffs", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/supportHandoffs", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsService.ts`

```text
import type { SupportHandoffRecord, SupportHandoffRecordRepository } from "./supportHandoffsTypes.js";

export class SupportHandoffRecordService {
  constructor(private readonly repository: SupportHandoffRecordRepository) {}

  create(record: SupportHandoffRecord): Promise<SupportHandoffRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SupportHandoffRecord>): Promise<SupportHandoffRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("supportHandoffs-not-found");
    return updated;
  }

  list(filter: Partial<SupportHandoffRecord> = {}, limit = 50): Promise<SupportHandoffRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsTypes.ts`

```text
export interface SupportHandoffRecord {
  id: string; sessionId: string; fromUserId: string; toSupportUserId: string; state: 'requested' | 'accepted' | 'rejected' | 'completed'; createdAt: string;
}

export interface SupportHandoffRecordRepository {
  create(record: SupportHandoffRecord): Promise<SupportHandoffRecord>;
  update(id: string, patch: Partial<SupportHandoffRecord>): Promise<SupportHandoffRecord | null>;
  list(filter: Partial<SupportHandoffRecord>, limit: number): Promise<SupportHandoffRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/index.ts`

```text
export * from "./viewerPermissionsTypes.js";
export * from "./viewerPermissionsService.js";
export * from "./viewerPermissionsRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionPolicy.ts`

```text
const UNSAFE_DEFAULT_PERMISSIONS = new Set(["remote_input", "clipboard_sync"]);

export function sanitizeViewerPermissions(permissions: readonly string[]): string[] {
  return permissions.filter((permission) => !UNSAFE_DEFAULT_PERMISSIONS.has(permission));
}

export function viewerPermissionRequiresHostConsent(permission: string): boolean {
  return ["file_transfer", "remote_input", "clipboard_sync"].includes(permission);
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { ViewerPermissionRecordService } from "./viewerPermissionsService.js";

export function registerViewerPermissionRecordRoutes(router: Router, service: ViewerPermissionRecordService): void {
  router.get("/pack14/viewerPermissions", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/viewerPermissions", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsService.ts`

```text
import type { ViewerPermissionRecord, ViewerPermissionRecordRepository } from "./viewerPermissionsTypes.js";

export class ViewerPermissionRecordService {
  constructor(private readonly repository: ViewerPermissionRecordRepository) {}

  create(record: ViewerPermissionRecord): Promise<ViewerPermissionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ViewerPermissionRecord>): Promise<ViewerPermissionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("viewerPermissions-not-found");
    return updated;
  }

  list(filter: Partial<ViewerPermissionRecord> = {}, limit = 50): Promise<ViewerPermissionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsTypes.ts`

```text
export interface ViewerPermissionRecord {
  id: string; sessionId: string; userId: string; permissions: string[]; updatedByUserId: string; updatedAt: string;
}

export interface ViewerPermissionRecordRepository {
  create(record: ViewerPermissionRecord): Promise<ViewerPermissionRecord>;
  update(id: string, patch: Partial<ViewerPermissionRecord>): Promise<ViewerPermissionRecord | null>;
  list(filter: Partial<ViewerPermissionRecord>, limit: number): Promise<ViewerPermissionRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/index.ts`

```text
export * from "./viewerRosterTypes.js";
export * from "./viewerRosterService.js";
export * from "./viewerRosterRoutes.js";

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterRoutes.ts`

```text
import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { ViewerRosterRecordService } from "./viewerRosterService.js";

export function registerViewerRosterRecordRoutes(router: Router, service: ViewerRosterRecordService): void {
  router.get("/pack14/viewerRoster", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/viewerRoster", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterService.ts`

```text
import type { ViewerRosterRecord, ViewerRosterRecordRepository } from "./viewerRosterTypes.js";

export class ViewerRosterRecordService {
  constructor(private readonly repository: ViewerRosterRecordRepository) {}

  create(record: ViewerRosterRecord): Promise<ViewerRosterRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ViewerRosterRecord>): Promise<ViewerRosterRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("viewerRoster-not-found");
    return updated;
  }

  list(filter: Partial<ViewerRosterRecord> = {}, limit = 50): Promise<ViewerRosterRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}

```


## `REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterTypes.ts`

```text
export interface ViewerRosterRecord {
  id: string; sessionId: string; userId: string; role: 'host' | 'viewer' | 'support'; joinedAt: string; leftAt?: string; permissions: string[];
}

export interface ViewerRosterRecordRepository {
  create(record: ViewerRosterRecord): Promise<ViewerRosterRecord>;
  update(id: string, patch: Partial<ViewerRosterRecord>): Promise<ViewerRosterRecord | null>;
  list(filter: Partial<ViewerRosterRecord>, limit: number): Promise<ViewerRosterRecord[]>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack14/annotationOverlay.ts`

```text
export interface OverlayAnnotation {
  id: string;
  x: number;
  y: number;
  text?: string;
}

export function filterVisibleAnnotations(items: readonly OverlayAnnotation[]): OverlayAnnotation[] {
  return items.filter((item) => item.x >= 0 && item.x <= 1 && item.y >= 0 && item.y <= 1);
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack14/collaborationStatusStore.ts`

```text
export interface CollaborationStatus {
  activeViewers: number;
  pendingConsentRequests: number;
  annotationsEnabled: boolean;
}

export function collaborationNeedsAttention(status: CollaborationStatus): boolean {
  return status.pendingConsentRequests > 0 || status.activeViewers > 5;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack14/hostConsentDialog.tsx`

```text
import React from "react";

export function HostConsentDialog(props: { consentType: string; requesterName: string; onAccept: () => void; onReject: () => void }): JSX.Element {
  return (
    <section role="dialog" aria-label="Host consent request">
      <h3>Permission request</h3>
      <p>{props.requesterName} requests: {props.consentType}</p>
      <button type="button" onClick={props.onAccept}>Accept</button>
      <button type="button" onClick={props.onReject}>Reject</button>
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack14/index.ts`

```text
export * from "./hostConsentDialog.js";
export * from "./viewerRosterPopover.js";
export * from "./annotationOverlay.js";
export * from "./collaborationStatusStore.js";
export * from "./safePermissionNotice.js";

```


## `REVIEW_REQUIRED/apps/desktop/src/pack14/safePermissionNotice.tsx`

```text
import React from "react";

export function SafePermissionNotice(props: { permission: string; blockedReason: string }): JSX.Element {
  return <aside role="status"><strong>{props.permission} blocked</strong><p>{props.blockedReason}</p></aside>;
}

```


## `REVIEW_REQUIRED/apps/desktop/src/pack14/viewerRosterPopover.tsx`

```text
import React from "react";

export function ViewerRosterPopover(props: { viewers: Array<{ id: string; name: string; role: string }> }): JSX.Element {
  return (
    <aside>
      <h3>Connected viewers</h3>
      <ul>{props.viewers.map((viewer) => <li key={viewer.id}>{viewer.name} · {viewer.role}</li>)}</ul>
    </aside>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/AnnotationToolbar.tsx`

```text
import React from "react";

export interface AnnotationToolbarRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function AnnotationToolbar(props: { rows: AnnotationToolbarRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Annotations</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/ChatModerationPanel.tsx`

```text
import React from "react";

export interface ChatModerationPanelRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ChatModerationPanel(props: { rows: ChatModerationPanelRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Chat moderation</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/HostConsentPrompt.tsx`

```text
import React from "react";

export interface HostConsentPromptRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function HostConsentPrompt(props: { rows: HostConsentPromptRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Host consent</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/SessionBookmarksPanel.tsx`

```text
import React from "react";

export interface SessionBookmarksPanelRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function SessionBookmarksPanel(props: { rows: SessionBookmarksPanelRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Session bookmarks</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/SessionInvitePanel.tsx`

```text
import React from "react";

export interface SessionInvitePanelRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function SessionInvitePanel(props: { rows: SessionInvitePanelRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Session invites</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/SessionNotesPanel.tsx`

```text
import React from "react";

export interface SessionNotesPanelRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function SessionNotesPanel(props: { rows: SessionNotesPanelRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Session notes</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/SupportHandoffPanel.tsx`

```text
import React from "react";

export interface SupportHandoffPanelRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function SupportHandoffPanel(props: { rows: SupportHandoffPanelRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Support handoff</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/ViewerPermissionEditor.tsx`

```text
import React from "react";

export interface ViewerPermissionEditorRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ViewerPermissionEditor(props: { rows: ViewerPermissionEditorRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Viewer permissions</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/ViewerRosterPanel.tsx`

```text
import React from "react";

export interface ViewerRosterPanelRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ViewerRosterPanel(props: { rows: ViewerRosterPanelRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Viewer roster</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/components/WebViewerShell.tsx`

```text
import React from "react";

export interface WebViewerShellRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function WebViewerShell(props: { rows: WebViewerShellRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Web viewer shell</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

```


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useChatModeration.ts`

```text
import { useEffect, useState } from "react";

export interface useChatModerationResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useChatModeration<T>(loader: () => Promise<T>): useChatModerationResult<T> {
  const [state, setState] = useState<useChatModerationResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useCollaborationAudit.ts`

```text
import { useEffect, useState } from "react";

export interface useCollaborationAuditResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useCollaborationAudit<T>(loader: () => Promise<T>): useCollaborationAuditResult<T> {
  const [state, setState] = useState<useCollaborationAuditResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useHostConsent.ts`

```text
import { useEffect, useState } from "react";

export interface useHostConsentResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useHostConsent<T>(loader: () => Promise<T>): useHostConsentResult<T> {
  const [state, setState] = useState<useHostConsentResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionAnnotations.ts`

```text
import { useEffect, useState } from "react";

export interface useSessionAnnotationsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useSessionAnnotations<T>(loader: () => Promise<T>): useSessionAnnotationsResult<T> {
  const [state, setState] = useState<useSessionAnnotationsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionBookmarks.ts`

```text
import { useEffect, useState } from "react";

export interface useSessionBookmarksResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useSessionBookmarks<T>(loader: () => Promise<T>): useSessionBookmarksResult<T> {
  const [state, setState] = useState<useSessionBookmarksResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionInvites.ts`

```text
import { useEffect, useState } from "react";

export interface useSessionInvitesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useSessionInvites<T>(loader: () => Promise<T>): useSessionInvitesResult<T> {
  const [state, setState] = useState<useSessionInvitesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionNotes.ts`

```text
import { useEffect, useState } from "react";

export interface useSessionNotesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useSessionNotes<T>(loader: () => Promise<T>): useSessionNotesResult<T> {
  const [state, setState] = useState<useSessionNotesResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSupportHandoffs.ts`

```text
import { useEffect, useState } from "react";

export interface useSupportHandoffsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useSupportHandoffs<T>(loader: () => Promise<T>): useSupportHandoffsResult<T> {
  const [state, setState] = useState<useSupportHandoffsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useViewerPermissions.ts`

```text
import { useEffect, useState } from "react";

export interface useViewerPermissionsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useViewerPermissions<T>(loader: () => Promise<T>): useViewerPermissionsResult<T> {
  const [state, setState] = useState<useViewerPermissionsResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/hooks/useViewerRoster.ts`

```text
import { useEffect, useState } from "react";

export interface useViewerRosterResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useViewerRoster<T>(loader: () => Promise<T>): useViewerRosterResult<T> {
  const [state, setState] = useState<useViewerRosterResult<T>>({ loading: true });
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


## `REVIEW_REQUIRED/apps/web/src/pack14/index.ts`

```text
export * from "./components/WebViewerShell.js";
export * from "./components/SessionInvitePanel.js";
export * from "./components/ViewerRosterPanel.js";
export * from "./components/ViewerPermissionEditor.js";
export * from "./components/HostConsentPrompt.js";
export * from "./components/AnnotationToolbar.js";
export * from "./components/SessionNotesPanel.js";
export * from "./components/SupportHandoffPanel.js";
export * from "./components/ChatModerationPanel.js";
export * from "./components/SessionBookmarksPanel.js";
export * from "./hooks/useSessionInvites.js";
export * from "./hooks/useViewerRoster.js";
export * from "./hooks/useViewerPermissions.js";
export * from "./hooks/useHostConsent.js";
export * from "./hooks/useSessionAnnotations.js";
export * from "./hooks/useSessionNotes.js";
export * from "./hooks/useSupportHandoffs.js";
export * from "./hooks/useChatModeration.js";
export * from "./hooks/useSessionBookmarks.js";
export * from "./hooks/useCollaborationAudit.js";

```


## `SAFE_DIRECT_COPY/docs/pack14/01-merge-guide.md`

```text
Pack 14 adds web viewer collaboration: invites, viewer roster, host consent, annotations, session notes, support handoff, chat moderation, bookmarks, audit, web components and desktop host UI.

```


## `SAFE_DIRECT_COPY/docs/pack14/02-viewer-permissions.md`

```text
Viewer permissions are safe by default. Remote input and clipboard sync are stripped by shared/API helpers unless a separately reviewed host/MFA/native-input gate exists.

```


## `SAFE_DIRECT_COPY/docs/pack14/03-host-consent.md`

```text
Host consent is required for sensitive collaboration features. Consent states should be audited and expire when unanswered.

```


## `SAFE_DIRECT_COPY/docs/pack14/04-annotations.md`

```text
Annotations are normalized to screen bounds and do not modify host input. They are visual collaboration metadata only.

```


## `SAFE_DIRECT_COPY/docs/pack14/05-chat-moderation.md`

```text
Chat moderation detects obvious secret sharing and oversize messages. It is not a complete DLP system.

```


## `SAFE_DIRECT_COPY/docs/pack14/06-support-handoff.md`

```text
Support handoff requires active session, host approval and verified support user. It does not grant unattended access.

```


## `SAFE_DIRECT_COPY/docs/pack14/07-qa-checklist.md`

```text
Verify invite expiry, viewer roster ordering, permission sanitization, consent accept/reject, annotation bounds, chat moderation and support handoff blockers.

```


## `SAFE_DIRECT_COPY/infra/pack14/prometheus-collaboration-alerts.yml`

```text
groups:
  - name: remotedesk-collaboration-pack14
    rules:
      - alert: RemoteDeskInviteAbuse
        expr: rate(remotedesk_session_invite_failures_total[10m]) > 0.2
        for: 10m
        labels:
          severity: warning
      - alert: RemoteDeskConsentBacklog
        expr: remotedesk_host_consent_pending > 50
        for: 15m
        labels:
          severity: info

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/annotationModel.ts`

```text
export type AnnotationTool = "pointer" | "rectangle" | "arrow" | "text";

export interface SessionAnnotation {
  id: string;
  tool: AnnotationTool;
  x: number;
  y: number;
  text?: string;
  createdByUserId: string;
  createdAt: string;
}

export function isAnnotationInBounds(annotation: SessionAnnotation): boolean {
  return annotation.x >= 0 && annotation.x <= 1 && annotation.y >= 0 && annotation.y <= 1;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/chatModeration.ts`

```text
export interface ChatModerationResult {
  allowed: boolean;
  reasons: string[];
}

export function moderateSessionChatMessage(message: string): ChatModerationResult {
  const reasons: string[] = [];
  if (message.length > 2000) reasons.push("message-too-long");
  if (/\b(password|token|secret|api[_-]?key)\b/i.test(message)) reasons.push("possible-secret");
  return { allowed: reasons.length === 0, reasons };
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/consentState.ts`

```text
export type ConsentState = "pending" | "accepted" | "rejected" | "expired";

export function isConsentFinal(state: ConsentState): boolean {
  return state === "accepted" || state === "rejected" || state === "expired";
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/index.ts`

```text
export * from "./viewerPermission.js";
export * from "./sessionInviteToken.js";
export * from "./viewerRoster.js";
export * from "./annotationModel.js";
export * from "./chatModeration.js";
export * from "./consentState.js";
export * from "./supportHandoff.js";
export * from "./sessionNote.js";

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/sessionInviteToken.ts`

```text
export interface SessionInviteToken {
  id: string;
  sessionId: string;
  expiresAt: string;
  maxUses: number;
  used: number;
}

export function canUseSessionInvite(token: SessionInviteToken, now = new Date()): boolean {
  return new Date(token.expiresAt) > now && token.used < token.maxUses;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/sessionNote.ts`

```text
export interface SessionNote {
  id: string;
  sessionId: string;
  body: string;
  privateToSupport: boolean;
  createdAt: string;
}

export function validateSessionNote(note: Pick<SessionNote, "body">): string[] {
  const errors: string[] = [];
  if (!note.body.trim()) errors.push("empty-note");
  if (note.body.length > 5000) errors.push("note-too-long");
  return errors;
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/supportHandoff.ts`

```text
export interface SupportHandoffInput {
  sessionActive: boolean;
  hostApproved: boolean;
  supportUserVerified: boolean;
}

export function canStartSupportHandoff(input: SupportHandoffInput): { ok: true } | { ok: false; blockers: string[] } {
  const blockers: string[] = [];
  if (!input.sessionActive) blockers.push("session-not-active");
  if (!input.hostApproved) blockers.push("host-approval-required");
  if (!input.supportUserVerified) blockers.push("support-user-not-verified");
  return blockers.length === 0 ? { ok: true } : { ok: false, blockers };
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/viewerPermission.ts`

```text
export type ViewerPermission = "view_screen" | "chat" | "annotate" | "file_transfer" | "clipboard_sync" | "remote_input";

export interface ViewerPermissionSet {
  permissions: readonly ViewerPermission[];
}

export function hasViewerPermission(set: ViewerPermissionSet, permission: ViewerPermission): boolean {
  return set.permissions.includes(permission);
}

export function enforceSafeViewerPermissions(set: ViewerPermissionSet): ViewerPermissionSet {
  return {
    permissions: set.permissions.filter((permission) => permission !== "remote_input" && permission !== "clipboard_sync")
  };
}

```


## `SAFE_DIRECT_COPY/packages/shared/src/pack14/viewerRoster.ts`

```text
export interface ViewerRosterMember {
  userId: string;
  displayName: string;
  role: "host" | "viewer" | "support";
  joinedAt: string;
  permissions: string[];
}

export function sortViewerRoster(members: readonly ViewerRosterMember[]): ViewerRosterMember[] {
  const rank = { host: 0, support: 1, viewer: 2 };
  return [...members].sort((a, b) => rank[a.role] - rank[b.role] || a.displayName.localeCompare(b.displayName));
}

```


## `SAFE_DIRECT_COPY/scripts/pack14/check-collaboration-safe-defaults.mjs`

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
      if (/remote_input.*default.*true|clipboard_sync.*default.*true|unattended|run_shell/i.test(text)) bad.push(path);
    }
  }
}
walk(root);
if (bad.length) { console.error("Unsafe collaboration defaults found:", bad); process.exit(1); }
console.log("Collaboration defaults remain safe.");

```


## `SAFE_DIRECT_COPY/tests/pack14/annotationModel.test.ts`

```text
import assert from "node:assert/strict"; import { isAnnotationInBounds } from "../../packages/shared/src/pack14/annotationModel.js"; assert.equal(isAnnotationInBounds({ id: "a", tool: "pointer", x: .5, y: .5, createdByUserId: "u", createdAt: "x" }), true);

```


## `SAFE_DIRECT_COPY/tests/pack14/annotationOverlay.test.ts`

```text
import assert from "node:assert/strict"; import { filterVisibleAnnotations } from "../../REVIEW_REQUIRED/apps/desktop/src/pack14/annotationOverlay.js"; assert.equal(filterVisibleAnnotations([{ id: "a", x: .1, y: .1 }, { id: "b", x: 2, y: .1 }]).length, 1);

```


## `SAFE_DIRECT_COPY/tests/pack14/chatModeration.test.ts`

```text
import assert from "node:assert/strict"; import { moderateSessionChatMessage } from "../../packages/shared/src/pack14/chatModeration.js"; assert.equal(moderateSessionChatMessage("my password is x").allowed, false);

```


## `SAFE_DIRECT_COPY/tests/pack14/collaborationStatusStore.test.ts`

```text
import assert from "node:assert/strict"; import { collaborationNeedsAttention } from "../../REVIEW_REQUIRED/apps/desktop/src/pack14/collaborationStatusStore.js"; assert.equal(collaborationNeedsAttention({ activeViewers: 1, pendingConsentRequests: 1, annotationsEnabled: true }), true);

```


## `SAFE_DIRECT_COPY/tests/pack14/sessionInvitePolicy.test.ts`

```text
import assert from "node:assert/strict"; import { validateSessionInvite } from "../../REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitePolicy.js"; assert.deepEqual(validateSessionInvite({ expiresAt: "2999-01-01T00:00:00Z", maxUses: 2 }), []);

```


## `SAFE_DIRECT_COPY/tests/pack14/sessionInviteToken.test.ts`

```text
import assert from "node:assert/strict"; import { canUseSessionInvite } from "../../packages/shared/src/pack14/sessionInviteToken.js"; assert.equal(canUseSessionInvite({ id: "i", sessionId: "s", expiresAt: "2999-01-01T00:00:00Z", maxUses: 1, used: 0 }), true);

```


## `SAFE_DIRECT_COPY/tests/pack14/supportHandoff.test.ts`

```text
import assert from "node:assert/strict"; import { canStartSupportHandoff } from "../../packages/shared/src/pack14/supportHandoff.js"; assert.equal(canStartSupportHandoff({ sessionActive: true, hostApproved: true, supportUserVerified: true }).ok, true);

```


## `SAFE_DIRECT_COPY/tests/pack14/viewerPermission.test.ts`

```text
import assert from "node:assert/strict"; import { enforceSafeViewerPermissions } from "../../packages/shared/src/pack14/viewerPermission.js"; assert.deepEqual(enforceSafeViewerPermissions({ permissions: ["view_screen", "remote_input"] }).permissions, ["view_screen"]);

```


## `SAFE_DIRECT_COPY/tests/pack14/viewerPermissionPolicy.test.ts`

```text
import assert from "node:assert/strict"; import { sanitizeViewerPermissions } from "../../REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionPolicy.js"; assert.deepEqual(sanitizeViewerPermissions(["view_screen", "clipboard_sync"]), ["view_screen"]);

```


## `generated-remotedesk-webviewer-collaboration-pack-14-code-review.md`

```text
Review permission sanitization, host consent expiry, support handoff verification, session/team repository filtering, chat moderation behavior, invite limits and desktop UI placement.

```


## `generated-remotedesk-webviewer-collaboration-pack-14-manifest.json`

```text
{
  "name": "generated-remotedesk-webviewer-collaboration-pack-14",
  "createdAt": "2026-06-15T05:35:32.022513+00:00",
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
    "SAFE_DIRECT_COPY/docs/pack14/01-merge-guide.md",
    "SAFE_DIRECT_COPY/docs/pack14/02-viewer-permissions.md",
    "SAFE_DIRECT_COPY/docs/pack14/03-host-consent.md",
    "SAFE_DIRECT_COPY/docs/pack14/04-annotations.md",
    "SAFE_DIRECT_COPY/docs/pack14/05-chat-moderation.md",
    "SAFE_DIRECT_COPY/docs/pack14/06-support-handoff.md",
    "SAFE_DIRECT_COPY/docs/pack14/07-qa-checklist.md",
    "SAFE_DIRECT_COPY/infra/pack14/prometheus-collaboration-alerts.yml",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/annotationModel.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/chatModeration.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/consentState.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/index.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/sessionInviteToken.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/sessionNote.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/supportHandoff.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/viewerPermission.ts",
    "SAFE_DIRECT_COPY/packages/shared/src/pack14/viewerRoster.ts",
    "SAFE_DIRECT_COPY/scripts/pack14/check-collaboration-safe-defaults.mjs",
    "SAFE_DIRECT_COPY/tests/pack14/annotationModel.test.ts",
    "SAFE_DIRECT_COPY/tests/pack14/annotationOverlay.test.ts",
    "SAFE_DIRECT_COPY/tests/pack14/chatModeration.test.ts",
    "SAFE_DIRECT_COPY/tests/pack14/collaborationStatusStore.test.ts",
    "SAFE_DIRECT_COPY/tests/pack14/sessionInvitePolicy.test.ts",
    "SAFE_DIRECT_COPY/tests/pack14/sessionInviteToken.test.ts",
    "SAFE_DIRECT_COPY/tests/pack14/supportHandoff.test.ts",
    "SAFE_DIRECT_COPY/tests/pack14/viewerPermission.test.ts",
    "SAFE_DIRECT_COPY/tests/pack14/viewerPermissionPolicy.test.ts"
  ],
  "reviewRequired": [
    "REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/chatModerationTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/chatModeration/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/collaborationAuditTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/collaborationAudit/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/common/pack14Route.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/common/sessionCollaborationAuth.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/hostConsentRequestsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/hostConsentRequests/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/annotationPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionAnnotations/sessionAnnotationsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionBookmarks/sessionBookmarksTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitePolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionInvites/sessionInvitesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/sessionNotes/sessionNotesTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/supportHandoffs/supportHandoffsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionPolicy.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerPermissions/viewerPermissionsTypes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/index.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterRoutes.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterService.ts",
    "REVIEW_REQUIRED/apps/api/src/pack14/viewerRoster/viewerRosterTypes.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack14/annotationOverlay.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack14/collaborationStatusStore.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack14/hostConsentDialog.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack14/index.ts",
    "REVIEW_REQUIRED/apps/desktop/src/pack14/safePermissionNotice.tsx",
    "REVIEW_REQUIRED/apps/desktop/src/pack14/viewerRosterPopover.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/AnnotationToolbar.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/ChatModerationPanel.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/HostConsentPrompt.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/SessionBookmarksPanel.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/SessionInvitePanel.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/SessionNotesPanel.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/SupportHandoffPanel.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/ViewerPermissionEditor.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/ViewerRosterPanel.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/components/WebViewerShell.tsx",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useChatModeration.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useCollaborationAudit.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useHostConsent.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionAnnotations.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionBookmarks.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionInvites.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSessionNotes.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useSupportHandoffs.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useViewerPermissions.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/hooks/useViewerRoster.ts",
    "REVIEW_REQUIRED/apps/web/src/pack14/index.ts"
  ],
  "patches": [
    "PATCHES/api-pack14.patch.md",
    "PATCHES/desktop-pack14.patch.md",
    "PATCHES/ops-pack14.patch.md",
    "PATCHES/web-pack14.patch.md"
  ],
  "dependenciesRequired": [],
  "knownLimitations": [
    "Repositories need Prisma implementations.",
    "Web viewer components must be mounted into existing session UI.",
    "Session ownership/team filtering must be enforced in repositories.",
    "Remote input and clipboard sync remain disabled by default.",
    "Annotations are visual metadata only; no host input injection is included."
  ],
  "estimatedCompletionAfterCarefulMerge": "approximately 88-95% with prior packs after persistence wiring and collaboration QA"
}
```


## `generated-remotedesk-webviewer-collaboration-pack-14-merge-summary.md`

```text
Pack 14 adds web viewer collaboration: session invites, viewer roster, permissions, host consent, annotations, notes, support handoff, chat moderation, bookmarks, collaboration audit, web components, desktop host UI, docs/tests/scripts.

```


## `generated-remotedesk-webviewer-collaboration-pack-14-risk-register.md`

```text
| Risk | Severity | Mitigation |
| --- | --- | --- |
| Viewer permission escalation | Critical | sanitize remote_input/clipboard_sync |
| Invite abuse | High | expiry, max uses, rate limits |
| Support handoff abuse | High | host approval and verified support role |
| Secret shared in chat | Medium | moderation warning/block |
| Annotation misuse | Low | visual-only, bounds check |

```


## `generated-remotedesk-webviewer-collaboration-pack-14-test-plan.md`

```text
Run Pack 14 shared/API/desktop tests, collaboration-safe-defaults scanner, then manual QA for invites, roster, permissions, host consent, annotations, notes, support handoff and chat moderation.

```
