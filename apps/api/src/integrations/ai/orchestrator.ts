/**
 * AI Orchestrator — Multi-model AI with smart routing, caching, and cost tracking.
 * Adapted from AI-orchestration-system- repo.
 * Supports: OpenAI, Claude, Groq, Ollama (local), Gemini
 */

export interface AIModel {
  id: string;
  name: string;
  endpoint: string;
  needsKey: boolean;
  costPer1MTokens: number;
  speed: 'ultra-fast' | 'fast' | 'medium' | 'slow';
  reliability: number;
  maxTokens: number;
}

export interface AIResponse {
  text: string;
  model: string;
  tokensUsed: number;
  cost: number;
  latencyMs: number;
  cached: boolean;
}

export interface OrchestratorConfig {
  apiKeys: Record<string, string>;
  defaultModel: string;
  maxBudgetPerDay: number;
  cacheEnabled: boolean;
  cacheTTLMs: number;
}

const AI_MODELS: Record<string, AIModel> = {
  openai: {
    id: 'openai',
    name: 'OpenAI GPT-4',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    needsKey: true,
    costPer1MTokens: 30,
    speed: 'medium',
    reliability: 0.99,
    maxTokens: 128000,
  },
  'openai-mini': {
    id: 'openai-mini',
    name: 'OpenAI GPT-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    needsKey: true,
    costPer1MTokens: 0.15,
    speed: 'fast',
    reliability: 0.99,
    maxTokens: 128000,
  },
  claude: {
    id: 'claude',
    name: 'Claude Sonnet',
    endpoint: 'https://api.anthropic.com/v1/messages',
    needsKey: true,
    costPer1MTokens: 3,
    speed: 'medium',
    reliability: 0.98,
    maxTokens: 200000,
  },
  groq: {
    id: 'groq',
    name: 'Groq Mixtral',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    needsKey: true,
    costPer1MTokens: 0.27,
    speed: 'ultra-fast',
    reliability: 0.95,
    maxTokens: 32768,
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local)',
    endpoint: 'http://localhost:11434/api/chat',
    needsKey: false,
    costPer1MTokens: 0,
    speed: 'fast',
    reliability: 0.9,
    maxTokens: 32768,
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    needsKey: true,
    costPer1MTokens: 0.5,
    speed: 'fast',
    reliability: 0.97,
    maxTokens: 1000000,
  },
};

// In-memory cache
const responseCache = new Map<string, { response: AIResponse; timestamp: number }>();

// Cost tracking
let dailyCost = 0;
let lastCostReset = Date.now();

/**
 * Smart model selection based on query type and budget.
 */
function selectBestModel(
  config: OrchestratorConfig,
  queryType: 'simple' | 'complex' | 'code' | 'analysis',
  priority: 'urgent' | 'normal' | 'low'
): string {
  const availableModels = Object.values(AI_MODELS).filter(
    (m) => !m.needsKey || config.apiKeys[m.id]
  );

  if (availableModels.length === 0) return 'ollama';

  // Reset daily cost if new day
  if (Date.now() - lastCostReset > 86400000) {
    dailyCost = 0;
    lastCostReset = Date.now();
  }

  // Budget check
  if (dailyCost >= config.maxBudgetPerDay) {
    return availableModels.filter((m) => m.costPer1MTokens === 0)[0]?.id || 'ollama';
  }

  // Priority-based selection
  if (priority === 'urgent') {
    return availableModels.sort((a, b) => {
      const speedOrder = { 'ultra-fast': 0, fast: 1, medium: 2, slow: 3 };
      return speedOrder[a.speed] - speedOrder[b.speed];
    })[0].id;
  }

  if (priority === 'low' || queryType === 'simple') {
    return availableModels.sort((a, b) => a.costPer1MTokens - b.costPer1MTokens)[0].id;
  }

  // Complex queries use best model
  if (queryType === 'complex' || queryType === 'analysis') {
    return availableModels.sort((a, b) => b.reliability - a.reliability)[0].id;
  }

  return config.defaultModel;
}

/**
 * Generate cache key from message and model.
 */
function getCacheKey(message: string, model: string): string {
  return `${message.toLowerCase().trim().slice(0, 200)}_${model}`;
}

/**
 * Call OpenAI-compatible API.
 */
async function callOpenAI(
  endpoint: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  model: string
): Promise<{ text: string; tokens: number }> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0]?.message?.content || '',
    tokens: data.usage?.total_tokens || 0,
  };
}

/**
 * Call Claude API.
 */
async function callClaude(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
): Promise<{ text: string; tokens: number }> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: messages.filter((m) => m.role !== 'system'),
      system: messages.find((m) => m.role === 'system')?.content,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    text: data.content[0]?.text || '',
    tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0,
  };
}

/**
 * Call Ollama (local) API.
 */
async function callOllama(
  messages: Array<{ role: string; content: string }>
): Promise<{ text: string; tokens: number }> {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return {
    text: data.message?.content || '',
    tokens: data.eval_count || 0,
  };
}

/**
 * Main orchestrator function — routes to best model, handles caching and fallback.
 */
