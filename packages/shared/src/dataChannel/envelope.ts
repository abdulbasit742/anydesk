import { DataChannelEnvelopeVersion, type DataChannelEnvelope } from "./types.js";

export function createDataChannelEnvelope<TPayload>(
  sessionId: string,
  type: string,
  payload: TPayload,
  timestamp = Date.now()
): DataChannelEnvelope<TPayload> {
  return {
    version: DataChannelEnvelopeVersion,
    type,
    sessionId,
    timestamp,
    payload
  };
}

export function serializeDataChannelEnvelope<TPayload>(
  envelope: DataChannelEnvelope<TPayload>
) {
  return JSON.stringify(envelope);
}

export function parseDataChannelEnvelope(raw: string): DataChannelEnvelope {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Data channel envelope is not valid JSON");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Data channel envelope must be an object");
  }

  const record = parsed as Record<string, unknown>;
  if (record.version !== DataChannelEnvelopeVersion) {
    throw new Error(`Unsupported data channel envelope version: ${String(record.version)}`);
  }
  if (typeof record.type !== "string" || record.type.length === 0) {
    throw new Error("Data channel envelope type is required");
  }
  if (typeof record.sessionId !== "string" || record.sessionId.length === 0) {
    throw new Error("Data channel envelope sessionId is required");
  }
  if (typeof record.timestamp !== "number") {
    throw new Error("Data channel envelope timestamp must be a number");
  }
  if (!("payload" in record)) {
    throw new Error("Data channel envelope payload is required");
  }

  return record as unknown as DataChannelEnvelope;
}
