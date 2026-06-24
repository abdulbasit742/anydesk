import type { Prisma } from "@prisma/client";
import type { Server, Socket } from "socket.io";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const events = {
  deviceJoin: "device:join",
  deviceJoined: "device:joined",
  deviceOnline: "device:online",
  deviceOffline: "device:offline",
  sessionRequest: "session:request",
  sessionRequested: "session:requested",
  sessionJoin: "session:join",
  sessionJoined: "session:joined",
  sessionLeave: "session:leave",
  sessionPeerJoined: "session:peer_joined",
  sessionPeerLeft: "session:peer_left",
  sessionAccepted: "session:accepted",
  sessionDenied: "session:denied",
  sessionEnded: "session:ended",
  sessionEmergencyStop: "session:emergency_stop",
  webrtcOffer: "webrtc:offer",
  webrtcAnswer: "webrtc:answer",
  webrtcIceCandidate: "webrtc:ice_candidate",
  webrtcConnectionState: "webrtc:connection_state",
  webrtcError: "webrtc:error",
  error: "error"
} as const;

interface AuthedSocket extends Socket {
  data: {
    userId: string;
    email: string;
    remoteDeskId: string;
  };
}

const sessionInclude = {
  host: { select: { id: true, email: true, fullName: true, remoteDeskId: true } },
  client: { select: { id: true, email: true, fullName: true, remoteDeskId: true } }
} as const;

type SessionWithUsers = Prisma.SessionGetPayload<{ include: typeof sessionInclude }>;

const deviceJoinSchema = z.object({ deviceId: z.string().uuid() });
const sessionJoinSchema = z.object({ sessionId: z.string().uuid(), role: z.enum(["host", "viewer", "observer"]).optional(), deviceId: z.string().uuid().optional() });
const sessionRequestSchema = z.object({ deviceId: z.string().uuid(), reason: z.string().max(500).optional(), permissions: z.array(z.string()).optional(), mode: z.literal("view-only").optional() });
const sessionDecisionSchema = z.object({ sessionId: z.string().uuid(), reason: z.string().max(500).optional() });
const signalSchema = z.object({ sessionId: z.string().uuid(), targetSocketId: z.string().optional() }).passthrough();

function roomForSession(sessionId: string) { return `session:${sessionId}`; }
function roomForDevice(deviceId: string) { return `device:${deviceId}`; }
function roomForUser(userId: string) { return `user:${userId}`; }
function roomForRemoteDeskId(remoteDeskId: string) { return `remoteDesk:${remoteDeskId}`; }

function emitSocketError(socket: Socket, message: string, code = "SOCKET_ERROR", details?: unknown) {
  const body = { message, code, details, createdAt: new Date().toISOString() };
  socket.emit(events.error, body);
  socket.emit(events.webrtcError, body);
}

function isParticipant(session: SessionWithUsers, userId: string) {
  return session.hostId === userId || session.clientId === userId;
}

async function getVisibleSession(sessionId: string, userId: string) {
  return prisma.session.findFirst({
    where: { id: sessionId, OR: [{ hostId: userId }, { clientId: userId }] },
    include: sessionInclude
  });
}

function statusToApi(status: string) {
  switch (status) {
    case "PENDING": return "pending";
    case "ACTIVE": return "connected";
    case "REJECTED": return "denied";
    case "ENDED": return "ended";
    case "FAILED": return "failed";
    default: return status.toLowerCase();
  }
}

function serializeSession(session: SessionWithUsers, deviceId?: string | null, deviceName?: string | null) {
  return {
    id: session.id,
    hostId: session.hostId,
    host_id: session.hostId,
    clientId: session.clientId,
    client_id: session.clientId,
    deviceId: deviceId ?? null,
    device_id: deviceId ?? null,
    targetName: deviceName ?? session.host.fullName,
    target_name: deviceName ?? session.host.fullName,
    status: statusToApi(session.status),
    rawStatus: session.status,
    permissions: ["view-only"],
    mode: "view-only",
    startedAt: session.startedAt,
    started_at: session.startedAt,
    endedAt: session.endedAt,
    ended_at: session.endedAt,
    durationSeconds: session.duration,
    duration_seconds: session.duration,
    createdAt: session.createdAt,
    created_at: session.createdAt,
    host: session.host,
    client: session.client
  };
}

async function writeAudit(deviceId: string, actorUserId: string, type: string, message: string, metadata: Record<string, unknown> = {}) {
  await prisma.deviceAuditEvent.create({ data: { deviceId, actorUserId, type, message, metadata } }).catch(() => null);
}

