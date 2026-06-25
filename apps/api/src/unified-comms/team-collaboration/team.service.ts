/**
 * Team Collaboration Service
 * Internal team chat, channels, mentions, shared inboxes, and escalation paths
 */

import { randomUUID } from 'node:crypto';

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  createdBy: string;
  pinned: boolean;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

export interface TeamMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  content: string;
  mentions: string[];
  reactions: Record<string, string[]>;
  threadId: string | null;
  replyCount: number;
  attachments: string[];
  edited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationPath {
  id: string;
  name: string;
  levels: EscalationLevel[];
  createdAt: string;
}

export interface EscalationLevel {
  level: number;
  name: string;
  teamId: string;
  responseTimeMinutes: number;
  autoEscalateAfterMinutes: number;
}

export interface SharedInbox {
  id: string;
  name: string;
  email: string;
  teamId: string;
  members: string[];
  createdAt: string;
}

const channels = new Map<string, ChatChannel>();
const teamMessages = new Map<string, TeamMessage[]>();
const escalationPaths = new Map<string, EscalationPath>();
const sharedInboxes = new Map<string, SharedInbox>();

// Default channels
const defaultChannels: ChatChannel[] = [
  { id: 'ch-general', name: 'general', description: 'General discussion', type: 'public', members: ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5'], createdBy: 'system', pinned: true, lastMessageAt: new Date().toISOString(), unreadCount: 0, createdAt: new Date().toISOString() },
  { id: 'ch-support', name: 'support-team', description: 'Support team channel', type: 'public', members: ['agent-1', 'agent-2', 'agent-3', 'agent-4'], createdBy: 'system', pinned: true, lastMessageAt: new Date().toISOString(), unreadCount: 0, createdAt: new Date().toISOString() },
  { id: 'ch-escalations', name: 'escalations', description: 'Escalated issues discussion', type: 'private', members: ['agent-4'], createdBy: 'system', pinned: false, lastMessageAt: null, unreadCount: 0, createdAt: new Date().toISOString() },
  { id: 'ch-announcements', name: 'announcements', description: 'Company announcements', type: 'public', members: ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5'], createdBy: 'system', pinned: true, lastMessageAt: null, unreadCount: 0, createdAt: new Date().toISOString() },
];
defaultChannels.forEach(c => { channels.set(c.id, c); teamMessages.set(c.id, []); });

// Default escalation path
const defaultEscalation: EscalationPath = {
  id: 'esc-default',
  name: 'Standard Escalation',
  levels: [
    { level: 1, name: 'L1 Support', teamId: 'team-support', responseTimeMinutes: 15, autoEscalateAfterMinutes: 60 },
    { level: 2, name: 'L2 Senior Support', teamId: 'team-escalation', responseTimeMinutes: 30, autoEscalateAfterMinutes: 120 },
    { level: 3, name: 'L3 Engineering', teamId: 'team-engineering', responseTimeMinutes: 60, autoEscalateAfterMinutes: 240 },
  ],
  createdAt: new Date().toISOString(),
};
escalationPaths.set(defaultEscalation.id, defaultEscalation);

export class TeamCollaborationService {
  // Channels
  async getChannels(userId?: string): Promise<ChatChannel[]> {
    let results = Array.from(channels.values());
    if (userId) results = results.filter(c => c.type === 'public' || c.members.includes(userId));
    return results.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  async createChannel(data: { name: string; description: string; type: 'public' | 'private' | 'direct'; members: string[]; createdBy: string }): Promise<ChatChannel> {
    const channel: ChatChannel = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      type: data.type,
      members: data.members,
      createdBy: data.createdBy,
      pinned: false,
      lastMessageAt: null,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };
    channels.set(channel.id, channel);
    teamMessages.set(channel.id, []);
    return channel;
  }

  async sendMessage(channelId: string, data: { senderId: string; senderName: string; content: string; threadId?: string }): Promise<TeamMessage | null> {
    const channel = channels.get(channelId);
    if (!channel) return null;

    // Extract mentions
    const mentions = (data.content.match(/@(\w+)/g) || []).map(m => m.substring(1));

    const message: TeamMessage = {
      id: randomUUID(),
      channelId,
      senderId: data.senderId,
      senderName: data.senderName,
      content: data.content,
      mentions,
      reactions: {},
      threadId: data.threadId || null,
      replyCount: 0,
      attachments: [],
      edited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const msgs = teamMessages.get(channelId) || [];
    msgs.push(message);
    teamMessages.set(channelId, msgs);

    channel.lastMessageAt = message.createdAt;
    channels.set(channelId, channel);

    return message;
  }

  async getMessages(channelId: string, limit?: number): Promise<TeamMessage[]> {
    const msgs = teamMessages.get(channelId) || [];
    return msgs.slice(-(limit || 50));
  }

  async addReaction(channelId: string, messageId: string, userId: string, emoji: string): Promise<boolean> {
    const msgs = teamMessages.get(channelId);
    if (!msgs) return false;
    const message = msgs.find(m => m.id === messageId);
    if (!message) return false;
    if (!message.reactions[emoji]) message.reactions[emoji] = [];
    if (!message.reactions[emoji].includes(userId)) {
      message.reactions[emoji].push(userId);
    }
    return true;
  }

  // Escalation Paths
  async getEscalationPaths(): Promise<EscalationPath[]> {
    return Array.from(escalationPaths.values());
  }

  async createEscalationPath(data: Omit<EscalationPath, 'id' | 'createdAt'>): Promise<EscalationPath> {
    const path: EscalationPath = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
    escalationPaths.set(path.id, path);
    return path;
  }

  // Shared Inboxes
  async getSharedInboxes(): Promise<SharedInbox[]> {
    return Array.from(sharedInboxes.values());
  }

  async createSharedInbox(data: Omit<SharedInbox, 'id' | 'createdAt'>): Promise<SharedInbox> {
    const inbox: SharedInbox = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
    sharedInboxes.set(inbox.id, inbox);
    return inbox;
  }
}

export const teamCollaborationService = new TeamCollaborationService();
