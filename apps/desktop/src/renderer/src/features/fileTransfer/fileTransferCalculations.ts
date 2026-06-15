export interface TransferRateSample {
  at: number;
  bytes: number;
}

export function calculateBytesPerSecond(samples: TransferRateSample[], now = Date.now()): number {
  const recent = samples.filter((sample) => now - sample.at <= 10000).sort((a, b) => a.at - b.at);
  if (recent.length < 2) return 0;
  const first = recent[0];
  const last = recent[recent.length - 1];
  const elapsedSeconds = Math.max(0.001, (last.at - first.at) / 1000);
  return Math.max(0, (last.bytes - first.bytes) / elapsedSeconds);
}

export function estimateRemainingMs(totalBytes: number, transferredBytes: number, bytesPerSecond: number): number | null {
  if (bytesPerSecond <= 0) return null;
  const remaining = Math.max(0, totalBytes - transferredBytes);
  return Math.ceil((remaining / bytesPerSecond) * 1000);
}

export function percentage(totalBytes: number, transferredBytes: number): number {
  if (totalBytes <= 0) return 0;
  return Math.min(100, Math.max(0, (transferredBytes / totalBytes) * 100));
}

export function formatTransferRate(bytesPerSecond: number): string {
  if (bytesPerSecond <= 0) return '—';
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  let value = bytesPerSecond;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

export function formatEta(ms: number | null): string {
  if (ms == null) return 'calculating';
  if (ms <= 1000) return 'less than 1s';
  const seconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remainder}s` : `${remainder}s`;
}
