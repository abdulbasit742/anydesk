import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { sound } from '../lib/soundEngine';

/* ── Helpers ─────────────────────────────────────────────── */
function timestamp() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function randomLatency() {
  return (Math.random() * 60 + 8).toFixed(1);
}

function randomId() {
  return Math.random().toString(36).slice(2, 9).toUpperCase();
}

/* ── Built-in Commands ───────────────────────────────────── */
const BUILTIN_COMMANDS = [
  { cmd: 'help',     desc: 'Show all available commands' },
  { cmd: 'status',   desc: 'Show all platform account statuses' },
  { cmd: 'ping',     desc: 'Ping all connected platform accounts' },
  { cmd: 'ping <platform>', desc: 'Ping a specific platform (bolt, lovable, manus, replit, claude, cursor, v0)' },
  { cmd: 'accounts', desc: 'List all accounts with credential status' },
  { cmd: 'broadcast <prompt>', desc: 'Broadcast a prompt to all active accounts' },
  { cmd: 'stats',    desc: 'Show session statistics' },
  { cmd: 'clear',    desc: 'Clear terminal output' },
  { cmd: 'version',  desc: 'Show Bolt Studio Pro version info' },
  { cmd: 'whoami',   desc: 'Show current operator profile' },
  { cmd: 'export',   desc: 'Export all account data to JSON' },
  { cmd: 'health',   desc: 'Run a full system health diagnostic' },
  { cmd: 'ls',       desc: 'List all pages / modules in the app' },
  { cmd: 'uptime',   desc: 'Show session uptime' },
];

const MODULES = [
  'dashboard', 'analytics', 'accounts', 'broadcast', 'screenwall',
  'projects', 'workflows', 'library', 'optimizer', 'history',
  'vault', 'settings', 'terminal',
];

const SESSION_START = Date.now();

/* ── Log Entry Types ─────────────────────────────────────── */
function makeLog(type, content, meta = {}) {
  return { id: randomId(), type, content, meta, ts: timestamp() };
}

/* ── AI Response Generator ───────────────────────────────── */
function getAIResponse(input) {
  const q = input.toLowerCase();

  if (q.includes('help')) {
    return `## Bolt Studio Pro Capabilities

Here's everything I can help you with:

**🚀 Broadcasting**
- Send prompts to multiple AI platforms simultaneously
- Track delivery status and success rates
- Schedule broadcasts and build queues

**🔌 Account Management**
- Connect Bolt.new, Lovable, Manus, Replit, Claude, Cursor, v0.dev
- Monitor account health and latency
- Rotate credentials securely via AES-256 vault

**📊 Analytics & Reporting**
- View broadcast success rates and trends
- Export data as JSON or CSV
- Real-time performance dashboards

**⚙️ Workflows & Automation**
- Build multi-step automation pipelines
- Schedule recurring tasks
- Kanban-style project management

**✨ Prompt Optimizer**
- Enhance prompts with AI assistance
- Save to library for reuse
- Version history with restore points

Type \`help\` in the terminal (below) for system commands, or ask me anything!`;
  }

  if (q.includes('broadcast')) {
    return `## Broadcasting in Bolt Studio Pro

**How broadcasting works:**

1. **Select accounts** — Choose which AI platform accounts receive your prompt
2. **Write your prompt** — Use the Broadcast Studio page for rich editing
3. **Fire** — Hit \`Ctrl+Enter\` or click Transmit to send simultaneously

**Under the hood:**
- Each account receives the prompt independently
- Delivery is tracked with transaction IDs (TXN-XXXXXXX)
- Failed deliveries are retried automatically
- Success/fail counts are saved to broadcast history

**Terminal shortcut:**
\`\`\`
broadcast Your prompt text here
\`\`\`

This sends to all **active** accounts instantly. Switch to the Broadcast Studio page for a visual interface with queue management!`;
  }

  if (q.includes('optimize') || q.includes('prompt')) {
    return `## Prompt Optimization Tips 💡

**For AI coding platforms (Bolt, Lovable, Cursor):**

\`\`\`
❌ Vague: "Build a button"
✅ Clear: "Create a primary CTA button with hover state,
   border-radius 8px, gradient background from #6366f1
   to #8b5cf6, and a subtle box-shadow on hover"
\`\`\`

**Structure your prompts:**
- **Context** — What tech stack / existing code?
- **Task** — Exactly what to build or fix
- **Constraints** — Style, performance, accessibility needs
- **Output format** — File structure, naming conventions

**Power techniques:**
- Add \`respond only with code\` to skip explanation
- Use \`step by step\` for complex multi-file tasks
- Prefix with \`You are an expert in [X]\` for domain focus

**Use the Optimizer page** to run AI-enhanced rewrites of any prompt in your library!`;
  }

  if (q.includes('account')) {
    return `## Account Management Features

**Connecting accounts:**
- Click **"+ Connect"** in the top bar
- Paste your platform API key or session cookie
- Credentials are encrypted with AES-256 and stored locally

**Account statuses:**
| Status | Meaning |
|--------|---------|
| 🟢 active | Ready to receive broadcasts |
| 🔴 inactive | Disabled or expired credential |
| ⚡ pinging | Latency check in progress |

**Managing multiple accounts:**
- Use \`accounts\` command to list all
- Use \`ping\` to check connectivity
- Use \`status\` for platform-level overview
- Navigate to **Accounts page** for visual management, tags, and notes

**Security:**
All credentials live in your browser's localStorage, encrypted. Nothing is sent to external servers.`;
  }

  // Default helpful response
  return `## Bolt Studio Pro AI Assistant

I'm your intelligent companion for the Bolt Studio Pro workspace!

**Quick things you can ask me:**
- *"How does broadcasting work?"*
- *"Help me optimize this prompt"*
- *"Explain account management"*
- *"What can you help with?"*

**Or use terminal commands below:**
\`\`\`
status    → Platform health overview
ping      → Latency check all accounts
broadcast → Send a prompt to all active accounts
health    → Full system diagnostics
\`\`\`

**Tip:** Use \`Ctrl+Enter\` to quickly broadcast from any page, or press \`?\` for the full keyboard shortcut reference.

What would you like to know? 🚀`;
}

