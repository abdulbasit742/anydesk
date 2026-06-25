export type Plan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
export type SessionStatus = "PENDING" | "ACTIVE" | "ENDED" | "REJECTED" | "FAILED";

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  remoteDeskId: string;
  plan: Plan;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserDto;
  tokens: AuthTokens;
}

export interface ConnectRequestPayload {
  targetRemoteDeskId: string;
  devicePassword: string;
}

export interface IncomingRequestPayload {
  sessionId: string;
  requesterRemoteDeskId: string;
  requesterSocketId: string;
}

export interface SessionResponsePayload {
  sessionId: string;
  accepted: boolean;
  requesterSocketId: string;
}

export interface SignalPayload {
  sessionId: string;
  targetSocketId: string;
  signal: unknown;
}

export const ClientEvents = {
  ConnectRequest: "connect:request",
  ConnectResponse: "connect:response",
  WebrtcOffer: "webrtc:offer",
  WebrtcAnswer: "webrtc:answer",
  WebrtcIce: "webrtc:ice",
  SessionEnd: "session:end"
} as const;

export const ServerEvents = {
  IncomingRequest: "incoming:request",
  RequestAccepted: "request:accepted",
  RequestRejected: "request:rejected",
  WebrtcOffer: "webrtc:offer",
  WebrtcAnswer: "webrtc:answer",
  WebrtcIce: "webrtc:ice",
  PeerDisconnected: "peer:disconnected",
  Error: "error"
} as const;

export interface RemoteInputEvent {
  type: "mouse-move" | "mouse-click" | "mouse-scroll" | "key-press";
  x?: number;
  y?: number;
  button?: "left" | "right" | "middle";
  deltaX?: number;
  deltaY?: number;
  key?: string;
  modifiers?: string[];
}

export * from "./fileTransfer/index.js";
export * from "./clipboard/index.js";
export * from "./contacts/index.js";
export * from "./connectors/index.js";
export * from "./dataChannel/index.js";
export * from "./desktop/index.js";
export * from "./mobileInput/index.js";
export * from "./orgs/index.js";
export * from "./permissions/index.js";
export * from "./productionSprint/index.js";
export * from "./sdk/index.js";
export * from "./session/index.js";
export * from "./utils/index.js";
export * from "./audit/index.js";
export * from "./billing/index.js";
export * from "./checksums/index.js";
export * from "./heartbeat/index.js";
export * as hardening from "./hardening/index.js";
export * as ops from "./ops/index.js";
export * as pack6 from "./pack6/index.js";
export * as pack7 from "./pack7/index.js";
export * as pack8 from "./pack8/index.js";
export * as pack9 from "./pack9/index.js";
export * as pack10 from "./pack10/index.js";
export * as pack14Webviewer from "./pack14Webviewer/index.js";
export * as pack15 from "./pack15/index.js";
export * as pack16 from "./pack16/index.js";
export * as pack17 from "./pack17/index.js";
export * as pack18 from "./pack18/index.js";
export * as pack20 from "./pack20/index.js";
export * as pack21 from "./pack21/index.js";
export * as pack22 from "./pack22/index.js";
export * as productionHardening from "./production-hardening/index.js";
export * as readiness from "./readiness/index.js";
export * as readinessSdk from "./readiness-sdk/index.js";
export * from "./retry/index.js";
export * from "./screenShare/index.js";
export * from "./security/index.js";
export * from "./socket/index.js";
export * from "./support/index.js";
export * from "./team/index.js";
export * from "./webrtc/index.js";
export * from "./remoteInput/index.js";
