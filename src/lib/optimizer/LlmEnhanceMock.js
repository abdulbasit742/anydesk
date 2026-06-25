// LlmEnhanceMock.js — Simulated AI generator upgrading requirements with professional templates
import { suggestPersona } from './PersonaRules.js';

const ENHANCEMENT_TEMPLATES = {
  professional: (text) => `${suggestPersona(text)}\n\n## Task\n${text}\n\n## Requirements\n- Follow industry best practices\n- Implement proper error handling and edge cases\n- Ensure code is production-ready and well-structured\n- Include comprehensive type definitions\n\n## Output Format\nProvide complete, runnable code with inline comments explaining key decisions.`,
  concise: (text) => `${text}\n\nConstraints: Production-ready, well-typed, no placeholders. Output complete code only.`,
  detailed: (text) => `${suggestPersona(text)}\n\n## Background\n[Project context]\n\n## Primary Task\n${text}\n\n## Technical Requirements\n- Architecture: component-based, modular\n- Error handling: graceful degradation with user feedback\n- Performance: optimized for production\n- Testing: include unit test examples\n- Accessibility: WCAG 2.1 AA compliant\n\n## Edge Cases to Handle\n- Empty states\n- Loading states\n- Error states\n- Mobile responsiveness\n\n## Expected Output\nComplete implementation with file structure.`,
};

export async function enhancePrompt(text, style = 'professional', onProgress) {
  const steps = [
    'Analyzing prompt structure...',
    'Identifying improvement opportunities...',
    'Applying professional template...',
    'Enhancing clarity and specificity...',
    'Finalizing enhanced prompt...',
  ];

  for (const step of steps) {
    onProgress?.({ step, progress: steps.indexOf(step) / steps.length });
    await new Promise(r => setTimeout(r, 150 + Math.random() * 200));
  }

  const template = ENHANCEMENT_TEMPLATES[style] || ENHANCEMENT_TEMPLATES.professional;
  const enhanced = template(text);

  return {
    original: text,
    enhanced,
    style,
    improvementPct: Math.round(((enhanced.length - text.length) / text.length) * 100),
    tokensOriginal: Math.ceil(text.length / 4),
    tokensEnhanced: Math.ceil(enhanced.length / 4),
  };
}
