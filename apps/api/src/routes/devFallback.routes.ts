/**
 * devFallback.routes.ts
 *
 * Activated only when DEV_IN_MEMORY_FALLBACK=true in the environment.
 * Provides a complete in-memory implementation of every API route the web
 * dashboard and mobile app call, so the full UI can run without PostgreSQL.
 *
 * Mounted in server.ts BEFORE the real routes so it intercepts every
 * matching request when the flag is on.
 *
 * DO NOT use in production — the flag defaults to false.
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import { randomUUID } from "node:crypto";
import {
  issueTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  type TokenPayload
} from "../lib/tokens.js";
import type { AuthedRequest } from "../middleware/auth.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FbUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  remoteDeskId: string;
  plan: "free" | "pro" | "enterprise";
  isOnline: boolean;
  lastSeenAt: string;
  devicePassword: string | null;
}

interface FbDevice {
  id: string;
  userId: string;
  name: string;
  platform: "windows" | "macos" | "linux" | "android" | "ios";
  remoteDeskId: string;
  remoteDeskIdFormatted: string;
  isOnline: boolean;
  lastSeenAt: string;
}

interface FbSession {
  id: string;
  hostId: string;
  clientId: string;
  status: "PENDING" | "ACTIVE" | "ENDED" | "DENIED";
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  host: { id: string; fullName: string; remoteDeskId: string };
  client: { id: string; fullName: string; remoteDeskId: string };
}

interface FbConnectorItem {
  key: string;
  name: string;
  category: string;
  availability: "available" | "coming_soon";
  description: string;
  capabilities: string[];
  docsUrl?: string;
  installStatus: "available" | "installed" | "coming_soon";
  installedAt: string | null;
}

interface FbAuditEvent {
  id: string;
  connectorKey: string;
  type: string;
  message: string;
  createdAt: string;
  connector: { key: string; name: string; category: string };
}

interface FbLaunchCheck {
  id: string;
  key: string;
  area: string;
  label: string;
  status: "pass" | "warn" | "fail" | "not_applicable";
  required: boolean;
  notes: string;
  updatedAt: string;
}

interface FbReleaseCandidate {
  id: string;
  version: string;
  gitSha: string;
  status: "draft" | "blocked" | "promotable" | "promoted" | "rejected";
  signedDesktopBuild: boolean;
  migrationsReviewed: boolean;
  smokeTestsPassed: boolean;
  notes: string | null;
  promotedAt: string | null;
  createdAt: string;
  createdByUserId: string;
  createdBy: { id: string; email: string };
  approvals: never[];
  migrationChecks: never[];
}

interface FbMigrationCheck {
  id: string;
  name: string;
  touchesAuth: boolean;
  touchesBilling: boolean;
  destructive: boolean;
  backfillRows: number;
  reviewed: boolean;
  status: "pending" | "approved" | "blocked" | "applied";
  risk: "low" | "medium" | "high" | "critical";
  notes: string | null;
  releaseCandidateId: string | null;
  createdAt: string;
  createdByUserId: string;
  releaseCandidate: null;
}

interface FbSupportEscalation {
  id: string;
  title: string;
  priority: "low" | "normal" | "high" | "urgent";
  category: string;
  description: string | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  target: string;
  assignedToUserId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  createdByUserId: string;
  createdBy: { id: string; email: string };
  assignedTo: null;
}

// ---------------------------------------------------------------------------
// In-memory stores  (module-level, persists for the lifetime of the process)
// ---------------------------------------------------------------------------

const users = new Map<string, FbUser>();                         // id → user
const emailIndex = new Map<string, string>();                    // email → id
const remoteDeskIndex = new Map<string, string>();               // remoteDeskId → id
const devices = new Map<string, FbDevice[]>();                   // userId → devices[]
const sessions = new Map<string, FbSession[]>();                 // userId → sessions[]
// connector installs: userId → (connectorKey → { installedAt })
const connectorInstalls = new Map<string, Map<string, string>>(); // userId → key → iso
const connectorAudit = new Map<string, FbAuditEvent[]>();        // userId → events[]
const launchChecks = new Map<string, Map<string, FbLaunchCheck>>(); // userId → key → check
const releaseCandidates = new Map<string, FbReleaseCandidate[]>(); // userId → rcs[]
const migrationChecks = new Map<string, FbMigrationCheck[]>();   // userId → mcs[]
const supportEscalations = new Map<string, FbSupportEscalation[]>(); // userId → esc[]

// ---------------------------------------------------------------------------
// Seed data helpers
// ---------------------------------------------------------------------------

const CONNECTOR_CATALOG: FbConnectorItem[] = [
  {
    key: "slack",
    name: "Slack",
    category: "communication",
    availability: "available",
    description: "Send session and support notifications into selected Slack channels.",
    capabilities: ["notify", "support_handoff"],
    docsUrl: "https://api.slack.com/",
    installStatus: "available",
    installedAt: null
  },
  {
    key: "teams",
    name: "Microsoft Teams",
    category: "communication",
    availability: "available",
    description: "Send collaboration and escalation notifications into Teams.",
    capabilities: ["notify", "support_handoff"],
    docsUrl: "https://learn.microsoft.com/microsoftteams/platform/",
    installStatus: "available",
    installedAt: null
  },
  {
    key: "jira",
    name: "Jira",
    category: "support",
    availability: "available",
    description: "Create issue placeholders from support escalations and audit events.",
    capabilities: ["create_ticket", "sync_tickets"],
    docsUrl: "https://developer.atlassian.com/cloud/jira/platform/",
    installStatus: "available",
    installedAt: null
  },
  {
    key: "zendesk",
    name: "Zendesk",
    category: "support",
    availability: "available",
    description: "Prepare support ticket sync with strict redaction before provider calls.",
    capabilities: ["create_ticket", "sync_tickets"],
    docsUrl: "https://developer.zendesk.com/",
    installStatus: "available",
    installedAt: null
  },
  {
    key: "s3",
    name: "S3-compatible storage",
    category: "storage",
    availability: "coming_soon",
    description: "Future storage target for support bundles and compliance exports.",
    capabilities: ["store_bundle", "export_archive"],
    installStatus: "coming_soon",
    installedAt: null
  },
  {
    key: "siem-webhook",
    name: "SIEM webhook",
    category: "security",
    availability: "coming_soon",
    description: "Future outbound security event stream for enterprise SIEM tools.",
    capabilities: ["audit_stream", "security_alert"],
    installStatus: "coming_soon",
    installedAt: null
  }
];

const DEFAULT_LAUNCH_CHECKS: FbLaunchCheck[] = [
  { id: "api-health", key: "api-health", area: "api", label: "API health and readiness endpoints are available", status: "pass", required: true, notes: "/health/live and /health/ready are wired", updatedAt: new Date().toISOString() },
  { id: "desktop-signing", key: "desktop-signing", area: "desktop", label: "Desktop production build is signed and packaged", status: "fail", required: true, notes: "Requires signed Electron build verification", updatedAt: new Date().toISOString() },
  { id: "e2e-smoke", key: "e2e-smoke", area: "support", label: "Two-client remote desktop smoke test has passed", status: "fail", required: true, notes: "Needs host/viewer QA on real devices", updatedAt: new Date().toISOString() },
  { id: "billing-provider", key: "billing-provider", area: "billing", label: "Billing provider production keys are verified", status: "warn", required: true, notes: "Stripe/Paddle production checkout is still a launch gate", updatedAt: new Date().toISOString() },
  { id: "device-command-queue", key: "device-command-queue", area: "security", label: "Safe device command queue is persisted and audited", status: "warn", required: true, notes: "Command audit trail must be confirmed before launch", updatedAt: new Date().toISOString() },
  { id: "cors-origins", key: "cors-origins", area: "security", label: "CORS allowed origins are locked to production domains", status: "warn", required: true, notes: "Do not ship with wildcard CORS", updatedAt: new Date().toISOString() },
  { id: "db-migrations", key: "db-migrations", area: "infra", label: "All Prisma migrations are applied in staging", status: "not_applicable", required: false, notes: "Run prisma migrate deploy against staging", updatedAt: new Date().toISOString() },
  { id: "rate-limiting", key: "rate-limiting", area: "api", label: "Auth endpoints are rate-limited", status: "not_applicable", required: false, notes: "Add express-rate-limit to /api/auth", updatedAt: new Date().toISOString() }
];

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function formatRemoteDeskId(id: string): string {
  return id.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
}

function generateRemoteDeskId(): string {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

/** Trivial hash for dev-only — not cryptographically safe */
function devHash(password: string): string {
  return `dev:${Buffer.from(password).toString("base64")}`;
}

