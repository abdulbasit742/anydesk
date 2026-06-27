export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isDisposableEmail = (email: string): boolean => { const disposable = ["tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com"]; return disposable.some(d => email.endsWith(`@${d}`)); };
export const normalizeEmail = (email: string): string => email.toLowerCase().trim();
