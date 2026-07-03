#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║        ANTIGRAVITY MCP SERVER  — Model Context Protocol     ║
 * ║  Exposes all AI Labs & Agent capabilities as MCP tools      ║
 * ║  Port: 3100   Protocol: JSON-RPC 2.0 over stdio / HTTP SSE  ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const http = require("http");
const readline = require("readline");

// ─── MCP TOOL REGISTRY ────────────────────────────────────────────────────────

const TOOLS = [
  // ── AI Labs ───────────────────────────────────────────────────
  {
    name: "lab_list",
    description: "List all registered AI labs and their available models/features.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => ({ labs: Object.values(LAB_REGISTRY) }),
  },
  {
    name: "lab_connect",
    description: "Connect to an AI lab by ID and return its model list.",
    inputSchema: {
      type: "object",
      properties: { lab_id: { type: "string", description: "Lab identifier e.g. 'openai', 'anthropic'" } },
      required: ["lab_id"],
    },
    handler: ({ lab_id }) => {
      const lab = LAB_REGISTRY[lab_id];
      if (!lab) return { error: `Lab '${lab_id}' not found.` };
      return { connected: true, lab };
    },
  },
  {
    name: "lab_query",
    description: "Send a prompt to a specific model within a lab.",
    inputSchema: {
      type: "object",
      properties: {
        lab_id: { type: "string" },
        model_id: { type: "string" },
        prompt: { type: "string" },
      },
      required: ["lab_id", "model_id", "prompt"],
    },
    handler: ({ lab_id, model_id, prompt }) => {
      const lab = LAB_REGISTRY[lab_id];
      if (!lab) return { error: `Lab '${lab_id}' not found.` };
      const model = lab.models.find((m) => m.id === model_id);
      if (!model) return { error: `Model '${model_id}' not found in lab '${lab_id}'.` };
      return {
        lab: lab.name,
        model: model.name,
        prompt,
        response: `[MCP Mock] ${model.name} response to: "${prompt.slice(0, 60)}..."`,
        tokens_used: Math.floor(prompt.length * 1.3),
        latency_ms: model.latency_ms,
      };
    },
  },
  // ── Agent Tools ───────────────────────────────────────────────
  {
    name: "agent_list",
    description: "List all registered custom agents (Hermes, OpenCLAW, Ollama, LM Studio, custom webhooks).",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => ({ agents: agentRegistry }),
  },
  {
    name: "agent_register",
    description: "Register a new custom AI agent by name and endpoint.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        type: { type: "string", enum: ["ollama", "lmstudio", "openai_compat", "webhook", "hermes", "openclaw"] },
        endpoint: { type: "string" },
        model: { type: "string" },
        api_key: { type: "string" },
      },
      required: ["name", "type", "endpoint"],
    },
    handler: ({ name, type, endpoint, model, api_key }) => {
      const id = `agent_${Date.now()}`;
      const agent = { id, name, type, endpoint, model: model || "default", api_key: api_key ? "***" : null, status: "connected", registered_at: new Date().toISOString() };
      agentRegistry.push(agent);
      return { registered: true, agent };
    },
  },
  {
    name: "agent_dispatch",
    description: "Dispatch a task to a registered agent by ID.",
    inputSchema: {
      type: "object",
      properties: {
        agent_id: { type: "string" },
        task: { type: "string" },
        context: { type: "object" },
      },
      required: ["agent_id", "task"],
    },
    handler: ({ agent_id, task, context }) => {
      const agent = agentRegistry.find((a) => a.id === agent_id);
      if (!agent) return { error: `Agent '${agent_id}' not found.` };
      return {
        dispatched: true,
        agent: agent.name,
        task,
        result: `[MCP] Task dispatched to ${agent.name} at ${agent.endpoint}. Context keys: ${Object.keys(context || {}).join(", ") || "none"}.`,
        timestamp: new Date().toISOString(),
      };
    },
  },
  // ── MCP Meta ──────────────────────────────────────────────────
  {
    name: "mcp_status",
    description: "Get the status of the MCP server including connected labs and agents.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => ({
      server: "Antigravity MCP Server",
      version: "1.0.0",
      uptime_seconds: Math.floor((Date.now() - SERVER_START) / 1000),
      tools: TOOLS.length,
      labs: Object.keys(LAB_REGISTRY).length,
      agents: agentRegistry.length,
      protocol: "MCP 2024-11-05",
    }),
  },
];

// ─── AI LAB REGISTRY ──────────────────────────────────────────────────────────

