// ConfigResolver.js — Maps key-value sets dynamically for each platform account context
export function resolveConfig(template, variables, account = {}) {
  const context = {
    platform: account.platform || '',
    accountLabel: account.label || '',
    accountId: account.id || '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    ...variables,
  };

  return Object.fromEntries(
    Object.entries(template).map(([key, value]) => {
      if (typeof value === 'string') {
        const resolved = value.replace(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g, (_, name) =>
          name in context ? String(context[name]) : `{{${name}}}`
        );
        return [key, resolved];
      }
      return [key, value];
    })
  );
}

export function resolveString(template, variables) {
  return template.replace(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g, (_, name) =>
    name in variables ? String(variables[name]) : `{{${name}}}`
  );
}

export function mergeConfigs(...configs) {
  return Object.assign({}, ...configs);
}

export function validateConfig(config, required = []) {
  const missing = required.filter(key => !(key in config) || config[key] === '');
  return { valid: missing.length === 0, missing };
}
