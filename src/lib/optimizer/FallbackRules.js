// FallbackRules.js — Audits prompts to verify fallback and error management instructions
const FALLBACK_PATTERNS = [
  /\b(?:if\s+(?:not|no|unable|cannot|can't|fail|error))\b/i,
  /\b(?:fallback|fallback\s+to|alternative|otherwise|else)\b/i,
  /\b(?:on\s+error|handle\s+(?:error|exception|failure))\b/i,
  /\b(?:gracefully|degrade|fallback\s+option)\b/i,
  /\b(?:edge\s+case|corner\s+case|boundary\s+case)\b/i,
];

const ERROR_HANDLING_PATTERNS = [
  /\b(?:try|catch|throw|except|error\s+handling)\b/i,
  /\b(?:validation|validate|invalid|malformed)\b/i,
  /\b(?:retry|back.?off|timeout|deadline)\b/i,
];

export function checkFallbackRule(text) {
  const hasFallback = FALLBACK_PATTERNS.some(p => p.test(text));
  const hasErrorHandling = ERROR_HANDLING_PATTERNS.some(p => p.test(text));

  const found = [];
  FALLBACK_PATTERNS.forEach((p, i) => { if (p.test(text)) found.push(`fallback_pattern_${i + 1}`); });
  ERROR_HANDLING_PATTERNS.forEach((p, i) => { if (p.test(text)) found.push(`error_pattern_${i + 1}`); });

  const score = (hasFallback ? 8 : 0) + (hasErrorHandling ? 7 : 0);

  return {
    rule: 'fallback',
    passed: score >= 8,
    score,
    maxScore: 15,
    hasFallback,
    hasErrorHandling,
    found,
    suggestions: [
      !hasFallback && 'Add fallback instructions: "If X is not available, use Y instead"',
      !hasErrorHandling && 'Include error handling: "If an error occurs, gracefully..."',
    ].filter(Boolean),
  };
}
