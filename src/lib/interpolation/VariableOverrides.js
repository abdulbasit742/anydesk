// VariableOverrides.js — Sets default variable fallbacks when accounts have blank configs
export function applyOverrides(variables, defaults = {}, overrides = {}) {
  const result = { ...defaults };
  for (const [key, value] of Object.entries(variables)) {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value;
    }
  }
  return { ...result, ...overrides };
}

export function mergeWithDefaults(accountVars, templateDefaults) {
  return templateDefaults.map(def => ({
    ...def,
    value: accountVars[def.name] !== undefined && accountVars[def.name] !== ''
      ? accountVars[def.name]
      : def.default ?? '',
    isDefault: !(def.name in accountVars) || accountVars[def.name] === '',
  }));
}

export function getEffectiveVariables(accountVars, globalDefaults, templateDefaults) {
  const effective = { ...globalDefaults };
  for (const def of templateDefaults) {
    if (def.name in accountVars && accountVars[def.name] !== '') {
      effective[def.name] = accountVars[def.name];
    } else if (def.default !== undefined) {
      effective[def.name] = def.default;
    }
  }
  return effective;
}

export function diffVariables(base, override) {
  const changed = {};
  const allKeys = new Set([...Object.keys(base), ...Object.keys(override)]);
  for (const key of allKeys) {
    if (base[key] !== override[key]) {
      changed[key] = { from: base[key], to: override[key] };
    }
  }
  return changed;
}
