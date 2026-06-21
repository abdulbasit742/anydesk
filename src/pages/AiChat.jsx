import { useState, useEffect, useRef } from 'react'
import { store } from '../lib/store'
import { bus, E } from '../lib/eventBus'
import { callPlatform } from '../lib/apis'

const MODELS = [
  { id: 'claude', label: 'Claude 3.5 Haiku', color: '#a78bfa', ctx: '200K' },
  { id: 'chatgpt', label: 'GPT-4o Mini', color: '#10b981', ctx: '128K' },
  { id: 'gemini', label: 'Gemini 1.5 Flash', color: '#22d3ee', ctx: '1M' },
  { id: 'mistral', label: 'Mistral Small', color: '#f97316', ctx: '32K' },
]

const SUGGESTED = [
  'Explain the difference between REST and GraphQL',
  'Write a Python script to scrape and parse HTML',
  'How do I optimize React re-renders?',
  'Generate a Tailwind CSS landing page',
]

const COMMANDS = ['/clear', '/export', '/summarize', '/translate', '/explain', '/retry', '/help']

const V = {
  gold: '#f5b731', teal: '#22d3ee', purple: '#a78bfa',
  surface: '#0e0e16', surface2: '#16161e', surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)', muted: '#6e7191',
  text: '#e4e4ed', red: '#ef4444', green: '#22c55e',
}

