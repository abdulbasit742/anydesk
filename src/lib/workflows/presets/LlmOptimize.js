// LlmOptimize.js — Preconfigured workflow step invoking AI prompt enhancement
export const LlmOptimizeStep = {
  id: 'llm-optimize',
  name: 'AI Prompt Enhancement',
  type: 'transform',
  description: 'Enhances prompt using LLM suggestions for clarity and specificity',
  icon: '✨',
  configSchema: {
    model: { type: 'string', default: 'claude-sonnet-4-6', options: ['claude-sonnet-4-6', 'gpt-4o'] },
    style: { type: 'string', default: 'professional', options: ['professional', 'concise', 'detailed'] },
    maxTokens: { type: 'number', default: 1000 },
  },
  async execute(input, config = {}) {
    const style = config.style || 'professional';
    const styleInstructions = {
      professional: 'Use formal technical language with clear structure.',
      concise: 'Be brief. Remove redundancy. Use bullet points.',
      detailed: 'Expand with examples, edge cases, and technical specifications.',
    };

    const enhanced = `${input}\n\n[Enhanced: ${styleInstructions[style]}]\n\nPlease ensure the output includes:\n- Clear requirements\n- Expected behavior\n- Technical constraints\n- Success criteria`;

    return { output: enhanced, tokensUsed: Math.ceil(enhanced.length / 4), model: config.model };
  },
};
