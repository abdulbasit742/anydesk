import { useEffect, useState } from "react";

export interface useOnboardingToursResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useOnboardingTours<T>(loader: () => Promise<T>): useOnboardingToursResult<T> {
  const [state, setState] = useState<useOnboardingToursResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
