import { useState, useMemo } from 'react';

/* ── Static doc content ─────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started', icon: '🚀', color: 'var(--teal)' },
  { id: 'accounts',        label: 'Accounts & Auth',  icon: '🔗', color: 'var(--gold)' },
  { id: 'broadcast',       label: 'Broadcast Studio', icon: '📡', color: 'var(--blue)' },
  { id: 'ai',              label: 'AI Features',       icon: '🤖', color: 'var(--purple)' },
  { id: 'billing',         label: 'Plans & Billing',   icon: '💳', color: 'var(--teal)' },
  { id: 'security',        label: 'Security & Vault',  icon: '🔒', color: 'var(--red)' },
  { id: 'api',             label: 'API & Integrations',icon: '⚡', color: 'var(--gold)' },
  { id: 'troubleshoot',    label: 'Troubleshooting',   icon: '🛠️', color: 'var(--muted2)' },
];

const ARTICLES = [
  // Getting started
  {
    id: 'gs-01', cat: 'getting-started', title: 'Welcome to AgentFlow',
    badge: 'Essential', badgeColor: 'var(--teal)', readTime: '3 min',
    body: `AgentFlow is your unified control center for AI-assisted development. It lets you connect multiple AI coding platforms — Bolt.new, Lovable, Replit, Manus, and more — and broadcast prompts to all of them simultaneously.\n\n**Key concepts:**\n- **Accounts**: Connected AI platform sessions (Bolt, Replit, etc.)\n- **Broadcasts**: Prompts dispatched to one or more accounts at once\n- **Projects**: Logical groupings of broadcasts and workflows\n- **Workflows**: Automated multi-step prompt sequences\n\nNavigate using the sidebar or press **Ctrl+Space** to open the Command Palette.`,
  },
  {
    id: 'gs-02', cat: 'getting-started', title: 'Quick Start Guide',
    badge: 'Popular', badgeColor: 'var(--gold)', readTime: '5 min',
    body: `**Step 1 — Sign up**\nVisit /signup, enter your email and password, and verify your account.\n\n**Step 2 — Complete onboarding**\nThe onboarding wizard (6 steps) will help you configure your workspace, connect your first AI account, and send a test broadcast.\n\n**Step 3 — Connect an account**\nClick ⚡ Connect in the topbar or navigate to My Accounts. Enter your API key or session cookie for the platform of your choice.\n\n**Step 4 — Broadcast**\nGo to Broadcast Studio, write or paste a prompt, select target accounts, and hit Send. Results appear in Response Inbox.\n\n**Tip:** Use the Prompt Library to save reusable templates.`,
  },
  {
    id: 'gs-03', cat: 'getting-started', title: 'Keyboard Shortcuts',
    badge: 'Power User', badgeColor: 'var(--purple)', readTime: '2 min',
    body: `| Shortcut | Action |\n|---|---|\n| Ctrl+Space | Open Command Palette |\n| ? | Show all shortcuts |\n| N | Open Scratchpad |\n| ← / → | Previous / Next page |\n| Ctrl+K | Global search |`,
  },

  // Accounts
  {
    id: 'acc-01', cat: 'accounts', title: 'Connecting your first AI account',
    badge: 'Essential', badgeColor: 'var(--teal)', readTime: '4 min',
    body: `**Supported platforms:** Bolt.new · Lovable · Replit · Manus.im · Cursor · v0.dev · Claude · GPT-4 API\n\nTo connect an account:\n1. Click ⚡ Connect in the topbar\n2. Select the platform from the dropdown\n3. Enter your API key (stored encrypted with AES-256 in the Vault)\n4. Click Test Connection — you should see a green ✓\n5. The account now appears in My Accounts and is available as a broadcast target.\n\n**Session cookies** are supported for platforms without an official API. Paste the cookie string and AgentFlow will maintain a virtual session.`,
  },
  {
    id: 'acc-02', cat: 'accounts', title: 'Managing multiple accounts',
    badge: '', badgeColor: '', readTime: '3 min',
    body: `You can connect unlimited accounts across all platforms on Pro and Enterprise plans.\n\n- **Groups**: Tag accounts (e.g. "Frontend" or "Backend") and broadcast to a whole group at once.\n- **Status monitoring**: The dashboard shows live status for each account (Active / Error / Expired).\n- **Session refresh**: If a session expires, you'll get a notification — click Reconnect to re-enter credentials.\n- **Bulk import**: Paste a JSON array of credentials to import multiple accounts at once via Settings → Import.`,
  },

  // Broadcast
  {
    id: 'bc-01', cat: 'broadcast', title: 'Sending your first broadcast',
    badge: 'Essential', badgeColor: 'var(--teal)', readTime: '4 min',
    body: `**Broadcast Studio** is the core feature of AgentFlow.\n\n1. Navigate to Broadcast Studio (📡 in sidebar)\n2. Type or paste your prompt in the composer\n3. Check the target accounts (or select All)\n4. Set Priority (Low / Normal / High / Critical)\n5. Click Send Broadcast\n\nThe broadcast is queued, dispatched, and results collected in Response Inbox. You'll see a live success/failure status for each target.\n\n**Pro tip:** Use the Smart Router to auto-recommend the best platform for your prompt type.`,
  },
  {
    id: 'bc-02', cat: 'broadcast', title: 'Prompt templates and the Library',
    badge: 'Popular', badgeColor: 'var(--gold)', readTime: '3 min',
    body: `The Prompt Library lets you save, organise, and reuse prompts.\n\n- **Save a prompt**: From Broadcast Studio, click 💾 Save to Library after composing\n- **Categories**: Assign prompts to categories (Frontend, Backend, Testing, DevOps, etc.)\n- **Quick-insert**: In the composer, type / to open the inline library picker\n- **Variables**: Use {{variableName}} syntax in templates — you'll be prompted to fill values at broadcast time\n- **Sharing**: Export library as JSON and share with teammates`,
  },
  {
    id: 'bc-03', cat: 'broadcast', title: 'Scheduling and automation',
    badge: '', badgeColor: '', readTime: '4 min',
    body: `**Scheduler** allows time-based and event-based broadcasts:\n\n- **One-shot**: Schedule a broadcast for a specific date/time\n- **Recurring**: Set cron-like intervals (hourly, daily, etc.)\n- **Workflow triggers**: Chain broadcasts — run Broadcast B after Broadcast A succeeds\n\nOpen the Scheduler page (⏱ in sidebar) to manage all scheduled jobs. Jobs show next-run time, last status, and allow pause/resume/delete.\n\n**Automation Control** extends this with conditional logic and branching.`,
  },

  // AI Features
  {
    id: 'ai-01', cat: 'ai', title: 'Prompt Optimizer',
    badge: 'New', badgeColor: 'var(--purple)', readTime: '3 min',
    body: `The **Prompt Optimizer** analyses your prompt and suggests improvements:\n\n- **Clarity score**: How unambiguous your prompt is\n- **Specificity**: Does it include enough context?\n- **Structure**: Checks for role definition, output format, constraints\n- **Diff view**: See exactly what changed (green = added, red = removed)\n- **Apply**: One click to replace your prompt with the optimized version\n\nAccess it in Broadcast Studio (below the composer) or from the Optimizer page directly.`,
  },
  {
    id: 'ai-02', cat: 'ai', title: 'Smart Router',
    badge: 'New', badgeColor: 'var(--blue)', readTime: '3 min',
    body: `The **Smart Router** analyses your prompt and recommends the best AI platform for the job:\n\n- Frontend/UI prompts → Lovable, Bolt.new, v0.dev\n- Backend/API prompts → Replit, Manus.im\n- Debugging/Refactoring → Cursor\n- Complex agentic tasks → Manus.im\n\nScores are shown as percentages. Click a recommended platform chip to auto-select it in the broadcast target list.`,
  },
  {
    id: 'ai-03', cat: 'ai', title: 'AI Insights dashboard',
    badge: '', badgeColor: '', readTime: '2 min',
    body: `**AI Insights** shows telemetry derived from your actual broadcast history:\n\n- Success/failure rates over time\n- Average prompt quality scores\n- Token burn rate by platform\n- Daily activity digest (auto-generated markdown summary)\n- Anomaly detection: unusual latency or failure spikes highlighted\n\nAll data is read from local history — no data is sent to external analytics services.`,
  },

  // Billing
  {
    id: 'bill-01', cat: 'billing', title: 'Plans and pricing',
    badge: '', badgeColor: '', readTime: '3 min',
    body: `**Free**: Up to 3 accounts, 10 broadcasts/day, basic templates\n**Pro ($29/mo)**: Unlimited accounts, unlimited broadcasts, Prompt Optimizer, Smart Router, AI Insights, Priority support\n**Enterprise ($99/mo)**: Everything in Pro + Team collaboration, SSO, Audit logs, Custom SLAs, Dedicated account manager\n\n**Annual billing** saves 33%. Switch in Billing → Change Plan.\n\nAll plans include a 14-day free trial of Pro features. No credit card required.`,
  },
  {
    id: 'bill-02', cat: 'billing', title: 'Managing your subscription',
    badge: '', badgeColor: '', readTime: '2 min',
    body: `Go to **Billing** (in sidebar) to:\n\n- View current plan and next renewal date\n- Download invoices (PDF)\n- Update payment method\n- Upgrade / downgrade plan\n- Cancel subscription (data retained for 30 days after cancellation)\n\nAll payments are processed via Stripe. We never store card data on our servers.`,
  },

  // Security
  {
    id: 'sec-01', cat: 'security', title: 'Security Vault and API key encryption',
    badge: 'Important', badgeColor: 'var(--red)', readTime: '4 min',
    body: `All API keys and credentials stored in AgentFlow are **AES-256 encrypted** at rest using a key derived from your account password via PBKDF2.\n\n- Credentials are never transmitted in plain text\n- The Vault page shows all stored secrets with masked values\n- You can rotate, delete, or export (encrypted) any credential\n- Audit log tracks every Vault access event\n\n**Zero-knowledge design**: Even AgentFlow servers cannot read your credentials — encryption happens client-side.`,
  },
  {
    id: 'sec-02', cat: 'security', title: 'Two-factor authentication',
    badge: '', badgeColor: '', readTime: '2 min',
    body: `Enable 2FA in **Settings → Security**:\n\n1. Click Enable 2FA\n2. Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password)\n3. Enter the 6-digit code to confirm\n4. Save your backup codes in a safe place\n\nOnce enabled, every login requires a TOTP code in addition to your password.`,
  },

  // API
  {
    id: 'api-01', cat: 'api', title: 'REST API overview',
    badge: 'Developer', badgeColor: 'var(--gold)', readTime: '5 min',
    body: `AgentFlow exposes a REST API for programmatic access:\n\n**Base URL**: https://api.agentflow.io/v1\n\n**Authentication**: Bearer token — generate in Settings → API Keys\n\n**Key endpoints:**\n- POST /broadcasts — create and dispatch a broadcast\n- GET /broadcasts — list history with filters\n- GET /accounts — list connected accounts\n- POST /prompts/optimize — run Prompt Optimizer on a string\n- GET /usage — current usage quotas\n\nFull OpenAPI spec available at /docs/api-reference.`,
  },
  {
    id: 'api-02', cat: 'api', title: 'Webhooks',
    badge: '', badgeColor: '', readTime: '3 min',
    body: `Configure webhooks in **Settings → Webhooks** to receive real-time events:\n\n- broadcast.created\n- broadcast.completed\n- broadcast.failed\n- account.disconnected\n- plan.upgraded\n\nEach webhook delivers a signed JSON payload (HMAC-SHA256). Verify the X-AgentFlow-Signature header against your webhook secret to ensure authenticity.`,
  },

  // Troubleshooting
  {
    id: 'ts-01', cat: 'troubleshoot', title: 'Broadcast shows "Failed" status',
    badge: 'Common', badgeColor: 'var(--gold)', readTime: '3 min',
    body: `If a broadcast shows Failed:\n\n1. **Check account status** — go to My Accounts. A red dot means the session expired. Click Reconnect.\n2. **Check platform status** — visit the platform's status page (Bolt.new, Replit, etc.) for outages.\n3. **Rate limits** — you may be hitting the platform's API rate limit. Wait a few minutes and retry.\n4. **Prompt too long** — most platforms have a context window limit. Use the Token Analyzer to check length.\n5. **API key revoked** — regenerate and re-enter the key in Vault.\n\nCheck **System Logs** (in sidebar) for the raw error message.`,
  },
  {
    id: 'ts-02', cat: 'troubleshoot', title: 'App is slow or unresponsive',
    badge: '', badgeColor: '', readTime: '2 min',
    body: `Try these steps:\n\n1. **Clear localStorage**: Settings → Data → Clear Cache (this resets UI state, not your account data)\n2. **Disable unused integrations**: Having 20+ active accounts polling simultaneously can cause lag\n3. **Close unused browser tabs** — AgentFlow uses websockets which consume memory\n4. **Check Performance Profiler** in the sidebar for real-time CPU/memory metrics\n5. **Hard refresh**: Ctrl+Shift+R clears the browser cache\n\nIf the issue persists, open a support ticket with your System Logs export.`,
  },
  {
    id: 'ts-03', cat: 'troubleshoot', title: 'Contacting support',
    badge: '', badgeColor: '', readTime: '1 min',
    body: `**Live chat**: Click the chat bubble (bottom-right) for instant support during business hours (Mon–Fri, 9am–6pm GMT).\n\n**Email**: support@agentflow.io — response within 24h\n\n**GitHub Issues**: For bugs and feature requests: github.com/agentflow/app/issues\n\n**Status page**: status.agentflow.io — subscribe to incident notifications\n\nPro and Enterprise customers receive priority support with guaranteed SLAs.`,
  },
];

/* ── Simple markdown-ish renderer ───────────────────────────────── */
function renderBody(text) {
  return text.split('\n').map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} style={{ color: '#e4e4ed', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Table row
    if (line.startsWith('|') && !line.startsWith('|---')) {
      const cells = line.split('|').filter(c => c.trim() !== '');
      const isHeader = i === 0 || text.split('\n')[i + 1]?.startsWith('|---');
      return (
        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
          {cells.map((c, j) => isHeader
            ? <th key={j} style={{ padding: '8px 14px', fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left' }}>{c.trim()}</th>
            : <td key={j} style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#d4d4e0' }}>{c.trim()}</td>
          )}
        </tr>
      );
    }
    if (line.startsWith('|---')) return null;

    // Bullet
    if (line.startsWith('- ')) {
      return <li key={i} style={{ color: '#d4d4e0', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 4 }}>{parts.slice(1)}</li>;
    }

    // Empty line
    if (!line.trim()) return <br key={i} />;

    // Default paragraph
    return <p key={i} style={{ margin: '4px 0', fontSize: '0.85rem', color: '#d4d4e0', lineHeight: 1.75 }}>{parts}</p>;
  });
}

/* ── Docs page ───────────────────────────────────────────────────── */
export default function Docs() {
  const [activeCat, setActiveCat]     = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [search, setSearch]           = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ARTICLES.filter(a =>
      (!activeCat || a.cat === activeCat) &&
      (!q || a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q))
    );
  }, [activeCat, search]);

  const article = activeArticle ? ARTICLES.find(a => a.id === activeArticle) : null;

  // Detect table content
  const hasTable = article?.body.includes('|');

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'fadeIn 0.35s ease' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(79,142,247,0.08) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 40px',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 200, height: 200,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          📖 Help Center
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 10 }}>
          How can we help?
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted2)', marginBottom: 24, maxWidth: 520 }}>
          Docs, guides, and troubleshooting for every part of AgentFlow. Search below or browse by category.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 440 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 16 }}>🔍</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveArticle(null); }}
            placeholder="Search documentation…"
            style={{
              width: '100%',
              paddingLeft: 40,
              paddingRight: 14,
              height: 44,
              background: 'var(--surface)',
              border: '1px solid var(--border2)',
              borderRadius: 'var(--radius)',
              fontSize: '0.9rem',
              color: '#e4e4ed',
              outline: 'none',
              fontFamily: '"Syne", sans-serif',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,212,170,0.12)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* Article reader open */}
      {article ? (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
          {/* Category nav sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button
              onClick={() => setActiveArticle(null)}
              className="btn btn-ghost btn-sm"
              style={{ marginBottom: 12, justifyContent: 'flex-start', gap: 6 }}
            >
              ← Back to Docs
            </button>
            {ARTICLES.filter(a => a.cat === article.cat).map(a => (
              <button
                key={a.id}
                onClick={() => setActiveArticle(a.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: a.id === article.id ? 'var(--surface3)' : 'transparent',
                  color: a.id === article.id ? '#e4e4ed' : 'var(--muted2)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontFamily: '"Syne", sans-serif',
                  transition: 'all 0.15s',
                  borderLeft: a.id === article.id ? '2px solid var(--teal)' : '2px solid transparent',
                }}
              >
                {a.title}
              </button>
            ))}
          </div>

          {/* Article content */}
          <div style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 40px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              {article.badge && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                  background: article.badgeColor + '22', color: article.badgeColor,
                }}>{article.badge}</span>
              )}
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>⏱ {article.readTime} read</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 20 }}>
              {article.title}
            </h2>

            {hasTable ? (
              <div>
                {article.body.split('\n').some(l => l.startsWith('|')) && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16, background: 'var(--surface)', borderRadius: 8, overflow: 'hidden' }}>
                    <tbody>
                      {renderBody(article.body)}
                    </tbody>
                  </table>
                )}
                <div>
                  {article.body.split('\n').filter(l => !l.startsWith('|')).map((line, i) => {
                    if (!line.trim()) return <br key={i} />;
                    return <p key={i} style={{ margin: '4px 0', fontSize: '0.85rem', color: '#d4d4e0', lineHeight: 1.75 }}>{line}</p>;
                  })}
                </div>
              </div>
            ) : (
              <div style={{ lineHeight: 1.8 }}>
                {(() => {
                  const content = renderBody(article.body);
                  // Wrap consecutive <li> in <ul>
                  const result = [];
                  let inList = false;
                  let listItems = [];
                  content.forEach((el, i) => {
                    if (el?.type === 'li') {
                      if (!inList) { inList = true; listItems = []; }
                      listItems.push(el);
                    } else {
                      if (inList) {
                        result.push(<ul key={`ul-${i}`} style={{ paddingLeft: 22, marginBottom: 12 }}>{listItems}</ul>);
                        inList = false; listItems = [];
                      }
                      result.push(el);
                    }
                  });
                  if (inList) result.push(<ul key="ul-final" style={{ paddingLeft: 22, marginBottom: 12 }}>{listItems}</ul>);
                  return result;
                })()}
              </div>
            )}

            {/* Feedback */}
            <div style={{
              marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Was this helpful?</span>
              {['👍 Yes', '👎 No'].map(label => (
                <button key={label} className="btn btn-ghost btn-sm" style={{ fontSize: '0.76rem' }}>{label}</button>
              ))}
              <span style={{ marginLeft: 'auto' }}>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.76rem', color: 'var(--teal)' }}>
                  💬 Open Support Chat
                </button>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Category chips */}
          {!search && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <button
                onClick={() => setActiveCat(null)}
                style={{
                  padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600,
                  border: '1px solid', cursor: 'pointer', fontFamily: '"Syne", sans-serif', transition: 'all 0.15s',
                  background: activeCat === null ? 'var(--surface3)' : 'transparent',
                  borderColor: activeCat === null ? 'var(--border2)' : 'var(--border)',
                  color: activeCat === null ? '#e4e4ed' : 'var(--muted)',
                }}
              >All</button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id === activeCat ? null : cat.id)}
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600,
                    border: '1px solid', cursor: 'pointer', fontFamily: '"Syne", sans-serif', transition: 'all 0.15s',
                    background: activeCat === cat.id ? cat.color + '18' : 'transparent',
                    borderColor: activeCat === cat.id ? cat.color + '55' : 'var(--border)',
                    color: activeCat === cat.id ? cat.color : 'var(--muted)',
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Category feature cards (shown when no search and no category filter) */}
          {!activeCat && !search && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
              {CATEGORIES.map(cat => {
                const count = ARTICLES.filter(a => a.cat === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    style={{
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', padding: '20px',
                      cursor: 'pointer', transition: 'all 0.18s', animation: 'fadeIn 0.4s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + '44'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 10 }}>{cat.icon}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{cat.label}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{count} article{count !== 1 ? 's' : ''}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Article list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>No articles found</div>
                <div style={{ fontSize: '0.82rem' }}>Try a different search term or browse by category</div>
              </div>
            )}
            {filtered.map(a => {
              const cat = CATEGORIES.find(c => c.id === a.cat);
              return (
                <div
                  key={a.id}
                  onClick={() => setActiveArticle(a.id)}
                  style={{
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '16px 20px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
                    transition: 'all 0.18s', animation: 'fadeIn 0.35s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: (cat?.color || 'var(--gold)') + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>
                    {cat?.icon || '📄'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: 3 }}>{a.title}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span>{cat?.label}</span>
                      <span>·</span>
                      <span>⏱ {a.readTime}</span>
                      {a.badge && (
                        <>
                          <span>·</span>
                          <span style={{ color: a.badgeColor, fontWeight: 700 }}>{a.badge}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: 18, flexShrink: 0 }}>›</span>
                </div>
              );
            })}
          </div>

          {/* Support CTA */}
          <div style={{
            marginTop: 40, background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '28px 32px',
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                Still need help?
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                Our support team is available Mon–Fri, 9am–6pm GMT. Pro and Enterprise customers get priority response.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-gold btn-sm">💬 Open Live Chat</button>
              <button className="btn btn-ghost btn-sm" onClick={() => window.open('mailto:support@agentflow.io')}>✉ Email Support</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
