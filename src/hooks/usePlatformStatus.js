import { useState, useEffect, useCallback } from 'react';

const BASE_LATENCIES = {
  bolt: 18, lovable: 24, cursor: 31, replit: 42, windsurf: 28,
  v0: 35, claude: 52, chatgpt: 48, gemini: 22, github: 15,
  vercel: 19, netlify: 25, railway: 33, supabase: 27, firebase: 30,
};

export function usePlatformStatus(accounts) {
  const [statuses, setStatuses] = useState({});
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  const runSweep = useCallback(async () => {
    setScanning(true);
    const results = {};
    for (const acc of accounts) {
      // Simulate async ping per account with jitter
      await new Promise(r => setTimeout(r, 80 + Math.random() * 120));
      const base = BASE_LATENCIES[acc.platform] || 40;
      const latency = Math.round(base + (Math.random() - 0.5) * base * 0.4);
      const ok = Math.random() > 0.08; // 92% uptime
      results[acc.id] = {
        latency,
        status: ok ? 'ok' : 'degraded',
        uptime: ok ? 99.2 + Math.random() * 0.7 : 87 + Math.random() * 8,
        lastCheck: new Date().toISOString(),
      };
    }
    setStatuses(results);
    setScanning(false);
    setLastScan(new Date());
  }, [accounts]);

  useEffect(() => {
    const p = setTimeout(runSweep, 0);
    const t = setInterval(runSweep, 45000);
    return () => {
      clearTimeout(p);
      clearInterval(t);
    };
  }, [runSweep]);

  return { statuses, scanning, lastScan, runSweep };
}
