import test from 'node:test';
import assert from 'node:assert/strict';
import { canInviteMember, hasPermission } from '../src/team/index.js';

test('owner has billing management permission', () => {
  assert.equal(hasPermission('owner', 'billing:manage'), true);
});

test('admin cannot invite an owner', () => {
  assert.equal(canInviteMember({ userId: 'u1', organizationId: 'o1', role: 'admin' }, 'owner'), false);
});
