import { useState, useRef } from 'react';

const C = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  green: '#4ade80',
  text: '#e2e8f0',
  textDim: '#94a3b8',
};

const SAMPLE_CODE = {
  'App.jsx': `import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import './App.css';

// Main application entry point
const API_BASE = 'https://api.example.com/v1';
const MAX_RETRIES = 3;

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch(\`\${API_BASE}/me\`);
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className={\`app theme-\${theme}\`}>
      <Sidebar user={user} />
      <Dashboard user={user} theme={theme} />
    </div>
  );
}`,
  'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  'Dashboard.jsx': `import { useState } from 'react';

// Dashboard component - main content area
export function Dashboard({ user, theme }) {
  const [activeTab, setActiveTab] = useState('overview');
  const metrics = [42, 87, 63, 91, 55];

  return (
    <main className="dashboard">
      <h1>Welcome, {user?.name ?? 'Guest'}</h1>
      <div className="metrics">
        {metrics.map((val, i) => (
          <div key={i} className="metric-card">
            <span>{val}%</span>
          </div>
        ))}
      </div>
    </main>
  );
}`,
  'Sidebar.jsx': `export function Sidebar({ user }) {
  return (
    <aside className="sidebar">
      <nav>
        <a href="/home">Home</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
      </nav>
    </aside>
  );
}`,
  'App.css': `/* Global styles */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Mono', monospace; background: #0e0e16; color: #e2e8f0; }
.app { display: flex; height: 100vh; }
.loader { display: grid; place-items: center; height: 100vh; }`,
  'index.css': `@import url('https://fonts.googleapis.com/css2?family=DM+Mono&family=Syne:wght@400;700&display=swap');
:root { --gold: #f5b731; --teal: #22d3ee; --surface: #0e0e16; }`,
  'package.json': `{
  "name": "bolt-studio-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}`,
  'utils.js': `export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}`,
  'api.js': `const BASE_URL = 'https://api.example.com';

export async function get(path) {
  const res = await fetch(BASE_URL + path);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function post(path, body) {
  const res = await fetch(BASE_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}`,
  'README.md': `# Bolt Studio App

A premium AI-powered development platform.

## Getting Started
\`\`\`bash
npm install
npm start
\`\`\`

## Features
- Real-time collaboration
- AI-assisted coding
- Performance profiling`,
};

const FILE_TREE = [
  { id: 'src', name: 'src', type: 'folder', children: ['App.jsx', 'index.js', 'App.css', 'index.css'] },
  { id: 'components', name: 'components', type: 'folder', children: ['Dashboard.jsx', 'Sidebar.jsx'] },
  { id: 'public', name: 'public', type: 'folder', children: ['package.json', 'README.md'] },
  { id: 'utils.js', name: 'utils.js', type: 'file', ext: 'js' },
  { id: 'api.js', name: 'api.js', type: 'file', ext: 'js' },
];

const FILE_ICONS = { jsx: '⚛️', js: '🟨', css: '🎨', json: '📋', md: '📄', folder: '📁', folderOpen: '📂' };

const TERMINAL_HISTORY = [
  { cmd: 'npm install', out: ['added 1247 packages in 12s', '✓ Dependencies installed'] },
  { cmd: 'npm start', out: ['Starting development server...', '✓ Compiled successfully!', '  Local: http://localhost:3000'] },
  { cmd: 'git status', out: ['On branch main', 'Changes not staged:', '  modified: src/App.jsx'] },
  { cmd: 'git add .', out: [] },
  { cmd: 'git commit -m "feat: add dashboard"', out: ['[main a3f9c12] feat: add dashboard', '3 files changed, 47 insertions(+)'] },
];

const AI_HISTORY = [
  {
    role: 'user', text: 'How can I optimize the fetchUser function?'
  },
  {
    role: 'ai', text: `You can optimize \`fetchUser\` by adding request caching and abort controller support:\n\n\`\`\`js\nconst cache = new Map();\n\nasync function fetchUser() {\n  if (cache.has('user')) {\n    setUser(cache.get('user'));\n    setLoading(false);\n    return;\n  }\n  const ctrl = new AbortController();\n  try {\n    const res = await fetch(\`\${API_BASE}/me\`, {\n      signal: ctrl.signal\n    });\n    const data = await res.json();\n    cache.set('user', data);\n    setUser(data);\n  } catch (err) {\n    if (err.name !== 'AbortError')\n      console.error(err);\n  } finally {\n    setLoading(false);\n  }\n}\`\`\`\n\nThis avoids redundant network requests on re-renders.`,
    code: `const cache = new Map();\n\nasync function fetchUser() {\n  if (cache.has('user')) {\n    setUser(cache.get('user'));\n    setLoading(false);\n    return;\n  }\n  const ctrl = new AbortController();\n  try {\n    const res = await fetch(\`\${API_BASE}/me\`, { signal: ctrl.signal });\n    const data = await res.json();\n    cache.set('user', data);\n    setUser(data);\n  } catch (err) {\n    if (err.name !== 'AbortError') console.error(err);\n  } finally {\n    setLoading(false);\n  }\n}`
  },
];

function syntaxHighlight(code) {
  const keywords = /\b(import|export|default|from|const|let|var|function|async|await|return|if|else|try|catch|finally|new|class|extends|throw|typeof|instanceof|for|while|of|in|null|undefined|true|false|this)\b/g;
  const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g;
  const comments = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
  const numbers = /\b(\d+\.?\d*)\b/g;

  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const placeholders = [];
  let pid = 0;

  function protect(str, color) {
    const key = `\x00PH${pid++}\x00`;
    placeholders.push({ key, html: `<span style="color:${color}">${str}</span>` });
    return key;
  }

  escaped = escaped.replace(comments, m => protect(m, C.muted));
  escaped = escaped.replace(strings, m => protect(m, C.teal));
  escaped = escaped.replace(keywords, m => protect(m, C.gold));
  escaped = escaped.replace(numbers, m => protect(m, C.purple));

  for (const { key, html } of placeholders) {
    escaped = escaped.split(key).join(html);
  }

  return escaped;
}

function LineNumbers({ code }) {
  const lines = (code || '').split('\n');
  return (
    <div style={{
      width: 48,
      minWidth: 48,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      paddingTop: 12,
      paddingBottom: 12,
      overflowY: 'hidden',
      userSelect: 'none',
      flexShrink: 0,
    }}>
      {lines.map((_, i) => (
        <div key={i} style={{
          height: 21,
          lineHeight: '21px',
          textAlign: 'right',
          paddingRight: 10,
          fontSize: 12,
          fontFamily: "'DM Mono', monospace",
          color: C.muted,
        }}>
          {i + 1}
        </div>
      ))}
    </div>
  );
}

function FileTreeNode({ node, depth = 0, openFiles, onOpen }) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = node.type === 'folder';
  const ext = node.name.split('.').pop();
  const icon = isFolder ? (expanded ? FILE_ICONS.folderOpen : FILE_ICONS.folder) : (FILE_ICONS[ext] || '📄');

  return (
    <div>
      <div
        onClick={() => isFolder ? setExpanded(e => !e) : onOpen(node.name)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px 4px ' + (8 + depth * 14) + 'px',
          cursor: 'pointer',
          fontSize: 12,
          fontFamily: "'DM Mono', monospace",
          color: openFiles.includes(node.name) ? C.gold : C.textDim,
          background: openFiles.includes(node.name) ? 'rgba(245,183,49,0.07)' : 'transparent',
          borderRadius: 4,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!openFiles.includes(node.name)) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={e => { if (!openFiles.includes(node.name)) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span>{node.name}</span>
      </div>
      {isFolder && expanded && node.children?.map(childName => (
        <FileTreeNode
          key={childName}
          node={{ id: childName, name: childName, type: 'file', ext: childName.split('.').pop() }}
          depth={depth + 1}
          openFiles={openFiles}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function TabBar({ tabs, active, unsaved, onSelect, onClose }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      overflowX: 'auto',
      height: 38,
      flexShrink: 0,
    }}>
      {tabs.map(tab => {
        const isActive = tab === active;
        const isDirty = unsaved.includes(tab);
        const ext = tab.split('.').pop();
        const icon = FILE_ICONS[ext] || '📄';
        return (
          <div
            key={tab}
            onClick={() => onSelect(tab)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 14px',
              height: '100%',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: "'DM Mono', monospace",
              color: isActive ? C.text : C.muted,
              borderRight: `1px solid ${C.border}`,
              borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
              background: isActive ? C.surface2 : 'transparent',
              position: 'relative',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s',
            }}
          >
            <span style={{ fontSize: 12 }}>{icon}</span>
            <span>{tab}</span>
            {isDirty && <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, display: 'inline-block' }} />}
            <span
              onClick={e => { e.stopPropagation(); onClose(tab); }}
              style={{
                marginLeft: 2,
                opacity: 0.4,
                cursor: 'pointer',
                fontSize: 13,
                lineHeight: 1,
                padding: '2px 3px',
                borderRadius: 3,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
            >✕</span>
          </div>
        );
      })}
    </div>
  );
}

function ToolbarButton({ label, icon, onClick, loading, success }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        background: loading ? C.surface3 : success ? 'rgba(74,222,128,0.12)' : C.surface2,
        color: success ? C.green : C.text,
        fontSize: 12,
        fontFamily: "'Syne', sans-serif",
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        letterSpacing: '0.03em',
      }}
    >
      <span>{loading ? '⏳' : success ? '✓' : icon}</span>
      <span>{loading ? 'Working…' : success ? 'Done!' : label}</span>
    </button>
  );
}

