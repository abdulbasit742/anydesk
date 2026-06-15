const BYTE_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB"] as const;
const BITRATE_UNITS = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"] as const;

function normalizeDecimals(decimals: number): number {
  if (!Number.isFinite(decimals)) return 2;
  return Math.max(0, Math.min(6, Math.trunc(decimals)));
}

function formatScaledValue(value: number, base: number, units: readonly string[], decimals = 2): string {
  if (!Number.isFinite(value) || value <= 0) {
    return `0 ${units[0]}`;
  }

  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(base)), units.length - 1);
  const scaled = value / base ** unitIndex;
  return `${Number.parseFloat(scaled.toFixed(normalizeDecimals(decimals)))} ${units[unitIndex]}`;
}

export function formatBytes(bytes: number, decimals = 2): string {
  return formatScaledValue(bytes, 1024, BYTE_UNITS, decimals);
}

export function formatBitrate(bitsPerSecond: number, decimals = 2): string {
  return formatScaledValue(bitsPerSecond, 1000, BITRATE_UNITS, decimals);
}

export function formatBytesPerSecond(bytesPerSecond: number, decimals = 2): string {
  return formatBitrate(bytesPerSecond * 8, decimals);
}

export function formatMilliseconds(milliseconds: number, decimals = 1): string {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "0 ms";
  if (milliseconds < 1000) return `${Math.round(milliseconds)} ms`;

  const seconds = milliseconds / 1000;
  if (seconds < 60) return `${seconds.toFixed(normalizeDecimals(decimals))} s`;

  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(normalizeDecimals(decimals))} min`;

  const hours = minutes / 60;
  return `${hours.toFixed(normalizeDecimals(decimals))} hr`;
}

export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100).toFixed(normalizeDecimals(decimals))}%`;
}
