// PersonaRules.js — Scans prompts to check if a specific persona/role is assigned
const PERSONA_PATTERNS = [
  { pattern: /\b(?:you are|act as|behave as|role:)\s+(?:a|an)?\s*([a-z\s]+)/gi, type: 'direct' },
  { pattern: /\b(?:expert|specialist|senior|lead|principal)\s+([a-z\s]+)/gi, type: 'expertise' },
  { pattern: /\b(?:as a|as an)\s+([a-z\s]+),?\s+(?:you|please|help)/gi, type: 'contextual' },
];

export function detectPersona(text) {
  const found = [];
  for (const { pattern, type } of PERSONA_PATTERNS) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      found.push({ persona: match[1]?.trim(), type, position: match.index });
    }
    pattern.lastIndex = 0;
  }
  return found;
}

export function checkPersonaRule(text) {
  const personas = detectPersona(text);
  const passed = personas.length > 0;
  return {
    rule: 'persona',
    passed,
    score: passed ? 10 : 0,
    maxScore: 10,
    personas,
    suggestion: passed ? null : 'Consider adding a persona (e.g., "You are a senior React developer...")',
  };
}

export function suggestPersona(text) {
  const topics = {
    react: 'senior React developer',
    python: 'Python backend engineer',
    design: 'UI/UX designer',
    database: 'database architect',
    security: 'cybersecurity expert',
    api: 'API architect',
  };

  const lower = text.toLowerCase();
  for (const [keyword, persona] of Object.entries(topics)) {
    if (lower.includes(keyword)) return `You are a ${persona} with 10 years of experience.`;
  }
  return 'You are a senior software engineer with expertise in modern web development.';
}