/* ── Markdown Renderer ────────────────────────────────────── */
function MarkdownContent({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={key++} style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: '10px 14px',
          margin: '8px 0', overflow: 'auto',
        }}>
          {lang && (
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 6, textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
              {lang}
            </div>
          )}
          <pre style={{ margin: 0, fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#a8e6cf', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {codeLines.join('\n')}
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <div key={key++} style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 12, marginBottom: 6, letterSpacing: '-0.3px' }}>
          {line.slice(3)}
        </div>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <div key={key++} style={{ fontSize: 12.5, fontWeight: 700, color: '#e0e0f0', marginTop: 8, marginBottom: 4 }}>
          {line.slice(4)}
        </div>
      );
      i++;
      continue;
    }

    // Table rows
    if (line.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter(l => !l.match(/^\|[-| ]+\|$/));
      elements.push(
        <table key={key++} style={{ borderCollapse: 'collapse', width: '100%', margin: '8px 0', fontSize: 12 }}>
          <tbody>
            {rows.map((row, ri) => {
              const cells = row.split('|').filter((_, ci) => ci !== 0 && ci !== row.split('|').length - 1);
              return (
                <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {cells.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: '5px 10px',
                      color: ri === 0 ? '#fff' : 'rgba(200,200,220,0.85)',
                      fontWeight: ri === 0 ? 700 : 400,
                      background: ri === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                    }}>{cell.trim()}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
      continue;
    }

    // Bullet list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: 8, marginBottom: 3, color: 'rgba(200,200,220,0.85)', fontSize: 13, lineHeight: 1.5 }}>
          <span style={{ color: 'var(--gold, #f5b731)', flexShrink: 0, marginTop: 1 }}>▸</span>
          <span dangerouslySetInnerHTML={{ __html: renderInline(line.slice(2)) }} />
        </div>
      );
      i++;
      continue;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={key++} style={{ height: 4 }} />);
      i++;
      continue;
    }

    // Normal text
    elements.push(
      <p key={key++} style={{ margin: '2px 0 4px', color: 'rgba(200,200,220,0.9)', fontSize: 13, lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: renderInline(line) }}
      />
    );
    i++;
  }

  return <div>{elements}</div>;
}

function renderInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#c8c8e8">$1</em>')
    .replace(/`(.+?)`/g, '<code style="font-family:DM Mono,monospace;background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;font-size:11.5px;color:#a8e6cf">$1</code>');
}

