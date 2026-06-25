// PromptCompiler.js — Compiles multiple customized prompt variants for batch broadcast
import { resolveString } from './ConfigResolver.js';
import { hasUnresolvedVariables } from './VariableScanner.js';

export function compileVariants(promptTemplate, accountVariables = []) {
  return accountVariables.map((vars, i) => {
    const compiled = resolveString(promptTemplate, vars);
    const unresolved = hasUnresolvedVariables(compiled, vars);
    return {
      index: i,
      accountId: vars.accountId || vars.id,
      platform: vars.platform,
      label: vars.label || `Variant ${i + 1}`,
      prompt: compiled,
      unresolved,
      ready: unresolved.length === 0,
      charCount: compiled.length,
    };
  });
}

export function compileForAccounts(promptTemplate, accounts, globalVars = {}) {
  return accounts.map(account => {
    const vars = { ...globalVars, ...account, accountId: account.id };
    return {
      accountId: account.id,
      platform: account.platform,
      label: account.label,
      prompt: resolveString(promptTemplate, vars),
      unresolved: hasUnresolvedVariables(promptTemplate, vars),
    };
  });
}

export function previewCompile(template, sampleVars = {}) {
  const defaultSamples = {
    appName: 'MyApp', theme: 'dark', language: 'TypeScript',
    framework: 'React', description: 'A modern web application',
    date: new Date().toLocaleDateString(),
  };
  return resolveString(template, { ...defaultSamples, ...sampleVars });
}
