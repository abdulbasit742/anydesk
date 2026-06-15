const UNSAFE_DEFAULT_PERMISSIONS = new Set(["remote_input", "clipboard_sync"]);

export function sanitizeViewerPermissions(permissions: readonly string[]): string[] {
  return permissions.filter((permission) => !UNSAFE_DEFAULT_PERMISSIONS.has(permission));
}

export function viewerPermissionRequiresHostConsent(permission: string): boolean {
  return ["file_transfer", "remote_input", "clipboard_sync"].includes(permission);
}
