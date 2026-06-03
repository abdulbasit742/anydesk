// VariableScanner.js — Scans prompts for variables like {{appName}}, {{theme}}
const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

export function scanVariables(text) {
  const found = new Set();
  let match;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    found.add(match[1]);
  }
  VARIABLE_REGEX.lastIndex = 0;
  return [...found];
}

export function countOccurrences(text, variableName) {
  const pattern = new RegExp(`\\{\\{${variableName}\\}\\}`, 'g');
  return (text.match(pattern) || []).length;
}

export function scanAll(text) {
  const variables = scanVariables(text);
  return variables.map(name => ({
    name,
    occurrences: countOccurrences(text, name),
    positions: [...text.matchAll(new RegExp(`\\{\\{${name}\\}\\}`, 'g'))].map(m => m.index),
  }));
}

export function hasUnresolvedVariables(text, values = {}) {
  const found = scanVariables(text);
  return found.filter(v => !(v in values) || values[v] === undefined || values[v] === '');
}

export function highlightVariables(text, resolvedVars = {}) {
  return text.replace(VARIABLE_REGEX, (match, name) => {
    const isResolved = name in resolvedVars && resolvedVars[name] !== '';
    return isResolved ? `[${resolvedVars[name]}]` : match;
  });
}
