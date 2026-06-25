/**
 * Remote Support Integration Service
 * Browser-based remote support sessions (WebRTC, no install needed)
 */

import { randomUUID } from 'node:crypto';

export type RemoteSupportStatus = 'pending' | 'connecting' | 'active' | 'paused' | 'ended';

export interface RemoteSupportSession {
  id: string;
  ticketId: string | null;
  conversationId: string | null;
  agentId: string;
  agentName: string;
  customerId: string;
  customerName: string;
  status: RemoteSupportStatus;
  sessionCode: string;
  joinUrl: string;
  viewOnly: boolean;
  recordingEnabled: boolean;
  recordingUrl: string | null;
  startedAt: string | null;
  endedAt: string | null;
  duration: number;
  notes: string[];
  events: SessionEvent[];
  createdAt: string;
}

export interface SessionEvent {
  id: string;
  type: 'connected' | 'disconnected' | 'screen_shared' | 'control_granted' | 'control_revoked' | 'file_transferred' | 'note_added';
  description: string;
  timestamp: string;
}

const sessions = new Map<string, RemoteSupportSession>();

function generateSessionCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export class RemoteSupportService {
  async createSession(data: {
    agentId: string;
    agentName: string;
    customerId: string;
    customerName: string;
    ticketId?: string;
    conversationId?: string;
    viewOnly?: boolean;
    recordingEnabled?: boolean;
  }): Promise<RemoteSupportSession> {
    const sessionCode = generateSessionCode();
    const session: RemoteSupportSession = {
      id: randomUUID(),
      ticketId: data.ticketId || null,
      conversationId: data.conversationId || null,
      agentId: data.agentId,
      agentName: data.agentName,
      customerId: data.customerId,
      customerName: data.customerName,
      status: 'pending',
      sessionCode,
      joinUrl: `/remote-support/join/${sessionCode}`,
      viewOnly: data.viewOnly || false,
      recordingEnabled: data.recordingEnabled !== false,
      recordingUrl: null,
      startedAt: null,
      endedAt: null,
      duration: 0,
      notes: [],
      events: [{
        id: randomUUID(),
        type: 'connected',
        description: 'Session created, waiting for customer to join',
        timestamp: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
    };
    sessions.set(session.id, session);
    return session;
  }

  async getSession(id: string): Promise<RemoteSupportSession | null> {
    return sessions.get(id) || null;
  }

  async getSessionByCode(code: string): Promise<RemoteSupportSession | null> {
    return Array.from(sessions.values()).find(s => s.sessionCode === code) || null;
  }

  async listSessions(filter?: { agentId?: string; status?: RemoteSupportStatus; ticketId?: string }): Promise<RemoteSupportSession[]> {
    let results = Array.from(sessions.values());
    if (filter?.agentId) results = results.filter(s => s.agentId === filter.agentId);
    if (filter?.status) results = results.filter(s => s.status === filter.status);
    if (filter?.ticketId) results = results.filter(s => s.ticketId === filter.ticketId);
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async customerJoin(sessionCode: string): Promise<RemoteSupportSession | null> {
    const session = Array.from(sessions.values()).find(s => s.sessionCode === sessionCode);
    if (!session || session.status === 'ended') return null;

    session.status = 'active';
    session.startedAt = new Date().toISOString();
    session.events.push({
      id: randomUUID(),
      type: 'connected',
      description: 'Customer connected to session',
      timestamp: new Date().toISOString(),
    });
    sessions.set(session.id, session);
    return session;
  }

  async grantControl(sessionId: string): Promise<RemoteSupportSession | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;
    session.viewOnly = false;
    session.events.push({
      id: randomUUID(),
      type: 'control_granted',
      description: 'Remote control granted to agent',
      timestamp: new Date().toISOString(),
    });
    sessions.set(sessionId, session);
    return session;
  }

  async revokeControl(sessionId: string): Promise<RemoteSupportSession | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;
    session.viewOnly = true;
    session.events.push({
      id: randomUUID(),
      type: 'control_revoked',
      description: 'Remote control revoked',
      timestamp: new Date().toISOString(),
    });
    sessions.set(sessionId, session);
    return session;
  }

  async endSession(sessionId: string): Promise<RemoteSupportSession | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;
    session.status = 'ended';
    session.endedAt = new Date().toISOString();
    if (session.startedAt) {
      session.duration = Math.floor((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000);
    }
    if (session.recordingEnabled) {
      session.recordingUrl = `/recordings/remote-support/${session.id}.mp4`;
    }
    session.events.push({
      id: randomUUID(),
      type: 'disconnected',
      description: 'Session ended',
      timestamp: new Date().toISOString(),
    });
    sessions.set(sessionId, session);
    return session;
  }

  async addNote(sessionId: string, note: string): Promise<RemoteSupportSession | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;
    session.notes.push(note);
    session.events.push({
      id: randomUUID(),
      type: 'note_added',
      description: `Note: ${note.substring(0, 50)}...`,
      timestamp: new Date().toISOString(),
    });
    sessions.set(sessionId, session);
    return session;
  }
}

export const remoteSupportService = new RemoteSupportService();
