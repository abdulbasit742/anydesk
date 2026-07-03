import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const MCP_SERVER = "http://localhost:3100";

const AI_LABS = [
  {
    id: "openai", name: "OpenAI", emoji: "🤖", color: "#10b981", tier: "Tier 1",
    website: "https://openai.com", apiBase: "https://api.openai.com/v1",
    description: "Industry-leading AI research lab. Creator of GPT-4o, o3, DALL-E, and Whisper.",
    tags: ["Chat", "Vision", "Image Gen", "Speech", "Embeddings", "Reasoning"],
    features: [
      { name: "Chat Completions", icon: "💬", desc: "GPT-4o, o1, o3 — streaming, function calling" },
      { name: "Vision / Multimodal", icon: "👁️", desc: "Image input, document analysis, screenshots" },
      { name: "DALL-E 3 Image Gen", icon: "🎨", desc: "Photo-realistic image generation from text" },
      { name: "Whisper ASR", icon: "🎤", desc: "State-of-the-art speech-to-text, 99 languages" },
      { name: "TTS Voice", icon: "🔊", desc: "6 neural voices, real-time streaming audio" },
      { name: "Embeddings v3", icon: "📐", desc: "3072-dim vectors for semantic search & RAG" },
      { name: "Assistants API", icon: "🧑‍💼", desc: "Stateful agents with code interpreter & file search" },
      { name: "Fine-tuning", icon: "🎯", desc: "Custom model training on your data" },
      { name: "Batch API", icon: "📦", desc: "50% cost reduction for async large-scale tasks" },
      { name: "o1 Deep Reasoning", icon: "🧠", desc: "Chain-of-thought reasoning for STEM & coding" },
    ],
    models: [
      { id: "gpt-4o", name: "GPT-4o", ctx: "128K", cost: "$5/1M", ms: 820, tags: ["vision", "code"] },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", ctx: "128K", cost: "$0.15/1M", ms: 420, tags: ["fast", "cheap"] },
      { id: "o1-preview", name: "o1 Preview", ctx: "128K", cost: "$15/1M", ms: 3200, tags: ["reasoning"] },
      { id: "o3-mini", name: "o3 Mini", ctx: "128K", cost: "$1.1/1M", ms: 2100, tags: ["reasoning"] },
      { id: "dall-e-3", name: "DALL-E 3", ctx: "—", cost: "$0.04/img", ms: 8000, tags: ["image"] },
      { id: "whisper-1", name: "Whisper v3", ctx: "—", cost: "$0.006/min", ms: 500, tags: ["audio"] },
    ],
  },
  {
    id: "anthropic", name: "Anthropic", emoji: "🧠", color: "#a78bfa", tier: "Tier 1",
    website: "https://anthropic.com", apiBase: "https://api.anthropic.com/v1",
    description: "AI safety-focused lab. Claude 3.5 Sonnet with 200K context and Computer Use.",
    tags: ["Chat", "Vision", "Computer Use", "Code", "Safety"],
    features: [
      { name: "Claude Chat", icon: "💬", desc: "200K context, nuanced reasoning, analysis" },
      { name: "Computer Use", icon: "🖥️", desc: "Claude controls desktop apps, browsers, terminals" },
      { name: "Vision & Documents", icon: "👁️", desc: "PDF, images, charts, screenshots analysis" },
      { name: "Tool Use / Function Calling", icon: "🔧", desc: "Structured JSON tool invocation" },
      { name: "Batch Processing", icon: "📦", desc: "Async batch jobs with 50% cost savings" },
      { name: "Extended Thinking", icon: "🧠", desc: "Chain-of-thought reasoning mode" },
      { name: "Streaming", icon: "⚡", desc: "Real-time token streaming responses" },
      { name: "Constitutional AI", icon: "🛡️", desc: "Built-in safety via RLAIF training" },
    ],
    models: [
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", ctx: "200K", cost: "$3/1M", ms: 940, tags: ["vision", "code", "computer-use"] },
      { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", ctx: "200K", cost: "$0.8/1M", ms: 480, tags: ["fast"] },
      { id: "claude-3-opus", name: "Claude 3 Opus", ctx: "200K", cost: "$15/1M", ms: 1600, tags: ["power"] },
      { id: "claude-3-haiku", name: "Claude 3 Haiku", ctx: "200K", cost: "$0.25/1M", ms: 360, tags: ["cheap"] },
    ],
  },
  {
    id: "google", name: "Google DeepMind", emoji: "✨", color: "#22d3ee", tier: "Tier 1",
    website: "https://deepmind.google", apiBase: "https://generativelanguage.googleapis.com/v1",
    description: "Gemini 2.0 — multimodal AI with 2M token context and native tool integration.",
    tags: ["Multimodal", "Long Context", "Search", "Code", "Image Gen"],
    features: [
      { name: "Gemini Chat", icon: "💬", desc: "Up to 2M token context window" },
      { name: "Video Understanding", icon: "🎬", desc: "Analyze full movies, YouTube videos" },
      { name: "Audio Processing", icon: "🎵", desc: "Native audio input, music analysis" },
      { name: "Google Search Grounding", icon: "🌐", desc: "Real-time web search integration" },
      { name: "Code Execution", icon: "⚙️", desc: "Sandboxed Python execution in context" },
      { name: "Imagen 3", icon: "🎨", desc: "Photorealistic image generation" },
      { name: "Veo 2 Video Gen", icon: "🎞️", desc: "AI video generation from text" },
      { name: "Document AI", icon: "📄", desc: "Parse PDFs, forms, invoices at scale" },
    ],
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", ctx: "1M", cost: "$0.1/1M", ms: 500, tags: ["fast", "multimodal"] },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", ctx: "2M", cost: "$3.5/1M", ms: 1100, tags: ["long-context"] },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", ctx: "1M", cost: "$0.075/1M", ms: 480, tags: ["fast"] },
      { id: "imagen-3", name: "Imagen 3", ctx: "—", cost: "$0.03/img", ms: 6000, tags: ["image"] },
    ],
  },
  {
    id: "meta", name: "Meta AI (Llama)", emoji: "🦙", color: "#f97316", tier: "Tier 1",
    website: "https://llama.meta.com", apiBase: "https://llama.meta.com/api",
    description: "Open-weight Llama 3 — run locally or in cloud, 100% open source and free.",
    tags: ["Open Source", "Local", "Chat", "Code", "Vision"],
    features: [
      { name: "Open Weights", icon: "🔓", desc: "Full model weights publicly available" },
      { name: "Local Deploy", icon: "🏠", desc: "Run on your own GPU with Ollama/llama.cpp" },
      { name: "Vision Models", icon: "👁️", desc: "Llama 3.2 Vision for image understanding" },
      { name: "Fine-tuning Ready", icon: "🎯", desc: "LoRA, QLoRA, full fine-tuning supported" },
      { name: "GGUF/GGML Format", icon: "📦", desc: "Quantized formats for consumer hardware" },
      { name: "Commercial License", icon: "💼", desc: "Llama license for commercial products" },
      { name: "Multilingual", icon: "🌍", desc: "8 languages including Arabic, Hindi, Chinese" },
    ],
    models: [
      { id: "llama-3.3-70b", name: "Llama 3.3 70B", ctx: "128K", cost: "Free", ms: 1400, tags: ["reasoning"] },
      { id: "llama-3.1-405b", name: "Llama 3.1 405B", ctx: "128K", cost: "Self-host", ms: 3200, tags: ["power"] },
      { id: "llama-3.2-90b-vision", name: "Llama 3.2 90B Vision", ctx: "128K", cost: "Free", ms: 2100, tags: ["vision"] },
      { id: "llama-3.2-3b", name: "Llama 3.2 3B", ctx: "128K", cost: "Free", ms: 350, tags: ["tiny", "fast"] },
    ],
  },
  {
    id: "mistral", name: "Mistral AI", emoji: "🌊", color: "#f5b731", tier: "Tier 2",
    website: "https://mistral.ai", apiBase: "https://api.mistral.ai/v1",
    description: "European AI leader. MoE architecture gives best performance-per-dollar ratios.",
    tags: ["Code", "Efficiency", "MoE", "Multilingual", "Open"],
    features: [
      { name: "Chat Completions", icon: "💬", desc: "Mistral Large, Small with JSON mode" },
      { name: "Codestral Code", icon: "💻", desc: "Dedicated code model with fill-in-middle" },
      { name: "Pixtral Vision", icon: "👁️", desc: "Native vision capability in Pixtral series" },
      { name: "Function Calling", icon: "🔧", desc: "Structured tool use and JSON output" },
      { name: "Embeddings", icon: "📐", desc: "High-quality text embeddings API" },
      { name: "MoE Architecture", icon: "🏗️", desc: "Mixture-of-Experts for efficient inference" },
    ],
    models: [
      { id: "mistral-large", name: "Mistral Large 2", ctx: "128K", cost: "$2/1M", ms: 990, tags: ["reasoning"] },
      { id: "codestral", name: "Codestral", ctx: "32K", cost: "$0.2/1M", ms: 580, tags: ["code"] },
      { id: "pixtral-large", name: "Pixtral Large", ctx: "128K", cost: "$2/1M", ms: 1200, tags: ["vision"] },
      { id: "mixtral-8x7b", name: "Mixtral 8x7B", ctx: "32K", cost: "$0.24/1M", ms: 650, tags: ["open"] },
    ],
  },
  {
    id: "xai", name: "xAI (Grok)", emoji: "⚡", color: "#60a5fa", tier: "Tier 2",
    website: "https://x.ai", apiBase: "https://api.x.ai/v1",
    description: "Grok-2 with real-time X/Twitter data access, uncensored reasoning.",
    tags: ["Real-time", "X Integration", "Code", "Vision"],
    features: [
      { name: "Grok Chat", icon: "💬", desc: "Fast, witty, uncensored reasoning" },
      { name: "Real-time X Data", icon: "🐦", desc: "Live access to X/Twitter posts and trends" },
      { name: "Vision Input", icon: "👁️", desc: "Image understanding with Grok-2 Vision" },
      { name: "Long Context", icon: "📏", desc: "131K token context window" },
    ],
    models: [
      { id: "grok-2", name: "Grok-2", ctx: "131K", cost: "$2/1M", ms: 750, tags: ["reasoning"] },
      { id: "grok-2-vision", name: "Grok-2 Vision", ctx: "8K", cost: "$2/1M", ms: 900, tags: ["vision"] },
    ],
  },
  {
    id: "deepseek", name: "DeepSeek", emoji: "🔬", color: "#34d399", tier: "Tier 2",
    website: "https://deepseek.com", apiBase: "https://api.deepseek.com/v1",
    description: "Chinese AI lab — DeepSeek-R1 rivals o1 at 3% of the cost. Open source.",
    tags: ["Reasoning", "Math", "Code", "Ultra-cheap", "Open Source"],
    features: [
      { name: "DeepSeek Chat", icon: "💬", desc: "V3 model with $0.27/1M token pricing" },
      { name: "R1 Reasoning", icon: "🧠", desc: "Chain-of-thought rivaling OpenAI o1" },
      { name: "DeepSeek Coder", icon: "💻", desc: "Specialized coding model, 128K context" },
      { name: "Prefix Caching", icon: "💾", desc: "90% cache discount for repeated prefixes" },
    ],
    models: [
      { id: "deepseek-chat", name: "DeepSeek-V3", ctx: "64K", cost: "$0.27/1M", ms: 1600, tags: ["chat"] },
      { id: "deepseek-reasoner", name: "DeepSeek-R1", ctx: "64K", cost: "$0.55/1M", ms: 4200, tags: ["reasoning"] },
    ],
  },
  {
    id: "groq", name: "Groq", emoji: "🚀", color: "#fb923c", tier: "Tier 2",
    website: "https://groq.com", apiBase: "https://api.groq.com/openai/v1",
    description: "Fastest LLM inference in the world. 500+ tokens/sec via custom LPU chips.",
    tags: ["Ultra-fast", "OpenAI-compat", "Llama", "Whisper"],
    features: [
      { name: "LPU Inference", icon: "⚡", desc: "500+ tokens/sec — 10x faster than GPU" },
      { name: "OpenAI-compatible API", icon: "🔌", desc: "Drop-in replacement, same SDK" },
      { name: "Whisper ASR", icon: "🎤", desc: "Fast speech-to-text transcription" },
      { name: "Free Tier", icon: "🆓", desc: "Generous free tier for development" },
    ],
    models: [
      { id: "llama-3.3-70b", name: "Llama 3.3 70B", ctx: "128K", cost: "$0.59/1M", ms: 120, tags: ["fast"] },
      { id: "llama-3.1-8b", name: "Llama 3.1 8B Instant", ctx: "128K", cost: "$0.05/1M", ms: 40, tags: ["fastest"] },
    ],
  },
  {
    id: "together", name: "Together AI", emoji: "🔗", color: "#e879f9", tier: "Tier 3",
    website: "https://together.ai", apiBase: "https://api.together.xyz/v1",
    description: "200+ open-source models with fine-tuning, serverless, OpenAI-compatible API.",
    tags: ["200+ Models", "Fine-tuning", "Hermes", "Open Source"],
    features: [
      { name: "200+ Open Models", icon: "🌐", desc: "Llama, Mistral, Hermes, Falcon and more" },
      { name: "Fine-tuning API", icon: "🎯", desc: "Train custom adapters on any model" },
      { name: "Serverless Deploy", icon: "☁️", desc: "Auto-scaling zero-infra inference" },
      { name: "Hermes Models", icon: "🏛️", desc: "NousResearch Hermes series access" },
    ],
    models: [
      { id: "hermes-2-yi-34b", name: "Hermes 2 Yi 34B", ctx: "4K", cost: "$0.8/1M", ms: 900, tags: ["function-calling"] },
      { id: "openhermes-mistral-7b", name: "OpenHermes 2.5 Mistral", ctx: "4K", cost: "$0.2/1M", ms: 350, tags: ["chat"] },
      { id: "llama-3-70b", name: "Llama 3 70B Chat", ctx: "8K", cost: "$0.9/1M", ms: 800, tags: ["chat"] },
    ],
  },
  {
    id: "perplexity", name: "Perplexity AI", emoji: "🌐", color: "#818cf8", tier: "Tier 3",
    website: "https://perplexity.ai", apiBase: "https://api.perplexity.ai",
    description: "AI search with real-time web retrieval and inline source citations.",
    tags: ["Web Search", "RAG", "Citations", "Real-time"],
    features: [
      { name: "Real-time Search", icon: "🔍", desc: "Live web retrieval in every response" },
      { name: "Source Citations", icon: "📖", desc: "Inline references with URLs" },
      { name: "Online/Offline Modes", icon: "📡", desc: "Switch between web-grounded and offline" },
    ],
    models: [
      { id: "sonar-large-online", name: "Sonar Large Online", ctx: "127K", cost: "$1/1M", ms: 1200, tags: ["web-search"] },
      { id: "sonar-small-online", name: "Sonar Small Online", ctx: "127K", cost: "$0.2/1M", ms: 600, tags: ["fast", "web-search"] },
    ],
  },
  {
    id: "cohere", name: "Cohere", emoji: "🎯", color: "#f472b6", tier: "Tier 3",
    website: "https://cohere.com", apiBase: "https://api.cohere.com/v1",
    description: "Enterprise NLP. Best-in-class RAG pipeline with embeddings + reranking.",
    tags: ["RAG", "Embeddings", "Reranking", "Enterprise"],
    features: [
      { name: "Command R+ Chat", icon: "💬", desc: "Enterprise-grade RAG-optimized model" },
      { name: "Embeddings v3", icon: "📐", desc: "Multilingual semantic search embeddings" },
      { name: "Rerank v3", icon: "🏆", desc: "Precision reranking for RAG pipelines" },
      { name: "Grounded Generation", icon: "📄", desc: "Document-based response with citations" },
    ],
    models: [
      { id: "command-r-plus", name: "Command R+", ctx: "128K", cost: "$3/1M", ms: 870, tags: ["rag"] },
      { id: "embed-v3", name: "Embed v3 Multilingual", ctx: "512", cost: "$0.1/1M", ms: 90, tags: ["embed"] },
    ],
  },
  {
    id: "ollama", name: "Ollama (Local)", emoji: "🏠", color: "#6ee7b7", tier: "Local",
    website: "https://ollama.com", apiBase: "http://localhost:11434/api",
    description: "Run any LLM locally on your machine. 100% private, no API key required.",
    tags: ["Local", "Private", "Free", "GPU", "GGUF"],
    features: [
      { name: "100% Local", icon: "🔒", desc: "All data stays on your device" },
      { name: "No API Key", icon: "🆓", desc: "Completely free, no account needed" },
      { name: "GPU Acceleration", icon: "⚡", desc: "CUDA, Metal, ROCm support" },
      { name: "OpenAI-compatible API", icon: "🔌", desc: "Drop-in replacement at localhost:11434" },
      { name: "Model Library", icon: "📚", desc: "Download models with one command: `ollama pull llama3`" },
    ],
    models: [
      { id: "llama3.2", name: "Llama 3.2 3B", ctx: "128K", cost: "Free", ms: 400, tags: ["local"] },
      { id: "mistral", name: "Mistral 7B", ctx: "8K", cost: "Free", ms: 380, tags: ["local"] },
      { id: "deepseek-r1", name: "DeepSeek R1", ctx: "64K", cost: "Free", ms: 2000, tags: ["local", "reasoning"] },
      { id: "phi3", name: "Phi-3 Mini", ctx: "128K", cost: "Free", ms: 200, tags: ["tiny"] },
    ],
  },
  {
    id: "lmstudio", name: "LM Studio (Local)", emoji: "🖥️", color: "#94a3b8", tier: "Local",
    website: "https://lmstudio.ai", apiBase: "http://localhost:1234/v1",
    description: "Desktop app for running local models with a GUI and OpenAI-compatible server.",
    tags: ["Local", "Desktop", "GGUF", "GUI"],
    features: [
      { name: "Desktop GUI", icon: "🎨", desc: "Visual model manager and chat interface" },
      { name: "Local Server", icon: "🔌", desc: "OpenAI-compatible API on localhost:1234" },
      { name: "GGUF Support", icon: "📦", desc: "Load any GGUF model from HuggingFace" },
      { name: "GPU Offloading", icon: "⚡", desc: "Configurable GPU layer offloading" },
    ],
    models: [
      { id: "local-model", name: "Any GGUF Model", ctx: "Varies", cost: "Free", ms: 500, tags: ["local"] },
    ],
  },
];

