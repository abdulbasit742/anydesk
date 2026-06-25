/**
 * Real-time Socket.IO handlers for Unified Communications
 * Handles: typing indicators, presence, live chat, video signaling, notifications
 */

import type { Server, Socket } from 'socket.io';

export interface AgentPresence {
  agentId: string;
  status: 'available' | 'busy' | 'break' | 'offline';
  activeConversations: number;
  lastSeen: string;
}

const agentPresence = new Map<string, AgentPresence>();
const typingIndicators = new Map<string, Set<string>>();
const onlineUsers = new Map<string, string>(); // socketId -> userId

export function registerUnifiedCommsSocketHandlers(io: Server) {
  const ucNamespace = io.of('/unified-comms');

  ucNamespace.on('connection', (socket: Socket) => {
    const userId = socket.handshake.auth?.userId || socket.id;
    onlineUsers.set(socket.id, userId);

    // Agent presence
    socket.on('agent:status', (data: { agentId: string; status: string }) => {
      agentPresence.set(data.agentId, {
        agentId: data.agentId,
        status: data.status as any,
        activeConversations: 0,
        lastSeen: new Date().toISOString(),
      });
      ucNamespace.emit('agent:status:update', agentPresence.get(data.agentId));
    });

    // Join conversation room
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Typing indicators
    socket.on('typing:start', (data: { conversationId: string; userId: string; userName: string }) => {
      const key = data.conversationId;
      if (!typingIndicators.has(key)) typingIndicators.set(key, new Set());
      typingIndicators.get(key)!.add(data.userId);
      socket.to(`conversation:${data.conversationId}`).emit('typing:update', {
        conversationId: data.conversationId,
        userId: data.userId,
        userName: data.userName,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (data: { conversationId: string; userId: string }) => {
      const key = data.conversationId;
      typingIndicators.get(key)?.delete(data.userId);
      socket.to(`conversation:${data.conversationId}`).emit('typing:update', {
        conversationId: data.conversationId,
        userId: data.userId,
        isTyping: false,
      });
    });

    // New message notification
    socket.on('message:new', (data: { conversationId: string; message: any }) => {
      ucNamespace.to(`conversation:${data.conversationId}`).emit('message:received', data.message);
    });

    // Read receipts
    socket.on('message:read', (data: { conversationId: string; messageId: string; userId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('message:read:update', data);
    });

    // Video conferencing signaling
    socket.on('meeting:join', (meetingId: string) => {
      socket.join(`meeting:${meetingId}`);
      socket.to(`meeting:${meetingId}`).emit('meeting:participant:joined', { userId, socketId: socket.id });
    });

    socket.on('meeting:leave', (meetingId: string) => {
      socket.leave(`meeting:${meetingId}`);
      socket.to(`meeting:${meetingId}`).emit('meeting:participant:left', { userId, socketId: socket.id });
    });

    socket.on('meeting:signal', (data: { meetingId: string; targetSocketId: string; signal: any }) => {
      ucNamespace.to(data.targetSocketId).emit('meeting:signal', { from: socket.id, signal: data.signal });
    });

    socket.on('meeting:media:toggle', (data: { meetingId: string; media: string; enabled: boolean }) => {
      socket.to(`meeting:${data.meetingId}`).emit('meeting:media:update', { userId, ...data });
    });

    // Remote support signaling
    socket.on('remote-support:join', (sessionId: string) => {
      socket.join(`remote-support:${sessionId}`);
      socket.to(`remote-support:${sessionId}`).emit('remote-support:peer:joined', { userId, socketId: socket.id });
    });

    socket.on('remote-support:signal', (data: { sessionId: string; targetSocketId: string; signal: any }) => {
      ucNamespace.to(data.targetSocketId).emit('remote-support:signal', { from: socket.id, signal: data.signal });
    });

    // Team chat
    socket.on('team:channel:join', (channelId: string) => {
      socket.join(`team:${channelId}`);
    });

    socket.on('team:message:new', (data: { channelId: string; message: any }) => {
      ucNamespace.to(`team:${data.channelId}`).emit('team:message:received', data.message);
    });

    // Ticket notifications
    socket.on('ticket:subscribe', (ticketId: string) => {
      socket.join(`ticket:${ticketId}`);
    });

    socket.on('ticket:update', (data: { ticketId: string; update: any }) => {
      ucNamespace.to(`ticket:${data.ticketId}`).emit('ticket:updated', data.update);
    });

    // Collision detection (see if another agent is viewing same ticket)
    socket.on('ticket:viewing', (data: { ticketId: string; agentId: string; agentName: string }) => {
      socket.to(`ticket:${data.ticketId}`).emit('ticket:viewer:update', {
        ticketId: data.ticketId,
        agentId: data.agentId,
        agentName: data.agentName,
        viewing: true,
      });
    });

    socket.on('ticket:viewing:stop', (data: { ticketId: string; agentId: string }) => {
      socket.to(`ticket:${data.ticketId}`).emit('ticket:viewer:update', {
        ticketId: data.ticketId,
        agentId: data.agentId,
        viewing: false,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(socket.id);
      // Broadcast agent offline if applicable
      const presence = Array.from(agentPresence.values()).find(p => p.agentId === userId);
      if (presence) {
        presence.status = 'offline';
        presence.lastSeen = new Date().toISOString();
        ucNamespace.emit('agent:status:update', presence);
      }
    });
  });

  return ucNamespace;
}
