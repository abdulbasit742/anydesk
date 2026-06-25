// TokenReducer.js — Offers optimization tips to shrink token consumption
import { estimateTokens } from '../interpolation/TokenEstimator.js';

const REDUNDANCY_PATTERNS = [
  { pattern: /\b(please|kindly|if you could|would you)\b/gi, suggestion: 'Remove polite filler words' },
  { pattern: /\b(basically|essentially|actually|literally|obviously|clearly)\b/gi, suggestion: 'Remove filler adverbs' },
  { pattern: /\b(in order to)\b/gi, replacement: 'to', suggestion: 'Replace "in order to" with "to"' },
  { pattern: /\b(due to the fact that)\b/gi, replacement: 'because', suggestion: 'Replace "due to the fact that" with "because"' },
  { pattern: /\b(at this point in time)\b/gi, replacement: 'now', suggestion: 'Replace "at this point in time" with "now"' },
];

export function analyzeRedundancy(text) {
  const findings = [];
  for (const { pattern, suggestion, replacement } of REDUNDANCY_PATTERNS) {
    const matches = text.match(pattern);
    if (matches?.length) {
      findings.push({ suggestion, count: matches.length, matches, replacement });
    }
    pattern.lastIndex = 0;
  }
  return findings;
}

export function estimateReduction(text) {
  const original = estimateTokens(text);
  const findings = analyzeRedundancy(text);
  const estimatedSavings = findings.reduce((acc, f) => acc + f.count * 1.5, 0);
  return {
    originalTokens: original,
    estimatedSavings: Math.round(estimatedSavings),
    estimatedAfter: Math.max(original - Math.round(estimatedSavings), 0),
    reductionPct: original ? Math.round((estimatedSavings / original) * 100) : 0,
    findings,
  };
}

export function applyReductions(text) {
  let result = text;
  for (const { pattern, replacement } of REDUNDANCY_PATTERNS) {
    if (replacement) result = result.replace(pattern, replacement);
    pattern.lastIndex = 0;
  }
  return result;
}
