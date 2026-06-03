// useTokenCounter.js — Estimates LLM prompt token costs using local approximation
import { useState, useCallback, useMemo } from 'react';

// Approximate: 1 token ≈ 4 chars for English text
const CHARS_PER_TOKEN = 4;

const MODEL_PRICING = {
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'claude-sonnet-4-6': { input: 0.003, output: 0.015 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
};

export function useTokenCounter(model = 'claude-sonnet-4-6') {
  const [prompt, setPrompt] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState(500);

  const inputTokens = useMemo(() =>
    Math.ceil(prompt.length / CHARS_PER_TOKEN), [prompt]);

  const cost = useMemo(() => {
    const pricing = MODEL_PRICING[model] || MODEL_PRICING['claude-sonnet-4-6'];
    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (estimatedOutput / 1000) * pricing.output;
    return { input: inputCost, output: outputCost, total: inputCost + outputCost };
  }, [inputTokens, estimatedOutput, model]);

  const estimateFromText = useCallback((text) => {
    setPrompt(text);
    return Math.ceil(text.length / CHARS_PER_TOKEN);
  }, []);

  const formatCost = useCallback((amount) =>
    amount < 0.01 ? `$${(amount * 100).toFixed(3)}¢` : `$${amount.toFixed(4)}`, []);

  return {
    prompt, setPrompt,
    inputTokens, estimatedOutput, setEstimatedOutput,
    cost, estimateFromText, formatCost,
    supportedModels: Object.keys(MODEL_PRICING),
  };
}
