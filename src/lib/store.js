import { bus, E } from './eventBus';

const KEY = k => 'agp_' + k;

export const store = {
  // ACCOUNTS
  getAccounts: () => {
    try {
      const data = localStorage.getItem(KEY('accounts'));
      let accountsList = [];
      if (!data) {
        accountsList = [
          { id: 'acc-1', name: 'Anthropic Claude-3.5 API', platform: 'Anthropic', credits: 780, maxCredits: 1000, status: 'active', createdAt: Date.now() - 86400000 * 5 },
          { id: 'acc-2', name: 'OpenAI GPT-4o Hub', platform: 'OpenAI', credits: 450, maxCredits: 1000, status: 'active', createdAt: Date.now() - 86400000 * 4 },
          { id: 'acc-3', name: 'Gemini Flash Pipeline', platform: 'Google', credits: 35, maxCredits: 1000, status: 'active', createdAt: Date.now() - 86400000 * 3 },
          { id: 'acc-4', name: 'Llama 3.1 Fleet Provider', platform: 'Meta', credits: 890, maxCredits: 1000, status: 'active', createdAt: Date.now() - 86400000 * 2 }
        ];
        localStorage.setItem(KEY('accounts'), JSON.stringify(accountsList));
      } else {
        accountsList = JSON.parse(data);
      }
      return accountsList.map(a => {
        const credits = a.credits !== undefined ? a.credits : (a.creditBalance !== undefined ? a.creditBalance : 1000);
        const maxCredits = a.maxCredits !== undefined ? a.maxCredits : (a.creditLimit !== undefined ? a.creditLimit : 1000);
        return {
          ...a,
          credits,
          creditBalance: credits,
          maxCredits,
          creditLimit: maxCredits
        };
      });
    } catch {
      return [];
    }
  },
  
  saveAccounts: (list) => {
    localStorage.setItem(KEY('accounts'), JSON.stringify(list));
    bus.emit(E.STATE);
  },
  
  addAccount: (data) => {
    const list = store.getAccounts();
    const credits = data.credits !== undefined ? Number(data.credits) : (data.creditBalance !== undefined ? Number(data.creditBalance) : 1000);
    const maxCredits = data.maxCredits !== undefined ? Number(data.maxCredits) : (data.creditLimit !== undefined ? Number(data.creditLimit) : 1000);
    const newAccount = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'acc-' + Math.random().toString(36).substring(2, 11),
      createdAt: Date.now(),
      status: 'active',
      ...data,
      credits,
      creditBalance: credits,
      maxCredits,
      creditLimit: maxCredits
    };
    list.push(newAccount);
    store.saveAccounts(list);
    store.addEvent('account:created', { accountId: newAccount.id, name: newAccount.name });
    return newAccount;
  },
  
  updateAccount: (id, patch) => {
    const list = store.getAccounts();
    let updatedAccount = null;
    const newList = list.map(a => {
      if (a.id === id) {
        const merged = { ...a, ...patch };
        const credits = merged.credits !== undefined ? Number(merged.credits) : (merged.creditBalance !== undefined ? Number(merged.creditBalance) : 1000);
        const maxCredits = merged.maxCredits !== undefined ? Number(merged.maxCredits) : (merged.creditLimit !== undefined ? Number(merged.creditLimit) : 1000);
        updatedAccount = {
          ...merged,
          credits,
          creditBalance: credits,
          maxCredits,
          creditLimit: maxCredits
        };
        return updatedAccount;
      }
      return a;
    });
    if (updatedAccount) {
      store.saveAccounts(newList);
      bus.emit(E.ACCOUNT, updatedAccount);
    }
    return updatedAccount;
  },
  
  deleteAccount: (id) => {
    store.updateAccount(id, { deletedAt: Date.now() });
  },

  restoreAccount: (id) => {
    const list = store.getAccounts();
    let restoredAccount = null;
    const newList = list.map(a => {
      if (a.id === id) {
        const rest = { ...a };
        delete rest.deletedAt;
        restoredAccount = rest;
        return restoredAccount;
      }
      return a;
    });
    if (restoredAccount) {
      store.saveAccounts(newList);
      store.addEvent('account:restored', { accountId: id, name: restoredAccount.name });
    }
    return restoredAccount;
  },

  // TASKS
  getTasks: () => {
    try {
      const data = localStorage.getItem(KEY('tasks'));
      if (!data) {
        const initial = [
          { id: 'task-1', name: 'Optimize Prompt Vectors for Email Agent', priority: 'P1', status: 'pending', createdAt: Date.now() - 3600000 },
          { id: 'task-2', name: 'Clean stale cache blocks in observability store', priority: 'P2', status: 'pending', createdAt: Date.now() - 7200000 },
          { id: 'task-3', name: 'Deploy security tokens to credential vault', priority: 'P3', status: 'completed', createdAt: Date.now() - 10800000, completedAt: Date.now() - 5400000 }
        ];
        localStorage.setItem(KEY('tasks'), JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },
  
  saveTasks: (list) => {
    localStorage.setItem(KEY('tasks'), JSON.stringify(list));
    bus.emit(E.STATE);
  },
  
  addTask: (data) => {
    const list = store.getTasks();
    const newTask = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'task-' + Math.random().toString(36).substring(2, 11),
      name: data.name || 'Unnamed Task',
      priority: data.priority || 'P2',
      status: 'pending',
      createdAt: Date.now(),
    };
    list.push(newTask);
    store.saveTasks(list);
    store.addEvent('task:assigned', { taskId: newTask.id, name: newTask.name });
    return newTask;
  },
  
  updateTask: (id, patch) => {
    const list = store.getTasks();
    let updatedTask = null;
    const newList = list.map(t => {
      if (t.id === id) {
        updatedTask = { ...t, ...patch };
        return updatedTask;
      }
      return t;
    });
    if (updatedTask) {
      store.saveTasks(newList);
      if (patch.status === 'completed') {
        store.addEvent('task:completed', { taskId: id, name: updatedTask.name });
      }
    }
    return updatedTask;
  },

  getNextPendingTask: () => {
    const list = store.getTasks();
    const pending = list.filter(t => t.status === 'pending');
    if (pending.length === 0) return null;
    
    const priorityMap = { P1: 3, P2: 2, P3: 1 };
    return pending.sort((a, b) => {
      const prioA = priorityMap[a.priority] || 0;
      const prioB = priorityMap[b.priority] || 0;
      if (prioB !== prioA) {
        return prioB - prioA;
      }
      return a.createdAt - b.createdAt;
    })[0];
  },

  // EVENTS LOG
  addEvent: (type, data) => {
    try {
      const evs = JSON.parse(localStorage.getItem(KEY('events')) || '[]');
      evs.unshift({ type, data, at: Date.now() });
      localStorage.setItem(KEY('events'), JSON.stringify(evs.slice(0, 500)));
      bus.emit(E.STATE);
    } catch {
      // ignore
    }
  },
  getEvents: (n = 50) => {
    try {
      return JSON.parse(localStorage.getItem(KEY('events')) || '[]').slice(0, n);
    } catch {
      return [];
    }
  },
  
  // RELAY LOG
  addRelay: (entry) => {
    try {
      const log = JSON.parse(localStorage.getItem(KEY('relay')) || '[]');
      log.unshift({ ...entry, at: Date.now() });
      localStorage.setItem(KEY('relay'), JSON.stringify(log.slice(0, 200)));
      bus.emit(E.STATE);
    } catch {
      // ignore
    }
  },
  getRelayLog: () => {
    try {
      return JSON.parse(localStorage.getItem(KEY('relay')) || '[]');
    } catch {
      return [];
    }
  },
  
  // CREDIT SNAPSHOTS
  snapshot: () => {
    try {
      const list = store.getAccounts().filter(a => !a.deletedAt);
      const snaps = JSON.parse(localStorage.getItem(KEY('snapshots')) || '[]');
      const timestamp = Date.now();
      list.forEach(a => {
        snaps.push({
          accountId: a.id,
          credits: a.credits,
          timestamp
        });
      });
      localStorage.setItem(KEY('snapshots'), JSON.stringify(snaps.slice(-1000)));
      store.addEvent('credit:snapshot', { count: list.length });
    } catch {
      // ignore
    }
  },
  
  getCreditSnapshots: () => {
    try {
      return JSON.parse(localStorage.getItem(KEY('snapshots')) || '[]');
    } catch {
      return [];
    }
  },
  
  getCreditHistory: (accountId) => {
    const snapshots = store.getCreditSnapshots();
    return snapshots
      .filter(s => s.accountId === accountId)
      .slice(-30);
  },
  
  getBurnRate: (accountId) => {
    const history = store.getCreditHistory(accountId);
    if (history.length < 2) return 0;
    
    const first = history[0];
    const last = history[history.length - 1];
    const timeDiffMs = last.timestamp - first.timestamp;
    if (timeDiffMs <= 0) return 0;
    
    const creditDiff = first.credits - last.credits;
    if (creditDiff <= 0) return 0;
    
    const msInDay = 86400000;
    const days = timeDiffMs / msInDay;
    return days > 0 ? (creditDiff / days) : 0;
  },

  // SETTINGS
  get: (key, fallback) => {
    try {
      const settings = JSON.parse(localStorage.getItem(KEY('settings')) || '{}');
      return settings[key] !== undefined ? settings[key] : fallback;
    } catch {
      return fallback;
    }
  },
  
  set: (key, value) => {
    try {
      const settings = JSON.parse(localStorage.getItem(KEY('settings')) || '{}');
      settings[key] = value;
      localStorage.setItem(KEY('settings'), JSON.stringify(settings));
      bus.emit(E.STATE);
    } catch {
      // ignore
    }
  },

  // COMPATIBILITY ALIASES FOR LEGACY STATEMANAGER CALLS
  addRelayEntry: (entry) => store.addRelay(entry),
  snapshotCredits: () => store.snapshot()
};
