export type SafeDeviceCommandType = "refresh_policy" | "collect_diagnostics" | "check_update" | "sign_out";

export interface SafeDeviceCommand {
  id: string;
  deviceId: string;
  type: SafeDeviceCommandType;
  issuedAt: string;
  expiresAt: string;
}

export function isSafeDeviceCommand(command: SafeDeviceCommand): boolean {
  return ["refresh_policy", "collect_diagnostics", "check_update", "sign_out"].includes(command.type);
}

export function isDeviceCommandExpired(command: SafeDeviceCommand, now = new Date()): boolean {
  return new Date(command.expiresAt) <= now;
}
