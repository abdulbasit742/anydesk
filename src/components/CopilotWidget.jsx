import { useState, useRef, useEffect } from 'react';
import { sound } from '../lib/soundEngine';

export default function CopilotWidget({ onNav, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Bolt Studio Pro workspace copilot. Type a message or click an action below to begin! ⚡', ts: new Date() }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    sound.play('click');
    
    const userMsg = { sender: 'user', text: trimmed, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let replyText = "I'm not sure how to process that command. Type `/help` for a list of active shortcodes.";
      const query = trimmed.toLowerCase();

      // Check navigation commands
      if (query.startsWith('/nav ') || query.startsWith('/go ')) {
        const targetPage = query.substring(5).trim().replace(/\s+/g, '');
        onNav(targetPage);
        replyText = `Navigating to ${targetPage.toUpperCase()} page! 🚀`;
        sound.play('success');
      }
      else if (query.includes('ping') || query.includes('latency') || query.includes('health')) {
        replyText = "Sweeping platform endpoints: 🔑 Vault exchange validated. Latency is green (Avg 32ms). 🟢";
        sound.play('success');
      }
      else if (query.includes('pin') || query.includes('sidebar') || query.includes('drag')) {
        replyText = "To pin a page, click the 📌 pin badge on hover in the sidebar. You can drag and drop items inside sections to reorganize your custom view! 🛠️";
        sound.play('pin');
      }
      else if (query.includes('help') || query === '/help') {
        replyText = "Available commands:\n• `/nav [page]` — Go to any workspace page\n• `ping` — Check accounts latency health\n• `pin` — Learn workspace customization\n• `optimize` — Enhance prompt constraints";
        sound.play('click');
      }
      else if (query.includes('optimize') || query.includes('refine')) {
        replyText = "Opening AI Optimizer console... You can paste your prompt text in the Sandbox to inspect performance metrics directly.";
        onNav('optimizer');
        sound.play('success');
      }
      else {
        replyText = `Understood. Active context: Page is ${currentPage}. Let me know if you'd like to check platform latencies or navigate to another page!`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: replyText, ts: new Date() }]);
    }, 800);
  };

  const handleSuggestion = (txt) => {
    handleSend(txt);
  };

  return (
    <div style={{ position: 'fixed', bottom: 42, right: 24, zIndex: 9999, fontFamily: '"DM Mono", monospace' }}>
      
      {/* Floating trigger Bubble */}
      <button
        onClick={() => {
          sound.play('click');
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => sound.play('hover')}
        style={{
          width: 50, height: 50, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--teal, #2dd4bf), #0284c7)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', fontSize: 22, cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(45, 212, 191, 0.3), 0 0 15px var(--teal, #2dd4bf)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
          animation: !isOpen ? 'copilotPulse 3s infinite' : 'none',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1.05)'}
        title="Open Workspace Copilot Chat"
      >
        🤖
      </button>

      {/* Chat Window Popup */}
      {isOpen && (
        <div style={{
          position: 'absolute', bottom: 62, right: 0, width: 340, height: 420,
          background: 'rgba(14, 14, 22, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 20px rgba(45, 212, 191, 0.08)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'slideInUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            background: 'linear-gradient(90deg, rgba(45, 212, 191, 0.1), rgba(0,0,0,0))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🤖</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>STUDIO COPILOT</div>
                <div style={{ fontSize: 8.5, color: 'var(--teal, #2dd4bf)', fontWeight: 700 }}>ONLINE & SYNCED</div>
              </div>
            </div>
            <button
              onClick={() => { sound.play('click'); setIsOpen(false); }}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16 }}
            >×</button>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? 'rgba(45, 212, 191, 0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${m.sender === 'user' ? 'rgba(45, 212, 191, 0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 12,
                  padding: '8px 12px',
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: m.sender === 'user' ? '#fff' : '#d0d0e0',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Quick Action Chips */}
          <div style={{
            padding: '4px 12px', display: 'flex', gap: 5, overflowX: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8, paddingTop: 8
          }}>
            {[
              { label: '📡 Ping Handshake', txt: 'ping' },
              { label: '📌 Sidebar Help', txt: 'pin help' },
              { label: '⚡ Run Optimizer', txt: 'optimize' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(chip.txt)}
                style={{
                  padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.03)', color: '#94a3b8', fontSize: 9.5,
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal, #2dd4bf)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            style={{
              padding: 10, borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', gap: 6, background: '#0a0a0f'
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask copilot or type command..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                color: '#fff', fontSize: 11.5, padding: '7px 10px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--teal, #2dd4bf)', border: 'none', borderRadius: 8,
                color: '#000', fontWeight: 800, padding: '0 12px', fontSize: 11,
                cursor: 'pointer',
              }}
            >
              SEND
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes copilotPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(45, 212, 191, 0.3), 0 0 15px var(--teal, #2dd4bf); }
          50% { transform: scale(1.05); box-shadow: 0 8px 32px rgba(45, 212, 191, 0.5), 0 0 25px var(--teal, #2dd4bf); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
