export function desktopRoleCanViewEnterpriseSettings(role: string): boolean {
  return ["owner", "admin", "auditor"].includes(role);
}