const LAB_REGISTRY = {
  openai: {
    id: "openai", name: "OpenAI", emoji: "🤖", color: "#10b981",
    website: "https://openai.com", apiBase: "https://api.openai.com/v1",
    description: "Industry-leading AI research lab. Creator of GPT series and DALL-E.",
    features: ["Chat Completions", "Function Calling", "Vision", "DALL-E 3", "Whisper ASR", "TTS", "Embeddings", "Fine-tuning", "Assistants API", "Code Interpreter", "File Search"],
    models: [
      { id: "gpt-4o", name: "GPT-4o", context: "128K", cost: "$5/1M", latency_ms: 820, capability: ["vision", "code", "reasoning"] },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", context: "128K", cost: "$0.15/1M", latency_ms: 420, capability: ["chat", "code"] },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", context: "128K", cost: "$10/1M", latency_ms: 960, capability: ["vision", "reasoning"] },
      { id: "o1-preview", name: "o1 Preview", context: "128K", cost: "$15/1M", latency_ms: 3200, capability: ["deep-reasoning", "math", "science"] },
      { id: "o1-mini", name: "o1 Mini", context: "128K", cost: "$3/1M", latency_ms: 1800, capability: ["reasoning", "code"] },
      { id: "o3-mini", name: "o3 Mini", context: "128K", cost: "$1.1/1M", latency_ms: 2100, capability: ["advanced-reasoning"] },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", context: "16K", cost: "$0.5/1M", latency_ms: 350, capability: ["chat"] },
      { id: "dall-e-3", name: "DALL-E 3", context: "—", cost: "$0.04/img", latency_ms: 8000, capability: ["image-gen"] },
      { id: "whisper-1", name: "Whisper v3", context: "—", cost: "$0.006/min", latency_ms: 500, capability: ["asr", "translation"] },
      { id: "text-embedding-3-large", name: "Embeddings 3 Large", context: "8K", cost: "$0.13/1M", latency_ms: 120, capability: ["embeddings"] },
    ],
  },
  anthropic: {
    id: "anthropic", name: "Anthropic", emoji: "🧠", color: "#a78bfa",
    website: "https://anthropic.com", apiBase: "https://api.anthropic.com/v1",
    description: "AI safety company. Creator of the Claude model family with Constitutional AI.",
    features: ["Chat Completions", "Vision", "Tool Use", "Computer Use", "Extended Context 200K", "Streaming", "Batch Processing", "PDF/Document Analysis"],
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", context: "200K", cost: "$3/1M", latency_ms: 940, capability: ["vision", "code", "reasoning", "computer-use"] },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", context: "200K", cost: "$0.8/1M", latency_ms: 480, capability: ["chat", "code"] },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", context: "200K", cost: "$15/1M", latency_ms: 1600, capability: ["vision", "deep-reasoning"] },
      { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet", context: "200K", cost: "$3/1M", latency_ms: 900, capability: ["vision", "reasoning"] },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", context: "200K", cost: "$0.25/1M", latency_ms: 360, capability: ["chat"] },
    ],
  },
  google: {
    id: "google", name: "Google DeepMind", emoji: "✨", color: "#22d3ee",
    website: "https://deepmind.google", apiBase: "https://generativelanguage.googleapis.com/v1",
    description: "Gemini series — multi-modal AI with 1M+ context window and deep Google integration.",
    features: ["Chat", "Vision", "Audio", "Video Understanding", "1M Context", "Code Execution", "Google Search Grounding", "Function Calling", "Document AI", "Imagen 3", "Veo 2"],
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", context: "1M", cost: "$0.1/1M", latency_ms: 500, capability: ["multimodal", "code", "reasoning"] },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", context: "2M", cost: "$3.5/1M", latency_ms: 1100, capability: ["multimodal", "long-context", "reasoning"] },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", context: "1M", cost: "$0.075/1M", latency_ms: 480, capability: ["multimodal", "code"] },
      { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash-8B", context: "1M", cost: "$0.0375/1M", latency_ms: 280, capability: ["chat"] },
      { id: "gemini-pro", name: "Gemini Pro", context: "32K", cost: "$0.5/1M", latency_ms: 700, capability: ["chat", "code"] },
      { id: "imagen-3", name: "Imagen 3", context: "—", cost: "$0.03/img", latency_ms: 6000, capability: ["image-gen"] },
    ],
  },
  meta: {
    id: "meta", name: "Meta AI (Llama)", emoji: "🦙", color: "#f97316",
    website: "https://llama.meta.com", apiBase: "https://llama.meta.com/api",
    description: "Open-weight Llama models. Best-in-class open source LLMs for local and cloud deployment.",
    features: ["Chat", "Code", "Reasoning", "Multilingual", "Open Weights", "Local Deploy", "Fine-tuning", "GGUF Format"],
    models: [
      { id: "llama-3.3-70b", name: "Llama 3.3 70B", context: "128K", cost: "Free/self-host", latency_ms: 1400, capability: ["chat", "code", "reasoning"] },
      { id: "llama-3.1-405b", name: "Llama 3.1 405B", context: "128K", cost: "Self-host", latency_ms: 3200, capability: ["reasoning", "code"] },
      { id: "llama-3.2-90b", name: "Llama 3.2 90B Vision", context: "128K", cost: "Self-host", latency_ms: 2100, capability: ["vision", "reasoning"] },
      { id: "llama-3.2-11b", name: "Llama 3.2 11B Vision", context: "128K", cost: "Self-host", latency_ms: 900, capability: ["vision", "chat"] },
      { id: "llama-3.2-3b", name: "Llama 3.2 3B", context: "128K", cost: "Self-host", latency_ms: 350, capability: ["chat"] },
      { id: "llama-3.2-1b", name: "Llama 3.2 1B", context: "128K", cost: "Self-host", latency_ms: 180, capability: ["chat"] },
      { id: "codellama-70b", name: "Code Llama 70B", context: "100K", cost: "Self-host", latency_ms: 1800, capability: ["code"] },
    ],
  },
  mistral: {
    id: "mistral", name: "Mistral AI", emoji: "🌊", color: "#f5b731",
    website: "https://mistral.ai", apiBase: "https://api.mistral.ai/v1",
    description: "European AI lab. Mixture-of-Experts architecture with best efficiency ratios.",
    features: ["Chat", "Code", "Function Calling", "JSON Mode", "Embeddings", "Batch API", "Fine-tuning", "MoE Architecture"],
    models: [
      { id: "mistral-large-latest", name: "Mistral Large 2", context: "128K", cost: "$2/1M", latency_ms: 990, capability: ["reasoning", "code", "multilingual"] },
      { id: "mistral-small-latest", name: "Mistral Small 3", context: "32K", cost: "$0.1/1M", latency_ms: 420, capability: ["chat", "code"] },
      { id: "codestral-latest", name: "Codestral", context: "32K", cost: "$0.2/1M", latency_ms: 580, capability: ["code", "fill-in-middle"] },
      { id: "pixtral-large-latest", name: "Pixtral Large", context: "128K", cost: "$2/1M", latency_ms: 1200, capability: ["vision"] },
      { id: "mixtral-8x22b", name: "Mixtral 8x22B", context: "64K", cost: "$1.2/1M", latency_ms: 1100, capability: ["chat", "code"] },
      { id: "mixtral-8x7b", name: "Mixtral 8x7B", context: "32K", cost: "$0.24/1M", latency_ms: 650, capability: ["chat"] },
    ],
  },
  xai: {
    id: "xai", name: "xAI (Grok)", emoji: "⚡", color: "#60a5fa",
    website: "https://x.ai", apiBase: "https://api.x.ai/v1",
    description: "Elon Musk's AI lab. Grok models with real-time X/Twitter data and uncensored reasoning.",
    features: ["Chat", "Vision", "Real-time Data", "Code", "Function Calling", "X Integration", "Long Context"],
    models: [
      { id: "grok-2-1212", name: "Grok-2", context: "131K", cost: "$2/1M", latency_ms: 750, capability: ["chat", "code", "reasoning"] },
      { id: "grok-2-vision-1212", name: "Grok-2 Vision", context: "8K", cost: "$2/1M", latency_ms: 900, capability: ["vision"] },
      { id: "grok-beta", name: "Grok Beta", context: "131K", cost: "$5/1M", latency_ms: 850, capability: ["reasoning", "analysis"] },
    ],
  },
  deepseek: {
    id: "deepseek", name: "DeepSeek", emoji: "🔬", color: "#34d399",
    website: "https://deepseek.com", apiBase: "https://api.deepseek.com/v1",
    description: "Chinese AI lab with state-of-the-art reasoning models at ultra-low cost.",
    features: ["Chat", "Code", "Reasoning", "Math", "Function Calling", "JSON Mode", "Prefix Caching"],
    models: [
      { id: "deepseek-chat", name: "DeepSeek-V3", context: "64K", cost: "$0.27/1M", latency_ms: 1600, capability: ["chat", "code", "reasoning"] },
      { id: "deepseek-reasoner", name: "DeepSeek-R1", context: "64K", cost: "$0.55/1M", latency_ms: 4200, capability: ["deep-reasoning", "math", "science"] },
      { id: "deepseek-coder", name: "DeepSeek Coder V2", context: "128K", cost: "$0.14/1M", latency_ms: 1100, capability: ["code"] },
    ],
  },
  cohere: {
    id: "cohere", name: "Cohere", emoji: "🎯", color: "#f472b6",
    website: "https://cohere.com", apiBase: "https://api.cohere.com/v1",
    description: "Enterprise-focused NLP. Best-in-class RAG, embeddings, and reranking for production.",
    features: ["Chat", "RAG", "Embeddings", "Reranking", "Tool Use", "Grounded Generation", "Document Chat", "Fine-tuning"],
    models: [
      { id: "command-r-plus", name: "Command R+", context: "128K", cost: "$3/1M", latency_ms: 870, capability: ["rag", "reasoning", "tool-use"] },
      { id: "command-r", name: "Command R", context: "128K", cost: "$0.5/1M", latency_ms: 620, capability: ["rag", "chat"] },
      { id: "command-light", name: "Command Light", context: "4K", cost: "$0.3/1M", latency_ms: 380, capability: ["chat"] },
      { id: "embed-english-v3.0", name: "Embed v3 English", context: "512", cost: "$0.1/1M", latency_ms: 90, capability: ["embeddings"] },
      { id: "rerank-english-v3.0", name: "Rerank v3", context: "—", cost: "$0.002/query", latency_ms: 150, capability: ["reranking"] },
    ],
  },
  groq: {
    id: "groq", name: "Groq", emoji: "🚀", color: "#fb923c",
    website: "https://groq.com", apiBase: "https://api.groq.com/openai/v1",
    description: "Ultra-fast inference via custom LPU chips. 500+ tokens/sec. OpenAI-compatible API.",
    features: ["Ultra-fast Inference", "OpenAI-compatible API", "Llama Models", "Mixtral", "Whisper", "Vision"],
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", context: "128K", cost: "$0.59/1M", latency_ms: 120, capability: ["chat", "code"] },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", context: "128K", cost: "$0.05/1M", latency_ms: 40, capability: ["chat"] },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", context: "32K", cost: "$0.24/1M", latency_ms: 90, capability: ["chat", "code"] },
      { id: "whisper-large-v3", name: "Whisper Large v3", context: "—", cost: "$0.111/hr", latency_ms: 200, capability: ["asr"] },
    ],
  },
  together: {
    id: "together", name: "Together AI", emoji: "🔗", color: "#e879f9",
    website: "https://together.ai", apiBase: "https://api.together.xyz/v1",
    description: "Run 200+ open-source models in the cloud with fine-tuning and serverless inference.",
    features: ["200+ Models", "Fine-tuning", "Serverless", "OpenAI-compatible", "Image Gen", "Embeddings"],
    models: [
      { id: "meta-llama/Llama-3-70b-chat-hf", name: "Llama 3 70B Chat", context: "8K", cost: "$0.9/1M", latency_ms: 800, capability: ["chat"] },
      { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", name: "Mixtral 8x7B Instruct", context: "32K", cost: "$0.6/1M", latency_ms: 650, capability: ["chat", "code"] },
      { id: "NousResearch/Nous-Hermes-2-Yi-34B", name: "Hermes 2 Yi 34B", context: "4K", cost: "$0.8/1M", latency_ms: 900, capability: ["chat", "reasoning"] },
      { id: "teknium/OpenHermes-2.5-Mistral-7B", name: "OpenHermes 2.5 Mistral", context: "4K", cost: "$0.2/1M", latency_ms: 350, capability: ["chat", "code"] },
    ],
  },
  perplexity: {
    id: "perplexity", name: "Perplexity AI", emoji: "🌐", color: "#818cf8",
    website: "https://perplexity.ai", apiBase: "https://api.perplexity.ai",
    description: "AI search engine with real-time web retrieval and source citations.",
    features: ["Real-time Web Search", "Source Citations", "RAG", "Online Models", "Offline Models"],
    models: [
      { id: "llama-3.1-sonar-large-128k-online", name: "Sonar Large Online", context: "127K", cost: "$1/1M", latency_ms: 1200, capability: ["web-search", "reasoning"] },
      { id: "llama-3.1-sonar-small-128k-online", name: "Sonar Small Online", context: "127K", cost: "$0.2/1M", latency_ms: 600, capability: ["web-search", "chat"] },
      { id: "llama-3.1-sonar-huge-128k-online", name: "Sonar Huge Online", context: "127K", cost: "$5/1M", latency_ms: 2000, capability: ["web-search", "deep-reasoning"] },
    ],
  },
  fireworks: {
    id: "fireworks", name: "Fireworks AI", emoji: "🎆", color: "#fbbf24",
    website: "https://fireworks.ai", apiBase: "https://api.fireworks.ai/inference/v1",
    description: "Fast serverless inference for open models with compound AI and function calling.",
    features: ["Fast Inference", "Function Calling", "Grammar Mode", "Speculative Decoding", "LoRA Fine-tuning"],
    models: [
      { id: "accounts/fireworks/models/llama-v3p1-70b-instruct", name: "Llama 3.1 70B", context: "131K", cost: "$0.9/1M", latency_ms: 400, capability: ["chat", "code"] },
      { id: "accounts/fireworks/models/mixtral-8x22b-instruct", name: "Mixtral 8x22B", context: "65K", cost: "$1.2/1M", latency_ms: 700, capability: ["chat"] },
      { id: "accounts/fireworks/models/hermes-2-pro-mistral-7b", name: "Hermes 2 Pro Mistral 7B", context: "4K", cost: "$0.2/1M", latency_ms: 220, capability: ["function-calling", "code"] },
    ],
  },
  ollama: {
    id: "ollama", name: "Ollama (Local)", emoji: "🏠", color: "#6ee7b7",
    website: "https://ollama.com", apiBase: "http://localhost:11434/api",
    description: "Run LLMs locally on your machine. No API key needed. Privacy-first.",
    features: ["100% Local", "No API Key", "GPU Acceleration", "OpenAI-compatible", "Custom Models", "GGUF/GGML"],
    models: [
      { id: "llama3.2", name: "Llama 3.2 3B", context: "128K", cost: "Free", latency_ms: 400, capability: ["chat"] },
      { id: "mistral", name: "Mistral 7B", context: "8K", cost: "Free", latency_ms: 380, capability: ["chat", "code"] },
      { id: "codellama", name: "Code Llama", context: "100K", cost: "Free", latency_ms: 450, capability: ["code"] },
      { id: "phi3", name: "Phi-3 Mini", context: "128K", cost: "Free", latency_ms: 200, capability: ["chat"] },
      { id: "gemma2", name: "Gemma 2 9B", context: "8K", cost: "Free", latency_ms: 500, capability: ["chat"] },
      { id: "deepseek-r1", name: "DeepSeek R1", context: "64K", cost: "Free", latency_ms: 2000, capability: ["reasoning"] },
    ],
  },
  lmstudio: {
    id: "lmstudio", name: "LM Studio (Local)", emoji: "🖥️", color: "#94a3b8",
    website: "https://lmstudio.ai", apiBase: "http://localhost:1234/v1",
    description: "Desktop app for running local LLMs with OpenAI-compatible API server.",
    features: ["Local Models", "OpenAI-compatible", "GGUF Support", "GPU Offloading", "Model Manager", "Chat UI"],
    models: [
      { id: "local-model", name: "Any Local GGUF Model", context: "Varies", cost: "Free", latency_ms: 500, capability: ["chat", "code"] },
    ],
  },
};

