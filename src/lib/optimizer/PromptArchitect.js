// PromptArchitect.js — Aggregates all checklist rules into an interactive checklist
import { checkPersonaRule } from './PersonaRules.js';
import { checkStructureRule } from './StructureRules.js';
import { checkFallbackRule } from './FallbackRules.js';
import { checkBreakpointRule } from './BreakpointRules.js';
import { analyzeReadability } from './FkReadability.js';
import { estimateReduction } from './TokenReducer.js';

export function runFullAudit(text) {
  if (!text?.trim()) return { score: 0, maxScore: 100, checks: [], readability: null, tokenReduction: null };

  const persona = checkPersonaRule(text);
  const structure = checkStructureRule(text);
  const fallback = checkFallbackRule(text);
  const breakpoints = checkBreakpointRule(text);
  const readability = analyzeReadability(text);
  const tokenReduction = estimateReduction(text);

  const checks = [persona, structure, fallback, breakpoints];
  const totalScore = checks.reduce((acc, c) => acc + c.score, 0);
  const maxScore = checks.reduce((acc, c) => acc + c.maxScore, 0);

  const allSuggestions = checks.flatMap(c => c.suggestions || []).filter(Boolean);

  const grade = totalScore >= maxScore * 0.85 ? 'A' :
                totalScore >= maxScore * 0.70 ? 'B' :
                totalScore >= maxScore * 0.55 ? 'C' : 'D';

  return {
    score: totalScore,
    maxScore,
    grade,
    pct: Math.round((totalScore / maxScore) * 100),
    checks: { persona, structure, fallback, breakpoints },
    readability,
    tokenReduction,
    suggestions: allSuggestions,
    passed: checks.filter(c => c.passed).length,
    total: checks.length,
  };
}

export function getChecklistItems(auditResult) {
  if (!auditResult) return [];
  return Object.values(auditResult.checks || {}).map(c => ({
    id: c.rule, passed: c.passed, score: c.score, maxScore: c.maxScore,
    label: c.rule.charAt(0).toUpperCase() + c.rule.slice(1),
    suggestions: c.suggestions || [],
  }));
}
