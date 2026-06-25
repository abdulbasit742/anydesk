// MultiBroadcast.js — Automation template dispatching prompts to all platform categories
export const MultiBroadcastStep = {
  id: 'multi-broadcast',
  name: 'Multi-Platform Broadcast',
  type: 'broadcast',
  description: 'Dispatches compiled prompt to all selected platform accounts simultaneously',
  icon: '📡',
  configSchema: {
    concurrency: { type: 'number', default: 3, min: 1, max: 10 },
    retries: { type: 'number', default: 2 },
    stopOnFirstError: { type: 'boolean', default: false },
  },

  async execute(payload, config = {}) {
    const { accounts = [], prompt = '', variables = {} } = payload;
    const { concurrency = 3, retries = 2, stopOnFirstError = false } = config;
    const results = [];

    const chunks = [];
    for (let i = 0; i < accounts.length; i += concurrency) {
      chunks.push(accounts.slice(i, i + concurrency));
    }

    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(account => this._sendToAccount(account, prompt, variables, retries))
      );

      for (const result of chunkResults) {
        if (result.status === 'fulfilled') {
          results.push({ ...result.value, status: 'success' });
        } else {
          results.push({ error: result.reason.message, status: 'failed' });
          if (stopOnFirstError) return { results, stopped: true };
        }
      }
    }

    return { results, stopped: false, successCount: results.filter(r => r.status === 'success').length };
  },

  async _sendToAccount(account, prompt, variables, retries) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await new Promise(r => setTimeout(r, 100 + Math.random() * 300));
        if (Math.random() < 0.02) throw new Error('Rate limit exceeded');
        return { accountId: account.id, platform: account.platform, attempt };
      } catch (e) {
        if (attempt === retries) throw e;
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  },
};
