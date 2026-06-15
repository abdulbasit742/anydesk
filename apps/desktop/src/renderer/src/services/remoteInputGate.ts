import type { SessionPermissionSet } from "@shared/index";
import type { RemoteInputMessage, RemoteInputPermissionState } from "./remoteInput.js";

export function canCaptureMouse(permissions: RemoteInputPermissionState, sessionPermissions: SessionPermissionSet | null) {
  return !permissions.emergencyStopped && permissions.mouse && sessionPermissions?.remoteInput === "enabled";
}

export function canCaptureKeyboard(permissions: RemoteInputPermissionState, sessionPermissions: SessionPermissionSet | null) {
  return !permissions.emergencyStopped && permissions.keyboard && sessionPermissions?.remoteInput === "enabled";
}

export function inputAllowedByPolicy(
  message: RemoteInputMessage,
  permissions: RemoteInputPermissionState,
  sessionPermissions: SessionPermissionSet | null
) {
  if (message.type === "key-down" || message.type === "key-up") {
    return canCaptureKeyboard(permissions, sessionPermissions);
  }

  return canCaptureMouse(permissions, sessionPermissions);
}
