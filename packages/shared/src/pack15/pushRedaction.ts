export interface PushMessage { title: string; body: string; data?: Record<string, string>; }
const SECRET_PATTERN = /(password|token|secret|api[_-]?key|clipboard)/i;
export function redactPushMessage(message: PushMessage): PushMessage { const scrub = (value: string) => SECRET_PATTERN.test(value) ? '[redacted]' : value.slice(0, 240); return { title: scrub(message.title), body: scrub(message.body), data: message.data ? Object.fromEntries(Object.entries(message.data).map(([k,v]) => [k, scrub(v)])) : undefined }; }
