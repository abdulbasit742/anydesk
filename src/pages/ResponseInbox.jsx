import { useState, useMemo } from 'react';
import { sound } from '../lib/soundEngine';

/* ─── Mock Data ─────────────────────────────────────────────────── */
const QUICK_REPLIES = [
  { label: '✅ Acknowledged',   text: 'Acknowledged. Processing your request now.' },
  { label: '⚙️ Processing',     text: 'Your request is currently being processed. ETA: ~2 min.' },
  { label: '✔️ Completed',      text: 'Task completed successfully. Output is ready.' },
  { label: '🔄 Error: Retry',   text: 'An error occurred. Please retry the request.' },
];

const MOCK_THREADS = [
  {
    id: 'thread-1',
    sessionId: 'bc-001',
    prompt: 'Build a full-stack auth module with JWT, refresh tokens, and role-based access control',
    responses: [
      { id: 'r1a', platform: 'Bolt.new',   icon: '⚡', text: "I've created a complete JWT auth system with refresh token rotation and RBAC middleware. Check the /auth directory for all files.", ts: Date.now() - 60000 * 3,  read: false, starred: false },
      { id: 'r1b', platform: 'Lovable',    icon: '💜', text: "Here's your auth module! I've implemented JWT access tokens (15min), refresh tokens (7d), and a role guard decorator pattern.", ts: Date.now() - 60000 * 5,  read: false, starred: false },
      { id: 'r1c', platform: 'Claude.ai',  icon: '🧠', text: "I've designed a layered auth architecture. The TokenService handles signing/verification, AuthMiddleware enforces RBAC, and RefreshService manages token rotation.", ts: Date.now() - 60000 * 7,  read: true,  starred: true  },
    ],
  },
  {
    id: 'thread-2',
    sessionId: 'bc-002',
    prompt: 'Create a responsive dashboard with charts, KPI cards, and a data table with sorting',
    responses: [
      { id: 'r2a', platform: 'v0.dev',    icon: '▲', text: "Dashboard ready! Used shadcn/ui for KPI cards, Recharts for the line and bar charts, and a custom sortable table with TanStack Table.", ts: Date.now() - 3600000 * 1, read: true, starred: false },
      { id: 'r2b', platform: 'Cursor',    icon: '↗', text: "I've scaffolded the dashboard with Next.js App Router. The DataTable component uses @tanstack/react-table v8 with multi-column sorting.", ts: Date.now() - 3600000 * 1.5, read: false, starred: false },
    ],
  },
  {
    id: 'thread-3',
    sessionId: 'bc-003',
    prompt: 'Write unit tests for the payment processing service using Jest and MSW for API mocking',
    responses: [
      { id: 'r3a', platform: 'Replit',    icon: '🔁', text: "Test suite complete! 34 unit tests covering happy paths, edge cases, and error scenarios. Coverage at 94%. Run `npm test` to execute.", ts: Date.now() - 3600000 * 3, read: true, starred: false },
      { id: 'r3b', platform: 'Bolt.new',  icon: '⚡', text: "I've written comprehensive tests with MSW handlers for Stripe webhooks, PayPal IPN, and internal payment endpoints. All 28 tests passing.", ts: Date.now() - 3600000 * 4, read: true, starred: true  },
      { id: 'r3c', platform: 'Claude.ai', icon: '🧠', text: "Here's a test-driven approach: I started with integration tests for the PaymentService, then added unit tests for each helper. MSW intercepts all external calls.", ts: Date.now() - 3600000 * 5, read: true, starred: false },
    ],
  },
  {
    id: 'thread-4',
    sessionId: 'bc-004',
    prompt: 'Optimize database queries — reduce N+1 problems in the user-posts relationship',
    responses: [
      { id: 'r4a', platform: 'Lovable',   icon: '💜', text: "Found 7 N+1 issues. Replaced them with eager loading using Prisma's `include`. Query count dropped from 142 to 8 per request.", ts: Date.now() - 86400000, read: true, starred: false },
    ],
  },
  {
    id: 'thread-5',
    sessionId: 'bc-005',
    prompt: 'Design a mobile-first onboarding flow with progress steps and animated transitions',
    responses: [
      { id: 'r5a', platform: 'v0.dev',    icon: '▲', text: "5-step onboarding flow built with Framer Motion. Each step slides in from right, with a progress bar and exit animations on back navigation.", ts: Date.now() - 86400000 * 1.5, read: false, starred: false },
      { id: 'r5b', platform: 'Cursor',    icon: '↗', text: "Onboarding wizard complete! Used React Spring for physics-based transitions and a persistent step state with localStorage fallback.", ts: Date.now() - 86400000 * 2, read: false, starred: false },
    ],
  },
];

