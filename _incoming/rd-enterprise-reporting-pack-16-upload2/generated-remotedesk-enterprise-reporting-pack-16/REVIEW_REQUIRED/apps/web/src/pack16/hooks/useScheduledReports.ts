import { useEffect, useState } from "react";

export interface useScheduledReportsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useScheduledReports<T>(loader: () => Promise<T>): useScheduledReportsResult<T> {
  const [state, setState] = useState<useScheduledReportsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
