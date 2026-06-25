/**
 * Live Chat Widget Service
 * Embeddable chat widget configuration and session management
 */

import { randomUUID } from 'node:crypto';

export interface WidgetConfig {
  id: string;
  organizationId: string;
  name: string;
  appearance: WidgetAppearance;
  preChatForm: PreChatFormConfig;
  behavior: WidgetBehavior;
  enabled: boolean;
  installCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface WidgetAppearance {
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  position: 'bottom-right' | 'bottom-left';
  avatarUrl: string | null;
  title: string;
  subtitle: string;
  welcomeMessage: string;
  offlineMessage: string;
  borderRadius: number;
  showBranding: boolean;
}

export interface PreChatFormConfig {
  enabled: boolean;
  fields: PreChatField[];
}

export interface PreChatField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface WidgetBehavior {
  autoOpen: boolean;
  autoOpenDelay: number;
  showTypingIndicator: boolean;
  showReadReceipts: boolean;
  enableFileSharing: boolean;
  enableEmojiReactions: boolean;
  enableScreenShareRequest: boolean;
  enableRemoteSessionEscalation: boolean;
  offlineMode: 'email_fallback' | 'hide' | 'show_message';
  maxFileSize: number;
  allowedFileTypes: string[];
}

export interface WidgetSession {
  id: string;
  widgetId: string;
  visitorId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  status: 'active' | 'ended';
  messages: WidgetMessage[];
  metadata: Record<string, unknown>;
  pageUrl: string | null;
  startedAt: string;
  endedAt: string | null;
}

export interface WidgetMessage {
  id: string;
  senderId: string;
  senderType: 'visitor' | 'agent' | 'bot';
  content: string;
  contentType: 'text' | 'file' | 'image' | 'system';
  reactions: string[];
  readAt: string | null;
  createdAt: string;
}

const widgets = new Map<string, WidgetConfig>();
const widgetSessions = new Map<string, WidgetSession>();

// Default widget
const defaultWidget: WidgetConfig = {
  id: 'widget-default',
  organizationId: 'org-default',
  name: 'Support Chat',
  appearance: {
    primaryColor: '#2563eb',
    textColor: '#ffffff',
    backgroundColor: '#ffffff',
    position: 'bottom-right',
    avatarUrl: null,
    title: 'Support Chat',
    subtitle: 'We typically reply within minutes',
    welcomeMessage: 'Hi there! 👋 How can we help you today?',
    offlineMessage: 'We\'re currently offline. Leave a message and we\'ll get back to you.',
    borderRadius: 12,
    showBranding: false,
  },
  preChatForm: {
    enabled: true,
    fields: [
      { name: 'name', label: 'Your Name', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'issue_type', label: 'Issue Type', type: 'select', required: false, options: ['Technical Issue', 'Billing', 'Feature Request', 'Other'] },
    ],
  },
  behavior: {
    autoOpen: false,
    autoOpenDelay: 30,
    showTypingIndicator: true,
    showReadReceipts: true,
    enableFileSharing: true,
    enableEmojiReactions: true,
    enableScreenShareRequest: true,
    enableRemoteSessionEscalation: true,
    offlineMode: 'email_fallback',
    maxFileSize: 10 * 1024 * 1024,
    allowedFileTypes: ['image/*', 'application/pdf', '.doc', '.docx', '.txt', '.zip'],
  },
  enabled: true,
  installCode: '<script src="https://cdn.remotedesk.io/widget.js" data-widget-id="widget-default"></script>',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
widgets.set(defaultWidget.id, defaultWidget);

export class WidgetService {
  async getWidgets(): Promise<WidgetConfig[]> {
    return Array.from(widgets.values());
  }

  async getWidget(id: string): Promise<WidgetConfig | null> {
    return widgets.get(id) || null;
  }

  async createWidget(data: Partial<WidgetConfig> & { organizationId: string; name: string }): Promise<WidgetConfig> {
    const id = randomUUID();
    const widget: WidgetConfig = {
      ...defaultWidget,
      ...data,
      id,
      installCode: `<script src="https://cdn.remotedesk.io/widget.js" data-widget-id="${id}"></script>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    widgets.set(id, widget);
    return widget;
  }

  async updateWidget(id: string, data: Partial<WidgetConfig>): Promise<WidgetConfig | null> {
    const widget = widgets.get(id);
    if (!widget) return null;
    if (data.appearance) widget.appearance = { ...widget.appearance, ...data.appearance };
    if (data.preChatForm) widget.preChatForm = { ...widget.preChatForm, ...data.preChatForm };
    if (data.behavior) widget.behavior = { ...widget.behavior, ...data.behavior };
    if (data.name) widget.name = data.name;
    if (data.enabled !== undefined) widget.enabled = data.enabled;
    widget.updatedAt = new Date().toISOString();
    widgets.set(id, widget);
    return widget;
  }

  // Widget Sessions
  async initializeSession(widgetId: string, data: { visitorId?: string; visitorName?: string; visitorEmail?: string; pageUrl?: string; metadata?: Record<string, unknown> }): Promise<WidgetSession> {
    const session: WidgetSession = {
      id: randomUUID(),
      widgetId,
      visitorId: data.visitorId || randomUUID(),
      visitorName: data.visitorName || null,
      visitorEmail: data.visitorEmail || null,
      status: 'active',
      messages: [],
      metadata: data.metadata || {},
      pageUrl: data.pageUrl || null,
      startedAt: new Date().toISOString(),
      endedAt: null,
    };
    widgetSessions.set(session.id, session);
    return session;
  }

  async sendWidgetMessage(sessionId: string, data: { senderId: string; senderType: 'visitor' | 'agent' | 'bot'; content: string; contentType?: string }): Promise<WidgetMessage | null> {
    const session = widgetSessions.get(sessionId);
    if (!session) return null;

    const message: WidgetMessage = {
      id: randomUUID(),
      senderId: data.senderId,
      senderType: data.senderType,
      content: data.content,
      contentType: (data.contentType as any) || 'text',
      reactions: [],
      readAt: null,
      createdAt: new Date().toISOString(),
    };
    session.messages.push(message);
    widgetSessions.set(sessionId, session);
    return message;
  }

  async getSession(id: string): Promise<WidgetSession | null> {
    return widgetSessions.get(id) || null;
  }

  async endSession(id: string): Promise<WidgetSession | null> {
    const session = widgetSessions.get(id);
    if (!session) return null;
    session.status = 'ended';
    session.endedAt = new Date().toISOString();
    widgetSessions.set(id, session);
    return session;
  }
}

export const widgetService = new WidgetService();
