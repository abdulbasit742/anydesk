import { useEffect, useState } from "react";

export interface useAccessibilityIssuesResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAccessibilityIssues<T>(loader: () => Promise<T>): useAccessibilityIssuesResult<T> {
  const [state, setState] = useState<useAccessibilityIssuesResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
