export type WebRtcLifecycleState =
  | "idle"
  | "preparing"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "failed"
  | "closed";

export type WebRtcNativeConnectionState =
  | "new"
  | "connecting"
  | "connected"
  | "disconnected"
  | "failed"
  | "closed";

export type WebRtcNativeIceConnectionState =
  | "new"
  | "checking"
  | "connected"
  | "completed"
  | "disconnected"
  | "failed"
  | "closed";

export type WebRtcLifecycleInput = {
  readonly connectionState?: WebRtcNativeConnectionState | null;
  readonly iceConnectionState?: WebRtcNativeIceConnectionState | null;
  readonly hasLocalDescription: boolean;
  readonly hasRemoteDescription: boolean;
  readonly hasActiveMedia: boolean;
};

export function getWebRtcLifecycleState(input: WebRtcLifecycleInput): WebRtcLifecycleState {
  if (input.connectionState === "closed" || input.iceConnectionState === "closed") {
    return "closed";
  }

  if (input.connectionState === "failed" || input.iceConnectionState === "failed") {
    return "failed";
  }

  if (input.connectionState === "disconnected" || input.iceConnectionState === "disconnected") {
    return "reconnecting";
  }

  if (input.connectionState === "connected" || input.iceConnectionState === "connected" || input.iceConnectionState === "completed") {
    return input.hasActiveMedia ? "connected" : "connecting";
  }

  if (input.connectionState === "connecting" || input.iceConnectionState === "checking") {
    return "connecting";
  }

  if (input.hasLocalDescription || input.hasRemoteDescription) {
    return "preparing";
  }

  return "idle";
}

export function isTerminalWebRtcLifecycleState(state: WebRtcLifecycleState): boolean {
  return state === "failed" || state === "closed";
}

export function isInteractiveWebRtcLifecycleState(state: WebRtcLifecycleState): boolean {
  return state === "connected" || state === "reconnecting";
}
