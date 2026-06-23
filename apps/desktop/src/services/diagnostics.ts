/**
 * Desktop operational diagnostics.
 * Shows metadata-only status. No raw logs, no screenshots, no tokens.
 * User must explicitly click to generate support context.
 */

import { getConnectionState } from "./connectionRecovery.js";

export interface DesktopDiagnostics {
  appVersion: string;
  connectionState: string;
  lastHeartbeat: string | null;
  reconnectAttempts: number;
  lastSafeError: string | null;
  activeSessionStatus: "none" | "pending" | "active" | "view_only";
  webrtcState: string;
  socketState: string;
  policyLoaded: boolean;
  deviceRevoked: boolean;
  safeLogCount: number;
}

let lastHeartbeat: string | null = null;
let lastSafeError: string | null = null;
let activeSessionStatus: DesktopDiagnostics["activeSessionStatus"] = "none";
let webrtcState = "new";
let socketState = "disconnected";
let policyLoaded = false;
let safeLogCount = 0;

const APP_VERSION = "0.1.0";

export function updateHeartbeat(): void {
  lastHeartbeat = new Date().toISOString();
}

export function updateLastError(error: string): void {
  // Redact any token-like strings
  lastSafeError = error.replace(/[A-Za-z0-9_-]{20,}/g, "[REDACTED]");
}

export function updateSessionStatus(status: DesktopDiagnostics["activeSessionStatus"]): void {
  activeSessionStatus = status;
}

export function updateWebRTCState(state: string): void {
  webrtcState = state;
}

export function updateSocketState(state: string): void {
  socketState = state;
}

export function updatePolicyLoaded(loaded: boolean): void {
  policyLoaded = loaded;
}

export function incrementSafeLogCount(): void {
  safeLogCount++;
}

export function getDiagnostics(): DesktopDiagnostics {
  const connState = getConnectionState();
  return {
    appVersion: APP_VERSION,
    connectionState: connState.state,
    lastHeartbeat,
    reconnectAttempts: connState.attempts,
    lastSafeError,
    activeSessionStatus,
    webrtcState,
    socketState,
    policyLoaded,
    deviceRevoked: connState.deviceRevoked,
    safeLogCount,
  };
}

/**
 * Generate a safe support context for the user to share.
 * Metadata-only. No screenshots, clipboard, files, tokens, or raw logs.
 */
export function generateSupportContext(): Record<string, unknown> {
  const diag = getDiagnostics();
  return {
    ...diag,
    generatedAt: new Date().toISOString(),
    note: "This context contains metadata only. No private content is included.",
  };
}