function devVerify(password: string, hash: string): boolean {
  return hash === devHash(password);
}

function getOrCreateUserDevices(userId: string): FbDevice[] {
  if (!devices.has(userId)) {
    const remoteDeskId = generateRemoteDeskId();
    const user = users.get(userId);
    devices.set(userId, [
      {
        id: randomUUID(),
        userId,
        name: "Dev Machine",
        platform: "windows",
        remoteDeskId,
        remoteDeskIdFormatted: formatRemoteDeskId(remoteDeskId),
        isOnline: true,
        lastSeenAt: new Date().toISOString()
      }
    ]);
  }
  return devices.get(userId)!;
}

function getOrCreateLaunchChecks(userId: string): Map<string, FbLaunchCheck> {
  if (!launchChecks.has(userId)) {
    const map = new Map<string, FbLaunchCheck>();
    for (const check of DEFAULT_LAUNCH_CHECKS) {
      map.set(check.key, { ...check });
    }
    launchChecks.set(userId, map);
  }
  return launchChecks.get(userId)!;
}

function summarizeLaunchChecks(checks: FbLaunchCheck[]): {
  blocked: boolean;
  counts: { pass: number; warn: number; fail: number; not_applicable: number };
} {
  const counts = { pass: 0, warn: 0, fail: 0, not_applicable: 0 };
  for (const c of checks) {
    if (c.status === "pass") counts.pass++;
    else if (c.status === "warn") counts.warn++;
    else if (c.status === "fail") counts.fail++;
    else counts.not_applicable++;
  }
  const blocked = checks.some((c) => c.required && c.status === "fail");
  return { blocked, counts };
}

