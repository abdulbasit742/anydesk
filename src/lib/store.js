import { bus, E } from './eventBus.js'

const K = k => 'agp_' + k

// ─── UNDO SYSTEM BUFFER ───────────────────────────────────────────────────────
const undoQueue = []
const pushUndo = (action, undoFn, ttlMs = 30000) => {
  const entry = { id: crypto.randomUUID(), action, undoFn, expiresAt: Date.now() + ttlMs }
  undoQueue.unshift(entry)
  if (undoQueue.length > 10) undoQueue.pop()
  setTimeout(() => {
    const i = undoQueue.findIndex(u => u.id === entry.id)
    if (i >= 0) undoQueue.splice(i, 1)
  }, ttlMs)
}

const canUndo = () => undoQueue.length > 0

const undo = () => {
  const entry = undoQueue.shift()
  if (entry) {
    entry.undoFn()
    store.addEvent('undo:executed', { action: entry.action })
  }
}

// ─── EVENTS LOG SYSTEM ────────────────────────────────────────────────────────
const addEvent = (type, data) => {
  try {
    const evs = JSON.parse(localStorage.getItem(K('events')) || '[]')
    const severity = getSeverity(type)
    evs.unshift({ id: crypto.randomUUID(), type, data, at: Date.now(), severity })
    localStorage.setItem(K('events'), JSON.stringify(evs.slice(0, 1000)))
  } catch (e) {
    console.error('[Store] Failed to write system event:', e)
  }
}

const getSeverity = (type) => {
  const t = type.toLowerCase()
  if (t.includes('exhausted') || t.includes('error') || t.includes('critical') || t.includes('fail')) return 'error'
  if (t.includes('low') || t.includes('warning') || t.includes('limit')) return 'warning'
  if (t.includes('relay') || t.includes('complete') || t.includes('success') || t.includes('added')) return 'success'
  return 'info'
}

const getEvents = (n = 50, filter = null) => {
  try {
    const evs = JSON.parse(localStorage.getItem(K('events')) || '[]')
    if (!filter) return evs.slice(0, n)
    const lowerFilter = filter.toLowerCase()
    return evs.filter(e => e.type.toLowerCase().includes(lowerFilter) || e.severity === filter).slice(0, n)
  } catch {
    return []
  }
}

const clearEvents = () => {
  localStorage.removeItem(K('events'))
  store.addEvent('events:cleared', {})
}

