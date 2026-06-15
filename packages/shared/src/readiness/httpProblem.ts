export interface HttpProblem {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  extensions?: Record<string, unknown>;
}

export function createHttpProblem(input: HttpProblem): HttpProblem {
  return {
    type: input.type,
    title: input.title,
    status: input.status,
    detail: input.detail,
    instance: input.instance,
    extensions: input.extensions
  };
}

export function isHttpProblem(value: unknown): value is HttpProblem {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.type === "string" && typeof record.title === "string" && typeof record.status === "number";
}
