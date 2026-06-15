export interface DeviceCode {
  code: string;
  expiresAt: number;
}

export function createReadableDeviceCode(random: () => number = Math.random, now = Date.now()): DeviceCode {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i += 1) code += alphabet[Math.floor(random() * alphabet.length) % alphabet.length];
  return { code: `${code.slice(0, 4)}-${code.slice(4)}`, expiresAt: now + 10 * 60 * 1000 };
}

export function isDeviceCodeExpired(code: DeviceCode, now = Date.now()): boolean {
  return now >= code.expiresAt;
}
