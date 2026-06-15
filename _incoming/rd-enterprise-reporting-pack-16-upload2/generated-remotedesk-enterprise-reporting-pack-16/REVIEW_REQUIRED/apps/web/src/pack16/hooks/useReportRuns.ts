import { useEffect, useState } from "react";

export interface useReportRunsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useReportRuns<T>(loader: () => Promise<T>): useReportRunsResult<T> {
  const [state, setState] = useState<useReportRunsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
