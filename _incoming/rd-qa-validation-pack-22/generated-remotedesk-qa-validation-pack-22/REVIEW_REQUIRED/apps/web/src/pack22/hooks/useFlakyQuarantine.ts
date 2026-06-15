import { useEffect, useState } from "react";

export interface useFlakyQuarantineResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useFlakyQuarantine<T>(loader: () => Promise<T>): useFlakyQuarantineResult<T> {
  const [state, setState] = useState<useFlakyQuarantineResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
