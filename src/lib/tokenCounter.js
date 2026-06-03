// src/lib/tokenCounter.js
// TokenCounter — word-based token estimation per model

const MODELS = {
  'gpt-4o': { limit: 128000, costPer1k: 0.005, multiplier: 1.35 },
  'gpt-4-turbo': { limit: 128000, costPer1k: 0.01, multiplier: 1.35 },
  'gpt-3.5-turbo': { limit: 16385, costPer1k: 0.0015, multiplier: 1.30 },
  'claude-3-7-sonnet': { limit: 200000, costPer1k: 0.003, multiplier: 1.40 },
  'claude-3-opus': { limit: 200000, costPer1k: 0.015, multiplier: 1.40 },
  'claude-3-haiku': { limit: 200000, costPer1k: 0.00025, multiplier: 1.38 },
  'gemini-2.5-pro': { limit: 2000000, costPer1k: 0.00125, multiplier: 1.33 },
  'gemini-1.5-flash': { limit: 1000000, costPer1k: 0.00015, multiplier: 1.33 },
  'mistral-large-latest': { limit: 128000, costPer1k: 0.004, multiplier: 1.30 },
  'mistral-small': { limit: 128000, costPer1k: 0.001, multiplier: 1.28 },
  'llama-3.3-70b-versatile': { limit: 32768, costPer1k: 0.00059, multiplier: 1.25 },
  'command-r-plus': { limit: 128000, costPer1k: 0.003, multiplier: 1.30 },
  default: { limit: 8192, costPer1k: 0.002, multiplier: 1.35 },
};

class TokenCounter {
  /**
   * estimate(text) — word-based estimation using ×1.35 multiplier.
   * Returns token count as integer.
   */
  estimate(text) {
    if (!text || typeof text !== 'string') return 0;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.ceil(words * 1.35);
  }

  /**
   * estimateForModel(text, model) — adjusts per model's multiplier.
   */
  estimateForModel(text, model) {
    if (!text || typeof text !== 'string') return 0;
    const cfg = MODELS[model] || MODELS['default'];
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.ceil(words * cfg.multiplier);
  }

  /**
   * checkLimit(text, model) — returns { count, limit, percent, safe, estimatedCost }.
   */
  checkLimit(text, model = 'default') {
    const cfg = MODELS[model] || MODELS['default'];
    const count = this.estimateForModel(text, model);
    const percent = +(count / cfg.limit * 100).toFixed(2);
    const estimatedCost = +((count / 1000) * cfg.costPer1k).toFixed(6);
    return {
      count,
      limit: cfg.limit,
      percent,
      safe: percent <= 90,
      remaining: Math.max(0, cfg.limit - count),
      estimatedCost,
      model: model,
    };
  }

  /**
   * formatCount(n) — e.g. 1234 → '1.2K', 1000000 → '1M'
   */
  formatCount(n) {
    if (n === undefined || n === null) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  }

  /**
   * getModelInfo(model) — returns model config { limit, costPer1k, multiplier }
   */
  getModelInfo(model) {
    return MODELS[model] || MODELS['default'];
  }

  /**
   * listModels() — returns array of model names.
   */
  listModels() {
    return Object.keys(MODELS).filter((k) => k !== 'default');
  }
}

const tokenCounter = new TokenCounter();
export default tokenCounter;
export { TokenCounter, MODELS };
