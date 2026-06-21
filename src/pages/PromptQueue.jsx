import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../data/store';
import { sound } from '../lib/soundEngine';
import { useToast } from '../components/Toast';

let idCounter = 0;
function genUniqueId() {
  idCounter++;
  return `pq-${Date.now()}-${idCounter}`;
}

const PRESET_TEMPLATES = [
  { label: 'Chain of Thought', prompt: 'Solve the following goal by breaking it down step-by-step. For each step, explain your reasoning before stating the outcome:\n[Insert Goal Here]' },
  { label: 'React 19 Refactor', prompt: 'Review this component and update it to fully utilize React 19 concurrent features, use() hooks, compiler guidelines, and eliminate all linter warnings. Ensure inline CSS fits dark glassmorphism rules.' },
  { label: 'HMAC Webhook Guard', prompt: 'Write an Express middleware module that parses signature headers, fetches secret tokens from the secure environment vault, calculates HMAC hex strings using crypto, and enforces route validation.' },
  { label: 'Performance Audit', prompt: 'Perform a comprehensive audit of the code execution path. Identify memory leaks, expensive hook triggers, and write memoized wrapper structures.' }
];

const Card = ({ children, style = {}, ...props }) => (
  <div style={{
    background: '#16161e',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '20px 22px',
    boxSizing: 'border-box',
    ...style
  }} {...props}>
    {children}
  </div>
);

const SectionTitle = ({ children, color = '#22d3ee' }) => (
  <h2 style={{
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color,
    margin: '0 0 16px 0',
  }}>{children}</h2>
);

const Toggle = ({ on, onChange, color = '#22d3ee' }) => (
  <div
    onClick={onChange}
    style={{
      width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
      position: 'relative',
      background: on ? color : 'rgba(255,255,255,0.1)',
      transition: 'background 0.25s',
      boxShadow: on ? `0 0 10px ${color}66` : 'none',
      flexShrink: 0,
    }}
  >
    <div style={{
      position: 'absolute', top: 3, left: on ? 21 : 3,
      width: 16, height: 16, borderRadius: '50%', background: '#fff',
      transition: 'left 0.25s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
    }} />
  </div>
);

