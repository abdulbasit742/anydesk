// BreakpointRules.js — Recommends layout breakpoints for dashboard/web design prompts
const UI_KEYWORDS = /\b(?:dashboard|layout|page|screen|view|responsive|mobile|desktop|tablet|grid|flex|column|row|sidebar|header|footer|component|widget)\b/i;
const BREAKPOINT_MENTIONED = /\b(?:breakpoint|sm:|md:|lg:|xl:|mobile|tablet|desktop|responsive|@media|min-width|max-width)\b/i;

const STANDARD_BREAKPOINTS = {
  tailwind: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  bootstrap: { sm: '576px', md: '768px', lg: '992px', xl: '1200px', xxl: '1400px' },
  custom: { mobile: '480px', tablet: '768px', laptop: '1024px', desktop: '1280px', wide: '1920px' },
};

export function checkBreakpointRule(text) {
  const isUIPrompt = UI_KEYWORDS.test(text);
  const hasBreakpoints = BREAKPOINT_MENTIONED.test(text);

  if (!isUIPrompt) {
    return { rule: 'breakpoints', passed: true, score: 5, maxScore: 5, skipped: true, reason: 'Not a UI prompt' };
  }

  return {
    rule: 'breakpoints',
    passed: hasBreakpoints,
    score: hasBreakpoints ? 5 : 2,
    maxScore: 5,
    isUIPrompt,
    hasBreakpoints,
    recommendation: hasBreakpoints ? null : `Add responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)`,
    suggestedSystem: 'tailwind',
    standardBreakpoints: STANDARD_BREAKPOINTS,
  };
}

export function getBreakpointSnippet(system = 'tailwind') {
  const bp = STANDARD_BREAKPOINTS[system];
  return Object.entries(bp).map(([k, v]) => `${k}: ${v}`).join(', ');
}
