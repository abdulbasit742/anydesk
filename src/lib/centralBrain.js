import { bus, EVENTS } from './eventBus';
import { stateManager } from './stateManager';

class CentralBrain {
  constructor() {
    this.interval = null;
    this.tickCount = 0;
    this.lastSnapshotTick = 0;
    this.lastHandoffTick = 0;
  }
  
  start(ms = 60000) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => this.tick(), ms);
    // Run initial tick asynchronously to let standard initialization complete
    setTimeout(() => this.tick(), 100);
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  tick() {
    this.tickCount++;
    try { this.checkCredits(); } catch (e) { console.error('credit check failed', e); }
    try { this.checkAgents(); } catch (e) { console.error('agent check failed', e); }
    try { this.checkSchedules(); } catch (e) { console.error('schedule check failed', e); }
    try { this.updateHealth(); } catch (e) { console.error('health check failed', e); }
    
    if (this.tickCount - this.lastSnapshotTick >= 30) {
      stateManager.snapshotCredits();
      this.lastSnapshotTick = this.tickCount;
    }
    bus.emit(EVENTS.SYSTEM_TICK, { tick: this.tickCount, time: Date.now() });
  }
  
  checkCredits() {
    const accounts = stateManager.getAccounts().filter(a => !a.deletedAt);
    accounts.forEach(account => {
      const pct = account.credits / account.maxCredits;
      if (pct <= 0.05 && account.status !== 'exhausted') {
        stateManager.updateAccount(account.id, { status: 'exhausted' });
        bus.emit(EVENTS.ACCOUNT_EXHAUSTED, account);
        this.triggerAutoRelay(account);
      } else if (pct <= 0.2 && account.status === 'active') {
        stateManager.updateAccount(account.id, { status: 'low' });
        bus.emit(EVENTS.ACCOUNT_LOW, account);
      }
    });
  }
  
  triggerAutoRelay(exhaustedAccount) {
    const accounts = stateManager.getAccounts().filter(a => !a.deletedAt);
    const next = accounts
      .filter(a => a.status === 'active' && a.credits > a.maxCredits * 0.4)
      .sort((a, b) => b.credits - a.credits)[0];
    if (!next) return;
    const entry = {
      from: exhaustedAccount.id,
      to: next.id,
      task: exhaustedAccount.currentTask || 'continued work',
      auto: true
    };
    stateManager.addRelayEntry(entry);
  }
  
  checkAgents() {
    const tasks = stateManager.getTasks();
    const activeTask = tasks.find(t => t.status === 'running');
    
    if (activeTask) {
      const progress = (activeTask.progress || 0) + Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        stateManager.updateTask(activeTask.id, { status: 'completed', progress: 100, completedAt: Date.now() });
      } else {
        stateManager.updateTask(activeTask.id, { progress });
      }
    } else {
      const next = stateManager.getNextPendingTask();
      if (next) {
        stateManager.updateTask(next.id, { status: 'running', progress: 0, assignedAt: Date.now() });
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
      stateManager.addEvent('schedule:ran', { scheduleId: s.id, prompt: s.prompt });
      bus.emit(EVENTS.SCHEDULE_RAN, s);
      s.lastRunAt = now;
      s.nextRunAt = now + (s.intervalMs || 86400000);
      changed = true;
    });
    if (changed) {
      localStorage.setItem('agp_schedules', JSON.stringify(schedules));
    }
  }
  
  updateHealth() {
    const accounts = stateManager.getAccounts().filter(a => !a.deletedAt);
    const exhausted = accounts.filter(a => a.status === 'exhausted').length;
    const low = accounts.filter(a => a.status === 'low').length;
    const active = accounts.filter(a => a.status === 'active').length;
    let score = 100 - (exhausted * 15) - (low * 5);
    if (accounts.length === 0) score = 0;
    score = Math.max(0, Math.min(100, score));
    const health = { score, exhausted, low, active, checkedAt: Date.now() };
    localStorage.setItem('agp_health', JSON.stringify(health));
    bus.emit(EVENTS.HEALTH_UPDATED, health);
  }
}

export const brain = new CentralBrain();
