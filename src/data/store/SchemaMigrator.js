// SchemaMigrator.js — Auto-migrates user projects/keys schema between app versions
const CURRENT_VERSION = 3;

const migrations = {
  1: state => ({
    ...state,
    version: 1,
    platforms: state.platforms || [],
    projects: state.projects || [],
  }),
  2: state => ({
    ...state,
    version: 2,
    accounts: state.accounts || state.platforms || [],
    workflows: state.workflows || [],
    platforms: undefined,
  }),
  3: state => ({
    ...state,
    version: 3,
    telemetry: state.telemetry || { enabled: true, interval: 5000 },
    security: state.security || { keyRotationDays: 90, mfaEnabled: false },
  }),
};

export function migrateSchema(rawState) {
  if (!rawState) return getDefaultState();

  let state = { ...rawState };
  const fromVersion = state.version || 0;

  if (fromVersion === CURRENT_VERSION) return state;

  for (let v = fromVersion + 1; v <= CURRENT_VERSION; v++) {
    if (migrations[v]) {
      state = migrations[v](state);
      console.info(`[SchemaMigrator] Migrated to v${v}`);
    }
  }

  return state;
}

export function getDefaultState() {
  return {
    version: CURRENT_VERSION,
    accounts: [],
    projects: [],
    workflows: [],
    telemetry: { enabled: true, interval: 5000 },
    security: { keyRotationDays: 90, mfaEnabled: false },
  };
}

export function validateSchema(state) {
  const required = ['version', 'accounts', 'projects', 'workflows'];
  return required.every(k => k in state);
}
