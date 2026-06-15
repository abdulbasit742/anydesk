import { ipcMain } from 'electron';
import { NoopInputExecutor } from './noopInputExecutor.js';
import { InputPermissionGate } from './inputPermissionGate.js';
import { validateNormalizedInputEvent } from './inputEventValidator.js';
import { InputRateLimiter } from './inputRateLimiter.js';
import { emitInputBlocked, emitInputDisabled, emitInputEnabled, type InputAuditSink } from './inputAudit.js';
import type { InputExecutor, NormalizedInputEvent } from './inputExecutor.js';

export interface RegisterInputIpcOptions {
  executor?: InputExecutor;
  gate?: InputPermissionGate;
  rateLimiter?: InputRateLimiter;
  audit?: InputAuditSink;
}

export function registerInputIpc(options: RegisterInputIpcOptions = {}): void {
  const executor = options.executor ?? new NoopInputExecutor();
  const gate = options.gate ?? new InputPermissionGate();
  const limiter = options.rateLimiter ?? new InputRateLimiter();

  ipcMain.handle('remotedesk:input:set-enabled', (_event, input: { sessionId?: string; enabled?: boolean }) => {
    if (!input?.sessionId || typeof input.enabled !== 'boolean') throw new Error('invalid input permission payload');
    const state = input.enabled ? gate.enable(input.sessionId) : gate.disable(input.sessionId);
    if (input.enabled) emitInputEnabled(options.audit, input.sessionId);
    else emitInputDisabled(options.audit, input.sessionId, 'disabled by host');
    return { enabled: state.enabled, emergencyStopped: state.emergencyStopped };
  });

  ipcMain.handle('remotedesk:input:emergency-stop', (_event, input: { sessionId?: string; reason?: string }) => {
    if (!input?.sessionId) throw new Error('invalid emergency stop payload');
    const state = gate.emergencyStop(input.sessionId, input.reason ?? 'emergency stop');
    emitInputDisabled(options.audit, input.sessionId, state.reason ?? 'emergency stop');
    return { enabled: false, emergencyStopped: true };
  });

  ipcMain.handle('remotedesk:input:get-state', (_event, input: { sessionId?: string }) => {
    if (!input?.sessionId) throw new Error('invalid input state payload');
    return gate.get(input.sessionId);
  });

  ipcMain.handle('remotedesk:input:execute', async (_event, input: { sessionId?: string; event?: NormalizedInputEvent }) => {
    if (!input?.sessionId || !input.event) throw new Error('invalid input execute payload');
    if (!gate.canExecute(input.sessionId)) {
      emitInputBlocked(options.audit, input.sessionId, 'permission gate closed', input.event);
      return { accepted: false, executed: false, reason: 'remote input is disabled' };
    }
    const validation = validateNormalizedInputEvent(input.event);
    if (!validation.ok) {
      emitInputBlocked(options.audit, input.sessionId, validation.reason ?? 'invalid event', input.event);
      return { accepted: false, executed: false, reason: validation.reason };
    }
    if (!limiter.allow(input.sessionId)) {
      emitInputBlocked(options.audit, input.sessionId, 'rate limit exceeded', input.event);
      return { accepted: false, executed: false, reason: 'rate limit exceeded' };
    }
    return executor.execute(input.event);
  });
}
