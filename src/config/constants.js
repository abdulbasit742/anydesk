// constants.js — Application-wide constants
export const APP_NAME    = 'Bolt Studio Pro';
export const APP_VERSION = '1.0.0';
export const APP_BUILD   = 'enterprise';

export const MAX_ACCOUNTS        = 50;
export const MAX_PROJECTS        = 200;
export const MAX_WORKFLOW_NODES  = 100;
export const MAX_BROADCAST_SIZE  = 500;
export const MAX_HISTORY_ITEMS   = 20;
export const MAX_UNDO_STEPS      = 40;
export const MAX_CACHE_ENTRIES   = 500;
export const CACHE_DEFAULT_TTL   = 5 * 60 * 1000;   // 5 min
export const SESSION_TIMEOUT_MS  = 30 * 60 * 1000;  // 30 min

export const CHARS_PER_TOKEN     = 4;
export const TOKEN_WARNING_PCT   = 0.70;
export const TOKEN_CRITICAL_PCT  = 0.90;

export const KEY_ROTATION_DAYS   = 90;
export const KEY_WARNING_DAYS    = 75;
export const FIPS_MIN_BITS       = 112;
export const GDPR_MIN_BITS       = 128;

export const BROADCAST_CHANNEL   = 'bsp-sync-channel';
export const STORAGE_KEY_STATE   = 'bsp_state_v3';
export const STORAGE_KEY_DRAFTS  = 'bsp_drafts_v1';
export const STORAGE_KEY_PREFS   = 'bsp_prefs_v1';

export const TELEMETRY_INTERVAL  = 2000;
export const RADAR_TICK_RATE     = 100;

export const PLATFORMS = ['bolt', 'lovable', 'manus', 'replit', 'claude', 'cursor', 'v0'];

export const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: '⬡' },
  { id: 'accounts',   label: 'Accounts',   icon: '◈' },
  { id: 'broadcast',  label: 'Broadcast',  icon: '⚡' },
  { id: 'workflows',  label: 'Workflows',  icon: '⬡' },
  { id: 'projects',   label: 'Projects',   icon: '◻' },
  { id: 'analytics',  label: 'Analytics',  icon: '◎' },
  { id: 'security',   label: 'Security',   icon: '⬟' },
  { id: 'library',    label: 'Library',    icon: '◧' },
  { id: 'settings',   label: 'Settings',   icon: '◈' },
];
