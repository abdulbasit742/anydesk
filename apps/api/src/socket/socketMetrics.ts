/**
 * Socket.IO connection and reliability metrics.
 * Tracks safe metadata only — no payload contents.
 */

export interface SocketMetricsSnapshot {
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

const metrics = {
  activeConnections: 0,
  authenticatedConnections: 0,
  deviceConnections: 0,
  dashboardConnections: 0,
  sessionRooms: 0,
  signalingEventsCount: 0,
  rejectedEventsCount: 0,
  reconnectCount: 0,
  disconnectReasons: {} as Record<string, number>,
};

export function getSocketMetrics(): SocketMetricsSnapshot {
  return {
    ...metrics,
    disconnectReasons: { ...metrics.disconnectReasons },
    timestamp: new Date().toISOString(),
  };
}

export function incrementConnections(type: "device" | "dashboard" | "unknown"): void {
  metrics.activeConnections++;
  if (type === "device") metrics.deviceConnections++;
  else if (type === "dashboard") metrics.dashboardConnections++;
}

export function decrementConnections(type: "device" | "dashboard" | "unknown"): void {
  metrics.activeConnections = Math.max(0, metrics.activeConnections - 1);
  if (type === "device") metrics.deviceConnections = Math.max(0, metrics.deviceConnections - 1);
  else if (type === "dashboard")
    metrics.dashboardConnections = Math.max(0, metrics.dashboardConnections - 1);
}

export function markAuthenticated(): void {
  metrics.authenticatedConnections++;
}

export function markDisconnect(reason: string): void {
  metrics.disconnectReasons[reason] = (metrics.disconnectReasons[reason] ?? 0) + 1;
}

export function incrementSessionRooms(): void {
  metrics.sessionRooms++;
}

export function decrementSessionRooms(): void {
  metrics.sessionRooms = Math.max(0, metrics.sessionRooms - 1);
}

export function incrementSignalingEvents(): void {
  metrics.signalingEventsCount++;
}

export function incrementRejectedEvents(): void {
  metrics.rejectedEventsCount++;
}

export function incrementReconnects(): void {
  metrics.reconnectCount++;
}
