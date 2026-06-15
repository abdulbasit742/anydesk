import { useEffect, useState } from "react";

export interface useUxExperimentsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useUxExperiments<T>(loader: () => Promise<T>): useUxExperimentsResult<T> {
  const [state, setState] = useState<useUxExperimentsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
