import { useEffect, useState } from 'react';
import { bus, EVENTS } from '../lib/eventBus';
import { stateManager } from '../lib/stateManager';
import { sound } from '../lib/soundEngine';

export default function SystemStatusBar({ onNav }) {
  const [health, setHealth] = useState(() => {
    try {
      const saved = localStorage.getItem('agp_health');
      return saved ? JSON.parse(saved) : { score: 100, exhausted: 0, low: 0, active: 4 };
    } catch {
      return { score: 100, exhausted: 0, low: 0, active: 4 };
    }
  });

  const [taskCount, setTaskCount] = useState(() => {
    return stateManager.getTasks().filter(t => t.status === 'pending' || t.status === 'running').length;
  });

  const [lastRelayText, setLastRelayText] = useState('No relays yet');

  const updateRelayTime = () => {
    const relays = stateManager.getRelayLog();
    if (relays.length === 0) {
      setLastRelayText('No relays');
      return;
    }
    const last = relays[relays.length - 1];
    const diffMs = Date.now() - last.triggeredAt;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) {
      setLastRelayText('Just now');
    } else if (diffMins < 60) {
      setLastRelayText(`${diffMins}m ago`);
    } else {
      const hours = Math.floor(diffMins / 60);
      setLastRelayText(`${hours}h ago`);
    }
  };

  useEffect(() => {
    const handleHealth = (newHealth) => {
      setHealth(newHealth);
    };

    const handleState = () => {
      setTaskCount(stateManager.getTasks().filter(t => t.status === 'pending' || t.status === 'running').length);
      updateRelayTime();
    };

    const handleTick = () => {
      updateRelayTime();
      try {
        const saved = localStorage.getItem('agp_health');
        if (saved) setHealth(JSON.parse(saved));
      } catch {
        // Ignore json parse exceptions
      }
    };

    bus.on(EVENTS.HEALTH_UPDATED, handleHealth);
    bus.on(EVENTS.STATE_CHANGED, handleState);
    bus.on(EVENTS.SYSTEM_TICK, handleTick);

    setTimeout(updateRelayTime, 0);

    return () => {
      bus.off(EVENTS.HEALTH_UPDATED, handleHealth);
      bus.off(EVENTS.STATE_CHANGED, handleState);
      bus.off(EVENTS.SYSTEM_TICK, handleTick);
    };
  }, []);

  const getHealthColor = (score) => {
    if (score > 70) return '#22d3ee';
    if (score > 40) return '#f5b731';
    return '#ef4444';
  };

  const scoreColor = getHealthColor(health.score);

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: 0,
      right: 0,
      zIndex: 7999,
      height: 32,
      background: 'rgba(14, 14, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      fontSize: '11px',
      fontFamily: 'DM Mono, monospace',
      color: '#e2e8f0',
    }}>
      <div 
        onClick={() => {
          sound.play('click');
          onNav('analytics');
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '2px 8px',
          borderRadius: '4px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: scoreColor,
          display: 'inline-block',
          animation: 'pulse 2s infinite',
          boxShadow: `0 0 8px ${scoreColor}`
        }} />
        <span>Health: <strong style={{ color: scoreColor }}>{health.score}</strong></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div 
          onClick={() => {
            sound.play('click');
            onNav('accounts');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: '4px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ color: '#22d3ee' }}>⚡</span>
          <span>{health.active || 0} Active</span>
        </div>

        {health.low > 0 && (
          <div 
            onClick={() => {
              sound.play('click');
              onNav('accounts');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(245, 183, 49, 0.1)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245, 183, 49, 0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(245, 183, 49, 0.1)'}
          >
            <span style={{ color: '#f5b731' }}>⚠</span>
            <span style={{ color: '#f5b731' }}>{health.low} Low</span>
          </div>
        )}

        {health.exhausted > 0 && (
          <div 
            onClick={() => {
              sound.play('click');
              onNav('accounts');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(239, 68, 68, 0.15)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
          >
            <span style={{ color: '#ef4444' }}>🚨</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{health.exhausted} Exhausted</span>
          </div>
        )}

        <div 
          onClick={() => {
            sound.play('click');
            onNav('promptqueue');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: '4px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ color: '#a78bfa' }}>📋</span>
          <span>{taskCount} Tasks</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)' }}>
        <span>🔄 Last relay:</span>
        <span style={{ color: 'var(--gold)' }}>{lastRelayText}</span>
      </div>
    </div>
  );
}
