import { useState, useMemo } from 'react';

const PATTERNS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_+.~#?&/=]*' },
  { name: 'Phone (US)', pattern: '(\\+1[-\\s.]?)?(\\([0-9]{3}\\)|[0-9]{3})[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}' },
  { name: 'IPv4', pattern: '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])' },
  { name: 'Hex Color', pattern: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})' },
  { name: 'Credit Card', pattern: '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})\\b' },
  { name: 'HTML Tag', pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)' },
];

const CHEATSHEET = [
  { token: '.', desc: 'Any character except newline' },
  { token: '*', desc: 'Zero or more' },
  { token: '+', desc: 'One or more' },
  { token: '?', desc: 'Zero or one (optional)' },
  { token: '^', desc: 'Start of string' },
  { token: '$', desc: 'End of string' },
  { token: '\\d', desc: 'Digit [0-9]' },
  { token: '\\w', desc: 'Word char [a-zA-Z0-9_]' },
  { token: '\\s', desc: 'Whitespace' },
  { token: '[abc]', desc: 'Character class' },
  { token: '(abc)', desc: 'Capture group' },
  { token: 'a|b', desc: 'Alternation (a or b)' },
  { token: '{n,m}', desc: 'Between n and m times' },
  { token: '(?:...)', desc: 'Non-capturing group' },
];

const TEST_TEXT = `Contact us at support@example.com or sales@company.org.
Visit https://www.example.com or http://docs.api.io/v2/guide for more info.
Call us at (555) 123-4567 or 555.987.6543.
Server IP: 192.168.1.100 or 10.0.0.1
Today is 2026-06-02, meeting on 2026-12-31.
Background color: #ff6b6b, border: #22d3ee, accent: #a78bfa`;

