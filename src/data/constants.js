export const PLATFORMS = [
  { id: 'bolt', name: 'Bolt.new', icon: '⚡', color: '#f5b731', bg: 'rgba(245,183,49,.14)', abbr: 'BN', url: 'https://bolt.new', credLabel: 'Session Cookie', credPlaceholder: '__session=eyJ...', credHelp: 'Browser DevTools → Application → Cookies → bolt.new → __session', supportsPrompt: true, supportsProjects: true },
  { id: 'lovable', name: 'Lovable', icon: '💜', color: '#a78bfa', bg: 'rgba(167,139,250,.14)', abbr: 'LV', url: 'https://lovable.dev', credLabel: 'API Token', credPlaceholder: 'lvbl_xxxxxxxx', credHelp: 'Lovable Settings → API → Generate Token', supportsPrompt: true, supportsProjects: true },
  { id: 'manus', name: 'Manus.ai', icon: '🤖', color: '#06b6d4', bg: 'rgba(6,182,212,.14)', abbr: 'MA', url: 'https://manus.im', credLabel: 'Auth Token', credPlaceholder: 'manus_token_...', credHelp: 'Manus Settings → Developer → Access Token', supportsPrompt: true, supportsProjects: true },
  { id: 'replit', name: 'Replit', icon: '🔶', color: '#f97316', bg: 'rgba(249,115,22,.14)', abbr: 'RP', url: 'https://replit.com', credLabel: 'API Key', credPlaceholder: 'r_xxxxxxxx', credHelp: 'Replit Account → Privacy & Security → Generate API key', supportsPrompt: false, supportsProjects: true },
  { id: 'claude', name: 'Claude.ai', icon: '🧠', color: '#f97316', bg: 'rgba(249,115,22,.1)', abbr: 'CL', url: 'https://claude.ai', credLabel: 'Session Key', credPlaceholder: 'sk-ant-...', credHelp: 'Browser DevTools → Network → Headers → Cookie', supportsPrompt: true, supportsProjects: false },
  { id: 'cursor', name: 'Cursor', icon: '🔵', color: '#4f8ef7', bg: 'rgba(79,142,247,.14)', abbr: 'CU', url: 'https://cursor.com', credLabel: 'API Key', credPlaceholder: 'cur_xxxxxxxx', credHelp: 'Cursor Settings → API Key', supportsPrompt: true, supportsProjects: true },
  { id: 'v0', name: 'v0.dev', icon: '◼', color: '#a1a1aa', bg: 'rgba(161,161,170,.1)', abbr: 'V0', url: 'https://v0.dev', credLabel: 'Session Token', credPlaceholder: 'v0_xxxxxxxx', credHelp: 'v0.dev DevTools → Cookies', supportsPrompt: true, supportsProjects: true },
];

export const HEALTH_CONFIG = {
  active: { label: 'Active', color: '#00d4aa', icon: '●' },
  low_credits: { label: 'Low Credits', color: '#f5b731', icon: '⚠' },
  exhausted: { label: 'Exhausted', color: '#ff5f5f', icon: '⚠' },
  expired_session: { label: 'Expired', color: '#ff5f5f', icon: '✕' },
  inactive: { label: 'Inactive', color: '#6b6b82', icon: '○' },
  paused: { label: 'Paused', color: '#6b6b82', icon: '⏸' },
  unknown: { label: 'Unknown', color: '#6b6b82', icon: '?' },
};

export const CAT_COLORS = {
  'Web Design': '#4f8ef7', 'Mobile App': '#00d4aa', 'API/Backend': '#f97316',
  'Dashboard': '#a78bfa', 'E-commerce': '#f5b731', 'Landing Page': '#ff5f5f',
  'Component': '#6b7280', 'General': '#9090a8',
  'Advanced Coding': '#3b82f6',
  'Technical Writing': '#10b981',
  'Enterprise Marketing': '#f59e0b',
  'Advanced UX/UI Design': '#ec4899',
  'Deep Learning & NLP': '#8b5cf6',
  'Cloud Architecture & SRE': '#06b6d4',
  'Advanced Cryptography & Web3': '#f43f5e',
  'Financial Analysis & Strategy': '#059669',
  'Scientific Research': '#6366f1',
  'Executive Productivity': '#84cc16',
  'Quantum Computing': '#a855f7',
  'Bioinformatics': '#059669',
  'Game Development': '#f43f5e',
  'Web3 & Solidity': '#d946ef',
  'Data Engineering': '#0284c7',
  'Cybersecurity & Pen Testing': '#e11d48',
  'Embedded Systems & IoT': '#eab308',
  'AI Agents & LangChain': '#6366f1',
  'Advanced DevOps & SRE': '#0891b2',
  'Creative Design Systems': '#ec4899',
};

export const PROMPT_CATEGORIES = [
  'Web Design', 'Mobile App', 'API/Backend', 'Dashboard', 'E-commerce', 'Landing Page', 'Component', 'General',
  'Advanced Coding', 'Technical Writing', 'Enterprise Marketing', 'Advanced UX/UI Design', 'Deep Learning & NLP',
  'Cloud Architecture & SRE', 'Advanced Cryptography & Web3', 'Financial Analysis & Strategy', 'Scientific Research',
  'Executive Productivity', 'Quantum Computing', 'Bioinformatics', 'Game Development', 'Web3 & Solidity',
  'Data Engineering', 'Cybersecurity & Pen Testing', 'Embedded Systems & IoT', 'AI Agents & LangChain',
  'Advanced DevOps & SRE', 'Creative Design Systems'
];

export const QUICK_PROMPTS = [
  'Create a modern SaaS landing page with hero section, pricing table, and CTA',
  'Build a responsive dashboard with charts and data tables',
  'Add a loading spinner to all async buttons',
  'Make the app fully mobile responsive',
  'Add proper error handling to all API calls',
  'Improve UI with better spacing and typography',
  'Add form validation to all inputs',
  'Fix all TypeScript/lint errors',
];