function Avatar({ role }) {
  if (role === 'user') return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${V.gold}, #e0a020)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000', flexShrink: 0 }}>U</div>
  )
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${V.teal}, ${V.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>✨</div>
  )
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div style={{ margin: '10px 0', borderRadius: 10, overflow: 'hidden', border: `1px solid ${V.border}` }}>
      <div style={{ background: V.surface3, padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${V.border}` }}>
        <span style={{ fontSize: 11, color: V.teal, fontFamily: 'DM Mono, monospace' }}>{lang || 'code'}</span>
        <button onClick={copy} style={{ background: 'none', border: 'none', color: copied ? V.green : V.muted, cursor: 'pointer', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{copied ? '✓ Copied' : '⎘ Copy'}</button>
      </div>
      <pre style={{ background: V.surface, margin: 0, padding: '14px 16px', fontSize: 12.5, fontFamily: 'DM Mono, monospace', overflowX: 'auto', lineHeight: 1.65, color: V.teal }}>{code}</pre>
    </div>
  )
}

function MessageContent({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g)
  return (
    <div style={{ fontSize: 13.5, lineHeight: 1.7, color: V.text }}>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.slice(3, -3).split('\n')
          const lang = lines[0]
          const code = lines.slice(1).join('\n')
          return <CodeBlock key={i} code={code} lang={lang} />
        }
        return (
          <span key={i} dangerouslySetInnerHTML={{ __html: part
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e4e4ed;font-weight:700">$1</strong>')
            .replace(/`(.*?)`/g, `<code style="font-family:DM Mono,monospace;background:rgba(255,255,255,0.07);padding:1px 6px;border-radius:4px;font-size:12px;color:${V.teal}">$1</code>`)
            .replace(/\n/g, '<br/>')
          }} />
        )
      })}
    </div>
  )
}

export default function AiChat() {
  const [sessions, setSessions] = useState(() => store.getSessions())
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const list = store.getSessions()
    return list.length > 0 ? list[0].id : null
  })
  const [input, setInput] = useState('')
  const [model, setModel] = useState(MODELS[0])
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [showContext, setShowContext] = useState(true)
  const [convSearch, setConvSearch] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [topP, setTopP] = useState(0.9)
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful, expert AI assistant specialized in software development, UI/UX design, and modern web technologies.')
  const [cmdSuggestions, setCmdSuggestions] = useState([])
  const [toast, setToast] = useState('')

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const activeSession = sessions.find(s => s.id === activeSessionId)
  const messages = activeSession ? activeSession.messages : []

  useEffect(() => {
    const refresh = () => {
      const list = store.getSessions()
      setSessions(list)
      if (list.length > 0 && !activeSessionId) {
        setActiveSessionId(list[0].id)
      }
    }
    bus.on(E.STATE, refresh)
    return () => bus.off(E.STATE, refresh)
  }, [activeSessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200) }

  const handleInputChange = (e) => {
    const val = e.target.value
    setInput(val)
    if (val.startsWith('/')) {
      const q = val.toLowerCase()
      setCmdSuggestions(COMMANDS.filter(c => c.startsWith(q)))
    } else {
      setCmdSuggestions([])
    }
  }

  const handleCommand = (cmd) => {
    setInput('')
    setCmdSuggestions([])
    if (cmd === '/clear') {
      if (activeSessionId) {
        store.clearSessionMessages(activeSessionId)
        setSessions(store.getSessions())
        showToast('Conversation cleared')
      }
    } else if (cmd === '/export') {
      const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n')
      const blob = new Blob([text], { type: 'text/markdown' })
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'chat.md'; a.click()
      showToast('Exported as Markdown')
    } else {
      showToast(`Command ${cmd} executed`)
    }
  }

  const handleNewChat = () => {
    const fresh = store.createSession('New Conversation', model.id)
    setActiveSessionId(fresh.id)
    showToast('New chat started')
  }

  const sendMessage = async () => {
    if (!input.trim() || thinking) return
    if (input.startsWith('/')) { handleCommand(input.trim()); return }

    let currentSessionId = activeSessionId
    if (!currentSessionId) {
      const fresh = store.createSession('New Conversation', model.id)
      currentSessionId = fresh.id
      setActiveSessionId(fresh.id)
    }

    const textInput = input.trim()
    setInput('')
    setCmdSuggestions([])

    // Write user message to the store session
    store.addMessage(currentSessionId, { role: 'user', content: textInput })
    setSessions(store.getSessions())
    setThinking(true)

    try {
      // Find an active account matching the platform if configured
      const activeAccount = store.getActiveAccounts().find(a => a.platform === model.id) || { platform: model.id }

      const res = await callPlatform(textInput, activeAccount)

      // Write assistant response
      store.addMessage(currentSessionId, { role: 'assistant', content: res.text })

      // Deduct credits if it's a real API call
      if (!res.manual && activeAccount.id) {
        const tokens = Math.ceil((textInput.length + (res.text || '').length) / 4)
        const newCredits = Math.max(0, (activeAccount.credits || 100) - (tokens * 0.0001))
        store.updateCredits(activeAccount.id, parseFloat(newCredits.toFixed(4)))
      }
    } catch (e) {
      store.addMessage(currentSessionId, { role: 'assistant', content: `[Error: ${e.message}]` })
    } finally {
      setThinking(false)
      setSessions(store.getSessions())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(convSearch.toLowerCase()) ||
    s.messages.some(m => m.content?.toLowerCase().includes(convSearch.toLowerCase()))
  )

  const activeModel = MODELS.find(m => m.id === model.id) || MODELS[0]
  const totalTokens = messages.reduce((acc, m) => acc + Math.floor((m.content?.length || 0) / 4), 0)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: V.surface, overflow: 'hidden', fontFamily: 'Syne, sans-serif' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px)} to { opacity:1; transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to { transform:rotate(360deg)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .msg-anim { animation: fadeIn 0.25s ease; }
      `}</style>

      {/* Toast popup */}
      {toast && (
        <div style={{ position:'fixed', bottom:50, left:'50%', transform:'translateX(-50%)', background:'rgba(22,22,30,0.97)', border:`1px solid ${V.gold}44`, borderRadius:10, padding:'9px 20px', color:V.gold, fontSize:13, zIndex:9999, animation:'toastIn 0.25s ease', whiteSpace:'nowrap', boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
          {toast}
        </div>
      )}

      {/* LEFT: Conversation Sidebar */}
      <div style={{ width: 240, background: V.surface2, borderRight: `1px solid ${V.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '14px 12px 10px' }}>
          <button onClick={handleNewChat} style={{ width: '100%', padding: '9px 0', borderRadius: 9, border: `1px solid ${V.gold}44`, background: `linear-gradient(135deg, ${V.gold}18, ${V.gold}08)`, color: V.gold, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${V.gold}30, ${V.gold}15)`}
            onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${V.gold}18, ${V.gold}08)`}>
            <span style={{ fontSize: 16 }}>+</span> New Chat
          </button>
          <input value={convSearch} onChange={e => setConvSearch(e.target.value)} placeholder="Search chats…" style={{ width: '100%', marginTop: 10, background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 7, padding: '7px 10px', color: V.text, fontSize: 12, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Mono, monospace' }}
            onFocus={e => e.target.style.borderColor = `${V.gold}55`} onBlur={e => e.target.style.borderColor = V.border} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 6px 10px' }}>
          <div style={{ fontSize: 10, color: V.muted, textTransform: 'uppercase', letterSpacing: 1, padding: '8px 8px 4px', fontWeight: 700 }}>Chats History</div>
          {filteredSessions.map(conv => {
            const m = MODELS.find(x => x.id === conv.currentPlatform) || MODELS[0]
            return (
              <div key={conv.id} onClick={() => setActiveSessionId(conv.id)}
                style={{ padding: '9px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: activeSessionId === conv.id ? `${V.gold}12` : 'transparent', border: `1px solid ${activeSessionId === conv.id ? V.gold + '30' : 'transparent'}`, transition: 'all 0.15s', position: 'relative' }}
                onMouseEnter={e => { if (activeSessionId !== conv.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (activeSessionId !== conv.id) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ fontSize: 12.5, color: activeSessionId === conv.id ? V.text : '#b0b0c8', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{conv.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 9.5, color: m.color, background: `${m.color}18`, padding: '1px 6px', borderRadius: 4, border: `1px solid ${m.color}33` }}>{m.label.split(' ')[0]}</span>
                  <span style={{ fontSize: 10, color: V.muted }}>{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CENTER: Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Chat Topbar */}
        <div style={{ height: 52, borderBottom: `1px solid ${V.border}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12, background: V.surface2, flexShrink: 0 }}>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: V.text }}>
            {activeSession ? activeSession.title : 'New Chat'}
          </div>

          {/* Model selector */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowModelMenu(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 8, border: `1px solid ${activeModel.color}44`, background: `${activeModel.color}12`, color: activeModel.color, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: activeModel.color, flexShrink: 0 }} />
              {activeModel.label}
              <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
            </button>
            {showModelMenu && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 200, background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10, overflow: 'hidden', zIndex: 100, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
                {MODELS.map(m => (
                  <div key={m.id} onClick={() => { setModel(m); setShowModelMenu(false); showToast(`Switched to ${m.label}`); }}
                    style={{ padding: '9px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, background: model.id === m.id ? `${m.color}12` : 'transparent', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = model.id === m.id ? `${m.color}12` : 'transparent'}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, color: V.text, fontWeight: 600 }}>{m.label}</div>
                      <div style={{ fontSize: 10, color: V.muted }}>{m.ctx} context</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ fontSize: 11, color: V.muted, fontFamily: 'DM Mono, monospace', background: V.surface3, padding: '4px 10px', borderRadius: 6, border: `1px solid ${V.border}` }}>
            {totalTokens.toLocaleString()} tokens
          </div>

          <button onClick={() => setShowContext(s => !s)} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${V.border}`, background: showContext ? `${V.purple}15` : V.surface3, color: showContext ? V.purple : V.muted, cursor: 'pointer', fontSize: 12 }}>
            ⚙ Context
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {messages.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `radial-gradient(circle, ${V.gold}30, ${V.teal}15, transparent)`, border: `2px solid ${V.gold}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 20, animation: 'pulse 3s infinite' }}>✨</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: V.text, margin: '0 0 8px' }}>Start a conversation</h2>
              <p style={{ color: V.muted, fontSize: 14, margin: '0 0 28px' }}>Ask anything — code, design, strategy, or analysis</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 500 }}>
                {SUGGESTED.map((s, i) => (
                  <button key={i} onClick={() => setInput(s)} style={{ padding: '8px 14px', borderRadius: 20, border: `1px solid ${V.border}`, background: V.surface2, color: V.muted, cursor: 'pointer', fontSize: 12.5, transition: 'all 0.15s', fontFamily: 'Syne, sans-serif' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = V.gold + '55'; e.currentTarget.style.color = V.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = V.border; e.currentTarget.style.color = V.muted; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="msg-anim" style={{ display: 'flex', gap: 12, marginBottom: 20, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <Avatar role={msg.role} />
                <div style={{ maxWidth: '72%', minWidth: 0 }}>
                  <div style={{ padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', background: msg.role === 'user' ? `linear-gradient(135deg, ${V.gold}20, ${V.gold}10)` : V.surface3, border: `1px solid ${msg.role === 'user' ? V.gold + '30' : V.border}` }}>
                    <MessageContent content={msg.content} />
                  </div>
                  <div style={{ fontSize: 10.5, color: V.muted, marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left', fontFamily: 'DM Mono, monospace' }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))
          )}

          {thinking && (
            <div className="msg-anim" style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
              <Avatar role="assistant" />
              <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: V.surface3, border: `1px solid ${V.border}` }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: V.teal, animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '14px 20px 18px', borderTop: `1px solid ${V.border}`, background: V.surface2, flexShrink: 0 }}>
          {cmdSuggestions.length > 0 && (
            <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cmdSuggestions.map(cmd => (
                <button key={cmd} onClick={() => handleCommand(cmd)} style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${V.teal}44`, background: `${V.teal}10`, color: V.teal, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>{cmd}</button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea ref={textareaRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown}
              placeholder="Message (Enter to send, Shift+Enter for newline, type / for commands)…"
              rows={1} style={{ flex: 1, background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 12, padding: '12px 16px', color: V.text, fontSize: 13.5, resize: 'none', outline: 'none', fontFamily: 'Syne, sans-serif', maxHeight: 140, overflowY: 'auto', transition: 'border-color 0.2s', lineHeight: 1.5 }}
              onFocus={e => e.target.style.borderColor = `${V.gold}55`} onBlur={e => e.target.style.borderColor = V.border} />
            <button onClick={sendMessage} disabled={!input.trim() || thinking}
              style={{ width: 44, height: 44, borderRadius: 12, border: 'none', background: input.trim() && !thinking ? `linear-gradient(135deg, ${V.gold}, #e0a020)` : V.surface3, color: input.trim() && !thinking ? '#000' : V.muted, cursor: input.trim() && !thinking ? 'pointer' : 'default', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}>
              {thinking ? <span style={{ animation: 'spin 1s linear infinite', display: 'block', fontSize: 14 }}>⟳</span> : '➤'}
            </button>
          </div>
          <div style={{ fontSize: 10.5, color: V.muted, marginTop: 7, textAlign: 'center' }}>
            Model: <span style={{ color: activeModel.color }}>{activeModel.label}</span> · Context: {activeModel.ctx} · Type <span style={{ color: V.gold }}>/</span> for commands
          </div>
        </div>
      </div>

      {/* RIGHT: Context Panel */}
      {showContext && (
        <div style={{ width: 272, background: V.surface2, borderLeft: `1px solid ${V.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${V.border}`, fontSize: 13, fontWeight: 700, color: V.text }}>⚙ Context & Settings</div>

          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* System prompt */}
            <div>
              <label style={{ fontSize: 11, color: V.muted, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6, fontWeight: 700 }}>System Prompt</label>
              <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={5}
                style={{ width: '100%', background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, padding: '9px 10px', color: V.text, fontSize: 11.5, resize: 'vertical', outline: 'none', fontFamily: 'DM Mono, monospace', lineHeight: 1.6, boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = `${V.purple}55`} onBlur={e => e.target.style.borderColor = V.border} />
            </div>

            {[
              { label: 'Temperature', value: temperature, set: setTemperature, min: 0, max: 2, step: 0.1, color: V.gold },
              { label: `Max Tokens: ${maxTokens}`, value: maxTokens, set: setMaxTokens, min: 100, max: 8000, step: 100, color: V.teal },
              { label: `Top-P: ${topP}`, value: topP, set: setTopP, min: 0, max: 1, step: 0.05, color: V.purple },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <label style={{ fontSize: 11.5, color: V.muted, fontWeight: 600 }}>{s.label}</label>
                  <span style={{ fontSize: 11, color: s.color, fontFamily: 'DM Mono, monospace' }}>{typeof s.value === 'number' && s.value < 100 ? s.value.toFixed(s.step < 0.1 ? 2 : 1) : s.value}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.set(Number(e.target.value))}
                  style={{ width: '100%', accentColor: s.color, cursor: 'pointer' }} />
              </div>
            ))}

            {/* Token usage */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontSize: 11.5, color: V.muted, fontWeight: 600 }}>Token Usage</label>
                <span style={{ fontSize: 11, color: V.gold, fontFamily: 'DM Mono, monospace' }}>{totalTokens}/{activeModel.ctx}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: V.surface3, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${V.gold}, ${V.teal})`, width: `${Math.min(100, (totalTokens / 4096) * 100)}%`, transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* Presets */}
            <div>
              <label style={{ fontSize: 11, color: V.muted, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8, fontWeight: 700 }}>Presets</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['🎨 Creative', 1.3, 4096, 0.95], ['⚖ Balanced', 0.7, 2048, 0.9], ['🎯 Precise', 0.2, 1024, 0.7]].map(([label, temp, tok, tp]) => (
                  <button key={label} onClick={() => { setTemperature(temp); setMaxTokens(tok); setTopP(tp); showToast(`${label} preset applied`); }}
                    style={{ flex: 1, padding: '6px 0', borderRadius: 7, border: `1px solid ${V.border}`, background: V.surface3, color: V.muted, cursor: 'pointer', fontSize: 10.5, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = V.gold + '55'; e.currentTarget.style.color = V.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = V.border; e.currentTarget.style.color = V.muted; }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => showToast('Preset saved')} style={{ padding: '8px 0', borderRadius: 8, border: `1px solid ${V.purple}44`, background: `${V.purple}12`, color: V.purple, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              💾 Save as Preset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
