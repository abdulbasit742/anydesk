// ClaudeAdapter.js — Simulates session handshakes and conversational stream outputs
import { withSimulatedLatency } from '../emulator/NetworkLatencies.js';

export class ClaudeAdapter {
  constructor(credentials = {}) {
    this.sessionKey = credentials.sessionKey || credentials.apiKey || '';
    this.platform = 'claude';
    this.conversationId = null;
    this.messages = [];
  }

  async sendMessage(prompt, options = {}) {
    return withSimulatedLatency(this.platform, async () => {
      if (!this.conversationId) {
        this.conversationId = `conv_${Math.random().toString(36).slice(2, 12)}`;
      }

      this.messages.push({ role: 'user', content: prompt, ts: Date.now() });

      const responseLength = Math.floor(prompt.length * (1.5 + Math.random()));
      const mockResponse = `I understand your request regarding "${prompt.slice(0, 40)}...". Here's my analysis and implementation:\n\n[Detailed response with ${responseLength} characters of content...]`;

      this.messages.push({ role: 'assistant', content: mockResponse, ts: Date.now() });

      return {
        success: true,
        platform: 'claude',
        conversationId: this.conversationId,
        model: options.model || 'claude-sonnet-4-6',
        response: mockResponse,
        inputTokens: Math.ceil(prompt.length / 4),
        outputTokens: Math.ceil(mockResponse.length / 4),
        ts: Date.now(),
      };
    });
  }

  async streamMessage(prompt, onChunk) {
    const words = `Analyzing your request... Based on "${prompt.slice(0, 30)}...", I'll provide a comprehensive solution.`.split(' ');
    for (const word of words) {
      await new Promise(r => setTimeout(r, 50 + Math.random() * 80));
      onChunk(word + ' ');
    }
    return { conversationId: this.conversationId, done: true };
  }

  clearConversation() { this.messages = []; this.conversationId = null; }
  getMessages() { return [...this.messages]; }
  validateCredentials() {
    return { valid: this.sessionKey.length >= 20, errors: this.sessionKey.length < 20 ? ['Session key too short'] : [] };
  }
}