// ─── AGENT REGISTRY (mutable, starts with well-known agents) ──────────────────

const agentRegistry = [
  {
    id: "hermes-001", name: "Nous Hermes 3", type: "ollama",
    endpoint: "http://localhost:11434/api", model: "hermes3",
    description: "Advanced instruction-following and function calling agent by NousResearch.",
    status: "available", registered_at: new Date().toISOString(),
  },
  {
    id: "openclaw-001", name: "OpenCLAW", type: "openai_compat",
    endpoint: "http://localhost:8080/v1", model: "openclaw",
    description: "Open-source CLAW (Contextual Language Agent Workflow) framework agent.",
    status: "available", registered_at: new Date().toISOString(),
  },
  {
    id: "autogen-001", name: "AutoGen Agent", type: "webhook",
    endpoint: "http://localhost:8000/autogen", model: "gpt-4o",
    description: "Microsoft AutoGen multi-agent conversation framework.",
    status: "available", registered_at: new Date().toISOString(),
  },
  {
    id: "crewai-001", name: "CrewAI Agent", type: "webhook",
    endpoint: "http://localhost:8001/crew", model: "gpt-4o",
    description: "CrewAI role-playing multi-agent orchestration framework.",
    status: "available", registered_at: new Date().toISOString(),
  },
  {
    id: "phidata-001", name: "Phidata Agent", type: "openai_compat",
    endpoint: "http://localhost:7777/v1", model: "phi-3",
    description: "Phidata toolkit for building AI agents with memory, knowledge, tools.",
    status: "available", registered_at: new Date().toISOString(),
  },
];