function catalogForUser(userId: string): FbConnectorItem[] {
  const installs = connectorInstalls.get(userId) ?? new Map<string, string>();
  return CONNECTOR_CATALOG.map((item) => {
    if (item.availability === "coming_soon") {
      return { ...item, installStatus: "coming_soon" as const, installedAt: null };
    }
    const installedAt = installs.get(item.key) ?? null;
    return {
      ...item,
      installStatus: installedAt ? ("installed" as const) : ("available" as const),
      installedAt
    };
  });
}

function deriveMigrationRisk(input: {
  touchesAuth: boolean;
  touchesBilling: boolean;
  destructive: boolean;
  backfillRows: number;
}): "low" | "medium" | "high" | "critical" {
  if (input.destructive || (input.touchesAuth && input.touchesBilling)) return "critical";
  if (input.touchesAuth || input.touchesBilling) return "high";
  if (input.backfillRows > 10000) return "medium";
  return "low";
}

function deriveEscalationTarget(input: { priority: string; category: string }): string {
  if (input.category === "security" || input.priority === "urgent") return "security-team";
  if (input.category === "billing") return "billing-team";
  if (input.priority === "high") return "oncall-engineer";
  return "support-tier-1";
}

function deriveRcStatus(rc: {
  signedDesktopBuild: boolean;
  migrationsReviewed: boolean;
  smokeTestsPassed: boolean;
}): "draft" | "blocked" | "promotable" {
  if (!rc.signedDesktopBuild || !rc.migrationsReviewed) return "blocked";
  if (rc.smokeTestsPassed) return "promotable";
  return "draft";
}

// ---------------------------------------------------------------------------
// Fallback auth middleware
// ---------------------------------------------------------------------------

function fbRequireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }
  try {
    const payload: TokenPayload = verifyAccessToken(header.slice(7));
    const user = users.get(payload.userId);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found in fallback store" });
      return;
    }
    (req as AuthedRequest).user = { id: user.id, email: user.email, remoteDeskId: user.remoteDeskId };
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export const devFallbackRouter = Router();

// ── /api/auth ──────────────────────────────────────────────────────────────

devFallbackRouter.post("/auth/signup", (req: Request, res: Response) => {
  const { email, password, fullName } = req.body ?? {};
  if (!email || !password || !fullName) {
    res.status(400).json({ success: false, message: "email, password, fullName are required" });
    return;
  }
  if (emailIndex.has(email)) {
    res.status(409).json({ success: false, message: "Email already registered" });
    return;
  }
  const id = randomUUID();
  let remoteDeskId = generateRemoteDeskId();
  while (remoteDeskIndex.has(remoteDeskId)) {
    remoteDeskId = generateRemoteDeskId();
  }
  const user: FbUser = {
    id,
    email,
    fullName,
    passwordHash: devHash(password),
    remoteDeskId,
    plan: "free",
    isOnline: true,
    lastSeenAt: new Date().toISOString(),
    devicePassword: null
  };
  users.set(id, user);
  emailIndex.set(email, id);
  remoteDeskIndex.set(remoteDeskId, id);

  const tokens = issueTokenPair({ userId: id, email });
  res.status(201).json({
    success: true,
    data: {
      user: { id, email, fullName, remoteDeskId, plan: user.plan },
      tokens
    }
  });
});

