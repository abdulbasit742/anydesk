export type WebRtcPeerRole = "host" | "viewer";
export type WebRtcSignalKind = "offer" | "answer" | "ice";

export type WebRtcSignalEnvelope = {
  readonly kind: WebRtcSignalKind;
  readonly sessionId: string;
  readonly senderPeerId: string;
  readonly targetPeerId: string;
  readonly createdAtMs: number;
  readonly payload: unknown;
};

export type WebRtcClientReadiness = {
  readonly hasSessionId: boolean;
  readonly hasLocalPeerId: boolean;
  readonly hasTargetPeerId: boolean;
  readonly hasRole: boolean;
  readonly canSignal: boolean;
};

export function createWebRtcSignalEnvelope(input: WebRtcSignalEnvelope): WebRtcSignalEnvelope {
  return {
    kind: input.kind,
    sessionId: input.sessionId,
    senderPeerId: input.senderPeerId,
    targetPeerId: input.targetPeerId,
    createdAtMs: input.createdAtMs,
    payload: input.payload,
  };
}

export function getWebRtcClientReadiness(input: {
  readonly sessionId?: string | null;
  readonly localPeerId?: string | null;
  readonly targetPeerId?: string | null;
  readonly role?: WebRtcPeerRole | null;
}): WebRtcClientReadiness {
  const hasSessionId = typeof input.sessionId === "string" && input.sessionId.trim().length > 0;
  const hasLocalPeerId = typeof input.localPeerId === "string" && input.localPeerId.trim().length > 0;
  const hasTargetPeerId = typeof input.targetPeerId === "string" && input.targetPeerId.trim().length > 0;
  const hasRole = input.role === "host" || input.role === "viewer";

  return {
    hasSessionId,
    hasLocalPeerId,
    hasTargetPeerId,
    hasRole,
    canSignal: hasSessionId && hasLocalPeerId && hasTargetPeerId && hasRole,
  };
}

export function isWebRtcSignalKind(value: string): value is WebRtcSignalKind {
  return value === "offer" || value === "answer" || value === "ice";
}