const AI_SUMMARIES = {
  'thread-1': "3 responses analyzed. All platforms successfully implemented JWT-based authentication with refresh token support and role-based access control. Claude.ai provided the most architecturally detailed solution with explicit layering. Bolt.new and Lovable both produced working code with slightly different token expiry strategies (15 min vs 30 min access tokens). Consensus: all solutions are production-ready.",
  'thread-2': "2 responses analyzed. Both platforms used modern component libraries (shadcn/ui vs Ant Design). v0.dev leveraged Recharts for visualization; Cursor used Chart.js. Both implemented TanStack Table for the data grid. Minor differences in column sorting UX — v0.dev sorts on header click, Cursor uses a dropdown. Overall quality: high.",
  'thread-3': "3 responses analyzed. Replit achieved 94% coverage; Bolt.new had 28 tests all passing; Claude.ai took a BDD approach. All used MSW for API mocking. Replit's suite is largest (34 tests) and most comprehensive for edge cases. Recommended: merge Replit's coverage breadth with Claude's BDD structure.",
  'thread-4': "1 response analyzed. Lovable identified all 7 N+1 queries and resolved them via Prisma eager loading. Response time improvement estimated at 89% (142 queries → 8). Solution is minimal and directly applicable.",
  'thread-5': "2 responses analyzed. Both responses produced animated multi-step flows. v0.dev used Framer Motion (declarative, simpler DX); Cursor used React Spring (physics-based, more customizable). Accessibility: Cursor's version includes ARIA progress indicators. Recommended: Cursor for accessibility, v0.dev for ease of theming.",
};

function ago(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60)    return 'just now';
  if (d < 3600)  return `${~~(d / 60)}m ago`;
  if (d < 86400) return `${~~(d / 3600)}h ago`;
  return `${~~(d / 86400)}d ago`;
}

