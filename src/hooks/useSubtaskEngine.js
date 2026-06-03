// useSubtaskEngine.js — Subtask completion ratios, priorities, and milestone targets
import { useState, useCallback, useMemo } from 'react';

const PRIORITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 };

export function useSubtaskEngine(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = useCallback((task) => {
    setTasks(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      status: 'pending',
      priority: 'medium',
      subtasks: [],
      ...task,
      createdAt: Date.now(),
    }]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const addSubtask = useCallback((parentId, subtask) => {
    setTasks(prev => prev.map(t => t.id === parentId ? {
      ...t,
      subtasks: [...(t.subtasks || []), {
        id: Math.random().toString(36).slice(2),
        status: 'pending',
        ...subtask,
      }],
    } : t));
  }, []);

  const metrics = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const completionRate = total ? Math.round((done / total) * 100) : 0;

    const weightedScore = tasks.reduce((acc, t) => {
      const w = PRIORITY_WEIGHT[t.priority] || 1;
      return acc + (t.status === 'done' ? w : 0);
    }, 0);
    const maxScore = tasks.reduce((acc, t) => acc + (PRIORITY_WEIGHT[t.priority] || 1), 0);
    const priorityScore = maxScore ? Math.round((weightedScore / maxScore) * 100) : 0;

    const subtaskRates = tasks.map(t => {
      const sub = t.subtasks || [];
      return { id: t.id, rate: sub.length ? Math.round(sub.filter(s => s.status === 'done').length / sub.length * 100) : null };
    });

    return { total, done, completionRate, priorityScore, subtaskRates };
  }, [tasks]);

  return { tasks, addTask, updateTask, addSubtask, metrics };
}