export async function askAI(
  config: OrchestratorConfig,
  messages: Array<{ role: string; content: string }>,
  options?: {
    queryType?: 'simple' | 'complex' | 'code' | 'analysis';
    priority?: 'urgent' | 'normal' | 'low';
    forceModel?: string;
  }
): Promise<AIResponse> {
  const queryType = options?.queryType || 'simple';
  const priority = options?.priority || 'normal';
  const modelId = options?.forceModel || selectBestModel(config, queryType, priority);
  const model = AI_MODELS[modelId] || AI_MODELS['ollama'];

  // Check cache
  const lastUserMessage = messages[messages.length - 1]?.content || '';
  const cacheKey = getCacheKey(lastUserMessage, modelId);

  if (config.cacheEnabled) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < config.cacheTTLMs) {
      return { ...cached.response, cached: true };
    }
  }

  // Call the selected model
  const startTime = Date.now();
  let result: { text: string; tokens: number };

  try {
    if (modelId === 'claude') {
      result = await callClaude(config.apiKeys.claude, messages);
    } else if (modelId === 'ollama') {
      result = await callOllama(messages);
    } else {
      // OpenAI-compatible (openai, groq, openai-mini)
      const apiKey = config.apiKeys[modelId] || '';
      const modelName =
        modelId === 'groq' ? 'mixtral-8x7b-32768' :
        modelId === 'openai-mini' ? 'gpt-4o-mini' : 'gpt-4-turbo-preview';
      result = await callOpenAI(model.endpoint, apiKey, messages, modelName);
    }
  } catch (error) {
    // Fallback to next available model
    console.error(`[AI Orchestrator] ${modelId} failed, trying fallback:`, error);
    const fallbackOrder = ['groq', 'openai-mini', 'ollama', 'claude', 'openai'];
    for (const fallbackId of fallbackOrder) {
      if (fallbackId === modelId) continue;
      const fb = AI_MODELS[fallbackId];
      if (fb.needsKey && !config.apiKeys[fallbackId]) continue;
      try {
        if (fallbackId === 'ollama') {
          result = await callOllama(messages);
        } else if (fallbackId === 'claude') {
          result = await callClaude(config.apiKeys.claude, messages);
        } else {
          result = await callOpenAI(fb.endpoint, config.apiKeys[fallbackId], messages, 'gpt-4o-mini');
        }
        break;
      } catch {
        continue;
      }
    }
    if (!result!) {
      return {
        text: 'All AI models are unavailable. Please check your API keys and try again.',
        model: 'none',
        tokensUsed: 0,
        cost: 0,
        latencyMs: Date.now() - startTime,
        cached: false,
      };
    }
  }

  const latencyMs = Date.now() - startTime;
  const cost = (result.tokens / 1000000) * model.costPer1MTokens;
  dailyCost += cost;

  const response: AIResponse = {
    text: result.text,
    model: modelId,
    tokensUsed: result.tokens,
    cost,
    latencyMs,
    cached: false,
  };

  // Update cache
  if (config.cacheEnabled) {
    responseCache.set(cacheKey, { response, timestamp: Date.now() });
  }

  return response;
}

/**
 * Specialized AI functions for RemoteDesk.
 */
export const remoteDesk_AI = {
  /** Diagnose a remote machine issue based on system info */
  async diagnoseIssue(config: OrchestratorConfig, systemInfo: string, userDescription: string): Promise<AIResponse> {
    return askAI(config, [
      { role: 'system', content: 'You are an expert IT support AI for RemoteDesk. Diagnose issues and provide step-by-step fixes. Be concise and actionable.' },
      { role: 'user', content: `System Info:\n${systemInfo}\n\nUser Issue:\n${userDescription}` },
    ], { queryType: 'analysis', priority: 'urgent' });
  },

  /** Generate automation script for a task */
  async generateScript(config: OrchestratorConfig, task: string, os: string): Promise<AIResponse> {
    return askAI(config, [
      { role: 'system', content: `You are a script generator for ${os}. Generate safe, tested scripts. Include error handling. Output only the script code.` },
      { role: 'user', content: task },
    ], { queryType: 'code', priority: 'normal' });
  },

  /** Analyze security event */
  async analyzeSecurityEvent(config: OrchestratorConfig, event: string): Promise<AIResponse> {
    return askAI(config, [
      { role: 'system', content: 'You are a cybersecurity analyst. Analyze the security event and determine: 1) Severity (low/medium/high/critical), 2) Is it a threat?, 3) Recommended action. Be concise.' },
      { role: 'user', content: event },
    ], { queryType: 'analysis', priority: 'urgent' });
  },

  /** Smart chat assistant */
  async chat(config: OrchestratorConfig, history: Array<{ role: string; content: string }>): Promise<AIResponse> {
    const systemMsg = { role: 'system', content: 'You are RemoteDesk AI Assistant. Help users with remote desktop tasks, troubleshooting, and IT support. Be helpful and concise.' };
    return askAI(config, [systemMsg, ...history], { queryType: 'simple', priority: 'normal' });
  },
};

export { AI_MODELS, selectBestModel };
export default { askAI, remoteDesk_AI, AI_MODELS };
