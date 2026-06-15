export interface ChatModerationResult {
  allowed: boolean;
  reasons: string[];
}

export function moderateSessionChatMessage(message: string): ChatModerationResult {
  const reasons: string[] = [];
  if (message.length > 2000) reasons.push("message-too-long");
  if (/\b(password|token|secret|api[_-]?key)\b/i.test(message)) reasons.push("possible-secret");
  return { allowed: reasons.length === 0, reasons };
}