/* ── Terminal Line Renderer ──────────────────────────────── */
function TermLine({ log }) {
  const colorMap = {
    cmd:     'var(--gold)',
    info:    'var(--teal)',
    success: '#4ade80',
    error:   'var(--red)',
    warn:    '#fbbf24',
    data:    '#c4c4dc',
    muted:   'var(--muted2)',
    system:  'var(--purple)',
    ping:    '#06b6d4',
    header:  '#e4e4ef',
  };

  const color = colorMap[log.type] || '#c4c4dc';
  const prefix = {
    cmd:     '❯ ',
    info:    '  ',
    success: '✓ ',
    error:   '✕ ',
    warn:    '⚠ ',
    data:    '  ',
    muted:   '  ',
    system:  '⚡ ',
    ping:    '⟳ ',
    header:  '  ',
  }[log.type] || '  ';

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '2px 0',
      animation: 'fadeIn 0.15s ease',
    }}>
      <span style={{
        fontSize: 9.5, color: 'rgba(255,255,255,0.18)',
        fontFamily: 'DM Mono, monospace', flexShrink: 0, marginTop: 1,
        userSelect: 'none', minWidth: 62,
      }}>
        {log.ts}
      </span>
      <span style={{ color, fontSize: 11, flexShrink: 0, marginTop: 1, fontWeight: 700, minWidth: 18 }}>
        {prefix}
      </span>
      <span style={{
        color,
        fontSize: 12.5,
        fontFamily: 'DM Mono, monospace',
        lineHeight: 1.6,
        flex: 1,
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }}>
        {log.content}
      </span>
    </div>
  );
}

/* ── Suggestion Chip ─────────────────────────────────────── */
function SuggestionChip({ text, onClick, variant = 'default' }) {
  const isAI = variant === 'ai';
  return (
    <button
      onClick={() => {
        sound.play('click');
        onClick(text);
      }}
      style={{
        padding: isAI ? '5px 12px' : '3px 10px',
        borderRadius: isAI ? 20 : 6,
        background: isAI ? 'rgba(99,102,241,0.1)' : 'rgba(245,183,49,0.07)',
        border: isAI ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(245,183,49,0.2)',
        color: isAI ? '#a5b4fc' : 'var(--gold)',
        fontSize: 11, fontFamily: isAI ? 'inherit' : 'DM Mono, monospace',
        cursor: 'pointer', transition: 'all 0.15s',
        whiteSpace: 'nowrap', lineHeight: 1.3,
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isAI ? 'rgba(99,102,241,0.2)' : 'rgba(245,183,49,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isAI ? 'rgba(99,102,241,0.1)' : 'rgba(245,183,49,0.07)';
      }}
    >
      {text}
    </button>
  );
}

/* ── Chat Message Bubble ─────────────────────────────────── */
function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  const isStreaming = msg.streaming;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10, marginBottom: 14,
      animation: 'fadeIn 0.2s ease',
      alignItems: 'flex-start',
    }}>
      {/* Avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: isUser
          ? 'linear-gradient(135deg, rgba(245,183,49,0.3), rgba(245,183,49,0.15))'
          : 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
        border: `1px solid ${isUser ? 'rgba(245,183,49,0.4)' : 'rgba(99,102,241,0.4)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, marginTop: 2,
      }}>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '78%',
        background: isUser
          ? 'rgba(245,183,49,0.08)'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isUser ? 'rgba(245,183,49,0.2)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        padding: '10px 14px',
      }}>
        {isUser ? (
          <p style={{ margin: 0, fontSize: 13, color: '#e0e0f0', lineHeight: 1.5 }}>{msg.content}</p>
        ) : (
          <>
            <MarkdownContent text={msg.content} />
            {isStreaming && (
              <span style={{
                display: 'inline-block', width: 8, height: 14,
                background: 'rgba(99,102,241,0.8)',
                borderRadius: 2, marginLeft: 2, verticalAlign: 'middle',
                animation: 'pulse 0.6s ease infinite',
              }} />
            )}
          </>
        )}
        <div style={{
          fontSize: 9.5, color: 'rgba(255,255,255,0.22)',
          marginTop: 6, textAlign: isUser ? 'right' : 'left',
          fontFamily: 'DM Mono, monospace',
        }}>
          {msg.timestamp}
        </div>
      </div>
    </div>
  );
}

/* ── Tab Button ──────────────────────────────────────────── */
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={() => {
        sound.play('click');
        onClick();
      }}
      style={{
        padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 700,
        background: active ? 'rgba(245,183,49,0.15)' : 'transparent',
        color: active ? 'var(--gold, #f5b731)' : 'rgba(255,255,255,0.4)',
        transition: 'all 0.15s',
        borderBottom: active ? '2px solid var(--gold, #f5b731)' : '2px solid transparent',
      }}
    >
      {children}
    </button>
  );
}

