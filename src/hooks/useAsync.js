import { useState, useCallback, useRef } from 'react';
export function useAsync(asyncFn) {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  const abortRef = useRef(null);
  const execute  = useCallback(async (...args) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFn(...args, abortRef.current.signal);
      setState({ data, loading: false, error: null });
      return data;
    } catch (e) {
      if (e.name !== 'AbortError') setState({ data: null, loading: false, error: e });
    }
  }, [asyncFn]);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return { ...state, execute, reset };
}
