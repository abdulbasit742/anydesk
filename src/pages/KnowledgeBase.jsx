import { useState, useMemo } from 'react';

const ARTICLES = [
  {
    id: 'getting-started',
    category: 'Getting Started',
    title: 'Welcome to Bolt Studio Pro',
    icon: '🚀',
    content: `Bolt Studio Pro is a unified control center for all your AI coding platforms.\n\n## What you can do\n\n- **Connect accounts** from Bolt.new, Lovable, Manus, Replit, Claude, Cursor, and v0.dev\n- **Broadcast prompts** to all accounts simultaneously with one keystroke\n- **Track credits** across all platforms in real time\n- **Build workflows** that automate multi-step AI tasks\n- **Optimize prompts** with the built-in AI optimizer\n\n## Quick start\n\n1. Click **Connect Account** in the sidebar\n2. Choose your platform\n3. Enter your credentials\n4. Start broadcasting!`,
    tags: ['intro', 'setup'],
    related: ['connecting-accounts', 'first-broadcast'],
  },
  {
    id: 'connecting-accounts',
    category: 'Accounts',
    title: 'Connecting Your Accounts',
    icon: '🔌',
    content: `## How to find your credentials\n\n### Bolt.new\nOpen DevTools → Application → Cookies → bolt.new → Copy the \`__session\` value.\n\n### Lovable\nGo to Settings → API → Generate Token. Copy the \`lvbl_\` token.\n\n### Claude.ai\nOpen DevTools → Network tab → Find any request → Copy the \`Cookie\` header value.\n\n### Replit\nAccount → Privacy & Security → API Keys → Generate a new key.\n\n## Security\n\nAll credentials are stored locally in your browser's localStorage. They never leave your device. Use the Security Vault page to audit stored credentials.`,
    tags: ['accounts', 'credentials', 'security'],
    related: ['security-vault', 'getting-started'],
  },
  {
    id: 'first-broadcast',
    category: 'Broadcasting',
    title: 'Your First Broadcast',
    icon: '📡',
    content: `## Sending your first broadcast\n\n1. Navigate to **Broadcast Studio** from the sidebar\n2. Type your prompt in the text area\n3. Select which accounts to target (or leave all selected)\n4. Press **Enter** or click **Broadcast**\n\n## Tips for effective broadcasts\n\n- Keep prompts clear and specific\n- Use the **AI Optimizer** to enhance prompts before broadcasting\n- Set a **delay** between sends to avoid rate limiting (Settings → Broadcast Delay)\n- Use the **Screen Wall** to monitor all 12 screens simultaneously\n\n## Keyboard shortcut\n\nPress **Enter** in the command bar to broadcast to all accounts at once.`,
    tags: ['broadcast', 'tips'],
    related: ['screen-wall', 'ai-optimizer'],
  },
  {
    id: 'screen-wall',
    category: 'Broadcasting',
    title: 'Using Screen Wall',
    icon: '🖥',
    content: `The Screen Wall shows all your connected accounts in a 3×4 grid.\n\n## Features\n\n- **Live status indicators** — see which accounts are active\n- **One-command broadcast** — type in the command bar and press Enter to send to all\n- **Sweep animation** — watch the broadcast propagate account by account\n- **Delivery tracking** — see ✓/✕ per account in real time\n\n## Best practices\n\n- Keep the Screen Wall open on a second monitor\n- Use the platform filter to target specific services\n- Watch for red indicators (failed sends) and retry those accounts`,
    tags: ['screenwall', 'broadcast'],
    related: ['first-broadcast'],
  },
  {
    id: 'ai-optimizer',
    category: 'Prompts',
    title: 'AI Prompt Optimizer',
    icon: '✨',
    content: `The AI Optimizer enhances your prompts before broadcasting.\n\n## What it does\n\n- Adds specificity and context\n- Removes ambiguity\n- Structures the prompt with role/task/format sections\n- Shows a side-by-side comparison of original vs enhanced\n\n## Scoring\n\nEach prompt receives a quality score (0–100%) based on:\n- Clarity\n- Specificity\n- Structure\n- Completeness\n\n## Prompt Builder\n\nFor advanced users, use the **Prompt Builder** to construct prompts block by block with variable injection ({{variableName}}).`,
    tags: ['optimizer', 'prompts', 'quality'],
    related: ['first-broadcast', 'prompt-builder'],
  },
  {
    id: 'security-vault',
    category: 'Security',
    title: 'Security Vault',
    icon: '🔒',
    content: `## How credentials are stored\n\nAll credentials are stored in your browser's localStorage using basic encoding. They never leave your device or get sent to any server.\n\n## Best practices\n\n- Rotate your API keys regularly\n- Use read-only keys where possible\n- Don't use production keys for testing\n- Export and store backups securely\n\n## Vault features\n\n- View masked credentials\n- Test connection per account\n- Export encrypted backup\n- Audit last-access timestamps\n\n## What to do if compromised\n\n1. Revoke the key in the platform's settings\n2. Delete the account in Bolt Studio Pro\n3. Generate a new key and reconnect`,
    tags: ['security', 'credentials', 'vault'],
    related: ['connecting-accounts'],
  },
  {
    id: 'workflows',
    category: 'Automation',
    title: 'Building Workflows',
    icon: '⚙️',
    content: `Workflows automate multi-step sequences of AI tasks.\n\n## Workflow steps\n\n- **Broadcast** — Send a prompt to selected accounts\n- **Wait** — Pause for a set duration\n- **Health Check** — Ping all platforms\n- **Credit Check** — Alert if credits are low\n\n## Creating a workflow\n\n1. Go to **Workflows** in the sidebar\n2. Click **New Workflow**\n3. Add steps in sequence\n4. Save and run manually or via the Scheduler\n\n## Scheduler integration\n\nUse the **Automation Scheduler** to run workflows on a cron-like schedule (daily, weekly, weekdays, etc.)`,
    tags: ['workflows', 'automation'],
    related: ['scheduler', 'first-broadcast'],
  },
  {
    id: 'scheduler',
    category: 'Automation',
    title: 'Automation Scheduler',
    icon: '⏱',
    content: `The Scheduler lets you run jobs automatically at set times.\n\n## Job types\n\n| Type | Description |\n|------|-------------|\n| 📡 Broadcast | Send a prompt automatically |\n| 🩺 Health Check | Ping all platforms |\n| 💳 Credit Check | Alert on low balance |\n| ⚙️ Workflow | Run a saved workflow |\n| ⬇️ Export | Auto-backup your data |\n\n## Repeat options\n\n- Once, Daily, Weekly, Weekdays, Hourly\n\n## Quick presets\n\nUse the presets panel to instantly add common schedules like "Morning Health Check at 8am".`,
    tags: ['scheduler', 'automation', 'cron'],
    related: ['workflows'],
  },
  {
    id: 'credit-monitor',
    category: 'Accounts',
    title: 'Credit Monitor',
    icon: '💳',
    content: `The Credit Monitor tracks token/credit usage across all platforms.\n\n## What it shows\n\n- Current credit balance per account\n- Burn rate (credits per hour)\n- Estimated time until depletion\n- 14-point history sparklines\n\n## Alerts\n\nAccounts below 20 credits show a **red alert banner** with pulsing indicator.\n\n## Tips\n\n- Set up a **Credit Check** scheduled job to get automated alerts\n- Sort by "Estimate" to see which accounts will run out soonest\n- Use the "Low credit" filter to focus on accounts needing attention`,
    tags: ['credits', 'monitor', 'alerts'],
    related: ['connecting-accounts', 'scheduler'],
  },
  {
    id: 'prompt-builder',
    category: 'Prompts',
    title: 'Prompt Builder',
    icon: '🧱',
    content: `The Prompt Builder creates structured prompts from building blocks.\n\n## Block types\n\n| Block | Purpose |\n|-------|---------|\n| 🎭 Role | Define AI's persona |\n| 📋 Context | Provide background info |\n| 🎯 Task | What to do |\n| 📝 Steps | How to do it |\n| 📐 Format | Output format |\n| ⚠️ Constraints | What to avoid |\n\n## Variables\n\nUse \`{{variableName}}\` in any block. Go to the **Variables** tab to fill them in before broadcasting.\n\n## Templates\n\nLoad from 5 built-in templates: Full-Stack Feature, Bug Fix, UI Polish, API Integration, Mobile Responsive.`,
    tags: ['builder', 'prompts', 'templates'],
    related: ['ai-optimizer', 'first-broadcast'],
  },
];

