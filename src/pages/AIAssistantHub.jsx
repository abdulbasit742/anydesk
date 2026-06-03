import { useState, useRef, useEffect, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const MODELS = [
  { id: "gpt4o",    emoji: "🤖", name: "GPT-4o",           provider: "OpenAI",     cost: "$0.005", latency: "820ms",  status: "online",   color: "#10b981", accent: "#10b981", contextK: 128 },
  { id: "claude",   emoji: "🧠", name: "Claude 3.5 Sonnet", provider: "Anthropic",  cost: "$0.003", latency: "940ms",  status: "online",   color: "#a78bfa", accent: "#a78bfa", contextK: 200 },
  { id: "gemini",   emoji: "✨", name: "Gemini 1.5 Pro",    provider: "Google",     cost: "$0.0035",latency: "1.1s",   status: "online",   color: "#22d3ee", accent: "#22d3ee", contextK: 1000 },
  { id: "llama",    emoji: "🦙", name: "Llama 3.1 70B",     provider: "Meta",       cost: "$0.0009",latency: "1.4s",   status: "online",   color: "#f97316", accent: "#f97316", contextK: 128 },
  { id: "mistral",  emoji: "🌊", name: "Mistral Large",     provider: "Mistral AI", cost: "$0.004", latency: "990ms",  status: "degraded", color: "#f5b731", accent: "#f5b731", contextK: 32  },
  { id: "grok",     emoji: "⚡", name: "Grok-2",            provider: "xAI",        cost: "$0.002", latency: "750ms",  status: "online",   color: "#60a5fa", accent: "#60a5fa", contextK: 131 },
  { id: "deepseek", emoji: "🔬", name: "DeepSeek-V3",       provider: "DeepSeek",   cost: "$0.00027",latency:"1.6s",  status: "online",   color: "#34d399", accent: "#34d399", contextK: 64  },
  { id: "commandr", emoji: "🎯", name: "Command R+",        provider: "Cohere",     cost: "$0.003", latency: "870ms",  status: "online",   color: "#f472b6", accent: "#f472b6", contextK: 128 },
];

const PRESET_PROMPTS = [
  { id: 1, label: "Debug React Bug",        category: "Code",       text: "Debug this React bug: my useEffect is running in an infinite loop even with an empty dependency array. What could cause this?" },
  { id: 2, label: "SQL Query",              category: "Code",       text: "Write a SQL query that finds the top 10 customers by total order value in the last 90 days, including their names and order counts." },
  { id: 3, label: "Explain Concept",        category: "Analysis",   text: "Explain the concept of gradient descent in machine learning in simple terms, with a practical analogy." },
  { id: 4, label: "Unit Tests",             category: "Code",       text: "Generate comprehensive unit tests for a function that validates email addresses including edge cases." },
  { id: 5, label: "Refactor Function",      category: "Code",       text: "Refactor this function to be more readable and efficient, using modern ES2024 features: function fetchData(url, cb) { fetch(url).then(r => r.json()).then(d => cb(null, d)).catch(e => cb(e)); }" },
  { id: 6, label: "Create API Endpoint",    category: "Code",       text: "Create a RESTful API endpoint in Express.js for user authentication with JWT tokens, input validation, and rate limiting." },
  { id: 7, label: "Write Regex",            category: "Code",       text: "Write a regex pattern that matches valid IPv4 addresses including edge cases like leading zeros and out-of-range octets." },
  { id: 8, label: "Summarize Document",     category: "Writing",    text: "Summarize the key principles of clean code architecture in 5 bullet points with actionable advice for developers." },
  { id: 9, label: "Translate to Python",    category: "Translation",text: "Translate this JavaScript async/await code to Python using asyncio: async function fetchUser(id) { const res = await fetch(`/api/users/${id}`); return res.json(); }" },
  { id: 10, label: "Type Definitions",      category: "Code",       text: "Generate TypeScript type definitions for a REST API response that includes user profiles, nested address objects, and optional social links." },
];

const CATEGORY_COLORS = { Code: "#22d3ee", Writing: "#a78bfa", Analysis: "#f5b731", Translation: "#f472b6" };

const MOCK_RESPONSES = {
  gpt4o: [
    "Great question! Here's a comprehensive breakdown:\n\n**Core Issue Analysis:**\nThe problem you're describing typically stems from one of three root causes:\n\n1. **Closure capture issues** — variables captured in the closure aren't properly tracked by the dependency array\n2. **Object identity problems** — objects/arrays recreated on every render appear as new references\n3. **State mutation side effects** — direct mutations bypassing React's reconciliation\n\n```javascript\n// ❌ Problem pattern\nuseEffect(() => {\n  setCount(count + 1); // causes re-render → new count → effect runs again\n}, [count]);\n\n// ✅ Solution: functional update\nuseEffect(() => {\n  setCount(prev => prev + 1);\n}, []);\n```\n\nThe key insight is that React's `useEffect` dependencies should be **values**, not **triggers**. Use `useRef` for values you want to persist without triggering re-runs.",
    "I'd approach this systematically. Let me provide a complete, production-ready solution:\n\n**Step 1: Architecture Review**\nBefore writing any code, consider the data flow requirements and choose between local state, context, or external state management.\n\n**Step 2: Implementation**\n```typescript\nconst solution = async (): Promise<Result> => {\n  // Type-safe, error-handled implementation\n  try {\n    const data = await processAsync();\n    return { success: true, data };\n  } catch (error) {\n    logger.error('Operation failed', { error });\n    throw new AppError(error.message);\n  }\n};\n```\n\n**Step 3: Testing Strategy**\nAlways pair implementation with tests covering happy path, error cases, and edge cases.",
  ],
  claude: [
    "Let me think through this carefully and give you a nuanced, well-reasoned answer.\n\nThe situation you're describing reveals an important pattern in how React's reactivity model works. The `useEffect` dependency array is fundamentally a **hint to React** about what external values your effect depends on, not a debounce mechanism.\n\n**Why this happens:**\n```jsx\n// This looks safe but creates a loop\nconst [data, setData] = useState(null);\nuseEffect(() => {\n  fetchSomething().then(result => {\n    setData(result); // triggers re-render\n    // effect runs again if data is in deps\n  });\n}, [data]); // ← data changes trigger re-run\n```\n\n**The elegant fix:**\nSeparate *what triggers the effect* from *what the effect reads*. Use `useRef` as an escape hatch for values you need inside effects without making them dependencies.\n\nI'd also recommend the `eslint-plugin-react-hooks` package — it catches these patterns at compile time. Would you like me to show more patterns?",
    "Excellent question! I'll provide a thorough analysis with multiple perspectives.\n\nFrom a **software engineering** standpoint, the most important principle here is *separation of concerns*. Each function should have a single, clear responsibility that can be easily tested and reasoned about independently.\n\nFrom a **performance** perspective, consider: algorithmic complexity first, then memory allocation patterns, and finally micro-optimizations (which are rarely necessary).\n\nHere's what I'd recommend:\n```python\n# Clean, readable, well-documented\ndef process_data(items: list[dict]) -> list[dict]:\n    \"\"\"Filter and transform items meeting quality threshold.\n    \n    Args:\n        items: Raw data items with score and metadata\n    Returns:\n        Processed items with normalized scores\n    \"\"\"\n    return [\n        {**item, 'score': normalize(item['score'])}\n        for item in items\n        if item.get('score', 0) >= QUALITY_THRESHOLD\n    ]\n```\nThis is idiomatic Python, type-annotated, and self-documenting.",
  ],
  gemini: [
    "# Comprehensive Analysis\n\nHere's my multi-faceted response covering all the key dimensions:\n\n## Technical Foundation\nThe core mechanism involves **reactive state propagation** through React's fiber architecture. When state changes, React schedules a reconciliation pass that re-evaluates all affected component trees.\n\n## Practical Solution\n```javascript\n// Pattern 1: Stable callback reference\nconst stableCallback = useCallback(() => {\n  doSomething(currentValueRef.current);\n}, []); // Never changes\n\n// Pattern 2: Event-driven instead of effect-driven  \nconst handleAction = async () => {\n  const result = await fetchData();\n  setResults(result);\n};\n\n// Pattern 3: Custom hook abstraction\nconst useStableEffect = (fn, deps) => {\n  const fnRef = useRef(fn);\n  fnRef.current = fn;\n  useEffect(() => fnRef.current(), deps);\n};\n```\n\n## Best Practices\n- ✅ Prefer derived state over synchronized state\n- ✅ Use `useReducer` for complex state transitions  \n- ✅ Extract complex logic into custom hooks\n- ❌ Avoid `JSON.stringify` in dependency arrays",
    "Let me give you a comprehensive, well-structured answer that covers all angles.\n\nKey considerations when approaching this problem:\n\n**1. First Principles Thinking**\nStart by questioning your assumptions. Often the best solution is to redesign the problem rather than solve it as stated.\n\n**2. Trade-offs Analysis**\n| Approach | Pros | Cons |\n|----------|------|------|\n| Simple   | Easy to understand | May not scale |\n| Complex  | Handles edge cases | Hard to maintain |\n| Hybrid   | Balanced | Requires design upfront |\n\n**3. Implementation Path**\nI recommend an incremental approach: start with the simplest working solution, measure its performance and correctness, then optimize only where needed.\n\nThe principle of *progressive enhancement* applies here — make it work, make it right, then make it fast.",
  ],
  llama: [
    "Sure! Here's a clear, direct answer:\n\nThe issue is most commonly caused by **unstable references in the dependency array**. JavaScript objects and arrays are compared by reference, not value — so a new object `{}` is never equal to another `{}` even if they look identical.\n\n```js\n// Bad: object recreated every render\nuseEffect(() => {\n  fetchUser(options);\n}, [options]); // options = { limit: 10 } ← new ref each render!\n\n// Good: memoize the object\nconst options = useMemo(() => ({ limit: 10 }), []);\nuseEffect(() => {\n  fetchUser(options);\n}, [options]); // stable reference now ✓\n```\n\nOther common causes:\n- Setting state inside an effect that depends on that state\n- Using functions defined in render as dependencies (memoize with `useCallback`)\n- External subscriptions that trigger state updates\n\nLet me know if you want me to debug your specific code!",
    "Here's a practical, no-nonsense answer:\n\nThe best approach here depends on your specific use case, but I'll give you the most common solution that works 90% of the time.\n\n```python\ndef solve(input_data):\n    # Validate input\n    if not input_data:\n        return None\n    \n    # Process efficiently\n    result = []\n    for item in input_data:\n        processed = transform(item)\n        if is_valid(processed):\n            result.append(processed)\n    \n    return result\n```\n\nKey points:\n1. Always validate inputs first\n2. Keep functions small and focused\n3. Return early on invalid states\n4. Document edge cases in comments\n\nThis handles the common case well. If you need more sophisticated handling, let me know!",
  ],
  mistral: [
    "Voilà! Here's an elegant solution to your problem:\n\nThe root cause lies in React's **referential equality checks**. When React evaluates whether to re-run an effect, it performs a `Object.is()` comparison on each dependency — which fails for objects, arrays, and functions defined inline.\n\n**Solution Pattern:**\n```javascript\n// Use primitive values in deps when possible\nconst userId = user?.id; // primitive string/number\nuseEffect(() => {\n  if (userId) loadUserData(userId);\n}, [userId]); // ✓ stable primitive\n\n// For functions: useCallback\nconst loadData = useCallback(async () => {\n  const data = await api.fetch();\n  setData(data);\n}, []); // empty deps = stable function ref\n\nuseEffect(() => {\n  loadData();\n}, [loadData]); // ✓ loadData is stable\n```\n\nMistral tip: Consider using `SWR` or `React Query` for data fetching — they handle all these edge cases automatically and give you caching, deduplication, and revalidation for free.",
    "Bonjour! Let me provide a crisp, efficient answer.\n\nFor this type of problem, I recommend the functional programming approach:\n\n```javascript\n// Compose small, pure functions\nconst pipeline = (...fns) => x => fns.reduce((v, f) => f(v), x);\n\nconst processItem = pipeline(\n  validate,\n  normalize,  \n  transform,\n  format\n);\n\nconst results = items.map(processItem).filter(Boolean);\n```\n\nThis is more testable, more readable, and more maintainable than imperative code. Each step in the pipeline can be tested independently.",
  ],
  grok: [
    "⚡ Fast answer: the infinite loop is almost certainly one of these:\n\n1. **You're setting state inside the effect** without a proper condition guard\n2. **A dependency is an object/array** created inline (new reference every render)\n3. **A callback prop** isn't memoized and changes identity each render\n\n```tsx\n// The sneaky pattern that trips everyone up:\nfunction Component({ onLoad }) {\n  useEffect(() => {\n    fetchData().then(onLoad); // onLoad in deps?\n  }, [onLoad]); // ← if parent doesn't useCallback, this loops\n}\n\n// Fix at parent:\nconst handleLoad = useCallback((data) => {\n  setResult(data);\n}, []); // ← stable reference\n\n<Component onLoad={handleLoad} />\n```\n\n**Grok's hot take:** React's dependency array design has sharp edges. If you're hitting these issues a lot, consider Jotai or Zustand for state — they have cleaner subscription models. xAI's approach to this in our internal tools is to default to event-driven state machines.",
    "Straight to the point:\n\nHere's the most efficient implementation:\n```js\n// O(n log n) instead of O(n²)\nconst optimized = arr\n  .sort((a, b) => b.score - a.score)\n  .slice(0, limit)\n  .map(formatResult);\n```\n\nKey optimizations:\n- Single pass sorting instead of repeated comparisons\n- Lazy slice before mapping (fewer iterations)\n- No intermediate arrays\n\nBenchmarks show ~3x speedup for large datasets (>10k items).",
  ],
  deepseek: [
    "**DeepSeek Analysis** 🔬\n\nAfter careful reasoning through the problem space, here is a comprehensive solution:\n\n**Root Cause Identification:**\nThe infinite loop in `useEffect` with empty dependency array `[]` is a contradiction — if the array is truly empty, the effect runs only once. If you're seeing it loop, the array is likely **not actually empty** due to:\n\n```javascript\n// Common mistake: options defined in component body\nconst options = { threshold: 0.5 }; // new object each render!\n\nuseEffect(() => {\n  observer = new IntersectionObserver(cb, options);\n}, [options]); // ← appears empty, actually loops\n\n// Mathematical proof:\n// {} !== {} in JS (reference equality)\n// Each render: new options object → effect triggers → render → ...\n```\n\n**Formally verified solution:**\n```javascript\n// Move constants outside component\nconst OPTIONS = { threshold: 0.5 }; // stable reference ✓\n\nfunction Component() {\n  useEffect(() => {\n    const observer = new IntersectionObserver(cb, OPTIONS);\n    return () => observer.disconnect();\n  }, []); // truly empty ✓\n}\n```\n\n**Time complexity:** O(1) per render. **Memory:** constant.",
    "**Systematic approach:**\n\nI'll reason through this step by step like a formal proof:\n\n**Given:** Input data D, requirements R, constraints C\n**Find:** Optimal solution S\n\n**Proof by construction:**\n```python\nfrom typing import TypeVar, Generic\nT = TypeVar('T')\n\nclass Solution(Generic[T]):\n    def __init__(self, strategy: str):\n        self.strategy = strategy\n        self._cache: dict = {}\n    \n    def solve(self, problem: T) -> T:\n        key = hash(str(problem))\n        if key not in self._cache:\n            self._cache[key] = self._compute(problem)\n        return self._cache[key]\n    \n    def _compute(self, problem: T) -> T:\n        # O(n log n) divide-and-conquer\n        if len(problem) <= 1:\n            return problem\n        mid = len(problem) // 2\n        left = self._compute(problem[:mid])\n        right = self._compute(problem[mid:])\n        return self._merge(left, right)\n```\n\n**QED:** The solution satisfies all constraints with O(n log n) complexity.",
  ],
  commandr: [
    "**Command R+ Response:**\n\nI'm designed for retrieval-augmented generation, so let me give you a well-cited, grounded answer.\n\nBased on React's official documentation and community best practices:\n\n**The Dependency Array Contract:**\n> *\"Every reactive value used by the Effect's code must be declared in its list of dependencies.\"* — React Docs\n\nThis means if you use ANY variable from the component scope inside an effect, it must be declared as a dependency. The empty array `[]` is valid only when the effect truly uses no reactive values.\n\n**Diagnosis Checklist:**\n```\n✓ Are you setting state inside the effect?\n✓ Are any dependencies objects or arrays (reference equality)?\n✓ Are any dependencies functions not wrapped in useCallback?\n✓ Are you using ESLint react-hooks/exhaustive-deps?\n✓ Are external subscriptions triggering state changes?\n```\n\n**Recommended solution:**\n```jsx\nconst fetchData = useCallback(async () => {\n  const result = await api.getData(userId);\n  setData(result);\n}, [userId]); // only reruns when userId changes\n\nuseEffect(() => {\n  fetchData();\n}, [fetchData]); // stable reference\n```\n\nI'd also recommend the **React DevTools Profiler** to visualize which renders trigger your effects.",
    "Great question! Here's a retrieval-augmented answer drawing from software engineering best practices:\n\n**Context:** This is a classic software design problem with well-established patterns.\n\n**Best Practice #1: Single Responsibility Principle**\nEach module/function should have one reason to change.\n\n**Best Practice #2: Dependency Inversion**\nDepend on abstractions, not concretions.\n\n```typescript\n// Interface-first design\ninterface DataProcessor<T, R> {\n  process(input: T): Promise<R>;\n  validate(input: T): ValidationResult;\n}\n\n// Concrete implementation\nclass UserProcessor implements DataProcessor<RawUser, User> {\n  async process(raw: RawUser): Promise<User> {\n    const validation = this.validate(raw);\n    if (!validation.isValid) throw new ValidationError(validation.errors);\n    return this.transform(raw);\n  }\n}\n```\n\nThis pattern ensures **testability**, **extensibility**, and **maintainability**.",
  ],
};

const SESSION_HISTORY_MOCK = [
  { id: 1, prompt: "Debug this React bug: my useEffect is running...", models: ["gpt4o", "claude"], winner: "claude", time: "2 min ago" },
  { id: 2, prompt: "Write a SQL query for top customers...", models: ["gemini", "gpt4o", "llama"], winner: "gemini", time: "18 min ago" },
  { id: 3, prompt: "Explain gradient descent in machine learning...", models: ["claude", "mistral"], winner: "claude", time: "1 hr ago" },
  { id: 4, prompt: "Generate unit tests for email validator...", models: ["gpt4o", "deepseek"], winner: "gpt4o", time: "3 hr ago" },
  { id: 5, prompt: "Refactor this function to use modern ES2024...", models: ["claude", "grok", "commandr"], winner: "grok", time: "5 hr ago" },
  { id: 6, prompt: "Create a RESTful API endpoint in Express...", models: ["gpt4o", "gemini"], winner: "gpt4o", time: "Yesterday" },
  { id: 7, prompt: "Write a regex for valid IPv4 addresses...", models: ["claude", "deepseek"], winner: "deepseek", time: "Yesterday" },
  { id: 8, prompt: "Translate JavaScript async/await to Python...", models: ["gemini", "commandr"], winner: "commandr", time: "2 days ago" },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "var(--surface, #0e0e16)",
    color: "#e2e8f0",
    fontFamily: "'DM Mono', 'Fira Code', monospace",
    display: "flex",
    flexDirection: "column",
    gap: 0,
    overflowX: "hidden",
  },
  hero: {
    background: "linear-gradient(135deg, #0e0e16 0%, #1a1025 40%, #0a1628 70%, #0e0e16 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    padding: "32px 32px 28px",
    position: "relative",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(ellipse 60% 80% at 30% 40%, rgba(245,183,49,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 70% 30%, rgba(34,211,238,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroInner: { position: "relative", zIndex: 1 },
  heroTitle: {
    fontFamily: "'Syne', 'DM Mono', sans-serif",
    fontSize: "clamp(24px, 4vw, 38px)",
    fontWeight: 800,
    margin: "0 0 8px",
    background: "linear-gradient(90deg, #f5b731, #22d3ee, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.5px",
  },
  heroSub: { color: "#6e7191", fontSize: "14px", margin: "0 0 20px", fontFamily: "'DM Mono', monospace" },
  heroBadges: { display: "flex", gap: 12, flexWrap: "wrap" },
  badge: (color) => ({
    padding: "5px 14px", borderRadius: 20,
    background: `${color}18`,
    border: `1px solid ${color}40`,
    color: color, fontSize: "12px", fontWeight: 600,
    letterSpacing: "0.5px",
  }),
  layout: {
    display: "flex", flex: 1,
    height: "calc(100vh - 160px)",
    overflow: "hidden",
  },
  sidebar: {
    width: 260, minWidth: 240,
    background: "#16161e",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    display: "flex", flexDirection: "column",
    overflowY: "auto",
  },
  sidebarSection: { padding: "16px 14px 8px" },
  sidebarTitle: {
    fontSize: "10px", fontWeight: 700,
    letterSpacing: "1.5px", textTransform: "uppercase",
    color: "#6e7191", marginBottom: 10,
  },
  modelCard: (active, color) => ({
    padding: "10px 12px",
    borderRadius: 8,
    marginBottom: 4,
    cursor: "pointer",
    border: active ? `1px solid ${color}60` : "1px solid transparent",
    background: active ? `${color}12` : "transparent",
    boxShadow: active ? `0 0 12px ${color}20` : "none",
    transition: "all 0.2s ease",
    display: "flex", alignItems: "center", gap: 10,
  }),
  modelEmoji: { fontSize: 18, width: 26, textAlign: "center" },
  modelInfo: { flex: 1, minWidth: 0 },
  modelName: { fontSize: "12px", fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  modelProvider: { fontSize: "10px", color: "#6e7191", marginTop: 1 },
  modelMeta: { display: "flex", alignItems: "center", gap: 6, marginTop: 1 },
  modelCost: { fontSize: "10px", color: "#22d3ee" },
  modelLatency: { fontSize: "10px", color: "#a78bfa" },
  statusDot: (status) => ({
    width: 6, height: 6, borderRadius: "50%",
    background: status === "online" ? "#22c55e" : "#f5b731",
    boxShadow: status === "online" ? "0 0 6px #22c55e80" : "0 0 6px #f5b73180",
    flexShrink: 0,
  }),
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 },
  chatArea: { display: "flex", flex: 1, gap: 0, overflow: "hidden" },
  chatPane: () => ({
    flex: 1, display: "flex", flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    minWidth: 0, overflow: "hidden",
  }),
  paneHeader: (color) => ({
    padding: "10px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    background: `${color}10`,
    display: "flex", alignItems: "center", gap: 8,
    flexShrink: 0,
  }),
  paneTitle: (color) => ({
    fontSize: "12px", fontWeight: 700, color: color,
    fontFamily: "'Syne', sans-serif",
  }),
  paneStats: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" },
  statChip: (color) => ({
    fontSize: "10px", color: color,
    background: `${color}18`,
    border: `1px solid ${color}30`,
    padding: "2px 8px", borderRadius: 10,
  }),
  messages: { flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 },
  msgUser: {
    alignSelf: "flex-end", maxWidth: "85%",
    background: "linear-gradient(135deg, #f5b73118, #22d3ee10)",
    border: "1px solid rgba(245,183,49,0.2)",
    borderRadius: "12px 12px 3px 12px",
    padding: "10px 14px", fontSize: "12px", lineHeight: 1.6,
    animation: "fadeInUp 0.3s ease",
  },
  msgAI: (color) => ({
    alignSelf: "flex-start", maxWidth: "95%",
    background: "#1d1d28",
    border: `1px solid ${color}25`,
    borderRadius: "3px 12px 12px 12px",
    padding: "10px 14px", fontSize: "11.5px", lineHeight: 1.7,
    animation: "fadeInUp 0.3s ease",
    whiteSpace: "pre-wrap",
  }),
  msgMeta: { display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" },
  msgMetaChip: (color) => ({ fontSize: "10px", color, background: `${color}15`, border: `1px solid ${color}25`, padding: "1px 7px", borderRadius: 8 }),
  iconBtn: (color) => ({
    background: "none", border: `1px solid ${color || "rgba(255,255,255,0.1)"}30`,
    borderRadius: 5, padding: "2px 7px", cursor: "pointer",
    color: color || "#6e7191", fontSize: "11px", transition: "all 0.15s",
  }),
  typingDots: { display: "flex", gap: 4, padding: "10px 14px", alignItems: "center" },
  dot: (delay) => ({
    width: 6, height: 6, borderRadius: "50%",
    background: "#6e7191",
    animation: `bounce 1.2s ease-in-out ${delay}s infinite`,
  }),
  inputArea: {
    padding: "12px 14px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "#16161e",
    flexShrink: 0,
  },
  promptLibrary: {
    padding: "12px 16px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "#16161e",
    flexShrink: 0,
  },
  categoryRow: { display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" },
  categoryPill: (active, color) => ({
    padding: "3px 10px", borderRadius: 12, fontSize: "10px", fontWeight: 600,
    cursor: "pointer", border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
    background: active ? `${color}20` : "transparent",
    color: active ? color : "#6e7191", transition: "all 0.15s",
  }),
  presetRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  presetBtn: {
    padding: "4px 10px", borderRadius: 8, fontSize: "10px", cursor: "pointer",
    background: "#1d1d28", border: "1px solid rgba(255,255,255,0.1)",
    color: "#a0aec0", transition: "all 0.15s",
  },
  sharedInput: {
    display: "flex", gap: 8, alignItems: "flex-end",
  },
  textarea: {
    flex: 1, background: "#1d1d28",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "10px 14px",
    color: "#e2e8f0", fontSize: "13px",
    fontFamily: "'DM Mono', monospace",
    resize: "none", outline: "none",
    lineHeight: 1.5, minHeight: 44, maxHeight: 120,
  },
  sendBtn: (disabled) => ({
    padding: "10px 20px", borderRadius: 10, border: "none",
    background: disabled ? "#2a2a3a" : "linear-gradient(135deg, #f5b731, #e09f1a)",
    color: disabled ? "#6e7191" : "#0e0e16",
    fontWeight: 700, fontSize: "12px", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Mono', monospace",
    transition: "all 0.2s", flexShrink: 0,
  }),
  rightPanel: {
    width: 260, minWidth: 240,
    background: "#16161e",
    borderLeft: "1px solid rgba(255,255,255,0.07)",
    display: "flex", flexDirection: "column",
    overflowY: "auto",
  },
  sectionBlock: { padding: "14px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  metricsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 8 },
  metricCell: (color) => ({
    background: `${color}15`, border: `1px solid ${color}30`,
    borderRadius: 6, padding: "6px 8px", textAlign: "center",
  }),
  metricVal: (color) => ({ fontSize: "13px", fontWeight: 700, color }),
  metricLabel: { fontSize: "9px", color: "#6e7191", marginTop: 2 },
  leaderRow: (rank) => ({
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 8px", borderRadius: 7, marginBottom: 4,
    background: rank === 0 ? "rgba(245,183,49,0.1)" : rank === 1 ? "rgba(34,211,238,0.08)" : rank === 2 ? "rgba(167,139,250,0.08)" : "#1d1d28",
    border: rank === 0 ? "1px solid rgba(245,183,49,0.2)" : "1px solid rgba(255,255,255,0.05)",
  }),
  sessionCard: {
    padding: "8px 10px", borderRadius: 7, marginBottom: 6,
    background: "#1d1d28", border: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer", transition: "border-color 0.15s",
  },
  drawer: (open) => ({
    position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 100,
    width: 320,
    background: "#1d1d28",
    borderLeft: "1px solid rgba(255,255,255,0.1)",
    transform: open ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.3s ease",
    padding: "24px 20px",
    overflowY: "auto",
    display: "flex", flexDirection: "column", gap: 16,
  }),
  drawerOverlay: (open) => ({
    position: "fixed", inset: 0, zIndex: 99,
    background: "rgba(0,0,0,0.5)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transition: "opacity 0.3s",
  }),
  sliderRow: { display: "flex", flexDirection: "column", gap: 4 },
  sliderLabel: { fontSize: "11px", color: "#a0aec0", display: "flex", justifyContent: "space-between" },
  slider: {
    width: "100%", accentColor: "#f5b731",
    background: "transparent", cursor: "pointer",
  },
  toast: (show) => ({
    position: "fixed", bottom: 32, left: "50%",
    transform: `translateX(-50%) translateY(${show ? 0 : 60}px)`,
    opacity: show ? 1 : 0,
    background: "#22c55e",
    color: "#0e0e16", fontWeight: 700, fontSize: "13px",
    padding: "10px 24px", borderRadius: 20,
    zIndex: 200, transition: "all 0.3s ease",
    boxShadow: "0 4px 24px rgba(34,197,94,0.4)",
  }),
};

// ─── KEYFRAMES ────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const id = "aihub-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @keyframes fadeInUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes bounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-6px); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
    ::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.2); }
  `;
  document.head.appendChild(style);
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const getModel = (id) => MODELS.find((m) => m.id === id);
const randBetween = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pickResponse = (modelId, idx) => {
  const pool = MOCK_RESPONSES[modelId] || MOCK_RESPONSES.gpt4o;
  return pool[idx % pool.length];
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={S.typingDots}>
      {[0, 0.2, 0.4].map((d, i) => (
        <div key={i} style={S.dot(d)} />
      ))}
      <span style={{ fontSize: "10px", color: "#6e7191", marginLeft: 4 }}>Generating…</span>
    </div>
  );
}

function RatingButtons({ onRate, rating }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      <button
        onClick={() => onRate("up")}
        style={{ ...S.iconBtn(rating === "up" ? "#22c55e" : null), fontSize: "12px" }}
      >👍</button>
      <button
        onClick={() => onRate("down")}
        style={{ ...S.iconBtn(rating === "down" ? "#ef4444" : null), fontSize: "12px" }}
      >👎</button>
    </div>
  );
}

function ChatPane({ model, messages, isTyping, onRate, onCopy }) {
  const m = getModel(model);
  const bottomRef = useRef(null);
  const tokensUsed = messages.filter(msg => msg.role === "ai").reduce((s, msg) => s + (msg.tokens || 0), 0);
  const contextPct = Math.max(0, 100 - Math.round((tokensUsed / (m.contextK * 1000)) * 100));
  const costSoFar = (tokensUsed * 0.000003).toFixed(5);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  return (
    <div style={S.chatPane()}>
      {/* Status Bar */}
      <div style={S.paneHeader(m.color)}>
        <span style={{ fontSize: 16 }}>{m.emoji}</span>
        <div>
          <div style={S.paneTitle(m.color)}>{m.name}</div>
          <div style={{ fontSize: "9px", color: "#6e7191" }}>{m.provider}</div>
        </div>
        <div style={S.paneStats}>
          <span style={S.statChip("#22d3ee")}>{contextPct}% ctx</span>
          <span style={S.statChip("#f5b731")}>${costSoFar}</span>
          <span style={S.statChip(m.status === "online" ? "#22c55e" : "#f5b731")}>
            {m.status === "online" ? "● Live" : "⚠ Degraded"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={S.messages}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#6e7191", fontSize: "12px", marginTop: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{m.emoji}</div>
            <div style={{ color: m.color, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
            <div>Ready for your prompt</div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.role === "user" ? (
              <div style={S.msgUser}>{msg.content}</div>
            ) : (
              <div>
                <div style={S.msgAI(m.color)}>{msg.content}</div>
                <div style={S.msgMeta}>
                  <span style={S.msgMetaChip("#a78bfa")}>{msg.tokens} tok</span>
                  <span style={S.msgMetaChip("#22d3ee")}>{msg.latency}ms</span>
                  <span style={S.msgMetaChip("#10b981")}>Q:{msg.quality}</span>
                  <RatingButtons rating={msg.rating} onRate={(r) => onRate(model, idx, r)} />
                  <button style={S.iconBtn("#6e7191")} onClick={() => onCopy(msg.content)}>⎘ Copy</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function ModelSettingsDrawer({ model, settings, open, onClose, onChange, onApply }) {
  if (!model) return null;
  const m = getModel(model);
  const s = settings[model] || { temperature: 0.7, maxTokens: 2048, systemPrompt: "", topP: 0.9, freqPenalty: 0 };

  const field = (key, label, min, max, step, isSlider = true) => (
    <div style={S.sliderRow}>
      <label style={S.sliderLabel}>
        <span>{label}</span>
        <span style={{ color: m.color }}>{s[key]}</span>
      </label>
      {isSlider ? (
        <input type="range" min={min} max={max} step={step} value={s[key]}
          style={S.slider}
          onChange={(e) => onChange(model, key, parseFloat(e.target.value))} />
      ) : (
        <input type="number" min={min} max={max} value={s[key]}
          style={{ ...S.textarea, minHeight: "unset", padding: "6px 10px" }}
          onChange={(e) => onChange(model, key, parseInt(e.target.value))} />
      )}
    </div>
  );

  return (
    <>
      <div style={S.drawerOverlay(open)} onClick={onClose} />
      <div style={S.drawer(open)}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: m.color }}>
              {m.emoji} {m.name}
            </div>
            <div style={{ fontSize: "11px", color: "#6e7191", marginTop: 2 }}>Model Settings</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6e7191", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        {field("temperature", "Temperature", 0, 2, 0.1)}
        {field("topP", "Top-P", 0, 1, 0.01)}
        {field("freqPenalty", "Frequency Penalty", 0, 2, 0.1)}
        <div style={S.sliderRow}>
          <label style={S.sliderLabel}>
            <span>Max Tokens</span>
            <span style={{ color: m.color }}>{s.maxTokens}</span>
          </label>
          <input type="range" min={256} max={8192} step={256} value={s.maxTokens}
            style={S.slider}
            onChange={(e) => onChange(model, "maxTokens", parseInt(e.target.value))} />
        </div>
        <div style={S.sliderRow}>
          <label style={{ ...S.sliderLabel, marginBottom: 4 }}><span>System Prompt</span></label>
          <textarea value={s.systemPrompt} rows={4}
            style={{ ...S.textarea, minHeight: 80 }}
            placeholder="You are a helpful assistant..."
            onChange={(e) => onChange(model, "systemPrompt", e.target.value)} />
        </div>
        <button onClick={() => { onApply(); onClose(); }}
          style={{ ...S.sendBtn(false), width: "100%", padding: "12px" }}>
          ✓ Apply Settings
        </button>
      </div>
    </>
  );
}

function ComparisonMetrics({ metrics, activeModels }) {
  if (!metrics || activeModels.length === 0) return null;
  const rows = [
    { label: "Response Length", key: "length", unit: " chars", better: "higher" },
    { label: "Latency", key: "latency", unit: "ms", better: "lower" },
    { label: "Quality Score", key: "quality", unit: "/10", better: "higher" },
    { label: "Token Count", key: "tokens", unit: " tok", better: "lower" },
    { label: "Cost/Query", key: "cost", unit: "¢", better: "lower" },
  ];

  const getColor = (vals, val, better) => {
    const sorted = [...vals].sort((a, b) => better === "higher" ? b - a : a - b);
    const rank = sorted.indexOf(val);
    if (rank === 0) return "#22d3ee";
    if (rank === vals.length - 1) return "#ef4444";
    return "#f5b731";
  };

  return (
    <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={S.sidebarTitle}>Comparison Metrics</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", color: "#6e7191", padding: "4px 6px", fontWeight: 600 }}>Metric</th>
              {activeModels.map((id) => {
                const m = getModel(id);
                return <th key={id} style={{ textAlign: "center", color: m.color, padding: "4px 6px", fontWeight: 600 }}>{m.emoji}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const vals = activeModels.map((id) => metrics[id]?.[row.key] || 0);
              return (
                <tr key={row.key}>
                  <td style={{ color: "#6e7191", padding: "5px 6px" }}>{row.label}</td>
                  {activeModels.map((id) => {
                    const val = metrics[id]?.[row.key] || 0;
                    const color = getColor(vals, val, row.better);
                    return (
                      <td key={id} style={{ textAlign: "center", padding: "5px 6px" }}>
                        <span style={{ color, fontWeight: 700 }}>{val}{row.unit}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Leaderboard({ wins, onReset }) {
  const sorted = Object.entries(wins).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div style={S.sectionBlock}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={S.sidebarTitle}>Leaderboard</div>
        <button onClick={onReset} style={{ ...S.iconBtn("#ef4444"), fontSize: "10px" }}>Reset</button>
      </div>
      {sorted.length === 0 ? (
        <div style={{ fontSize: "11px", color: "#6e7191", textAlign: "center", padding: "12px 0" }}>Rate responses to build the leaderboard</div>
      ) : (
        sorted.map(([id, w], i) => {
          const m = getModel(id);
          if (!m) return null;
          return (
            <div key={id} style={S.leaderRow(i)}>
              <span style={{ fontSize: 16 }}>{medals[i] || `#${i + 1}`}</span>
              <span style={{ fontSize: 14 }}>{m.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: i === 0 ? "#f5b731" : "#e2e8f0" }}>{m.name}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ background: i === 0 ? "#f5b731" : "#22d3ee", height: 4, width: Math.max(20, w * 12), borderRadius: 2, transition: "width 0.5s ease" }} />
                <span style={{ fontSize: "11px", color: i === 0 ? "#f5b731" : "#22d3ee", fontWeight: 700 }}>{w}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function SessionHistory({ sessions, onSelect, onClear }) {
  return (
    <div style={S.sectionBlock}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={S.sidebarTitle}>Session History</div>
        <button onClick={onClear} style={{ ...S.iconBtn("#ef4444"), fontSize: "10px" }}>Clear</button>
      </div>
      {sessions.map((s) => {
        const winner = getModel(s.winner);
        return (
          <div key={s.id} style={S.sessionCard} onClick={() => onSelect(s)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,183,49,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
            <div style={{ fontSize: "11px", color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>
              {s.prompt}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {s.models.map((id) => {
                const m = getModel(id);
                return m ? <span key={id} style={{ fontSize: "10px", color: m.color }}>{m.emoji}</span> : null;
              })}
              {winner && (
                <span style={{ marginLeft: "auto", fontSize: "10px", color: "#f5b731", background: "rgba(245,183,49,0.1)", padding: "1px 6px", borderRadius: 8 }}>
                  🏆 {winner.name.split(" ")[0]}
                </span>
              )}
            </div>
            <div style={{ fontSize: "9px", color: "#6e7191", marginTop: 4 }}>{s.time}</div>
          </div>
        );
      })}
    </div>
  );
}

function ExportCenter({ activeModels, allMessages, onToast }) {
  const exportMarkdown = () => {
    const header = `| Metric | ${activeModels.map(id => getModel(id)?.name).join(" | ")} |`;
    const sep = `|--------|${activeModels.map(() => "--------|").join("")}`;
    const responseRow = `| Response | ${activeModels.map(id => {
      const msgs = allMessages[id] || [];
      const last = [...msgs].reverse().find(m => m.role === "ai");
      return last ? last.content.slice(0, 80).replace(/\n/g, " ") + "..." : "—";
    }).join(" | ")} |`;
    const md = [header, sep, responseRow].join("\n");
    navigator.clipboard.writeText(md);
    onToast("Markdown copied!");
  };

  const exportJSON = () => {
    const data = {};
    activeModels.forEach(id => { data[id] = allMessages[id] || []; });
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    onToast("JSON copied!");
  };

  const copyBest = () => {
    const bestId = activeModels[0];
    const msgs = allMessages[bestId] || [];
    const last = [...msgs].reverse().find(m => m.role === "ai");
    if (last) { navigator.clipboard.writeText(last.content); onToast("Best response copied!"); }
  };

  const screenshot = () => onToast("📸 Captured!");

  const btnStyle = {
    flex: 1, padding: "7px 10px", borderRadius: 8, fontSize: "10px", fontWeight: 600,
    cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
    background: "#1d1d28", color: "#a0aec0", transition: "all 0.15s",
  };

  return (
    <div style={S.sectionBlock}>
      <div style={S.sidebarTitle}>Export Center</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <button style={btnStyle} onClick={exportMarkdown}>⬇ Markdown</button>
        <button style={btnStyle} onClick={exportJSON}>⬇ JSON</button>
        <button style={btnStyle} onClick={copyBest}>⎘ Best</button>
        <button style={btnStyle} onClick={screenshot}>📸 Capture</button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AIAssistantHub() {
  useEffect(() => { injectStyles(); }, []);

  // Core state
  const [activeModels, setActiveModels] = useState(["gpt4o", "claude"]);
  const [prompt, setPrompt] = useState("");
  const [allMessages, setAllMessages] = useState({});
  const [typingModels, setTypingModels] = useState({});
  const [metrics, setMetrics] = useState({});
  const [wins, setWins] = useState({});
  const [sessions, setSessions] = useState(SESSION_HISTORY_MOCK);
  const [activeCategory, setActiveCategory] = useState("All");
  const [settingsModel, setSettingsModel] = useState(null);
  const [modelSettings, setModelSettings] = useState({});
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [promptCount, setPromptCount] = useState(0);
  const queryCountRef = useRef(0);
  const textareaRef = useRef(null);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2200);
  };

  const toggleModel = (id) => {
    setActiveModels((prev) => {
      if (prev.includes(id)) return prev.length > 1 ? prev.filter((m) => m !== id) : prev;
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleSend = useCallback(() => {
    const text = prompt.trim();
    if (!text || Object.values(typingModels).some(Boolean)) return;
    const idx = queryCountRef.current++;
    setPromptCount(idx + 1);

    // Add user message to each active model
    setAllMessages((prev) => {
      const next = { ...prev };
      activeModels.forEach((id) => {
        next[id] = [...(prev[id] || []), { role: "user", content: text }];
      });
      return next;
    });

    // Start typing for all active models
    const typing = {};
    activeModels.forEach((id) => { typing[id] = true; });
    setTypingModels(typing);
    setPrompt("");

    // Stream responses one by one with simulated latency
    activeModels.forEach((modelId) => {
      const m = getModel(modelId);
      const baseLatency = parseInt(m.latency) || 1000;
      const lat = baseLatency + randBetween(-100, 300);

      setTimeout(() => {
        const fullText = pickResponse(modelId, idx);
        const words = fullText.split(" ");
        let current = "";
        let wordIdx = 0;
        const tokens = randBetween(180, 620);
        const quality = (Math.random() * 2 + 7.5).toFixed(1);
        const cost = parseFloat((tokens * 0.003 / 1000).toFixed(4));

        const interval = setInterval(() => {
          if (wordIdx >= words.length) {
            clearInterval(interval);
            setTypingModels((prev) => ({ ...prev, [modelId]: false }));
            setMetrics((prev) => ({
              ...prev,
              [modelId]: {
                length: fullText.length,
                latency: lat,
                quality: parseFloat(quality),
                tokens,
                cost: parseFloat((cost * 100).toFixed(3)),
              },
            }));
          } else {
            current += (wordIdx > 0 ? " " : "") + words[wordIdx];
            wordIdx++;
            setAllMessages((prev) => {
              const msgs = [...(prev[modelId] || [])];
              const lastIdx = msgs.length - 1;
              if (msgs[lastIdx]?.role === "ai") {
                msgs[lastIdx] = { ...msgs[lastIdx], content: current, tokens, latency: lat, quality, rating: null };
              } else {
                msgs.push({ role: "ai", content: current, tokens, latency: lat, quality, rating: null });
              }
              return { ...prev, [modelId]: msgs };
            });
          }
        }, 28 + randBetween(0, 20));
      }, lat);
    });

    // Add to session history
    setSessions((prev) => [{
      id: Date.now(), prompt: text, models: activeModels,
      winner: activeModels[Math.floor(Math.random() * activeModels.length)],
      time: "just now",
    }, ...prev.slice(0, 7)]);
  }, [prompt, activeModels, typingModels]);

  const handleRate = (modelId, msgIdx, rating) => {
    setAllMessages((prev) => {
      const msgs = [...(prev[modelId] || [])];
      msgs[msgIdx] = { ...msgs[msgIdx], rating };
      return { ...prev, [modelId]: msgs };
    });
    if (rating === "up") {
      setWins((prev) => ({ ...prev, [modelId]: (prev[modelId] || 0) + 1 }));
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  };

  const handlePreset = (text) => { setPrompt(text); textareaRef.current?.focus(); };

  const handleSettingsChange = (modelId, key, value) => {
    setModelSettings((prev) => ({
      ...prev,
      [modelId]: { ...(prev[modelId] || {}), [key]: value },
    }));
  };

  const handleSessionSelect = (s) => {
    setActiveModels(s.models);
    setPrompt(s.prompt);
  };

  const categories = ["All", "Code", "Writing", "Analysis", "Translation"];
  const filteredPresets = activeCategory === "All" ? PRESET_PROMPTS : PRESET_PROMPTS.filter(p => p.category === activeCategory);

  const isTypingAny = Object.values(typingModels).some(Boolean);

  return (
    <div style={S.page}>
      {/* HERO HEADER */}
      <div style={S.hero}>
        <div style={S.heroGlow} />
        <div style={S.heroInner}>
          <h1 style={S.heroTitle}>AI Assistant Hub</h1>
          <p style={S.heroSub}>Compare, test and orchestrate multiple AI models in real-time</p>
          <div style={S.heroBadges}>
            <span style={S.badge("#f5b731")}>⚡ 8 Models</span>
            <span style={S.badge("#22d3ee")}>💬 47 Active Sessions</span>
            <span style={S.badge("#a78bfa")}>⏱ &lt;1.2s avg</span>
            <span style={S.badge("#10b981")}>✓ {activeModels.length} Selected</span>
            <span style={S.badge("#f472b6")}>🔥 {promptCount} Queries</span>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={S.layout}>

        {/* LEFT SIDEBAR — Model Selector */}
        <div style={S.sidebar}>
          <div style={S.sidebarSection}>
            <div style={S.sidebarTitle}>Select Models (max 3)</div>
            {MODELS.map((m) => {
              const active = activeModels.includes(m.id);
              return (
                <div key={m.id} style={S.modelCard(active, m.color)}
                  onClick={() => toggleModel(m.id)}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                  <span style={S.modelEmoji}>{m.emoji}</span>
                  <div style={S.modelInfo}>
                    <div style={S.modelName}>{m.name}</div>
                    <div style={S.modelProvider}>{m.provider}</div>
                    <div style={S.modelMeta}>
                      <span style={S.modelCost}>{m.cost}/1K</span>
                      <span style={S.modelLatency}>{m.latency}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div style={S.statusDot(m.status)} />
                    <button
                      onClick={(e) => { e.stopPropagation(); setSettingsModel(m.id); }}
                      style={{ background: "none", border: "none", color: "#6e7191", cursor: "pointer", fontSize: 12, padding: 0 }}>⚙</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={S.main}>

          {/* CHAT PANES */}
          <div style={S.chatArea}>
            {activeModels.map((modelId) => (
              <ChatPane
                key={modelId}
                model={modelId}
                messages={allMessages[modelId] || []}
                isTyping={!!typingModels[modelId]}
                onRate={handleRate}
                onCopy={handleCopy}
                promptCount={promptCount}
              />
            ))}
          </div>

          {/* PROMPT PRESET LIBRARY */}
          <div style={S.promptLibrary}>
            <div style={S.sidebarTitle} >Prompt Presets</div>
            <div style={S.categoryRow}>
              {categories.map((cat) => (
                <button key={cat} style={S.categoryPill(activeCategory === cat, CATEGORY_COLORS[cat] || "#f5b731")}
                  onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
            <div style={S.presetRow}>
              {filteredPresets.map((p) => (
                <button key={p.id} style={S.presetBtn} onClick={() => handlePreset(p.text)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,183,49,0.4)"; e.currentTarget.style.color = "#f5b731"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#a0aec0"; }}>
                  <span style={{ color: CATEGORY_COLORS[p.category], marginRight: 4 }}>●</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* SHARED INPUT BAR */}
          <div style={S.inputArea}>
            <div style={{ fontSize: "10px", color: "#6e7191", marginBottom: 6 }}>
              Broadcasting to: {activeModels.map(id => getModel(id)?.name).join(", ")}
            </div>
            <div style={S.sharedInput}>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your prompt — will be sent to all selected models simultaneously…"
                style={S.textarea}
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
              />
              <button style={S.sendBtn(isTypingAny || !prompt.trim())} onClick={handleSend}
                disabled={isTypingAny || !prompt.trim()}>
                {isTypingAny ? "…" : "Send ▶"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={S.rightPanel}>
          {/* Comparison Metrics */}
          <ComparisonMetrics metrics={metrics} activeModels={activeModels} />

          {/* Leaderboard */}
          <Leaderboard wins={wins} onReset={() => setWins({})} />

          {/* Export Center */}
          <ExportCenter
            activeModels={activeModels}
            allMessages={allMessages}
            onToast={showToast}
          />

          {/* Session History */}
          <SessionHistory
            sessions={sessions}
            onSelect={handleSessionSelect}
            onClear={() => setSessions([])}
          />
        </div>
      </div>

      {/* MODEL SETTINGS DRAWER */}
      <ModelSettingsDrawer
        model={settingsModel}
        settings={modelSettings}
        open={!!settingsModel}
        onClose={() => setSettingsModel(null)}
        onChange={handleSettingsChange}
        onApply={() => showToast("Settings applied!")}
      />

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
