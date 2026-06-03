// health.js — platform health monitoring service

const TIMEOUT = 5000;
const ENDPOINTS = {
  bolt:    'https://bolt.new',
  lovable: 'https://lovable.dev',
  manus:   'https://manus.im',
  replit:  'https://replit.com',
  claude:  'https://claude.ai',
  cursor:  'https://cursor.com',
  v0:      'https://v0.dev',
};

async function pingUrl(url, timeout = TIMEOUT) {
  const start = Date.now();
  try {
    await Promise.race([
      fetch(url, { method: 'HEAD', mode: 'no-cors' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
    ]);
    return { ok: true, latency: Date.now() - start };
  } catch (e) {
    return { ok: e.message !== 'timeout', latency: Date.now() - start, error: e.message };
  }
}

export const healthService = {
  async ping(platform) {
    const url = ENDPOINTS[platform];
    if (!url) return { ok: false, latency: 0, error: 'Unknown platform' };
    return pingUrl(url);
  },

  async pingAll(platforms = Object.keys(ENDPOINTS)) {
    const results = await Promise.allSettled(platforms.map(p => this.ping(p)));
    return Object.fromEntries(platforms.map((p, i) => [p, results[i].status === 'fulfilled' ? results[i].value : { ok: false, latency: 0 }]));
  },

  async checkAccount(account) {
    const result = await this.ping(account.platform);
    return { ...result, accountId: account.id, platform: account.platform, ts: new Date().toISOString() };
  },

  getStatusLabel(latency) {
    if (latency < 200)  return 'excellent';
    if (latency < 500)  return 'good';
    if (latency < 1000) return 'degraded';
    return 'slow';
  },

  getStatusColor(latency, ok = true) {
    if (!ok) return '#ff5f5f';
    if (latency < 200)  return '#00d4aa';
    if (latency < 500)  return '#f5b731';
    if (latency < 1000) return '#f97316';
    return '#ff5f5f';
  },
};

export default healthService;
