export type ViewerPermission = "view_screen" | "chat" | "annotate" | "file_transfer" | "clipboard_sync" | "remote_input";

export interface ViewerPermissionSet {
  permissions: readonly ViewerPermission[];
}

export function hasViewerPermission(set: ViewerPermissionSet, permission: ViewerPermission): boolean {
  return set.permissions.includes(permission);
}

export function enforceSafeViewerPermissions(set: ViewerPermissionSet): ViewerPermissionSet {
  return {
    permissions: set.permissions.filter((permission) => permission !== "remote_input" && permission !== "clipboard_sync")
  };
}
