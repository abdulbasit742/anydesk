export function normalizeMacAddress(macAddress: string) {
  const normalized = macAddress.replace(/[^0-9a-fA-F]/g, "").toLowerCase();

  if (!/^[0-9a-f]{12}$/.test(normalized)) {
    throw new Error("Invalid MAC address");
  }

  return normalized;
}

export function buildMagicPacket(macAddress: string) {
  const mac = Buffer.from(normalizeMacAddress(macAddress), "hex");
  return Buffer.concat([Buffer.alloc(6, 0xff), ...Array.from({ length: 16 }, () => mac)]);
}
