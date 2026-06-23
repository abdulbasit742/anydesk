/**
 * Operational alerts for Socket.IO reliability.
 * Generates alerts for anomalous connection patterns.
 */

import type { OperationalAlert } from "@remotedesk/shared/observability/types.js";

export interface AlertThresholds {
  maxReconnectsPerMinute: number;
  maxRejectedEventsPerMinute: number;
  maxSessionJoinFailures: number;
  maxHeartbeatFailures: number;
  maxSignalingTimeoutMs: number;
}

const DEFAULT_THRESHOLDS: AlertThresholds = {
  maxReconnectsPerMinute: 50,
  maxRejectedEventsPerMinute: 20,
  maxSessionJoinFailures: 10,
  maxHeartbeatFailures: 5,
  maxSignalingTimeoutMs: 10000,
};

const activeAlerts: OperationalAlert[] = [];

export function checkReconnectSpike(reconnectCount: number, thresholds = DEFAULT_THRESHOLDS): void {
  if (reconnectCount > thresholds.maxReconnectsPerMinute) {
    upsertAlert({
      id: "socket_reconnect_spike",
      severity: "warning",
      category: "socket",
      affectedService: "socket.io",
      message: `Reconnect spike detected: ${reconnectCount} reconnects in last minute`,
      recommendedAction: "Check network stability and server load",
    });
  }
}

export function checkRejectedEventsSpike(
  rejectedCount: number,
  thresholds = DEFAULT_THRESHOLDS
): void {
  if (rejectedCount > thresholds.maxRejectedEventsPerMinute) {
    upsertAlert({
      id: "socket_rejected_events_spike",
      severity: "error",
      category: "security",
      affectedService: "socket.io",
      message: `Rejected events spike: ${rejectedCount} unauthorized events in last minute`,
      recommendedAction: "Investigate potential abuse or misconfigured clients",
    });
  }
}

export function checkHeartbeatFailures(
  failureCount: number,
  thresholds = DEFAULT_THRESHOLDS
): void {
  if (failureCount > thresholds.maxHeartbeatFailures) {
    upsertAlert({
      id: "device_heartbeat_failures",
      severity: "warning",
      category: "desktop_agent",
      affectedService: "device-heartbeat",
      message: `${failureCount} devices have missed heartbeats`,
      recommendedAction: "Check device connectivity and agent health",
    });
  }
}

function upsertAlert(partial: Omit<OperationalAlert, "firstSeen" | "lastSeen" | "count" | "status">): void {
  const existing = activeAlerts.find((a) => a.id === partial.id);
  const now = new Date().toISOString();

  if (existing) {
    existing.lastSeen = now;
    existing.count++;
    existing.message = partial.message;
  } else {
    activeAlerts.push({
      ...partial,
      firstSeen: now,
      lastSeen: now,
      count: 1,
      status: "active",
    });
  }
}

export function getActiveAlerts(): readonly OperationalAlert[] {
  return activeAlerts.filter((a) => a.status === "active");
}

export function acknowledgeAlert(alertId: string): boolean {
  const alert = activeAlerts.find((a) => a.id === alertId);
  if (alert) {
    alert.status = "acknowledged";
    return true;
  }
  return false;
}
