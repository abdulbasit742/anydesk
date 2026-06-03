// ValueValidator.js — Ensures variables adhere to designated types
const VALIDATORS = {
  string: (v) => typeof v === 'string',
  number: (v) => !isNaN(Number(v)),
  boolean: (v) => v === 'true' || v === 'false' || typeof v === 'boolean',
  url: (v) => { try { new URL(v); return true; } catch { return false; } },
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
  hsl: (v) => /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(String(v)),
  hex: (v) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(String(v)),
  alphanumeric: (v) => /^[a-zA-Z0-9_-]+$/.test(String(v)),
  nonempty: (v) => String(v).trim().length > 0,
  maxlength: (max) => (v) => String(v).length <= max,
};

export function validateValue(value, type) {
  const validator = VALIDATORS[type];
  if (!validator) return { valid: true };
  const valid = typeof validator === 'function' ? validator(value) : false;
  return { valid, type, value };
}

export function validateVariables(variables, schema = {}) {
  const errors = {};
  for (const [key, rules] of Object.entries(schema)) {
    const value = variables[key];
    const ruleList = Array.isArray(rules) ? rules : [rules];
    for (const rule of ruleList) {
      const result = validateValue(value, rule);
      if (!result.valid) {
        errors[key] = errors[key] || [];
        errors[key].push(`Must be valid ${rule}`);
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function coerceValue(value, type) {
  if (type === 'number') return Number(value);
  if (type === 'boolean') return value === 'true' || value === true;
  return String(value);
}
