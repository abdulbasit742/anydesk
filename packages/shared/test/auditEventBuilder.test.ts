import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuditEvent, isAuditEvent, systemAuditActor } from '../src/audit/index.js';

test('audit event builder freezes metadata and creates valid event', () => {
  const event = buildAuditEvent({ id: 'a1', type: 'file_transfer.completed', actor: systemAuditActor(), organizationId: 'org1', metadata: { bytes: 100 }, occurredAtMs: 123 });
  assert.equal(isAuditEvent(event), true);
  assert.equal(event.severity, 'info');
  assert.equal(Object.isFrozen(event.metadata), true);
});
