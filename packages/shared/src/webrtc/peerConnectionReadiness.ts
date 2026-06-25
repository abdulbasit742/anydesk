export type WebRtcRuntimeSupport = {
  readonly hasPeerConnection: boolean;
  readonly hasMediaDevices: boolean;
  readonly hasGetUserMedia: boolean;
  readonly hasGetDisplayMedia: boolean;
};

export type WebRtcPeerConnectionReadiness = WebRtcRuntimeSupport & {
  readonly hasSessionId: boolean;
  readonly hasLocalPeerId: boolean;
  readonly hasRemotePeerId: boolean;
  readonly hasUserConsent: boolean;
  readonly canCreateConnection: boolean;
};

export function getWebRtcRuntimeSupport(globalLike: {
  readonly RTCPeerConnection?: unknown;
  readonly navigator?: {
    readonly mediaDevices?: {
      readonly getUserMedia?: unknown;
      readonly getDisplayMedia?: unknown;
    };
  };
}): WebRtcRuntimeSupport {
  const mediaDevices = globalLike.navigator?.mediaDevices;

  return {
    hasPeerConnection: typeof globalLike.RTCPeerConnection === "function",
    hasMediaDevices: Boolean(mediaDevices),
    hasGetUserMedia: typeof mediaDevices?.getUserMedia === "function",
    hasGetDisplayMedia: typeof mediaDevices?.getDisplayMedia === "function",
  };
}

export function getWebRtcPeerConnectionReadiness(input: {
  readonly runtime: WebRtcRuntimeSupport;
  readonly sessionId?: string | null;
  readonly localPeerId?: string | null;
  readonly remotePeerId?: string | null;
  readonly hasUserConsent: boolean;
}): WebRtcPeerConnectionReadiness {
  const hasSessionId = typeof input.sessionId === "string" && input.sessionId.trim().length > 0;
  const hasLocalPeerId = typeof input.localPeerId === "string" && input.localPeerId.trim().length > 0;
  const hasRemotePeerId = typeof input.remotePeerId === "string" && input.remotePeerId.trim().length > 0;

  return {
    ...input.runtime,
    hasSessionId,
    hasLocalPeerId,
    hasRemotePeerId,
    hasUserConsent: input.hasUserConsent,
    canCreateConnection:
      input.runtime.hasPeerConnection &&
      hasSessionId &&
      hasLocalPeerId &&
      hasRemotePeerId &&
      input.hasUserConsent,
  };
}