const CATEGORIES = [...new Set(ARTICLES.map(a => a.category))];

export default function KnowledgeBase() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('all');
  const [activeId, setActiveId] = useState(null);

  const filtered = useMemo(() => {
    let list = ARTICLES;
    if (category !== 'all') list = list.filter(a => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some(t => t.includes(q))
      );
    }
    return list;
  }, [search, category]);

  const activeArticle = ARTICLES.find(a => a.id === activeId);

  const renderMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginTop: 18, marginBottom: 8 }}>{line.slice(3)}</h3>;
      if (line.startsWith('### ')) return <h4 key={i} style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--gold)', marginTop: 14, marginBottom: 6 }}>{line.slice(4)}</h4>;
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\* — (.+)/);
        if (match) return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}><span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 11.5 }}>• {match[1]}</span><span style={{ color: 'var(--muted2)', fontSize: 11.5 }}>— {match[2]}</span></div>;
      }
      if (line.startsWith('- ')) return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 11.5, color: 'var(--muted2)', paddingLeft: 8 }}><span style={{ color: 'var(--teal)', flexShrink: 0 }}>•</span>{line.slice(2)}</div>;
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim());
        if (line.includes('---')) return null;
        return <div key={i} style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 0' }}>
          {cells.map((c, j) => <span key={j} style={{ flex: 1, fontSize: 11, color: j === 0 ? 'var(--gold)' : 'var(--muted2)', fontFamily: j === 0 ? 'DM Mono,monospace' : undefined, fontWeight: j === 0 ? 600 : 400 }}>{c.trim()}</span>)}
        </div>;
      }
      if (line.startsWith('1. ') || /^\d+\. /.test(line)) {
        return <div key={i} style={{ fontSize: 11.5, color: 'var(--muted2)', marginBottom: 4, paddingLeft: 8 }}>{line}</div>;
      }
      if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
      return <div key={i} style={{ fontSize: 11.5, color: 'var(--muted2)', lineHeight: 1.7, marginBottom: 2 }}>{line}</div>;
    }).filter(Boolean);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(167,139,250,.18),rgba(79,142,247,.12))', border: '1px solid rgba(167,139,250,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📖</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Knowledge Base</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>{ARTICLES.length} articles · {CATEGORIES.length} categories</div>
          </div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search articles…"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', color: '#e4e4ed', fontSize: 11.5, outline: 'none', width: 200 }}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button onClick={() => setCategory('all')} className={`btn btn-xs ${category === 'all' ? 'btn-gold' : 'btn-ghost'}`} style={{ fontSize: 10 }}>All ({ARTICLES.length})</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`btn btn-xs ${category === c ? 'btn-gold' : 'btn-ghost'}`} style={{ fontSize: 10 }}>
            {c} ({ARTICLES.filter(a => a.category === c).length})
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: activeArticle ? '280px 1fr' : '1fr', gap: 14, alignItems: 'start' }}>

        {/* Article list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: 11 }}>
              No articles match "{search}"
            </div>
          ) : (
            filtered.map(a => (
              <button key={a.id} onClick={() => setActiveId(activeId === a.id ? null : a.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 10, border: `1px solid ${activeId === a.id ? 'rgba(167,139,250,0.4)' : 'var(--border)'}`,
                  background: activeId === a.id ? 'rgba(167,139,250,0.08)' : 'var(--surface2)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  borderLeft: `3px solid ${activeId === a.id ? 'var(--purple)' : 'transparent'}`,
                }}
                onMouseEnter={e => { if (activeId !== a.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; } }}
                onMouseLeave={e => { if (activeId !== a.id) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: activeId === a.id ? '#fff' : '#dde0f0', lineHeight: 1.2 }}>{a.title}</div>
                  <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>{a.category}</div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>›</span>
              </button>
            ))
          )}
        </div>

        {/* Article viewer */}
        {activeArticle && (
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{activeArticle.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{activeArticle.title}</div>
                <div style={{ fontSize: 9.5, color: 'var(--purple)', fontWeight: 700, marginTop: 2 }}>{activeArticle.category}</div>
              </div>
              <button className="btn btn-ghost btn-xs" onClick={() => setActiveId(null)} style={{ marginLeft: 'auto', fontSize: 11 }}>✕</button>
            </div>
            <div style={{ padding: '18px 20px' }}>
              {renderMarkdown(activeArticle.content)}

              {/* Tags */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                {activeArticle.tags.map(t => (
                  <span key={t} style={{ fontSize: 9.5, padding: '2px 8px', borderRadius: 99, background: 'rgba(167,139,250,0.1)', color: 'var(--purple)', border: '1px solid rgba(167,139,250,0.2)' }}>#{t}</span>
                ))}
              </div>

              {/* Related */}
              {activeArticle.related?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Related Articles</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {activeArticle.related.map(id => {
                      const rel = ARTICLES.find(a => a.id === id);
                      return rel ? (
                        <button key={id} onClick={() => setActiveId(id)}
                          className="btn btn-ghost btn-xs" style={{ fontSize: 10 }}>
                          {rel.icon} {rel.title}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