export default function RegexTester() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testText, setTestText] = useState(TEST_TEXT);
  const [activeTab, setActiveTab] = useState('match');
  const [replacement, setReplacement] = useState('[REDACTED]');
  const [activePanel, setActivePanel] = useState('cheatsheet');

  const regexResult = useMemo(() => {
    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
      const regex = new RegExp(pattern, flagStr);
      const matches = [];
      let m;
      const testRegex = new RegExp(pattern, flagStr.includes('g') ? flagStr : flagStr + 'g');
      while ((m = testRegex.exec(testText)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
        if (!flagStr.includes('g')) break;
      }
      const replaced = testText.replace(regex, replacement);
      return { valid: true, matches, replaced, matchCount: matches.length };
    } catch (e) {
      return { valid: false, error: e.message, matches: [], replaced: testText, matchCount: 0 };
    }
  }, [pattern, flags, testText, replacement]);

  const highlightText = () => {
    if (!regexResult.valid || regexResult.matchCount === 0) return testText;
    let result = [];
    let lastIdx = 0;
    const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
    const colors = ['#f5b73144', '#22d3ee44', '#a78bfa44', '#22c55e44'];
    let matchIdx = 0;
    try {
      const regex = new RegExp(pattern, flagStr.includes('g') ? flagStr : flagStr + 'g');
      let m;
      while ((m = regex.exec(testText)) !== null) {
        if (m.index > lastIdx) result.push(<span key={`t${lastIdx}`}>{testText.slice(lastIdx, m.index)}</span>);
        result.push(<mark key={`m${m.index}`} style={{ background: colors[matchIdx % colors.length], color: '#e2e8f0', borderRadius: 3, padding: '0 2px' }}>{m[0]}</mark>);
        lastIdx = m.index + m[0].length;
        matchIdx++;
        if (!flagStr.includes('g')) break;
      }
    } catch { /* ignore */ }
    if (lastIdx < testText.length) result.push(<span key="end">{testText.slice(lastIdx)}</span>);
    return result;
  };

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #16161e 50%, #1a1820 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '24px 40px' },
    heroTitle: { fontSize: 26, fontWeight: 800, background: 'linear-gradient(90deg, #f5b731, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    badge: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }),
    layout: { display: 'flex', flex: 1, height: 'calc(100vh - 180px)', overflow: 'hidden' },
    left: { flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.07)' },
    right: { width: 280, display: 'flex', flexDirection: 'column', background: '#0e0e16' },
    patternBar: { display: 'flex', padding: '12px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'center', gap: 8 },
    patternInput: { flex: 1, background: '#0a0a12', border: `1px solid ${regexResult.valid ? 'rgba(34,211,238,0.3)' : '#ef444466'}`, borderRadius: 8, color: regexResult.valid ? '#22d3ee' : '#ef4444', padding: '9px 14px', fontSize: 14, outline: 'none', fontFamily: 'monospace' },
    flagBtn: (on) => ({ background: on ? '#f5b73122' : 'rgba(255,255,255,0.05)', border: `1px solid ${on ? '#f5b73144' : 'rgba(255,255,255,0.1)'}`, color: on ? '#f5b731' : '#6e7191', borderRadius: 6, padding: '7px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }),
    tabBar: { display: 'flex', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    tab: (a) => ({ padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', color: a ? '#f5b731' : '#6e7191', borderBottom: `2px solid ${a ? '#f5b731' : 'transparent'}` }),
    textarea: { flex: 1, background: '#0a0a12', fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', resize: 'none', border: 'none', padding: 16, outline: 'none', lineHeight: 1.7 },
    sideHead: { padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    matchCard: (i) => ({ background: ['rgba(245,183,49,0.08)', 'rgba(34,211,238,0.08)', 'rgba(167,139,250,0.08)', 'rgba(34,197,94,0.08)'][i % 4], border: `1px solid ${['#f5b73122', '#22d3ee22', '#a78bfa22', '#22c55e22'][i % 4]}`, borderRadius: 8, padding: '10px 12px', marginBottom: 8 }),
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={s.badge('#f5b731')}>⚡ Regex</span>
              <span style={s.badge(regexResult.valid ? '#22c55e' : '#ef4444')}>{regexResult.valid ? '✓ Valid' : '✗ Error'}</span>
            </div>
            <h1 style={s.heroTitle}>Regex Tester</h1>
            <p style={{ color: '#6e7191', margin: '6px 0 0', fontSize: 13 }}>Live pattern matching, capture groups, replace, and cheat sheet</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[[regexResult.matchCount, 'Matches', '#f5b731'], [regexResult.matches.reduce((s, m) => s + m.groups.filter(Boolean).length, 0), 'Groups', '#a78bfa'], [testText.length, 'Chars', '#22d3ee']].map(([n, l, c]) => (
              <div key={l} style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{n}</div>
                <div style={{ fontSize: 11, color: '#6e7191' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.patternBar}>
        <span style={{ fontFamily: 'monospace', color: '#6e7191', fontSize: 16 }}>/</span>
        <input value={pattern} onChange={e => setPattern(e.target.value)} style={s.patternInput} placeholder="Enter regex pattern..." spellCheck={false} />
        <span style={{ fontFamily: 'monospace', color: '#6e7191', fontSize: 16 }}>/</span>
        {Object.entries(flags).map(([f, on]) => (
          <button key={f} style={s.flagBtn(on)} onClick={() => setFlags(fl => ({ ...fl, [f]: !fl[f] }))}>{f}</button>
        ))}
        {!regexResult.valid && <span style={{ color: '#ef4444', fontSize: 12, marginLeft: 8 }}>⚠ {regexResult.error}</span>}
      </div>

      <div style={s.layout}>
        <div style={s.left}>
          <div style={s.tabBar}>
            {['match', 'replace'].map(t => <button key={t} style={s.tab(activeTab === t)} onClick={() => setActiveTab(t)}>{t === 'match' ? '🔍 Match' : '✏ Replace'}</button>)}
            <div style={{ marginLeft: 'auto', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              {PATTERNS.map(p => (
                <button key={p.name} onClick={() => setPattern(p.pattern)} style={{ background: 'rgba(245,183,49,0.08)', border: '1px solid rgba(245,183,49,0.2)', color: '#f5b731', borderRadius: 6, padding: '4px 8px', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>{p.name}</button>
              )).slice(0, 4)}
            </div>
          </div>

          {activeTab === 'match' && (
            <>
              <div style={{ padding: '10px 16px', background: '#0e0e16', borderBottom: '1px solid rgba(255,255,255,0.07)', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, flex: 0, maxHeight: 150, overflow: 'auto' }}>
                {regexResult.valid ? highlightText() : testText}
              </div>
              <textarea style={s.textarea} value={testText} onChange={e => setTestText(e.target.value)} spellCheck={false} />
            </>
          )}
          {activeTab === 'replace' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#6e7191' }}>Replacement:</span>
                <input value={replacement} onChange={e => setReplacement(e.target.value)} style={{ flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#a78bfa', padding: '7px 12px', fontSize: 13, outline: 'none', fontFamily: 'monospace' }} />
              </div>
              <div style={{ flex: 1, display: 'flex' }}>
                <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ padding: '6px 16px', fontSize: 11, color: '#6e7191', background: '#16161e' }}>Input</div>
                  <textarea style={{ ...s.textarea, flex: 1 }} value={testText} onChange={e => setTestText(e.target.value)} spellCheck={false} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ padding: '6px 16px', fontSize: 11, color: '#6e7191', background: '#16161e' }}>Output</div>
                  <pre style={{ margin: 0, padding: 16, fontFamily: 'monospace', fontSize: 13, color: '#22d3ee', lineHeight: 1.7, overflow: 'auto', flex: 1 }}>{regexResult.replaced}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={s.right}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['cheatsheet', 'matches'].map(p => <button key={p} style={s.tab(activePanel === p)} onClick={() => setActivePanel(p)}>{p === 'cheatsheet' ? 'Cheat Sheet' : `Matches (${regexResult.matchCount})`}</button>)}
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
            {activePanel === 'cheatsheet' && CHEATSHEET.map((item, i) => (
              <div key={i} onClick={() => setPattern(item.token)} style={{ display: 'flex', gap: 10, padding: '7px 8px', borderRadius: 6, cursor: 'pointer', marginBottom: 2, background: 'rgba(255,255,255,0.02)' }}>
                <code style={{ color: '#f5b731', fontFamily: 'monospace', fontSize: 12, minWidth: 60 }}>{item.token}</code>
                <span style={{ color: '#6e7191', fontSize: 11 }}>{item.desc}</span>
              </div>
            ))}
            {activePanel === 'matches' && regexResult.matches.map((m, i) => (
              <div key={i} style={s.matchCard(i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: '#6e7191' }}>Match #{i + 1}</span>
                  <span style={{ fontSize: 10, color: '#6e7191' }}>idx: {m.index}</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#f5b731', wordBreak: 'break-all' }}>{m.match}</div>
                {m.groups.filter(Boolean).map((g, j) => (
                  <div key={j} style={{ fontSize: 11, color: '#6e7191', marginTop: 4 }}>Group {j + 1}: <span style={{ color: '#a78bfa' }}>{g}</span></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
