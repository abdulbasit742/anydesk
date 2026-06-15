export interface LogRedactionResult {
  text: string;
  redactions: string[];
}

const RULES: Array<{ name: string; pattern: RegExp; replacement: string }> = [
  { name: "authorization-header", pattern: /authorization:\s*bearer\s+[^\s]+/gi, replacement: "authorization: bearer [redacted]" },
  { name: "session-token", pattern: /(sessionToken|accessToken|refreshToken)=([^&\s]+)/gi, replacement: "$1=[redacted]" },
  { name: "email", pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, replacement: "[redacted-email]" },
  { name: "turn-credential", pattern: /(turnCredential|icePassword|credential)\s*[:=]\s*["']?[^\s"',}]+/gi, replacement: "$1=[redacted]" }
];

export function redactOperationalLog(input: string): LogRedactionResult {
  const redactions: string[] = [];
  let text = input;
  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      redactions.push(rule.name);
      rule.pattern.lastIndex = 0;
      text = text.replace(rule.pattern, rule.replacement);
    }
  }
  return { text, redactions };
}
