import { useState, useEffect } from 'react';

const AGENTS = [
  { id: 'claude', name: 'Claude', color: '#f4a261', icon: '🤖' },
  { id: 'gpt', name: 'GPT-4', color: '#10b981', icon: '🧠' },
  { id: 'gemini', name: 'Gemini', color: '#6366f1', icon: '✨' },
];

export default function AgentFloatPanel() {
  const [expanded, setExpanded] = useState(false);
  const [activeAgent, setActiveAgent] = useState('claude');
  const [taskCount, setTaskCount] = useState(0);
  const [visible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaskCount(prev => (prev + 1) % 100);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const agent = AGENTS.find(a => a.id === activeAgent);

  return (
    <div style={{
      position: 'fixed',
      bottom: 52,
      right: 20,
      zIndex: 9000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8,
    }}>
      {expanded && (
        <div style={{
          background: 'rgba(15,15,25,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '12px 14px',
          backdropFilter: 'blur(20px)',
          width: 220,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Active Agents
          </div>
          {AGENTS.map(a => (
            <div
              key={a.id}
              onClick={() => setActiveAgent(a.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 8px',
                borderRadius: 8,
                cursor: 'pointer',
                background: activeAgent === a.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                marginBottom: 4,
              }}
            >
              <span>{a.icon}</span>
              <span style={{ fontSize: 12, color: activeAgent === a.id ? '#fff' : 'rgba(255,255,255,0.5)' }}>{a.name}</span>
              <div style={{
                marginLeft: 'auto',
                width: 6, height: 6,
                borderRadius: '50%',
                background: activeAgent === a.id ? '#10b981' : 'rgba(255,255,255,0.2)',
                boxShadow: activeAgent === a.id ? '0 0 6px #10b981' : 'none',
              }} />
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8, paddingTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            {taskCount} tasks completed this session
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${agent.color}, ${agent.color}99)`,
          border: 'none',
          cursor: 'pointer',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px ${agent.color}44`,
          animation: 'pulse 3s ease-in-out infinite',
          position: 'relative',
        }}
        title="Agent Panel"
      >
        {agent.icon}
        <div style={{
          position: 'absolute',
          top: -2, right: -2,
          width: 12, height: 12,
          borderRadius: '50%',
          background: '#10b981',
          border: '2px solid #0a0a12',
          fontSize: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
        }}>
          ✓
        </div>
      </button>
    </div>
  );
}
