// validators.js — form validation utilities
const ok  = (message = '') => ({ valid: true, message });
const err = (message)      => ({ valid: false, message });

export const isRequired  = v => v?.toString().trim() ? ok() : err('This field is required');
export const isEmail     = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? ok() : err('Enter a valid email address');
export const isUrl       = v => { try { new URL(v); return ok(); } catch { return err('Enter a valid URL'); } };
export const isJson      = v => { try { JSON.parse(v); return ok(); } catch { return err('Invalid JSON'); } };
export const minLength   = (n) => v => (v?.length >= n) ? ok() : err(`Minimum ${n} characters`);
export const maxLength   = (n) => v => (v?.length <= n) ? ok() : err(`Maximum ${n} characters`);
export const isNumber    = v => isNaN(Number(v)) ? err('Must be a number') : ok();
export const isPositive  = v => Number(v) > 0 ? ok() : err('Must be positive');
export const isApiKey    = v => v?.length >= 8 ? ok() : err('API key too short');
export const isCron      = v => /^(\*|[0-9,-/]+)\s+(\*|[0-9,-/]+)\s+(\*|[0-9,-/]+)\s+(\*|[0-9,-/]+)\s+(\*|[0-9,-/]+)$/.test(v?.trim()) ? ok() : err('Invalid cron expression');
export const isSemver    = v => /^\d+\.\d+\.\d+/.test(v) ? ok() : err('Use semver format: x.y.z');

export const validate = (value, ...rules) => {
  for (const rule of rules) {
    const result = rule(value);
    if (!result.valid) return result;
  }
  return ok();
};

export const validateForm = (form, schema) => {
  const errors = {};
  let valid = true;
  for (const [field, rules] of Object.entries(schema)) {
    const result = validate(form[field], ...rules);
    if (!result.valid) { errors[field] = result.message; valid = false; }
  }
  return { valid, errors };
};
