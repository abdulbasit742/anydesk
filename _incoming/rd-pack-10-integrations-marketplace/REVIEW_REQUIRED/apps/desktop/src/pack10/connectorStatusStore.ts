export interface DesktopConnectorStatus {
  connectorKey: string;
  state: "not_connected" | "connected" | "expired" | "error";
  lastSyncAt?: string;
}

export function connectorStatusNeedsAttention(status: DesktopConnectorStatus): boolean {
  return status.state === "expired" || status.state === "error";
}
