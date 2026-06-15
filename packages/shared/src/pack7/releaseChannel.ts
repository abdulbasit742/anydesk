export type ReleaseChannel = "stable" | "beta" | "internal";

export function canUseReleaseChannel(userRole: string, requested: ReleaseChannel): boolean {
  if (requested === "stable") return true;
  if (requested === "beta") return ["owner", "admin", "support"].includes(userRole);
  return ["owner", "admin"].includes(userRole);
}
