import { useEffect, useState } from "react";

export interface usePaymentReceiptsResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function usePaymentReceipts<T>(loader: () => Promise<T>): usePaymentReceiptsResult<T> {
  const [state, setState] = useState<usePaymentReceiptsResult<T>>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => { if (!cancelled) setState({ loading: false, data }); })
      .catch((error: unknown) => { if (!cancelled) setState({ loading: false, error: error instanceof Error ? error.message : "Unknown error" }); });
    return () => { cancelled = true; };
  }, [loader]);
  return state;
}
