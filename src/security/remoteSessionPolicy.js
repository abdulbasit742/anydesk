const DEFAULT_TTL_MINUTES = 10;
const MAX_TTL_MINUTES = 15;
const MAX_LABEL_LENGTH = 80;

export const SUPPORT_SCOPES = Object.freeze({
  SCREEN_VIEW: 'screen_view',
  POINTER_CONTROL: 'pointer_control',
  KEYBOARD_CONTROL: 'keyboard_control',
  CLIPBOARD_READ: 'clipboard_read',
  CLIPBOARD_WRITE: 'clipboard_write',
  FILE_RECEIVE: 'file_receive',
  FILE_SEND: 'file_send',
});

const HIGH_RISK_SCOPE_SET = new Set([
  SUPPORT_SCOPES.POINTER_CONTROL,
  SUPPORT_SCOPES.KEYBOARD_CONTROL,
  SUPPORT_SCOPES.CLIPBOARD_READ,
  SUPPORT_SCOPES.CLIPBOARD_WRITE,
  SUPPORT_SCOPES.FILE_RECEIVE,
  SUPPORT_SCOPES.FILE_SEND,
]);

export const HIGH_RISK_SCOPES = Object.freeze({
  has(scope) {
    return HIGH_RISK_SCOPE_SET.has(scope);
  },
  values() {
    return Object.freeze([...HIGH_RISK_SCOPE_SET]);
  },
});

export const SESSION_STATUS = Object.freeze({
  CONSENT_PENDING: 'consent_pending',
  APPROVED: 'approved',
  PREVIEW: 'preview',
  ENDED: 'ended',
});

const ALLOWED_SCOPES = new Set(Object.values(SUPPORT_SCOPES));
const ALLOWED_TRANSITIONS = Object.freeze({
  [SESSION_STATUS.CONSENT_PENDING]: new Set([SESSION_STATUS.APPROVED, SESSION_STATUS.ENDED]),
  [SESSION_STATUS.APPROVED]: new Set([SESSION_STATUS.PREVIEW, SESSION_STATUS.ENDED]),
  [SESSION_STATUS.PREVIEW]: new Set([SESSION_STATUS.ENDED]),
  [SESSION_STATUS.ENDED]: new Set(),
});

function normalizeLabel(value, fieldName) {
  const label = String(value ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim();
  if (!label) throw new TypeError(`${fieldName} is required`);
  if (label.length > MAX_LABEL_LENGTH) throw new RangeError(`${fieldName} is too long`);
  if (/[\u0000-\u001f\u007f]/.test(label)) throw new TypeError(`${fieldName} contains control characters`);
  return label;
}

function normalizeNow(value) {
  const date = value instanceof Date ? value : new Date(value ?? Date.now());
  if (Number.isNaN(date.getTime())) throw new TypeError('now must be a valid date');
  return date;
}

function normalizeScopes(scopes) {
  const requested = Array.isArray(scopes) && scopes.length ? scopes : [SUPPORT_SCOPES.SCREEN_VIEW];
  const unique = [...new Set(requested.map((scope) => String(scope)))];
  if (unique.some((scope) => !ALLOWED_SCOPES.has(scope))) {
    throw new TypeError('requested scopes contain an unsupported capability');
  }
  if (!unique.includes(SUPPORT_SCOPES.SCREEN_VIEW)) unique.unshift(SUPPORT_SCOPES.SCREEN_VIEW);
  return Object.freeze(unique);
}

function defaultIdFactory() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  throw new Error('secure random UUID generation is unavailable');
}

function transition(request, nextStatus, timestamp, extra = {}) {
  if (!request || typeof request !== 'object') throw new TypeError('request is required');
  if (!ALLOWED_TRANSITIONS[request.status]?.has(nextStatus)) {
    throw new Error(`invalid session transition: ${request.status} -> ${nextStatus}`);
  }
  return Object.freeze({ ...request, ...extra, status: nextStatus, updatedAt: timestamp.toISOString() });
}

