// TokenEstimator.js — Forecasts token price margins before broadcasts
const CHARS_PER_TOKEN = 4;
const MODEL_COSTS = {
  'claude-sonnet-4-6': { input: 0.003, output: 0.015 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
};

export function estimateTokens(text) {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export function estimateCost(text, model = 'claude-sonnet-4-6', outputMultiplier = 1.5) {
  const inputTokens = estimateTokens(text);
  const outputTokens = Math.ceil(inputTokens * outputMultiplier);
  const pricing = MODEL_COSTS[model] || MODEL_COSTS['claude-sonnet-4-6'];

  return {
    inputTokens,
    outputTokens,
    inputCost: (inputTokens / 1000) * pricing.input,
    outputCost: (outputTokens / 1000) * pricing.output,
    totalCost: (inputTokens / 1000) * pricing.input + (outputTokens / 1000) * pricing.output,
    model,
  };
}

export function estimateBatchCost(prompts, model = 'claude-sonnet-4-6') {
  const results = prompts.map(p => estimateCost(typeof p === 'string' ? p : p.prompt, model));
  return {
    perPrompt: results,
    total: {
      inputTokens: results.reduce((acc, r) => acc + r.inputTokens, 0),
      outputTokens: results.reduce((acc, r) => acc + r.outputTokens, 0),
      totalCost: results.reduce((acc, r) => acc + r.totalCost, 0),
    },
    model,
    promptCount: prompts.length,
  };
}

export function formatCost(amount) {
  if (amount < 0.001) return `${(amount * 100000).toFixed(2)}µ$`;
  if (amount < 0.01) return `${(amount * 100).toFixed(3)}¢`;
  return `$${amount.toFixed(4)}`;
}
