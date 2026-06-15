export type ReconnectPhase = "idle" | "waiting" | "attempting" | "recovered" | "failed";
export interface ReconnectLifecycleState { phase: ReconnectPhase; attempts: number; maxAttempts: number; nextDelayMs?: number; reason?: string; }
export function canAttemptReconnect(state: ReconnectLifecycleState): boolean { return state.phase !== "failed" && state.attempts < state.maxAttempts; }
