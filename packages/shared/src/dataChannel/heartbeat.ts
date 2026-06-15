import { createDataChannelEnvelope } from "./envelope.js";
import type { DataChannelEnvelope } from "./types.js";

export const DataChannelHeartbeatType = "data-channel:heartbeat";
export const DataChannelHeartbeatAckType = "data-channel:heartbeat-ack";

export interface DataChannelHeartbeatPayload {
  sequence: number;
  sentAt: number;
  lastRttMs: number | null;
}

export interface DataChannelHeartbeatAckPayload {
  sequence: number;
  sentAt: number;
  acknowledgedAt: number;
}

export interface DataChannelHeartbeatOptions {
  sessionId: string;
  intervalMs?: number;
  timeoutMs?: number;
  now?: () => number;
  send: (envelope: DataChannelEnvelope) => void;
  onTimeout?: (state: DataChannelHeartbeatState) => void;
}

export interface DataChannelHeartbeatState {
  running: boolean;
  sequence: number;
  lastSentAt: number | null;
  lastAckAt: number | null;
  lastRttMs: number | null;
}

export function createDataChannelHeartbeat(options: DataChannelHeartbeatOptions) {
  const intervalMs = options.intervalMs ?? 5_000;
  const timeoutMs = options.timeoutMs ?? 15_000;
  const now = options.now ?? Date.now;

  let running = false;
  let sequence = 0;
  let lastSentAt: number | null = null;
  let lastAckAt: number | null = null;
  let lastRttMs: number | null = null;
  let intervalHandle: ReturnType<typeof setInterval> | null = null;
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  function getState(): DataChannelHeartbeatState {
    return { running, sequence, lastSentAt, lastAckAt, lastRttMs };
  }

  function clearTimeoutHandle() {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }
  }

  function scheduleTimeout() {
    clearTimeoutHandle();
    timeoutHandle = setTimeout(() => {
      options.onTimeout?.(getState());
    }, timeoutMs);
  }

  function sendHeartbeat() {
    sequence += 1;
    lastSentAt = now();
    options.send(
      createDataChannelEnvelope<DataChannelHeartbeatPayload>(
        options.sessionId,
        DataChannelHeartbeatType,
        { sequence, sentAt: lastSentAt, lastRttMs },
        lastSentAt
      )
    );
    scheduleTimeout();
  }

  function start() {
    if (running) return;
    running = true;
    sendHeartbeat();
    intervalHandle = setInterval(sendHeartbeat, intervalMs);
  }

  function stop() {
    running = false;
    if (intervalHandle) {
      clearInterval(intervalHandle);
      intervalHandle = null;
    }
    clearTimeoutHandle();
  }

  function acknowledge(payload: DataChannelHeartbeatAckPayload) {
    clearTimeoutHandle();
    lastAckAt = now();
    lastRttMs = Math.max(0, lastAckAt - payload.sentAt);
  }

  function createAck(envelope: DataChannelEnvelope<DataChannelHeartbeatPayload>) {
    const acknowledgedAt = now();
    return createDataChannelEnvelope<DataChannelHeartbeatAckPayload>(
      envelope.sessionId,
      DataChannelHeartbeatAckType,
      {
        sequence: envelope.payload.sequence,
        sentAt: envelope.payload.sentAt,
        acknowledgedAt
      },
      acknowledgedAt
    );
  }

  return { start, stop, acknowledge, createAck, getState };
}
