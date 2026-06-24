import type { Server as HttpServer } from "node:http";
import { Server, type Socket } from "socket.io";
import {
  ClientEvents,
  ServerEvents,
  type ConnectRequestPayload,
  type SessionResponsePayload,
  type SignalPayload
} from "@remotedesk/shared";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { verifyPassword } from "../lib/password.js";
import { verifyAccessToken } from "../lib/tokens.js";
import { isBetaApiFeatureEnabled } from "../middleware/betaFeatureGate.js";
import { logger } from "../observability/safeLogger.js";

interface AuthedSocket extends Socket {
  data: {
    userId: string;
    email: string;
    remoteDeskId: string;
  };
}

function emitFeatureDisabled(socket: Socket, feature: string) {
  socket.emit(ServerEvents.Error, {
    error: "feature_disabled",
    feature,
    message: "This RemoteDesk beta capability is currently disabled by server policy."
  });
}

export function initSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.corsOrigin, credentials: true }
  });

  io.use(async (socket: Socket, next) => {
    try {
      if (!isBetaApiFeatureEnabled("socket_access")) {
        logger.warn("Socket connection rejected by beta feature gate", {
          event: "socket.feature_disabled",
          status: "rejected",
          feature: "socket_access"
        });
        return next(new Error("feature_disabled:socket_access"));
      }

      const token = socket.handshake.auth.token as string | undefined;
      if (!token) return next(new Error("Missing token"));
      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, remoteDeskId: true }
      });
      if (!user) return next(new Error("User not found"));
      socket.data = { userId: user.id, email: user.email, remoteDeskId: user.remoteDeskId };
      next();
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("feature_disabled:")) return next(error);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (rawSocket) => {
    const socket = rawSocket as AuthedSocket;
    await prisma.user.update({
      where: { id: socket.data.userId },
      data: { isOnline: true, socketId: socket.id, lastSeenAt: new Date() }
    });
    socket.join(`user:${socket.data.remoteDeskId}`);

    logger.info("Socket connected", {
      event: "socket.connected",
      status: "connected",
      userId: socket.data.userId,
      remoteDeskId: socket.data.remoteDeskId
    });

    socket.on(ClientEvents.ConnectRequest, async (payload: ConnectRequestPayload) => {
      const targetId = payload.targetRemoteDeskId.replace(/\s/g, "");
      const target = await prisma.user.findUnique({ where: { remoteDeskId: targetId } });
      if (!target?.socketId || !target.isOnline) {
        return socket.emit(ServerEvents.Error, { message: "Target is offline or not found" });
      }
      if (!target.devicePassword || !(await verifyPassword(payload.devicePassword, target.devicePassword))) {
        return socket.emit(ServerEvents.Error, { message: "Invalid device password" });
      }
      const session = await prisma.session.create({
        data: { hostId: target.id, clientId: socket.data.userId, status: "PENDING" }
      });
      io.to(target.socketId).emit(ServerEvents.IncomingRequest, {
        sessionId: session.id,
        requesterRemoteDeskId: socket.data.remoteDeskId,
        requesterSocketId: socket.id
      });
    });

    socket.on(ClientEvents.ConnectResponse, async (payload: SessionResponsePayload) => {
      await prisma.session.update({
        where: { id: payload.sessionId },
        data: { status: payload.accepted ? "ACTIVE" : "REJECTED", startedAt: payload.accepted ? new Date() : undefined }
      });
      io.to(payload.requesterSocketId).emit(
        payload.accepted ? ServerEvents.RequestAccepted : ServerEvents.RequestRejected,
        { sessionId: payload.sessionId, hostSocketId: socket.id }
      );
    });

    const relay = (event: string, payload: SignalPayload) => {
      if (!isBetaApiFeatureEnabled("signaling_access")) {
        logger.warn("WebRTC signaling blocked by beta feature gate", {
          event: "socket.signaling_disabled",
          status: "blocked",
          sessionId: payload.sessionId,
          feature: "signaling_access"
        });
        return emitFeatureDisabled(socket, "signaling_access");
      }

      io.to(payload.targetSocketId).emit(event, {
        sessionId: payload.sessionId,
        signal: payload.signal,
        fromSocketId: socket.id
      });
    };

    socket.on(ClientEvents.WebrtcOffer, (payload: SignalPayload) => relay(ServerEvents.WebrtcOffer, payload));
    socket.on(ClientEvents.WebrtcAnswer, (payload: SignalPayload) => relay(ServerEvents.WebrtcAnswer, payload));
    socket.on(ClientEvents.WebrtcIce, (payload: SignalPayload) => relay(ServerEvents.WebrtcIce, payload));

    socket.on(ClientEvents.SessionEnd, async ({ sessionId, peerSocketId }: { sessionId: string; peerSocketId?: string }) => {
      const session = await prisma.session.findUnique({ where: { id: sessionId } });
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          status: "ENDED",
          endedAt: new Date(),
          duration: session?.startedAt ? Math.floor((Date.now() - session.startedAt.getTime()) / 1000) : null
        }
      });
      if (peerSocketId) io.to(peerSocketId).emit(ServerEvents.PeerDisconnected, { sessionId });
    });

    socket.on("disconnect", async () => {
      await prisma.user.update({
        where: { id: socket.data.userId },
        data: { isOnline: false, socketId: null, lastSeenAt: new Date() }
      });
      socket.broadcast.emit(ServerEvents.PeerDisconnected, { remoteDeskId: socket.data.remoteDeskId });
      logger.info("Socket disconnected", {
        event: "socket.disconnected",
        status: "disconnected",
        userId: socket.data.userId,
        remoteDeskId: socket.data.remoteDeskId
      });
    });
  });

  return io;
}
