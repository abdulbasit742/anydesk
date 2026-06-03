// src/lib/platformAdapter.js
// PlatformAdapter — factory that returns platform-specific adapter instances

const FAILURE_RATE = 0.05; // 5%

function maybeThrow(platform) {
  if (Math.random() < FAILURE_RATE) {
    throw new Error(`[${platform}] Simulated API error: rate limit or service unavailable`);
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function randDelay(min, max) {
  return delay(Math.floor(Math.random() * (max - min) + min));
}

// ─── Base Adapter ────────────────────────────────────────────────────────────

class BaseAdapter {
  constructor(platform, credential) {
    this.platform = platform;
    this.credential = credential;
    this._status = 'idle';
  }

  async sendPrompt(prompt) {
    await randDelay(600, 1800);
    maybeThrow(this.platform);
    const words = prompt.split(/\s+/).length;
    return {
      platform: this.platform,
      success: true,
      responseId: `resp_${Date.now().toString(36)}`,
      tokensUsed: Math.ceil(words * 1.35),
      latencyMs: Math.floor(Math.random() * 1200 + 400),
      preview: prompt.slice(0, 80) + (prompt.length > 80 ? '…' : ''),
    };
  }

  async getStatus() {
    await randDelay(100, 400);
    maybeThrow(this.platform);
    return { platform: this.platform, status: 'operational', latency: Math.floor(Math.random() * 200 + 50) };
  }

  async getProjects() {
    await randDelay(300, 900);
    maybeThrow(this.platform);
    return Array.from({ length: Math.ceil(Math.random() * 5) }, (_, i) => ({
      id: `proj_${this.platform}_${i + 1}`,
      name: `Project ${i + 1}`,
      platform: this.platform,
      createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
    }));
  }

  async getCredits() {
    await randDelay(200, 600);
    maybeThrow(this.platform);
    const total = 10000;
    const used = Math.floor(Math.random() * total);
    return { platform: this.platform, total, used, remaining: total - used, currency: 'USD', perUnit: 0.002 };
  }
}

// ─── Platform-Specific Adapters ───────────────────────────────────────────────

class OpenAIAdapter extends BaseAdapter {
  constructor(credential) { super('openai', credential); }

  async sendPrompt(prompt) {
    const base = await super.sendPrompt(prompt);
    return { ...base, model: 'gpt-4o', finishReason: 'stop', organization: this.credential?.org || 'default' };
  }

  async getCredits() {
    const base = await super.getCredits();
    return { ...base, plan: 'pay-as-you-go', perUnit: 0.0025 };
  }
}

class AnthropicAdapter extends BaseAdapter {
  constructor(credential) { super('anthropic', credential); }

  async sendPrompt(prompt) {
    const base = await super.sendPrompt(prompt);
    return { ...base, model: 'claude-3-7-sonnet', stopReason: 'end_turn' };
  }

  async getCredits() {
    const base = await super.getCredits();
    return { ...base, plan: 'api', perUnit: 0.003 };
  }
}

class GeminiAdapter extends BaseAdapter {
  constructor(credential) { super('gemini', credential); }

  async sendPrompt(prompt) {
    const base = await super.sendPrompt(prompt);
    return { ...base, model: 'gemini-2.5-pro', safetyRatings: [], candidate: 0 };
  }

  async getCredits() {
    const base = await super.getCredits();
    return { ...base, plan: 'paid', perUnit: 0.001 };
  }
}

class MistralAdapter extends BaseAdapter {
  constructor(credential) { super('mistral', credential); }

  async sendPrompt(prompt) {
    const base = await super.sendPrompt(prompt);
    return { ...base, model: 'mistral-large-latest', usageTokens: base.tokensUsed };
  }
}

class CohereAdapter extends BaseAdapter {
  constructor(credential) { super('cohere', credential); }

  async sendPrompt(prompt) {
    const base = await super.sendPrompt(prompt);
    return { ...base, model: 'command-r-plus', generationId: `gen_${Date.now().toString(36)}` };
  }
}

class GroqAdapter extends BaseAdapter {
  constructor(credential) { super('groq', credential); }

  async sendPrompt(prompt) {
    await randDelay(80, 300); // Groq is very fast
    maybeThrow('groq');
    const words = prompt.split(/\s+/).length;
    return {
      platform: 'groq',
      success: true,
      responseId: `groq_${Date.now().toString(36)}`,
      tokensUsed: Math.ceil(words * 1.35),
      latencyMs: Math.floor(Math.random() * 200 + 50),
      model: 'llama-3.3-70b-versatile',
      preview: prompt.slice(0, 80) + (prompt.length > 80 ? '…' : ''),
    };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

const ADAPTERS = {
  openai: OpenAIAdapter,
  anthropic: AnthropicAdapter,
  gemini: GeminiAdapter,
  mistral: MistralAdapter,
  cohere: CohereAdapter,
  groq: GroqAdapter,
};

const SUPPORTED_PLATFORMS = Object.keys(ADAPTERS);

/**
 * getAdapter(platform, credential) — returns the correct adapter instance.
 * Falls back to BaseAdapter for unknown platforms.
 */
function getAdapter(platform, credential) {
  const key = (platform || '').toLowerCase();
  const AdapterClass = ADAPTERS[key] || BaseAdapter;
  return new AdapterClass(credential);
}

export default { getAdapter, SUPPORTED_PLATFORMS };
export { getAdapter, SUPPORTED_PLATFORMS, BaseAdapter };
