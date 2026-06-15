export type TrustedDevice = {
  readonly id: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly deviceName: string;
  readonly fingerprintHash: string;
  readonly firstSeenAtMs: number;
  readonly lastSeenAtMs: number;
  readonly revokedAtMs?: number;
};

export function isTrustedDeviceActive(device: TrustedDevice, nowMs: number, maxAgeMs: number): boolean {
  return !device.revokedAtMs && nowMs - device.lastSeenAtMs <= maxAgeMs;
}
