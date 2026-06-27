export const retry = async <T>(fn: () => Promise<T>, maxAttempts: number = 3, delayMs: number = 1000): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try { return await fn(); } catch (error) { if (attempt === maxAttempts) throw error; await new Promise(r => setTimeout(r, delayMs * attempt)); }
  }
  throw new Error("Max retries exceeded");
};
export const exponentialBackoff = (attempt: number, baseDelay: number = 1000, maxDelay: number = 30000): number => Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
