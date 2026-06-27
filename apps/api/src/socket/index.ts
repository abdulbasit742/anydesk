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
import {
  devFallbackGetUserById,
  devFallbackGetUserByRemoteDeskId,
  devFallbackVerifyDevicePassword,
  devFallbackLogSessionAudit
} from "../routes/devFallback.routes.js";
import { randomUUID } from "node:crypto";

const DEV_FALLBACK = process.env.DEV_IN_MEMORY_FALLBACK === "true";

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

function bindSafeSocketHandler<TPayload = unknown>(
  socket: Socket,
  socketEvent: string,
  handler: (payload: TPayload) => Promise<unknown> | unknown
) {
  socket.on(socketEvent, (payload: TPayload) => {
    void Promise.resolve(handler(payload)).catch((error) => {
      logger.error("Socket event handler failed", {
        event: "socket.event.error",
        status: "failed",
        socketEvent,
        socketId: socket.id,
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorMessage: error instanceof Error ? error.message : "Unknown socket event error"
      });
      socket.emit(ServerEvents.Error, {
        message: "Socket event failed",
        code: "SOCKET_EVENT_FAILED"
      });
    });
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
      let user: { id: string; email: string; remoteDeskId: string } | null = null;

      if (process.env.DEV_IN_MEMORY_FALLBACK === "true") {
        user = devFallbackGetUserById(payload.userId);
      } else {
        user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, email: true, remoteDeskId: true }
        });
      }

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

    if (!DEV_FALLBACK) {
      await prisma.user.update({
        where: { id: socket.data.userId },
        data: { isOnline: true, socketId: socket.id, lastSeenAt: new Date() }
      });
    }
    socket.join(`user:${socket.data.remoteDeskId}`);

    logger.info("Socket connected", {
      event: "socket.connected",
      status: "connected",
      userId: socket.data.userId,
      remoteDeskId: socket.data.remoteDeskId
    });

    bindSafeSocketHandler<ConnectRequestPayload>(socket, ClientEvents.ConnectRequest, async (payload) => {
      const targetId = payload.targetRemoteDeskId.replace(/\s/g, "");

      let targetSocketId: string | null = null;

      if (DEV_FALLBACK) {
        const targetUser = devFallbackGetUserByRemoteDeskId(targetId);
        if (!targetUser) {
          return socket.emit(ServerEvents.Error, { message: "Target is offline or not found" });
        }
        // Verify device password only if one is set
        if (targetUser.devicePassword && !devFallbackVerifyDevicePassword(targetId, payload.devicePassword ?? "")) {
          devFallbackLogSessionAudit(socket.data.userId, {
            sessionId: null,
            actorRemoteDeskId: socket.data.remoteDeskId,
            type: "session.password_failed",
            message: `Failed password attempt targeting ${targetId}`,
            metadata: { targetRemoteDeskId: targetId }
          });
          return socket.emit(ServerEvents.Error, { message: "Invalid device password" });
        }
        const room = io.sockets.adapter.rooms.get(`user:${targetId}`);
        targetSocketId = room ? [...room][0] ?? null : null;
        if (!targetSocketId) {
          return socket.emit(ServerEvents.Error, { message: "Target is offline or not found" });
        }
        const sessionId = randomUUID();
        devFallbackLogSessionAudit(socket.data.userId, {
          sessionId,
          actorRemoteDeskId: socket.data.remoteDeskId,
          type: "session.requested",
          message: `Session requested from ${socket.data.remoteDeskId} to ${targetId}`,
          metadata: { targetRemoteDeskId: targetId }
        });
        devFallbackLogSessionAudit(targetUser.id, {
          sessionId,
          actorRemoteDeskId: socket.data.remoteDeskId,
          type: "session.incoming",
          message: `Incoming session request from ${socket.data.remoteDeskId}`,
          metadata: { requesterRemoteDeskId: socket.data.remoteDeskId }
        });
        io.to(targetSocketId).emit(ServerEvents.IncomingRequest, {
          sessionId,
          requesterRemoteDeskId: socket.data.remoteDeskId,
          requesterSocketId: socket.id
        });
        return;
      }

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

    bindSafeSocketHandler<SessionResponsePayload>(socket, ClientEvents.ConnectResponse, async (payload) => {
      if (!DEV_FALLBACK) {
        await prisma.session.update({
          where: { id: payload.sessionId },
          data: { status: payload.accepted ? "ACTIVE" : "REJECTED", startedAt: payload.accepted ? new Date() : undefined }
        });
      } else {
        devFallbackLogSessionAudit(socket.data.userId, {
          sessionId: payload.sessionId,
          actorRemoteDeskId: socket.data.remoteDeskId,
          type: payload.accepted ? "session.accepted" : "session.rejected",
          message: payload.accepted ? "Session accepted by host" : "Session rejected by host",
          metadata: { requesterSocketId: payload.requesterSocketId }
        });
      }
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

    bindSafeSocketHandler<SignalPayload>(socket, ClientEvents.WebrtcOffer, (payload) => relay(ServerEvents.WebrtcOffer, payload));
    bindSafeSocketHandler<SignalPayload>(socket, ClientEvents.WebrtcAnswer, (payload) => relay(ServerEvents.WebrtcAnswer, payload));
    bindSafeSocketHandler<SignalPayload>(socket, ClientEvents.WebrtcIce, (payload) => relay(ServerEvents.WebrtcIce, payload));

    bindSafeSocketHandler<{ sessionId: string; peerSocketId?: string }>(socket, ClientEvents.SessionEnd, async ({ sessionId, peerSocketId }) => {
      if (!DEV_FALLBACK) {
        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        await prisma.session.update({
          where: { id: sessionId },
          data: {
            status: "ENDED",
            endedAt: new Date(),
            duration: session?.startedAt ? Math.floor((Date.now() - session.startedAt.getTime()) / 1000) : null
          }
        });
      } else {
        devFallbackLogSessionAudit(socket.data.userId, {
          sessionId,
          actorRemoteDeskId: socket.data.remoteDeskId,
          type: "session.ended",
          message: "Session ended",
          metadata: null
        });
      }
      if (peerSocketId) io.to(peerSocketId).emit(ServerEvents.PeerDisconnected, { sessionId });
    });

    bindSafeSocketHandler(socket, "disconnect", async () => {
      if (!DEV_FALLBACK) {
        await prisma.user.update({
          where: { id: socket.data.userId },
          data: { isOnline: false, socketId: null, lastSeenAt: new Date() }
        });
      }
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
