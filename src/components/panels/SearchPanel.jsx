import { useState, useEffect, useRef, useCallback } from 'react';

const defaultResults = [
  { id: 1, title: 'Deployment Pipeline Alpha', sub: 'Last run 2 hours ago · Status: success', type: 'pipeline' },
  { id: 2, title: 'Model: GPT-4 Fine-tune v2', sub: 'Accuracy 94.2% · Updated 1 day ago', type: 'model' },
  { id: 3, title: 'Dataset: MMLU Benchmark', sub: '14,000 records · Format: JSONL', type: 'dataset' },
];

function DefaultResult({ result }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: '600', color: 'var(--text, #f0f0f0)' }}>
        {result.title}
      </span>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted, #888)' }}>
        {result.sub}
      </span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '12px 14px', alignItems: 'center' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.4s ease infinite', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ height: '12px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', width: '60%', animation: 'pulse 1.4s ease infinite' }} />
        <div style={{ height: '10px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', width: '80%', animation: 'pulse 1.4s ease infinite 0.2s' }} />
      </div>
    </div>
  );
}

export default function SearchPanel({
  onSearch,
  results = null,
  renderResult,
  loading = false,
  placeholder = 'Search anything...',
  emptyText = 'No results found',
}) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const data = results ?? (query.length > 0 ? defaultResults.filter(r =>
    r.title.toLowerCase().includes(query.toLowerCase())
  ) : []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (query && onSearch) onSearch(query);
    }, 280);
    return () => clearTimeout(t);
  }, [query, onSearch]);

  const [prevDataLength, setPrevDataLength] = useState(data.length);
  if (data.length !== prevDataLength) {
    setPrevDataLength(data.length);
    setActiveIndex(-1);
  }

  const handleKeyDown = useCallback((e) => {
    if (!data.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, data.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Escape') {
      setQuery('');
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  }, [data.length]);

  const showResults = focused && query.length > 0;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--surface, #1a1a2e)',
        border: `1px solid ${focused ? 'var(--gold, #f5c518)' : 'var(--border, #2a2a3e)'}`,
        borderRadius: showResults ? '10px 10px 0 0' : '10px',
        padding: '10px 14px',
        transition: 'border-color 0.2s ease',
        boxShadow: focused ? '0 0 0 2px rgba(245,197,24,0.12)' : 'none',
      }}>
        <span style={{ fontSize: '16px', flexShrink: 0, color: focused ? 'var(--gold, #f5c518)' : 'var(--text-muted, #888)', transition: 'color 0.2s' }}>
          🔍
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
            color: 'var(--text, #f0f0f0)',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            caretColor: 'var(--gold, #f5c518)',
          }}
        />
        {query && (
          <button onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #888)', fontSize: '16px', padding: '0 4px' }}>
            ×
          </button>
        )}
        {loading && (
          <div style={{
            width: '14px', height: '14px', border: '2px solid rgba(245,197,24,0.3)',
            borderTopColor: 'var(--gold, #f5c518)', borderRadius: '50%',
            animation: 'spin 0.7s linear infinite', flexShrink: 0,
          }} />
        )}
      </div>
      {showResults && (
        <div
          ref={listRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface, #1a1a2e)',
            border: '1px solid var(--gold, #f5c518)',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            zIndex: 200,
            maxHeight: '300px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border, #2a2a3e) transparent',
            animation: 'slideDown 0.18s ease',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          }}
        >
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          ) : data.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔎</div>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-muted, #888)', margin: 0 }}>
                {emptyText}
              </p>
            </div>
          ) : (
            data.map((result, i) => (
              <div
                key={result.id ?? i}
                style={{
                  padding: '12px 14px',
                  background: i === activeIndex ? 'rgba(245,197,24,0.08)' : 'transparent',
                  borderLeft: i === activeIndex ? '2px solid var(--gold, #f5c518)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                {renderResult ? renderResult(result, i === activeIndex) : <DefaultResult result={result} />}
              </div>
            ))
          )}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
