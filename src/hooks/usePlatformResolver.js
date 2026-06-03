// usePlatformResolver.js — Translates platform IDs to HSL swatches, icons, URL formats
import { useMemo } from 'react';

const PLATFORM_MAP = {
  bolt: { label: 'Bolt.new', hsl: 'hsl(45, 100%, 55%)', icon: '⚡', domain: 'bolt.new', color: '#FFB800' },
  lovable: { label: 'Lovable', hsl: 'hsl(330, 80%, 60%)', icon: '❤️', domain: 'lovable.dev', color: '#FF4D8F' },
  manus: { label: 'Manus', hsl: 'hsl(200, 70%, 50%)', icon: '🤖', domain: 'manus.ai', color: '#1A9FD4' },
  replit: { label: 'Replit', hsl: 'hsl(15, 90%, 55%)', icon: '🔁', domain: 'replit.com', color: '#F26207' },
  cursor: { label: 'Cursor', hsl: 'hsl(240, 60%, 65%)', icon: '📝', domain: 'cursor.sh', color: '#6B6BFF' },
  v0: { label: 'v0.dev', hsl: 'hsl(0, 0%, 90%)', icon: '🎨', domain: 'v0.dev', color: '#E5E5E5' },
  claude: { label: 'Claude', hsl: 'hsl(25, 90%, 60%)', icon: '🧠', domain: 'claude.ai', color: '#D4571A' },
};

export function usePlatformResolver(platformId) {
  const resolved = useMemo(() => {
    const key = (platformId || '').toLowerCase();
    return PLATFORM_MAP[key] || {
      label: platformId || 'Unknown',
      hsl: 'hsl(0, 0%, 50%)',
      icon: '🔷',
      domain: null,
      color: '#888',
    };
  }, [platformId]);

  return resolved;
}

export function resolveAll() {
  return PLATFORM_MAP;
}

export function getCredentialSchema(platformId) {
  const schemas = {
    bolt: [{ key: 'sessionCookie', label: 'Session Cookie', type: 'password' }],
    lovable: [{ key: 'apiToken', label: 'API Token', type: 'password' }],
    claude: [{ key: 'sessionKey', label: 'Session Key', type: 'password' }],
    default: [{ key: 'apiKey', label: 'API Key', type: 'password' }],
  };
  return schemas[platformId?.toLowerCase()] || schemas.default;
}
