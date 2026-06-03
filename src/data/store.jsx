/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { MOCK_ACCOUNTS } from './mockAccounts';

const STORAGE_KEY = 'bolt_studio_pro_v2';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state) {
  const toSave = { ...state };
  delete toSave.activeWorkflowRun;
  if (toSave.prompts) {
    toSave.prompts = toSave.prompts.filter(p => p && p.id && !p.id.startsWith('tpl_'));
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

const DEFAULT_STATE = {
  accounts: MOCK_ACCOUNTS.map(a => ({
    ...a,
    status: 'active',
    creditBalance: a.credits !== undefined ? a.credits : 20,
  })),
  projects: [],
  workflows: [],
  prompts: [],
  deletedTemplateIds: [],
  broadcasts: [],
  optimizations: [],
  settings: { delay: 300 },
  activeWorkflowRun: null,
  user: null,
  plan: 'free',
};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  useEffect(() => {
    import('./promptsIndex')
      .then(m => {
        setTemplates(m.GENERATED_PROMPTS || []);
        setTemplatesLoading(false);
      })
      .catch(err => {
        console.error('Failed to load prompts index dynamically:', err);
        setTemplatesLoading(false);
      });
  }, []);

  const [state, setStateRaw] = useState(() => {
    const loaded = loadState();
    if (!loaded) return DEFAULT_STATE;
    return {
      accounts: loaded.accounts ?? DEFAULT_STATE.accounts,
      projects: loaded.projects ?? DEFAULT_STATE.projects,
      workflows: loaded.workflows ?? DEFAULT_STATE.workflows,
      prompts: (loaded.prompts ?? DEFAULT_STATE.prompts).filter(p => p && p.id && !p.id.startsWith('tpl_')),
      deletedTemplateIds: loaded.deletedTemplateIds ?? [],
      broadcasts: loaded.broadcasts ?? DEFAULT_STATE.broadcasts,
      optimizations: loaded.optimizations ?? DEFAULT_STATE.optimizations,
      settings: { ...DEFAULT_STATE.settings, ...loaded.settings },
      activeWorkflowRun: null,
      user: loaded.user ?? DEFAULT_STATE.user,
      plan: loaded.plan ?? DEFAULT_STATE.plan,
    };
  });

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }, []);

  // Helper methods
  const addAccount = useCallback((account) => {
    setState(prev => ({ ...prev, accounts: [...prev.accounts, { ...account, id: genId(), createdAt: new Date().toISOString(), broadcastCount: 0, status: 'active' }] }));
  }, [setState]);

  const updateAccount = useCallback((id, updates) => {
    setState(prev => ({ ...prev, accounts: prev.accounts.map(a => a.id === id ? { ...a, ...updates } : a) }));
  }, [setState]);

  const deleteAccount = useCallback((id) => {
    setState(prev => ({ ...prev, accounts: prev.accounts.filter(a => a.id !== id) }));
  }, [setState]);

  const addProject = useCallback((project) => {
    setState(prev => ({ ...prev, projects: [...prev.projects, { ...project, id: genId(), createdAt: new Date().toISOString(), status: 'active' }] }));
  }, [setState]);

  const updateProject = useCallback((id, updates) => {
    setState(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p) }));
  }, [setState]);

  const deleteProject = useCallback((id) => {
    setState(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  }, [setState]);

  const addWorkflow = useCallback((workflow) => {
    setState(prev => ({ ...prev, workflows: [...prev.workflows, { ...workflow, id: genId(), createdAt: new Date().toISOString() }] }));
  }, [setState]);

  const updateWorkflow = useCallback((id, updates) => {
    setState(prev => ({ ...prev, workflows: prev.workflows.map(w => w.id === id ? { ...w, ...updates } : w) }));
  }, [setState]);

  const deleteWorkflow = useCallback((id) => {
    setState(prev => ({ ...prev, workflows: prev.workflows.filter(w => w.id !== id) }));
  }, [setState]);

  const addPrompt = useCallback((prompt) => {
    setState(prev => ({ ...prev, prompts: [...prev.prompts, { ...prompt, id: genId(), createdAt: new Date().toISOString(), useCount: 0 }] }));
  }, [setState]);

  const updatePrompt = useCallback((id, updates) => {
    setState(prev => {
      const exists = prev.prompts.some(p => p.id === id);
      if (exists) {
        return {
          ...prev,
          prompts: prev.prompts.map(p => p.id === id ? { ...p, ...updates } : p)
        };
      } else if (id.startsWith('tpl_')) {
        const tpl = templates.find(t => t.id === id);
        if (tpl) {
          return {
            ...prev,
            prompts: [...prev.prompts, { ...tpl, ...updates }]
          };
        }
      }
      return prev;
    });
  }, [setState, templates]);

  const deletePrompt = useCallback((id) => {
    setState(prev => {
      if (id.startsWith('tpl_')) {
        const deletedIds = prev.deletedTemplateIds || [];
        return {
          ...prev,
          deletedTemplateIds: deletedIds.includes(id) ? deletedIds : [...deletedIds, id],
          prompts: prev.prompts.filter(p => p.id !== id)
        };
      } else {
        return {
          ...prev,
          prompts: prev.prompts.filter(p => p.id !== id)
        };
      }
    });
  }, [setState]);

  const addBroadcast = useCallback((broadcast) => {
    setState(prev => ({
      ...prev,
      broadcasts: [{ ...broadcast, id: genId(), createdAt: new Date().toISOString() }, ...prev.broadcasts],
      accounts: prev.accounts.map(a => {
        if (broadcast.targetIds?.includes(a.id)) {
          return { ...a, broadcastCount: (a.broadcastCount || 0) + 1, lastUsed: new Date().toISOString() };
        }
        return a;
      })
    }));
  }, [setState]);

  const updateSettings = useCallback((updates) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  }, [setState]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bolt-studio-pro-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const combinedPrompts = useMemo(() => {
    const custom = state.prompts || [];
    const deletedIds = state.deletedTemplateIds || [];
    const filteredTemplates = templates.filter(tpl => {
      if (deletedIds.includes(tpl.id)) return false;
      if (custom.some(c => c.id === tpl.id)) return false;
      return true;
    });
    return [...custom, ...filteredTemplates];
  }, [state.prompts, state.deletedTemplateIds, templates]);

  const value = {
    ...state,
    prompts: combinedPrompts,
    templatesLoading,
    setState,
    addAccount, updateAccount, deleteAccount,
    addProject, updateProject, deleteProject,
    addWorkflow, updateWorkflow, deleteWorkflow,
    addPrompt, updatePrompt, deletePrompt,
    addBroadcast, updateSettings, exportData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}
