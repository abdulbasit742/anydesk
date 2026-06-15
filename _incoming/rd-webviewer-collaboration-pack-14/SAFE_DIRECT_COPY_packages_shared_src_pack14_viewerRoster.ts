export interface ViewerRosterMember {
  userId: string;
  displayName: string;
  role: "host" | "viewer" | "support";
  joinedAt: string;
  permissions: string[];
}

export function sortViewerRoster(members: readonly ViewerRosterMember[]): ViewerRosterMember[] {
  const rank = { host: 0, support: 1, viewer: 2 };
  return [...members].sort((a, b) => rank[a.role] - rank[b.role] || a.displayName.localeCompare(b.displayName));
}
