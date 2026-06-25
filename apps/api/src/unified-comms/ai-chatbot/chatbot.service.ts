/**
 * AI Chatbot Service (First Line Support)
 * Handles common questions, diagnostics, escalation, and learning
 */

import { randomUUID } from 'node:crypto';

export interface ChatbotConfig {
  id: string;
  name: string;
  greeting: string;
  fallbackMessage: string;
  escalationThreshold: number;
  enabled: boolean;
  personality: string;
  knowledgeBaseIds: string[];
  maxAutoResolutionAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotIntent {
  id: string;
  name: string;
  patterns: string[];
  responses: string[];
  action: 'respond' | 'diagnose' | 'escalate' | 'create_ticket' | 'search_kb';
  confidence: number;
  enabled: boolean;
}

export interface ChatbotConversation {
  id: string;
  sessionId: string;
  contactId: string;
  messages: ChatbotMessage[];
  resolved: boolean;
  escalated: boolean;
  escalatedTo: string | null;
  intent: string | null;
  confidence: number;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ChatbotMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  content: string;
  intent: string | null;
  confidence: number;
  timestamp: string;
}

export interface ChatbotAnalytics {
  totalConversations: number;
  autoResolved: number;
  escalated: number;
  avgConfidence: number;
  topIntents: { intent: string; count: number }[];
  resolutionRate: number;
}

const configs = new Map<string, ChatbotConfig>();
const intents = new Map<string, ChatbotIntent>();
const botConversations = new Map<string, ChatbotConversation>();

// Default intents
const defaultIntents: ChatbotIntent[] = [
  { id: 'intent-password', name: 'password_reset', patterns: ['reset password', 'forgot password', 'change password', 'can\'t login', 'locked out'], responses: ['I can help you reset your password. Please go to Settings > Security > Reset Password, or I can send you a reset link to your registered email.'], action: 'respond', confidence: 0.9, enabled: true },
  { id: 'intent-slow-pc', name: 'slow_computer', patterns: ['pc is slow', 'computer slow', 'running slow', 'performance issue', 'laggy'], responses: ['I\'ll run a quick diagnostic on your system. This will check CPU usage, memory, disk space, and running processes. Would you like me to proceed?'], action: 'diagnose', confidence: 0.85, enabled: true },
  { id: 'intent-connect', name: 'connection_issue', patterns: ['can\'t connect', 'connection failed', 'no connection', 'disconnected', 'timeout'], responses: ['Let me check your connection status. Please verify: 1) Your internet is working, 2) The remote device is online, 3) Your firewall isn\'t blocking the connection. Would you like me to run a connectivity test?'], action: 'diagnose', confidence: 0.85, enabled: true },
  { id: 'intent-human', name: 'talk_to_human', patterns: ['talk to human', 'real person', 'agent please', 'speak to someone', 'transfer me'], responses: ['I understand you\'d like to speak with a human agent. Let me transfer you now with full context of our conversation.'], action: 'escalate', confidence: 0.95, enabled: true },
  { id: 'intent-pricing', name: 'pricing_inquiry', patterns: ['pricing', 'how much', 'cost', 'plans', 'subscription'], responses: ['Here are our plans: Starter ($9/mo), Professional ($29/mo), Enterprise (custom). Each includes remote desktop, file transfer, and chat. Would you like more details on any specific plan?'], action: 'respond', confidence: 0.9, enabled: true },
  { id: 'intent-install', name: 'installation_help', patterns: ['how to install', 'download', 'setup', 'installation', 'getting started'], responses: ['To install RemoteDesk: 1) Download from our website, 2) Run the installer, 3) Create an account or sign in, 4) Your device ID will appear on the main screen. Need help with a specific step?'], action: 'respond', confidence: 0.88, enabled: true },
  { id: 'intent-billing', name: 'billing_issue', patterns: ['billing', 'invoice', 'charge', 'payment', 'refund'], responses: ['I can help with billing questions. Let me look up your account. Could you provide your account email or subscription ID?'], action: 'search_kb', confidence: 0.85, enabled: true },
];
defaultIntents.forEach(i => intents.set(i.id, i));

const defaultConfig: ChatbotConfig = {
  id: 'bot-default',
  name: 'RemoteDesk AI Assistant',
  greeting: 'Hi! I\'m the RemoteDesk AI Assistant. I can help with technical issues, account questions, and more. How can I help you today?',
  fallbackMessage: 'I\'m not sure I understand. Could you rephrase that, or would you like me to connect you with a human agent?',
  escalationThreshold: 3,
  enabled: true,
  personality: 'friendly and professional',
  knowledgeBaseIds: [],
  maxAutoResolutionAttempts: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
configs.set(defaultConfig.id, defaultConfig);

export class ChatbotService {
  async getConfig(): Promise<ChatbotConfig> {
    return configs.get('bot-default') || defaultConfig;
  }

  async updateConfig(data: Partial<ChatbotConfig>): Promise<ChatbotConfig> {
    const config = configs.get('bot-default') || defaultConfig;
    Object.assign(config, data, { updatedAt: new Date().toISOString() });
    configs.set('bot-default', config);
    return config;
  }

  async getIntents(): Promise<ChatbotIntent[]> {
    return Array.from(intents.values());
  }

  async createIntent(data: Omit<ChatbotIntent, 'id'>): Promise<ChatbotIntent> {
    const intent: ChatbotIntent = { id: randomUUID(), ...data };
    intents.set(intent.id, intent);
    return intent;
  }

  async updateIntent(id: string, data: Partial<ChatbotIntent>): Promise<ChatbotIntent | null> {
    const intent = intents.get(id);
    if (!intent) return null;
    Object.assign(intent, data);
    intents.set(id, intent);
    return intent;
  }

  async deleteIntent(id: string): Promise<boolean> {
    return intents.delete(id);
  }

  private matchIntent(message: string): { intent: ChatbotIntent | null; confidence: number } {
    const lower = message.toLowerCase();
    let bestMatch: ChatbotIntent | null = null;
    let bestConfidence = 0;

    for (const intent of intents.values()) {
      if (!intent.enabled) continue;
      for (const pattern of intent.patterns) {
        if (lower.includes(pattern.toLowerCase())) {
          const confidence = intent.confidence;
          if (confidence > bestConfidence) {
            bestMatch = intent;
            bestConfidence = confidence;
          }
        }
      }
    }

    return { intent: bestMatch, confidence: bestConfidence };
  }

  async processMessage(sessionId: string, contactId: string, message: string): Promise<{ reply: string; intent: string | null; confidence: number; escalated: boolean; action: string }> {
    let conversation = Array.from(botConversations.values()).find(c => c.sessionId === sessionId && !c.resolved && !c.escalated);

    if (!conversation) {
      conversation = {
        id: randomUUID(),
        sessionId,
        contactId,
        messages: [],
        resolved: false,
        escalated: false,
        escalatedTo: null,
        intent: null,
        confidence: 0,
        createdAt: new Date().toISOString(),
        resolvedAt: null,
      };
      botConversations.set(conversation.id, conversation);
    }

    // Add user message
    conversation.messages.push({
      id: randomUUID(),
      role: 'user',
      content: message,
      intent: null,
      confidence: 0,
      timestamp: new Date().toISOString(),
    });

    // Match intent
    const { intent, confidence } = this.matchIntent(message);
    const config = await this.getConfig();

    let reply: string;
    let action = 'respond';
    let escalated = false;

    if (intent) {
      reply = intent.responses[Math.floor(Math.random() * intent.responses.length)];
      action = intent.action;
      conversation.intent = intent.name;
      conversation.confidence = confidence;

      if (intent.action === 'escalate') {
        escalated = true;
        conversation.escalated = true;
        conversation.escalatedTo = 'next-available-agent';
      }
    } else {
      // Check if we should escalate after multiple failed attempts
      const userMessages = conversation.messages.filter(m => m.role === 'user');
      if (userMessages.length >= config.escalationThreshold) {
        reply = 'It seems I\'m having trouble understanding your issue. Let me connect you with a human agent who can better assist you.';
        escalated = true;
        conversation.escalated = true;
        action = 'escalate';
      } else {
        reply = config.fallbackMessage;
      }
    }

    // Add bot reply
    conversation.messages.push({
      id: randomUUID(),
      role: 'bot',
      content: reply,
      intent: intent?.name || null,
      confidence,
      timestamp: new Date().toISOString(),
    });

    botConversations.set(conversation.id, conversation);

    return { reply, intent: intent?.name || null, confidence, escalated, action };
  }

  async getConversation(id: string): Promise<ChatbotConversation | null> {
    return botConversations.get(id) || null;
  }

  async getConversations(): Promise<ChatbotConversation[]> {
    return Array.from(botConversations.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async resolveConversation(id: string): Promise<ChatbotConversation | null> {
    const conv = botConversations.get(id);
    if (!conv) return null;
    conv.resolved = true;
    conv.resolvedAt = new Date().toISOString();
    botConversations.set(id, conv);
    return conv;
  }

  async getAnalytics(): Promise<ChatbotAnalytics> {
    const all = Array.from(botConversations.values());
    const autoResolved = all.filter(c => c.resolved && !c.escalated).length;
    const escalated = all.filter(c => c.escalated).length;
    const total = all.length || 1;

    const intentCounts: Record<string, number> = {};
    all.forEach(c => {
      if (c.intent) {
        intentCounts[c.intent] = (intentCounts[c.intent] || 0) + 1;
      }
    });

    const topIntents = Object.entries(intentCounts)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalConversations: all.length,
      autoResolved,
      escalated,
      avgConfidence: all.reduce((sum, c) => sum + c.confidence, 0) / total,
      topIntents,
      resolutionRate: (autoResolved / total) * 100,
    };
  }
}

export const chatbotService = new ChatbotService();
