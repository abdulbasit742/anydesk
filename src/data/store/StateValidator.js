// StateValidator.js — Strict schema verification for store state integrity
const schemas = {
  account: {
    required: ['id', 'platform', 'label'],
    types: { id: 'string', platform: 'string', label: 'string', apiKey: 'string', active: 'boolean' },
  },
  project: {
    required: ['id', 'name'],
    types: { id: 'string', name: 'string', tasks: 'array', createdAt: 'string' },
  },
  workflow: {
    required: ['id', 'name', 'steps'],
    types: { id: 'string', name: 'string', steps: 'array', enabled: 'boolean' },
  },
};

export function validateEntity(type, entity) {
  const schema = schemas[type];
  if (!schema) return { valid: false, errors: [`Unknown schema type: ${type}`] };

  const errors = [];

  for (const field of schema.required) {
    if (!(field in entity)) errors.push(`Missing required field: ${field}`);
  }

  for (const [field, expectedType] of Object.entries(schema.types)) {
    if (!(field in entity)) continue;
    const val = entity[field];
    const actualType = Array.isArray(val) ? 'array' : typeof val;
    if (actualType !== expectedType) {
      errors.push(`Field "${field}" expected ${expectedType}, got ${actualType}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateState(state) {
  const allErrors = {};

  (state.accounts || []).forEach((a, i) => {
    const res = validateEntity('account', a);
    if (!res.valid) allErrors[`accounts[${i}]`] = res.errors;
  });

  (state.projects || []).forEach((p, i) => {
    const res = validateEntity('project', p);
    if (!res.valid) allErrors[`projects[${i}]`] = res.errors;
  });

  (state.workflows || []).forEach((w, i) => {
    const res = validateEntity('workflow', w);
    if (!res.valid) allErrors[`workflows[${i}]`] = res.errors;
  });

  return { valid: Object.keys(allErrors).length === 0, errors: allErrors };
}

export function sanitizeEntity(type, entity) {
  const schema = schemas[type];
  if (!schema) return entity;
  const sanitized = {};
  for (const field of schema.required) sanitized[field] = entity[field];
  for (const field of Object.keys(schema.types)) {
    if (field in entity) sanitized[field] = entity[field];
  }
  return sanitized;
}