devFallbackRouter.post("/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ success: false, message: "email and password are required" });
    return;
  }
  const userId = emailIndex.get(email);
  if (!userId) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }
  const user = users.get(userId)!;
  if (!devVerify(password, user.passwordHash)) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }
  user.isOnline = true;
  user.lastSeenAt = new Date().toISOString();

  const tokens = issueTokenPair({ userId: user.id, email: user.email });
  res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, fullName: user.fullName, remoteDeskId: user.remoteDeskId, plan: user.plan },
      tokens
    }
  });
});

devFallbackRouter.post("/auth/refresh", (req: Request, res: Response) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) {
    res.status(400).json({ success: false, message: "refreshToken required" });
    return;
  }
  try {
    const payload = verifyRefreshToken(refreshToken as string);
    const user = users.get(payload.userId);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }
    const tokens = issueTokenPair({ userId: user.id, email: user.email });
    res.json({ success: true, data: { tokens } });
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
});

devFallbackRouter.get("/auth/me", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const user = users.get(id)!;
  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      remoteDeskId: user.remoteDeskId,
      plan: user.plan,
      isOnline: user.isOnline
    }
  });
});

// ── /api/users ─────────────────────────────────────────────────────────────

devFallbackRouter.get("/users/profile", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const user = users.get(id)!;
  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      remoteDeskId: user.remoteDeskId,
      remoteDeskIdFormatted: formatRemoteDeskId(user.remoteDeskId),
      plan: user.plan,
      isOnline: user.isOnline,
      lastSeenAt: user.lastSeenAt
    }
  });
});

devFallbackRouter.patch("/users/profile", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const user = users.get(id)!;
  const { fullName } = req.body ?? {};
  if (!fullName || typeof fullName !== "string" || fullName.length < 2) {
    res.status(400).json({ success: false, message: "fullName must be at least 2 characters" });
    return;
  }
  user.fullName = fullName;
  res.json({ success: true, data: { id: user.id, email: user.email, fullName: user.fullName, remoteDeskId: user.remoteDeskId, plan: user.plan } });
});

devFallbackRouter.patch("/users/device-password", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const user = users.get(id)!;
  const { password } = req.body ?? {};
  if (!password || typeof password !== "string" || password.length < 4) {
    res.status(400).json({ success: false, message: "password must be at least 4 characters" });
    return;
  }
  user.devicePassword = devHash(password);
  res.json({ success: true, message: "Device password updated" });
});

devFallbackRouter.get("/users/lookup/:remoteDeskId", (req: Request, res: Response) => {
  const rawId = req.params.remoteDeskId.replace(/\s/g, "");
  const userId = remoteDeskIndex.get(rawId);
  if (!userId) {
    res.status(404).json({ success: false, message: "RemoteDesk ID not found" });
    return;
  }
  const user = users.get(userId)!;
  res.json({
    success: true,
    data: { id: user.id, fullName: user.fullName, remoteDeskId: user.remoteDeskId, isOnline: user.isOnline }
  });
});

// ── /api/devices ───────────────────────────────────────────────────────────

devFallbackRouter.get("/devices", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const devList = getOrCreateUserDevices(id);
  res.json({ success: true, data: devList });
});

// ── /api/sessions ──────────────────────────────────────────────────────────

devFallbackRouter.get("/sessions/history", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const list = sessions.get(id) ?? [];
  res.json({ success: true, data: list });
});

devFallbackRouter.get("/sessions/active", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const active = (sessions.get(id) ?? []).filter((s) => s.status === "ACTIVE");
  res.json({ success: true, data: active });
});

devFallbackRouter.post("/sessions/create", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const user = users.get(id)!;
  const { targetDeviceId } = req.body ?? {};

  let hostUser = user;
  for (const [uid, devList] of devices.entries()) {
    if (devList.some((d) => d.id === targetDeviceId)) {
      hostUser = users.get(uid) ?? user;
      break;
    }
  }

  const session: FbSession = {
    id: randomUUID(),
    hostId: hostUser.id,
    clientId: id,
    status: "PENDING",
    startedAt: null,
    endedAt: null,
    createdAt: new Date().toISOString(),
    host: { id: hostUser.id, fullName: hostUser.fullName, remoteDeskId: hostUser.remoteDeskId },
    client: { id: user.id, fullName: user.fullName, remoteDeskId: user.remoteDeskId }
  };

  const existing = sessions.get(id) ?? [];
  sessions.set(id, [session, ...existing]);

  res.status(201).json({ success: true, data: session });
});

