import assert from "node:assert/strict";
import {
  buildSessionPermissionSet,
  canEnableRemoteInput,
  type DeviceAccessPolicySnapshot
} from "../../packages/shared/src/permissions/index.js";

const trustedPolicy: DeviceAccessPolicySnapshot = {
  deviceId: "device_1",
  trustStatus: "trusted",
  unattendedAccessEnabled: false,
  remoteInputEnabled: true,
  clipboardSyncEnabled: true,
  fileTransferEnabled: true,
  requiresSessionApproval: true,
  maxSessionMinutes: 30,
  updatedAt: new Date(0).toISOString()
};

assert.equal(canEnableRemoteInput(trustedPolicy, { hostAccepted: true, emergencyStopped: false }).allowed, true);

const untrusted = { ...trustedPolicy, trustStatus: "untrusted" as const };
assert.equal(canEnableRemoteInput(untrusted, { hostAccepted: true, emergencyStopped: false }).allowed, false);
assert.equal(
  buildSessionPermissionSet({
    policy: untrusted,
    hostAccepted: true,
    emergencyStopped: false,
    startedAt: new Date("2026-06-15T00:00:00.000Z"),
    version: 1
  })?.remoteInput,
  "blocked"
);

assert.equal(
  buildSessionPermissionSet({
    policy: trustedPolicy,
    hostAccepted: true,
    emergencyStopped: true,
    version: 2
  })?.remoteInput,
  "blocked"
);
