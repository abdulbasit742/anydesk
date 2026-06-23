/**
 * Desktop connection recovery with exponential backoff.
 * Ensures safe behavior on disconnect:
 * - Stops remote input on unsafe disconnect
 * - Pauses clipboard/file transfer
 * - Keeps emergency stop available
 * - Shows clear user-facing error
 */

export type ConnectionState =
  | "connected"
  | "connecting"
  | "reconnecting"
  | "disconnected"
  | "revoked";

export interface ConnectionRecoveryConfig {
  initialDelayMs: number;
  maxDelayMs: number;
  multiplier: number;
  jitter: boolean;
  maxAttempts: number;
}

const DEFAULT_CONFIG: ConnectionRecoveryConfig = {
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  multiplier: 2,
  jitter: true,
  maxAttempts: 20,
};

export interface ConnectionRecoveryState {
  state: ConnectionState;
  attempts: number;
  lastError?: string;
  nextRetryMs?: number;
  deviceRevoked: boolean;
}

let currentState: ConnectionRecoveryState = {
  state: "disconnected",
  attempts: 0,
  deviceRevoked: false,
};

let config = DEFAULT_CONFIG;

export function getConnectionState(): ConnectionRecoveryState {
  return { ...currentState };
}

export function setConfig(newConfig: Partial<ConnectionRecoveryConfig>): void {
  config = { ...config, ...newConfig };
}

export function markConnected(): void {
  currentState = { state: "connected", attempts: 0, deviceRevoked: false };
}

export function markDisconnected(reason?: string): void {
  currentState = {
    ...currentState,
    state: "disconnected",
    lastError: reason,
  };
}

export function markRevoked(): void {
  currentState = {
    state: "revoked",
    attempts: 0,
    deviceRevoked: true,
    lastError: "Device has been revoked. Reconnection is not permitted.",
  };
}

export function shouldRetry(): boolean {
  if (currentState.deviceRevoked) return false;
  if (currentState.attempts >= config.maxAttempts) return false;
  return true;
}

export function getNextDelay(): number {
  const baseDelay = Math.min(
    config.initialDelayMs * Math.pow(config.multiplier, currentState.attempts),
    config.maxDelayMs
  );
  const jitter = config.jitter ? Math.random() * baseDelay * 0.3 : 0;
  return Math.round(baseDelay + jitter);
}

export function incrementAttempt(): void {
  currentState = {
    ...currentState,
    state: "reconnecting",
    attempts: currentState.attempts + 1,
    nextRetryMs: getNextDelay(),
  };
}

/**
 * Safety actions to take on unsafe disconnect.
 * Returns a list of actions that MUST be taken by the caller.
 */
export function getDisconnectSafetyActions(): string[] {
  return [
    "stop_remote_input",
    "pause_clipboard_transfer",
    "pause_file_transfer",
    "keep_emergency_stop_available",
    "show_disconnect_error_to_user",
  ];
}
