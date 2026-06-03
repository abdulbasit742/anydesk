// CoolDown.js — Orchestrates delay segments between steps to bypass rate limiters
export const CoolDownStep = {
  id: 'cool-down',
  name: 'Rate Limit Cool-Down',
  type: 'delay',
  description: 'Introduces adaptive delay between workflow steps to avoid platform rate limits',
  icon: '⏱',
  configSchema: {
    baseDelayMs: { type: 'number', default: 2000, min: 500, max: 60000 },
    jitterMs: { type: 'number', default: 1000 },
    adaptive: { type: 'boolean', default: true },
    platform: { type: 'string', default: '' },
  },

  async execute(payload, config = {}) {
    const { baseDelayMs = 2000, jitterMs = 1000, adaptive = true, platform = '' } = config;

    const platformMultipliers = { bolt: 1.0, lovable: 1.2, manus: 1.5, replit: 1.0, claude: 2.0 };
    const multiplier = adaptive ? (platformMultipliers[platform?.toLowerCase()] || 1.0) : 1.0;

    const delay = Math.round(baseDelayMs * multiplier + (Math.random() * jitterMs));
    const startedAt = Date.now();

    await new Promise(r => setTimeout(r, delay));

    return {
      delayed: delay,
      platform,
      multiplier,
      elapsed: Date.now() - startedAt,
      message: `Cool-down complete: ${delay}ms`,
    };
  },
};