export function createSupportRequest({
  requesterLabel,
  hostLabel,
  targetLabel,
  scopes,
  ttlMinutes = DEFAULT_TTL_MINUTES,
  now,
  idFactory = defaultIdFactory,
} = {}) {
  const createdAt = normalizeNow(now);
  const ttl = Number(ttlMinutes);
  if (!Number.isInteger(ttl) || ttl < 1 || ttl > MAX_TTL_MINUTES) {
    throw new RangeError(`ttlMinutes must be an integer between 1 and ${MAX_TTL_MINUTES}`);
  }
  const id = String(idFactory()).trim();
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(id)) throw new TypeError('idFactory returned an invalid request ID');
  const requestedScopes = normalizeScopes(scopes);
  return Object.freeze({
    id,
    requesterLabel: normalizeLabel(requesterLabel, 'requesterLabel'),
    hostLabel: normalizeLabel(hostLabel, 'hostLabel'),
    targetLabel: normalizeLabel(targetLabel, 'targetLabel'),
    scopes: requestedScopes,
    highRiskScopes: Object.freeze(requestedScopes.filter((scope) => HIGH_RISK_SCOPES.has(scope))),
    status: SESSION_STATUS.CONSENT_PENDING,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    expiresAt: new Date(createdAt.getTime() + ttl * 60_000).toISOString(),
    consentedAt: null,
    previewStartedAt: null,
    endedAt: null,
    endReason: null,
    transport: 'not_configured',
  });
}

export function isExpired(request, now) {
  const current = normalizeNow(now);
  return current.getTime() >= new Date(request.expiresAt).getTime();
}

export function approveSupportRequest(request, {
  hostConfirmed,
  highRiskConfirmed = false,
  now,
} = {}) {
  const timestamp = normalizeNow(now);
  if (request.status !== SESSION_STATUS.CONSENT_PENDING) {
    throw new Error('only a pending request can be approved');
  }
  if (isExpired(request, timestamp)) throw new Error('support request has expired');
  if (hostConfirmed !== true) throw new Error('host confirmation is required');
  if (request.highRiskScopes.length && highRiskConfirmed !== true) {
    throw new Error('high-risk capabilities require separate confirmation');
  }
  return transition(request, SESSION_STATUS.APPROVED, timestamp, {
    consentedAt: timestamp.toISOString(),
  });
}

export function startLocalPreview(request, { now } = {}) {
  const timestamp = normalizeNow(now);
  if (request.transport !== 'not_configured') throw new Error('unexpected transport state');
  if (isExpired(request, timestamp)) throw new Error('support request has expired');
  return transition(request, SESSION_STATUS.PREVIEW, timestamp, {
    previewStartedAt: timestamp.toISOString(),
  });
}

export function endSupportRequest(request, { reason = 'operator_ended', now } = {}) {
  const timestamp = normalizeNow(now);
  const allowedReasons = new Set(['operator_ended', 'host_declined', 'expired', 'cancelled']);
  if (!allowedReasons.has(reason)) throw new TypeError('end reason is invalid');
  if (request.status === SESSION_STATUS.ENDED) return request;
  return transition(request, SESSION_STATUS.ENDED, timestamp, {
    endedAt: timestamp.toISOString(),
    endReason: reason,
  });
}

export function createAuditEntry(request, action, { at, details = {} } = {}) {
  const timestamp = normalizeNow(at);
  const allowedActions = new Set(['request_created', 'consent_approved', 'preview_started', 'request_ended']);
  if (!allowedActions.has(action)) throw new TypeError('audit action is invalid');
  const safeDetails = {};
  for (const [key, value] of Object.entries(details)) {
    if (!/^[a-z][a-zA-Z0-9]{0,39}$/.test(key)) throw new TypeError('audit detail key is invalid');
    const text = String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 160);
    safeDetails[key] = text;
  }
  return Object.freeze({
    id: `${request.id}:${action}:${timestamp.getTime()}`,
    requestId: request.id,
    action,
    at: timestamp.toISOString(),
    status: request.status,
    details: Object.freeze(safeDetails),
  });
}
