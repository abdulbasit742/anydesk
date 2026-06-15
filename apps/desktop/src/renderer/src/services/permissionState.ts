import {
  buildSessionPermissionSet,
  type DeviceAccessPolicySnapshot,
  type SessionPermissionSet
} from "@shared/index";
import type { RemoteInputPermissionState } from "./remoteInput.js";

export function buildHostSessionPermissions(input: {
  policy: DeviceAccessPolicySnapshot | null;
  hostAccepted: boolean;
  emergencyStopped: boolean;
  startedAt: Date;
  version: number;
}): SessionPermissionSet | null {
  return buildSessionPermissionSet(input);
}

export function coerceRemoteInputWithSessionPermissions(
  permissions: RemoteInputPermissionState,
  sessionPermissions: SessionPermissionSet | null
): RemoteInputPermissionState {
  if (!sessionPermissions || sessionPermissions.remoteInput !== "enabled") {
    return {
      ...permissions,
      mouse: false,
      keyboard: false,
      lastChangedAt: Date.now()
    };
  }

  return permissions;
}
