/**
 * Observability, reliability, and performance monitoring contracts.
 * All types are metadata-only. No secrets, payloads, or private content.
 */

// ─── Health Statuses ──────────────────────────────────────────────────────────

export type HealthStatus =
  | "healthy"
  | "degraded"
  | "unhealthy"
  | "starting"
  | "stopping"
  | "unknown";

export interface ServiceHealthStatus {
  service: string;
  status: HealthStatus;
  uptimeSec: number;
  version?: string;
  degradedReason?: string;
  timestamp: string;
}

export interface ServiceReadinessStatus {
  service: string;
  ready: boolean;
  dbConnected: boolean;
  socketServerUp: boolean;
  requiredEnvPresent: boolean;
  migrationStatus?: "up_to_date" | "pending" | "unknown";
  degradedReason?: string;
  timestamp: string;
}

// ─── Metric Categories ────────────────────────────────────────────────────────

export type MetricCategory =
  | "api"
  | "database"
  | "socket"
  | "webrtc"
  | "desktop_agent"
  | "dashboard"
  | "auth"
  | "billing"
  | "support"
  | "security"
  | "notification"
  | "system";

// ─── Reliability Event Levels ─────────────────────────────────────────────────

export type ReliabilityLevel = "debug" | "info" | "warning" | "error" | "critical";

// ─── API Metrics ──────────────────────────────────────────────────────────────

export interface ApiLatencyMetric {
  method: string;
  routePattern: string;
  statusCode: number;
  durationMs: number;
  requestId: string;
  teamId?: string;
  userId?: string;
  errorCode?: string;
  timestamp: string;
}

export interface ApiErrorMetric {
  method: string;
  routePattern: string;
  statusCode: number;
  errorCode: string;
  requestId: string;
  teamId?: string;
  userId?: string;
  timestamp: string;
}

// ─── Socket Metrics ───────────────────────────────────────────────────────────

export interface SocketConnectionMetric {
  activeConnections: number;
  authenticatedConnections: number;
  deviceConnections: number;
  dashboardConnections: number;
  sessionRooms: number;
  signalingEventsCount: number;
  rejectedEventsCount: number;
  reconnectCount: number;
  disconnectReasons: Record<string, number>;
  timestamp: string;
}

// ─── WebRTC Quality ───────────────────────────────────────────────────────────

export interface WebRTCQualityMetric {
  sessionId: string;
  connectionState: string;
  iceState: string;
  signalingState: string;
  reconnectAttempts: number;
  packetLossPercent?: number;
  bitrateKbps?: number;
  frameRate?: number;
  resolutionWidth?: number;
  resolutionHeight?: number;
  latencyMs?: number;
  timestamp: string;
}

// ─── Device Heartbeat ─────────────────────────────────────────────────────────

export interface DeviceHeartbeatMetric {
  deviceId: string;
  teamId: string;
  lastHeartbeat: string;
  missedHeartbeats: number;
  connectionState: "connected" | "degraded" | "disconnected";
  reconnectAttempts: number;
  latencyMs?: number;
  timestamp: string;
}

// ─── Reliability Incidents ────────────────────────────────────────────────────

export interface ReliabilityIncident {
  id: string;
  severity: ReliabilityLevel;
  category: MetricCategory;
  affectedService: string;
  message: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
  status: "active" | "acknowledged" | "resolved";
  linkedIncidentId?: string;
  recommendedAction?: string;
}

// ─── Operational Alerts ───────────────────────────────────────────────────────

export interface OperationalAlert {
  id: string;
  severity: ReliabilityLevel;
  category: MetricCategory;
  affectedService: string;
  message: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
  status: "active" | "acknowledged" | "resolved";
  recommendedAction?: string;
}

// ─── Performance Budgets ──────────────────────────────────────────────────────

export interface PerformanceBudget {
  name: string;
  category: MetricCategory;
  targetMs?: number;
  warningMs?: number;
  criticalMs?: number;
  targetPercent?: number;
  description: string;
}

// ─── Retry / Backoff ──────────────────────────────────────────────────────────

export interface RetryPolicy {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableErrors?: string[];
}

export interface BackoffPolicy {
  initialDelayMs: number;
  maxDelayMs: number;
  multiplier: number;
  jitter: boolean;
}

// ─── Queue / Job ──────────────────────────────────────────────────────────────

export type QueueJobState = "pending" | "running" | "completed" | "failed" | "retrying";

export interface QueueJobStatus {
  jobId: string;
  queue: string;
  state: QueueJobState;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  failedReason?: string;
}

// ─── System Metrics ───────────────────────────────────────────────────────────

export interface SystemMetricSnapshot {
  requestCount: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  errorRate: number;
  topSlowRoutes: Array<{ route: string; avgMs: number }>;
  topErrorRoutes: Array<{ route: string; count: number }>;
  activeSocketConnections: number;
  activeSessions: number;
  deviceHeartbeatStatus: { healthy: number; degraded: number; disconnected: number };
  degradedSessions: number;
  queueStatus: { pending: number; running: number; failed: number };
  uptimeSec: number;
  timestamp: string;
}

// ─── Dashboard Performance ────────────────────────────────────────────────────

export interface DashboardPerformanceMetric {
  route: string;
  loadTimeMs: number;
  ttfbMs?: number;
  bundleSizeKb?: number;
  queryCount: number;
  errorCount: number;
  timestamp: string;
}

// ─── Redacted Log Event ───────────────────────────────────────────────────────

export interface RedactedLogEvent {
  level: ReliabilityLevel;
  message: string;
  category: MetricCategory;
  requestId?: string;
  teamId?: string;
  userId?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

// ─── Observability Event Category ─────────────────────────────────────────────

export type ObservabilityEventCategory =
  | "request_timing"
  | "request_error"
  | "socket_event"
  | "webrtc_quality"
  | "device_heartbeat"
  | "reliability_incident"
  | "operational_alert"
  | "graceful_shutdown"
  | "queue_job"
  | "dashboard_performance";
