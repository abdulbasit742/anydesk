export interface SamlGroupMapping {
  groupName: string;
  orgRole: string;
  departmentPath?: string;
}

export function findSamlGroupMapping(mappings: readonly SamlGroupMapping[], groups: readonly string[]): SamlGroupMapping | undefined {
  const groupSet = new Set(groups.map((group) => group.toLowerCase()));
  return mappings.find((mapping) => groupSet.has(mapping.groupName.toLowerCase()));
}
