// StructureRules.js — Analyzes markdown formatting, section dividers, and structural tags
export function checkStructureRule(text) {
  const checks = {
    hasHeaders: /^#{1,3}\s+.+/m.test(text),
    hasBulletPoints: /^[-*+]\s+.+/m.test(text),
    hasNumberedList: /^\d+\.\s+.+/m.test(text),
    hasCodeBlocks: /```[\s\S]+?```/m.test(text),
    hasBoldEmphasis: /\*\*[^*]+\*\*/m.test(text),
    hasSections: /\n\n/.test(text),
    hasRequirements: /\b(?:must|should|shall|require|need|necessary)\b/i.test(text),
    hasContext: /\b(?:context|background|purpose|goal|objective)\b/i.test(text),
    hasConstraints: /\b(?:constraint|limit|restriction|avoid|don't|do not|exclude)\b/i.test(text),
    hasOutput: /\b(?:output|result|return|response|generate|produce)\b/i.test(text),
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  const score = Math.round((passed / total) * 20);

  const missing = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  const suggestions = {
    hasHeaders: 'Add section headers (## Requirements, ## Output Format)',
    hasBulletPoints: 'Use bullet points to list requirements',
    hasRequirements: 'Specify clear requirements using "must", "should", "shall"',
    hasContext: 'Add context/background section explaining the purpose',
    hasConstraints: 'Include constraints (what to avoid, limits)',
    hasOutput: 'Specify the expected output format',
  };

  return { rule: 'structure', passed: score >= 12, score, maxScore: 20, checks, missing: missing.map(k => suggestions[k]).filter(Boolean) };
}