// ─── ACCOUNTS DATABASE ────────────────────────────────────────────────────────
const getAccounts = () => {
  try {
    const raw = localStorage.getItem(K('accounts'))
    if (!raw) {
      const initial = [
        { id: 'claude-1', name: 'Claude Pro Production', platform: 'claude', credits: 82, maxCredits: 100, status: 'active', createdAt: Date.now(), autoRelay: true, threshold: 0.2, color: '#60a5fa' },
        { id: 'chatgpt-1', name: 'ChatGPT Enterprise API', platform: 'chatgpt', credits: 45, maxCredits: 100, status: 'active', createdAt: Date.now(), autoRelay: true, threshold: 0.2, color: '#10b981' },
        { id: 'gemini-1', name: 'Gemini Flash Pipeline', platform: 'gemini', credits: 18, maxCredits: 100, status: 'active', createdAt: Date.now(), autoRelay: true, threshold: 0.2, color: '#a78bfa' },
        { id: 'mistral-1', name: 'Mistral Small Dev', platform: 'mistral', credits: 5, maxCredits: 100, status: 'low', createdAt: Date.now(), autoRelay: true, threshold: 0.2, color: '#f59e0b' }
      ]
      localStorage.setItem(K('accounts'), JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const saveAccounts = list => {
  try {
    localStorage.setItem(K('accounts'), JSON.stringify(list))
    bus.emit(E.STATE, { action: 'accounts:saved' })
  } catch (e) {
    console.error('[Store] Save accounts failed:', e)
  }
}

const addAccount = (data) => {
  const acc = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: 'active',
    credits: data.credits !== undefined ? Number(data.credits) : 100,
    maxCredits: data.maxCredits !== undefined ? Number(data.maxCredits) : 100,
    platform: data.platform || 'claude',
    name: data.name || 'New Account',
    email: data.email || '',
    apiKey: data.apiKey || '',
    model: data.model || '',
    tags: data.tags || [],
    notes: data.notes || '',
    currentTask: null,
    tasksCompleted: 0,
    relaysTriggered: 0,
    lastActivity: Date.now(),
    threshold: data.threshold !== undefined ? Number(data.threshold) : 0.2,
    autoRelay: data.autoRelay !== false,
    color: data.color || '#60a5fa',
    avatar: data.avatar || '',
    ...data,
  }
  const list = getAccounts()
  list.push(acc)
  saveAccounts(list)
  addEvent('account:added', { name: acc.name, platform: acc.platform })
  bus.emit(E.ACCOUNT, { action: 'added', account: acc })
  return acc
}

const updateAccount = (id, patch) => {
  const list = getAccounts().map(a => a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a)
  saveAccounts(list)
  bus.emit(E.ACCOUNT, { action: 'updated', id, patch })
}

const deleteAccount = (id) => {
  const acc = getAccounts().find(a => a.id === id)
  if (!acc) return
  updateAccount(id, { deletedAt: Date.now(), status: 'deleted' })
  addEvent('account:deleted', { name: acc.name })
  pushUndo('delete_account', () => updateAccount(id, { deletedAt: null, status: 'active' }))
}

const restoreAccount = (id) => {
  updateAccount(id, { deletedAt: null, status: 'active' })
  const acc = getAccountById(id)
  if (acc) addEvent('account:restored', { name: acc.name })
}

const getActiveAccounts = () => getAccounts().filter(a => !a.deletedAt)

const getAccountById = (id) => getAccounts().find(a => a.id === id)

const getAccountsByPlatform = (platform) => getActiveAccounts().filter(a => a.platform?.toLowerCase() === platform.toLowerCase())

const updateCredits = (id, credits) => {
  const acc = getAccountById(id)
  if (!acc) return
  const maxCredits = acc.maxCredits || 100
  const pct = credits / maxCredits
  let status = acc.status
  if (pct <= 0.05) status = 'exhausted'
  else if (pct <= 0.2) status = 'low'
  else if (pct > 0.2 && acc.status !== 'paused') status = 'active'
  updateAccount(id, { credits, status, lastCreditUpdate: Date.now() })
}

const pauseAccount = (id) => {
  updateAccount(id, { status: 'paused' })
  addEvent('account:paused', { id })
}

const resumeAccount = (id) => {
  updateAccount(id, { status: 'active' })
  addEvent('account:resumed', { id })
}

const setCurrentTask = (id, task) => {
  updateAccount(id, { currentTask: task, lastActivity: Date.now() })
}

const incrementTaskCount = (id) => {
  const acc = getAccountById(id)
  if (acc) {
    updateAccount(id, { tasksCompleted: (acc.tasksCompleted || 0) + 1 })
  }
}

// ─── TASKS MANAGEMENT ─────────────────────────────────────────────────────────
const getTasks = () => {
  try {
    const raw = localStorage.getItem(K('tasks'))
    if (!raw) {
      const initial = [
        { id: 'task-1', title: 'Optimize Prompt Vectors for Email Agent', priority: 5, status: 'pending', createdAt: Date.now() - 3600000, description: 'Analyze performance bounds' },
        { id: 'task-2', title: 'Clean stale cache blocks in observability store', priority: 3, status: 'pending', createdAt: Date.now() - 7200000, description: 'Purge old traces' },
        { id: 'task-3', title: 'Deploy security tokens to credential vault', priority: 8, status: 'completed', createdAt: Date.now() - 10800000, completedAt: Date.now() - 5400000, description: 'Key rotation check' }
      ]
      localStorage.setItem(K('tasks'), JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const saveTasks = tasks => {
  try {
    localStorage.setItem(K('tasks'), JSON.stringify(tasks))
    bus.emit(E.STATE, { action: 'tasks:saved' })
  } catch (e) {
    console.error('[Store] Save tasks failed:', e)
  }
}

const addTask = (data) => {
  const task = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: 'pending',
    priority: data.priority !== undefined ? Number(data.priority) : 5,
    title: data.title || 'Untitled Task',
    description: data.description || '',
    assignedTo: data.assignedTo || null,
    platform: data.platform || null,
    prompt: data.prompt || '',
    tags: data.tags || [],
    deadline: data.deadline || null,
    estimatedMinutes: data.estimatedMinutes || null,
    completedAt: null,
    result: null,
    ...data,
  }
  const tasks = getTasks()
  tasks.push(task)
  saveTasks(tasks)
  bus.emit(E.TASK, { action: 'added', task })
  addEvent('task:added', { title: task.title, priority: task.priority })
  return task
}

const updateTask = (id, patch) => {
  const tasks = getTasks().map(t => t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t)
  saveTasks(tasks)
  bus.emit(E.TASK, { action: 'updated', id, patch })
}

const deleteTask = (id) => {
  const list = getTasks()
  const filtered = list.filter(t => t.id !== id)
  saveTasks(filtered)
  bus.emit(E.TASK, { action: 'deleted', id })
}

const completeTask = (id, result) => {
  updateTask(id, { status: 'completed', completedAt: Date.now(), result })
  addEvent('task:completed', { id })
}

const assignTask = (taskId, accountId) => {
  updateTask(taskId, { assignedTo: accountId, status: 'in_progress' })
  const task = getTasks().find(t => t.id === taskId)
  if (task) {
    setCurrentTask(accountId, task.title)
  }
  addEvent('task:assigned', { taskId, accountId })
}

const getPendingTasks = () => getTasks().filter(t => t.status === 'pending').sort((a, b) => b.priority - a.priority)

const getTasksByAccount = (accountId) => getTasks().filter(t => t.assignedTo === accountId)

const reorderTask = (id, newPriority) => updateTask(id, { priority: newPriority })

// ─── RELAY LOGS ───────────────────────────────────────────────────────────────
const getRelayLog = () => {
  try {
    return JSON.parse(localStorage.getItem(K('relay')) || '[]')
  } catch {
    return []
  }
}

const addRelay = (entry) => {
  const relay = {
    id: crypto.randomUUID(),
    at: Date.now(),
    fromId: entry.from,
    fromName: entry.fromName || 'Unknown',
    toId: entry.to,
    toName: entry.toName || 'Unknown',
    task: entry.task || 'active work',
    auto: entry.auto || false,
    reason: entry.reason || 'credits_low',
    creditsAtRelay: entry.credits || null,
  }
  const log = getRelayLog()
  log.unshift(relay)
  localStorage.setItem(K('relay'), JSON.stringify(log.slice(0, 500)))
  bus.emit(E.RELAY, relay)
  addEvent('relay:triggered', { from: relay.fromName, to: relay.toName, auto: relay.auto })
}

const getRelaysByAccount = (accountId) => getRelayLog().filter(r => r.fromId === accountId || r.toId === accountId)

const getRelayStats = () => {
  const log = getRelayLog()
  const dayMs = 86400000
  const today = log.filter(r => r.at > Date.now() - dayMs)
  const thisWeek = log.filter(r => r.at > Date.now() - (dayMs * 7))
  return { total: log.length, today: today.length, thisWeek: thisWeek.length, auto: log.filter(r => r.auto).length }
}

// ─── FLEET ENGINE LOGS ────────────────────────────────────────────────────────
const getFleetLog = () => {
  try {
    return JSON.parse(localStorage.getItem(K('fleet_log')) || '[]')
  } catch {
    return []
  }
}

const addFleetRun = (run) => {
  const log = getFleetLog()
  log.unshift({ ...run, id: crypto.randomUUID(), createdAt: Date.now() })
  localStorage.setItem(K('fleet_log'), JSON.stringify(log.slice(0, 200)))
  bus.emit(E.FLEET, run)
}

const updateFleetRun = (runId, patch) => {
  const log = getFleetLog().map(r => r.id === runId ? { ...r, ...patch } : r)
  localStorage.setItem(K('fleet_log'), JSON.stringify(log))
}

// ─── CREDIT HISTORIES & BURN RATES ────────────────────────────────────────────
const snapshot = () => {
  const accounts = getActiveAccounts()
  const snap = { at: Date.now(), data: accounts.map(a => ({ id: a.id, name: a.name, credits: a.credits, max: a.maxCredits, status: a.status })) }
  const hist = JSON.parse(localStorage.getItem(K('credit_hist')) || '[]')
  hist.unshift(snap)
  localStorage.setItem(K('credit_hist'), JSON.stringify(hist.slice(0, 2880)))
}

const getCreditHistory = (accountId, limit = 100) => {
  try {
    return JSON.parse(localStorage.getItem(K('credit_hist')) || '[]')
      .map(s => ({ at: s.at, credits: s.data.find(d => d.id === accountId)?.credits }))
      .filter(d => d.credits !== undefined)
      .slice(0, limit)
  } catch {
    return []
  }
}

const getBurnRate = (accountId) => {
  const hist = getCreditHistory(accountId, 48)
  if (hist.length < 2) return 0
  const oldest = hist[hist.length - 1]
  const newest = hist[0]
  const creditsDiff = Math.max(0, oldest.credits - newest.credits)
  const hoursDiff = (newest.at - oldest.at) / 3600000
  return hoursDiff > 0 ? creditsDiff / hoursDiff : 0
}

const getDaysUntilEmpty = (accountId) => {
  const acc = getAccountById(accountId)
  if (!acc) return null
  const burnRate = getBurnRate(accountId)
  if (burnRate <= 0) return null
  const hoursLeft = acc.credits / burnRate
  return Math.round(hoursLeft / 24)
}

const getCreditTrend = (accountId) => {
  const hist = getCreditHistory(accountId, 10)
  if (hist.length < 2) return 'stable'
  const recent = hist.slice(0, 3).reduce((a, b) => a + b.credits, 0) / 3
  const older = hist.slice(6, 9).reduce((a, b) => a + b.credits, 0) / 3
  if (recent < older * 0.8) return 'declining_fast'
  if (recent < older) return 'declining'
  if (recent > older) return 'improving'
  return 'stable'
}

// ─── SCHEDULES CRONS ──────────────────────────────────────────────────────────
const getSchedules = () => {
  try {
    const raw = localStorage.getItem(K('schedules'))
    if (!raw) {
      const initial = [
        { id: 'sch-1', name: 'Daily SEO Campaign Run', prompt: 'Analyze site performance bounds', intervalMs: 86400000, enabled: true, nextRunAt: Date.now() + 60000, runCount: 0, createdAt: Date.now() },
        { id: 'sch-2', name: 'Weekly System Audit', prompt: 'Verify key status and logs', intervalMs: 604800000, enabled: true, nextRunAt: Date.now() + 120000, runCount: 0, createdAt: Date.now() }
      ]
      localStorage.setItem(K('schedules'), JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const saveSchedules = s => {
  try {
    localStorage.setItem(K('schedules'), JSON.stringify(s))
  } catch (e) {
    console.error('[Store] Save schedules failed:', e)
  }
}

const addSchedule = (data) => {
  const schedule = {
    id: crypto.randomUUID(),
    name: data.name || 'New Schedule',
    prompt: data.prompt || '',
    accounts: data.accounts || [],
    enabled: data.enabled !== false,
    frequency: data.frequency || 'daily',
    intervalMs: data.intervalMs || 86400000,
    nextRunAt: data.nextRunAt || Date.now() + (data.intervalMs || 86400000),
    lastRunAt: null,
    runCount: 0,
    createdAt: Date.now(),
    tags: data.tags || [],
  }
  const schedules = getSchedules()
  schedules.push(schedule)
  saveSchedules(schedules)
  addEvent('schedule:created', { name: schedule.name })
  return schedule
}

const updateSchedule = (id, patch) => {
  const list = getSchedules().map(s => s.id === id ? { ...s, ...patch } : s)
  saveSchedules(list)
}

const deleteSchedule = (id) => {
  const list = getSchedules().filter(s => s.id !== id)
  saveSchedules(list)
}

const toggleSchedule = (id) => {
  const s = getSchedules().find(s => s.id === id)
  if (s) {
    updateSchedule(id, { enabled: !s.enabled })
  }
}

const getNextRun = (id) => {
  const s = getSchedules().find(s => s.id === id)
  if (!s || !s.nextRunAt) return null
  const diff = s.nextRunAt - Date.now()
  if (diff < 0) return 'Overdue'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// ─── WORKFLOW PIPELINES ───────────────────────────────────────────────────────
const getWorkflows = () => {
  try {
    return JSON.parse(localStorage.getItem(K('workflows')) || '[]')
  } catch {
    return []
  }
}

const saveWorkflow = (wf) => {
  const list = getWorkflows()
  const idx = list.findIndex(w => w.id === wf.id)
  if (idx >= 0) {
    list[idx] = { ...wf, updatedAt: Date.now() }
  } else {
    list.unshift({ ...wf, id: crypto.randomUUID(), createdAt: Date.now() })
  }
  localStorage.setItem(K('workflows'), JSON.stringify(list))
}

const deleteWorkflow = (id) => {
  const list = getWorkflows().filter(w => w.id !== id)
  localStorage.setItem(K('workflows'), JSON.stringify(list))
}

const getWorkflowRuns = (wfId) => {
  try {
    const runs = JSON.parse(localStorage.getItem(K('wf_runs')) || '[]')
    return wfId ? runs.filter(r => r.workflowId === wfId) : runs
  } catch {
    return []
  }
}

const addWorkflowRun = (run) => {
  const runs = JSON.parse(localStorage.getItem(K('wf_runs')) || '[]')
  runs.unshift({ ...run, id: crypto.randomUUID(), at: Date.now() })
  localStorage.setItem(K('wf_runs'), JSON.stringify(runs.slice(0, 500)))
}

// ─── CHAT SESSIONS ────────────────────────────────────────────────────────────
const getSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(K('sessions')) || '[]')
  } catch {
    return []
  }
}

const saveSessions = s => {
  try {
    localStorage.setItem(K('sessions'), JSON.stringify(s))
  } catch (e) {
    console.error('[Store] Save sessions failed:', e)
  }
}

const createSession = (title, platform) => {
  const session = {
    id: crypto.randomUUID(),
    title: title || 'New Chat',
    currentPlatform: platform || 'claude',
    platformHistory: [{ platform: platform || 'claude', startedAt: Date.now() }],
    messages: [],
    context: '',
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: [],
    totalTokens: 0,
  }
  const sessions = getSessions()
  sessions.unshift(session)
  saveSessions(sessions)
  return session
}

const addMessage = (sessionId, message) => {
  const sessions = getSessions()
  const session = sessions.find(s => s.id === sessionId)
  if (!session) return
  const msg = { id: crypto.randomUUID(), ...message, timestamp: Date.now() }
  session.messages.push(msg)
  session.updatedAt = Date.now()
  session.context = session.messages.slice(-8).map(m => `${m.role}: ${m.content}`).join('\n')
  saveSessions(sessions)
  return msg
}

const shiftSessionPlatform = (sessionId, newPlatform, reason) => {
  const sessions = getSessions()
  const session = sessions.find(s => s.id === sessionId)
  if (!session) return
  const old = session.currentPlatform
  session.currentPlatform = newPlatform
  session.platformHistory.push({ platform: newPlatform, startedAt: Date.now(), shiftedFrom: old, reason })
  session.messages.push({ id: crypto.randomUUID(), role: 'system', content: `[Shifted from ${old} to ${newPlatform}]`, timestamp: Date.now(), type: 'shift' })
  session.updatedAt = Date.now()
  saveSessions(sessions)
  addEvent('session:shifted', { from: old, to: newPlatform, reason })
  return session
}

const deleteSession = (id) => {
  const list = getSessions().filter(s => s.id !== id)
  saveSessions(list)
}

const searchSessions = (q) => {
  const lower = q.toLowerCase()
  return getSessions().filter(s => s.title.toLowerCase().includes(lower) || s.messages.some(m => m.content?.toLowerCase().includes(lower)))
}

const clearSessionMessages = (id) => {
  const sessions = getSessions()
  const session = sessions.find(s => s.id === id)
  if (session) {
    session.messages = []
    session.context = ''
    session.updatedAt = Date.now()
    saveSessions(sessions)
    bus.emit(E.STATE, { action: 'session:cleared', id })
  }
}

const getComparisonSessions = () => {
  try {
    const raw = localStorage.getItem(K('comparison_sessions'))
    if (!raw) {
      const initial = [
        { id: 'cs-1', prompt: "Debug this React bug: my useEffect is running...", models: ["gpt4o", "claude"], winner: "claude", time: "2 min ago", at: Date.now() - 120000 },
        { id: 'cs-2', prompt: "Write a SQL query for top customers...", models: ["gemini", "gpt4o", "llama"], winner: "gemini", time: "18 min ago", at: Date.now() - 1080000 },
        { id: 'cs-3', prompt: "Explain gradient descent in machine learning...", models: ["claude", "mistral"], winner: "claude", time: "1 hr ago", at: Date.now() - 3600000 },
        { id: 'cs-4', prompt: "Generate unit tests for email validator...", models: ["gpt4o", "deepseek"], winner: "gpt4o", time: "3 hr ago", at: Date.now() - 10800000 },
      ]
      localStorage.setItem(K('comparison_sessions'), JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const addComparisonSession = (promptText, models, winner) => {
  const list = getComparisonSessions()
  const newSession = {
    id: crypto.randomUUID(),
    prompt: promptText,
    models,
    winner,
    at: Date.now(),
    time: "just now"
  }
  list.unshift(newSession)
  localStorage.setItem(K('comparison_sessions'), JSON.stringify(list.slice(0, 50)))
  bus.emit(E.STATE, { action: 'comparison_sessions:added', session: newSession })
  return newSession
}

const clearComparisonSessions = () => {
  localStorage.removeItem(K('comparison_sessions'))
  bus.emit(E.STATE, { action: 'comparison_sessions:cleared' })
}

const getModelWins = () => {
  try {
    return JSON.parse(localStorage.getItem(K('model_wins')) || '{}')
  } catch {
    return {}
  }
}

const recordModelWin = (modelId) => {
  const wins = getModelWins()
  wins[modelId] = (wins[modelId] || 0) + 1
  localStorage.setItem(K('model_wins'), JSON.stringify(wins))
  bus.emit(E.STATE, { action: 'model_wins:updated', wins })
  return wins
}

const resetModelWins = () => {
  localStorage.removeItem(K('model_wins'))
  bus.emit(E.STATE, { action: 'model_wins:reset' })
}

// ─── SETTINGS GATE ────────────────────────────────────────────────────────────
const get = (key, def = null) => {
  try {
    const s = JSON.parse(localStorage.getItem(K('settings')) || '{}')
    return s[key] ?? def
  } catch {
    return def
  }
}

const set = (key, value) => {
  try {
    const s = JSON.parse(localStorage.getItem(K('settings')) || '{}')
    s[key] = value
    localStorage.setItem(K('settings'), JSON.stringify(s))
    bus.emit(E.STATE)
  } catch (e) {
    console.error('[Store] Write settings failed:', e)
  }
}

const getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(K('settings')) || '{}')
  } catch {
    return {}
  }
}

const resetSettings = () => {
  localStorage.removeItem(K('settings'))
  bus.emit(E.STATE)
}

// ─── TAGS REGISTRY ────────────────────────────────────────────────────────────
const getTags = () => {
  try {
    return JSON.parse(localStorage.getItem(K('tags')) || '[]')
  } catch {
    return []
  }
}

const addTag = (name, color) => {
  const tags = getTags()
  const tag = { id: crypto.randomUUID(), name, color: color || '#60a5fa', createdAt: Date.now() }
  tags.push(tag)
  localStorage.setItem(K('tags'), JSON.stringify(tags))
  return tag
}

const deleteTag = (id) => {
  const list = getTags().filter(t => t.id !== id)
  localStorage.setItem(K('tags'), JSON.stringify(list))
}

// ─── UTILITIES & METRICS ──────────────────────────────────────────────────────
const getStorageSize = () => {
  let total = 0
  Object.keys(localStorage).filter(k => k.startsWith('agp_')).forEach(k => {
    total += localStorage.getItem(k)?.length || 0
  })
  return (total / 1024).toFixed(1) + ' KB'
}

const getSystemStats = () => {
  const accounts = getActiveAccounts()
  const tasks = getTasks()
  const relays = getRelayLog()
  const events = getEvents(1000)
  return {
    accounts: { total: accounts.length, active: accounts.filter(a => a.status === 'active').length, low: accounts.filter(a => a.status === 'low').length, exhausted: accounts.filter(a => a.status === 'exhausted').length },
    tasks: { total: tasks.length, pending: tasks.filter(t => t.status === 'pending').length, completed: tasks.filter(t => t.status === 'completed').length, inProgress: tasks.filter(t => t.status === 'in_progress').length },
    relays: getRelayStats(),
    events: { total: events.length, errors: events.filter(e => e.severity === 'error').length, warnings: events.filter(e => e.severity === 'warning').length },
    storage: getStorageSize(),
    sessions: getSessions().length,
    schedules: getSchedules().filter(s => s.enabled).length,
    workflows: getWorkflows().filter(w => w.enabled).length,
  }
}

// ─── DATA COMPRESSION & RECOVERY ──────────────────────────────────────────────
const exportAll = () => JSON.stringify({
  version: '3.0',
  exportedAt: new Date().toISOString(),
  accounts: getAccounts(),
  tasks: getTasks(),
  schedules: getSchedules(),
  workflows: getWorkflows(),
  sessions: getSessions().slice(0, 20),
  tags: getTags(),
  relay: getRelayLog().slice(0, 100),
  events: getEvents(200),
  settings: getSettings(),
}, null, 2)

const importAll = (json) => {
  try {
    const data = JSON.parse(json)
    if (data.accounts) localStorage.setItem(K('accounts'), JSON.stringify(data.accounts))
    if (data.tasks) localStorage.setItem(K('tasks'), JSON.stringify(data.tasks))
    if (data.schedules) localStorage.setItem(K('schedules'), JSON.stringify(data.schedules))
    if (data.workflows) localStorage.setItem(K('workflows'), JSON.stringify(data.workflows))
    if (data.tags) localStorage.setItem(K('tags'), JSON.stringify(data.tags))
    if (data.settings) localStorage.setItem(K('settings'), JSON.stringify(data.settings))
    bus.emit(E.STATE, { action: 'imported' })
    addEvent('data:imported', { version: data.version })
    return { ok: true, accounts: data.accounts?.length, tasks: data.tasks?.length }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

const clearAll = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('agp_'))
  keys.forEach(k => localStorage.removeItem(k))
  bus.emit(E.STATE, { action: 'cleared' })
  addEvent('data:cleared', {})
}

// ─── REMOTE DESKTOP STORAGE ───────────────────────────────────────────────────
const getRemoteDeviceId = () => {
  let id = localStorage.getItem(K('remote_device_id'))
  if (!id) {
    id = localStorage.getItem('rf_device_id')
    if (!id) {
      id = 'RF-' + Math.floor(100000 + Math.random() * 900000)
    }
    localStorage.setItem(K('remote_device_id'), id)
  }
  return id
}

const saveRemoteDeviceId = (id) => {
  localStorage.setItem(K('remote_device_id'), id)
}

const getRemoteDeviceName = () => {
  return localStorage.getItem(K('remote_device_name')) || localStorage.getItem('rf_device_name') || 'Main Dashboard Host'
}

const saveRemoteDeviceName = (name) => {
  localStorage.setItem(K('remote_device_name'), name)
}

const getRecentSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(K('recent_sessions')) || localStorage.getItem('rf_recent_sessions') || '[]')
  } catch {
    return []
  }
}

const saveRecentSessions = (sessions) => {
  localStorage.setItem(K('recent_sessions'), JSON.stringify(sessions))
}

// ─── AUTH & PLAN TIER MANAGERS ────────────────────────────────────────────────
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(K('user')) || 'null')
  } catch {
    return null
  }
}

const setUser = (user) => {
  if (user) {
    localStorage.setItem(K('user'), JSON.stringify(user))
  } else {
    localStorage.removeItem(K('user'))
  }
  bus.emit(E.STATE, { action: 'user:updated', user })
}

const getPlan = () => {
  try {
    const rawStore = localStorage.getItem('bolt_studio_pro_v2')
    if (rawStore) {
      const parsed = JSON.parse(rawStore)
      if (parsed && parsed.plan) {
        return parsed.plan
      }
    }
  } catch (e) {}
  return localStorage.getItem(K('plan')) || 'free'
}

const setPlan = (plan) => {
  localStorage.setItem(K('plan'), plan)
  try {
    const rawStore = localStorage.getItem('bolt_studio_pro_v2')
    let storeObj = rawStore ? JSON.parse(rawStore) : {}
    storeObj.plan = plan
    localStorage.setItem('bolt_studio_pro_v2', JSON.stringify(storeObj))
  } catch (e) {}
  bus.emit(E.STATE, { action: 'plan:updated', plan })
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
}

// ─── FINAL EXPORT OBJECT ──────────────────────────────────────────────────────
export const store = {
  getAccounts, saveAccounts, addAccount, updateAccount, deleteAccount, restoreAccount,
  getActiveAccounts, getAccountById, getAccountsByPlatform, updateCredits,
  pauseAccount, resumeAccount, setCurrentTask, incrementTaskCount,
  getTasks, addTask, updateTask, deleteTask, completeTask, assignTask,
  getPendingTasks, getTasksByAccount, reorderTask,
  getRelayLog, addRelay, getRelaysByAccount, getRelayStats,
  getFleetLog, addFleetRun, updateFleetRun,
  addEvent, getEvents, clearEvents,
  snapshot, getCreditHistory, getBurnRate, getDaysUntilEmpty, getCreditTrend,
  getSchedules, addSchedule, updateSchedule, deleteSchedule, toggleSchedule, getNextRun,
  getWorkflows, saveWorkflow, deleteWorkflow, getWorkflowRuns, addWorkflowRun,
  getSessions, createSession, addMessage, shiftSessionPlatform, deleteSession, searchSessions, clearSessionMessages,
  getComparisonSessions, addComparisonSession, clearComparisonSessions, getModelWins, recordModelWin, resetModelWins,
  get, set, getSettings, resetSettings,
  getTags, addTag, deleteTag,
  pushUndo, canUndo, undo,
  exportAll, importAll, clearAll, getStorageSize, getSystemStats,
  getRemoteDeviceId, saveRemoteDeviceId, getRemoteDeviceName, saveRemoteDeviceName, getRecentSessions, saveRecentSessions,
  getUser, setUser, getPlan, setPlan,
}

