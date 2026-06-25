import { bus, E } from './eventBus'
import { store } from './store'

class Brain {
  constructor() {
    this.iv = null
    this.ticks = 0
    this.lastSnap = 0
    this.lastHandoff = 0
    this.lastDigest = 0
    this.errors = {}
    this.maxErrors = 3
    this.paused = false
    this.tickMs = 60000
    this.automations = {
      relay: true,
      scheduler: true,
      taskAssign: true,
      healthCheck: true,
      creditSnap: true,
      workflowTrigger: true,
    }
    this._lastTickAt = null
  }

  start(ms = 60000) {
    this.tickMs = ms
    if (this.iv) clearInterval(this.iv)
    this.iv = setInterval(() => { if (!this.paused) this.tick() }, ms)
    this.tick()
    console.log('[Brain] Started — tick every', ms / 1000, 's')
  }

  stop() {
    if (this.iv) {
      clearInterval(this.iv)
      this.iv = null
    }
    console.log('[Brain] Stopped')
  }

  pause(durationMs) {
    this.paused = true
    setTimeout(() => { this.paused = false }, durationMs || 300000)
    store.addEvent('brain:paused', { duration: durationMs })
  }

  resume() {
    this.paused = false
    store.addEvent('brain:resumed', {})
  }

  forceTick() {
    this.tick()
  }

  setInterval(ms) {
    this.stop()
    this.start(ms)
  }

  setAutomation(key, enabled) {
    this.automations[key] = enabled
    store.set('brain_automations', this.automations)
    store.addEvent('brain:automation_changed', { key, enabled })
  }

  getStatus() {
    const health = JSON.parse(localStorage.getItem('agp_health') || '{"score":100}')
    const accounts = store.getActiveAccounts()
    return {
      running: !!this.iv,
      paused: this.paused,
      ticks: this.ticks,
      tickMs: this.tickMs,
      lastTick: this._lastTickAt,
      health: health.score,
      accounts: accounts.length,
      active: accounts.filter(a => a.status === 'active').length,
      low: accounts.filter(a => a.status === 'low').length,
      exhausted: accounts.filter(a => a.status === 'exhausted').length,
      automations: this.automations,
      errors: this.errors,
    }
  }

  tick() {
    this.ticks++
    this._lastTickAt = Date.now()

    if (this.automations.relay) this._safe('credits', () => this._checkCredits())
    if (this.automations.scheduler) this._safe('schedules', () => this._checkSchedules())
    if (this.automations.taskAssign) this._safe('tasks', () => this._assignTasks())
    if (this.automations.healthCheck) this._safe('health', () => this._updateHealth())
    if (this.automations.workflowTrigger) this._safe('workflows', () => this._checkWorkflowTriggers())

    if (this.automations.creditSnap && this.ticks - this.lastSnap >= 30) {
      store.snapshot()
      this.lastSnap = this.ticks
    }

    if (this.ticks - this.lastHandoff >= 60) {
      this._buildHandoff()
      this.lastHandoff = this.ticks
    }

    bus.emit(E.TICK, { n: this.ticks, at: Date.now(), status: this.getStatus() })
  }

  _safe(key, fn) {
    try {
      fn()
      if (this.errors[key]) delete this.errors[key]
    } catch (e) {
      this.errors[key] = (this.errors[key] || 0) + 1
      if (this.errors[key] >= this.maxErrors) {
        this.automations[key + '_disabled'] = true
        store.addEvent('brain:automation_error', { key, count: this.errors[key] })
      }
    }
  }

  _checkCredits() {
    store.getActiveAccounts().forEach(acc => {
      const pct = acc.maxCredits > 0 ? acc.credits / acc.maxCredits : 1
      const threshold = acc.threshold || store.get('relay_threshold', 0.2)

      if (pct <= 0.02 && acc.status !== 'exhausted') {
        store.updateAccount(acc.id, { status: 'exhausted' })
        store.addEvent('account:exhausted', { name: acc.name, credits: acc.credits })
        bus.emit(E.ACCOUNT, { action: 'exhausted', account: acc })
        if (this.automations.relay) this._relay(acc)
        this._notifyLow(acc.name, 0)
      } else if (pct <= threshold && acc.status === 'active') {
        store.updateAccount(acc.id, { status: 'low' })
        store.addEvent('account:low', { name: acc.name, pct: Math.round(pct * 100) })
        bus.emit(E.ACCOUNT, { action: 'low', account: acc })
        this._notifyLow(acc.name, Math.round(pct * 100))
      } else if (pct > threshold && acc.status === 'low') {
        store.updateAccount(acc.id, { status: 'active' })
        store.addEvent('account:restored', { name: acc.name })
      }
    })
  }

  _relay(from) {
    const accounts = store.getActiveAccounts()
    const threshold = store.get('relay_threshold', 0.2)
    const next = accounts
      .filter(a => a.id !== from.id && a.status === 'active' && (a.maxCredits > 0 ? a.credits / a.maxCredits : 1) > threshold * 2)
      .sort((a, b) => b.credits - a.credits)[0]

    if (!next) {
      store.addEvent('relay:no_target', { from: from.name })
      bus.emit('system:halted', { reason: 'all_accounts_exhausted' })
      return
    }

    store.addRelay({ from: from.id, fromName: from.name, to: next.id, toName: next.name, task: from.currentTask || 'active work', auto: true, credits: from.credits })
    store.updateAccount(next.id, { currentTask: from.currentTask })
    store.addEvent('relay:auto', { from: from.name, to: next.name })
    bus.emit(E.RELAY, { from: from.name, to: next.name, auto: true })

    const sessions = store.getSessions().filter(s => s.status === 'active' && s.currentPlatform === from.platform)
    sessions.forEach(s => store.shiftSessionPlatform(s.id, next.platform, 'credits_exhausted'))
  }

