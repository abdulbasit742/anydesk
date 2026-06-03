// useTaskScheduler.js — Local timer queues for automation workflows and cool-downs
import { useState, useRef, useCallback } from 'react';

export function useTaskScheduler() {
  const [queue, setQueue] = useState([]);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const queueRef = useRef([]);

  const addTask = useCallback((task) => {
    const item = {
      id: Math.random().toString(36).slice(2),
      ...task,
      status: 'queued',
      addedAt: Date.now(),
    };
    queueRef.current = [...queueRef.current, item];
    setQueue([...queueRef.current]);
    return item.id;
  }, []);

  const processNext = useCallback(async () => {
    const pending = queueRef.current.filter(t => t.status === 'queued');
    if (!pending.length) {
      setRunning(false);
      return;
    }

    const task = pending[0];
    queueRef.current = queueRef.current.map(t =>
      t.id === task.id ? { ...t, status: 'running', startedAt: Date.now() } : t
    );
    setQueue([...queueRef.current]);

    try {
      if (task.delay) await new Promise(r => setTimeout(r, task.delay));
      const result = await Promise.resolve(task.fn());
      queueRef.current = queueRef.current.map(t =>
        t.id === task.id ? { ...t, status: 'done', result, completedAt: Date.now() } : t
      );
      setLog(l => [...l, { taskId: task.id, name: task.name, status: 'done', ts: Date.now() }]);
    } catch (err) {
      queueRef.current = queueRef.current.map(t =>
        t.id === task.id ? { ...t, status: 'error', error: err.message } : t
      );
      setLog(l => [...l, { taskId: task.id, name: task.name, status: 'error', ts: Date.now() }]);
    }

    setQueue([...queueRef.current]);
    processNext();
  }, []);

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    processNext();
  }, [running, processNext]);

  const clear = useCallback(() => {
    queueRef.current = [];
    setQueue([]);
    setLog([]);
    setRunning(false);
  }, []);

  return { queue, running, log, addTask, start, clear };
}