export default function PromptQueue() {
  const toast = useToast();
  const { accounts } = useStore();

  /* Stateful Prompt Queue with persistence */
  const [queue, setQueue] = useState(() => {
    const saved = localStorage.getItem('bsp_prompt_queue');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Default initial queue items
    return [
      { id: 'q1', label: 'Linter Sweep', prompt: 'Sweep active workspace files for TypeScript linter warnings, correct unused imports, and verify compilation.', enabled: true },
      { id: 'q2', label: 'UI Glassmorphism', prompt: 'Refactor standard cards into semi-transparent glassmorphic panels using backdrop-filter and borders.', enabled: true },
      { id: 'q3', label: 'AES Encryption', prompt: 'Audit database helpers and integrate local AES-256-GCM encryption key routines on credential variables.', enabled: false }
    ];
  });

  /* Rotation index pointer persistent */
  const [rotationIdx, setRotationIdx] = useState(() => {
    const saved = localStorage.getItem('bsp_prompt_queue_pointer');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [editId, setEditId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editPrompt, setEditPrompt] = useState('');

  // Persist queue updates
  useEffect(() => {
    localStorage.setItem('bsp_prompt_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('bsp_prompt_queue_pointer', rotationIdx.toString());
  }, [rotationIdx]);

  const enabledItems = useMemo(() => {
    return queue.filter(q => q.enabled);
  }, [queue]);

  const currentIdxPointer = useMemo(() => {
    if (enabledItems.length === 0) return 0;
    return rotationIdx % enabledItems.length;
  }, [enabledItems, rotationIdx]);

  /* Shift/Advance Rotation pointer */
  const handleAdvanceRotation = () => {
    if (enabledItems.length === 0) {
      toast.error('No enabled prompts in the rotation queue!');
      return;
    }
    sound.play('click');
    setRotationIdx(prev => prev + 1);
    toast.bolt('✓ Shifted prompt queue pointer to next sequence!');
  };

  /* Reset pointer */
  const handleResetRotation = () => {
    sound.play('click');
    setRotationIdx(0);
    toast.info('Reset rotation pointer to initial slot.');
  };

  /* Reorder prompts */
  const moveUp = (index) => {
    if (index === 0) return;
    sound.play('click');
    setQueue(prev => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const moveDown = (index) => {
    if (index === queue.length - 1) return;
    sound.play('click');
    setQueue(prev => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  /* Add prompt */
  const handleAddPrompt = (e) => {
    e.preventDefault();
    if (!newPrompt.trim()) return;

    sound.play('success');
    const newItem = {
      id: genUniqueId(),
      label: newLabel.trim() || `Prompt #${queue.length + 1}`,
      prompt: newPrompt.trim(),
      enabled: true
    };

    setQueue(prev => [...prev, newItem]);
    setNewLabel('');
    setNewPrompt('');
    setShowAddForm(false);
    toast.bolt('✓ Prompt added to the queue rotation!');
  };

  /* Edit Prompt actions */
  const startEdit = (item) => {
    sound.play('click');
    setEditId(item.id);
    setEditLabel(item.label);
    setEditPrompt(item.prompt);
  };

  const handleSaveEdit = () => {
    if (!editPrompt.trim()) return;
    sound.play('success');
    setQueue(prev => prev.map(item => item.id === editId ? { ...item, label: editLabel.trim(), prompt: editPrompt.trim() } : item));
    setEditId(null);
    toast.bolt('✓ Updated queue prompt!');
  };

  /* Delete prompt */
  const handleDeletePrompt = (id) => {
    sound.play('click');
    setQueue(prev => prev.filter(item => item.id !== id));
    toast.info('Removed prompt from queue.');
  };

  /* Toggle prompt status */
  const handleToggleEnabled = (id) => {
    sound.play('click');
    setQueue(prev => prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  /* Quick Import preset template */
  const handleImportPreset = (preset) => {
    sound.play('success');
    const newItem = {
      id: genUniqueId(),
      label: preset.label,
      prompt: preset.prompt,
      enabled: true
    };
    setQueue(prev => [...prev, newItem]);
    toast.bolt(`✓ Imported "${preset.label}" template!`);
  };

  /* Mock LLM optimizer simulation */
  const handleOptimizePrompt = (type) => {
    sound.play('click');
    if (type === 'new') {
      if (!newPrompt.trim()) {
        toast.error('Write a raw prompt first before optimizing!');
        return;
      }
      setNewPrompt(prev => `${prev}\n\n[OPTIMIZED FOR AI FLEET: ensure production-ready modularity, zero linter warnings, persistent state parameters, and HSL scale glassmorphism overlays.]`);
    } else {
      if (!editPrompt.trim()) return;
      setEditPrompt(prev => `${prev}\n\n[OPTIMIZED FOR AI FLEET: ensure production-ready modularity, zero linter warnings, persistent state parameters, and HSL scale glassmorphism overlays.]`);
    }
    toast.bolt('✓ Evolved prompt constraints using local heuristic optimizer!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(34,211,238,0.03) 100%)',
        border: '1px solid rgba(167,139,250,0.15)', borderRadius: 16, padding: '24px 32px',
        position: 'relative', overflow: 'hidden', animation: 'fade-in 0.5s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
            display: 'flex', alignItems: 'center', justify: 'center', justifyContent: 'center', fontSize: 24
          }}>🔁</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, margin: 0 }}>
              AI Prompt Rotation Queue
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6e7191', fontSize: 13 }}>
              Configure a stack of modular prompt directives. The scheduler rotates and selects the next prompt sequentially on each scheduled fleet run.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Queue items', value: queue.length, sub: 'items registered', color: 'var(--purple)' },
          { label: 'Active in Rotation', value: enabledItems.length, sub: 'currently enabled', color: 'var(--teal)' },
          { label: 'Rotation Pointer', value: `#${enabledItems.length > 0 ? currentIdxPointer + 1 : 0}`, sub: `Index: ${rotationIdx}`, color: 'var(--gold)' },
          { label: 'Fleet Targets', value: accounts.length, sub: 'active profiles', color: 'var(--teal)' }
        ].map(kpi => (
          <Card key={kpi.label} style={{ borderTop: `2.5px solid ${kpi.color}` }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 4 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color, lineHeight: 1.1 }}>{kpi.value}</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Main split grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>

        {/* Left: Queue Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <SectionTitle color="var(--purple)">Prompts Rotation Stack</SectionTitle>
              <button
                className="btn btn-gold btn-xs"
                onClick={() => { sound.play('click'); setShowAddForm(!showAddForm); }}
                style={{ fontSize: 10, padding: '4px 10px' }}
              >
                {showAddForm ? '✕ Close Form' : '＋ Add Prompt directive'}
              </button>
            </div>

            {/* Quick Add form */}
            {showAddForm && (
              <form onSubmit={handleAddPrompt} style={{
                background: '#07070f', border: '1px solid rgba(255,255,255,0.05)',
                padding: 16, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>LABEL / NICKNAME</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    placeholder="e.g. UI Refactor, Linter sweep..."
                    style={{ padding: '8px 10px', fontSize: 11.5, background: 'var(--surface3)', color: '#fff', border: '1px solid var(--border)', borderRadius: 6 }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>PROMPT TEXT (MAX 4000 CHARACTERS)</label>
                    <span style={{ fontSize: 9.5, color: newPrompt.length > 3500 ? 'var(--red)' : 'var(--muted)' }}>
                      {newPrompt.length}/4000
                    </span>
                  </div>
                  <textarea
                    value={newPrompt}
                    onChange={e => setNewPrompt(e.target.value)}
                    placeholder="Enter full prompt directive..."
                    maxLength={4000}
                    style={{ padding: '10px', fontSize: 12, background: 'var(--surface3)', color: '#fff', border: '1px solid var(--border)', borderRadius: 6, minHeight: 90, resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost"
                    onClick={() => handleOptimizePrompt('new')}
                    style={{ border: '1px solid var(--border)', fontSize: 10 }}
                  >
                    🔮 AI Optimize
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gold btn-xs"
                    disabled={!newPrompt.trim()}
                    style={{ fontSize: 10, padding: '4px 14px' }}
                  >
                    ＋ Add to Queue
                  </button>
                </div>
              </form>
            )}

            {/* List stack */}
            {queue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 0', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 10 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>No prompts in the queue stack</div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>Add new directives or import presets below.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {queue.map((item, idx) => {
                  const isEdit = editId === item.id;
                  const itemIndexInEnabled = enabledItems.findIndex(q => q.id === item.id);
                  const isNextUp = item.enabled && itemIndexInEnabled === currentIdxPointer;

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: '#0c0c14',
                        border: isNextUp ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 10,
                        padding: '12px 16px',
                        opacity: item.enabled ? 1 : 0.45,
                        boxShadow: isNextUp ? '0 0 14px rgba(245,183,49,0.15)' : 'none',
                        transition: 'all 0.25s',
                        display: 'flex',
                        gap: 12
                      }}
                    >
                      {/* Reorder controls */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, flexShrink: 0 }}>
                        <button
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          style={{ background: 'none', border: 'none', color: '#dde0f0', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: 2, opacity: idx === 0 ? 0.2 : 0.6 }}
                        >▲</button>
                        <span style={{ fontSize: 10, fontWeight: 'bold', fontFamily: "'DM Mono', monospace", color: 'var(--muted)' }}>
                          {idx + 1}
                        </span>
                        <button
                          onClick={() => moveDown(idx)}
                          disabled={idx === queue.length - 1}
                          style={{ background: 'none', border: 'none', color: '#dde0f0', cursor: idx === queue.length - 1 ? 'not-allowed' : 'pointer', padding: 2, opacity: idx === queue.length - 1 ? 0.2 : 0.6 }}
                        >▼</button>
                      </div>

                      {/* Content panel */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {isEdit ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <input
                              type="text"
                              value={editLabel}
                              onChange={e => setEditLabel(e.target.value)}
                              placeholder="Label..."
                              style={{ padding: '6px 8px', fontSize: 11.5, background: 'var(--surface3)', color: '#fff', border: '1px solid var(--border)', borderRadius: 5 }}
                            />
                            <textarea
                              value={editPrompt}
                              onChange={e => setEditPrompt(e.target.value)}
                              style={{ padding: '8px', fontSize: 11.5, background: 'var(--surface3)', color: '#fff', border: '1px solid var(--border)', borderRadius: 5, minHeight: 60 }}
                            />
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                className="btn btn-xs btn-ghost"
                                onClick={() => handleOptimizePrompt('edit')}
                                style={{ border: '1px solid var(--border)', fontSize: 9.5 }}
                              >
                                🔮 AI Optimize
                              </button>
                              <button className="btn btn-gold btn-xs" onClick={handleSaveEdit} style={{ fontSize: 9.5, padding: '3px 10px' }}>
                                Save
                              </button>
                              <button className="btn btn-ghost btn-xs" onClick={() => setEditId(null)} style={{ fontSize: 9.5, padding: '3px 10px', border: '1px solid var(--border)' }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                                {item.label}
                              </span>
                              {isNextUp && (
                                <span style={{
                                  background: 'rgba(245,183,49,0.15)', color: 'var(--gold)',
                                  border: '1px solid rgba(245,183,49,0.3)', borderRadius: 4,
                                  fontSize: 8.5, fontWeight: 700, padding: '1px 5px',
                                  display: 'flex', alignItems: 'center', gap: 3
                                }}>
                                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                                  NEXT ROTATION TARGET
                                </span>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                              {item.prompt}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Side controls */}
                      {!isEdit && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, shrink: 0, flexShrink: 0 }}>
                          <Toggle
                            on={item.enabled}
                            onChange={() => handleToggleEnabled(item.id)}
                            color="var(--purple)"
                          />
                          <button
                            onClick={() => startEdit(item)}
                            title="Edit prompt"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 6, color: '#dde0f0', width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}
                          >✏️</button>
                          <button
                            onClick={() => handleDeletePrompt(item.id)}
                            title="Delete prompt"
                            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: 'var(--red)', width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}
                          >🗑️</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Rotation status dial & Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Rotation controls cockpit */}
          <Card>
            <SectionTitle color="var(--gold)">Rotation Engine Pointer</SectionTitle>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.4 }}>
              Manually advance the pointer position or reset the sequence loop.
            </p>

            <div style={{
              background: '#07070f', border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 16
            }}>
              {/* Dial visual */}
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                border: '3px dashed var(--gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(245,183,49,0.1)', position: 'relative'
              }}>
                <div style={{ fontSize: 24 }}>🔁</div>
                <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--gold)', fontWeight: 'bold', marginTop: 2 }}>
                  INDEX {rotationIdx}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff' }}>
                  Next Target Selection:
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--gold)', fontFamily: "'DM Mono', monospace", marginTop: 2, fontWeight: 'bold' }}>
                  {enabledItems.length > 0 ? `"${enabledItems[currentIdxPointer]?.label}"` : 'None (Daily default prompt will be used)'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-gold btn-sm"
                onClick={handleAdvanceRotation}
                disabled={enabledItems.length === 0}
                style={{ flex: 1.2, fontSize: 11, padding: '6px 0', justifyContent: 'center' }}
              >
                ⏩ Advance pointer
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleResetRotation}
                style={{ flex: 0.8, fontSize: 11, padding: '6px 0', border: '1px solid var(--border)', justifyContent: 'center' }}
              >
                ⟳ Reset
              </button>
            </div>
          </Card>

          {/* Quick Import Preset Library */}
          <Card>
            <SectionTitle color="var(--teal)">Templates Quick Import</SectionTitle>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.45 }}>
              Quick-load industry standard prompt engineering structures directly into your rotation stack:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PRESET_TEMPLATES.map(preset => (
                <div
                  key={preset.label}
                  onClick={() => handleImportPreset(preset)}
                  style={{
                    background: '#07070f', border: '1px solid rgba(255,255,255,0.04)',
                    padding: '10px 12px', borderRadius: 8, fontSize: 11.5, cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = '#07070f'; }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{preset.label}</span>
                    <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>{preset.prompt.slice(0, 48)}...</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--teal)' }}>＋</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