// ── /api/connectors ────────────────────────────────────────────────────────

devFallbackRouter.get("/connectors/catalog", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  res.json({ success: true, data: catalogForUser(id) });
});

devFallbackRouter.get("/connectors/audit", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const audit = connectorAudit.get(id) ?? [];
  res.json({ success: true, data: audit });
});

devFallbackRouter.post("/connectors/:key/install", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const { key } = req.params;

  const definition = CONNECTOR_CATALOG.find((c) => c.key === key);
  if (!definition) {
    res.status(404).json({ success: false, message: "Connector not found" });
    return;
  }
  if (definition.availability === "coming_soon") {
    res.status(400).json({ success: false, message: "Connector is not yet available" });
    return;
  }

  if (!connectorInstalls.has(id)) connectorInstalls.set(id, new Map());
  const userInstalls = connectorInstalls.get(id)!;

  if (userInstalls.has(key)) {
    res.status(409).json({ success: false, message: "Connector already installed" });
    return;
  }

  const now = new Date().toISOString();
  userInstalls.set(key, now);

  // Append audit event
  const events = connectorAudit.get(id) ?? [];
  events.unshift({
    id: randomUUID(),
    connectorKey: key,
    type: "install",
    message: `${definition.name} installed`,
    createdAt: now,
    connector: { key: definition.key, name: definition.name, category: definition.category }
  });
  connectorAudit.set(id, events);

  const updatedItem: FbConnectorItem = {
    ...definition,
    installStatus: "installed",
    installedAt: now
  };
  res.json({ success: true, data: updatedItem });
});

devFallbackRouter.delete("/connectors/:key/install", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const { key } = req.params;

  const definition = CONNECTOR_CATALOG.find((c) => c.key === key);
  if (!definition) {
    res.status(404).json({ success: false, message: "Connector not found" });
    return;
  }

  const userInstalls = connectorInstalls.get(id);
  if (!userInstalls?.has(key)) {
    res.status(404).json({ success: false, message: "Connector not installed" });
    return;
  }
  userInstalls.delete(key);

  const now = new Date().toISOString();
  const events = connectorAudit.get(id) ?? [];
  events.unshift({
    id: randomUUID(),
    connectorKey: key,
    type: "uninstall",
    message: `${definition.name} uninstalled`,
    createdAt: now,
    connector: { key: definition.key, name: definition.name, category: definition.category }
  });
  connectorAudit.set(id, events);

  const updatedItem: FbConnectorItem = {
    ...definition,
    installStatus: "available",
    installedAt: null
  };
  res.json({ success: true, data: updatedItem });
});

// ── /api/launch ────────────────────────────────────────────────────────────

devFallbackRouter.get("/launch/readiness", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const checksMap = getOrCreateLaunchChecks(id);
  const checks = Array.from(checksMap.values()).sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    return a.area.localeCompare(b.area);
  });
  const { blocked, counts } = summarizeLaunchChecks(checks);
  const rcs = releaseCandidates.get(id) ?? [];
  const mcs = migrationChecks.get(id) ?? [];
  const esc = supportEscalations.get(id) ?? [];

  res.json({
    success: true,
    data: {
      blocked,
      counts,
      checks,
      releaseCandidates: rcs,
      rolloutApprovals: [],
      migrationChecks: mcs,
      supportEscalations: esc
    }
  });
});

devFallbackRouter.patch("/launch/checks/:key", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const { key } = req.params;
  const checksMap = getOrCreateLaunchChecks(id);

  if (!checksMap.has(key)) {
    res.status(404).json({ success: false, message: "Launch check not found" });
    return;
  }
  const check = checksMap.get(key)!;
  const allowed = ["area", "label", "status", "required", "notes"] as const;
  for (const field of allowed) {
    if (req.body?.[field] !== undefined) {
      (check as Record<string, unknown>)[field] = req.body[field];
    }
  }
  check.updatedAt = new Date().toISOString();
  checksMap.set(key, check);

  res.json({ success: true, data: check });
});

