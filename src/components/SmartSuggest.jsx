import { useState, useEffect, useMemo } from 'react';
import { fuzzySearch } from '../utils/fuzzySearch';

const CATEGORIES = [
  { label: '🔥 Trending', filter: (p) => p.useCount > 5 },
  { label: '⭐ Top Rated', filter: (p) => (p.rating || 0) > 4 },
  { label: '🎯 UI/UX', filter: (p) => p.category === 'ui-ux' || p.category === 'design' },
  { label: '⚡ Quick', filter: (p) => (p.prompt || '').length < 200 },
  { label: '🧪 Technical', filter: (p) => p.category === 'technical' || p.category === 'engineering' },
];

export default function SmartSuggest({ prompts = [], onUse, onClose }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [cycling, setCycling] = useState(true);

  // Auto-cycle through categories every 4s when no search
  useEffect(() => {
    if (!cycling || search) return;
    const t = setInterval(() => setActiveTab(i => (i + 1) % CATEGORIES.length), 4000);
    return () => clearInterval(t);
  }, [cycling, search]);

  const suggestions = useMemo(() => {
    if (search.trim().length >= 2) {
      return fuzzySearch(prompts, search).slice(0, 8);
    }
    const cat = CATEGORIES[activeTab];
    return prompts.filter(cat.filter).slice(0, 6);
  }, [prompts, search, activeTab]);

  return (
    <div style={{
      width: 280, background: 'rgba(14,14,22,0.97)',
      border: '1px solid rgba(245,183,49,0.25)',
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 0 30px rgba(245,183,49,0.08), 0 16px 48px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 10px',
        background: 'linear-gradient(135deg, rgba(245,183,49,0.08), rgba(94,234,212,0.05))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>✨</span>
          <span style={{
            fontSize: 12, fontWeight: 800, letterSpacing: '0.04em',
            background: 'linear-gradient(90deg, #f5b731, #5eead4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>SMART SUGGEST</span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--muted)',
            cursor: 'pointer', fontSize: 16, lineHeight: 1,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >×</button>
        )}
      </div>

      {/* Search */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search 5,000+ prompts..."
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
            color: '#e4e4ed', fontSize: 12, padding: '7px 10px',
            outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(245,183,49,0.4)'; setCycling(false); }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; if (!search) setCycling(true); }}
        />
      </div>

      {/* Category Tabs */}
      {!search && (
        <div style={{
          display: 'flex', gap: 4, padding: '8px 12px',
          overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          {CATEGORIES.map((cat, i) => (
            <button key={i}
              onClick={() => { setActiveTab(i); setCycling(false); }}
              style={{
                padding: '4px 9px', borderRadius: 999, border: 'none',
                background: activeTab === i ? 'rgba(245,183,49,0.15)' : 'transparent',
                color: activeTab === i ? 'var(--gold)' : 'var(--muted)',
                fontSize: 10.5, fontWeight: activeTab === i ? 700 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                outline: activeTab === i ? '1px solid rgba(245,183,49,0.3)' : 'none',
              }}
            >{cat.label}</button>
          ))}
        </div>
      )}

      {/* Suggestions List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {suggestions.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
            {search ? `No results for "${search}"` : 'No prompts in this category'}
          </div>
        )}
        {suggestions.map((p, i) => (
          <button key={p.id || i}
            onClick={() => onUse && onUse(p.prompt || p.title)}
            style={{
              width: '100%', textAlign: 'left',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 9, padding: '9px 11px', cursor: 'pointer',
              transition: 'all 0.15s', color: '#c8c8dc',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(245,183,49,0.07)';
              e.currentTarget.style.borderColor = 'rgba(245,183,49,0.25)';
              e.currentTarget.style.color = '#e4e4ed';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = '#c8c8dc';
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 3, color: 'var(--gold)', opacity: 0.8 }}>
              {p.category || 'General'}
            </div>
            <div style={{
              fontSize: 11.5, lineHeight: 1.5,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {p.title || p.prompt?.slice(0, 80) || 'Untitled'}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>5,000+ templates</span>
        <span style={{
          fontSize: 9.5, color: 'var(--teal)', fontWeight: 700,
          padding: '2px 7px', background: 'rgba(94,234,212,0.08)',
          borderRadius: 999, border: '1px solid rgba(94,234,212,0.15)',
        }}>AI-Powered</span>
      </div>
    </div>
  );
}
