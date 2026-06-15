export const DataChannelEnvelopeVersion = 1 as const;

export interface DataChannelEnvelope<TPayload = unknown> {
  version: typeof DataChannelEnvelopeVersion;
  type: string;
  sessionId: string;
  timestamp: number;
  payload: TPayload;
}

export interface HeartbeatMessage {
  type: "data-channel:heartbeat";
  timestamp: number;
}

export interface HeartbeatAckMessage {
  type: "data-channel:heartbeat-ack";
  timestamp: number;
  rttMs?: number;
}

export interface BackpressureState {
  queuedBytes: number;
  isThrottled: boolean;
  highWaterMark: number;
  lowWaterMark: number;
}
