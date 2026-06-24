import { io, type Socket } from "socket.io-client";
import { createScreenCaptureStream, loadScreenSources, stopScreenCaptureStream } from "./screenCapture.js";
import { PeerConnectionManager } from "./webrtc.js";

export type MvpSessionRequest = {
  id?: string;
  sessionId: string;
  deviceId?: string | null;
  targetName?: string | null;
  requesterSocketId?: string;
  client?: { id: string; email?: string; fullName?: string; remoteDeskId?: string };
  reason?: string | null;
  permissions?: string[];
};

export type MvpHostSignalingCallbacks = {
  onConnected?: (socketId: string) => void;
  onDisconnected?: (reason: string) => void;
  onDeviceJoined?: (payload: unknown) => void;
  onSessionRequested?: (payload: MvpSessionRequest) => void;
  onSessionEnded?: (payload: unknown) => void;
  onEmergencyStop?: (payload: unknown) => void;
  onAnswer?: (payload: { sessionId: string; sdp?: RTCSessionDescriptionInit; fromSocketId?: string }) => void;
  onIceCandidate?: (payload: { sessionId: string; candidate?: RTCIceCandidateInit; fromSocketId?: string }) => void;
  onError?: (message: string, payload?: unknown) => void;
};

export type ViewOnlyHostSessionOptions = {
  sessionId: string;
  sourceId?: string;
  signaling: MvpHostSignalingClient;
  onState?: (state: RTCPeerConnectionState) => void;
  onLog?: (message: string) => void;
};

const EVENTS = {
  deviceJoin: "device:join",
  sessionJoin: "session:join",
  sessionRequested: "session:requested",
  sessionAccepted: "session:accepted",
  sessionDenied: "session:denied",
  sessionEnded: "session:ended",
  sessionEmergencyStop: "session:emergency_stop",
  webrtcOffer: "webrtc:offer",
  webrtcAnswer: "webrtc:answer",
  webrtcIceCandidate: "webrtc:ice_candidate",
  webrtcConnectionState: "webrtc:connection_state",
  webrtcError: "webrtc:error",
  deviceJoined: "device:joined",
  error: "error"
} as const;

export class MvpHostSignalingClient {
  private socket: Socket;

  constructor(token: string, callbacks: MvpHostSignalingCallbacks = {}, socketUrl = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000") {
    this.socket = io(socketUrl, {
      autoConnect: false,
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 500,
      timeout: 15_000
    });

    this.socket.on("connect", () => callbacks.onConnected?.(this.socket.id ?? ""));
    this.socket.on("disconnect", (reason) => callbacks.onDisconnected?.(reason));
    this.socket.on(EVENTS.deviceJoined, (payload) => callbacks.onDeviceJoined?.(payload));
    this.socket.on(EVENTS.sessionRequested, (payload) => callbacks.onSessionRequested?.(payload as MvpSessionRequest));
    this.socket.on(EVENTS.sessionEnded, (payload) => callbacks.onSessionEnded?.(payload));
    this.socket.on(EVENTS.sessionEmergencyStop, (payload) => callbacks.onEmergencyStop?.(payload));
    this.socket.on(EVENTS.webrtcAnswer, (payload) => callbacks.onAnswer?.(payload));
    this.socket.on(EVENTS.webrtcIceCandidate, (payload) => callbacks.onIceCandidate?.(payload));
    this.socket.on(EVENTS.error, (payload: { message?: string }) => callbacks.onError?.(payload.message ?? "Socket error", payload));
    this.socket.on(EVENTS.webrtcError, (payload: { message?: string }) => callbacks.onError?.(payload.message ?? "WebRTC signaling error", payload));
  }

  connect() { this.socket.connect(); }
  disconnect() { this.socket.disconnect(); }
  get id() { return this.socket.id ?? null; }

  joinDevice(deviceId: string) {
    this.socket.emit(EVENTS.deviceJoin, { deviceId });
  }

  joinSession(sessionId: string, deviceId?: string) {
    this.socket.emit(EVENTS.sessionJoin, { sessionId, role: "host", deviceId });
  }

  acceptSession(sessionId: string) {
    this.socket.emit(EVENTS.sessionAccepted, { sessionId });
  }

  denySession(sessionId: string, reason = "host_denied") {
    this.socket.emit(EVENTS.sessionDenied, { sessionId, reason });
  }

  endSession(sessionId: string, reason = "host_ended") {
    this.socket.emit(EVENTS.sessionEnded, { sessionId, reason });
  }

  emergencyStop(sessionId: string, reason = "host_emergency_stop") {
    this.socket.emit(EVENTS.sessionEmergencyStop, { sessionId, reason });
  }

  sendOffer(sessionId: string, sdp: RTCSessionDescriptionInit) {
    this.socket.emit(EVENTS.webrtcOffer, { sessionId, sdp });
  }

  sendIceCandidate(sessionId: string, candidate: RTCIceCandidateInit) {
    this.socket.emit(EVENTS.webrtcIceCandidate, { sessionId, candidate });
  }

  sendConnectionState(sessionId: string, state: RTCPeerConnectionState, message?: string) {
    this.socket.emit(EVENTS.webrtcConnectionState, { sessionId, state, message });
  }
}

export async function startViewOnlyHostSession(options: ViewOnlyHostSessionOptions) {
  const sources = await loadScreenSources();
  const selected = options.sourceId ? sources.find((source) => source.id === options.sourceId) : sources[0];
  if (!selected) throw new Error("No screen source is available for view-only sharing.");

  const stream = await createScreenCaptureStream({ sourceId: selected.id, width: 1920, height: 1080, frameRate: 30 });
  const peer = new PeerConnectionManager();
  peer.addStream(stream);

  peer.onIceCandidate((candidate) => options.signaling.sendIceCandidate(options.sessionId, candidate.toJSON()));
  peer.onConnectionState((state) => {
    options.onState?.(state);
    options.signaling.sendConnectionState(options.sessionId, state);
  });

  const offer = await peer.createOffer();
  options.signaling.joinSession(options.sessionId);
  options.signaling.sendOffer(options.sessionId, offer);
  options.onLog?.(`Started view-only screen sharing for ${selected.name}.`);

  return {
    selectedSource: selected,
    stream,
    peer,
    async acceptAnswer(answer: RTCSessionDescriptionInit) { await peer.acceptAnswer(answer); },
    async addIceCandidate(candidate: RTCIceCandidateInit) { await peer.addIceCandidate(candidate); },
    stop() {
      stopScreenCaptureStream(stream);
      peer.close();
      options.signaling.endSession(options.sessionId);
    },
    emergencyStop() {
      stopScreenCaptureStream(stream);
      peer.close();
      options.signaling.emergencyStop(options.sessionId);
    }
  };
}

export function createMvpHostSignalingClient(token: string, callbacks: MvpHostSignalingCallbacks = {}) {
  return new MvpHostSignalingClient(token, callbacks);
}
