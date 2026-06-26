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
import { E2EESignaling } from "../lib/e2ee.js";
import { ZeroTrustEngine } from "../lib/zeroTrustEngine.js";

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

    bindSafeSocketHandler<ConnectRequestPayload & { deviceId?: string, clientPublicKey?: string }>(socket, ClientEvents.ConnectRequest, async (payload) => {
      const targetId = payload.targetRemoteDeskId.replace(/\s/g, "");
      const target = await prisma.user.findUnique({ where: { remoteDeskId: targetId } });

      // Zero-Trust verification before allowing connection request
      if (payload.deviceId) {
        const accessCheck = await ZeroTrustEngine.evaluateAccess({
          userId: socket.data.userId,
          deviceId: payload.deviceId,
          ipAddress: socket.handshake.address,
          action: "SOCKET_CONNECT_REQUEST"
        });

        if (!accessCheck.allowed) {
          await ZeroTrustEngine.logSecurityEvent({
            userId: socket.data.userId, deviceId: payload.deviceId, ipAddress: socket.handshake.address, action: "SOCKET_CONNECT_DENIED", details: { reason: accessCheck.reason }
          }, accessCheck.riskScore);
          return socket.emit(ServerEvents.Error, { message: `Zero-Trust Policy Blocked Connection: ${accessCheck.reason}` });
        }
      }
      if (!target?.socketId || !target.isOnline) {
        return socket.emit(ServerEvents.Error, { message: "Target is offline or not found" });
      }
      if (!target.devicePassword || !(await verifyPassword(payload.devicePassword, target.devicePassword))) {
        return socket.emit(ServerEvents.Error, { message: "Invalid device password" });
      }
      const session = await prisma.session.create({
        data: { hostId: target.id, clientId: socket.data.userId, status: "PENDING" }
      });
      // E2EE Key Exchange Preparation
      const serverKeys = E2EESignaling.generateServerKeys();
      let signedClientKey: string | undefined;
      
      if (payload.clientPublicKey) {
        signedClientKey = E2EESignaling.signClientKey(payload.clientPublicKey, serverKeys.privateKey);
      }

      io.to(target.socketId).emit(ServerEvents.IncomingRequest, {
        sessionId: session.id,
        requesterRemoteDeskId: socket.data.remoteDeskId,
        requesterSocketId: socket.id,
        e2ee: {
          serverPublicKey: serverKeys.publicKey,
          requesterPublicKey: payload.clientPublicKey,
          requesterKeySignature: signedClientKey
        }
      });
    });

    bindSafeSocketHandler<SessionResponsePayload & { hostPublicKey?: string }>(socket, ClientEvents.ConnectResponse, async (payload) => {
      await prisma.session.update({
        where: { id: payload.sessionId },
        data: { status: payload.accepted ? "ACTIVE" : "REJECTED", startedAt: payload.accepted ? new Date() : undefined }
      });
      
      const responsePayload: any = { sessionId: payload.sessionId, hostSocketId: socket.id };
      
      if (payload.accepted && payload.hostPublicKey) {
        const serverKeys = E2EESignaling.generateServerKeys();
        responsePayload.e2ee = {
          hostPublicKey: payload.hostPublicKey,
          hostKeySignature: E2EESignaling.signClientKey(payload.hostPublicKey, serverKeys.privateKey)
        };
      }

      io.to(payload.requesterSocketId).emit(
        payload.accepted ? ServerEvents.RequestAccepted : ServerEvents.RequestRejected,
        responsePayload
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
    
    // --- Unified Communications Real-time Chat ---
    bindSafeSocketHandler<{ ticketId: string; body: string; isInternal?: boolean }>(socket, 'chat:message', async (payload) => {
      const message = await prisma.message.create({
        data: {
          ticketId: payload.ticketId,
          senderId: socket.data.userId,
          body: payload.body,
          isInternal: payload.isInternal || false,
        },
        include: { sender: { select: { fullName: true } } }
      });
      
      const ticket = await prisma.ticket.findUnique({ where: { id: payload.ticketId } });
      if (ticket) {
        // Notify both customer and assignee if they are online
        io.to(`user:${ticket.customerId}`).emit('chat:message', message);
        if (ticket.assignedToId) {
          io.to(`user:${ticket.assignedToId}`).emit('chat:message', message);
        }
      }
    });

    bindSafeSocketHandler<{ ticketId: string; isTyping: boolean }>(socket, 'chat:typing', async (payload) => {
      const ticket = await prisma.ticket.findUnique({ where: { id: payload.ticketId } });
      if (ticket) {
        const targetId = socket.data.userId === ticket.customerId ? ticket.assignedToId : ticket.customerId;
        if (targetId) {
          io.to(`user:${targetId}`).emit("chat:typing", { ticketId: payload.ticketId, userId: socket.data.userId, isTyping: payload.isTyping });
        }
      }
    });

    // --- Agent Collision Detection ---
    bindSafeSocketHandler<{ ticketId: string; agentId: string }>(socket, "ticket:viewing", async (payload) => {
      const ticket = await prisma.ticket.findUnique({ where: { id: payload.ticketId } });
      if (ticket && ticket.viewingAgentId && ticket.viewingAgentId !== payload.agentId) {
        // Notify the current viewing agent that another agent is also viewing
        io.to(`user:${ticket.viewingAgentId}`).emit("ticket:collision", { ticketId: payload.ticketId, collidingAgentId: payload.agentId });
      }
      await prisma.ticket.update({
        where: { id: payload.ticketId },
        data: { viewingAgentId: payload.agentId },
      });
    });

    bindSafeSocketHandler<{ ticketId: string }>(socket, "ticket:unviewing", async (payload) => {
      await prisma.ticket.update({
        where: { id: payload.ticketId },
        data: { viewingAgentId: null },
      });
    });

    // --- Internal Team Channels ---
    bindSafeSocketHandler<{ channelId: string; message: string }>(socket, "team:message", async (payload) => {
      const channel = await prisma.teamChannel.findUnique({ where: { id: payload.channelId }, include: { members: true } });
      if (channel) {
        for (const member of channel.members) {
          if (member.userId !== socket.data.userId) {
            io.to(`user:${member.userId}`).emit("team:message", { channelId: payload.channelId, senderId: socket.data.userId, message: payload.message });
          }
        }
      }
    });

    bindSafeSocketHandler<{ sessionId: string; peerSocketId?: string }>(socket, ClientEvents.SessionEnd, async ({ sessionId, peerSocketId }) => {
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

    bindSafeSocketHandler(socket, "disconnect", async () => {
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
