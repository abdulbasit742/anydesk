export function validateImportJobKind(kind: string): kind is "users" | "devices" | "support_tickets" { return ["users", "devices", "support_tickets"].includes(kind); }
export function importJobCanRun(status: string): boolean { return status === "queued" || status === "validating"; }