  _notifyLow(name, pct) {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('AgentFlow ⚠️', { body: pct === 0 ? `${name} credits exhausted — relay triggered` : `${name} credits at ${pct}%` })
    }
    window.dispatchEvent(new CustomEvent('agp:toast', { detail: { message: pct === 0 ? `🔴 ${name} exhausted — relay triggered` : `⚠️ ${name} at ${pct}%`, type: pct === 0 ? 'error' : 'warning', duration: 5000 } }))
  }

  _checkSchedules() {
    const schedules = store.getSchedules()
    const now = Date.now()
    let changed = false

    schedules.forEach(s => {
      if (!s.enabled || s.nextRunAt > now) return
      store.addEvent('schedule:ran', { id: s.id, name: s.name, prompt: s.prompt?.slice(0, 50) })
      bus.emit(E.SCHEDULE, s)
      s.lastRunAt = now
      s.runCount = (s.runCount || 0) + 1
      s.nextRunAt = now + (s.intervalMs || 86400000)
      changed = true
      window.dispatchEvent(new CustomEvent('agp:toast', { detail: { message: `✅ Schedule ran: ${s.name}`, type: 'info', duration: 3000 } }))
    })

    if (changed) {
      store.saveSchedules ? store.saveSchedules(schedules) : localStorage.setItem('agp_schedules', JSON.stringify(schedules))
    }
  }

  _assignTasks() {
    const tasks = store.getTasks()
    const activeTasks = tasks.filter(t => t.status === 'in_progress')

    // Simulate progression for running tasks
    activeTasks.forEach(task => {
      const progress = (task.progress || 0) + Math.floor(Math.random() * 15) + 5
      if (progress >= 100) {
        store.updateTask(task.id, { status: 'completed', progress: 100, completedAt: Date.now() })
        store.addEvent('task:completed', { title: task.title, id: task.id })

        // Free the assigned account's task slot
        if (task.assignedTo) {
          store.updateAccount(task.assignedTo, { currentTask: null })
          store.incrementTaskCount(task.assignedTo)
        }
      } else {
        store.updateTask(task.id, { progress })
      }
    })

    // Assign new tasks if slots are available
    const pending = store.getPendingTasks()
    if (pending.length === 0) return

    const accounts = store.getActiveAccounts().filter(a => a.status === 'active' && !a.currentTask)
    if (accounts.length === 0) return

    // Match top pending task to best active account
    const task = pending[0]
    const acc = accounts.sort((a, b) => b.credits - a.credits)[0]

    store.assignTask(task.id, acc.id)
    store.updateTask(task.id, { status: 'in_progress', progress: 0 })
    store.addEvent('task:started', { title: task.title, assignedTo: acc.name })
  }

  _updateHealth() {
    const accounts = store.getActiveAccounts()
    const ex = accounts.filter(a => a.status === 'exhausted').length
    const lo = accounts.filter(a => a.status === 'low').length
    const score = Math.max(0, Math.min(100, 100 - ex * 15 - lo * 5))

    localStorage.setItem('agp_health', JSON.stringify({
      score,
      ex,
      lo,
      active: accounts.filter(a => a.status === 'active').length,
      at: Date.now()
    }))

    bus.emit(E.HEALTH, { score })
  }

  _checkWorkflowTriggers() {
    const workflows = store.getWorkflows()
    const activeRuns = store.getWorkflowRuns().filter(r => r.status === 'running')

    // Simulate step progress for workflows
    activeRuns.forEach(run => {
      const steps = run.steps || []
      const currentStepIdx = steps.findIndex(s => s.status === 'running' || s.status === 'pending')
      if (currentStepIdx >= 0) {
        const step = steps[currentStepIdx]
        if (step.status === 'pending') {
          step.status = 'running'
          step.startedAt = Date.now()
        } else {
          // Finish the step
          step.status = 'completed'
          step.completedAt = Date.now()
          store.addEvent('workflow:step_completed', { workflowId: run.workflowId, stepName: step.name })
        }
        localStorage.setItem('agp_wf_runs', JSON.stringify(
          store.getWorkflowRuns().map(r => r.id === run.id ? { ...run, steps } : r)
        ))
      } else {
        // Complete the workflow run
        run.status = 'completed'
        run.completedAt = Date.now()
        localStorage.setItem('agp_wf_runs', JSON.stringify(
          store.getWorkflowRuns().map(r => r.id === run.id ? { ...run, status: 'completed', completedAt: Date.now() } : r)
        ))
        store.addEvent('workflow:completed', { workflowId: run.workflowId })
      }
    })
  }

  _buildHandoff() {
    const accounts = store.getActiveAccounts()
    const lowCount = accounts.filter(a => a.status === 'low').length
    if (lowCount > 0) {
      store.addEvent('brain:advisory', {
        message: `${lowCount} accounts have low credit margins. Check handoff configurations.`,
        suggestedAction: 'Link auxiliary providers'
      })
    }
  }
}

export const brain = new Brain()
export default brain
