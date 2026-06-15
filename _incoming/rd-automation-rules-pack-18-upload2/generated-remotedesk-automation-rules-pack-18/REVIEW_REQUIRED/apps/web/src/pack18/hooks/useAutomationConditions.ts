import { useEffect, useState } from "react";

export interface useAutomationConditionsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useAutomationConditions<T>(loader: () => Promise<T>): useAutomationConditionsResult<T> {
  const [state, setState] = useState<useAutomationConditionsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
