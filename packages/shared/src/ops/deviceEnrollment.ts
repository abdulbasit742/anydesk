export interface DeviceEnrollmentCode {
  code: string;
  expiresAt: string;
  teamId: string;
  createdByUserId: string;
}

export function normalizeEnrollmentCode(code: string): string {
  return code.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 12);
}

export function isEnrollmentCodeValid(code: DeviceEnrollmentCode, now = new Date()): boolean {
  return normalizeEnrollmentCode(code.code).length >= 8 && new Date(code.expiresAt) > now;
}
