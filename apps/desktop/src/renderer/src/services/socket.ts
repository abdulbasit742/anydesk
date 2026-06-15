import { io, Socket } from "socket.io-client";
import { ClientEvents, ServerEvents, type IncomingRequestPayload } from "@shared/index";

interface SocketCallbacks {
  onIncoming: (payload: IncomingRequestPayload) => void;
  onAccepted: (payload: { sessionId: string; hostSocketId: string }) => void;
  onRejected: (payload: { sessionId: string }) => void;
  onOffer: (payload: { sessionId: string; signal: RTCSessionDescriptionInit; fromSocketId: string }) => void;
  onAnswer: (payload: { sessionId: string; signal: RTCSessionDescriptionInit; fromSocketId: string }) => void;
  onIce: (payload: { sessionId: string; signal: RTCIceCandidateInit; fromSocketId: string }) => void;
  onPeerDisconnected: (payload: { sessionId?: string; remoteDeskId?: string }) => void;
  onError: (message: string) => void;
}

export function createSocketClient(token: string, callbacks: SocketCallbacks) {
  const socket: Socket = io(import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000", {
    autoConnect: false,
    auth: { token }
  });

  socket.on(ServerEvents.IncomingRequest, callbacks.onIncoming);
  socket.on(ServerEvents.RequestAccepted, callbacks.onAccepted);
  socket.on(ServerEvents.RequestRejected, callbacks.onRejected);
  socket.on(ServerEvents.WebrtcOffer, callbacks.onOffer);
  socket.on(ServerEvents.WebrtcAnswer, callbacks.onAnswer);
  socket.on(ServerEvents.WebrtcIce, callbacks.onIce);
  socket.on(ServerEvents.PeerDisconnected, callbacks.onPeerDisconnected);
  socket.on(ServerEvents.Error, (payload: { message?: string }) => callbacks.onError(payload.message ?? "Socket error"));

  return {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    requestConnection: (targetRemoteDeskId: string, devicePassword: string) => {
      socket.emit(ClientEvents.ConnectRequest, { targetRemoteDeskId, devicePassword });
    },
    respondToConnection: (sessionId: string, accepted: boolean, requesterSocketId: string) => {
      socket.emit(ClientEvents.ConnectResponse, { sessionId, accepted, requesterSocketId });
    },
    sendOffer: (sessionId: string, targetSocketId: string, signal: unknown) => {
      socket.emit(ClientEvents.WebrtcOffer, { sessionId, targetSocketId, signal });
    },
    sendAnswer: (sessionId: string, targetSocketId: string, signal: unknown) => {
      socket.emit(ClientEvents.WebrtcAnswer, { sessionId, targetSocketId, signal });
    },
    sendIce: (sessionId: string, targetSocketId: string, signal: unknown) => {
      socket.emit(ClientEvents.WebrtcIce, { sessionId, targetSocketId, signal });
    },
    endSession: (sessionId: string, peerSocketId?: string) => {
      socket.emit(ClientEvents.SessionEnd, { sessionId, peerSocketId });
    },
    socket
  };
}