const SERVER_START = Date.now();

// ─── JSON-RPC 2.0 HANDLER ────────────────────────────────────────────────────

function handleJsonRpc(body) {
  try {
    const req = JSON.parse(body);
    const respond = (result, error) => ({
      jsonrpc: "2.0", id: req.id ?? null,
      ...(error ? { error: { code: -32600, message: error } } : { result }),
    });

    if (req.method === "initialize") {
      return respond({
        protocolVersion: "2024-11-05",
        serverInfo: { name: "Antigravity MCP Server", version: "1.0.0" },
        capabilities: { tools: { listChanged: false } },
      });
    }

    if (req.method === "tools/list") {
      return respond({
        tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
      });
    }

    if (req.method === "tools/call") {
      const { name, arguments: args } = req.params;
      const tool = TOOLS.find((t) => t.name === name);
      if (!tool) return respond(null, `Tool '${name}' not found.`);
      const result = tool.handler(args || {});
      return respond({ content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
    }

    return respond(null, `Method '${req.method}' not supported.`);
  } catch (e) {
    return { jsonrpc: "2.0", id: null, error: { code: -32700, message: `Parse error: ${e.message}` } };
  }
}

// ─── HTTP SERVER (SSE + REST) ────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  // SSE endpoint for MCP clients
  if (req.method === "GET" && req.url === "/sse") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write(`data: ${JSON.stringify({ type: "connected", server: "Antigravity MCP", version: "1.0.0" })}\n\n`);
    const heartbeat = setInterval(() => res.write(": ping\n\n"), 15000);
    req.on("close", () => clearInterval(heartbeat));
    return;
  }

  // REST: tools list
  if (req.method === "GET" && req.url === "/tools") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) }));
  }

  // REST: labs list
  if (req.method === "GET" && req.url === "/labs") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ labs: Object.values(LAB_REGISTRY) }));
  }

  // REST: agents list
  if (req.method === "GET" && req.url === "/agents") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ agents: agentRegistry }));
  }

  // REST: status
  if (req.method === "GET" && req.url === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      server: "Antigravity MCP Server", version: "1.0.0",
      uptime_seconds: Math.floor((Date.now() - SERVER_START) / 1000),
      tools: TOOLS.length, labs: Object.keys(LAB_REGISTRY).length, agents: agentRegistry.length,
    }));
  }

  // JSON-RPC 2.0 endpoint
  if (req.method === "POST" && req.url === "/rpc") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const result = handleJsonRpc(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }

  // Register agent via REST
  if (req.method === "POST" && req.url === "/agents/register") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const agent = { id: `agent_${Date.now()}`, ...data, status: "connected", registered_at: new Date().toISOString() };
        agentRegistry.push(agent);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ registered: true, agent }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

const PORT = process.env.MCP_PORT || 3100;
server.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════════════╗`);
  console.log(`║  🤖 Antigravity MCP Server v1.0.0 — RUNNING          ║`);
  console.log(`║  Port : ${PORT}                                       ║`);
  console.log(`║  Tools: ${TOOLS.length}   Labs: ${Object.keys(LAB_REGISTRY).length}   Agents: ${agentRegistry.length}             ║`);
  console.log(`║  SSE  : http://localhost:${PORT}/sse                  ║`);
  console.log(`║  RPC  : http://localhost:${PORT}/rpc                  ║`);
  console.log(`║  Labs : http://localhost:${PORT}/labs                 ║`);
  console.log(`╚══════════════════════════════════════════════════════╝\n`);
});

// Stdio mode for Claude Desktop / Cursor MCP integration
if (process.stdin.isTTY === false) {
  const rl = readline.createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    if (!line.trim()) return;
    const result = handleJsonRpc(line);
    process.stdout.write(JSON.stringify(result) + "\n");
  });
}