devFallbackRouter.post("/launch/release-candidates", fbRequireAuth, (req: Request, res: Response) => {
  const { id, email } = (req as AuthedRequest).user!;
  const { version, gitSha, signedDesktopBuild = false, migrationsReviewed = false, smokeTestsPassed = false, notes } = req.body ?? {};

  if (!version || !gitSha) {
    res.status(400).json({ success: false, message: "version and gitSha are required" });
    return;
  }

  const status = deriveRcStatus({ signedDesktopBuild, migrationsReviewed, smokeTestsPassed });
  const rc: FbReleaseCandidate = {
    id: randomUUID(),
    version,
    gitSha,
    status,
    signedDesktopBuild,
    migrationsReviewed,
    smokeTestsPassed,
    notes: notes ?? null,
    promotedAt: null,
    createdAt: new Date().toISOString(),
    createdByUserId: id,
    createdBy: { id, email },
    approvals: [],
    migrationChecks: []
  };

  const list = releaseCandidates.get(id) ?? [];
  list.unshift(rc);
  releaseCandidates.set(id, list);

  res.status(201).json({ success: true, data: rc });
});

devFallbackRouter.patch("/launch/release-candidates/:rcId", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const { rcId } = req.params;
  const list = releaseCandidates.get(id) ?? [];
  const rc = list.find((r) => r.id === rcId);
  if (!rc) {
    res.status(404).json({ success: false, message: "Release candidate not found" });
    return;
  }
  const updatable = ["version", "gitSha", "signedDesktopBuild", "migrationsReviewed", "smokeTestsPassed", "notes"] as const;
  for (const f of updatable) {
    if (req.body?.[f] !== undefined) (rc as Record<string, unknown>)[f] = req.body[f];
  }
  if (req.body?.status) {
    rc.status = req.body.status;
    if (req.body.status === "promoted") rc.promotedAt = new Date().toISOString();
  } else {
    rc.status = deriveRcStatus({ signedDesktopBuild: rc.signedDesktopBuild, migrationsReviewed: rc.migrationsReviewed, smokeTestsPassed: rc.smokeTestsPassed });
  }
  res.json({ success: true, data: rc });
});

devFallbackRouter.post("/launch/migration-checks", fbRequireAuth, (req: Request, res: Response) => {
  const { id, email } = (req as AuthedRequest).user!;
  const {
    name,
    touchesAuth = false,
    touchesBilling = false,
    destructive = false,
    backfillRows = 0,
    reviewed = false,
    status = "pending",
    notes,
    releaseCandidateId
  } = req.body ?? {};

  if (!name) {
    res.status(400).json({ success: false, message: "name is required" });
    return;
  }
  const risk = deriveMigrationRisk({ touchesAuth, touchesBilling, destructive, backfillRows });
  const mc: FbMigrationCheck = {
    id: randomUUID(),
    name,
    touchesAuth,
    touchesBilling,
    destructive,
    backfillRows,
    reviewed,
    status,
    risk,
    notes: notes ?? null,
    releaseCandidateId: releaseCandidateId ?? null,
    createdAt: new Date().toISOString(),
    createdByUserId: id,
    releaseCandidate: null
  };
  const list = migrationChecks.get(id) ?? [];
  list.unshift(mc);
  migrationChecks.set(id, list);
  res.status(201).json({ success: true, data: mc });
});

devFallbackRouter.post("/launch/support-escalations", fbRequireAuth, (req: Request, res: Response) => {
  const { id, email } = (req as AuthedRequest).user!;
  const { title, priority, category, description } = req.body ?? {};

  if (!title || !priority || !category) {
    res.status(400).json({ success: false, message: "title, priority, category are required" });
    return;
  }
  const target = deriveEscalationTarget({ priority, category });
  const esc: FbSupportEscalation = {
    id: randomUUID(),
    title,
    priority,
    category,
    description: description ?? null,
    status: "open",
    target,
    assignedToUserId: null,
    resolvedAt: null,
    createdAt: new Date().toISOString(),
    createdByUserId: id,
    createdBy: { id, email },
    assignedTo: null
  };
  const list = supportEscalations.get(id) ?? [];
  list.unshift(esc);
  supportEscalations.set(id, list);
  res.status(201).json({ success: true, data: esc });
});

devFallbackRouter.patch("/launch/support-escalations/:escId", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const { escId } = req.params;
  const list = supportEscalations.get(id) ?? [];
  const esc = list.find((e) => e.id === escId);
  if (!esc) {
    res.status(404).json({ success: false, message: "Support escalation not found" });
    return;
  }
  const updatable = ["title", "priority", "category", "description", "status"] as const;
  for (const f of updatable) {
    if (req.body?.[f] !== undefined) (esc as Record<string, unknown>)[f] = req.body[f];
  }
  if (esc.status === "resolved" || esc.status === "closed") {
    esc.resolvedAt = new Date().toISOString();
  }
  const p = esc.priority as "low" | "normal" | "high" | "urgent";
  const c = esc.category as "connection" | "billing" | "security" | "desktop_crash" | "data_loss" | "other";
  esc.target = deriveEscalationTarget({ priority: p, category: c });
  res.json({ success: true, data: esc });
});

