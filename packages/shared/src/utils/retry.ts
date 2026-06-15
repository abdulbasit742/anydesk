export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  factor?: number;
  maxDelayMs?: number;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean | Promise<boolean>;
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void | Promise<void>;
}

function abortError(): Error {
  const error = new Error("Operation aborted");
  error.name = "AbortError";
  return error;
}

function assertNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw abortError();
}

function wait(delayMs: number, signal?: AbortSignal): Promise<void> {
  assertNotAborted(signal);

  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout>;
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(abortError());
    };

    timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delayMs);

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function retry<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = Math.max(0, Math.trunc(options.retries ?? 3));
  const delayMs = Math.max(0, options.delayMs ?? 250);
  const factor = Math.max(1, options.factor ?? 2);
  const maxDelayMs = Math.max(delayMs, options.maxDelayMs ?? 5000);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    assertNotAborted(options.signal);

    try {
      return await operation();
    } catch (error) {
      if (attempt >= retries) throw error;

      const retryAttempt = attempt + 1;
      const allowed = options.shouldRetry ? await options.shouldRetry(error, retryAttempt) : true;
      if (!allowed) throw error;

      const nextDelay = Math.min(delayMs * factor ** attempt, maxDelayMs);
      await options.onRetry?.(error, retryAttempt, nextDelay);
      await wait(nextDelay, options.signal);
    }
  }

  throw new Error("Retry failed unexpectedly");
}
