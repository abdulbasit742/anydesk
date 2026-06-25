/**
 * Omnichannel Inbox Service
 * Unified message handling across all channels
 */

import { randomUUID } from 'node:crypto';
import type {
  ChannelConfig, ChannelConfigDto, Conversation, ConversationStatus,
  Message, IncomingWebhookPayload, SendMessageDto, ChannelType
} from './omnichannel.types.js';
import { ticketService } from '../tickets/ticket.service.js';

const channels = new Map<string, ChannelConfig>();
const conversations = new Map<string, Conversation>();
const messages = new Map<string, Message[]>();

// Initialize default channels
const defaultChannels: ChannelConfig[] = [
  { id: 'ch-livechat', type: 'live_chat', name: 'Live Chat Widget', enabled: true, config: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ch-email', type: 'email', name: 'Email (SendGrid)', enabled: true, config: { provider: 'sendgrid' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ch-whatsapp', type: 'whatsapp', name: 'WhatsApp Business', enabled: true, config: { provider: 'twilio' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ch-telegram', type: 'telegram', name: 'Telegram Bot', enabled: true, config: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ch-sms', type: 'sms', name: 'SMS (Twilio)', enabled: true, config: { provider: 'twilio' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ch-facebook', type: 'facebook', name: 'Facebook Messenger', enabled: true, config: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ch-instagram', type: 'instagram', name: 'Instagram DMs', enabled: true, config: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ch-twitter', type: 'twitter', name: 'Twitter/X DMs', enabled: true, config: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ch-phone', type: 'phone', name: 'VoIP Phone', enabled: true, config: { provider: 'twilio' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

defaultChannels.forEach(ch => channels.set(ch.id, ch));

export class OmnichannelService {
  async getChannels(): Promise<ChannelConfig[]> {
    return Array.from(channels.values());
  }

  async getChannel(id: string): Promise<ChannelConfig | null> {
    return channels.get(id) || null;
  }

  async createChannel(dto: ChannelConfigDto): Promise<ChannelConfig> {
    const channel: ChannelConfig = {
      id: randomUUID(),
      type: dto.type,
      name: dto.name,
      enabled: dto.enabled !== false,
      config: dto.config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    channels.set(channel.id, channel);
    return channel;
  }

  async updateChannel(id: string, dto: Partial<ChannelConfigDto>): Promise<ChannelConfig | null> {
    const channel = channels.get(id);
    if (!channel) return null;
    if (dto.name !== undefined) channel.name = dto.name;
    if (dto.enabled !== undefined) channel.enabled = dto.enabled;
    if (dto.config !== undefined) channel.config = { ...channel.config, ...dto.config };
    channel.updatedAt = new Date().toISOString();
    channels.set(id, channel);
    return channel;
  }

  async handleIncomingMessage(payload: IncomingWebhookPayload): Promise<{ conversation: Conversation; message: Message }> {
    // Find or create conversation
    let conversation = Array.from(conversations.values()).find(
      c => c.contactEmail === payload.contactEmail && c.channel === payload.channel && c.status !== 'closed'
    );

    if (!conversation) {
      conversation = {
        id: randomUUID(),
        channel: payload.channel,
        channelConfigId: `ch-${payload.channel}`,
        status: 'active',
        contactId: randomUUID(),
        contactName: payload.contactName,
        contactEmail: payload.contactEmail || null,
        contactPhone: payload.contactPhone || null,
        contactAvatar: null,
        assigneeId: null,
        teamId: null,
        ticketId: null,
        subject: null,
        lastMessageAt: new Date().toISOString(),
        unreadCount: 1,
        metadata: payload.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      conversations.set(conversation.id, conversation);
      messages.set(conversation.id, []);

      // Auto-create ticket
      const ticket = await ticketService.createTicket({
        subject: `New ${payload.channel} conversation from ${payload.contactName}`,
        description: payload.message,
        channel: payload.channel as any,
        requesterId: conversation.contactId,
      });
      conversation.ticketId = ticket.id;
      conversations.set(conversation.id, conversation);
    } else {
      conversation.unreadCount++;
      conversation.lastMessageAt = new Date().toISOString();
      conversation.updatedAt = new Date().toISOString();
      conversations.set(conversation.id, conversation);
    }

    const message: Message = {
      id: randomUUID(),
      conversationId: conversation.id,
      senderId: conversation.contactId,
      senderType: 'customer',
      content: payload.message,
      contentType: 'text',
      attachments: payload.attachments || [],
      metadata: {},
      deliveredAt: new Date().toISOString(),
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    const convMessages = messages.get(conversation.id) || [];
    convMessages.push(message);
    messages.set(conversation.id, convMessages);

    return { conversation, message };
  }

  async sendMessage(agentId: string, dto: SendMessageDto): Promise<Message | null> {
    const conversation = conversations.get(dto.conversationId);
    if (!conversation) return null;

    const message: Message = {
      id: randomUUID(),
      conversationId: dto.conversationId,
      senderId: agentId,
      senderType: 'agent',
      content: dto.content,
      contentType: dto.contentType || 'text',
      attachments: [],
      metadata: {},
      deliveredAt: null,
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    const convMessages = messages.get(dto.conversationId) || [];
    convMessages.push(message);
    messages.set(dto.conversationId, convMessages);

    conversation.lastMessageAt = message.createdAt;
    conversation.updatedAt = message.createdAt;
    conversations.set(dto.conversationId, conversation);

    // Also add reply to linked ticket
    if (conversation.ticketId) {
      await ticketService.replyToTicket(conversation.ticketId, agentId, { body: dto.content });
    }

    return message;
  }

  async getConversations(filter?: { status?: ConversationStatus; channel?: ChannelType; assigneeId?: string }): Promise<Conversation[]> {
    let results = Array.from(conversations.values());
    if (filter?.status) results = results.filter(c => c.status === filter.status);
    if (filter?.channel) results = results.filter(c => c.channel === filter.channel);
    if (filter?.assigneeId) results = results.filter(c => c.assigneeId === filter.assigneeId);
    return results.sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return conversations.get(id) || null;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return messages.get(conversationId) || [];
  }

  async assignConversation(conversationId: string, agentId: string): Promise<Conversation | null> {
    const conversation = conversations.get(conversationId);
    if (!conversation) return null;
    conversation.assigneeId = agentId;
    conversation.updatedAt = new Date().toISOString();
    conversations.set(conversationId, conversation);
    return conversation;
  }

  async resolveConversation(conversationId: string): Promise<Conversation | null> {
    const conversation = conversations.get(conversationId);
    if (!conversation) return null;
    conversation.status = 'resolved';
    conversation.updatedAt = new Date().toISOString();
    conversations.set(conversationId, conversation);
    return conversation;
  }
}

export const omnichannelService = new OmnichannelService();