export function registerWebRtcSignaling(io: Server, socket: AuthedSocket) {
  socket.join(roomForUser(socket.data.userId));
  socket.join(roomForRemoteDeskId(socket.data.remoteDeskId));

  socket.on(events.deviceJoin, async (rawPayload) => {
    const parsed = deviceJoinSchema.safeParse(rawPayload);
    if (!parsed.success) return emitSocketError(socket, "Invalid device join payload", "INVALID_DEVICE_JOIN", parsed.error.flatten());

    const device = await prisma.device.findFirst({ where: { id: parsed.data.deviceId, userId: socket.data.userId } });
    if (!device) return emitSocketError(socket, "Device not found or not owned by this user", "DEVICE_NOT_FOUND");

    socket.join(roomForDevice(device.id));
    const updated = await prisma.device.update({ where: { id: device.id }, data: { isOnline: true, lastSeenAt: new Date() } });
    const body = { deviceId: updated.id, status: "online", socketId: socket.id, userId: socket.data.userId, createdAt: new Date().toISOString() };
    socket.emit(events.deviceJoined, body);
    io.to(roomForUser(socket.data.userId)).emit(events.deviceOnline, body);
  });

  socket.on(events.sessionRequest, async (rawPayload) => {
    const parsed = sessionRequestSchema.safeParse(rawPayload);
    if (!parsed.success) return emitSocketError(socket, "Invalid session request payload", "INVALID_SESSION_REQUEST", parsed.error.flatten());

    const device = await prisma.device.findUnique({ where: { id: parsed.data.deviceId } });
    if (!device) return emitSocketError(socket, "Target device not found", "DEVICE_NOT_FOUND");

    const session = await prisma.session.create({
      data: { hostId: device.userId, clientId: socket.data.userId, status: "PENDING" },
      include: sessionInclude
    });
    const body = { ...serializeSession(session, device.id, device.name), reason: parsed.data.reason ?? null, requesterSocketId: socket.id };

    socket.join(roomForSession(session.id));
    await writeAudit(device.id, socket.data.userId, "session.socket.requested", "View-only session requested over Socket.IO", { sessionId: session.id, reason: parsed.data.reason ?? null });

    io.to(roomForUser(device.userId)).emit(events.sessionRequested, body);
    io.to(roomForDevice(device.id)).emit(events.sessionRequested, body);
    socket.emit(events.sessionRequested, body);
  });

  socket.on(events.sessionJoin, async (rawPayload) => {
    const parsed = sessionJoinSchema.safeParse(rawPayload);
    if (!parsed.success) return emitSocketError(socket, "Invalid session join payload", "INVALID_SESSION_JOIN", parsed.error.flatten());

    const session = await getVisibleSession(parsed.data.sessionId, socket.data.userId);
    if (!session || !isParticipant(session, socket.data.userId)) return emitSocketError(socket, "Session not found", "SESSION_NOT_FOUND");

    const room = roomForSession(session.id);
    socket.join(room);
    socket.emit(events.sessionJoined, { sessionId: session.id, socketId: socket.id, role: parsed.data.role ?? (session.hostId === socket.data.userId ? "host" : "viewer") });
    socket.to(room).emit(events.sessionPeerJoined, { sessionId: session.id, socketId: socket.id, userId: socket.data.userId, role: parsed.data.role ?? "viewer" });
  });

  socket.on(events.sessionLeave, async (rawPayload) => {
    const parsed = sessionJoinSchema.pick({ sessionId: true }).safeParse(rawPayload);
    if (!parsed.success) return emitSocketError(socket, "Invalid session leave payload", "INVALID_SESSION_LEAVE", parsed.error.flatten());
    const room = roomForSession(parsed.data.sessionId);
    socket.leave(room);
    socket.to(room).emit(events.sessionPeerLeft, { sessionId: parsed.data.sessionId, socketId: socket.id, userId: socket.data.userId });
  });

  socket.on(events.sessionAccepted, async (rawPayload) => {
    const parsed = sessionDecisionSchema.safeParse(rawPayload);
    if (!parsed.success) return emitSocketError(socket, "Invalid session accept payload", "INVALID_SESSION_ACCEPT", parsed.error.flatten());

    const session = await getVisibleSession(parsed.data.sessionId, socket.data.userId);
    if (!session) return emitSocketError(socket, "Session not found", "SESSION_NOT_FOUND");
    if (session.hostId !== socket.data.userId) return emitSocketError(socket, "Only the host can accept this session", "SESSION_FORBIDDEN");

    const updated = await prisma.session.update({ where: { id: session.id }, data: { status: "ACTIVE", startedAt: new Date() }, include: sessionInclude });
    const body = serializeSession(updated);
    socket.join(roomForSession(session.id));
    io.to(roomForSession(session.id)).emit(events.sessionAccepted, body);
    io.to(roomForUser(updated.clientId)).emit(events.sessionAccepted, body);
  });

  socket.on(events.sessionDenied, async (rawPayload) => {
    const parsed = sessionDecisionSchema.safeParse(rawPayload);
    if (!parsed.success) return emitSocketError(socket, "Invalid session deny payload", "INVALID_SESSION_DENY", parsed.error.flatten());
    const session = await getVisibleSession(parsed.data.sessionId, socket.data.userId);
    if (!session) return emitSocketError(socket, "Session not found", "SESSION_NOT_FOUND");
    if (session.hostId !== socket.data.userId) return emitSocketError(socket, "Only the host can deny this session", "SESSION_FORBIDDEN");

    const updated = await prisma.session.update({ where: { id: session.id }, data: { status: "REJECTED", endedAt: new Date() }, include: sessionInclude });
    const body = { ...serializeSession(updated), reason: parsed.data.reason ?? null };
    io.to(roomForSession(session.id)).emit(events.sessionDenied, body);
    io.to(roomForUser(updated.clientId)).emit(events.sessionDenied, body);
  });

  async function endSession(rawPayload: unknown, emergency = false) {
    const parsed = sessionDecisionSchema.safeParse(rawPayload);
    if (!parsed.success) return emitSocketError(socket, "Invalid session end payload", "INVALID_SESSION_END", parsed.error.flatten());
    const session = await getVisibleSession(parsed.data.sessionId, socket.data.userId);
    if (!session) return emitSocketError(socket, "Session not found", "SESSION_NOT_FOUND");

    const duration = session.startedAt ? Math.max(0, Math.floor((Date.now() - session.startedAt.getTime()) / 1000)) : null;
    const updated = await prisma.session.update({ where: { id: session.id }, data: { status: emergency ? "FAILED" : "ENDED", endedAt: new Date(), duration }, include: sessionInclude });
    const body = { ...serializeSession(updated), reason: parsed.data.reason ?? (emergency ? "emergency_stop" : "ended") };
    io.to(roomForSession(session.id)).emit(emergency ? events.sessionEmergencyStop : events.sessionEnded, body);
    io.to(roomForUser(updated.hostId)).emit(emergency ? events.sessionEmergencyStop : events.sessionEnded, body);
    io.to(roomForUser(updated.clientId)).emit(emergency ? events.sessionEmergencyStop : events.sessionEnded, body);
  }

  socket.on(events.sessionEnded, (payload) => void endSession(payload, false));
  socket.on(events.sessionEmergencyStop, (payload) => void endSession(payload, true));

  async function relayWebRtc(eventName: string, rawPayload: unknown) {
    const parsed = signalSchema.safeParse(rawPayload);
    if (!parsed.success) return emitSocketError(socket, "Invalid WebRTC signal payload", "INVALID_WEBRTC_SIGNAL", parsed.error.flatten());
    const session = await getVisibleSession(parsed.data.sessionId, socket.data.userId);
    if (!session) return emitSocketError(socket, "Session not found", "SESSION_NOT_FOUND");
    if (session.status !== "ACTIVE") return emitSocketError(socket, "WebRTC signaling is allowed only after host acceptance", "SESSION_NOT_ACCEPTED");

    const envelope = { ...(rawPayload as Record<string, unknown>), fromSocketId: socket.id, fromUserId: socket.data.userId, createdAt: new Date().toISOString() };
    if (parsed.data.targetSocketId) io.to(parsed.data.targetSocketId).emit(eventName, envelope);
    else socket.to(roomForSession(session.id)).emit(eventName, envelope);
  }

  socket.on(events.webrtcOffer, (payload) => void relayWebRtc(events.webrtcOffer, payload));
  socket.on(events.webrtcAnswer, (payload) => void relayWebRtc(events.webrtcAnswer, payload));
  socket.on(events.webrtcIceCandidate, (payload) => void relayWebRtc(events.webrtcIceCandidate, payload));
  socket.on(events.webrtcConnectionState, (payload) => void relayWebRtc(events.webrtcConnectionState, payload));
}
