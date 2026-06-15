const TOKEN_PATTERNS = [
  /Bearer\s+[A-Za-z0-9._~+\-/]+=*/gi,
  /access[_-]?token\s*[:=]\s*[A-Za-z0-9._~+\-/]+=*/gi,
  /refresh[_-]?token\s*[:=]\s*[A-Za-z0-9._~+\-/]+=*/gi,
  /password\s*[:=]\s*[^\s,;]+/gi,
];

const IPV4_PATTERN = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

export interface RedactionOptions {
  maskIpAddresses?: boolean;
  removeFilePaths?: boolean;
}

export function redactSupportText(input: string, options: RedactionOptions = {}): string {
  let output = input;
  for (const pattern of TOKEN_PATTERNS) {
    output = output.replace(pattern, '[REDACTED_SECRET]');
  }
  if (options.maskIpAddresses !== false) {
    output = output.replace(IPV4_PATTERN, '[REDACTED_IP]');
  }
  if (options.removeFilePaths) {
    output = output.replace(/(?:[A-Za-z]:\\|\/)(?:[^\s:]+[\\/])+([^\s:]+)/g, '[REDACTED_PATH]/$1');
  }
  return output;
}

export function redactJson<T>(value: T, options: RedactionOptions = {}): T {
  return JSON.parse(redactSupportText(JSON.stringify(value), options)) as T;
}
