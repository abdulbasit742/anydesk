/**
 * Client SDK methods for operational observability.
 * All return ApiResult<T>. No secrets logged.
 */

import type { ApiResult } from "./types.js";

export interface OpsMetrics {
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

export interface ServiceHealth {
  service: string;
  status: string;
  uptimeSec: number;
  version?: string;
  degradedReason?: string;
  timestamp: string;
}

export interface ServiceReadiness {
  service: string;
  ready: boolean;
  dbConnected: boolean;
  socketServerUp: boolean;
  requiredEnvPresent: boolean;
  migrationStatus?: string;
  degradedReason?: string;
  timestamp: string;
}

export interface OperationalAlertDto {
  id: string;
  severity: string;
  category: string;
  affectedService: string;
  message: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
  status: string;
  recommendedAction?: string;
}

export interface WebRTCQualitySummary {
  sessionsByQuality: Record<string, number>;
  failedSessionsByReason: Record<string, number>;
  averageConnectionSetupTimeMs: number | null;
  iceFailureRate: number;
  reconnectRate: number;
  totalSnapshots: number;
  timestamp: string;
}

export interface SocketMetricsSummary {
  activeConnections: number;
  authenticatedConnections: number;
  deviceConnections: number;
  dashboardConnections: number;
  sessionRooms: number;
  signalingEventsCount: number;
  rejectedEventsCount: number;
  reconnectCount: number;
  timestamp: string;
}

export interface ApiLatencySummary {
  averageLatencyMs: number;
  p95LatencyMs: number;
  requestCount: number;
  errorRate: number;
  timestamp: string;
}

export interface DeviceHeartbeatSummary {
  healthy: number;
  degraded: number;
  disconnected: number;
  timestamp: string;
}

export interface DashboardPerformanceSummary {
  routes: Array<{ route: string; avgLoadTimeMs: number; errorCount: number }>;
  timestamp: string;
}

export interface ReliabilityRecommendation {
  category: string;
  message: string;
  severity: string;
  affectedEntity?: string;
}

type HttpClient = {
  get<T>(path: string): Promise<ApiResult<T>>;
  post<T>(path: string, body?: unknown): Promise<ApiResult<T>>;
};

export class OpsClient {
  constructor(private http: HttpClient) {}

  getOpsMetrics(): Promise<ApiResult<OpsMetrics>> {
    return this.http.get("/api/ops/metrics");
  }

  getServiceHealth(): Promise<ApiResult<ServiceHealth>> {
    return this.http.get("/health");
  }

  getServiceReadiness(): Promise<ApiResult<ServiceReadiness>> {
    return this.http.get("/health/ready");
  }

  listOperationalAlerts(): Promise<ApiResult<OperationalAlertDto[]>> {
    return this.http.get("/api/ops/alerts");
  }

  acknowledgeOperationalAlert(alertId: string): Promise<ApiResult<{ success: boolean }>> {
    return this.http.post(`/api/ops/alerts/${alertId}/acknowledge`);
  }

  getWebRTCQualitySummary(): Promise<ApiResult<WebRTCQualitySummary>> {
    return this.http.get("/api/ops/webrtc-quality");
  }

  getSocketMetrics(): Promise<ApiResult<SocketMetricsSummary>> {
    return this.http.get("/api/ops/socket-metrics");
  }

  getApiLatencySummary(): Promise<ApiResult<ApiLatencySummary>> {
    return this.http.get("/api/ops/api-latency");
  }

  getDeviceHeartbeatSummary(): Promise<ApiResult<DeviceHeartbeatSummary>> {
    return this.http.get("/api/ops/device-heartbeats");
  }

  getDashboardPerformanceSummary(): Promise<ApiResult<DashboardPerformanceSummary>> {
    return this.http.get("/api/ops/dashboard-performance");
  }

  getReliabilityRecommendations(): Promise<ApiResult<ReliabilityRecommendation[]>> {
    return this.http.get("/api/ops/reliability-recommendations");
  }
}
