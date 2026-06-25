import { useState, useRef } from 'react';

const STORAGE_KEY = 'bsp_scratchpad_v1';
const TAG_COLORS = {
  idea:    { bg: 'rgba(167,139,250,0.15)', color: 'var(--purple)', label: '💡 Idea' },
  bug:     { bg: 'rgba(255,95,95,0.15)',   color: 'var(--red)',    label: '🐞 Bug' },
  prompt:  { bg: 'rgba(245,183,49,0.15)',  color: 'var(--gold)',   label: '⚡ Prompt' },
  task:    { bg: 'rgba(0,212,170,0.15)',   color: 'var(--teal)',   label: '✔ Task' },
  note:    { bg: 'rgba(79,142,247,0.15)',  color: 'var(--blue)',   label: '📝 Note' },
};

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}
function genId() { return Math.random().toString(36).slice(2, 10); }

export default function Scratchpad({ open, onClose }) {
  const [notes, setNotes]       = useState(loadNotes);
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft]       = useState('');
  const [draftTag, setDraftTag] = useState('note');
  const [draftTitle, setDraftTitle] = useState('');
  const [search, setSearch]     = useState('');
  const [creating, setCreating] = useState(false);
  const textareaRef             = useRef(null);

  const activeNote = notes.find(n => n.id === activeId);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && !activeId && notes.length) {
      setActiveId(notes[0].id);
    }
  }

  const [prevActiveId, setPrevActiveId] = useState(activeId);
  if (activeId !== prevActiveId) {
    setPrevActiveId(activeId);
    if (activeNote) {
      setDraft(activeNote.body);
      setDraftTag(activeNote.tag || 'note');
      setDraftTitle(activeNote.title || '');
    } else {
      setDraft('');
      setDraftTag('note');
      setDraftTitle('');
    }
  }

  const saveActive = () => {
    if (!activeId) return;
    const updated = notes.map(n => n.id === activeId ? { ...n, body: draft, tag: draftTag, title: draftTitle, updatedAt: new Date().toISOString() } : n);
    setNotes(updated); saveNotes(updated);
  };

  const createNote = () => {
    const n = { id: genId(), title: draftTitle || 'Untitled Note', body: '', tag: draftTag, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const updated = [n, ...notes]; setNotes(updated); saveNotes(updated);
    setActiveId(n.id); setDraft(''); setCreating(false);
    setTimeout(() => textareaRef.current?.focus(), 80);
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id); setNotes(updated); saveNotes(updated);
    if (activeId === id) { setActiveId(updated[0]?.id || null); setDraft(''); }
  };

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const charCount = draft.length;

  const filtered = notes.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.body?.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 9900,
        background: 'rgba(4,4,6,0.6)', backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.15s ease',
      }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9901,
        width: 700, display: 'flex', flexDirection: 'column',
        background: 'var(--surface)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '-32px 0 100px rgba(0,0,0,0.6)',
        animation: 'slideInRight 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, var(--surface2), rgba(245,183,49,0.04))',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📓</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Scratchpad</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{notes.length} notes · Press N to toggle</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => { setCreating(true); setDraftTitle(''); setDraftTag('note'); setActiveId(null); setDraft(''); }}
              style={{
                padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(245,183,49,0.3)',
                background: 'rgba(245,183,49,0.1)', color: 'var(--gold)', cursor: 'pointer',
                fontSize: 12, fontWeight: 700,
              }}
            >+ New Note</button>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
              color: 'var(--muted)', cursor: 'pointer', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>
        </div>

        {/* Body: sidebar + editor */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Notes sidebar */}
          <div style={{
            width: 220, flexShrink: 0,
            borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            background: 'var(--surface2)',
            overflow: 'hidden',
          }}>
            {/* Search */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Search notes..."
                style={{ width: '100%', padding: '6px 10px', fontSize: 11.5, borderRadius: 7, background: 'var(--surface3)', border: '1px solid var(--border)', color: '#d0d0e0', outline: 'none' }}
              />
            </div>

            {/* Note list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
              {filtered.length === 0 && (
                <div style={{ padding: '20px 14px', textAlign: 'center', color: 'var(--muted)', fontSize: 11 }}>
                  {search ? 'No results' : 'No notes yet'}
                </div>
              )}
              {filtered.map(n => {
                const tc = TAG_COLORS[n.tag] || TAG_COLORS.note;
                const isActive = activeId === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => { setActiveId(n.id); setCreating(false); }}
                    style={{
                      padding: '10px 14px', cursor: 'pointer',
                      background: isActive ? 'rgba(245,183,49,0.07)' : 'transparent',
                      borderLeft: `3px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
                      transition: 'all 0.12s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 3 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: isActive ? '#fff' : '#c0c0d4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {n.title || 'Untitled'}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteNote(n.id); }}
                        style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 11, opacity: 0.6, padding: '0 2px', flexShrink: 0 }}
                      >✕</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: tc.bg, color: tc.color, fontWeight: 700 }}>{tc.label}</span>
                      <span style={{ fontSize: 9, color: 'var(--muted)' }}>{n.body?.split(/\s+/).filter(Boolean).length || 0}w</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Editor area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {creating ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Create New Note</div>
                <input
                  autoFocus value={draftTitle} onChange={e => setDraftTitle(e.target.value)}
                  placeholder="Note title..."
                  style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)', color: '#e2e2ec', fontSize: 13, outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.entries(TAG_COLORS).map(([id, tc]) => (
                    <button key={id} onClick={() => setDraftTag(id)} style={{
                      padding: '4px 12px', borderRadius: 6, border: `1px solid ${draftTag === id ? tc.color : 'var(--border)'}`,
                      background: draftTag === id ? tc.bg : 'transparent',
                      color: draftTag === id ? tc.color : 'var(--muted)', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                    }}>{tc.label}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={createNote} style={{
                    padding: '8px 18px', borderRadius: 8, border: 'none',
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dim))',
                    color: '#0a0a0a', fontWeight: 800, cursor: 'pointer', fontSize: 12,
                  }}>Create Note</button>
                  <button onClick={() => setCreating(false)} style={{
                    padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 12,
                  }}>Cancel</button>
                </div>
              </div>
            ) : activeNote ? (
              <>
                {/* Note header */}
                <div style={{
                  padding: '12px 18px', borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
                }}>
                  <input
                    value={draftTitle}
                    onChange={e => setDraftTitle(e.target.value)}
                    onBlur={saveActive}
                    placeholder="Note title..."
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      fontSize: 15, fontWeight: 800, color: '#fff',
                    }}
                  />
                  {/* Tag selector */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Object.entries(TAG_COLORS).map(([id, tc]) => (
                      <button key={id} onClick={() => { setDraftTag(id); setTimeout(saveActive, 50); }}
                        title={tc.label}
                        style={{
                          width: 22, height: 22, borderRadius: 5, border: `1px solid ${draftTag === id ? tc.color : 'transparent'}`,
                          background: draftTag === id ? tc.bg : 'var(--surface3)', cursor: 'pointer',
                          fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        {tc.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onBlur={saveActive}
                  placeholder="Start writing... (markdown-style supported)"
                  style={{
                    flex: 1, resize: 'none', padding: '16px 20px',
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#d4d4e8', fontSize: 13, lineHeight: 1.7,
                    fontFamily: 'DM Mono, monospace',
                  }}
                />

                {/* Footer metrics */}
                <div style={{
                  padding: '8px 18px', borderTop: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: 10.5, color: 'var(--muted)', flexShrink: 0,
                  background: 'var(--surface2)',
                }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                    <span>Updated {new Date(activeNote.updatedAt || activeNote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <button
                    onClick={saveActive}
                    style={{
                      padding: '3px 12px', borderRadius: 6, border: '1px solid rgba(245,183,49,0.3)',
                      background: 'rgba(245,183,49,0.1)', color: 'var(--gold)', cursor: 'pointer',
                      fontSize: 10, fontWeight: 700,
                    }}
                  >✓ Save</button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--muted)' }}>
                <span style={{ fontSize: 36, opacity: 0.3 }}>📓</span>
                <div style={{ fontSize: 13 }}>Select or create a note</div>
                <button
                  onClick={() => { setCreating(true); setDraftTitle(''); setDraftTag('note'); }}
                  style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(245,183,49,0.3)', background: 'rgba(245,183,49,0.08)', color: 'var(--gold)', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                >+ New Note</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