// ── /api/devices/:deviceId ─────────────────────────────────────────────────

interface FbDeviceSecurity {
  trust: {
    status: "trusted" | "untrusted" | "blocked";
    trusted: boolean;
    blocked: boolean;
    reason: string | null;
    trustedAt: string | null;
    revokedAt: string | null;
    updatedAt: string;
  };
  accessPolicy: {
    unattendedAccessEnabled: boolean;
    remoteInputEnabled: boolean;
    clipboardSyncEnabled: boolean;
    fileTransferEnabled: boolean;
    requiresSessionApproval: boolean;
    maxSessionMinutes: number;
    updatedAt: string;
  };
  unattendedAccess: { enabled: boolean; reason: string };
  remoteInputPolicy: { enabled: boolean; reason: string };
}

interface FbDeviceCommand {
  id: string;
  deviceId: string;
  type: string;
  status: "pending" | "delivered" | "completed" | "failed" | "expired" | "canceled";
  safe: boolean;
  issuedAt: string;
  expiresAt: string;
  deliveredAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

const deviceSecurity = new Map<string, FbDeviceSecurity>();  // deviceId → security
const deviceCommands = new Map<string, FbDeviceCommand[]>(); // deviceId → commands[]

const SAFE_COMMAND_TYPES = ["refresh_policy", "collect_diagnostics", "check_update", "sign_out"] as const;

function getOrCreateDeviceSecurity(deviceId: string): FbDeviceSecurity {
  if (!deviceSecurity.has(deviceId)) {
    const now = new Date().toISOString();
    deviceSecurity.set(deviceId, {
      trust: { status: "untrusted", trusted: false, blocked: false, reason: null, trustedAt: null, revokedAt: null, updatedAt: now },
      accessPolicy: { unattendedAccessEnabled: false, remoteInputEnabled: true, clipboardSyncEnabled: true, fileTransferEnabled: false, requiresSessionApproval: true, maxSessionMinutes: 60, updatedAt: now },
      unattendedAccess: { enabled: false, reason: "Device must be trusted before unattended access can be enabled." },
      remoteInputPolicy: { enabled: true, reason: "Remote input is allowed by the access policy." }
    });
  }
  return deviceSecurity.get(deviceId)!;
}

function buildDeviceCommandPreviews(deviceId: string): Array<{ id: string; type: string; expiresAt: string; safe: boolean }> {
  const futureExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  return SAFE_COMMAND_TYPES.map((type) => ({
    id: `preview:${deviceId}:${type}`,
    type,
    expiresAt: futureExpiry,
    safe: true
  }));
}

devFallbackRouter.get("/devices/:deviceId", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const user = users.get(id)!;
  const userDevices = getOrCreateUserDevices(id);
  const device = userDevices.find((d) => d.id === req.params.deviceId);
  if (!device) {
    res.status(404).json({ success: false, message: "Device not found" });
    return;
  }

  const security = getOrCreateDeviceSecurity(device.id);
  const cmds = deviceCommands.get(device.id) ?? [];
  const sessionList = sessions.get(id) ?? [];

  const now = new Date().toISOString();
  const timeline = [
    { id: `${device.id}:created`, type: "device.created", message: `${device.name} was registered`, at: now },
    { id: `${device.id}:last-seen`, type: "device.last_seen", message: `${device.name} checked in`, at: device.lastSeenAt },
    ...sessionList.slice(0, 5).map((s) => ({
      id: s.id,
      type: `session.${s.status.toLowerCase()}`,
      message: `Session ${s.status.toLowerCase()} with ${s.host.id === id ? s.client.fullName : s.host.fullName}`,
      at: s.startedAt ?? s.createdAt
    }))
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  res.json({
    success: true,
    data: {
      device: { ...device, createdAt: now },
      sessions: sessionList.map((s) => ({ ...s, duration: null })),
      commands: cmds,
      timeline,
      settings: {
        ...security,
        deviceCommands: {
          allowed: buildDeviceCommandPreviews(device.id),
          blocked: ["remote_shell", "run_command", "execute_native_input", "unattended_access"],
          reason: "Only safe maintenance command envelopes are exposed; every command is persisted, expires, and is audit logged"
        }
      }
    }
  });
});

devFallbackRouter.patch("/devices/:deviceId/trust", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const userDevices = getOrCreateUserDevices(id);
  const device = userDevices.find((d) => d.id === req.params.deviceId);
  if (!device) {
    res.status(404).json({ success: false, message: "Device not found" });
    return;
  }

  const { status, reason } = req.body ?? {};
  if (!["trusted", "untrusted", "blocked"].includes(status)) {
    res.status(400).json({ success: false, message: "status must be trusted, untrusted, or blocked" });
    return;
  }

  const security = getOrCreateDeviceSecurity(device.id);
  const now = new Date().toISOString();
  security.trust = {
    status,
    trusted: status === "trusted",
    blocked: status === "blocked",
    reason: reason ?? null,
    trustedAt: status === "trusted" ? now : null,
    revokedAt: status === "untrusted" ? now : null,
    updatedAt: now
  };
  security.unattendedAccess = {
    enabled: security.accessPolicy.unattendedAccessEnabled && status === "trusted",
    reason: status === "trusted"
      ? "Device is trusted and unattended access follows the access policy."
      : "Device must be trusted before unattended access can be enabled."
  };
  deviceSecurity.set(device.id, security);

  res.json({ success: true, data: security });
});

