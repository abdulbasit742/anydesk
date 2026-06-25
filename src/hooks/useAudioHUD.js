// useAudioHUD.js — Glassmorphic sci-fi audio feedback for critical events
import { useRef, useCallback, useEffect } from 'react';

const SOUNDS = {
  handshake: { freq: 880, duration: 0.08, type: 'sine', gain: 0.15 },
  alert: { freq: 440, duration: 0.2, type: 'square', gain: 0.1 },
  success: { freq: 1046, duration: 0.12, type: 'sine', gain: 0.12 },
  error: { freq: 220, duration: 0.25, type: 'sawtooth', gain: 0.08 },
  tick: { freq: 660, duration: 0.04, type: 'sine', gain: 0.06 },
};

export function useAudioHUD(enabled = true) {
  const ctxRef = useRef(null);

  useEffect(() => {
    return () => ctxRef.current?.close();
  }, []);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback((soundName) => {
    if (!enabled) return;
    const sound = SOUNDS[soundName];
    if (!sound) return;

    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = sound.type;
      osc.frequency.setValueAtTime(sound.freq, ctx.currentTime);

      gain.gain.setValueAtTime(sound.gain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + sound.duration);
    } catch {
      // Silently ignore audio errors
    }
  }, [enabled, getCtx]);

  return {
    playHandshake: () => play('handshake'),
    playAlert: () => play('alert'),
    playSuccess: () => play('success'),
    playError: () => play('error'),
    playTick: () => play('tick'),
    play,
  };
}
