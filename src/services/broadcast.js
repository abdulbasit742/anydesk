// broadcast.js — broadcast service: queue, retry, rate limiting

const RATE_LIMIT_MS = 500; // delay between each send

async function simulateSend(account, prompt, signal) {
  const delay = 300 + Math.random() * 800;
  await new Promise(r => setTimeout(r, delay));
  if (signal?.aborted) throw new Error('Aborted');
  // 10% simulated failure rate
  if (Math.random() < 0.1) throw new Error(`Delivery failed to ${account.name}`);
  return { accountId: account.id, platform: account.platform, prompt, ts: new Date().toISOString(), tokensUsed: Math.floor(prompt.length * 0.35 + 50) };
}

export const broadcastService = {
  async broadcast(accounts, prompt, { onProgress, onSuccess, onFailure, delay = RATE_LIMIT_MS, signal } = {}) {
    const results  = [];
    const failures = [];
    let succeeded  = 0;

    for (let i = 0; i < accounts.length; i++) {
      if (signal?.aborted) break;
      const acc = accounts[i];
      onProgress?.({ index: i, total: accounts.length, account: acc, phase: 'sending' });
      try {
        const result = await simulateSend(acc, prompt, signal);
        results.push(result);
        succeeded++;
        onSuccess?.({ index: i, account: acc, result });
      } catch (e) {
        const fail = { accountId: acc.id, platform: acc.platform, error: e.message, ts: new Date().toISOString() };
        failures.push(fail);
        onFailure?.({ index: i, account: acc, error: e.message });
      }
      if (i < accounts.length - 1 && delay > 0) await new Promise(r => setTimeout(r, delay));
    }

    return {
      prompt, total: accounts.length, succeeded, failed: failures.length,
      successRate: accounts.length > 0 ? succeeded / accounts.length : 0,
      results, failures, duration: results.length > 0 ? results.length * delay : 0,
      ts: new Date().toISOString(),
    };
  },

  async retry(failures, prompt, opts = {}) {
    const accounts = failures.map(f => ({ id: f.accountId, platform: f.platform, name: `Account ${f.accountId}` }));
    return this.broadcast(accounts, prompt, opts);
  },

  estimateDuration(count, delayMs = RATE_LIMIT_MS) {
    return count * (delayMs + 550); // avg send time + delay
  },
};

export default broadcastService;
