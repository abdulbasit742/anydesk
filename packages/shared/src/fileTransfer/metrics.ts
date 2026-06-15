import type { FileTransferState } from "./types.js";

export interface SpeedSample {
  timestamp: number;
  transferredBytes: number;
}

export function calculateProgressPercent(state: Pick<FileTransferState, "totalBytes" | "transferredBytes" | "status">) {
  if (state.status === "completed") return 100;
  if (state.totalBytes <= 0) return 0;
  return Math.max(0, Math.min(100, Math.floor((state.transferredBytes / state.totalBytes) * 100)));
}

export function estimateBytesPerSecond(samples: SpeedSample[]) {
  if (samples.length < 2) return 0;
  const first = samples[0];
  const last = samples[samples.length - 1];
  const seconds = (last.timestamp - first.timestamp) / 1000;
  if (seconds <= 0) return 0;
  return Math.max(0, (last.transferredBytes - first.transferredBytes) / seconds);
}

export function estimateEtaSeconds(state: Pick<FileTransferState, "totalBytes" | "transferredBytes">, bytesPerSecond: number) {
  if (bytesPerSecond <= 0) return null;
  const remaining = Math.max(0, state.totalBytes - state.transferredBytes);
  return Math.ceil(remaining / bytesPerSecond);
}