// Deterministic mock metrics
function getSentimentMetrics(text) {
  const len = text.length;
  const confidence = Math.min(100, Math.max(70, 75 + (len % 23)));
  const sentiment = Math.min(100, Math.max(65, 68 + (len % 31)));
  return { confidence, sentiment };
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function ResponseInbox() {
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [threads, setThreads]       = useState(MOCK_THREADS);
  const [expanded, setExpanded]     = useState(null);
  const [starred, setStarred]       = useState(new Set(['thread-1']));
  const [archived, setArchived]     = useState(new Set());
  const [summaries, setSummaries]   = useState({});
  const [summLoading, setSummLoading] = useState({});
  const [replyActive, setReplyActive] = useState(null);
  const [replyText, setReplyText]   = useState('');
  const [sentReplies, setSentReplies] = useState({});

  const allUnread = useMemo(() =>
    threads.reduce((acc, t) => acc + t.responses.filter(r => !r.read).length, 0), [threads]);

  const markRead = (threadId) => {
    setThreads(prev => prev.map(t => t.id !== threadId ? t : {
      ...t, responses: t.responses.map(r => ({ ...r, read: true }))
    }));
  };

  const toggleStar = (id) => {
    sound.play('click');
    setStarred(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const archiveThread = (id) => {
    sound.play('click');
    setArchived(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const requestSummary = (threadId) => {
    sound.play('click');
    setSummLoading(prev => ({ ...prev, [threadId]: true }));
    setTimeout(() => {
      setSummaries(prev => ({ ...prev, [threadId]: AI_SUMMARIES[threadId] || 'No summary available.' }));
      setSummLoading(prev => ({ ...prev, [threadId]: false }));
      sound.play('success');
    }, 1400);
  };

  const downloadAsMarkdown = (thread) => {
    sound.play('click');
    let md = `# Response Dispatch comparison: Thread #${thread.id}\n\n`;
    md += `**Prompt:**\n> ${thread.prompt}\n\n`;

    const summary = summaries[thread.id] || AI_SUMMARIES[thread.id];
    if (summary) {
      md += `### 🤖 AI Core Analysis & Summary\n${summary}\n\n`;
    }

    md += `### 📊 Analytical Metrics Comparison\n`;
    thread.responses.forEach(r => {
      const metrics = getSentimentMetrics(r.text);
      md += `- **${r.platform}**: Sentiment: ${metrics.sentiment}% Positive | Confidence: ${metrics.confidence}%\n`;
    });
    md += `\n`;

    md += `### 💬 Platform Responses\n\n`;
    thread.responses.forEach(r => {
      md += `#### ${r.platform} Response\n\`\`\`javascript\n${r.text}\n\`\`\`\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-thread-${thread.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendReply = (threadId) => {
    if (!replyText.trim()) return;
    setSentReplies(prev => ({ ...prev, [threadId]: replyText }));
    setReplyText('');
    setReplyActive(null);
    sound.play('success');
  };

  const filtered = useMemo(() => {
    let list = threads;
    if (filter === 'unread')   list = list.filter(t => t.responses.some(r => !r.read));
    if (filter === 'starred')  list = list.filter(t => starred.has(t.id));
    if (filter === 'archived') list = list.filter(t => archived.has(t.id));
    else                       list = list.filter(t => !archived.has(t.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.prompt.toLowerCase().includes(q) ||
        t.responses.some(r => r.text.toLowerCase().includes(q))
      );
    }
    return list;
  }, [threads, filter, search, starred, archived]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(0,212,170,.18),rgba(79,142,247,.12))', border: '1px solid rgba(0,212,170,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📥</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Response Inbox</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
              {threads.length} threads · <span style={{ color: '#5eead4' }}>{allUnread} unread</span>
            </div>
          </div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search responses…"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', color: '#e4e4ed', fontSize: 11, outline: 'none', width: 190 }}
          onFocus={e => e.target.style.borderColor = 'var(--teal)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'} />
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {[
          { id: 'all',      label: `All (${threads.filter(t => !archived.has(t.id)).length})` },
          { id: 'unread',   label: `● Unread (${allUnread})` },
          { id: 'starred',  label: `★ Starred (${starred.size})` },
          { id: 'archived', label: `🗄 Archived (${archived.size})` },
        ].map(f => (
          <button key={f.id} onClick={() => { sound.play('click'); setFilter(f.id); }}
            className={`btn btn-xs ${filter === f.id ? 'btn-teal' : 'btn-ghost'}`}
            style={{ fontSize: 10 }}>{f.label}</button>
        ))}
      </div>

      {/* ── Quick reply chips (always visible) ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, letterSpacing: '.04em' }}>QUICK REPLIES:</span>
        {QUICK_REPLIES.map(q => (
          <button key={q.label} onClick={() => { sound.play('click'); setReplyText(q.text); }}
            style={{
              fontSize: 10, padding: '3px 10px', borderRadius: 99,
              background: 'rgba(94,234,212,0.08)', border: '1px solid rgba(94,234,212,0.25)',
              color: '#5eead4', cursor: 'pointer', transition: 'all 0.15s',
              fontWeight: 600,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(94,234,212,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(94,234,212,0.08)'}>
            {q.label}
          </button>
        ))}
      </div>

      {/* ── Thread list ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface2)', borderRadius: 14, border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📥</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 6 }}>No responses match filter</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Try a different filter or clear the search.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(thread => {
            const isExpanded    = expanded === thread.id;
            const isStarred     = starred.has(thread.id);
            const isArchived    = archived.has(thread.id);
            const unreadCount   = thread.responses.filter(r => !r.read).length;
            const hasSummary    = !!summaries[thread.id];
            const isLoading     = summLoading[thread.id];
            const isReplying    = replyActive === thread.id;
            const sentReply     = sentReplies[thread.id];

            return (
              <div key={thread.id} style={{
                background: 'var(--surface2)',
                border: `1px solid ${unreadCount > 0 ? 'rgba(94,234,212,0.22)' : 'var(--border)'}`,
                borderLeft: `3px solid ${unreadCount > 0 ? 'var(--teal)' : isStarred ? 'var(--gold)' : 'var(--border)'}`,
                borderRadius: 13, overflow: 'hidden', animation: 'fadeIn 0.25s ease',
                opacity: isArchived ? 0.55 : 1,
              }}>

                {/* Thread header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer' }}
                  onClick={() => { sound.play('click'); setExpanded(isExpanded ? null : thread.id); if (!isExpanded) markRead(thread.id); }}>

                  {/* Platform icons */}
                  <div style={{ display: 'flex', gap: -4, flexShrink: 0 }}>
                    {thread.responses.slice(0, 3).map((r, idx) => (
                      <div key={r.id} style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'var(--surface)', border: '2px solid var(--surface2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, marginLeft: idx > 0 ? -6 : 0, zIndex: 3 - idx,
                      }}>{r.icon}</div>
                    ))}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: unreadCount > 0 ? 800 : 600, color: unreadCount > 0 ? '#fff' : '#b0b8d4', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {thread.prompt}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2, fontFamily: 'DM Mono,monospace' }}>
                      {thread.responses.map(r => r.platform).join(' · ')} · {ago(thread.responses[0].ts)}
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {unreadCount > 0 && (
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 99, background: 'rgba(94,234,212,0.15)', color: '#5eead4', border: '1px solid rgba(94,234,212,0.3)', fontWeight: 700 }}>
                        {unreadCount} new
                      </span>
                    )}
                    <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
                      {thread.responses.length} {thread.responses.length === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleStar(thread.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: isStarred ? 'var(--gold)' : 'var(--muted)', padding: '2px 4px' }}>
                      {isStarred ? '★' : '☆'}
                    </button>
                    <button onClick={() => archiveThread(thread.id)}
                      title={isArchived ? 'Unarchive' : 'Archive'}
                      className="btn btn-ghost btn-xs" style={{ fontSize: 9.5 }}>
                      {isArchived ? '↩' : '🗄'}
                    </button>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
                </div>

                {/* Expanded thread body */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

                    {/* Original prompt */}
                    <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.12)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Broadcast Prompt</span>
                        <button className="btn btn-ghost btn-xs" style={{ fontSize: 9.5, color: 'var(--teal)' }} onClick={() => downloadAsMarkdown(thread)}>
                          ⬇ Download as MD
                        </button>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: 'DM Mono,monospace', lineHeight: 1.6 }}>{thread.prompt}</div>
                    </div>

                    {/* AI Summary */}
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      {hasSummary ? (
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>🤖 AI Summary</div>
                          <div style={{ fontSize: 10.5, color: '#c8d0e8', lineHeight: 1.7 }}>{summaries[thread.id]}</div>
                        </div>
                      ) : (
                        <button onClick={() => requestSummary(thread.id)}
                          className="btn btn-ghost btn-xs" style={{ fontSize: 10, color: 'var(--purple)', border: '1px solid rgba(167,139,250,0.3)' }}
                          disabled={isLoading}>
                          {isLoading ? '⏳ Summarizing…' : '✨ Summarize with AI'}
                        </button>
                      )}
                    </div>

                    {/* Sentiment & Confidence metrics charts */}
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>📊 Sentiment & Confidence Metrics Comparison</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {thread.responses.map(r => {
                          const metrics = getSentimentMetrics(r.text);
                          return (
                            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 14, alignItems: 'center' }}>
                              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#fff' }}>{r.platform}</span>
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--teal)', fontSize: 8.5, marginBottom: 2 }}>
                                  <span>Confidence</span>
                                  <span>{metrics.confidence}%</span>
                                </div>
                                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                  <div style={{ height: '100%', width: `${metrics.confidence}%`, background: 'var(--teal)', borderRadius: 2 }} />
                                </div>
                              </div>
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold)', fontSize: 8.5, marginBottom: 2 }}>
                                  <span>Sentiment</span>
                                  <span>{metrics.sentiment}% Pos</span>
                                </div>
                                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                  <div style={{ height: '100%', width: `${metrics.sentiment}%`, background: 'var(--gold)', borderRadius: 2 }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Individual responses */}
                    {thread.responses.map((r, idx) => (
                      <div key={r.id} style={{
                        padding: '12px 14px',
                        borderBottom: idx < thread.responses.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                          <span style={{ fontSize: 16 }}>{r.icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{r.platform}</span>
                          {!r.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />}
                          <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace', marginLeft: 'auto' }}>{ago(r.ts)}</span>
                          <button onClick={() => navigator.clipboard?.writeText(r.text)}
                            className="btn btn-ghost btn-xs" style={{ fontSize: 9 }}>📋</button>
                        </div>
                        <div style={{ fontSize: 11, color: '#c8d0e8', lineHeight: 1.7, paddingLeft: 24 }}>{r.text}</div>
                      </div>
                    ))}

                    {/* Sent reply */}
                    {sentReply && (
                      <div style={{ padding: '10px 14px', background: 'rgba(94,234,212,0.06)', borderTop: '1px solid rgba(94,234,212,0.15)' }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>✅ YOUR REPLY SENT</div>
                        <div style={{ fontSize: 11, color: 'var(--muted2)' }}>{sentReply}</div>
                      </div>
                    )}

                    {/* Reply composer */}
                    <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.08)' }}>
                      {isReplying ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input value={replyText} onChange={e => setReplyText(e.target.value)}
                            placeholder="Type a reply or pick a quick reply above…"
                            onKeyDown={e => e.key === 'Enter' && sendReply(thread.id)}
                            style={{ flex: 1, fontSize: 11, padding: '7px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: '#e4e4ed', outline: 'none' }}
                            autoFocus />
                          <button className="btn btn-teal btn-sm" onClick={() => sendReply(thread.id)} style={{ fontSize: 11 }}>Send</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setReplyActive(null)} style={{ fontSize: 11 }}>✕</button>
                        </div>
                      ) : (
                        <button className="btn btn-ghost btn-xs" onClick={() => setReplyActive(thread.id)} style={{ fontSize: 10 }}>
                          ↩ Reply to thread
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
