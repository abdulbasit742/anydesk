export interface ScimPatchOp {
  op: "add" | "replace" | "remove";
  path?: string;
  value?: unknown;
}

export function scimPatchIsAllowed(op: ScimPatchOp): boolean {
  if (op.path && /password|token|secret/i.test(op.path)) return false;
  return ["add", "replace", "remove"].includes(op.op);
}
