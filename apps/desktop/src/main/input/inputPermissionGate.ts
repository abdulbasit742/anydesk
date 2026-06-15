export interface InputPermissionState {
  sessionId: string;
  enabled: boolean;
  emergencyStopped: boolean;
  enabledAt?: number;
  disabledAt?: number;
  reason?: string;
}

export class InputPermissionGate {
  private states = new Map<string, InputPermissionState>();

  get(sessionId: string): InputPermissionState {
    return this.states.get(sessionId) ?? { sessionId, enabled: false, emergencyStopped: false };
  }

  enable(sessionId: string): InputPermissionState {
    const current = this.get(sessionId);
    const next: InputPermissionState = {
      ...current,
      enabled: !current.emergencyStopped,
      enabledAt: Date.now(),
      disabledAt: undefined,
      reason: current.emergencyStopped ? 'emergency stop active' : undefined,
    };
    this.states.set(sessionId, next);
    return next;
  }

  disable(sessionId: string, reason = 'disabled by host'): InputPermissionState {
    const next: InputPermissionState = { ...this.get(sessionId), enabled: false, disabledAt: Date.now(), reason };
    this.states.set(sessionId, next);
    return next;
  }

  emergencyStop(sessionId: string, reason = 'emergency stop'): InputPermissionState {
    const next: InputPermissionState = { ...this.get(sessionId), enabled: false, emergencyStopped: true, disabledAt: Date.now(), reason };
    this.states.set(sessionId, next);
    return next;
  }

  resetEmergencyStop(sessionId: string): InputPermissionState {
    const next: InputPermissionState = { ...this.get(sessionId), enabled: false, emergencyStopped: false, reason: 'reset; explicit enable still required' };
    this.states.set(sessionId, next);
    return next;
  }

  canExecute(sessionId: string): boolean {
    const state = this.get(sessionId);
    return state.enabled && !state.emergencyStopped;
  }
}
