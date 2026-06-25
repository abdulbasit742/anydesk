// platformConfig.js — Full platform metadata, credential schemas, feature flags
export const PLATFORM_CONFIG = {
  bolt: {
    id: 'bolt',
    name: 'Bolt.new',
    description: 'StackBlitz AI full-stack app generator',
    color: '#FF6B35',
    icon: '⚡',
    url: 'https://bolt.new',
    credentialSchema: [
      { key: 'sessionToken', label: 'Session Token', type: 'password', minLength: 32, hint: 'From bolt.new cookie' },
    ],
    features: { streaming: true, multiFile: true, preview: true, deploy: true },
    latencyProfile: 'bolt',
    maxTokensPerCall: 8000,
  },
  lovable: {
    id: 'lovable',
    name: 'Lovable.dev',
    description: 'AI-powered React app builder with Git integration',
    color: '#FF4D8F',
    icon: '♥',
    url: 'https://lovable.dev',
    credentialSchema: [
      { key: 'apiKey',   label: 'API Key',   type: 'password', minLength: 20 },
      { key: 'repoSlug', label: 'Repo Slug', type: 'text',     hint: 'your-project-name' },
    ],
    features: { streaming: false, multiFile: true, preview: true, deploy: true, git: true },
    latencyProfile: 'lovable',
    maxTokensPerCall: 6000,
  },
  manus: {
    id: 'manus',
    name: 'Manus',
    description: 'Autonomous multi-step AI agent with browser tools',
    color: '#AA44FF',
    icon: '◈',
    url: 'https://manus.im',
    credentialSchema: [
      { key: 'apiKey',     label: 'API Key',    type: 'password', minLength: 24 },
      { key: 'agentId',    label: 'Agent ID',   type: 'text' },
    ],
    features: { streaming: true, multiFile: false, preview: false, deploy: false, browserUse: true },
    latencyProfile: 'manus',
    maxTokensPerCall: 4000,
  },
  replit: {
    id: 'replit',
    name: 'Replit',
    description: 'Cloud IDE with AI coding assistant',
    color: '#F26207',
    icon: '▶',
    url: 'https://replit.com',
    credentialSchema: [
      { key: 'token',     label: 'Replit Token', type: 'password', minLength: 16 },
      { key: 'replSlug',  label: 'Repl Slug',    type: 'text' },
    ],
    features: { streaming: true, multiFile: true, preview: true, deploy: true, shell: true },
    latencyProfile: 'replit',
    maxTokensPerCall: 6000,
  },
  claude: {
    id: 'claude',
    name: 'Claude (Anthropic)',
    description: 'Anthropic Claude conversational AI API',
    color: '#CC785C',
    icon: '◎',
    url: 'https://claude.ai',
    credentialSchema: [
      { key: 'apiKey',  label: 'API Key',    type: 'password', minLength: 20, hint: 'sk-ant-...' },
      { key: 'model',   label: 'Model',      type: 'select', options: ['claude-sonnet-4-6', 'claude-opus-4-7', 'claude-haiku-4-5-20251001'] },
    ],
    features: { streaming: true, multiFile: false, preview: false, deploy: false, vision: true },
    latencyProfile: 'claude',
    maxTokensPerCall: 100000,
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-powered code editor with pair programming',
    color: '#00AAFF',
    icon: '▍',
    url: 'https://cursor.sh',
    credentialSchema: [
      { key: 'apiKey',    label: 'API Key',       type: 'password', minLength: 20 },
      { key: 'workspace', label: 'Workspace Path', type: 'text',    hint: '/home/user/myproject' },
    ],
    features: { streaming: true, multiFile: true, preview: false, deploy: false, typeCheck: true },
    latencyProfile: 'cursor',
    maxTokensPerCall: 8000,
  },
  v0: {
    id: 'v0',
    name: 'v0.dev',
    description: 'Vercel generative UI component builder',
    color: '#888888',
    icon: '◻',
    url: 'https://v0.dev',
    credentialSchema: [
      { key: 'apiKey', label: 'API Key', type: 'password', minLength: 16 },
    ],
    features: { streaming: false, multiFile: false, preview: true, deploy: false, shadcn: true },
    latencyProfile: 'v0',
    maxTokensPerCall: 4000,
  },
};

export function getPlatform(id) {
  return PLATFORM_CONFIG[id] || null;
}

export function getAllPlatforms() {
  return Object.values(PLATFORM_CONFIG);
}

export function getCredentialSchema(platformId) {
  return PLATFORM_CONFIG[platformId]?.credentialSchema || [];
}

export function hasFeature(platformId, feature) {
  return !!PLATFORM_CONFIG[platformId]?.features?.[feature];
}
