// responseAggregator.js — Compiles multi-platform response payloads into a consensus winner
export function aggregateResponses(responses) {
  if (!responses || responses.length === 0) {
    return {
      consensusScore: 0,
      winner: null,
      aggregatedSummary: 'No responses to aggregate.',
      metrics: { avgLatency: 0, totalTokens: 0, avgQuality: 0 },
      codeSnippets: []
    };
  }

  // 1. Calculate standard metrics
  const total = responses.length;
  let totalLatency = 0;
  let totalTokens = 0;
  let totalQuality = 0;
  const snippets = [];

  responses.forEach(r => {
    totalLatency += r.metrics?.latency || 1200;
    totalTokens += r.metrics?.tokens || 400;
    totalQuality += r.metrics?.quality || 80;

    // Extract markdown code blocks if any
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    const text = r.responseText || '';
    while ((match = codeBlockRegex.exec(text)) !== null) {
      snippets.push({
        platform: r.name || r.platformId,
        lang: match[1] || 'txt',
        code: match[2].trim()
      });
    }
  });

  const avgLatency = Math.round(totalLatency / total);
  const avgQuality = Math.round(totalQuality / total);

  // 2. Select the Winner (highest quality metric score)
  const sorted = [...responses].sort((a, b) => {
    const scoreA = a.metrics?.quality || 80;
    const scoreB = b.metrics?.quality || 80;
    return scoreB - scoreA;
  });

  const winner = sorted[0];

  // 3. Formulate consensus summary
  const platformsText = responses.map(r => r.name || r.platformId).join(', ');
  const aggregatedSummary = `Successfully aggregated ${total} response payload(s) from [${platformsText}]. Consensus highlights: Average execution latency was ${avgLatency}ms with an aggregated model quality grade of ${avgQuality}%. ${winner.name || winner.platformId} provided the highest fidelity response candidate.`;

  // 4. Compute consensus alignment score (10-100) based on quality variance
  let variance = 0;
  if (total > 1) {
    const mean = totalQuality / total;
    variance = responses.reduce((acc, r) => acc + Math.pow((r.metrics?.quality || 80) - mean, 2), 0) / (total - 1);
  }
  const consensusScore = Math.max(10, Math.min(100, Math.round(100 - Math.sqrt(variance))));

  return {
    consensusScore,
    winner: {
      platformId: winner.platformId,
      name: winner.name,
      responseText: winner.responseText,
      quality: winner.metrics?.quality || 80,
      latency: winner.metrics?.latency || 1200,
      tokens: winner.metrics?.tokens || 400
    },
    aggregatedSummary,
    metrics: {
      avgLatency,
      totalTokens,
      avgQuality
    },
    codeSnippets: snippets
  };
}
