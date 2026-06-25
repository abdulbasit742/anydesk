// smartRouter.js — Heuristic keyword classifier mapping prompts to active platforms
export const PLATFORM_TAGS = {
  lovable: {
    keywords: ['ui', 'ux', 'component', 'beautiful', 'style', 'page', 'react', 'tailwind', 'landing', 'dashboard', 'frontend', 'visual', 'chart', 'css', 'html', 'canvas'],
    weight: 1.5,
    name: 'Lovable.dev',
    desc: 'Best for complex interactive visual React apps & components.'
  },
  v0: {
    keywords: ['ui component', 'button', 'form', 'modal', 'card', 'header', 'footer', 'input', 'css', 'html', 'simple ui', 'shadcn', 'tailwind'],
    weight: 1.2,
    name: 'v0.dev',
    desc: 'Best for isolated React/HTML page layouts and basic interface elements.'
  },
  bolt: {
    keywords: ['fullstack', 'full-stack', 'vite', 'node', 'app', 'express', 'project', 'client', 'server', 'application', 'npm', 'deploy'],
    weight: 1.3,
    name: 'Bolt.new',
    desc: 'Best for building complete full-stack web applications in-browser.'
  },
  replit: {
    keywords: ['backend', 'express', 'node', 'python', 'script', 'database', 'api', 'postgres', 'sql', 'server', 'cron', 'task', 'worker'],
    weight: 1.4,
    name: 'Replit',
    desc: 'Best for hosting background scripts, databases, and simple API services.'
  },
  manus: {
    keywords: ['scrape', 'crawl', 'autonomous', 'agent', 'workflow', 'automation', 'automate', 'job', 'schedule', 'ai agent', 'complex task', 'agentic'],
    weight: 1.6,
    name: 'Manus.im',
    desc: 'Best for autonomous workflows, heavy web scraping, and agentic multi-step tasks.'
  },
  cursor: {
    keywords: ['refactor', 'bug', 'fix', 'typescript', 'eslint', 'compile', 'error', 'debug', 'test', 'unittest', 'package', 'config', 'dependencies'],
    weight: 1.4,
    name: 'Cursor',
    desc: 'Best for precise code debugging, ESLint refactoring, and code changes.'
  }
};

export function classifyPrompt(promptText) {
  if (!promptText || !promptText.trim()) {
    return {
      best: 'bolt',
      recommendations: Object.keys(PLATFORM_TAGS).map(id => ({
        id,
        name: PLATFORM_TAGS[id].name,
        score: 10,
        reason: 'Empty prompt payload.',
        desc: PLATFORM_TAGS[id].desc
      }))
    };
  }

  const text = promptText.toLowerCase();
  const scores = {};

  Object.entries(PLATFORM_TAGS).forEach(([id, meta]) => {
    let matchCount = 0;
    meta.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        matchCount += matches.length;
      }
      if (text.includes(keyword) && !matches) {
        matchCount += 0.5;
      }
    });

    scores[id] = matchCount * meta.weight;
  });

  const recommendations = Object.entries(PLATFORM_TAGS).map(([id, meta]) => {
    const rawScore = scores[id] || 0;
    // Logarithmic scale normalization to map to 10-100%
    const score = Math.min(100, Math.max(10, Math.round((rawScore / (2 + rawScore)) * 90 + 10)));

    const matchedKeywords = meta.keywords.filter(kw => text.includes(kw));
    const reason = matchedKeywords.length > 0
      ? `Matches: ${matchedKeywords.slice(0, 3).join(', ')}.`
      : `General capability alignment.`;

    return {
      id,
      name: meta.name,
      score,
      reason,
      desc: meta.desc
    };
  }).sort((a, b) => b.score - a.score);

  return {
    best: recommendations[0].id,
    recommendations
  };
}
