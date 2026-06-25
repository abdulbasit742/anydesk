/**
 * Omnichannel Support Inbox Types
 */

export type ChannelType = 'live_chat' | 'email' | 'whatsapp' | 'telegram' | 'sms' | 'facebook' | 'instagram' | 'twitter' | 'phone' | 'web_form';

export type ConversationStatus = 'active' | 'waiting' | 'resolved' | 'closed';

export interface ChannelConfig {
  id: string;
  type: ChannelType;
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  channel: ChannelType;
  channelConfigId: string;
  status: ConversationStatus;
  contactId: string;
  contactName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAvatar: string | null;
  assigneeId: string | null;
  teamId: string | null;
  ticketId: string | null;
  subject: string | null;
  lastMessageAt: string;
  unreadCount: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'bot';
  content: string;
  contentType: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location' | 'template';
  attachments: MessageAttachment[];
  metadata: Record<string, unknown>;
  deliveredAt: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

export interface IncomingWebhookPayload {
  channel: ChannelType;
  externalId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  message: string;
  attachments?: MessageAttachment[];
  metadata?: Record<string, unknown>;
}

export interface SendMessageDto {
  conversationId: string;
  content: string;
  contentType?: 'text' | 'image' | 'file';
  attachments?: string[];
}

export interface ChannelConfigDto {
  type: ChannelType;
  name: string;
  enabled?: boolean;
  config: Record<string, unknown>;
}
