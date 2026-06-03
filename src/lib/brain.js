import { bus, E } from './eventBus';
import { store } from './store';

class Brain {
  constructor() {
    this.iv = null;
    this.tickCount = 0;
    this.lastSnapshotTick = 0;
  }

  start(ms = 60000) {
    if (this.iv) {
      clearInterval(this.iv);
    }
    this.iv = setInterval(() => this.tick(), ms);
    // Run initial tick asynchronously
    setTimeout(() => this.tick(), 100);
  }

  stop() {
    if (this.iv) {
      clearInterval(this.iv);
      this.iv = null;
    }
  }

  tick() {
    this.tickCount++;
    try {
      this.checkCredits();
    } catch {
      // ignore
    }
    try {
      this.checkAgents();
    } catch {
      // ignore
    }
    try {
      this.checkSchedules();
    } catch {
      // ignore
    }
    try {
      this.updateHealth();
    } catch {
      // ignore
    }
    
    // Credit snapshots every 30 ticks
    if (this.tickCount - this.lastSnapshotTick >= 30) {
      try {
        store.snapshot();
        this.lastSnapshotTick = this.tickCount;
      } catch {
        // ignore
      }
    }
    
    bus.emit(E.TICK, { tick: this.tickCount, at: Date.now() });
  }

  checkCredits() {
    store.getAccounts().filter(a => !a.deletedAt).forEach(a => {
      const pct = a.maxCredits > 0 ? a.credits / a.maxCredits : 1;
      if (pct <= 0.05 && a.status !== 'exhausted') {
        store.updateAccount(a.id, { status: 'exhausted' });
        bus.emit(E.RELAY, { from: a });
        this._autoRelay(a);
      } else if (pct <= 0.2 && a.status === 'active') {
        store.updateAccount(a.id, { status: 'low' });
      }
    });
  }

  _autoRelay(exhaustedAccount) {
    const accounts = store.getAccounts().filter(a => !a.deletedAt);
    const next = accounts
      .filter(a => a.status === 'active' && a.credits > a.maxCredits * 0.4)
      .sort((a, b) => b.credits - a.credits)[0];
    if (!next) return;
    const entry = {
      from: exhaustedAccount.name,
      to: next.name,
      task: exhaustedAccount.currentTask || 'continued work',
      auto: true
    };
    store.addRelay(entry);
  }

  checkAgents() {
    const tasks = store.getTasks();
    const activeTask = tasks.find(t => t.status === 'running');
    
    if (activeTask) {
      const progress = (activeTask.progress || 0) + Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        store.updateTask(activeTask.id, { status: 'completed', progress: 100, completedAt: Date.now() });
      } else {
        store.updateTask(activeTask.id, { progress });
      }
    } else {
      const next = store.getNextPendingTask();
      if (next) {
        store.updateTask(next.id, { status: 'running', progress: 0, assignedAt: Date.now() });
      }
    }
  }

  checkSchedules() {
    let schedulesRaw = localStorage.getItem('agp_schedules');
    if (!schedulesRaw) {
      const defaultSchedules = [
        { id: 'sch-1', name: 'Daily SEO Campaign Run', prompt: 'Analyze site performance and build dynamic campaign triggers', intervalMs: 86400000, enabled: true, nextRunAt: Date.now() + 60000 },
        { id: 'sch-2', name: 'Weekly System Audit', prompt: 'Perform safety analysis on keys and models usage patterns', intervalMs: 604800000, enabled: true, nextRunAt: Date.now() + 120000 }
      ];
      localStorage.setItem('agp_schedules', JSON.stringify(defaultSchedules));
      schedulesRaw = JSON.stringify(defaultSchedules);
    }
    const schedules = JSON.parse(schedulesRaw);
    const now = Date.now();
    let changed = false;
    schedules.forEach(s => {
      if (!s.enabled || s.nextRunAt > now) return;
      store.addEvent('schedule:ran', { scheduleId: s.id, prompt: s.prompt });
      s.lastRunAt = now;
      s.nextRunAt = now + (s.intervalMs || 86400000);
      changed = true;
    });
    if (changed) {
      localStorage.setItem('agp_schedules', JSON.stringify(schedules));
    }
  }

  updateHealth() {
    const accounts = store.getAccounts().filter(a => !a.deletedAt);
    const ex = accounts.filter(a => a.status === 'exhausted').length;
    const lo = accounts.filter(a => a.status === 'low').length;
    const score = Math.max(0, Math.min(100, 100 - ex * 15 - lo * 5));
    localStorage.setItem('agp_health', JSON.stringify({ score, ex, lo, at: Date.now() }));
    bus.emit(E.HEALTH, { score });
  }
}

export const brain = new Brain();
export default brain;
