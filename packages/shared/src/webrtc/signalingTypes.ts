export type WebRtcSignalKind = "offer" | "answer" | "ice-candidate";

export type WebRtcConnectionState =
  | "new"
  | "connecting"
  | "connected"
  | "disconnected"
  | "failed"
  | "closed";

export type SessionRoomRole = "host" | "viewer" | "observer";

export type SessionRoomJoinPayload = {
  sessionId: string;
  role?: SessionRoomRole;
  deviceId?: string;
};

export type SessionRoomLeavePayload = {
  sessionId: string;
};

export type SessionRequestSocketPayload = {
  deviceId: string;
  reason?: string;
  permissions?: string[];
  mode?: "view-only";
};

export type SessionDecisionSocketPayload = {
  sessionId: string;
  reason?: string;
};

export type WebRtcDescriptionLike = {
  type?: string;
  sdp?: string;
  [key: string]: unknown;
};

export type WebRtcIceCandidateLike = {
  candidate?: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string | null;
  [key: string]: unknown;
};

export type WebRtcOfferPayload = {
  sessionId: string;
  sdp: WebRtcDescriptionLike;
  targetSocketId?: string;
};

export type WebRtcAnswerPayload = {
  sessionId: string;
  sdp: WebRtcDescriptionLike;
  targetSocketId?: string;
};

export type WebRtcIceCandidatePayload = {
  sessionId: string;
  candidate: WebRtcIceCandidateLike;
  targetSocketId?: string;
};

export type WebRtcConnectionStatePayload = {
  sessionId: string;
  state: WebRtcConnectionState;
  message?: string;
};

export type WebRtcRelayEnvelope<T> = T & {
  sessionId: string;
  fromSocketId: string;
  fromUserId?: string;
  createdAt: string;
};

export const RemoteDeskSocketEvents = {
  DeviceJoin: "device:join",
  DeviceJoined: "device:joined",
  DeviceOnline: "device:online",
  DeviceOffline: "device:offline",

  SessionRequest: "session:request",
  SessionRequested: "session:requested",
  SessionJoin: "session:join",
  SessionJoined: "session:joined",
  SessionLeave: "session:leave",
  SessionPeerJoined: "session:peer_joined",
  SessionPeerLeft: "session:peer_left",
  SessionAccepted: "session:accepted",
  SessionDenied: "session:denied",
  SessionEnded: "session:ended",
  SessionEmergencyStop: "session:emergency_stop",

  WebRtcOffer: "webrtc:offer",
  WebRtcAnswer: "webrtc:answer",
  WebRtcIceCandidate: "webrtc:ice_candidate",
  WebRtcConnectionState: "webrtc:connection_state",
  WebRtcError: "webrtc:error",

  Error: "error"
} as const;
