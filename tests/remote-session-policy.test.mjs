import assert from 'node:assert/strict';
import test from 'node:test';
import {
  approveSupportRequest,
  createAuditEntry,
  createSupportRequest,
  endSupportRequest,
  HIGH_RISK_SCOPES,
  isExpired,
  SESSION_STATUS,
  startLocalPreview,
  SUPPORT_SCOPES,
} from '../src/security/remoteSessionPolicy.js';

const base = {
  requesterLabel: 'Support operator',
  hostLabel: 'Host user',
  targetLabel: 'Demo workstation',
  now: '2026-07-15T10:00:00.000Z',
  idFactory: () => 'session-12345678',
};

test('creates a short-lived screen-view request by default', () => {
  const request = createSupportRequest(base);
  assert.equal(request.status, SESSION_STATUS.CONSENT_PENDING);
  assert.deepEqual(request.scopes, [SUPPORT_SCOPES.SCREEN_VIEW]);
  assert.equal(request.transport, 'not_configured');
  assert.equal(request.expiresAt, '2026-07-15T10:10:00.000Z');
});

test('normalizes labels and de-duplicates scopes', () => {
  const request = createSupportRequest({
    ...base,
    requesterLabel: '  Support   operator  ',
    scopes: [SUPPORT_SCOPES.POINTER_CONTROL, SUPPORT_SCOPES.POINTER_CONTROL],
  });
  assert.equal(request.requesterLabel, 'Support operator');
  assert.deepEqual(request.scopes, [SUPPORT_SCOPES.SCREEN_VIEW, SUPPORT_SCOPES.POINTER_CONTROL]);
});

test('rejects unsupported capabilities and unsafe TTL values', () => {
  assert.throws(() => createSupportRequest({ ...base, scopes: ['shell_access'] }), /unsupported capability/);
  assert.throws(() => createSupportRequest({ ...base, ttlMinutes: 30 }), /between 1 and 15/);
});

test('exposes the high-risk registry through a read-only interface', () => {
  assert.equal(HIGH_RISK_SCOPES.has(SUPPORT_SCOPES.KEYBOARD_CONTROL), true);
  assert.equal('add' in HIGH_RISK_SCOPES, false);
  assert.equal(Object.isFrozen(HIGH_RISK_SCOPES.values()), true);
});

test('requires explicit host confirmation', () => {
  const request = createSupportRequest(base);
  assert.throws(() => approveSupportRequest(request, { now: '2026-07-15T10:01:00.000Z' }), /host confirmation/);
});

test('requires separate confirmation for high-risk scopes', () => {
  const request = createSupportRequest({ ...base, scopes: [SUPPORT_SCOPES.KEYBOARD_CONTROL] });
  assert.throws(
    () => approveSupportRequest(request, { hostConfirmed: true, now: '2026-07-15T10:01:00.000Z' }),
    /high-risk capabilities/,
  );
});

test('approves a confirmed request without activating a transport', () => {
  const request = createSupportRequest(base);
  const approved = approveSupportRequest(request, { hostConfirmed: true, now: '2026-07-15T10:01:00.000Z' });
  assert.equal(approved.status, SESSION_STATUS.APPROVED);
  assert.equal(approved.transport, 'not_configured');
  assert.equal(approved.consentedAt, '2026-07-15T10:01:00.000Z');
});

test('does not permit preview before consent', () => {
  const request = createSupportRequest(base);
  assert.throws(() => startLocalPreview(request, { now: '2026-07-15T10:01:00.000Z' }), /invalid session transition/);
});

test('starts only a local preview after approval', () => {
  const approved = approveSupportRequest(createSupportRequest(base), {
    hostConfirmed: true,
    now: '2026-07-15T10:01:00.000Z',
  });
  const preview = startLocalPreview(approved, { now: '2026-07-15T10:02:00.000Z' });
  assert.equal(preview.status, SESSION_STATUS.PREVIEW);
  assert.equal(preview.transport, 'not_configured');
});

test('expired requests fail closed', () => {
  const request = createSupportRequest({ ...base, ttlMinutes: 1 });
  assert.equal(isExpired(request, '2026-07-15T10:01:00.000Z'), true);
  assert.throws(
    () => approveSupportRequest(request, { hostConfirmed: true, now: '2026-07-15T10:01:00.000Z' }),
    /expired/,
  );
});

test('ends requests with an allowlisted reason', () => {
  const request = createSupportRequest(base);
  const ended = endSupportRequest(request, { reason: 'host_declined', now: '2026-07-15T10:01:00.000Z' });
  assert.equal(ended.status, SESSION_STATUS.ENDED);
  assert.equal(ended.endReason, 'host_declined');
  assert.throws(() => endSupportRequest(request, { reason: 'hidden_background_access' }), /invalid/);
});

test('creates bounded audit records without arbitrary fields', () => {
  const request = createSupportRequest(base);
  const entry = createAuditEntry(request, 'request_created', {
    at: '2026-07-15T10:00:00.000Z',
    details: { target: 'Demo workstation' },
  });
  assert.equal(entry.requestId, request.id);
  assert.equal(entry.details.target, 'Demo workstation');
  assert.throws(() => createAuditEntry(request, 'remote_shell_started'), /invalid/);
});