const UNIVERSAL_AGENTS = [
  { id: "hermes", name: "Nous Hermes 3", emoji: "🏛️", color: "#f59e0b", type: "ollama", defaultEndpoint: "http://localhost:11434", defaultModel: "hermes3", desc: "Advanced function-calling and instruction-following agent by NousResearch.", capabilities: ["Function Calling", "Tool Use", "Chat", "Code"] },
  { id: "openclaw", name: "OpenCLAW", emoji: "🦞", color: "#ef4444", type: "openai_compat", defaultEndpoint: "http://localhost:8080/v1", defaultModel: "openclaw", desc: "Contextual Language Agent Workflow — open-source agentic framework.", capabilities: ["Agents", "Workflows", "Tool Orchestration"] },
  { id: "autogen", name: "AutoGen (Microsoft)", emoji: "🤝", color: "#0ea5e9", type: "webhook", defaultEndpoint: "http://localhost:8000/autogen", defaultModel: "gpt-4o", desc: "Microsoft AutoGen multi-agent conversation framework.", capabilities: ["Multi-agent", "Code Execution", "Human-in-loop"] },
  { id: "crewai", name: "CrewAI", emoji: "🎭", color: "#8b5cf6", type: "webhook", defaultEndpoint: "http://localhost:8001/crew", defaultModel: "gpt-4o", desc: "Role-playing agents as a crew. Each agent has a role, goal, backstory.", capabilities: ["Role-play", "Task Delegation", "Sequential/Parallel"] },
  { id: "langchain", name: "LangChain Agent", emoji: "⛓️", color: "#22c55e", type: "webhook", defaultEndpoint: "http://localhost:8002/langchain", defaultModel: "gpt-4o", desc: "LangChain ReAct/Plan-and-Execute agents with tools and memory.", capabilities: ["Tool Use", "Memory", "RAG", "Chains"] },
  { id: "phidata", name: "Phidata Agent", emoji: "🧬", color: "#ec4899", type: "openai_compat", defaultEndpoint: "http://localhost:7777/v1", defaultModel: "phi-3", desc: "Phidata: agents with memory, knowledge, tools in a lightweight framework.", capabilities: ["Memory", "Knowledge", "Web Search", "Finance"] },
  { id: "llamaindex", name: "LlamaIndex Agent", emoji: "🦙", color: "#f97316", type: "webhook", defaultEndpoint: "http://localhost:8003/llamaindex", defaultModel: "gpt-4o", desc: "LlamaIndex data agents with advanced RAG and query planning.", capabilities: ["RAG", "Query Planning", "Data Analysis"] },
  { id: "agentgpt", name: "AgentGPT", emoji: "🌐", color: "#a78bfa", type: "webhook", defaultEndpoint: "https://agentgpt.reworkd.ai/api", defaultModel: "gpt-4o", desc: "Browser-based autonomous GPT-4 agent with goal-oriented task execution.", capabilities: ["Autonomous", "Web Browsing", "Goal Execution"] },
  { id: "opendevin", name: "OpenDevin", emoji: "👨‍💻", color: "#34d399", type: "openai_compat", defaultEndpoint: "http://localhost:3001/v1", defaultModel: "gpt-4o", desc: "Open-source software engineering agent. Codes, debugs, deploys.", capabilities: ["Software Engineering", "Bash", "Browser", "File I/O"] },
  { id: "custom", name: "Custom Agent", emoji: "⚙️", color: "#64748b", type: "custom", defaultEndpoint: "", defaultModel: "", desc: "Connect any OpenAI-compatible or webhook-based agent endpoint.", capabilities: ["Custom", "Any API"] },
];

