// src/services/claude.js
// ClaudeService — Anthropic Claude integration
// Bolt Studio Pro

import { BaseService } from './base.js';

const CLAUDE_MODELS = {
  'claude-3-opus-20240229':   { contextWindow: 200000, cost: { input: 15,  output: 75  }, label: 'Claude 3 Opus'   },
  'claude-3-sonnet-20240229': { contextWindow: 200000, cost: { input: 3,   output: 15  }, label: 'Claude 3 Sonnet' },
  'claude-3-haiku-20240307':  { contextWindow: 200000, cost: { input: 0.25,output: 1.25}, label: 'Claude 3 Haiku'  },
  'claude-opus-4-5':          { contextWindow: 200000, cost: { input: 15,  output: 75  }, label: 'Claude Opus 4.5' },
};

const DEFAULT_MODEL = 'claude-3-sonnet-20240229';

function estimateTokens(text) {
  // Rough approximation: ~4 chars per token
  return Math.ceil(text.length / 4);
}

export class ClaudeService extends BaseService {
  constructor(credential) {
    super('Claude', {
      baseUrl: 'https://api.anthropic.com/v1',
      ...credential,
    });

    this._totalTokensUsed = 0;
  }

  // ─── Complete ────────────────────────────────────────────────────────────────

  async complete(messages, model = DEFAULT_MODEL) {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw Object.assign(new Error('ClaudeService: messages must be a non-empty array'), { code: 'INVALID_INPUT' });
    }
    if (!CLAUDE_MODELS[model]) {
      throw Object.assign(
        new Error(`ClaudeService: unknown model "${model}". Valid: ${Object.keys(CLAUDE_MODELS).join(', ')}`),
        { code: 'INVALID_MODEL' }
      );
    }

    const inputTokens  = messages.reduce((s, m) => s + estimateTokens(m.content || ''), 0);
    const outputTokens = Math.floor(inputTokens * 0.8 + Math.random() * 200);
    this._totalTokensUsed += inputTokens + outputTokens;

    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

    const res = await this.request('/messages', {
      method: 'POST',
      body:   JSON.stringify({
        model,
        max_tokens: 4096,
        messages,
      }),
      _mockData: {
        id:   `msg_${Date.now()}`,
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: `[${CLAUDE_MODELS[model].label}] I've analysed your request: "${lastUserMessage.slice(0, 80)}..."\n\nHere is a comprehensive response with detailed reasoning and code examples as appropriate.`,
          },
        ],
        model,
        stop_reason:     'end_turn',
        stop_sequence:   null,
        usage: {
          input_tokens:  inputTokens,
          output_tokens: outputTokens,
        },
      },
    });

    return res.data;
  }

  // ─── Stream Complete ──────────────────────────────────────────────────────────

  async streamComplete(messages, cb, model = DEFAULT_MODEL) {
    if (typeof cb !== 'function') {
      throw Object.assign(new Error('ClaudeService: cb (callback) must be a function'), { code: 'INVALID_INPUT' });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      throw Object.assign(new Error('ClaudeService: messages must be a non-empty array'), { code: 'INVALID_INPUT' });
    }

    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || 'your prompt';
    const fullResponse = `[${CLAUDE_MODELS[model]?.label || model}] Streaming response for: "${lastUserMessage.slice(0, 50)}..." — Here is a detailed, token-by-token streamed answer to your question. This simulates the real SSE event stream from the Anthropic API.`;

    const words = fullResponse.split(' ');
    let accumulated = '';

    return new Promise((resolve) => {
      let i = 0;
      const intervalMs = 40 + Math.random() * 30;

      const tick = setInterval(() => {
        if (i >= words.length) {
          clearInterval(tick);
          cb({ type: 'done', text: accumulated, delta: '' });
          resolve({ text: accumulated, model, tokensUsed: estimateTokens(accumulated) });
          return;
        }

        const chunk = (i === 0 ? '' : ' ') + words[i];
        accumulated += chunk;
        i++;

        cb({
          type:  'delta',
          delta: chunk,
          text:  accumulated,
          index: i,
        });
      }, intervalMs);
    });
  }

  // ─── Count Tokens ────────────────────────────────────────────────────────────

  async countTokens(text) {
    if (typeof text !== 'string') {
      throw Object.assign(new Error('ClaudeService: text must be a string'), { code: 'INVALID_INPUT' });
    }

    const count = estimateTokens(text);

    const res = await this.request('/token-count', {
      method: 'POST',
      body:   JSON.stringify({ text }),
      _mockData: {
        text:          text.slice(0, 50) + (text.length > 50 ? '…' : ''),
        tokenCount:    count,
        charCount:     text.length,
        wordCount:     text.split(/\s+/).filter(Boolean).length,
        estimatedCost: {
          'claude-3-haiku-20240307':  parseFloat(((count / 1_000_000) * 0.25).toFixed(6)),
          'claude-3-sonnet-20240229': parseFloat(((count / 1_000_000) * 3).toFixed(6)),
          'claude-3-opus-20240229':   parseFloat(((count / 1_000_000) * 15).toFixed(6)),
        },
      },
    });

    return res.data;
  }

  // ─── Get Models ──────────────────────────────────────────────────────────────

  async getModels() {
    const models = Object.entries(CLAUDE_MODELS).map(([id, meta]) => ({
      id,
      ...meta,
      available: true,
    }));

    const res = await this.request('/models', {
      _mockData: {
        models,
        default:        DEFAULT_MODEL,
        totalTokensUsed: this._totalTokensUsed,
      },
    });

    return res.data;
  }
}
