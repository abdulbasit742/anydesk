export type ConnectorAuthState = "not_connected" | "pending" | "connected" | "expired" | "revoked" | "error";

export function connectorNeedsReconnect(state: ConnectorAuthState): boolean {
  return state === "expired" || state === "revoked" || state === "error";
}
