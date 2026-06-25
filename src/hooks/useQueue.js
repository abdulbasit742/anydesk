import { useState, useCallback } from 'react';

/**
 * useQueue
 * FIFO queue backed by React state.
 * All operations are O(n) for simplicity; swap to a linked-list approach for
 * high-throughput cases.
 *
 * @param {Array} initialItems - Starting items (default: [])
 * @returns {{ queue, enqueue, dequeue, peek, size, clear, isEmpty }}
 *
 * @example
 * const { queue, enqueue, dequeue, peek, size, clear, isEmpty } = useQueue([]);
 */
export function useQueue(initialItems = []) {
  const [queue, setQueue] = useState(() => [...initialItems]);

  /** Add one or more items to the back of the queue */
  const enqueue = useCallback((...items) => {
    setQueue((q) => [...q, ...items]);
  }, []);

  /** Remove and return the front item (returns undefined if empty) */
  const dequeue = useCallback(() => {
    let item;
    setQueue((q) => {
      if (q.length === 0) return q;
      const [first, ...rest] = q;
      item = first;
      return rest;
    });
    return item;
  }, []);

  /** Peek at the front item without removing it */
  const peek = useCallback(() => {
    return queue[0];
  }, [queue]);

  /** Remove all items */
  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    enqueue,
    dequeue,
    peek,
    size: queue.length,
    isEmpty: queue.length === 0,
    clear,
  };
}

export default useQueue;