const TIER_COLORS = { "Tier 1": "#10b981", "Tier 2": "#f59e0b", "Tier 3": "#a78bfa", "Local": "#6ee7b7" };

// ─── STYLES ───────────────────────────────────────────────────────────────────

const S = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d1f 50%, #090914 100%)", color: "#f0f0f5", fontFamily: "'Inter', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden" },
  glow1: { position: "fixed", top: -200, left: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
  glow2: { position: "fixed", bottom: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },

  hero: { position: "relative", zIndex: 1, padding: "48px 40px 32px", background: "linear-gradient(180deg, rgba(167,139,250,0.08) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  heroTitle: { margin: "0 0 6px", fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  heroSub: { margin: "0 0 18px", fontSize: 14, color: "#6e7191", lineHeight: 1.6 },
  badges: { display: "flex", flexWrap: "wrap", gap: 8 },
  badge: (c) => ({ padding: "4px 12px", borderRadius: 20, background: `${c}18`, border: `1px solid ${c}44`, color: c, fontSize: 11, fontWeight: 700 }),

  tabBar: { display: "flex", gap: 0, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, margin: "24px 40px 0", zIndex: 1, position: "relative", width: "max-content" },
  tab: (active) => ({
    padding: "9px 22px", borderRadius: 9, border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
    background: active ? "linear-gradient(135deg,#a78bfa,#7c3aed)" : "transparent",
    color: active ? "#fff" : "#6e7191",
  }),

  body: { display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, minHeight: "calc(100vh - 260px)", position: "relative", zIndex: 1 },

  sidebar: { padding: "20px 16px", borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", maxHeight: "calc(100vh - 260px)" },
  sidebarTitle: { fontSize: 10, fontWeight: 700, color: "#4a4a6a", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10, paddingLeft: 4 },

  labItem: (active, color) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
    background: active ? `${color}15` : "transparent",
    border: `1px solid ${active ? color + "44" : "transparent"}`,
    marginBottom: 4, transition: "all 0.18s",
  }),
  labEmoji: { fontSize: 18, lineHeight: 1 },
  labMeta: { flex: 1 },
  labName: { fontSize: 12, fontWeight: 600, color: "#f0f0f5", marginBottom: 2 },
  labTier: (c) => ({ fontSize: 9, fontWeight: 700, color: c, background: `${c}18`, borderRadius: 4, padding: "1px 5px" }),

  main: { padding: "24px 32px", overflowY: "auto", maxHeight: "calc(100vh - 260px)" },

  labHeader: (color) => ({ background: `linear-gradient(135deg, ${color}18, transparent)`, border: `1px solid ${color}33`, borderRadius: 16, padding: "24px 28px", marginBottom: 24 }),
  labTitle: { fontSize: 22, fontWeight: 800, color: "#f0f0f5", marginBottom: 4 },
  labDesc: { fontSize: 13, color: "#a0aec0", marginBottom: 14, lineHeight: 1.6 },
  labTagRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  labTag: (c) => ({ fontSize: 10, fontWeight: 600, color: c, background: `${c}18`, borderRadius: 6, padding: "3px 8px" }),
  connectBtn: (connected, color) => ({
    padding: "10px 24px", borderRadius: 9, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
    background: connected ? "#1a2a1a" : `linear-gradient(135deg,${color},${color}99)`,
    color: connected ? "#10b981" : "#fff",
    border: connected ? "1px solid #10b981" : "none",
    transition: "all 0.2s",
  }),

  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#6e7191", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 },

  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 },
  featCard: (color) => ({ background: `${color}0a`, border: `1px solid ${color}22`, borderRadius: 10, padding: "14px 16px", transition: "all 0.2s", cursor: "default" }),
  featIcon: { fontSize: 20, marginBottom: 6 },
  featName: { fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 4 },
  featDesc: { fontSize: 11, color: "#6e7191", lineHeight: 1.5 },

  modelTable: { width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", fontSize: 12 },
  modelRow: (alt) => ({ background: alt ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)", borderRadius: 8 }),
  modelCell: { padding: "10px 14px", color: "#a0aec0" },

  // MCP console
  console: { background: "#080810", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: 12, color: "#a0aec0", minHeight: 300, maxHeight: 420, overflowY: "auto" },
  consoleLine: (type) => ({
    marginBottom: 6, color: type === "cmd" ? "#22d3ee" : type === "ok" ? "#10b981" : type === "err" ? "#f87171" : type === "json" ? "#c0caf5" : "#6e7191",
  }),
  consoleInput: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 14px", width: "100%", fontFamily: "inherit", boxSizing: "border-box", outline: "none" },

  // Agent cards
  agentGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  agentCard: (connected, color) => ({ background: connected ? `${color}0c` : "rgba(255,255,255,0.03)", border: `1px solid ${connected ? color + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: 18, transition: "all 0.25s" }),

  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },

  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "linear-gradient(135deg,#1a1a2e,#252540)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s", pointerEvents: "none" }),
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function MCPAgentLab({ onNav }) {
  const [activeTab, setActiveTab] = useState("labs");
  const [selectedLab, setSelectedLab] = useState(AI_LABS[0]);
  const [connectedLabs, setConnectedLabs] = useState({});
  const [labApiKeys, setLabApiKeys] = useState({});
  const [filterTier, setFilterTier] = useState("All");
  const [labSearch, setLabSearch] = useState("");

  const [agentConnections, setAgentConnections] = useState({});
  const [agentEndpoints, setAgentEndpoints] = useState({});
  const [agentKeys, setAgentKeys] = useState({});
  const [agentModels, setAgentModels] = useState({});
  const [dispatchResults, setDispatchResults] = useState({});
  const [dispatchPrompts, setDispatchPrompts] = useState({});
  const [running, setRunning] = useState(null);

  const [mcpLog, setMcpLog] = useState([
    { type: "info", text: "# Antigravity MCP Server v1.0.0" },
    { type: "info", text: "# Protocol: JSON-RPC 2.0 + SSE   Port: 3100" },
    { type: "info", text: "# Run: node mcp-server/index.js to start server" },
    { type: "info", text: "" },
  ]);
  const [mcpInput, setMcpInput] = useState("");
  const [mcpServerUp, setMcpServerUp] = useState(false);
  const consoleRef = useRef(null);

  const [customAgentForm, setCustomAgentForm] = useState({ name: "", emoji: "⚙️", type: "openai_compat", endpoint: "", model: "", apiKey: "", desc: "" });
  const [customAgents, setCustomAgents] = useState([]);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  // Attempt to ping MCP server
  useEffect(() => {
    fetch(`${MCP_SERVER}/status`, { signal: AbortSignal.timeout(1500) })
      .then(() => {
        setMcpServerUp(true);
        appendLog("ok", "✓ MCP Server online at localhost:3100");
      })
      .catch(() => {
        setMcpServerUp(false);
        appendLog("warn", "⚠ MCP Server offline — run: node mcp-server/index.js");
      });
  }, []);

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [mcpLog]);

  const appendLog = (type, text) => {
    setMcpLog(prev => [...prev, { type, text, ts: new Date().toLocaleTimeString() }]);
  };

  const toggleLabConnect = (labId) => {
    const lab = AI_LABS.find(l => l.id === labId);
    setConnectedLabs(prev => {
      const next = { ...prev, [labId]: !prev[labId] };
      if (next[labId]) {
        showToast(`✓ Connected to ${lab.name}`);
        appendLog("ok", `✓ ${lab.name} connected (${lab.models.length} models available)`);
      } else {
        showToast(`Disconnected from ${lab.name}`);
        appendLog("warn", `✗ ${lab.name} disconnected`);
      }
      return next;
    });
  };

  const toggleAgentConnect = (agentId) => {
    const agent = [...UNIVERSAL_AGENTS, ...customAgents].find(a => a.id === agentId);
    setAgentConnections(prev => {
      const next = { ...prev, [agentId]: !prev[agentId] };
      if (next[agentId]) {
        showToast(`🤖 Agent "${agent.name}" connected!`);
        appendLog("ok", `✓ Agent "${agent.name}" connected at ${agentEndpoints[agentId] || agent.defaultEndpoint}`);
      } else {
        showToast(`Agent "${agent.name}" disconnected.`);
        appendLog("warn", `✗ Agent "${agent.name}" disconnected`);
      }
      return next;
    });
  };

  const dispatchAgent = (agent) => {
    if (running) return;
    const prompt = dispatchPrompts[agent.id] || "Run your default task.";
    setRunning(agent.id);
    setDispatchResults(prev => ({ ...prev, [agent.id]: "" }));
    appendLog("cmd", `> dispatch("${agent.name}", "${prompt.slice(0, 40)}...")`);

    const mockResponse = `**${agent.name} — Task Report**\n\n🎯 Task: "${prompt}"\n📡 Endpoint: ${agentEndpoints[agent.id] || agent.defaultEndpoint}\n🤖 Model: ${agentModels[agent.id] || agent.defaultModel}\n\n**Result:**\nTask executed successfully. The agent analyzed the input and produced a structured response. Relevant tool calls were made and results aggregated. Memory context updated.\n\n✅ Status: COMPLETE\n⏱ Duration: ${(Math.random() * 3 + 1).toFixed(1)}s\n🔢 Tokens used: ${Math.floor(Math.random() * 800 + 200)}`;

    let i = 0;
    const tick = setInterval(() => {
      i += Math.floor(Math.random() * 8) + 4;
      if (i >= mockResponse.length) {
        i = mockResponse.length;
        clearInterval(tick);
        setRunning(null);
        showToast(`✓ Agent task complete`);
        appendLog("ok", `✓ "${agent.name}" task complete`);
      }
      setDispatchResults(prev => ({ ...prev, [agent.id]: mockResponse.slice(0, i) }));
    }, 18);
  };

  const runMcpCommand = async (cmd) => {
    if (!cmd.trim()) return;
    appendLog("cmd", `> ${cmd}`);
    setMcpInput("");

    const parts = cmd.trim().split(/\s+/);
    const method = parts[0];

    if (method === "help") {
      appendLog("info", "Available commands:");
      appendLog("info", "  status          — MCP server status");
      appendLog("info", "  tools           — List all MCP tools");
      appendLog("info", "  labs            — List all AI labs");
      appendLog("info", "  agents          — List registered agents");
      appendLog("info", "  call <tool>     — Call a tool by name");
      appendLog("info", "  connect <labId> — Connect to an AI lab");
      appendLog("info", "  clear           — Clear console");
      return;
    }
    if (method === "clear") { setMcpLog([]); return; }

    if (!mcpServerUp) {
      appendLog("err", "✗ MCP Server not running. Start with: node mcp-server/index.js");
      return;
    }

    try {
      if (method === "status") {
        const r = await fetch(`${MCP_SERVER}/status`).then(r => r.json());
        appendLog("json", JSON.stringify(r, null, 2));
      } else if (method === "tools") {
        const r = await fetch(`${MCP_SERVER}/tools`).then(r => r.json());
        r.tools.forEach(t => appendLog("ok", `  ✦ ${t.name} — ${t.description}`));
      } else if (method === "labs") {
        const r = await fetch(`${MCP_SERVER}/labs`).then(r => r.json());
        r.labs.forEach(l => appendLog("ok", `  ${l.emoji} ${l.name} (${l.models.length} models)`));
      } else if (method === "agents") {
        const r = await fetch(`${MCP_SERVER}/agents`).then(r => r.json());
        r.agents.forEach(a => appendLog("ok", `  🤖 ${a.name} [${a.type}] → ${a.endpoint}`));
      } else if (method === "connect" && parts[1]) {
        toggleLabConnect(parts[1]);
        appendLog("ok", `✓ Connected to lab: ${parts[1]}`);
      } else if (method === "call" && parts[1]) {
        const toolName = parts[1];
        const args = parts.slice(2).join(" ");
        let parsedArgs = {};
        try { parsedArgs = args ? JSON.parse(args) : {}; } catch {}
        const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: toolName, arguments: parsedArgs } });
        const r = await fetch(`${MCP_SERVER}/rpc`, { method: "POST", body, headers: { "Content-Type": "application/json" } }).then(r => r.json());
        if (r.result) {
          const text = r.result.content?.[0]?.text || JSON.stringify(r.result);
          appendLog("json", text.slice(0, 600));
        } else {
          appendLog("err", r.error?.message || "Unknown error");
        }
      } else {
        appendLog("err", `Unknown command: ${method}. Type 'help' for list.`);
      }
    } catch (e) {
      appendLog("err", `✗ ${e.message}`);
    }
  };

  const registerCustomAgent = () => {
    if (!customAgentForm.name || !customAgentForm.endpoint) return;
    const newAgent = {
      id: `custom-${Date.now()}`,
      ...customAgentForm,
      defaultEndpoint: customAgentForm.endpoint,
      defaultModel: customAgentForm.model,
      capabilities: ["Custom"],
    };
    setCustomAgents(prev => [...prev, newAgent]);
    setShowCustomForm(false);
    setCustomAgentForm({ name: "", emoji: "⚙️", type: "openai_compat", endpoint: "", model: "", apiKey: "", desc: "" });
    showToast(`✓ Agent "${newAgent.name}" registered!`);
    appendLog("ok", `✓ Custom agent "${newAgent.name}" registered`);
  };

  const allAgents = [...UNIVERSAL_AGENTS.filter(a => a.id !== "custom"), ...customAgents];

  const filteredLabs = AI_LABS.filter(l => {
    if (filterTier !== "All" && l.tier !== filterTier) return false;
    if (labSearch && !l.name.toLowerCase().includes(labSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={S.page}>
      <div style={S.glow1} />
      <div style={S.glow2} />

      {/* HERO */}
      <div style={S.hero}>
        <h1 style={S.heroTitle}>🧬 MCP Agent Lab</h1>
        <p style={S.heroSub}>
          Model Context Protocol server · Connect any AI lab · Plug in Hermes, OpenCLAW, AutoGen, CrewAI and more
        </p>
        <div style={S.badges}>
          <span style={S.badge("#a78bfa")}>⚡ {AI_LABS.length} AI Labs</span>
          <span style={S.badge("#10b981")}>🤖 {allAgents.length} Agents</span>
          <span style={S.badge("#22d3ee")}>🔧 6 MCP Tools</span>
          <span style={S.badge(mcpServerUp ? "#10b981" : "#f87171")}>{mcpServerUp ? "● MCP Online" : "○ MCP Offline"}</span>
          <span style={S.badge("#f59e0b")}>✓ {Object.values(connectedLabs).filter(Boolean).length} Labs Connected</span>
          <span style={S.badge("#f472b6")}>🔗 {Object.values(agentConnections).filter(Boolean).length} Agents Active</span>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={S.tabBar}>
        {[
          { id: "labs", label: "🧪 AI Labs" },
          { id: "agents", label: "🤖 Agent Connectors" },
          { id: "mcp", label: "⚙️ MCP Console" },
        ].map(t => (
          <button key={t.id} style={S.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── LABS TAB ── */}
      {activeTab === "labs" && (
        <div style={S.body}>
          {/* Sidebar */}
          <div style={S.sidebar}>
            <input
              value={labSearch} onChange={e => setLabSearch(e.target.value)}
              placeholder="Search labs…"
              style={{ ...S.input, marginBottom: 12, fontSize: 11 }}
            />
            {/* Tier filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
              {["All", "Tier 1", "Tier 2", "Tier 3", "Local"].map(t => (
                <button key={t} onClick={() => setFilterTier(t)}
                  style={{ fontSize: 9, fontWeight: 700, border: `1px solid ${filterTier === t ? "#a78bfa" : "rgba(255,255,255,0.1)"}`, borderRadius: 5, color: filterTier === t ? "#a78bfa" : "#4a4a6a", background: "transparent", padding: "3px 8px", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>

            <div style={S.sidebarTitle}>AI Labs ({filteredLabs.length})</div>
            {filteredLabs.map(lab => (
              <div key={lab.id} style={S.labItem(selectedLab?.id === lab.id, lab.color)} onClick={() => setSelectedLab(lab)}>
                <span style={S.labEmoji}>{lab.emoji}</span>
                <div style={S.labMeta}>
                  <div style={S.labName}>{lab.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={S.labTier(TIER_COLORS[lab.tier])}>{lab.tier}</span>
                    {connectedLabs[lab.id] && <span style={{ color: "#10b981", fontSize: 9 }}>● Live</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main */}
          {selectedLab && (
            <div style={S.main}>
              {/* Lab header */}
              <div style={S.labHeader(selectedLab.color)}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 34 }}>{selectedLab.emoji}</span>
                      <div>
                        <div style={S.labTitle}>{selectedLab.name}</div>
                        <span style={{ ...S.labTier(TIER_COLORS[selectedLab.tier]), fontSize: 10 }}>{selectedLab.tier}</span>
                      </div>
                    </div>
                    <p style={S.labDesc}>{selectedLab.description}</p>
                    <div style={S.labTagRow}>
                      {selectedLab.tags.map(t => <span key={t} style={S.labTag(selectedLab.color)}>{t}</span>)}
                    </div>
                    <div style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "monospace" }}>
                      API Base: {selectedLab.apiBase}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                    <button style={S.connectBtn(connectedLabs[selectedLab.id], selectedLab.color)} onClick={() => toggleLabConnect(selectedLab.id)}>
                      {connectedLabs[selectedLab.id] ? "✓ Connected" : "Connect Lab"}
                    </button>
                    {connectedLabs[selectedLab.id] && (
                      <div>
                        <div style={{ fontSize: 9, color: "#6e7191", marginBottom: 4 }}>API Key</div>
                        <input
                          type="password"
                          value={labApiKeys[selectedLab.id] || ""}
                          onChange={e => setLabApiKeys(p => ({ ...p, [selectedLab.id]: e.target.value }))}
                          placeholder="sk-..."
                          style={{ ...S.input, width: 180, fontSize: 11 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div style={S.section}>
                <div style={S.sectionTitle}>
                  <span style={{ color: selectedLab.color }}>●</span> Lab Features ({selectedLab.features.length})
                </div>
                <div style={S.featGrid}>
                  {selectedLab.features.map(f => (
                    <div key={f.name} style={S.featCard(selectedLab.color)}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = selectedLab.color + "66"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = selectedLab.color + "22"; e.currentTarget.style.transform = "none"; }}>
                      <div style={S.featIcon}>{f.icon}</div>
                      <div style={S.featName}>{f.name}</div>
                      <div style={S.featDesc}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Models */}
              <div style={S.section}>
                <div style={S.sectionTitle}>
                  <span style={{ color: selectedLab.color }}>●</span> Available Models ({selectedLab.models.length})
                </div>
                <table style={S.modelTable}>
                  <thead>
                    <tr>
                      {["Model", "Context", "Cost", "Latency", "Capabilities"].map(h => (
                        <th key={h} style={{ ...S.modelCell, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: "#4a4a6a", textAlign: "left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLab.models.map((m, i) => (
                      <tr key={m.id} style={S.modelRow(i % 2)}>
                        <td style={{ ...S.modelCell, fontWeight: 600, color: "#f0f0f5" }}>{m.name}</td>
                        <td style={{ ...S.modelCell, fontFamily: "monospace", color: selectedLab.color }}>{m.ctx}</td>
                        <td style={S.modelCell}>{m.cost}</td>
                        <td style={S.modelCell}>{m.ms}ms</td>
                        <td style={S.modelCell}>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {m.tags.map(t => <span key={t} style={{ fontSize: 9, fontWeight: 600, color: selectedLab.color, background: `${selectedLab.color}18`, borderRadius: 4, padding: "1px 5px" }}>{t}</span>)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── AGENTS TAB ── */}
      {activeTab === "agents" && (
        <div style={{ padding: "24px 32px", position: "relative", zIndex: 1 }}>
          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f5", marginBottom: 4 }}>Universal Agent Connectors</div>
              <div style={{ fontSize: 12, color: "#6e7191" }}>Connect Hermes, OpenCLAW, AutoGen, LangChain and any custom endpoint</div>
            </div>
            <button onClick={() => setShowCustomForm(v => !v)}
              style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "none", borderRadius: 9, color: "#fff", fontWeight: 700, fontSize: 12, padding: "9px 20px", cursor: "pointer" }}>
              + Register Custom Agent
            </button>
          </div>

          {/* Custom Agent Form */}
          {showCustomForm && (
            <div style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 14 }}>⚙️ Register Custom Agent</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[["Name", "name", "My Agent"], ["Emoji", "emoji", "⚙️"], ["Type", "type", "openai_compat"], ["Endpoint", "endpoint", "http://localhost:8080/v1"], ["Model", "model", "model-id"], ["API Key", "apiKey", "sk-..."]].map(([label, key, ph]) => (
                  <div key={key}>
                    <label style={S.label}>{label}</label>
                    {key === "type" ? (
                      <select value={customAgentForm[key]} onChange={e => setCustomAgentForm(p => ({ ...p, [key]: e.target.value }))}
                        style={{ ...S.input, cursor: "pointer" }}>
                        {["openai_compat", "ollama", "webhook", "hermes", "openclaw"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={key === "apiKey" ? "password" : "text"} value={customAgentForm[key]}
                        onChange={e => setCustomAgentForm(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={ph} style={S.input} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={S.label}>Description</label>
                <input value={customAgentForm.desc} onChange={e => setCustomAgentForm(p => ({ ...p, desc: e.target.value }))}
                  placeholder="What does this agent do?" style={S.input} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={registerCustomAgent} style={{ padding: "8px 24px", background: "#a78bfa", border: "none", borderRadius: 7, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Register Agent</button>
                <button onClick={() => setShowCustomForm(false)} style={{ padding: "8px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, color: "#6e7191", fontSize: 12, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Agent Grid */}
          <div style={S.agentGrid}>
            {allAgents.map(agent => {
              const connected = !!agentConnections[agent.id];
              const isRunning = running === agent.id;
              const output = dispatchResults[agent.id];
              return (
                <div key={agent.id} style={S.agentCard(connected, agent.color)}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 28, lineHeight: 1 }}>{agent.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{agent.name}</div>
                      <div style={{ fontSize: 10, color: "#6e7191", lineHeight: 1.4 }}>{agent.desc}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {agent.capabilities.map(c => <span key={c} style={{ fontSize: 9, fontWeight: 600, color: agent.color, background: `${agent.color}18`, borderRadius: 4, padding: "2px 6px" }}>{c}</span>)}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? "#10b981" : "#3d3d5c" }} />
                      <button onClick={() => toggleAgentConnect(agent.id)}
                        style={{ fontSize: 9, fontWeight: 700, border: `1px solid ${connected ? agent.color : "rgba(255,255,255,0.15)"}`, borderRadius: 5, color: connected ? agent.color : "#6e7191", background: "transparent", padding: "3px 8px", cursor: "pointer" }}>
                        {connected ? "✓ Live" : "Connect"}
                      </button>
                    </div>
                  </div>

                  {/* Config */}
                  <div style={{ marginBottom: 8 }}>
                    <label style={S.label}>Endpoint</label>
                    <input value={agentEndpoints[agent.id] ?? agent.defaultEndpoint}
                      onChange={e => setAgentEndpoints(p => ({ ...p, [agent.id]: e.target.value }))}
                      style={{ ...S.input, fontSize: 10, marginBottom: 6 }} placeholder={agent.defaultEndpoint} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div>
                        <label style={S.label}>Model</label>
                        <input value={agentModels[agent.id] ?? agent.defaultModel}
                          onChange={e => setAgentModels(p => ({ ...p, [agent.id]: e.target.value }))}
                          style={{ ...S.input, fontSize: 10 }} placeholder={agent.defaultModel} />
                      </div>
                      <div>
                        <label style={S.label}>API Key</label>
                        <input type="password" value={agentKeys[agent.id] || ""}
                          onChange={e => setAgentKeys(p => ({ ...p, [agent.id]: e.target.value }))}
                          style={{ ...S.input, fontSize: 10 }} placeholder="optional" />
                      </div>
                    </div>
                  </div>

                  {/* Prompt */}
                  <div style={{ marginBottom: 8 }}>
                    <label style={S.label}>Task / Prompt</label>
                    <input value={dispatchPrompts[agent.id] || ""}
                      onChange={e => setDispatchPrompts(p => ({ ...p, [agent.id]: e.target.value }))}
                      placeholder="Enter task for agent..."
                      style={{ ...S.input, fontSize: 11 }} />
                  </div>

                  {/* Dispatch */}
                  <button onClick={() => dispatchAgent(agent)} disabled={!connected || !!running}
                    style={{ width: "100%", padding: "9px 0", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 12, cursor: connected && !running ? "pointer" : "not-allowed", transition: "all 0.2s", background: connected && !running ? `linear-gradient(135deg, ${agent.color}, ${agent.color}99)` : "rgba(255,255,255,0.05)", color: connected && !running ? "#fff" : "#3d3d5c" }}>
                    {isRunning ? "⟳ Running…" : connected ? "▶ Dispatch Agent" : "🔒 Connect First"}
                  </button>

                  {/* Output */}
                  {output && (
                    <div style={{ marginTop: 10, background: "rgba(0,0,0,0.35)", borderRadius: 8, padding: 10, maxHeight: 140, overflowY: "auto" }}>
                      <div style={{ fontSize: 9, color: agent.color, fontWeight: 700, marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
                        <span>Output</span>
                        {!isRunning && <button onClick={() => setDispatchResults(p => ({ ...p, [agent.id]: "" }))} style={{ background: "none", border: "none", color: "#4a4a6a", cursor: "pointer", fontSize: 9 }}>✕ clear</button>}
                      </div>
                      <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: 10, color: "#c0caf5", whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{output}{isRunning ? "▌" : ""}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MCP CONSOLE TAB ── */}
      {activeTab === "mcp" && (
        <div style={{ padding: "24px 32px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Console */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f5", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                ⚙️ MCP JSON-RPC Console
                <span style={{ fontSize: 10, fontWeight: 600, color: mcpServerUp ? "#10b981" : "#f87171", background: (mcpServerUp ? "#10b981" : "#f87171") + "18", borderRadius: 4, padding: "2px 7px" }}>
                  {mcpServerUp ? "● ONLINE" : "○ OFFLINE"}
                </span>
              </div>
              <div style={S.console} ref={consoleRef}>
                {mcpLog.map((line, i) => (
                  <div key={i} style={S.consoleLine(line.type)}>
                    {line.ts && <span style={{ color: "#3d3d5c", marginRight: 8 }}>[{line.ts}]</span>}
                    {line.text}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={mcpInput}
                  onChange={e => setMcpInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runMcpCommand(mcpInput)}
                  placeholder="Type command (help, status, tools, labs, agents, call <tool>)…"
                  style={S.consoleInput}
                />
                <button onClick={() => runMcpCommand(mcpInput)}
                  style={{ padding: "0 16px", background: "#a78bfa", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Run</button>
              </div>
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["help", "status", "tools", "labs", "agents", "call lab_list", "call mcp_status"].map(cmd => (
                  <button key={cmd} onClick={() => runMcpCommand(cmd)}
                    style={{ fontSize: 10, fontWeight: 600, color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* MCP server info & Claude Desktop config */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>📋 Setup & Configuration</div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#22d3ee", marginBottom: 10 }}>Start MCP Server</div>
                <pre style={{ margin: 0, color: "#c0caf5", fontSize: 11, fontFamily: "monospace", lineHeight: 1.7 }}>
{`# From project root:
cd mcp-server
node index.js

# Or with file watching:
node --watch index.js

# Server endpoints:
GET  localhost:3100/status
GET  localhost:3100/tools
GET  localhost:3100/labs
GET  localhost:3100/agents
GET  localhost:3100/sse       ← SSE stream
POST localhost:3100/rpc       ← JSON-RPC 2.0`}
                </pre>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>Claude Desktop Integration</div>
                <pre style={{ margin: 0, color: "#c0caf5", fontSize: 10, fontFamily: "monospace", lineHeight: 1.7 }}>
{`// claude_desktop_config.json:
{
  "mcpServers": {
    "antigravity": {
      "command": "node",
      "args": [
        "/path/to/project/mcp-server/index.js"
      ]
    }
  }
}`}
                </pre>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 10 }}>Available MCP Tools</div>
                {[
                  ["lab_list", "List all AI labs + models"],
                  ["lab_connect", "Connect to a lab by ID"],
                  ["lab_query", "Query any model in any lab"],
                  ["agent_list", "List registered agents"],
                  ["agent_register", "Register a new agent endpoint"],
                  ["agent_dispatch", "Dispatch task to an agent"],
                  ["mcp_status", "Server health + uptime"],
                ].map(([name, desc]) => (
                  <div key={name} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: 4, padding: "2px 6px", fontFamily: "monospace", whiteSpace: "nowrap" }}>{name}</span>
                    <span style={{ fontSize: 11, color: "#6e7191" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