devFallbackRouter.patch("/devices/:deviceId/access-policy", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const userDevices = getOrCreateUserDevices(id);
  const device = userDevices.find((d) => d.id === req.params.deviceId);
  if (!device) {
    res.status(404).json({ success: false, message: "Device not found" });
    return;
  }

  const security = getOrCreateDeviceSecurity(device.id);
  const allowed = ["unattendedAccessEnabled", "remoteInputEnabled", "clipboardSyncEnabled", "fileTransferEnabled", "requiresSessionApproval", "maxSessionMinutes"] as const;
  for (const field of allowed) {
    if (req.body?.[field] !== undefined) {
      (security.accessPolicy as Record<string, unknown>)[field] = req.body[field];
    }
  }
  security.accessPolicy.updatedAt = new Date().toISOString();
  security.unattendedAccess = {
    enabled: security.accessPolicy.unattendedAccessEnabled && security.trust.trusted,
    reason: security.trust.trusted && security.accessPolicy.unattendedAccessEnabled
      ? "Unattended access is enabled."
      : "Device must be trusted with unattended access enabled."
  };
  security.remoteInputPolicy = {
    enabled: security.accessPolicy.remoteInputEnabled && !security.trust.blocked,
    reason: security.trust.blocked
      ? "Remote input blocked because device is blocked."
      : security.accessPolicy.remoteInputEnabled
        ? "Remote input is allowed by the access policy."
        : "Remote input is disabled by the access policy."
  };
  deviceSecurity.set(device.id, security);

  res.json({ success: true, data: security });
});

devFallbackRouter.post("/devices/:deviceId/commands", fbRequireAuth, (req: Request, res: Response) => {
  const { id } = (req as AuthedRequest).user!;
  const userDevices = getOrCreateUserDevices(id);
  const device = userDevices.find((d) => d.id === req.params.deviceId);
  if (!device) {
    res.status(404).json({ success: false, message: "Device not found" });
    return;
  }

  const { type, ttlSeconds = 300 } = req.body ?? {};
  if (!SAFE_COMMAND_TYPES.includes(type)) {
    res.status(400).json({ success: false, message: "Unsupported or unsafe command type" });
    return;
  }

  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const command: FbDeviceCommand = {
    id: randomUUID(),
    deviceId: device.id,
    type,
    status: "pending",
    safe: true,
    issuedAt: now,
    expiresAt,
    deliveredAt: null,
    completedAt: null,
    failedAt: null,
    failureReason: null,
    createdAt: now,
    updatedAt: now
  };
  const list = deviceCommands.get(device.id) ?? [];
  list.unshift(command);
  deviceCommands.set(device.id, list);

  res.status(201).json({ success: true, data: command });
});

// Rollout approvals (stub — web page may call these)
devFallbackRouter.post("/launch/rollout-approvals", fbRequireAuth, (req: Request, res: Response) => {
  const { id, email } = (req as AuthedRequest).user!;
  const approval = {
    id: randomUUID(),
    ...req.body,
    requestedByUserId: id,
    decidedAt: req.body?.decision && req.body.decision !== "pending" ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    requestedBy: { id, email }
  };
  res.status(201).json({ success: true, data: approval });
});

devFallbackRouter.patch("/launch/rollout-approvals/:approvalId", fbRequireAuth, (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Rollout approval not found in fallback store" });
});

export default devFallbackRouter;