export default function CodeEditor() {
  const [openTabs, setOpenTabs] = useState(['App.jsx', 'index.js']);
  const [activeTab, setActiveTab] = useState('App.jsx');
  const [files, setFiles] = useState({ ...SAMPLE_CODE });
  const [unsaved, setUnsaved] = useState([]);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState(TERMINAL_HISTORY);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState(AI_HISTORY);
  const [aiLoading, setAiLoading] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [toolState, setToolState] = useState({});
  const textareaRef = useRef(null);

  const currentCode = files[activeTab] || '';

  const openFile = (name) => {
    if (!SAMPLE_CODE[name] && !files[name]) return;
    if (!openTabs.includes(name)) {
      setOpenTabs(prev => prev.length >= 5 ? [...prev.slice(1), name] : [...prev, name]);
    }
    setActiveTab(name);
  };

  const closeTab = (name) => {
    const remaining = openTabs.filter(t => t !== name);
    setOpenTabs(remaining);
    if (activeTab === name) setActiveTab(remaining[remaining.length - 1] || '');
    setUnsaved(prev => prev.filter(u => u !== name));
  };

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setFiles(prev => ({ ...prev, [activeTab]: val }));
    if (!unsaved.includes(activeTab)) setUnsaved(prev => [...prev, activeTab]);
    updateCursor(e.target);
  };

  const updateCursor = (el) => {
    const text = el.value.substring(0, el.selectionStart);
    const lines = text.split('\n');
    setCursor({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
      setFiles(prev => ({ ...prev, [activeTab]: newVal }));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
    if (e.ctrlKey && e.key === 'f') { e.preventDefault(); setFindOpen(f => !f); }
    if (e.ctrlKey && e.key === 's') { e.preventDefault(); triggerTool('save'); }
  };

  const triggerTool = (key) => {
    setToolState(prev => ({ ...prev, [key]: 'loading' }));
    setTimeout(() => {
      setToolState(prev => ({ ...prev, [key]: 'success' }));
      if (key === 'save') setUnsaved(prev => prev.filter(u => u !== activeTab));
      setTimeout(() => setToolState(prev => ({ ...prev, [key]: '' })), 2000);
    }, 1000);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const fakeOutputs = {
      'ls': ['App.jsx  index.js  App.css  index.css', 'components/  public/'],
      'pwd': ['/home/user/project'],
      'node -v': ['v20.11.0'],
      'npm -v': ['10.2.4'],
      'clear': [],
    };
    const out = fakeOutputs[terminalInput.trim()] || [`bash: ${terminalInput.trim()}: command not found`];
    setTerminalHistory(prev => [...prev, { cmd: terminalInput.trim(), out }]);
    setTerminalInput('');
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    const userMsg = { role: 'user', text: aiInput };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const aiResp = {
      role: 'ai',
      text: `Great question! Based on your code in \`${activeTab}\`, I'd recommend extracting the logic into a custom hook for better reusability. This follows the single-responsibility principle and makes testing easier.\n\n\`\`\`js\nfunction useData(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch(url).then(r => r.json()).then(setData).finally(() => setLoading(false));\n  }, [url]);\n  return { data, loading };\n}\`\`\``,
      code: `function useData(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch(url).then(r => r.json()).then(setData).finally(() => setLoading(false));\n  }, [url]);\n  return { data, loading };\n}`,
    };
    setAiMessages(prev => [...prev, aiResp]);
    setAiLoading(false);
  };

  const applyToEditor = (code) => {
    setFiles(prev => ({ ...prev, [activeTab]: prev[activeTab] + '\n\n' + code }));
    setUnsaved(prev => prev.includes(activeTab) ? prev : [...prev, activeTab]);
  };

  const quickAction = (action) => {
    const prompts = {
      'Fix Bug': `Find and fix any bugs in ${activeTab}`,
      'Add Comment': `Add JSDoc comments to all functions in ${activeTab}`,
      'Refactor': `Refactor ${activeTab} for better readability`,
      'Write Tests': `Write Jest unit tests for ${activeTab}`,
      'Explain': `Explain what ${activeTab} does step by step`,
    };
    setAiInput(prompts[action] || action);
  };

  const errorCount = unsaved.length;
  const fileExt = activeTab.split('.').pop().toUpperCase();
  const highlighted = syntaxHighlight(currentCode);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: C.surface, fontFamily: "'DM Mono', monospace", overflow: 'hidden', color: C.text }}>
      {/* TOOLBAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: C.surface2, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.gold, marginRight: 16, letterSpacing: '0.05em' }}>⚡ BoltStudio</span>
        <ToolbarButton label="Run" icon="▶" onClick={() => triggerTool('run')} loading={toolState.run === 'loading'} success={toolState.run === 'success'} />
        <ToolbarButton label="Save" icon="💾" onClick={() => triggerTool('save')} loading={toolState.save === 'loading'} success={toolState.save === 'success'} />
        <ToolbarButton label="Format" icon="⎇" onClick={() => triggerTool('format')} loading={toolState.format === 'loading'} success={toolState.format === 'success'} />
        <ToolbarButton label="Share" icon="🔗" onClick={() => triggerTool('share')} loading={toolState.share === 'loading'} success={toolState.share === 'success'} />
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowTerminal(v => !v)}
          style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: showTerminal ? 'rgba(245,183,49,0.12)' : C.surface3, color: showTerminal ? C.gold : C.muted, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}
        >
          {showTerminal ? '▼ Terminal' : '▲ Terminal'}
        </button>
      </div>

      {/* MAIN BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR FILE TREE */}
        <div style={{ width: 200, minWidth: 200, background: C.surface2, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '10px 12px 6px', fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Explorer</div>
          <div style={{ padding: '4px 8px 6px', fontSize: 12, color: C.gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⚛️</span> bolt-studio-app
          </div>
          {FILE_TREE.map(node => (
            <FileTreeNode key={node.id} node={node} openFiles={openTabs} onOpen={openFile} />
          ))}
        </div>

        {/* CENTER: TABS + EDITOR */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TabBar tabs={openTabs} active={activeTab} unsaved={unsaved} onSelect={setActiveTab} onClose={closeTab} />

          {/* FIND BAR */}
          {findOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: C.surface3, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: C.muted }}>🔍 Find:</span>
              <input
                autoFocus
                value={findQuery}
                onChange={e => setFindQuery(e.target.value)}
                placeholder="Search in file…"
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '4px 8px', color: C.text, fontSize: 12, fontFamily: "'DM Mono', monospace", outline: 'none' }}
              />
              <span style={{ fontSize: 12, color: C.muted }}>
                {findQuery ? currentCode.split(findQuery).length - 1 : 0} matches
              </span>
              <button onClick={() => setFindOpen(false)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
          )}

          {/* CODE EDITOR AREA */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
            {activeTab ? (
              <>
                <LineNumbers code={currentCode} />
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {/* Syntax highlight overlay */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute', inset: 0,
                      padding: '12px 0 12px 12px',
                      fontSize: 13,
                      lineHeight: '21px',
                      fontFamily: "'DM Mono', monospace",
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      pointerEvents: 'none',
                      color: 'transparent',
                      overflowY: 'auto',
                      zIndex: 1,
                    }}
                    dangerouslySetInnerHTML={{ __html: highlighted.replace(/color:transparent/g, '') }}
                  />
                  <textarea
                    ref={textareaRef}
                    value={currentCode}
                    onChange={handleCodeChange}
                    onKeyDown={handleKeyDown}
                    onClick={e => updateCursor(e.target)}
                    onKeyUp={e => updateCursor(e.target)}
                    spellCheck={false}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      padding: '12px 0 12px 12px',
                      fontSize: 13,
                      lineHeight: '21px',
                      fontFamily: "'DM Mono', monospace",
                      background: 'transparent',
                      color: C.text,
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      zIndex: 2,
                      caretColor: C.gold,
                    }}
                  />
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: C.muted, fontSize: 14 }}>
                Open a file from the sidebar
              </div>
            )}
          </div>

          {/* TERMINAL */}
          {showTerminal && (
            <div style={{ height: 200, borderTop: `1px solid ${C.border}`, background: '#0a0a12', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderBottom: `1px solid ${C.border}`, background: C.surface2 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.red, display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.gold, display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: C.muted, marginLeft: 8, fontFamily: "'DM Mono', monospace" }}>bash — ~/project</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px', fontSize: 12, fontFamily: "'DM Mono', monospace", lineHeight: '18px' }}>
                {terminalHistory.map((entry, i) => (
                  <div key={i} style={{ marginBottom: 4 }}>
                    <div style={{ color: C.teal }}>
                      <span style={{ color: C.green }}>~/project</span>
                      <span style={{ color: C.muted }}> $ </span>
                      <span style={{ color: C.text }}>{entry.cmd}</span>
                    </div>
                    {entry.out.map((line, j) => (
                      <div key={j} style={{ color: C.textDim, paddingLeft: 0 }}>{line}</div>
                    ))}
                  </div>
                ))}
                <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: C.green }}>~/project</span>
                  <span style={{ color: C.muted }}> $ </span>
                  <input
                    value={terminalInput}
                    onChange={e => setTerminalInput(e.target.value)}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 12, fontFamily: "'DM Mono', monospace", caretColor: C.gold }}
                    placeholder="type a command…"
                  />
                </form>
              </div>
            </div>
          )}
        </div>

        {/* AI PANEL */}
        <div style={{ width: 240, minWidth: 240, background: C.surface2, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px 8px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>🤖</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: C.gold, letterSpacing: '0.05em' }}>Ask AI</span>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
          </div>

          {/* Quick Actions */}
          <div style={{ padding: '10px 10px 6px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {['Fix Bug', 'Add Comment', 'Refactor', 'Write Tests', 'Explain'].map(action => (
              <button
                key={action}
                onClick={() => quickAction(action)}
                style={{ padding: '4px 9px', fontSize: 11, fontFamily: "'DM Mono', monospace", background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 4, color: C.textDim, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Chat History */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiMessages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: msg.role === 'user' ? 'rgba(245,183,49,0.12)' : C.surface3,
                  border: `1px solid ${msg.role === 'user' ? 'rgba(245,183,49,0.25)' : C.border}`,
                  borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  padding: '8px 10px',
                  fontSize: 11,
                  fontFamily: "'DM Mono', monospace",
                  color: msg.role === 'user' ? C.gold : C.textDim,
                  maxWidth: '95%',
                  lineHeight: '17px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.text}
                </div>
                {msg.role === 'ai' && msg.code && (
                  <button
                    onClick={() => applyToEditor(msg.code)}
                    style={{ fontSize: 10, padding: '3px 8px', background: 'rgba(34,211,238,0.12)', border: `1px solid rgba(34,211,238,0.3)`, borderRadius: 4, color: C.teal, cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}
                  >
                    ✦ Apply to Editor
                  </button>
                )}
              </div>
            ))}
            {aiLoading && (
              <div style={{ display: 'flex', gap: 4, padding: '6px 10px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, animation: `bounce 1s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
          </div>

          {/* AI Input */}
          <div style={{ padding: '8px 10px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
              <textarea
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAiMessage(); } }}
                placeholder="Ask anything… (Enter to send)"
                rows={2}
                style={{ flex: 1, background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px', color: C.text, fontSize: 11, fontFamily: "'DM Mono', monospace", resize: 'none', outline: 'none', lineHeight: '16px' }}
              />
              <button
                onClick={sendAiMessage}
                disabled={aiLoading}
                style={{ width: 30, height: 30, borderRadius: 6, background: C.gold, border: 'none', color: C.surface, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 14px', background: C.surface3, borderTop: `1px solid ${C.border}`, fontSize: 11, fontFamily: "'DM Mono', monospace", color: C.muted, flexShrink: 0 }}>
        <span style={{ color: C.teal, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>⎇</span> main
        </span>
        <span style={{ color: errorCount > 0 ? C.red : C.muted }}>
          {errorCount > 0 ? `⚠ ${errorCount} unsaved` : '✓ All saved'}
        </span>
        <span>Ln {cursor.line}, Col {cursor.col}</span>
        <span style={{ marginLeft: 'auto' }}>{activeTab || '—'}</span>
        <span style={{ color: C.purple }}>{fileExt}</span>
        <span>UTF-8</span>
        <span>Spaces: 2</span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        textarea { tab-size: 2; }
      `}</style>
    </div>
  );
}