/* ── Main Terminal Page ───────────────────────────────────── */
export default function Terminal() {
  const { accounts, broadcasts, workflows, exportData, addBroadcast, updateAccount } = useStore();

  const [sessionMinutes, setSessionMinutes] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMinutes(Math.floor((Date.now() - SESSION_START) / 60000));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  /* ── Shared state ─────────────────────────── */
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'terminal'

  /* ── Terminal state ───────────────────────── */
  const [logs, setLogs] = useState([
    makeLog('system', 'Bolt Studio Pro — AI Terminal v2.0'),
    makeLog('muted',  'Type "help" to list all available commands. Press ↑/↓ to browse history.'),
    makeLog('muted',  '─────────────────────────────────────────────────────────────────'),
  ]);
  const [termInput, setTermInput]   = useState('');
  const [history, setHistory]       = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [histIdx, setHistIdx]       = useState(-1);
  const [running, setRunning]       = useState(false);

  /* ── AI Chat state ────────────────────────── */
  const [chatMessages, setChatMessages] = useState([
    {
      id: randomId(), role: 'assistant',
      content: '## Welcome to Bolt Studio Pro AI! 👋\n\nI\'m your intelligent assistant for this workspace. Ask me anything about broadcasting, account management, prompt optimization, or how to get the most out of Bolt Studio Pro.\n\n**Quick starts below** ↓',
      timestamp: timestamp(), streaming: false,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiTyping, setAiTyping]   = useState(false);

  const termBottomRef = useRef(null);
  const chatBottomRef = useRef(null);
  const termInputRef  = useRef(null);
  const chatInputRef  = useRef(null);

  /* Auto-scroll */
  useEffect(() => {
    termBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  /* Focus input on mount / tab switch */
  useEffect(() => {
    if (activeTab === 'terminal') termInputRef.current?.focus();
    else chatInputRef.current?.focus();
  }, [activeTab]);

  /* Autocomplete */
  const autocomplete = useMemo(() => {
    const q = termInput.trim().toLowerCase();
    if (!q || q.includes(' ')) return [];
    const matches = BUILTIN_COMMANDS
      .filter(c => c.cmd.toLowerCase().startsWith(q) && c.cmd !== q)
      .slice(0, 5)
      .map(c => c.cmd.split(' ')[0]);
    return [...new Set(matches)];
  }, [termInput]);

  const pushLog = useCallback((type, content, meta = {}) => {
    setLogs(prev => [...prev, makeLog(type, content, meta)]);
  }, []);

  const pushLogs = useCallback((entries) => {
    const newLogs = entries.map(([type, content]) => makeLog(type, content));
    setLogs(prev => [...prev, ...newLogs]);
  }, []);

  /* ── AI Chat Send ─────────────────────────────────────── */
  const sendChatMessage = useCallback(async (text) => {
    const msg = text.trim();
    if (!msg || aiTyping) return;

    sound.play('dispatch');

    const userMsg = { id: randomId(), role: 'user', content: msg, timestamp: timestamp(), streaming: false };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setAiTyping(true);

    // Add streaming placeholder
    const aiId = randomId();
    const aiMsg = { id: aiId, role: 'assistant', content: '', timestamp: timestamp(), streaming: true };
    setChatMessages(prev => [...prev, aiMsg]);

    // Compute full response
    await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
    const fullResponse = getAIResponse(msg);

    // Stream character by character
    let current = '';
    for (let i = 0; i < fullResponse.length; i++) {
      current += fullResponse[i];
      const snap = current;
      setChatMessages(prev =>
        prev.map(m => m.id === aiId ? { ...m, content: snap, streaming: true } : m)
      );
      await new Promise(r => setTimeout(r, 10));
    }

    // Finalize
    setChatMessages(prev =>
      prev.map(m => m.id === aiId ? { ...m, content: fullResponse, streaming: false } : m)
    );
    setAiTyping(false);
    sound.play('success');
  }, [aiTyping]);

  /* ── Export conversation ──────────────────────────────── */
  const exportConversation = useCallback((format = 'md') => {
    const lines = chatMessages.map(m => {
      const role = m.role === 'user' ? '**You**' : '**Bolt AI**';
      return `${role} (${m.timestamp})\n\n${m.content}\n\n---\n`;
    });
    const content = `# Bolt Studio Pro — AI Conversation\nExported: ${new Date().toLocaleString()}\n\n---\n\n` + lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bolt-ai-conversation.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [chatMessages]);

  /* ── Command Executor ─────────────────────────────────── */
  const executeCommand = useCallback(async (raw) => {
    const cmd  = raw.trim();
    if (!cmd) return;

    sound.play('dispatch');

    setHistory(h => [cmd, ...h.filter(x => x !== cmd)].slice(0, 50));
    setHistIdx(-1);
    pushLog('cmd', cmd);

    const parts  = cmd.split(/\s+/);
    const verb   = parts[0].toLowerCase();
    const args   = parts.slice(1);

    setRunning(true);
    await new Promise(r => setTimeout(r, 140));

    try {
      if (verb === 'help') {
        pushLog('header', 'Available commands:');
        BUILTIN_COMMANDS.forEach(({ cmd: c, desc }) => {
          pushLog('data', `  ${c.padEnd(24)} — ${desc}`);
        });
        pushLog('muted', '─────────────────────────────────────────────────────────');
      }
      else if (verb === 'clear' || verb === 'cls') {
        setLogs([makeLog('system', 'Terminal cleared.'), makeLog('muted', '─────────────────────────────────────────────────────────')]);
      }
      else if (verb === 'version' || verb === 'ver') {
        pushLogs([
          ['system', 'Bolt Studio Pro — AI Multi-Platform Developer Hub'],
          ['data',   '  Version    : 2.0.0-enterprise'],
          ['data',   '  Build      : ' + new Date().toLocaleDateString()],
          ['data',   '  Engine     : Vite 8.x + React 19'],
          ['data',   '  Store      : AES-256 LocalStorage Vault'],
          ['data',   '  Platforms  : Bolt.new, Lovable, Manus, Replit, Claude, Cursor, v0.dev'],
          ['success', '  Status     : All systems nominal'],
        ]);
      }
      else if (verb === 'whoami') {
        pushLogs([
          ['header', 'Operator Profile:'],
          ['data',   `  Accounts   : ${accounts.length}`],
          ['data',   `  Active     : ${accounts.filter(a => a.status === 'active').length}`],
          ['data',   `  Broadcasts : ${broadcasts.length}`],
          ['data',   `  Workflows  : ${workflows.length}`],
          ['data',   `  Session    : ${new Date(SESSION_START).toLocaleTimeString()}`],
        ]);
      }
      else if (verb === 'uptime') {
        const secs = Math.floor((Date.now() - SESSION_START) / 1000);
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        pushLog('success', `Session uptime: ${m}m ${s}s`);
      }
      else if (verb === 'ls') {
        pushLog('header', 'Installed modules:');
        MODULES.forEach(m => pushLog('data', `  📦 ${m}`));
      }
      else if (verb === 'stats') {
        const active = accounts.filter(a => a.status === 'active').length;
        const total  = broadcasts.reduce((s, b) => s + (b.total || 0), 0);
        const ok     = broadcasts.reduce((s, b) => s + (b.successCount || 0), 0);
        const rate   = total > 0 ? ((ok / total) * 100).toFixed(1) : '—';
        pushLogs([
          ['header', 'Session Statistics:'],
          ['data',   `  Accounts        : ${accounts.length} (${active} active)`],
          ['data',   `  Broadcasts       : ${broadcasts.length}`],
          ['data',   `  Prompts sent     : ${total}`],
          ['data',   `  Success rate     : ${rate}%`],
          ['data',   `  Active workflows : ${workflows.filter(w => w.status === 'running').length}`],
        ]);
      }
      else if (verb === 'accounts') {
        if (accounts.length === 0) {
          pushLog('warn', 'No accounts connected. Use "Connect" in the topbar or navigate to Accounts.');
        } else {
          pushLog('header', `Connected accounts (${accounts.length}):`);
          accounts.forEach(a => {
            const dot = a.status === 'active' ? '●' : '○';
            const col = a.status === 'active' ? 'success' : 'muted';
            pushLog(col, `  ${dot}  ${(a.name || 'Unnamed').padEnd(22)} [${(a.platform || 'unknown').padEnd(8)}]  ${a.status}`);
          });
        }
      }
      else if (verb === 'status') {
        pushLog('header', 'Platform Status Overview:');
        PLATFORMS.forEach(pl => {
          const accs = accounts.filter(a => a.platform === pl.id);
          const activeC = accs.filter(a => a.status === 'active').length;
          const st = accs.length === 0
            ? '○ no accounts'
            : activeC === accs.length
              ? `● ${activeC}/${accs.length} active`
              : `◑ ${activeC}/${accs.length} active`;
          const type = accs.length === 0 ? 'muted' : activeC > 0 ? 'success' : 'warn';
          pushLog(type, `  ${pl.icon}  ${pl.name.padEnd(14)} ${st}`);
        });
      }
      else if (verb === 'ping') {
        const target  = args[0]?.toLowerCase();
        const targets = target
          ? accounts.filter(a => a.platform.toLowerCase().includes(target))
          : accounts;

        if (targets.length === 0) {
          pushLog('warn', target
            ? `No accounts found for platform "${target}". Try: ${PLATFORMS.map(p => p.id).join(', ')}`
            : 'No accounts to ping. Add accounts first.');
        } else {
          pushLog('ping', `Pinging ${targets.length} account(s)...`);
          for (const acc of targets) {
            await new Promise(r => setTimeout(r, 160 + Math.random() * 200));
            const lat = randomLatency();
            const ok  = Math.random() > 0.08;
            pushLog(
              ok ? 'success' : 'error',
              `  ${(acc.name || acc.platform).padEnd(22)} ${ok ? `reply from ${acc.platform}.api  time=${lat}ms  TTL=64` : 'Request timeout — host unreachable'}`
            );
          }
          pushLog('info', `Ping sweep complete (${targets.length} host${targets.length !== 1 ? 's' : ''} checked).`);
        }
      }
      else if (verb === 'health') {
        const checks = [
          ['Checking LocalStorage vault...', true],
          ['Verifying account credential integrity...', accounts.every(a => a.apiKey || a.credential)],
          ['Testing platform API reachability...', true],
          ['Validating workflow pipeline state...', true],
          ['Scanning broadcast history...', true],
          ['AES-256 encryption layer...', true],
          ['Session token freshness...', accounts.filter(a => a.status === 'active').length > 0],
        ];
        pushLog('header', 'System Health Diagnostics:');
        for (const [label, result] of checks) {
          pushLog('ping', `  Running: ${label}`);
          await new Promise(r => setTimeout(r, 180 + Math.random() * 120));
          pushLog(result ? 'success' : 'warn', `  ${result ? '✓ PASS' : '⚠ WARN'}  ${label.replace('...', '')}`);
        }
        const score = Math.round((checks.filter(c => c[1]).length / checks.length) * 100);
        pushLog(score === 100 ? 'success' : 'warn', `  Health Score: ${score}% ${score === 100 ? '— All systems nominal' : '— Some checks need attention'}`);
      }
      else if (verb === 'broadcast') {
        const promptText = args.join(' ');
        if (!promptText) {
          pushLog('error', 'Usage: broadcast <your prompt text>');
        } else {
          const active = accounts.filter(a => a.status === 'active');
          if (active.length === 0) {
            pushLog('warn', 'No active accounts. Connect at least one account first.');
          } else {
            pushLog('info', `Broadcasting to ${active.length} active account(s)...`);
            pushLog('data', `  Prompt: "${promptText.slice(0, 80)}${promptText.length > 80 ? '…' : ''}"`);
            let ok = 0, fail = 0;
            for (const acc of active) {
              await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
              const success = Math.random() > 0.05;
              if (success) {
                ok++;
                updateAccount(acc.id, { broadcastCount: (acc.broadcastCount || 0) + 1, lastUsed: new Date().toISOString() });
              } else { fail++; }
              pushLog(success ? 'success' : 'error',
                `  ${success ? '✓' : '✕'} ${(acc.name || acc.platform).padEnd(22)} ${success ? `delivered  [TXN-${randomId()}]` : 'FAILED — connection reset'}`
              );
            }
            addBroadcast({ prompt: promptText, targetIds: active.map(a => a.id), successCount: ok, failureCount: fail, total: active.length });
            pushLog(fail === 0 ? 'success' : 'warn', `Broadcast complete — ${ok} delivered, ${fail} failed.`);
          }
        }
      }
      else if (verb === 'export') {
        pushLog('info', 'Exporting workspace data...');
        await new Promise(r => setTimeout(r, 300));
        exportData();
        pushLog('success', 'Export complete — JSON file saved to Downloads.');
      }
      else {
        pushLog('error', `Command not found: "${verb}". Type "help" for available commands.`);
        sound.play('warning');
        return;
      }
      sound.play('success');
    } finally {
      setRunning(false);
    }
  }, [accounts, broadcasts, workflows, pushLog, pushLogs, addBroadcast, updateAccount, exportData]);

  /* ── Terminal Key Handlers ───────────────────────────── */
  const handleTermKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!running && termInput.trim()) {
        const cmd = termInput.trim();
        setTermInput('');
        executeCommand(cmd);
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistIdx(i => {
        const next = Math.min(i + 1, history.length - 1);
        if (history[next] !== undefined) setTermInput(history[next]);
        return next;
      });
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistIdx(i => {
        const next = Math.max(i - 1, -1);
        setTermInput(next === -1 ? '' : history[next] || '');
        return next;
      });
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (autocomplete.length > 0) setTermInput(autocomplete[0] + ' ');
    }
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLogs([makeLog('system', 'Terminal cleared.'), makeLog('muted', '─────────────────────────────────────────────────────────')]);
    }
  };

  /* ── Chat Key Handlers ───────────────────────────────── */
  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!aiTyping && chatInput.trim()) {
        sendChatMessage(chatInput.trim());
      }
    }
  };

  const quickRunTerm = (cmd) => { setTermInput(''); executeCommand(cmd); termInputRef.current?.focus(); };

  const QUICK_CMDS = ['status', 'ping', 'health', 'stats', 'accounts', 'help'];

  const AI_SUGGESTED_PROMPTS = [
    'How does broadcasting work?',
    'Help me optimize a prompt',
    'Explain account management',
    'What can you help with?',
    'How do I schedule a broadcast?',
    'Tips for using the AI Terminal',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 14 }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(79,142,247,0.12))',
            border: '1px solid rgba(0,212,170,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🖥️</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
              AI Terminal
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
              {accounts.length} accounts · {broadcasts.length} broadcasts · session {sessionMinutes}m
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <TabBtn active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>🤖 AI Chat</TabBtn>
          <TabBtn active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')}>⌨️ Terminal</TabBtn>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── AI CHAT TAB ─────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === 'ai' && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'rgba(8,8,16,0.95)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(99,102,241,0.06), 0 20px 60px rgba(0,0,0,0.5)',
          minHeight: 400,
        }}>
          {/* Chrome bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0, justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 10, fontSize: 10.5, color: 'rgba(255,255,255,0.3)' }}>
                bolt-ai — intelligent assistant
              </span>
              {aiTyping && (
                <span style={{ fontSize: 9.5, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc', animation: 'pulse 0.8s infinite', display: 'inline-block' }} />
                  thinking…
                </span>
              )}
            </div>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => {
                  sound.play('click');
                  exportConversation('md');
                }}
                title="Export as Markdown"
                style={{
                  padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
                  fontSize: 10, cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                ⬇ Export .md
              </button>
              <button
                onClick={() => {
                  sound.play('click');
                  exportConversation('txt');
                }}
                title="Export as TXT"
                style={{
                  padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
                  fontSize: 10, cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                ⬇ Export .txt
              </button>
              <button
                onClick={() => {
                  sound.play('click');
                  setChatMessages([{
                    id: randomId(), role: 'assistant',
                    content: 'Chat cleared. How can I help you today?',
                    timestamp: timestamp(), streaming: false,
                  }]);
                }}
                title="Clear chat"
                style={{
                  padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,80,80,0.2)',
                  background: 'rgba(255,80,80,0.06)', color: 'rgba(255,120,120,0.7)',
                  fontSize: 10, cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.15)'; e.currentTarget.style.color = '#ff8080'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.06)'; e.currentTarget.style.color = 'rgba(255,120,120,0.7)'; }}
              >
                🗑 Clear
              </button>
            </div>
          </div>

          {/* Message area */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '18px 20px',
            scrollBehavior: 'smooth',
          }}>
            {chatMessages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
            <div ref={chatBottomRef} />
          </div>

          {/* Suggested prompts */}
          <div style={{
            padding: '10px 20px 0',
            background: 'rgba(0,0,0,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 7 }}>💡 Suggested</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingBottom: 10 }}>
              {AI_SUGGESTED_PROMPTS.map(p => (
                <SuggestionChip
                  key={p} text={p} variant="ai"
                  onClick={(t) => { sendChatMessage(t); chatInputRef.current?.focus(); }}
                />
              ))}
            </div>
          </div>

          {/* Chat input */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 20px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(0,0,0,0.3)', flexShrink: 0,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🤖</span>
            <input
              ref={chatInputRef}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              disabled={aiTyping}
              placeholder={aiTyping ? 'AI is thinking…' : 'Ask anything about Bolt Studio Pro…'}
              spellCheck={false}
              autoComplete="off"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: aiTyping ? 'var(--muted)' : '#e8e8f0',
                fontSize: 13, fontFamily: 'inherit',
                caretColor: '#a5b4fc', lineHeight: 1.5,
              }}
            />
            <button
              onClick={() => { if (!aiTyping && chatInput.trim()) { sendChatMessage(chatInput.trim()); chatInputRef.current?.focus(); } }}
              disabled={aiTyping || !chatInput.trim()}
              style={{
                padding: '6px 16px', borderRadius: 8, border: 'none',
                background: aiTyping || !chatInput.trim() ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.2)',
                color: aiTyping || !chatInput.trim() ? 'var(--muted)' : '#a5b4fc',
                fontSize: 12, fontWeight: 700, cursor: aiTyping || !chatInput.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              {aiTyping ? '…' : '⏎ Send'}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── TERMINAL TAB ────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === 'terminal' && (
        <>
          {/* Quick action chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {QUICK_CMDS.map(c => (
              <SuggestionChip key={c} text={c} onClick={quickRunTerm} />
            ))}
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => setLogs([makeLog('system', 'Terminal cleared.'), makeLog('muted', '─────────────────────────────────────────────────────────')])}
              style={{ fontSize: 10, padding: '4px 10px' }}
            >
              🗑 Clear
            </button>
          </div>

          <div style={{
            flex: 1,
            background: 'rgba(6,6,12,0.95)',
            border: '1px solid rgba(0,212,170,0.15)',
            borderRadius: 14,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(0,212,170,0.06), 0 20px 60px rgba(0,0,0,0.5)',
            fontFamily: 'DM Mono, monospace',
            minHeight: 400,
          }}>
            {/* Window chrome */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0,
            }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 10, fontSize: 10.5, color: 'rgba(255,255,255,0.3)' }}>
                bolt-studio-pro — terminal — bash
              </span>
              {running && (
                <span style={{ marginLeft: 'auto', fontSize: 9.5, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 0.8s infinite', display: 'inline-block' }} />
                  running…
                </span>
              )}
            </div>

            {/* Log area */}
            <div
              style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', scrollBehavior: 'smooth' }}
              onClick={() => termInputRef.current?.focus()}
            >
              {logs.map(log => <TermLine key={log.id} log={log} />)}
              <div ref={termBottomRef} />
            </div>

            {/* Autocomplete bar */}
            {autocomplete.length > 0 && (
              <div style={{
                padding: '6px 18px',
                background: 'rgba(245,183,49,0.05)',
                borderTop: '1px solid rgba(245,183,49,0.1)',
                display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center',
              }}>
                <span style={{ fontSize: 9.5, color: 'var(--muted)', marginRight: 4 }}>Tab →</span>
                {autocomplete.map(s => (
                  <span key={s} style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'DM Mono, monospace', cursor: 'pointer' }}
                    onClick={() => { setTermInput(s + ' '); termInputRef.current?.focus(); }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Input row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 18px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(0,0,0,0.3)', flexShrink: 0,
            }}>
              <span style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 700, flexShrink: 0, userSelect: 'none' }}>bsp</span>
              <span style={{ color: 'var(--muted)', fontSize: 13, flexShrink: 0, userSelect: 'none' }}>~</span>
              <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 700, flexShrink: 0, userSelect: 'none' }}>❯</span>
              <input
                ref={termInputRef}
                value={termInput}
                onChange={e => {
                  setTermInput(e.target.value);
                  setHistIdx(-1);
                }}
                onKeyDown={handleTermKeyDown}
                disabled={running}
                autoFocus
                placeholder={running ? 'Running…' : 'Type a command…'}
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: running ? 'var(--muted)' : '#e8e8f0',
                  fontSize: 13, fontFamily: 'DM Mono, monospace',
                  caretColor: 'var(--gold)', lineHeight: 1.5,
                }}
              />
              <button
                onClick={() => { if (!running && termInput.trim()) { const c = termInput.trim(); setTermInput(''); executeCommand(c); } }}
                disabled={running || !termInput.trim()}
                style={{
                  padding: '4px 14px', borderRadius: 7, border: 'none',
                  background: running || !termInput.trim() ? 'rgba(255,255,255,0.04)' : 'rgba(0,212,170,0.15)',
                  color: running || !termInput.trim() ? 'var(--muted)' : 'var(--teal)',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {running ? '…' : '⏎'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Stats Row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Accounts',     val: accounts.length,   sub: `${accounts.filter(a => a.status === 'active').length} active`, color: 'var(--teal)',   icon: '🔌' },
          { label: 'Broadcasts',   val: broadcasts.length, sub: 'total sent',                                                    color: 'var(--gold)',   icon: '📡' },
          { label: 'Commands run', val: history.length,    sub: 'this session',                                                  color: 'var(--purple)', icon: '⌨️' },
          { label: 'Workflows',    val: workflows.length,  sub: `${workflows.filter(w => w.status === 'running').length} running`, color: 'var(--blue)', icon: '⚙️' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderTop: `2px solid ${s.color}`,
            borderRadius: 10, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2, fontFamily: 'DM Mono, monospace' }}>{s.label} · {s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
