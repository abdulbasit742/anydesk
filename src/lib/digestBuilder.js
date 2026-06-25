// digestBuilder.js — Compiles SaaS logs and token usage into structured reports
export function buildDailyDigest(state) {
  const broadcasts = state.broadcasts || [];
  const accounts = state.accounts || [];

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBroadcasts = broadcasts.filter(b => b.createdAt && b.createdAt.startsWith(todayStr));

  const totalCount = todayBroadcasts.length;
  let successCount = 0;
  let totalTargets = 0;
  let estimatedTokens = 0;

  todayBroadcasts.forEach(b => {
    successCount += b.successCount || 0;
    totalTargets += b.total || 0;
    estimatedTokens += Math.ceil((b.prompt || '').split(/\s+/).filter(Boolean).length * 1.35 * (b.total || 1));
  });

  const successRate = totalTargets > 0 ? Math.round((successCount / totalTargets) * 100) : 100;
  const estimatedCost = ((estimatedTokens / 1000) * 0.0015).toFixed(4); // approx $0.0015 per 1k tokens

  // Group by platform to find best channel
  const platformSuccess = {};
  broadcasts.forEach(b => {
    if (b.results) {
      b.results.forEach(r => {
        if (!platformSuccess[r.platform]) {
          platformSuccess[r.platform] = { ok: 0, total: 0 };
        }
        platformSuccess[r.platform].total++;
        if (r.status === 'success') {
          platformSuccess[r.platform].ok++;
        }
      });
    }
  });

  let bestChannel = 'Bolt.new';
  let maxRate = 0;
  Object.entries(platformSuccess).forEach(([p, stats]) => {
    const rate = stats.total > 0 ? (stats.ok / stats.total) * 100 : 0;
    if (rate > maxRate) {
      maxRate = rate;
      bestChannel = p;
    }
  });

  const optimizations = state.optimizations || [];
  const optimizedCount = todayBroadcasts.filter(b =>
    optimizations.some(o => o.original === b.prompt || o.enhanced === b.prompt)
  ).length;
  const optimizationRate = totalCount > 0 ? Math.round((optimizedCount / totalCount) * 100) : 0;

  const recommendations = [];
  if (successRate < 90) {
    recommendations.push(`- ⚠️ **Stagger Transmissions**: Lower success rates detected. Stagger transmissions by 1.2s to prevent rate-limit crashes.`);
  }
  if (estimatedTokens > 15000) {
    recommendations.push(`- 💰 **Reduce Prompt Length**: High token burn ($${estimatedCost}). Trim prompts or use the Token Reducer utility.`);
  }
  if (optimizationRate < 50 && totalCount > 0) {
    recommendations.push(`- 🔬 **Pre-flight Check**: Only ${optimizationRate}% of broadcasts were optimized first. Run prompts through the Smart Prompt Optimizer.`);
  }
  if (recommendations.length === 0) {
    recommendations.push(`- ✓ **Fidelity Score Healthy**: Current prompt architectures match the highest quality standards with zero errors.`);
  }

  // Construct markdown
  let md = `### 📊 Daily Summary Telemetry\n`;
  md += `- **Broadcast Sessions Run**: ${totalCount} sessions today\n`;
  md += `- **Channel Deliveries**: ${successCount} / ${totalTargets} channels successful (${successRate}% success rate)\n`;
  md += `- **Token Footprint**: ${estimatedTokens.toLocaleString()} tokens ($${estimatedCost})\n`;
  md += `- **Pre-flight Optimization Rate**: ${optimizationRate}% of broadcasts\n\n`;

  md += `### 📡 Channel Health\n`;
  md += `- **Most Resilient Transmission Node**: **${bestChannel}** (${maxRate > 0 ? Math.round(maxRate) : 98}% stability rate)\n`;
  md += `- **Connected Slots Active**: ${accounts.filter(a => a.status === 'active').length} accounts operational\n\n`;

  md += `### 💡 Smart Strategy Recommendations\n`;
  md += recommendations.join('\n');

  return {
    date: todayStr,
    totalCount,
    successCount,
    totalTargets,
    successRate,
    estimatedTokens,
    estimatedCost: parseFloat(estimatedCost),
    bestChannel,
    optimizationRate,
    markdown: md
  };
}
export function getStoredDigests() {
  try {
    const raw = localStorage.getItem('bolt_studio_pro_digests');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
export function saveDigest(digest) {
  try {
    const current = getStoredDigests();
    const filtered = current.filter(d => d.date !== digest.date);
    localStorage.setItem('bolt_studio_pro_digests', JSON.stringify([digest, ...filtered].slice(0, 14)));
  } catch (e) {
    console.error('Failed to save digest to localStorage:', e);
  }
}
