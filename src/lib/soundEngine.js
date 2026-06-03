// Synthesized Sound Effects Engine using browser Web Audio API
// Built for premium UI feedback in Bolt Studio Pro

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    
    // Check if muted in localStorage
    const saved = localStorage.getItem('bsp_sound_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      console.warn("Web Audio API not supported in this browser.");
    }
  }

  setMuted(val) {
    this.muted = val;
    localStorage.setItem('bsp_sound_muted', String(val));
  }

  play(type) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Resume context if suspended (browser security policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      switch (type) {
        case 'hover':
          this.playHover();
          break;
        case 'click':
          this.playClick();
          break;
        case 'success':
          this.playSuccess();
          break;
        case 'warning':
          this.playWarning();
          break;
        case 'dispatch':
          this.playDispatch();
          break;
        case 'pin':
          this.playPin();
          break;
      }
    } catch {
      // Gracefully catch any Web Audio errors
    }
  }

  playHover() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playClick() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playSuccess() {
    const now = this.ctx.currentTime;
    
    // Play a C5-E5-G5 triad chime
    const playNote = (freq, delay, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0.0, now + delay);
      gain.gain.linearRampToValueAtTime(0.04, now + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    playNote(523.25, 0.0, 0.3); // C5
    playNote(659.25, 0.08, 0.3); // E5
    playNote(783.99, 0.16, 0.4); // G5
  }

  playWarning() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playDispatch() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.45);
    
    gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  playPin() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

export const sound = new SoundEngine();
