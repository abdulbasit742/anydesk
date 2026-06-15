import assert from "node:assert/strict";
import {
  deviceAdminActionLabel,
  grantCreateMetadata,
  policyChangeMetadata,
  trustChangeMetadata
} from "../../packages/shared/src/permissions/index.js";

assert.equal(deviceAdminActionLabel("device.trust.changed"), "Trust changed");
assert.equal(deviceAdminActionLabel("device.policy.changed"), "Access policy changed");
assert.equal(deviceAdminActionLabel("unknown.action"), "unknown.action");

assert.deepEqual(
  trustChangeMetadata({
    deviceId: "device_1",
    from: "untrusted",
    to: "trusted",
    reason: "owner approved"
  }),
  {
    deviceId: "device_1",
    from: "untrusted",
    to: "trusted",
    reason: "owner approved"
  }
);

assert.deepEqual(
  grantCreateMetadata({
    deviceId: "device_1",
    grantId: "grant_1",
    scope: ["fileTransfer", "remoteInput"],
    expiresAt: "2026-06-16T00:00:00.000Z"
  }),
  {
    deviceId: "device_1",
    grantId: "grant_1",
    scope: ["fileTransfer", "remoteInput"],
    notBefore: null,
    expiresAt: "2026-06-16T00:00:00.000Z"
  }
);

assert.deepEqual(
  policyChangeMetadata({
    deviceId: "device_1",
    before: {
      unattendedAccessEnabled: false,
      remoteInputEnabled: false,
      clipboardSyncEnabled: false,
      fileTransferEnabled: false,
      requiresSessionApproval: true,
      maxSessionMinutes: 30
    },
    after: {
      unattendedAccessEnabled: false,
      remoteInputEnabled: true,
      clipboardSyncEnabled: false,
      fileTransferEnabled: false,
      requiresSessionApproval: true,
      maxSessionMinutes: 30
    }
  }).after.remoteInputEnabled,
  true
);
