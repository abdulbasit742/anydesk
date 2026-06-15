import { useEffect, useState } from "react";

export interface useJiraMappingsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useJiraMappings<T>(loader: () => Promise<T>): useJiraMappingsResult<T> {
  const [state, setState] = useState<useJiraMappingsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
