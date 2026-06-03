// VibeChecker.js — Evaluates prompt sentiment, clarity, and instructions complexity
const POSITIVE_SIGNALS = /\b(?:clear|specific|detailed|precise|explicit|well-defined|structured|organized|comprehensive)\b/gi;
const NEGATIVE_SIGNALS = /\b(?:vague|unclear|ambiguous|confusing|maybe|perhaps|sort of|kind of|I think|probably)\b/gi;
const CONFIDENCE_SIGNALS = /\b(?:must|should|shall|will|ensure|require|need|always|never)\b/gi;
const COMPLEXITY_SIGNALS = /\b(?:complex|advanced|sophisticated|enterprise|production|scalable|optimized)\b/gi;

export function checkVibe(text) {
  const positiveMatches = (text.match(POSITIVE_SIGNALS) || []).length;
  const negativeMatches = (text.match(NEGATIVE_SIGNALS) || []).length;
  const confidenceMatches = (text.match(CONFIDENCE_SIGNALS) || []).length;
  const complexityLevel = (text.match(COMPLEXITY_SIGNALS) || []).length;

  const clarityScore = Math.min(30, positiveMatches * 5 - negativeMatches * 8 + 10);
  const sentimentScore = Math.min(20, confidenceMatches * 3 + 5);
  const totalScore = Math.max(0, clarityScore + sentimentScore);

  const vibe = totalScore >= 40 ? 'excellent' :
               totalScore >= 28 ? 'good' :
               totalScore >= 16 ? 'moderate' : 'weak';

  const emoji = { excellent: '🔥', good: '✅', moderate: '⚠️', weak: '❌' };

  return {
    rule: 'vibe',
    vibe,
    emoji: emoji[vibe],
    score: totalScore,
    maxScore: 50,
    passed: totalScore >= 28,
    details: { positiveMatches, negativeMatches, confidenceMatches, complexityLevel },
    suggestions: [
      negativeMatches > 2 && 'Reduce vague language (maybe, perhaps, kind of)',
      positiveMatches < 2 && 'Add clarity signals (specific, explicit, ensure)',
      confidenceMatches < 3 && 'Use decisive language (must, should, always)',
    ].filter(Boolean),
  };
}
