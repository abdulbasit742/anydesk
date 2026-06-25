// optimizer.js — AI prompt optimization service (local)

const QUALITY_CHECKS = [
  { name: 'specificity',  weight: 25, check: p => p.split(/\s+/).length > 8 },
  { name: 'structure',    weight: 25, check: p => /\b(create|build|write|implement|generate|make)\b/i.test(p) },
  { name: 'context',      weight: 20, check: p => p.length > 60 },
  { name: 'format',       weight: 15, check: p => /(format|output|respond|return|show)/i.test(p) },
  { name: 'constraints',  weight: 15, check: p => p.length > 100 },
];

export const optimizerService = {
  scorePrompt(prompt) {
    const score = QUALITY_CHECKS.reduce((s, c) => s + (c.check(prompt) ? c.weight : 0), 0);
    return {
      total: score,
      grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D',
      color: score >= 80 ? 'var(--teal)' : score >= 60 ? 'var(--gold)' : 'var(--red)',
      checks: QUALITY_CHECKS.map(c => ({ ...c, passed: c.check(prompt) })),
    };
  },

  optimize(prompt, opts = {}) {
    const { role = 'expert developer', format = 'clean code with comments', tone = 'professional' } = opts;
    const tech  = prompt.match(/\b(react|vue|angular|next|typescript|python|node|css|api|sql)\b/gi) || [];
    const techStr = tech.length > 0 ? `\n\nTechnology stack: ${[...new Set(tech)].join(', ')}` : '';

    return `You are an ${role}. ${prompt}${techStr}

Technical requirements:
- Write clean, production-ready code with proper error handling
- Follow ${tone} best practices and design patterns
- Add comprehensive inline comments and documentation
- Ensure full responsive design (mobile-first, 320px to 2560px)
- Implement accessibility best practices (WCAG 2.1 AA)
- Handle all edge cases and empty states gracefully
- Add smooth animations and micro-interactions where appropriate
- Optimize for performance (lazy loading, minimal re-renders)
- Use semantic HTML5 and modern CSS features

Output format: ${format}

Additional context: Please be thorough and complete. Do not use placeholders or TODO comments.`;
  },

  getImprovements(prompt) {
    const suggestions = [];
    if (prompt.split(/\s+/).length < 10) suggestions.push({ type: 'warn', text: 'Prompt is too short — add more detail' });
    if (!/\b(create|build|write|implement|make|generate)\b/i.test(prompt)) suggestions.push({ type: 'info', text: 'Add an action verb (create, build, implement…)' });
    if (!/(react|vue|angular|next|typescript|python|node|css|html)\b/i.test(prompt)) suggestions.push({ type: 'info', text: 'Specify the technology stack' });
    if (prompt.length < 100) suggestions.push({ type: 'warn', text: 'More detail will yield better results' });
    if (!/(responsive|mobile|desktop)\b/i.test(prompt)) suggestions.push({ type: 'tip', text: 'Mention responsive or mobile requirements' });
    return suggestions;
  },
};

export default optimizerService;
