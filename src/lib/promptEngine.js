// src/lib/promptEngine.js
// PromptEngine — parse, compose, inject, score prompts

const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

class PromptEngine {
  constructor() {
    this._cache = new Map();
  }

  /**
   * parse(text) — extract all {{variable}} names from a prompt template.
   * Returns { variables: string[], raw: string, tokenCount: number }
   */
  parse(text) {
    if (typeof text !== 'string') throw new TypeError('PromptEngine.parse: text must be a string');
    const variables = [];
    const seen = new Set();
    let match;
    const rx = new RegExp(VARIABLE_REGEX.source, 'g');
    while ((match = rx.exec(text)) !== null) {
      const name = match[1];
      if (!seen.has(name)) {
        seen.add(name);
        variables.push(name);
      }
    }
    return {
      variables,
      raw: text,
      tokenCount: Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.35),
    };
  }

  /**
   * compose(blocks) — join an array of block objects into a final prompt string.
   * Each block: { type: string, content: string, label?: string }
   * Blocks are separated by double newlines; labelled blocks get a heading.
   */
  compose(blocks) {
    if (!Array.isArray(blocks)) throw new TypeError('PromptEngine.compose: blocks must be an array');
    const parts = blocks
      .filter((b) => b && typeof b.content === 'string' && b.content.trim())
      .map((b) => {
        const label = b.label || this._defaultLabel(b.type);
        return label ? `### ${label}\n${b.content.trim()}` : b.content.trim();
      });
    return parts.join('\n\n');
  }

  _defaultLabel(type) {
    const labels = {
      role: 'Role',
      task: 'Task',
      context: 'Context',
      format: 'Output Format',
      constraints: 'Constraints',
      examples: 'Examples',
      audience: 'Audience',
    };
    return labels[type] || '';
  }

  /**
   * inject(template, vars) — replace all {{variable}} placeholders with values.
   * Vars is a plain object { varName: value }.
   * Returns { result: string, unfilled: string[] }
   */
  inject(template, vars = {}) {
    if (typeof template !== 'string') throw new TypeError('PromptEngine.inject: template must be a string');
    const unfilled = [];
    const result = template.replace(new RegExp(VARIABLE_REGEX.source, 'g'), (_, name) => {
      if (Object.prototype.hasOwnProperty.call(vars, name) && vars[name] !== undefined && vars[name] !== null) {
        return String(vars[name]);
      }
      unfilled.push(name);
      return `{{${name}}}`;
    });
    return { result, unfilled };
  }

  /**
   * score(prompt) — quality score 0-100.
   * Criteria:
   *   +20 has a role section (### Role / "you are" / "act as")
   *   +20 has a task section (### Task / verb-led imperative)
   *   +15 has a format section (### Output Format / format:)
   *   +15 has context (### Context / "context:")
   *   +10 has constraints (### Constraints / "do not" / "avoid")
   *   +10 word count ≥ 50 (proportional up to 200 words)
   *   +10 no unfilled variables (all {{var}} resolved)
   */
  score(prompt) {
    if (typeof prompt !== 'string') return 0;
    const lower = prompt.toLowerCase();
    let score = 0;

    // Role
    if (/###\s*role/i.test(prompt) || /\byou are\b/i.test(prompt) || /\bact as\b/i.test(prompt)) score += 20;

    // Task
    if (/###\s*task/i.test(prompt) || /\b(write|create|generate|analyze|summarize|explain|list|describe|build)\b/i.test(lower)) score += 20;

    // Format
    if (/###\s*output format/i.test(prompt) || /\bformat\s*:/i.test(lower) || /\bresponse format\b/i.test(lower)) score += 15;

    // Context
    if (/###\s*context/i.test(prompt) || /\bcontext\s*:/i.test(lower) || /\bbackground\b/i.test(lower)) score += 15;

    // Constraints
    if (/###\s*constraints/i.test(prompt) || /\bdo not\b/i.test(lower) || /\bavoid\b/i.test(lower) || /\bmust not\b/i.test(lower)) score += 10;

    // Word count (proportional 0-10 for 0-200 words)
    const words = prompt.split(/\s+/).filter(Boolean).length;
    const wordScore = Math.min(10, Math.floor((words / 200) * 10));
    score += wordScore;

    // Unfilled variables penalty
    const unfilledCount = (prompt.match(VARIABLE_REGEX) || []).length;
    if (unfilledCount === 0) score += 10;
    else score = Math.max(0, score - unfilledCount * 3);

    return Math.min(100, Math.max(0, score));
  }
}

const promptEngine = new PromptEngine();
export default promptEngine;
export { PromptEngine };
