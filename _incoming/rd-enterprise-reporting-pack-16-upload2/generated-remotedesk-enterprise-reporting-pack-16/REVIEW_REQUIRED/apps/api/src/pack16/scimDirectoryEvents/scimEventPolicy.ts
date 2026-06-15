export function scimEventAllowed(action: string): boolean {
  return ["created", "updated", "deactivated"].includes(action);
}
