export type RemoteInputActionType =
  | 'pointer_move'
  | 'pointer_click'
  | 'pointer_down'
  | 'pointer_up'
  | 'scroll'
  | 'key_down'
  | 'key_up'
  | 'text_input';

export interface RemoteInputPayload {
  sessionId: string;
  actionType: RemoteInputActionType;
  sentAt: string;
  x?: number;
  y?: number;
  button?: 'left' | 'right' | 'middle';
  deltaX?: number;
  deltaY?: number;
  key?: string;
  text?: string;
}

export type RemoteInputDeniedCode =
  | 'session_not_found'
  | 'session_not_active'
  | 'consent_required'
  | 'remote_input_not_approved'
  | 'remote_input_policy_disabled'
  | 'unauthorized_socket'
  | 'host_device_untrusted'
  | 'host_device_revoked'
  | 'host_device_blocked'
  | 'host_device_compromised'
  | 'emergency_stopped'
  | 'session_ended'
  | 'invalid_input_payload'
  | 'input_execution_disabled';

export interface RemoteInputGuardContext {
  sessionExists: boolean;
  sessionStatus: 'accepted' | 'signaling_ready' | 'connecting' | 'active' | 'ended' | 'failed' | 'expired' | 'rejected' | 'emergency_stopped';
  consentAccepted: boolean;
  remoteInputApproved: boolean;
  remoteInputPolicyEnabled: boolean;
  socketAuthorized: boolean;
  hostTrustStatus: 'trusted' | 'untrusted' | 'revoked' | 'blocked' | 'compromised';
  emergencyStopped: boolean;
  inputExecutionEnabled: boolean;
}

export interface RemoteInputGuardResult {
  allowed: boolean;
  code?: RemoteInputDeniedCode;
  message: string;
}

const inputReadyStatuses = new Set(['accepted', 'signaling_ready', 'connecting', 'active']);
const allowedKeys = new Set([
  'Backspace',
  'Tab',
  'Enter',
  'Escape',
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Delete',
  'Home',
  'End',
  'PageUp',
  'PageDown'
]);

export function canAcceptRemoteInput(context: RemoteInputGuardContext): RemoteInputGuardResult {
  if (!context.sessionExists) return deny('session_not_found', 'Session does not exist.');
  if (context.emergencyStopped || context.sessionStatus === 'emergency_stopped') return deny('emergency_stopped', 'Emergency Stop has disabled remote input.');
  if (['ended', 'failed', 'expired', 'rejected'].includes(context.sessionStatus)) return deny('session_ended', 'Session is no longer input-ready.');
  if (!inputReadyStatuses.has(context.sessionStatus)) return deny('session_not_active', 'Session is not in an input-ready state.');
  if (!context.consentAccepted) return deny('consent_required', 'Host consent is required before remote input.');
  if (!context.remoteInputApproved) return deny('remote_input_not_approved', 'Remote input was not approved by the host.');
  if (!context.remoteInputPolicyEnabled) return deny('remote_input_policy_disabled', 'Remote input is disabled by policy.');
  if (!context.socketAuthorized) return deny('unauthorized_socket', 'Socket is not authorized for this session.');
  if (context.hostTrustStatus === 'untrusted') return deny('host_device_untrusted', 'Host device is not trusted.');
  if (context.hostTrustStatus === 'revoked') return deny('host_device_revoked', 'Host device is revoked.');
  if (context.hostTrustStatus === 'blocked') return deny('host_device_blocked', 'Host device is blocked.');
  if (context.hostTrustStatus === 'compromised') return deny('host_device_compromised', 'Host device is compromised.');
  if (!context.inputExecutionEnabled) return deny('input_execution_disabled', 'Remote input execution is disabled in this build.');
  return { allowed: true, message: 'Remote input guard passed.' };
}

export function validateRemoteInputPayload(payload: unknown): RemoteInputGuardResult {
  if (!payload || typeof payload !== 'object') return deny('invalid_input_payload', 'Input payload must be an object.');
  const candidate = payload as Partial<RemoteInputPayload>;
  if (!candidate.sessionId || typeof candidate.sessionId !== 'string' || candidate.sessionId.length > 128) return deny('invalid_input_payload', 'Valid session id is required.');
  if (!candidate.actionType || !isRemoteInputActionType(candidate.actionType)) return deny('invalid_input_payload', 'Valid remote input action type is required.');
  if (!candidate.sentAt || Number.isNaN(new Date(candidate.sentAt).getTime())) return deny('invalid_input_payload', 'Valid sentAt timestamp is required.');
  if ((candidate.x !== undefined && !isSafeCoordinate(candidate.x)) || (candidate.y !== undefined && !isSafeCoordinate(candidate.y))) return deny('invalid_input_payload', 'Pointer coordinates are invalid.');
  if ((candidate.deltaX !== undefined && !isSafeDelta(candidate.deltaX)) || (candidate.deltaY !== undefined && !isSafeDelta(candidate.deltaY))) return deny('invalid_input_payload', 'Scroll delta is invalid.');
  if (candidate.key !== undefined && !isSafeKey(candidate.key)) return deny('invalid_input_payload', 'Key value is not allowlisted.');
  if (candidate.text !== undefined && (typeof candidate.text !== 'string' || candidate.text.length > 256)) return deny('invalid_input_payload', 'Text input is invalid or too long.');
  return { allowed: true, message: 'Remote input payload is valid.' };
}

export function sanitizeRemoteInputPayload(payload: RemoteInputPayload): RemoteInputPayload {
  return {
    sessionId: payload.sessionId.slice(0, 128),
    actionType: payload.actionType,
    sentAt: payload.sentAt,
    x: payload.x,
    y: payload.y,
    button: payload.button,
    deltaX: payload.deltaX,
    deltaY: payload.deltaY,
    key: payload.key,
    text: payload.text ? '[TEXT_REDACTED]' : undefined
  };
}

function isRemoteInputActionType(value: unknown): value is RemoteInputActionType {
  return typeof value === 'string' && ['pointer_move', 'pointer_click', 'pointer_down', 'pointer_up', 'scroll', 'key_down', 'key_up', 'text_input'].includes(value);
}

function isSafeCoordinate(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100_000;
}

function isSafeDelta(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 10_000;
}

function isSafeKey(key: string): boolean {
  if (allowedKeys.has(key)) return true;
  return /^[a-z0-9]$/i.test(key) || /^F(?:[1-9]|1[0-2])$/.test(key);
}

function deny(code: RemoteInputDeniedCode, message: string): RemoteInputGuardResult {
  return { allowed: false, code, message };
}
